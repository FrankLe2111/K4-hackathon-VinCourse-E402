# Live Class Battle Completion Plan

Tai lieu nay chuyen plan tong hop thanh execution plan chi tiet de hoan thien feature `live_battle` trong codebase `vincourse/`.

Ngay lap plan: `2026-07-31`

Owner feature:

- Ngo Minh Phuoc

Tai lieu nay duoc viet dua tren:

- `vincourse/docs/TEAM_HANDOFF_DEVELOP.md`
- `vincourse/docs/AI_AGENT_INTEGRATION_RULES.md`
- `vincourse/docs/JSON_DATABASE_PLAN.md`
- `vincourse/docs/API_CONTRACT.md`
- `vincourse/docs/UI_STYLE_GUIDE.md`
- `vincourse/docs/features/live-battle.md`

## 1. Muc Tieu

Hoan thien `Live Class Battle` o muc:

- Co demo path ro rang cho hoc vien va giang vien.
- Giu dung contract chung `/session` va `/submit`.
- UI cho thay ro day la phien live mo phong/local.
- Submit tao `GameResult` hop le va ghi progress/recovery thong qua backend.
- Feature doc, frontend, backend, test va limitation duoc dong bo voi nhau.

Tai lieu nay khong mo rong feature thanh realtime that. Khong them WebSocket trong phase nay.

## 2. Pham Vi Duoc Sua

Theo ownership hien tai, chi sua:

```text
vincourse/apps/web/src/features/live-battle/**
vincourse/apps/api/app/features/live_battle/**
vincourse/docs/features/live-battle.md
```

Co the them tai lieu ke hoach nay trong `vincourse/docs/` de team theo doi.

Khong tu sua:

```text
vincourse/apps/web/src/app/**
vincourse/apps/web/src/api/**
vincourse/apps/web/src/types/**
vincourse/apps/web/src/shared/**
vincourse/apps/api/app/storage/**
vincourse/apps/api/app/ai/**
vincourse/apps/api/app/schemas.py
```

Neu can dong vao vung shared, phai tao shared change request rieng.

## 3. Tom Tat Hien Trang

### 3.1 Backend

Da co:

- `GET /api/modes/live_battle/session`
- `POST /api/modes/live_battle/submit`
- Rule-based grading cho 3 nhanh:
  - `mastered`
  - `partial`
  - `misconception`
- Co test cho session, correct strong, correct weak, wrong answer, invalid reasoning

Dang con:

- Dung `ROOM_STATE` in-memory trong router.
- Chua co storage layer rieng cho room runtime.
- Chua test het cac input invalid va room validation chi tiet.

### 3.2 Frontend

Da co:

- Role switch `Học viên` / `Giảng viên`
- Student flow:
  - join room
  - waiting
  - answering
  - submitted
  - result
- Instructor local mock flow:
  - setup
  - lobby
  - monitor
  - locked
  - reveal
  - summary
- Badge `Phiên live mô phỏng`

Dang con:

- Can polish them copy, state, reset, va consistency theo UI guide.
- Co dau hieu duplicate CSS:
  - `styles.css`
  - `live-battle.css`

### 3.3 Integration

Tinh trang hien tai khac voi docs cu:

- `FeatureHost` da import va render `LiveBattleFeature`.
- Vi vay phan `Shared Integration Request` trong `docs/features/live-battle.md` da cu, can cap nhat.

## 4. Dinh Nghia Hoan Thanh

Feature `live_battle` duoc xem la hoan thanh trong phase nay khi:

- Quy tac MVP duoc ap dung nhat quan:
  - moi trinh duyet dai dien cho mot team
  - nguoi dang dung trinh duyet la dai dien submit dap an cuoi cung cua team
  - chua mo phong bieu quyet hoac trao doi cua nhieu thanh vien trong cung team
  - team duoc tinh la da hoan thanh mode ngay khi submit thanh cong lan dau
  - completion khong phu thuoc dap an dung/sai hoac status `mastered`/`partial`/`misconception`
  - dung/sai chi anh huong den XP, mastery, feedback va recovery
  - replay van duoc cham va nhan feedback, nhung khong duoc cong them XP/mastery
- Student demo path chay tron:
  - open mode
  - join room dung ma
  - vao waiting room
  - chon option + confidence
  - chi nhap reasoning khi cau hoi yeu cau
  - submit
  - thay result
- Instructor demo path chay tron:
  - setup
  - lobby
  - monitor
  - lock
  - reveal
  - summary
- UI hien ro `Phiên live mô phỏng`.
- Backend tra `GameResult` dung contract.
- Wrong answer tao `recovery_created=true`.
- Backend test pass.
- Frontend typecheck/build pass.
- `docs/features/live-battle.md` phan anh dung implementation va limitation thuc te.

## 5. Nguyen Tac Bat Buoc

### 5.1 Contract

Phai giu nguyen pattern:

```text
GET  /api/modes/live_battle/session
POST /api/modes/live_battle/submit
```

`POST /submit` phai tra ve day du:

```text
mode
correct
status
feedback
evidence_ids
misconception_id
xp
mastery_delta
recovery_created
next_action
```

Moi cau hoi trong `GameSession.payload` phai khai bao ro yeu cau reasoning:

```json
{
  "question_id": "live-feature-scaling-01",
  "team_id": "team-gradient",
  "team_name": "Team Gradient",
  "requires_reasoning": true,
  "min_reasoning_length": 20
}
```

Quy tac:

- `requires_reasoning=true`: frontend chi cho submit va backend chi chap nhan khi reasoning dat `min_reasoning_length`.
- `requires_reasoning=false`: hoc vien chi can chon option; reasoning co the de trong.
- Backend la noi quyet dinh yeu cau reasoning cua cau hoi. Khong tin field `requires_reasoning` do client gui trong request.
- Hai field nay nam trong `GameSession.payload`, nen khong can sua shared schema.
- Backend cap `team_id` va `team_name` trong session payload.
- Frontend chi dung `team_id` tu session, khong tu sinh hoac cho nguoi dung sua.

Team answer duoc serialize trong field `answer` cua contract chung:

```json
{
  "team_id": "team-gradient",
  "room_code": "VINC-24",
  "option_id": "B",
  "reasoning": ""
}
```

Quy tac team/completion/replay:

- `team_id` bat buoc va phai thuoc room/session hien tai.
- Mot browser demo dung mot `team_id` on dinh trong suot phien.
- Khoa nhan dien mot lan submit la `team_id + session_id + question_id`.
- Submit thanh cong lan dau phai tra `payload.mode_completed=true` va `payload.first_submission=true`.
- Submit lai cung khoa van duoc cham, nhung phai tra `xp=0`, `mastery_delta=0`, `payload.replay=true`.
- Replay khong duoc tang `submitted_count` lan nua.
- `correct` va `status` khong duoc dung lam dieu kien duy nhat de xac dinh completion cua Live Battle.
- Neu lan submit dau sai va tao recovery, replay dung khong tu xoa recovery. Recovery chi duoc giai quyet trong Error Dungeon.

Quy tac XP cho lan submit dau:

```text
mastered      -> 140 XP
partial       -> 70 XP
misconception -> 20 XP tham gia
replay        -> 0 XP
```

Confidence trong MVP:

- Van bat buoc chon tu `1-5` de thu thap du lieu tu danh gia.
- Chua dung confidence de tinh XP hoac `GameStatus`.
- UI khong duoc trinh bay confidence/calibration la `20 diem` khi backend chua cham tieu chi nay.

### 5.2 Data Flow

Chi dung:

```text
React -> shared API client -> FastAPI -> memory/storage -> GameResult
```

Khong dung:

```text
React -> JSON file
React -> OpenAI
feature router -> direct file write
```

### 5.3 UI

Phai theo tinh than VinCourse:

- warm paper background
- warm white cards
- dark green / lime / coral state
- mission card + result panel + right rail
- Vietnamese-first copy

### 5.4 Limitation Disclosure

Phai ghi ro trong UI:

- local mock
- khong co realtime that
- distribution / ranking / room control la demo data

## 6. Gap List Chi Tiet

## 6.1 Docs Gap

- `docs/features/live-battle.md` dang noi `FeatureHost` chua import feature.
- Thuc te `FeatureHost` da tich hop xong.
- Can sua tai lieu de tranh base owner hoac AI agent sau nay doc nham.

## 6.2 Frontend Gap

- Can xac nhan file CSS nao la nguon that.
- Can xoa hoac bo sung note cho file CSS cu/dead file.
- Can ra soat consistency:
  - button disabled state
  - retry state
  - reset state
  - error copy
  - result copy
  - responsive state
- Can dam bao submit fail thi quay lai state hop ly.
- Frontend dang bat buoc reasoning toi thieu 20 ky tu cho moi cau hoi.
- Can doc `requires_reasoning` va `min_reasoning_length` tu session payload:
  - cau co yeu cau reasoning: hien textarea va kiem tra do dai
  - cau khong yeu cau reasoning: cho submit chi voi option + confidence
- Chua co `team_id` on dinh de bieu dien "mot browser la mot team".
- Replay hien chi reset UI, chua thong bao ro lan choi lai khong co them XP.
- UI dang trinh bay calibration la `20 diem`, nhung backend chua dung confidence de cham diem.

## 6.3 Backend Gap

- `ROOM_STATE` dang bi mutate truc tiep trong router.
- Backend session chua cap `team_id` trusted cho frontend.
- Chua co idempotency theo `team_id + session_id + question_id`.
- Replay co the tiep tuc cong XP va tang `submitted_count`.
- Shared storage hien danh dau completed theo `correct=true`, chua dung quy tac "submit thanh cong la completed" cua Live Battle.
- Du lieu demo phai giu invariant:
  - tong `distribution` bang `submitted_count`
  - `submitted_count` khong lon hon `joined_count`
  - replay khong lam thay doi hai gia tri nay
- Chua validate ky `room_code` trong request payload mot cach ro rang.
- `parse_team_answer` dang bat buoc reasoning toi thieu 20 ky tu cho moi cau hoi.
- Chua co cau hinh theo tung cau hoi de phan biet cau trac nghiem thuong va cau can lap luan.
- Chua test het:
  - invalid JSON
  - JSON hop le nhung khong phai object (`[]`, `null`, string)
  - missing `option_id`
  - room code sai
  - question id sai
  - session id sai
  - cau khong yeu cau reasoning voi reasoning rong
  - cau yeu cau reasoning nhung reasoning qua ngan
  - reasoning hop le do dai nhung sai logic
  - submit lan dau va replay cung team/session/question
  - submit sai van duoc danh dau completed
  - replay dung khong tu xoa recovery da tao tu lan submit dau
  - progress sau submit dung/sai

## 6.4 Process Gap

- Chua co execution checklist rieng cho `live_battle`.
- Chua co shared change request template cho future migration sang JSON runtime.

## 7. Ke Hoach Thuc Thi Theo Pha

## Phase 1 - Dong Bo Tai Lieu

Muc tieu:

- Lam cho `docs/features/live-battle.md` phan anh dung implementation hien tai.

Cong viec:

- Cap nhat file owned doc:
  - endpoint examples
  - student path
  - instructor path
  - limitation local/mock
  - test status
- Xoa hoac sua phan `Shared Integration Request` vi da khong con dung.
- Ghi ro file CSS/frontend file dang su dung that.

Deliverable:

- `vincourse/docs/features/live-battle.md` moi, dung voi code.

Definition of done:

- Doc doc xong co the biet chinh xac feature da lam duoc gi, mock gi, va khong bi nham ve integration status.

## Phase 2 - Frontend Cleanup Va UI Polish

Muc tieu:

- Don feature folder sach, de maintain, va dung style guide.

Cong viec:

- Xac nhan `styles.css` hay `live-battle.css` la file duoc dung that.
- Neu `live-battle.css` la file cu:
  - xoa file hoac ngung duy tri
  - dam bao chi con mot nguon style cho feature
- Chuan hoa lai copy va visual state:
  - loading
  - join error
  - submit error
  - submitted lock state
  - replay/reset
  - instructor stage labels
- Kiem tra responsive cho:
  - student join card
  - answer grid
  - right rail
  - instructor monitor

Deliverable:

- Feature folder frontend gon, ro, khong duplicate CSS.
- UI state dong bo va de demo.

Definition of done:

- Nguoi moi vao project co the doc feature folder va khong bi roi vi 2 file CSS song song.

## Phase 3 - Student Flow Hoan Thien

Muc tieu:

- Lam student flow thanh demo path chinh, on dinh va de quay demo.

Cong viec:

- Join room:
  - validate room code ro rang
  - copy loi ngan gon
- Waiting room:
  - hien team assignment
  - hien local participants mock
- Answering:
  - bat buoc chon option
  - doc `requires_reasoning` va `min_reasoning_length` tu session payload
  - neu cau hoi yeu cau reasoning:
    - hien textarea
    - hien so ky tu toi thieu
    - chi cho submit khi reasoning du do dai
  - neu cau hoi khong yeu cau reasoning:
    - reasoning co the de trong
    - cho submit khi da chon option
  - confidence 1-5 la du lieu tu danh gia, chua dung de tinh diem trong MVP
  - bo copy `calibration 20 diem` neu backend chua cham confidence
- Submit:
  - disable nut khi invalid
  - disable double submit
  - hien loading/submitted lock state
  - doc va gui `team_id` do backend session cap
  - khong cho nguoi dung sua hoac frontend tu sinh `team_id`
- Result:
  - map mau sac theo `GameResult.status`
  - hien feedback
  - hien XP
  - hien mastery delta
  - hien evidence
  - hien next action
- Replay:
  - reset lai dung state demo
  - hien ro replay chi de thu lai/nhan feedback, khong cong them XP
  - khi backend tra `payload.replay=true`, hien XP nhan them la `0`

Deliverable:

- Student path chay thong suot tu `Open mode` den `Result panel`.

Definition of done:

- Demo student flow khong can thao tac workaround.

## Phase 4 - Instructor Mock Flow Hoan Thien

Muc tieu:

- Giu instructor la local mock, nhung trinh bay ro, co logic, va demo duoc.

Cong viec:

- Setup:
  - course
  - mode
  - timer
- Lobby:
  - room code
  - joined count
  - team ready list
- Monitor:
  - answer distribution
  - misconception stream
  - ranking mock
- Lock:
  - khoa dap an
- Reveal:
  - hien dap an dung va giai thich
- Summary:
  - tong ket misconception va team outcome
- Badge/label:
  - luon hien local/mock state, tranh impression la realtime that

Deliverable:

- Instructor flow day du de phuc vu thuyet trinh/demo.

Definition of done:

- Giang vien co the tu thao tac tu `Setup` den `Summary` ma khong can backend moi.

## Phase 5 - Backend Validation Va Test Hardening

Muc tieu:

- Bien router hien tai thanh mot demo backend on dinh, co error behavior ro rang.

Cong viec:

- Review `parse_team_answer`
- Backend session cap `team_id` va `team_name` trusted cho frontend.
- Them va validate `team_id` de moi browser demo dai dien cho mot team.
- Them cau hinh trusted theo tung cau hoi:
  - `requires_reasoning`
  - `min_reasoning_length`
- Tra hai field nay trong `GameSession.payload` de frontend render dung.
- Them validation cho:
  - JSON answer structure
  - `option_id`
  - `reasoning` theo cau hinh cua cau hoi
  - `room_code` neu duoc gui trong payload
  - `session_id`
  - `question_id`
- Them idempotency key:
  - `team_id + session_id + question_id`
- Lan submit dau:
  - cham ket qua binh thuong
  - trao XP theo rule: `mastered=140`, `partial=70`, `misconception=20`
  - danh dau `mode_completed=true`
  - tang `submitted_count` mot lan
- Replay:
  - van cham va tra feedback moi
  - `xp=0`
  - `mastery_delta=0`
  - `payload.replay=true`
  - khong tang `submitted_count`
  - khong tu xoa recovery da tao tu lan submit dau
- Confidence:
  - van validate trong khoang `1-5`
  - chua dung de tinh XP hoac `GameStatus` trong MVP
- Giu logic grading:
  - cau yeu cau reasoning:
    - `B` + reasoning noi duoc scale + gradient -> `mastered`
    - `B` + reasoning yeu -> `partial`
  - cau khong yeu cau reasoning:
    - cham theo option, khong tu choi vi reasoning rong
  - option khac -> `misconception`
- Bo sung test:
  - room code sai
  - session id sai
  - question id sai
  - option invalid
  - invalid JSON
  - JSON hop le nhung sai kieu (`[]`, `null`, string)
  - cau khong yeu cau reasoning submit thanh cong khi reasoning rong
  - cau yeu cau reasoning bi tu choi khi reasoning qua ngan
  - cau yeu cau reasoning submit thanh cong khi reasoning du do dai
  - reasoning dung do dai nhung khong dat keyword
  - submit lan dau co XP va `mode_completed=true`
  - submit sai van co `mode_completed=true` va tao recovery
  - replay cung team/session/question co `xp=0`, `mastery_delta=0`
  - replay khong tang `submitted_count`
  - replay dung khong xoa recovery da tao tu lan submit sai dau tien
  - tong distribution bang `submitted_count`
  - submit dung -> `/api/progress` co `live_battle` trong `completed_modes`
  - submit sai -> `/api/progress` van co `live_battle` trong `completed_modes` va `recovery_queue_size` tang

Deliverable:

- `test_router.py` cover du gap quan trong.

Definition of done:

- Feature backend co behavior xac dinh ro cho input dung va sai.

## Phase 6 - Verification Va Handover

Muc tieu:

- Chot feature o trang thai san sang merge/demo.

Cong viec:

- Chay:

```text
cd vincourse/apps/api
python -m pytest -q
```

- Chay:

```text
cd vincourse/apps/web
npm run typecheck
npm run build
```

- Manual verify:
  - vao mode `live_battle`
  - join dung ma phong
  - submit cau trac nghiem khong yeu cau reasoning
  - xac nhan cau yeu cau reasoning bi chan khi reasoning qua ngan
  - submit dap an dung + reasoning manh
  - submit dap an dung + reasoning yeu
  - submit dap an sai
  - xac nhan ca dap an dung va sai deu danh dau mode completed sau submit thanh cong
  - xac nhan `/api/progress` co `live_battle` sau ca submit dung va sai
  - replay cung cau va xac nhan XP/mastery bang 0
  - xac nhan replay khong tang submitted count
  - xac nhan replay dung khong tu xoa recovery cua lan submit sai dau
  - xem state instructor
  - xem state retry va replay

Deliverable:

- Feature san sang demo.
- Doc feature cap nhat.

Definition of done:

- Team co the demo `live_battle` ma khong can giai thich "do branch khac" hay "doc code moi hieu".

## 8. Shared Change Requests

Feature owner khong tu sua shared files. Cac thay doi bat buoc hoac de danh cho pha sau deu phai duoc chuyen cho integration/base owner.

### 8.0 Shared Change Bat Buoc Cho Completion

Day la blocker can integration/base owner xu ly de Live Battle dat dung rule da chot:

```text
Shared change request:
- Why: Live Battle duoc tinh completed khi submit thanh cong, ke ca dap an sai.
- Field/API needed: doc `GameResult.payload.mode_completed`, default false.
- Affected feature: live_battle; cac mode khac khong doi neu khong gui field nay.
- Proposed default: false.
- Storage behavior: neu `mode_completed=true`, them mode vao completed_modes ma khong phu thuoc `correct`.
```

Feature owner khong tu sua `apps/api/app/storage/**`. Neu shared change nay chua merge, completion persistence van la blocker va feature chua duoc xem la hoan thanh hoan toan.

### 8.1 Ly Do

`live_battle` la feature co room state ro rang nhat:

- `joined_count`
- `submitted_count`
- `distribution`
- team answer state

Neu tiep tuc dung `ROOM_STATE` global trong router:

- kho reset data on dinh
- kho mo rong sang nhieu room
- kho tong hop demo state giua cac request

### 8.2 Muc Tieu Shared Change

Di chuyen live room runtime state sang huong duoc mo ta trong `JSON_DATABASE_PLAN.md`:

- seed data trong:

```text
apps/api/data/seeds/live_battle.json
```

- runtime data trong:

```text
apps/api/data/db.runtime.json
```

- storage helper doc/ghi qua:

```text
apps/api/app/storage/json_db.py
```

### 8.3 Shared Change Request Mau

```text
Feature: Live Battle
Can sua file: apps/api/app/storage/**, apps/api/data/**
Ly do: can room runtime state on dinh hon ROOM_STATE in-memory
Patch nho nhat:
- them seed live_room demo
- them helper read/update submitted_count va distribution
- router live_battle goi storage helper thay vi mutate ROOM_STATE
Mode bi anh huong:
- live_battle
- co the tai su dung cho boss_battle sau nay
```

## 9. Risk Va Cach Giam Rui Ro

## 9.1 Rui Ro Ve Scope

Rui ro:

- Bi cuon vao realtime/WebSocket.

Giam rui ro:

- Giu ro rang phase nay la local mock.
- Khong mo rong ngoai docs va ownership.

## 9.2 Rui Ro Ve Conflict

Rui ro:

- Sua file shared de "cho nhanh".

Giam rui ro:

- Chi sua feature folder va doc feature.
- Shared change tach rieng.

## 9.3 Rui Ro Ve Demo

Rui ro:

- UI trong doc noi mot dang, code chay mot neo.

Giam rui ro:

- Phase 1 la dong bo docs truoc.

## 9.4 Rui Ro Ve Data

Rui ro:

- `ROOM_STATE` mutate gay ket qua demo kho du doan.

Giam rui ro:

- Giu mot room demo duy nhat.
- Reset state ro rang khi replay.
- Chuan bi migration plan sang JSON runtime.

## 10. Checklist Ngan Cho Owner

- Doc lai `docs/features/live-battle.md`
- Confirm file CSS duoc dung that
- Don duplicate CSS neu co
- Polish student flow
- Polish instructor flow
- Them `team_id` on dinh: mot browser dai dien mot team
- Backend session cap `team_id`/`team_name`; frontend khong tu sinh
- Danh dau completed ngay sau submit thanh cong, ke ca dap an sai
- Tao shared change request cho `payload.mode_completed`
- Chan cong XP/mastery va submitted count khi replay
- Chot XP: mastered 140, partial 70, misconception 20, replay 0
- Confidence chi thu thap du lieu; bo copy calibration 20 diem
- Replay dung khong tu xoa recovery; sua recovery trong Error Dungeon
- Them `requires_reasoning` va `min_reasoning_length` vao session payload
- Sua validation reasoning o ca frontend va backend
- Them test cho cau co/khong co yeu cau reasoning
- Them test first submission/replay/completion
- Them test `/api/progress` sau submit dung va sai
- Bo sung backend validation tests
- Chay backend tests
- Chay frontend typecheck/build
- Manual demo end-to-end

## 11. Ket Qua Mong Doi Sau Khi Xong

Sau khi hoan thanh plan nay, `live_battle` se dat muc:

- Demo duoc ngay trong app chung.
- Giu dung team contract.
- Trinh bay ro local/mock limitation.
- Khong tao them conflict shared file.
- San sang cho phase sau:
  - JSON runtime room state
  - admin/instructor data that
  - realtime sync neu team con thoi gian
