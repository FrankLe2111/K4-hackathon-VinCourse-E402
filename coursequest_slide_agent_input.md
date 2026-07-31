# PROJECT REPORT INPUT FOR HTML SLIDE GENERATION AGENT

## 1. Mục tiêu tài liệu

Tài liệu này dùng làm đầu vào cho một AI agent chuyên sinh **slide HTML** để báo cáo dự án.

Yêu cầu đối với slide:

- Ngôn ngữ: Tiếng Việt.
- Phong cách: hiện đại, rõ ràng, phù hợp demo hackathon hoặc báo cáo dự án.
- Tỷ lệ màn hình: 16:9.
- Không nhồi quá nhiều chữ trên một slide.
- Ưu tiên biểu đồ, số liệu lớn, sơ đồ và các câu kết luận ngắn.
- Mỗi slide chỉ nên truyền tải một thông điệp chính.
- Không tự bịa thêm dữ liệu ngoài những gì được cung cấp trong tài liệu này.
- Khi trình bày số liệu khảo sát, cần ghi rõ kích thước mẫu và giới hạn của dữ liệu.
- Tông màu gợi ý: xanh tím, trắng, nền sáng hoặc nền tối hiện đại.
- Có thể sử dụng icon cho học tập, AI, game, PDF, GitHub, lab và analytics.

---

# 2. Tên dự án đề xuất

## CourseQuest

### Tagline

**Learn, Fail, Fix, Master**

### Mô tả một câu

CourseQuest là một game học tập thích ứng sử dụng AI để biến PDF, bài tập lab và GitHub repository thành các nhiệm vụ học tập cá nhân hóa, giúp học viên phát hiện phần kiến thức còn yếu, sửa lỗi sai và ôn tập đúng nội dung vào đúng thời điểm.

---

# 3. Bối cảnh bài toán

Trong một khóa học hiện đại, học viên thường phải làm việc với nhiều loại tài liệu:

- PDF hoặc slide bài giảng.
- Video.
- Notebook.
- Bài tập lab.
- Source code.
- GitHub repository.
- Hướng dẫn từ giảng viên và Lab Coach.

Tuy nhiên, việc có nhiều tài liệu không đồng nghĩa với việc học viên học hiệu quả hơn.

Người học thường gặp ba câu hỏi lớn:

1. Mình thực sự chưa hiểu phần nào?
2. Sau khi làm sai, mình nên ôn lại như thế nào để không lặp lại lỗi?
3. Mình nên học gì tiếp theo thay vì đọc lại toàn bộ tài liệu?

Phương pháp phổ biến hiện tại vẫn là:

- Đọc lại slide.
- Xem đáp án.
- Hỏi AI để lấy câu trả lời.
- Chỉ ôn tập trước kỳ thi.

Những hành vi này có thể giúp giải quyết bài tập trước mắt nhưng chưa chắc giúp học viên hiểu sâu, ghi nhớ lâu và áp dụng được sang tình huống khác.

---

# 4. Problem statement

## Phiên bản đầy đủ

Làm thế nào để biến toàn bộ PDF, bài lab và GitHub repository của một khóa học thành một hệ thống nhiệm vụ học tập thích ứng, trong đó mỗi học viên được luyện đúng khái niệm mình còn yếu, nhận phản hồi giải thích lỗi sai, làm các câu hỏi tương tự và chỉ được công nhận thành thạo khi có đủ bằng chứng hiểu và vận dụng?

## Phiên bản ngắn cho slide

**Học viên có nhiều tài liệu nhưng không biết mình chưa hiểu gì, cần ôn gì tiếp theo và làm thế nào để không lặp lại lỗi cũ.**

---

# 5. Giải pháp đề xuất

CourseQuest không chỉ là một chatbot trả lời câu hỏi.

Hệ thống thực hiện một vòng lặp học tập hoàn chỉnh:

1. Phân tích tài liệu khóa học.
2. Xây dựng knowledge graph theo từng concept.
3. Theo dõi lịch sử trả lời và lỗi sai của học viên.
4. Đánh giá mức độ thành thạo của từng concept.
5. Chọn nội dung cần ôn tiếp theo.
6. Sinh câu hỏi tương tự từ nguồn chính thức.
7. Liên kết kiến thức lý thuyết với bài lab và source code.
8. Đưa concept vào lịch ôn tập lại.
9. Chỉ công nhận mastery khi học viên vượt qua câu hỏi biến thể và delayed review.

---

# 6. Quyết định AI cốt lõi

## Câu trả lời chính thức

**AI quyết định học viên cần ôn tập khái niệm nào tiếp theo dựa trên lịch sử trả lời, các câu đã làm sai và mức độ thành thạo của từng khái niệm; sử dụng Gemini 2.5 Flash.**

## Quyết định bổ sung

AI cũng có thể:

- Phân loại lỗi sai theo concept.
- Xác định câu hỏi có thể trả lời từ tài liệu chính thức hay không.
- Sinh câu hỏi tương tự có grounding.
- Lựa chọn mức độ khó phù hợp.
- Đề xuất bài lab hoặc đoạn code cần xem lại.

Không mô tả AI chung chung là “AI sinh câu trả lời”.

---

# 7. Khảo sát xác thực vấn đề

## Thiết kế khảo sát

Người tham gia lựa chọn vai trò:

- Học viên.
- Lab Coach.

Sau đó đánh giá 10 vấn đề theo thang tần suất:

1. Không bao giờ.
2. Hiếm khi.
3. Thỉnh thoảng.
4. Thường xuyên.
5. Rất thường xuyên.

## Quy mô mẫu

- Tổng số phản hồi: **59**
- Học viên: **55**, chiếm khoảng **93,2%**
- Lab Coach: **4**, chiếm khoảng **6,8%**

Lưu ý khi trình bày:

- Kết quả phản ánh chủ yếu góc nhìn học viên.
- Nhóm Lab Coach quá nhỏ để đưa ra kết luận khái quát.
- Nên sử dụng cụm từ “tín hiệu ban đầu từ Lab Coach”.

---

# 8. Kết quả khảo sát tổng quan

Điểm trung bình chung của 10 vấn đề là khoảng:

## **3,66/5**

Điều này cho thấy các khó khăn xuất hiện ở mức nằm giữa:

- Thỉnh thoảng.
- Thường xuyên.

Toàn bộ 10 vấn đề đều có điểm trung bình trên 3,4/5.

Thông điệp chính:

**Bài toán không chỉ tồn tại ở một nhóm nhỏ mà xuất hiện trên nhiều khía cạnh của quá trình học, từ ghi nhớ, tự đánh giá, động lực, phản hồi đến kết nối lý thuyết và thực hành.**

---

# 9. Bảng xếp hạng 10 pain point

| Hạng | Pain point | Điểm trung bình | Tỷ lệ thường xuyên hoặc rất thường xuyên |
|---:|---|---:|---:|
| 1 | Đọc lại tài liệu nhưng nhanh quên kiến thức | 3,81/5 | 61,0% |
| 2 | Không biết mình đã thực sự hiểu bài hay chưa | 3,78/5 | 61,0% |
| 3 | Khó duy trì động lực học và ôn tập thường xuyên | 3,76/5 | 62,7% |
| 4 | Tài liệu, bài tập và source code nằm rải rác ở nhiều nơi | 3,73/5 | 50,8% |
| 5 | Khó kết nối lý thuyết với bài lab hoặc source code | 3,71/5 | 55,9% |
| 6 | Không biết nên ưu tiên ôn phần kiến thức nào | 3,61/5 | 52,5% |
| 7 | Khó tìm câu hỏi tương tự để luyện sau khi làm sai | 3,61/5 | 52,5% |
| 8 | Không nhận được phản hồi đủ nhanh khi gặp khó khăn | 3,56/5 | 49,2% |
| 9 | Không hiểu rõ nguyên nhân tại sao mình trả lời sai | 3,44/5 | 44,1% |
| 10 | Lặp lại cùng một loại lỗi trong nhiều bài tập | 3,42/5 | 45,8% |

---

# 10. Ba pain point nổi bật nhất

## Pain point 1: Đọc lại tài liệu nhưng nhanh quên

- Điểm trung bình: **3,81/5**
- **61,0%** gặp thường xuyên hoặc rất thường xuyên.
- Khoảng **91,5%** gặp ít nhất ở mức thỉnh thoảng.

### Ý nghĩa

Đọc lại tài liệu một cách thụ động chưa đủ để đảm bảo ghi nhớ.

### Tính năng sản phẩm tương ứng

- Retrieval practice.
- Spaced repetition.
- Daily recall.
- Delayed review.
- Trộn câu cũ và câu mới.
- Dự đoán concept có nguy cơ bị quên.

### Thông điệp slide

**Người học không thiếu tài liệu; họ thiếu một cơ chế giúp nhớ lại đúng lúc.**

---

## Pain point 2: Không biết mình đã thực sự hiểu bài hay chưa

- Điểm trung bình: **3,78/5**
- **61,0%** gặp thường xuyên hoặc rất thường xuyên.
- Khoảng **93,2%** gặp ít nhất ở mức thỉnh thoảng.

### Ý nghĩa

Việc đọc quen mắt hoặc làm đúng một câu chưa chứng minh học viên đã hiểu.

### Tính năng sản phẩm tương ứng

Mastery phải được đo theo từng concept và nhiều loại evidence:

- Nhớ định nghĩa.
- Giải thích bằng lời.
- Làm câu hỏi biến thể.
- Áp dụng vào bài lab.
- Sửa bug.
- Vượt qua delayed review.

### Thông điệp slide

**Điểm số cho biết học viên trả lời đúng; mastery cho biết học viên thực sự hiểu.**

---

## Pain point 3: Khó duy trì động lực học và ôn tập thường xuyên

- Điểm trung bình: **3,76/5**
- **62,7%** gặp thường xuyên hoặc rất thường xuyên.
- Đây là tỷ lệ “Thường xuyên trở lên” cao nhất.

### Ý nghĩa

Người học cần một vòng lặp tạo động lực quay lại học, nhưng gamification phải gắn với hành vi học có giá trị.

### Tính năng sản phẩm tương ứng

- Daily quest.
- XP khi sửa lỗi cũ.
- Boss battle.
- Skill map.
- Streak học tập.
- Team challenge.
- Badge có evidence.

### Thông điệp slide

**Game không thay thế việc học; game tạo động lực để người học thực hiện đúng hành vi học.**

---

# 11. Cụm pain point: lý thuyết và thực hành

## Tài liệu, bài tập và source code nằm rải rác

- Điểm trung bình: **3,73/5**
- **50,8%** gặp thường xuyên hoặc rất thường xuyên.
- Khoảng **88,1%** gặp ít nhất ở mức thỉnh thoảng.

## Khó kết nối lý thuyết với bài lab hoặc source code

- Điểm trung bình: **3,71/5**
- **55,9%** gặp thường xuyên hoặc rất thường xuyên.
- Khoảng **88,1%** gặp ít nhất ở mức thỉnh thoảng.

### Ý nghĩa

Một concept có thể xuất hiện trong nhiều tài nguyên nhưng chưa được liên kết rõ ràng.

### Giải pháp

Xây dựng knowledge graph liên kết:

```text
Concept
  ↕
Trang PDF
  ↕
Đoạn code
  ↕
Bài lab
  ↕
Câu hỏi
  ↕
Lỗi phổ biến
```

### Ví dụ

Hệ thống phát hiện model không hội tụ và phản hồi:

> Lỗi này có thể liên quan đến Feature Scaling. Hãy xem lại trang 17 của tài liệu và hàm `normalize_data()` trong `preprocessing.py`.

### Thông điệp slide

**CourseQuest biến các tài nguyên rời rạc thành một hệ thống kiến thức có liên kết.**

---

# 12. Cụm pain point: ôn tập thích ứng và câu hỏi tương tự

## Không biết nên ưu tiên ôn phần nào

- Điểm trung bình: **3,61/5**
- **52,5%** gặp thường xuyên hoặc rất thường xuyên.

## Khó tìm câu hỏi tương tự sau khi làm sai

- Điểm trung bình: **3,61/5**
- **52,5%** gặp thường xuyên hoặc rất thường xuyên.

### Ý nghĩa

Học viên không chỉ cần nhiều câu hỏi hơn; họ cần đúng câu hỏi, đúng concept và đúng mức độ.

### Giải pháp

AI lựa chọn câu hỏi tiếp theo dựa trên:

- Concept vừa làm sai.
- Lịch sử lỗi.
- Độ khó.
- Số hint đã dùng.
- Mức tự tin.
- Concept tiên quyết.
- Kết quả bài lab.
- Thời gian từ lần học trước.

### Các mức độ câu hỏi tương tự

1. Thay số hoặc dữ liệu.
2. Đổi ngữ cảnh.
3. Chuyển từ lý thuyết sang code.
4. Tìm lỗi trong lời giải.
5. Áp dụng sang tình huống mới.

---

# 13. Cụm pain point: phản hồi và sửa sai

## Không nhận được phản hồi đủ nhanh

- Điểm trung bình: **3,56/5**
- **49,2%** gặp thường xuyên hoặc rất thường xuyên.

## Không hiểu rõ tại sao mình sai

- Điểm trung bình: **3,44/5**
- **44,1%** gặp thường xuyên hoặc rất thường xuyên.

## Lặp lại cùng một loại lỗi

- Điểm trung bình: **3,42/5**
- **45,8%** gặp thường xuyên hoặc rất thường xuyên.

### Ý nghĩa

Chỉ hiển thị đáp án đúng chưa đủ để sửa mô hình tư duy sai.

### Error recovery loop

1. Phân loại lỗi.
2. Chỉ ra concept liên quan.
3. Đưa hint từng cấp.
4. Yêu cầu học viên thử lại.
5. Sinh câu hỏi tương tự.
6. Kiểm tra ở ngữ cảnh khác.
7. Đưa vào lịch ôn.
8. Kiểm tra lại sau một khoảng thời gian.

### Ví dụ dữ liệu lỗi

```json
{
  "concept": "normalization",
  "error_type": "conceptual_misunderstanding",
  "misconception": "nhầm normalization với standardization",
  "confidence": "high",
  "repeated_count": 3,
  "status": "unresolved"
}
```

### Thông điệp slide

**Hệ thống không chỉ ghi nhớ câu nào sai; hệ thống ghi nhớ học viên đang hiểu sai điều gì.**

---

# 14. Persona và stakeholder

## Học viên

Nhu cầu:

- Biết mình yếu phần nào.
- Biết nên học gì tiếp theo.
- Có câu hỏi phù hợp.
- Hiểu nguyên nhân sai.
- Liên kết lý thuyết với lab.
- Có động lực quay lại học.

## Lab Coach

Nhu cầu:

- Phát hiện học viên đang mắc lỗi gì.
- Xem misconception phổ biến.
- Không phải trả lời lặp lại cùng một câu hỏi.
- Biết nhóm học viên nào đang bị kẹt.
- Đưa phản hồi đúng thời điểm.

## Giảng viên

Nhu cầu:

- Tạo question bank nhanh.
- Theo dõi mastery theo learning objective.
- Xem heatmap lỗi.
- Phê duyệt nội dung AI.
- Đánh giá hiệu quả khóa học.

---

# 15. Core gameplay loop

```text
Nhận quest
   ↓
Trả lời câu hỏi hoặc làm mini-lab
   ↓
AI phân tích kết quả và lỗi sai
   ↓
Cập nhật mastery theo concept
   ↓
Sinh câu hỏi tương tự hoặc chuyển về prerequisite
   ↓
Đưa vào lịch ôn tập
   ↓
Mở khóa nhiệm vụ mới
```

## Cấu trúc một phiên học 10–15 phút

1. Warm-up từ kiến thức cũ.
2. Main quest theo mục tiêu hiện tại.
3. Error recovery cho câu từng sai.
4. Transfer challenge.
5. Tự đánh giá confidence.
6. Nhận reward gắn với mastery.

---

# 16. Kiến trúc nội dung

## Input

- PDF.
- Slide.
- Lab instruction.
- Notebook.
- GitHub repository.
- README.
- Source code.
- Unit test.

## Pipeline

```text
PDF + Lab + GitHub
        ↓
Document parsing
        ↓
Concept extraction
        ↓
Knowledge graph
        ↓
Question generation
        ↓
Automatic verification
        ↓
Instructor review
        ↓
Adaptive learning game
```

## Nguyên tắc an toàn

- Mọi câu hỏi phải có nguồn.
- Mọi giải thích phải grounded.
- Không đủ thông tin thì từ chối hoặc hỏi lại.
- Không tự bịa kiến thức.
- Câu hỏi AI cần được kiểm tra trước khi publish.

---

# 17. Điểm khác biệt của sản phẩm

## 1. Misconception Memory

Ghi nhớ học viên hiểu sai điều gì, không chỉ câu nào sai.

## 2. Explain-to-Win

Học viên phải giải thích vì sao đáp án đúng và vì sao phương án khác sai.

## 3. Evidence-based Mastery

Badge chỉ được cấp khi có đủ bằng chứng:

- Hiểu concept.
- Làm đúng câu biến thể.
- Áp dụng vào lab.
- Vượt delayed review.

## 4. Lab-to-Concept Bridge

Kết nối test failure với kiến thức trong PDF.

## 5. AI Adversary

AI đưa ra một lời giải sai nhưng thuyết phục để học viên phản biện.

## 6. Forgetting Forecast

Dự đoán concept có nguy cơ bị quên và lên lịch ôn trước khi quá muộn.

---

# 18. Bộ kiểm thử AI

## Tổng số câu đề xuất

**30 câu**

## Các nhóm tình huống

1. Retrieval đúng từ PDF.
2. Retrieval từ GitHub repository.
3. Thông tin không có trong tài liệu.
4. Câu hỏi mơ hồ hoặc thiếu ngữ cảnh.
5. Yêu cầu AI không được phép làm.
6. Câu trả lời sai gây hậu quả thật.
7. Sinh câu hỏi tương tự.
8. Phân tích lỗi và đề xuất nội dung ôn.

## Câu hỏi từ quan sát thực tế

**10 câu trong bộ đánh giá bắt nguồn từ quan sát thực tế.**

Nguồn:

- Phản hồi khảo sát học viên.
- Trao đổi với Lab Coach.
- Tình huống nhóm gặp khi tự kiểm thử.
- Chatlog nếu có.

Các câu có thể bao gồm:

- Câu cụt.
- Lỗi chính tả.
- Trộn tiếng Anh và tiếng Việt.
- Câu mơ hồ.
- Cách diễn đạt đời thường.

---

# 19. Chuẩn đạt của hệ thống

## Tiêu chí tổng thể

**Ít nhất 85% số câu trong bộ kiểm thử phải đạt.**

## Điều không cho phép sai

**AI tuyệt đối không được bịa thông tin ngoài PDF, GitHub repository hoặc tài liệu chính thức của khóa học.**

Khi không đủ evidence, hệ thống phải:

- Nói rõ không tìm thấy thông tin.
- Hỏi lại để bổ sung ngữ cảnh.
- Hoặc chuyển cho Lab Coach.

---

# 20. North Star Metric

## Chỉ số chính

**Số learning objective được chứng minh là đã thành thạo và vẫn được duy trì sau delayed assessment.**

Không sử dụng thời gian trên ứng dụng làm chỉ số thành công chính.

## Các chỉ số bổ sung

- Pre-test/post-test gain.
- Delayed retention.
- Error recovery rate.
- Misconception resolution rate.
- Transfer question accuracy.
- Lab completion rate.
- Confidence calibration.
- Instructor acceptance rate đối với câu hỏi AI.
- Tỷ lệ AI hallucination.
- Tỷ lệ học viên hoàn thành daily review.

---

# 21. MVP scope

## Tính năng bắt buộc

1. Upload và parse PDF.
2. Import một GitHub repository.
3. Knowledge graph cơ bản.
4. Question bank có nguồn.
5. Quiz theo concept.
6. Lưu câu sai.
7. Error recovery queue.
8. Sinh câu hỏi tương tự.
9. Rule-based mastery.
10. Lịch ôn tập.
11. Một loại coding challenge.
12. Dashboard cơ bản.
13. Instructor review.
14. Logging learning events.

## Chưa cần trong MVP

- Open world 3D.
- Avatar phức tạp.
- Marketplace.
- Mobile native.
- Voice.
- Multiplayer realtime lớn.
- Deep Knowledge Tracing.
- Fine-tune LLM.

---

# 22. Roadmap đề xuất

## Giai đoạn 1: Discovery

- Phỏng vấn học viên và Lab Coach.
- Chọn khóa học pilot.
- Xác định 30–50 concept.
- Chuẩn hóa learning objective.

## Giai đoạn 2: Content intelligence

- Parse PDF.
- Parse GitHub.
- Tạo knowledge graph.
- Tạo provenance.

## Giai đoạn 3: Question engine

- Sinh câu hỏi.
- Sinh distractor.
- Sinh explanation.
- Verification.
- Instructor approval.

## Giai đoạn 4: Adaptive learning

- Mastery model.
- Error recovery.
- Similar questions.
- Spaced review.

## Giai đoạn 5: Gamification

- Quest.
- XP.
- Badge.
- Boss battle.
- Skill map.

## Giai đoạn 6: Pilot

- Pre-test.
- Sử dụng sản phẩm.
- Post-test.
- Delayed test.
- Phân tích learning gain.

---

# 23. Giới hạn của khảo sát

Cần trình bày minh bạch:

1. Chỉ có 59 phản hồi.
2. 55/59 người trả lời là học viên.
3. Chỉ có 4 Lab Coach.
4. Khảo sát đo tần suất nhưng chưa đo mức độ hậu quả.
5. Chưa có câu hỏi mở để thu thập trải nghiệm chi tiết.
6. Có dấu hiệu nhiều người chọn cùng một mức cho toàn bộ bảng.
7. Dữ liệu chưa chứng minh sản phẩm sẽ giải quyết được vấn đề.
8. Dữ liệu chỉ chứng minh pain point có tồn tại và đủ đáng quan tâm để tiếp tục thử nghiệm.

## Straight-lining

Khoảng **25/59 phản hồi** chọn cùng một mức cho cả 10 phát biểu.

Điều này có thể do:

- Người trả lời làm nhanh.
- Các câu hỏi quá giống nhau.
- Người trả lời thực sự cảm thấy các vấn đề xảy ra cùng tần suất.
- Giao diện grid khiến họ chọn cùng một cột.

Không nên xóa dữ liệu nếu chưa có quy tắc loại trước khảo sát.

Nên ghi trong báo cáo rằng đây là một giới hạn chất lượng dữ liệu.

---

# 24. Kết luận từ khảo sát

## Kết luận chính

Khảo sát cho thấy người học không thiếu tài liệu, nhưng thiếu:

- Khả năng xác định mình chưa hiểu gì.
- Hướng dẫn nên ôn gì tiếp theo.
- Cơ chế sửa lỗi có hệ thống.
- Câu hỏi tương tự để luyện.
- Liên kết giữa lý thuyết và thực hành.
- Động lực để ôn tập đều đặn.

## Câu kết luận mạnh

**Chúng tôi không xây một AI để thay học viên trả lời câu hỏi. Chúng tôi xây một AI giúp học viên nhận ra mình chưa hiểu gì, sửa những lỗi thường lặp lại và từng bước chứng minh sự thành thạo.**

---

# 25. Storyline slide đề xuất

Agent nên tạo khoảng 12–14 slide theo cấu trúc sau.

## Slide 1 — Cover

- CourseQuest.
- Learn, Fail, Fix, Master.
- Adaptive Learning Game from PDF, Labs and GitHub.

## Slide 2 — The learning paradox

Thông điệp:

**Học viên có nhiều tài liệu hơn bao giờ hết, nhưng vẫn không biết mình đã thực sự hiểu bài hay chưa.**

Có thể dùng hình minh họa tài liệu phân tán quanh một học viên.

## Slide 3 — The problem

Hiển thị ba câu hỏi:

- Tôi chưa hiểu gì?
- Tôi cần ôn gì tiếp theo?
- Làm sao để không lặp lại lỗi cũ?

## Slide 4 — Survey evidence

- 59 phản hồi.
- 55 học viên.
- 4 Lab Coach.
- Điểm trung bình chung 3,66/5.

## Slide 5 — Top 3 pain points

Dùng ba metric card:

- 61,0% đọc lại nhưng nhanh quên.
- 61,0% không biết đã thực sự hiểu.
- 62,7% khó duy trì động lực.

## Slide 6 — Full pain-point ranking

Dùng horizontal bar chart hoặc ranked list cho 10 pain point.

## Slide 7 — What the data means

Bốn cụm vấn đề:

- Retention.
- Self-awareness.
- Theory-to-lab gap.
- Error recovery.

## Slide 8 — Solution overview

Sơ đồ:

PDF + GitHub + Labs → Knowledge Graph → Adaptive Quest → Mastery.

## Slide 9 — AI decision

Câu chính:

**AI quyết định học viên cần ôn concept nào tiếp theo.**

Model:

**Gemini 2.5 Flash**

## Slide 10 — Core learning loop

Quest → Attempt → Error Diagnosis → Similar Question → Delayed Review → Mastery.

## Slide 11 — Outstanding features

- Misconception Memory.
- Explain-to-Win.
- Lab-to-Concept Bridge.
- Forgetting Forecast.

## Slide 12 — Evaluation plan

- 30 câu.
- 10 câu từ quan sát thực tế.
- 4 nhóm tình huống nguy hiểm.
- Chuẩn đạt ≥85%.
- Không hallucination.

## Slide 13 — MVP and roadmap

Hiển thị các giai đoạn từ ingestion đến pilot.

## Slide 14 — Closing

Câu kết:

**From answering questions to building mastery.**

Hoặc tiếng Việt:

**Từ trả lời đúng một câu đến thực sự làm chủ kiến thức.**

---

# 26. Yêu cầu thiết kế biểu đồ

## Biểu đồ 1: Top pain points

Loại:

- Horizontal bar chart.

Dữ liệu:

```json
[
  {"label": "Đọc lại nhưng nhanh quên", "score": 3.81},
  {"label": "Không biết đã thực sự hiểu", "score": 3.78},
  {"label": "Khó duy trì động lực", "score": 3.76},
  {"label": "Tài liệu và code nằm rải rác", "score": 3.73},
  {"label": "Khó kết nối lý thuyết với lab", "score": 3.71},
  {"label": "Không biết nên ưu tiên ôn gì", "score": 3.61},
  {"label": "Khó tìm câu hỏi tương tự", "score": 3.61},
  {"label": "Phản hồi chưa đủ nhanh", "score": 3.56},
  {"label": "Không hiểu nguyên nhân sai", "score": 3.44},
  {"label": "Lặp lại cùng loại lỗi", "score": 3.42}
]
```

Trục điểm:

- Từ 1 đến 5.

## Biểu đồ 2: Thành phần mẫu

Dữ liệu:

```json
[
  {"role": "Học viên", "count": 55, "percentage": 93.2},
  {"role": "Lab Coach", "count": 4, "percentage": 6.8}
]
```

## Biểu đồ 3: Top 3 tỷ lệ thường xuyên trở lên

```json
[
  {"label": "Khó duy trì động lực", "percentage": 62.7},
  {"label": "Đọc lại nhưng nhanh quên", "percentage": 61.0},
  {"label": "Không biết đã thực sự hiểu", "percentage": 61.0}
]
```

---

# 27. Data disclaimer để đặt ở cuối slide khảo sát

**Nguồn: Khảo sát nội bộ, 59 phản hồi ngày 30/07/2026. Kết quả phản ánh chủ yếu góc nhìn học viên; số lượng Lab Coach còn hạn chế.**

---

# 28. Prompt cuối cho slide-generation agent

Hãy tạo một slide deck HTML 16:9, khoảng 12–14 slide, bằng tiếng Việt, dựa hoàn toàn trên nội dung trong file Markdown này.

Yêu cầu:

- Thiết kế hiện đại, phù hợp pitching dự án AI giáo dục.
- Mỗi slide có một thông điệp chính.
- Ưu tiên visual storytelling.
- Dùng số liệu khảo sát làm evidence.
- Không bịa thêm số liệu.
- Hiển thị rõ quy mô mẫu 59 phản hồi.
- Ghi rõ giới hạn chỉ có 4 Lab Coach.
- Biểu đồ cần có label và đơn vị rõ ràng.
- Không dùng quá 40–60 từ trên một slide, trừ slide appendix.
- Sử dụng sơ đồ để giải thích product flow và AI decision.
- Nhấn mạnh sản phẩm không chỉ là chatbot hoặc quiz game.
- Kết thúc bằng câu:
  **“Chúng tôi không xây một AI để thay học viên trả lời câu hỏi. Chúng tôi xây một AI giúp học viên thực sự làm chủ kiến thức.”**
