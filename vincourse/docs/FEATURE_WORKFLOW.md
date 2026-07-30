# Feature Workflow

Tai lieu nay danh cho tung thanh vien khi phat trien mode rieng.

## 1. Feature Owner Chi Sua Gi?

Moi nguoi chi sua 3 vung:

```text
vincourse/apps/web/src/features/<feature-name>/**
vincourse/apps/api/app/features/<feature_name>/**
vincourse/docs/features/<feature-name>.md
```

Khong sua shared files tru khi base owner yeu cau.

## 2. Feature Phai Cam Vao Dau?

Frontend feature cam vao app shell co san.

Backend feature cam vao route pattern co san:

```text
GET  /api/modes/{mode}/session
POST /api/modes/{mode}/submit
```

## 3. Cac Buoc Lam Feature

1. Doc docs feature cua minh.
2. Xac dinh demo path ngan nhat.
3. Thiet ke `GameSession.payload` cho UI can.
4. Implement UI trong feature folder.
5. Implement backend session/submit trong feature folder.
6. Submit tra `GameResult`.
7. Cap nhat docs feature voi request/response mau.
8. Chay test/typecheck.

## 4. Demo Path Toi Thieu

Moi feature phai co 1 demo path:

```text
Open mode
  -> Load session
  -> User answer/click
  -> Submit
  -> Result panel
  -> Progress/evidence/recovery updated
```

## 5. Feature Documentation Template

Moi `docs/features/<feature>.md` nen co:

```text
# Feature Name

Owner:

Goal:

Demo path:

Frontend folder:

Backend folder:

Endpoints:

Session payload:

Submit request example:

GameResult example:

What is mocked:

What is real:

Open questions:
```

## 6. Khi Can Shared Change

Neu dang lam feature ma can:

- Them field vao `GameResult`.
- Them shared component.
- Them API client method chung.
- Doi route app shell.
- Doi storage model.
- Doi AI grader chung.

Thi khong tu sua. Hay tao note:

```text
Shared change request:
- Why:
- Field/API needed:
- Affected feature:
- Proposed default:
```

Roi gui base owner.

## 7. Checklist Merge

Truoc khi merge:

- Khong sua file ngoai ownership.
- Khong co API key trong code.
- Khong goi OpenAI tu frontend.
- `/session` chay.
- `/submit` chay.
- Submit tra `GameResult`.
- UI co loading/error/result.
- Docs feature da cap nhat.

