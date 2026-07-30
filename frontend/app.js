const state = {
  role: "student",
  language: "vi",
  route: "home",
  selectedAnswer: null,
  confidence: "Medium",
  recallStage: "intro",
  recallAnswer: null,
  recoveryStep: 0,
  uploadReady: false,
  generation: 0,
  claim: null,
  aiComplete: false,
  liveRole: "student",
  liveStage: "lobby",
  liveAnswer: null,
  liveSubmitted: false,
  labRun: false,
  labSubmitted: false,
  bossComplete: false
};

const vi = [
  ["Scale the input features to comparable ranges", "Đưa các đặc trưng đầu vào về miền giá trị tương đương"],
  ["Increase training epochs only", "Chỉ tăng số epoch huấn luyện"],
  ["Remove the feature with the largest values", "Loại bỏ đặc trưng có giá trị lớn nhất"],
  ["Use the test set for tuning", "Dùng tập kiểm thử để tinh chỉnh"],
  ["Due because last review was 7 days ago", "Đến hạn vì lần ôn gần nhất cách đây 7 ngày"],
  ["A gradient descent model oscillates because two numeric features use very different ranges. Which response best addresses the cause?", "Mô hình hạ gradient dao động vì hai đặc trưng số có miền giá trị rất khác nhau. Cách nào xử lý đúng nguyên nhân nhất?"],
  ["Confidence is required for spaced recall.", "Cần chọn độ tự tin cho bài ôn ngắt quãng."],
  ["Submit recall answer", "Gửi đáp án ôn tập"],
  ["Daily Recall result", "Kết quả ôn tập hằng ngày"],
  ["Review complete", "Hoàn thành ôn tập"],
  ["Your recall schedule has been updated from this session.", "Lịch ôn tập đã được cập nhật từ phiên học này."],
  ["4 concepts refreshed", "Đã củng cố 4 khái niệm"],
  ["You answered 3 of 4 correctly and calibrated your confidence.", "Bạn trả lời đúng 3/4 câu và đã hiệu chỉnh độ tự tin."],
  ["3 correct", "3 câu đúng"], ["recovery queued", "nhiệm vụ khắc phục đã lên lịch"],
  ["Next review schedule", "Lịch ôn tập tiếp theo"],
  ["Review again in 3 days", "Ôn lại sau 3 ngày"], ["Refreshed", "Đã củng cố"],
  ["Review again tomorrow", "Ôn lại vào ngày mai"], ["Due soon", "Sắp đến hạn"],
  ["Confidence calibration", "Hiệu chỉnh độ tự tin"],
  ["High confidence + correct answer strengthened your delayed-recall evidence.", "Tự tin cao cùng đáp án đúng đã củng cố minh chứng ghi nhớ dài hạn."],
  ["Practice again", "Luyện tập lại"], ["Back home", "Về trang chủ"],
  ["Lab Arena result", "Kết quả Đấu trường Thực hành"], ["Lab completed", "Hoàn thành bài thực hành"],
  ["Your code passed the tests and produced concept-linked application evidence.", "Mã nguồn đã vượt kiểm thử và tạo minh chứng vận dụng gắn với khái niệm."],
  ["All tests passed", "Tất cả kiểm thử đã đạt"],
  ["You implemented standardization and explained why it stabilizes gradient descent.", "Bạn đã triển khai chuẩn hóa và giải thích vì sao nó giúp hạ gradient ổn định."],
  ["Lab evidence", "Minh chứng thực hành"], ["Evidence earned", "Minh chứng đạt được"],
  ["Applied normalization in code", "Đã áp dụng chuẩn hóa trong mã nguồn"],
  ["Visible and hidden tests passed", "Đã vượt kiểm thử hiển thị và ẩn"],
  ["Explained training stability", "Đã giải thích độ ổn định huấn luyện"],
  ["Linked implementation to lecture concept", "Đã liên kết phần triển khai với khái niệm bài giảng"],
  ["Next challenge", "Thử thách tiếp theo"],
  ["Use the same preprocessing decision in the Boss Battle scenario.", "Dùng quyết định tiền xử lý tương tự trong tình huống Đại chiến Trùm."],
  ["Retry lab", "Làm lại bài thực hành"], ["Submit lab", "Nộp bài thực hành"],
  ["Boss Battle result", "Kết quả Đại chiến Trùm"], ["Boss defeated", "Đã đánh bại Trùm"],
  ["You transferred multiple concepts across one complete model-repair scenario.", "Bạn đã vận dụng nhiều khái niệm trong một tình huống sửa mô hình hoàn chỉnh."],
  ["The Broken Model is rescued", "Mô hình Hỏng đã được giải cứu"],
  ["You diagnosed, fixed, explained, and transferred the solution across all five phases.", "Bạn đã chẩn đoán, sửa lỗi, giải thích và vận dụng giải pháp qua đủ năm giai đoạn."],
  ["Boss badge", "Huy hiệu Trùm"], ["Next zone unlocked", "Đã mở khu vực tiếp theo"],
  ["Phase performance", "Kết quả theo giai đoạn"], ["Diagnose root cause", "Chẩn đoán nguyên nhân gốc"],
  ["Choose pipeline fix", "Chọn cách sửa pipeline"], ["Explain interaction", "Giải thích tương tác"],
  ["Transfer to new data", "Vận dụng sang dữ liệu mới"], ["Final challenge", "Thử thách cuối"],
  ["Strong transfer evidence", "Minh chứng vận dụng mạnh"], ["Clear", "Đã vượt"],
  ["Evaluation Arena unlocked", "Đã mở Đấu trường Đánh giá"],
  ["Your evidence is strong enough to continue to the next course zone.", "Minh chứng của bạn đủ mạnh để tiếp tục sang khu vực khóa học tiếp theo."],
  ["Unlock next zone", "Mở khu vực tiếp theo"], ["Replay boss", "Đấu lại Trùm"],
  ["AI Adversary result", "Kết quả Đối thủ AI"], ["You caught the misleading reasoning", "Bạn đã phát hiện suy luận gây hiểu lầm"],
  ["Your correction was accepted and grounded in the lecture source.", "Bản sửa đã được chấp nhận và có căn cứ từ bài giảng."],
  ["AI claim corrected", "Đã sửa nhận định của AI"],
  ["Feature scaling affects optimization stability and direction, not only speed.", "Chuẩn hóa đặc trưng ảnh hưởng đến độ ổn định và hướng tối ưu hóa, không chỉ tốc độ."],
  ["Critical reasoning", "Tư duy phản biện"], ["Source citation", "Trích dẫn nguồn"],
  ["Accepted correction", "Bản sửa được chấp nhận"],
  ["Scaling places features on comparable ranges, producing more balanced and stable gradient updates.", "Chuẩn hóa đưa các đặc trưng về miền tương đương, tạo bước cập nhật gradient cân bằng và ổn định hơn."],
  ["Detected a false explanation, repaired the mechanism, and cited the correct source.", "Đã phát hiện giải thích sai, sửa lại cơ chế và trích dẫn đúng nguồn."],
  ["Try harder adversary", "Thử đối thủ khó hơn"], ["Back to map", "Về bản đồ"],
  ["All visible tests passed", "Tất cả kiểm thử hiển thị đã đạt"],
  ["Daily Recall session started", "Đã bắt đầu phiên ôn tập hằng ngày"],
  ["Critical hit · explanation accepted", "Đòn chí mạng · giải thích được chấp nhận"],
  ["COURSE STUDIO", "XƯỞNG KHÓA HỌC"],
  ["MODE", "CHẾ ĐỘ"],
  ["ML Foundations · Team Battle", "Nền tảng Học máy · Thi đấu đồng đội"],
  ["Team Gradient", "Đội Gradient"],
  ["Room", "Phòng"],
  ["Model Evaluation", "Đánh giá mô hình"],
  ["MSE Loss", "Hàm mất mát MSE"],
  ["Published", "Đã xuất bản"],
  ["Preview", "Xem thử"],
  ["Higher learning rate is always faster", "Tốc độ học cao hơn luôn nhanh hơn"],
  ["21 of 24 questions have strong source evidence. Three need instructor review.", "21/24 câu hỏi có minh chứng nguồn đáng tin cậy. Ba câu cần giảng viên duyệt."],
  ["10 min", "10 phút"],
  ["Machine Learning Foundations", "Nền tảng Học máy"],
  ["Learning world", "Thế giới học tập"],
  ["Student explorer", "Học viên khám phá"],
  ["Course instructor", "Giảng viên khóa học"],
  ["Course Studio", "Xưởng khóa học"],
  ["Upload Lecture", "Tải bài giảng"],
  ["Course World", "Thế giới khóa học"],
  ["Question Studio", "Xưởng câu hỏi"],
  ["Learning Analytics", "Phân tích học tập"],
  ["Live Battle", "Thi đấu trực tiếp"],
  ["Dashboard", "Tổng quan"],
  ["Monitor", "Theo dõi"],
  ["Learn", "Học tập"],
  ["Home", "Trang chủ"],
  ["Course Map", "Bản đồ khóa học"],
  ["Game Modes", "Chế độ chơi"],
  ["Daily Recall", "Ôn tập hằng ngày"],
  ["My Mastery", "Năng lực của tôi"],
  ["Recover", "Khắc phục"],
  ["Error Dungeon", "Hầm ngục lỗi sai"],
  ["AI Adversary", "Đối thủ AI"],
  ["Student home", "Trang chủ học viên"],
  ["Course map", "Bản đồ khóa học"],
  ["Game modes", "Chế độ chơi"],
  ["Story Quest", "Nhiệm vụ cốt truyện"],
  ["Learning feedback", "Phản hồi học tập"],
  ["Recovery mission", "Nhiệm vụ khắc phục"],
  ["Quest result", "Kết quả nhiệm vụ"],
  ["Daily recall", "Ôn tập hằng ngày"],
  ["Mastery evidence", "Minh chứng năng lực"],
  ["Lab Arena", "Đấu trường thực hành"],
  ["Boss Battle", "Đại chiến Trùm"],
  ["Live Class Battle", "Thi đấu lớp học trực tiếp"],
  ["Instructor dashboard", "Tổng quan giảng viên"],
  ["Upload lecture", "Tải bài giảng"],
  ["AI course generation", "AI tạo khóa học"],
  ["Generated course world", "Thế giới khóa học đã tạo"],
  ["Question review studio", "Xưởng duyệt câu hỏi"],
  ["Learning analytics", "Phân tích học tập"],
  ["Welcome back, Linh", "Chào mừng trở lại, Linh"],
  ["Your model is waiting for a rescue.", "Mô hình đang chờ bạn giải cứu."],
  ["Continue through Gradient Forest, uncover why training is unstable, and turn one misconception into lasting mastery.", "Tiếp tục qua Rừng Gradient, tìm nguyên nhân huấn luyện bất ổn và biến một hiểu lầm thành kiến thức vững chắc."],
  ["Continue quest", "Tiếp tục nhiệm vụ"],
  ["Open course map", "Mở bản đồ khóa học"],
  ["Total learning experience", "Tổng điểm kinh nghiệm học tập"],
  ["this week", "tuần này"],
  ["Concepts explored", "Khái niệm đã khám phá"],
  ["near mastery", "sắp thành thạo"],
  ["due", "cần ôn"],
  ["Daily recall queue", "Danh sách ôn tập hằng ngày"],
  ["minute session", "phút ôn tập"],
  ["errors", "lỗi sai"],
  ["Recovery missions", "Nhiệm vụ khắc phục"],
  ["delayed check", "lần kiểm tra lại"],
  ["Recommended next", "Đề xuất tiếp theo"],
  ["Chosen from your mastery and error history.", "Được chọn dựa trên năng lực và lịch sử lỗi sai của bạn."],
  ["Best match", "Phù hợp nhất"],
  ["Gradient Forest", "Rừng Gradient"],
  ["Stabilize the Gradient", "Ổn định Gradient"],
  ["Investigate a model that diverges even after more training. Apply feature scaling and explain why it changes optimization.", "Điều tra mô hình vẫn phân kỳ dù huấn luyện lâu hơn. Áp dụng chuẩn hóa đặc trưng và giải thích tác động đến tối ưu hóa."],
  ["Feature Scaling", "Chuẩn hóa đặc trưng"],
  ["Gradient Descent", "Hạ Gradient"],
  ["Start quest", "Bắt đầu nhiệm vụ"],
  ["View source", "Xem nguồn"],
  ["Learning pulse", "Nhịp học tập"],
  ["This week's evidence", "Minh chứng tuần này"],
  ["Live", "Trực tiếp"],
  ["mastery", "năng lực"],
  ["needs transfer proof", "cần minh chứng vận dụng"],
  ["improving", "đang tiến bộ"],
  ["Recall due tomorrow", "Cần ôn lại vào ngày mai"],
  ["See mastery evidence", "Xem minh chứng năng lực"],
  ["Every node is a learning objective. Clear quests, repair misconceptions, and unlock the Boss Gate.", "Mỗi nút là một mục tiêu học tập. Hoàn thành nhiệm vụ, sửa hiểu lầm và mở khóa Cổng Trùm."],
  ["Browse all modes", "Xem tất cả chế độ"],
  ["Data Village", "Làng Dữ liệu"],
  ["Evaluation Arena", "Đấu trường Đánh giá"],
  ["Clean the Dataset", "Làm sạch Dữ liệu"],
  ["Decode the Loss", "Giải mã Hàm mất mát"],
  ["Boss Gate", "Cổng Trùm"],
  ["Current quest", "Nhiệm vụ hiện tại"],
  ["Start", "Bắt đầu"],
  ["Source", "Nguồn"],
  ["Choose your challenge", "Chọn thử thách của bạn"],
  ["Seven ways to build mastery", "Bảy cách xây dựng năng lực"],
  ["Each mode collects a different kind of evidence, from delayed recall to code application and critical reasoning.", "Mỗi chế độ thu thập một loại minh chứng khác nhau, từ ghi nhớ dài hạn đến vận dụng mã nguồn và tư duy phản biện."],
  ["Follow the course map and unlock concepts through short missions.", "Theo bản đồ khóa học và mở khóa khái niệm qua các nhiệm vụ ngắn."],
  ["Open map", "Mở bản đồ"],
  ["Recommended", "Đề xuất"],
  ["A five-minute review before concepts fade.", "Ôn nhanh năm phút trước khi kiến thức phai dần."],
  ["Start review", "Bắt đầu ôn"],
  ["Turn past mistakes into missions you can clear.", "Biến lỗi sai trước đây thành nhiệm vụ cần chinh phục."],
  ["Fix errors", "Sửa lỗi sai"],
  ["waiting", "đang chờ"],
  ["Apply concepts in code and get concept-linked feedback.", "Vận dụng khái niệm trong mã nguồn và nhận phản hồi theo kiến thức."],
  ["Enter lab", "Vào phòng thực hành"],
  ["unlocked", "đã mở khóa"],
  ["Prove mastery across multiple concepts in one scenario.", "Chứng minh năng lực trên nhiều khái niệm trong một tình huống."],
  ["Challenge boss", "Thách đấu Trùm"],
  ["Ready", "Sẵn sàng"],
  ["Join your class to solve a shared boss challenge.", "Tham gia cùng lớp để giải thử thách Trùm chung."],
  ["Join room", "Vào phòng"],
  ["demo", "mô phỏng"],
  ["Catch a convincing wrong explanation and correct it with evidence.", "Phát hiện lời giải thích sai nhưng thuyết phục và sửa bằng minh chứng."],
  ["Challenge AI", "Thách đấu AI"],
  ["Advanced", "Nâng cao"],
  ["Your model keeps diverging. Find the missing preprocessing step.", "Mô hình liên tục phân kỳ. Hãy tìm bước tiền xử lý còn thiếu."],
  ["Apply", "Vận dụng"],
  ["A model has one feature ranging from 0–1 and another from 1–100,000. Training oscillates even after increasing epochs. What should you try first?", "Một mô hình có một đặc trưng trong khoảng 0–1 và đặc trưng khác trong khoảng 1–100.000. Quá trình huấn luyện vẫn dao động dù đã tăng số epoch. Bạn nên thử gì trước?"],
  ["Increase epochs from 100 to 10,000", "Tăng số epoch từ 100 lên 10.000"],
  ["Standardize the feature scales before training", "Chuẩn hóa thang đo đặc trưng trước khi huấn luyện"],
  ["Remove the smaller-valued feature", "Loại bỏ đặc trưng có giá trị nhỏ hơn"],
  ["Increase the learning rate to converge faster", "Tăng tốc độ học để hội tụ nhanh hơn"],
  ["How confident are you?", "Bạn tự tin đến mức nào?"],
  ["Your confidence helps calibrate mastery.", "Mức tự tin giúp hiệu chỉnh đánh giá năng lực."],
  ["Low", "Thấp"], ["Medium", "Trung bình"], ["High", "Cao"],
  ["Use a hint", "Dùng gợi ý"], ["Check answer", "Kiểm tra đáp án"],
  ["Not quite, but this is useful.", "Chưa đúng, nhưng lỗi này rất hữu ích."],
  ["VinCourse identified the reasoning pattern behind the answer and prepared a focused recovery mission.", "VinCourse đã xác định kiểu suy luận phía sau đáp án và chuẩn bị nhiệm vụ khắc phục phù hợp."],
  ["Conceptual misunderstanding", "Hiểu sai khái niệm"],
  ["Training longer does not fix an unstable optimization path.", "Huấn luyện lâu hơn không sửa được đường tối ưu hóa bất ổn."],
  ["You may be assuming that more epochs always improve convergence. When feature scales differ dramatically, gradient updates can zigzag or overshoot regardless of training duration.", "Bạn có thể đang cho rằng nhiều epoch luôn giúp hội tụ tốt hơn. Khi thang đo đặc trưng chênh lệch lớn, bước cập nhật gradient có thể zigzag hoặc vượt quá điểm tối ưu dù huấn luyện bao lâu."],
  ["Detected misconception", "Hiểu lầm được phát hiện"],
  ["More epochs can compensate for missing feature scaling.", "Nhiều epoch có thể bù cho việc thiếu chuẩn hóa đặc trưng."],
  ["Hint 1 unlocked", "Đã mở gợi ý 1"],
  ["Compare the path of gradient descent across features with very different ranges.", "So sánh đường đi của hạ gradient trên các đặc trưng có miền giá trị rất khác nhau."],
  ["Hint 2 · Example from lecture", "Gợi ý 2 · Ví dụ từ bài giảng"],
  ["Hint 3 · Visual explanation", "Gợi ý 3 · Giải thích trực quan"],
  ["Try again", "Thử lại"], ["Start recovery mission", "Bắt đầu nhiệm vụ khắc phục"],
  ["Source evidence", "Minh chứng nguồn"],
  ["Feature Scaling and Gradient Descent", "Chuẩn hóa đặc trưng và Hạ Gradient"],
  ["Section", "Mục"], ["Optimization path", "Đường tối ưu hóa"],
  ["Open source", "Mở nguồn"], ["Why it matters", "Vì sao điều này quan trọng"],
  ["Unscaled inputs can produce slow or unstable learning. This appears again in the upcoming Lab Arena.", "Dữ liệu chưa chuẩn hóa có thể khiến việc học chậm hoặc bất ổn. Nội dung này sẽ xuất hiện lại trong Đấu trường Thực hành."],
  ["Error recovery", "Khắc phục lỗi sai"],
  ["Fix: Feature scaling misconception", "Khắc phục: Hiểu lầm về chuẩn hóa đặc trưng"],
  ["One short learning loop turns this mistake into evidence you can reuse.", "Một vòng học ngắn biến lỗi này thành minh chứng có thể tái sử dụng."],
  ["Review", "Xem lại"], ["Explain", "Giải thích"], ["Similar", "Tương tự"], ["Transfer", "Vận dụng"], ["Confirm", "Xác nhận"],
  ["Feature scaling changes the geometry of optimization.", "Chuẩn hóa đặc trưng làm thay đổi hình học của quá trình tối ưu."],
  ["With very different feature ranges, contours become elongated and the gradient path zigzags. Standardization makes each feature contribute on a comparable scale.", "Khi miền giá trị đặc trưng rất khác nhau, đường đồng mức bị kéo dài và đường gradient zigzag. Chuẩn hóa giúp mỗi đặc trưng đóng góp trên thang đo tương đương."],
  ["Explain it in your own words", "Hãy giải thích bằng lời của bạn"],
  ["Why might increasing epochs not fix unstable training when feature scales differ?", "Vì sao tăng epoch có thể không khắc phục được huấn luyện bất ổn khi thang đo đặc trưng khác nhau?"],
  ["Try a similar case", "Thử một trường hợp tương tự"],
  ["Transfer to a new context", "Vận dụng sang bối cảnh mới"],
  ["Misconception resolved", "Đã khắc phục hiểu lầm"],
  ["Explanation verified", "Đã xác minh giải thích"], ["Transfer passed", "Đã vượt thử thách vận dụng"],
  ["Recall in 3 days", "Ôn lại sau 3 ngày"], ["I reviewed this", "Tôi đã xem lại"],
  ["Submit & continue", "Gửi và tiếp tục"], ["Claim recovery reward", "Nhận thưởng khắc phục"],
  ["Quest complete", "Hoàn thành nhiệm vụ"], ["Gradient stabilized!", "Gradient đã ổn định!"],
  ["You repaired a misconception and unlocked stronger evidence for Feature Scaling.", "Bạn đã sửa một hiểu lầm và mở khóa minh chứng mạnh hơn cho Chuẩn hóa đặc trưng."],
  ["recovery bonus", "thưởng khắc phục"], ["day streak", "ngày liên tiếp"],
  ["Mastery updated", "Năng lực đã cập nhật"], ["Explained the misconception", "Đã giải thích hiểu lầm"],
  ["Conceptual evidence", "Minh chứng khái niệm"], ["Solved a transfer question", "Đã giải câu hỏi vận dụng"],
  ["Application evidence", "Minh chứng vận dụng"], ["Next recommendation", "Đề xuất tiếp theo"],
  ["Learning Rate Tuning", "Điều chỉnh tốc độ học"], ["Continue on map", "Tiếp tục trên bản đồ"],
  ["Review evidence", "Xem minh chứng"],
  ["Spaced practice", "Ôn tập ngắt quãng"], ["A short review generated from your forgetting forecast.", "Phiên ôn ngắn được tạo từ dự báo mức độ quên của bạn."],
  ["Start 5-minute review", "Bắt đầu ôn 5 phút"], ["Due today", "Cần ôn hôm nay"],
  ["concepts selected for maximum learning value.", "khái niệm được chọn để tối đa hiệu quả học tập."],
  ["Last reviewed 7 days ago", "Lần cuối ôn cách đây 7 ngày"], ["Confidence lower than accuracy", "Độ tự tin thấp hơn độ chính xác"],
  ["One prior error", "Có một lỗi trước đây"], ["Newly learned concept", "Khái niệm mới học"],
  ["Today", "Hôm nay"], ["Session settings", "Cài đặt phiên học"], ["Duration", "Thời lượng"],
  ["minutes", "phút"], ["Questions", "Câu hỏi"], ["Evidence collected", "Minh chứng thu thập"],
  ["Delayed recall and confidence calibration for every answer.", "Ghi nhớ dài hạn và hiệu chỉnh độ tự tin cho mỗi câu trả lời."],
  ["Recovery zone", "Khu vực khắc phục"], ["Every past mistake becomes a focused mission you can clear.", "Mỗi lỗi sai trước đây trở thành một nhiệm vụ tập trung để bạn chinh phục."],
  ["Start next recovery", "Bắt đầu khắc phục tiếp theo"], ["More epochs fix unstable training", "Nhiều epoch khắc phục huấn luyện bất ổn"],
  ["Overgeneralization", "Khái quát hóa quá mức"], ["Data leakage", "Rò rỉ dữ liệu"],
  ["Partially fixed", "Đã khắc phục một phần"], ["Delayed check due", "Đến hạn kiểm tra lại"],
  ["Recovery rules", "Quy tắc khắc phục"], ["Review the source", "Xem lại nguồn"], ["Reconnect to the lecture", "Kết nối lại với bài giảng"],
  ["Explain the mistake", "Giải thích lỗi sai"], ["Show your reasoning changed", "Cho thấy suy luận đã thay đổi"],
  ["Apply and transfer", "Áp dụng và vận dụng"], ["Solve two new contexts", "Giải hai bối cảnh mới"],
  ["Your learning evidence", "Minh chứng học tập của bạn"], ["Mastery Dashboard", "Bảng năng lực"],
  ["Mastery grows from recall, explanation, transfer, and application, not only quiz scores.", "Năng lực phát triển từ ghi nhớ, giải thích, vận dụng và thực hành, không chỉ từ điểm trắc nghiệm."],
  ["Total XP", "Tổng XP"], ["Concepts mastered", "Khái niệm thành thạo"], ["Recovery rate", "Tỷ lệ khắc phục"],
  ["Confidence match", "Độ khớp tự tin"], ["Well calibrated", "Hiệu chỉnh tốt"], ["Concept mastery", "Năng lực theo khái niệm"],
  ["Evidence", "Minh chứng"], ["Next review", "Lần ôn tiếp"], ["Practice", "Luyện tập"], ["Evidence timeline", "Dòng thời gian minh chứng"],
  ["Transfer challenge passed", "Đã vượt thử thách vận dụng"], ["Misconception repaired", "Đã sửa hiểu lầm"], ["Code application", "Vận dụng mã nguồn"],
  ["Application", "Vận dụng"], ["Complete the preprocessing function, run the tests, and connect the code result to the lecture.", "Hoàn thiện hàm tiền xử lý, chạy kiểm thử và liên kết kết quả mã nguồn với bài giảng."],
  ["Challenge", "Thử thách"], ["Normalize the input", "Chuẩn hóa dữ liệu đầu vào"],
  ["Complete", "Hoàn thiện"], ["Completion", "Tiến độ"], ["Lecture source", "Nguồn bài giảng"],
  ["Tests", "Kiểm thử"], ["Not run", "Chưa chạy"], ["Run visible tests to validate your implementation.", "Chạy các kiểm thử hiển thị để xác nhận phần triển khai."],
  ["Run tests", "Chạy kiểm thử"], ["Open hint", "Mở gợi ý"], ["passed", "đã đạt"],
  ["Concept evidence found", "Đã tìm thấy minh chứng khái niệm"], ["Applied standardization in code.", "Đã áp dụng chuẩn hóa trong mã nguồn."],
  ["Integration", "Tổng hợp"], ["Prove mastery across feature scaling, learning rate, loss, and evaluation in one scenario.", "Chứng minh năng lực về chuẩn hóa đặc trưng, tốc độ học, hàm mất mát và đánh giá trong một tình huống."],
  ["Rescue the Broken Model", "Giải cứu Mô hình Hỏng"], ["Phase", "Giai đoạn"],
  ["A model diverges, validation is unstable, and an AI-generated explanation may be wrong. Diagnose and repair the full pipeline.", "Mô hình phân kỳ, kết quả validation bất ổn và lời giải thích do AI tạo có thể sai. Hãy chẩn đoán và sửa toàn bộ pipeline."],
  ["Boss stability", "Độ ổn định của Trùm"], ["Evidence collected", "Minh chứng đã thu thập"],
  ["Explain your diagnosis", "Giải thích chẩn đoán"], ["You already identified unscaled features and a high learning rate.", "Bạn đã xác định đặc trưng chưa chuẩn hóa và tốc độ học quá cao."],
  ["Why do these two issues amplify each other?", "Vì sao hai vấn đề này khuếch đại lẫn nhau?"],
  ["Strike boss", "Tấn công Trùm"], ["Diagnosed root cause", "Đã chẩn đoán nguyên nhân gốc"], ["Selected pipeline fix", "Đã chọn cách sửa pipeline"],
  ["Current phase", "Giai đoạn hiện tại"], ["View source references", "Xem nguồn tham chiếu"],
  ["Collaborate", "Cộng tác"], ["Join your class and solve a shared boss challenge together.", "Tham gia cùng lớp và giải thử thách Trùm chung."],
  ["now", "ngay bây giờ"], ["learners joined", "học viên đã tham gia"], ["Class code", "Mã lớp"], ["Join battle", "Tham gia trận đấu"],
  ["How your team scores", "Cách đội của bạn tính điểm"], ["Correctness", "Độ chính xác"], ["Choose the sound diagnosis", "Chọn chẩn đoán hợp lý"],
  ["Explanation quality", "Chất lượng giải thích"], ["Make the reasoning clear", "Trình bày suy luận rõ ràng"],
  ["Confidence match", "Độ khớp tự tin"], ["Calibrate as a team", "Hiệu chỉnh theo đội"],
  ["Live room", "Phòng trực tiếp"], ["Answer submitted", "Đã gửi đáp án"], ["Team answer received", "Đã nhận đáp án đội"],
  ["Team Gradient selected feature scaling.", "Đội Gradient đã chọn chuẩn hóa đặc trưng."],
  ["Class responses", "Phản hồi của lớp"], ["Simulate instructor reveal", "Mô phỏng giảng viên công bố"],
  ["Writing explanation", "Đang viết giải thích"], ["Submitted", "Đã gửi"], ["Working", "Đang làm"],
  ["Work with Team Gradient. Correctness, explanation quality, and confidence all count.", "Phối hợp cùng Đội Gradient. Độ chính xác, chất lượng giải thích và độ tự tin đều được tính điểm."],
  ["Class boss stability", "Độ ổn định Trùm của lớp"], ["Diagnose", "Chẩn đoán"],
  ["Team challenge", "Thử thách đội"], ["Explain your reasoning to the team", "Giải thích suy luận cho đội"],
  ["Confidence", "Độ tự tin"], ["Ask team for a hint", "Xin gợi ý từ đội"], ["Submit for Team Gradient", "Gửi cho Đội Gradient"],
  ["Live battle result", "Kết quả thi đấu trực tiếp"], ["The class defeated the boss!", "Cả lớp đã đánh bại Trùm!"],
  ["Battle complete", "Hoàn thành trận đấu"], ["Team Gradient placed #1", "Đội Gradient xếp hạng nhất"],
  ["Your evidence", "Minh chứng của bạn"], ["Correct diagnosis", "Chẩn đoán chính xác"], ["Team explanation", "Giải thích của đội"],
  ["Class misconception", "Hiểu lầm của lớp"], ["Start personal recovery", "Bắt đầu khắc phục cá nhân"], ["Replay demo", "Chơi lại mô phỏng"],
  ["Critical thinking", "Tư duy phản biện"], ["Catch convincing but incorrect reasoning, repair it, and support your correction with lecture evidence.", "Phát hiện suy luận thuyết phục nhưng sai, sửa lại và bảo vệ bằng minh chứng bài giảng."],
  ["AI tutor response", "Phản hồi của trợ giảng AI"], ["Select the most misleading claim.", "Chọn nhận định gây hiểu lầm nhất."],
  ["Correct the reasoning", "Sửa lại lập luận"], ["Attach source", "Đính kèm nguồn"], ["Submit correction", "Gửi bản sửa"],
  ["Mission checklist", "Danh sách nhiệm vụ"], ["Flag a wrong claim", "Đánh dấu nhận định sai"], ["Identify misleading reasoning", "Xác định suy luận gây hiểu lầm"],
  ["Write a correction", "Viết bản sửa"], ["Explain the mechanism", "Giải thích cơ chế"], ["Cite evidence", "Trích dẫn minh chứng"], ["Reward", "Phần thưởng"],
  ["Instructor workspace", "Không gian giảng viên"], ["Build learning worlds from your lectures", "Xây dựng thế giới học tập từ bài giảng"],
  ["Upload source material, review AI-generated quests, and track where students need support.", "Tải tài liệu nguồn, duyệt nhiệm vụ do AI tạo và theo dõi nơi học viên cần hỗ trợ."],
  ["Create course", "Tạo khóa học"], ["Course simulations", "Mô phỏng khóa học"], ["Mapped concepts", "Khái niệm đã ánh xạ"],
  ["Generated questions", "Câu hỏi đã tạo"], ["Active learners", "Học viên hoạt động"], ["Recently generated learning worlds.", "Các thế giới học tập được tạo gần đây."],
  ["published", "đã xuất bản"], ["draft", "bản nháp"], ["Resume", "Tiếp tục"], ["archived", "đã lưu trữ"],
  ["Needs your review", "Cần bạn duyệt"], ["question sources", "nguồn câu hỏi"], ["Low evidence confidence", "Độ tin cậy minh chứng thấp"],
  ["misconception labels", "nhãn hiểu lầm"], ["Confirm before publishing", "Xác nhận trước khi xuất bản"], ["Review content", "Duyệt nội dung"],
  ["Step", "Bước"], ["Upload lecture material", "Tải tài liệu bài giảng"],
  ["VinCourse will extract concepts, dependencies, questions, misconceptions, and a playable quest path.", "VinCourse sẽ trích xuất khái niệm, quan hệ phụ thuộc, câu hỏi, hiểu lầm và lộ trình nhiệm vụ có thể chơi."],
  ["Drop your lecture PDF here", "Thả tệp PDF bài giảng vào đây"], ["PDF up to 50 MB · lecture slides or reading material", "PDF tối đa 50 MB · slide bài giảng hoặc tài liệu đọc"],
  ["Choose PDF", "Chọn PDF"], ["Use demo lecture", "Dùng bài giảng mẫu"], ["Course details", "Thông tin khóa học"],
  ["Course title", "Tên khóa học"], ["Audience", "Đối tượng"], ["University students", "Sinh viên đại học"], ["Difficulty", "Độ khó"],
  ["Beginner to intermediate", "Cơ bản đến trung cấp"], ["Generate misconceptions", "Tạo các hiểu lầm"], ["Prepare recovery missions", "Chuẩn bị nhiệm vụ khắc phục"],
  ["Generate Lab Arena", "Tạo Đấu trường Thực hành"], ["Code application challenge", "Thử thách vận dụng mã nguồn"], ["Generate course world", "Tạo thế giới khóa học"],
  ["ready", "sẵn sàng"], ["Verified", "Đã xác minh"], ["Generating your learning world", "Đang tạo thế giới học tập"],
  ["This demo simulates how source-grounded learning content is assembled from the lecture.", "Bản demo mô phỏng cách nội dung học tập có căn cứ nguồn được tạo từ bài giảng."],
  ["Your course world is ready", "Thế giới khóa học đã sẵn sàng"], ["Building quests and evidence", "Đang xây nhiệm vụ và minh chứng"],
  ["Mapping learning objectives to interactive game modes...", "Đang ánh xạ mục tiêu học tập vào các chế độ chơi tương tác..."],
  ["Read PDF", "Đọc PDF"], ["Extract concepts", "Trích xuất khái niệm"], ["Build graph", "Xây đồ thị"], ["Generate challenges", "Tạo thử thách"], ["Verify sources", "Xác minh nguồn"],
  ["Review generated world", "Duyệt thế giới đã tạo"], ["You can leave this screen. Generation continues in the background.", "Bạn có thể rời màn hình này. Quá trình tạo vẫn tiếp tục trong nền."],
  ["Review generated course world", "Duyệt thế giới khóa học đã tạo"], ["Verify concepts, quest sequence, misconceptions, and source evidence before publishing.", "Xác minh khái niệm, chuỗi nhiệm vụ, hiểu lầm và minh chứng nguồn trước khi xuất bản."],
  ["Preview as student", "Xem thử với vai trò học viên"], ["Publish course", "Xuất bản khóa học"], ["Concepts", "Khái niệm"], ["Quest path", "Lộ trình nhiệm vụ"],
  ["Misconceptions", "Hiểu lầm"], ["links", "liên kết"], ["zones", "khu vực"], ["source verified", "đã xác minh nguồn"], ["Recovery ready", "Sẵn sàng khắc phục"],
  ["Concept graph", "Đồ thị khái niệm"], ["Edit graph", "Sửa đồ thị"], ["Quest sequence", "Chuỗi nhiệm vụ"], ["Misconception recovery", "Khắc phục hiểu lầm"],
  ["generated", "đã tạo"], ["Source grounding", "Căn cứ nguồn"], ["verified", "đã xác minh"], ["Review", "Duyệt"],
  ["Content quality", "Chất lượng nội dung"], ["Question Review Studio", "Xưởng duyệt câu hỏi"], ["Review prompts, answers, misconception labels, and exact source evidence.", "Duyệt đề bài, đáp án, nhãn hiểu lầm và minh chứng nguồn chính xác."],
  ["Approve verified items", "Duyệt các mục đã xác minh"], ["Needs review", "Cần duyệt"], ["Prompt", "Đề bài"], ["Correct answer", "Đáp án đúng"],
  ["Difficulty", "Độ khó"], ["Detected misconception for option A", "Hiểu lầm phát hiện ở lựa chọn A"], ["Request regeneration", "Yêu cầu tạo lại"], ["Approve question", "Duyệt câu hỏi"],
  ["Quality checks", "Kiểm tra chất lượng"], ["Pass", "Đạt"], ["Single correct answer", "Chỉ có một đáp án đúng"], ["Source supports answer", "Nguồn hỗ trợ đáp án"],
  ["Check", "Kiểm tra"], ["Distractor specificity", "Độ cụ thể của phương án nhiễu"],
  ["Instructor insight", "Thông tin cho giảng viên"], ["See mastery, misconceptions, recovery, and evidence across the class.", "Xem năng lực, hiểu lầm, khắc phục và minh chứng của toàn lớp."],
  ["Export report", "Xuất báo cáo"], ["Avg. mastery", "Năng lực trung bình"], ["At risk", "Có nguy cơ"], ["Need intervention", "Cần can thiệp"],
  ["Class distribution by concept.", "Phân bố lớp theo khái niệm."], ["All learners", "Tất cả học viên"], ["Top misconception", "Hiểu lầm phổ biến nhất"],
  ["learners selected this reasoning.", "học viên chọn lập luận này."], ["have not completed recovery.", "chưa hoàn thành khắc phục."],
  ["Assign recovery", "Giao nhiệm vụ khắc phục"], ["Use in live battle", "Dùng trong thi đấu trực tiếp"], ["Learners needing support", "Học viên cần hỗ trợ"],
  ["Learner", "Học viên"], ["Weak concept", "Khái niệm yếu"], ["Unresolved errors", "Lỗi chưa khắc phục"], ["Recommended action", "Hành động đề xuất"],
  ["Send Daily Recall", "Gửi bài ôn hằng ngày"], ["Assign Lab", "Giao bài thực hành"],
  ["Source Evidence", "Minh chứng nguồn"], ["Evidence summary", "Tóm tắt minh chứng"], ["Source verified", "Nguồn đã xác minh"],
  ["Close", "Đóng"], ["Concept hint", "Gợi ý khái niệm"], ["Got it", "Đã hiểu"], ["Ready to publish?", "Sẵn sàng xuất bản?"],
  ["Publish now", "Xuất bản ngay"], ["Cancel", "Hủy"], ["Notifications", "Thông báo"]
];

function translateUI(html) {
  if (state.language === "en") return html;
  return vi
    .slice()
    .sort((a, b) => b[0].length - a[0].length)
    .reduce((result, pair) => result.split(pair[0]).join(pair[1]), html);
}

function updateShellLanguage() {
  const isVi = state.language === "vi";
  document.documentElement.lang = isVi ? "vi" : "en";
  document.title = isVi ? "VinCourse - Học qua trải nghiệm" : "VinCourse - Learn by playing";
  document.querySelector(".top-context strong").textContent = isVi ? "Nền tảng Học máy" : "Machine Learning Foundations";
  document.querySelector(".stat-chip small").textContent = isVi ? "ngày liên tiếp" : "day streak";
  document.querySelectorAll("[data-language]").forEach(button => {
    button.classList.toggle("active", button.dataset.language === state.language);
  });
  const roleText = state.role === "admin"
    ? (isVi ? "Giảng viên khóa học" : "Course instructor")
    : (isVi ? "Học viên khám phá" : "Student explorer");
  document.getElementById("side-role").textContent = roleText;
}

const studentNav = [
  ["Learn", null, null, true],
  ["home", "⌂", "Home"],
  ["map", "⌘", "Course Map"],
  ["modes", "◇", "Game Modes", "7"],
  ["recall", "↻", "Daily Recall", "4"],
  ["mastery", "◎", "My Mastery"],
  ["Recover", null, null, true],
  ["error-dungeon", "⚑", "Error Dungeon", "3"],
  ["ai-adversary", "◈", "AI Adversary"],
];

const adminNav = [
  ["Course Studio", null, null, true],
  ["admin-dashboard", "⌂", "Dashboard"],
  ["admin-upload", "↑", "Upload Lecture"],
  ["admin-world", "⌘", "Course World"],
  ["admin-questions", "?", "Question Studio", "24"],
  ["Monitor", null, null, true],
  ["admin-analytics", "▥", "Learning Analytics"],
  ["live", "●", "Live Battle"],
];

const screenNames = {
  home: "Student home", map: "Course map", modes: "Game modes",
  quest: "Story Quest", feedback: "Learning feedback", recovery: "Recovery mission",
  result: "Quest result", recall: "Daily recall", mastery: "Mastery evidence",
  "error-dungeon": "Error Dungeon", lab: "Lab Arena", boss: "Boss Battle",
  live: "Live Class Battle", "ai-adversary": "AI Adversary",
  "admin-dashboard": "Instructor dashboard", "admin-upload": "Upload lecture",
  "admin-generate": "AI course generation", "admin-world": "Generated course world",
  "admin-questions": "Question review studio", "admin-analytics": "Learning analytics"
};

function navigate(route) {
  state.route = route;
  state.selectedAnswer = null;
  if (route !== "recovery") state.recoveryStep = 0;
  window.location.hash = route;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderNav() {
  const items = state.role === "admin" ? adminNav : studentNav;
  document.getElementById("main-nav").innerHTML = items.map(item => {
    if (item[3] === true) return `<div class="nav-section">${translateUI(item[0])}</div>`;
    const [route, icon, label, badge] = item;
    return translateUI(`<button class="nav-link ${state.route === route ? "active" : ""}" data-route="${route}">
      <span>${icon}</span><span>${label}</span>${badge ? `<span class="nav-badge">${badge}</span>` : ""}
    </button>`);
  }).join("");
}

function render() {
  updateShellLanguage();
  renderNav();
  const view = document.getElementById("view");
  document.getElementById("breadcrumb").textContent = translateUI(screenNames[state.route] || "Learning world");
  const routes = {
    home: studentHome, map: courseMap, modes: modeHub, quest: questPlay,
    feedback: wrongFeedback, recovery: recoveryMission, result: questResult,
    recall: dailyRecall, mastery: masteryDashboard, "error-dungeon": errorDungeon,
    lab: labArena, boss: bossBattle, live: liveBattle, "ai-adversary": aiAdversary,
    "admin-dashboard": adminDashboard, "admin-upload": adminUpload,
    "admin-generate": adminGenerate, "admin-world": adminWorld,
    "admin-questions": questionStudio, "admin-analytics": analytics
  };
  view.innerHTML = translateUI((routes[state.route] || studentHome)());
  view.focus({ preventScroll: true });
  bindLocalInteractions();
}

const pageHead = (eyebrow, title, subtitle, actions = "") => `
  <div class="page-head">
    <div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p>${subtitle}</p></div>
    ${actions ? `<div class="head-actions">${actions}</div>` : ""}
  </div>`;

const progress = (value, label = "", color = "") => `
  ${label ? `<div class="progress-label"><span>${label}</span><strong>${value}%</strong></div>` : ""}
  <div class="progress ${color}"><span style="width:${value}%"></span></div>`;

function studentHome() {
  return `
    <section class="home-hero">
      <div class="hero-copy">
        <div class="eyebrow">Welcome back, Linh</div>
        <h1>Your model is waiting for a rescue.</h1>
        <p>Continue through Gradient Forest, uncover why training is unstable, and turn one misconception into lasting mastery.</p>
        <div class="button-row">
          <button class="button primary" data-route="quest">Continue quest →</button>
          <button class="button secondary" data-route="map">Open course map</button>
        </div>
      </div>
      <div class="hero-art" aria-hidden="true">
        <div class="hero-orbit"></div><div class="hero-path"></div>
        <div class="hero-node one">01</div><div class="hero-node two">02</div><div class="hero-node three">!</div>
      </div>
    </section>
    <div class="grid four">
      <div class="card metric"><div class="metric-icon">✦</div><strong>1,240 XP</strong><small>Total learning experience</small><span class="trend">+180 this week</span></div>
      <div class="card metric"><div class="metric-icon">◎</div><strong>5 / 8</strong><small>Concepts explored</small><span class="trend">2 near mastery</span></div>
      <div class="card metric"><div class="metric-icon">↻</div><strong>4 due</strong><small>Daily recall queue</small><span class="trend">5 minute session</span></div>
      <div class="card metric"><div class="metric-icon">⚑</div><strong>3 errors</strong><small>Recovery missions</small><span class="trend">1 delayed check</span></div>
    </div>
    <div class="layout-main" style="margin-top:20px">
      <section class="card">
        <div class="card-head"><div><h2>Recommended next</h2><p>Chosen from your mastery and error history.</p></div><span class="status success">Best match</span></div>
        <div class="card soft-cream flat">
          <div class="eyebrow">Story Quest · Gradient Forest</div>
          <h2>Stabilize the Gradient</h2>
          <p>Investigate a model that diverges even after more training. Apply feature scaling and explain why it changes optimization.</p>
          <div class="tag-row"><span class="tag">Feature Scaling</span><span class="tag">Gradient Descent</span><span class="tag">10 min</span><span class="tag">80 XP</span></div>
          <div class="button-row" style="margin-top:18px"><button class="button primary" data-route="quest">Start quest</button><button class="text-button" data-action="source">View source</button></div>
        </div>
      </section>
      <aside class="card">
        <div class="card-head"><div><h3>Learning pulse</h3><small>This week's evidence</small></div><span class="status info">Live</span></div>
        <div class="list">
          <div class="list-item"><span class="circle-icon">✓</span><div class="list-item-main"><strong>Feature Scaling</strong><small>42% mastery · needs transfer proof</small>${progress(42)}</div></div>
          <div class="list-item"><span class="circle-icon">↗</span><div class="list-item-main"><strong>Gradient Descent</strong><small>55% mastery · improving</small>${progress(55)}</div></div>
          <div class="list-item"><span class="circle-icon">!</span><div class="list-item-main"><strong>MSE Loss</strong><small>Recall due tomorrow</small>${progress(71, "", "blue")}</div></div>
        </div>
        <button class="button secondary" style="width:100%;margin-top:12px" data-route="mastery">See mastery evidence</button>
      </aside>
    </div>`;
}

function courseMap() {
  return `${pageHead("Learning world", "Machine Learning Foundations", "Every node is a learning objective. Clear quests, repair misconceptions, and unlock the Boss Gate.", `<button class="button secondary" data-route="modes">Browse all modes</button>`)}
    <div class="card course-map">
      <span class="map-zone-title z1">Data Village</span><span class="map-zone-title z2">Gradient Forest</span><span class="map-zone-title z3">Evaluation Arena</span>
      <div class="map-path"></div>
      <button class="map-node done node-1" data-action="map-node" data-title="Clean the Dataset">Clean the Dataset</button>
      <button class="map-node current node-2" data-action="map-node" data-title="Stabilize the Gradient">Stabilize the Gradient</button>
      <button class="map-node lab node-3" data-route="lab">Lab Arena</button>
      <button class="map-node error node-4" data-route="error-dungeon">Error Dungeon</button>
      <button class="map-node locked node-5" data-action="locked">Decode the Loss</button>
      <button class="map-node boss node-6" data-route="boss">Boss Gate</button>
      <div class="quest-popover">
        <span class="status success">Current quest</span>
        <h3 style="margin-top:10px">Stabilize the Gradient</h3>
        <p>Feature Scaling · Gradient Descent · 10 min</p>
        <div class="button-row"><button class="button primary small" data-route="quest">Start</button><button class="button secondary small" data-action="source">Source</button></div>
      </div>
    </div>`;
}

const modes = [
  ["Story Quest", "Follow the course map and unlock concepts through short missions.", "Open map", "map", "soft-cream", "⌘", "Recommended"],
  ["Daily Recall", "A five-minute review before concepts fade.", "Start review", "recall", "soft-blue", "↻", "4 due"],
  ["Error Dungeon", "Turn past mistakes into missions you can clear.", "Fix errors", "error-dungeon", "soft-pink", "⚑", "3 waiting"],
  ["Lab Arena", "Apply concepts in code and get concept-linked feedback.", "Enter lab", "lab", "soft-lavender", "{ }", "1 unlocked"],
  ["Boss Battle", "Prove mastery across multiple concepts in one scenario.", "Challenge boss", "boss", "soft-cream", "◆", "Ready"],
  ["Live Class Battle", "Join your class to solve a shared boss challenge.", "Join room", "live", "soft-blue", "●", "Live demo"],
  ["AI Adversary", "Catch a convincing wrong explanation and correct it with evidence.", "Challenge AI", "ai-adversary", "soft-green", "◈", "Advanced"],
];

function modeHub() {
  return `${pageHead("Choose your challenge", "Seven ways to build mastery", "Each mode collects a different kind of evidence, from delayed recall to code application and critical reasoning.")}
    <div class="grid three">${modes.map(m => `
      <article class="card mode-card ${m[4]}">
        <div class="card-head"><div class="mode-icon">${m[5]}</div><span class="status">${m[6]}</span></div>
        <h2>${m[0]}</h2><p>${m[1]}</p>
        <button class="button secondary small" data-route="${m[3]}">${m[2]} →</button>
      </article>`).join("")}</div>`;
}

function questPlay() {
  const selected = state.selectedAnswer;
  return `<div class="question-shell">
    <div class="question-top"><button class="icon-button" data-route="map">←</button>${progress(40)}<strong>2 / 5</strong><button class="icon-button" data-action="source">▣</button></div>
    <div class="story-banner"><span class="circle-icon">⌘</span><div><strong>Gradient Forest · Stabilize the Gradient</strong><small>Your model keeps diverging. Find the missing preprocessing step.</small></div></div>
    <section class="card question-card">
      <div class="card-head"><div><span class="status info">Apply</span><h2 style="margin-top:12px">A model has one feature ranging from 0–1 and another from 1–100,000. Training oscillates even after increasing epochs. What should you try first?</h2></div><span class="tag">80 XP</span></div>
      <div class="answer-list">
        ${[
          ["A","Increase epochs from 100 to 10,000"],
          ["B","Standardize the feature scales before training"],
          ["C","Remove the smaller-valued feature"],
          ["D","Increase the learning rate to converge faster"]
        ].map(a => `<button class="answer ${selected === a[0] ? "selected" : ""}" data-answer="${a[0]}"><span class="answer-key">${a[0]}</span><span>${a[1]}</span></button>`).join("")}
      </div>
      <div class="separator"></div>
      <div class="card-head"><div><strong>How confident are you?</strong><small>Your confidence helps calibrate mastery.</small></div>
        <div class="confidence">${["Low","Medium","High"].map(c => `<button class="${state.confidence === c ? "active" : ""}" data-confidence="${c}">${c}</button>`).join("")}</div>
      </div>
      <div class="button-row"><button class="button secondary" data-action="hint">Use a hint</button><button class="button primary" data-action="submit-answer" ${selected ? "" : "disabled"}>Check answer</button></div>
    </section>
  </div>`;
}

function wrongFeedback() {
  return `${pageHead("Learning feedback", "Not quite, but this is useful.", "VinCourse identified the reasoning pattern behind the answer and prepared a focused recovery mission.")}
    <div class="feedback-panel">
      <section class="card soft-pink">
        <div class="feedback-icon">×</div>
        <span class="status error">Conceptual misunderstanding</span>
        <h2 style="margin-top:12px">Training longer does not fix an unstable optimization path.</h2>
        <p>You may be assuming that more epochs always improve convergence. When feature scales differ dramatically, gradient updates can zigzag or overshoot regardless of training duration.</p>
        <div class="card flat" style="margin:18px 0">
          <strong>Detected misconception</strong>
          <p style="margin:7px 0 0">“More epochs can compensate for missing feature scaling.”</p>
          <div class="tag-row" style="margin-top:10px"><span class="tag">Feature Scaling</span><span class="tag">Gradient Descent</span></div>
        </div>
        <div class="hint-list">
          <div class="hint"><strong>Hint 1 unlocked</strong><small>Compare the path of gradient descent across features with very different ranges.</small></div>
          <div class="hint locked">Hint 2 · Example from lecture</div>
          <div class="hint locked">Hint 3 · Visual explanation</div>
        </div>
        <div class="button-row" style="margin-top:18px"><button class="button secondary" data-route="quest">Try again</button><button class="button primary" data-route="recovery">Start recovery mission</button></div>
      </section>
      <aside class="card">
        <h3>Source evidence</h3>
        <div class="source-box">
          <strong>Lecture 02</strong><small>Feature Scaling and Gradient Descent</small>
          <div class="separator"></div><strong>Page 14</strong><small>Section 2.3 · Optimization path</small>
        </div>
        <p style="margin-top:14px">“Scaling helps gradient descent move toward the minimum with a more direct and stable path.”</p>
        <button class="button secondary small" data-action="source">Open source</button>
        <div class="separator"></div>
        <h3>Why it matters</h3>
        <p>Unscaled inputs can produce slow or unstable learning. This appears again in the upcoming Lab Arena.</p>
      </aside>
    </div>`;
}

const recoverySteps = ["Review", "Explain", "Similar", "Transfer", "Confirm"];
function recoveryMission() {
  const i = state.recoveryStep;
  const content = [
    `<div class="source-box"><strong>Feature scaling changes the geometry of optimization.</strong><p style="margin:7px 0">With very different feature ranges, contours become elongated and the gradient path zigzags. Standardization makes each feature contribute on a comparable scale.</p><small>Lecture 02 · page 14</small></div>`,
    `<h2>Explain it in your own words</h2><p>Why might increasing epochs not fix unstable training when feature scales differ?</p><textarea class="textarea" id="recovery-text">More epochs repeat the same unstable update path. Scaling makes gradient steps balanced across features.</textarea>`,
    `<h2>Try a similar case</h2><p>A dataset uses age (18–90) and annual income (0–500,000). Gradient descent converges slowly. What is the best first action?</p><button class="answer selected"><span class="answer-key">A</span>Standardize both numeric features</button><button class="answer"><span class="answer-key">B</span>Double the number of epochs</button>`,
    `<h2>Transfer to a new context</h2><p>A house-price model uses square meters and number of bedrooms. Training diverges. Which preprocessing step is likely missing?</p><button class="answer selected"><span class="answer-key">A</span>Scale numeric input features</button><button class="answer"><span class="answer-key">B</span>Shuffle the column order</button>`,
    `<div class="feedback-icon correct">✓</div><h2>Misconception resolved</h2><p>You explained the mechanism, solved a similar case, and transferred it to a new dataset.</p><div class="tag-row"><span class="status success">Explanation verified</span><span class="status success">Transfer passed</span><span class="status info">Recall in 3 days</span></div>`
  ][i];
  return `<div class="question-shell">
    ${pageHead("Error recovery", "Fix: Feature scaling misconception", "One short learning loop turns this mistake into evidence you can reuse.")}
    <div class="stepper">${recoverySteps.map((s,n) => `<div class="step ${n < i ? "done" : n === i ? "active" : ""}">${s}</div>`).join("")}</div>
    <section class="card question-card">${content}
      <div class="separator"></div>
      <div class="button-row">
        ${i > 0 ? `<button class="button secondary" data-action="recovery-back">Back</button>` : `<button class="button secondary" data-action="source">View source</button>`}
        <button class="button primary" data-action="${i === 4 ? "recovery-finish" : "recovery-next"}">${i === 0 ? "I reviewed this" : i === 4 ? "Claim recovery reward" : "Submit & continue"}</button>
      </div>
    </section>
  </div>`;
}

function questResult() {
  return `<div class="question-shell">
    <section class="card soft-green" style="text-align:center;padding:38px">
      <div class="feedback-icon correct" style="margin:0 auto 18px">✓</div>
      <div class="eyebrow">Quest complete</div><h1>Gradient stabilized!</h1>
      <p>You repaired a misconception and unlocked stronger evidence for Feature Scaling.</p>
      <div class="tag-row" style="justify-content:center"><span class="tag">+80 XP</span><span class="tag">+25 recovery bonus</span><span class="tag">7 day streak</span></div>
    </section>
    <div class="grid two" style="margin-top:18px">
      <section class="card"><h2>Mastery updated</h2>${progress(68,"Feature Scaling")}${progress(61,"Gradient Descent","blue")}<div class="separator"></div><div class="list"><div class="list-item"><span class="circle-icon">✓</span><div class="list-item-main"><strong>Explained the misconception</strong><small>Conceptual evidence</small></div></div><div class="list-item"><span class="circle-icon">↗</span><div class="list-item-main"><strong>Solved a transfer question</strong><small>Application evidence</small></div></div></div></section>
      <section class="card soft-cream"><span class="status warning">Next recommendation</span><h2 style="margin-top:12px">Learning Rate Tuning</h2><p>Now that feature scales are stable, explore how learning rate controls step size.</p><div class="button-row"><button class="button primary" data-route="map">Continue on map</button><button class="button secondary" data-route="mastery">Review evidence</button></div></section>
    </div>
  </div>`;
}

function dailyRecall() {
  if (state.recallStage === "play") return dailyRecallPlay();
  if (state.recallStage === "result") return dailyRecallResult();
  return `${pageHead("Spaced practice", "Daily Recall", "A short review generated from your forgetting forecast.", `<button class="button primary" data-action="start-recall">Start 5-minute review</button>`)}
    <div class="layout-main">
      <section class="card">
        <div class="card-head"><div><h2>Due today</h2><p>4 concepts selected for maximum learning value.</p></div><span class="status info">5 min</span></div>
        ${[
          ["Feature Scaling","Last reviewed 7 days ago","Today",68],
          ["MSE Loss","Confidence lower than accuracy","Today",71],
          ["Train / Test Split","One prior error","Today",62],
          ["Learning Rate","Newly learned concept","Today",45]
        ].map(x => `<div class="list-item"><span class="circle-icon">↻</span><div class="list-item-main"><strong>${x[0]}</strong><small>${x[1]}</small>${progress(x[3])}</div><span class="status info">${x[2]}</span></div>`).join("")}
      </section>
      <aside class="card soft-blue"><h3>Session settings</h3><div class="field" style="margin-top:15px"><label>Duration</label><select class="select"><option>5 minutes</option><option>10 minutes</option></select></div><div class="field" style="margin-top:15px"><label>Questions</label><select class="select"><option>4 questions</option><option>8 questions</option></select></div><div class="separator"></div><h3>Evidence collected</h3><p>Delayed recall and confidence calibration for every answer.</p></aside>
    </div>`;
}

function dailyRecallPlay() {
  const answers = [
    ["A", "Scale the input features to comparable ranges"],
    ["B", "Increase training epochs only"],
    ["C", "Remove the feature with the largest values"],
    ["D", "Use the test set for tuning"]
  ];
  return `<div class="question-shell">
    <div class="question-top"><button class="icon-button" data-action="exit-recall">←</button>${progress(50)}<strong>2 / 4</strong><span class="status info">5 min</span></div>
    <section class="card question-card">
      <div class="card-head"><div><span class="status info">Due because last review was 7 days ago</span><h2 style="margin-top:14px">A gradient descent model oscillates because two numeric features use very different ranges. Which response best addresses the cause?</h2></div><span class="tag">Feature Scaling</span></div>
      <div class="answer-list">${answers.map(answer => `<button class="answer ${state.recallAnswer === answer[0] ? "selected" : ""}" data-recall-answer="${answer[0]}"><span class="answer-key">${answer[0]}</span><span>${answer[1]}</span></button>`).join("")}</div>
      <div class="card-head"><div><strong>How confident are you?</strong><small>Confidence is required for spaced recall.</small></div><div class="confidence">${["Low","Medium","High"].map(c => `<button class="${state.confidence === c ? "active" : ""}" data-confidence="${c}">${c}</button>`).join("")}</div></div>
      <button class="button primary" data-action="submit-recall" ${state.recallAnswer ? "" : "disabled"}>Submit recall answer</button>
    </section>
  </div>`;
}

function dailyRecallResult() {
  return `${pageHead("Daily Recall result", "Review complete", "Your recall schedule has been updated from this session.")}
    <section class="card soft-blue" style="text-align:center;padding:38px"><div class="feedback-icon correct" style="margin:0 auto 18px">✓</div><h1>4 concepts refreshed</h1><p>You answered 3 of 4 correctly and calibrated your confidence.</p><div class="tag-row" style="justify-content:center"><span class="tag">+35 XP</span><span class="tag">3 correct</span><span class="tag">1 recovery queued</span></div></section>
    <div class="grid two" style="margin-top:18px"><section class="card"><h2>Next review schedule</h2><div class="list"><div class="list-item"><span class="circle-icon">3</span><div class="list-item-main"><strong>Feature Scaling</strong><small>Review again in 3 days</small></div><span class="status success">Refreshed</span></div><div class="list-item"><span class="circle-icon">1</span><div class="list-item-main"><strong>MSE Loss</strong><small>Review again tomorrow</small></div><span class="status warning">Due soon</span></div></div></section><section class="card"><h2>Confidence calibration</h2><p>High confidence + correct answer strengthened your delayed-recall evidence.</p><div class="button-row"><button class="button primary" data-action="restart-recall">Practice again</button><button class="button secondary" data-route="home">Back home</button></div></section></div>`;
}

function errorDungeon() {
  const errors = [
    ["More epochs fix unstable training","Conceptual misunderstanding","Feature Scaling","New"],
    ["Lower loss always means better validation","Overgeneralization","Model Evaluation","Partially fixed"],
    ["Test data can guide model tuning","Data leakage","Train / Test Split","Delayed check due"]
  ];
  return `${pageHead("Recovery zone", "Error Dungeon", "Every past mistake becomes a focused mission you can clear.", `<button class="button primary" data-route="recovery">Start next recovery</button>`)}
    <div class="layout-main">
      <section class="list">${errors.map((x,i) => `<article class="card ${i===0?"soft-pink":""}"><div class="card-head"><span class="status ${i===0?"error":"warning"}">${x[3]}</span><span class="tag">${i+1}/3</span></div><h2>${x[0]}</h2><p>${x[1]} · ${x[2]}</p><div class="button-row"><button class="button ${i===0?"primary":"secondary"} small" data-route="recovery">Start recovery</button><button class="text-button" data-action="source">View original</button></div></article>`).join("")}</section>
      <aside class="card"><h3>Recovery rules</h3><div class="list"><div class="list-item"><span class="circle-icon">1</span><div class="list-item-main"><strong>Review the source</strong><small>Reconnect to the lecture</small></div></div><div class="list-item"><span class="circle-icon">2</span><div class="list-item-main"><strong>Explain the mistake</strong><small>Show your reasoning changed</small></div></div><div class="list-item"><span class="circle-icon">3</span><div class="list-item-main"><strong>Apply and transfer</strong><small>Solve two new contexts</small></div></div></div></aside>
    </div>`;
}

function masteryDashboard() {
  const concepts = [["Feature Scaling",68,4,"3 days"],["Gradient Descent",61,3,"Tomorrow"],["MSE Loss",71,5,"Tomorrow"],["Train / Test Split",62,2,"Today"],["Model Evaluation",48,1,"Now"]];
  return `${pageHead("Your learning evidence", "Mastery Dashboard", "Mastery grows from recall, explanation, transfer, and application, not only quiz scores.")}
    <div class="grid four"><div class="card metric"><small>Total XP</small><strong>1,345</strong><span class="trend">+105 today</span></div><div class="card metric"><small>Concepts mastered</small><strong>2 / 8</strong><span class="trend">5 in progress</span></div><div class="card metric"><small>Recovery rate</small><strong>78%</strong><span class="trend">+12% this week</span></div><div class="card metric"><small>Confidence match</small><strong>84%</strong><span class="trend">Well calibrated</span></div></div>
    <div class="layout-main" style="margin-top:20px">
      <section class="card"><div class="card-head"><h2>Concept mastery</h2><span class="tag">8 concepts</span></div><div class="table-wrap"><table><thead><tr><th>Concept</th><th>Mastery</th><th>Evidence</th><th>Next review</th><th></th></tr></thead><tbody>${concepts.map(c => `<tr><td><strong>${c[0]}</strong></td><td style="min-width:150px">${progress(c[1])}</td><td>${c[2]} items</td><td>${c[3]}</td><td><button class="button secondary small" data-route="recall">Practice</button></td></tr>`).join("")}</tbody></table></div></section>
      <aside class="card"><h3>Evidence timeline</h3><div class="list"><div class="list-item"><span class="circle-icon">↗</span><div class="list-item-main"><strong>Transfer challenge passed</strong><small>Stabilize the Gradient · just now</small></div></div><div class="list-item"><span class="circle-icon">✓</span><div class="list-item-main"><strong>Misconception repaired</strong><small>Feature Scaling · just now</small></div></div><div class="list-item"><span class="circle-icon">{ }</span><div class="list-item-main"><strong>Code application</strong><small>Normalization Lab · 2 days ago</small></div></div></div></aside>
    </div>`;
}

function labArena() {
  if (state.labSubmitted) {
    return `${pageHead("Lab Arena result", "Lab completed", "Your code passed the tests and produced concept-linked application evidence.")}
      <section class="card soft-lavender" style="text-align:center;padding:38px"><div class="feedback-icon correct" style="margin:0 auto 18px">✓</div><h1>All tests passed</h1><p>You implemented standardization and explained why it stabilizes gradient descent.</p><div class="tag-row" style="justify-content:center"><span class="tag">+100 XP</span><span class="tag">Code application</span><span class="tag">Lab evidence</span></div></section>
      <div class="grid two" style="margin-top:18px"><section class="card"><h2>Evidence earned</h2><div class="list"><div class="list-item"><span class="circle-icon">✓</span><div class="list-item-main"><strong>Applied normalization in code</strong><small>Visible and hidden tests passed</small></div></div><div class="list-item"><span class="circle-icon">✓</span><div class="list-item-main"><strong>Explained training stability</strong><small>Linked implementation to lecture concept</small></div></div></div></section><section class="card soft-green"><h2>Next challenge</h2><p>Use the same preprocessing decision in the Boss Battle scenario.</p><div class="button-row"><button class="button primary" data-route="boss">Challenge boss</button><button class="button secondary" data-action="restart-lab">Retry lab</button></div></section></div>`;
  }
  return `${pageHead("Mode 4 · Application", "Lab Arena: Fix Unstable Training", "Complete the preprocessing function, run the tests, and connect the code result to the lecture.", `<span class="status info">1 lab unlocked</span>`)}
    <div class="code-layout">
      <aside class="card"><span class="status">Challenge</span><h3 style="margin-top:12px">Normalize the input</h3><p>Complete <code>standardize()</code> so each feature has mean 0 and standard deviation 1.</p><div class="tag-row"><span class="tag">Feature Scaling</span><span class="tag">Python</span></div><div class="separator"></div><strong>Completion</strong>${progress(state.labRun?100:50)}<button class="text-button" data-action="source">Lecture source</button></aside>
      <section class="code-panel"><div class="code-tabs"><button class="code-tab active">preprocessing.py</button><button class="code-tab">train.py</button></div><textarea class="code-editor" spellcheck="false">import numpy as np

def standardize(X):
    mean = np.mean(X, axis=0)
    std = np.std(X, axis=0)
    
    # Complete the transformation
    return (X - mean) / std

X_scaled = standardize(X_train)</textarea></section>
      <aside class="card"><div class="card-head"><h3>Tests</h3><span class="status ${state.labRun?"success":"warning"}">${state.labRun?"3 passed":"Not run"}</span></div>${state.labRun?`<div class="test-item test-pass">✓ mean is near zero</div><div class="test-item test-pass">✓ std is near one</div><div class="test-item test-pass">✓ shape is preserved</div><div class="card soft-green flat" style="margin-top:15px"><strong>Concept evidence found</strong><small>Applied standardization in code.</small></div>`:`<p>Run visible tests to validate your implementation.</p>`}<button class="button primary" style="width:100%;margin-top:15px" data-action="${state.labRun?"submit-lab":"run-tests"}">${state.labRun?"Submit lab":"Run tests"}</button><button class="button secondary" style="width:100%;margin-top:8px" data-action="hint">Open hint</button></aside>
    </div>`;
}

function bossBattle() {
  if (state.bossComplete) {
    return `${pageHead("Boss Battle result", "Boss defeated", "You transferred multiple concepts across one complete model-repair scenario.")}
      <section class="card soft-cream" style="text-align:center;padding:38px"><div class="feedback-icon correct" style="margin:0 auto 18px">◆</div><h1>The Broken Model is rescued</h1><p>You diagnosed, fixed, explained, and transferred the solution across all five phases.</p><div class="tag-row" style="justify-content:center"><span class="tag">+250 XP</span><span class="tag">Boss badge</span><span class="tag">Next zone unlocked</span></div></section>
      <div class="grid two" style="margin-top:18px"><section class="card"><h2>Phase performance</h2><div class="list">${["Diagnose root cause","Choose pipeline fix","Explain interaction","Transfer to new data","Final challenge"].map((x,i)=>`<div class="list-item"><span class="circle-icon">✓</span><div class="list-item-main"><strong>${x}</strong><small>${i===3?"Strong transfer evidence":"Passed"}</small></div><span class="status success">Clear</span></div>`).join("")}</div></section><section class="card soft-green"><h2>Evaluation Arena unlocked</h2><p>Your evidence is strong enough to continue to the next course zone.</p><div class="button-row"><button class="button primary" data-route="map">Unlock next zone</button><button class="button secondary" data-action="restart-boss">Replay boss</button></div></section></div>`;
  }
  return `${pageHead("Mode 5 · Integration", "Boss Battle", "Prove mastery across feature scaling, learning rate, loss, and evaluation in one scenario.")}
    <section class="card soft-cream">
      <div class="card-head"><div><span class="status info">Phase 3 of 5 · Explain</span><h1 style="margin-top:12px">Rescue the Broken Model</h1></div><span class="tag">250 XP</span></div>
      <p>A model diverges, validation is unstable, and an AI-generated explanation may be wrong. Diagnose and repair the full pipeline.</p>
      <div class="boss-bar"><span></span><strong>Boss stability 68%</strong></div>
      <div class="tag-row" style="margin-top:14px"><span class="tag">Feature Scaling</span><span class="tag">Learning Rate</span><span class="tag">MSE Loss</span><span class="tag">Train / Test Split</span></div>
    </section>
    <div class="layout-main" style="margin-top:18px">
      <section class="card"><div class="story-banner"><span class="circle-icon">◆</span><div><strong>Explain your diagnosis</strong><small>You already identified unscaled features and a high learning rate.</small></div></div><h2>Why do these two issues amplify each other?</h2><textarea class="textarea">Unscaled features make gradients uneven, while a high learning rate makes those uneven updates overshoot the minimum.</textarea><div class="button-row" style="margin-top:16px"><button class="button secondary" data-action="hint">Use hint · 2 left</button><button class="button blue" data-action="boss-next">Strike boss</button></div></section>
      <aside class="card"><h3>Evidence collected</h3><div class="list"><div class="list-item"><span class="circle-icon">✓</span><div class="list-item-main"><strong>Diagnosed root cause</strong><small>Phase 1</small></div></div><div class="list-item"><span class="circle-icon">✓</span><div class="list-item-main"><strong>Selected pipeline fix</strong><small>Phase 2</small></div></div><div class="list-item"><span class="circle-icon">3</span><div class="list-item-main"><strong>Explain interaction</strong><small>Current phase</small></div></div></div><button class="text-button" data-action="source">View source references</button></aside>
    </div>`;
}

function liveBattle() {
  if (state.role === "admin" || state.liveRole === "instructor") return instructorLive();
  if (state.liveStage === "play") return studentLivePlay();
  if (state.liveStage === "result") return studentLiveResult();
  return `${pageHead("Mode 6 · Collaborate", "Live Class Battle", "Join your class and solve a shared boss challenge together.")}
    <div class="grid two">
      <section class="card soft-blue"><span class="status success">Live now</span><h2 style="margin-top:12px">ML Foundations · Team Battle</h2><p>Room VINC-24 · 18 learners joined</p><div class="field"><label>Class code</label><input class="input" value="VINC-24"></div><button class="button primary" style="margin-top:15px" data-action="join-live">Join battle</button></section>
      <section class="card"><h3>How your team scores</h3><div class="list"><div class="list-item"><span class="circle-icon">40</span><div class="list-item-main"><strong>Correctness</strong><small>Choose the sound diagnosis</small></div></div><div class="list-item"><span class="circle-icon">40</span><div class="list-item-main"><strong>Explanation quality</strong><small>Make the reasoning clear</small></div></div><div class="list-item"><span class="circle-icon">20</span><div class="list-item-main"><strong>Confidence match</strong><small>Calibrate as a team</small></div></div></div></section>
    </div>`;
}

function studentLivePlay() {
  const choices = [
    ["A", "Train for 10,000 more epochs"],
    ["B", "Standardize the features before training"],
    ["C", "Increase the learning rate"],
    ["D", "Remove the feature with the smaller range"]
  ];
  if (state.liveSubmitted) {
    return `${pageHead("Live room · VINC-24", "Answer submitted", "Your response is locked. Watch the class progress while the instructor collects the remaining teams.")}
      <div class="layout-main">
        <section class="card soft-green">
          <div class="feedback-icon correct">✓</div><span class="status success">Team answer received</span>
          <h2 style="margin-top:12px">Team Gradient selected feature scaling.</h2>
          <p>Your explanation was added to the team response. The instructor will reveal the class misconception summary next.</p>
          <div class="card flat" style="margin-top:18px"><div class="progress-label"><span>Class responses</span><strong>14 / 18</strong></div><div class="progress"><span style="width:78%"></span></div></div>
          <button class="button primary" style="margin-top:18px" data-action="live-result">Simulate instructor reveal →</button>
        </section>
        <aside class="card"><h3>Team Gradient</h3><div class="list">
          <div class="list-item"><span class="avatar">LM</span><div class="list-item-main"><strong>You</strong><small>Submitted · ${state.confidence} confidence</small></div><span class="status success">Ready</span></div>
          <div class="list-item"><span class="avatar">HN</span><div class="list-item-main"><strong>Huy Nguyen</strong><small>Submitted</small></div><span class="status success">Ready</span></div>
          <div class="list-item"><span class="avatar">MA</span><div class="list-item-main"><strong>Mai Anh</strong><small>Writing explanation</small></div><span class="status warning">Working</span></div>
          <div class="list-item"><span class="avatar">TK</span><div class="list-item-main"><strong>Thanh Khoa</strong><small>Submitted</small></div><span class="status success">Ready</span></div>
        </div></aside>
      </div>`;
  }
  return `${pageHead("Live room · VINC-24", "Rescue the Broken Model", "Work with Team Gradient. Correctness, explanation quality, and confidence all count.", `<span class="status success">● Live · 01:24</span>`)}
    <div class="question-shell">
      <div class="boss-bar"><span style="width:42%"></span><strong>Class boss stability 42%</strong></div>
      <div class="story-banner" style="margin-top:18px"><span class="circle-icon">2</span><div><strong>Phase 2 of 4 · Diagnose</strong><small>14 of 18 learners are answering</small></div></div>
      <section class="card question-card">
        <span class="status info">Team challenge · 80 points</span>
        <h2 style="margin-top:14px">A model has features ranging from 0–1 and 1–100,000. Its loss oscillates during gradient descent. What should your team try first?</h2>
        <div class="answer-list">${choices.map(choice => `<button class="answer ${state.liveAnswer === choice[0] ? "selected" : ""}" data-live-answer="${choice[0]}"><span class="answer-key">${choice[0]}</span><span>${choice[1]}</span></button>`).join("")}</div>
        <div class="field"><label>Explain your reasoning to the team</label><textarea class="textarea" placeholder="Why is this the best first action?">${state.liveAnswer === "B" ? "Scaling puts features on comparable ranges, making gradient updates more stable." : ""}</textarea></div>
        <div class="card-head" style="margin-top:16px"><div><strong>Confidence</strong><small>This affects calibration points.</small></div><div class="confidence">${["Low","Medium","High"].map(c => `<button class="${state.confidence === c ? "active" : ""}" data-confidence="${c}">${c}</button>`).join("")}</div></div>
        <div class="button-row"><button class="button secondary" data-action="hint">Ask team for a hint</button><button class="button primary" data-action="submit-live-answer" ${state.liveAnswer ? "" : "disabled"}>Submit for Team Gradient</button></div>
      </section>
    </div>`;
}

function studentLiveResult() {
  return `${pageHead("Live battle result", "The class defeated the boss!", "Team Gradient contributed a correct diagnosis and a source-grounded explanation.")}
    <section class="card soft-blue" style="text-align:center;padding:38px">
      <div class="feedback-icon correct" style="margin:0 auto 18px">✓</div><div class="eyebrow">Battle complete</div>
      <h1>Team Gradient placed #1</h1><p>Feature scaling was the decisive fix. The class corrected its most common misconception before the final phase.</p>
      <div class="tag-row" style="justify-content:center"><span class="tag">+140 XP</span><span class="tag">Team contribution</span><span class="tag">Explanation evidence</span></div>
    </section>
    <div class="grid two" style="margin-top:18px">
      <section class="card"><h2>Your evidence</h2><div class="list">
        <div class="list-item"><span class="circle-icon">✓</span><div class="list-item-main"><strong>Correct diagnosis</strong><small>Standardized features before training</small></div><span class="status success">Earned</span></div>
        <div class="list-item"><span class="circle-icon">↗</span><div class="list-item-main"><strong>Team explanation</strong><small>Connected feature scale to gradient stability</small></div><span class="status success">Earned</span></div>
        <div class="list-item"><span class="circle-icon">◎</span><div class="list-item-main"><strong>Confidence calibration</strong><small>Confidence matched the correct answer</small></div><span class="status info">Matched</span></div>
      </div></section>
      <section class="card soft-pink"><span class="status error">Class misconception</span><h2 style="margin-top:12px">“More epochs fix unstable training”</h2><p>43% of the class initially chose this answer. The instructor recommends a short personal recovery mission.</p><div class="button-row"><button class="button primary" data-route="recovery">Start personal recovery</button><button class="button secondary" data-action="restart-live">Replay demo</button></div></section>
    </div>`;
}

function instructorLive() {
  return `${pageHead("Instructor control room", "Live Class Battle", "Monitor class reasoning and respond to misconceptions as they appear.", `<button class="button danger-soft" data-action="end-live">End session</button>`)}
    <div class="grid four"><div class="card metric"><small>Room code</small><strong>VINC-24</strong><span class="trend">18 joined</span></div><div class="card metric"><small>Current phase</small><strong>2 / 4</strong><span class="trend">Diagnosis</span></div><div class="card metric"><small>Responses</small><strong>14 / 18</strong><span class="trend">4 waiting</span></div><div class="card metric"><small>Top misconception</small><strong>43%</strong><span class="trend">More epochs</span></div></div>
    <div class="layout-main" style="margin-top:20px">
      <section class="card"><div class="card-head"><div><h2>Answer distribution</h2><p>What should the team try first?</p></div><span class="status error">Misconception detected</span></div><div class="chart-bars"><div class="bar pink" style="height:43%" data-label="More epochs" data-value="43%"></div><div class="bar" style="height:36%" data-label="Scale features" data-value="36%"></div><div class="bar blue" style="height:14%" data-label="Higher LR" data-value="14%"></div><div class="bar" style="height:7%" data-label="Remove data" data-value="7%"></div></div><div class="button-row" style="margin-top:38px"><button class="button secondary" data-action="hint">Reveal hint</button><button class="button secondary" data-action="lock">Lock answers</button><button class="button primary" data-action="next-live">Show explanation</button></div></section>
      <aside class="card"><h3>Misconception stream</h3><div class="list"><div class="list-item"><span class="circle-icon">!</span><div class="list-item-main"><strong>More epochs fix instability</strong><small>6 learners · rising</small></div></div><div class="list-item"><span class="circle-icon">!</span><div class="list-item-main"><strong>Higher LR is always faster</strong><small>2 learners</small></div></div></div><div class="separator"></div><h3>Team scores</h3><div class="list-item"><strong style="width:25px">1</strong><div class="list-item-main"><strong>Team Gradient</strong><small>820 pts</small></div></div><div class="list-item"><strong style="width:25px">2</strong><div class="list-item-main"><strong>Data Sparks</strong><small>760 pts</small></div></div></aside>
    </div>`;
}

function aiAdversary() {
  if (state.aiComplete) {
    return `${pageHead("AI Adversary result", "You caught the misleading reasoning", "Your correction was accepted and grounded in the lecture source.")}
      <section class="card soft-green" style="text-align:center;padding:38px"><div class="feedback-icon correct" style="margin:0 auto 18px">✓</div><h1>AI claim corrected</h1><p>Feature scaling affects optimization stability and direction, not only speed.</p><div class="tag-row" style="justify-content:center"><span class="tag">+120 XP</span><span class="tag">Critical reasoning</span><span class="tag">Source citation</span></div></section>
      <div class="grid two" style="margin-top:18px"><section class="card"><h2>Accepted correction</h2><div class="source-box"><strong>Lecture 02 · page 14</strong><p style="margin:8px 0 0">Scaling places features on comparable ranges, producing more balanced and stable gradient updates.</p></div></section><section class="card"><h2>Evidence earned</h2><p>Detected a false explanation, repaired the mechanism, and cited the correct source.</p><div class="button-row"><button class="button primary" data-action="restart-ai">Try harder adversary</button><button class="button secondary" data-route="map">Back to map</button></div></section></div>`;
  }
  const claims = [
    "The model diverged mainly because it has not trained for enough epochs.",
    "Feature scaling is optional for gradient descent and usually only affects speed.",
    "Increasing the learning rate will help the model converge faster."
  ];
  return `${pageHead("Mode 7 · Critical thinking", "AI Adversary", "Catch convincing but incorrect reasoning, repair it, and support your correction with lecture evidence.")}
    <div class="layout-main">
      <section class="card">
        <div class="story-banner"><span class="circle-icon">AI</span><div><strong>AI tutor response</strong><small>Select the most misleading claim.</small></div></div>
        <div class="list">${claims.map((c,i)=>`<button class="claim ${state.claim===i?"selected":""}" data-claim="${i}">${c}</button>`).join("")}</div>
        <div class="field" style="margin-top:18px"><label>Correct the reasoning</label><textarea class="textarea" placeholder="Explain why the selected claim is wrong...">${state.claim!==null?"Feature scaling affects the stability and direction of gradient updates, not only speed. With different ranges, the optimizer can zigzag or diverge.":""}</textarea></div>
        <div class="button-row" style="margin-top:14px"><button class="button secondary" data-action="source">Attach source</button><button class="button blue" data-action="submit-claim" ${state.claim===null?"disabled":""}>Submit correction</button></div>
      </section>
      <aside class="card soft-green"><span class="status info">Advanced</span><h3 style="margin-top:12px">Mission checklist</h3><div class="list"><div class="list-item"><span class="circle-icon">${state.claim!==null?"✓":"1"}</span><div class="list-item-main"><strong>Flag a wrong claim</strong><small>Identify misleading reasoning</small></div></div><div class="list-item"><span class="circle-icon">2</span><div class="list-item-main"><strong>Write a correction</strong><small>Explain the mechanism</small></div></div><div class="list-item"><span class="circle-icon">3</span><div class="list-item-main"><strong>Cite evidence</strong><small>Lecture 02 · page 14</small></div></div></div><div class="separator"></div><strong>Reward</strong><p>Critical reasoning evidence · 120 XP</p></aside>
    </div>`;
}

function adminDashboard() {
  return `${pageHead("Instructor workspace", "Build learning worlds from your lectures", "Upload source material, review AI-generated quests, and track where students need support.", `<button class="button primary" data-route="admin-upload">+ Create course</button>`)}
    <div class="grid four"><div class="card metric"><div class="metric-icon">▣</div><strong>3</strong><small>Course simulations</small><span class="trend">1 draft</span></div><div class="card metric"><div class="metric-icon">◎</div><strong>8</strong><small>Mapped concepts</small><span class="trend">24 relationships</span></div><div class="card metric"><div class="metric-icon">?</div><strong>24</strong><small>Generated questions</small><span class="trend">21 verified</span></div><div class="card metric"><div class="metric-icon">●</div><strong>32</strong><small>Active learners</small><span class="trend">78% recovery</span></div></div>
    <div class="layout-main" style="margin-top:20px">
      <section class="card"><div class="card-head"><div><h2>Course simulations</h2><p>Recently generated learning worlds.</p></div><button class="text-button" data-route="admin-world">View all</button></div>
        <div class="list-item"><span class="circle-icon">ML</span><div class="list-item-main"><strong>Machine Learning Foundations</strong><small>8 concepts · 5 quests · published</small>${progress(88)}</div><button class="button secondary small" data-route="admin-world">Open</button></div>
        <div class="list-item"><span class="circle-icon">DL</span><div class="list-item-main"><strong>Deep Learning Basics</strong><small>12 concepts · generation draft</small>${progress(45,"","blue")}</div><button class="button secondary small" data-route="admin-generate">Resume</button></div>
        <div class="list-item"><span class="circle-icon">DA</span><div class="list-item-main"><strong>Data Analysis with Python</strong><small>6 concepts · archived</small>${progress(100)}</div><button class="button secondary small">Open</button></div>
      </section>
      <aside class="card"><h3>Needs your review</h3><div class="list"><div class="list-item"><span class="circle-icon">?</span><div class="list-item-main"><strong>3 question sources</strong><small>Low evidence confidence</small></div></div><div class="list-item"><span class="circle-icon">!</span><div class="list-item-main"><strong>2 misconception labels</strong><small>Confirm before publishing</small></div></div></div><button class="button primary" style="width:100%;margin-top:15px" data-route="admin-questions">Review content</button></aside>
    </div>`;
}

function adminUpload() {
  return `${pageHead("Course studio · Step 1 of 3", "Upload lecture material", "VinCourse will extract concepts, dependencies, questions, misconceptions, and a playable quest path.")}
    <div class="layout-main">
      <section class="card">
        <div class="dropzone" id="dropzone">
          <div><div class="drop-icon">↑</div><h2>Drop your lecture PDF here</h2><p>PDF up to 50 MB · lecture slides or reading material</p><input type="file" id="file-input" accept=".pdf" hidden><button class="button primary" data-action="choose-file">Choose PDF</button><button class="text-button" data-action="sample-file">Use demo lecture</button></div>
        </div>
        <div id="file-preview">${state.uploadReady?filePreview():""}</div>
      </section>
      <aside class="card"><h3>Course details</h3><div class="field"><label>Course title</label><input class="input" value="Machine Learning Foundations"></div><div class="field" style="margin-top:13px"><label>Audience</label><select class="select"><option>University students</option><option>New professionals</option></select></div><div class="field" style="margin-top:13px"><label>Difficulty</label><select class="select"><option>Beginner to intermediate</option><option>Intermediate</option></select></div><div class="separator"></div><div class="toggle-row"><div><strong>Generate misconceptions</strong><small>Prepare recovery missions</small></div><button class="toggle on" data-action="toggle"></button></div><div class="toggle-row"><div><strong>Generate Lab Arena</strong><small>Code application challenge</small></div><button class="toggle on" data-action="toggle"></button></div><button class="button primary" style="width:100%;margin-top:18px" data-action="generate-course" ${state.uploadReady?"":"disabled"}>Generate course world →</button></aside>
    </div>`;
}

function filePreview() {
  return `<div class="file-card" style="margin-top:14px"><div class="file-icon">PDF</div><div class="list-item-main"><strong>Lecture 02 - Feature Scaling and Gradient Descent.pdf</strong><small>2.8 MB · 26 pages · ready</small></div><span class="status success">Verified</span><button class="icon-button" data-action="remove-file">×</button></div>`;
}

function adminGenerate() {
  return `${pageHead("Course studio · Step 2 of 3", "Generating your learning world", "This demo simulates how source-grounded learning content is assembled from the lecture.")}
    <section class="card generation-visual"><div class="spinner-ring"></div><h2 id="generation-title">${state.generation >= 100 ? "Your course world is ready" : "Building quests and evidence"}</h2><p id="generation-copy">${state.generation >= 100 ? "8 concepts, 5 quests, 24 questions, and 3 recovery missions generated." : "Mapping learning objectives to interactive game modes..."}</p>
      <div style="max-width:720px;margin:25px auto">${progress(state.generation || 16)}</div>
      <div class="stepper" style="max-width:820px;margin:25px auto">${["Read PDF","Extract concepts","Build graph","Generate challenges","Verify sources"].map((s,i)=>`<div class="step ${state.generation >= (i+1)*20 ? "done" : state.generation >= i*20 ? "active":""}">${s}</div>`).join("")}</div>
      ${state.generation >= 100 ? `<button class="button primary" data-route="admin-world">Review generated world →</button>` : `<small>You can leave this screen. Generation continues in the background.</small>`}
    </section>`;
}

function adminWorld() {
  return `${pageHead("Course studio · Step 3 of 3", "Review generated course world", "Verify concepts, quest sequence, misconceptions, and source evidence before publishing.", `<button class="button secondary" data-action="preview-student">Preview as student</button><button class="button primary" data-action="publish">Publish course</button>`)}
    <div class="grid four"><div class="card metric"><small>Concepts</small><strong>8</strong><span class="trend">24 links</span></div><div class="card metric"><small>Quest path</small><strong>5</strong><span class="trend">3 zones</span></div><div class="card metric"><small>Questions</small><strong>24</strong><span class="trend">21 source verified</span></div><div class="card metric"><small>Misconceptions</small><strong>3</strong><span class="trend">Recovery ready</span></div></div>
    <div class="grid two" style="margin-top:20px">
      <section class="card concept-graph"><div class="card-head"><h3>Concept graph</h3><button class="text-button" data-action="edit">Edit graph</button></div><div class="graph-line"></div><div class="graph-line l2"></div><div class="graph-line l3"></div><span class="concept-node core">Gradient Descent</span><span class="concept-node">Feature Scaling</span><span class="concept-node">Learning Rate</span><span class="concept-node">MSE Loss</span><span class="concept-node">Model Evaluation</span></section>
      <section class="card"><div class="card-head"><h3>Quest sequence</h3><button class="text-button" data-route="map">Open map</button></div><div class="list">${["Clean the Dataset","Stabilize the Gradient","Decode the Loss","Evaluation Arena","Rescue the Broken Model"].map((q,i)=>`<div class="list-item"><span class="circle-icon">${i+1}</span><div class="list-item-main"><strong>${q}</strong><small>${i===4?"Boss Battle":"Story Quest"} · ${i===0?"Published":"Ready"}</small></div><button class="icon-button" data-action="edit">⋯</button></div>`).join("")}</div></section>
      <section class="card"><div class="card-head"><h3>Misconception recovery</h3><span class="status success">3 generated</span></div><div class="list-item"><span class="circle-icon">!</span><div class="list-item-main"><strong>More epochs fix unstable training</strong><small>Conceptual misunderstanding · page 14</small></div><button class="button secondary small" data-route="recovery">Preview</button></div><div class="list-item"><span class="circle-icon">!</span><div class="list-item-main"><strong>Higher learning rate is always faster</strong><small>Overgeneralization · page 16</small></div><button class="button secondary small">Review</button></div></section>
      <section class="card soft-blue"><div class="card-head"><h3>Source grounding</h3><span class="status info">88% verified</span></div>${progress(88)}<p style="margin-top:14px">21 of 24 questions have strong source evidence. Three need instructor review.</p><button class="button blue small" data-route="admin-questions">Review 3 items</button></section>
    </div>`;
}

function questionStudio() {
  return `${pageHead("Content quality", "Question Review Studio", "Review prompts, answers, misconception labels, and exact source evidence.", `<button class="button primary" data-action="approve-all">Approve verified items</button>`)}
    <div class="layout-main">
      <section class="card"><div class="card-head"><div><span class="status warning">Needs review · 3 of 24</span><h2 style="margin-top:12px">Feature Scaling · Apply</h2></div><span class="tag">Question 08</span></div><div class="field"><label>Prompt</label><textarea class="textarea">A model uses one feature from 0–1 and another from 1–100,000. Training oscillates. What should you try first?</textarea></div><div class="grid two" style="margin-top:14px"><div class="field"><label>Correct answer</label><input class="input" value="Standardize the feature scales"></div><div class="field"><label>Difficulty</label><select class="select"><option>Apply · Medium</option></select></div></div><div class="field" style="margin-top:14px"><label>Detected misconception for option A</label><input class="input" value="More epochs can compensate for missing scaling"></div><div class="button-row" style="margin-top:16px"><button class="button secondary" data-action="reject">Request regeneration</button><button class="button primary" data-action="approve-question">Approve question</button></div></section>
      <aside class="card"><h3>Source evidence</h3><div class="source-box"><strong>Lecture 02 · page 14</strong><small>Section 2.3 · Optimization path</small><p style="margin:10px 0 0">Scaling creates a more direct, stable path toward the minimum when feature ranges differ.</p></div><div class="separator"></div><h3>Quality checks</h3><div class="list"><div class="list-item"><span class="status success">Pass</span><div class="list-item-main"><strong>Single correct answer</strong></div></div><div class="list-item"><span class="status success">Pass</span><div class="list-item-main"><strong>Source supports answer</strong></div></div><div class="list-item"><span class="status warning">Check</span><div class="list-item-main"><strong>Distractor specificity</strong></div></div></div></aside>
    </div>`;
}

function analytics() {
  return `${pageHead("Instructor insight", "Learning Analytics", "See mastery, misconceptions, recovery, and evidence across the class.", `<button class="button secondary" data-action="export">Export report</button>`)}
    <div class="grid four"><div class="card metric"><small>Active learners</small><strong>32</strong><span class="trend">88% this week</span></div><div class="card metric"><small>Avg. mastery</small><strong>64%</strong><span class="trend">+9% after quests</span></div><div class="card metric"><small>Recovery rate</small><strong>78%</strong><span class="trend">18 errors fixed</span></div><div class="card metric"><small>At risk</small><strong>5</strong><span class="trend">Need intervention</span></div></div>
    <div class="layout-main" style="margin-top:20px">
      <section class="card"><div class="card-head"><div><h2>Concept mastery</h2><p>Class distribution by concept.</p></div><select class="select" style="width:auto"><option>All learners</option></select></div><div class="chart-bars" style="height:250px"><div class="bar" style="height:78%" data-label="Scaling" data-value="78%"></div><div class="bar blue" style="height:64%" data-label="Gradient" data-value="64%"></div><div class="bar" style="height:71%" data-label="MSE Loss" data-value="71%"></div><div class="bar pink" style="height:48%" data-label="Train/Test" data-value="48%"></div><div class="bar blue" style="height:57%" data-label="Evaluation" data-value="57%"></div></div></section>
      <aside class="card soft-pink"><span class="status error">Top misconception</span><h2 style="margin-top:12px">More epochs fix instability</h2><p>11 learners selected this reasoning. Six have not completed recovery.</p><div class="progress pink"><span style="width:34%"></span></div><div class="button-row" style="margin-top:18px"><button class="button primary small" data-action="assign-recovery">Assign recovery</button><button class="text-button" data-route="live">Use in live battle</button></div></aside>
    </div>
    <section class="card" style="margin-top:20px"><div class="card-head"><h2>Learners needing support</h2><span class="tag">5 learners</span></div><div class="table-wrap"><table><thead><tr><th>Learner</th><th>Weak concept</th><th>Mastery</th><th>Unresolved errors</th><th>Recommended action</th></tr></thead><tbody><tr><td>Mai Anh</td><td>Train / Test Split</td><td>38%</td><td>3</td><td><button class="button secondary small" data-action="assign-recovery">Assign recovery</button></td></tr><tr><td>Huy Nguyen</td><td>Model Evaluation</td><td>42%</td><td>2</td><td><button class="button secondary small">Send Daily Recall</button></td></tr><tr><td>Tran Linh</td><td>Learning Rate</td><td>45%</td><td>1</td><td><button class="button secondary small">Assign Lab</button></td></tr></tbody></table></div></section>`;
}

function bindLocalInteractions() {
  const drop = document.getElementById("dropzone");
  if (drop) {
    ["dragenter","dragover"].forEach(e => drop.addEventListener(e, ev => { ev.preventDefault(); drop.classList.add("drag"); }));
    ["dragleave","drop"].forEach(e => drop.addEventListener(e, ev => { ev.preventDefault(); drop.classList.remove("drag"); if(e==="drop"){state.uploadReady=true;render();} }));
  }
  if (state.route === "admin-generate" && state.generation < 100) {
    clearInterval(window.generationTimer);
    window.generationTimer = setInterval(() => {
      state.generation = Math.min(100, state.generation + 17);
      if (state.route === "admin-generate") render();
      if (state.generation >= 100) clearInterval(window.generationTimer);
    }, 550);
  }
}

function toast(message) {
  const root = document.getElementById("toast-root");
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `<strong>${translateUI(message)}</strong><small>Đã hoàn tất thao tác mô phỏng.</small>`;
  root.appendChild(el);
  setTimeout(() => el.remove(), 2800);
}

function showModal(title, body, wide = false) {
  document.getElementById("modal-root").innerHTML = translateUI(`<div class="modal-backdrop" data-action="close-modal"><div class="modal ${wide?"wide":""}" role="dialog" aria-modal="true" onclick="event.stopPropagation()"><div class="modal-head"><div><div class="eyebrow">Minh chứng VinCourse</div><h2>${title}</h2></div><button class="icon-button" data-action="close-modal">×</button></div>${body}</div></div>`);
}

function sourceModal() {
  showModal("Source Evidence", `<div class="source-box"><strong>Lecture 02 - Feature Scaling and Gradient Descent.pdf</strong><small>Page 14 · Section 2.3 · Optimization path</small></div><h3 style="margin-top:20px">Evidence summary</h3><p>When input features use very different scales, gradient descent can take an inefficient zigzag path. Standardization puts features on comparable scales, creating more balanced updates and more stable convergence.</p><div class="tag-row"><span class="tag">Feature Scaling</span><span class="tag">Gradient Descent</span><span class="status success">Source verified</span></div><div class="button-row" style="margin-top:20px"><button class="button primary" data-action="close-modal">Close</button></div>`);
}

document.addEventListener("click", event => {
  const language = event.target.closest("[data-language]");
  if (language) {
    state.language = language.dataset.language;
    render();
    return;
  }
  const routeEl = event.target.closest("[data-route]");
  if (routeEl) { navigate(routeEl.dataset.route); return; }
  const answer = event.target.closest("[data-answer]");
  if (answer) { state.selectedAnswer = answer.dataset.answer; render(); return; }
  const confidence = event.target.closest("[data-confidence]");
  if (confidence) { state.confidence = confidence.dataset.confidence; render(); return; }
  const liveAnswer = event.target.closest("[data-live-answer]");
  if (liveAnswer) { state.liveAnswer = liveAnswer.dataset.liveAnswer; render(); return; }
  const recallAnswer = event.target.closest("[data-recall-answer]");
  if (recallAnswer) { state.recallAnswer = recallAnswer.dataset.recallAnswer; render(); return; }
  const claim = event.target.closest("[data-claim]");
  if (claim) { state.claim = Number(claim.dataset.claim); render(); return; }
  const actionEl = event.target.closest("[data-action]");
  if (!actionEl) return;
  const action = actionEl.dataset.action;
  const actions = {
    "toggle-sidebar": () => document.getElementById("sidebar").classList.toggle("open"),
    "toggle-role": () => {
      state.role = state.role === "student" ? "admin" : "student";
      document.getElementById("side-name").textContent = state.role === "admin" ? "Dr. An Nguyen" : "Linh Minh";
      document.getElementById("side-role").textContent = state.role === "admin" ? "Giảng viên khóa học" : "Học viên khám phá";
      document.getElementById("side-avatar").textContent = state.role === "admin" ? "AN" : "LM";
      document.querySelector(".avatar-button").textContent = state.role === "admin" ? "AN" : "LM";
      navigate(state.role === "admin" ? "admin-dashboard" : "home");
    },
    "source": sourceModal,
    "close-modal": () => document.getElementById("modal-root").innerHTML = "",
    "submit-answer": () => navigate(state.selectedAnswer === "B" ? "result" : "feedback"),
    "hint": () => showModal("Concept hint", `<p>Think about the shape of the loss surface when one feature is 100,000 times larger than another. Which action makes gradient updates comparable across dimensions?</p><button class="button primary" data-action="close-modal">Got it</button>`),
    "recovery-next": () => { state.recoveryStep = Math.min(4, state.recoveryStep + 1); render(); },
    "recovery-back": () => { state.recoveryStep = Math.max(0, state.recoveryStep - 1); render(); },
    "recovery-finish": () => navigate("result"),
    "run-tests": () => { state.labRun = true; render(); toast("All visible tests passed"); },
    "submit-lab": () => { state.labSubmitted = true; render(); },
    "restart-lab": () => { state.labRun = false; state.labSubmitted = false; render(); },
    "submit-claim": () => { state.aiComplete = true; render(); },
    "restart-ai": () => { state.claim = null; state.aiComplete = false; render(); },
    "choose-file": () => document.getElementById("file-input").click(),
    "sample-file": () => { state.uploadReady = true; render(); toast("Demo lecture attached"); },
    "remove-file": () => { state.uploadReady = false; render(); },
    "generate-course": () => { state.generation = 8; navigate("admin-generate"); },
    "toggle": () => actionEl.classList.toggle("on"),
    "publish": () => showModal("Ready to publish?", `<p>Students will see 5 quests, 7 game modes, 24 questions, and 3 recovery missions.</p><div class="tag-row"><span class="status success">21 verified questions</span><span class="status warning">3 instructor-reviewed</span></div><div class="button-row" style="margin-top:20px"><button class="button secondary" data-action="close-modal">Cancel</button><button class="button primary" data-action="confirm-publish">Publish now</button></div>`),
    "confirm-publish": () => { document.getElementById("modal-root").innerHTML = ""; toast("Course published successfully"); },
    "preview-student": () => {
      state.role = "student";
      document.getElementById("side-name").textContent = "Linh Minh";
      document.getElementById("side-role").textContent = "Học viên khám phá";
      document.getElementById("side-avatar").textContent = "LM";
      document.querySelector(".avatar-button").textContent = "LM";
      navigate("map");
    },
    "approve-question": () => toast("Question approved"),
    "approve-all": () => toast("All verified questions approved"),
    "reject": () => toast("Regeneration request queued"),
    "export": () => toast("Analytics report prepared"),
    "assign-recovery": () => toast("Recovery mission assigned"),
    "start-recall": () => {
      state.recallStage = "play";
      state.recallAnswer = null;
      render();
      toast("Daily Recall session started");
    },
    "submit-recall": () => { state.recallStage = "result"; render(); },
    "exit-recall": () => { state.recallStage = "intro"; state.recallAnswer = null; render(); },
    "restart-recall": () => { state.recallStage = "play"; state.recallAnswer = null; render(); },
    "join-live": () => {
      state.liveStage = "play";
      state.liveSubmitted = false;
      state.liveAnswer = null;
      render();
      toast("Joined Team Gradient");
    },
    "submit-live-answer": () => {
      state.liveSubmitted = true;
      render();
      toast("Team answer submitted");
    },
    "live-result": () => {
      state.liveStage = "result";
      render();
    },
    "restart-live": () => {
      state.liveStage = "lobby";
      state.liveSubmitted = false;
      state.liveAnswer = null;
      render();
    },
    "end-live": () => toast("Live session ended"),
    "next-live": () => toast("Explanation revealed to class"),
    "lock": () => toast("Answers locked"),
    "boss-next": () => { state.bossComplete = true; render(); toast("Critical hit · explanation accepted"); },
    "restart-boss": () => { state.bossComplete = false; render(); },
    "notifications": () => showModal("Notifications", `<div class="list"><div class="list-item"><span class="circle-icon">↻</span><div class="list-item-main"><strong>4 recalls are due today</strong><small>Keep your 7-day streak</small></div></div><div class="list-item"><span class="circle-icon">●</span><div class="list-item-main"><strong>Live battle starts now</strong><small>Room VINC-24</small></div></div></div>`),
    "locked": () => toast("Complete Stabilize the Gradient first"),
    "map-node": () => navigate(actionEl.dataset.title === "Stabilize the Gradient" ? "quest" : "map"),
    "edit": () => toast("Edit controls opened")
  };
  if (actions[action]) actions[action]();
});

document.addEventListener("change", event => {
  if (event.target.id === "file-input") { state.uploadReady = true; render(); toast("PDF ready for generation"); }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") document.getElementById("modal-root").innerHTML = "";
});

const query = new URLSearchParams(window.location.search);
if (query.get("lang") === "en") state.language = "en";
const initial = window.location.hash.slice(1);
if (initial && screenNames[initial]) {
  state.route = initial;
  if (initial.startsWith("admin-")) state.role = "admin";
}
if (state.role === "admin") {
  document.getElementById("side-name").textContent = "Dr. An Nguyen";
  document.getElementById("side-role").textContent = "Giảng viên khóa học";
  document.getElementById("side-avatar").textContent = "AN";
  document.querySelector(".avatar-button").textContent = "AN";
}
render();
