# Phase 3 Slice 2B20B-P2F — Trusted Accepted History Authority Governance Precheck

## Metadata

- sliceId: `2B20B-P2F`
- documentType: `GOVERNANCE_PRECHECK`
- authorization: `USER_AUTHORIZED_PHASE_3_SLICE_2B20B_P2F_TRUSTED_ACCEPTED_HISTORY_AUTHORITY_GOVERNANCE_PRECHECK_ONLY`
- currentHead: `bef395287d5400043565acd5b794d02810d7bbca`
- branch: `phase-3/canonical-drunk-vigormortis-settleability-closure`
- phase: `Phase 3 — controlled vertical slices`
- taskType: `FOUNDATION_GOVERNANCE_PRECHECK`
- designVerdict: `GO`
- designVerdictMeaning: `GO_TO_INDEPENDENT_P2F_DESIGN_ONLY`
- implementationAuthorized: `false`
- ruleVerdict: `RULE_READY`
- requiredArchitectureChange: `true`
- requiredRuleChange: `false`
- requiredProductChange: `true (future only)`
- eventSchemaChanged: `false`
- snapshotSchemaChanged: `false`
- receiptSchemaChanged: `false`
- acceptedBehaviorChanged: `false`
- currentP2Status: `RESLICE_REQUIRED / HUMAN_BLOCKED`
- recommendedNextSlice: `Phase 3 Slice 2B20B-P2F Trusted Accepted History Authority Foundation DESIGN`
- requiredNextAction: `AUTHORIZE_AND_CREATE_2B20B_P2F_DESIGN_THEN_INDEPENDENT_DESIGN_REVIEW`

`GO` in this precheck authorizes only preparation of one independently reviewed P2F design. It does not authorize implementation, production or test edits, schema changes, a branch publication, a pull request, or CI.

## Read authorities

This precheck is grounded in the following authorities and inspected repository facts:

1. `AGENTS.md`.
2. `project-handoff/00-README-FIRST.md` and its ordered baseline:
   - `project-handoff/PROJECT_HANDOFF.md`;
   - `project-handoff/PRODUCT_SCOPE.md`;
   - `project-handoff/RULES_BASELINE.md`;
   - `project-handoff/ARCHITECTURE_INPUT.md`;
   - `project-handoff/IMPLEMENTATION_GUARDRAILS.md`;
   - `project-handoff/OPEN_RISKS.md`;
   - `project-handoff/DEVELOPMENT_ROADMAP.md`.
3. `project-handoff/rules/11-drunk-and-poison.md`.
4. `project-handoff/rules/19-sects-and-violets-demons.md`.
5. `project-handoff/tests/25-rule-test-cases.md`.
6. `project-handoff/tests/31-test-coverage-report.md`.
7. `docs/rules/USER_OVERRIDES.md`.
8. `docs/rules/ROLE_COVERAGE_MATRIX.md`.
9. `docs/rules/evidence/2B20B-P2-impairment-state-provenance.md`.
10. `docs/architecture/08-night-task-model.md`.
11. `docs/architecture/09-effect-lifecycle.md`.
12. `docs/architecture/13-persistence-and-replay.md`.
13. `docs/architecture/22-persistence-contract.md`.
14. `docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md`.
15. `docs/architecture/2B20B-P2-effective-impairment-provenance-separation-design.md`.
16. `docs/architecture/2B20B-P2-effective-impairment-provenance-design-correction-round-1.md`.
17. `docs/architecture/2B20B-P2-effective-impairment-provenance-design-correction-round-2.md`.
18. `docs/agent-loop/AUTOPILOT_PROMPT.md`.
19. `docs/agent-loop/CURRENT_TASK.md`.
20. `docs/agent-loop/PROJECT_STATE.md`.
21. `docs/agent-loop/REVIEW_PROTOCOL.md`.
22. Current runtime implementations and contracts:
    - `packages/domain-core/src/events.ts`;
    - `packages/domain-core/src/event-stream-validator.ts`;
    - `packages/domain-core/src/domain-batch-semantics.ts`;
    - `packages/domain-core/src/rebuild.ts`;
    - `packages/domain-core/src/game-state.ts`;
    - `packages/domain-core/src/canonical-data.ts`;
    - the actual `CommandCommitStore` and `MemoryCommandCommitStore` implementations;
    - accepted receipt and command-fingerprint validators.
23. Actual Git and GitHub state at precheck:
    - local HEAD `bef395287d5400043565acd5b794d02810d7bbca`;
    - branch `phase-3/canonical-drunk-vigormortis-settleability-closure`;
    - accepted `main` authority `0dc046aa62b3a72cbd97d99808e0932bf408a09c`;
    - no open pull request for this work.

Code, tests, README files, and model memory are not rule truth. They are authoritative here only for the current implementation and trust-boundary gap.

## Precheck question

Can one bounded foundation Slice define a trustworthy, replay-safe authority boundary between persisted or live accepted history and later canonical state consumers without changing domain event, receipt, or snapshot schemas and without implementing P2 impairment behavior?

Answer: `GO`, subject to the frozen boundaries and stop conditions in this document.

The foundation is architecturally necessary because the current typed stream, replay, and commit-store APIs do not by themselves prove that caller-controlled data is one accepted canonical history. The selected direction is a non-forgeable process-local opaque handle issued only by a repository-controlled trusted-history authority.

## Trusted Accepted History definition

`TrustedAcceptedHistory` is not an event array, DTO, checksum set, interface implementation, TypeScript type, cast, test fixture, or caller assertion. It is a runtime authority issued only after one accepted-history producer and one exact validation pipeline prove all required relations.

A valid history must establish:

1. **Accepted stream**
   - Every event belongs to a successfully accepted command transaction.
   - Events are exact supported domain-event envelopes with exact payload dispatch.
   - One game and one rules baseline apply across the stream.
   - Event IDs, command IDs, batch IDs, game IDs, correlations, causations, timestamps, versions, and payload literals are valid.

2. **Complete atomic batches**
   - Each batch is contiguous.
   - All events in one batch share the exact `batchId`, `commandId`, and `gameVersion`.
   - No batch is partial, duplicated, interleaved, or split.
   - Atomic batch semantics pass prospectively and during replay.

3. **Accepted receipt reconciliation**
   - Every accepted batch has exactly one accepted receipt.
   - Receipt `gameId`, `commandId`, result status, and committed `gameVersion` match the batch.
   - Full-event receipts match exact ordered events.
   - Summary receipts match exact event count and ordered event types.
   - Missing, duplicate, failed, rejected, mismatched, or extra receipts reject authority.

4. **Continuity**
   - `eventSequence` begins at `1`, is unique, and remains continuous.
   - Batches remain contiguous in event order.
   - `gameVersion` is positive, continuous by committed batch, and changes only at complete-batch boundaries.
   - A historical prefix ends at the final event of its target game version.

5. **Out-of-band checksums**
   - Every event has one SHA-256 checksum over its canonical captured envelope.
   - Every batch has one SHA-256 checksum over its identity, command, game version, sequence bounds, event count, and ordered event checksums.
   - The complete bundle has one SHA-256 checksum over all authority metadata, events, receipts, checksum records, and the optional snapshot record, excluding only its own digest field.
   - Checksums detect corruption. They do not establish source authority and never replace exact validation, receipt reconciliation, replay, or rebuild.

6. **Canonical rebuild**
   - The typed stream validator passes after the unknown boundary has captured and validated the data.
   - Domain batch semantics pass.
   - Event-only `rebuildGameState` succeeds.
   - Rebuilt `gameVersion` and `lastEventSequence` equal the selected complete boundary.
   - Required impairment/event provenance relations are cross-checked only after canonical rebuild.

7. **Optional snapshot consistency**
   - A missing snapshot is valid and canonical state rebuilds entirely from events.
   - If a snapshot is present, it is cache only.
   - Its game, baseline, version, event boundary, prefix checksum, state checksum, and state value must equal the event-only canonical reconstruction.
   - Applying later events to a validated snapshot must equal a full event-only rebuild.
   - A mismatch rejects the history. A snapshot never repairs or overrides the event log.

Only after all applicable checks pass may the authority module issue a `TrustedAcceptedHistoryHandle`.

## Accepted authority producers

The independent P2F design may consider exactly two producer classes:

### 1. Trusted live commit journal

A repository-controlled journal observes successful `commitAcceptedCommand` transactions. It captures a batch and receipt only after the underlying accepted commit resolves. It retains the exact objects participating in that accepted transaction and later exports an exact raw bundle for validation.

The journal is authority because it is inside the accepted commit path and cannot be supplied or implemented by an arbitrary caller. A structural object that claims to be a journal is not authority.

### 2. Approved frozen replay bundle

A repository-controlled immutable approval registry binds:

- bundle identity;
- source revision;
- purpose;
- exact SHA-256;
- approval identity.

Raw bundle data still passes the complete T1 validator. Approval does not bypass validation. A self-consistent, self-signed, or caller-labeled bundle is untrusted.

Neither producer exists in production today. P2F design must freeze the producer boundary before implementation. P2 cannot manufacture it locally.

## Untrusted inputs

Every row below begins at `T1` or remains outside authority. No listed input may be cast or narrowed directly into accepted history.

| Input | Trust | Required result | Rejection reason |
|---|---|---|---|
| `readonly AnyDomainEventEnvelope[]` supplied by a caller | T1 | reject as authority | compile-time typing does not prove persisted shape, accepted commit, receipts, checksums, or complete batches |
| `readonly unknown[]` event array | T1 | exact capture and validation required; otherwise reject | raw values have no accepted source or envelope/payload authority |
| output of `validateDomainEventStream` alone | T1 | reject as complete authority | typed stream ordering is not an unknown parser and does not prove receipts, checksums, source, or snapshot relation |
| output of `rebuildGameState` alone | T1 | reject as accepted-history authority | rebuilt state can originate from caller-constructed typed events and does not prove accepted transaction history |
| `CommandCommitStore.loadDomainEvents` result alone | T1 | reject as authority | the typed port does not prove persisted descriptor shape, receipts, checksums, or complete accepted-history enumeration |
| caller-implemented `CommandCommitStore` | outside authority | reject | an interface implementation can lie and is not a repository-controlled producer |
| caller-provided `sourceKind`, `sourceIdentity`, or `sourceRevision` | T1 | reject | authority metadata inside caller-controlled data cannot establish authority |
| manually assembled events and receipts | T1 | reject | structural consistency is not accepted-transaction provenance |
| shape-valid fixture object | T1 | reject | shape validation is not accepted-history provenance |
| TypeScript cast, `any`, or branded-looking object | T1 | reject | compile-time claims do not issue runtime authority |
| matching event, batch, or bundle checksums | T1 | reject as authority | hashes detect alteration but do not prove who produced or accepted the data |
| self-signed bundle with internally consistent hashes | T1 | `UNTRUSTED_AUTHORITY_SOURCE` | the caller controls both content and digests |
| unapproved imported replay bundle | T1 | `UNAPPROVED_REPLAY_BUNDLE` | no immutable repository approval binds the exact source and SHA |
| snapshot without its event prefix | T1 | reject | snapshots are caches and cannot establish canonical truth alone |
| snapshot that differs from event-only rebuild | T1 | reject | cache cannot override canonical events |
| incomplete or mid-batch prefix | T1 | reject | it violates atomic batch and prospective-validation semantics |
| missing, duplicate, failed, rejected, mismatched, or extra receipt | T1 | reject | accepted transaction mapping is incomplete or contradictory |
| discontinuous event sequence or game version | T1 | reject | complete canonical history cannot be proven |
| missing, duplicate, or mismatched checksum record | T1 | reject | required corruption evidence is absent or contradictory |
| plain object resembling a trusted handle | T1 | reject before property read | identity was not issued by the authority module |
| fake constructor, string brand, or guessed symbol | T1 | reject before property read | visible structure is not WeakSet membership |
| spread copy, `structuredClone`, or JSON round trip of a handle | T1 | reject before property read | runtime identity and private WeakMap backing are lost |
| Proxy or revoked Proxy around a handle or bundle | T1 | fail closed | reflection or identity can be adversarial |
| getter, setter, symbol key, cycle, sparse array, or nonplain object | T1 | fail closed with zero getter calls | descriptor-safe canonical capture is impossible |
| current R1 Philosopher or Snake Charmer history labeled “legacy” | R1, not R2 | reject the R2 claim | replaying a current producer does not create legacy compatibility authority |

## CanonicalGameStateAtVersion authority

### Authority chain

```text
repository-controlled accepted-history producer
  -> descriptor-safe unknown bundle capture
  -> exact envelope and payload dispatch validation
  -> event/batch/receipt/checksum reconciliation
  -> optional snapshot relation validation
  -> runtime-issued TrustedAcceptedHistoryHandle
  -> complete gameVersion prefix selection
  -> typed stream and batch validation
  -> event-only canonical rebuild
  -> version, sequence, and provenance cross-checks
  -> runtime-issued CanonicalGameStateAtVersionHandle
  -> later bounded consumer
```

### Unique production point

Only the authority module’s non-exported issuer, reached through the public foundation operation conceptually named:

```ts
rebuildCanonicalGameStateAtVersion(
  historyHandle: unknown,
  queryGameVersion: number | "CURRENT",
): CanonicalGameStateAtVersionResult
```

may create a `CanonicalGameStateAtVersionHandle`.

The operation first verifies history-handle identity, retrieves private validated history, selects one complete prefix, rebuilds canonical state, validates boundary equality, and then issues the state handle. No store, parser, resolver, role module, fixture helper, serializer, projection, or consumer may issue the handle.

### Lifecycle

- A history handle is process-local and immutable.
- A state handle is process-local, immutable, and bound to one exact history identity, game, rules baseline, game version, final prefix event sequence, and authority implementation version.
- Public handle fields, if any, are diagnostic only; private WeakMap state is canonical.
- Handles are not serializable authority and are not cloneable authority.
- A serialized record must re-enter through the raw T1 admission path and receive a new handle.
- Process-local caching is allowed only inside the authority module.
- Cache keys use issued handle identity plus the exact query game version.
- Cache hits return an already-issued handle or a newly issued equivalent handle according to the frozen P2F design; consumer equality must rely on documented handle identity, never structural equality.
- Identity comparison is permitted; structural comparison is not authority.
- A handle never “refreshes” to a later version.

### Invalidation

A handle is invalid outside the issuing process or authority-module instance. It also cannot be used when:

- it is absent from the issuer’s private WeakSet;
- its private WeakMap backing is absent;
- the authority implementation version is no longer accepted;
- its source history was not completely validated;
- its requested version is not a complete committed boundary;
- cache eviction removes the only private backing;
- the process ends;
- a clone, proxy, wrapper, spread, deserialization, or forged lookalike is supplied.

No consumer-visible mutation or field replacement can change the handle’s authority.

## Options

### Option A — `OPAQUE_HANDLE` — selected for independent design

Public APIs take the handle directly as the first argument:

```ts
resolveEffectiveConditionsAtGameVersion(
  canonicalStateHandle: unknown,
  playerId: PlayerId,
): EffectiveConditionResolution
```

Mandatory properties:

- the first runtime operation is `issuedStateHandles.has(canonicalStateHandle)`;
- no caller-visible property is read before that identity check;
- revoked Proxy and other identity-check failures are caught and fail closed;
- canonical state and provenance live only in a private `WeakMap`;
- the handle is frozen and exact;
- private brand symbols, constructors, issuers, WeakSets, WeakMaps, and backing types are not exported;
- it cannot be serialized, cloned, spread, cast, or reconstructed into authority;
- it is issued only by trusted-history rebuild;
- process-local caching is permitted;
- authority comparison is handle identity;
- no public mutable `GameState` is stored on the handle.

Advantages:

- non-forgeable within the JavaScript runtime boundary;
- explicit T1 public boundary and T2 private core;
- reusable across bounded consumers without exposing canonical state;
- compatible with event sourcing and snapshot-as-cache semantics;
- hostile lookalikes fail before property inspection.

Costs:

- authority is process-local;
- persistence requires re-admission and reissuance;
- tests must use real producer paths or approved frozen bundles;
- the authority module becomes shared infrastructure and needs independent review.

Decision: `SELECTED_FOR_P2F_DESIGN`.

### Option B — frozen branded object — rejected as authority

A deeply frozen object with an exported or structurally visible TypeScript brand is insufficient:

- callers can cast;
- visible fields can be copied;
- exported symbols can be attached;
- serialization can reconstruct shape;
- structural validators risk reading hostile properties;
- public state risks becoming mutable or leaked canonical truth.

A frozen DTO may exist only as non-authoritative diagnostic output after an opaque-handle check. It cannot be the authority token.

Decision: `REJECTED_AS_PUBLIC_AUTHORITY`.

### Option C — resolver-only closure — limited and not selected as the primary contract

A resolver could hide authority entirely and expose only query functions over an internal closure.

Benefits:

- minimal exposed state;
- strong encapsulation.

Limitations:

- couples accepted-history admission, rebuild, and every future query in one service;
- prevents an explicit reusable authority handoff between foundation and bounded consumers;
- encourages duplicated rebuild or hidden global state;
- makes cache identity, version binding, audit evidence, and consumer separation harder to review;
- risks turning P2F into a generic resolver/service layer.

An internal closure may implement Option A’s issuer and private data store, but the public cross-module authority remains the opaque handle.

Decision: `LIMITED_INTERNAL_TECHNIQUE_ONLY`.

## Real R2 artifact

A qualifying R2 artifact is an immutable, repository-approved history or import artifact that:

1. represents a previously supported persisted/imported format or exact historical revision;
2. predates or is explicitly distinct from the current R1 producer path;
3. has a frozen identity, source revision, purpose, and exact SHA-256;
4. has a documented compatibility promise;
5. is admitted through the same T1 authority pipeline;
6. can be reproduced without manually rewriting or relabeling current events;
7. is reviewed as legacy/import compatibility evidence.

No qualifying R2 artifact currently exists for P2F or P2 C19-A.

The following do not become R2:

- current Philosopher accepted history;
- current Snake Charmer accepted history;
- a current R1 stream loaded from memory or disk;
- a rebuild of a current R1 stream;
- a copied current fixture;
- an event-array shape test;
- a caller-labeled “legacy” bundle;
- a mutation of current events;
- a new bundle created solely for the pending implementation.

R1 must never be renamed R2. If a genuine artifact is later approved, it requires a fresh design correction and independent review.

## P2 handoff boundaries

### C19-A — history authenticity

```text
ExpectedReachability = R2
ExpectedTrust = T1
ExpectedPrimaryLayer = LEGACY_REPLAY_COMPATIBILITY
```

This remains blocked and non-gating for P2F design because no qualifying R2 authority exists. P2F must not fake, relabel, or manufacture it.

### C19-B — effective-condition derivation

```text
ExpectedReachability = R1
ExpectedTrust = T2
ExpectedPrimaryLayer = PURE_POLICY_SEAM
```

This remains a future P2 handoff. It consumes a runtime-issued canonical-state handle after P2F is accepted. It is separate from history authenticity and must have a separate primary evidence identity.

P2F does not implement effective-condition derivation.

## C20 hostile boundaries

### H1 — persisted event/batch history

```text
ExpectedReachability = R3
ExpectedTrust = T1
ExpectedPrimaryLayer = HOSTILE_REPLAY_REJECTION
```

Start with one real trusted accepted history, apply one declared persisted mutation, and require rejection before either handle is issued. Coverage includes event, batch, receipt, checksum, prefix, snapshot relation, descriptor, Proxy, getter, symbol, cycle, sparse-array, and nonplain mutations.

### H2 — forged canonical-state handle

```text
ExpectedReachability = R3
ExpectedTrust = T1
ExpectedPrimaryLayer = STRUCTURAL_VALIDATION
```

The public API receives `unknown`. Plain lookalikes, casts, brands, constructors, copies, clones, serialization, Proxy wrappers, getters, symbols, and metadata mismatches must fail at the initial WeakSet identity check. No caller-visible property may be read first.

### H3 — external/imported bundle

```text
ExpectedReachability = R3
ExpectedTrust = T1
ExpectedPrimaryLayer = HOSTILE_REPLAY_REJECTION
```

Unapproved, self-signed, unknown-source, unknown-revision, altered, checksum-mismatched, approval-mismatched, receipt-mismatched, or snapshot-mismatched bundles must fail before history-handle issuance.

## Supporting Authority

`SUP-2B20B-P1-011` remains immutable historical P1 support:

| Field | Value |
|---|---|
| AuthorityStatus | `ACCEPTED` |
| Historical purpose | existing P1 No Dashii rejection support |
| P2F applicability | `NOT_APPLICABLE` |
| P2 applicability | `NOT_APPLICABLE` |
| POISONED authority | `FORBIDDEN` |
| P2F primary authority | `FORBIDDEN` |
| Status rewrite | `FORBIDDEN` |

`NOT_APPLICABLE` is an applicability statement, not an authority status. The historical `AuthorityStatus=ACCEPTED` remains unchanged. SUP-2B20B-P1-011 cannot establish POISONED Dreamer, general POISONED state, Vigormortis poison, trusted history, a runtime handle, or any P2F semantic primary.

## P2F Design-time Governance Traceability V1.1

The table below contains exactly the nine permitted design-time fields.

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| `P2F-F01_LIVE_JOURNAL_ADMISSION` | Live authority must originate in a real accepted commit | Repository-controlled journal observes one successful formal command, exact accepted batch, receipt, and committed game version before bundle admission | Formal application command through accepted commit journal and authority admission | `R1` | `T1` | `APPLICATION_COMMAND_INTEGRATION` | history handle issued only after accepted transaction capture and validation | real accepted application stream; no manual journal or bundle |
| `P2F-F02_EXACT_BUNDLE_BATCH_RECEIPT_HASH` | Bundle, batches, receipts, and checksums must reconcile exactly | Every event, batch, receipt, sequence, version, command, and event/batch/bundle digest has one exact matching relation | Descriptor-safe raw capture plus exact reconciliation and typed replay validation | `R1` | `T1` | `STRUCTURAL_VALIDATION` | complete relation passes; missing, duplicate, extra, or mismatch rejects | live journal output is support; hashes alone are insufficient |
| `P2F-F03_SNAPSHOT_ABSENT_ACCEPTED` | Snapshot absence cannot remove canonical event authority | A trusted accepted history with no snapshot rebuilds from the complete event log | Event-only complete-prefix rebuild from trusted journal history | `R1` | `T1` | `STRUCTURAL_VALIDATION` | canonical-state handle issued without snapshot | no snapshot producer required |
| `P2F-F04_SNAPSHOT_PRESENT_CACHE_ONLY` | A present snapshot must equal canonical events | Snapshot boundary, prefix digest, state digest, event-only equality, and later-event equality all pass | Exact snapshot shape and event-only relation validation | `R4` | `T1` | `STRUCTURAL_VALIDATION` | exact cache may pass; mismatch rejects; no current producer required | future snapshot authority only |
| `P2F-F05_OPAQUE_HISTORY_HANDLE_ISSUANCE` | Accepted history authority must be runtime-issued and non-forgeable | Private issuer creates exact frozen handle, records WeakSet membership, and retains canonical data only in WeakMap after all T1 checks | Runtime identity issuance following trusted admission | `R1` | `T1` | `STRUCTURAL_VALIDATION` | authentic handle issued; no public constructor, symbol, issuer, or backing state | no structural object can support issuance |
| `P2F-F06_CANONICAL_STATE_HANDLE_ISSUANCE` | One complete historical version must produce one bounded canonical authority | Authentic history handle, complete prefix, typed replay, rebuild, boundary equality, and provenance cross-check precede state-handle issuance | Trusted-history rebuild at exact game version | `R1` | `T1` | `STRUCTURAL_VALIDATION` | process-local canonical-state handle issued for exact version | accepted history handle required |
| `P2F-C19A_REAL_R2_AUTHORITY_BLOCKED` | Legacy compatibility requires a genuine frozen R2 artifact | Exact revision, approval, SHA, purpose, and compatibility promise exist before legacy admission | Approved immutable legacy/import bundle admission | `R2` | `T1` | `LEGACY_REPLAY_COMPATIBILITY` | `HUMAN_BLOCKED_NO_QUALIFYING_R2_ARTIFACT`; non-gating for P2F design | current R1 histories forbidden as substitute |
| `P2F-C19B_FUTURE_P2_HANDOFF` | Effective-condition derivation must remain separate from history authenticity | Future P2 consumes an authentic canonical-state handle without owning T1 admission | Pure consumer handoff contract over issued handle | `R1` | `T2` | `PURE_POLICY_SEAM` | handoff defined; no condition behavior implemented by P2F | future P2 authority only; no P2F product claim |
| `P2F-C20H1_PERSISTED_HISTORY_HOSTILE` | Corrupted persisted history must never obtain authority | Each declared event, batch, receipt, checksum, prefix, snapshot, and descriptor mutation rejects before handle issuance | Trusted accepted history cloned with one hostile persisted mutation | `R3` | `T1` | `HOSTILE_REPLAY_REJECTION` | fail closed; zero getter calls for accessor cases | original accepted history may be `ACCEPTED` support |
| `P2F-C20H2_FORGED_HANDLE_HOSTILE` | Caller-created handle lookalikes must not enter private canonical state | WeakSet identity check occurs before caller property read; every copy, clone, cast, proxy, serialization, and forged brand fails | Direct public API authority check | `R3` | `T1` | `STRUCTURAL_VALIDATION` | invalid authority; no WeakMap data access; zero getter calls | no supporting authority |
| `P2F-C20H3_EXTERNAL_IMPORT_HOSTILE` | Unapproved external/import bundles remain untrusted | Missing approval, unknown source/revision, altered data, self-signature, digest, receipt, or snapshot mismatch rejects | External replay admission with one hostile mutation or missing approval | `R3` | `T1` | `HOSTILE_REPLAY_REJECTION` | no history handle issued | approved immutable bundle only after separate existence |
| `P2F-SUP011_IMMUTABLE_SCOPE` | Historical P1 support must not become P2F or POISONED authority | Preserve `AuthorityStatus=ACCEPTED`, record P2F applicability `NOT_APPLICABLE`, and forbid primary use | Immutable supporting-authority registry inspection | `R4` | `T3` | `STRUCTURAL_VALIDATION` | no status rewrite and no P2F/POISONED use | `SUP-2B20B-P1-011` historical record only |

C19-A’s blocked row records a missing external prerequisite. It is not a fabricated R2 test, a current implementation promise, or a P2F merge gate. No current R1 producer is represented as R2.

## Scope and non-goals

This precheck authorizes no implementation. The future independent P2F design must remain infrastructure-only.

Explicitly outside P2F:

- POISONED Dreamer;
- any new POISONED gameplay behavior;
- No Dashii impairment derivation;
- Vigormortis kill, death, retained-Minion, adjacency, poison, or other-night behavior;
- `EffectInstance`;
- `ContinuousRule`;
- a general Effect Engine or impairment engine;
- Dreamer, Philosopher, Snake Charmer, ledger, projection, or role-coverage changes;
- domain event or payload schema changes;
- receipt schema changes;
- snapshot schema changes;
- SQLite or production persistence delivery;
- application feature behavior;
- first-night completion, day entry, nomination, voting, execution, death, or Phase 2C;
- production source edits;
- test edits;
- workflow, coverage-profile, dependency, or timeout changes;
- commit, push, PR, merge, or CI.

## Required P2F design contents

A later authorized P2F design must freeze, at minimum:

1. the exact repository-controlled producer seam;
2. the raw bundle version and exact unknown-boundary shape;
3. descriptor-safe capture and canonicalization;
4. complete event-type to payload-validator dispatch;
5. receipt enumeration and reconciliation;
6. event, batch, and bundle checksum inputs;
7. optional snapshot relation;
8. event-only rebuild authority;
9. opaque history- and state-handle public APIs;
10. private WeakSet/WeakMap issuance and identity-before-property-read behavior;
11. lifecycle, cache, invalidation, and process-boundary rules;
12. all H1, H2, and H3 hostile matrices;
13. application, domain-core, and persistence module boundaries;
14. exact file allowlists and stop-loss;
15. migration and rollback;
16. local gates, cross-platform CI supplements, and independent review.

The design must not infer a production allowlist from this precheck.

## Governance decision

### P2F

- Rule conflict: none.
- Architecture gap: confirmed.
- Product need: confirmed for future P2 and other trusted-history consumers.
- Bounded foundation design: feasible.
- Selected direction: `A — OPAQUE_HANDLE`.
- Design entry: `GO`.
- Implementation: unauthorized.

### Current P2

- Status remains `RESLICE_REQUIRED / HUMAN_BLOCKED`.
- P2 implementation remains unauthorized.
- P2 cannot absorb P2F.
- P2 C19-A remains blocked because no qualifying R2 artifact exists.
- P2 may be reconsidered only after P2F acceptance, explicit P2 reauthorization, and fresh independent design review.

## Stop conditions

Return `HUMAN_BLOCKED` during P2F design if:

- authority can be supplied by a caller-controlled object or metadata field;
- an unknown boundary must cast directly to typed events;
- exact event/payload dispatch cannot be frozen;
- receipts cannot be completely enumerated and reconciled;
- checksums are treated as source authority;
- snapshots can override event-only rebuild;
- snapshot absence is rejected;
- handle brands, issuers, constructors, WeakSets, WeakMaps, or backing state must be exported;
- any caller-visible property must be read before handle identity validation;
- handles must remain valid after serialization, cloning, or process restart;
- tests require fake authority issuers or manually trusted fixtures;
- current R1 history must be relabeled R2;
- P2F must implement POISONED, No Dashii, Vigormortis, Dreamer, an Effect Engine, or role behavior;
- event, payload, receipt, or snapshot schemas must change;
- production persistence or SQLite delivery becomes mandatory;
- the design allowlist cannot remain one bounded foundation;
- required source authority is unavailable;
- independent design review does not return the exact permitted passing verdict.

## Recommended next slice

`Phase 3 Slice 2B20B-P2F Trusted Accepted History Authority Foundation DESIGN`

The next authorized activity should be design only:

1. materialize one complete P2F design;
2. freeze exact APIs, modules, allowlists, traceability, hostile matrices, migration, rollback, and stop-loss;
3. submit it to one independent rule/design reviewer;
4. require the protocol-defined passing verdict before any implementation authorization.

## Final report

- currentHead: `bef395287d5400043565acd5b794d02810d7bbca`
- branch: `phase-3/canonical-drunk-vigormortis-settleability-closure`
- scope: `GOVERNANCE_PRECHECK_ONLY`
- readAuthorities: `COMPLETE`
- trustedHistoryDefinition: `ACCEPTED_STREAM_COMPLETE_BATCH_RECEIPT_CONTINUITY_CHECKSUM_REBUILD_OPTIONAL_SNAPSHOT_CONSISTENCY`
- canonicalStateAuthority: `RUNTIME_ISSUED_CANONICAL_GAME_STATE_AT_VERSION_HANDLE`
- runtimeAuthorityBoundary: `OPTION_A_OPAQUE_HANDLE_WEAKSET_IDENTITY_BEFORE_CALLER_PROPERTY_READ_WITH_PRIVATE_WEAKMAP_BACKING`
- r2ArtifactDefinition: `DEFINED_BUT_NO_QUALIFYING_R2_ARTIFACT_CURRENTLY_EXISTS`
- c19Assessment: `C19A_R2_T1_LEGACY_REPLAY_COMPATIBILITY_BLOCKED_NON_GATING__C19B_R1_T2_PURE_POLICY_SEAM_FUTURE_HANDOFF`
- c20Assessment: `H1_R3_T1_HOSTILE_REPLAY_REJECTION__H2_R3_T1_STRUCTURAL_VALIDATION__H3_R3_T1_HOSTILE_REPLAY_REJECTION`
- supAssessment: `SUP-2B20B-P1-011_AUTHORITY_STATUS_ACCEPTED__P2F_NOT_APPLICABLE__POISONED_AUTHORITY_FORBIDDEN`
- traceabilityAssessment: `V1.1_EXACT_NINE_DESIGN_TIME_FIELDS_NO_FAKE_R2`
- requiredArchitectureChange: `true`
- requiredRuleChange: `false`
- requiredProductChange: `true (future only)`
- recommendedNextSlice: `Phase 3 Slice 2B20B-P2F Trusted Accepted History Authority Foundation DESIGN`
- designVerdict: `GO`
- implementationAuthorized: `false`
- filesChanged: `1`
- commitCreated: `false`
- pushPerformed: `false`
- PRCreated: `false`
- CIrerunPerformed: `false`
- requiredNextAction: `AUTHORIZE_AND_CREATE_2B20B_P2F_DESIGN_THEN_INDEPENDENT_DESIGN_REVIEW`
