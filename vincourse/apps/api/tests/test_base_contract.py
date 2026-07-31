from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health_and_modes():
    health = client.get("/api/health")
    assert health.status_code == 200
    assert health.json()["ok"] is True

    modes = client.get("/api/modes")
    assert modes.status_code == 200
    assert len(modes.json()) == 6


def test_feature_submit_returns_game_result_contract():
    response = client.post("/api/modes/story/submit", json={
        "user_id": "demo-user",
        "course_id": "ml-foundations",
        "session_id": "story-quest-bank",
        "question_id": "prologue_quiz_01",
        "answer": "B",
        "confidence": 4,
    })
    assert response.status_code == 200
    body = response.json()
    for field in [
        "mode",
        "correct",
        "status",
        "feedback",
        "evidence_ids",
        "misconception_id",
        "xp",
        "mastery_delta",
        "recovery_created",
        "next_action",
    ]:
        assert field in body


def test_lab_session_and_runtime_results_are_connected():
    session_response = client.get("/api/modes/lab_arena/session?round=1")
    assert session_response.status_code == 200
    session = session_response.json()
    assert len(session["payload"]["tests"]) == 4
    assert len({test["arguments"][0] for test in session["payload"]["tests"]}) == 4

    response = client.post("/api/modes/lab_arena/submit", json={
        "user_id": "demo-user",
        "course_id": "ai-odyssey",
        "session_id": session["session_id"],
        "question_id": "lab-round-1",
        "answer": "def count_character(text, target):\n    return text.lower().count(target.lower())",
        "confidence": 4,
    })
    assert response.status_code == 200
    result = response.json()
    assert result["correct"] is True
    assert result["payload"]["passed_count"] == 4
    assert all(test["passed"] for test in result["payload"]["tests"])
    assert result["xp"] == 0
    assert result["payload"]["challenge_complete"] is False

    second_session = client.get("/api/modes/lab_arena/session?round=2").json()
    assert session["payload"]["challenge_id"] == "tool-character-count"
    assert second_session["payload"]["challenge_id"] == "prompt-blueprint"
    assert session["payload"]["function_name"] != second_session["payload"]["function_name"]
    assert session["payload"]["starter_code"] != second_session["payload"]["starter_code"]

    final_session = client.get("/api/modes/lab_arena/session?round=10").json()
    final_answer = """def check_tool_schema(schema):
    errors = []
    if not str(schema.get("name", "")).strip():
        errors.append("missing_name")
    if len(str(schema.get("description", "")).strip()) < 15:
        errors.append("weak_description")
    parameters = schema.get("parameters", {})
    if not parameters:
        errors.append("missing_parameters")
    if any(name not in parameters for name in schema.get("required", [])):
        errors.append("required_not_declared")
    return errors"""
    final_response = client.post("/api/modes/lab_arena/submit", json={
        "user_id": "demo-user",
        "course_id": "ai-odyssey",
        "session_id": final_session["session_id"],
        "question_id": "lab-round-10",
        "answer": final_answer,
        "confidence": 4,
    })
    final_result = final_response.json()
    assert final_result["status"] == "mastered"
    assert final_result["xp"] == 120
    assert final_result["payload"]["challenge_complete"] is True
