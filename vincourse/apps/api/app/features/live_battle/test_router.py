import json

import pytest
from fastapi import HTTPException

from app.features.live_battle.router import (
    INITIAL_DISTRIBUTION,
    INITIAL_SUBMITTED_COUNT,
    LiveBattleControlRequest,
    REWARDED_SUBMISSIONS,
    ROOM_STATE,
    TEAM_ASSIGNMENTS,
    control_session,
    get_session,
    parse_team_answer,
    submit,
)
from app.routers.progress import reset as reset_progress_route
from app.schemas import GameSubmitRequest
from app.storage.memory import ATTEMPTS, PROGRESS, RECOVERY_QUEUE, get_progress


@pytest.fixture(autouse=True)
def reset_live_state():
    REWARDED_SUBMISSIONS.clear()
    TEAM_ASSIGNMENTS.clear()
    ROOM_STATE["phase"] = "setup"
    ROOM_STATE["joined_count"] = 0
    ROOM_STATE["submitted_count"] = INITIAL_SUBMITTED_COUNT
    ROOM_STATE["distribution"] = INITIAL_DISTRIBUTION.copy()
    PROGRESS.clear()
    ATTEMPTS.clear()
    RECOVERY_QUEUE.clear()
    yield


def submit_live(
    option_id: str,
    reasoning: str,
    user_id: str = "live-test-user",
    *,
    ensure_answering: bool = True,
) -> dict:
    session = get_session(user_id=user_id)
    if ensure_answering:
        ROOM_STATE["phase"] = "answering"
    request = GameSubmitRequest(
        user_id=user_id,
        course_id="ml-foundations",
        session_id=session.session_id,
        question_id=str(session.payload["question_id"]),
        answer=json.dumps({"option_id": option_id, "reasoning": reasoning}),
        confidence=4,
        room_code=str(session.payload["room_code"]),
        team_id=str(session.payload["team_id"]),
    )
    return submit(request).model_dump(mode="json")


def test_session_contains_live_room_payload():
    body = get_session().model_dump(mode="json")
    assert body["session_id"] == "live-battle-vinc-24"
    assert body["payload"]["room_code"] == "VINC-24"
    assert body["payload"]["team_id"] == "team-gradient"
    assert body["payload"]["team"] == "Team Gradient"
    assert body["payload"]["joined_count"] == 1
    assert body["payload"]["phase"] == "setup"
    assert body["payload"]["requires_reasoning"] is True
    assert body["payload"]["min_reasoning_length"] == 20
    assert len(body["payload"]["options"]) == 4
    assert sum(body["payload"]["scoring"].values()) == 100
    assert "calibration" not in body["payload"]["scoring"]
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
    assert "live_battle" in get_progress("live-test-user").model_dump(mode="json")["completed_modes"]


def test_invalid_reasoning_is_rejected():
    session = get_session(user_id="live-test-user")
    ROOM_STATE["phase"] = "answering"
    request = GameSubmitRequest(
        user_id="live-test-user",
        course_id="ml-foundations",
        session_id="live-battle-vinc-24",
        question_id="live-feature-scaling-01",
        answer=json.dumps({"option_id": "B", "reasoning": "quá ngắn"}),
        confidence=4,
        room_code="VINC-24",
        team_id=str(session.payload["team_id"]),
    )
    with pytest.raises(HTTPException) as exc_info:
        submit(request)
    assert exc_info.value.status_code == 422


def test_question_without_reasoning_accepts_empty_reasoning():
    option_id, reasoning = parse_team_answer(
        json.dumps({"option_id": "B", "reasoning": ""}),
        requires_reasoning=False,
        min_reasoning_length=20,
    )
    assert option_id == "B"
    assert reasoning == ""


def test_replay_does_not_award_xp_or_increment_submitted_count():
    first = submit_live(
        "B",
        "Scale feature giúp gradient cập nhật cân bằng và ổn định hơn.",
        user_id="replay-test-user",
    )
    submitted_after_first = ROOM_STATE["submitted_count"]

    replay = submit_live(
        "B",
        "Scale feature giúp gradient cập nhật cân bằng và ổn định hơn.",
        user_id="replay-test-user",
    )

    assert first["xp"] == 140
    assert first["payload"]["first_submission"] is True
    assert replay["xp"] == 0
    assert replay["mastery_delta"] == 0
    assert replay["payload"]["replay"] is True
    assert ROOM_STATE["submitted_count"] == submitted_after_first


def test_replay_does_not_create_or_clear_recovery():
    first = submit_live(
        "A",
        "Train thêm epoch sẽ làm loss tự ổn định sau một thời gian dài.",
        user_id="recovery-test-user",
    )
    assert first["recovery_created"] is True
    assert get_progress("recovery-test-user").recovery_queue_size == 1

    replay = submit_live(
        "B",
        "Scale feature giúp gradient cập nhật cân bằng và ổn định hơn.",
        user_id="recovery-test-user",
    )
    assert replay["recovery_created"] is False
    assert replay["payload"]["recovery_unchanged"] is True
    assert get_progress("recovery-test-user").recovery_queue_size == 1


def test_reset_allows_live_battle_to_award_xp_again():
    first = submit_live(
        "B",
        "Scale feature giúp gradient cập nhật cân bằng và ổn định hơn.",
        user_id="reset-test-user",
    )
    assert first["xp"] == 140
    assert ROOM_STATE["submitted_count"] == INITIAL_SUBMITTED_COUNT + 1

    reset_progress_route("reset-test-user")
    assert ROOM_STATE["submitted_count"] == INITIAL_SUBMITTED_COUNT

    after_reset = submit_live(
        "B",
        "Scale feature giúp gradient cập nhật cân bằng và ổn định hơn.",
        user_id="reset-test-user",
    )
    assert after_reset["xp"] == 140
    assert after_reset["payload"]["first_submission"] is True


def test_submit_rejects_wrong_room_team_and_course():
    session = get_session(user_id="validation-user")
    ROOM_STATE["phase"] = "answering"
    base = {
        "user_id": "validation-user",
        "course_id": "ml-foundations",
        "session_id": session.session_id,
        "question_id": str(session.payload["question_id"]),
        "answer": json.dumps({
            "option_id": "B",
            "reasoning": "Scale feature giúp gradient cập nhật cân bằng và ổn định hơn.",
        }),
        "confidence": 4,
        "room_code": "VINC-24",
        "team_id": str(session.payload["team_id"]),
    }

    for field, value, status_code in (
        ("room_code", "WRONG", 404),
        ("team_id", "fake-team", 403),
        ("course_id", "fake-course", 422),
    ):
        with pytest.raises(HTTPException) as exc_info:
            submit(GameSubmitRequest(**{**base, field: value}))
        assert exc_info.value.status_code == status_code


def test_instructor_controls_shared_phase_and_reveals_team_result():
    student_session = get_session(user_id="phase-user")
    assert student_session.payload["phase"] == "setup"

    phases = (
        ("create", "lobby"),
        ("start", "answering"),
    )
    for action, expected in phases:
        session = control_session(LiveBattleControlRequest(room_code="VINC-24", action=action))
        assert session.payload["phase"] == expected

    submit_live(
        "B",
        "Scale feature giúp gradient cập nhật cân bằng và ổn định hơn.",
        user_id="phase-user",
    )
    control_session(LiveBattleControlRequest(room_code="VINC-24", action="lock"))
    control_session(LiveBattleControlRequest(room_code="VINC-24", action="reveal"))

    revealed = get_session(user_id="phase-user")
    assert revealed.payload["phase"] == "revealed"
    assert revealed.payload["submission_result"]["status"] == "mastered"
    assert revealed.payload["submitted_count"] == 1


def test_submit_is_blocked_before_question_starts():
    session = get_session(user_id="waiting-user")
    request = GameSubmitRequest(
        user_id="waiting-user",
        course_id="ml-foundations",
        session_id=session.session_id,
        question_id=str(session.payload["question_id"]),
        answer=json.dumps({
            "option_id": "B",
            "reasoning": "Scale feature giúp gradient cập nhật cân bằng và ổn định hơn.",
        }),
        confidence=4,
        room_code="VINC-24",
        team_id=str(session.payload["team_id"]),
    )
    with pytest.raises(HTTPException) as exc_info:
        submit(request)
    assert exc_info.value.status_code == 409


def test_existing_team_can_replay_after_reveal_without_changing_room():
    first = submit_live(
        "A",
        "Train thêm epoch sẽ làm loss tự ổn định sau một thời gian dài.",
        user_id="revealed-replay-user",
    )
    control_session(LiveBattleControlRequest(room_code="VINC-24", action="lock"))
    control_session(LiveBattleControlRequest(room_code="VINC-24", action="reveal"))
    submitted_count = ROOM_STATE["submitted_count"]

    replay = submit_live(
        "B",
        "Scale feature giúp gradient cập nhật cân bằng và ổn định hơn.",
        user_id="revealed-replay-user",
        ensure_answering=False,
    )

    assert first["xp"] == 20
    assert replay["payload"]["replay"] is True
    assert replay["xp"] == 0
    assert ROOM_STATE["submitted_count"] == submitted_count


def test_restart_clears_room_runtime_state():
    submit_live(
        "B",
        "Scale feature giúp gradient cập nhật cân bằng và ổn định hơn.",
        user_id="restart-user",
    )
    control_session(LiveBattleControlRequest(room_code="VINC-24", action="lock"))
    control_session(LiveBattleControlRequest(room_code="VINC-24", action="reveal"))
    control_session(LiveBattleControlRequest(room_code="VINC-24", action="summary"))
    restarted = control_session(LiveBattleControlRequest(room_code="VINC-24", action="restart"))

    assert restarted.payload["phase"] == "setup"
    assert restarted.payload["joined_count"] == 0
    assert restarted.payload["submitted_count"] == 0
    assert restarted.payload["distribution"] == INITIAL_DISTRIBUTION
    assert TEAM_ASSIGNMENTS == {}
    assert REWARDED_SUBMISSIONS == {}
