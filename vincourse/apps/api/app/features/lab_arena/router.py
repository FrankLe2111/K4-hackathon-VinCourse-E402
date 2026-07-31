import json
import os
import re
import subprocess
import sys
import uuid
from pathlib import Path
from tempfile import TemporaryDirectory

from fastapi import APIRouter, HTTPException, Query

from app.ai.tutor import lab_code_hint
from app.schemas import GameMode, GameResult, GameSession, GameStatus, GameSubmitRequest
from app.storage.memory import record_result

router = APIRouter(tags=["lab-arena"])
DATA_DIRECTORY = Path(__file__).resolve().parents[6] / "data/vlearn-pack/lab-arena"


def _load_challenges() -> list[dict]:
    challenges = [
        json.loads(path.read_text(encoding="utf-8"))
        for path in DATA_DIRECTORY.glob("*.json")
    ]
    challenges.sort(key=lambda item: item["order"])
    if len(challenges) != 10 or [item["order"] for item in challenges] != list(range(1, 11)):
        raise RuntimeError("Lab Arena cần đúng 10 bài có order từ 1 đến 10.")
    return challenges


CHALLENGES = _load_challenges()
SESSIONS: dict[str, dict] = {}


def _public_tests(challenge: dict) -> list[dict]:
    tests = []
    for index, item in enumerate(challenge["tests"], start=1):
        tests.append({
            **item,
            "id": f"{challenge['id']}-test-{index}",
            "label": f"{challenge['function_name']} · {item['note']}",
        })
    return tests


@router.get("/session", response_model=GameSession)
def get_session(round: int = Query(default=1, ge=1, le=10)) -> GameSession:
    challenge = CHALLENGES[round - 1]
    session_id = uuid.uuid4().hex[:12]
    tests = _public_tests(challenge)
    SESSIONS[session_id] = {"challenge": challenge, "tests": tests, "round": round}
    if len(SESSIONS) > 200:
        SESSIONS.pop(next(iter(SESSIONS)))
    return GameSession(
        mode=GameMode.lab_arena,
        session_id=session_id,
        title=challenge["title"],
        prompt=challenge["prompt"],
        evidence_ids=[item["id"] for item in challenge["evidence"]],
        payload={
            "challenge_id": challenge["id"],
            "order": challenge["order"],
            "topic": challenge["topic"],
            "difficulty": challenge["difficulty"],
            "language": challenge["language"],
            "function_name": challenge["function_name"],
            "starter_code": challenge["starter_code"],
            "rules": challenge["rules"],
            "tests": tests,
            "course": challenge["course"],
            "lesson": challenge["lesson"],
            "evidence": challenge["evidence"],
            "question_xp": challenge["xp"],
            "source": f"data/vlearn-pack/lab-arena/{challenge['id']}.json",
            "ai_coach": lab_code_hint(challenge["starter_code"], "NotImplementedError", challenge=challenge),
        },
    )


def _run_submission(code: str, challenge: dict, tests: list[dict]) -> list[dict]:
    blocked = ("import ", "__import__", "open(", "exec(", "eval(", "compile(", "__", "os.", "sys.", "subprocess")
    if any(term in code.casefold() for term in blocked):
        raise HTTPException(400, "Code chứa thao tác không được phép (security constraint).")
    function_name = challenge["function_name"]
    if not re.search(rf"(?m)^\s*def\s+{re.escape(function_name)}\s*\(", code):
        raise HTTPException(400, f"Hãy định nghĩa hàm `{function_name}` theo đúng yêu cầu đề bài.")
    cases = [{"id": test["id"], "arguments": test["arguments"], "expected": test["expected"]} for test in tests]
    harness = f"""
import json, sys
sys.stdout.reconfigure(encoding='utf-8')
function = globals()[{function_name!r}]
results = []
for case in {cases!r}:
    try:
        actual = function(*case["arguments"])
        passed = actual == case["expected"]
        results.append({{"id": case["id"], "passed": passed, "actual": repr(actual),
                         "error": "" if passed else "Actual không khớp expected."}})
    except Exception as error:
        results.append({{"id": case["id"], "passed": False, "actual": "",
                         "error": f"{{type(error).__name__}}: {{error}}"}})
print("__RESULT__" + json.dumps(results, ensure_ascii=False))
"""
    with TemporaryDirectory(prefix="vincourse-react-lab-") as directory:
        path = Path(directory) / "submission.py"
        path.write_text(code + "\n" + harness, encoding="utf-8")
        proc_env = {**os.environ, "PYTHONIOENCODING": "utf-8"}
        try:
            process = subprocess.run([sys.executable, "-I", str(path)], capture_output=True, text=True, timeout=3, env=proc_env, encoding="utf-8")
        except subprocess.TimeoutExpired as error:
            raise HTTPException(400, "Code chạy quá thời gian cho phép (3 giây).") from error
    line = next((line for line in reversed(process.stdout.splitlines()) if line.startswith("__RESULT__")), "")
    if not line:
        detail = process.stderr.strip().splitlines()[-1] if process.stderr.strip() else "SyntaxError hoặc Runtime Exception."
        raise HTTPException(400, f"Lỗi thực thi code: {detail[:160]}")
    runtime = {item["id"]: item for item in json.loads(line.removeprefix("__RESULT__"))}
    return [{**test, **runtime[test["id"]]} for test in tests]


@router.post("/submit", response_model=GameResult)
def submit(request: GameSubmitRequest) -> GameResult:
    session = SESSIONS.get(request.session_id)
    if not session:
        raise HTTPException(400, "Phiên đã hết hạn. Hãy tạo phiên mới.")
    challenge, tests, round_number = session["challenge"], session["tests"], session["round"]
    
    # Run code and catch any error to generate AI Debug Hint
    try:
        results = _run_submission(request.answer, challenge, tests)
        passed_count = sum(item["passed"] for item in results)
        passed = passed_count == len(results)
        failed_details = [f"Test `{item.get('label', item['id'])}`: {item.get('error', 'Chưa đúng')}" for item in results if not item["passed"]]
        output_log = "\n".join(failed_details) if failed_details else "All tests passed successfully."
        error_msg = f"{passed_count}/{len(results)} testcases đã đạt." if not passed else ""
    except HTTPException as exc:
        results = [
            {
                "id": test["id"],
                "label": test["label"],
                "passed": False,
                "actual": "",
                "error": str(exc.detail),
            }
            for test in tests
        ]
        passed_count = 0
        passed = False
        output_log = str(exc.detail)
        error_msg = str(exc.detail)

    challenge_complete = passed and round_number == 10

    # Generate dynamic AI Coach Debug Hint with full context
    ai_hint = lab_code_hint(request.answer, output_log, challenge=challenge, test_results=results)

    if passed:
        feedback = "Đã hoàn thành đủ 10 bài khác nhau." if challenge_complete else f"🎉 Tuyệt vời! Bài {round_number} đã đạt 100% testcases."
    else:
        feedback = f"❌ {error_msg}"

    result = GameResult(
        mode=GameMode.lab_arena,
        correct=passed,
        status=GameStatus.mastered if challenge_complete else GameStatus.partial if passed else GameStatus.misconception,
        feedback=feedback,
        evidence_ids=[item["id"] for item in challenge["evidence"]] if challenge_complete else [],
        xp=120 if challenge_complete else (20 if not passed else 50),
        mastery_delta=15 if challenge_complete else (0 if not passed else 5),
        recovery_created=not passed,
        next_action=("Hoàn thành thử thách." if challenge_complete else
                     "Mở bài tiếp theo." if passed else f"AI Hint: {ai_hint}"),
        payload={
            "tests": results,
            "passed_count": passed_count,
            "total": len(results),
            "round": round_number,
            "total_rounds": 10,
            "challenge_complete": challenge_complete,
            "challenge_id": challenge["id"],
            "ai_coach_hint": ai_hint,
        },
    )
    return record_result(request.user_id, request.model_dump(), result)
