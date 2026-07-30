# Story Quest

Owner: ThanhToan

## Goal

Mode chính của AI Odyssey. Người học đi qua 10 zone, trả lời 50 checkpoint lấy từ `ai_odyssey_question_bank_vi.md`; sai vẫn được đi tiếp nhưng mỗi zone cần đạt 80% câu đúng để mở khóa zone sau.

## Demo Path

```text
Open Story Quest
  -> load question bank from backend session payload
  -> answer multiple-choice question or fill code blanks
  -> select confidence for multiple-choice question
  -> submit to backend
  -> show feedback
  -> wrong answer is saved to Error Dungeon panel
  -> red recovery badges appear on map/checkpoints
  -> continue through zone
  -> pass zone if correct >= 80%
  -> end-of-zone reward card shows unlock, XP, bonus, review list
```

## Allowed Folders

- `vincourse/apps/web/src/features/story-quest/**`
- `vincourse/apps/api/app/features/story_quest/**`
- `vincourse/docs/features/story-quest.md`

## Endpoints

```text
GET  /api/modes/story/session
POST /api/modes/story/submit
```

## Session Payload

`GET /session` returns the shared `GameSession` contract. `payload` contains:

```json
{
  "zones": [
    {
      "id": "prologue",
      "name": "Mở đầu — Cánh Cổng Tò Mò",
      "questions": [
        {
          "id": "prologue_quiz_01",
          "type": "quiz",
          "concept_id": "ai-vs-automation",
          "xp": 20,
          "context": "Một cánh cổng...",
          "prompt": "Mô tả nào phù hợp nhất?",
          "options": [{ "id": "A", "text": "..." }]
        }
      ]
    }
  ],
  "pass_rate": 0.8
}
```

Hidden answers are not sent to frontend.

## Submit

Multiple-choice answer:

```json
{
  "user_id": "demo-user",
  "course_id": "ml-foundations",
  "session_id": "story-quest-bank",
  "question_id": "prologue_quiz_01",
  "answer": "B",
  "confidence": 5
}
```

Code blanks are serialized as JSON string:

```json
{
  "question_id": "zone6_code_01",
  "answer": "[\"max(x, 0)\"]",
  "confidence": 3
}
```

## GameResult Notes

- Correct: `status=mastered`, XP from bank, `recovery_created=false`.
- Wrong multiple-choice question: `status=misconception`, option-specific feedback, `recovery_created=true`.
- Wrong code: `status=misconception`, `misconception_id=code-logic`.
- Invalid answer: HTTP error with short `detail`.

## Frontend State

Stored in `localStorage` under `vincourse-story-quest`:

- current zone
- unlocked zone
- completed checkpoint IDs
- earned XP
- streak / best streak / bonus XP
- attempts per question
- recovery queue
- perfect zones

## What Is Real

- 10 zones / 50 checkpoints from the Markdown bank.
- Server-side grading.
- No answer leakage in session payload.
- Wrong-answer recovery list.
- 80% zone pass rule.
- Live zone progress bar, locked zone preview, recovery badges.
- Streak bonus every 3 new correct answers and perfect-zone bonus.

## What Is Still Mocked

- Real database persistence.
- Shared Error Dungeon integration across modes.
- XP penalty for hints/attempts.
