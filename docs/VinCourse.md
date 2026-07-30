# **PRODUCT PLAN: ADAPTIVE LEARNING GAME CHO KHÓA HỌC**

## **1\. Tầm nhìn sản phẩm**

Xây dựng một nền tảng học tập dạng game giúp học viên:

* Học và tổng ôn kiến thức từ tài liệu khóa học.  
* Phát hiện chính xác  
* Luyện các câu hỏi tương tự nhưng khác ngữ cảnh.  
* Kết nối kiến thức lý thuyết với bài tập lab và code thực tế.  
* Theo dõi mức độ thành thạo của từng khái niệm thay vì chỉ theo dõi điểm số.  
* Học cùng lớp thông qua thử thách, nhiệm vụ nhóm và các trận đấu kiến thức.

Tên tạm thời của sản phẩm:

> **CourseQuest – Learn, Fail, Fix, Master**

Sản phẩm không nên được định vị là “Kahoot có AI” hay “chatbot hỏi đáp tài liệu”. Định vị tốt hơn là:

> **Một game học tập thích ứng, xây dựng mô hình kiến thức riêng cho từng học viên và liên tục tạo nhiệm vụ phù hợp với những gì họ chưa thực sự hiểu.**

---

# **2\. Bài toán thực tế cần giải quyết**

## **2.1. Vấn đề của học viên**

Trong một khóa học, học viên thường gặp các vấn đề:

1. Không biết phần nào mình đã hiểu thật sự.  
2. Đọc lại slide hoặc PDF nhiều lần nhưng nhanh quên.  
3. Làm sai câu hỏi nhưng chỉ xem đáp án rồi bỏ qua.  
4. Ghi nhớ đáp án thay vì hiểu bản chất.  
5. Không kết nối được lý thuyết với bài lab.  
6. Không biết nên học tiếp phần nào.  
7. Dễ mất động lực khi nội dung dài hoặc khó.  
8. Chỉ học sát ngày thi.  
9. Có thể hoàn thành lab bằng cách sao chép code nhưng không giải thích được code.  
10. Không nhận được phản hồi cá nhân hóa từ giảng viên.

Retrieval practice yêu cầu người học chủ động nhớ lại kiến thức thay vì chỉ đọc lại. Khi kết hợp với phản hồi và luyện tập phân tán theo thời gian, phương pháp này giúp củng cố khả năng ghi nhớ và vận dụng kiến thức. giảng viên

Giảng viên thường gặp khó khăn trong việc:

* Tạo đủ số lượng câu hỏi chất lượng.  
* Tạo nhiều phiên bản khác nhau của một câu hỏi.  
* Theo dõi misconception của từng học viên.  
* Biết chương nào cả lớp đang gặp khó khăn.  
* Chấm và phản hồi cho hàng trăm bài lab.  
* Phân biệt học viên hiểu bài với học viên chỉ đoán đúng.  
* Thiết kế hoạt động ôn tập hấp dẫn nhưng vẫn có giá trị học thuật.

## **2.3. Problem statement**

> Làm thế nào để biến toàn bộ PDF, bài lab và GitHub repo của một khóa học thành một hệ thống nhiệm vụ học tập thích ứng, trong đó mỗi học viên được luyện đúng khái niệm mình còn yếu, nhận phản hồi giải thích lỗi sai, làm các biến thể tương tự và chỉ được công nhận thành thạo khi có đủ bằng chứng hiểu và vận dụng?

---

# **3\. Nguyên tắc thiết kế cốt lõi**

## **3.1. Không tối ưu cho thời gian sử dụng**

Không sử dụng “thời gian trong ứng dụng” làm North Star Metric.

Sản phẩm phải tối ưu cho:

* Kiến thức được thành thạo.  
* Lỗi sai được sửa.  
* Khả năng ghi nhớ sau nhiều ngày.  
* Khả năng áp dụng kiến thức vào tình huống mới.  
* Khả năng hoàn thành và giải thích bài lab.

## **3.2. Game mechanics phải phục vụ việc học**

Gamification có thể cải thiện kết quả nhận thức, động lực và hành vi học tập, nhưng hiệu quả phụ thuộc mạnh vào cách thiết kế. Điểm, huy hiệu và bảng xếp hạng không nên tồn tại độc lập với mục tiêu học tập. ải tương ứng với một hành vi học:

| Cơ chế game | Hành vi học cần khuyến khích |
| ----- | ----- |
| XP | Hoàn thành hoạt động có giá trị học tập |
| Mastery level | Hiểu và vận dụng một khái niệm |
| Streak | Duy trì ôn tập phân tán |
| Recovery bonus | Quay lại sửa câu từng sai |
| Boss battle | Tổng hợp nhiều khái niệm |
| Quest | Hoàn thành một learning objective |
| Skill tree | Nhìn thấy quan hệ tiên quyết giữa kiến thức |
| Team challenge | Giải thích, tranh luận và hợp tác |
| Achievement | Hoàn thành một năng lực thực tế |
| Replay mission | Ôn lại kiến thức đang có nguy cơ quên |

## **3.3. Sai không bị phạt nặng**

Sai là một phần của gameplay.

Khi học viên trả lời sai, hệ thống không chỉ hiển thị đáp án mà phải:

1. Xác định loại lỗi.  
2. Đưa ra gợi ý theo từng cấp.  
3. Yêu cầu học viên thử lại.  
4. Cho học viên giải thích nguyên nhân sai.  
5. Sinh một câu hỏi tương tự.  
6. Đưa khái niệm vào lịch ôn tập.  
7. Kiểm tra lại sau một khoảng thời gian.

## **3.4. AI không được tự do sáng tạo kiến thức**

Mọi câu hỏi, đáp án và giải thích phải được truy xuất từ:

* PDF khóa học.  
* Slide hoặc lecture note.  
* README và documentation.  
* Source code trong GitHub.  
* Notebook.  
* Unit test.  
* Rubric.  
* Tài liệu tham khảo được giảng viên phê duyệt.

Các nghiên cứu về sinh câu hỏi bằng LLM cho thấy mô hình có thể tạo câu hỏi ở nhiều mức nhận thức, nhưng chất lượng thay đổi giữa mô hình và đánh giá tự động chưa thể thay thế hoàn toàn chuyên gia. Vì vậy cần có pipeline kiểm chứng và quy trình giảng viên duyệt nội dung. g người dùng

## **4.1. Học viên**

Các nhóm chính:

* Học viên mới bắt đầu, thiếu kiến thức nền.  
* Học viên hiểu lý thuyết nhưng khó làm bài.  
* Học viên làm được lab nhưng chưa hiểu code.  
* Học viên chuẩn bị thi.  
* Học viên muốn học nâng cao.  
* Học viên đã bỏ lỡ một số buổi học.

## **4.2. Giảng viên**

Giảng viên cần:

* Upload tài liệu.  
* Xem và chỉnh sửa knowledge graph.  
* Duyệt câu hỏi do AI tạo.  
* Xem misconception của lớp.  
* Giao quest.  
* Tổ chức live game.  
* Xem tiến độ theo learning objective.  
* Theo dõi chất lượng câu hỏi.

## **4.3. Teaching assistant**

Teaching assistant cần:

* Xem các lỗi phổ biến.  
* Review câu hỏi bị báo lỗi.  
* Xem code submission.  
* Viết hoặc phê duyệt hint.  
* Hỗ trợ nhóm học viên đang bị kẹt.

---

# **5\. Mô hình kiến thức của khóa học**

Đây là thành phần quan trọng nhất để sản phẩm trở nên outstanding.

Không nên chỉ chia nội dung theo “Chapter 1, Chapter 2”. Hệ thống cần xây dựng một **Course Knowledge Graph**.

## **5.1. Cấu trúc knowledge graph**

Ví dụ đối với khóa học Machine Learning:

Machine Learning  
├── Data preprocessing  
│   ├── Missing values  
│   ├── Normalization  
│   └── Feature encoding  
├── Linear regression  
│   ├── Hypothesis function  
│   ├── MSE loss  
│   ├── Gradient descent  
│   └── Evaluation metrics  
└── Neural networks  
    ├── Forward propagation  
    ├── Activation functions  
    ├── Backpropagation  
    └── Optimization

Mỗi concept node cần có:

* `concept_id`  
* Tên khái niệm.  
* Mô tả.  
* Learning objective.  
* Khái niệm tiên quyết.  
* Độ khó.  
* Nguồn PDF.  
* Source code liên quan.  
* Lab liên quan.  
* Các misconception phổ biến.  
* Câu hỏi đã được duyệt.  
* Rubric đánh giá.  
* Mastery threshold.

## **5.2. Quan hệ giữa các node**

Các quan hệ quan trọng:

* `prerequisite_of`  
* `part_of`  
* `similar_to`  
* `applied_in`  
* `contrasts_with`  
* `commonly_confused_with`  
* `implemented_by`  
* `evaluated_by`

Ví dụ:

Normalization  
    prerequisite\_of → Stable gradient descent

Cross entropy  
    commonly\_confused\_with → Mean squared error

Backpropagation  
    implemented\_by → backward() function in lab\_04.py

## **5.3. Learning objective**

Mỗi concept phải có objective quan sát được.

Không sử dụng objective mơ hồ:

> “Hiểu normalization.”

Sử dụng objective có thể đánh giá:

> “Học viên có thể giải thích vì sao normalization ảnh hưởng đến gradient descent, lựa chọn phương pháp normalization phù hợp và sửa đoạn code thiếu normalization.”

---

# **6\. Gameplay loop chính**

## **6.1. Core loop**

Một phiên học 10–15 phút:

Nhận quest  
    ↓  
Trả lời câu hỏi hoặc thực hiện mini-lab  
    ↓  
Nhận phản hồi  
    ↓  
Cập nhật mastery  
    ↓  
Mở khóa thử thách mới  
    ↓  
Đưa nội dung cần ôn vào lịch

## **6.2. Session structure**

Mỗi phiên có thể gồm:

1. **Warm-up:** hai câu hỏi ôn lại kiến thức cũ.  
2. **Main quest:** ba đến năm câu về mục tiêu hiện tại.  
3. **Error recovery:** một câu từng làm sai.  
4. **Transfer challenge:** một câu cùng concept nhưng khác ngữ cảnh.  
5. **Mini reflection:** học viên tự đánh giá mức tự tin.  
6. **Reward:** XP, vật phẩm hoặc mở khóa story.

## **6.3. Các chế độ chơi**

### **A. Story Quest**

Học viên đi qua bản đồ của khóa học. Mỗi khu vực tương ứng với một module.

Ví dụ:

* Data Village.  
* Optimization Forest.  
* Neural Network Tower.  
* Deployment Arena.

### **B. Daily Recall**

Phiên ôn tập ngắn dựa trên:

* Concept sắp bị quên.  
* Câu từng làm sai.  
* Concept có confidence thấp.  
* Concept cần cho bài học tiếp theo.

### **C. Error Dungeon**

Chỉ chứa các lỗi học viên từng mắc.

Mỗi lỗi trở thành một “enemy” cần đánh bại bằng cách:

1. Trả lời lại câu gốc.  
2. Giải thích lỗi.  
3. Làm một câu tương tự.  
4. Áp dụng vào ví dụ mới.

### **D. Lab Arena**

Học viên phải:

* Điền đoạn code thiếu.  
* Sửa bug.  
* Dự đoán output.  
* Giải thích một function.  
* Chọn test case.  
* Viết unit test.  
* So sánh hai implementation.  
* Tối ưu code.  
* Submit code để chạy test.

GitHub Classroom hỗ trợ chạy autograding test khi học viên push code và trả kết quả để học viên tiếp tục sửa bài. Cơ chế tương tự có thể được tích hợp trực tiếp hoặc triển khai bằng GitHub Actions.

Sau mỗi module, học viên giải quyết một case tổng hợp.

Boss battle không nên chỉ là 20 câu trắc nghiệm. Nó có thể gồm:

* Phân tích một tình huống.  
* Tìm lỗi trong lời giải.  
* Chọn phương pháp.  
* Sửa code.  
* Giải thích kết quả.  
* Phản biện một đáp án do AI đưa ra.

### **F. Live Class Battle**

Giảng viên tổ chức hoạt động trong lớp:

* Cả lớp chống lại một boss.  
* Mỗi nhóm giải một phần.  
* Điểm được tính dựa trên cả đáp án và phần giải thích.  
* Hệ thống hiển thị misconception phổ biến theo thời gian thực.

---

# **7\. Hệ thống câu hỏi**

## **7.1. Các mức độ nhận thức**

Câu hỏi cần trải đều theo các mức:

| Mức | Dạng nhiệm vụ |
| ----- | ----- |
| Remember | Nhớ định nghĩa, công thức hoặc cú pháp |
| Understand | Giải thích bằng lời của mình |
| Apply | Áp dụng vào ví dụ |
| Analyze | So sánh, tìm lỗi hoặc phân tích kết quả |
| Evaluate | Lựa chọn và bảo vệ một phương án |
| Create | Viết giải pháp, thiết kế thí nghiệm hoặc xây code |

Không nên coi một concept đã thành thạo nếu học viên chỉ trả lời được câu hỏi ghi nhớ.

## **7.2. Question schema**

{  
  "question\_id": "q\_001",  
  "concept\_ids": \["normalization", "gradient\_descent"\],  
  "learning\_objective": "Explain the effect of feature scale",  
  "question\_type": "debug\_code",  
  "difficulty": 3,  
  "bloom\_level": "analyze",  
  "prompt": "...",  
  "correct\_answer": "...",  
  "accepted\_answers": \[\],  
  "distractors": \[\],  
  "explanation": "...",  
  "hints": \[\],  
  "common\_mistakes": \[\],  
  "source\_refs": \[\],  
  "similarity\_group": "normalization\_effect",  
  "review\_status": "approved"  
}

## **7.3. Các loại câu hỏi**

* Multiple choice.  
* Multiple select.  
* True/false có giải thích.  
* Fill in the blank.  
* Short answer.  
* Ordering steps.  
* Matching.  
* Code completion.  
* Code debugging.  
* Output prediction.  
* Case study.  
* Diagram interpretation.  
* Compare two solutions.  
* Explain why.  
* Teach-back: giải thích cho người mới.  
* Confidence question.  
* Reflection question.

---

# **8\. Vòng lặp sửa sai thông minh**

Đây nên là tính năng đặc trưng của sản phẩm.

## **8.1. Error taxonomy**

Khi học viên trả lời sai, hệ thống phân loại:

1. **Recall gap:** không nhớ kiến thức.  
2. **Conceptual misunderstanding:** hiểu sai bản chất.  
3. **Prerequisite gap:** thiếu kiến thức nền.  
4. **Procedure error:** biết khái niệm nhưng làm sai bước.  
5. **Calculation error:** sai tính toán.  
6. **Code syntax error:** sai cú pháp.  
7. **Code logic error:** sai logic.  
8. **Question misread:** hiểu sai đề.  
9. **Guessing:** chọn đúng hoặc sai với độ tự tin thấp.  
10. **Overconfidence:** trả lời sai nhưng rất tự tin.

## **8.2. Feedback ladder**

Không đưa ngay lời giải hoàn chỉnh.

Hint 1: Gợi ý concept liên quan  
Hint 2: Chỉ ra phần lời giải cần xem lại  
Hint 3: Cung cấp ví dụ đơn giản hơn  
Hint 4: Hướng dẫn từng bước  
Final: Hiển thị lời giải và yêu cầu học viên diễn giải lại

## **8.3. Similar-question engine**

Câu hỏi tương tự không được chỉ thay số.

Hệ thống phải có nhiều mức biến đổi:

### **Mức 1: Surface variation**

* Thay giá trị.  
* Thay tên biến.  
* Thay thứ tự đáp án.

### **Mức 2: Context variation**

* Giữ nguyên concept nhưng đổi ngữ cảnh.  
* Đổi dataset hoặc use case.

### **Mức 3: Representation variation**

* Từ câu hỏi chữ sang diagram.  
* Từ công thức sang code.  
* Từ code sang giải thích.

### **Mức 4: Transfer variation**

* Kết hợp concept với một concept khác.  
* Áp dụng vào tình huống chưa xuất hiện trong tài liệu.

### **Mức 5: Counterexample**

* Yêu cầu tìm trường hợp khái niệm không áp dụng.  
* Phản biện một lời giải có vẻ hợp lý nhưng sai.

## **8.4. Điều kiện xác nhận đã sửa được lỗi**

Một lỗi chỉ được đánh dấu là resolved khi học viên:

* Trả lời đúng lại câu gốc hoặc phiên bản tương đương.  
* Làm đúng ít nhất một câu khác ngữ cảnh.  
* Có confidence phù hợp.  
* Vượt qua một lần kiểm tra trì hoãn sau đó.

---

# **9\. Student Mastery Model**

## **9.1. Mastery score theo concept**

Mỗi học viên có trạng thái riêng:

{  
  "student\_id": "s\_123",  
  "concept\_id": "gradient\_descent",  
  "mastery\_probability": 0.72,  
  "confidence\_calibration": 0.61,  
  "attempt\_count": 9,  
  "correct\_streak": 2,  
  "last\_reviewed\_at": "...",  
  "next\_review\_at": "...",  
  "known\_misconceptions": \[\],  
  "evidence": \[\]  
}

## **9.2. Không tính mastery bằng accuracy đơn giản**

Mastery cần xem xét:

* Độ khó câu hỏi.  
* Bloom level.  
* Số hint đã sử dụng.  
* Thời gian phản hồi.  
* Confidence.  
* Mức tương đồng với câu cũ.  
* Khả năng transfer.  
* Khoảng thời gian từ lần học trước.  
* Kết quả lab.  
* Tính nhất quán qua nhiều lần kiểm tra.

## **9.3. Mô hình triển khai**

### **MVP**

Sử dụng rule-based mastery:

Mastery \=  
0.35 × correctness  
\+ 0.20 × difficulty  
\+ 0.15 × transfer performance  
\+ 0.15 × delayed recall  
\+ 0.10 × confidence calibration  
\+ 0.05 × lab performance

### **Giai đoạn có dữ liệu**

Có thể thử nghiệm:

* Bayesian Knowledge Tracing.  
* Performance Factor Analysis.  
* Deep Knowledge Tracing.  
* Transformer-based Knowledge Tracing.

Knowledge tracing là bài toán mô hình hóa trạng thái kiến thức của học viên từ chuỗi tương tác để dự đoán hiệu suất tương lai và lựa chọn nội dung phù hợp. Tuy nhiên, mô hình sâu không mặc nhiên tốt hơn trong mọi trường hợp; mô hình dễ giải thích như BKT vẫn là lựa chọn tốt cho giai đoạn đầu. e xử lý PDF và GitHub repo

## **10.1. Ingestion pipeline**

PDF \+ Lab \+ GitHub repo  
        ↓  
Document parsing  
        ↓  
Section and code segmentation  
        ↓  
Concept extraction  
        ↓  
Learning objective generation  
        ↓  
Knowledge graph construction  
        ↓  
Question generation  
        ↓  
Automatic verification  
        ↓  
Instructor review  
        ↓  
Published course world

## **10.2. Xử lý PDF**

Pipeline cần:

* Trích xuất heading.  
* Trích xuất paragraph.  
* Trích xuất bảng.  
* Trích xuất công thức.  
* Trích xuất caption và figure.  
* Giữ lại page number.  
* Liên kết chunk với section.  
* Loại bỏ header/footer lặp lại.  
* Phát hiện định nghĩa.  
* Phát hiện ví dụ.  
* Phát hiện learning objective.  
* Phát hiện prerequisite.

Mỗi nội dung được lưu kèm provenance:

{  
  "document": "lecture\_03.pdf",  
  "page": 17,  
  "section": "Feature Scaling",  
  "chunk\_id": "chunk\_349"  
}

## **10.3. Xử lý GitHub repo**

Cần phân tích:

* README.  
* Folder structure.  
* Notebook.  
* Source file.  
* Function và class.  
* Comment và docstring.  
* Dependency.  
* Unit test.  
* Example input/output.  
* TODO.  
* Common exception.  
* Commit hoặc release được lựa chọn.

Repo cần được ánh xạ với concept:

Concept: Image normalization  
Source:  
\- preprocessing.py::normalize\_image  
\- notebook\_02.ipynb cell 14  
\- tests/test\_preprocessing.py

## **10.4. Sinh nội dung có kiểm chứng**

Không sử dụng pipeline:

Chunk → LLM → Publish

Nên sử dụng:

Retrieve evidence  
      ↓  
Generate question specification  
      ↓  
Generate question and answer  
      ↓  
Solve independently  
      ↓  
Verify answer against evidence  
      ↓  
Check ambiguity  
      ↓  
Check distractors  
      ↓  
Check difficulty and Bloom level  
      ↓  
Instructor approval

Một nghiên cứu tiền công bố năm 2026 đề xuất phân tách sinh câu hỏi thành nhiều bước kiểm tra độc lập để giảm lỗi về sự kiện, logic, toán học và tính giải được. Đây là hướng kiến trúc phù hợp, nhưng vẫn cần đánh giá trên chính nội dung khóa học và có human review. úc hệ thống đề xuất

## **11.1. Frontend**

Có thể sử dụng:

* Next.js.  
* TypeScript.  
* Tailwind CSS.  
* Phaser.js cho game map nhẹ.  
* Monaco Editor cho coding challenge.  
* WebSocket cho live battle.

## **11.2. Backend**

* FastAPI hoặc NestJS.  
* PostgreSQL.  
* Redis.  
* Object storage.  
* Background worker.  
* Vector database.  
* Sandbox chạy code.  
* GitHub integration.

## **11.3. AI services**

Content Ingestion Service  
Knowledge Graph Service  
Retrieval Service  
Question Generation Service  
Question Verification Service  
Answer Evaluation Service  
Misconception Detection Service  
Recommendation Engine  
Mastery Modeling Service

## **11.4. Kiến trúc logic**

Learner Interface  
      ↓  
Game Orchestrator  
      ↓  
Adaptive Recommendation Engine  
      ↓  
Mastery Model ───────── Student Event Store  
      ↓  
Question/Lab Bank  
      ↓  
RAG and Course Knowledge Graph  
      ↓  
PDF Corpus \+ GitHub Corpus

## **11.5. Code sandbox**

Không chạy code người dùng trực tiếp trên server chính.

Cần:

* Container cô lập.  
* Giới hạn CPU.  
* Giới hạn memory.  
* Timeout.  
* Không cho network mặc định.  
* Filesystem tạm thời.  
* Test ẩn.  
* Log được lọc.  
* Chống fork bomb và command nguy hiểm.

---

# **12\. Trải nghiệm cho giảng viên**

## **12.1. Course Builder**

Giảng viên thực hiện:

1. Upload PDF.  
2. Kết nối GitHub repo.  
3. Chọn branch hoặc release.  
4. Hệ thống đề xuất course outline.  
5. Giảng viên chỉnh knowledge graph.  
6. Hệ thống sinh learning objectives.  
7. Hệ thống sinh question bank.  
8. Giảng viên review.  
9. Publish khóa học.

## **12.2. Question Review Studio**

Mỗi câu hỏi hiển thị:

* Câu hỏi.  
* Đáp án.  
* Giải thích.  
* Concept.  
* Bloom level.  
* Difficulty.  
* Nguồn PDF hoặc code.  
* Kết quả verification.  
* Cảnh báo ambiguity.  
* Câu hỏi tương tự.  
* Lịch sử chỉnh sửa.

## **12.3. Learning Analytics**

Dashboard không chỉ hiển thị điểm trung bình.

Cần hiển thị:

* Concept mastery heatmap.  
* Misconception heatmap.  
* Câu hỏi có tỷ lệ sai cao.  
* Câu hỏi có dấu hiệu mơ hồ.  
* Học viên đang bị kẹt.  
* Prerequisite gap.  
* Retention sau 1, 7 và 21 ngày.  
* Lab failure category.  
* Confidence calibration.  
* Concept có nguy cơ bị quên.

---

# **13\. Tính năng làm sản phẩm outstanding**

## **13.1. Misconception Memory**

Hệ thống ghi nhớ không chỉ “câu nào sai”, mà còn ghi nhớ:

> Học viên thường nhầm normalization với standardization.

Sau đó hệ thống tạo nhiệm vụ nhắm trực tiếp vào misconception đó.

## **13.2. Explain-to-Win**

Một số câu không chấp nhận chỉ chọn đáp án.

Học viên phải:

* Giải thích tại sao đáp án đúng.  
* Giải thích tại sao phương án khác sai.  
* Dạy lại concept bằng ngôn ngữ đơn giản.  
* Liên hệ concept với code trong repo.

## **13.3. Evidence-based mastery**

Mỗi badge phải có evidence:

Badge: Gradient Descent Master

Evidence:  
✓ Correct conceptual explanation  
✓ Solved numerical problem  
✓ Debugged learning-rate issue  
✓ Passed delayed recall after 7 days  
✓ Applied concept in lab

## **13.4. AI Adversary**

AI đóng vai một học viên trả lời sai nhưng rất thuyết phục.

Người học phải:

* Phát hiện lỗi.  
* Chỉ ra câu nào sai.  
* Sửa lại reasoning.  
* Dẫn nguồn từ tài liệu khóa học.

## **13.5. Lab-to-Concept Bridge**

Khi unit test thất bại, hệ thống không chỉ hiển thị lỗi code mà liên kết về concept:

Test failed:  
The model diverged after epoch 3\.

Possible concept:  
Feature scaling / learning rate interaction.

Review mission:  
Why can unscaled features make gradient descent unstable?

## **13.6. Class Knowledge Map**

Cả lớp cùng mở khóa bản đồ kiến thức.

Mỗi khu vực chỉ hoàn thành khi:

* Đa số lớp đạt mastery tối thiểu.  
* Không còn misconception nghiêm trọng.  
* Nhóm hoàn thành một challenge tổng hợp.

Cơ chế này giảm việc bảng xếp hạng chỉ tôn vinh nhóm học viên giỏi nhất.

## **13.7. Forgetting Forecast**

Hệ thống dự đoán concept nào có nguy cơ bị quên và đưa ra daily mission trước khi kỳ thi đến gần.

---

# **14\. Phạm vi MVP**

## **14.1. MVP nên giải quyết một khóa học cụ thể**

Không xây nền tảng cho mọi môn ngay từ đầu.

Chọn một khóa học có:

* PDF rõ ràng.  
* Knowledge structure tương đối ổn định.  
* Có lab hoặc code.  
* Có đủ học viên pilot.  
* Có giảng viên tham gia review.  
* Có bài kiểm tra đầu vào và đầu ra.

## **14.2. Tính năng MVP bắt buộc**

1. Upload và parse PDF.  
2. Import một GitHub repo.  
3. Knowledge graph do AI đề xuất và giảng viên chỉnh sửa.  
4. Question bank có provenance.  
5. Quiz theo concept.  
6. Ghi nhận câu sai.  
7. Error recovery queue.  
8. Sinh câu hỏi tương tự.  
9. Rule-based mastery.  
10. Lịch ôn tập.  
11. Một loại coding challenge.  
12. Instructor dashboard cơ bản.  
13. Review workflow cho câu hỏi AI.  
14. Logging đầy đủ các learning events.

## **14.3. Chưa cần trong MVP**

* Avatar 3D.  
* Open world.  
* Marketplace.  
* Multiplayer realtime phức tạp.  
* Voice interaction.  
* Mobile native app.  
* Deep Knowledge Tracing.  
* Fine-tune LLM.  
* Hệ thống social lớn.  
* Blockchain hoặc NFT.  
* Đồ họa game tốn nhiều chi phí.

---

# **15\. Roadmap triển khai**

## **Giai đoạn 0 – Discovery: 2 tuần**

Mục tiêu:

* Phỏng vấn giảng viên.  
* Phỏng vấn 8–15 học viên.  
* Chọn khóa học pilot.  
* Thu thập PDF, lab, repo và rubric.  
* Xác định 30–50 concept.  
* Xác định các lỗi phổ biến.  
* Thiết kế pre-test và post-test.

Đầu ra:

* Problem validation.  
* User journey.  
* Course ontology bản đầu.  
* Learning measurement plan.  
* MVP scope.

## **Giai đoạn 1 – Content Intelligence: 3 tuần**

Xây dựng:

* PDF parser.  
* GitHub parser.  
* Chunking.  
* Provenance.  
* Concept extraction.  
* Learning objective extraction.  
* Knowledge graph editor.  
* Vector index.

Đầu ra:

* Course knowledge graph.  
* Evidence-linked content store.  
* Search và retrieval API.

## **Giai đoạn 2 – Question Engine: 3 tuần**

Xây dựng:

* Question schema.  
* Question generator.  
* Distractor generator.  
* Explanation generator.  
* Similar-question generator.  
* Verification pipeline.  
* Instructor review studio.

Đầu ra:

* 300–500 câu hỏi đã tạo.  
* Tối thiểu 100–200 câu được duyệt cho pilot.  
* Bộ benchmark đánh giá chất lượng câu hỏi.

## **Giai đoạn 3 – Adaptive Learning MVP: 3 tuần**

Xây dựng:

* Diagnostic test.  
* Mastery model.  
* Recommendation engine.  
* Error recovery.  
* Spaced review scheduler.  
* Student dashboard.

Đầu ra:

* Learning loop hoàn chỉnh.  
* Event tracking.  
* Mastery heatmap.

## **Giai đoạn 4 – Gamification: 2 tuần**

Xây dựng:

* Skill map.  
* Quest.  
* XP.  
* Badge có evidence.  
* Daily challenge.  
* Boss battle cơ bản.  
* Team progress.

## **Giai đoạn 5 – Lab Integration: 2–3 tuần**

Xây dựng:

* GitHub authentication.  
* Assignment mapping.  
* Code editor hoặc repo submission.  
* Test runner.  
* Test feedback.  
* Concept-linked debugging hints.

## **Giai đoạn 6 – Pilot: 4–8 tuần**

Thực hiện:

* Chạy pilot trong một lớp học.  
* Có nhóm intervention và comparison nếu điều kiện cho phép.  
* Thu thập pre-test, post-test và delayed test.  
* Theo dõi lỗi hệ thống.  
* Phỏng vấn học viên.  
* Đánh giá giảng viên.

---

# **16\. Bộ chỉ số đánh giá**

## **16.1. North Star Metric**

> **Số learning objectives được chứng minh là đã thành thạo và vẫn được duy trì sau delayed assessment.**

## **16.2. Learning metrics**

* Pre-test/post-test gain.  
* Delayed retention.  
* Transfer-question accuracy.  
* Error recovery rate.  
* Misconception resolution rate.  
* Mastery stability.  
* Lab completion rate.  
* Số hint cần sử dụng.  
* Khả năng giải thích đáp án.  
* Confidence calibration.

## **16.3. Engagement metrics**

* Weekly active learners.  
* Quest completion rate.  
* Review completion rate.  
* Streak survival.  
* Session completion.  
* Voluntary practice.  
* Team challenge participation.

Không sử dụng engagement đơn lẻ để chứng minh hiệu quả giáo dục.

## **16.4. AI quality metrics**

* Groundedness.  
* Answer correctness.  
* Question-answer alignment.  
* Ambiguity rate.  
* Duplicate rate.  
* Source citation accuracy.  
* Bloom classification accuracy.  
* Instructor acceptance rate.  
* Student report rate.  
* False-positive grading rate.

## **16.5. Instructor metrics**

* Thời gian tạo một module.  
* Thời gian review một câu hỏi.  
* Tỷ lệ câu AI được chấp nhận.  
* Số misconception được phát hiện.  
* Thời gian chấm lab tiết kiệm được.  
* Mức độ hài lòng của giảng viên.

---

# **17\. Thiết kế thí nghiệm chứng minh hiệu quả**

## **17.1. Câu hỏi nghiên cứu**

1. Sản phẩm có cải thiện kết quả học tập không?  
2. Học viên có ghi nhớ lâu hơn không?  
3. Error recovery có giúp giảm lặp lại lỗi không?  
4. Câu hỏi tương tự có giúp transfer kiến thức không?  
5. Gamification có tăng engagement mà không làm giảm chất lượng học không?  
6. Mastery model có dự đoán đúng kết quả bài kiểm tra không?

## **17.2. Thiết kế pilot**

Có thể chia:

* **Nhóm A:** sử dụng tài liệu và quiz truyền thống.  
* **Nhóm B:** sử dụng Adaptive Learning Game.

Cả hai nhóm:

* Học cùng nội dung.  
* Có thời lượng tương đương.  
* Làm cùng pre-test.  
* Làm cùng post-test.  
* Làm delayed test sau 1–3 tuần.

## **17.3. Ablation study**

Để biết tính năng nào có giá trị:

* Adaptive \+ game.  
* Adaptive không game.  
* Game không adaptive.  
* Quiz thông thường.

Có thể tiếp tục kiểm tra:

* Có và không có error recovery.  
* Có và không có similar-question engine.  
* Có và không có spaced review.

---

# **18\. Rủi ro và biện pháp giảm thiểu**

| Rủi ro | Biện pháp |
| ----- | ----- |
| AI tạo câu hỏi sai | Grounding, verification và instructor approval |
| Câu hỏi quá dễ | Difficulty calibration dựa trên dữ liệu |
| Học viên đoán đáp án | Yêu cầu explanation và confidence |
| Học viên học thuộc câu | Sinh variation và transfer question |
| Game lấn át việc học | Reward gắn với evidence of mastery |
| Leaderboard gây áp lực | Team progress, personal best và opt-out |
| Code execution không an toàn | Isolated sandbox và resource limit |
| PDF parse sai | Provenance viewer và chỉnh sửa thủ công |
| Knowledge graph sai | Instructor editing workflow |
| Chi phí LLM cao | Generate offline, cache, dùng model nhỏ cho classifier |
| Học viên dùng AI ngoài để trả lời | Oral explanation, code execution và process-based evidence |
| Giảng viên mất nhiều thời gian review | Risk scoring và ưu tiên review câu có độ bất định cao |
| Mastery score không đáng tin | Hiển thị evidence, không chỉ hiển thị một con số |

---

# **19\. Đội ngũ tối thiểu**

Một nhóm MVP có thể gồm:

* 1 Product owner có kiến thức giáo dục.  
* 1 Learning designer hoặc giảng viên môn học.  
* 1 AI/ML engineer.  
* 1 Backend engineer.  
* 1 Frontend engineer.  
* 1 UI/UX designer bán thời gian.  
* 1 Teaching assistant hỗ trợ xây benchmark và review nội dung.

Trong nhóm nhỏ, một người có thể đảm nhiệm nhiều vai trò.

---

# **20\. Tiêu chuẩn để sản phẩm được coi là outstanding**

Sản phẩm chỉ thực sự outstanding khi đạt được các điều kiện sau:

## **Về giáo dục**

* Phát hiện được học viên đang sai ở concept nào.  
* Phân biệt được quên kiến thức và hiểu sai kiến thức.  
* Tạo được vòng lặp sửa sai có kiểm chứng.  
* Đo được transfer, không chỉ đo recall.  
* Kết nối trực tiếp lý thuyết với lab.  
* Chứng minh được cải thiện trên delayed assessment.

## **Về AI**

* Mọi nội dung đều có nguồn.  
* AI biết từ chối khi không có đủ evidence.  
* Câu hỏi được kiểm tra bởi nhiều bước.  
* Có benchmark riêng cho từng khóa học.  
* Có human-in-the-loop.  
* Có cơ chế báo lỗi và sửa nội dung.

## **Về game**

* Gameplay phản ánh tiến trình học.  
* Thất bại tạo ra nhiệm vụ học mới.  
* Reward dựa trên mastery.  
* Không khuyến khích học viên spam câu hỏi để lấy điểm.  
* Học viên yếu vẫn có cơ hội tiến bộ và được công nhận.

## **Về sản phẩm**

* Giảng viên có thể tạo một course world từ tài liệu sẵn có.  
* Học viên biết chính xác mình cần làm gì tiếp theo.  
* Mỗi recommendation có thể giải thích được.  
* Hệ thống tạo ra dữ liệu hữu ích cho cải thiện khóa học.  
* Có kết quả pilot chứng minh learning gain và retention.

---

# **21\. Phiên bản sản phẩm đề xuất**

## **MVP**

> Adaptive quiz game từ PDF và GitHub, có knowledge graph, mastery tracking, error recovery và similar-question generation.

## **Version 1**

> Thêm lab autograding, misconception detection, boss battle và instructor analytics.

## **Version 2**

> Thêm knowledge tracing từ dữ liệu thật, team challenge, AI adversary và adaptive learning path.

## **Version 3**

> Nền tảng cho phép giảng viên biến bất kỳ khóa học kỹ thuật nào thành một game học tập thích ứng có thể đo lường hiệu quả.

---

# **22\. User journey mẫu**

Một học viên làm sai câu:

> “Tại sao raw prediction của mô hình không tốt khi các feature có scale khác nhau?”

Học viên chọn:

> “Vì mô hình chưa được train đủ epoch.”

Hệ thống thực hiện:

1. Xác định câu trả lời sai.  
2. Phân loại lỗi là conceptual misunderstanding.  
3. Gắn lỗi với `feature scaling` và `gradient descent`.  
4. Hiển thị một visualization hoặc ví dụ đơn giản.  
5. Yêu cầu học viên giải thích ảnh hưởng của scale.  
6. Sinh một câu hỏi tương tự trong ngữ cảnh khác.  
7. Mở mini-lab yêu cầu thêm normalization function.  
8. Chạy unit test.  
9. Đưa concept vào lịch ôn sau vài ngày.  
10. Chỉ tăng mastery mạnh khi học viên vượt qua delayed review.

Đây là khác biệt giữa:

> “Hệ thống chấm câu hỏi”

và:

> “Hệ thống giúp học viên sửa mô hình tư duy sai.”

---

# **23\. Thứ tự ưu tiên triển khai**

Thứ tự nên là:

Learning objectives  
    ↓  
Knowledge graph  
    ↓  
High-quality question bank  
    ↓  
Error recovery  
    ↓  
Mastery model  
    ↓  
Adaptive recommendation  
    ↓  
Lab integration  
    ↓  
Gamification  
    ↓  
Advanced AI features

Không nên bắt đầu bằng đồ họa game, avatar hoặc leaderboard.

Lợi thế cạnh tranh khó sao chép nhất sẽ không nằm ở giao diện game mà nằm ở:

1. Course knowledge graph.  
2. Dữ liệu misconception.  
3. Student learning traces.  
4. Question verification pipeline.  
5. Liên kết giữa concept, câu hỏi và code.  
6. Mô hình đo mastery có thể giải thích.  
7. Kết quả thực nghiệm chứng minh hiệu quả học tập.

