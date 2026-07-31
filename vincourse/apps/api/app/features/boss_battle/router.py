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
ATTACK_DAMAGE = 25
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
        "title": "Round 1: Chan doan loi",
        "concept_id": "feature-scaling",
        "question": "Model hoi quy bi diverge sau vai epoch. Dau hieu nao la nguyen nhan goc hop ly nhat?",
        "options": [
            {"id": "scale_mismatch", "label": "Feature co thang do qua khac nhau lam gradient update lech manh."},
            {"id": "more_epochs", "label": "Model can train nhieu epoch hon de tu on dinh."},
            {"id": "lower_test_size", "label": "Can giam test set de train set lon hon."},
            {"id": "random_seed", "label": "Doi random seed la cach sua chinh."},
        ],
        "correct_option_id": "scale_mismatch",
        "common_wrong": "nham diverge voi viec thieu epoch",
        "simulated_correct": [True, True, True, True, True, True, True, False, False],
    },
    {
        "round_id": "fix_pipeline",
        "title": "Round 2: Chon cach sua",
        "concept_id": "standardization",
        "question": "Ban nen sua pipeline nhu the nao truoc khi train lai model?",
        "options": [
            {"id": "standardize_train", "label": "Fit scaler tren train set, transform train/validation/test cung scaler."},
            {"id": "scale_all", "label": "Fit scaler tren toan bo data truoc khi split de tranh lech phan phoi."},
            {"id": "remove_loss", "label": "Bo loss function vi loss dang gay nhieu."},
            {"id": "increase_lr", "label": "Tang learning rate de vuot qua diem ket."},
        ],
        "correct_option_id": "standardize_train",
        "common_wrong": "data leakage khi fit scaler tren toan bo dataset",
        "simulated_correct": [True, True, True, True, True, True, False, False, False],
    },
    {
        "round_id": "explain_damage",
        "title": "Round 3: Giai thich co che",
        "concept_id": "gradient-descent",
        "question": "Vi sao scaling giup gradient descent on dinh hon?",
        "options": [
            {"id": "balanced_steps", "label": "Cac feature dong gop can bang hon nen buoc cap nhat bot bi mot chieu ap dao."},
            {"id": "more_data", "label": "Scaling tao them du lieu nen model hoc tot hon."},
            {"id": "hide_noise", "label": "Scaling xoa nhieu va lam mat cac diem ngoai lai."},
            {"id": "change_target", "label": "Scaling thay doi target de loss nho hon."},
        ],
        "correct_option_id": "balanced_steps",
        "common_wrong": "tuong scaling tao them thong tin moi",
        "simulated_correct": [True, True, True, True, True, True, True, True, False],
    },
    {
        "round_id": "final_strike",
        "title": "Round 4: Don ket lieu",
        "concept_id": "transfer",
        "question": "Trong bai toan moi, cot income lon hang nghin lan cot age. Nguyen tac nao nen ap dung?",
        "options": [
            {"id": "reuse_scaling_rule", "label": "Dung cung nguyen tac scaling va kiem tra validation loss sau khi sua pipeline."},
            {"id": "drop_income", "label": "Xoa income vi thang do lon luon lam model sai."},
            {"id": "train_longer", "label": "Chi can train lau hon de model quen voi thang do."},
            {"id": "ignore_validation", "label": "Bo validation de tranh thay loss xau."},
        ],
        "correct_option_id": "reuse_scaling_rule",
        "common_wrong": "hoc thuoc vi du cu thay vi chuyen giao nguyen tac",
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
        title="Boss Battle: The Broken Model",
        prompt="Nguoi choi join bang nickname, tra loi doc lap nhu Kahoot. Neu it nhat 80% nguoi choi dung trong round, boss mat mau.",
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
                "boss_name": "The Broken Model",
                "max_hp": 100,
                "hp": 100,
                "attack_damage": ATTACK_DAMAGE,
            },
            "rules": {
                "threshold": THRESHOLD,
                "round_time_seconds": ROUND_TIME_SECONDS,
                "correct_points": CORRECT_POINTS,
                "damage_rule": "Neu correct_rate >= 80%, boss mat 25 HP. Neu thap hon, boss khong mat mau.",
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
    common_wrong = round_data.get("common_wrong", "chua co dap an sai noi bat")
    concept = round_data.get("concept", "concept")
    boss_damaged = bool(round_data.get("boss_damaged"))
    fallback = (
        f"AI Mentor: Lop dat {correct_rate}% o {round_title}, du nguong {threshold}% nen boss mat mau. "
        f"Hay yeu cau nguoi choi giai thich lai {concept} bang vi du rieng."
        if boss_damaged
        else f"AI Mentor: Lop moi dat {correct_rate}% o {round_title}. Diem nghe la {common_wrong}; "
        f"hay sua misconception nay truoc round tiep theo."
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
        f"Ban tra loi dung va nhan {player_score} diem. Lop dat {correct_rate}%, boss mat {damage} HP."
        if player_correct
        else f"Ban chua dung o round nay. Lop dat {correct_rate}%, hay xem AI mentor de sua hieu lam."
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
        next_action="Chuyen sang round tiep theo." if boss_damaged else "AI mentor dang goi y diem can sua truoc khi danh tiep.",
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
