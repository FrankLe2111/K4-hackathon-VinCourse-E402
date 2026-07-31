# Live Class Battle

Owner: Ngo Minh Phuoc

## Phạm vi

Tính năng nằm trong ứng dụng `vincourse/` (React + FastAPI), không nằm trong
prototype được chấm ở thư mục gốc `codebase/`.

Đây là bản hackathon có trạng thái phòng dùng chung trên backend và frontend
poll mỗi 1,5 giây. Chưa có WebSocket, xác thực giảng viên hoặc lưu database;
restart API sẽ mất trạng thái phòng.

## Luồng đã hoạt động

```text
Giảng viên: Setup -> Lobby -> Answering -> Locked -> Revealed -> Summary
Học viên:   Join  -> Waiting -> Answering -> Submitted -> Result
```

- Mỗi trình duyệt có một `user_id` ổn định trong `localStorage`.
- Backend cấp `team_id` và `team` cho trình duyệt; frontend không tự tạo team.
- Submit phải khớp `course_id`, `room_code`, `session_id`, `question_id` và
  `team_id` đã được backend cấp.
- Một team chỉ được tính điểm và tăng `submitted_count` một lần cho mỗi câu.
- Học viên chỉ thấy kết quả sau khi giảng viên chuyển phòng sang `revealed`.
- Số đội đã nộp, phân bố đáp án và phase được đồng bộ qua API polling.

## API

```text
GET  /api/modes/live_battle/session?user_id=<browser-id>&role=student
GET  /api/modes/live_battle/session?user_id=<browser-id>&role=instructor
POST /api/modes/live_battle/control
POST /api/modes/live_battle/submit
```

Submit cần các field riêng của Live Battle:

```json
{
  "user_id": "live-<browser-uuid>",
  "course_id": "ml-foundations",
  "session_id": "live-battle-vinc-24",
  "question_id": "live-feature-scaling-01",
  "room_code": "VINC-24",
  "team_id": "team-gradient",
  "answer": "{\"option_id\":\"B\",\"reasoning\":\"...\"}",
  "confidence": 4
}
```

Control action theo đúng thứ tự: `create`, `start`, `lock`, `reveal`, `summary`.
Sau tổng kết, `restart` đưa phòng về `setup` và xóa trạng thái room in-memory.

## Điểm và giới hạn

- Đúng + reasoning tốt: `mastered`, `140 XP`.
- Đúng + reasoning yếu: `partial`, `70 XP`.
- Sai: `misconception`, `20 XP`, tạo Error Dungeon recovery.
- Confidence `1-5` chỉ được ghi nhận, chưa tính điểm.
- Reasoning vẫn được chấm bằng keyword, chưa phải AI grader.
- Timer, thành viên trong team, hint, ranking và misconception stream vẫn là
  dữ liệu minh họa.

## Kiểm tra

```bash
cd vincourse/apps/api
.venv/bin/python -m pytest -q app/features/live_battle/test_router.py

cd ../web
npm run typecheck
npm run build
```
