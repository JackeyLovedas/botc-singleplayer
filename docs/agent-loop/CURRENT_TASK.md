# Current Task

## Active Slice 2B17.3

- Name: `Legacy Philosopher No-Insertion Choice Compatibility`.
- Status: `RUNNING` on `main`; current PR is `null`.
- Recovery anchor: `dbd8594326333f5e775de3f39c3625346cb80739`; prior exact-main CI `29178027479` was `SUCCESS`.
- Limits: `maxSlices=1`, `maxRepairRounds=2`; repair round `0 / 2`, design round `1 / 2`.
- Candidate scope: `LEGACY_PHILOSOPHER_NO_INSERTION_CHOICE_COMPATIBILITY`.
- This is a deterministic compatibility hotfix. Fresh external rule research is not required and `ruleSemanticsChanged=false`.
- Architect design: `docs/implementation/phase-3-slice-2b17-3-design.md`, SHA-256 `d7fee3c947fbfb1ab2e122531d9552c082a037ea5f66d0d44a6b0ff3b4f5264a`, terminal `READY_FOR_COMPATIBILITY_REVIEW`.
- Independent compatibility review: `docs/implementation/phase-3-slice-2b17-3-design-review.md`, repository-file SHA-256 `e24c3dc937cdf937f6eab8de4adbbf363fe28d1c990fde50db3cc3826d90849a`, verdict `COMPATIBILITY_DESIGN_PASS`, required fixes `None`, blockers `[]`.
- `ruleSemanticsChanged=false`; implementation is authorized only after exact-head CI succeeds on the design-review gate commit.

## Hotfix Contract

Legacy V1 choices with no first-night task mapping must grant and settle without attempting a V2 insertion. Legacy V1 choices with a mapped first-night task must retain the accepted fail-closed behavior. Current V2 behavior and scheduling remain unchanged.

## Preserved Slice 2B18 Block

The immutable evidence `docs/rules/evidence/2B18.md` remains at SHA-256 `9f7564f4fe5be6399ec10ebc7475ab07f4e49c5aa5bcdb6752af61a928fdfa1a`. Slice 2B18 remains `HUMAN_BLOCKED` with four unresolved conflicts: `firstNightWindowDefinition`, `ownAbilityExclusion`, `candidateNumberDomain`, and `duplicateMathematicianRule`.

Do not resume Slice 2B18 and do not start Slice 2B19.

## Current Gate

Commit and push the exact independent compatibility review and updated control state, then verify CI on its exact main SHA. After that, create only `phase-3/philosopher-legacy-no-insertion-compatibility` and implement the reviewed repair.
