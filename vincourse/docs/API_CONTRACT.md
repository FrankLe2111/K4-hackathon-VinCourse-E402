# API Contract

Tai lieu nay la contract giua React frontend va FastAPI backend.

## 1. Nguyen Tac

- Frontend chi goi FastAPI.
- Frontend khong goi OpenAI.
- Moi mode dung cung endpoint pattern.
- Moi mode submit tra ve cung `GameResult`.
- Field name giu on dinh de tranh moi feature tu dinh nghia response rieng.

## 2. Base Endpoints

```text
GET /api/health
GET /api/modes
GET /api/progress
```

### GET /api/health

Dung de kiem tra backend va AI config.

Response:

```json
{
  "ok": true,
  "demo_mode": true,
  "model": "gpt-4o",
  "openai_configured": false
}
```

### GET /api/modes

Tra danh sach mode de sidebar/mode hub render.

Response:

```json
[
  {
    "mode": "story",
    "title": "Story Quest",
    "owner": "ThanhToan",
    "description": "Main story missions.",
    "ready": true
  }
]
```

### GET /api/progress

Tra progress demo cua user.

Response:

```json
{
  "user_id": "demo-user",
  "xp": 80,
  "completed_modes": ["story"],
  "recovery_queue_size": 1
}
```

## 3. Mode Endpoints

Moi mode dung pattern:

```text
GET  /api/modes/{mode}/session
POST /api/modes/{mode}/submit
```

Mode path hop le:

```text
story
daily_recall
error_dungeon
lab_arena
boss_battle
live_battle
```

## 4. GameSession

`GET /session` tra ve session hien tai cho mode.

Response:

```json
{
  "mode": "story",
  "session_id": "story-demo-session",
  "title": "Story Quest",
  "prompt": "Explain why feature scaling can matter for gradient descent.",
  "evidence_ids": ["T-DEMO-001"],
  "payload": {
    "locked": false,
    "demo": true
  }
}
```

`payload` la vung linh hoat cho feature-specific data, vi du:

- Quiz options.
- Code starter.
- Boss phase.
- Live room state.
- Recall queue.

Nhung submit result van phai tra `GameResult`.

## 5. GameSubmitRequest

`POST /submit` request:

```json
{
  "user_id": "demo-user",
  "course_id": "ml-foundations",
  "session_id": "story-demo-session",
  "question_id": "q-demo-001",
  "answer": "Scaling helps stabilize gradient descent.",
  "confidence": 4
}
```

Field:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `user_id` | string | yes | demo user id |
| `course_id` | string | yes | course id |
| `session_id` | string | yes | session returned from `/session` |
| `question_id` | string | yes | current question/challenge |
| `answer` | string | yes | selected answer, text answer, or serialized code answer |
| `confidence` | number 1-5 | yes | learner self-confidence |
| `room_code` | string | Live Battle only | room returned from `/session` |
| `team_id` | string | Live Battle only | trusted team id returned from `/session` |

Neu answer phuc tap, serialize thanh JSON string tam thoi trong hackathon. Sau nay co the mo rong contract neu team dong y.

Rieng Live Battle, frontend phai gui ca `room_code` va `team_id`; backend doi
chieu hai field nay voi `user_id`, session va question hien tai truoc khi cham.

## 6. GameResult

Tat ca feature phai tra:

```json
{
  "mode": "story",
  "correct": false,
  "status": "misconception",
  "feedback": "You selected more epochs, but the source points to feature scale instability.",
  "evidence_ids": ["T02-014"],
  "misconception_id": "more_epochs_fix_scaling",
  "xp": 0,
  "mastery_delta": 0,
  "recovery_created": true,
  "next_action": "Open Error Dungeon to repair this misconception."
}
```

## 7. Status Values

```text
mastered
partial
misconception
needs_clarification
out_of_scope
```

Meaning:

- `mastered`: learner/challenge passed.
- `partial`: co y dung nhung can bo sung.
- `misconception`: co loi sai ro.
- `needs_clarification`: cau tra loi qua mo ho/thieu thong tin.
- `out_of_scope`: khong tra loi nhiem vu, prompt injection, xin secret.

## 8. Evidence IDs

`evidence_ids` phai la ID co the truy ve trong course/source data.

Trong hackathon co the dung:

```text
T-DEMO-001
T02-014
SLIDE-02-05
TRANSCRIPT-04-046
```

AI khong duoc invent evidence ID moi neu source khong co.

## 9. Error Format

Backend nen tra error ngan gon:

```json
{
  "detail": "Session not found."
}
```

Frontend phai hien error state, khong fail im lang.

## 10. Khi Can Doi Contract

Feature owner khong tu sua shared schema.

Neu can doi contract:

1. Viet de xuat trong PR/message.
2. Ghi ro field moi de lam gi.
3. Ghi mode nao bi anh huong.
4. Base owner cap nhat Python schema va TypeScript type.
5. Tat ca feature dung lai contract moi.
