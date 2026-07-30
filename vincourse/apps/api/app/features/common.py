from app.ai.graders import grade_explanation
from app.schemas import GameMode, GameSession, GameSubmitRequest, GameResult
from app.storage.memory import record_result


def placeholder_session(mode: GameMode, title: str) -> GameSession:
    return GameSession(
        mode=mode,
        session_id=f"{mode}-demo-session",
        title=title,
        prompt="Explain why feature scaling can matter for gradient descent.",
        evidence_ids=["T-DEMO-001"],
        payload={"locked": False, "demo": True},
    )


def placeholder_submit(mode: GameMode, request: GameSubmitRequest) -> GameResult:
    result = grade_explanation(mode, request.answer)
    return record_result(request.user_id, request.model_dump(), result)

