from fastapi import APIRouter

from app.ai.graders import grade_lab_arena, _build_lab_arena_challenge
from app.schemas import GameMode, GameSession, GameSubmitRequest, GameResult
from app.storage.memory import record_result

router = APIRouter(tags=["lab-arena"])


def _lab_arena_session() -> GameSession:
    challenge = _build_lab_arena_challenge()
    return GameSession(
        mode=GameMode.lab_arena,
        session_id="lab-standardize-001",
        title="Lab Arena: Standardize Features",
        prompt=challenge["prompt"],
        evidence_ids=["T-LABSTANDARD-001"],
        payload={
            "lab_id": challenge["lab_id"],
            "language": challenge["language"],
            "starter_code": challenge["starter_code"],
            "visible_tests": challenge["visible_tests"],
            "concept_ids": challenge["concept_ids"],
        },
    )


@router.get("/session", response_model=GameSession)
def get_session() -> GameSession:
    return _lab_arena_session()


@router.post("/submit", response_model=GameResult)
def submit(request: GameSubmitRequest) -> GameResult:
    result = grade_lab_arena(GameMode.lab_arena, request.answer, request.session_id)
    return record_result(request.user_id, request.model_dump(), result)

