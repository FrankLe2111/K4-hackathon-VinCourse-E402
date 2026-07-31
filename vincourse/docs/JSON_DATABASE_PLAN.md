# JSON Database Plan

Tai lieu nay la ke hoach chuyen storage hackathon tu in-memory/mock rairac sang JSON database co kiem soat.

Muc tieu:

- Van khong dung SQL.
- Van tranh conflict khi 5 nguoi cung lam feature.
- App runtime van nhin thay mot database logic chung.
- Moi thao tac ghi di theo luong `Frontend -> FastAPI -> storage -> JSON`.
- AI chi tra draft data cho FastAPI validate, khong tu ghi truc tiep vao file JSON.

## 1. Review Trang Thai Hien Tai

Hien tai data dang nam o nhieu cho:

```text
apps/api/app/storage/memory.py
  PROGRESS
  ATTEMPTS
  RECOVERY_QUEUE
  LIVE_ROOMS

apps/api/app/features/daily_recall/router.py
  MOCK_DAILY_RECALL_QUEUE

apps/api/app/features/error_dungeon/router.py
  MISCONCEPTION_BANK
  DEFAULT_MISCONCEPTION

apps/api/app/features/boss_battle/router.py
  teams/session payload hard-code

apps/api/app/features/live_battle/router.py
  ROOM_STATE
  hard-code question/options

apps/api/app/features/story_quest/router.py
  ai_odyssey_question_bank_vi.md parser

data/vlearn-pack/lab-arena/*.json
  Lab Arena challenge seed data
```

Ket luan:

- Backend da co FastAPI contract tot.
- Frontend da goi FastAPI qua `apps/web/src/api/modes.ts`.
- Van chua co storage layer JSON chinh thuc.
- Feature data dang rairac trong router, kho review va kho reset demo.
- Runtime data mat khi restart vi `memory.py` dang la in-memory.

## 2. Kien Truc Muc Tieu

Dung hai loai JSON:

```text
Seed DB
  Du lieu co dinh, commit duoc, chia theo feature de tranh conflict.

Runtime DB
  Du lieu phat sinh khi app chay, local-only, khong commit.
```

Folder de xuat:

```text
vincourse/apps/api/data/
  db.base.json
  db.runtime.example.json
  db.runtime.json          # local-only, gitignored
  seeds/
    story_quest.json
    daily_recall.json
    error_dungeon.json
    lab_arena.json
    boss_battle.json
    live_battle.json
    ai_generated.example.json
```

Khi FastAPI chay:

```text
load db.base.json
  + merge seeds/*.json
  + merge db.runtime.json
  = app_db
```

Voi app, day van la mot DB chung:

```json
{
  "users": [],
  "courses": [],
  "concepts": [],
  "evidence": [],
  "challenges": [],
  "misconceptions": [],
  "live_rooms": [],
  "attempts": [],
  "progress": [],
  "recovery_queue": [],
  "ai_drafts": []
}
```

Nhung voi team, data duoc chia theo ownership de tranh conflict.

## 3. Luong Doc Va Ghi Bat Buoc

Dung luong nay:

```text
React component
  -> shared API client
  -> FastAPI router/service
  -> app.storage.json_db
  -> JSON file
```

Khong dung cac luong nay:

```text
React component -> db.json
React component -> seed json
AI SDK/client -> db.json
AI Agent -> sua truc tiep data/seeds/*.json trong luc app chay
Feature router -> OpenAI SDK -> ghi file
```

Quyen ghi:

```text
Frontend:
  Chi goi HTTP API.

Feature router/service:
  Duoc goi storage functions.

AI module:
  Chi tra structured output cho router/service.
  Khong doc/ghi file JSON.

Storage layer:
  Noi duy nhat doc/ghi JSON runtime.

Integration owner:
  Duoc migrate seed data khi can.
```

## 4. File Nao Commit, File Nao Khong Commit

Commit:

```text
data/db.base.json
data/db.runtime.example.json
data/seeds/*.json
docs/*
storage source code
tests
```

Khong commit:

```text
data/db.runtime.json
data/db.runtime.tmp
data/backups/*
__pycache__/
*.tsbuildinfo
```

Cap nhat `.gitignore`:

```gitignore
vincourse/apps/api/data/db.runtime.json
vincourse/apps/api/data/db.runtime.tmp
vincourse/apps/api/data/backups/
```

## 5. Schema De Xuat Cho DB Tong

`db.base.json`:

```json
{
  "users": [
    {
      "id": "demo-user",
      "name": "Demo Learner"
    }
  ],
  "courses": [
    {
      "id": "ml-foundations",
      "title": "Machine Learning Foundations"
    }
  ],
  "concepts": [],
  "evidence": [],
  "challenges": [],
  "misconceptions": [],
  "live_rooms": []
}
```

`db.runtime.example.json`:

```json
{
  "progress": [
    {
      "user_id": "demo-user",
      "xp": 0,
      "completed_modes": [],
      "mastery": {}
    }
  ],
  "attempts": [],
  "recovery_queue": [],
  "ai_drafts": []
}
```

Feature seed example:

```json
{
  "challenges": [
    {
      "id": "daily-q1",
      "mode": "daily_recall",
      "course_id": "ml-foundations",
      "title": "Daily Recall 1",
      "prompt": "Question text",
      "evidence_ids": ["DAY4-SLIDE-05"],
      "answer": {
        "type": "multiple_choice",
        "correct": "A",
        "keywords": []
      },
      "payload": {
        "options": [
          { "id": "A", "text": "Correct answer" },
          { "id": "B", "text": "Distractor" }
        ],
        "due_reason": "review"
      }
    }
  ]
}
```

## 6. Storage API De Xuat

Tao file:

```text
apps/api/app/storage/json_db.py
```

Public functions:

```python
def load_app_db() -> dict:
    """Read base + seeds + runtime and return one logical DB."""

def read_runtime() -> dict:
    """Read runtime DB only."""

def write_runtime(runtime: dict) -> None:
    """Atomic write runtime DB."""

def update_runtime(mutator) -> object:
    """Lock, read runtime, mutate, atomic write, return mutator result."""

def list_challenges(mode: str, course_id: str = "ml-foundations") -> list[dict]:
    """Read merged challenges for a mode."""

def get_challenge(challenge_id: str) -> dict | None:
    """Read one challenge from merged DB."""

def record_attempt(user_id: str, request: dict, result: GameResult) -> GameResult:
    """Append attempt and update progress/recovery queue in runtime DB."""

def get_progress(user_id: str) -> ProgressSummary:
    """Read progress from runtime DB."""

def reset_user(user_id: str) -> ProgressSummary:
    """Reset one user's runtime progress and recovery queue."""
```

Implementation rules:

- Dung `threading.Lock`.
- Dung atomic write: write `.tmp`, sau do `os.replace`.
- Validate IDs truoc khi ghi.
- Convert enum bang `model_dump(mode="json")`.
- Khong ghi seed file tu runtime API.

## 7. API Endpoints Cho Admin/AI Generated Data

Neu co AI sinh cau hoi, dung endpoints admin:

```text
POST /api/admin/ai/generate-questions
GET  /api/admin/ai/drafts
POST /api/admin/ai/drafts/{draft_id}/approve
POST /api/admin/ai/drafts/{draft_id}/reject
```

Flow:

```text
Admin UI
  -> POST /api/admin/ai/generate-questions
  -> FastAPI lay evidence tu DB
  -> FastAPI goi app.ai generator
  -> FastAPI validate output
  -> FastAPI ghi ai_drafts vao db.runtime.json
  -> Admin approve
  -> FastAPI chuyen draft thanh challenge runtime/published
```

AI module khong duoc tu ghi file:

```python
# Dung
draft = generate_questions(evidence)
validated = QuestionDraft.model_validate(draft)
storage.add_ai_draft(validated)

# Khong dung
generate_questions(...).write_to_json("data/seeds/story_quest.json")
```

## 8. Migration Plan Theo Phase

### Phase 0 - Freeze Rules

- Team tao branch moi tu `develop`.
- Khong sua file shared neu khong co approval.
- Cap nhat docs va `.gitignore`.

### Phase 1 - Tao Storage Layer

Them:

```text
apps/api/app/storage/json_db.py
apps/api/data/db.base.json
apps/api/data/db.runtime.example.json
apps/api/data/seeds/*.json
```

Chua can migrate tat ca feature ngay.

### Phase 2 - Doi Progress Truoc

Thay `memory.py` hoac cho `memory.py` delegate sang `json_db.py`:

```text
get_progress
reset_progress
record_result
get_user_recovery_queue
```

Day la buoc quan trong nhat vi moi feature dang ghi result qua `record_result`.

### Phase 3 - Migrate Seed Theo Feature

Lam tung feature, moi PR mot feature:

1. Chuyen data hard-code sang `data/seeds/<feature>.json`.
2. Router doc challenge tu `json_db.list_challenges(mode)`.
3. Submit van tra `GameResult`.
4. Test endpoint `/session` va `/submit`.

Thu tu de xuat:

```text
daily_recall
error_dungeon
live_battle
boss_battle
lab_arena
story_quest
```

Lab Arena va Story Quest phuc tap hon vi dang co file source rieng; de sau.

### Phase 4 - Admin/AI Drafts

Chi lam neu con thoi gian:

- Tao admin router.
- Tao `ai_drafts` runtime.
- Them approve/reject.

## 9. Huong Dan Cho Tung Feature

### Daily Recall

Doc:

```python
questions = json_db.list_challenges("daily_recall")
```

Ghi:

```python
return json_db.record_attempt(request.user_id, request.model_dump(), result)
```

Khong giu `MOCK_DAILY_RECALL_QUEUE` trong router sau migration.

### Error Dungeon

Doc:

```python
queue = json_db.get_recovery_queue(user_id)
misconception = json_db.get_misconception(misconception_id)
```

Ghi:

```python
json_db.record_attempt(...)
```

Khi correct:

```python
record_attempt(... result with mode=error_dungeon, correct=True)
```

Storage layer se remove resolved item.

### Lab Arena

Seed:

```text
data/seeds/lab_arena.json
```

Hoac tam thoi giu JSON chi tiet trong:

```text
data/vlearn-pack/lab-arena/*.json
```

Va them index record vao seed:

```json
{
  "lab_sources": [
    {
      "id": "tool-character-count",
      "path": "data/vlearn-pack/lab-arena/tool-character-count.json"
    }
  ]
}
```

Router van phai doc qua storage helper, khong tu glob file trong feature router ve lau dai.

### Story Quest

Tam thoi co the giu markdown question bank, nhung migration tot hon la:

```text
scripts/convert_story_bank.py
  ai_odyssey_question_bank_vi.md -> data/seeds/story_quest.json
```

Runtime router:

```python
zones = json_db.get_story_zones()
```

Khong parse markdown moi request sau khi migrate.

### Boss Battle

Chuyen hard-code teams/rules sang seed:

```json
{
  "boss_battles": [
    {
      "id": "broken-model-boss",
      "attack_threshold": 80,
      "teams": []
    }
  ]
}
```

Runtime submit ghi attempt/progress qua storage.

### Live Battle

Seed:

```json
{
  "live_rooms": [
    {
      "room_code": "VINC-24",
      "session_id": "live-battle-vinc-24",
      "question_id": "live-feature-scaling-01"
    }
  ]
}
```

Runtime:

```text
submitted_count
team answers
distribution updates
```

Ghi vao `db.runtime.json`, khong mutate global `ROOM_STATE`.

## 10. Checklist Cho PR Database

- FE chi goi API trong `apps/web/src/api`.
- BE router goi storage layer, khong ghi file truc tiep.
- AI module khong ghi JSON file.
- Runtime file khong commit.
- Seed file chi sua theo ownership.
- Test `GET /session` va `POST /submit` cua feature.
- Test `GET /progress` sau submit.
- `rg "open\\(|write_text|json.dump|json.dumps" apps/api/app/features` khong thay ghi file truc tiep trong feature router.

