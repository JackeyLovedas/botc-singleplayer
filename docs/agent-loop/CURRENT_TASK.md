# Current Task

## Active Slice 2B17.3

- Name: `Legacy Philosopher No-Insertion Choice Compatibility`.
- Status: `RUNNING` on `main`; current PR is `null`.
- Recovery anchor: `dbd8594326333f5e775de3f39c3625346cb80739`; prior exact-main CI `29178027479` was `SUCCESS`.
- Limits: `maxSlices=1`, `maxRepairRounds=2`; repair round `0 / 2`, design round `0 / 2`.
- Candidate scope: `LEGACY_PHILOSOPHER_NO_INSERTION_CHOICE_COMPATIBILITY`.
- This is a deterministic compatibility hotfix. Fresh external rule research is not required and `ruleSemanticsChanged=false`.
- Implementation is not yet authorized. No design, production code, tests, feature branch, or PR may be created before the bounded design/review gate.

## Hotfix Contract

Legacy V1 choices with no first-night task mapping must grant and settle without attempting a V2 insertion. Legacy V1 choices with a mapped first-night task must retain the accepted fail-closed behavior. Current V2 behavior and scheduling remain unchanged.

## Preserved Slice 2B18 Block

The immutable evidence `docs/rules/evidence/2B18.md` remains at SHA-256 `9f7564f4fe5be6399ec10ebc7475ab07f4e49c5aa5bcdb6752af61a928fdfa1a`. Slice 2B18 remains `HUMAN_BLOCKED` with four unresolved conflicts: `firstNightWindowDefinition`, `ownAbilityExclusion`, `candidateNumberDomain`, and `duplicateMathematicianRule`.

Do not resume Slice 2B18 and do not start Slice 2B19.

## Current Gate

Commit and push only this startup control state, then verify CI on its exact main SHA. After that, create the concise 2B17.3 design and obtain an independent compatibility design review before implementation.
