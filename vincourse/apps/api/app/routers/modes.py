from fastapi import APIRouter

from app.core.config import settings
from app.schemas import GameMode, ModeInfo

router = APIRouter(tags=["base"])


MODES = [
    ModeInfo(mode=GameMode.story, title="Story Quest", owner="ThanhToan", description="Main story missions.", ready=True),
    ModeInfo(mode=GameMode.daily_recall, title="Daily Recall", owner="Nguyen Duc Hung", description="Spaced recall session."),
    ModeInfo(mode=GameMode.error_dungeon, title="Error Dungeon", owner="Nguyen Duc Hung", description="Repair past mistakes."),
    ModeInfo(mode=GameMode.lab_arena, title="Lab Arena", owner="Huyen", description="Apply concepts in code."),
    ModeInfo(mode=GameMode.boss_battle, title="Boss Battle", owner="Trung Quan", description="Multi-concept transfer challenge."),
    ModeInfo(mode=GameMode.live_battle, title="Live Class Battle", owner="Ngo Minh Phuoc", description="Classroom team challenge."),
]


@router.get("/health")
def health() -> dict:
    return {
        "ok": True,
        "demo_mode": settings.coursequest_demo_mode,
        "model": settings.openai_model,
        "openai_configured": bool(settings.openai_api_key),
    }


@router.get("/modes", response_model=list[ModeInfo])
def list_modes() -> list[ModeInfo]:
    return MODES

