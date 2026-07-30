from fastapi import APIRouter

from app.schemas import ProgressSummary
from app.storage.memory import get_progress

router = APIRouter(tags=["progress"])


@router.get("/progress", response_model=ProgressSummary)
def progress(user_id: str = "demo-user") -> ProgressSummary:
    return get_progress(user_id)

