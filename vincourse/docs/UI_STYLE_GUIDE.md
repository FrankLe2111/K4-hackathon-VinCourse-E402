# UI Style Guide

Nhom muon UI moi giong tinh than prototype lead da lam trong `codebase/static/`. Tai lieu nay chuyen style do thanh guideline de implement bang React.

## 1. Tinh Than Chung

UI nen co cam giac:

- Learning game, khong phai dashboard enterprise kho cung.
- Co cau truc ro rang: sidebar, topbar, workspace, card nhiem vu, right rail.
- Vui va co dong luc, nhung van nghiem tuc vi day la san pham hoc tap.
- Feedback luon gan voi evidence, XP, next action.

Khong nen:

- Moi mode mot theme hoan toan khac.
- Moi nguoi tu tao layout rieng.
- Lam landing page marketing.
- Dung qua nhieu gradient/orb/decorative background.
- Lam UI chi la form thuan HTML khong co game context.

## 2. Layout Chung

Prototype cu co pattern:

```text
app shell
  sidebar trai
  main content
    topbar
    workspace
      main column
      right rail
```

React app nen giu pattern nay:

- Sidebar dung de chon mode.
- Topbar hien course/context.
- Main column hien gameplay chinh.
- Right rail hien progress, evidence, mistake/recovery queue, skill path.

Moi feature khong tu tao app shell. Feature chi render noi dung trong khu vuc workspace.

## 3. Mau Sac

Lay tinh than tu `codebase/static/app.css`:

```text
ink: xanh den gan den
paper: nen giay am
card: trang am
line: vien xam am
green: xanh dam chu dao
lime: mau nhan cho active/progress
coral: mau loi sai/misconception
amber: partial/warning
blue: demo/system/secondary
sidebar: xanh den
```

Khuyen nghi token:

```text
--ink: #15231f
--muted: #68746e
--paper: #f6f4ed
--card: #fffef9
--line: #deded4
--green: #225846
--lime: #d7f56a
--coral: #ff6f52
--amber: #ffcc63
--blue: #5d8df6
--sidebar: #11251f
```

Feature owner khong nen them palette moi neu khong can.

## 4. Typography

Prototype cu dung:

- Sans-serif cho UI text.
- Serif cho headline/mission title.
- Small uppercase label cho breadcrumb, tag, evidence heading.

Guideline:

- Page title: lon, co tinh editorial/game.
- Card title: vua, de scan.
- Body: ngan, ro, uu tien learning action.
- Label: uppercase nho, dung cho status/evidence/mission type.

Khong viet doan giai thich dai tren UI. Neu can giai thich, dua vao modal/evidence panel.

## 5. Component Pattern

Moi mode nen co cac thanh phan sau:

```text
ModeHeader
MissionCard
EvidencePanel
AnswerInput hoac ChallengeSurface
ConfidenceControl neu co answer
SubmitAction
ResultPanel
NextAction
RightRailProgress
```

Neu mode la Lab Arena:

- ChallengeSurface la code editor/simple textarea.
- ResultPanel hien visible tests, hidden tests mock, concept evidence.

Neu mode la Live Battle:

- ChallengeSurface la team answer panel.
- Right rail hien room/team/class distribution.

Neu mode la Boss Battle:

- MissionCard hien phase hien tai.
- Right rail hien phase progress.

## 6. Result State

Tat ca feature result nen map theo `GameResult.status`:

```text
mastered -> xanh dam / success
partial -> amber / can bo sung
misconception -> coral / can sua loi sai
needs_clarification -> amber / can noi ro hon
out_of_scope -> xam xanh / ngoai nhiem vu
```

Result panel bat buoc hien:

- Status title.
- Feedback.
- Evidence IDs neu co.
- XP/mastery delta neu co.
- Next action.

## 7. UI Copy

Dung Vietnamese-first cho UI:

- "Nhiem vu"
- "Nguon su that"
- "Bang chung"
- "Loi sai can sua"
- "Buoc tiep theo"
- "Kiem tra"
- "Lam lai"
- "Mo khoa"

Giu technical terms neu dich nghe ky:

- AI
- RAG neu co
- API
- XP
- Boss Battle neu team muon ten mode English

## 8. Feature-Specific Visual Rules

Story Quest:

- Co cam giac ban do/nhiem vu.
- Hien checkpoint index, XP, evidence.

Daily Recall:

- Nhanh, gon, co time/queue.
- Hien ly do concept den han on tap.

Error Dungeon:

- Tap trung vao misconception.
- Hien source, giai thich lai, similar, transfer, confirm.

Lab Arena:

- Co code/task surface.
- Result hien tests pass/fail.

Boss Battle:

- Multi-phase.
- Hien phase performance va unlock.

Live Battle:

- Hien room, team, submitted count, class distribution.
- Neu chua lam realtime, phai ghi ro la mock/local session trong UI.

## 9. Accessibility Va Responsive

- Button phai co text ro hoac aria-label.
- Text khong duoc overflow trong button/card.
- Mobile: sidebar co the thanh top nav, right rail dua xuong duoi.
- Form input phai co label.
- Loading va error state phai doc duoc bang text.

## 10. Khi Dung AI Agent Gen UI

Prompt nen noi ro:

```text
Build inside my feature folder only.
Match the existing VinCourse visual style:
dark green sidebar, warm paper background, warm white cards,
green/lime primary actions, coral misconception state,
mission card + evidence panel + result panel pattern.
Do not create a new app shell or new global theme.
```

