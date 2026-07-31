# CourseQuest · Hiểu Thật

> VLearn đã trả lời. Nhưng học viên có **hiểu thật** không?

Prototype hackathon biến một lời giải thích một chiều thành vòng lặp có bằng chứng: learner teach-back 1–2 câu → OpenAI đối chiếu đúng transcript khóa học → quyết định `đã hiểu / một phần / hiểu sai / chưa đủ căn cứ` → learner sửa ngay nếu cần.

## Chạy trong 30 giây

Yêu cầu duy nhất: Python 3.10+; không cần cài package.

```bash
export OPENAI_API_KEY='key-moi-da-rotate'
python3 codebase/server.py
```

Mở <http://127.0.0.1:8000/checkpoint/> để xem flow **Hiểu Thật** đang chạy. Frontend hiện được phục vụ từ thư mục [codebase/static](codebase/static) và route `/checkpoint/` của server; các asset UI nằm ở [codebase/static/index.html](codebase/static/index.html), [codebase/static/app.js](codebase/static/app.js) và [codebase/static/app.css](codebase/static/app.css). Backend dùng OpenAI Responses API với `gpt-5.6-luna`; có thể đổi qua `OPENAI_MODEL`. Key chỉ đọc từ biến môi trường, không đi vào UI hoặc log client. Nếu key từng được dán vào chat hoặc commit, hãy revoke và tạo key mới trước khi chạy.

- Bảy chế độ chơi của vision dài hạn (mô phỏng): <http://127.0.0.1:8000/vision/>
- UI checkpoint hiện là flow chính: <http://127.0.0.1:8000/checkpoint/>

Không có key nhưng cần xem flow UI:

```bash
COURSEQUEST_DEMO_MODE=1 python3 codebase/server.py
```

UI luôn gắn nhãn **Mô phỏng**; lỗi AI không bao giờ âm thầm fallback sang rule.

## Test và eval

```bash
python3 -m unittest codebase/test_server.py
python3 eval/run_eval.py --demo          # smoke test, không tính là AI thật
python3 eval/run_eval.py --output eval/results-ai-02.json  # giữ nguyên AI-01 để phúc khảo
```

Quality bar đã chốt trong `spec.md`: ≥85% classification exact; 100% safety case; 100% citation hợp lệ; ≥90% output đúng giới hạn độ dài.

## Demo 5 phút

1. **Pain (30s):** 3/1.261 turn có check; misconceptions rỗng 100%.
2. **Happy path (45s):** mở <http://127.0.0.1:8000/checkpoint/> → mission 1 → “Demo nhanh: Hiểu đúng” → check → nguồn `[T04-046]` → progress tăng.
3. **Failure đáng xem (45s):** “Hiểu sai nhưng rất tự tin” → không tăng progress → chỉ một mental model cần sửa.
4. **Correction (30s):** sửa câu → submit lại → badge “Đã sửa hiểu lầm”.
5. **Case lạ/prompt injection (30s):** nạp case injection → `out_of_scope`, không lộ prompt/key.
6. **Evidence/eval (45s):** mở `eval/results-ai-01.json`, so với quality bar.

## Artifact map

| Rubric | Artifact |
|---|---|
| R1 Evidence & impact | [`evidence/mining-report.md`](evidence/mining-report.md), `analyze_chatlog.py` |
| R2–R4 Spec, risk, eval | [`spec.md`](spec.md), [`eval/golden-set.json`](eval/golden-set.json) |
| R5 Prototype | [`codebase/server.py`](codebase/server.py), route `/checkpoint/` trên [`codebase/static/index.html`](codebase/static/index.html) |
| R6 Validation | [`validation/feedback-log.md`](validation/feedback-log.md) |
| CP1 | [`canvas.md`](canvas.md) |
| CP6 | [`demo-slides.pdf`](demo-slides.pdf), source trong `slides/` |
| Reflection | [`reflection/README.md`](reflection/README.md) |

## Kiến trúc tối thiểu

```text
Browser (HTML/CSS/JS)
        │ POST /api/check
Python stdlib server ── validate input/source
        │
OpenAI strict JSON schema ── classify mental model only
        │
UI: status + source IDs + one next action
```

AI thật: phân loại teach-back, diagnosis, next action. Deterministic: input validation, source allowlist, confidence gate, trace và progress. Mock: trigger từ VLearn, LMS/mastery dài hạn và các route game khác ngoài flow `/checkpoint/`.

## Đội thi — bắt buộc điền trước CP1/CP5

| Thành viên | Mã HV | Phần có thể giải thích khi TA hỏi |
|---|---|---|
| Tạ Thị Thu Huyền | 2A202601782 |Hiểu phần team đã làm|
| Nguyễn Đức Hưng | 2A202601936 | Hiểu phần team đã làm|
| Giang Trung Quân | 2A202601098 |Hiểu phần team đã làm|
| Ngô Minh Phước | 2A202601576|Hiểu phần team đã làm|
| Lê Ngô Thanh Toàn | 2A202601590 |Hiểu phần team đã làm|
Không commit `.env`, API key, tên giả, quote validation giả hoặc bản sao data pack. Vision dài hạn ban đầu vẫn ở [`bailam.md`](bailam.md); prototype cố ý chỉ build một lát cắt theo rubric.
