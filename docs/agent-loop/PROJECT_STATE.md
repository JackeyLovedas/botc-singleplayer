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

- Active slice: 2B16 effective-only Cerenovus, repair round 1; bounded implementation repair is authorized by renewed `RULE_DESIGN_PASS`.
- Branch: `phase-3/cerenovus-first-night-madness-marker`; preliminary product HEAD `a59a9489adbd5032bf6adac3d98e280d7d7cbd05` pushed.
- PR: [#18](https://github.com/JackeyLovedas/botc-singleplayer/pull/18); frozen reviewed HEAD `86d973485e940c0ef0469dd169db3ab1dc7a417d` returned both fix-required verdicts and is not mergeable.
- Rescope authorization: `CERENOVUS_EFFECTIVE_ONLY`.
- Source-impaired execution: `UNSUPPORTED_UNREACHABLE_IN_CURRENT_CANONICAL_HISTORY`.
- External rules remain `RULE_READY`; all original URLs, revisions, hashes, and impaired-source rule truth remain recorded.
- The prior design SHA beginning `4f474b7a` and prior `RULE_DESIGN_PASS` are superseded.
- Corrected event contract: choice, effective marker, target instruction, and `CERENOVUS_MADNESS_MARKED` settlement.
- The prior effective-only design review and green CI for `86d9734...` are historical only after repair; neither authorizes merge.
- Corrected evidence `5204b899...` and repair design `85869846...` address the schema, Vortox/alignment, source binding, hostile-ID, sparse-projection, replay-provenance, and exact-test-traceability specifications. Coverage remains `PARTIAL`.
- Corrected complete rule-design review SHA-256 `363271a48ae4f2595ef7287e850d8a38b4fa1b94e42f97b6b15b25d5de9da645` returned `RULE_DESIGN_PASS` for the prior repair design.
- Current repair design SHA-256 is `743affb3d47d0a16fc25b849b1dbe97bf9af07c9ff000cd793a61a5268300a12`; targeted renewed revalidation SHA-256 `643e1e1a5dee2030cf8205594f9a08a7f2415c514ea0466d35b988ec1874b34c` returned `RULE_DESIGN_PASS` with no blockers. Only trace row 62 changed, preserving the existing byte-identical CI workflow and pending exact-head CI requirement.
- This controlled round has `maxSlices=1`, `maxRepairRounds=2`, no heartbeat, and no 2B17 work.

## Rule And Design Gate

- Corrected Slice 2B16 evidence has every mandatory heading, both Vortox revisions/hashes, 27 regressions, `PARTIAL`, and ends in `RULE_READY`.
- The preserved prior review reports remain immutable audit history but do not authorize the rescope.
- Canonical reachability audit proved the only current impairment producers cannot affect a still-active base Cerenovus; direct constructed impairment sets are not stored histories.
- The user authorized an effective-only implementation rather than generic impairment infrastructure or another role.
- Corrected design removes the impaired settlement union, adds a no-write effective-only capability gate, and specifies 62 sequential regressions.
- Drunk/poison simulation remains true BOTC behavior but unsupported in this slice; this does not mean Cerenovus immunity.
- The complete final `FIX_REQUIRED` report is archived verbatim at `docs/implementation/phase-3-slice-2b16-final-review-round-1.md`.
- All four blockers are resolved in design but remain to be repaired and tested in production. The effective-only event contract is unchanged.

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

- Implement the exact bounded repair and direct tests, then run every local gate.
- Do not commit, push, review, merge, or tag before controller pre-publish audit.
- Do not begin Slice 2B17 in this controlled round.

## Loop Limits

- Keep one open slice PR and one writer at a time.
- This round permits one slice and at most two reviewer repair rounds for its future PR.
- Heartbeat is disabled, and Slice 2B17 is prohibited in this round.
- Stop on substantive rule uncertainty, unsafe accepted-history rewrite, permission/credential failure, unresolved merge conflict, repeated identical CI failure, or required test weakening.
