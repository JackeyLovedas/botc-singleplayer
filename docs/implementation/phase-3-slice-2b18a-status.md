# Phase 3 Slice 2B18A Implementation Status

> Status: `COMPLETED`. The ledger-only Slice 2B18A implementation merged through PR #23 after exact-head CI and independent `CODE_REVIEW_PASS / RULE_REVIEW_PASS`; no blockers remain.

## Scope

2B18A is limited to the canonical derived first-night ability outcome ledger foundation and replay anchor. The authority is `docs/implementation/phase-3-slice-2b18a-ledger-only-rescope.md` at SHA-256 `3415944f1a42bcaee8f0a7a990a6d8d148ad0169fea0a9e4697acfbfc9f44b44`. Rule evidence remains `RULE_READY / PARTIAL`; the four approved Mathematician overrides are unchanged.

Shape validation is not accepted-history provenance.

## Implemented

- `FirstNightInitialized` alone creates the derived ledger anchor plus an internal envelope-provenance record. Rebuild requires the anchor and provenance to equal the unique accepted initialization envelope; direct tests reject all ten authorized anchor-tampering cases. No ledger event or accepted payload was added.
- Accepted terminal replay derives outcome facts from the terminal pre-state, re-derives the expected fact at the append boundary, requires exact canonical equality, rejects duplicate identities, and validates the appended ledger.
- Base, Philosopher-gained V1, and Philosopher-gained V2 ability-instance IDs use distinct grammars and cross-check generation, task type, embedded seat/role, and grant role segments. Gained action tasks separately bind the closed original Philosopher opportunity and the gained-role action opportunity, including exact equality between the terminal opportunity revision and the retained Philosopher task/choice/grant/insertion/original-opportunity/ability-instance revision. Gained information tasks bind the original Philosopher opportunity without inventing a role-action opportunity.
- Runtime gained tasks are reconstructed from `state.firstNightTaskInsertions` with the accepted generation-specific payload validators and compared exactly with the plan. The plan cannot certify its own inserted tasks.
- The 16 closed evidence variants, canonical ordering, duplicate/conflict rules, and frozen supported terminal classifications remain. Direct adapter assertions cover base terminals, V1/V2 gained chains, roster binding, Clockmaker, Dreamer, Seamstress, Cerenovus, Snake Charmer, all ten anchor mutations, deterministic rebuild/key order, projection non-leakage, and the fail-closed Mathematician boundary.
- Public validators are explicitly named as shape validators. Canonical provenance exists only through complete accepted event-stream validation and rebuild; caller-created state or ledger is not a supported game-decision input.
- Ledger state remains excluded from player, AI, and public projections.
- `MATHEMATICIAN_INFORMATION` remains fail closed with `ApplicationNotConfigured`, `retryable=true`, no receipt, no event, no settlement, and no game-version increment.

## Deferred to 2B18B

- Any public or internal Mathematician true-count resolver.
- `MathematicianCountResolution` and all count classification/result contracts.
- Resolving context, count-window snapshot, runtime override carrier, own-instance exclusion execution, duplicate-holder counting, candidate number selection, impairment output selection, Vortox final number, private delivery, and task settlement.

No renamed or replacement API accepts caller-supplied state, ledger, context, window, source, instance, or override data to calculate a count. 2B18B and 2B19 have not started.

## Direct evidence actually executed

- `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`, describe `Round 4 direct ledger adapter anchor, opportunity, roster, and replay matrix`: base tampering, roster, Dreamer `R4-51..59`, and anchor `R4-A1..A10`; the same file retains the direct Snake historical quadrant.
- `packages/domain-core/src/rebuild.test.ts`, describe `Round 4 direct gained V1 ledger adapter matrix`: accepted V1 plus `R4-14..23`; accepted base Witch, Evil Twin, and V1 Snake rebuild tests assert emitted facts.
- `packages/application/src/game-application-service.test.ts`: accepted V2 Snake plus `R4-25..37`; Clockmaker `R4-45..50`; Seamstress `R4-60..66`; Cerenovus `R4-67..75`; accepted base Snake, Dreamer, Clockmaker, Seamstress, and Cerenovus facts; repeated/key-reordered rebuild; package-root API absence; unchanged fail-closed `MATHEMATICIAN_INFORMATION`.
- `packages/projections/src/private-knowledge-view.test.ts`: player and AI projection non-leakage.

## Round 5 microfix

The round-4 consolidated blocker is implemented without changing BOTC semantics or the ledger-only boundary. Canonical pre-event derivation now requires a terminal gained-role action opportunity represented by `PHILOSOPHER_GAINED_TASK_V1` or `PHILOSOPHER_GAINED_TASK_V2` provenance to use the same `sourceCharacterStateRevision` as the already validated Philosopher task source, choice, grant, recorded insertion, original Philosopher opportunity, and ability-instance provenance. The equality is checked before `ACTION_OPPORTUNITY` evidence is emitted. Standalone fact cross-link validation also binds terminal opportunity and grant evidence to the ability-instance revision when terminal opportunity evidence exists.

The rule does not require the canonical gained revision to equal the later evaluated revision. Direct V1 and V2 fixtures pass with canonical `N=2` and evaluated `M=3`; earlier in-range `1`, later in-range `3`, and future revisions are rejected. Base role opportunities and `EXPLICIT_DOMAIN_INSTANCE` paths, including Seamstress V2, retain their existing semantics.

## Validation

- Typecheck: pass.
- Lint: pass.
- Focused ledger/rebuild/application: `46 / 196 / 212 tests passed`.
- Full test: `29 files / 986 tests` pass.
- Coverage: `86.35%` statements/lines, `81.21%` branches, and `97.57%` functions; gate passes.
- Frozen product HEAD `671622b9f368a6201840ea0cb3d5b8254065bff8`: push CI `29226220051` and PR CI `29226221291` passed.
- Merge SHA `00a12062e2dc7a99ef01b2fbddc3a5dc4d666fa6`: main push CI `29227191271` and accepted-tag push CI `29227406815` passed.
- Final review comments are archived verbatim in `docs/reviews/pr-23-code-review-final.md` and `docs/reviews/pr-23-rule-review-final.md`; their exact GitHub body hashes are `eb5b5ad26848a78a51ec59467dc2e56170601b9fbdd6c5932e561f1262b6ef6e` and `44baa6bfbc07d88db188d6882be9fc65cd8005831f2599b929b72f425fa01f32`.
- Final verdicts: `CODE_REVIEW_PASS / RULE_REVIEW_PASS`; `remainingBlockers=[]`.

## Coverage status

`PARTIAL / ACCEPTED / COMPLETED`. 2B18A provides only the ledger foundation and directly tested supported terminal adapters. Exact gained V1/V2 terminal-opportunity revision equality is implemented and traced to `[R5-V1-POSITIVE]`, `[R5-V1-STALE]`, `[R5-V1-LATER]`, `[R5-V2-POSITIVE]`, `[R5-V2-STALE]`, `[R5-V2-LATER]`, and retained future-revision regression `[R4-22]`. It does not implement a public true-count resolver, `MathematicianCountResolution`, Mathematician number, delivery, private count projection, or settlement and does not mark any role `COMPLETE`. `MATHEMATICIAN_INFORMATION` remains fail closed and unsettled. Mathematician remains `PARTIAL`; 2B18B and 2B19 have not started.

## Post-merge closeout

- PR #23 merged at `2026-07-13T05:47:40Z`.
- Accepted tag: `phase-3-slice-2b18a-first-night-ability-outcome-ledger` at the merge SHA.
- The remote feature branch was deleted. Control returned to clean `main` with no active PR or slice.
- The future docs-only closeout commit and its GitHub run cannot be self-recorded here. Any closeout CI claim must cite a run for that exact pushed closeout SHA and must not inherit product-head or merge-commit CI.
- Stop after closeout; no 2B18B or 2B19 work is authorized.
