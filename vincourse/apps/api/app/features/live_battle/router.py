import json
from threading import RLock
from typing import Literal

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.schemas import GameMode, GameResult, GameSession, GameStatus, GameSubmitRequest
from app.storage.memory import record_result

router = APIRouter(tags=["live-battle"])

COURSE_ID = "ml-foundations"
SESSION_ID = "live-battle-vinc-24"
QUESTION_ID = "live-feature-scaling-01"
EVIDENCE_ID = "T02-014"
QUESTION_CONFIG = {
    "requires_reasoning": True,
    "min_reasoning_length": 20,
}
TEAMS = (
    {"id": "team-gradient", "name": "Team Gradient"},
    {"id": "data-sparks", "name": "Data Sparks"},
    {"id": "vector-crew", "name": "Vector Crew"},
    {"id": "loss-hunters", "name": "Loss Hunters"},
)
INITIAL_DISTRIBUTION = {"A": 0, "B": 0, "C": 0, "D": 0}
INITIAL_SUBMITTED_COUNT = 0
ROOM_STATE = {
    "room_code": "VINC-24",
    "phase": "setup",
    "joined_count": 0,
    "submitted_count": INITIAL_SUBMITTED_COUNT,
    "distribution": INITIAL_DISTRIBUTION.copy(),
}
TEAM_ASSIGNMENTS: dict[str, str] = {}
REWARDED_SUBMISSIONS: dict[tuple[str, str, str], dict] = {}
STATE_LOCK = RLock()


class LiveBattleControlRequest(BaseModel):
    room_code: str
    action: Literal["create", "start", "lock", "reveal", "summary", "restart"]


def _team_by_id(team_id: str) -> dict[str, str]:
    return next(team for team in TEAMS if team["id"] == team_id)


def _assign_team(user_id: str) -> dict[str, str]:
    if user_id in TEAM_ASSIGNMENTS:
        return _team_by_id(TEAM_ASSIGNMENTS[user_id])

    assigned_ids = set(TEAM_ASSIGNMENTS.values())
    team = next((item for item in TEAMS if item["id"] not in assigned_ids), None)
    if team is None:
        raise HTTPException(status_code=409, detail="Live Battle demo room is full.")

    TEAM_ASSIGNMENTS[user_id] = team["id"]
    ROOM_STATE["joined_count"] = len(TEAM_ASSIGNMENTS)
    return team


def reset_live_battle_user(user_id: str) -> None:
    with STATE_LOCK:
        team_id = TEAM_ASSIGNMENTS.get(user_id)
        if not team_id:
            return
        keys = [key for key in REWARDED_SUBMISSIONS if key[0] == team_id]
        for key in keys:
            submission = REWARDED_SUBMISSIONS.pop(key)
            option_id = submission["option_id"]
            ROOM_STATE["submitted_count"] = max(
                INITIAL_SUBMITTED_COUNT,
                ROOM_STATE["submitted_count"] - 1,
            )
            ROOM_STATE["distribution"][option_id] = max(
                INITIAL_DISTRIBUTION[option_id],
                ROOM_STATE["distribution"][option_id] - 1,
            )


@router.get("/session", response_model=GameSession)
def get_session(user_id: str = "demo-user", role: Literal["student", "instructor"] = "student") -> GameSession:
    with STATE_LOCK:
        team = _assign_team(user_id) if role == "student" else None
        submission = None
        if team and ROOM_STATE["phase"] in {"revealed", "summary"}:
            stored = REWARDED_SUBMISSIONS.get((team["id"], SESSION_ID, QUESTION_ID))
            submission = stored["result"] if stored else None

        teams = [
            {
                **item,
                "joined": item["id"] in TEAM_ASSIGNMENTS.values(),
                "submitted": (item["id"], SESSION_ID, QUESTION_ID) in REWARDED_SUBMISSIONS,
            }
            for item in TEAMS
        ]
        payload = {
            **ROOM_STATE,
            "team_id": team["id"] if team else "",
            "team": team["name"] if team else "",
            "teams": teams,
            "question_id": QUESTION_ID,
            **QUESTION_CONFIG,
            "options": [
                {"id": "A", "text": "Tăng lên 10.000 epoch"},
                {"id": "B", "text": "Scale các feature trước khi train"},
                {"id": "C", "text": "Tăng learning rate"},
                {"id": "D", "text": "Xóa feature có miền nhỏ hơn"},
            ],
            "scoring": (
                {"correctness": 50, "explanation": 50}
                if QUESTION_CONFIG["requires_reasoning"]
                else {"correctness": 100}
            ),
            "submission_result": submission,
            "demo": True,
        }

    return GameSession(
        mode=GameMode.live_battle,
        session_id=SESSION_ID,
        title="Live Class Battle",
        prompt=(
            "Một mô hình có feature nằm trong khoảng 0-1 và 1-100.000. "
            "Loss dao động khi gradient descent. Đội nên thử gì đầu tiên?"
        ),
        evidence_ids=[EVIDENCE_ID],
        payload=payload,
    )


@router.post("/control", response_model=GameSession)
def control_session(request: LiveBattleControlRequest) -> GameSession:
    if request.room_code.strip().upper() != ROOM_STATE["room_code"]:
        raise HTTPException(status_code=404, detail="Live Battle room not found.")

    transitions = {
        "create": ("setup", "lobby"),
        "start": ("lobby", "answering"),
        "lock": ("answering", "locked"),
        "reveal": ("locked", "revealed"),
        "summary": ("revealed", "summary"),
        "restart": ("summary", "setup"),
    }
    expected_phase, next_phase = transitions[request.action]
    with STATE_LOCK:
        if ROOM_STATE["phase"] != expected_phase:
            raise HTTPException(
                status_code=409,
                detail=f"Action '{request.action}' requires phase '{expected_phase}'.",
            )
        if request.action == "restart":
            TEAM_ASSIGNMENTS.clear()
            REWARDED_SUBMISSIONS.clear()
            ROOM_STATE["joined_count"] = 0
            ROOM_STATE["submitted_count"] = INITIAL_SUBMITTED_COUNT
            ROOM_STATE["distribution"] = INITIAL_DISTRIBUTION.copy()
        ROOM_STATE["phase"] = next_phase
    return get_session(role="instructor")


def parse_team_answer(
    raw_answer: str,
    *,
    requires_reasoning: bool,
    min_reasoning_length: int,
) -> tuple[str, str]:
    try:
        payload = json.loads(raw_answer)
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=422, detail="Answer must be valid JSON.") from exc

    if not isinstance(payload, dict):
        raise HTTPException(status_code=422, detail="Answer must be a JSON object.")

    option_id = str(payload.get("option_id", "")).strip().upper()
    reasoning = str(payload.get("reasoning", "")).strip()
    if option_id not in {"A", "B", "C", "D"}:
        raise HTTPException(status_code=422, detail="A valid option_id is required.")
    if requires_reasoning and len(reasoning) < min_reasoning_length:
        raise HTTPException(
            status_code=422,
            detail=f"Reasoning must contain at least {min_reasoning_length} characters.",
        )
    return option_id, reasoning


def reasoning_explains_scaling(reasoning: str) -> bool:
    normalized = reasoning.casefold()
    mentions_scale = any(term in normalized for term in ("scale", "chuẩn hóa", "thang đo", "miền"))
    mentions_gradient = any(term in normalized for term in ("gradient", "dao động", "ổn định", "cân bằng"))
    return mentions_scale and mentions_gradient


@router.post("/submit", response_model=GameResult)
def submit(request: GameSubmitRequest) -> GameResult:
    if request.course_id != COURSE_ID:
        raise HTTPException(status_code=422, detail="Course does not belong to this Live Battle.")
    if request.session_id != SESSION_ID:
        raise HTTPException(status_code=404, detail="Live Battle session not found.")
    if request.question_id != QUESTION_ID:
        raise HTTPException(status_code=422, detail="Question does not belong to this session.")
    if not request.room_code or request.room_code.strip().upper() != ROOM_STATE["room_code"]:
        raise HTTPException(status_code=404, detail="Live Battle room not found.")

    with STATE_LOCK:
        assigned_team_id = TEAM_ASSIGNMENTS.get(request.user_id)
        if not assigned_team_id:
            raise HTTPException(status_code=409, detail="Join the Live Battle room before submitting.")
        if not request.team_id or request.team_id != assigned_team_id:
            raise HTTPException(status_code=403, detail="Team does not belong to this browser session.")
        submission_key = (assigned_team_id, request.session_id, request.question_id)
        is_replay_phase = (
            ROOM_STATE["phase"] in {"revealed", "summary"}
            and submission_key in REWARDED_SUBMISSIONS
        )
        if ROOM_STATE["phase"] != "answering" and not is_replay_phase:
            raise HTTPException(status_code=409, detail="Live Battle is not accepting answers.")

    option_id, reasoning = parse_team_answer(request.answer, **QUESTION_CONFIG)
    correct = option_id == "B"
    strong_reasoning = (
        not QUESTION_CONFIG["requires_reasoning"]
        or reasoning_explains_scaling(reasoning)
    )

    if correct and strong_reasoning:
        result = GameResult(
            mode=GameMode.live_battle,
            correct=True,
            status=GameStatus.mastered,
            feedback="Đội chọn đúng và giải thích được vì sao scale giúp gradient cập nhật cân bằng hơn.",
            evidence_ids=[EVIDENCE_ID],
            misconception_id="",
            xp=140,
            mastery_delta=8,
            recovery_created=False,
            next_action="Xem class distribution và tiếp tục pha tiếp theo.",
        )
    elif correct:
        result = GameResult(
            mode=GameMode.live_battle,
            correct=True,
            status=GameStatus.partial,
            feedback="Đáp án đúng, nhưng lập luận chưa nối rõ feature scale với hành vi của gradient.",
            evidence_ids=[EVIDENCE_ID],
            misconception_id="",
            xp=70,
            mastery_delta=3,
            recovery_created=False,
            next_action="Bổ sung cơ chế trước khi nhận đủ explanation evidence.",
        )
    else:
        result = GameResult(
            mode=GameMode.live_battle,
            correct=False,
            status=GameStatus.misconception,
            feedback="Tăng epoch hoặc learning rate không sửa nguyên nhân do feature lệch thang đo.",
            evidence_ids=[EVIDENCE_ID],
            misconception_id="more_epochs_fix_scaling",
            xp=20,
            mastery_delta=0,
            recovery_created=True,
            next_action="Mở Error Dungeon để sửa misconception về Feature Scaling.",
        )

    with STATE_LOCK:
        first_submission = submission_key not in REWARDED_SUBMISSIONS
        if first_submission and ROOM_STATE["phase"] != "answering":
            raise HTTPException(status_code=409, detail="Live Battle is not accepting answers.")
        result.payload.update({
            "first_submission": first_submission,
            "replay": not first_submission,
            "mode_completed": True,
            "team_id": assigned_team_id,
        })

        if first_submission:
            ROOM_STATE["submitted_count"] += 1
            ROOM_STATE["distribution"][option_id] += 1
            recorded_result = record_result(request.user_id, request.model_dump(), result)
            REWARDED_SUBMISSIONS[submission_key] = {
                "user_id": request.user_id,
                "option_id": option_id,
                "result": recorded_result.model_dump(mode="json"),
            }
            return recorded_result

    # Replay is feedback-only: it must not alter XP, mastery, completion, or recovery.
    result.payload["recovery_unchanged"] = True
    result.recovery_created = False
    result.xp = 0
    result.mastery_delta = 0
    result.next_action = "Lần chơi lại chỉ để luyện tập; progress và recovery không thay đổi."
    return result
