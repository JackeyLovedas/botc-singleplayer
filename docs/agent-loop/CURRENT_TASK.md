# Current Task

## Slice 2B16 Effective-Only Rescope — Implemented And Locally Verified

- Role: `Cerenovus`.
- Scope authorization: `CERENOVUS_EFFECTIVE_ONLY`.
- Source-impaired execution status: `UNSUPPORTED_UNREACHABLE_IN_CURRENT_CANONICAL_HISTORY`.
- Branch: `phase-3/cerenovus-first-night-madness-marker`.
- The preserved dirty worktree contains the completed implementation and tests; do not reset or discard them. No commit, push, or PR exists yet.
- Fresh external rule truth remains `RULE_READY`; no source conflict exists.
- The prior design and prior `RULE_DESIGN_PASS` are superseded by the effective-only event and failure contract.
- The independent reviewer returned `RULE_DESIGN_PASS` with no blockers for exact HEAD `db1f09cc35b51f92f6e84ad8cd9c3cb1150983d0`, evidence SHA-256 `f0d8d976cd9366d7e4603173caeb01d3fd7461c27c484501f79d8d0b0ce5175a`, and design SHA-256 `7c1c2bd7f849913b3cacf2e5a14c8ce83a32dbdecef8591267074e6cf4ef0e3f`.
- The complete report is preserved verbatim in `docs/implementation/phase-3-slice-2b16-effective-only-design-review.md`; implementation of only that exact design is authorized.
- The exact effective-only implementation is complete locally. Typecheck, lint, focused 509, full 761, coverage 761, and `git diff --check` pass.
- Cerenovus-specific tests prove System/Storyteller opening, Human/AI opening rejection without events or opportunities, and exact constructed-noncanonical DRUNK/POISONED pre-construction no-write failures.
- `docs/implementation/phase-3-slice-2b16-status.md` records rule evidence, implemented claims, unsupported rules, source revisions, traceability, verification, and the remaining merge gates.

## Corrected Effective-Only Contract

An accepted healthy base first-night action uses exactly:

1. `CerenovusChoiceRecorded`
2. `CerenovusMadnessMarked`
3. `CerenovusMadnessInstructionDelivered`
4. `ScheduledTaskSettled` with `CERENOVUS_MADNESS_MARKED`

The private instruction is target-only and contains no Cerenovus player identity. Marker history records `TOMORROW_DAY_AND_NIGHT` plus `NEXT_DAWN_OR_SOURCE_DEATH_OR_LEAVES_PLAY` policy without implementing lifecycle, judgment, or execution.

## Impairment Gate

- Full BOTC drunk/poison truth remains documented: normal-looking choice and target simulation, but no real marker or execution authority.
- Slice 2B16 does not implement that simulation.
- A pure constructed matching impairment reaching the effective-only gate returns generic retryable `ApplicationNotConfigured` at `first-night-role-action` before metadata, events, receipts, closure, or version change.
- No test may present a constructed impairment as a canonical stored history.
- No impairment producer, import command, injection boundary, or other role is added.

## Next Gate

1. Controller audits exact scope, test traceability, status documentation, old-symbol removal, and worktree state.
2. Only after that checkpoint, prepare the attributed commit, push the same branch, and create/update one slice PR with the five required rule sections.
3. Do not merge before exact-HEAD CI, complete independent final code/rule review, both verbatim GitHub audit comments, and clean-worktree verification.

## Limits

- `maxSlices = 1`; only Slice 2B16.
- `maxRepairRounds = 2` for the future PR.
- Heartbeat remains disabled.
- Do not research, design, or implement 2B17.
- Cerenovus remains `PARTIAL`; nothing is `COMPLETE`.
