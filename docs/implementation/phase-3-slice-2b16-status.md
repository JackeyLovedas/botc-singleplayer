# Phase 3 Slice 2B16 Status: Repair Round 2

## Status

Round `2 / 2` implementation and local validation are complete. PR #18 remains open. The old frozen HEAD `45aabfe825d45329a80a178a943cce3bb6491ce1`, its successful CI and its double-fix-required review become historical when this repair is committed.

No future commit SHA is embedded here. After push, the branch and PR `headRefOid` define the exact frozen HEAD. Fresh exact-head CI is not claimed until GitHub reports it.

## Provenance

- Evidence: `5204b8995a40b8cee237f2b004f59f16e0751667ffdd3b9b5691265f425d9cb0`, `RULE_READY`, `PARTIAL`.
- Round-2 design: `6d790e201347222621b8cfb5afeee77d3e0224faa4c438b9f67c1994edeb12a0`.
- Round-2 final review: `24fc958b2df03c6a0d55d2d2cfa6e7b4a0f05d7847a3e52fec32056a75abe254`, both fix-required verdicts.
- Round-2 design review: `3519e696c42a2b83a8822611bceb2c279390759f97193836e4009bb5e177c8f8`, `RULE_DESIGN_PASS`, blockers `[]`.

## Findings Resolved

1. Canonical opportunity-ID embedded seat now equals `sourceSeatNumber` independently of task/tenure coincidence.
2. Choice and marker shapes enforce the same semantic identity; instruction remains privacy-minimal and validates through the full stored chain.
3. Replay assertions cover all 24 event permutations, complete metadata positions, real lifecycle mixing, duplicate settlement, opportunity mutations and every provenance field.
4. Projection assertions cover each duplicate, each cross-link category, semantic seat mismatch, combined forgery and independent historical variants.
5. Application assertions cover every designed metadata/construction/prospective/commit fault with atomic same-command retry.
6. Official order is traced to external evidence, supported runtime order to the production catalog, and prior-role behavior to existing real execution/projection tests.
7. Current-truth documents and coverage matrix no longer claim pending round-1 repair or complete role coverage.

## Local Validation

- Focused: 5 files / 296 tests passed.
- Typecheck and file-scoped lint: passed.
- Full lint: passed.
- Full tests: 24 files / 824 tests passed.
- Coverage tests: 24 files / 824 tests passed.
- Coverage: 85.53% statements/lines, 78.90% branches, 97.73% functions.
- Diff check: passed.

## Explicitly Unsupported

Drunk/poison production or simulation, impaired target notification, Vortox runtime, character/alignment lifecycle, madness judgment, execution, death/day accounting, marker removal/cleanup, other-night recurrence, gained Cerenovus, Goblin jinx, Vigormortis retention, UI, Electron, persistence and Slice 2B17 remain out of scope. Cerenovus remains `PARTIAL`.

## Next Gate

Commit and push the exact repair, update PR traceability with the actual HEAD and local results, freeze the branch, and wait for fresh exact-head push/PR Ubuntu and Windows CI. Then obtain a new complete independent final review. Do not comment, merge or tag.
