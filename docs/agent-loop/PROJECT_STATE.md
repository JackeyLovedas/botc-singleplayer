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
- 2B15 Seamstress first-night choice, stable ability tenure, and truth-favoring private information.

## Current Delivery

- No active slice or pull request.
- Branch: clean `main`, synchronized from merge commit `ee77565e1935701084b51ae7d4dd8764023d2352`.
- Accepted PR: #17 (`https://github.com/JackeyLovedas/botc-singleplayer/pull/17`).
- Exact reviewed PR HEAD: `6020dd9849ca164880975b9c5c39f5639f6a68c9`.
- Controller-collected independent review: `PASS`, `CODE_REVIEW_PASS`, and `RULE_REVIEW_PASS` on that exact HEAD.
- Latest accepted slice merge: `ee77565e1935701084b51ae7d4dd8764023d2352` (PR #17).
- Accepted tag: `phase-3-slice-2b15-seamstress-first-night-choice-information`, pointing to the merge commit locally and remotely.
- The remote feature branch `phase-3/seamstress-first-night-choice-information` is deleted.
- Status: `COMPLETED`; this governed run accepted slices 2B13, 2B14, and 2B15 and reached its maximum 3/3 slice limit.

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
- Exact source-only historical player/AI projection with multiple-delivery history, fail-closed stored-chain validation, and global opportunity/task/entitlement chain uniqueness.
- Seamstress-only accepted event-type/count summaries; full canonical events remain in the event store.
- Descriptor-captured structural fingerprints, exact canonical-string command equivalence, pre-reflection rejection of every stored fingerprint Proxy, and fail-closed idempotency conflict behavior.
- Only `MemoryCommandCommitStore` exists; there is no production adapter or schema migration in scope.

## Coverage And Exclusions

- Seamstress overall coverage: `PARTIAL`, never `COMPLETE`.
- Partial: base first-night choice/spend/information, Philosopher-granted first-night execution, represented drunk/poison behavior, represented Vortox behavior, tenure continuity, and historical private projection.
- Unsupported: other-night recurrence, life/death/revival, Travellers, Spy/Recluse registration, Barista, No Dashii adjacency/continuous-poison derivation, Storyteller free answer policy, and a general character/effect lifecycle.
- No UI, Electron, SQLite, network, or production persistence work is included.

## Verification

- The final controller-collected independent review returned `PASS`, `CODE_REVIEW_PASS`, and `RULE_REVIEW_PASS` for exact PR HEAD `6020dd9849ca164880975b9c5c39f5639f6a68c9`.
- All four required PR #17 CI checks succeeded before merge.
- Focused repair suites: 2 files / 187 tests passed.
- Windows-compatible application package command: 3 files / 173 tests passed.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm test`: 21 files / 717 tests passed.
- `pnpm test:coverage`: 21 files / 717 tests passed.
- Coverage: 85.04% statements/lines, 78.12% branches, 97.58% functions.
- Repair validation reproduced the A-for-B time-varying Proxy equality and idempotent-receipt failures, then verified all stored fingerprint Proxies are rejected before traps or reflection; all targeted and full gates passed afterward.

## Paused State

- Slice 2B15 is accepted; Seamstress remains conservatively `PARTIAL`, never `COMPLETE`.
- The governed run is complete at 3/3 slices and must not automatically select, research, design, or implement another slice.
- Any future continuation requires a new explicit user goal or controller authorization and fresh stage gates.

## Loop Limits

- The completed run preserved one open slice PR and one writer at a time.
- At most three reviewer repair rounds per PR.
- The run stopped after its third accepted slice, as required.
- Stop on substantive rule uncertainty, unsafe accepted-history rewrite, permission/credential failure, unresolved merge conflict, repeated identical CI failure, or required test weakening.
