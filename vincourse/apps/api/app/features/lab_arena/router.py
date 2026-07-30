from fastapi import APIRouter

from app.features.common import placeholder_session, placeholder_submit
from app.schemas import GameMode, GameSession, GameSubmitRequest, GameResult

router = APIRouter(tags=["lab-arena"])


@router.get("/session", response_model=GameSession)
def get_session() -> GameSession:
    return placeholder_session(GameMode.lab_arena, "Lab Arena")


@router.post("/submit", response_model=GameResult)
def submit(request: GameSubmitRequest) -> GameResult:
    return placeholder_submit(GameMode.lab_arena, request)

