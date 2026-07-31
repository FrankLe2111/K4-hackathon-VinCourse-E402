import json

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def submit_live(option_id: str, reasoning: str) -> dict:
    response = client.post(
        "/api/modes/live_battle/submit",
        json={
            "user_id": "live-test-user",
            "course_id": "ml-foundations",
            "session_id": "live-battle-vinc-24",
            "question_id": "live-feature-scaling-01",
            "answer": json.dumps({"option_id": option_id, "reasoning": reasoning}),
            "confidence": 4,
        },
    )
    assert response.status_code == 200
    return response.json()


def test_session_contains_live_room_payload():
    response = client.get("/api/modes/live_battle/session")
    assert response.status_code == 200
    body = response.json()
    assert body["session_id"] == "live-battle-vinc-24"
    assert body["payload"]["room_code"] == "VINC-24"
    assert len(body["payload"]["options"]) == 4
    assert sum(body["payload"]["scoring"].values()) == 100
    assert body["payload"]["demo"] is True


def test_strong_correct_answer_is_mastered():
    body = submit_live(
        "B",
        "Scale feature giúp gradient cập nhật cân bằng và ổn định hơn.",
    )
    assert body["correct"] is True
    assert body["status"] == "mastered"
    assert body["xp"] == 140
    assert body["recovery_created"] is False


def test_correct_option_with_weak_reasoning_is_partial():
    body = submit_live(
        "B",
        "Đây là phương án mà nhóm em thống nhất lựa chọn đầu tiên.",
    )
    assert body["correct"] is True
    assert body["status"] == "partial"
    assert body["xp"] == 70


def test_wrong_answer_creates_recovery():
    body = submit_live(
        "A",
        "Train thêm epoch sẽ làm loss tự ổn định sau một thời gian dài.",
    )
    assert body["correct"] is False
    assert body["status"] == "misconception"
    assert body["recovery_created"] is True
    assert body["misconception_id"] == "more_epochs_fix_scaling"


def test_invalid_reasoning_is_rejected():
    response = client.post(
        "/api/modes/live_battle/submit",
        json={
            "user_id": "live-test-user",
            "course_id": "ml-foundations",
            "session_id": "live-battle-vinc-24",
            "question_id": "live-feature-scaling-01",
            "answer": json.dumps({"option_id": "B", "reasoning": "quá ngắn"}),
            "confidence": 4,
        },
    )
    assert response.status_code == 422
