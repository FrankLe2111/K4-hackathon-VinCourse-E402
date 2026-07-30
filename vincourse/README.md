# VinCourse Team Codebase

This is the clean team scaffold for the hackathon build.

```text
apps/web  -> React + TypeScript frontend
apps/api  -> FastAPI backend
app/ai    -> AI module inside FastAPI
```

The old prototype in the repository root can be used as reference, but new team work should happen here.

## Run Backend

```bash
cd vincourse/apps/api
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8000
```

## Run Frontend

```bash
cd vincourse/apps/web
npm install
npm run dev
```

Open <http://127.0.0.1:5173>.

## Team Rule

Each teammate works inside their feature folders only:

```text
apps/web/src/features/<feature-name>/**
apps/api/app/features/<feature_name>/**
docs/features/<feature-name>.md
```

Shared files are owned by the integration/base owner.

