from app.schemas import GameMode, GameResult, ProgressSummary

PROGRESS: dict[str, dict] = {}
ATTEMPTS: list[dict] = []
RECOVERY_QUEUE: list[dict] = []
LIVE_ROOMS: dict[str, dict] = {}


def get_progress(user_id: str) -> ProgressSummary:
    progress = PROGRESS.setdefault(user_id, {"xp": 0, "completed_modes": set()})
    return ProgressSummary(
        user_id=user_id,
        xp=progress["xp"],
        completed_modes=sorted(progress["completed_modes"]),
        recovery_queue_size=len([item for item in RECOVERY_QUEUE if item["user_id"] == user_id]),
    )


def record_result(user_id: str, request: dict, result: GameResult) -> GameResult:
    progress = PROGRESS.setdefault(user_id, {"xp": 0, "completed_modes": set()})
    progress["xp"] += result.xp
    if result.correct:
        progress["completed_modes"].add(result.mode)
    ATTEMPTS.append({"user_id": user_id, "request": request, "result": result.model_dump()})
    if result.recovery_created:
        RECOVERY_QUEUE.append({
            "user_id": user_id,
            "mode": result.mode,
            "misconception_id": result.misconception_id,
            "feedback": result.feedback,
        })
    return result

