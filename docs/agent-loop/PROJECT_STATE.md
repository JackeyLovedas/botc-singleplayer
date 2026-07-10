# Project State

## Product
- Repository: `JackeyLovedas/botc-singleplayer`
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
- Open slice PR: none.
- Branch: `main`.
- Latest accepted slice merge: `3f66c99a30e35cc6a0fd39d47285d5ec7bede84b` (PR #16).
- Last reviewed slice HEAD: `833967f44e73294903df47545982a9de86bb33ad`.
- Accepted tag: `phase-3-slice-2b14-seamstress-first-night-defer-skeleton`.
- PR #16 received independent `PASS`, `CODE_REVIEW_PASS`, and `RULE_REVIEW_PASS` at the exact reviewed HEAD.
- All four required PR #16 CI checks succeeded before merge.
- PR #16 was merged as `3f66c99a30e35cc6a0fd39d47285d5ec7bede84b`; the remote feature branch was deleted and `main` was pulled.
- The accepted 2B14 tag was pushed and points to the merge commit.
- Slice 2B14 remains the exact reviewed DEFER-only scope. It does not broaden Seamstress beyond the accepted `SKELETON` coverage and partial base first-night DEFER dimension.
- Candidate Slice 2B15 fresh Seamstress rule evidence is materialized verbatim at `docs/rules/evidence/2B15.md` from live sources retrieved on 2026-07-10.
- The architect's exact v3 amendment is applied to `docs/implementation/phase-3-slice-2b15-design.md`; every unlisted v2 line remains unchanged, and superseded versions remain available in Git history.
- V3 retains the shared base/Philosopher first-night pipeline, public capability, hidden-state non-oracle behavior, truth-favoring delivery, exact V1/V2 compatibility, N/M continuity, atomic batches, and extensible private historical projection.
- Independent design review round 1 inspected exact HEAD `a31562b5d0751128b94b82289c2d21e954ea5ad7`; its complete report is materialized at `docs/implementation/phase-3-slice-2b15-design-review-round-1.md` with verdict `RULE_DESIGN_FIX_REQUIRED`.
- The six blocker classes were exact Legacy V1/V2 discrimination, a non-leaking modifier capability boundary, tenure-based ability identity, explicit N/M continuity, corrected evidence/scenario claims, and exact extensible stored-fact private projection validation.
- Independent design review round 2 inspected exact `main@5059b49b2e7da4c6550ae513cf660f84abcb98f3`; its complete report is materialized at `docs/implementation/phase-3-slice-2b15-design-review-round-2.md` with a second `RULE_DESIGN_FIX_REQUIRED`.
- Independent design review round 3 inspected exact `main@bf6c0ecbb8ad8ddba244d69ccb53ec4b26b557ea` and v3 SHA-256 `a0de120b266e26a8d7fcea293b7cb5dbf24c8a4ea5e80cad7cfc121cb1adaa52`; its complete final report is materialized at `docs/implementation/phase-3-slice-2b15-design-review.md`.
- Final verdict is `RULE_DESIGN_PASS`; all six round-1 blockers and all three round-2 blockers are independently confirmed closed.
- A post-PASS architecture audit found three implementation-contract hazards outside BOTC rule interpretation: the v3 capability used a noncanonical script literal, accepted Seamstress results would disclose canonical evaluation payloads, and receipt lookup could not distinguish a reused command ID with a different structural command.
- The architect's latest corrected complete-replacement v3.1 erratum is materialized verbatim at `docs/implementation/phase-3-slice-2b15-design-erratum-v3.1.md` with SHA-256 `9d421f44a538e4599c03bccd7f631da18866aa6e709d28735e724af79d130528`.
- The erratum changes only exact capability identity, type/count-only accepted Seamstress results, and descriptor-captured structural receipt idempotency. Original v3 rule semantics, canonical event payloads/order, settlement behavior, modifier behavior, exclusions, and `PARTIAL` ceiling remain unchanged.
- Renewed independent review is required. Implementation is frozen; the exact in-progress `ids.ts` and untracked `seamstress.ts` are preserved in `stash@{0}` (`5ea5d3e9d1491af04a2b695b13ce7f75d7b46624`) and must not be restored before a renewed `RULE_DESIGN_PASS` and explicit controller resume.
- Reviewed implementation scope is limited to the first-night base and Philosopher-granted Seamstress pipeline, slice-local tenure reducer, existing-event adapter, atomic choice/spend/delivery/settlement chain, and historical private projection.
- Other-night recurrence, life/revival, Travellers, registration, Barista, No Dashii poison derivation, and a general role-change subsystem remain unauthorized; coverage may advance only to `PARTIAL` after all later gates pass.
- Research verdict is `RULE_READY`; rule coverage remains `SKELETON`; external-source conflicts are empty; no snapshot was used.
- The report preserves `2B15-R01` through `2B15-R13`, all mandatory source revisions and hashes, 39 required regression tests, and the stale `SV-SEAMSTRESS-DRUNK-DOES-NOT-SPEND` repository contradiction.
- Authoritative evidence says a legal impaired two-target use is spent; the stale handoff test is a non-authoritative repository defect, not an external-source conflict.
- No 2B15 implementation is active, no pull request exists, and no production/test/architecture/matrix change is present on `main`. Preserved uncommitted implementation work remains isolated in the named stash while the erratum is reviewed.

## Mandatory Rule Gate
- Canonical instructions: `docs/agent-loop/AUTOPILOT_PROMPT.md`.
- Configured roles: read-only `rule-researcher`, read-only `architect`, read-only `reviewer`, and sole-writer `implementer`; the concurrency cap remains three, so gated roles run sequentially where needed.
- Slice 2B14 completed the required rule-evidence, rule-design, independent review, implementation, CI, code/rule review, and merge gates.
- Slice 2B15 completed fresh live-source research, materialized evidence, the `RULE_READY` gate, an initial design, two fix-required review/revision rounds, exact v3 amendment, and independent final `RULE_DESIGN_PASS`.
- The current required step is renewed independent review of the exact corrected v3.1 erratum and original v3 contract. Implementation may resume only after renewed `RULE_DESIGN_PASS` and explicit controller direction.
- Required future order remains: bounded design -> independent `RULE_DESIGN_PASS` -> controller confirmation -> implementation -> focused/full gates -> ready PR -> CI -> independent code/rule review.
- `RULE_CONFLICT` and `RULE_SOURCE_UNAVAILABLE` map to `HUMAN_BLOCKED`.
- The exact committed v3 has its prior `RULE_DESIGN_PASS`, but the post-PASS corrected v3.1 erratum is pending renewed review. This erratum materialization authorizes no production, test, architecture, matrix, branch, PR, stash restoration, or tag work by itself.

## Loop Limits
- One open slice PR and one writer at a time.
- At most three reviewer repair rounds per PR.
- At most three completed slices in this goal run.
- Stop on substantive rule uncertainty, unsafe accepted-history rewrite, permissions/credential failure, unresolved merge conflict, repeated identical CI failure, or required test weakening.
