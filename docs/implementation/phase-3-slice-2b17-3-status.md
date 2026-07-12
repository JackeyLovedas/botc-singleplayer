# Phase 3 Slice 2B17.3 Implementation Status

## Status

`COMPLETED`

- Implementation commit: `d564b1d49e919ab9dcc365560a8f4745fa39dc3f`.
- PR: [#22](https://github.com/JackeyLovedas/botc-singleplayer/pull/22).
- Final reviewed HEAD: `d6c567838419fc34b6e6406468899e55d46b2979`.
- Merge SHA: `139616d2706a193079bf779898b8adeb9f3d049a`.
- Accepted tag: `phase-3-slice-2b17-3-philosopher-legacy-no-insertion-compatibility`.
- Final review: `CODE_REVIEW_PASS / RULE_REVIEW_PASS`, `ruleSemanticsChanged=false`, blockers `[]`.

## Implemented Boundary

- `createFirstNightTaskInsertedV2Payload` now resolves the chosen-role mapping first and returns `undefined` before reading plan, catalog, or grant fields when no insertion is required.
- Mapped legacy V1 choices still fail closed through the existing application pre-gate and the domain builder's V2 plan requirement.
- No application production branch, event shape, task ID, plan version, projection, role rule, or V2 scheduling contract changed.
- `ruleSemanticsChanged=false`.

## Regression Coverage

- Direct builder coverage includes V1 Artist, Barber, and Philosopher no-op; V2 Artist and Barber no-op; hostile unreadable plan/grant probes; mapped V1 Snake Charmer and Clockmaker rejection; malformed mapped catalog/grant rejection; and exact V2 payload preservation.
- A real writable accepted V1 history proves Artist choice, exact three-event settlement, no insertion or impairment, one version increment, accepted receipt, idempotency, opportunity closure, `MINION_INFO` progression, batch validation, stream validation, and rebuild.
- A deterministic in-play Town Crier fixture proves duplicate DRUNK, no insertion, replay, and unchanged player/AI projection boundaries.
- Snake Charmer, Clockmaker, Dreamer, Seamstress, and Mathematician are parameterized through the complete V1 no-write fail-closed contract.
- Existing V1 replay/mixed-generation and V2 mapped/no-mapped position, system-information, base-first, seat/task-ID tie-break tests remain green.

## Local Validation

- Focused: 2 files / 222 tests passed.
- Full: 28 files / 923 tests passed.
- Coverage: 86.09% statements/lines, 80.27% branches, 97.88% functions.
- `pnpm typecheck`: PASS.
- `pnpm lint`: PASS.
- `git diff --check`: PASS.
- New-production forbidden-pattern scan: PASS.

## Preserved Blocks

`docs/rules/evidence/2B18.md` remains unchanged at SHA-256 `9f7564f4fe5be6399ec10ebc7475ab07f4e49c5aa5bcdb6752af61a928fdfa1a`. Slice 2B18 remains `HUMAN_BLOCKED` on four conflicts. Slice 2B19 was not started.

## Final Provenance

- Product-head CI: push `29179615504`, pull request `29179616613`, both `SUCCESS` on the final reviewed HEAD.
- Merge CI: main `29179930675`, accepted tag `29179940573`, both `SUCCESS` on the merge SHA.
- Final report SHA-256: `4f0f013b92143417bcf28592eecc62c58e438fac759a3b9f56df0ed266f66bd3`.
- Final code comment `4949964176`, body SHA-256 `8009e2a418385274faeedde249d5a53a046ca83a88b07aa954a5aed65882656e`.
- Final rule comment `4949964254`, body SHA-256 `5032b0886977901a1909622f3e076ec870425a8e2357aa6701ea20dd54d151cd`.
- Verbatim archives: `docs/reviews/pr-22-code-review-final.md` and `docs/reviews/pr-22-rule-review-final.md`.
