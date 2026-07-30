# Components And States

File nay mo ta component can co de build UI nhanh va nhat quan.

## 1. App Shell

### AppHeader

Props:

- `role`: admin/student.
- `activeNav`.
- `courseName`.
- `xp`.
- `streak`.

Admin variant:

- Logo `VinCourse Admin`.
- Nav: Courses, Review, Analytics.
- Button `Preview as Student`.

Student variant:

- Logo `VinCourse`.
- Nav: Map, Modes, Review, Mastery.
- XP chip.
- Streak chip.
- Avatar.

States:

- Default.
- Mobile collapsed.
- Active nav.

## 2. RoleSwitcher

Use:

- Role selection page.
- Header quick switch in demo.

Layout:

- Two large cards:
  - Instructor.
  - Student.
- Each card has icon, role description, CTA.

Actions:

- Select role.
- Continue to role home.

## 3. UploadDropzone

Use:

- Admin upload PDF screen.

Elements:

- Upload icon.
- Main text.
- Helper text.
- File list.
- Remove button.

States:

- Empty.
- Drag over.
- Uploading.
- Uploaded.
- Failed.

Style:

- Background `#F3F2FF`.
- Dashed border green.
- Radius `32px`.
- Padding `32px`.

## 4. GenerationStepper

Use:

- Generation progress.
- Course builder.

Elements:

- Step label.
- Status icon.
- Progress bar.

States:

- Pending.
- In progress.
- Completed.
- Failed.

## 5. ConceptTag

Use:

- Quest cards.
- Question cards.
- Feedback panels.

Variants:

- Default.
- Mastered.
- Weak.
- Due.
- Misconception.

Style:

- Badge radius `20px`.
- Min height `28px`.
- Text 12-14px.

## 6. MasteryBar

Use:

- Student dashboard.
- Quest result.
- Concept detail.

Elements:

- Concept name.
- Previous score optional.
- Current score.
- Progress bar.
- Evidence count.

States:

- Low: 0-40%.
- Growing: 41-70%.
- Strong: 71-89%.
- Mastered: 90%+.
- Fragile: has unresolved misconception.

Important:

- Always show percentage as text.
- Do not rely on color alone.

## 7. CourseMapNode

Use:

- Student Course Map.
- Admin generated map preview.

Props:

- `title`.
- `type`: concept/quest/boss/lab/recovery.
- `status`: locked/available/recommended/completed/due.
- `concepts`.
- `mastery`.

Visual states:

- Completed: green fill with check.
- Available: white fill with green border.
- Recommended: green border and blue `Recommended` label.
- Recovery: pink fill and `Fix` label.
- Locked: gray fill and lock icon.
- Boss: larger node with blue accent.

Actions:

- Click select.
- Double click start if available.
- Hover show tooltip.

## 8. QuestCard

Use:

- Quest list.
- Course map side panel.
- Story Quest intro.

Elements:

- Quest title.
- Short story/purpose.
- Concepts.
- Question count.
- Estimated time.
- Reward.
- Status.
- CTA.

States:

- Draft.
- Ready.
- Published.
- Locked.
- In progress.
- Completed.
- Recommended.

## 9. ModeCard

Use:

- Mode Hub.
- Student Home.

Elements:

- Icon.
- Mode name.
- Description.
- Status.
- Count/due indicator.
- CTA.

Mode surfaces:

- Story Quest: cream.
- Daily Recall: light blue.
- Error Dungeon: pink.
- Lab Arena: lavender.
- Boss Battle: cream.
- Live Class Battle: light blue.
- AI Adversary: mint.

## 10. QuestionCard

Use:

- Quest Play.
- Daily Recall.
- Boss Battle.

Elements:

- Prompt.
- Optional media/code/diagram.
- Question metadata:
  - Concept.
  - Bloom level.
  - Difficulty.
  - Source.
- Answer area.
- Submit action.

Question types:

- Multiple choice.
- Multiple select.
- True/false with explanation.
- Fill in blank.
- Short answer.
- Ordering.
- Matching.
- Code completion.
- Debug code.
- Output prediction.
- Case study.
- Diagram interpretation.
- Compare two solutions.
- Explain why.
- Teach-back.
- Confidence question.
- Reflection.

States:

- Unanswered.
- Selected.
- Submitted.
- Correct.
- Wrong.
- Needs explanation.
- Loading evaluation.

## 11. AnswerOption

Use:

- Multiple choice/select.

Elements:

- Option label.
- Option text.
- Optional explanation after submit.

States:

- Default.
- Hover.
- Selected.
- Correct.
- Incorrect.
- Disabled.

Style:

- Radius `16px`.
- Border default `#E5E7EB`.
- Selected border `#00CA72`.
- Correct background `#DFFFF3`.
- Incorrect background `#FFE7F4`.

## 12. ConfidenceSelector

Use:

- Quest Play.
- Daily Recall.
- Recovery Mission.
- Live Class Battle.

Options:

- Low.
- Medium.
- High.

Alternative:

- Slider 0-100.

Behavior:

- Required before submit for questions that affect confidence calibration.
- If answer correct but confidence low, evidence says `needs confidence reinforcement`.
- If answer wrong but confidence high, flag `overconfidence`.

## 13. HintLadder

Use:

- Quest Play.
- Wrong Answer Feedback.
- Recovery Mission.

Levels:

1. Related concept.
2. Point to suspicious part.
3. Simpler example.
4. Step-by-step guide.
5. Final explanation.

States:

- Locked.
- Available.
- Opened.

Important:

- Using hint should reduce bonus XP, not punish progress.
- Hints should be shown as learning support.

## 14. MisconceptionCard

Use:

- Wrong Answer Feedback.
- Error Dungeon.
- Instructor Analytics.

Elements:

- Misconception statement.
- Error type.
- Related concepts.
- Evidence/source.
- Status.
- CTA `Start Recovery`.

States:

- New.
- In progress.
- Resolved.
- Delayed check due.
- Recurring.

## 15. SourceEvidencePanel

Use:

- Question Review Studio.
- Feedback.
- AI Adversary.
- Concept detail.

Elements:

- Document name.
- Page number.
- Section.
- Chunk summary.
- Link/open action.

States:

- Grounded.
- Weak evidence.
- Missing evidence.

## 16. RewardBadge

Use:

- Quest Intro.
- Quest Result.
- Mastery Dashboard.

Elements:

- Badge title.
- Evidence list.
- Progress.

Examples:

- `Gradient Descent Apprentice`
- `Misconception Resolver`
- `Transfer Thinker`
- `Lab Evidence`

Important:

- Badge should always show evidence, not just icon.

## 17. EvidenceList

Use:

- Quest Result.
- Mastery Dashboard.
- Badge detail.

Evidence types:

- Correct recall.
- Concept explanation.
- Similar question passed.
- Transfer question passed.
- Misconception resolved.
- Lab test passed.
- AI adversary corrected.
- Delayed recall passed.

## 18. CodeChallengePanel

Use:

- Lab Arena.

Elements:

- File tabs.
- Code editor or textarea.
- Run tests button.
- Test output.
- Concept feedback.

States:

- Editing.
- Running tests.
- Tests passed.
- Tests failed.
- Syntax error.
- Logic error.
- Conceptual error.

## 19. LiveBattlePanel

Use:

- Live Class Battle.

Instructor elements:

- Class code.
- Timer.
- Answer distribution.
- Misconception stream.
- Team scores.
- Controls.

Student elements:

- Current challenge.
- Team info.
- Answer input.
- Explanation input.
- Submit status.

States:

- Waiting room.
- Countdown.
- Answering.
- Locked.
- Reveal.
- Result.

## 20. AIClaimHighlighter

Use:

- AI Adversary.

Elements:

- AI answer text split into claims.
- Selectable sentence/claim.
- Mark as wrong.
- Attach source evidence.

States:

- Unselected.
- Selected.
- Marked wrong.
- Correctly identified.
- Incorrectly marked.

## 21. Empty States

Admin no courses:

- `No course worlds yet`
- CTA `Upload your first lecture PDF`

No pending review:

- `All generated questions are reviewed`
- CTA `Preview as Student`

Student no due recall:

- `Nothing due today`
- CTA `Continue Story Quest`

Student no errors:

- `No unresolved errors`
- CTA `Try AI Adversary`

## 22. Loading States

Use skeleton cards for:

- Concept map.
- Quest list.
- Question list.
- Analytics heatmap.

Use progress stepper for:

- PDF generation.
- Test running.
- Live battle countdown.

## 23. Error States

Upload failed:

- Show reason.
- CTA retry.

Generation failed:

- Show failed step.
- CTA retry.
- Allow use sample generated course.

Question evaluation failed:

- Save answer locally.
- CTA retry submit.

Live session disconnected:

- Show reconnecting state.
- Keep answer draft.

## 24. Responsive Behavior

Desktop:

- 2-3 column layouts.
- Side panels visible.
- Course map full width with right detail panel.

Tablet:

- Side panels collapse below main content.
- Quest cards 2 columns.

Mobile:

- Single column.
- Header nav collapses.
- Course map becomes vertical path.
- Right panels become bottom sheets.
- Buttons full width when primary action.

