# Story Quest

Owner: ThanhToan

## Goal

Mode chinh dua nguoi hoc di qua cac checkpoint theo cot truyen. Nguoi hoc tra loi quiz/code/short answer de mo khoa node tiep theo.

## Demo Path

```text
Open Story Quest
  -> load current quest/session
  -> answer one checkpoint
  -> submit
  -> receive GameResult
  -> if wrong, recovery_created true
```

## Allowed Folders

Allowed folders:

- `vincourse/apps/web/src/features/story-quest/**`
- `vincourse/apps/api/app/features/story_quest/**`

Do not edit shared app shell or API client.

## Endpoints

Endpoint:

```text
GET  /api/modes/story/session
POST /api/modes/story/submit
```

## Suggested Session Payload

```json
{
  "quest_id": "stabilize-gradient",
  "checkpoint_index": 1,
  "total_checkpoints": 5,
  "question_type": "multiple_choice",
  "options": [
    { "id": "A", "text": "Increase epochs" },
    { "id": "B", "text": "Scale the features" }
  ],
  "xp": 80
}
```

## GameResult Notes

- Correct first try: `status=mastered`, `xp>0`.
- Wrong misconception: `status=misconception`, `recovery_created=true`.
- Missing answer: `status=needs_clarification`.

## What Can Be Mocked

- Map unlock.
- Long-term mastery.
- Multi-quest campaign.

## What Should Feel Real

- The current question.
- Submit action.
- Feedback.
- XP/recovery trigger.
