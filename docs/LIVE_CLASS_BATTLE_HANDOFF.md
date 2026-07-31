# Live Class Battle Handoff

## Vị trí chính xác

Live Class Battle có hai phiên bản với mục đích khác nhau:

- `frontend/`: vision UI tĩnh của prototype gốc; chỉ là mock.
- `vincourse/`: bản React + FastAPI đang được phát triển và kiểm thử.

Các file triển khai hiện tại:

- `vincourse/apps/web/src/features/live-battle/index.tsx`
- `vincourse/apps/web/src/features/live-battle/styles.css`
- `vincourse/apps/web/src/api/modes.ts`
- `vincourse/apps/api/app/features/live_battle/router.py`
- `vincourse/apps/api/app/features/live_battle/test_router.py`
- `vincourse/docs/features/live-battle.md`

## Trạng thái

- Backend cấp team ổn định cho từng trình duyệt và kiểm tra room/team khi submit.
- Instructor và student dùng chung phase trên backend; frontend poll mỗi 1,5 giây.
- Kết quả học viên được giữ đến khi instructor `reveal`.
- Room state vẫn in-memory; chưa có WebSocket, database và instructor auth.
- Timer, ranking, team members, hint và misconception stream vẫn là mock.

## Chạy và kiểm tra

Làm theo `vincourse/README.md` để chạy API ở port `8000` và web ở port `5173`.

```bash
cd vincourse/apps/api
.venv/bin/python -m pytest -q app/features/live_battle/test_router.py

cd ../web
npm run typecheck
npm run build
```

Prototype được chấm chính thức vẫn là `codebase/server.py` và lát cắt
`#understanding`, theo `README.md` ở thư mục gốc.
