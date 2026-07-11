# Phase 3 Slice 2B16 Status: Cerenovus Effective-Only First-Night Marker

## Status

Implemented and locally verified on branch `phase-3/cerenovus-first-night-madness-marker` from reviewed dirty HEAD `db1f09cc35b51f92f6e84ad8cd9c3cb1150983d0`. No commit, push, or PR has been created yet.

Rules baseline: Phase One v2.1. Rule evidence `docs/rules/evidence/2B16.md` has SHA-256 `f0d8d976cd9366d7e4603173caeb01d3fd7461c27c484501f79d8d0b0ce5175a`; the effective-only design has SHA-256 `7c1c2bd7f849913b3cacf2e5a14c8ce83a32dbdecef8591267074e6cf4ef0e3f`. The independent design review is preserved verbatim at SHA-256 `5d1c60eb2f42f4cab01243f8dd00ab0ad38ca4fc5a98a094345ef7f663c0af16` and returned `RULE_DESIGN_PASS` with no blockers.

## Rule Evidence

- User-approved overrides were checked first.
- Official Cerenovus Wiki revision: `3048`.
- Official States Wiki revision: `1039`.
- Official Glossary Wiki revision: `2874`.
- Chinese Cerenovus Wiki revision: `4198`.
- Chinese Madness Wiki revision: `5883`.
- Official `nightsheet.json` SHA-256 begins `99a2815`; verified first-night order is `witch -> cerenovus -> fearmonger` and other-night order is `witch -> cerenovus -> pithag`.
- Source-impaired execution status is `UNSUPPORTED_UNREACHABLE_IN_CURRENT_CANONICAL_HISTORY` under the current repository's canonical producers.

## Rule Claims Implemented

- A current base Cerenovus receives one deterministic first-night opportunity when its task is next.
- Source Human or AI actors may choose any modeled roster player, including self.
- The selected character must be an on-script Townsfolk or Outsider; in-play assignment is not required.
- A supported effective submission creates exactly:

```text
CerenovusChoiceRecorded
CerenovusMadnessMarked
CerenovusMadnessInstructionDelivered
ScheduledTaskSettled(CERENOVUS_MADNESS_MARKED)
```

- Marker history records `TOMORROW_DAY_AND_NIGHT`, `NEXT_DAWN_OR_SOURCE_DEATH_OR_LEAVES_PLAY`, and the source-ability-instance dependency as future policy only.
- Only the target receives the private instruction. Its view contains only `selectedByCharacter`, `madAboutRoleId`, and `instructionWindow`; source identity and internal IDs are excluded.
- Stored, replay, integrated-batch, prospective, receipt, and deterministic-ID validation fail closed on incomplete, reordered, malformed, duplicate, or cross-linked facts.
- Accepted results disclose only four ordered event types and count. Idempotent retry appends nothing; a different fingerprint conflicts.

## Effective-Only Capability Gate

After command, task, opportunity, source, target, and character validation—but before generator, batch, metadata, event, prospective, receipt, closure, or version work—the pure gate checks represented matching source impairment.

A constructed matching `DRUNK` or `POISONED` input returns:

```text
status = failed
code = ApplicationNotConfigured
failureStage = first-night-role-action
retryable = true
message = Cerenovus effective-only settlement is not configured for the current canonical state
```

It authorizes no events or receipt and keeps the opportunity open. Unit fixtures identify these sets as constructed and noncanonical; no Cerenovus test fabricates an `AbilityImpairmentApplied` stored history.

## Explicitly Unsupported Rules

- Drunk/poisoned simulated choice, fake marker suppression, and target notification.
- Generic or role-specific impairment production, import, or injection.
- Actual madness conduct detection, Storyteller judgment, execution, death, or day ending.
- Marker expiry/removal/suspension/resumption and source-death or leaves-play cleanup.
- Other-night recurrence.
- Life-state restrictions, Travellers, exile, Goblin jinx, Vigormortis, or gained Cerenovus abilities.
- General character/alignment change handling, AI choice generation, UI, Electron, SQLite, and Slice 2B17.
- Any claim that Cerenovus is immune or complete.

## Rule-to-Test Traceability

- Opportunity actor policy: Cerenovus-specific System/Storyteller opening tests and Human/AI no-event/no-opportunity rejection tests.
- Target, self-target, and character legality: `cerenovus.test.ts` choice tables and application rejection tests.
- Effective marker, instruction, settlement, and privacy: Cerenovus domain payload tests plus the application four-event integration test.
- Fail-closed impairment boundary: constructed-noncanonical DRUNK/POISONED pure domain-gate tests plus direct pre-construction application-boundary tests asserting the exact generic failure and zero batch, event, opportunity, or receipt effects.
- Exact runtime shape and tamper rejection: decision, choice, marker, instruction, deterministic-ID, chain, and extra-key tests.
- Replay, atomicity, prospective validation, receipt summaries, idempotency, and projection history: domain-batch, rebuild, application, and private-projection suites.
- Night order and supported subset order: rules catalog and application task-order regressions.
- Non-regression: all 22 repository test files.

The reviewed design's 62-item plan is covered across the new 36-test Cerenovus domain suite, the Cerenovus application integration tests, and the existing opportunity, task-order, batch, replay, prospective, receipt, determinism, and projection suites. The 36 dedicated domain tests exceed the user's minimum 30 Cerenovus checks.

## Coverage Status

Cerenovus remains `PARTIAL`, never `COMPLETE`.

- Base ability and first-night behavior: `PARTIAL`; effective-only choice, marker history, instruction, and settlement are implemented.
- Drunk and poisoned behavior: `UNSUPPORTED_UNREACHABLE_IN_CURRENT_CANONICAL_HISTORY`; rule truth is retained, simulation is not implemented.
- Projection: `PARTIAL`; target-only effective historical instruction is implemented.
- Marker lifecycle and Storyteller discretion: `PARTIAL` only because policy is recorded; no execution is implemented.
- Other-night, Philosopher, character change, alignment change, death interaction, and recurrence remain unsupported or unevaluated as recorded in the matrix.

## Verification

Final local verification on the uncommitted implementation tree:

```text
pnpm typecheck: passed
pnpm lint: passed with zero warnings
focused suites: passed, 5 files / 509 tests
dedicated Cerenovus domain suite: passed, 36 tests
pnpm test: passed, 22 files / 761 tests
pnpm test:coverage: passed, 22 files / 761 tests
coverage: 85.34% statements/lines, 77.96% branches, 97.72% functions
git diff --check: passed
superseded Cerenovus event/state/view symbol scan: clean in packages
```

## Merge Gate

The branch is ready for controller pre-publish audit, not merge. Before merge it still requires a committed and pushed frozen feature HEAD, a complete PR body with source revisions and rule-to-test traceability, green CI on that exact HEAD, one complete independent final review returning both `CODE_REVIEW_PASS` and `RULE_REVIEW_PASS`, both verbatim GitHub audit comments re-read against the current PR HEAD, and a clean worktree.
