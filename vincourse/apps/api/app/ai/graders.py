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
    starter_code = '''def count_character(text, target):
    """Count target in text without depending on letter case.

    Example: count_character("Strawberry", "r") returns 3.
    """
    # Hoàn thiện hàm bằng Python thuần.
    if not isinstance(text, str) or not isinstance(target, str) or target == "":
        return 0
    return text.lower().count(target.lower())
'''

    test_code = '''
assert count_character("strawberry", "r") == 3, "Phải đếm đúng chữ r trong strawberry"
assert count_character("VinCourse", "c") == 1, "Phải không phân biệt chữ hoa/chữ thường"
assert count_character("AI Odyssey", "z") == 0, "Ký tự không xuất hiện phải trả về 0"
assert count_character("", "a") == 0, "Chuỗi rỗng phải trả về 0"
'''

    return {
        "lab_id": "deterministic-character-tool",
        "language": "python",
        "starter_code": starter_code,
        "visible_tests": [
            'count_character("strawberry", "r") == 3',
            "Không phân biệt chữ hoa/chữ thường",
            "Ký tự không tồn tại trả về 0",
            "Xử lý được chuỗi rỗng",
        ],
        "concept_ids": ["tool-calling", "deterministic-function", "llm-limitations"],
        "prompt": (
            "Hoàn thiện count_character(text, target) để biến một phép đếm cần độ "
            "chính xác thành hàm Python xác định, thay vì yêu cầu LLM tự suy đoán."
        ),
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
                feedback="Tất cả test đã đạt. Bạn đã tách tác vụ cần độ chắc chắn thành một hàm Python xác định.",
                evidence_ids=["T03-078", "T03-079"],
                xp=120,
                mastery_delta=15,
                recovery_created=False,
                next_action="Tốt lắm! Tiếp theo, hãy thử nối hàm này vào một luồng tool calling.",
            )
        except subprocess.CalledProcessError as exc:
            feedback = exc.stderr.strip() or exc.stdout.strip() or "Your code did not pass the visible tests."
            return GameResult(
                mode=mode,
                correct=False,
                status=GameStatus.partial,
                feedback=f"Test chưa đạt: {feedback}",
                xp=20,
                mastery_delta=0,
                recovery_created=True,
                next_action="Sửa test đang lỗi rồi chạy lại.",
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
