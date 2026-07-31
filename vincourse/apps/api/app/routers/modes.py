from fastapi import APIRouter

from app.core.config import settings
from app.schemas import GameMode, ModeInfo

router = APIRouter(tags=["base"])


MODES = [
    ModeInfo(mode=GameMode.story, title="Story Quest", owner="ThanhToan", description="Hành trình học theo cốt truyện & tình huống thực tế.", ready=True),
    ModeInfo(mode=GameMode.daily_recall, title="Daily Recall", owner="Nguyen Duc Hung", description="Ôn tập ngắt quãng để ghi nhớ lâu dài."),
    ModeInfo(mode=GameMode.error_dungeon, title="Error Dungeon", owner="Nguyen Duc Hung", description="Chinh phục & khắc phục triệt để các câu làm sai."),
    ModeInfo(mode=GameMode.lab_arena, title="Lab Arena", owner="Huyen", description="Thực hành lập trình Python & vận dụng code."),
    ModeInfo(mode=GameMode.boss_battle, title="Boss Battle", owner="Trung Quan", description="Đại chiến hạ gục Boss cùng cả lớp."),
    ModeInfo(mode=GameMode.live_battle, title="Live Class Battle", owner="Ngo Minh Phuoc", description="Thi đấu đồng đội trực tiếp thời gian thực."),
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

