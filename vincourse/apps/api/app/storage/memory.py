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


def reset_progress(user_id: str = "demo-user") -> ProgressSummary:
    PROGRESS[user_id] = {"xp": 0, "completed_modes": set()}
    RECOVERY_QUEUE[:] = [item for item in RECOVERY_QUEUE if item.get("user_id") != user_id]
    return get_progress(user_id)


def record_result(user_id: str, request: dict, result: GameResult) -> GameResult:
    progress = PROGRESS.setdefault(user_id, {"xp": 0, "completed_modes": set()})
    progress["xp"] += result.xp
    if result.correct:
        progress["completed_modes"].add(result.mode)
    ATTEMPTS.append({"user_id": user_id, "request": request, "result": result.model_dump()})
    
    if result.recovery_created:
        # Avoid duplicate recovery entries for the same misconception
        existing = any(
            item["user_id"] == user_id and item.get("misconception_id") == result.misconception_id
            for item in RECOVERY_QUEUE
        )
        if not existing:
            RECOVERY_QUEUE.append({
                "user_id": user_id,
                "mode": result.mode,
                "misconception_id": result.misconception_id,
                "feedback": result.feedback,
            })
    elif result.mode == GameMode.error_dungeon and result.correct:
        # Clear resolved misconception from queue
        RECOVERY_QUEUE[:] = [
            item for item in RECOVERY_QUEUE
            if not (item["user_id"] == user_id and item.get("misconception_id") == result.misconception_id)
        ]

    return result


def get_user_recovery_queue(user_id: str) -> list[dict]:
    return [item for item in RECOVERY_QUEUE if item["user_id"] == user_id]
