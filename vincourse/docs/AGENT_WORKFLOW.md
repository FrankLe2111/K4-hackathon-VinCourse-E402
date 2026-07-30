# AI Agent Workflow

Tai lieu nay dung khi moi thanh vien dung AI Agent de gen code.

## 1. Ly Do Can Quy Tac

Neu moi nguoi dua prompt mo ho cho AI Agent, agent rat de:

- Sua app shell chung.
- Tao API client rieng.
- Tao response schema rieng.
- Sua feature cua nguoi khac.
- Goi OpenAI tu frontend.
- Tao them mini app.

Vi vay moi prompt phai gioi han folder va contract.

## 2. Prompt Mac Dinh Cho Feature Owner

Copy prompt nay va thay `<feature-name>`:

```text
You are implementing only <feature-name> in the VinCourse team scaffold.

You may edit only:
- vincourse/apps/web/src/features/<feature-name>/**
- vincourse/apps/api/app/features/<feature_name>/**
- vincourse/docs/features/<feature-name>.md

Read these docs first:
- vincourse/docs/TEAM_CODEBASE_PLAN.md
- vincourse/docs/API_CONTRACT.md
- vincourse/docs/UI_STYLE_GUIDE.md
- vincourse/docs/AI_MODULE_GUIDE.md
- vincourse/docs/features/<feature-name>.md

Use the shared GameResult contract.
Frontend must call FastAPI only.
Do not call OpenAI from React.
Do not edit app shell, shared API client, shared types, AI client, storage, or another feature.
If you need a shared contract change, stop and describe the proposed change instead of modifying shared files.
Before finishing, run the relevant checks and update the feature doc.
```

## 3. Prompt Cho UI Feature

```text
Build the UI only inside my feature folder.
Match the existing VinCourse visual style:
- dark green sidebar already exists in app shell
- warm paper background
- warm white cards
- green/lime primary actions
- coral misconception/error state
- mission card + evidence panel + result panel pattern

Do not create a new app shell.
Do not create global CSS unless asked by base owner.
Use the shared API client.
```

## 4. Prompt Cho Backend Feature

```text
Build the backend only inside my feature folder.
Expose:
- GET /api/modes/<mode>/session
- POST /api/modes/<mode>/submit

Return the shared GameResult contract.
Use app.ai.graders if AI grading is needed.
Do not import OpenAI SDK directly.
Do not edit app.schemas unless asked by base owner.
```

## 5. Prompt Cho Base Owner

Chi base owner moi dung prompt nay:

```text
You are the integration/base owner.
You may edit shared app shell, API client, shared types, schemas, storage, and AI module.
Do not edit feature-owned folders unless the feature owner asks.
Preserve backward compatibility with GameResult unless the team explicitly changes it.
After changes, update docs and run backend tests plus frontend typecheck.
```

## 6. Agent Output Bat Buoc

Khi AI Agent lam xong, yeu cau no tra:

```text
Files changed:
Endpoints touched:
Request example:
Response example:
Checks run:
Known limitations:
```

## 7. Dau Hieu Agent Dang Di Sai

Dung agent lai neu no:

- Sua `apps/web/src/app`.
- Sua `apps/web/src/api`.
- Sua `apps/api/app/schemas.py`.
- Tao file `.env` co key that.
- Them fetch OpenAI trong React.
- Tao layout/sidebar moi trong feature.
- Doi `GameResult` khong xin phep.

