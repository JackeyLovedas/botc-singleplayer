## Summary

Implements the bounded Phase 3 Slice 2B17 Clockmaker first-night distance-information pipeline. Clockmaker remains `PARTIAL`.

## Bounded Scope

Adds base and Philosopher-gained first-night settlement, canonical Philosopher duplicate drunkenness, supported Snake Charmer settlement-time identity, effective current Vortox false-only information, exact historical validation, deterministic receipts, and source-only projection.

## Rule Evidence

`docs/rules/evidence/2B17.md` is `RULE_READY`, SHA-256 `db1fb83335e6a2083f85797b83516b8b646538ee3afcfd5ac92319147432d97e`. The exact round-3 design is `fde5aebea89e003c38938c338abfd4fdd1370c88814f965c41a0dcda7b3d1e06`; independent design review `2c472cfdca5578d0aa556e4ec02761854362fcf3470a4188e294cfe74dafbe62` returned `RULE_DESIGN_PASS` with no blockers.

## Rule Claims Implemented

Clockmaker resolves the current native Demon and both current native Minions, calculates every distinct pair's shortest circular distance, and delivers the minimum. Base information uses settlement-time state. Philosopher-gained information resolves at its inserted task. A canonical original Clockmaker can later resolve drunk. An effective current Vortox forces a false number.

## Rule Claims Not Implemented

No-Demon, multiple-Demon, noncanonical Minion-count, dead-player/life-transition, Traveller, later-night gained Clockmaker, recurring Clockmaker, general character/alignment lifecycle, and general registration execution are not implemented.

## Explicitly Unsupported Rules

Spy/Recluse/Summoner registration, canonical poisoned Clockmaker production, impaired Vortox, free-form Storyteller selection, UI, Electron, SQLite, first-night completion, and Slice 2B18 remain unsupported or fail closed and receive no completeness claim.

## Rule Source Revisions

User overrides are pinned at Git revision `8fb8c0b6c42eee8320b1b4c4d9efdf4ec20707a8`. Chinese Clockmaker is oldid `6181`; official Clockmaker `2967`; Vortox `3017`; States `1039`; Glossary `2874`; Abilities `1376`; Philosopher `2421`; Snake Charmer `2905`. Official nightsheet is commit `3d6d930a9e600321f93b2567a2e88948a675bc1e`, SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`.

## Rule-to-Test Traceability

The approved continuous rows `1..99` are audited against direct assertions, parameterized histories, or explicit external evidence. Rows `1..31`, `35`, and `45..51` cover domain rules and contracts; rows `32..33` cover Philosopher insertion and task order; row `34` is only `EXTERNAL_RULE_EVIDENCE`; rows `36..44`, `52..53`, `64..72`, and `91..98` cover application behavior; rows `54..63` cover replay/batch behavior; rows `73..90` cover private projection and stored facts; row `99` preserves prior projections. Rows `86..89` independently construct and reject each required Vortox corruption.

## Distance Model

The complete numeric output domain is the dense integer set `0..6`. A native pair of distinct seats on the fixed 12-seat ring has truth distance `1..6`; both directions are measured and the shorter is used, then the minimum across both native Minions is selected. Sourced `0` represents an exceptional absence of a required identity set, but that canonical history is unsupported and fails closed. False-information candidate sets may still contain `0`.

## Native Character-Type Boundary

Demon and Minion identity is determined by the current role snapshot's native `characterType`, never alignment. A good Demon counts; an evil Townsfolk does not. The supported canonical state requires exactly one native Demon and two native Minions; unsupported identity counts fail closed.

## Registration Boundary

This slice is explicitly `NATIVE_CHARACTER_TYPE_ONLY`. It does not implement Storyteller registration decisions for Spy, Recluse, Summoner, or any other registration effect, and it does not claim native classification is the complete BOTC registration rule.

## Current-State Timing Boundary

Each delivery uses `CurrentCharacterState` at that Clockmaker task's settlement revision. A base Clockmaker after a supported Snake Charmer Demon swap uses the new current Demon seat. A Philosopher-gained task resolves at its earlier inserted position. Later role or alignment changes do not recompute a delivered fact.

## Philosopher-Gained Boundary

The gained path binds the exact Philosopher source player, seat, role, choice opportunity, grant, inserted `CLOCKMAKER_INFORMATION` task, and insertion revision. It is ordered after `PHILOSOPHER_ACTION` and before `MINION_INFO`. If an original Clockmaker is present, its later base task binds the preserved duplicate-role drunkenness chain.

## Impairment Candidate Boundary

Without Vortox, a canonically drunk Clockmaker retains all legal values `0..6`, including truth; deterministic simulation selects the smallest false value without redefining official legality. Pure poisoned legality is the same. A canonical poisoned-Clockmaker producer is not reachable in the accepted history and is not implemented; poisoned behavior is only a pure legality/fail-closed boundary.

## Vortox False-Information Boundary

An effective current Vortox excludes the rule-correct distance for effective or impaired Townsfolk information. Runtime and stored validation require exact active/effective Vortox tenure provenance. Missing, multiple, conflicting, inactive, malformed, or represented-impaired Vortox histories fail closed.

## Storyteller Discretion Boundary

The deterministic single-player policy selects one member of the sourced legal candidate set. It is simulation policy only, not the full Storyteller freedom to choose among legal correct/incorrect or false candidates. Registration discretion and free-form Storyteller UI remain unsupported.

## Historical Stored-Fact Boundary

Delivered knowledge is immutable historical fact. Stored validation binds the exact task, source, settlement revision, native references, pair snapshots, truth, candidate set, selection, impairment provenance, and settlement. The native-Demon/Vortox biconditional requires a stored native Vortox exactly when `VORTOX_FALSE_REQUIRED` is present, with one matching active/effective tenure for the same player, seat, and role; a non-Vortox native Demon cannot carry a forged Vortox constraint. Later current state cannot rewrite the delivery.

## Private Projection Boundary

Only the source receives `{ distance }`, model `clockmaker-information-v1`, and stage `CLOCKMAKER_INFORMATION`; player and AI views are identical. Native identities, pair geometry, rule-correct truth, candidates, impairment, Vortox, simulation policy, current state, assignment, task, and settlement internals are never projected.

## CI Results

Product implementation HEAD `69c3f0375883bd9ec7908b5f9f609dad5e6fcee5` passed historical [push CI run 29147953027](https://github.com/JackeyLovedas/botc-singleplayer/actions/runs/29147953027) and [pull-request CI run 29147961984](https://github.com/JackeyLovedas/botc-singleplayer/actions/runs/29147961984). Each run's Ubuntu `validate`, Windows deterministic job, and explicit 3-file / 46-test Clockmaker step succeeded. Round-1 final review on that product head returned historical `CODE_REVIEW_FIX_REQUIRED / RULE_REVIEW_PASS` solely because six committed documentation files were stale.

For the docs-only repair and every later review, the current review-head authority is the live GitHub PR #19 `headRefOid`; exact-head CI authority is the GitHub checks attached to that same live head. This committed artifact does not predict its own future commit SHA or run identifiers.

## Coverage Status

Clockmaker remains `PARTIAL`, never `COMPLETE`. Product local focused suites passed 7 files / 341 tests. Full and coverage runs each passed 28 files / 891 tests at 85.85% statements/lines, 79.93% branches, and 97.84% functions; `clockmaker.ts` reached 97.95% statements/lines, 91.42% branches, and 100% functions.

Remaining gates are successful push and pull-request checks attached to the live repaired PR head, one fresh complete independent final review on that exact head, both verbatim GitHub audit comments with matching head and empty blockers, comment re-read, and all merge requirements. No merge is authorized yet.
