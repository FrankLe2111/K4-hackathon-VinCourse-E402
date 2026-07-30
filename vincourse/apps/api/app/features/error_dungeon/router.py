from fastapi import APIRouter

from app.features.common import placeholder_session, placeholder_submit
from app.schemas import GameMode, GameSession, GameSubmitRequest, GameResult

router = APIRouter(tags=["error-dungeon"])


@router.get("/session", response_model=GameSession)
def get_session() -> GameSession:
    return placeholder_session(GameMode.error_dungeon, "Error Dungeon")


@router.post("/submit", response_model=GameResult)
def submit(request: GameSubmitRequest) -> GameResult:
    return placeholder_submit(GameMode.error_dungeon, request)

