# VinCourse Team Codebase Plan

This folder is the clean codebase for team development. It is intentionally small and modular so each teammate can plug a feature into the shared app without editing the same files.

## Architecture

```text
apps/web React TypeScript
  -> apps/api FastAPI
  -> app/ai internal AI module
  -> OpenAI
```

Backend and AI run in the same FastAPI process for the hackathon, but AI code stays under `apps/api/app/ai`.

## Shared Contract

Every mode exposes:

```text
GET  /api/modes/{mode}/session
POST /api/modes/{mode}/submit
```

Every submit returns `GameResult`:

```json
{
  "mode": "story",
  "correct": false,
  "status": "misconception",
  "feedback": "Short learner-facing feedback.",
  "evidence_ids": ["T-DEMO-001"],
  "misconception_id": "missing_core_concept",
  "xp": 0,
  "mastery_delta": 0,
  "recovery_created": true,
  "next_action": "Open Error Dungeon."
}
```

## Ownership

| Person | Feature | Frontend folder | Backend folder |
|---|---|---|---|
| ThanhToan | Story Quest | `apps/web/src/features/story-quest` | `apps/api/app/features/story_quest` |
| Nguyen Duc Hung | Daily Recall | `apps/web/src/features/daily-recall` | `apps/api/app/features/daily_recall` |
| Nguyen Duc Hung | Error Dungeon | `apps/web/src/features/error-dungeon` | `apps/api/app/features/error_dungeon` |
| Trung Quan | Boss Battle | `apps/web/src/features/boss-battle` | `apps/api/app/features/boss_battle` |
| Ngo Minh Phuoc | Live Class Battle | `apps/web/src/features/live-battle` | `apps/api/app/features/live_battle` |
| Huyen | Lab Arena | `apps/web/src/features/lab-arena` | `apps/api/app/features/lab_arena` |

## No-Conflict Rules

- Do not create another app shell.
- Do not create another API client.
- Do not call OpenAI from frontend.
- Do not change `GameResult` without team agreement.
- Do not edit another teammate's feature folder.
- Shared files are owned by the integration/base owner.

## Base Owner Files

Only the integration/base owner should edit:

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

## Required Team Docs

Before implementing a feature, read:

```text
docs/DEVELOPMENT_GUIDE.md
docs/UI_STYLE_GUIDE.md
docs/API_CONTRACT.md
docs/AI_MODULE_GUIDE.md
docs/FEATURE_WORKFLOW.md
docs/AGENT_WORKFLOW.md
docs/features/<your-feature>.md
```

The old UI prototype in `codebase/static/` is a style reference only. Do not continue building new team work inside `codebase/`.
