# Live Class Battle

Owner: Ngo Minh Phuoc

## Goal

Mode thi dau truc tiep theo lop/team. Trong hackathon co the mock room state, nhung UI phai cho thay flow live battle ro rang.

## Demo Path

```text
Open Live Battle
  -> join room
  -> see team challenge
  -> select answer and reasoning
  -> submit team answer
  -> show class distribution/result
```

## Allowed Folders

Allowed folders:

- `vincourse/apps/web/src/features/live-battle/**`
- `vincourse/apps/api/app/features/live_battle/**`

## Endpoints

Endpoint:

```text
GET  /api/modes/live_battle/session
POST /api/modes/live_battle/submit
```

## Suggested Session Payload

```json
{
  "room_code": "VINC-24",
  "team": "Team Gradient",
  "joined_count": 18,
  "submitted_count": 9,
  "phase": "answering",
  "options": [
    { "id": "A", "text": "Increase epochs" },
    { "id": "B", "text": "Scale the features" }
  ],
  "distribution": {
    "A": 4,
    "B": 11,
    "C": 2,
    "D": 1
  }
}
```

## GameResult Notes

- Correct team answer + good reasoning: `mastered`, collaborative XP.
- Correct option but weak reasoning: `partial`.
- Wrong team answer: `misconception`, recovery suggestion.

## What Can Be Mocked

- Realtime WebSocket.
- Multi-user sync.
- Instructor controls.

## What Should Feel Real

- Room code.
- Team state.
- Submitted count.
- Distribution/result reveal.
