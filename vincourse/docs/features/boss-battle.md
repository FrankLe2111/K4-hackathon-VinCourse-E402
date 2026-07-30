# Boss Battle

Owner: Trung Quan

## Goal

Mode tong hop cuoi zone. Nguoi hoc phai van dung nhieu concept trong mot scenario lon va di qua nhieu phase.

## Demo Path

```text
Open Boss Battle
  -> load boss scenario
  -> phase 1 diagnose
  -> phase 2 choose fix
  -> phase 3 explain
  -> submit final answer
  -> boss defeated or recovery suggested
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
  "concept_ids": ["feature-scaling", "learning-rate", "mse-loss"]
}
```

## GameResult Notes

- Phase clear: `mastered`, partial XP.
- Final clear: `mastered`, large XP, unlock next zone.
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
