# Integration Checklist

Tai lieu nay danh cho base/integration owner khi ghep feature cua cac thanh vien.

## 1. Truoc Khi Merge Feature

Kiem tra:

- Feature chi sua folder ownership.
- Feature doc da cap nhat.
- Endpoint `/session` tra `GameSession`.
- Endpoint `/submit` tra `GameResult`.
- UI khong goi OpenAI.
- UI dung shared API client.
- UI co loading/error/result.
- Khong co API key trong commit.

## 2. Kiem Tra Backend

Chay:

```powershell
cd vincourse/apps/api
.\.venv\Scripts\python -m pytest tests
```

Neu feature co test rieng, chay them test do.

Manual check:

```text
GET /api/health
GET /api/modes
GET /api/progress
GET /api/modes/<mode>/session
POST /api/modes/<mode>/submit
```

## 3. Kiem Tra Frontend

Chay:

```powershell
cd vincourse/apps/web
npm run typecheck
npm run build
```

Manual check:

- App load duoc.
- Sidebar hien mode.
- Click mode khong crash.
- Submit co result.
- Error backend duoc hien.
- Mobile layout khong vo nang.

## 4. Kiem Tra Contract

Moi `GameResult` phai co:

```text
mode
correct
status
feedback
evidence_ids
misconception_id
xp
mastery_delta
recovery_created
next_action
```

Khong merge neu response chi dung cho mot mode va lam FE phai if/else qua nhieu.

## 5. Demo Path Tong Hop

Demo nen chay duoc:

```text
Story Quest
  -> submit sai
  -> recovery_created true
  -> Error Dungeon
  -> Lab Arena
  -> Boss Battle
```

Live Battle co the la mock neu khong kip realtime, nhung UI phai ghi ro trang thai demo/local.

## 6. Neu Conflict

Xu ly theo thu tu:

1. Giu shared contract.
2. Giu app shell cua base owner.
3. Feature owner tu rebase trong folder cua minh.
4. Khong copy paste feature thanh app rieng de ne conflict.

