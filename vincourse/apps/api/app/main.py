from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.features.boss_battle.router import router as boss_battle_router
from app.features.daily_recall.router import router as daily_recall_router
from app.features.error_dungeon.router import router as error_dungeon_router
from app.features.lab_arena.router import router as lab_arena_router
from app.features.live_battle.router import router as live_battle_router
from app.features.story_quest.router import router as story_quest_router
from app.routers import modes, progress


def create_app() -> FastAPI:
    app = FastAPI(title="VinCourse API", version="0.1.0")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(modes.router, prefix="/api")
    app.include_router(progress.router, prefix="/api")
    app.include_router(story_quest_router, prefix="/api/modes/story")
    app.include_router(daily_recall_router, prefix="/api/modes/daily_recall")
    app.include_router(error_dungeon_router, prefix="/api/modes/error_dungeon")
    app.include_router(lab_arena_router, prefix="/api/modes/lab_arena")
    app.include_router(boss_battle_router, prefix="/api/modes/boss_battle")
    app.include_router(live_battle_router, prefix="/api/modes/live_battle")
    return app


app = create_app()

