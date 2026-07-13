# Phase 3 Slice 2B18B Implementation Status

> Status: `REPAIR_ROUND_1_READY_TO_PUBLISH / UNACCEPTED`. PR [#24](https://github.com/JackeyLovedas/botc-singleplayer/pull/24) is open on `phase-3/mathematician-first-night-information`. Independent final review of frozen head `8b273eec34502906d6c2aa12031c4065ec97725c` returned `CODE_REVIEW_FIX_REQUIRED / RULE_REVIEW_FIX_REQUIRED`; the bounded repair is locally complete but not yet committed, pushed, or independently re-reviewed.

## Scope

This slice implements first-night Mathematician count resolution, exact information delivery, settlement, terminal outcome-ledger fact, trusted replay validation, and private count projection under the Round 3 authority and Option A support boundary. It does not change external rules, approved overrides, V1 ordering, or Slice 2B18A history, and it does not begin 2B19.

## Implemented locally

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

The exact 225-item semantic classification and repair-contract mapping are in `docs/implementation/phase-3-slice-2b18b-test-traceability.md`. The original frozen head completed `Original-140` through push CI `29251259989` and PR CI `29251425251`, both `SUCCESS`. The new repair head does not exist until this worktree is committed, so cross-platform evidence must be rerun for that exact future head. The `422`-test Math runner count is supporting evidence, not a substitute for semantic traceability.

## Local validation

- Full ESLint: pass.
- Typecheck: pass.
- Math suite: `422 / 422` pass.
- Focused eight-file ledger/batch/rebuild/Philosopher/Clockmaker replay/application/Math/projection gate: `8 files / 1020 tests` pass.
- Full test: `30 files / 1408 tests` pass.
- Coverage: `30 files / 1408 tests` pass; `86.78%` statements/lines, `81.52%` branches, `97.78%` functions.
- `git diff --check`, strict control JSON parse, root-export/internal resolver, caller-state/caller-ledger resolver, nondeterminism, raw JSON semantic comparison, sparse-array, and deleted-test scans: pass. State-shape validator name matches and dense-array-guarded `.every` calls were reviewed as non-resolver/non-sparse false positives.
- `Original-140` is complete for reviewed head `8b273eec...` through successful exact-head push/PR CI. The future repair commit requires its own push/PR CI and does not inherit that result.

## Rule coverage

`PARTIAL`. Implemented only for first night, fixed twelve-player/no-Traveller scope, represented drunkenness/poisoning evidence, represented Vortox state, approved deterministic selection, Option A, and safe private count projection. Other-night behavior, general poisoning, Travellers, free Storyteller number discretion, broader character/alignment/death interactions, and general dawn reset remain unsupported. No role is `COMPLETE`.

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

Use `docs/implementation/phase-3-slice-2b18b-test-traceability.md`. It records 224 local direct/integration IDs and the single external cross-platform gate without claiming acceptance or `COMPLETE` role coverage.
