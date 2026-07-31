import uuid
from fastapi import APIRouter, Query
from app.schemas import GameMode, GameResult, GameSession, GameStatus, GameSubmitRequest
from app.storage.memory import record_result

router = APIRouter(tags=["daily-recall"])

MOCK_DAILY_RECALL_QUEUE = [
    {
        "question_id": "q-dr-001",
        "title": "Day 4 — Prompt Fundamentals (1/5)",
        "prompt": "Bộ khung RTCF của một prompt tốt thường nhấn mạnh điều gì?",
        "evidence_ids": ["D04-P01"],
        "due_reason": "Ôn tập Day4: Prompt Engineering",
        "options": [
            {"id": "A", "text": "Nêu rõ role, task, context và format/constraint để model biết phải làm gì và trả lời ra sao."},
            {"id": "B", "text": "Chỉ cần viết prompt càng dài càng tốt để model có nhiều chữ hơn."},
            {"id": "C", "text": "Luôn bỏ context để model tự suy luận tự do."},
            {"id": "D", "text": "Chỉ dùng emoji và ví dụ, không cần yêu cầu cụ thể."}
        ],
        "correct_answer": "A",
        "misconception_id": "prompt_without_structure"
    },
    {
        "question_id": "q-dr-002",
        "title": "Day 4 — System vs User Prompt (2/5)",
        "prompt": "Trong ứng dụng AI, system prompt khác user prompt ở điểm nào quan trọng nhất?",
        "evidence_ids": ["D04-P02"],
        "due_reason": "Kiểm tra hiểu đúng về prompt hierarchy",
        "options": [
            {"id": "A", "text": "User prompt luôn có quyền cao hơn vì người dùng nhập sau."},
            {"id": "B", "text": "System prompt đặt hành vi/quy tắc nền và có ưu tiên cao hơn user prompt."},
            {"id": "C", "text": "System prompt chỉ dùng để trang trí giao diện."},
            {"id": "D", "text": "Hai loại prompt không khác nhau trong ứng dụng AI."}
        ],
        "correct_answer": "B",
        "misconception_id": "user_prompt_overrides_system"
    },
    {
        "question_id": "q-dr-003",
        "title": "Day 4 — Context Engineering (3/5)",
        "prompt": "Delimiter/XML tag trong prompt giúp giảm lỗi nào sau đây?",
        "evidence_ids": ["D04-P03"],
        "due_reason": "Ôn tập context bleed và prompt injection",
        "options": [
            {"id": "A", "text": "Giúp tách instruction, context và user input rõ ràng để tránh trôi/ngấm ngữ cảnh."},
            {"id": "B", "text": "Làm model không cần dữ liệu đầu vào nữa."},
            {"id": "C", "text": "Tự động biến mọi câu trả lời thành JSON hợp lệ."},
            {"id": "D", "text": "Đảm bảo model không bao giờ hallucinate."}
        ],
        "correct_answer": "A",
        "misconception_id": "missing_context_boundaries"
    },
    {
        "question_id": "q-dr-004",
        "title": "Day 4 — Tool Calling Loop (4/5)",
        "prompt": "Thứ tự đúng của một tool calling loop cơ bản là gì?",
        "evidence_ids": ["D04-P04"],
        "due_reason": "Ôn tập kiến trúc tool calling",
        "options": [
            {"id": "A", "text": "Model gọi tool → app thực thi tool → trả tool result về model → model tổng hợp trả lời."},
            {"id": "B", "text": "Tool tự gọi model → model bỏ qua tool result → app tự đoán đáp án."},
            {"id": "C", "text": "Người dùng chạy database trực tiếp rồi copy vào prompt."},
            {"id": "D", "text": "Model tự bịa kết quả tool để tiết kiệm latency."}
        ],
        "correct_answer": "A",
        "misconception_id": "fake_tool_result"
    },
    {
        "question_id": "q-dr-005",
        "title": "Day 4 — Tool Control (5/5)",
        "prompt": "Với write tool như gửi email/thanh toán, control nào là bắt buộc nhất?",
        "evidence_ids": ["D04-P05"],
        "due_reason": "Ôn tập an toàn khi tool có side effect",
        "options": [
            {"id": "A", "text": "Cho model tự thực thi mọi hành động để tối ưu tốc độ."},
            {"id": "B", "text": "Bắt buộc có kiểm soát/confirm trước hành động quan trọng hoặc có side effect."},
            {"id": "C", "text": "Ẩn schema để model khó gọi tool hơn."},
            {"id": "D", "text": "Chỉ log sau khi hành động đã xảy ra, không cần chặn trước."}
        ],
        "correct_answer": "B",
        "misconception_id": "unsafe_write_tool"
    }
]


@router.get("/session", response_model=GameSession)
def get_session(index: int = Query(default=0, ge=0)) -> GameSession:
    question_index = index % len(MOCK_DAILY_RECALL_QUEUE)
    item = MOCK_DAILY_RECALL_QUEUE[question_index]
    return GameSession(
        mode=GameMode.daily_recall,
        session_id=f"dr-{uuid.uuid4().hex[:8]}",
        title=item["title"],
        prompt=item["prompt"],
        evidence_ids=item["evidence_ids"],
        payload={
            "question_id": item["question_id"],
            "queue_size": len(MOCK_DAILY_RECALL_QUEUE),
            "current_index": question_index + 1,
            "due_reason": item["due_reason"],
            "options": item["options"],
            "all_questions": [
                {
                    "question_id": q["question_id"],
                    "title": q["title"],
                    "prompt": q["prompt"],
                    "evidence_ids": q["evidence_ids"],
                    "due_reason": q["due_reason"],
                    "options": q["options"],
                }
                for q in MOCK_DAILY_RECALL_QUEUE
            ],
        },
    )


@router.post("/submit", response_model=GameResult)
def submit(request: GameSubmitRequest) -> GameResult:
    item = next(
        (q for q in MOCK_DAILY_RECALL_QUEUE if q["question_id"] == request.question_id),
        MOCK_DAILY_RECALL_QUEUE[0]
    )

    user_ans = request.answer.strip().upper()
    
    # Handle SKIP action explicitly
    if user_ans == "SKIP":
        result = GameResult(
            mode=GameMode.daily_recall,
            correct=False,
            status=GameStatus.needs_clarification,
            feedback=f"Bạn đã bỏ qua câu hỏi này (Recall Gap). Khái niệm [{item['question_id']}] đã được tự động thêm vào Error Dungeon để bạn ôn lại.",
            evidence_ids=item["evidence_ids"],
            misconception_id=item["misconception_id"],
            xp=0,
            mastery_delta=0,
            recovery_created=True, # Push to Error Dungeon!
            next_action="Khái niệm đã được đẩy sang Error Dungeon. Tiếp tục sang câu tiếp theo.",
        )
        return record_result(request.user_id, request.model_dump(), result)

    is_correct = user_ans == item["correct_answer"]
    confidence = request.confidence

    if is_correct:
        if confidence >= 3:
            status = GameStatus.mastered
            feedback = f"Chính xác! Bạn đã ghi nhớ đúng kiến thức đối chiếu bài giảng [{', '.join(item['evidence_ids'])}]."
            xp = 50
            mastery_delta = 10
            recovery_created = False
            next_action = "Tuyệt vời! Bấm 'Sang câu tiếp theo' để hoàn thành các câu ôn tập còn lại."
        else:
            status = GameStatus.partial
            feedback = "Đáp án chính xác, nhưng mức tự tin của bạn còn thấp. Cần củng cố thêm!"
            xp = 30
            mastery_delta = 4
            recovery_created = False
            next_action = "Lưu câu hỏi này vào lượt ôn ngắn sắp tới."
        misconception_id = ""
    else:
        status = GameStatus.misconception
        misconception_id = item["misconception_id"]
        recovery_created = True
        if confidence >= 4:
            feedback = "Bạn trả lời SAI mặc dù rất tự tin! Đây là hiểu lầm nghiêm trọng (Overconfidence Misconception)."
            xp = 0
            mastery_delta = -5
            next_action = "🚨 Lỗi sai này đã được tự động lưu vào Error Dungeon để bạn tiêu diệt!"
        else:
            feedback = f"Đáp án chưa chính xác. Đọc lại bài giảng [{', '.join(item['evidence_ids'])}] để hiểu đúng bản chất."
            xp = 10
            mastery_delta = 0
            next_action = "Đã lưu câu hỏi này vào danh sách Recovery của Error Dungeon. Bạn có thể sang câu tiếp theo."

    result = GameResult(
        mode=GameMode.daily_recall,
        correct=is_correct,
        status=status,
        feedback=feedback,
        evidence_ids=item["evidence_ids"],
        misconception_id=misconception_id,
        xp=xp,
        mastery_delta=mastery_delta,
        recovery_created=recovery_created,
        next_action=next_action,
    )
    return record_result(request.user_id, request.model_dump(), result)
