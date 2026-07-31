# Team Handoff From Develop

Tai lieu nay dung ngay sau khi integration owner da merge cac feature branch vao `develop`.

Muc tieu: moi nguoi phat trien tiep tren baseline moi, khong merge nguoc cac branch cu gay conflict, va khi gop lai van thanh mot ung dung VinCourse thong nhat.

## 1. Viec Can Lam Ngay

Tat ca thanh vien dung branch feature cu va tao branch moi tu `develop` moi nhat:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/<module>-next
git push -u origin feature/<module>-next
```

Ten branch de xuat:

```text
feature/story-quest-next
feature/daily-recall-next
feature/error-dungeon-next
feature/lab-arena-next
feature/boss-battle-next
feature/live-battle-next
```

Khong tiep tuc push vao cac branch cu:

```text
feature/story-quest
feature/daily-improvements
feature/lab-arena
feature/liveclassbattle
feature/frontend-html
```

Branch cu chi dung de tham khao/cherry-pick commit nho neu that su can.

## 2. Ownership

Moi nguoi chi sua folder feature cua minh:

```text
apps/web/src/features/<feature-name>/**
apps/api/app/features/<feature_name>/**
docs/features/<feature-name>.md
```

Feature co seed data thi sua them:

```text
apps/api/data/seeds/<feature_name>.json
```

Khong sua:

```text
apps/web/src/app/App.tsx
apps/web/src/app/styles.css
apps/web/src/api/**
apps/web/src/types/**
apps/web/src/shared/**
apps/api/app/main.py
apps/api/app/schemas.py
apps/api/app/routers/**
apps/api/app/storage/**
apps/api/app/ai/**
```

Neu bat buoc can sua shared file, gui request cho integration owner theo mau:

```text
Feature:
Can sua file:
Ly do:
Patch nho nhat:
Mode bi anh huong:
```

## 3. Cach Tich Hop Vao Mot App Chung

Frontend feature export component trong folder rieng:

```tsx
export function MyFeature({ onCompleted }: { onCompleted: () => void }) {
  return <section>...</section>;
}
```

Integration owner dang ky vao:

```text
apps/web/src/shared/components/FeatureHost.tsx
```

Feature owner khong tu thay app shell trong:

```text
apps/web/src/app/App.tsx
```

Backend feature giu endpoint chung:

```text
GET  /api/modes/<mode>/session
POST /api/modes/<mode>/submit
```

Submit luon tra `GameResult`. Data rieng cua UI de trong:

```text
GameSession.payload
GameResult.payload
```

## 4. Database JSON

Huong dung database:

```text
Frontend -> FastAPI -> storage layer -> JSON
```

Khong duoc:

```text
Frontend -> JSON file
AI module -> JSON file
AI Agent -> sua truc tiep db.json khi app dang chay
```

Seed data chia theo feature:

```text
apps/api/data/seeds/story_quest.json
apps/api/data/seeds/daily_recall.json
apps/api/data/seeds/error_dungeon.json
apps/api/data/seeds/lab_arena.json
apps/api/data/seeds/boss_battle.json
apps/api/data/seeds/live_battle.json
```

Runtime data local-only:

```text
apps/api/data/db.runtime.json
```

Doc chi tiet:

```text
docs/JSON_DATABASE_PLAN.md
```

## 5. Checklist Truoc Khi Push

Chay tu root repo:

```powershell
rg "<<<<<<<|=======|>>>>>>>" vincourse
```

Backend:

```powershell
cd vincourse/apps/api
python -m compileall app
```

Frontend:

```powershell
cd vincourse/apps/web
npm install
npm run typecheck
```

Neu `npm run typecheck` fail vi thieu `node_modules`, chay `npm install` truoc.

## 6. Checklist Truoc Khi Merge Ve Develop

- Branch duoc tao tu `develop` moi nhat.
- Khong sua shared file trai phep.
- Khong sua/xoa module cua nguoi khac.
- Khong commit runtime DB, `.env`, `__pycache__`, `dist`, `node_modules`.
- Endpoint `/session` va `/submit` cua feature chay duoc.
- UI co loading/error/result state.
- Feature doc da cap nhat.
- Neu can registration vao `FeatureHost`, integration owner la nguoi merge patch.

## 7. Baseline Hien Tai

`develop` hien da gop cac module:

```text
Story Quest
Daily Recall
Error Dungeon
Lab Arena
Boss Battle
Live Class Battle
```

Moi nguoi phat trien tiep tren baseline nay de tranh lap lai conflict tu cac branch cu.
