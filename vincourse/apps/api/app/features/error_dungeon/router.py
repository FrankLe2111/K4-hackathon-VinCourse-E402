import uuid
from fastapi import APIRouter, Query
from app.ai.tutor import error_dungeon_feedback, error_repair_plan
from app.schemas import GameMode, GameResult, GameSession, GameStatus, GameSubmitRequest
from app.storage.memory import get_user_recovery_queue, record_result

router = APIRouter(tags=["error-dungeon"])

DEFAULT_MISCONCEPTION = {
    "misconception_id": "more_epochs_fix_scaling",
    "title": "Error Dungeon — Sửa Lỗi: Feature Scaling vs Epochs",
    "prompt": "Nhiệm vụ Cứu Hoãn: Đối chiếu lỗi sai cũ, học bài giảng chuẩn và vận dụng giải quyết tình huống mới.",
    "evidence_ids": ["T02-034"],
    "original_question": "Vì sao cần thực hiện Feature Scaling (Chuẩn hóa dữ liệu) trước khi chạy Gradient Descent trong Machine Learning?",
    "old_wrong_answer": "Nhằm thay thế số lượng Epochs cần chạy khi mô hình bị overfitting.",
    "original_correct_answer": "Giúp bề mặt hàm mất mát cân đối, từ đó Gradient Descent hội tụ nhanh và ổn định hơn.",
    "source_summary": "Tài liệu [T02-034] xác nhận: Feature Scaling chuẩn hóa quy mô thuộc tính làm bề mặt loss dạng hình tròn thay vì elip kéo giãn. Tăng Epochs chỉ kéo dài thời gian train chứ không sửa được độ lệch hướng của Gradient.",
    "transfer_question": "Tình huống mới: Dataset giá nhà gồm Diện tích (50 - 500 m²) và Số phòng ngủ (1 - 5 phòng). Mô hình Gradient Descent bị dao động ziczac và không hội tụ. Giải pháp chuẩn xác nhất là gì?",
    "transfer_options": [
        {
            "id": "A",
            "text": "Áp dụng StandardScaler/MinMaxScaler để đưa Diện tích và Số phòng về cùng quy mô chuẩn trước khi train.",
        },
        {
            "id": "B",
            "text": "Giữ nguyên dữ liệu, tăng Epochs lên gấp 50 lần và tăng Learning Rate cực đại.",
        },
        {
            "id": "C",
            "text": "Xóa bỏ thuộc tính Số phòng ngủ vì quy mô của nó quá nhỏ so với Diện tích.",
        },
    ],
    "correct_transfer_option": "A",
}

MISCONCEPTION_BANK = {
    "more_epochs_fix_scaling": DEFAULT_MISCONCEPTION,
    "llm_equals_chatbot": {
        "misconception_id": "llm_equals_chatbot",
        "title": "Error Dungeon — Sửa Lỗi: LLM vs Chatbot Interface",
        "prompt": "Nhiệm vụ Cứu Hoãn: Đối chiếu lỗi sai cũ, học bài giảng chuẩn và vận dụng giải quyết tình huống mới.",
        "evidence_ids": ["T04-046"],
        "original_question": "Mối quan hệ chính xác giữa LLM (Large Language Model) và Chatbot là gì?",
        "old_wrong_answer": "LLM và Chatbot là hai tên gọi hoàn toàn giống nhau của cùng một sản phẩm.",
        "original_correct_answer": "LLM là mô hình nền tảng bên dưới (underlying model), còn Chatbot là lớp giao diện tương tác người dùng.",
        "source_summary": "Tài liệu [T04-046] xác nhận: LLM đảm nhận phần trí tuệ suy luận nền tảng bên dưới, trong khi Chatbot đóng vai trò là lớp giao diện phần mềm (UI wrapper) để tiếp nhận prompt và hiển thị kết quả.",
        "transfer_question": "Tình huống mới: Công ty bạn tích hợp GPT-4 vào hệ thống Tổng đài CSKH tự động. Vai trò của từng thành phần là gì?",
        "transfer_options": [
            {
                "id": "A",
                "text": "GPT-4 là mô hình AI nền tảng xử lý suy luận ngôn ngữ, còn Tổng đài là lớp ứng dụng tích hợp giao diện.",
            },
            {
                "id": "B",
                "text": "GPT-4 và Tổng đài là một sản phẩm đóng gói duy nhất không thể tách rời.",
            },
            {
                "id": "C",
                "text": "Tổng đài tạo ra kiến thức suy luận còn GPT-4 chỉ đóng vai trò truyền dữ liệu âm thanh.",
            },
        ],
        "correct_transfer_option": "A",
    },
    "hallucination_intentional_lie": {
        "misconception_id": "hallucination_intentional_lie",
        "title": "Error Dungeon — Sửa Lỗi: Bản Chất Hallucination",
        "prompt": "Nhiệm vụ Cứu Hoãn: Đối chiếu lỗi sai cũ, học bài giảng chuẩn và vận dụng giải quyết tình huống mới.",
        "evidence_ids": ["T04-047", "T04-048"],
        "original_question": "Vì sao LLM lại có thể xảy ra hiện tượng Hallucination (Ảo giác / Sinh thông tin sai)?",
        "old_wrong_answer": "Vì LLM cố tình nói dối người dùng khi bị quá tải server.",
        "original_correct_answer": "Vì cơ chế cốt lõi của LLM là dự đoán token tiếp theo theo xác suất, không bảo đảm tính đúng sự thật.",
        "source_summary": "Tài liệu [T04-047, T04-048] xác nhận: Hallucination sinh ra do mô hình dự đoán chuỗi token có xác suất cao tiếp theo, không xuất phát từ nhận thức hay ý định 'nói dối'.",
        "transfer_question": "Tình huống mới: Khi một Chatbot AI trích dẫn một cuốn sách không có thật trong thực tế, giải thích kỹ thuật nào chuẩn nhất?",
        "transfer_options": [
            {
                "id": "A",
                "text": "Mô hình đã tự động sinh các token tiếp theo có xác suất kết hợp cao nhất chứ không tra cứu cơ sở dữ liệu sự thật.",
            },
            {
                "id": "B",
                "text": "Mô hình cố tình lừa đảo người dùng để hoàn thành câu trả lời.",
            },
            {
                "id": "C",
                "text": "Cuốn sách đó chắc chắn có thật nhưng người dùng chưa tìm ra.",
            },
        ],
        "correct_transfer_option": "A",
    },
    "automate_high_risk_tasks": {
        "misconception_id": "automate_high_risk_tasks",
        "title": "Error Dungeon — Sửa Lỗi: Augment vs Automate",
        "prompt": "Nhiệm vụ Cứu Hoãn: Đối chiếu lỗi sai cũ, học bài giảng chuẩn và vận dụng giải quyết tình huống mới.",
        "evidence_ids": ["T02-032"],
        "original_question": "Nguyên tắc lựa chọn giữa Augment (Hỗ trợ) và Automate (Tự động hóa hoàn toàn) cho công việc là gì?",
        "old_wrong_answer": "Nên Automate 100% mọi công việc để tiết kiệm thời gian tối đa.",
        "original_correct_answer": "Công việc có rủi ro/hậu quả sai lầm (cost-of-error) càng cao thì càng nên Augment (giữ con người giám sát).",
        "source_summary": "Tài liệu [T02-032] xác nhận: Công việc có hậu quả sai lầm càng lớn thì càng phải sử dụng cơ chế Augment để con người duy trì quyền kiểm soát và phê duyệt cuối cùng.",
        "transfer_question": "Tình huống mới: Hệ thống AI chẩn đoán hình ảnh y tế phát hiện khối u nghi ngờ. Thiết kế nào tuân thủ đúng nguyên tắc Augment?",
        "transfer_options": [
            {
                "id": "A",
                "text": "AI khoanh vùng nghi ngờ và đưa ra mức độ tin cậy để bác sĩ chuyên khoa xem xét và đưa ra quyết định cuối cùng.",
            },
            {
                "id": "B",
                "text": "AI tự động gửi đơn thuốc và lên lịch phẫu thuật cho bệnh nhân mà không cần bác sĩ duyệt.",
            },
            {
                "id": "C",
                "text": "AI tự động xóa bỏ các hình ảnh có nghi ngờ khối u.",
            },
        ],
        "correct_transfer_option": "A",
    },
}

def get_misconception_info(item: dict) -> dict:
    mid = item.get("misconception_id", "more_epochs_fix_scaling")
    if mid in MISCONCEPTION_BANK:
        return MISCONCEPTION_BANK[mid]
    
    # Build dynamic misconception entry for any unbanked item from Story Quest or Daily Recall
    concept_title = mid.replace("-", " ").replace("_", " ").title()
    feedback_text = item.get("feedback", "Lựa chọn chưa chính xác hoặc đã chọn Bỏ qua.")
    
    return {
        "misconception_id": mid,
        "title": f"Error Dungeon — Khắc Phục: {concept_title}",
        "prompt": "Nhiệm vụ Cứu Hoãn: Đối chiếu lỗi sai cũ, học bài giảng chuẩn và vận dụng giải quyết tình huống mới.",
        "evidence_ids": ["T01-001"],
        "original_question": f"Khái niệm: {concept_title}. Thử thách ôn tập từ {item.get('mode', 'Story Quest').title()}.",
        "old_wrong_answer": feedback_text,
        "original_correct_answer": f"Đọc kỹ nguyên lý cốt lõi của {concept_title} và áp dụng đúng quy trình suy luận.",
        "source_summary": f"Tài liệu khóa học xác nhận: Cần nắm vững bản chất kỹ thuật của {concept_title} để tránh đưa ra dự đoán hoặc lựa chọn thiếu căn cứ.",
        "transfer_question": f"Tình huống thực tế: Vận dụng nguyên lý {concept_title} vào hệ thống AI mới. Đâu là giải pháp chuẩn xác nhất?",
        "transfer_options": [
            {
                "id": "A",
                "text": f"Áp dụng đúng quy trình phân tích và kiểm chứng bản chất của {concept_title}.",
            },
            {
                "id": "B",
                "text": f"Bỏ qua bước kiểm chứng và chọn ngẫu nhiên giải pháp.",
            },
            {
                "id": "C",
                "text": f"Tự động hóa hoàn toàn mà không cần con người xem xét.",
            },
        ],
        "correct_transfer_option": "A",
    }


@router.get("/session", response_model=GameSession)
def get_session(user_id: str = "demo-user", index: int = Query(default=0, ge=0)) -> GameSession:
    recovery_items = get_user_recovery_queue(user_id)
    
    if not recovery_items:
        return GameSession(
            mode=GameMode.error_dungeon,
            session_id=f"ed-{uuid.uuid4().hex[:8]}",
            title="Error Dungeon — Hầm Ngục Trống 🛡️",
            prompt="🎉 Chúc mừng! Bạn hiện không có lỗi sai nào trong hàng đợi cứu hoãn. Hãy sang Daily Recall hoặc Story Quest làm bài.",
            evidence_ids=[],
            payload={"empty": True, "misconception_id": ""},
        )

    # Format all active recovery items in queue
    all_unresolved = []
    for item in recovery_items:
        info = get_misconception_info(item)
        repair = error_repair_plan(info)
        all_unresolved.append({
            "misconception_id": info["misconception_id"],
            "title": info["title"],
            "prompt": info["prompt"],
            "evidence_ids": info["evidence_ids"],
            "original_question": info["original_question"],
            "old_wrong_answer": info["old_wrong_answer"],
            "original_correct_answer": info["original_correct_answer"],
            "source_summary": info["source_summary"],
            "transfer_question": info["transfer_question"],
            "transfer_options": info["transfer_options"],
            "ai_mentor_line": repair["mentor_line"],
            "ai_repair_steps": repair["repair_steps"],
            "ai_transfer_drill": repair["transfer_drill"],
        })

    active_index = index % len(all_unresolved)
    data = all_unresolved[active_index]

    return GameSession(
        mode=GameMode.error_dungeon,
        session_id=f"ed-{uuid.uuid4().hex[:8]}",
        title=data["title"],
        prompt=data["prompt"],
        evidence_ids=data["evidence_ids"],
        payload={
            "misconception_id": data["misconception_id"],
            "steps": ["review", "explain", "transfer"],
            "original_question": data["original_question"],
            "old_wrong_answer": data["old_wrong_answer"],
            "original_correct_answer": data["original_correct_answer"],
            "source_summary": data["source_summary"],
            "transfer_question": data["transfer_question"],
            "transfer_options": data["transfer_options"],
            "queue_size": len(all_unresolved),
            "current_index": active_index + 1,
            "all_unresolved": all_unresolved,
            "ai_mentor_line": data["ai_mentor_line"],
            "ai_repair_steps": data["ai_repair_steps"],
            "ai_transfer_drill": data["ai_transfer_drill"],
        },
    )


@router.post("/submit", response_model=GameResult)
def submit(request: GameSubmitRequest) -> GameResult:
    target_id = request.question_id
    item_stub = {"misconception_id": target_id}
    data = get_misconception_info(item_stub)

    user_answer = request.answer.strip()
    is_correct = user_answer.upper() == data.get("correct_transfer_option", "A") or len(user_answer) > 20

    if is_correct:
        status = GameStatus.mastered
        feedback = f"💥 CHÚC MỪNG! Bạn đã tiêu diệt hoàn toàn Quái vật Lỗi sai ({data.get('misconception_id', target_id)})! Lỗi này đã được xóa khỏi Error Dungeon."
        xp = 100  # Recovery Bonus XP
        mastery_delta = 15
        recovery_created = False  # Misconception is now RESOLVED!
        next_action = "🏆 Lỗi sai đã được giải phóng khỏi Error Dungeon! Bạn nhận +100 Recovery XP Bonus."
    else:
        status = GameStatus.misconception
        feedback = f"Chưa chính xác. Lựa chọn này vẫn chưa khắc phục được hiểu lầm. Lỗi sai này VẪN ĐƯỢC GIỮ LẠI trong Error Dungeon cho đến khi bạn tiêu diệt được."
        xp = 0
        mastery_delta = 0
        recovery_created = True  # Still unresolved! STAYS IN DUNGEON!
        next_action = "Quái vật Lỗi sai vẫn chưa bị tiêu diệt và tiếp tục ở lại Hầm ngục. Hãy đọc lại gợi ý nguồn và thử lại."

    result = GameResult(
        mode=GameMode.error_dungeon,
        correct=is_correct,
        status=status,
        feedback=error_dungeon_feedback(is_correct, data.get("misconception_id", target_id), feedback),
        evidence_ids=data.get("evidence_ids", []),
        misconception_id=data.get("misconception_id", target_id),
        xp=xp,
        mastery_delta=mastery_delta,
        recovery_created=recovery_created,
        next_action=next_action,
    )
    return record_result(request.user_id, request.model_dump(), result)
