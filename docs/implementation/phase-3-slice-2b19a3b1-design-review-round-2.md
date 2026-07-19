# Independent Rule Design Review — Phase 3 Slice 2B19A3B1 Round 2

## Review identity

- sliceId: `2B19A3B1`
- designRound: `2 / 2`
- reviewTimestamp: `2026-07-18T22:47:28.9216373+08:00`
- reviewType: final independent pre-implementation rule-design review
- reviewedRepositoryHead: `45a467cec81703d911914de464180e5192fc7714`
- reviewedBranch: `phase-3/dreamer-vortox-canonical-drunk-core`
- reviewedDesign: `docs/implementation/phase-3-slice-2b19a3b1-design-round-2.md`
- reviewedDesignSha256: `a0f11a05c2685355f2da454fcdc4ee8de6ff2421c56c695f87c0360612e205a0`
- repositoryMutationPerformed: `false`
- GitHubMutationPerformed: `false`

## Repository and control-state verification

- The working tree contains only the controlled documentation state associated with the reslice; no production or test file is modified.
- There is no open pull request.
- The original 2B19A3B implementation experiment remains outside accepted history.
- Archive experiment commit `ef51b62777751ecf0480f14fb98b378197f6ef21` changes exactly eight expected files: five production files and three tests.
- Current `main` CI run `29646098230` for `45a467cec81703d911914de464180e5192fc7714` concluded `success`.
- The CI job set includes ordinary-test and coverage nine-shard execution and merge jobs, ownership verification, validation, ownership self-test, and Windows deterministic checks.
- Implementation has not started for 2B19A3B1. This review is the required release gate.

## Authorities independently reviewed

Repository governance and architecture:

- `AGENTS.md`
- `docs/agent-loop/AUTOPILOT_PROMPT.md`
- `docs/agent-loop/REVIEW_PROTOCOL.md`
- `docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md`
- `docs/implementation/vitest-multi-slice-ownership-contract-registry-v1.md`
- `docs/architecture/2B19A3B1-go-no-go-under-governance-v1.md`
- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`

Rule and design evidence:

- `docs/rules/evidence/2B19A3B1.md`
- `docs/implementation/phase-3-slice-2b19a3b1-design.md`
- `docs/implementation/phase-3-slice-2b19a3b1-design-review-round-1.md`
- `docs/implementation/phase-3-slice-2b19a3b1-design-round-2.md`
- Parent 2B19A3B status and Round 2 review history
- The explicit user reslice authorization

Relevant current production seams:

- `packages/domain-core/src/dreamer.ts`
- `packages/application/src/game-application-service.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
- `packages/domain-core/src/philosopher-ability.ts`
- `packages/projections/src/index.ts`

The evidence, governance, Round 1 design, Round 1 review, and Round 2 authority hashes were recomputed locally and match the hashes recorded by the Round 2 authority.

## Independent external rule verification

The live pinned source revisions were retrieved independently on 2026-07-18. Every retrieved body returned HTTP 200 and matched the SHA-256 recorded in the evidence.

Official BOTC Wiki revisions:

- Dreamer, oldid `2904`
- Philosopher, oldid `2421`
- Vortox, oldid `3017`
- Mathematician, oldid `3109`
- States, oldid `1039`
- Abilities, oldid `1376`

User-specified Chinese Wiki revisions:

- Dreamer, oldid `3046`
- Philosopher, oldid `5125`
- Vortox, oldid `6198`
- Drunk, oldid `5720`
- Poisoned, oldid `6294`
- Mathematician, oldid `6214`

Official nightsheet:

- Pinned `nightsheet.json` SHA-256: `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`
- First night: Philosopher `14/80`, Dreamer `61/80`, Mathematician `77/80`; Vortox absent.
- Other nights: Philosopher `11`, Vortox `47`, Dreamer `79`, Mathematician `96`.

The sources support the design’s rule claims:

- A Philosopher choosing an in-play Dreamer gains the Dreamer ability and makes the actual Dreamer drunk; the Philosopher does not become the Dreamer.
- A gained Dreamer ability acts at Dreamer timing.
- Dreamer information consists of one good and one evil character, one of which is normally the target’s character; the Dreamer may not choose themself or a Traveller.
- An effective Vortox requires Townsfolk information to be false. This also applies when the source Townsfolk is drunk or poisoned.
- For a Vortox target, both Dreamer roles must be false.
- Drunk or poisoned characters have no ability, although the apparent ability process may continue.
- The Mathematician counts players whose abilities worked abnormally because of another character’s ability. It does not count abstract evidence edges or impairment causes.
- A single source contribution does not establish a formal combined Mathematician total of one.

No substantive conflict exists among the user override, pinned official sources, Chinese localization source, nightsheet, or the Round 2 design.

## Rule-evidence verification

`docs/rules/evidence/2B19A3B1.md` has:

- rule verdict: `RULE_READY`
- unresolved conflicts: `[]`
- coverage status: `PARTIAL`
- unchanged approved override:
  `BOTC-SIM-DREAMER-VORTOX-DRUNK-LEDGER-ATTRIBUTION-V1`

The override remains narrowly defined:

- exactly one Mathematician contribution fact;
- classification `ABNORMAL`;
- reason `VORTOX_FALSE_INFORMATION`;
- contribution `true`;
- exactly one canonical `DRUNK / ABILITY_IMPAIRMENT` evidence item;
- no second impairment cause or second contribution fact.

The evidence does not claim a formal combined Mathematician total, gained-Dreamer support, or poisoned-Dreamer support. Those remain outside this slice.

## Round 1 blocker closure

### 1. `TRACEABILITY_AXES_ARE_NOT_SINGLETON_ENUMS`

Closed.

The two traceability tables were parsed mechanically:

- exactly 60 rows;
- exactly 60 unique criterion IDs;
- exact set `C01–C23`, `C25–C41`, and `S01–S20`;
- `C24` is absent;
- no missing or unexpected criterion;
- every row has exactly nine columns;
- every row contains exactly one reachability value from `R1/R2/R3/R4`;
- every row contains exactly one trust value from `T1/T2/T3`;
- every row contains exactly one accepted layer value.

There are no multi-axis cells, aliases, ranges, or prose-only classifications.

### 2. `UNREACHABLE_OR_HOSTILE_IMPAIRMENT_STATES_ARE_FALSELY_CLASSIFIED_R1`

Closed.

The repaired classifications are consistent with governance:

- `C15` and `C16`: `R3 / T1 / HOSTILE`
- `C17` and `C34`: `R4 / T3 / PURE`
- `C41`: the forged Vortox provenance case is `R3`; death is explicitly outside the design and remains `R4`

The design no longer presents unreachable or hostile impairment states as accepted canonical reachability.

### 3. `POSITIVE_NONCIRCULAR_PRE_EVENT_PROOF_LOST_FROM_CRITERION_AUTHORITY`

Closed.

`C10` now requires an `R1 / T1 / ACCEPTED_STREAM` positive test that reconstructs formal Dreamer success prospectively from the batch-start or immediate pre-delivery canonical state before the delivery event is appended.

This is distinct from `C32`, which remains the `R3` stored-history mutation rejection case. The design therefore proves both:

- genuine pre-event prospective authority; and
- fail-closed rejection after hostile stored mutation.

It does not authorize a delivery event by validating the same event after it has already entered history.

### 4. `COVERAGE_PROFILE_ACCEPTANCE_CONTRACT_IS_INCOMPLETE`

Closed.

The Round 2 authority freezes a complete acceptance contract:

- a single `productImplementationHead`;
- three independent complete nine-shard coverage candidates on that exact SHA;
- stable source-head, topology, ownership-registry, count, and SHA identities;
- all five required count/SHA pairs;
- exact profile ID and source-head binding;
- a separate profile-only child commit;
- no product, test, or fixture modifications in the profile-only commit;
- immutable prior profiles;
- fail-closed verification;
- exact-head CI for the profile commit.

This distinguishes product implementation provenance from coverage-profile publication and prevents a later profile commit from silently changing product behavior.

### 5. `RECOVERY_METHOD_CONTRADICTS_EXPLICIT_USER_AUTHORIZATION`

Closed.

The sole authorized recovery method after this design passes is:

```text
git cherry-pick --no-commit ef51b62777751ecf0480f14fb98b378197f6ef21
```

The raw recovered state is explicitly non-accepted. The design then requires:

- audit of exactly the eight recovered files;
- removal of `C24`;
- removal of gained-Dreamer and formal-total assumptions;
- normalization to the 2B19A3B1 markers and contract;
- preservation of the frozen V4 and override;
- resolution of conflicts only within the eight recovered paths.

The explicit user authorization supersedes only the earlier governance prohibition against recovering that experiment. All other governance, review, scope, and acceptance gates remain active.

## Frozen runtime and event contracts

The Round 2 authority is standalone and defines implementation-relevant shapes without requiring the implementer to infer missing fields from an earlier design.

Verified properties:

- Dreamer outcome V4 has exactly 22 top-level keys.
- Canonical impairment evidence has exactly nine keys.
- Vortox constraint evidence has exactly seven keys.
- Existing base-source evidence retains its 11-key contract.
- Legacy V1, V2, and V3 shapes and behavior remain unchanged.
- No new event version, public state boundary, shared evidence schema, or generic resolver is introduced.
- Exact runtime validation is required for prospective, stored, replayed, and projected data.
- Extra, missing, wrong-type, wrong-literal, hostile getter/proxy, cyclic, symbol-keyed, and non-plain data fail closed where specified.
- Historical evidence is carried by the accepted V4 event and ledger entry; projection does not recompute it from later character state.

The only newly accepted behavior is the canonical base-Dreamer branch where the actual Dreamer is drunk because a Philosopher gained Dreamer while an effective Vortox requires false information.

## Rule semantics and information generation

The frozen branch requires:

- canonical `DRUNK` impairment from the Philosopher relationship;
- effective Vortox registration;
- deterministic false Dreamer information;
- one native-good and one native-evil character;
- neither role equal to the target’s true character;
- no Traveller or self-target relaxation;
- raw UTF-16 deterministic ordering;
- no locale-sensitive ordering, random UUID, current-time ID, or environment-dependent collation.

The one-terminal-fact invariant is preserved. The design records:

- one false-information terminal outcome;
- one Vortox abnormality contribution;
- one canonical drunkenness impairment evidence item.

It does not double-count drunkenness as a second abnormality source.

## Replay, atomicity, prospective validation, and historical stability

The designed command produces one exact three-event atomic batch:

1. Dreamer target-selection V2 event;
2. Dreamer result-delivery V4 event;
3. action-opportunity settlement event.

The design requires:

- batch-start or immediate pre-delivery prospective validation;
- exact batch order and adjacency;
- no accepted prefix on failure;
- stored-history validation before application;
- replay validation of exact V4 shape and evidence relationships;
- deterministic reconstruction;
- no canonical authorization based solely on payload shape;
- projection validation before delivery;
- stable historical facts after character or status changes.

The current architecture has the required seams: application preflight/preparation, domain batch semantics, state-aware event application, ledger ingestion, and projection validation. No new shared infrastructure is necessary.

## Idempotency, receipts, and failure boundaries

The existing command queue, command identity, settlement, and receipt semantics remain unchanged.

The design does not add a new retry or receipt protocol. It requires failure before append for malformed or unauthorized canonical data, preserving:

- no partial accepted batch;
- no false successful receipt;
- no settlement without the exact delivery event;
- existing idempotent command behavior;
- retryability only at the existing command boundary.

No new hidden write path or second logical writer is introduced.

## Player and AI information boundaries

The design preserves separation between canonical state, accepted historical evidence, player projection, and AI-visible data.

Verified requirements include:

- only the intended Dreamer result is delivered to the source player;
- canonical source IDs, provenance internals, impairment evidence, Vortox constraint internals, Mathematician audit facts, candidate-generation internals, and hidden character state are not exposed;
- AI receives only the authorized player-view form, never canonical state;
- stored evidence is validated before projection;
- later character changes do not cause historical information to be recomputed or leaked.

## Negative testing and trust-boundary coverage

The 60-row matrix covers:

- valid accepted-stream creation and replay;
- prospective pre-event authority;
- exact V4 shape;
- malformed and extra-key payloads;
- hostile getters and proxies;
- cyclic and non-plain inputs;
- forged impairment or Vortox provenance;
- stored-history mutation;
- invalid target and source relationships;
- deterministic candidate ordering and IDs;
- atomic batch rejection;
- projection leakage;
- one-terminal-fact and one-impairment-evidence invariants;
- no formal Mathematician total;
- no gained-Dreamer dependency;
- ownership and coverage-profile provenance;
- explicit unreachable-state tests.

The classifications are internally consistent. Positive structural validation such as `C07` is properly `R1`; hostile direct entry remains separately represented by `R3` criteria.

## Scope, ownership, and stop-loss

The production allowlist is exactly:

- `packages/application/src/game-application-service.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/domain-core/src/dreamer.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
- `packages/projections/src/index.ts`

The design permits only the bounded corresponding tests and verifier/profile documentation described by the authority. The Mathematician test path is excluded because no formal combined total is in scope.

Expected implementation size is approximately 650–950 added production lines, with a suggested review threshold of six production files or 1,000 added production lines and a hard reslice boundary above eight production files or 1,500 added production lines.

The following remain explicitly out of scope:

- gained-Dreamer execution;
- 2B19A3B2;
- poisoned Dreamer behavior;
- a formal Mathematician total of one;
- changes to V4 or the approved override;
- legacy event changes;
- new generic engines or public trust boundaries;
- role completion.

The role coverage matrix remains `PARTIAL`.

## User-authorized 15-point acceptance checklist

1. Original 2B19A3B history remains archived: PASS.
2. The abandoned experiment has not entered accepted `main` history: PASS.
3. Source contribution and formal Mathematician total are separated: PASS.
4. This slice has no gained-Dreamer execution dependency: PASS.
5. No formal `trueCount = 1` claim exists: PASS.
6. Frozen V4 is unchanged: PASS.
7. Approved override is unchanged: PASS.
8. Canonical `DRUNK / ABILITY_IMPAIRMENT` evidence is retained exactly once: PASS.
9. One-terminal-fact invariant is preserved: PASS.
10. Drunkenness is not represented as a second abnormality source: PASS.
11. Positive authority is prospective and non-circular: PASS.
12. Ownership and coverage contracts are implementable and fail closed: PASS.
13. Production scope and stop-loss boundaries are explicit: PASS.
14. 2B19A3B2 is explicitly deferred behind accepted gained-Dreamer support: PASS.
15. Remaining design blockers are empty: PASS.

## Findings

`[]`

## Remaining blockers

`[]`

RULE_DESIGN_PASS
