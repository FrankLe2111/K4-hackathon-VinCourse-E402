# Boss Battle

Owner: Trung Quan

## Goal

Boss Battle la live room kieu Kahoot ket hop muc tieu ha boss tap the.

Nguoi choi join bang nickname, khong can tai khoan. Moi round moi nguoi tra loi doc lap, nhan diem ca nhan va bonus toc do. Neu it nhat `80%` nguoi choi tra loi dung trong round, boss moi mat mau.

## Demo Flow

```text
Host mo Boss Battle
  -> man hinh hien room code / join link
  -> nguoi choi nhap nickname
  -> round hien cau hoi va cac lua chon
  -> tung nguoi nop dap an doc lap
  -> backend cham dung/sai va tinh diem ca nhan
  -> backend tinh correct_rate cua ca phong
  -> neu correct_rate >= 80%, boss mat 25 HP
  -> AI mentor phan tich loi chung va goi y round tiep theo
  -> leaderboard cap nhat
  -> lap lai den khi boss HP = 0 hoac het round demo
```

## Scoring Rules

```text
Dung: +100 diem
Dung nhanh: +0 den +50 bonus
Sai: +0 diem
Khong nop: +0 diem
```

## Boss Damage Rules

```text
correct_rate = correct_players / active_players * 100

Neu correct_rate >= 80:
  boss mat 25 HP

Neu correct_rate < 80:
  boss khong mat mau
  AI mentor tao recovery hint cho ca lop
```

## AI Usage

AI that trong module nay nam o backend:

```text
FE -> FastAPI /api/modes/boss_battle/submit
   -> app.ai.tutor.boss_round_mentor()
   -> OpenAI
   -> GameResult.payload.ai_mentor
```

AI chi sinh feedback/recovery hint. AI khong ghi truc tiep vao JSON/database.

Neu thieu `OPENAI_API_KEY`, backend tu fallback sang mentor text deterministic de team van start duoc app.

## Current Endpoints

```text
GET  /api/modes/boss_battle/session
POST /api/modes/boss_battle/submit
```

## Submit Answer Contract

`GameSubmitRequest.answer` la JSON string de khong can sua schema chung:

```json
{
  "room_code": "24",
  "nickname": "Minh",
  "round_id": "diagnose",
  "option_id": "scale_mismatch",
  "elapsed_seconds": 10
}
```

## Result Payload Contract

```json
{
  "round_id": "diagnose",
  "player_score": 133,
  "speed_bonus": 33,
  "active_players": 10,
  "correct_count": 8,
  "correct_rate": 80,
  "threshold": 80,
  "boss_damaged": true,
  "damage": 25,
  "leaderboard": [],
  "ai_mentor": "AI Mentor..."
}
```

## Database Contract For Future JSON Server

Boss Battle la module rieng ve gameplay live-room, nhung van noi voi app chung bang shared keys.

Feature tables du kien:

```text
bossBattleRooms
bossBattlePlayers
bossBattleRounds
bossBattleAnswers
```

Shared keys bat buoc khi ghi DB sau nay:

```text
course_id
mode = boss_battle
session_id
user_id hoac guest_id
concept_id
evidence_ids
```

Nguyen tac:

```text
FE khong ghi db.json.
AI khong ghi db.json.
FE -> FastAPI -> storage layer -> JSON DB.
```

## Allowed Folders

- `vincourse/apps/web/src/features/boss-battle/**`
- `vincourse/apps/api/app/features/boss_battle/**`
- `vincourse/docs/features/boss-battle.md`
