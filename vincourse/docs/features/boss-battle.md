# Boss Battle

Owner: Trung Quan

## Goal

Mode tong hop cuoi zone. Nguoi hoc phai van dung nhieu concept trong mot scenario lon va di qua nhieu phase.

Core rule: Boss Battle la thu thach hop tac ca lop. Moi team tra loi doc lap; neu it nhat `80%` team trong lop tra loi dung o cung mot round, ca lop mo duoc mot don tan cong len boss.

## Demo Path

```text
Open Boss Battle
  -> load boss scenario
  -> teams answer independently
  -> system calculates class correct rate
  -> if correct rate >= 80%, class attacks boss
  -> if boss HP reaches 0, boss defeated
  -> wrong teams receive recovery suggestions
```

## Allowed Folders

Allowed folders:

- `vincourse/apps/web/src/features/boss-battle/**`
- `vincourse/apps/api/app/features/boss_battle/**`

## Endpoints

Endpoint:

```text
GET  /api/modes/boss_battle/session
POST /api/modes/boss_battle/submit
```

## Suggested Session Payload

```json
{
  "boss_id": "broken-model",
  "phase": 1,
  "phases": [
    "diagnose_root_cause",
    "choose_pipeline_fix",
    "explain_interaction",
    "transfer_to_new_data",
    "final_challenge"
  ],
  "scenario": "A model diverges after training because features have very different scales.",
  "concept_ids": ["feature-scaling", "learning-rate", "mse-loss"],
  "attack_threshold": 80,
  "core_rule": "At least 80% of teams must answer correctly in the same round to unlock a boss attack.",
  "boss_hp": 100,
  "attack_damage": 25
}
```

## Cooperation Rules

1. Moi team nhan cung mot boss question trong round hien tai.
2. Team nop dap an doc lap, khong can tat ca thanh vien phai trung mot dap an trong UI demo.
3. Sau khi het gio, he thong tinh `class_correct_rate = correct_teams / active_teams * 100`.
4. Neu `class_correct_rate >= 80%`, ca lop duoc tan cong boss.
5. Neu duoi `80%`, boss khong mat mau va cac team sai nhan recovery hint.
6. Moi don tan cong giam HP boss theo `attack_damage`.
7. Khi HP boss ve `0`, ca lop thang Boss Battle va mo zone tiep theo.

## GameResult Notes

- Phase clear: `mastered`, partial XP.
- Final clear: `mastered`, large XP, unlock next zone.
- Class attack: only when at least `80%` of active teams are correct.
- Weak explanation: `partial` or `needs_clarification`.
- Wrong causal model: `misconception`, `recovery_created=true`.

## What Can Be Mocked

- Real unlock tree.
- Full multi-zone progression.

## What Should Feel Real

- Multi-phase boss progress.
- Explanation grading.
- Transfer evidence.
- Big result state.
