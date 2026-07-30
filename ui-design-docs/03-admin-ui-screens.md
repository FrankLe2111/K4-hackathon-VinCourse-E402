# Admin UI Screens

Role admin/instructor tap trung vao viec bien tai lieu bai giang thanh course game co the cho hoc vien choi.

## Screen A1. Role Selection

### Muc tieu

Cho nguoi xem demo hieu ngay san pham co hai role: instructor tao game course va student choi game hoc tap.

### Layout

Header:

- Logo `VinCourse`
- Nav: `Instructor`, `Student`, `Demo Course`
- Primary button: `Start Demo`

Main hero:

- Left column:
  - H1: `Turn Lecture PDFs Into Adaptive Learning Quests`
  - Body: `Upload a lecture, generate a course map, and let students fix misconceptions through game missions.`
  - Buttons:
    - `Instructor Demo`
    - `Student Demo`
- Right column:
  - Course map preview trong panel pastel mint.
  - 4 node mau:
    - `Upload`
    - `Concepts`
    - `Quests`
    - `Recovery`

### Thao tac

- Click `Instructor Demo` -> `Admin Dashboard`.
- Click `Student Demo` -> `Student Course Map`.
- Click `Start Demo` -> mo flow admin upload.

### Style

- Background white.
- Hero preview background `#DFFFF3`.
- H1 Poppins 48-64px.
- Button chinh `#00CA72`.

## Screen A2. Admin Dashboard

### Muc tieu

Admin xem cac course simulation va tao course moi.

### Layout

Header:

- Logo `VinCourse Admin`
- Course selector.
- Nav: `Courses`, `Review`, `Analytics`.
- Button: `Preview as Student`.

Page title:

- `Course Simulations`
- Subtitle: `Create adaptive learning games from lecture materials.`

Summary row:

- Card `Courses`: `3`
- Card `PDFs Uploaded`: `8`
- Card `Generated Quests`: `42`
- Card `Pending Review`: `12`

Main content:

- Left/main column:
  - Section `Recent Courses`
  - Course cards:
    - Course name
    - Source documents
    - Status
    - Generated concepts/questions/quests
    - Buttons: `Open`, `Preview`
- Right column:
  - Large CTA card `Create Course from PDF`
  - Checklist `Upload -> Generate -> Review -> Publish`

### Thao tac

- Click `Create Course from PDF` -> Create Course.
- Click `Open` -> Generated Course World.
- Click `Preview` -> Student Course Map.
- Click `Pending Review` metric -> Question Review Studio filtered by pending.

### Empty state

Neu chua co course:

- Show pastel card `No course worlds yet`
- Button `Upload your first lecture PDF`

## Screen A3. Create Course

### Muc tieu

Nhap metadata co ban truoc khi upload lecture.

### Layout

Page header:

- `Create Game Course`
- Stepper:
  - `Course Info`
  - `Upload`
  - `Generate`
  - `Review`
  - `Publish`

Main two-column layout:

Left form:

- Course name.
- Course topic.
- Target learner level.
- Session length:
  - `10 min`
  - `15 min`
  - `20 min`
- Game intensity:
  - `Light`
  - `Balanced`
  - `Challenge`

Right preview:

- Card `What students will see`
- Mock quest card:
  - `Quest: Stabilize the Gradient`
  - `3 concepts`
  - `5 questions`
  - `1 recovery mission`

### Thao tac

- Click `Continue to Upload`.
- Course name la required.
- Neu field thieu, input border error va helper text.

## Screen A4. Upload Lecture PDF

### Muc tieu

Admin upload tai lieu bai giang vao course simulation.

### Layout

Header:

- Title `Upload Lecture Materials`
- Subtitle `PDFs will be used to generate concepts, questions, quests, and source evidence.`

Main:

- Left large upload dropzone:
  - Upload icon.
  - Text `Drop lecture PDF here`
  - Button `Choose File`
  - Helper `PDF, max 50MB`
- Below dropzone:
  - Uploaded file row:
    - File name.
    - Page count.
    - Status `Ready`.
    - Remove icon button.
- Right panel:
  - `AI will generate`
  - Checklist:
    - Concept map.
    - Learning objectives.
    - Question bank.
    - Misconception candidates.
    - 7 game mode entry points.
    - Recovery missions.

Bottom sticky action:

- Secondary `Back`
- Primary `Generate Course World`

### Thao tac

- Drag file vao dropzone -> hien file row.
- Click `Choose File` -> file picker.
- Click remove -> xoa file khoi list.
- Click `Generate Course World` -> Generation Progress.

### States

- Empty.
- Drag over.
- Uploading.
- Uploaded.
- Upload failed.

### Style

- Dropzone background `#F3F2FF`.
- Border dashed `#00CA72`.
- Checklist icons green.

## Screen A5. Generation Progress

### Muc tieu

Tao cam giac AI dang bien PDF thanh game course.

### Layout

Full page centered panel:

- Large card background `#FFF9E5`, radius 48-60px.
- Title `Building your course world...`
- Progress bar.
- Current step text.

Step list:

1. `Reading lecture structure`
2. `Extracting key concepts`
3. `Creating learning objectives`
4. `Generating grounded questions`
5. `Detecting likely misconceptions`
6. `Building quest map`
7. `Preparing review studio`

Live preview area:

- Concept chips xuat hien dan:
  - `Feature Scaling`
  - `Gradient Descent`
  - `Learning Rate`
- Quest skeleton cards.
- Source evidence count.

### Thao tac

- Trong demo co the auto advance sau vai giay.
- Button `Skip animation` -> Generated Course World.

### States

- Processing.
- Step completed.
- Generation completed.
- Failed with retry.

## Screen A6. Generated Course World

### Muc tieu

Admin xem tong quan course game da duoc sinh tu PDF.

### Layout

Top bar:

- Title `Generated Course World`
- Status badge `Draft`
- Buttons:
  - `Edit`
  - `Review Questions`
  - `Preview as Student`
  - Primary `Publish`

Main grid:

- Left large panel: `Course Knowledge Map`
  - Node concept.
  - Edge prerequisite.
  - Node metadata on hover/click.
- Right top panel: `Generated Summary`
  - `7 concepts`
  - `5 quests`
  - `28 questions`
  - `6 misconception candidates`
- Right bottom panel: `Misconception Preview`
  - List misconception cards.

Below:

- `Quest Path`
  - Horizontal quest cards:
    - Quest title.
    - Concepts.
    - Question count.
    - Mode availability.
    - Review status.

### Thao tac

- Click concept node -> open side drawer `Concept Detail`.
- Click quest card -> open `Quest Review`.
- Click `Review Questions` -> Question Review Studio.
- Click `Preview as Student` -> Student Course Map.
- Click `Publish` -> Publish Confirmation.

### Concept Detail Drawer

Hien thi:

- Concept name.
- Learning objective.
- Prerequisites.
- Source refs.
- Common misconceptions.
- Questions linked.
- Mastery threshold.

Actions:

- `Edit objective`.
- `Add misconception`.
- `Regenerate questions`.

## Screen A7. Quest Review

### Muc tieu

Admin review cau truc quest truoc khi publish.

### Layout

Left:

- Quest title.
- Story prompt.
- Concepts.
- Learning objective.
- Reward.

Middle:

- Quest sequence:
  - Warm-up.
  - Main question.
  - Main question.
  - Error recovery slot.
  - Transfer challenge.
  - Reflection.

Right:

- Source coverage:
  - PDF pages.
  - Concepts covered.
  - Bloom distribution.
- Buttons:
  - `Approve Quest`
  - `Edit`
  - `Regenerate`

### Thao tac

- Drag reorder steps.
- Toggle required/optional.
- Click question item -> open detail modal.
- Approve quest -> status green.

## Screen A8. Question Review Studio

### Muc tieu

Cho thay AI khong tu do sang tao kien thuc; cau hoi co evidence va can instructor review.

### Layout

Three-column layout:

Left sidebar:

- Filters:
  - `All`
  - `Needs Review`
  - `Approved`
  - `Multiple Choice`
  - `Explain Why`
  - `Debug Code`
  - `High Risk`
- Concept filter.
- Bloom level filter.

Middle:

- Question list.
- Selected question card:
  - Prompt.
  - Answer options.
  - Correct answer.
  - Explanation.
  - Hints.
  - Common mistakes.
  - Similar question preview.

Right:

- Source evidence panel:
  - Document name.
  - Page number.
  - Section.
  - Extracted evidence summary.
- Verification panel:
  - `Grounded`
  - `Answer aligned`
  - `Distractors plausible`
  - `No ambiguity detected`
- Actions:
  - `Approve`
  - `Edit`
  - `Reject`
  - `Report ambiguity`

### Thao tac

- Select question in list.
- Edit prompt/options.
- Approve/reject.
- View source.
- Generate similar question.

### States

- Needs review.
- Approved.
- Rejected.
- Edited.
- Ambiguous warning.

## Screen A9. Publish Confirmation

### Muc tieu

Xac nhan course da san sang cho student.

### Layout

Centered card:

- Title `Publish Course World?`
- Summary:
  - `7 concepts`
  - `5 story quests`
  - `1 boss battle`
  - `28 approved questions`
  - `6 recovery missions`
- Warning:
  - `Students will be able to start quests immediately.`
- Buttons:
  - `Cancel`
  - Primary `Publish`

After publish:

- Success panel:
  - `Course World Published`
  - Button `Open Student Preview`
  - Button `Back to Dashboard`

## Screen A10. Instructor Analytics

### Muc tieu

Admin thay tien do hoc tap khong chi bang diem trung binh.

### Layout

Top metrics:

- `Active learners`
- `Quest completion`
- `Misconceptions detected`
- `Recovery success`

Main:

- Concept mastery heatmap.
- Misconception heatmap.
- Question quality table:
  - Question.
  - Wrong rate.
  - Report count.
  - Ambiguity risk.
- Students needing help list.

Right panel:

- `Recommended instructor actions`
  - Review question with high wrong rate.
  - Assign class recovery challenge.
  - Re-teach concept with low mastery.

### Thao tac

- Click heatmap cell -> concept detail.
- Click misconception -> see affected students.
- Click question row -> Question Review Studio.
- Click action -> create quest/live battle.

