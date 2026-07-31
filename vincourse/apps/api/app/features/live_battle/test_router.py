import json

import pytest
from fastapi import HTTPException

from app.features.live_battle.router import (
    INITIAL_DISTRIBUTION,
    INITIAL_SUBMITTED_COUNT,
    REWARDED_SUBMISSIONS,
    ROOM_STATE,
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
    ROOM_STATE["submitted_count"] = INITIAL_SUBMITTED_COUNT
    ROOM_STATE["distribution"] = INITIAL_DISTRIBUTION.copy()
    PROGRESS.clear()
    ATTEMPTS.clear()
    RECOVERY_QUEUE.clear()
    yield


def submit_live(option_id: str, reasoning: str, user_id: str = "live-test-user") -> dict:
    request = GameSubmitRequest(
        user_id=user_id,
        course_id="ml-foundations",
        session_id="live-battle-vinc-24",
        question_id="live-feature-scaling-01",
        answer=json.dumps({"option_id": option_id, "reasoning": reasoning}),
        confidence=4,
    )
    return submit(request).model_dump(mode="json")


def test_session_contains_live_room_payload():
    body = get_session().model_dump(mode="json")
    assert body["session_id"] == "live-battle-vinc-24"
    assert body["payload"]["room_code"] == "VINC-24"
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
    request = GameSubmitRequest(
        user_id="live-test-user",
        course_id="ml-foundations",
        session_id="live-battle-vinc-24",
        question_id="live-feature-scaling-01",
        answer=json.dumps({"option_id": "B", "reasoning": "quá ngắn"}),
        confidence=4,
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
