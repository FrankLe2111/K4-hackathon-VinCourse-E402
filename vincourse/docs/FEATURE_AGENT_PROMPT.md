# Feature Agent Prompt Template

Copy this prompt when asking an AI coding agent to implement one feature.

```text
You are implementing only <feature-name> in the VinCourse team scaffold.

You may edit only:
- vincourse/apps/web/src/features/<feature-name>/**
- vincourse/apps/api/app/features/<feature_name>/**
- vincourse/docs/features/<feature-name>.md

Use the shared GameResult contract from vincourse/docs/TEAM_CODEBASE_PLAN.md.
Do not edit app shell, shared API client, shared types, AI client, storage, or another feature.
Frontend must call FastAPI only. Do not call OpenAI from React.
If you need a shared contract change, stop and describe the proposed change instead of modifying shared files.
Return the endpoint request/response examples you used.
```

