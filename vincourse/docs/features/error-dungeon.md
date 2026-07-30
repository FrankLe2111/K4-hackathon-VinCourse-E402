# Error Dungeon

Owner: Nguyen Duc Hung

## Goal

Mode bien loi sai cu thanh recovery mission. Nguoi hoc phai xem source, giai thich lai, lam cau tuong tu va transfer sang context moi.

## Demo Path

```text
Open Error Dungeon
  -> load one unresolved misconception
  -> review source
  -> explain why old answer was wrong
  -> answer similar/transfer
  -> submit
  -> misconception resolved
```

## Allowed Folders

Allowed folders:

- `vincourse/apps/web/src/features/error-dungeon/**`
- `vincourse/apps/api/app/features/error_dungeon/**`

## Endpoints

Endpoint:

```text
GET  /api/modes/error_dungeon/session
POST /api/modes/error_dungeon/submit
```

## Suggested Session Payload

```json
{
  "misconception_id": "more_epochs_fix_scaling",
  "step": "explain",
  "steps": ["review", "explain", "similar", "transfer", "confirm"],
  "source_summary": "Feature scale can make gradient descent unstable.",
  "old_wrong_answer": "Increase epochs"
}
```

## GameResult Notes

- Resolved: `mastered`, `recovery_created=false`, XP recovery bonus.
- Still wrong: `misconception`, `recovery_created=true`.
- Too vague: `needs_clarification`.

## What Can Be Mocked

- Pulling real history from database.
- Long-term resolved state.

## What Should Feel Real

- Misconception text.
- Step progression.
- Source evidence.
- Resolution result.
