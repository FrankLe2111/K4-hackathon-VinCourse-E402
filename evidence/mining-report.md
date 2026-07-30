# Evidence report — VLearn understanding gap

## Kết luận

Trong 1.261 lượt hỏi–đáp của 369 học viên, VLearn làm tốt việc *giải thích* nhưng gần như không khép vòng lặp *kiểm tra hiểu*: chỉ 3/1.261 lượt (0,2%) có `asked_check_question=True`; 1.243/1.245 lượt có move giải thích/trả lời/ví dụ/gợi ý không hỏi kiểm tra lại; `misconceptions` và `follow_ups` rỗng ở toàn bộ 1.261 lượt.

Điều dữ liệu chứng minh là **thiếu bằng chứng người học đã hiểu sau câu trả lời**, không phải “1.258 lượt đều sai”. Đây là ranh giới diễn giải quan trọng.

## Phương pháp có thể kiểm lại

1. Đọc `DATA_DICTIONARY.md`, xác nhận mỗi `turn_id` có đúng một dòng `student` và một dòng `tutor`.
2. Giữ một dòng `role=tutor` cho mỗi turn; không dùng phân loại cảm tính hay LLM.
3. Đếm trực tiếp `asked_check_question`, JSON `misconceptions`, JSON `follow_ups`, JSON `citations`, `move_used` và `avg_latency_ms`.
4. “Teaching move” được chốt trước khi đếm là một trong `review_concept`, `give_direct_answer`, `give_example`, `give_hint`.
5. Chạy lại bằng `python3 evidence/analyze_chatlog.py` từ thư mục gốc.

## Số liệu

| Signal | Kết quả | Ý nghĩa hợp lệ |
|---|---:|---|
| Understanding check | 3/1.261 (0,2%) | Gần như không thu bằng chứng hiểu sau trả lời |
| Teaching move không có check | 1.243/1.245 (99,8%) | Flow chủ yếu dừng ở truyền đạt một chiều |
| `misconceptions=[]` | 1.261/1.261 (100%) | Chưa có misconception memory dùng được |
| `follow_ups=[]` | 1.261/1.261 (100%) | Chưa tạo bước học kế tiếp từ turn hiện tại |
| Không citation | 582/1.261 (46,2%) | Gần nửa output khó tự đối chiếu nguồn |
| Latency ≥5 giây | 49/1.261 (3,9%) | Có pain tốc độ nhưng hẹp hơn understanding gap |
| Độ dài trung vị | Student 97 · tutor 761 ký tự | Tutor thường nói dài hơn 7,8 lần input |

## Năm ví dụ nguyên văn, có mã truy vết

Các ví dụ dưới đều có `move_used=review_concept`, `asked_check_question=False`, `misconceptions=[]`, `follow_ups=[]`:

- `T0720`: “vậy prompt engineerig có phải là mô tả lại ngữ cảnh của câu để cho AI hiểu rõ hơn không”
- `T0923`: “dark magic của transformer nằm ở dot product đúng không? tại sao chỉ từ các ma trận lại có thể biểu thị độ tương quan giữa tổ hợp các từ?”
- `T1015`: “Có phải là một câu hỏi có 4 câu thì transformer sẽ xử lý đồng loạt 4 câu đó thay vì xử lý từng câu đúng k ?”
- `T0315`: “AI, Machine Learning, Deep Learning, Generative AI và LLM khác nhau thế nào?”
- `T0109`: “chatbot với agent khác nhau cái gì giải thích cho tôi”

Đây là các câu có tín hiệu người học đang hình thành mental model. Tutor giải thích nhưng không yêu cầu learner diễn giải lại, nên hệ thống không biết phần nào đã được hiểu, hiểu thiếu hay hiểu sai.

## So sánh ba ứng viên

| Ứng viên | Reach đo được | Tần suất / tổn thất proxy | Build 1,5 ngày | Quyết định |
|---|---:|---|:---:|---|
| Grounding/citation | 582 turn thiếu nguồn | 46,2% turn khó tự kiểm chứng | Có | Loại: quan trọng nhưng VLearn đã có citation UX |
| **Understanding checkpoint** | **1.258 turn không check** | **99,8% teaching turn không sinh evidence mastery** | **Có** | **Chọn** |
| Giảm latency | 49 turn ≥5 giây | 3,9% turn bị chậm rõ rệt | Khó vì phụ thuộc hạ tầng | Loại |

Nguồn: `data/vlearn-pack/chatlog/chat_history_anonymized_for_hackathon.csv`, phạm vi 22–29/07/2026. Không suy ngược danh tính; không sao chép data pack ra ngoài repo sự kiện.
