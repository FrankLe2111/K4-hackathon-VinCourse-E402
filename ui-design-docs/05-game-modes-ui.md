# Game Modes UI

VinCourse co 7 mode choi trong ban thiet ke UI nay. Sau day la dinh nghia UI day du cho tung mode, dua tren `VinCourse.md`.

7 mode:

1. Story Quest
2. Daily Recall
3. Error Dungeon
4. Lab Arena
5. Boss Battle
6. Live Class Battle
7. AI Adversary

## Shared Mode Pattern

Moi mode nen co 4 man hinh/phan:

1. Mode Card trong `Mode Hub`.
2. Mode Intro.
3. Mode Play.
4. Mode Result.

Moi mode can hien thi:

- Muc tieu hoc tap.
- Concept lien quan.
- Evidence se duoc ghi nhan.
- Reward.
- Dieu kien hoan thanh.
- Next recommendation.

## Mode 1. Story Quest

### Purpose

Hoc vien di qua ban do course theo chuoi quest. Moi quest dai dien cho mot learning objective.

### Entry Points

- Student Home recommended card.
- Course Map node.
- Mode Hub card.

### Screen 1. Story Quest Card

Trong Mode Hub:

- Title `Story Quest`
- Description `Follow the course map and unlock concepts through short missions.`
- Status:
  - `Recommended`
  - `3 quests available`
- CTA `Open Map`
- Surface `#FFF9E5`

### Screen 2. Story Quest Intro

Layout:

- Large title: `Story Quest`
- Current zone: `Gradient Forest`
- Map preview with highlighted path.
- Current quest:
  - `Stabilize the Gradient`
  - Concepts: Feature Scaling, Gradient Descent.
  - Estimated time: 10 minutes.
  - Reward: 80 XP.
- Buttons:
  - `Start Current Quest`
  - `View Full Map`

Actions:

- Start quest.
- Change selected available quest.
- View prerequisites.

### Screen 3. Story Quest Play

Use shared `Quest Play` screen, but sequence is story-driven:

1. Story setup.
2. Warm-up question.
3. Main question.
4. Main question.
5. Transfer challenge.
6. Reflection.
7. Result.

UI additions:

- Story banner at top:
  - `Your model is diverging. Find the missing preprocessing step.`
- Progress path:
  - Node `Start`
  - Node `Recall`
  - Node `Apply`
  - Node `Transfer`
  - Node `Reward`

### Screen 4. Story Quest Result

Show:

- Quest complete.
- XP earned.
- Map node unlocked.
- New path opened.
- Mastery evidence.
- Next quest recommendation.

Actions:

- `Continue on Map`.
- `Start Next Quest`.
- `Review Mistakes`.

### Completion Rules

Quest complete khi:

- Student hoan thanh tat ca required questions.
- Reflection submitted.
- Neu co wrong answer, recovery can duoc queued hoac resolved.

## Mode 2. Daily Recall

### Purpose

Phien on tap ngan dua tren spaced repetition, concept sap quen, cau tung sai va confidence thap.

### Entry Points

- Student Home `Due Today`.
- Mode Hub.
- Notification chip in header.

### Screen 1. Daily Recall Card

- Title `Daily Recall`
- Description `A 5-minute review before concepts fade.`
- Due count: `4 due`
- CTA `Start Review`
- Surface `#E3F9FF`

### Screen 2. Daily Recall Intro

Layout:

- Title `Daily Recall`
- Subtitle `Short review generated from forgetting forecast.`
- Due list:
  - Feature Scaling: due today.
  - MSE Loss: due tomorrow.
  - Train/Test Split: low confidence.
- Session settings:
  - Length: 5 min, 10 min.
  - Question count: 3, 5, 8.
- CTA `Start Daily Recall`.

Actions:

- Select session length.
- Skip a concept with reason.
- Start review.

### Screen 3. Daily Recall Play

Layout:

- Top: `Recall 2/5`
- Concept tag and due reason:
  - `Due because last review was 7 days ago`
- Main question.
- Confidence selector is required.
- Button `Submit`.

Differences from Story Quest:

- No long story.
- Faster question cards.
- Emphasis on confidence and delayed retention.

### Screen 4. Daily Recall Result

Show:

- Concepts refreshed.
- Next review schedule:
  - Feature Scaling: in 3 days.
  - MSE Loss: tomorrow.
- Confidence calibration:
  - `High confidence + correct`
  - `Low confidence + correct`
- XP small reward.

Actions:

- `Back Home`.
- `Continue Practice`.

### Completion Rules

Daily Recall complete khi:

- Student answers selected number of due questions.
- Confidence submitted for each question.
- Next review dates updated.

## Mode 3. Error Dungeon

### Purpose

Chi chua cac loi hoc vien tung mac. Moi loi la mot mission can danh bai bang cach giai thich, lam cau tuong tu va transfer.

### Entry Points

- Wrong Answer Feedback.
- Student Home `Error Queue`.
- Mode Hub.
- Course Map pink recovery node.

### Screen 1. Error Dungeon Card

- Title `Error Dungeon`
- Description `Turn past mistakes into missions you can clear.`
- Count: `3 errors waiting`
- CTA `Fix Errors`
- Surface `#FFE7F4`

### Screen 2. Error Dungeon Lobby

Layout:

- Title `Error Dungeon`
- Summary:
  - `3 unresolved misconceptions`
  - `1 overdue delayed check`
- Error cards:
  - Misconception title.
  - Error type.
  - Related concepts.
  - Last seen date.
  - Status:
    - `New`
    - `Partially fixed`
    - `Delayed check due`
  - CTA `Start Recovery`.

Right panel:

- `Recovery Rules`
  - Answer original or equivalent.
  - Explain the mistake.
  - Solve similar question.
  - Pass transfer question.
  - Schedule delayed recall.

Actions:

- Sort by recent, severity, due.
- Start one recovery mission.
- View original question.

### Screen 3. Error Recovery Play

Stepper:

1. Original mistake.
2. Explain why wrong.
3. Similar question.
4. Transfer question.
5. Confidence check.

Layout:

- Left: current task.
- Right: misconception profile.
- Bottom: hint ladder.

Actions:

- Submit explanation.
- Request hint.
- Try similar question.
- Confirm confidence.

### Screen 4. Error Dungeon Result

Show:

- Error status:
  - `Resolved`
  - `Needs delayed recall`
  - `Still fragile`
- Recovery bonus.
- Mastery update.
- Next scheduled check.

Actions:

- `Fix another error`.
- `Return to Map`.

### Completion Rules

Error resolved khi:

- Student lam dung cau goc hoac equivalent.
- Student giai thich loi.
- Student lam dung similar question.
- Student lam dung transfer challenge.
- Confidence hop ly.

## Mode 4. Lab Arena

### Purpose

Ket noi ly thuyet voi code/lab. Hoc vien dien code, sua bug, du doan output, viet test hoac giai thich function.

### Entry Points

- Course Map Lab node.
- Quest Result next recommendation.
- Mode Hub.
- Instructor assigned quest.

### Screen 1. Lab Arena Card

- Title `Lab Arena`
- Description `Apply concepts in code challenges and get concept-linked feedback.`
- Status:
  - `1 lab unlocked`
- CTA `Enter Lab`
- Surface `#F3F2FF`

### Screen 2. Lab Arena Intro

Layout:

- Title `Lab Arena`
- Challenge title:
  - `Fix Unstable Training`
- Concepts:
  - Feature Scaling.
  - Learning Rate.
- Task types:
  - Code completion.
  - Bug fix.
  - Output prediction.
  - Explain function.
- Reward:
  - XP.
  - Lab evidence.
- CTA `Start Lab`.

### Screen 3. Lab Arena Play

Layout:

- Three panels:
  - Left: instructions and concept goal.
  - Center: code editor.
  - Right: tests, hints, source evidence.

Code editor area:

- File tab:
  - `preprocessing.py`
  - `train.py`
- Code block/editor.
- Missing code placeholder.

Test panel:

- Button `Run Tests`.
- Test result:
  - Pass/fail.
  - Hidden tests count.
  - Runtime.

Concept feedback panel:

- If test fails:
  - `Possible concept: Feature scaling / learning rate interaction`
  - Button `Review Concept`
  - Button `Start Recovery`

Actions:

- Edit code.
- Run tests.
- Open hint.
- View source lecture.
- Submit final.

### Screen 4. Lab Arena Result

Show:

- Tests passed.
- Lab evidence earned:
  - `Applied normalization in code`
  - `Explained training stability`
- If failed:
  - Failure category:
    - Syntax error.
    - Logic error.
    - Conceptual error.
  - Suggested recovery mission.

Actions:

- `Submit Lab`.
- `Retry`.
- `Review Concept`.

### Completion Rules

Lab complete khi:

- Required visible tests pass.
- Student answers explanation prompt.
- Lab evidence added to mastery.

Hackathon simplification:

- Code editor can be static textarea.
- Test result can be simulated.
- Main wow moment is concept-linked failure feedback.

## Mode 5. Boss Battle

### Purpose

Tong hop nhieu concept sau module. Boss khong chi la 20 cau quiz; no gom phan tich tinh huong, tim loi, chon phuong phap, sua code, giai thich ket qua.

### Entry Points

- Course Map Boss Gate.
- Quest Result after completing prerequisites.
- Mode Hub.

### Screen 1. Boss Battle Card

- Title `Boss Battle`
- Description `Prove mastery across multiple concepts in one scenario.`
- Unlock condition:
  - `Complete 3 Gradient Forest quests`
- CTA:
  - `Locked`
  - or `Challenge Boss`
- Surface `#FFF9E5` with blue accent.

### Screen 2. Boss Battle Intro

Layout:

- Boss title:
  - `Rescue the Broken Model`
- Scenario summary:
  - `A model diverges, validation score is unstable, and an AI-generated explanation may be wrong.`
- Concepts tested:
  - Feature Scaling.
  - Learning Rate.
  - MSE Loss.
  - Train/Test Split.
- Battle phases:
  1. Diagnose.
  2. Choose fix.
  3. Explain.
  4. Transfer.
  5. Final challenge.
- Rewards:
  - Badge evidence.
  - Large XP.
  - Unlock next zone.

### Screen 3. Boss Battle Play

Layout:

- Top:
  - Boss health/progress bar.
  - Phase indicator.
  - Concepts involved.
- Main:
  - Scenario card.
  - Current challenge.
- Right:
  - Evidence collected.
  - Hints remaining.
  - Source references.

Phase examples:

- Diagnose:
  - Choose likely root cause.
- Find error:
  - Highlight faulty reasoning.
- Fix:
  - Select preprocessing/code fix.
- Explain:
  - Short answer.
- Transfer:
  - New dataset/context.

Actions:

- Submit phase answer.
- Use hint.
- View source.
- Continue to next phase.

### Screen 4. Boss Battle Result

Show:

- Boss defeated or partial.
- Phase-by-phase performance.
- Concepts mastered.
- Evidence earned:
  - Diagnosis.
  - Explanation.
  - Transfer.
  - Lab/code application if included.
- Unlock:
  - Next course zone.

Actions:

- `Unlock Next Zone`.
- `Retry Weak Phase`.
- `Review Evidence`.

### Completion Rules

Boss defeated khi:

- Student passes minimum number of phases.
- Required explain/transfer phase passed.
- Critical misconception not present.

## Mode 6. Live Class Battle

### Purpose

Giang vien to chuc hoat dong trong lop. Ca lop/nhom cung chong boss, diem dua tren dap an va giai thich. He thong hien misconception theo thoi gian thuc.

### Entry Points

- Instructor creates live session.
- Student joins via class code.
- Mode Hub card.

### Screen 1. Live Class Battle Card

- Title `Live Class Battle`
- Description `Join your class to solve a shared boss challenge.`
- Status:
  - `No live session`
  - or `Live now`
- CTA:
  - `Join`
  - `Enter Code`
- Surface `#E3F9FF`

### Screen 2A. Instructor Live Setup

Layout:

- Title `Create Live Class Battle`
- Select course.
- Select boss/challenge.
- Team mode:
  - Individual.
  - Small teams.
  - Whole class.
- Scoring:
  - Correctness.
  - Explanation quality.
  - Confidence calibration.
- Button `Start Live Battle`.

After start:

- Class code.
- QR placeholder.
- Waiting room list.

### Screen 2B. Student Join

Layout:

- Title `Join Live Class Battle`
- Input class code.
- Button `Join`.
- If session active:
  - Session title.
  - Team assignment.
  - Countdown.

### Screen 3A. Instructor Live Monitor

Layout:

- Main:
  - Current question.
  - Timer.
  - Answer distribution chart.
  - Misconception stream.
- Right:
  - Team list.
  - Scores.
  - Students stuck.
- Bottom:
  - Controls:
    - `Reveal Hint`
    - `Lock Answers`
    - `Show Explanation`
    - `Next Phase`

### Screen 3B. Student Live Play

Layout:

- Current challenge.
- Team status.
- Answer input.
- Explanation input.
- Confidence selector.
- Button `Submit for Team`.

State after submit:

- `Waiting for class`
- Show team answer summary.

### Screen 4. Live Battle Result

Instructor view:

- Class boss defeated?
- Misconception heatmap.
- Team contributions.
- Suggested follow-up quest.

Student view:

- Team result.
- Personal evidence earned.
- Concepts needing review.
- CTA `Start Personal Recovery`.

### Completion Rules

Live battle complete khi:

- Instructor ends session.
- At least one final explanation submitted.
- System generates class misconception summary.

Hackathon simplification:

- Simulate live room with static data.
- No actual websocket required.

## Mode 7. AI Adversary

### Purpose

AI dong vai mot hoc vien hoac tro ly dua ra cau tra loi sai nhung rat thuyet phuc. Hoc vien phai phat hien loi, sua reasoning va dan nguon tu tai lieu.

Mode nay lay tu muc `AI Adversary` trong `VinCourse.md` va nen duoc dua vao 7 mode vi no co gameplay rieng, rat khac quiz thuong.

### Entry Points

- Mode Hub.
- Boss Battle phase.
- Story Quest advanced challenge.
- Instructor assigned activity.

### Screen 1. AI Adversary Card

- Title `AI Adversary`
- Description `Catch a convincing wrong explanation and correct it with evidence.`
- Status:
  - `Advanced`
- CTA `Challenge AI`
- Surface `#DFFFF3`

### Screen 2. AI Adversary Intro

Layout:

- Title `AI Adversary`
- Scenario:
  - `An AI tutor explains why the model diverged. Some parts are wrong.`
- Student mission:
  - Find the wrong claim.
  - Explain why it is wrong.
  - Correct the reasoning.
  - Cite source evidence.
- Reward:
  - Critical thinking evidence.
  - XP.

CTA `Start Challenge`.

### Screen 3. AI Adversary Play

Layout:

- Left/main:
  - AI answer card.
  - Each sentence/claim selectable.
- Right:
  - Source evidence library.
  - Concept tags.
  - Claim checklist.
- Bottom:
  - Explanation textarea.
  - Buttons:
    - `Mark Claim as Wrong`
    - `Submit Correction`

AI answer example:

```text
The model diverged mainly because it has not trained for enough epochs.
Feature scaling is optional for gradient descent and usually only affects speed.
Increasing the learning rate will help the model converge faster.
```

Student actions:

- Highlight wrong claim.
- Select concept.
- Write correction.
- Attach source evidence.
- Submit.

### Screen 4. AI Adversary Feedback

If correct:

- Show `You caught the misleading reasoning`.
- Explain wrong claim.
- Show corrected reasoning.
- Add evidence:
  - `Detected false explanation`
  - `Cited source`

If incomplete:

- Show hint:
  - `Check the relationship between feature scale and gradient stability.`
- Allow retry.

### Screen 5. AI Adversary Result

Show:

- Claims found.
- Corrections accepted.
- Evidence earned.
- Concepts strengthened.
- Next challenge.

Actions:

- `Try harder adversary`.
- `Back to Map`.
- `Review concept`.

### Completion Rules

AI Adversary complete khi:

- Student marks at least one wrong claim.
- Student explains why.
- Student provides corrected reasoning.
- Student attaches or selects source evidence.

## Cross-Mode Mastery Evidence Matrix

| Mode | Primary Evidence |
| --- | --- |
| Story Quest | Completes learning objective sequence |
| Daily Recall | Delayed recall and confidence calibration |
| Error Dungeon | Misconception resolved |
| Lab Arena | Applies concept in code/lab |
| Boss Battle | Transfers multiple concepts in scenario |
| Live Class Battle | Explains/collaborates under class challenge |
| AI Adversary | Detects and corrects misleading reasoning |

## Cross-Mode Unlocking Rules

- Story Quest unlocks new map zones.
- Daily Recall is always available when due items exist.
- Error Dungeon unlocks when student has unresolved errors.
- Lab Arena unlocks after prerequisite concept quest.
- Boss Battle unlocks after zone mastery threshold.
- Live Class Battle is available when instructor starts session.
- AI Adversary unlocks after student has enough basic mastery or as boss phase.

## Cross-Mode Visual Differentiation

| Mode | Surface | Accent |
| --- | --- | --- |
| Story Quest | `#FFF9E5` | `#00CA72` |
| Daily Recall | `#E3F9FF` | `#007AFF` |
| Error Dungeon | `#FFE7F4` | `#00CA72` |
| Lab Arena | `#F3F2FF` | `#007AFF` |
| Boss Battle | `#FFF9E5` | `#007AFF` |
| Live Class Battle | `#E3F9FF` | `#00CA72` |
| AI Adversary | `#DFFFF3` | `#007AFF` |

