# Bản demo tương tác VinCourse

Đây là nguyên mẫu tương tác cho hackathon VinCourse. Bảy game mode dùng dữ liệu
minh họa và logic trong trình duyệt; mode **Hiểu Thật** gọi backend để chấm
teach-back bằng OpenAI hoặc bộ mô phỏng có gắn nhãn rõ ràng.

## Mở bản demo

Từ thư mục gốc, chạy:

```bash
COURSEQUEST_DEMO_MODE=1 python3 codebase/server.py
```

Mở <http://127.0.0.1:8000/#modes> để thử bảy game mode. Lát cắt hackathon được
chấm là **Hiểu Thật** tại <http://127.0.0.1:8000/#understanding>; route này gọi
API backend, còn các game mode khác là vision UI tương tác. Không cần cài package.
Mọi tên người, lớp, điểm số và analytics trong vision UI là dữ liệu giả minh họa.

Dùng công tắc `VI / EN` trên thanh công cụ phía trên để chuyển ngôn ngữ cho toàn
bộ giao diện. Nội dung thường sử dụng font Lato để hiển thị tiếng Việt rõ ràng;
tiêu đề sử dụng Poppins.

## Luồng trình diễn đề xuất

1. Bắt đầu tại màn hình Trang chủ học viên.
2. Mở `Chế độ chơi` để giới thiệu đủ bảy chế độ học tập.
3. Mở `Thi đấu lớp học trực tiếp`, tham gia phòng `VINC-24`, trả lời cho Đội
   Gradient, viết lý do, chọn độ tự tin rồi mô phỏng giảng viên công bố kết quả.
4. Mở `Bản đồ khóa học`, sau đó bắt đầu nhiệm vụ `Ổn định Gradient`.
5. Chọn đáp án A và gửi để kích hoạt tính năng phát hiện hiểu lầm.
6. Bắt đầu Nhiệm vụ khắc phục và hoàn thành năm bước.
7. Vào Lab, điền hai chỗ trống, chạy test và nộp để mở khóa Trùm.
8. Hoàn thành đủ năm pha Đại chiến Trùm.
9. Dùng nút chuyển vai trò ở góc dưới bên trái để vào chế độ Giảng viên.
10. Tải bài giảng mẫu, tạo thế giới và duyệt nội dung mô phỏng.

## Phạm vi bản demo

- Trang chủ học viên, Bản đồ khóa học, Chế độ chơi, chơi nhiệm vụ, phản hồi,
  khắc phục, kết quả, ôn tập hằng ngày, bảng năng lực và minh chứng nguồn.
- Nhiệm vụ cốt truyện, Ôn tập hằng ngày, Hầm ngục lỗi sai, Đấu trường thực hành,
  Đại chiến Trùm, Thi đấu lớp học trực tiếp và Đối thủ AI.
- Mỗi chế độ đều có đầu vào bắt buộc, phản hồi, phần thưởng và hành động tiếp;
  Lab phải đạt test mới mở Boss, còn Boss yêu cầu đủ năm pha.
- Tổng quan giảng viên, tải PDF, tiến trình AI tạo nội dung, duyệt khóa học,
  duyệt câu hỏi, xác nhận xuất bản, phân tích và theo dõi lớp trực tiếp.
- Bố cục thích ứng cho máy tính, máy tính bảng và điện thoại.

## Các tệp chính

- `index.html`: khung ứng dụng.
- `styles.css`: hệ thống hình ảnh và bố cục thích ứng.
- `app.js`: màn hình hard-code, trạng thái, điều hướng và tương tác mô phỏng.
