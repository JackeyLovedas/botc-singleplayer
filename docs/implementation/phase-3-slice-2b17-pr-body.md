## Summary

Implements the bounded Slice 2B17 Clockmaker first-night information pipeline. Clockmaker remains `PARTIAL`.

## Bounded Scope

Adds base and Philosopher-gained first-night settlement, canonical Philosopher duplicate drunkenness, supported Snake Charmer settlement-time identity, effective current Vortox false-only information, exact historical validation, deterministic receipts, and source-only projection.

## Rule Evidence

`docs/rules/evidence/2B17.md` is `RULE_READY` with SHA-256 `db1fb83335e6a2083f85797b83516b8b646538ee3afcfd5ac92319147432d97e`. The exact round-3 design is `fde5aebea89e003c38938c338abfd4fdd1370c88814f965c41a0dcda7b3d1e06`; independent design review returned `RULE_DESIGN_PASS` with no blockers.

## Rule Claims Implemented

Native character type, not alignment, selects the current one Demon and two Minions. Circular distance is the minimum of both directions and then the minimum over both Minion pairs. Base information uses the task's settlement state. Philosopher-gained information occurs at the inserted task; the original Clockmaker can later resolve drunk. An effective current Vortox excludes the true distance.

## Rule Claims Not Implemented

Registration, absent or multiple Demon execution, noncanonical Minion counts, dead-player/life transitions, Travellers, later-night gained Clockmaker, recurring Clockmaker, and general character/alignment lifecycle behavior are not implemented.

## Explicitly Unsupported Rules

Spy/Recluse/Summoner registration, canonical poisoned Clockmaker, impaired Vortox, free-form Storyteller choice, UI, Electron, SQLite, first-night completion, and Slice 2B18 fail closed or remain unreachable and receive no support claim.

## Rule Source Revisions

User overrides are pinned at Git revision `8fb8c0b6c42eee8320b1b4c4d9efdf4ec20707a8`. Chinese Clockmaker is oldid `6181`; official Clockmaker `2967`; Vortox `3017`; States `1039`; Glossary `2874`; Abilities `1376`; Philosopher `2421`; Snake Charmer `2905`. Official nightsheet is commit `3d6d930a9e600321f93b2567a2e88948a675bc1e`, SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`.

## Rule-to-Test Traceability

The approved continuous rows `1..99` are audited against assertions in the named suites: rows `1..31`, `35`, and `45..51` map to Clockmaker domain assertions; row `32` to the dedicated Philosopher-gained insertion-order application assertion; row `33` to the dedicated task-engine order assertion; row `34` is only `EXTERNAL_RULE_EVIDENCE`; rows `36..44`, `52..53`, `64..72`, and `91..98` map to application integration assertions and parameterized histories; rows `54..63` map to replay/batch assertions; rows `73..90` map to Clockmaker private projection assertions; row `99` maps to the pre-Clockmaker projection compatibility regression. Rows `86..89` each construct and reject its named Vortox corruption independently.

## Source Identity And Settlement Timing

Base source contracts bind the exact next planned role-information task and current Clockmaker. Gained contracts bind the exact Philosopher, grant, opportunity, insertion, task, seat, and revision. Native identities are resolved from current role snapshots at settlement.

## Candidate Legality And Simulation Policy

The stored domain is exactly `0..6`. Effective non-Vortox information selects truth; canonical drunk information retains the full legal domain; Vortox excludes truth. Legal candidates, selected distance, reliability, and deterministic simulation reason are separate fields.

## Vortox And Impairment Boundary

Vortox requires one exact active/effective tenure bound to the stored native Demon player, seat, and role. Canonical drunkenness binds the preserved Philosopher choice/grant/impairment chain. Poisoned Clockmaker and impaired Vortox remain unsupported.

## Event And State Contract

Settlement emits exactly `ClockmakerInformationDelivered` followed by `ScheduledTaskSettled` with shared metadata and consecutive sequences. State stores a unique delivery and the linked settlement outcome.

## Projection And Information Safety

Only the source sees `{ distance }`, model `clockmaker-information-v1`, and stage `CLOCKMAKER_INFORMATION`. Player and AI views are identical. Hidden identity, geometry, truth, candidates, impairment, Vortox, policy, state, assignment, and task facts are not projected.

## Replay Stored And Prospective Validation

Replay, batch, stored-fact, and prospective validators reject naked, reversed, partial, duplicate, extra, cross-linked, malformed, stale, and forged histories atomically. Later current-state changes do not rewrite delivered history.

## Receipt Failure And Determinism

Deterministic command rejections use stored receipts and structural fingerprints. Metadata, construction, prospective, dependency, and commit failures remain retryable without partial events or receipts. Canonical IDs use task and settlement revision only; banned clock/random/locale primitives are absent.

## Local Validation And Exact-Head CI

Focused suites passed 7 files / 341 tests. Typecheck, changed-file lint, full lint, and diff checks passed. Full and coverage runs each passed 28 files / 891 tests; coverage is 85.85% statements/lines, 79.93% branches, and 97.84% functions. The Windows deterministic job directly runs Clockmaker domain/replay/order suites, followed by projection, task-engine, and application package tests; its exact new root command was locally verified as 3 files / 46 tests, not a no-op. Only CI/docs changed after the full coverage run, and YAML parse, typecheck, full lint, and diff checks passed. Exact frozen-head Ubuntu and Windows CI are not yet available and are not claimed.

## Coverage Status And Next Gate

Clockmaker is `PARTIAL`. Next: controller pre-publish audit, attributed commit, push, one PR, exact-head CI, then one complete independent final report returning both `CODE_REVIEW_PASS` and `RULE_REVIEW_PASS` with no blockers. No merge is authorized yet.
