import uuid
from fastapi import APIRouter, Query
from app.schemas import GameMode, GameResult, GameSession, GameStatus, GameSubmitRequest
from app.storage.memory import record_result

router = APIRouter(tags=["daily-recall"])

MOCK_DAILY_RECALL_QUEUE = [
    {
        "question_id": "q-dr-001",
        "title": "Daily Recall — Ôn Tập Hàng Ngày (1/4)",
        "prompt": "Vì sao cần thực hiện Feature Scaling (Chuẩn hóa dữ liệu) trước khi chạy Gradient Descent trong Machine Learning?",
        "evidence_ids": ["T02-034"],
        "due_reason": "Chưa ôn lại sau 7 ngày",
        "options": [
            {"id": "A", "text": "Giúp bề mặt hàm mất mát cân đối, từ đó Gradient Descent hội tụ nhanh và ổn định hơn."},
            {"id": "B", "text": "Chỉ nhằm mục đích giảm dung lượng RAM sử dụng khi huấn luyện mô hình."},
            {"id": "C", "text": "Nhằm thay thế số lượng Epochs cần chạy khi mô hình bị overfitting."},
            {"id": "D", "text": "Tự động phát hiện và xóa các dòng dữ liệu bị thiếu (Missing Values)."}
        ],
        "correct_answer": "A",
        "misconception_id": "more_epochs_fix_scaling"
    },
    {
        "question_id": "q-dr-002",
        "title": "Daily Recall — Ôn Tập Hàng Ngày (2/4)",
        "prompt": "Mối quan hệ chính xác giữa LLM (Large Language Model) và Chatbot là gì?",
        "evidence_ids": ["T04-046"],
        "due_reason": "Tự tin thấp ở lần học trước",
        "options": [
            {"id": "A", "text": "LLM và Chatbot là hai tên gọi hoàn toàn giống nhau của cùng một sản phẩm."},
            {"id": "B", "text": "LLM là mô hình nền tảng bên dưới (underlying model), còn Chatbot là lớp giao diện tương tác người dùng."},
            {"id": "C", "text": "Chatbot sinh ra LLM khi người dùng đặt câu hỏi."},
            {"id": "D", "text": "Chatbot chỉ hoạt động offline còn LLM luôn hoạt động online."}
        ],
        "correct_answer": "B",
        "misconception_id": "llm_equals_chatbot"
    },
    {
        "question_id": "q-dr-003",
        "title": "Daily Recall — Ôn Tập Hàng Ngày (3/4)",
        "prompt": "Vì sao LLM lại có thể xảy ra hiện tượng Hallucination (Ảo giác / Sinh thông tin sai)?",
        "evidence_ids": ["T04-047", "T04-048"],
        "due_reason": "Câu từng làm sai tuần trước",
        "options": [
            {"id": "A", "text": "Vì LLM cố tình nói dối người dùng khi bị quá tải server."},
            {"id": "B", "text": "Vì cơ chế cốt lõi của LLM là dự đoán token tiếp theo theo xác suất, không bảo đảm tính đúng sự thật."},
            {"id": "C", "text": "Vì dữ liệu huấn luyện của LLM không có bất kỳ thông tin nào đúng."},
            {"id": "D", "text": "Vì LLM không thể viết được mã nguồn lập trình."}
        ],
        "correct_answer": "B",
        "misconception_id": "hallucination_intentional_lie"
    },
    {
        "question_id": "q-dr-004",
        "title": "Daily Recall — Ôn Tập Hàng Ngày (4/4)",
        "prompt": "Nguyên tắc lựa chọn giữa Augment (Hỗ trợ) và Automate (Tự động hóa hoàn toàn) cho công việc là gì?",
        "evidence_ids": ["T02-032"],
        "due_reason": "Lịch ôn tập định kỳ 14 ngày",
        "options": [
            {"id": "A", "text": "Công việc có rủi ro/hậu quả sai lầm (cost-of-error) càng cao thì càng nên Augment (giữ con người giám sát)."},
            {"id": "B", "text": "Nên Automate 100% mọi công việc để tiết kiệm thời gian tối đa."},
            {"id": "C", "text": "Công việc càng quan trọng thì càng nên bỏ con người ra khỏi luồng quyết định."},
            {"id": "D", "text": "Augment và Automate không khác nhau về mức độ kiểm soát của con người."}
        ],
        "correct_answer": "A",
        "misconception_id": "automate_high_risk_tasks"
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
