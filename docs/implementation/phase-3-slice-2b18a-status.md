# Phase 3 Slice 2B18A Implementation Status

> Status: `HUMAN_BLOCKED`, ledger-only repair round `3 / 3` exhausted on PR #23. Final review returned `CODE_REVIEW_FIX_REQUIRED / RULE_REVIEW_FIX_REQUIRED`; merge is prohibited.

## Scope

2B18A is limited to the canonical derived first-night ability outcome ledger foundation and replay anchor. The authority is `docs/implementation/phase-3-slice-2b18a-ledger-only-rescope.md` at SHA-256 `3415944f1a42bcaee8f0a7a990a6d8d148ad0169fea0a9e4697acfbfc9f44b44`. Rule evidence remains `RULE_READY / PARTIAL`; the four approved Mathematician overrides are unchanged.

Shape validation is not accepted-history provenance.

## Implemented

- `FirstNightInitialized` creates the derived ledger anchor and lower sequence boundary. No ledger event or accepted payload was added. The retained ledger alone does not re-prove an altered initialization event ID or every altered start-sequence case.
- Accepted terminal replay derives outcome facts from the terminal pre-state, re-derives the expected fact at the append boundary, requires exact canonical equality, rejects duplicate identities, and validates the appended ledger.
- Base, Philosopher-gained V1, and Philosopher-gained V2 ability-instance IDs use distinct grammars and structurally cross-check generation, task type, embedded seat/role, and grant role segments. The ledger adapter does not independently enforce the complete original Philosopher opportunity task/kind/status/source contract.
- Runtime gained tasks are reconstructed from `state.firstNightTaskInsertions` with the accepted generation-specific payload validators and compared exactly with the plan. The plan cannot certify its own inserted tasks.
- The 16 closed evidence variants, canonical ordering, duplicate/conflict rules, and frozen supported terminal classifications remain. Direct ledger-adapter tests cover structural evidence, selected ID mixing, ordering/conflicts, hostile values, lower anchor boundary, the Snake Charmer matrix, and part of the Dreamer/Vortox matrix; they do not directly prove every role chain required by the rescope.
- Public validators are explicitly named as shape validators. Canonical provenance exists only through complete accepted event-stream validation and rebuild; caller-created state or ledger is not a supported game-decision input.
- Ledger state remains excluded from player, AI, and public projections.
- `MATHEMATICIAN_INFORMATION` remains fail closed with `ApplicationNotConfigured`, `retryable=true`, no receipt, no event, no settlement, and no game-version increment.

## Deferred to 2B18B

- Any public or internal Mathematician true-count resolver.
- `MathematicianCountResolution` and all count classification/result contracts.
- Resolving context, count-window snapshot, runtime override carrier, own-instance exclusion execution, duplicate-holder counting, candidate number selection, impairment output selection, Vortox final number, private delivery, and task settlement.

No renamed or replacement API accepts caller-supplied state, ledger, context, window, source, instance, or override data to calculate a count. 2B18B and 2B19 have not started.

## Direct evidence actually executed

- `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`: structural shapes, selected V1/V2 ID mixing, canonical evidence ordering/conflicts, hostile values, lower anchor boundary, the Snake Charmer matrix, and part of the Dreamer/Vortox matrix.
- `packages/domain-core/src/rebuild.test.ts`: three added terminal ledger assertions for Witch and Dreamer happy paths. Existing role/replay tests validate underlying accepted payloads but do not replace the missing direct ledger-adapter cases.
- `packages/application/src/game-application-service.test.ts`: package-root resolver/count API absence and unchanged fail-closed `MATHEMATICIAN_INFORMATION` behavior.
- `packages/projections/src/private-knowledge-view.test.ts`: player and AI projection non-leakage.

## Final review blockers

1. The original Philosopher opportunity's task/kind/status/source contract and other required V1/V2 subgraph corruptions are not fully bound and directly tested by the ledger adapter.
2. Required anchor tampering, including altered `firstNightInitializedEventId` and altered start sequence, is not fully rejected and directly tested.
3. The approved rescope's direct adversarial ledger coverage remains substantially incomplete, including role-chain, roster, later-state, and cross-platform equivalence cases.
4. PR, status, and coverage-matrix traceability must remain narrowed to only enforced and directly executed contracts.

## Validation

- Typecheck: pass.
- Focused ledger and rebuild: `2 files / 197 tests passed`.
- Focused application: `1 file / 209 tests passed`.
- Lint: pass.
- Full test: `29 files / 938 tests passed`.
- Coverage: `86.22%` statements/lines, `80.28%` branches, `97.55%` functions.
- Exact product-head push CI `29218907974` and PR CI `29218909579` passed for `9c5d693fd4a2f0392a2deef8b4fba9436d0611a2`.
- Complete final review: `docs/implementation/phase-3-slice-2b18a-ledger-only-final-review-repair-round-3.md`, SHA-256 `041a420a8d7b43ae4f0f2cd733b9a5d518bf070d78299176f38ea61da379c7b9`, reverse integrity `MATCH`.
- Verdicts: `CODE_REVIEW_FIX_REQUIRED / RULE_REVIEW_FIX_REQUIRED`; four blockers remain.

## Coverage status

`PARTIAL / UNACCEPTED`. 2B18A provides only an incomplete ledger foundation and supported terminal adapters. It does not implement a Mathematician count, number, delivery, projection, or settlement and does not mark any role `COMPLETE`. No repair round 4, audit comments, merge, tag, 2B18B, or 2B19 is authorized.
