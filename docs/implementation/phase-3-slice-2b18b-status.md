# Phase 3 Slice 2B18B Implementation Status

> Status: `COMPLETED / ACCEPTED / MERGED`. PR [#24](https://github.com/JackeyLovedas/botc-singleplayer/pull/24) merged frozen feature HEAD `00afa42169cd3c3cab724d7bf7bf07a2a6ed1d87` as `681f4f8a9bc9f7a909b64a30e0a7879cb4b5128c` at `2026-07-13T14:18:39Z`. Independent final review returned `CODE_REVIEW_PASS / RULE_REVIEW_PASS` with `remainingBlockers=[]`; accepted tag `phase-3-slice-2b18b-mathematician-first-night-information` resolves to the merge SHA.

## Scope

This slice implements first-night Mathematician count resolution, exact information delivery, settlement, terminal outcome-ledger fact, trusted replay validation, and private count projection under the Round 3 authority and Option A support boundary. It does not change external rules, approved overrides, V1 ordering, or Slice 2B18A history, and it does not begin 2B19.

## Implemented and accepted

- Public exact Math payload/state/view/provenance contracts, deterministic ID parser/formatter, fixed `0..11` domain, smallest-false policy, impairment/Vortox carriers, and exact shape validators.
- Internal Layer A complete-stream decision, Layer B prospective pair validation, Layer C per-event replay adapter, trusted replay checkpoints, and a separately named stored-chain validator. Internal decision and replay functions are absent from the package root.
- Unified validated Mathematician inventory and six-valued Option A classifier. Inventory validates runtime plan source facts, base uniqueness, one-to-one recorded insertion reconstruction, generation, choice, grant, original closed Philosopher opportunity, roster, catalog, revision, and canonical ability instance before support classification. Malformed or mixed history maps to canonical invalidity before V1 duplicate unsupported classification.
- Exact two-event delivery/settlement batch, delivery-time terminal fact, settlement-time unique delivery+fact/evidence check, impairment-envelope replay provenance, and one logical game-version increment.
- State-only private projection fails closed for Math history. Accepted-stream player and AI projection use trusted replay and expose only `{count}` plus the Math model/stage.
- Accepted integration fixtures cover base, V1 gained-only, V2 gained-only, and V2 base-plus-gained temporal behavior. Hostile cases cover missing grant/insertion/opportunity, role/revision/seat cross-link tampering, and V1-plan/V2-insertion mixing.
- Direct semantic seams cover distinct-player deduplication, redundant unresolved facts, non-vacuous own-instance exclusion, missing/conflicting Vortox provenance, stable multiple-gained ordering, poison terminal cause, complete cause matrix, pipeline-state mismatch, and Layer A/B/C call boundaries. These seams remain non-root internal contracts and are exercised by the production paths they freeze.

## Final-review repair round 1

- Complete immutable review report: `docs/implementation/phase-3-slice-2b18b-final-review-repair-round-1.md`, SHA-256 `6933ce65cd6b6a149fa8eaa18d2a6246fd6862080e1b34c65b8dbb24a78e4157`.
- Replaced the raw caller-state decision seam with the private unique-symbol-branded `CanonicalMathematicianContext`, the two authorized builders, and one shared pure derivation core used by Layers A and C.
- Added Layer B's exact five-code failure union and successful prospective-state fingerprint.
- Hardened canonical delivery evidence identity, the Mathematician-specific 13-slot evidence order and matrix, known-impaired Vortox role/tenure/impairment evidence, continuous-tenure applicability, target-before-Option-A validation, and payload identity/order cross-links.
- Added direct repair regressions `[R1-CONTEXT-01]` through `[R1-TARGET-10]`, plus `[R1-EVIDENCE-05B]` for unchanged non-Mathematician evidence ordering. No rule semantics, Option A classification, V1 ordering, public resolver boundary, or Slice scope changed.

## Test traceability

The exact 225-item semantic classification and repair-contract mapping are in `docs/implementation/phase-3-slice-2b18b-test-traceability.md`. The accepted frozen feature HEAD `00afa42169cd3c3cab724d7bf7bf07a2a6ed1d87` completed `Original-140` through push CI `29255450083` and pull-request CI `29255453509`, both `SUCCESS`. The `422`-test Math runner count remains supporting evidence, not a substitute for semantic traceability.

## Local validation

- Full ESLint: pass.
- Typecheck: pass.
- Math suite: `422 / 422` pass.
- Focused eight-file ledger/batch/rebuild/Philosopher/Clockmaker replay/application/Math/projection gate: `8 files / 1020 tests` pass.
- Full test: `30 files / 1408 tests` pass.
- Coverage: `30 files / 1408 tests` pass; `86.78%` statements/lines, `81.52%` branches, `97.78%` functions.
- `git diff --check`, strict control JSON parse, root-export/internal resolver, caller-state/caller-ledger resolver, nondeterminism, raw JSON semantic comparison, sparse-array, and deleted-test scans: pass. State-shape validator name matches and dense-array-guarded `.every` calls were reviewed as non-resolver/non-sparse false positives.
- `Original-140` is complete for the accepted frozen feature HEAD `00afa42169cd3c3cab724d7bf7bf07a2a6ed1d87` through successful exact-head push/PR CI `29255450083 / 29255453509`.

## Rule coverage

`PARTIAL`. Implemented only for first night, fixed twelve-player/no-Traveller scope, represented drunkenness/poisoning evidence, represented Vortox state, approved deterministic selection, Option A, and safe private count projection. Other-night behavior, general poisoning, Travellers, free Storyteller number discretion, broader character/alignment/death interactions, and general dawn reset remain unsupported. No role is `COMPLETE`.

## Acceptance and CI provenance

- Frozen feature HEAD: `00afa42169cd3c3cab724d7bf7bf07a2a6ed1d87`.
- Final verdicts: `CODE_REVIEW_PASS / RULE_REVIEW_PASS`; `remainingBlockers=[]`.
- Final review archives: `docs/reviews/pr-24-code-review-final.md` and `docs/reviews/pr-24-rule-review-final.md`. Their exact original comment-body SHA-256 values are `a30abaf035b4c5fd7f8060a7282b6e77e153ba5529fb4cafabcaa9fb5a366189` and `ba3c58d168ec21f0fbab3133d0eb62d8f97a0a68ef210b22d02b5f473cdd92cf`.
- `productHeadCI`: push `29255450083` and pull request `29255453509`, both `SUCCESS` for the frozen feature HEAD.
- `mergeCommitCI`: main run `29257399469` attempt 1 failed because the existing Cerenovus batch-event/clock-position retry test exceeded its 5,000 ms timeout; attempt 2 completed `SUCCESS` for merge SHA `681f4f8a9bc9f7a909b64a30e0a7879cb4b5128c`. Accepted-tag run `29257432523` also completed `SUCCESS` for that exact merge SHA.
- `closeoutCommitCI`: `PENDING` for the future exact docs-only closeout commit SHA and run. It inherits no product-head, merge-commit, retry-attempt, or tag-run status.

## PR declaration material

### Rule Evidence

- `docs/rules/evidence/2B18B.md` (`eae53e0eed5d54c5c4a78d31543749787359f61b2e9b7c3f0ceb27069d2471c1`) preserves the original conflict.
- `docs/rules/evidence/2B18B-resolved.md` (`0c4893de8f38dfc05876f89744976a7c54afc6bd41465f2e1198d22b0844a4c8`) records `RULE_READY` and Option A.
- Design authority: `docs/implementation/phase-3-slice-2b18b-design-round-3.md` (`066be05f5ee8c0fccb83b00fd8471e439e7e6d2c8c8366af8c86aebceac0a792`); independent design review: `a05dc0fcb3959863448620b7b064bef38db95987b92708475f77eaf34e308808`, `RULE_DESIGN_PASS`.

### Rule Claims Implemented

- Distinct-player first-night abnormal-outcome counting within the frozen window, with resolving-source/current-instance exclusions.
- Deterministic truth or smallest false selection under represented impairment/Vortox evidence.
- BASE/V1/V2 source identity, Option A support boundary, exact delivery/settlement/fact chain, and historical private count.

### Explicitly Unsupported Rules

- Other-night Mathematician, Travellers, general poison inference, free Storyteller number choice, general dawn reset, and mechanics outside the exact represented first-night evidence.
- V1 base-plus-gained settlement remains receipt-free unsupported; accepted V1 history is not migrated or reordered.

### Rule Source Revisions

Use the exact revisions, retrieval dates, URLs, and snapshot hashes recorded in `docs/rules/evidence/2B18B-resolved.md`; do not replace them with README, tests, code, or model memory.

### Rule-to-Test Traceability

Use `docs/implementation/phase-3-slice-2b18b-test-traceability.md`. It records 224 direct/integration IDs and the single external cross-platform gate without claiming `COMPLETE` role coverage.
