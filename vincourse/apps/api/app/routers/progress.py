from fastapi import APIRouter
from app.schemas import ProgressSummary
from app.storage.memory import get_progress, reset_progress

router = APIRouter(tags=["progress"])


@router.get("/progress", response_model=ProgressSummary)
def progress(user_id: str = "demo-user") -> ProgressSummary:
    return get_progress(user_id)


@router.post("/reset", response_model=ProgressSummary)
@router.get("/reset", response_model=ProgressSummary)
def reset(user_id: str = "demo-user") -> ProgressSummary:
    # Local import avoids coupling the shared storage module back to a feature router.
    from app.features.live_battle.router import reset_live_battle_user

    reset_live_battle_user(user_id)
    return reset_progress(user_id)
