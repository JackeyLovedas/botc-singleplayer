# Phase 3 Slice 2B20B-P2F1 — Canonical Runtime Validation and Deterministic Serialization Foundation Governance Precheck

## Metadata

- sliceId: `2B20B-P2F1`
- documentType: `GOVERNANCE_PRECHECK`
- authorization: `USER_AUTHORIZED_PHASE_3_SLICE_2B20B_P2F1_CANONICAL_RUNTIME_VALIDATION_AND_SERIALIZATION_GOVERNANCE_PRECHECK_ONLY`
- authorizationScope: `PRECHECK_ONLY`
- branch: `phase-3/canonical-drunk-vigormortis-settleability-closure`
- currentHead: `bef395287d5400043565acd5b794d02810d7bbca`
- acceptedMainBase: `0dc046aa62b3a72cbd97d99808e0932bf408a09c`
- phase: `Phase 3 — controlled vertical slices`
- ruleBaseline: `Phase One v2.1`
- P2F1RequiredPrerequisite: `true`
- designVerdict: `RESLICE_REQUIRED`
- designVerdictReason: `CURRENT_P2F_BUNDLES_AN_INDEPENDENT_MISSING_TRUST_FOUNDATION`
- recommendedNextSlice: `Phase 3 Slice 2B20B-P2F1 Design Round 1 — Canonical Runtime Validation and Deterministic Serialization Foundation`
- implementationAuthorized: `false`
- requiredNextAction: `STOP_PRECHECK_COMPLETE_AWAIT_SEPARATE_P2F1_DESIGN_AUTHORIZATION`
- P2FStatus: `HUMAN_BLOCKED`
- P2FDesignModified: `false`
- P2F1MayIssueTrustedHistory: `false`
- P2F1MayIssueCanonicalStateAuthority: `false`
- eventSchemaChanged: `false`
- receiptSchemaChanged: `false`
- snapshotSchemaChanged: `false`
- BOTCRuleChanged: `false`
- productBehaviorChanged: `false`

This document authorizes no implementation. It does not amend either P2F design document. It records why a separately authorized, independently reviewed P2F1 design is a prerequisite before P2F can proceed.

## Governance question and answer

Question:

Can the current P2F design safely implement trusted accepted-history authority by directly combining existing event validators, `canonical-data.ts`, and `command-fingerprint.ts`?

Answer:

`NO — RESLICE_REQUIRED`.

The current repository does not have one complete, descriptor-safe, semantic-free T1 foundation that can:

1. capture an arbitrary runtime value without invoking caller behavior;
2. validate the exact envelope and payload shape for all 40 current domain event types;
3. reject an unknown type or version without a cast or downgrade;
4. produce one versioned, cross-platform canonical representation;
5. produce role-separated integrity digests;
6. return safe rejection evidence and a quarantine recommendation without owning quarantine or authority.

Those responsibilities are independently verifiable and are required by P2F, but they are not trusted-history authority themselves. They therefore require the separate P2F1 design Slice named in Metadata.

## Inspected authorities and exact repository paths

This precheck uses the following governance and architecture authorities:

- `AGENTS.md`
- `project-handoff/00-README-FIRST.md`
- `docs/agent-loop/AUTOPILOT_PROMPT.md`
- `docs/agent-loop/CURRENT_TASK.md`
- `docs/agent-loop/PROJECT_STATE.md`
- `docs/agent-loop/REVIEW_PROTOCOL.md`
- `docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md`
- `docs/architecture/06-command-event-model.md`
- `docs/architecture/07-state-and-projections.md`
- `docs/architecture/13-persistence-and-replay.md`
- `docs/architecture/22-persistence-contract.md`
- `docs/architecture/2B20B-P2F-trusted-accepted-history-authority-precheck.md`
- `docs/architecture/2B20B-P2F-trusted-accepted-history-authority-design-round-1.md`
- `docs/architecture/2B20B-P2F-trusted-accepted-history-authority-design-correction-round-1.md`

The current implementation evidence was inspected at:

- `packages/domain-core/src/events.ts`
- `packages/domain-core/src/canonical-data.ts`
- `packages/domain-core/src/event-stream-validator.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/prospective-events.ts`
- `packages/domain-core/src/rebuild.ts`
- `packages/domain-core/src/event-batch.ts`
- `packages/domain-core/src/initial-private-knowledge.ts`
- `packages/domain-core/src/first-night-task-plan.ts`
- `packages/domain-core/src/first-night-action-opportunity.ts`
- `packages/domain-core/src/first-night-team-information.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
- `packages/domain-core/src/seamstress.ts`
- `packages/domain-core/src/philosopher-ability.ts`
- `packages/domain-core/src/snake-charmer.ts`
- `packages/domain-core/src/witch.ts`
- `packages/domain-core/src/cerenovus.ts`
- `packages/domain-core/src/dreamer.ts`
- `packages/domain-core/src/clockmaker.ts`
- `packages/domain-core/src/mathematician.ts`
- `packages/domain-core/src/evil-twin.ts`
- `packages/application/src/command-fingerprint.ts`
- `packages/application/src/command-fingerprint.test.ts`

Code and tests are evidence of current runtime behavior only. They are not BOTC rule truth.

Actual Git facts at this precheck are:

- branch: `phase-3/canonical-drunk-vigormortis-settleability-closure`;
- HEAD: `bef395287d5400043565acd5b794d02810d7bbca`;
- accepted `main` base: `0dc046aa62b3a72cbd97d99808e0932bf408a09c`.

## Precheck scope

P2F1 is allowed to design only:

1. descriptor-safe capture of unknown plain-data candidates;
2. an exact, exhaustive current domain-event envelope and payload dispatcher;
3. semantic-free runtime shape validation;
4. deterministic canonical serialization;
5. distinct, domain-separated integrity digest roles;
6. a non-authoritative rejection descriptor with safe evidence and `quarantineRecommended`;
7. pure tests and cross-platform deterministic vectors for those responsibilities.

P2F1 is not allowed to:

- issue, register, revoke, hydrate, or validate a trusted-history handle;
- issue or validate canonical-state authority;
- decide whether a command was accepted;
- establish accepted-history provenance;
- own a live commit journal;
- own game or artifact quarantine state;
- rebuild `GameState`;
- replace `validateDomainEventStream`;
- replace `validateDomainBatchSemantics`;
- replace `applyDomainEvent`, `applyDomainEventBatch`, or `rebuildGameState`;
- recalculate delivered historical knowledge from newer character state;
- add or reinterpret a BOTC rule;
- add or change a domain event, payload, receipt, snapshot, command, or projection;
- change application success, failure, retry, or persistence behavior;
- modify the existing P2F design.

## Why P2F1 is a separate prerequisite

The corrected P2F design requires exact unknown-to-typed validation and deterministic hashing before it may issue authority. Its conceptual registry assumes that every current event can be adapted to one exact T1 payload validator. The current repository does not satisfy that assumption as one reusable foundation:

- some payload families have exported exact or shape validators;
- some exported validators require state or source facts;
- some validators exist only as internal stateful replay logic;
- three event families have no standalone exact unknown payload validator;
- current stream and replay APIs receive `AnyDomainEventEnvelope`, not `unknown`;
- current canonical helpers have different accepted domains and neither is the required complete, versioned P2F value contract.

Adding these missing trust-boundary capabilities inside P2F would combine two independently reviewable changes:

1. construction of the T1 validation/serialization foundation; and
2. use of that foundation by a unique application-owned authority issuer.

That combination is not one small Slice. P2F remains `HUMAN_BLOCKED` until P2F1 receives separate design authorization, independent design review, implementation authorization, implementation, and final review.

## Exact current domain-event inventory

`packages/domain-core/src/events.ts` defines `DomainEventType` as the keys of `DomainEventPayloadByType`. At the inspected HEAD, the exact inventory is 40 events:

```text
01 GameCreated
02 ScriptSelected
03 SeamstressResolutionCapabilityDeclared
04 SetupGenerated
05 PlayerRosterCreated
06 CharactersAssigned
07 PhaseTransitioned
08 FirstNightInitialized
09 InitialPrivateKnowledgeEstablished
10 FirstNightTaskPlanCreated
11 FirstNightActionOpportunityCreated
12 PhilosopherActionDeferred
13 SeamstressActionDeferred
14 SeamstressTargetsChosen
15 SeamstressAbilitySpent
16 SeamstressInformationDelivered
17 PhilosopherAbilityChosen
18 PhilosopherAbilityGranted
19 AbilityImpairmentApplied
20 FirstNightTaskInserted
21 FirstNightTaskInsertedV2
22 SnakeCharmerTargetChosen
23 SnakeCharmerDemonSwapApplied
24 SnakeCharmerNoSwapResolved
25 SnakeCharmerIneffectiveResolved
26 WitchTargetChosen
27 WitchDeathPendingMarked
28 WitchIneffectiveResolved
29 CerenovusChoiceRecorded
30 CerenovusMadnessMarked
31 CerenovusMadnessInstructionDelivered
32 DreamerTargetChosen
33 DreamerInformationDelivered
34 ClockmakerInformationDelivered
35 MathematicianInformationDelivered
36 EvilTwinPairEstablished
37 EvilTwinInformationDelivered
38 MinionInformationDelivered
39 DemonInformationDelivered
40 ScheduledTaskSettled
```

The P2F1 design must make this registry compile-time exhaustive against `DomainEventPayloadByType`. It must contain each current event exactly once and no extra event. Adding or removing an event after the design freeze must fail compilation and require separately authorized design review; it must not fall through to a generic payload validator.

## Current validator-capability assessment

Validator readiness cannot be represented by one mutually exclusive A-D census. Two independent axes matter:

1. **symbol availability** — exported, module-internal, or absent as a standalone payload validator; and
2. **required context** — context-free unknown shape, caller-supplied source facts, current/rebuilt `GameState`, prior events, task/opportunity state, settlement state, or another semantic input object.

An exported symbol is not proof of a context-free `unknown -> exact payload` boundary. A function can be exported while requiring trusted source facts or canonical state, and one event family can use several validators at different stages.

### Axis 1 — symbol availability

Current examples of exported shape-oriented symbols include:

- `validateFirstNightInitializedPayloadShape` in `packages/domain-core/src/initial-private-knowledge.ts`;
- `validateSeamstressTargetsChosenPayloadShape`, `validateSeamstressAbilitySpentPayloadShape`, and `validateSeamstressInformationDeliveredPayloadShape` in `packages/domain-core/src/seamstress.ts`;
- `validateClockmakerInformationDeliveredPayloadShape` in `packages/domain-core/src/clockmaker.ts`;
- `validateMathematicianInformationDeliveredPayloadShape` in `packages/domain-core/src/mathematician.ts`;
- `validateScheduledTaskSettledPayloadShape` in `packages/domain-core/src/first-night-task-plan.ts`.

Other exported symbols exist for Dreamer, Philosopher, Snake Charmer, Witch, Cerenovus, first-night task/opportunity, Evil Twin, Minion, and Demon payload families. Their export status alone does not establish that they accept only one raw payload value, are semantic-free, are descriptor-safe against hostile input, or validate every exact key without external context.

Several checks remain module-internal or embedded in stateful replay. Examples include setup, roster, assignment, initial private knowledge, and Evil Twin information logic in `packages/domain-core/src/event-applier.ts` and their supporting modules.

At the inspected HEAD:

- `GameCreated` has no standalone exact unknown payload validator;
- `ScriptSelected` has no standalone exact unknown payload validator;
- `PhaseTransitioned` has no standalone exact unknown payload validator.

Their current checks are embedded in replay and batch semantics.

### Axis 2 — required validation context

Current validators span at least these capability shapes:

| Capability shape | Current examples | P2F1 consequence |
|---|---|---|
| shape-oriented exported helper | First-night initialization, Seamstress shape helpers, Clockmaker shape helper, Mathematician shape helper, scheduled-task settlement shape | candidate for reuse only after hostile descriptor-safety and exact-key behavior are independently proven |
| exported validator with a context/input object | Dreamer, Philosopher, Snake Charmer, Witch, Cerenovus, first-night task/opportunity, Evil Twin, Minion, and Demon families include validators that require source facts, state, opportunities, tasks, settlements, or related records | cannot be called as a context-free unknown validator and cannot be supplied fabricated context |
| internal/stateful replay check | setup, roster, character assignment, initial private knowledge, Evil Twin information, phase transition, and other event-applier/batch relations | remains in existing replay; P2F1 may define only a separate semantic-free exact-shape boundary |
| no standalone exact unknown validator | `GameCreated`, `ScriptSelected`, `PhaseTransitioned` | Design Round 1 must define exact semantic-free payload ownership or stop |

The same event family may appear in more than one capability shape because structural and semantic checks are separate stages. No row above is an exhaustive or mutually exclusive per-event classification.

### Capability conclusion

The repository has useful exact-shape components and strong stateful replay validation, but it has no proven exhaustive descriptor-safe unknown-to-typed registry for the exact 40-event union.

P2F1 Design Round 1 must inspect every event individually and freeze:

- which existing context-free helper is safe to reuse;
- which helper requires a new semantic-free exact-shape wrapper;
- which check must remain exclusively stateful;
- where the one permitted post-validation per-event narrowing occurs.

Exact per-event adapter ownership is deliberately deferred to that separately authorized design. This precheck does not assert reuse readiness or exact counts for any validator capability class.

## Current unknown-input behavior

The current runtime is strong typed replay, not a complete unknown boundary:

1. `validateDomainEventStream` accepts `readonly AnyDomainEventEnvelope[]`.
2. `validateDomainBatchSemantics` accepts typed event envelopes and current `GameState`.
3. `applyDomainEvent` accepts one typed `AnyDomainEventEnvelope`.
4. `rebuildGameState` clones a typed event array, validates stream/batch relations, and applies events.
5. `event-applier.ts` checks supported event version, baseline relations, sequence, game relations, and stateful payload meaning.
6. Exhaustive TypeScript switches end in `assertNever`, which protects compilation when the union changes.

Those facts do not validate an arbitrary runtime value:

- TypeScript types disappear at runtime.
- No current entry takes a raw unknown event and first proves the exact 14-key envelope.
- The current stream validator does not prove `category`, exact own keys, data descriptors, no symbols, no Proxy, no cycles, dense arrays, or a plain prototype.
- Current payload helpers commonly use `Object.getPrototypeOf`, `Object.keys`, or direct property reads after receiving a value. They are not one zero-getter hostile-object capture boundary.
- A runtime unknown `eventType` can reach switch/default behavior only after caller-controlled fields have already been read.
- `assertNever` is compile-time exhaustiveness, not an unknown-input rejection protocol.
- A replay rejection does not by itself provide a safe evidence descriptor or a quarantine recommendation.

Therefore no caller-supplied event array, typed cast, rebuilt state, shape-valid fixture, or self-consistent hash may be treated as trusted history.

## P2F1 responsibility boundary

### Sole P2F1 responsibility

P2F1 is one pure, non-authoritative foundation with this unique responsibility:

> Descriptor-safely capture supported plain data, perform semantic-free exact runtime validation and exhaustive domain-event dispatch, and deterministically serialize/hash admitted values.

The P2F1 result may contain only:

- an immutable detached captured value;
- exact validation success or a fixed rejection code;
- safe rejection evidence produced without rendering or retaining hostile input;
- canonical bytes or a canonical string under one frozen version;
- role-specific integrity digests;
- `quarantineRecommended`.

### Responsibilities that remain elsewhere

Existing stateful replay validators continue to own:

- event ordering and stream continuity;
- atomic batch semantics;
- game-version progression;
- phase transitions;
- source facts and cross-event links;
- settlement-time effectiveness;
- canonical state rebuild;
- historical-knowledge stability;
- domain invariants.

Later P2F alone may own:

- accepted-source provenance;
- live journal reconciliation;
- receipt reconciliation;
- game or artifact quarantine state;
- authority epoch and handle lifecycle;
- trusted-history handle issuance;
- canonical-state authority issuance;
- binding an integrity digest to an accepted source.

P2F1 must never issue trusted history or canonical state authority.

## Required exact event envelope

P2F1 Design Round 1 must freeze a descriptor-safe exact envelope with these 14 own enumerable data keys and no others:

```text
category
eventId
gameId
eventSequence
batchId
gameVersion
eventType
eventVersion
rulesBaselineVersion
commandId
createdAt
correlationId
causationId
payload
```

The semantic-free T1 checks are:

- root is a plain object with `Object.prototype` or `null` prototype;
- all listed keys are own enumerable data properties;
- no key is missing;
- no extra string key or symbol key exists;
- no accessor is invoked or accepted;
- no Proxy or revoked Proxy is inspected;
- `category === "domain"`;
- identifiers are nonempty well-formed strings at this layer;
- `eventSequence` and `gameVersion` are positive safe integers excluding negative zero;
- `eventType` is one of the exact 40 registry members;
- `eventVersion === SUPPORTED_DOMAIN_EVENT_VERSION`;
- `rulesBaselineVersion` is a nonempty well-formed string;
- `createdAt` follows the timestamp policy below;
- `payload` passes the exact event-specific semantic-free validator;
- only then may one per-event internal narrowing occur.

Canonical identifier brands and all state/source relations continue to be checked by their existing validators. P2F1 does not infer a brand from a TypeScript cast.

## Descriptor-safe capture contract

The future P2F1 design must close these requirements before any property value is used:

1. primitives are classified without coercion;
2. object values are rejected if `util.types.isProxy` identifies a Proxy, including a revoked Proxy;
3. ancestry detects cycles;
4. `Reflect.ownKeys` is read only after Proxy rejection;
5. symbol keys reject;
6. all property descriptors are collected once;
7. accessors reject and are never invoked;
8. non-enumerable data fields reject, except the standard array `length` descriptor;
9. arrays require the standard prototype, standard `length`, every index from `0` through `length - 1`, and no extra key;
10. objects require `Object.prototype` or `null` prototype;
11. functions, symbols, BigInt, Date, Map, Set, typed arrays, class instances, and other nonplain objects reject;
12. the captured result is detached and immutable before validation or serialization;
13. rejection does not call `String`, `JSON.stringify`, a getter, iterator, `toJSON`, inspection hook, or caller error formatter on the hostile value.

P2F1 must not reuse a helper merely because it is named “plain” or “canonical.” It must prove that the helper meets this hostile boundary.

## Deterministic serialization comparison

### `packages/domain-core/src/canonical-data.ts`

Observed behavior:

- accepted values are `null`, boolean, string, safe integer excluding negative zero, dense arrays, and plain objects;
- `undefined` rejects;
- object keys use raw JavaScript code-unit ordering;
- arrays preserve order;
- the private encoding is a compact tagged string:
  - `z`;
  - `b0` or `b1`;
  - `n<integer>;`;
  - `s<UTF-16-code-unit-length>:<string>`;
  - `a<count>[...]`;
  - `o<count>{...}`;
- it exports validity, dense-array, and equality helpers, but not the encoder or a digest function;
- it first reflects on candidate objects and later relies on `structuredClone` to reject Proxy values;
- it has no explicit serialization version, UTF-8 byte contract, digest domain separation, safe rejection evidence, or 40-event dispatch.

This utility is useful evidence for current value semantics. It is not by itself the P2F1 T1 boundary.

### `packages/application/src/command-fingerprint.ts`

Observed behavior:

- it performs explicit Proxy rejection before reflection;
- it collects descriptors and creates a frozen detached snapshot;
- it accepts `undefined` and represents it as `["UNDEFINED"]`;
- it accepts the other plain-data kinds as tagged JSON nodes;
- object keys use raw JavaScript code-unit ordering;
- arrays preserve order and must be dense without extra keys;
- it has frozen command-specific schema and canonicalization literals;
- it uses `JSON.stringify` over the tagged node;
- it calculates UTF-8 byte length with Node `Buffer.byteLength`;
- it hashes the canonical command JSON with SHA-256;
- its contract is explicitly a supported-command fingerprint and includes command-specific names and equality behavior.

This is stronger hostile-capture evidence, but its value domain and purpose differ from P2F1. In particular, its acceptance of `undefined`, Node `Buffer` dependency, command-specific schema, and tagged-JSON format cannot silently become the event/state canonicalization contract.

### Required conclusion

P2F1 Design Round 1 must freeze one dedicated serialization profile. It may extract proven patterns, but it must not:

- alias the two current formats;
- call them semantically identical;
- reuse the command-fingerprint version literal;
- accept `undefined` merely because command capture accepts it;
- claim cross-platform identity without exact Linux and Windows vectors;
- expose a content digest as trusted-source authority.

## Frozen serialization-policy requirements for P2F1 design

### Null and undefined

- `null` is an admitted value with its own tag.
- `undefined` is rejected at every depth.
- an absent object key is not equal to a present key with any value.
- an array hole is rejected, not converted to `null` or `undefined`.
- JSON omission behavior must never participate in canonicalization.

### Boolean and integer

- booleans have distinct false and true tags.
- the only admitted number is a safe integer.
- negative zero rejects.
- `NaN`, positive or negative infinity, fractions, and unsafe integers reject.
- no number is parsed from a string.
- integer text is the ECMAScript base-10 representation of the already validated safe integer.

### Strings and Unicode

- strings are preserved exactly; there is no NFC, NFD, NFKC, NFKD, case folding, trimming, or locale transformation.
- equality is exact code-unit equality after admission.
- object-key ordering is raw UTF-16 code-unit ordering using `<` and `>`, never `localeCompare` or `Intl.Collator`.
- valid surrogate pairs are preserved.
- an unpaired high or low surrogate rejects in both a string value and an object key.
- rejecting lone surrogates is required because direct UTF-8 encoding replaces ill-formed sequences and could otherwise collapse different JavaScript strings to the same bytes.
- the dedicated P2F1 design must include known-answer vectors for ASCII, Chinese characters, combining sequences, valid supplementary-plane pairs, and rejected lone surrogates.

### Arrays

- arrays are dense.
- the standard `Array.prototype` and standard non-enumerable `length` data property are required.
- only own enumerable index data properties `0..length-1` are allowed.
- extra string or symbol properties reject.
- array order is significant and preserved.
- repeated references are serialized by captured value; object alias identity is not semantic equality.

### Objects

- only `Object.prototype` and `null` prototype records are allowed.
- prototype choice does not alter the canonical value after safe capture.
- every own key must be an enumerable string data property.
- accessors, symbols, non-enumerable fields, cycles, and extra hidden properties reject.
- keys are sorted by raw UTF-16 code units.
- input insertion order is not semantic.
- raw JSON duplicate keys reject before conversion to a JavaScript object; last-key-wins parsing is forbidden.

### Timestamp fields

- P2F1 treats `createdAt` as an opaque, nonempty, well-formed Unicode string.
- it does not call `Date.parse`, construct `Date`, convert time zones, add or remove fractional seconds, or rewrite offsets.
- serialization preserves the admitted string exactly.
- two timestamp spellings that might denote the same instant remain structurally different values.
- batch, replay, or application code retains ownership of timestamp relationships.
- imposing a stricter timestamp grammar would be an event-schema compatibility decision and is not authorized by this precheck.

### Raw JSON and bytes

If P2F1 Design Round 1 includes a raw-bundle parser, it must require:

- exact raw bytes;
- strict UTF-8;
- no UTF-8 BOM;
- one JSON root;
- no duplicate object keys at any depth;
- no comments;
- no trailing comma;
- no `NaN` or infinity;
- no bytes before the root;
- no whitespace or bytes after the root;
- no reviver, `toJSON`, coercion, or repair;
- descriptor-safe capture and exact validation after parsing.

If a duplicate-key-detecting strict parser cannot be provided inside the bounded Slice without a new dependency or an unsafe parser, the design must stop and reslice. It must not use ordinary `JSON.parse` and claim duplicate-key rejection.

### Serialization version

- P2F1 requires one dedicated immutable serialization-version literal.
- the literal must identify the complete accepted value domain, tags, lengths, ordering, Unicode policy, UTF-8 encoder, and rejection rules.
- every canonical digest preimage includes that version and a distinct role tag.
- unknown versions reject; there is no “latest,” fallback, or automatic migration.
- a change to any serialization rule requires a new version and compatibility design.
- the exact version name and grammar must be frozen in P2F1 Design Round 1; this precheck does not authorize an implementation to invent them.

### UTF-8 and SHA-256

- canonical text becomes bytes through the WHATWG `TextEncoder` contract after lone-surrogate rejection.
- no platform default encoding is allowed.
- SHA-256 output is exactly 64 lowercase hexadecimal characters.
- all vectors must match byte-for-byte on required Linux and Windows CI.

## Semantic equality limits

P2F1 canonical equality means only:

> Two admitted captured values serialize to the same bytes under the same frozen P2F1 serialization version.

It may establish:

- object insertion-order independence;
- object prototype independence between allowed prototypes;
- exact array-order sensitivity;
- exact null, boolean, integer, string, array, and object structural equality;
- exact versioned digest equality.

It does not establish:

- BOTC rule equivalence;
- payload meaning;
- event-stream validity;
- batch validity;
- accepted-command provenance;
- receipt validity;
- historical truth;
- canonical `GameState`;
- snapshot authority;
- source identity;
- trusted accepted history;
- authority-handle validity.

Different Unicode normalization forms remain different. Different timestamp spellings remain different. Shared-reference identity and deep-copy identity are not distinguished. A hash collision is not treated as equality: where exact values are available, canonical bytes or captured values must also be compared as required by the consuming design.

## Four separate integrity-hash roles

P2F1 Design Round 1 must keep these four roles separate and domain-separated:

| Role | Required preimage and purpose | Forbidden interpretation |
|---|---|---|
| raw bytes | exact unmodified artifact bytes; computed before decode or parse | not proof that the artifact was approved, accepted, or produced by the repository |
| canonical value/state | serialization-version literal, role tag, and one admitted captured value; a state digest is permitted only after the existing stateful path supplies a semantically validated event-only state | not proof that the value is a valid event, valid state, or accepted history |
| serialization version | a frozen profile identity or profile-manifest digest covering value domain, tags, ordering, Unicode, UTF-8, and rejection rules | not a content digest and not permission to reinterpret another version |
| aggregate binding | serialization-version literal, aggregate role tag, ordered member identities/digests, boundaries, and counts | not proof that members came from accepted transactions or that the aggregate may issue authority |

Required separation rules:

1. each role has a unique immutable domain tag;
2. no digest field is used in its own preimage;
3. member order and count are explicit for aggregate binding;
4. a raw-byte digest cannot substitute for a canonical-value digest;
5. a canonical state digest cannot substitute for a history/journal digest;
6. a serialization-profile identity cannot substitute for a content digest;
7. an aggregate digest cannot repair or hide an invalid member;
8. digest comparison is constant-format equality over validated lowercase hex;
9. exact source approval and accepted transaction provenance remain outside P2F1.

A hash is integrity evidence, never source authority.

## Required rejection, preservation, and quarantine recommendation

P2F1 must fail closed and return a non-authoritative discriminated result. The exact names require design review, but the contract must be equivalent to:

```ts
type P2F1ValidationResult<T> =
  | {
      readonly valid: true;
      readonly captured: T;
      readonly serializationVersion: string;
      readonly canonicalBytes: Uint8Array;
      readonly canonicalValueSha256: string;
      readonly quarantineRecommended: false;
    }
  | {
      readonly valid: false;
      readonly rejection: {
        readonly stage: "CAPTURE" | "ENVELOPE" | "DISPATCH" | "PAYLOAD" | "SERIALIZATION" | "DIGEST";
        readonly code: string;
        readonly eventIndex: number | null;
        readonly safePath: readonly (string | number)[];
      };
      readonly quarantineRecommended: true;
    };
```

This is a design constraint, not an authorized implementation signature.

Safe evidence requirements:

- fixed stage and code values;
- optional numeric event index;
- a path assembled only from already captured, validated key/index components;
- no raw hostile value;
- no caller object reference;
- no getter, proxy trap, iterator, `toString`, JSON serialization, or inspection side effect;
- no secrets or private player knowledge copied into the error;
- deterministic result for the same failure.

Failure behavior:

- reject the complete candidate;
- preserve accepted live events, receipts, and raw imported bytes outside P2F1;
- return `quarantineRecommended: true`;
- never skip an event;
- never downgrade an unknown event to audit/infrastructure/opaque data;
- never coerce, default, repair, trim, normalize, reformat, or silently migrate;
- never continue canonical aggregation past the rejected member;
- never issue a handle or authority token.

P2F1 does not own quarantine. Later P2F decides and records game-epoch or artifact quarantine after considering source kind and accepted-commit semantics. For a post-commit live failure, later P2F must preserve the exact successful application result and accepted history while quarantining authority. For an import failure, later P2F must preserve raw bytes outside canonical state and quarantine the artifact identity. P2F1 supplies the recommendation and safe evidence only.

## Unknown type and version policy

The policy is exact:

- an unknown `eventType` rejects;
- an unsupported `eventVersion` rejects;
- a known type with an invalid payload rejects;
- a missing or extra envelope/payload field rejects;
- a validator-registry mismatch rejects initialization or compilation;
- no “unknown but preserved in canonical history” path exists;
- no fallback validator exists;
- no type/version is mapped to a nearby current event;
- no event is skipped during aggregation or replay;
- no failure is downgraded to a warning.

Preservation means retaining source evidence outside canonical state. It never means admitting the unknown event.

## Snapshot policy

Snapshot status is exactly `CACHE_ONLY`.

P2F1 may structurally validate and canonicalize a snapshot-shaped candidate only as an ordinary value. It cannot:

- make a snapshot source authority;
- issue state authority from a snapshot;
- use a snapshot to repair events;
- include a snapshot in accepted-history provenance;
- allow a snapshot digest to override an event-only rebuilt-state digest;
- rebuild event state;
- compare snapshot state with event-only rebuilt state;
- report a semantic snapshot mismatch.

Later P2F and existing replay code own the event-to-state relation and any semantic snapshot comparison. P2F1 may reject only malformed structure, unsupported serialization version, noncanonical value shape, or invalid digest structure/content within its pure contract. Such a structural rejection returns safe evidence and `quarantineRecommended`; it does not claim an event-state mismatch.

No snapshot schema change is authorized.

## Event, schema, rule, and product compatibility

P2F1 requires:

- no domain-event addition or removal;
- no event-envelope field change;
- no payload field or literal change;
- no `eventVersion` change;
- no command change;
- no accepted-receipt change;
- no snapshot schema change;
- no `GameState` schema change;
- no projection change;
- no persistence migration;
- no BOTC rule interpretation;
- no role behavior change;
- no player-visible behavior change;
- no application result, retry, or atomicity change.

P2F1 validation is dormant until a later authorized consumer uses it. It does not insert itself into `GameApplicationService`, `CommandCommitStore`, replay, persistence, or projection in this precheck.

## Reachability and trust classification

P2F1 has no R1 accepted producer and no R2 approved artifact in this precheck.

- direct malformed or unknown values are `R3 / T1`;
- direct exact-shape/parser/version validation is `STRUCTURAL_VALIDATION`;
- a tampered accepted prefix or imported bundle that exercises aggregate rejection is `HOSTILE_REPLAY_REJECTION`;
- future pure canonical comparison and ordering policies are `R4 / T3 / PURE_POLICY_SEAM` unless a separately reviewed real formal application path is frozen;
- serialization-version validation may be `R4 / T3 / STRUCTURAL_VALIDATION` while the profile remains a future pure foundation;
- exact Linux/Windows vectors are supporting CI evidence and do not convert a future pure R4 behavior into R1;
- any future use of a real accepted command remains P2F responsibility and is not evidence that P2F1 issued authority.

No criterion combines R1 and R3. No row uses more than one primary layer.

## Candidate Design-time Governance Traceability V1.1

The following table is a candidate definition of done for the separately authorized P2F1 Design Round 1. It does not authorize implementation.

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| `P2F1-C01_EVENT_INVENTORY` | The dispatcher covers exactly all current domain events | Compile-time registry has the 40 listed keys exactly once and no extra key | Direct registry parity check against `DomainEventPayloadByType` | `R3` | `T1` | `STRUCTURAL_VALIDATION` | registry initializes only when exact and exhaustive | current `packages/domain-core/src/events.ts`; no event schema change |
| `P2F1-C02_DESCRIPTOR_CAPTURE` | Hostile values are rejected before caller behavior can execute | Proxy, revoked Proxy, accessor, symbol, cycle, sparse array, array extra key, and nonplain object reject with zero getter/trap use where detectable | Direct hostile unknown-value capture matrix | `R3` | `T1` | `STRUCTURAL_VALIDATION` | deterministic safe rejection and `quarantineRecommended=true` | detached valid plain-data control; no authority issuance |
| `P2F1-C03_ENVELOPE_EXACTNESS` | A domain envelope has exactly 14 approved keys and primitive constraints | Missing, extra, hidden, accessor, symbol, wrong literal, invalid ID string, and invalid integer variants reject | Direct exact-envelope validator cases | `R3` | `T1` | `STRUCTURAL_VALIDATION` | only an exact safely captured envelope advances | current `DomainEventEnvelope` contract |
| `P2F1-C04_TYPE_VERSION_DISPATCH` | Unknown types and versions never skip or downgrade | Every known version-1 event dispatches once; unknown type/version rejects before narrowing | Exhaustive dispatcher and unknown discriminator matrix | `R3` | `T1` | `STRUCTURAL_VALIDATION` | exact rejection; no fallback, cast, skip, or repair | exact 40-event registry and `SUPPORTED_DOMAIN_EVENT_VERSION` |
| `P2F1-C05_PAYLOAD_EXACTNESS` | Every event payload has a semantic-free exact unknown validator | Design-frozen per-event adapters cover all 40 payloads without removing or weakening stateful checks | Direct per-event valid control plus missing/extra/wrong-type payload matrix | `R3` | `T1` | `STRUCTURAL_VALIDATION` | all 40 exact payloads admit; every structural mutation rejects | per-event ownership frozen by P2F1 Design Round 1; stateful replay remains authoritative for semantics |
| `P2F1-C06_NULL_UNDEFINED` | Null is distinct and undefined is forbidden | Root/nested null admits; root/nested undefined, holes, and present-undefined fields reject | Direct canonical value policy cases | `R3` | `T1` | `STRUCTURAL_VALIDATION` | no JSON omission or null substitution | dedicated P2F1 value-domain contract |
| `P2F1-C07_INTEGER_POLICY` | Only safe integers other than negative zero are canonical numbers | boundary safe integers admit; fractions, unsafe integers, infinities, NaN, and negative zero reject | Direct numeric-boundary validation vectors | `R3` | `T1` | `STRUCTURAL_VALIDATION` | exact deterministic integer encoding or rejection | ECMAScript safe-integer semantics |
| `P2F1-C08_STRING_UNICODE` | Unicode handling is exact and non-locale-dependent | ASCII, Chinese, combining, and supplementary-pair vectors match; normalization variants differ; lone surrogates reject | Pure Unicode serialization policy with Linux and Windows known-answer support | `R4` | `T3` | `PURE_POLICY_SEAM` | byte-for-byte equal vectors across platforms | frozen P2F1 Unicode and TextEncoder policy; no current formal application path |
| `P2F1-C09_ARRAY_OBJECT_ORDERING` | Arrays preserve order and objects sort raw code units | reordered object keys serialize equally; reversed arrays differ; sparse/extra/accessor/symbol forms reject | Pure canonical ordering policy with required OS-matrix support | `R4` | `T3` | `PURE_POLICY_SEAM` | stable canonical bytes and digests | frozen tagged grammar and raw code-unit comparator; no current formal application path |
| `P2F1-C10_TIMESTAMP_POLICY` | Timestamp strings are preserved without date or locale interpretation | exact string is retained; alternative instant spellings remain distinct; malformed value types and lone surrogates reject | Direct envelope validation and canonical vectors | `R3` | `T1` | `STRUCTURAL_VALIDATION` | no parse, timezone conversion, normalization, or reformat | current `createdAt: string` schema only |
| `P2F1-C11_SERIALIZATION_VERSION` | One explicit version controls the whole canonical contract | version literal is present in every digest preimage; unknown version rejects; known vectors freeze the profile | Direct version-policy validation with cross-platform known-answer support | `R4` | `T3` | `STRUCTURAL_VALIDATION` | no latest/fallback/migration behavior | independently reviewed future P2F1 profile; no current formal application path |
| `P2F1-C12_RAW_BUNDLE_HASH` | Raw-byte integrity is measured before decoding and never becomes authority | one-byte mutation changes raw digest; invalid UTF-8, BOM, duplicate key, or trailing bytes reject parsing regardless of digest | Direct hostile raw-byte, UTF-8, JSON, BOM, duplicate-key, and mutation validation | `R3` | `T1` | `STRUCTURAL_VALIDATION` | raw evidence preserved; no canonical admission or authority | exact raw bytes; approved-source decision remains future P2F |
| `P2F1-C13_CANONICAL_VALUE_HASH` | Admitted structural values have a distinct versioned content digest | semantically identical allowed object order yields same digest; structural difference yields different canonical bytes/digest | Pure canonical value vectors and SHA-256 known answers | `R4` | `T3` | `PURE_POLICY_SEAM` | lowercase 64-hex digest under value role tag | admitted detached value; hash remains integrity evidence |
| `P2F1-C14_STATE_HASH` | State hashing is the value role applied only after semantic validation | a validated event-only rebuilt state can be hashed without P2F1 claiming it is canonical authority | Pure hash call over a T2 state supplied by existing replay | `R4` | `T2` | `PURE_POLICY_SEAM` | state digest returned; no state handle or authority | future consumer must prove existing semantic replay first |
| `P2F1-C15_BINDING_HASH` | Aggregate binding is ordered, counted, versioned, and domain-separated | member reordering, omission, duplication, boundary change, role-tag change, or version change alters/rejects binding | Pure aggregate-binding vectors | `R4` | `T3` | `PURE_POLICY_SEAM` | deterministic aggregate digest with no hidden repair | validated member digests only; provenance remains future P2F |
| `P2F1-C16_HASH_NOT_AUTHORITY` | No hash or P2F1 export can issue source authority | self-consistent caller values and hashes remain ordinary data; no handle/register/issue/hydrate API exists | Public/export surface and direct structural inspection | `R3` | `T1` | `STRUCTURAL_VALIDATION` | integrity result only; trusted-history/state authority impossible | later P2F unique issuer is explicitly out of scope |
| `P2F1-C17_SNAPSHOT_CACHE_ONLY` | Snapshot-shaped data remains an ordinary cache candidate, never authority | absent candidate is allowed; malformed shape, unsupported version, noncanonical value, or invalid digest rejects/recommends quarantine; P2F1 performs no rebuild or semantic event-state comparison | Direct snapshot-shaped candidate structure, version, canonical-value, and digest validation | `R3` | `T1` | `STRUCTURAL_VALIDATION` | `CACHE_ONLY`; structural result only; no repair, override, mismatch claim, rebuild, or authority | later P2F/existing replay exclusively owns event-only rebuild and snapshot relation |
| `P2F1-C18_PRESERVE_QUARANTINE_SIGNAL` | Rejection preserves source evidence and recommends rather than owns quarantine | every validation stage returns fixed safe evidence and `quarantineRecommended=true`; no skip/downgrade; accepted result is untouched | Direct staged-failure matrix including hostile aggregate members | `R3` | `T1` | `STRUCTURAL_VALIDATION` | complete candidate rejects; source evidence preserved outside canonical state | later P2F owns game/artifact quarantine and post-commit policy |

Each row has exactly one reachability class, one trust class, and one legal primary layer.

## Required Design Round 1 decisions

A later P2F1 Design Round 1 must close, rather than delegate to the implementer:

1. exact production and test file allowlists;
2. exact public versus package-internal export surface;
3. exact descriptor-safe capture API;
4. exact immutable capture shape;
5. exact 14-key envelope contract;
6. exact per-event payload validator registry;
7. exact per-event ownership across context-free helpers, new semantic-free wrappers, and unchanged stateful checks;
8. exact rejection codes, stages, safe path, and evidence limits;
9. exact serialization grammar and dedicated version literal;
10. exact Unicode and lone-surrogate algorithm;
11. exact raw JSON parser strategy and dependency policy;
12. exact domain tags and preimage fields for all four digest roles;
13. exact Linux/Windows known-answer vectors;
14. exact rollback and stop-loss;
15. proof that no authority-issuing API exists;
16. proof that P2F remains blocked until P2F1 final review passes.

## Stop conditions

P2F1 design or future implementation must stop and reslice if:

- any current domain event is omitted;
- a generic payload fallback is proposed;
- a raw-to-typed collection cast occurs before per-event exact validation;
- a reused validator invokes hostile caller behavior;
- any existing stateful validator is weakened, replaced, or supplied fabricated context;
- replay semantic validation moves into P2F1;
- ordinary `JSON.parse` is claimed to reject duplicate keys;
- undefined is admitted into event/state canonical data;
- lone surrogates are silently replaced;
- locale, time zone, `Date`, `localeCompare`, or `Intl.Collator` affects bytes;
- a platform-default encoder is used;
- serialization has no explicit immutable version;
- two hash roles share an ambiguous preimage or domain tag;
- a hash is treated as accepted-source evidence;
- a snapshot becomes source authority;
- P2F1 owns quarantine state;
- P2F1 issues or validates an authority handle;
- P2F1 modifies P2F design, domain events, payloads, receipts, snapshots, commands, projections, or BOTC behavior;
- P2F1 requires application behavior changes;
- the bounded design requires an unreviewed external dependency;
- required Linux and Windows deterministic vectors cannot run;
- independent design review does not pass.

## Rollback

This precheck is documentation only. Its rollback is deletion of this one file.

A future P2F1 implementation rollback must be defined by its separately authorized design. Because this precheck forbids event, receipt, snapshot, state, persistence, rule, and product-behavior changes, no data migration or history rewrite is permitted or expected.

## Governance conclusion

- P2F1RequiredPrerequisite: `true`
- designVerdict: `RESLICE_REQUIRED`
- resliceReason: `CURRENT_P2F_BUNDLES_AN_INDEPENDENT_MISSING_TRUST_FOUNDATION`
- recommendedNextSlice: `Phase 3 Slice 2B20B-P2F1 Design Round 1 — Canonical Runtime Validation and Deterministic Serialization Foundation`
- implementationAuthorized: `false`
- requiredNextAction: `STOP_PRECHECK_COMPLETE_AWAIT_SEPARATE_P2F1_DESIGN_AUTHORIZATION`
- P2FStatus: `HUMAN_BLOCKED`
- P2FDesignModified: `false`
- P2F1IssuesTrustedHistory: `never`
- P2F1IssuesCanonicalStateAuthority: `never`
- snapshotStatus: `CACHE_ONLY`
- eventSchemaChanged: `false`
- BOTCRuleChanged: `false`
- productBehaviorChanged: `false`

P2F remains `HUMAN_BLOCKED`. This precheck does not modify P2F design. P2F1 must never issue trusted history or canonical state authority.

GOVERNANCE_PRECHECK_COMPLETE_P2F1_RESLICE_REQUIRED
