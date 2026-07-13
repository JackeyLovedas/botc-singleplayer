# Phase 3 Slice 2B18A Implementation Status

> Status: `RUNNING`, ledger-only repair round `3 / 3` on PR #23. Scope review returned `SCOPE_REVIEW_PASS`; final code/rule review and merge gates remain pending.

## Scope

2B18A is limited to the canonical derived first-night ability outcome ledger foundation and replay anchor. The authority is `docs/implementation/phase-3-slice-2b18a-ledger-only-rescope.md` at SHA-256 `3415944f1a42bcaee8f0a7a990a6d8d148ad0169fea0a9e4697acfbfc9f44b44`. Rule evidence remains `RULE_READY / PARTIAL`; the four approved Mathematician overrides are unchanged.

Shape validation is not accepted-history provenance.

## Implemented

- `FirstNightInitialized` creates the derived ledger and exact exclusive replay anchor. No ledger event or accepted payload was added.
- Accepted terminal replay derives outcome facts from the terminal pre-state, re-derives the expected fact at the append boundary, requires exact canonical equality, rejects duplicate identities, and validates the appended ledger.
- Base, Philosopher-gained V1, and Philosopher-gained V2 ability-instance IDs use distinct grammars and bind task generation/type, embedded seat/role, grant role, chosen role, source revision, opportunity, insertion, and runtime plan.
- Runtime gained tasks are reconstructed from `state.firstNightTaskInsertions` with the accepted generation-specific payload validators and compared exactly with the plan. The plan cannot certify its own inserted tasks.
- The 16 closed evidence variants, canonical ordering, duplicate/conflict rules, historical role facts, role tenure, impairment evidence, and supported Philosopher, Snake Charmer, Evil Twin, Witch, Cerenovus, Clockmaker, Dreamer, and Seamstress classifications remain frozen.
- Public validators are explicitly named as shape validators. Canonical provenance exists only through complete accepted event-stream validation and rebuild; caller-created state or ledger is not a supported game-decision input.
- Ledger state remains excluded from player, AI, and public projections.
- `MATHEMATICIAN_INFORMATION` remains fail closed with `ApplicationNotConfigured`, `retryable=true`, no receipt, no event, no settlement, and no game-version increment.

## Deferred to 2B18B

- Any public or internal Mathematician true-count resolver.
- `MathematicianCountResolution` and all count classification/result contracts.
- Resolving context, count-window snapshot, runtime override carrier, own-instance exclusion execution, duplicate-holder counting, candidate number selection, impairment output selection, Vortox final number, private delivery, and task settlement.

No renamed or replacement API accepts caller-supplied state, ledger, context, window, source, instance, or override data to calculate a count. 2B18B and 2B19 have not started.

## Direct evidence

- `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`: strict BASE/V1/V2 identity grammar, generation/seat/role rejection, all evidence shapes, canonical identities/order, hostile shapes, deep-clone validation, lower anchor boundary, Snake Charmer matrix, Dreamer/Vortox matrix, and impairment cause cross-links.
- `packages/domain-core/src/rebuild.test.ts`: accepted insertion reconstruction, plan self-certification rejection, replay anchor/facts, terminal adapters, malformed role chains, deterministic rebuild, and later-state preservation.
- `packages/application/src/game-application-service.test.ts`: package-root count API absence, gained provenance paths, and unchanged fail-closed `MATHEMATICIAN_INFORMATION` behavior.
- `packages/projections/src/private-knowledge-view.test.ts`: player and AI projection non-leakage.

## Validation

- Typecheck: pass.
- Focused ledger and rebuild: `2 files / 197 tests passed`.
- Focused application: `1 file / 209 tests passed`.
- Lint: pass.
- Full test: `29 files / 938 tests passed`.
- Coverage: `86.22%` statements/lines, `80.28%` branches, `97.55%` functions.
- Diff and forbidden scans pass. Exact-head CI and a fresh independent final review remain pending.

## Coverage status

`PARTIAL`. 2B18A provides only the ledger foundation and supported terminal adapters. It does not implement a Mathematician count, number, delivery, projection, or settlement and does not mark any role `COMPLETE`.
