# VinCourse Docs

Bo tai lieu nay dung cho nhom phat trien tiep tren codebase `vincourse/`.

Muc tieu cua bo docs:

- Moi thanh vien hieu kien truc chung truoc khi dung AI Agent sinh code.
- Moi feature duoc cam vao cung mot app, khong bien thanh mini app rieng.
- UI moi giu tinh than cua prototype cu trong `codebase/static/`.
- Frontend, backend va AI giao tiep qua contract ro rang.
- Han che conflict bang ownership theo folder.

## Nen Doc Theo Thu Tu

1. `TEAM_CODEBASE_PLAN.md`
   - Kien truc tong quan, folder ownership, contract chung.

2. `DEVELOPMENT_GUIDE.md`
   - Cach setup, start FE/BE, quy trinh lam viec hang ngay.

3. `UI_STYLE_GUIDE.md`
   - Cach giu UI giong prototype lead dang lam.

4. `API_CONTRACT.md`
   - Contract giua React va FastAPI.

5. `AI_MODULE_GUIDE.md`
   - Cach goi AI dung cach, khong goi OpenAI tu frontend.

6. `TEAM_HANDOFF_DEVELOP.md`
   - Huong dan tao branch moi tu develop va phat trien tiep sau khi merge feature.

7. `JSON_DATABASE_PLAN.md`
   - Ke hoach dung JSON DB tong + seed rieng theo feature, bat buoc ghi qua FastAPI.

8. `FEATURE_WORKFLOW.md`
   - Checklist cho tung thanh vien khi lam mode rieng.

9. `AGENT_WORKFLOW.md`
   - Prompt va quy tac khi dung AI Agent de gen code.

10. `AI_AGENT_INTEGRATION_RULES.md`
   - Quy tac chong conflict khi AI Agent tich hop module vao file chung.

11. `features/*.md`
   - Tai lieu rieng cho tung feature owner.

## Nguyen Tac Chinh

- React chi goi FastAPI.
- FastAPI quan ly game logic, progress, evidence.
- Moi thao tac ghi database phai di qua FastAPI va storage layer.
- Module AI nam trong backend va la noi duy nhat goi OpenAI.
- AI module khong duoc tu ghi truc tiep vao JSON database.
- Moi mode tra ve cung `GameResult`.
- Moi nguoi chi sua folder feature cua minh.
- Shared files chi do base/integration owner sua.

