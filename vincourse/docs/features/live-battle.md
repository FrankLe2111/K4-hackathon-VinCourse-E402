# Live Class Battle

Owner: Ngo Minh Phuoc

## Goal

Che do thi dau theo lop/team, gan giong Kahoot nhung cham them reasoning va
confidence calibration. Hackathon dung room state local, khong co WebSocket.

## Demo Path

Student:

```text
Open Live Battle
  -> join room VINC-24
  -> waiting room / team assignment
  -> select option + reasoning + confidence
  -> submit locked team answer
  -> receive mastered / partial / misconception result
  -> wrong answer creates personal recovery
```

Instructor (local mock):

```text
Setup -> Lobby -> Monitor -> Lock -> Reveal -> Summary
```

## Owned Files

- `vincourse/apps/web/src/features/live-battle/index.tsx`
- `vincourse/apps/web/src/features/live-battle/styles.css`
- `vincourse/apps/api/app/features/live_battle/router.py`
- `vincourse/apps/api/app/features/live_battle/test_router.py`
- `vincourse/docs/features/live-battle.md`

Khong sua app shell, shared type, shared API client, storage schema hoac feature
khac.

## Endpoints

```text
GET  /api/modes/live_battle/session
POST /api/modes/live_battle/submit
```

## Session Payload

```json
{
  "mode": "live_battle",
  "session_id": "live-battle-vinc-24",
  "title": "Live Class Battle",
  "prompt": "Mot mo hinh co feature nam trong khoang 0-1 va 1-100.000...",
  "evidence_ids": ["T02-014"],
  "payload": {
    "room_code": "VINC-24",
    "team": "Team Gradient",
    "joined_count": 18,
    "submitted_count": 9,
    "phase": "answering",
    "question_id": "live-feature-scaling-01",
    "options": [
      {"id": "A", "text": "Tang len 10.000 epoch"},
      {"id": "B", "text": "Scale cac feature truoc khi train"},
      {"id": "C", "text": "Tang learning rate"},
      {"id": "D", "text": "Xoa feature co mien nho hon"}
    ],
    "distribution": {"A": 8, "B": 7, "C": 2, "D": 1},
    "scoring": {
      "correctness": 40,
      "explanation": 40,
      "calibration": 20
    },
    "demo": true
  }
}
```

## Submit Request

Contract chung giu nguyen. Team answer duoc serialize vao field `answer`:

```json
{
  "user_id": "demo-user",
  "course_id": "ml-foundations",
  "session_id": "live-battle-vinc-24",
  "question_id": "live-feature-scaling-01",
  "answer": "{\"option_id\":\"B\",\"reasoning\":\"Scale feature giup gradient cap nhat can bang va on dinh hon.\",\"room_code\":\"VINC-24\"}",
  "confidence": 4
}
```

## Result Rules

- Option B + reasoning noi duoc scaling va gradient: `mastered`, `140 XP`.
- Option B + reasoning yeu: `partial`, `70 XP`.
- Option khac: `misconception`, `20 XP`, `recovery_created=true`.
- Reasoning duoi 20 ky tu, option sai format, session/question sai: API tu choi.

## What Is Real

- React loading, error, join validation, answer form va result state.
- FastAPI session payload va submit grading.
- `GameResult` contract, progress recording va recovery queue.
- Backend tests cho session, 3 result branch va invalid reasoning.

## What Is Mocked

- Multi-user sync va WebSocket.
- Countdown, joined/submitted count, class distribution va team ranking.
- Instructor controls chi thay doi local React state.

UI luon hien nhan `Phien live mo phong` de khong trinh bay mock nhu realtime that.

## Shared Integration Request

App shell hien tai chua import feature module nao; `FeatureHost` van render generic
textarea cho tat ca mode. Base owner can them mot integration branch:

```tsx
import { LiveBattleFeature } from "../../features/live-battle";

if (mode === "live_battle") {
  return <LiveBattleFeature onCompleted={onCompleted} />;
}
```

File shared can sua boi base owner:

```text
vincourse/apps/web/src/shared/components/FeatureHost.tsx
```

Feature owner khong tu sua file nay de tranh conflict voi integration work.

## Verification

```text
npm run typecheck                         PASS
npm run build                             PASS
python -m pytest -q ...                   7 PASS
```
