# Live Class Battle

Owner: Ngo Minh Phuoc

## Muc tieu

Che do thi dau lop/team theo phong cach Kahoot. Hoc vien chon dap an, them lap
luan neu cau hoi yeu cau, chon muc tu tin va nhan feedback.

Day la MVP local cho hackathon, chua co realtime/WebSocket.

## Luong demo

Hoc vien:

```text
Mo Live Battle
  -> vao phong VINC-24
  -> xem team
  -> chon dap an
  -> nhap reasoning neu cau hoi yeu cau
  -> submit
  -> xem mastered / partial / misconception
```

Giang vien (mock local):

```text
Setup -> Lobby -> Monitor -> Lock -> Reveal -> Summary
```

## API

```text
GET  /api/modes/live_battle/session
POST /api/modes/live_battle/submit
```

Session payload co cac field chinh:

```json
{
  "room_code": "VINC-24",
  "team": "Team Gradient",
  "question_id": "live-feature-scaling-01",
  "requires_reasoning": true,
  "min_reasoning_length": 20,
  "scoring": {
    "correctness": 50,
    "explanation": 50
  }
}
```

Quy tac reasoning:

- `requires_reasoning=true`: reasoning phai dat do dai toi thieu.
- `requires_reasoning=false`: chi can chon dap an.
- Confidence `1-5` chi duoc ghi nhan, chua dung de tinh diem.

## Ket qua va XP

- Dung + reasoning tot: `mastered`, `140 XP`.
- Dung + reasoning yeu: `partial`, `70 XP`.
- Sai: `misconception`, `20 XP`, tao Error Dungeon recovery.
- Submit thanh cong duoc tinh la hoan thanh mode, ke ca dap an sai.
- Choi lai van co feedback nhung `XP=0`, `mastery_delta=0`.
- Choi lai khong tang `submitted_count` va khong thay doi recovery.
- Reset progress xoa ca trang thai replay, nen co the nhan XP lai.

## Phan that va phan mock

Da hoat dong:

- React loading/error/result va validation.
- FastAPI grading, XP, progress va recovery.
- Reasoning bat buoc theo cau hoi.
- Chong cong XP khi replay.
- Tich hop trong `FeatureHost`.

Dang mock:

- Countdown, team members, ranking va instructor controls.
- Room state luu in-memory, restart server se mat.
- Khong dong bo instructor/student.
- Frontend dung `demo-user`, vi vay chi nen demo mot trinh duyet hoc vien.
- Reasoning duoc cham bang keyword, chua phai AI grader.

## Kiem tra

```text
cd vincourse/apps/api
.venv/bin/python -m pytest -q app/features/live_battle/test_router.py
# 9 passed

cd vincourse/apps/web
npm run typecheck
npm run build
```
