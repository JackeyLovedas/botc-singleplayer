# Slice 2B19A3B1 Governance Precheck — Canonical Drunk Dreamer Vortox Core

## Metadata

- `sliceId`: `2B19A3B1`
- `sliceName`: `Canonical Drunk Dreamer Vortox Core`
- `taskType`: `PRODUCT_SLICE`
- `governanceBaseline`: `Engineering Governance Traceability V1.1`
- `rulesBaseline`: `Phase One v2.1`
- `primaryRisk`: `CANONICAL_DRUNK_BASE_DREAMER_VORTOX_DELIVERY_AND_LEDGER_CORE`
- `ruleEvidence`: `docs/rules/evidence/2B19A3B1.md`
- `ruleEvidenceCanonicalLfSha256`: `ae48ce51ddbcd6ba3bae2dc49ab6441769e77c55f994aa8c2e043e98e58a2653`
- `ruleEvidenceRetrieval`: `2026-07-18T21:38:04+08:00`
- `ruleVerdict`: `RULE_READY`
- `unresolvedConflicts`: `[]`
- `ruleCoverageStatus`: `PARTIAL`
- `implementationLabel`: `CANONICAL_DRUNK_VORTOX_CORE_ONLY`
- `governanceDecision`: `GO`
- `implementationAuthorized`: `false`

## Preconditions Checked

All mandatory preconditions for architecture work are satisfied:

1. The read-only rule researcher freshly checked `docs/rules/USER_OVERRIDES.md`, the user-specified Chinese Wiki, official BOTC Wiki, and official nightsheet.
2. The sole writer materialized `docs/rules/evidence/2B19A3B1.md`; the checkout bytes and canonical-LF digest both match the recorded SHA-256 above.
3. The fresh verdict is exactly `RULE_READY`; `unresolvedConflicts=[]`.
4. The current `docs/rules/ROLE_COVERAGE_MATRIX.md` was read. Dreamer, Philosopher, and Mathematician remain `PARTIAL`; Vortox remains `NOT_STARTED`; no incomplete role is represented as `COMPLETE`.
5. User override `BOTC-SIM-DREAMER-VORTOX-DRUNK-LEDGER-ATTRIBUTION-V1` is approved and narrowly settles the simulator's one-terminal-fact attribution only.
6. The failed parent Slice, its two rule-evidence records, governance records, Round 2 design/review, final status, external manifest, and local archive commit were read as historical evidence only. They do not authorize implementation.
7. The accepted 2B19A3A authority, current base code, ADR V1.1, ownership registry/schema, Git/GitHub state, and current control state were read.

## Current Repository and GitHub State

- Local branch: `phase-3/dreamer-vortox-canonical-drunk-core`.
- Local `HEAD`, local `main`, and `origin/main`: `45a467cec81703d911914de464180e5192fc7714`.
- GitHub `main`: the same SHA.
- Open pull requests: none.
- Latest exact-main CI: run `29646098230`, `SUCCESS`, `22/22` jobs.
- The worktree contains only the controlled rule-evidence/control-document materialization; no production or test file is dirty.
- Unaccepted experiment archive: local-only branch `archive/2b19a3b-unaccepted-mathematician-blocked-experiment`, commit `ef51b62777751ecf0480f14fb98b378197f6ef21`.
- External experiment patch: SHA-256 `b271c2db780c0940e001bd0dec596ff21fd70950a0af6cee6ec861b9aa5a8a6c`.
- The archive commit is not an ancestor of current `HEAD`, has no remote branch, no PR, no tag, and no accepted product authority.

## Unique Risk and Bounded Outcome

This Slice closes exactly one risk: an effective native/base Dreamer who is canonically `DRUNK` because a real Philosopher chose Dreamer must, while an effective current alive Vortox applies, receive a deterministic, exactly validated forced-false Dreamer delivery; that accepted settlement must produce exactly one terminal abnormal ledger fact with the approved Vortox cause and exactly one canonical DRUNK impairment proof, then expose only the already-authorized private Dreamer pair.

The Slice does not settle the Philosopher-gained Dreamer action and does not calculate, close, or assert a Mathematician total.

## Reachability Boundary

### R1 — `CURRENTLY_REACHABLE_APPLICATION_PATH`

The bounded successful path is:

1. a real formal Philosopher first-night command chooses Dreamer;
2. accepted history creates the canonical Philosopher-caused DRUNK effect on the native/base Dreamer;
3. the existing native/base Dreamer opportunity is selected and targeted through the real application command;
4. settlement emits the exact V4 delivery in one atomic batch with target and task settlement;
5. replay rebuilds the same accepted state;
6. ledger derivation yields exactly one terminal fact and one canonical DRUNK proof;
7. the source player's authorized private projection returns only the target and good/evil role pair.

R1 stops after the base Dreamer settlement, ledger derivation, and source projection. The next currently reachable boundary is the already-scheduled Philosopher-gained Dreamer task. That task must remain next and unsettled; this Slice must neither execute, skip, forge, nor settle it. It must not continue to Seamstress or formal Mathematician settlement.

R1 also includes real formal command failure paths for dependency lookup, metadata creation, prospective validation, append, commit-store, receipt persistence, unsupported canonical DRUNK without effective Vortox, and retry/idempotency boundaries.

### R2 — `LEGACY_OR_IMPORTED_ACCEPTED_HISTORY`

The Slice preserves exact meaning and replay compatibility for:

- legacy V1 Dreamer target/delivery history;
- accepted V2 opportunity and normal-information history;
- accepted effective-source Vortox V3 history from Slice 2B19A3A.

No legacy payload is rewritten or silently upgraded to V4.

### R3 — `HOSTILE_OR_CORRUPTED_HISTORY`

The Slice rejects malformed or forged V4 payloads, wrong/duplicate/conflicting impairment provenance, wrong source/affected player, seat, role, chosen role, source kind, or revision, impossible Vortox provenance, malformed batches, partial/orphaned batches, duplicate terminal settlement, mixed-generation delivery, invalid IDs, and hostile exact-shape objects.

### R4 — `FUTURE_HYPOTHETICAL_STATE`

The following remain future or explicitly unsupported:

- Philosopher-gained Dreamer execution;
- combined base-plus-gained Dreamer Mathematician integration or final `trueCount`;
- poisoned base Dreamer successful information settlement;
- impaired or ineffective Vortox behavior beyond the accepted applicability seam;
- No Dashii and other impairment sources;
- later-night Dreamer;
- generic impairment, false-information, ledger, or Storyteller-choice engines.

A currently callable formal gained-Dreamer command may return the existing `ApplicationNotConfigured` rejection; that rejection is R1 application-command evidence, while successful gained-Dreamer behavior remains R4 and is not a prerequisite here.

## Trust Boundary

- `T1 EXTERNAL_OR_PERSISTED_BOUNDARY`: commands, event envelopes, persisted/imported history, projection-viewer input, exact V4 validation, replay admission, and projection admission.
- `T2 CANONICAL_DERIVED_STATE`: validated rebuilt state, pre-event state, accepted task/source/target cross-links, ledger derivation, and deterministic projection derivation.
- `T3 MODULE_PRIVATE_PURE_CORE`: Vortox applicability resolver, exact canonical DRUNK predicate, candidate-set policy, raw UTF-16 comparator, clone/equality helpers, and internal V4 construction.

No new public trust boundary is required.

## Rule and Architecture Gates

| Gate | Result | Evidence and boundary |
|---|---|---|
| Fresh rule truth is available | PASS | Materialized evidence is `RULE_READY`, conflicts empty, exact digest recorded. |
| User override is sufficient and narrow | PASS | It fixes one Vortox-attributed abnormal fact with mandatory DRUNK evidence and forbids a second cause/fact. |
| Path is currently reachable without future producer | PASS | Native/base Dreamer path is reachable through accepted Philosopher choice, A3A Vortox applicability, and existing formal application commands. |
| One primary risk | PASS | V4 delivery, atomic settlement, ledger derivation, and safe projection form one end-to-end risk. |
| Existing event model is sufficient | PASS | Reuses Dreamer target, Dreamer delivery, and scheduled-task settlement events; no new domain event. |
| Existing canonical state is sufficient | PASS | Reuses delivered knowledge, task progress, existing effect/tenure state, and rebuild paths; no new canonical state. |
| Existing closed evidence vocabulary is sufficient | PASS | Reuses `ABILITY_IMPAIRMENT`; exactly one canonical DRUNK evidence entry is required; no new evidence kind or union. |
| Atomic/replay/prospective gates are locally closable | PASS | Existing Dreamer batch, prospective rebuild, replay, and settlement seams can be extended exactly for V4. |
| Historical knowledge and projection safety are locally closable | PASS | V4 is persisted and validated from settlement-time facts; authorized views omit reliability, impairment, Vortox, and canonical state. |
| Determinism is locally closable | PASS | Candidate catalogs, raw UTF-16 comparison, fixed first legal entries, and exact stored candidates avoid locale/time/random behavior. |
| Combined Mathematician result is not required | PASS | The Slice asserts only the native/base Dreamer's single terminal contribution; final Mathematician settlement is deferred. |
| Stop-loss is respected | PASS | Five existing production files, no new subsystem or public boundary, expected 650–950 added production lines, inherited Slice limits below. |

## Parent Failure and Reslice Correction

The parent experiment failed because its former `C24` attempted to reach formal Mathematician settlement across an unsupported Philosopher-gained Dreamer task and conflated one base-source contribution with the final combined total. This Slice deletes that claim.

The valid ledger obligation is split into four atomic criteria, all legal under the ownership criterion regex `^[A-Z][0-9]{2}$`:

- `C20`: exactly one terminal fact exists for the native/base Dreamer source player;
- `C21`: its terminal triple is exactly `ABNORMAL / VORTOX_FALSE_INFORMATION / causedByAnotherCharacterAbility=true`;
- `C22`: exact positive canonical Philosopher-caused DRUNK `ABILITY_IMPAIRMENT` evidence appears exactly once;
- `C23`: no second terminal fact exists and no separate `SOURCE_DRUNKENNESS` fact/cause is created.

Former formal-Mathematician `C24` is removed; there is no `C24` in this Slice's criterion inventory. Non-contiguous criterion IDs are valid. No current criterion freezes a Mathematician `trueCount`.

## Production Shape and Size Precheck

Expected production allowlist:

1. `packages/domain-core/src/dreamer.ts`
2. `packages/domain-core/src/domain-batch-semantics.ts`
3. `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
4. `packages/application/src/game-application-service.ts`
5. `packages/projections/src/index.ts`

Expected added production code: 650–950 lines.

The exact inherited user-authorized/parent-Round-2 Slice stop-loss is:

- suggested ceiling: no more than 6 changed production files and no more than 1,000 added production lines;
- hard stop: more than 8 changed production files or more than 1,500 added production lines is immediately `RESLICE_REQUIRED`;
- any production file outside the five-file allowlist requires explicit design correction before edit, even if still below the numeric ceiling.

No new package, event system, state system, projection system, generic audit system, dependency, migration, or CI infrastructure is allowed.

## Stop Conditions

Return `RESLICE_REQUIRED` before or during implementation if any of the following is discovered:

1. a new event, canonical state field, evidence kind/union, public API, persistence format, migration, generic impairment engine, generic Storyteller-choice engine, or shared infrastructure is required;
2. successful Philosopher-gained Dreamer execution, Seamstress continuation, or formal Mathematician settlement becomes a prerequisite;
3. any test or reviewer requires a combined/final Mathematician total in this Slice;
4. exact V4 replay cannot be closed without weakening V1/V2/V3 compatibility;
5. atomic prospective validation cannot reject partial/orphaned/mixed batches before commit;
6. projection requires recomputing settlement-time truth from later character/effect state;
7. a substantive rule conflict appears or a required source/snapshot becomes unavailable;
8. implementation needs more than 8 production files or more than 1,500 added production lines;
9. implementation needs a production file outside the five-file allowlist, exceeds the suggested 6-file/1,000-line ceiling, or materially changes the estimated shape without an authorized design correction;
10. the archived experiment must be restored wholesale rather than selectively reimplemented under an approved recovery plan;
11. a second independent subsystem or an R4 producer is required.

Any rule conflict or unavailable required source maps to `HUMAN_BLOCKED`, not an architecture choice.

## Rollback Boundary

Before acceptance, rollback is deletion/reversion of the bounded feature-branch product/test/docs changes only; accepted V1/V2/V3 history, A3A ownership, main, tags, and the external/archive experiment remain untouched. After an accepted merge, rollback must use a normal revert PR with exact-head CI and independent review; persisted V4 history must not be rewritten or silently downgraded.

## Decision

All governance preconditions and twelve bounded gates pass. The Slice is reachable, uses existing event/state/evidence seams, removes the inaccessible formal-Mathematician claim, fits the exact inherited stop-loss, and leaves future interactions explicit.

`GO`
