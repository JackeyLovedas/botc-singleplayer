# Phase 3 Slice 5 — One Verified Core Interaction Design

## Authority and adjudication

This design is bound to the user adjudication
`SLICE5_PRECONDITION_INTERPRETATION_V1`: Slice 1–4 and all preceding
prerequisites are accepted before Slice 5 starts. The active implementation
coverage authority is `docs/rules/ROLE_COVERAGE_MATRIX.md`; Evil Twin remains
`PARTIAL`. This slice therefore does not implement Evil Twin victory or any
other role behavior.

## Selected interaction

`CORE_DAY_EXECUTION_PROJECTION_REPLAY_INTERACTION_V1` verifies one real
application chain:

```text
real setup/assignment
 -> day discussion and nomination window
 -> living nomination
 -> vote lifecycle and completion
 -> execution resolution
 -> separate PlayerDied fact when the fixture dies
 -> canonical state
 -> public projection
 -> viewer-bound player projection
 -> accepted event-stream replay
 -> hostile replay rejection
```

The interaction is verification-only. Existing production commands, domain
events, projections, and replay validators are reused. No new rule claim,
role semantic, victory behavior, or game-over behavior is introduced.

## Reused accepted identities

The verification mapping binds existing identities only:

| Interaction segment | Existing identities |
| --- | --- |
| nomination and day flow | `GI-C05`, `GI-C01`, `S3-C01`, `S3-C02`, `H` |
| voting and completion | `GI-C06`, `S3-C03`, `I`, `J` |
| execution and death separation | `GI-C07`, `GI-C08`, `S3-C04`, `S4-C06`, `K`, `L` |
| public/player projection safety | `S4-C01`, `S4-C02`, `S4-C03`, `S4-C05`, `S4-C08`, `S4-C10` |
| accepted replay and hostile replay | `GI-C03`, `GI-C04`, `GI-C13`, `S4-C07`, `R` |

`S3-C05`, `S4-C09`, and the remaining existing rows remain supporting
regression evidence where exercised by the selected test command. No `S5-*`
semantic criterion is created.

## Fixture and checkpoints

The primary fixture uses the accepted deterministic setup/assignment helpers
and real application commands. It must not manually construct `GameState`,
inject events, force a death flag, or bypass command validation. A legal
12-player Sects & Violets roster is used only as setup data; no role ability is
settled as part of the claim.

The integrated test records checkpoints after nomination, vote completion,
execution resolution, and final projection. It compares the live canonical
state and both projections with values rebuilt from the complete accepted
event stream. A targeted existing hostile mutation remains fail-closed.

`ExecutionResolved` and `PlayerDied` remain distinct. If the selected fixture
produces death, the death event must carry the existing execution provenance;
otherwise no death is inferred.

## Expected deltas and boundaries

- New commands: `0`.
- New domain events: `0`.
- New victory/game-over infrastructure: `0`.
- New C1 descriptors or approved structural delta: `0`.
- New dependencies and production packages: `0`.
- Evil Twin production files and rule evidence: unchanged.
- Role coverage status delta: `0`.
- Existing physical test may be extended, or one small integration test may be
  added, but it must list the reused identities in its title/metadata and add
  no semantic rule identity.
- Slice 4 projection schema and coverage profile are not rewritten.

## Verification and publication gates

After independent `RULE_DESIGN_PASS`, implementation is limited to the
verification test/manifest surface unless a real accepted cross-slice defect
is demonstrated. Such a defect may consume at most two integration repair
rounds and may not add semantics. Required local gates are the focused
interaction, reused-ID regressions, replay/projection, ownership, routing, C1,
governance, typecheck, lint, ordinary tests, and exact coverage/profile gates.

The final publication chain is the normal branch, review, exact-head CI, PR,
merge, archive, closeout, and control-sync chain. No additional authorization
is requested unless a listed STOP condition occurs.

## Non-goals

Evil Twin victory, both-twins-alive blocking, Vigormortis retention, tenure or
role-change victory, generic victory/game-over infrastructure, new commands or
events, workflow/Vitest changes, and any 2B18 work are outside this slice.
