# Hackathon Build Plan

Thoi gian: 1.5 ngay.

Muc tieu: tao UI prototype thuyet phuc, khong can backend hoan chinh.

## 1. Demo Narrative

Pitch demo nen di theo cau chuyen:

1. Instructor upload PDF bai giang.
2. AI sinh concepts, questions, misconceptions va quest map.
3. Instructor review nhanh va publish.
4. Student vao course map.
5. Student choi quest `Stabilize the Gradient`.
6. Student tra loi sai.
7. He thong phat hien misconception.
8. Student lam recovery mission.
9. Quest result hien mastery update va evidence.
10. Mode Hub cho thay 7 mode choi cua san pham.

## 2. Scope Can Build Neu Chi Co 1 Frontend

Build full visual cho 8 man:

1. Role Selection.
2. Admin Upload PDF.
3. Generation Progress.
4. Generated Course World.
5. Student Course Map.
6. Mode Hub.
7. Quest Play with wrong answer.
8. Recovery Mission + Quest Result.

Them static modal/panel cho:

- Question Review Studio.
- Source Evidence.
- AI Adversary preview.
- Lab Arena preview.
- Live Class Battle preview.

## 3. Scope Can Build Neu Co 2 Frontend

Frontend 1:

- Admin flow:
  - Role Selection.
  - Admin Dashboard.
  - Upload PDF.
  - Generation Progress.
  - Generated Course World.
  - Question Review Studio.

Frontend 2:

- Student flow:
  - Student Home.
  - Course Map.
  - Mode Hub.
  - Quest Intro.
  - Quest Play.
  - Wrong Feedback.
  - Recovery Mission.
  - Quest Result.
  - 7 mode detail screens.

## 4. Uu Tien Build

### Must Have

- Admin upload -> generation -> generated world.
- Student course map.
- Quest play.
- Wrong answer feedback.
- Recovery mission.
- Quest result.
- Mode Hub with 7 modes.

### Should Have

- Question Review Studio.
- Source evidence modal.
- Lab Arena simulated code panel.
- AI Adversary claim selection.

### Nice To Have

- Instructor analytics.
- Live Class Battle monitor.
- Animations.
- Responsive mobile polish.

## 5. Data Mau

Course:

- `Machine Learning Foundations`

PDF:

- `Lecture 02 - Feature Scaling and Gradient Descent.pdf`

Concepts:

- Feature Scaling.
- Normalization.
- Standardization.
- Gradient Descent.
- Learning Rate.
- MSE Loss.
- Train/Test Split.
- Model Evaluation.

Quests:

1. `Clean the Dataset`
2. `Stabilize the Gradient`
3. `Decode the Loss`
4. `Evaluation Arena`
5. `Rescue the Broken Model`

Game zones:

- Data Village.
- Gradient Forest.
- Evaluation Arena.
- Boss Gate.

Misconceptions:

- Confuses normalization with standardization.
- Thinks more epochs always fixes poor prediction.
- Thinks lower loss always means higher accuracy.
- Does not understand large learning rate divergence.
- Confuses overfitting and underfitting.

## 6. Cau Hoi Demo

### Question 1

Prompt:

`A linear regression model diverges after a few epochs. The features have very different scales. Which explanation is most likely?`

Options:

1. `The model needs more epochs.`
2. `Unscaled features can make gradient descent unstable.`
3. `The train/test split is too small.`
4. `The loss function should always be accuracy.`

Correct:

`Unscaled features can make gradient descent unstable.`

Wrong answer demo:

`The model needs more epochs.`

Detected misconception:

`Assumes longer training fixes instability caused by feature scale.`

Error type:

`Conceptual misunderstanding`

### Recovery Question

Prompt:

`Why might training for more epochs not solve divergence when feature scales are very different?`

Expected idea:

`Because gradient updates can be dominated by large-scale features, causing unstable or inefficient optimization. Scaling changes the optimization landscape and can stabilize gradient descent.`

### Transfer Question

Prompt:

`A house price model uses square meters and number of bedrooms. Training is unstable. What preprocessing step is likely missing?`

Correct:

`Scale or standardize the features before gradient descent.`

## 7. Component Build Order

1. App shell and header.
2. Button, badge, card primitives.
3. UploadDropzone.
4. QuestCard and ModeCard.
5. CourseMapNode.
6. QuestionCard and AnswerOption.
7. HintLadder and MisconceptionCard.
8. MasteryBar and EvidenceList.
9. SourceEvidencePanel.
10. CodeChallengePanel and AIClaimHighlighter if time.

## 8. Interaction Logic De Xuat

Use simple client state:

```text
courseGenerated: false -> true
coursePublished: false -> true
selectedQuest: stabilize-gradient
currentQuestionIndex: 0
selectedAnswer: null
answerSubmitted: false
answerCorrect: false
recoveryStep: review | explain | similar | transfer | confirm
mastery.featureScaling: 42 -> 68
xp: 120 -> 230
```

## 9. Demo Click Path

```text
Role Selection
-> Instructor Demo
-> Upload PDF
-> Generate Course World
-> Generated Course World
-> Preview as Student
-> Course Map
-> Start Stabilize the Gradient
-> Select wrong answer
-> Submit
-> Start Recovery Mission
-> Submit explanation
-> Answer transfer question
-> Quest Result
-> Mode Hub
```

## 10. Visual Checklist

- Primary CTA green `#00CA72`.
- Cards pastel from style guide.
- Header 64px.
- Poppins headings.
- Body min 16px.
- Quest cards radius 24-32px.
- Game world panel radius 48-60px.
- Answer option selected state has border and icon.
- Wrong state pink, not harsh red.
- Every mastery percentage has text.
- Every AI-generated question has source evidence visible somewhere.

## 11. What To Say During Demo

Key line:

> The product is not rewarding students for clicking more questions. It rewards evidence of mastery.

Show:

- Upload PDF.
- Generated concepts.
- Generated quest map.
- Student wrong answer.
- Misconception detection.
- Recovery mission.
- Mastery evidence.

## 12. Risks In Demo And Fallbacks

PDF upload not working:

- Use sample PDF button.

Generation too slow:

- Use short animation and preloaded generated course.

Quest flow too long:

- Start directly at question 2 with wrong answer path.

7 modes too much to implement:

- Mode Hub cards plus 1 detail preview per mode is enough.

Live Class Battle too complex:

- Static instructor monitor with fake class data.

Lab Arena too complex:

- Static code editor and simulated test result.

