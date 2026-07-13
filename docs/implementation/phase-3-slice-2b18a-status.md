# Phase 3 Slice 2B18A Implementation Status

> Status: `RUNNING`, ledger-only final repair round `4 / 4` on PR #23 under `USER_AUTHORIZED_2B18A_LEDGER_ONLY_FINAL_REPAIR_ROUND_4`. Only the four retained final-review blocker groups are authorized; merge remains prohibited pending fresh dual-pass review.

## Scope

2B18A is limited to the canonical derived first-night ability outcome ledger foundation and replay anchor. The authority is `docs/implementation/phase-3-slice-2b18a-ledger-only-rescope.md` at SHA-256 `3415944f1a42bcaee8f0a7a990a6d8d148ad0169fea0a9e4697acfbfc9f44b44`. Rule evidence remains `RULE_READY / PARTIAL`; the four approved Mathematician overrides are unchanged.

Shape validation is not accepted-history provenance.

## Implemented

- `FirstNightInitialized` alone creates the derived ledger anchor plus an internal envelope-provenance record. Rebuild requires the anchor and provenance to equal the unique accepted initialization envelope; direct tests reject all ten authorized anchor-tampering cases. No ledger event or accepted payload was added.
- Accepted terminal replay derives outcome facts from the terminal pre-state, re-derives the expected fact at the append boundary, requires exact canonical equality, rejects duplicate identities, and validates the appended ledger.
- Base, Philosopher-gained V1, and Philosopher-gained V2 ability-instance IDs use distinct grammars and cross-check generation, task type, embedded seat/role, and grant role segments. Gained action tasks separately bind the closed original Philosopher opportunity and the gained-role action opportunity; gained information tasks bind the original Philosopher opportunity without inventing a role-action opportunity.
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

## Final review blockers

The four repair-round-3 blocker groups are implemented locally and full local gates pass. They remain unaccepted until exact-head Ubuntu/Windows CI and a fresh complete independent review return both pass verdicts with no blocker.

## Validation

- Typecheck: pass.
- Focused ledger and rebuild: `2 files / 239 tests passed`.
- Focused application: `1 file / 209 tests passed`.
- Lint: pass.
- Combined ledger/rebuild/application: `3 files / 448 tests passed`.
- Full test: `29 files / 980 tests` pass.
- Coverage: `86.34%` statements/lines, `81.15%` branches, and `97.56%` functions; gate passes.
- Exact product-head push CI `29218907974` and PR CI `29218909579` passed for `9c5d693fd4a2f0392a2deef8b4fba9436d0611a2`.
- Complete final review: `docs/implementation/phase-3-slice-2b18a-ledger-only-final-review-repair-round-3.md`, SHA-256 `041a420a8d7b43ae4f0f2cd733b9a5d518bf070d78299176f38ea61da379c7b9`, reverse integrity `MATCH`.
- Prior verdicts remain historical only: `CODE_REVIEW_FIX_REQUIRED / RULE_REVIEW_FIX_REQUIRED`. Fresh final review has not run.

## Coverage status

`PARTIAL / UNACCEPTED`. 2B18A provides only the ledger foundation and directly tested supported terminal adapters while final repair round `4 / 4` awaits exact-head CI and review. It does not implement a Mathematician count, number, delivery, projection, or settlement and does not mark any role `COMPLETE`. No repair round 5, premature audit comments, merge, tag, 2B18B, or 2B19 is authorized.
