# Student Core Screens

Student UI la trai nghiem chinh cua VinCourse. Man hinh phai lam ro tinh nang cot loi: hoc qua quest, sai duoc phan tich, loi sai bien thanh recovery mission, mastery duoc cap nhat bang evidence.

## Screen S1. Student Home

### Muc tieu

Cho hoc vien biet nen lam gi tiep theo.

### Layout

Header:

- Logo `VinCourse`
- Nav: `Map`, `Modes`, `Review`, `Mastery`
- XP chip.
- Streak chip.
- Avatar.

Hero panel:

- Greeting: `Ready for a 10-minute quest?`
- Recommended action:
  - `Start: Stabilize the Gradient`
  - Reason: `Recommended because Feature Scaling mastery is low.`
- Primary button: `Start Quest`

Main grid:

- Card `Course Map`
- Card `Daily Recall`
- Card `Error Recovery`
- Card `Lab Arena`

Right panel:

- `Mastery Snapshot`
  - Feature Scaling 42%
  - Gradient Descent 55%
  - MSE Loss 70%
- `Due Today`
  - 2 recall questions.
  - 1 recovery mission.

### Thao tac

- Click `Start Quest` -> Quest Intro.
- Click `Course Map` -> Course Map.
- Click mode card -> Mode Intro.

## Screen S2. Course Map

### Muc tieu

Hien thi course nhu mot ban do game, moi zone la module, moi node la quest/concept.

### Layout

Top:

- Course title `Machine Learning Foundations`
- Progress:
  - `3/12 quests completed`
  - Overall mastery.
  - XP.

Main full-width map:

- Zone `Data Village`
  - Quest `Clean the Dataset`
  - Status completed.
- Zone `Gradient Forest`
  - Quest `Stabilize the Gradient`
  - Status recommended.
  - Error recovery node attached.
- Zone `Evaluation Arena`
  - Quest locked.
- Zone `Boss Gate`
  - Locked until prerequisites.

Right drawer/panel:

- Selected quest detail:
  - Title.
  - Concepts.
  - Difficulty.
  - Estimated time.
  - Reward.
  - Reason recommended.
  - Button `Start Quest`.

### Thao tac

- Click node -> select node.
- Double click available node -> Quest Intro.
- Hover locked node -> show unlock requirement.
- Click recovery node -> Error Dungeon/Recovery Mission.

### Node states

- Completed: green fill, check icon.
- Available: white fill, green border.
- Recommended: green border plus blue label `Recommended`.
- Recovery: pink fill, label `Fix`.
- Locked: gray fill, lock icon.

## Screen S3. Mode Hub

### Muc tieu

Cho hoc vien thay day du 7 mode choi cua san pham.

### Layout

Page title:

- `Choose Your Learning Mode`
- Subtitle: `Each mode trains a different kind of mastery evidence.`

Grid 2-3 columns:

- Story Quest.
- Daily Recall.
- Error Dungeon.
- Lab Arena.
- Boss Battle.
- Live Class Battle.
- AI Adversary.

Moi mode card:

- Icon.
- Mode name.
- One-line purpose.
- Due/locked/available status.
- CTA:
  - `Start`
  - `Join`
  - `Preview`

### Thao tac

- Click card -> mode intro screen.
- Filter tabs:
  - `All`
  - `Recommended`
  - `Solo`
  - `Class`
  - `Review`

## Screen S4. Quest Intro

### Muc tieu

Dat context truoc khi hoc vien vao mot quest.

### Layout

Large quest card:

- Quest title: `Stabilize the Gradient`
- Story prompt:
  - `Your model is diverging after a few epochs. Find the concept that can stabilize training.`
- Concepts:
  - Feature Scaling.
  - Gradient Descent.
  - Learning Rate.
- Mission steps:
  - 2 warm-up questions.
  - 3 main challenges.
  - 1 transfer question.
  - 1 reflection.
- Rewards:
  - `+80 XP`
  - `Recovery bonus available`
  - `Evidence for Gradient Badge`

Side panel:

- `Why this quest?`
  - `Your last answer showed low confidence on feature scaling.`

Buttons:

- Primary `Start Quest`.
- Secondary `Back to Map`.

## Screen S5. Quest Play

### Muc tieu

Day la man hinh tra loi cau hoi chinh.

### Layout

Top bar:

- Quest progress `Question 2/5`.
- Concept tag.
- Difficulty badge.
- Hint count.
- Timer optional.

Main area:

- Question card:
  - Prompt.
  - Optional diagram/code block.
  - Answer options hoac input.
- Answer area:
  - Multiple choice cards.
  - Textarea neu explain question.
  - Code editor neu coding question.
- Confidence input:
  - Segmented control: `Low`, `Medium`, `High`.

Right panel:

- Quest objective.
- Current evidence checklist.
- Hint ladder:
  - Hint 1 available.
  - Hint 2 locked.
  - Hint 3 locked.

Bottom:

- Secondary `Use Hint`.
- Primary `Submit`.

### Thao tac

- Select answer option.
- Type explanation.
- Choose confidence.
- Click `Use Hint`.
- Click `Submit`.

### States

- Unanswered.
- Answer selected.
- Hint opened.
- Submitted correct.
- Submitted wrong.
- Loading evaluation.

## Screen S6. Correct Feedback

### Muc tieu

Xac nhan hoc vien dung va noi ro evidence nao vua duoc them.

### Layout

Feedback card:

- Title `Nice work`
- Explanation concise.
- Source evidence chip:
  - `Lecture 02, page 14`
- Evidence earned:
  - `Applied concept in new context`

Actions:

- `Continue`
- `View Source`

### Style

- Mint background `#DFFFF3`.
- Green check icon.

## Screen S7. Wrong Answer Feedback

### Muc tieu

Day la wow moment: he thong khong chi bao sai ma phat hien loai loi.

### Layout

Main card:

- Title `Not quite`
- Subtitle `This looks like a conceptual misunderstanding.`
- Detected misconception:
  - `You may be assuming that training longer always fixes unstable predictions.`
- Related concepts:
  - Feature Scaling.
  - Gradient Descent.
- Error type badge:
  - `Conceptual misunderstanding`

Feedback ladder:

- Hint 1: concept lien quan.
- Hint 2: phan can xem lai.
- Hint 3: vi du don gian.
- Final explanation locked.

Right panel:

- Source evidence:
  - PDF name.
  - Page number.
  - Section.
- Why it matters:
  - `Unscaled features can make gradient descent unstable even if epochs increase.`

Actions:

- `Try Again`
- Primary `Start Recovery Mission`
- `View Source`

### Thao tac

- Click `Try Again` -> quay lai cau hoi voi hint 1.
- Click `Start Recovery Mission` -> Recovery Mission.
- Click `View Source` -> source modal.

### Style

- Pink surface `#FFE7F4` cho misconception.
- Primary recovery action mau green.
- Khong dung red qua manh.

## Screen S8. Recovery Mission

### Muc tieu

Bien loi sai thanh mot mini-flow hoc lai co kiem chung.

### Layout

Top:

- Title `Recovery Mission`
- Subtitle `Fix: Feature scaling misconception`
- Stepper:
  - Review.
  - Explain.
  - Similar.
  - Transfer.
  - Confirm.

Step 1: Review

- Short explanation.
- Source evidence.
- Button `I reviewed this`.

Step 2: Explain

- Prompt:
  - `Why might more epochs not fix unstable training?`
- Textarea.
- Button `Submit Explanation`.

Step 3: Similar Question

- Similar question with same concept.
- Answer options.

Step 4: Transfer Challenge

- Different context question.
- Example:
  - `A house price model uses square meters and number of bedrooms. Training diverges. What preprocessing step is likely missing?`

Step 5: Confirm

- Confidence check.
- Summary:
  - Error resolved or still needs review.

### Thao tac

- Stepper advances after each submit.
- Student can view source anytime.
- If wrong again, show next hint rather than fail the mission.

### Completion condition

Recovery resolved khi:

- Student explain dung y chinh.
- Student lam dung similar question.
- Student lam dung transfer challenge.
- Confidence khong qua lech.

## Screen S9. Quest Result

### Muc tieu

Ket thuc quest bang reward va mastery evidence.

### Layout

Celebration panel:

- Title `Quest Complete`
- XP gained.
- Recovery bonus.
- Badge progress.

Mastery update:

- Feature Scaling: `42% -> 68%`
- Gradient Descent: `55% -> 61%`
- Confidence calibration update.

Evidence earned:

- Correct conceptual explanation.
- Solved transfer question.
- Fixed misconception.
- Scheduled delayed recall.

Next recommendation:

- `Next: Learning Rate Tuning`
- Reason.
- Button `Continue`.

### Thao tac

- Click `Continue` -> Course Map.
- Click `Review Evidence` -> Mastery Dashboard.
- Click `Retry weak concepts` -> Error Dungeon/Daily Recall.

## Screen S10. Mastery Dashboard

### Muc tieu

Cho hoc vien thay minh manh/yeu o concept nao va bang chung nao da co.

### Layout

Top cards:

- XP.
- Streak.
- Concepts mastered.
- Recovery rate.

Main:

- Concept mastery list:
  - Concept name.
  - Mastery percentage.
  - Evidence count.
  - Next review.
  - Button `Practice`.
- Evidence timeline:
  - Date.
  - Quest.
  - Evidence type.
  - Result.
- Error queue:
  - Known misconceptions.
  - Status.
  - Button `Fix now`.

### Thao tac

- Click concept -> detail drawer.
- Click `Practice` -> recommended mode.
- Click error -> Recovery Mission.

## Screen S11. Source Evidence Modal

### Muc tieu

Tang do tin cay bang cach cho thay cau hoi/giai thich co nguon.

### Layout

Modal:

- Title `Source Evidence`
- Document name.
- Page number.
- Section.
- Evidence excerpt/summary.
- Related concept.
- Button `Close`.

### Thao tac

- Open from feedback, question review, concept detail.
- Close with button or Esc.

