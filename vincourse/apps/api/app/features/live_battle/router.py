import json

from fastapi import APIRouter, HTTPException

from app.schemas import GameMode, GameResult, GameSession, GameStatus, GameSubmitRequest
from app.storage.memory import record_result

router = APIRouter(tags=["live-battle"])

SESSION_ID = "live-battle-vinc-24"
QUESTION_ID = "live-feature-scaling-01"
EVIDENCE_ID = "T02-014"
QUESTION_CONFIG = {
    "requires_reasoning": True,
    "min_reasoning_length": 20,
}
INITIAL_DISTRIBUTION = {"A": 4, "B": 3, "C": 1, "D": 1}
INITIAL_SUBMITTED_COUNT = 9
ROOM_STATE = {
    "room_code": "VINC-24",
    "team": "Team Gradient",
    "joined_count": 18,
    "submitted_count": INITIAL_SUBMITTED_COUNT,
    "distribution": INITIAL_DISTRIBUTION.copy(),
}
REWARDED_SUBMISSIONS: dict[tuple[str, str, str], tuple[str, bool]] = {}


def reset_live_battle_user(user_id: str) -> None:
    keys = [key for key in REWARDED_SUBMISSIONS if key[0] == user_id]
    for key in keys:
        option_id, counted_in_room = REWARDED_SUBMISSIONS.pop(key)
        if not counted_in_room:
            continue
        ROOM_STATE["submitted_count"] = max(
            INITIAL_SUBMITTED_COUNT,
            ROOM_STATE["submitted_count"] - 1,
        )
        ROOM_STATE["distribution"][option_id] = max(
            INITIAL_DISTRIBUTION[option_id],
            ROOM_STATE["distribution"][option_id] - 1,
        )


@router.get("/session", response_model=GameSession)
def get_session() -> GameSession:
    return GameSession(
        mode=GameMode.live_battle,
        session_id=SESSION_ID,
        title="Live Class Battle",
        prompt=(
            "Một mô hình có feature nằm trong khoảng 0-1 và 1-100.000. "
            "Loss dao động khi gradient descent. Đội nên thử gì đầu tiên?"
        ),
        evidence_ids=[EVIDENCE_ID],
        payload={
            **ROOM_STATE,
            "phase": "answering",
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
            "demo": True,
        },
    )


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
    if request.session_id != SESSION_ID:
        raise HTTPException(status_code=404, detail="Live Battle session not found.")
    if request.question_id != QUESTION_ID:
        raise HTTPException(status_code=422, detail="Question does not belong to this session.")

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

    submission_key = (request.user_id, request.session_id, request.question_id)
    first_submission = submission_key not in REWARDED_SUBMISSIONS
    result.payload.update({
        "first_submission": first_submission,
        "replay": not first_submission,
        "mode_completed": True,
    })

    if first_submission:
        counted_in_room = ROOM_STATE["submitted_count"] < ROOM_STATE["joined_count"]
        REWARDED_SUBMISSIONS[submission_key] = (option_id, counted_in_room)
        if counted_in_room:
            ROOM_STATE["submitted_count"] += 1
            ROOM_STATE["distribution"][option_id] += 1
        return record_result(request.user_id, request.model_dump(), result)

    # Replay is feedback-only: it must not alter XP, mastery, completion, or recovery.
    result.payload["recovery_unchanged"] = True
    result.recovery_created = False
    result.xp = 0
    result.mastery_delta = 0
    result.next_action = "Lần chơi lại chỉ để luyện tập; progress và recovery không thay đổi."
    return result
