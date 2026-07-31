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
  -> host bam Start Battle
  -> countdown 3-2-1-FIGHT
  -> round hien timer lon, cau hoi va 4 dap an mau
  -> tung nguoi bam dap an va bi lock answer
  -> backend cham dung/sai va tinh diem ca nhan
  -> reveal dap an dung + phan bo nguoi chon tung dap an
  -> hien leaderboard overlay sau moi cau
  -> animate diem va tang/giam thu hang
  -> backend tinh correct_rate cua ca phong
  -> neu correct_rate >= 80%, boss mat 34 HP
  -> boss damage stage hien -34 HP hoac Attack blocked
  -> AI mentor analysis duoc luu lai, chua hien dai dong giua tran
  -> lap lai den khi boss HP = 0 hoac het round demo
  -> final podium
```

## Scoring Rules

```text
Dung: toi da 1000 diem
Dung nhanh: diem cang gan 1000
Sai: +0 diem
Khong nop: +0 diem
```

Cong thuc demo:

```text
score = round(1000 * (1 - elapsed_seconds / timer_seconds / 2))
```

## Boss Damage Rules

```text
correct_rate = correct_players / active_players * 100

Neu correct_rate >= 80:
  boss mat 34 HP

Neu correct_rate < 80:
  boss khong mat mau
  AI mentor tao recovery hint de hien o final review
```

Boss co 100 HP va moi hit la 34 HP, nen lop chi can 3 round thanh cong trong tong 4 round de ha boss.

## AI Usage

AI that trong module nay nam o backend:

```text
FE -> FastAPI /api/modes/boss_battle/submit
   -> feature-local _boss_round_mentor()
   -> OpenAI
   -> GameResult.payload.ai_mentor
```

AI chi sinh feedback/recovery hint. AI khong ghi truc tiep vao JSON/database.

UX rule: khong hien AI analysis dai giua round vi lam dut nhip game. Trong luc choi chi hien dung/sai, diem, distribution va leaderboard. Tat ca AI mentor review duoc gom lai o final podium.

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
  "player_score": 833,
  "speed_bonus": 333,
  "active_players": 10,
  "correct_count": 8,
  "correct_rate": 80,
  "threshold": 80,
  "boss_damaged": true,
  "damage": 34,
  "answer_distribution": [
    {
      "option_id": "scale_mismatch",
      "count": 8,
      "percent": 80,
      "correct": true,
      "selected_by_player": true
    }
  ],
  "leaderboard": [
    {
      "rank": 1,
      "rank_delta": 2,
      "nickname": "Minh",
      "score_delta": 933,
      "correct": true
    }
  ],
  "ai_mentor": "AI Mentor..."
}
```

## UI State Machine

Frontend Boss Battle khong render nhu mot form quiz. No chay theo cac state rieng:

```text
lobby
countdown
question
locked
reveal
leaderboard
damage
victory
```

Nguoi choi chi can:

```text
join room
start battle
chon dap an
```

Sau khi nguoi choi chon dap an hoac het gio, UI tu dong chay tiep:

```text
locked
  -> reveal correct/incorrect
  -> answer distribution
  -> leaderboard overlay
  -> boss damage
  -> next countdown hoac final podium
```

Yeu cau UX:

```text
lobby: room code lon, player chips, Start Battle
countdown: 3-2-1-FIGHT full stage
question: timer lon, answer cards mau, answered count
locked: cho ca lop, khong reveal ngay, tu dong sang reveal
reveal: hien Correct/Incorrect, dap an dung co check, dap an sai co warning, hien distribution
leaderboard: overlay full-screen, diem count-up, rank movement, tu dong sang damage
damage: boss shake, -34 HP hoac attack blocked, tu dong sang round tiep
victory: final podium top 3
final review: hien AI Mentor Review tung round de nguoi hoc doc lai sau khi game dung
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
