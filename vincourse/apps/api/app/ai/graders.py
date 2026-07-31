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


def _build_lab_arena_challenge() -> dict[str, object]:
    starter_code = '''from typing import List


def schedule_tools(
    n: int,
    dependencies: List[List[int]]
) -> List[List[int]]:
    # Write your code here
    pass
'''

    test_code = '''
assert schedule_tools(
    6,
    [[0, 2], [1, 2], [1, 3], [2, 4], [3, 4], [4, 5]],
) == [[0, 1], [2, 3], [4], [5]]

assert schedule_tools(3, [[0, 1], [1, 2], [2, 0]]) == []
assert schedule_tools(4, []) == [[0, 1, 2, 3]]
assert schedule_tools(5, [[0, 4], [1, 4], [2, 4], [3, 4]]) == [[0, 1, 2, 3], [4]]
assert schedule_tools(1, []) == [[0]]
'''

    return {
        "lab_id": "schedule-tool-calls",
        "title": "Schedule Tool Calls",
        "difficulty": "Medium",
        "language": "python",
        "starter_code": starter_code,
        "visible_tests": [
            "Example 1: parallel rounds with dependencies",
            "Example 2: dependency cycle returns []",
            "Example 3: no dependencies runs all tools together",
            "Fan-in dependencies unlock final tool in round 2",
            "Single tool runs in one round",
        ],
        "concept_ids": ["graph", "topological-sort", "tool-calling", "parallel-execution"],
        "prompt": "Implement schedule_tools(n, dependencies) to create the minimum-round execution schedule for dependent AI agent tools.",
        "test_code": test_code,
        "function_name": "schedule_tools",
        "constraints": [
            "1 <= n <= 100000",
            "0 <= dependencies.length <= 200000",
            "dependencies[i] = [a, b] means tool a must finish before tool b starts",
            "Tools in the same round must be sorted increasingly",
            "Return [] if a dependency cycle exists",
        ],
    }


def _friendly_lab_feedback(output: str) -> str:
    if "NotImplementedError" in output or "Write your code here" in output:
        return "Bạn chưa viết phần xử lý chính. Hãy thay dòng placeholder bằng thuật toán của bạn rồi chạy lại nhé."
    if "NameError" in output and "schedule_tools" in output:
        return "Hệ thống chưa tìm thấy hàm schedule_tools. Hãy giữ đúng tên hàm trong đề bài."
    if "AssertionError" in output:
        return "Một vài test case chưa khớp. Hãy kiểm tra lại thứ tự round, xử lý cycle, và đảm bảo tool mới mở khóa chỉ chạy ở vòng tiếp theo."
    return "Bài làm chưa qua visible tests. Hãy xem lại logic rồi thử chạy lại nhé."


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
                feedback="All visible tests passed. Your scheduler produces minimum-round parallel tool execution.",
                evidence_ids=["D04-LAB-SCHEDULE"],
                xp=120,
                mastery_delta=15,
                recovery_created=False,
                next_action="Great work! You used graph dependencies like a real tool-calling scheduler.",
            )
        except subprocess.CalledProcessError as exc:
            output = exc.stderr.strip() or exc.stdout.strip()
            return GameResult(
                mode=mode,
                correct=False,
                status=GameStatus.partial,
                feedback=_friendly_lab_feedback(output),
                xp=20,
                mastery_delta=0,
                recovery_created=True,
                next_action="Gợi ý: dùng graph + indegree, mỗi lượt gom toàn bộ tool có indegree bằng 0.",
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
