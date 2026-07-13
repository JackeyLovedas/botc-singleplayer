# Phase 3 Slice 2B18A Implementation Status

> Status: `RUNNING`, ledger-only gained-opportunity revision microfix round `5 / 5` on PR #23 under `USER_AUTHORIZED_2B18A_GAINED_OPPORTUNITY_REVISION_MICROFIX`. The bounded implementation and local gates pass; exact-head CI and fresh independent dual review are pending.

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
- Exact product-head push CI `29222876582` and PR CI `29222877872` passed for frozen reviewed HEAD `65121bb4c057e125f0304ff826970ae95427fee3`, including Ubuntu and Windows.
- Complete round-4 final review: `docs/implementation/phase-3-slice-2b18a-ledger-only-final-review-repair-round-4.md`, SHA-256 `d5a8c728070a34faf931ec2a1c913fb21c6680d62cf125c6dc769237be381ae1`, reverse integrity `MATCH`.
- Final verdicts: `CODE_REVIEW_FIX_REQUIRED / RULE_REVIEW_FIX_REQUIRED`.

## Coverage status

`PARTIAL / UNACCEPTED / RUNNING`. 2B18A provides only the ledger foundation and directly tested supported terminal adapters. Exact gained V1/V2 terminal-opportunity revision equality is implemented and traced to `[R5-V1-POSITIVE]`, `[R5-V1-STALE]`, `[R5-V1-LATER]`, `[R5-V2-POSITIVE]`, `[R5-V2-STALE]`, `[R5-V2-LATER]`, and retained future-revision regression `[R4-22]`. It does not implement a Mathematician count, number, delivery, projection, or settlement and does not mark any role `COMPLETE`. Repair round `5 / 5` is final; audit comments, merge, tag, 2B18B, and 2B19 remain prohibited until the exact-head CI and independent dual-review gates pass.
