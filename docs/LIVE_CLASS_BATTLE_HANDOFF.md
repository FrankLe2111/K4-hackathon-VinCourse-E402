# Live Class Battle Handoff

## Da hoan thanh

- Student flow: `Join -> Waiting -> Play -> Submitted -> Result/Recovery`.
- Instructor flow: `Setup -> Lobby -> Monitor -> Lock -> Reveal -> Summary`.
- Class code demo `VINC-24`, validation input va khoa bai sau khi submit.
- Mock scoring `40/40/20`, team contribution va hai nhanh ket qua dung/sai.
- Label ro `Simulated live demo`; khong WebSocket, backend hay AI realtime.
- Responsive desktop/mobile va ban dich VI cho cac nhan chinh.

## File da sua

- `frontend/app.js`: state, render function, action va text cua Live Battle.
- `frontend/styles.css`: chi them cac class co prefix `live-*` va responsive.
- `frontend/game-rules.md`: dong bo core loop, scoring va mock scope.
- `docs/DEMO.md`: them script bam student/instructor.
- `docs/LIVE_CLASS_BATTLE_PLAN.md`: scope va tieu chi da thong nhat truoc khi lam.

## Luu y tranh conflict

- `frontend/app.js` la file dung chung. Vung de conflict nhat la state dau file,
  block tu `liveChallenge` den `instructorLive`, bang `actions`, handler
  `data-live-confidence` va input `live-code`/`live-reasoning`.
- `frontend/styles.css` chi can giu block `.live-*`; khong sua rule cua mode khac.
- `docs/DEMO.md` va `frontend/game-rules.md` chi thay section Live Battle.
- Khong sua `codebase/`, API contract, navigation chung hay logic cua feature khac.

## Kiem tra da chay

- `node --check frontend/app.js`
- `python3 -m unittest codebase/test_server.py` (`7/7` pass)
- `git diff --check`
- Render route `/#live` tren Chrome desktop `1440x1100` va mobile `390x844`
- Browser smoke test: class code sai, student dung/sai, recovery va instructor
  `Setup -> Summary` deu pass
