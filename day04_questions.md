# Câu hỏi ôn tập Ngày 4: Prompt Engineering & Tool Calling

Dưới đây là danh sách các câu hỏi ôn tập dựa trên tài liệu bài học "Day 04 - Prompt Engineering & Tool Calling":

## Phần 1: Prompt Fundamentals
1. **4 thành phần cơ bản của một Prompt tốt (RTCF) là gì?** Trong 4 thành phần đó, 2 thành phần nào quan trọng nhất và nên được ưu tiên bắt đầu trước?
2. **System prompt và User prompt khác nhau như thế nào?** Trong kiến trúc của một ứng dụng AI, loại prompt nào có mức độ ưu tiên và quyền hạn cao hơn đối với hành vi của model?
3. **Mục đích của việc sử dụng các thẻ XML (như `<system_role>`, `<instructions>`, `<user_input>`) trong Prompt là gì?** ## Phần 2: Context Engineering
4. **Hiện tượng "Context Bleed" (trôi ngữ cảnh) là gì?** Nêu cách sử dụng Delimiters (nhãn phân tách) để khắc phục lỗi này và bảo vệ hệ thống khỏi Prompt Injection.
5. **Khái niệm "Context Rot" (thối rữa ngữ cảnh) có nghĩa là gì?** Tại sao trong Context Engineering, việc cung cấp "càng nhiều thông tin càng tốt" không phải lúc nào cũng đúng?
6. **Hãy kể tên 3 kỹ thuật nén ngữ cảnh (Context Compression) chính** được sử dụng khi lịch sử hội thoại (history) quá dài.

## Phần 3: Kỹ thuật Prompting Nâng Cao (Advanced Prompting)
7. **So sánh ngắn gọn các phương pháp: Zero-shot, One-shot, Few-shot và Chain-of-Thought (CoT).** Khi nào thì việc sử dụng CoT có thể gây hại thay vì mang lại lợi ích?
8. **Structured Output Prompting là gì?** Tại sao nó lại đặc biệt quan trọng khi xây dựng các Agent pipeline?

## Phần 4: Tool Calling & Control
9. **Mô tả 4 bước bắt buộc trong kiến trúc Vòng lặp Tool Calling (Tool Calling Loop).**
10. **Tại sao việc khai báo mảng `required` trong JSON Schema của Tool lại quan trọng?** Điều gì xảy ra nếu model thiếu thông tin bắt buộc khi được gọi tool?
11. **Sự khác biệt cốt lõi giữa Read Tool (Công cụ đọc) và Write Tool (Công cụ ghi) là gì?** Đối với các Write Tool (như gửi email, thanh toán), cơ chế kiểm soát (Control) nào là bắt buộc phải có?
12. **Bản đồ 4 lớp (Prompt, Context, Tool, Control) trong việc Debug AI App có ý nghĩa gì?** Nếu model bịa ra một mức giá không có thật, lỗi thường nằm ở lớp nào và cách khắc phục ra sao?
