from fastapi import APIRouter

from app.schemas import GameMode, GameSession, GameSubmitRequest, GameResult, GameStatus
from app.storage.memory import record_result

router = APIRouter(tags=["boss-battle"])


def _boss_session() -> GameSession:
    return GameSession(
        mode=GameMode.boss_battle,
        session_id="boss-class-raid-001",
        title="Boss Battle: Class Raid",
        prompt="Work as a class. If at least 80% of active teams answer correctly in the same round, the class unlocks one attack on the boss.",
        evidence_ids=["BOSS-TEAM-80-001"],
        payload={
            "boss_id": "broken-model-boss",
            "boss_name": "The Broken Model",
            "attack_threshold": 80,
            "attack_damage": 25,
            "boss_hp": 100,
            "round_time_seconds": 60,
            "core_rule": "At least 80% of active teams must answer correctly in the same round to attack the boss.",
            "rules": [
                "Teams answer independently during the round timer.",
                "The class correct rate is correct teams divided by active teams.",
                "If the class correct rate is at least 80%, the boss takes damage.",
                "If the class correct rate is below 80%, wrong teams receive recovery hints.",
                "When boss HP reaches 0, the class wins and unlocks the next zone.",
            ],
            "teams": [
                {"name": "Team Gradient", "correct": True},
                {"name": "Team Dataset", "correct": True},
                {"name": "Team Metric", "correct": True},
                {"name": "Team Prompt", "correct": True},
                {"name": "Team Debug", "correct": False},
            ],
            "phases": ["Diagnose", "Choose fix", "Explain", "Transfer", "Final strike"],
            "rewards": ["+250 XP", "Boss badge", "Next zone unlocked"],
        },
    )


@router.get("/session", response_model=GameSession)
def get_session() -> GameSession:
    return _boss_session()


@router.post("/submit", response_model=GameResult)
def submit(request: GameSubmitRequest) -> GameResult:
    correct = "attack" in request.answer.lower() or "80" in request.answer
    result = GameResult(
        mode=GameMode.boss_battle,
        correct=correct,
        status=GameStatus.mastered if correct else GameStatus.partial,
        feedback="Class attack unlocked! At least 80% of teams answered correctly." if correct else "Not enough teams answered correctly yet. Rally the class and try the round again.",
        evidence_ids=["BOSS-TEAM-80-001"],
        xp=250 if correct else 30,
        mastery_delta=20 if correct else 0,
        recovery_created=not correct,
        next_action="Boss takes damage. Continue until HP reaches 0." if correct else "Review the misconception summary before the next round.",
    )
    return record_result(request.user_id, request.model_dump(), result)
