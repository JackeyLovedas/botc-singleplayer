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

- Candidate slice: 2B16, Cerenovus rule-evidence and design gate.
- Branch: clean `main`; no feature branch or open slice PR.
- Governance base and research boundary: `7d8694f21d0f6d6ea6226b385bd893dd42754188`.
- Fresh evidence: `docs/rules/evidence/2B16.md`, SHA-256 `6306ec6c008c72c276ccbf1fcddc0b14dd299ae5ded015c1bb55b6693aff2ef9`.
- Status: `RULE_READY`; all required sources were available, `snapshotUsed=false`, `unresolvedConflicts=[]`, and coverage is `PARTIAL`.
- Next authorized stage: one bounded read-only architect. No implementation branch, production change, test change, or PR is authorized.
- This controlled round has `maxSlices=1`, `maxRepairRounds=2`, no heartbeat, and no 2B17 work.

## Rule And Design Gate

- Slice 2B16 evidence is fresh, complete, and ends in `RULE_READY`.
- The impaired-source hard gate is explicit: choice and private notification are simulated, while real madness requirement, marker, and execution authority are absent.
- The stale `SV-CERENOVUS-POISONED-NO-MADNESS` no-notification clause is non-authoritative and must be replaced by the sourced split.
- No Slice 2B16 architecture or design review exists yet. A materialized bounded design and complete independent `RULE_DESIGN_PASS` are required before implementation.

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

## Next Gate

- Launch one bounded read-only architect for Slice 2B16 only.
- Do not create a feature branch, edit production code or tests, or open a PR before the design is materialized and independently receives `RULE_DESIGN_PASS`.
- Do not begin Slice 2B17 in this controlled round.

## Loop Limits

- Keep one open slice PR and one writer at a time.
- This round permits one slice and at most two reviewer repair rounds for its future PR.
- Heartbeat is disabled, and Slice 2B17 is prohibited in this round.
- Stop on substantive rule uncertainty, unsafe accepted-history rewrite, permission/credential failure, unresolved merge conflict, repeated identical CI failure, or required test weakening.
