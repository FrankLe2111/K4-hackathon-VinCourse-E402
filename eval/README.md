# Evaluation

Golden set: 24 case, không đổi expected label sau khi xem output.

```bash
# Smoke test plumbing — kết quả này KHÔNG thay cho AI thật
python3 eval/run_eval.py --demo

# AI-02 — giữ nguyên AI-01 để không che lỗi quota/failure đã quan sát
export OPENAI_API_KEY='...'
python3 eval/run_eval.py --output eval/results-ai-02.json
```

Thêm `--delay 1` nếu project của bạn cần giãn request. `AI-01` là lượt Gemini lịch sử: có 18 output và 6 lỗi quota 429, nên không đại diện cho backend OpenAI hiện tại và không đạt quality bar. `traces.jsonl` được runtime ghi local nhưng ignore vì có hash tương tác. Các file `results-ai-*.json` là trace đã tối thiểu hóa dữ liệu và có `mode/model/trace_id/latency` cho từng case.
