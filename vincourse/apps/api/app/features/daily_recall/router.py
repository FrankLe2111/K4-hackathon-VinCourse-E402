import uuid
from fastapi import APIRouter, Query
from app.schemas import GameMode, GameResult, GameSession, GameStatus, GameSubmitRequest
from app.storage.memory import record_result

router = APIRouter(tags=["daily-recall"])

MOCK_DAILY_RECALL_QUEUE = [
    {
        "question_id": "q-dr-001",
        "title": "Day 4 — Prompt Fundamentals (1/5)",
        "prompt": "Theo slide “4 Thành Phần Của Prompt Tốt”, 4 thành phần RTCF là gì?",
        "evidence_ids": ["Day4 slide 5"],
        "due_reason": "Ôn tập RTCF",
        "options": [
            {"id": "A", "text": "Role, Task, Context, Format."},
            {"id": "B", "text": "Reasoning, Temperature, Code, Feedback."},
            {"id": "C", "text": "Retrieval, Tool, Cache, Function."},
            {"id": "D", "text": "Read, Transform, Classify, Fine-tune."}
        ],
        "correct_answer": "A",
        "misconception_id": "prompt_without_structure"
    },
    {
        "question_id": "q-dr-002",
        "title": "Day 4 — Prompt Priority (2/5)",
        "prompt": "Slide Day4 khuyên nên bắt đầu prompt tốt bằng thành phần nào trước?",
        "evidence_ids": ["Day4 slide 5"],
        "due_reason": "Ôn tập cách viết prompt thực dụng",
        "options": [
            {"id": "A", "text": "Task + Format; chỉ thêm Role/Context khi chúng cải thiện chất lượng hoặc nhất quán."},
            {"id": "B", "text": "Role + Context; luôn bỏ Task và Format để model tự linh hoạt."},
            {"id": "C", "text": "Temperature + top_p; prompt không quan trọng nếu sampling đúng."},
            {"id": "D", "text": "Ví dụ thật dài; càng nhiều ví dụ càng tốt."}
        ],
        "correct_answer": "A",
        "misconception_id": "role_context_overuse"
    },
    {
        "question_id": "q-dr-003",
        "title": "Day 4 — Specificity Beats Cleverness (3/5)",
        "prompt": "Theo slide “Prompt = Interface…”, vì sao prompt “Viết email cho tôi” là prompt kém?",
        "evidence_ids": ["Day4 slide 4"],
        "due_reason": "Ôn tập prompt cụ thể",
        "options": [
            {"id": "A", "text": "Vì không rõ gửi ai, về việc gì, tone nào, dài bao nhiêu."},
            {"id": "B", "text": "Vì prompt ngắn luôn làm model từ chối trả lời."},
            {"id": "C", "text": "Vì email không phải use case AI hợp lệ."},
            {"id": "D", "text": "Vì thiếu Chain-of-Thought nên không thể viết email."}
        ],
        "correct_answer": "A",
        "misconception_id": "vague_prompt_is_enough"
    },
    {
        "question_id": "q-dr-004",
        "title": "Day 4 — Advanced Prompting (4/5)",
        "prompt": "Theo slide “Zero-shot, One-shot, Few-shot, CoT”, thứ tự thử thực dụng là gì?",
        "evidence_ids": ["Day4 slide 13"],
        "due_reason": "Ôn tập khi nào dùng kỹ thuật nâng cao",
        "options": [
            {"id": "A", "text": "Zero-shot → few-shot → decomposition / CoT."},
            {"id": "B", "text": "CoT → Tree-of-Thought → few-shot → zero-shot."},
            {"id": "C", "text": "Luôn dùng CoT trước vì mọi task đều cần reasoning dài."},
            {"id": "D", "text": "Luôn dùng nhiều hơn 5 ví dụ để tăng độ chính xác."}
        ],
        "correct_answer": "A",
        "misconception_id": "advanced_prompting_first"
    },
    {
        "question_id": "q-dr-005",
        "title": "Day 4 — System Prompt Testing (5/5)",
        "prompt": "Checklist test system prompt trong slide Day4 bao gồm điều nào?",
        "evidence_ids": ["Day4 slide 26"],
        "due_reason": "Ôn tập production-grade system prompt",
        "options": [
            {"id": "A", "text": "Happy path, edge case, out-of-scope, adversarial injection, tool decision, format consistency."},
            {"id": "B", "text": "Chỉ kiểm tra một câu happy path là đủ nếu model trả lời hay."},
            {"id": "C", "text": "Chỉ đo tốc độ phản hồi, không cần kiểm tra refusal hay tool failure."},
            {"id": "D", "text": "Không cần test system prompt vì system prompt luôn được model tuân thủ tuyệt đối."}
        ],
        "correct_answer": "A",
        "misconception_id": "untested_system_prompt"
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
