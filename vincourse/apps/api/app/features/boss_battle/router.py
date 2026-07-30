from fastapi import APIRouter

from app.features.common import placeholder_session, placeholder_submit
from app.schemas import GameMode, GameSession, GameSubmitRequest, GameResult

router = APIRouter(tags=["boss-battle"])


@router.get("/session", response_model=GameSession)
def get_session() -> GameSession:
    return placeholder_session(GameMode.boss_battle, "Boss Battle")


@router.post("/submit", response_model=GameResult)
def submit(request: GameSubmitRequest) -> GameResult:
    return placeholder_submit(GameMode.boss_battle, request)

