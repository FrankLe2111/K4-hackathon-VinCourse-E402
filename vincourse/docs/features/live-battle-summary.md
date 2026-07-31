# Live Class Battle - Tom tat

## Feature la gi?

Live Class Battle la che do thi dau theo lop, gan giong Kahoot nhung hoc vien
phai chon dap an, viet reasoning va tu danh gia confidence.

## Flow demo

- Student: `Join -> Waiting -> Answer -> Submit -> Result/Recovery`.
- Instructor: `Setup -> Lobby -> Monitor -> Lock -> Reveal -> Summary`.
- Ma phong demo: `VINC-24`.

## Ket qua cham

- Dung va reasoning tot: `mastered`, `140 XP`.
- Dung nhung reasoning yeu: `partial`, `70 XP`.
- Sai: `misconception`, `20 XP` va tao recovery.

## Real va mock

- Real: React UI, FastAPI session/submit, GameResult, progress va recovery queue.
- Mock: WebSocket, multi-user sync, countdown, distribution va instructor control.
- UI luon ghi ro day la phien live mo phong.

## File chinh

- `apps/web/src/features/live-battle/index.tsx`
- `apps/web/src/features/live-battle/styles.css`
- `apps/api/app/features/live_battle/router.py`
- `apps/api/app/features/live_battle/test_router.py`

## API

```text
GET  /api/modes/live_battle/session
POST /api/modes/live_battle/submit
```

## Luu y tich hop

Component da hoan chinh nhung app shell can base owner import
`LiveBattleFeature` trong `FeatureHost.tsx`. Feature nay khong sua shared shell
de tranh conflict voi cac feature khac.

Verification: frontend typecheck/build pass, backend `7/7` tests pass.
