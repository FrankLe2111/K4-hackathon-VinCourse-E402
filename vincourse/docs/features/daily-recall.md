# Daily Recall

Owner: Nguyen Duc Hung

## Goal

Mode on tap ngan moi ngay dua tren spaced repetition. Nguoi hoc tra loi nhanh va chon do tu tin de cap nhat recall evidence.

## Demo Path

```text
Open Daily Recall
  -> load recall queue
  -> answer due item
  -> submit
  -> show recall result
  -> if wrong/high confidence, push to Error Dungeon
```

## Allowed Folders

Allowed folders:

- `vincourse/apps/web/src/features/daily-recall/**`
- `vincourse/apps/api/app/features/daily_recall/**`

## Endpoints

Endpoint:

```text
GET  /api/modes/daily_recall/session
POST /api/modes/daily_recall/submit
```

## Suggested Session Payload

```json
{
  "queue_size": 4,
  "current_index": 1,
  "due_reason": "last_reviewed_7_days_ago",
  "question_type": "multiple_choice",
  "options": [
    { "id": "A", "text": "Scale the input features" },
    { "id": "B", "text": "Increase epochs only" }
  ]
}
```

## GameResult Notes

- Correct + calibrated confidence: `mastered`, small XP.
- Wrong: `misconception`, `recovery_created=true`.
- Low confidence correct: `partial` or `mastered` with smaller mastery delta, depending on implementation.

## What Can Be Mocked

- Real spaced repetition algorithm.
- Calendar schedule.

## What Should Feel Real

- Queue.
- Confidence.
- Result summary.
- Recovery queue trigger.
