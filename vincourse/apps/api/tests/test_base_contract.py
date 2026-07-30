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
