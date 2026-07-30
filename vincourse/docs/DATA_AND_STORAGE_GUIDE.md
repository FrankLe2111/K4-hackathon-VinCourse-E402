# Data And Storage Guide

Trong hackathon, codebase dung in-memory storage de nhanh. Tai lieu nay thong nhat cach cac feature ghi progress/evidence.

## 1. Tam Thoi Dung In-Memory

Storage hien tai nam o:

```text
apps/api/app/storage/memory.py
```

Du lieu demo:

```text
PROGRESS
ATTEMPTS
RECOVERY_QUEUE
LIVE_ROOMS
```

Khong them database that neu chua can. Dieu quan trong la giu API contract on dinh.

## 2. Cac Khai Niem Data Chung

Course:

- Khoa hoc hien tai, vi du `ml-foundations`.

Concept:

- Learning objective, vi du `feature-scaling`.

Question:

- Cau hoi/challenge trong mode.

Attempt:

- Mot lan user submit.

Evidence:

- Bang chung hoc tap: quiz correct, explanation, lab pass, transfer.

Misconception:

- Loi hieu sai can sua.

Progress:

- XP, completed modes, mastery, recovery queue.

## 3. Feature Nen Ghi Gi?

Story Quest:

- Attempt.
- XP.
- Misconception neu sai.
- Unlock/recovery trigger.

Daily Recall:

- Recall attempt.
- Confidence calibration.
- Next review suggestion.

Error Dungeon:

- Misconception resolved.
- Recovery evidence.

Lab Arena:

- Code application evidence.
- Test result.

Boss Battle:

- Transfer mastery evidence.
- Phase completion.

Live Battle:

- Team answer.
- Participation.
- Collaborative reasoning evidence.

## 4. Khi Nao Nang Cap Len Database?

Chi nang cap khi:

- Demo can refresh ma data van con.
- Nhieu user/room can song song.
- Live Battle can room state on dinh.
- Team con du thoi gian sau khi UI/API da xong.

Neu nang cap DB, frontend khong nen doi vi API contract van giu nguyen.

