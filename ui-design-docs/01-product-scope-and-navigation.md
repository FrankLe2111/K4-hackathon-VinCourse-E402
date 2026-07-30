# Product Scope And Navigation

## 1. Scope Cho Hackathon 1.5 Ngay

VinCourse trong hackathon nen duoc thiet ke nhu mot `course simulation`, khong phai he thong day du.

### Nen lam

- Admin upload hoac chon sample PDF.
- He thong mo phong qua trinh doc PDF va sinh game course.
- Admin xem concept map, quest list, question bank va publish.
- Student thay course map nhu game map.
- Student choi mot quest hoan chinh.
- Khi student sai, he thong phat hien misconception va mo recovery mission.
- Ket qua cuoi quest cap nhat XP, mastery va evidence.
- Co trang/entry cho du 7 mode choi, moi mode co UI va thao tac ro rang.

### Chua can lam

- Dang nhap that.
- Multi-course LMS day du.
- PDF parser hoan hao.
- GitHub integration that.
- Sandbox chay code an toan that.
- Multiplayer realtime that.
- Knowledge tracing model that.

## 2. Hai Role Chinh

### Admin / Instructor

Admin la nguoi bien tai lieu bai giang thanh game course.

Admin can:

- Tao course moi.
- Upload PDF bai giang.
- Xem AI generation progress.
- Xem concept map.
- Review quest va question bank.
- Kiem tra source evidence.
- Publish course cho student.
- Xem analytics co ban.

### Student / Learner

Student la nguoi hoc qua game.

Student can:

- Xem ban do khoa hoc.
- Chon quest.
- Tra loi cau hoi.
- Dung hint.
- Xem feedback neu dung/sai.
- Lam recovery mission khi sai.
- Nhan XP, reward, mastery update.
- Xem cac mode choi khac nhau.

## 3. Information Architecture

```text
VinCourse
|
|-- Role Selection
|
|-- Admin
|   |-- Admin Dashboard
|   |-- Create Course
|   |-- Upload Lecture PDF
|   |-- Generation Progress
|   |-- Generated Course World
|   |-- Knowledge Graph Review
|   |-- Quest Review
|   |-- Question Review Studio
|   |-- Publish Confirmation
|   |-- Instructor Analytics
|
|-- Student
    |-- Student Home
    |-- Course Map
    |-- Mode Hub
    |-- Story Quest
    |-- Daily Recall
    |-- Error Dungeon
    |-- Lab Arena
    |-- Boss Battle
    |-- Live Class Battle
    |-- AI Adversary
    |-- Quest Play
    |-- Wrong Answer Feedback
    |-- Recovery Mission
    |-- Quest Result
    |-- Mastery Dashboard
```

## 4. Dieu Huong Tong The

### Entry Flow

```text
Role Selection
-> Instructor Demo
-> Admin Dashboard
-> Create Course
-> Upload PDF
-> Generation Progress
-> Generated Course World
-> Publish
-> Preview as Student
-> Course Map
```

### Student Core Flow

```text
Course Map
-> Quest Intro
-> Question Play
-> Submit Answer
-> Feedback
-> Recovery Mission neu sai
-> Transfer Challenge
-> Quest Result
-> Next Recommendation
```

### Game Mode Flow

```text
Student Home
-> Mode Hub
-> Select Mode
-> Mode Intro
-> Play Activity
-> Feedback
-> Mastery Update
-> Back to Course Map
```

## 5. Route De Xuat

```text
/                         Role Selection
/admin                    Admin Dashboard
/admin/courses/new        Create Course
/admin/courses/new/upload Upload PDF
/admin/courses/building   Generation Progress
/admin/courses/:id/world  Generated Course World
/admin/courses/:id/review Question Review Studio
/admin/courses/:id/stats  Instructor Analytics
/student                  Student Home
/student/map              Course Map
/student/modes            Mode Hub
/student/quest/:id        Quest Play
/student/recovery/:id     Error Recovery
/student/result/:id       Quest Result
```

## 6. Demo Storyline De Xuat

Course mau: `Machine Learning Foundations`

Tai lieu mau:

- `Lecture 02 - Feature Scaling and Gradient Descent.pdf`

Concept sinh ra:

- Feature Scaling
- Normalization
- Standardization
- Gradient Descent
- Learning Rate
- MSE Loss
- Model Evaluation

Quest demo:

- `Stabilize the Gradient`

Misconception demo:

- Hoc vien nghi rang train them epoch se sua duoc model diverge.
- He thong phat hien loi la `Conceptual misunderstanding`.
- He thong lien ket loi voi `Feature Scaling` va `Gradient Descent`.
- Student lam recovery mission va transfer question.

