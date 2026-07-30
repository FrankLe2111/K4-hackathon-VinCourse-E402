import json
import re
from functools import lru_cache
from pathlib import Path
from typing import Any

from fastapi import APIRouter, HTTPException

from app.schemas import GameMode, GameResult, GameSession, GameStatus, GameSubmitRequest
from app.storage.memory import record_result

router = APIRouter(tags=["story-quest"])

QUESTION_BANK = Path(__file__).resolve().parents[6] / "ai_odyssey_question_bank_vi.md"


def field(block: str, name: str) -> str:
    match = re.search(rf"\*\*{re.escape(name)}:\*\*\s*(.+)", block)
    return match.group(1).strip().strip("`") if match else ""


def bullet_section(block: str, heading: str) -> list[str]:
    match = re.search(rf"\*\*{re.escape(heading)}\*\*(.*?)(?=\n\s*\*\*|\Z)", block, re.S)
    return [re.sub(r"^\s*-\s*", "", line).strip() for line in match.group(1).splitlines()
            if re.match(r"^\s*-\s*", line)] if match else []


@lru_cache
def load_story_bank() -> tuple[list[dict[str, Any]], dict[str, dict[str, Any]]]:
    text = QUESTION_BANK.read_text(encoding="utf-8")
    zones: list[dict[str, Any]] = []
    secrets: dict[str, dict[str, Any]] = {}
    for zone_number, zone_match in enumerate(re.finditer(r"(?ms)^## (?!Tổng quan|Quy tắc)(.+?)\n(.*?)(?=^## |\Z)", text)):
        zone_name, zone_body = zone_match.groups()
        zone_id = "prologue" if zone_number == 0 else "final" if zone_name.startswith("Final Zone") else f"zone{zone_number}"
        questions = []
        for question_match in re.finditer(r"(?ms)^#### `([^`]+)`[^\n]*\n(.*?)(?=^#### |\Z)", zone_body):
            question_id, block = question_match.groups()
            question_type = "quiz" if "_quiz_" in question_id else "code"
            item: dict[str, Any] = {
                "id": question_id,
                "type": question_type,
                "concept_id": field(block, "Concept ID"),
                "xp": int(field(block, "Base XP") or 0),
                "context": field(block, "Bối cảnh"),
            }
            secret: dict[str, Any] = {"type": question_type, "xp": item["xp"]}
            if question_type == "quiz":
                item.update({"difficulty": field(block, "Độ khó"), "prompt": field(block, "Câu hỏi"),
                             "hint": field(block, "Gợi ý"), "options": []})
                option_secrets = {}
                for line in block.splitlines():
                    parts = [part.strip() for part in line.strip().strip("|").split("|")]
                    if len(parts) < 5 or parts[0] not in {"A", "B", "C", "D"}:
                        continue
                    item["options"].append({"id": parts[0], "text": parts[1]})
                    option_secrets[parts[0]] = {
                        "misconception_id": parts[3].strip("`"),
                        "feedback": " ".join(part for part in parts[4:] if part not in {"", "—"}),
                    }
                secret.update({"answer": field(block, "Đáp án đúng"), "explanation": field(block, "Giải thích"),
                               "options": option_secrets})
            else:
                starter = re.search(r"\*\*Starter code\*\*.*?```python\s*\n(.*?)```", block, re.S)
                accepted_line = re.search(r"\*\*Accepted answers theo thứ tự blank:\*\*\s*(.+)", block)
                accepted = re.findall(r"`([^`]*)`", accepted_line.group(1)) if accepted_line else []
                starter_code = starter.group(1).strip() if starter else ""
                item.update({
                    "task": field(block, "Nhiệm vụ"),
                    "starter_code": starter_code,
                    "blank_count": max([int(number) for number in re.findall(r"___(\d+)___", starter_code)], default=0),
                    "visible_tests": bullet_section(block, "Visible tests"),
                    "hints": [field(block, "Hint 1"), field(block, "Hint 2")],
                })
                secret["answers"] = [accepted] if item["blank_count"] == 1 else [[answer] for answer in accepted]
            questions.append(item)
            secrets[question_id] = secret
        if questions:
            zones.append({"id": zone_id, "name": zone_name, "questions": questions})
    return zones, secrets


def grade_story(request: GameSubmitRequest) -> GameResult:
    _, secrets = load_story_bank()
    question = secrets.get(request.question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found.")

    if question["type"] == "quiz":
        answer = request.answer.strip()
        if answer not in {"A", "B", "C", "D"}:
            raise HTTPException(status_code=400, detail="Quiz cần một đáp án A, B, C hoặc D.")
        correct = answer == question["answer"]
        selected = question["options"].get(answer, {})
        feedback = question["explanation"] if correct else selected.get("feedback", "Hãy xem gợi ý và thử lại.")
        misconception_id = "" if correct else selected.get("misconception_id", "")
        recovery_created = not correct
    else:
        try:
            answer = json.loads(request.answer)
        except json.JSONDecodeError as error:
            raise HTTPException(status_code=400, detail="Code answer phải là JSON array.") from error
        if not isinstance(answer, list) or len(answer) != len(question["answers"]) or not all(isinstance(item, str) for item in answer):
            raise HTTPException(status_code=400, detail="Hãy điền đủ các chỗ trống của bài code.")
        normalize = lambda value: re.sub(r"\s+", "", value).strip("()")
        correct = all(any(normalize(given) == normalize(expected) for expected in accepted)
                      for given, accepted in zip(answer, question["answers"]))
        feedback = "Các token đã khớp yêu cầu logic và visible tests." if correct else "Logic chưa đúng; dùng gợi ý rồi thử lại."
        misconception_id = "" if correct else "code-logic"
        recovery_created = not correct

    xp = question["xp"] if correct else 0
    return GameResult(
        mode=GameMode.story,
        correct=correct,
        status=GameStatus.mastered if correct else GameStatus.misconception,
        feedback=feedback,
        evidence_ids=[request.question_id],
        misconception_id=misconception_id,
        xp=xp,
        mastery_delta=10 if correct else 0,
        recovery_created=recovery_created,
        next_action="Tiếp tục checkpoint tiếp theo." if correct else "Câu sai đã được lưu để làm lại trong Error Dungeon.",
    )


@router.get("/session", response_model=GameSession)
def get_session() -> GameSession:
    zones, _ = load_story_bank()
    return GameSession(
        mode=GameMode.story,
        session_id="story-quest-bank",
        title="Story Quest",
        prompt="Vượt qua từng zone AI Odyssey. Sai vẫn được đi tiếp; cần đạt 80% mỗi zone để mở khóa vòng sau.",
        evidence_ids=[],
        payload={"zones": zones, "pass_rate": 0.8},
    )


@router.post("/submit", response_model=GameResult)
def submit(request: GameSubmitRequest) -> GameResult:
    return record_result(request.user_id, request.model_dump(), grade_story(request))
