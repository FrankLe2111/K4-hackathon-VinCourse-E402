from __future__ import annotations

import json
from typing import Any

from fastapi import APIRouter

from app.ai.client import get_openai_client
from app.core.config import settings
from app.schemas import GameMode, GameResult, GameSession, GameStatus, GameSubmitRequest
from app.storage.memory import record_result

router = APIRouter(tags=["boss-battle"])

THRESHOLD = 80
ATTACK_DAMAGE = 34
ROUND_TIME_SECONDS = 30
CORRECT_POINTS = 1000

PLAYERS = [
    {"player_id": "p-ana", "nickname": "An", "avatar": "AN"},
    {"player_id": "p-bao", "nickname": "Bao", "avatar": "BA"},
    {"player_id": "p-chi", "nickname": "Chi", "avatar": "CH"},
    {"player_id": "p-dang", "nickname": "Dang", "avatar": "DA"},
    {"player_id": "p-ha", "nickname": "Ha", "avatar": "HA"},
    {"player_id": "p-khoa", "nickname": "Khoa", "avatar": "KH"},
    {"player_id": "p-linh", "nickname": "Linh", "avatar": "LI"},
    {"player_id": "p-minh", "nickname": "Minh", "avatar": "MI"},
    {"player_id": "p-phuong", "nickname": "Phuong", "avatar": "PH"},
]

ROUNDS = [
    {
        "round_id": "diagnose",
        "title": "Vòng 1: Chẩn đoán lỗi",
        "concept_id": "feature-scaling",
        "question": "Model hồi quy bị diverge sau vài epoch. Dấu hiệu nào là nguyên nhân gốc hợp lý nhất?",
        "options": [
            {"id": "scale_mismatch", "label": "Các feature có thang đo quá khác nhau làm gradient update lệch mạnh."},
            {"id": "more_epochs", "label": "Model cần train nhiều epoch hơn để tự ổn định."},
            {"id": "lower_test_size", "label": "Cần giảm test set để train set lớn hơn."},
            {"id": "random_seed", "label": "Đổi random seed là cách sửa chính."},
        ],
        "correct_option_id": "scale_mismatch",
        "common_wrong": "nhầm diverge với việc thiếu epoch",
        "simulated_correct": [True, True, True, True, True, True, True, False, False],
    },
    {
        "round_id": "fix_pipeline",
        "title": "Vòng 2: Chọn cách sửa",
        "concept_id": "standardization",
        "question": "Bạn nên sửa pipeline như thế nào trước khi train lại model?",
        "options": [
            {"id": "standardize_train", "label": "Fit scaler trên train set, rồi transform train/validation/test bằng cùng scaler."},
            {"id": "scale_all", "label": "Fit scaler trên toàn bộ data trước khi split để tránh lệch phân phối."},
            {"id": "remove_loss", "label": "Bỏ loss function vì loss đang gây nhiễu."},
            {"id": "increase_lr", "label": "Tăng learning rate để vượt qua điểm kẹt."},
        ],
        "correct_option_id": "standardize_train",
        "common_wrong": "data leakage khi fit scaler trên toàn bộ dataset",
        "simulated_correct": [True, True, True, True, True, True, False, False, False],
    },
    {
        "round_id": "explain_damage",
        "title": "Vòng 3: Giải thích cơ chế",
        "concept_id": "gradient-descent",
        "question": "Vì sao scaling giúp gradient descent ổn định hơn?",
        "options": [
            {"id": "balanced_steps", "label": "Các feature đóng góp cân bằng hơn nên bước cập nhật bớt bị một chiều áp đảo."},
            {"id": "more_data", "label": "Scaling tạo thêm dữ liệu nên model học tốt hơn."},
            {"id": "hide_noise", "label": "Scaling xóa nhiễu và làm mất các điểm ngoại lai."},
            {"id": "change_target", "label": "Scaling thay đổi target để loss nhỏ hơn."},
        ],
        "correct_option_id": "balanced_steps",
        "common_wrong": "tưởng scaling tạo thêm thông tin mới",
        "simulated_correct": [True, True, True, True, True, True, True, True, False],
    },
    {
        "round_id": "final_strike",
        "title": "Vòng 4: Đòn kết liễu",
        "concept_id": "transfer",
        "question": "Trong bài toán mới, cột income lớn hàng nghìn lần cột age. Nguyên tắc nào nên áp dụng?",
        "options": [
            {"id": "reuse_scaling_rule", "label": "Dùng cùng nguyên tắc scaling và kiểm tra validation loss sau khi sửa pipeline."},
            {"id": "drop_income", "label": "Xóa income vì thang đo lớn luôn làm model sai."},
            {"id": "train_longer", "label": "Chỉ cần train lâu hơn để model quen với thang đo."},
            {"id": "ignore_validation", "label": "Bỏ validation để tránh thấy loss xấu."},
        ],
        "correct_option_id": "reuse_scaling_rule",
        "common_wrong": "học thuộc ví dụ cũ thay vì chuyển giao nguyên tắc",
        "simulated_correct": [True, True, True, True, True, True, True, False, False],
    },
]


def _room_code(session_id: str) -> str:
    return session_id.split("-")[-1].upper()


def _boss_session() -> GameSession:
    session_id = "boss-room-vinc-24"
    return GameSession(
        mode=GameMode.boss_battle,
        session_id=session_id,
        title="Đại chiến Trùm: Mô hình Hỏng",
        prompt="Người chơi vào phòng bằng nickname, trả lời độc lập như Kahoot. Nếu ít nhất 80% người chơi đúng trong một vòng, boss mất máu.",
        evidence_ids=["BOSS-LIVE-ROOM-001"],
        payload={
            "room": {
                "room_id": session_id,
                "room_code": _room_code(session_id),
                "join_url": f"/boss/join/{_room_code(session_id)}",
                "host_name": "VinCourse Mentor",
            },
            "boss": {
                "boss_id": "broken-model",
                "boss_name": "Mô hình Hỏng",
                "max_hp": 100,
                "hp": 100,
                "attack_damage": ATTACK_DAMAGE,
            },
            "rules": {
                "threshold": THRESHOLD,
                "round_time_seconds": ROUND_TIME_SECONDS,
                "correct_points": CORRECT_POINTS,
                "damage_rule": "Nếu correct_rate >= 80%, boss mất 34 HP. Nếu thấp hơn, boss không mất máu.",
            },
            "players": PLAYERS,
            "rounds": ROUNDS,
            "ai_enabled": True,
            "database_contract": {
                "room_table": "bossBattleRooms",
                "players_table": "bossBattlePlayers",
                "answers_table": "bossBattleAnswers",
                "shared_keys": ["course_id", "mode", "session_id", "user_id", "concept_id", "evidence_ids"],
            },
        },
    )


def _parse_answer(raw_answer: str) -> dict[str, Any]:
    try:
        data = json.loads(raw_answer)
    except json.JSONDecodeError:
        return {"option_id": raw_answer}
    return data if isinstance(data, dict) else {"option_id": raw_answer}


def _round_by_id(round_id: str) -> dict[str, Any]:
    for item in ROUNDS:
        if item["round_id"] == round_id:
            return item
    return ROUNDS[0]


def _kahoot_score(elapsed_seconds: int, timer_seconds: int = ROUND_TIME_SECONDS) -> int:
    if elapsed_seconds <= 0.5:
        return CORRECT_POINTS
    ratio = min(max(elapsed_seconds / timer_seconds, 0), 1)
    return round(CORRECT_POINTS * (1 - ratio / 2))


def _answer_distribution(round_data: dict[str, Any], selected_option: str, player_correct: bool) -> list[dict[str, Any]]:
    counts = {option["id"]: 0 for option in round_data["options"]}
    counts[selected_option] = counts.get(selected_option, 0) + 1
    for index, correct in enumerate(round_data["simulated_correct"]):
        if correct:
            option_id = round_data["correct_option_id"]
        else:
            wrong_options = [option["id"] for option in round_data["options"] if option["id"] != round_data["correct_option_id"]]
            option_id = wrong_options[index % len(wrong_options)]
        counts[option_id] = counts.get(option_id, 0) + 1
    total = sum(counts.values()) or 1
    return [
        {
            "option_id": option["id"],
            "label": option["label"],
            "count": counts.get(option["id"], 0),
            "percent": round(counts.get(option["id"], 0) / total * 100),
            "correct": option["id"] == round_data["correct_option_id"],
            "selected_by_player": option["id"] == selected_option,
        }
        for option in round_data["options"]
    ]


def _boss_round_mentor(round_data: dict[str, Any]) -> str:
    correct_rate = round_data.get("correct_rate", 0)
    threshold = round_data.get("threshold", THRESHOLD)
    round_title = round_data.get("round_title", "Boss round")
    common_wrong = round_data.get("common_wrong", "chưa có đáp án sai nổi bật")
    concept = round_data.get("concept", "concept")
    boss_damaged = bool(round_data.get("boss_damaged"))
    fallback = (
        f"AI Mentor: Lớp đạt {correct_rate}% ở {round_title}, đủ ngưỡng {threshold}% nên boss mất máu. "
        f"Hãy yêu cầu người chơi giải thích lại {concept} bằng ví dụ riêng."
        if boss_damaged
        else f"AI Mentor: Lớp mới đạt {correct_rate}% ở {round_title}. Điểm nghẽn là {common_wrong}; "
        f"hãy sửa misconception này trước vòng tiếp theo."
    )
    if not settings.openai_api_key:
        return fallback
    try:
        response = get_openai_client().chat.completions.create(
            model=settings.openai_model,
            messages=[
                {
                    "role": "system",
                    "content": "You are VinCourse's AI mentor for a live classroom boss battle. Reply in Vietnamese, concise and encouraging.",
                },
                {
                    "role": "user",
                    "content": (
                        "Nhan xet ket qua round trong 2-3 cau. "
                        f"Round: {round_title}. Concept: {concept}. Correct rate: {correct_rate}%. "
                        f"Threshold: {threshold}%. Boss damaged: {boss_damaged}. "
                        f"Common wrong answer: {common_wrong}. "
                        "Neu lop chua dat nguong, neu ro can sua misconception nao. "
                        "Neu lop dat nguong, neu ro vi sao duoc tan cong boss va goi y round tiep."
                    ),
                },
            ],
            temperature=0.25,
            max_tokens=180,
        )
        content = response.choices[0].message.content
        return content.strip() if content else fallback
    except Exception:
        return fallback


def submit(request: GameSubmitRequest) -> GameResult:
    answer = _parse_answer(request.answer)
    round_data = _round_by_id(str(answer.get("round_id") or request.question_id))
    selected_option = str(answer.get("option_id", ""))
    nickname = str(answer.get("nickname") or request.user_id or "Guest")
    elapsed_seconds = int(answer.get("elapsed_seconds") or 18)

    player_correct = selected_option == round_data["correct_option_id"]
    player_score = _kahoot_score(elapsed_seconds) if player_correct else 0
    simulated_rows = [
        {
            "player_id": player["player_id"],
            "nickname": player["nickname"],
            "correct": correct,
            "score_delta": _kahoot_score(7 + index * 2) if correct else 0,
            "elapsed_seconds": 7 + index * 2,
            "previous_rank": index + 1,
        }
        for index, (player, correct) in enumerate(zip(PLAYERS, round_data["simulated_correct"], strict=True))
    ]
    player_row = {
        "player_id": request.user_id,
        "nickname": nickname,
        "correct": player_correct,
        "score_delta": player_score,
        "elapsed_seconds": elapsed_seconds,
        "previous_rank": 6,
    }
    board = [player_row, *simulated_rows]
    board.sort(key=lambda row: (-int(row["score_delta"]), int(row["elapsed_seconds"])))
    for index, row in enumerate(board):
        row["rank"] = index + 1
        row["rank_delta"] = int(row.get("previous_rank", index + 1)) - (index + 1)

    correct_count = sum(1 for row in board if row["correct"])
    active_count = len(board)
    correct_rate = round(correct_count / active_count * 100)
    boss_damaged = correct_rate >= THRESHOLD
    damage = ATTACK_DAMAGE if boss_damaged else 0
    mentor_line = _boss_round_mentor(
        {
            "round_title": round_data["title"],
            "concept": round_data["concept_id"],
            "correct_rate": correct_rate,
            "threshold": THRESHOLD,
            "common_wrong": round_data["common_wrong"],
            "boss_damaged": boss_damaged,
        }
    )

    feedback = (
        f"Bạn trả lời đúng và nhận {player_score} điểm. Lớp đạt {correct_rate}%, boss mất {damage} HP."
        if player_correct
        else f"Bạn chưa đúng ở vòng này. Lớp đạt {correct_rate}%, hãy xem AI mentor để sửa hiểu lầm."
    )
    result = GameResult(
        mode=GameMode.boss_battle,
        correct=player_correct,
        status=GameStatus.mastered if player_correct else GameStatus.misconception,
        feedback=feedback,
        evidence_ids=["BOSS-LIVE-ROOM-001", f"BOSS-{round_data['round_id'].upper()}"],
        misconception_id="" if player_correct else str(round_data["common_wrong"]),
        xp=player_score,
        mastery_delta=8 if player_correct else 0,
        recovery_created=not player_correct or not boss_damaged,
        next_action="Chuyển sang vòng tiếp theo." if boss_damaged else "AI mentor đang gợi ý điểm cần sửa trước khi đánh tiếp.",
        payload={
            "round_id": round_data["round_id"],
            "round_title": round_data["title"],
            "selected_option_id": selected_option,
            "correct_option_id": round_data["correct_option_id"],
            "player_score": player_score,
            "speed_bonus": player_score - round(CORRECT_POINTS / 2) if player_correct else 0,
            "active_players": active_count,
            "correct_count": correct_count,
            "correct_rate": correct_rate,
            "threshold": THRESHOLD,
            "boss_damaged": boss_damaged,
            "damage": damage,
            "answer_distribution": _answer_distribution(round_data, selected_option, player_correct),
            "leaderboard": board,
            "ai_mentor": mentor_line,
        },
    )
    return record_result(request.user_id, request.model_dump(), result)


@router.get("/session", response_model=GameSession)
def get_session() -> GameSession:
    return _boss_session()


@router.post("/submit", response_model=GameResult)
def submit_answer(request: GameSubmitRequest) -> GameResult:
    return submit(request)
