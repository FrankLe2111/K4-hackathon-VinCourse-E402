from app.core.config import settings
from app.schemas import GameMode, GameResult, GameStatus


def demo_grade(mode: GameMode, answer: str) -> GameResult:
    text = answer.strip().lower()
    if not text:
        return GameResult(
            mode=mode,
            correct=False,
            status=GameStatus.needs_clarification,
            feedback="Please write an answer before submitting.",
            xp=0,
            mastery_delta=0,
            recovery_created=False,
            next_action="Try again with one concrete sentence.",
        )

    correct = any(marker in text for marker in ["scale", "standard", "gradient", "chuẩn", "gradient"])
    return GameResult(
        mode=mode,
        correct=correct,
        status=GameStatus.mastered if correct else GameStatus.misconception,
        feedback="Demo grader accepted the core idea." if correct else "Demo grader did not find the expected concept signal.",
        evidence_ids=["T-DEMO-001"],
        misconception_id="" if correct else "missing_core_concept",
        xp=80 if correct else 0,
        mastery_delta=10 if correct else 0,
        recovery_created=not correct,
        next_action="Continue to the next challenge." if correct else "Open Error Dungeon to repair this mistake.",
    )


def grade_explanation(mode: GameMode, answer: str) -> GameResult:
    if settings.coursequest_demo_mode or not settings.openai_api_key:
        return demo_grade(mode, answer)

    # Keep real OpenAI grading centralized here. Feature modules should call this function,
    # not the OpenAI SDK directly.
    return demo_grade(mode, answer)

