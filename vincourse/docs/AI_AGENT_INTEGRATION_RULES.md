# AI Agent Integration Rules

Tai lieu nay bat buoc doc truoc khi dung AI Agent de phat trien tiep trong `vincourse/`.

Muc tieu: moi teammate co the lam feature rieng ma khong ghi de app shell, API client, schema chung hoac feature cua nguoi khac.

## 1. Nguyen Tac Bat Buoc

- Feature owner chi sua folder feature cua minh.
- Khong sua file shared neu khong co integration owner dong y.
- Khong tao app shell moi.
- Khong tao API client moi.
- Khong import OpenAI SDK tu frontend hoac feature router.
- Khong thay doi `GameResult`, `GameSession`, `GameSubmitRequest` neu chua co team agreement.
- Khong sua/xoa file prototype cu ngoai `vincourse/` trong branch feature.

## 2. Folder Duoc Sua Theo Feature

Story Quest:

```text
vincourse/apps/web/src/features/story-quest/**
vincourse/apps/api/app/features/story_quest/**
vincourse/docs/features/story-quest.md
```

Daily Recall:

```text
vincourse/apps/web/src/features/daily-recall/**
vincourse/apps/api/app/features/daily_recall/**
vincourse/docs/features/daily-recall.md
```

Error Dungeon:

```text
vincourse/apps/web/src/features/error-dungeon/**
vincourse/apps/api/app/features/error_dungeon/**
vincourse/docs/features/error-dungeon.md
```

Lab Arena:

```text
vincourse/apps/web/src/features/lab-arena/**
vincourse/apps/api/app/features/lab_arena/**
vincourse/docs/features/lab-arena.md
data/vlearn-pack/lab-arena/**
```

Boss Battle:

```text
vincourse/apps/web/src/features/boss-battle/**
vincourse/apps/api/app/features/boss_battle/**
vincourse/docs/features/boss-battle.md
```

Live Battle:

```text
vincourse/apps/web/src/features/live-battle/**
vincourse/apps/api/app/features/live_battle/**
vincourse/docs/features/live-battle.md
```

## 3. Shared Files Khong Duoc Tu Sua

Feature branch khong duoc tu sua cac file nay:

```text
vincourse/apps/web/src/app/App.tsx
vincourse/apps/web/src/app/styles.css
vincourse/apps/web/src/api/**
vincourse/apps/web/src/types/**
vincourse/apps/web/src/shared/**
vincourse/apps/api/app/main.py
vincourse/apps/api/app/schemas.py
vincourse/apps/api/app/routers/**
vincourse/apps/api/app/storage/**
vincourse/apps/api/app/ai/**
```

Neu feature can sua shared file, dung quy trinh o muc 5.

## 4. Cach Tich Hop Frontend Feature

Feature component phai export mot component ro rang trong folder feature:

```tsx
// apps/web/src/features/story-quest/index.tsx
export function StoryQuest({ onCompleted }: { onCompleted: () => void }) {
  return <section>...</section>;
}
```

Feature component tu goi shared API client neu can:

```tsx
import { getModeSession, submitMode } from "../../api/modes";
```

Khong sua `App.tsx` de mount feature. Thay vao do, tao request cho integration owner dang ky trong:

```text
vincourse/apps/web/src/shared/components/FeatureHost.tsx
```

Dang ky feature chi duoc them cac dong nho:

```tsx
import { StoryQuest } from "../../features/story-quest";

if (mode === "story") {
  return <StoryQuest onCompleted={onCompleted} />;
}
```

Khong copy app shell, sidebar, route system, dashboard, CSS global vao feature branch.

## 5. Khi Can Cham File Chung

Neu bat buoc can thay doi shared file, feature owner/agent phai:

1. Viet ly do trong PR/message.
2. Ghi dung file can sua.
3. Ghi mode nao bi anh huong.
4. De xuat patch nho nhat co the.
5. Cho integration owner merge vao shared file.

Vi du request hop le:

```text
Lab Arena can getModeSession(mode, round?) de load 10 round.
File can sua: apps/web/src/api/modes.ts
Patch mong muon: them optional query round chi cho mode lab_arena.
```

Vi du khong hop le:

```text
Thay App.tsx bang app shell rieng cua feature.
Them API client moi trong feature folder.
Sua GameResult de chi dung cho mot mode.
```

## 6. API Contract Cho Moi Mode

Moi mode phai giu pattern:

```text
GET  /api/modes/<mode>/session
POST /api/modes/<mode>/submit
```

Submit phai tra `GameResult` day du:

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

Neu can data rieng cho UI, dua vao `GameSession.payload` hoac `GameResult.payload`, khong them endpoint tuy tien neu chua can.

## 7. JSON Data Va Mock DB

Khong de 5 nguoi cung sua mot `db.json` lon.

Neu can seed data, uu tien file theo ownership:

```text
vincourse/apps/api/data/seeds/story_quest.json
vincourse/apps/api/data/seeds/daily_recall.json
vincourse/apps/api/data/seeds/error_dungeon.json
vincourse/apps/api/data/seeds/lab_arena.json
vincourse/apps/api/data/seeds/boss_battle.json
vincourse/apps/api/data/seeds/live_battle.json
```

Runtime data nhu attempts, progress, recovery queue phai ghi qua FastAPI, khong sua file JSON truc tiep tu frontend.

Dung flow:

```text
Frontend -> FastAPI endpoint -> storage layer -> JSON file
```

Khong dung flow:

```text
Frontend -> db.json
AI Agent -> append truc tiep db.json
```

## 8. Checklist Truoc Khi Push Feature Branch

- Khong co conflict marker `<<<<<<<`.
- Khong sua file shared ngoai pham vi da duoc chap thuan.
- Endpoint `/session` tra `GameSession`.
- Endpoint `/submit` tra `GameResult`.
- UI co loading, error, result hoac state tuong duong.
- Feature doc da cap nhat.
- Khong xoa/sua module cua nguoi khac.
- Khong commit `.env`, API key, generated runtime data.

Lenh kiem tra:

```powershell
rg "<<<<<<<|=======|>>>>>>>" vincourse
cd vincourse/apps/api
python -m compileall app
cd ../web
npm run typecheck
```

## 9. Vi Sao Rule Nay Ton Tai

Lan merge gan nhat bi conflict vi nhieu branch cung sua:

```text
vincourse/apps/web/src/app/App.tsx
vincourse/apps/web/src/app/styles.css
vincourse/apps/web/src/api/modes.ts
vincourse/apps/web/src/shared/components/FeatureHost.tsx
```

Cac file tren la integration surface. Neu feature branch nao cung de AI Agent tu sua, conflict se lap lai.

Feature owner nen build feature trong folder cua minh. Integration owner se gom cac feature vao shared host bang patch nho, co review.
