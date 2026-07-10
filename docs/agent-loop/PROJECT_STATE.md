# Project State

## Product

- Repository: `JackeyLovedas/botc-singleplayer`.
- Target: offline single-player Sects & Violets, 12 players (1 human + 11 AI), automated Storyteller.
- Phase: Phase 3 controlled vertical slices.
- Rules baseline: Phase One v2.1.

## Accepted Slices

- 2B1 deterministic S&V setup.
- 2B2 roster and character assignment.
- 2B3 first-night own-character knowledge.
- 2B4 first-night task plan.
- 2B5 ordered minion/demon information settlement.
- 2B6 Philosopher action opportunity and defer settlement.
- 2B7 Philosopher ability choice and dynamic task insertion foundation.
- 2B8 Philosopher-gained Snake Charmer non-demon settlement.
- 2B9 Snake Charmer demon-hit swap and poison marker.
- 2B10 base Snake Charmer action and effectiveness gate.
- 2B11 Evil Twin setup and pair knowledge.
- 2B12 Witch target choice and deferred-death marker.
- 2B13 Dreamer action and historical information delivery.
- 2B14 Seamstress base first-night opportunity and DEFER settlement skeleton.

## Current Delivery

- Candidate slice: 2B15 Seamstress first-night choice, stable ability tenure, and truth-favoring private information.
- Branch: `phase-3/seamstress-first-night-choice-information`.
- Branch base: `5c8712f95e68cae68c4c8e5c194dd96aa05aa284`.
- Open slice PR: none yet; local implementation is ready to publish.
- Latest accepted slice merge: `3f66c99a30e35cc6a0fd39d47285d5ec7bede84b` (PR #16).
- Accepted tag: `phase-3-slice-2b14-seamstress-first-night-defer-skeleton`.
- No 2B15 merge or tag is authorized.

## Rule And Design Gate

- Fresh live-source evidence: `docs/rules/evidence/2B15.md`, verdict `RULE_READY`, no unresolved external-source conflict.
- Reviewed design v3: `docs/implementation/phase-3-slice-2b15-design.md`, SHA-256 `a0de120b266e26a8d7fcea293b7cb5dbf24c8a4ea5e80cad7cfc121cb1adaa52`.
- Corrected v3.1 erratum: `docs/implementation/phase-3-slice-2b15-design-erratum-v3.1.md`, SHA-256 `9d421f44a538e4599c03bccd7f631da18866aa6e709d28735e724af79d130528`.
- Renewed independent review: `docs/implementation/phase-3-slice-2b15-design-erratum-v3.1-review.md`, SHA-256 `93f81070e6f0a77e7f38c64c0232c6d0f847a3abfb78183ec792cd4f12d3fc3c`, verdict `RULE_DESIGN_PASS`, blockers none.
- The stale `SV-SEAMSTRESS-DRUNK-DOES-NOT-SPEND` handoff expectation remains non-authoritative. The implemented represented-impaired legal use spends, as required by reviewed evidence.

## Implemented 2B15 Boundary

- Public, hidden-state-independent Seamstress resolution capability for new supported-script streams; legacy streams remain V1 defer-only compatible.
- Exact V1/V2 opportunity discrimination and deterministic base versus Philosopher-granted sources.
- Slice-local role-tenure transition facts plus stable base/Philosopher ability instances and once-per-game entitlements.
- One shared base/Philosopher first-night target-choice, spend, information, and settlement pipeline.
- Atomic four-event choice chain and exact two-event V1/V2 defer chains.
- Settlement-time native alignment comparison; represented impairment evidence remains distinct from unresolved continuous effects.
- Represented active-tenure Vortox false-information constraint with separate candidate legality, reliability, and simulation reason.
- Exact source-only historical player/AI projection with multiple-delivery history and fail-closed stored-chain validation.
- Seamstress-only accepted event-type/count summaries; full canonical events remain in the event store.
- Descriptor-captured structural fingerprints, exact canonical-string command equivalence, and fail-closed idempotency conflict behavior.
- Only `MemoryCommandCommitStore` exists; there is no production adapter or schema migration in scope.

## Coverage And Exclusions

- Seamstress overall coverage: `PARTIAL`, never `COMPLETE`.
- Partial: base first-night choice/spend/information, Philosopher-granted first-night execution, represented drunk/poison behavior, represented Vortox behavior, tenure continuity, and historical private projection.
- Unsupported: other-night recurrence, life/death/revival, Travellers, Spy/Recluse registration, Barista, No Dashii adjacency/continuous-poison derivation, Storyteller free answer policy, and a general character/effect lifecycle.
- No UI, Electron, SQLite, network, or production persistence work is included.

## Verification

- Focused affected suites: 5 files / 476 tests passed.
- Windows-compatible application package command: 3 files / 171 tests passed.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm test`: 21 files / 709 tests passed.
- `pnpm test:coverage`: 21 files / 709 tests passed.
- Coverage: 85.04% statements/lines, 78.13% branches, 97.58% functions.
- Final scope audit hardened exact stored V2 opportunity/source correlation and corrected the synthetic multiple-history fixture to a canonical second opportunity ID; all gates passed afterward.

## Mandatory Next Gates

1. Commit and push the bounded implementation with required attribution.
2. Open one ready slice PR with rule-evidence traceability, conservative coverage, exclusions, and local gate evidence.
3. Required CI must pass on the exact PR HEAD.
4. Independent reviewer must return both `CODE_REVIEW_PASS` and `RULE_REVIEW_PASS` on that exact HEAD.
5. Reviewed HEAD must equal PR HEAD and the worktree must be clean before merge.
6. The implementer must not merge or start the next slice.

## Loop Limits

- One open slice PR and one writer at a time.
- At most three reviewer repair rounds per PR.
- Stop on substantive rule uncertainty, unsafe accepted-history rewrite, permission/credential failure, unresolved merge conflict, repeated identical CI failure, or required test weakening.
