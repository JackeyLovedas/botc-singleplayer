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

- Active slice: 2B16, effective-only Cerenovus first-night choice, marker history, and private instruction; implementation and local verification complete.
- Branch: `phase-3/cerenovus-first-night-madness-marker`; preserved dirty worktree, no commit, push, or PR.
- Rescope authorization: `CERENOVUS_EFFECTIVE_ONLY`.
- Source-impaired execution: `UNSUPPORTED_UNREACHABLE_IN_CURRENT_CANONICAL_HISTORY`.
- External rules remain `RULE_READY`; all original URLs, revisions, hashes, and impaired-source rule truth remain recorded.
- The prior design SHA beginning `4f474b7a` and prior `RULE_DESIGN_PASS` are superseded.
- Corrected event contract: choice, effective marker, target instruction, and `CERENOVUS_MADNESS_MARKED` settlement.
- Independent effective-only review returned `RULE_DESIGN_PASS` with no blockers for exact dirty HEAD `db1f09cc35b51f92f6e84ad8cd9c3cb1150983d0`, evidence `f0d8d976...`, and design `7c1c2bd7...`; the exact implementation is now complete locally and coverage remains `PARTIAL`.
- Full local gates pass after closing both controller evidence gaps: typecheck, lint, 22 files / 761 tests, coverage 22 files / 761 tests, and `git diff --check`. No commit, push, or PR exists yet.
- This controlled round has `maxSlices=1`, `maxRepairRounds=2`, no heartbeat, and no 2B17 work.

## Rule And Design Gate

- Slice 2B16 evidence is fresh, complete, and ends in `RULE_READY`.
- The preserved prior review reports remain immutable audit history but do not authorize the rescope.
- Canonical reachability audit proved the only current impairment producers cannot affect a still-active base Cerenovus; direct constructed impairment sets are not stored histories.
- The user authorized an effective-only implementation rather than generic impairment infrastructure or another role.
- Corrected design removes the impaired settlement union, adds a no-write effective-only capability gate, and specifies 62 sequential regressions.
- Drunk/poison simulation remains true BOTC behavior but unsupported in this slice; this does not mean Cerenovus immunity.
- The complete renewed review is archived verbatim at `docs/implementation/phase-3-slice-2b16-effective-only-design-review.md`; its report hash is recorded in the current Autopilot log.
- The reviewer found no blockers. Only the exact reviewed effective-only implementation is authorized.

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

- Controller performs the pre-publish scope/traceability audit of the completed dirty tree and status document.
- After controller authorization, commit with required attribution, push the same branch, and create one slice PR. Do not merge before exact-HEAD CI and complete independent final review.
- Do not begin Slice 2B17 in this controlled round.

## Loop Limits

- Keep one open slice PR and one writer at a time.
- This round permits one slice and at most two reviewer repair rounds for its future PR.
- Heartbeat is disabled, and Slice 2B17 is prohibited in this round.
- Stop on substantive rule uncertainty, unsafe accepted-history rewrite, permission/credential failure, unresolved merge conflict, repeated identical CI failure, or required test weakening.
