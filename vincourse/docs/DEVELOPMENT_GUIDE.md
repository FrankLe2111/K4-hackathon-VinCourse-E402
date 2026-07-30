# Development Guide

Tai lieu nay huong dan cach chay va phat trien codebase `vincourse/`.

## 1. Cau Truc Chay Ung Dung

Ung dung co 2 process:

```text
React frontend: http://127.0.0.1:5173
FastAPI backend: http://127.0.0.1:8000
```

Luồng request:

```text
User click UI
  -> React feature component
  -> shared API client
  -> FastAPI feature router
  -> feature service
  -> AI module neu can
  -> storage/progress
  -> GameResult
  -> React hien feedback
```

## 2. Setup Backend

Chay trong PowerShell:

```powershell
cd vincourse/apps/api
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8000
```

Backend env:

```env
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o
COURSEQUEST_DEMO_MODE=1
FRONTEND_ORIGIN=http://127.0.0.1:5173
```

Dung `COURSEQUEST_DEMO_MODE=1` khi chua muon goi OpenAI that.

## 3. Setup Frontend

Chay trong PowerShell:

```powershell
cd vincourse/apps/web
npm install
npm run dev
```

Frontend env:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## 4. Lenh Kiem Tra

Backend:

```powershell
cd vincourse/apps/api
.\.venv\Scripts\python -m pytest tests
```

Frontend:

```powershell
cd vincourse/apps/web
npm run typecheck
npm run build
```

Truoc khi bao feature da xong, it nhat phai chay duoc:

- Backend endpoint cua feature.
- Frontend khong loi typecheck.
- Submit feature tra ve `GameResult`.

## 5. Quy Trinh Lam Viec Hang Ngay

1. Pull code moi nhat.
2. Doc `docs/features/<feature>.md` cua minh.
3. Chi sua folder feature cua minh.
4. Neu can sua shared contract, dung lai va bao base owner.
5. Sau khi code xong, cap nhat tai lieu feature cua minh.
6. Chay check toi thieu.
7. Mo PR/merge request voi mo ta endpoint da dung.

## 6. Vung Khong Nen Sua

Feature owner khong nen sua:

```text
apps/web/src/app/**
apps/web/src/api/**
apps/web/src/types/**
apps/web/src/shared/**
apps/api/app/main.py
apps/api/app/core/**
apps/api/app/schemas.py
apps/api/app/ai/**
apps/api/app/storage/**
```

Neu phai sua cac file tren, do la viec cua base/integration owner.

## 7. Dinh Nghia "Feature Done"

Mot feature duoc coi la xong khi:

- Co UI cho flow chinh.
- Co loading state.
- Co error state.
- Co result state.
- Co backend `/session`.
- Co backend `/submit`.
- `/submit` tra dung `GameResult`.
- Neu can AI, feature goi `app/ai`, khong goi OpenAI truc tiep.
- Tai lieu `docs/features/<feature>.md` da cap nhat request/response mau.

