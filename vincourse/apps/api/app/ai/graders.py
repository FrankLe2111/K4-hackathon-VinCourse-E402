import subprocess
import sys
from pathlib import Path
from tempfile import TemporaryDirectory

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

    correct = any(marker in text for marker in ["scale", "standard", "gradient", "chuẩn"])
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


def _is_dangerous_code(code: str) -> bool:
    blocked_terms = [
        "import os",
        "import sys",
        "import subprocess",
        "import socket",
        "open(",
        "__import__",
        "eval(",
        "exec(",
        "compile(",
        "requests",
        "urllib",
        "os.",
        "sys.",
        "subprocess.",
    ]
    normalized = code.lower()
    return any(term in normalized for term in blocked_terms)


def _build_lab_arena_challenge() -> dict[str, str]:
    starter_code = '''def standardize(X):
    """Standardize each feature column in X.

    X is a list of rows, where each row is a list of numbers.
    Return a new list with the same shape.
    """
    raise NotImplementedError("Write your code here")
'''

    test_code = '''
X = [[1.0, 2.0], [3.0, 4.0], [5.0, 6.0]]
result = standardize(X)
assert isinstance(result, list), "Result must be a list of rows"
assert len(result) == 3, "Output shape must preserve row count"
assert all(len(row) == 2 for row in result), "Output shape must preserve column count"

columns = list(zip(*result))
means = [sum(col) / len(col) for col in columns]
variances = [sum((x - mean) ** 2 for x in col) / len(col) for col, mean in zip(columns, means)]
stds = [variance**0.5 for variance in variances]
assert all(abs(mean) < 1e-6 for mean in means), f"Means must be near zero: {means}"
assert all(abs(std - 1) < 1e-6 for std in stds), f"Standard deviations must be near one: {stds}"
'''

    return {
        "lab_id": "standardize-features",
        "language": "python",
        "starter_code": starter_code,
        "visible_tests": [
            "Preserve the input shape",
            "Column means are near zero",
            "Column standard deviations are near one",
        ],
        "concept_ids": ["feature-scaling", "gradient-descent"],
        "prompt": "Implement standardize(X) so each feature column in X has mean 0 and standard deviation 1.",
        "test_code": test_code,
    }


def grade_lab_arena(mode: GameMode, code: str, session_id: str) -> GameResult:
    if not code.strip():
        return GameResult(
            mode=mode,
            correct=False,
            status=GameStatus.needs_clarification,
            feedback="Please write your code before running tests.",
            xp=0,
            mastery_delta=0,
            recovery_created=False,
            next_action="Implement the function and try again.",
        )

    if _is_dangerous_code(code):
        return GameResult(
            mode=mode,
            correct=False,
            status=GameStatus.out_of_scope,
            feedback="Your code contains restricted operations. Use only pure Python list and math operations.",
            xp=0,
            mastery_delta=0,
            recovery_created=False,
            next_action="Remove file, network, and system access calls from your code.",
        )

    challenge = _build_lab_arena_challenge()
    full_code = code + "\n\n" + challenge["test_code"]

    with TemporaryDirectory() as tmpdir:
        path = Path(tmpdir) / "submission.py"
        path.write_text(full_code, encoding="utf-8")
        try:
            subprocess.run(
                [sys.executable, str(path)],
                capture_output=True,
                text=True,
                timeout=5,
                check=True,
            )
            return GameResult(
                mode=mode,
                correct=True,
                status=GameStatus.mastered,
                feedback="All visible tests passed. Your code correctly standardizes the input.",
                evidence_ids=["T-LABSTANDARD-001"],
                xp=120,
                mastery_delta=15,
                recovery_created=False,
                next_action="Great work! Try the next Lab Arena challenge.",
            )
        except subprocess.CalledProcessError as exc:
            feedback = exc.stderr.strip() or exc.stdout.strip() or "Your code did not pass the visible tests."
            return GameResult(
                mode=mode,
                correct=False,
                status=GameStatus.partial,
                feedback=f"Visible tests failed: {feedback}",
                xp=20,
                mastery_delta=0,
                recovery_created=True,
                next_action="Fix the failing assertions and run the tests again.",
            )
        except subprocess.TimeoutExpired:
            return GameResult(
                mode=mode,
                correct=False,
                status=GameStatus.partial,
                feedback="Your code timed out. Make sure your function completes quickly.",
                xp=0,
                mastery_delta=0,
                recovery_created=True,
                next_action="Simplify the implementation and try again.",
            )


def grade_explanation(mode: GameMode, answer: str) -> GameResult:
    if settings.coursequest_demo_mode or not settings.openai_api_key:
        return demo_grade(mode, answer)

    # Keep real OpenAI grading centralized here. Feature modules should call this function,
    # not the OpenAI SDK directly.
    return demo_grade(mode, answer)

