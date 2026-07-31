from __future__ import annotations

from typing import Any

from app.ai.client import get_openai_client
from app.core.config import settings


def _ai_text(prompt: str, fallback: str) -> str:
    if not settings.openai_api_key:
        return fallback
    try:
        response = get_openai_client().chat.completions.create(
            model=settings.openai_model,
            messages=[
                {"role": "system", "content": "You are VinCourse's friendly AI learning coach. Be concise, concrete, and encouraging. Reply in Vietnamese."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.2,
            max_tokens=220,
        )
        content = response.choices[0].message.content
        return content.strip() if content else fallback
    except Exception:
        return fallback


def daily_recall_pack() -> dict[str, Any]:
    return {
        "summary": [
            "Prompt là giao diện giữa ý định của người học và hành vi của model; càng cụ thể càng dễ kiểm soát.",
            "RTCF gồm Role, Task, Context, Format; bắt đầu với Task + Format trước khi thêm chi tiết nâng cao.",
            "Negative prompt nên đi kèm hướng thay thế tích cực: nói model nên làm gì thay vì chỉ nói đừng.",
            "Zero-shot là baseline; few-shot giúp format/consistency; decomposition/CoT dùng khi bài có nhiều bước suy luận.",
            "System prompt production-grade cần persona, rules, capabilities, constraints, output format và test adversarial.",
        ],
        "flashcards": [
            {"front": "RTCF là gì?", "back": "Role, Task, Context, Format."},
            {"front": "Prompt tốt bắt đầu từ đâu?", "back": "Task rõ + Format mong muốn; thêm Role/Context khi cần."},
            {"front": "Vì sao phải test system prompt?", "back": "Để bắt edge case, out-of-scope, prompt injection, tool failure và lệch format."},
        ],
        "generated_questions": [
            "Nếu prompt quá mơ hồ, thông tin nào cần bổ sung đầu tiên?",
            "Khi nào few-shot hữu ích hơn zero-shot?",
            "Một test adversarial cho system prompt nên kiểm tra điều gì?",
        ],
    }


def daily_recall_feedback(prompt: str, correct: bool, base_feedback: str) -> str:
    fallback = (
        f"{base_feedback} AI Coach: Tốt rồi — hãy tự nói lại ý chính bằng một câu để chuyển kiến thức sang trí nhớ dài hạn."
        if correct
        else f"{base_feedback} AI Coach: Đừng học thuộc đáp án; hãy quay lại slide nguồn và tìm từ khóa chứng minh vì sao lựa chọn đúng hợp lý hơn."
    )
    return _ai_text(f"Give friendly feedback for this Daily Recall answer. Correct={correct}. Question: {prompt}. Base feedback: {base_feedback}", fallback)


def story_mentor_feedback(concept_id: str, correct: bool, base_feedback: str) -> str:
    fallback = (
        f"{base_feedback} Mira: Bạn đã chốt đúng khái niệm `{concept_id}`. Giữ nhịp này và thử giải thích lại bằng ví dụ của bạn."
        if correct
        else f"{base_feedback} Mira: Lỗi này đang chỉ ra điểm cần sửa ở `{concept_id}`. Hãy đọc gợi ý, tìm một bằng chứng trong câu hỏi, rồi thử lại."
    )
    return _ai_text(f"Coach a Story Quest learner. Concept={concept_id}. Correct={correct}. Base feedback={base_feedback}", fallback)


def lab_code_hint(code: str, output: str) -> str:
    if "NotImplementedError" in output or "pass" in code:
        fallback = "AI Coach: Bạn mới có khung hàm. Bước đầu hãy tạo `graph`, `indegree`, rồi gom toàn bộ tool có indegree bằng 0 thành round đầu tiên."
    elif "AssertionError" in output:
        fallback = "AI Coach: Logic gần đúng rồi. Hãy kiểm tra 3 điểm: sort tool trong cùng round, không chạy tool vừa mở khóa ngay trong round hiện tại, và trả `[]` khi có cycle."
    else:
        fallback = "AI Coach: Hãy in thử schedule cho example 1 và so sánh từng round; lỗi thường nằm ở cách cập nhật `next_round`."
    return _ai_text(f"Give one concise debugging hint for this Python lab without revealing full solution. Code:\n{code[-1200:]}\nOutput:\n{output[-1200:]}", fallback)


def error_repair_plan(data: dict[str, Any]) -> dict[str, Any]:
    misconception = data.get("misconception_id", "misconception")
    return {
        "mentor_line": _ai_text(
            f"Explain this misconception repair in one encouraging sentence: {misconception}",
            f"AI Coach: Quái vật này không đáng sợ — nó chỉ là một hiểu lầm cụ thể về `{misconception}` cần được sửa bằng bằng chứng.",
        ),
        "repair_steps": [
            "So sánh câu trả lời cũ với đáp án đúng để tìm điểm lệch.",
            "Đọc lại nguồn và gạch chân bằng chứng chống lại hiểu lầm.",
            "Giải tình huống chuyển giao bằng cùng nguyên lý, không học thuộc câu cũ.",
        ],
        "transfer_drill": f"Tự đặt thêm một ví dụ mới liên quan `{misconception}` và giải thích vì sao đáp án đúng vẫn áp dụng.",
    }


def error_dungeon_feedback(correct: bool, misconception_id: str, base_feedback: str) -> str:
    fallback = (
        f"{base_feedback} AI Coach: Bạn đã sửa được mô hình suy nghĩ, không chỉ chọn đúng đáp án."
        if correct
        else f"{base_feedback} AI Coach: Hãy quay lại bước 1: viết ra vì sao đáp án cũ hấp dẫn nhưng sai."
    )
    return _ai_text(f"Give Error Dungeon feedback. Correct={correct}. Misconception={misconception_id}. Base={base_feedback}", fallback)


def boss_class_coach(teams: list[dict[str, Any]], correct_rate: int, threshold: int) -> str:
    wrong = [team.get("name", "Team") for team in teams if not team.get("correct")]
    fallback = (
        f"AI Coach: Lớp đã đạt {correct_rate}% — đủ ngưỡng {threshold}%, mở khóa một đòn đánh Boss. Team còn sai nên xem lại misconception trước round sau."
        if correct_rate >= threshold
        else f"AI Coach: Lớp mới đạt {correct_rate}%. Cần kéo thêm {threshold - correct_rate}% nữa; ưu tiên hỗ trợ {', '.join(wrong) or 'các team chưa chắc'}."
    )
    return _ai_text(f"Summarize class boss battle performance. Correct rate={correct_rate}, threshold={threshold}, wrong teams={wrong}", fallback)
