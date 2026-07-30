# Lab Arena

Owner: Huyen

## Goal

Mode thuc hanh code de chung minh nguoi hoc ap dung duoc concept vao mot task nho.

## Demo Path

```text
Open Lab Arena
  -> load code challenge
  -> edit answer/code
  -> run visible tests
  -> submit
  -> receive application evidence
```

## Allowed Folders

Allowed folders:

- `vincourse/apps/web/src/features/lab-arena/**`
- `vincourse/apps/api/app/features/lab_arena/**`

## Endpoints

Endpoint:

```text
GET  /api/modes/lab_arena/session
POST /api/modes/lab_arena/submit
```

## Suggested Session Payload

```json
{
  "lab_id": "standardize-features",
  "language": "python",
  "starter_code": "def standardize(X): ...",
  "visible_tests": [
    "mean is near zero",
    "std is near one",
    "shape is preserved"
  ],
  "concept_ids": ["feature-scaling", "gradient-descent"]
}
```

## GameResult Notes

- Tests pass: `mastered`, XP application bonus.
- Tests fail: `partial` or `misconception`, depending on error.
- Dangerous/off-topic code: `out_of_scope`.

## What Can Be Mocked

- Real sandbox execution.
- Hidden tests.

## What Should Feel Real

- Code/task panel.
- Visible tests.
- Submit result.
- Evidence earned.
