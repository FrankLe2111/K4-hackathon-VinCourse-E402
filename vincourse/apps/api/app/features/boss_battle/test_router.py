from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_boss_battle_session_exposes_live_room_contract():
    response = client.get("/api/modes/boss_battle/session")

    assert response.status_code == 200
    data = response.json()
    assert data["mode"] == "boss_battle"
    assert data["payload"]["room"]["room_code"] == "24"
    assert data["payload"]["rules"]["threshold"] == 80
    assert len(data["payload"]["rounds"]) == 4
    assert data["payload"]["database_contract"]["answers_table"] == "bossBattleAnswers"


def test_boss_battle_submit_scores_player_and_damages_boss(monkeypatch):
    monkeypatch.setattr(
        "app.features.boss_battle.router._boss_round_mentor",
        lambda _: "AI Mentor: test hint",
    )
    response = client.post(
        "/api/modes/boss_battle/submit",
        json={
            "user_id": "guest-test",
            "course_id": "ml-foundations",
            "session_id": "boss-room-vinc-24",
            "question_id": "diagnose",
            "answer": '{"nickname":"Test","round_id":"diagnose","option_id":"scale_mismatch","elapsed_seconds":10}',
            "confidence": 4,
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["correct"] is True
    assert data["xp"] > 100
    assert data["payload"]["boss_damaged"] is True
    assert data["payload"]["damage"] == 25
    assert data["payload"]["ai_mentor"] == "AI Mentor: test hint"


def test_boss_battle_submit_wrong_answer_creates_recovery(monkeypatch):
    monkeypatch.setattr(
        "app.features.boss_battle.router._boss_round_mentor",
        lambda _: "AI Mentor: recovery hint",
    )
    response = client.post(
        "/api/modes/boss_battle/submit",
        json={
            "user_id": "guest-test",
            "course_id": "ml-foundations",
            "session_id": "boss-room-vinc-24",
            "question_id": "fix_pipeline",
            "answer": '{"nickname":"Test","round_id":"fix_pipeline","option_id":"scale_all","elapsed_seconds":20}',
            "confidence": 3,
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["correct"] is False
    assert data["xp"] == 0
    assert data["recovery_created"] is True
    assert data["payload"]["boss_damaged"] is False
