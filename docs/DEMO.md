# Bản demo tương tác VinCourse

Đây là nguyên mẫu hard-code chạy trực tiếp trên trình duyệt cho hackathon
VinCourse. Bản demo thể hiện trải nghiệm sản phẩm và các tương tác mà không cần
backend, đăng nhập thật, xử lý PDF hay gọi AI thật.

## Mở bản demo

Mở tệp `index.html` bằng trình duyệt hiện đại. Không cần cài đặt hay chạy máy chủ
phát triển.

Dùng công tắc `VI / EN` trên thanh công cụ phía trên để chuyển ngôn ngữ cho toàn
bộ giao diện. Nội dung thường sử dụng font Lato để hiển thị tiếng Việt rõ ràng;
tiêu đề sử dụng Poppins.

## Luồng trình diễn đề xuất

1. Bắt đầu tại màn hình Trang chủ học viên.
2. Mở `Chế độ chơi` để giới thiệu đủ bảy chế độ học tập.
3. Mở `Thi đấu lớp học trực tiếp`, tham gia phòng `VINC-24`, trả lời cho Đội
   Gradient, gửi đáp án và mô phỏng giảng viên công bố kết quả.
4. Mở `Bản đồ khóa học`, sau đó bắt đầu nhiệm vụ `Ổn định Gradient`.
5. Chọn đáp án A và gửi để kích hoạt tính năng phát hiện hiểu lầm.
6. Bắt đầu Nhiệm vụ khắc phục và hoàn thành năm bước.
7. Dùng nút chuyển vai trò ở góc dưới bên trái để vào chế độ Giảng viên.
8. Mở `Tải bài giảng`, sau đó chọn `Dùng bài giảng mẫu`.
9. Tạo thế giới khóa học và chờ quá trình mô phỏng hoàn tất.
10. Duyệt khái niệm, nhiệm vụ, câu hỏi, nguồn, phân tích và thi đấu trực tiếp.

## Phạm vi bản demo

- Trang chủ học viên, Bản đồ khóa học, Chế độ chơi, chơi nhiệm vụ, phản hồi,
  khắc phục, kết quả, ôn tập hằng ngày, bảng năng lực và minh chứng nguồn.
- Nhiệm vụ cốt truyện, Ôn tập hằng ngày, Hầm ngục lỗi sai, Đấu trường thực hành,
  Đại chiến Trùm, Thi đấu lớp học trực tiếp và Đối thủ AI.
- Mỗi chế độ đều có đường trình diễn từ màn vào, thao tác chơi đến phản hồi hoặc
  màn kết quả và hành động tiếp theo.
- Tổng quan giảng viên, tải PDF, tiến trình AI tạo nội dung, duyệt khóa học,
  duyệt câu hỏi, xác nhận xuất bản, phân tích và theo dõi lớp trực tiếp.
- Bố cục thích ứng cho máy tính, máy tính bảng và điện thoại.

## Các tệp chính

- `index.html`: khung ứng dụng.
- `styles.css`: hệ thống hình ảnh và bố cục thích ứng.
- `app.js`: màn hình hard-code, trạng thái, điều hướng và tương tác mô phỏng.
