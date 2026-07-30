# Phase 3 Slice 2B20B-P2F1R-A Canonical Runtime Capture and TLV Governance Precheck

## Metadata

- authorization: `USER_AUTHORIZED_PHASE_3_SLICE_2B20B_P2F1R_A_CANONICAL_RUNTIME_CAPTURE_AND_TLV_GOVERNANCE_PRECHECK_ONLY`
- currentHead: `bef395287d5400043565acd5b794d02810d7bbca`
- branch: `phase-3/canonical-drunk-vigormortis-settleability-closure`
- scope: `GOVERNANCE_PRECHECK_ONLY / UNTRUSTED_INPUT -> DESCRIPTOR_SAFE_CAPTURE -> CANONICAL_VALUE -> TLV_SERIALIZATION`
- implementationAuthorized: `false`
- reportTarget: `docs/architecture/2B20B-P2F1R-A-canonical-runtime-capture-tlv-governance-precheck.md`
- worktreeObservation: pre-existing untracked governance/rule documents were present; this read-only architect created or changed none of them.

## Decision summary

`P2F1R-A` is a coherent single-risk foundation Slice if its future design is restricted to one generic capture issuer, one immutable canonical backing model, and one deterministic TLV serializer. Capture and serialization belong together because the serializer accepts only a process-local token issued by the capture boundary; neither capability is useful or independently authoritative without that chain.

The prior combined P2F1 contracts must not be copied wholesale. In particular:

- raw-byte capture and every hash role belong to P2F1R-B;
- BOTC event/envelope/payload structure belongs to P2F1R-C;
- test ownership, coverage profiles, workflow, Windows execution, and publication evidence belong to P2F1R-D;
- replay, event application, role semantics, persistence authority, and trusted-history authority remain outside A-D;
- generic A diagnostics must not contain `KnownSchemaFieldName` or any event/domain field vocabulary. Only generic array indices, raw-key ordinals, and truncation are permitted.

The governance verdict is `GO`. This means only that a bounded Design Round 1 may be authored after separate authorization. It is not `RULE_DESIGN_PASS`, does not authorize implementation, and does not authorize publication or merge.

## Read authorities

- `AGENTS.md`
  - SHA-256: `c4d3af776d27751e91a66339154a4db14aeabf1e14a694c3de33a85093736fd0`
- `docs/architecture/2B20B-P2F1R-canonical-validation-foundation-rescope-governance-precheck.md`
  - SHA-256: `ed531a43732cdf87c227c0dcf9b1697d55b260ec0971708889f8122b054fb993`
- `docs/architecture/2B20B-P2F1-canonical-runtime-validation-deterministic-serialization-design-round-1.md`
  - SHA-256: `85152ec636b87b08b253c20dcaba9f961ba26eaa2e46b75fd80ac108a026cf2a`
- `docs/architecture/2B20B-P2F1-canonical-runtime-validation-deterministic-serialization-design-correction-round-1.md`
  - SHA-256: `74123ae058e21e86aade02bf71a877a82edd97c221ab387ee8aafcfc48d1f112`
- `docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md`
  - SHA-256: `f32bcbc92feb710afb9d12f6105c89e8223a7ea98bd1d73ce249b15b3d59a432`
- `docs/agent-loop/REVIEW_PROTOCOL.md`
  - SHA-256: `4f9328a73172e4a70f8ef64be431a55e23f96bb78e553673d3aef0845ea00b64`
- ordered project handoff documents from `project-handoff/00-README-FIRST.md`.
- `packages/domain-core/src/canonical-data.ts`
  - SHA-256: `40fa746ca89d0f055ed16fbe95a92fc14e7e6e6982e987d863049ec446fb5777`
- `packages/application/src/command-fingerprint.ts`
  - SHA-256: `89919cd2e732917acb9a0e48005a64cbdb9acb1063f16a20724f7a2d13c94d1c`
- `packages/application/src/command-fingerprint.test.ts`
  - SHA-256: `f6aa94560cba18e97115001204820ce730bc1c75db47e4c54965ccf2502ee293`
- `packages/domain-core/src/event-stream-validator.ts`
  - SHA-256: `aaa52ccb7b66176f3bea9b3698f67cc13b522201e1c5f90050729c65b04e9d56`
- `packages/domain-core/src/initial-private-knowledge.ts`
  - SHA-256: `e3d6311bc73b0a6c632db47019ba802fe29209369186ad01760b9555c3ec90da`
- `packages/domain-core/src/index.ts`
  - SHA-256: `185e729dded2fbf32ee0791634277ca1421f7be266f704265a0328bf5c9031b3`
- `packages/domain-core/package.json`
  - SHA-256: `b5dd949fe24d7c3a8b3f964af854cc32c38c427e3bc6b37b03fb6cbfa4551449`

## Actual repository facts

1. `canonical-data.ts` is a small legacy equality/shape helper. It accepts `null`, booleans, strings, safe integers except `-0`, dense arrays, and plain records; it uses `structuredClone` and a string encoder. It has no generic resource limits, no TLV, no opaque token, and it may reach ordinary reflection before Proxy rejection. It must remain unchanged and must not be relabeled as the new foundation.
2. `command-fingerprint.ts` already contains a strong command-specific Proxy-first capture and immutable tagged-tree snapshot. It also intentionally admits own `undefined` and hashes canonical JSON. Its format, domain, package layer, and behavior differ from P2F1R-A. It is supporting precedent only and must remain unchanged.
3. `event-stream-validator.ts` accepts typed event arrays and owns sequence/game/batch/version/baseline checks; it is not an unknown-input structural parser and must not be modified by A.
4. Existing exact role and payload validators are domain-specific. A must not absorb their schemas or use their field names in generic diagnostics.
5. `@botc/domain-core` exposes only its root `src/index.ts`. Therefore A can expose a minimal public token/capture/serialize API while retaining exactly one package-private read-only canonical-backing seam for later Layer C through an internal relative import that is not re-exported from `index.ts`.
6. No general canonical TLV implementation exists at the inspected HEAD.

## Capture boundary

### Public boundary

The future design may define exactly these public capabilities, with final type/result names frozen during Design Round 1:

1. `captureCanonicalRuntimeValue(input: unknown)` — T1 public boundary.
2. `serializeCanonicalRuntimeValue(captured: unknown)` — T1 public token boundary whose successful core serialization is deterministic pure policy.
3. version and generic-limit constants, result/diagnostic types, and the opaque `CapturedCanonicalValue` type.

The public package index must use named additive exports. It must not export the backing representation or the later Layer-C reader.

### Opaque-token issuance

- A successful capture returns only a process-local `CapturedCanonicalValue` token.
- The token is a frozen, null-prototype, zero-own-key object.
- A module-private `WeakSet<object>` authenticates issued tokens and a module-private `WeakMap<object, FrozenCanonicalBacking>` holds the detached backing.
- Serialization first rejects primitive and `null`, then performs only private `WeakSet.has`/`WeakMap.get` operations inside a fail-closed boundary.
- Token validation performs no caller reflection, property access, iteration, coercion, stringification, serialization, or Proxy trap.
- clones, spreads, JSON/structuredClone copies, lookalikes, wrong token types, and tokens from another module instance fail as `INVALID_CAPTURED_CANONICAL_VALUE`.
- Tokens establish structural capture only. They are never event, replay, state, persistence, or accepted-history authority.

### Hostile-input order

At every object occurrence:

1. call `node:util` `types.isProxy` before `Array.isArray`, prototype inspection, key reflection, descriptor reflection, or any property access;
2. `true` or failure of that brand check fails as `PROXY_VALUE`;
3. check already-known depth/node limits;
4. reject an ancestor cycle;
5. classify real array versus record;
6. inspect exact prototype;
7. obtain own keys and enforce generic container-count bounds;
8. reject symbol keys;
9. obtain own descriptors without reading properties;
10. reject accessors and non-enumerable custom properties;
11. enforce exact array shape or record rules;
12. recurse only through descriptor `.value` fields.

Every operation is exception-safe and returns a fixed failure result. No getter, setter, iterator, `toString`, `valueOf`, `toJSON`, inspection hook, method, or species constructor may run. Getter invocation count must remain exactly zero for both successful controls and all accessor rejection cases.

### Prototype and record rules

- A record is admitted only when its exact prototype is `Object.prototype` or `null`.
- class instances and every other prototype are `NONPLAIN_OBJECT`.
- inherited properties are ignored; only own descriptors participate.
- only enumerable own string data properties are admitted.
- symbol keys reject before descriptor traversal.
- ECMAScript non-Proxy own-key lists cannot contain duplicate keys; no normalization or merge creates duplicates.
- keys such as `__proto__`, `constructor`, and numeric-looking strings remain ordinary raw own keys. Internal tuple/null-prototype construction must prevent prototype mutation.
- the canonical representation erases the admitted input prototype distinction: `Object.prototype` and null-prototype records with identical own data have identical canonical value and TLV.
- record keys are copied exactly and caller records are never retained.

### Array rules

- Proxy rejection occurs before `Array.isArray`.
- a real array must have exact `Array.prototype`.
- its own `length` descriptor must have a safe nonnegative integer value, be non-enumerable, non-configurable, and writable, and be within `maxArrayLength`.
- the remaining own keys must be exactly `"0"` through `String(length - 1)` with no hole, symbol, non-index string, out-of-range index, or extra key.
- each element must be an enumerable data descriptor; accessor elements reject without invocation.
- validation compares the key set, not caller enumeration order.
- array order is preserved exactly.

### Detachment and immutability

- The backing representation is a closed tagged tree, not a retained caller object.
- Each captured scalar/key is copied by value; arrays and record-entry lists are newly allocated and deeply frozen.
- repeated acyclic references are traversed, counted, and detached independently; alias identity is deliberately erased.
- an ancestor cycle rejects atomically.
- mutation of the caller after capture cannot affect later serialization.
- no public API returns the internal backing.
- later Layer C may consume one package-private read-only backing seam, omitted from `index.ts`; the backing supplied through that seam is deeply frozen and conveys structure, not history authority.
- each successful serialization returns a new ordinary, non-shared `Uint8Array`. Mutating returned bytes cannot mutate the token, its backing, or bytes returned by a later call.

### Generic diagnostics

The future design must retain fixed failure codes for at least:

`PROXY_VALUE`, `UNDEFINED_VALUE`, `UNSUPPORTED_VALUE_TYPE`, `INVALID_NUMBER`, `LONE_SURROGATE`, `ACCESSOR_PROPERTY`, `SYMBOL_KEY`, `CYCLIC_VALUE`, `SPARSE_ARRAY`, `KEYED_ARRAY`, `INVALID_ARRAY_LENGTH_DESCRIPTOR`, `NONPLAIN_OBJECT`, `NON_ENUMERABLE_PROPERTY`, `RESOURCE_LIMIT_EXCEEDED`, `SERIALIZATION_FAILED`, and `INVALID_CAPTURED_CANONICAL_VALUE`.

Generic A paths may contain only:

- `ARRAY_INDEX` with a numeric index;
- `OBJECT_KEY_ORDINAL` using zero-based raw-UTF-16-sorted ordinal;
- `TRUNCATED`.

Paths contain at most 32 segments, preserving the first 31 and ending in `TRUNCATED` when deeper. A diagnostic contains no raw key, value, ID, event field, byte, hash, state, receipt, or retained input. `KNOWN_FIELD` and `KnownSchemaFieldName` are forbidden in A and belong to Layer C.

## Canonical value model

### Admitted values

- `null`;
- boolean;
- string containing only valid Unicode scalar sequences, including valid surrogate pairs but no lone high or low surrogate;
- safe integer excluding negative zero;
- dense standard array of admitted values;
- plain own-data record satisfying the capture rules above.

### Explicitly rejected values

- `undefined`, including present-own `undefined` in a record or array element;
- fraction, `NaN`, either infinity, unsafe integer, and negative zero;
- bigint, symbol, and function values;
- Proxy and revoked Proxy at any depth;
- accessor, symbol key, non-enumerable custom property, cycle, sparse/keyed/nonstandard array, or nonplain object;
- `Map`, `Set`, `Date`, `RegExp`, `Error`, `Promise`, `ArrayBuffer`, `SharedArrayBuffer`, `DataView`, every typed array, and class instances;
- lone surrogate in either a string value or object key.

`null` is a canonical scalar. `undefined` is not a canonical value and is never omitted, substituted with null, or serialized. “Missing field” is not a generic A concept; missing/required schema keys belong exclusively to Layer C.

### String and key identity

- no Unicode normalization, case folding, trimming, newline conversion, locale transformation, or platform-default encoding;
- canonically equivalent but code-unit-distinct strings remain distinct;
- CR, LF, and CRLF remain distinct;
- keys and values preserve exact valid UTF-16 content;
- lone surrogates reject before `TextEncoder` can replace them;
- object key order is raw JavaScript UTF-16 code-unit order using `left < right ? -1 : left > right ? 1 : 0`;
- numeric-looking keys use that same lexical code-unit order, not numeric, locale, or insertion order.

## TLV contract

### Versions

- canonical value version: `botc-canonical-runtime-value-v1`
- serialization version: `botc-canonical-runtime-tlv-be-v1`

A must not define a digest algorithm or hash version.

### Header and nodes

The byte stream begins exactly once with:

```text
42 4F 54 43 43 52 56 01
```

This is ASCII `BOTCCRV` followed by version byte `01`.

| Tag | Meaning | Body |
|---|---|---|
| `00` | null | none |
| `01` | false | none |
| `02` | true | none |
| `03` | integer | signed two’s-complement `i64be` |
| `04` | string | `u32be` UTF-8 byte length, then strict UTF-8 bytes |
| `05` | array | `u32be` element count, then child nodes in preserved order |
| `06` | object | `u32be` entry count, then sorted entries |

Each object entry contains `u32be` key UTF-8 byte length, the exact key bytes, and one child node. Object keys have no string tag. Child nodes have no repeated stream header. There is no terminator, delimiter concatenation, BOM, JSON intermediary, platform-default encoding, or locale behavior.

### Encoding semantics

- lengths are UTF-8 byte counts, never UTF-16 code-unit counts;
- valid surrogate pairs encode through WHATWG UTF-8 semantics;
- lone surrogates are rejected during capture and never reach encoding;
- integer values use fixed eight-byte signed big-endian representation;
- arrays retain order;
- object entries use the raw UTF-16 key order frozen above;
- the eight-byte header counts toward the serialized-byte limit;
- exact version/header/tag/length/endianness vectors are required in the later design;
- serialization of a valid issued token must be total and deterministic. Any internal invariant failure returns `SERIALIZATION_FAILED` with no partial bytes.

## Resource boundary

The following are generic safety ceilings owned by A, not BOTC domain limits:

```text
maxDepth                 128, root depth 0
maxNodes                 100000
maxArrayLength           10000
maxObjectKeys            10000
maxStringUtf8Bytes       1048576
maxObjectKeyUtf8Bytes    65535
maxSerializedBytes       16777216, including the eight-byte header
maxDiagnosticPath        32 segments
```

Rules:

- every scalar, array, and record occurrence counts as one node;
- repeated acyclic references are counted once per occurrence, not once per identity;
- depth and count arithmetic uses checked safe-integer operations;
- string/key UTF-8 length is measured only after lone-surrogate rejection;
- exact serialized size is computed with checked additions before allocating output;
- capture rejects when its canonical value could not be serialized within `maxSerializedBytes`, so every issued token is serializable under the same version;
- the serializer defensively rechecks its private size invariant and performs one exact-size allocation;
- at-limit candidates may succeed when otherwise valid; one-over candidates return `RESOURCE_LIMIT_EXCEEDED` atomically;
- no partial token, backing, bytes, event, digest, or advisory escapes;
- later Layer C may impose stricter event, field, tuple, ID, collection, or string bounds, but may never weaken or reinterpret A’s generic ceiling;
- no domain vocabulary, event count, roster size, role count, night order, or payload-specific limit belongs in A.

## Reachability and trust inventory

```text
ExpectedR1PrimarySet = []
ExpectedR2PrimarySet = []
ExpectedR3PrimarySet = [hostile/unsupported runtime input, invalid or forged token]
ExpectedR4PrimarySet = [valid future capture, immutable backing, deterministic TLV, compatibility seam]
```

Entry points:

- `captureCanonicalRuntimeValue(unknown)`: `T1 EXTERNAL_OR_PERSISTED_BOUNDARY`.
- `serializeCanonicalRuntimeValue(unknown)`: `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` for token admission.
- module-private canonical comparator/size/encoder routines: `T3 MODULE_PRIVATE_PURE_CORE`.
- package-private read-only backing seam for later Layer C: receives only an authenticated token/backing and is not public; its future design must apply T3 internally after the token’s T1 admission.
- no T2 entry exists in A.

No criterion or physical test identity may use `MIXED`, `MULTI_LAYER`, or more than one primary layer.

## Nine-field P2F1R-A traceability plan

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| `P2F1R-A-C01_PROXY_FIRST` | Unknown Proxy values are rejected before caller-controlled behavior | top-level, nested, array-wrapped, null-target, throwing, transparent, and revoked Proxies cause zero installed traps | direct hostile unknown-input capture with trap counters | `R3` | `T1` | `STRUCTURAL_VALIDATION` | exact `PROXY_VALUE`; no token or partial state | Node `util.types.isProxy` is supporting runtime authority only |
| `P2F1R-A-C02_DESCRIPTOR_SAFE_CONTAINERS` | Capture observes only safe own descriptors | accessors, symbol keys, cycles, sparse/keyed arrays, invalid length, non-enumerable properties, and nonplain prototypes reject; getter count is zero | direct descriptor/prototype/container hostility matrix with valid controls | `R3` | `T1` | `STRUCTURAL_VALIDATION` | exact fixed failure and safe ordinal/index path | valid plain and null-prototype controls support detachment |
| `P2F1R-A-C03_CLOSED_CANONICAL_DOMAIN` | Only the frozen scalar/container domain is canonical | every admitted kind captures and every explicitly rejected runtime kind fails without substitution | direct accepted/rejected canonical-domain matrix | `R3` | `T1` | `STRUCTURAL_VALIDATION` | opaque token or exact failure only | value-version literal supports the closed set |
| `P2F1R-A-C04_NULL_UNDEFINED_BOUNDARY` | Null is a value and undefined is never a value | root/nested null captures; root, record, and array-element undefined reject; absent schema fields are not claimed by A | direct scalar/container boundary cases | `R3` | `T1` | `STRUCTURAL_VALIDATION` | null token succeeds; undefined returns `UNDEFINED_VALUE`; no omission | Layer-C missing-key policy is explicitly non-authoritative here |
| `P2F1R-A-C05_DETACHED_IMMUTABLE_CAPTURE` | Capture retains no caller object and issues only immutable capability tokens | caller mutation cannot change later bytes; repeated references detach independently; backing and token cannot be mutated or forged | direct capture/mutate/serialize and token-lookalike cases | `R4` | `T1` | `STRUCTURAL_VALIDATION` | stable bytes from detached backing; forged token rejects | existing command-fingerprint immutable-capture test is supporting precedent only |
| `P2F1R-A-C06_GENERIC_RESOURCE_LIMITS` | Generic limits fail atomically and are independent from BOTC limits | each depth/node/array/key/string/key-byte/serialized-byte boundary succeeds at limit when otherwise valid and fails one over | direct at-limit/one-over capture matrix, including repeated references | `R3` | `T1` | `STRUCTURAL_VALIDATION` | `RESOURCE_LIMIT_EXCEEDED`; no token or partial bytes | frozen generic-limit table only; no event schema authority |
| `P2F1R-A-C07_UNICODE_NEWLINE_BYTES` | Valid Unicode and newline content has exact unnormalized bytes | valid surrogate-pair and normalization-form vectors remain distinct; CR, LF, and CRLF produce distinct literal bytes | public capture+serialize known-answer vectors | `R4` | `T1` | `PURE_POLICY_SEAM` | exact literal TLV bytes | later P2F1R-D cross-platform execution is planned supporting authority; lone-surrogate rejection is supported by C03 |
| `P2F1R-A-C08_OBJECT_ARRAY_ORDERING` | Records use raw UTF-16 key order and arrays retain order | record insertion permutations match, numeric-looking/code-unit key vectors match frozen order, and array permutations differ | public capture+serialize ordering vectors | `R4` | `T1` | `PURE_POLICY_SEAM` | deterministic literal TLV bytes | frozen comparator is supporting authority; locale APIs are forbidden |
| `P2F1R-A-C09_TLV_V1_CONTRACT` | TLV v1 has one exact header, tag set, lengths, and endianness | null/boolean/integer/string/array/object vectors prove header-once, child framing, `u32be`, and `i64be`; unknown version has no fallback | public capture+serialize literal byte vectors | `R4` | `T1` | `PURE_POLICY_SEAM` | exact `botc-canonical-runtime-tlv-be-v1` bytes | version constants and byte-vector table support the claim |
| `P2F1R-A-C10_TOKEN_IDENTITY` | Only the local issuer’s token can be serialized or inspected | primitive, null, Proxy, revoked Proxy, clone, spread, structured clone, wrong-kind, and lookalike candidates fail without reflection | direct hostile token-admission matrix | `R3` | `T1` | `STRUCTURAL_VALIDATION` | `INVALID_CAPTURED_CANONICAL_VALUE`; zero traps and zero property reads | private WeakSet/WeakMap issuer is supporting implementation authority |
| `P2F1R-A-C11_SERIALIZATION_OUTPUT_ISOLATION` | Serialized bytes are new non-shared output on every success | mutation of one result cannot alter token backing or a later result; no caller buffer/view is accepted as a token | repeated public serialization and mutation-isolation vectors | `R4` | `T1` | `PURE_POLICY_SEAM` | equal original bytes in distinct ordinary `Uint8Array` instances | private immutable backing supports the result |
| `P2F1R-A-C12_ADDITIVE_LEGACY_ISOLATION` | A is additive and does not migrate or alias legacy canonical formats | new versions/APIs are distinct; `canonical-data.ts` and command fingerprint files/formats remain byte-for-byte unchanged and existing regression behavior remains green | new version/API isolation assertion plus unchanged legacy regression execution and static denylist inspection | `R4` | `T3` | `PURE_POLICY_SEAM` | no migration, alias, replacement, or old digest relabeling | existing `command-fingerprint.test.ts` is supporting authority; diff/allowlist is supporting only |

The future Design Round 1 may refine names but may not merge criteria across different reachability, trust, or primary-layer values. Every implementation-time physical test title receives exactly one primary layer. Supporting evidence never changes that primary layer.

## Exact future allowlist

### Production

1. new `packages/domain-core/src/canonical-runtime-value.ts`
   - opaque token issuer;
   - detached immutable backing;
   - generic failure/diagnostic model;
   - generic limits;
   - deterministic TLV serializer;
   - exactly one package-private read-only backing seam for later Layer C.
2. existing `packages/domain-core/src/index.ts`
   - named additive public exports only;
   - must not export the backing type/value or Layer-C seam.

### Tests

3. new `packages/domain-core/src/canonical-runtime-value.test.ts`
   - all P2F1R-A primary authority tests and literal vectors;
   - no hash, event, replay, role, application, projection, persistence, workflow, or coverage assertions.

### Design and traceability documentation

4. future `docs/architecture/2B20B-P2F1R-A-canonical-runtime-capture-tlv-design-round-1.md`.
5. future `docs/implementation/phase-3-slice-2b20b-p2f1r-a-implementation-traceability.md`.

No fixture file is pre-authorized; literal vectors remain in the single test file unless the independently reviewed design proves that a separate immutable fixture is necessary and obtains a rescope.

### Exact denylist

P2F1R-A must not modify or add:

- `canonical-runtime-hash.ts`, raw-byte capture, SHA/digest code, aggregate binding, or any hash role;
- event types, envelope/payload schema registries, validators, event applier, event stream validator, replay, rebuild, `GameState`, snapshots, or accepted-history authority;
- any Dreamer, Vigormortis, impairment, Philosopher, Vortox, role, task, ledger, projection, application, persistence, or receipt behavior;
- `canonical-data.ts`, application command fingerprint code/tests, legacy serializer/signature algorithms, or migrations;
- package dependencies, lockfile, Node/pnpm/Vitest configuration, timeouts, test project/group definitions;
- ownership registry, coverage profiles/obligations, workflow, Windows routing, CI scripts, or exact-head publication metadata;
- agent-loop control state in the implementation allowlist.

If any additional production file, hash/domain/event dependency, or CI/coverage change is required, A stops and returns `RESLICE_REQUIRED` rather than widening.

## Dependency impact

### Upstream

- A depends only on standard Node/ECMAScript primitives already available in the repository: `node:util` Proxy branding, WHATWG `TextEncoder`, ordinary `Uint8Array`, checked integer/byte operations, `WeakSet`, and `WeakMap`.
- It has no dependency on existing `canonical-data.ts`, command fingerprinting, BOTC schemas, replay, roles, application services, persistence, crypto, or CI infrastructure.

### Downstream

- P2F1R-B may consume only the public version constants, authenticated token, and TLV serialization result. B owns all raw-byte and hash behavior.
- P2F1R-C may consume only the authenticated token plus the single package-private deeply frozen canonical-backing seam. C owns event/envelope/payload field meaning and may layer stricter domain bounds. C must not re-reflect the original caller input or define a second capture issuer.
- P2F1R-D owns test-identity registration, hard-coded inventory reconciliation, append-only coverage profile, workflow selection, Windows/literal-vector execution, and exact-head evidence. A cannot claim release closure before D supplies the required evidence lifecycle.
- The later P2F trusted-history authority may consume accepted A/B/C outputs but A itself never becomes history authority.

### Compatibility

- Existing `canonical-data.ts`, command fingerprint canonical JSON and SHA-256, role-catalog/task serializers, event validation, replay, persistence, receipts, projections, and product behavior remain unchanged.
- There is no state migration, event version, persistence format, old digest relabeling, or `GameState` field.
- Slice coverage target is `FOUNDATION`; no role coverage changes.

## Governance decision

A single bounded Slice can own descriptor-safe unknown capture and deterministic TLV because the opaque token makes them one continuous trust boundary. The scope remains within two production files (one new implementation file plus additive index exports), one test file, and traceability documentation. Hashes, BOTC domain validation, replay/roles, and CI/coverage are fully excluded.

No unresolved BOTC rule question or external-source conflict applies to this generic engineering foundation. The design must nevertheless receive its own independently reviewed Design Round 1 before implementation.

## Final fields

currentHead: `bef395287d5400043565acd5b794d02810d7bbca`

branch: `phase-3/canonical-drunk-vigormortis-settleability-closure`

scope: `GOVERNANCE_PRECHECK_ONLY / UNTRUSTED_INPUT_TO_DESCRIPTOR_SAFE_CAPTURE_TO_CANONICAL_VALUE_TO_TLV_SERIALIZATION`

readAuthorities: `[AGENTS.md@c4d3af776d27751e91a66339154a4db14aeabf1e14a694c3de33a85093736fd0, P2F1R-rescope-precheck@ed531a43732cdf87c227c0dcf9b1697d55b260ec0971708889f8122b054fb993, P2F1-parent-design@85152ec636b87b08b253c20dcaba9f961ba26eaa2e46b75fd80ac108a026cf2a, P2F1-correction@74123ae058e21e86aade02bf71a877a82edd97c221ab387ee8aafcfc48d1f112, Traceability-V1.1-ADR@f32bcbc92feb710afb9d12f6105c89e8223a7ea98bd1d73ce249b15b3d59a432, REVIEW_PROTOCOL@4f9328a73172e4a70f8ef64be431a55e23f96bb78e553673d3aef0845ea00b64, actual canonical-data command-fingerprint event-validator private-knowledge index and package sources]`

captureBoundary: `T1 Proxy-first exception-safe descriptor capture; zero caller behavior; exact plain-record/dense-array admission; opaque local token; detached deep-frozen backing; generic ordinal/index diagnostics; no known event fields or history authority`

canonicalValueModel: `closed null/boolean/safe-integer/string/dense-array/plain-record tagged tree; undefined, invalid numbers, accessors, symbols, cycles, sparse/keyed arrays, nonplain/exotic objects, typed buffers, and lone surrogates reject; repeated acyclic references detach by value`

tlvContract: `BOTCCRV+01 header once; tags 00-06; i64be integers; u32be UTF-8 lengths/counts; strict scalar strings; raw UTF-16 object-key order; preserved array order; no normalization/locale/JSON/BOM; fresh nonshared Uint8Array per call`

resourceBoundary: `generic limits depth=128, nodes=100000, arrayLength=10000, objectKeys=10000, stringUtf8Bytes=1048576, objectKeyUtf8Bytes=65535, serializedBytes=16777216 including header, diagnosticPath=32; at-limit/one-over atomic evidence; domain limits remain downstream`

traceabilityPlan: `12 nine-field criteria; R1=[]; R2=[]; hostile input/token paths=R3/T1/STRUCTURAL_VALIDATION; valid capture/TLV/compatibility paths=R4 with T1 public boundaries or T3 pure compatibility seam and PURE_POLICY_SEAM where appropriate; no MIXED, MULTI_LAYER, accepted-stream, replay, projection, or cross-platform primary in A`

allowlist: `[packages/domain-core/src/canonical-runtime-value.ts, packages/domain-core/src/index.ts named additive exports only, packages/domain-core/src/canonical-runtime-value.test.ts, P2F1R-A Design Round 1 document, P2F1R-A implementation traceability document]; hashes, domain events, replay, roles, application, persistence, ownership, coverage, workflow and CI are forbidden`

dependencyImpact: `A has no product/domain/crypto/CI dependency; B consumes public token/TLV only; C consumes authenticated token plus one non-index-exported deeply frozen backing seam; D owns ownership/profile/workflow/Windows/exact-head evidence; later P2F authority remains separate`

designVerdict: `GO`

implementationAuthorized: `false`

filesChanged: `1`

commitCreated: `false`

pushPerformed: `false`

PRCreated: `false`

CIrerunPerformed: `false`

requiredNextAction: `STOP_AND_OBTAIN_EXPLICIT_AUTHORIZATION_TO_AUTHOR_P2F1R_A_DESIGN_ROUND_1_ONLY; THEN_REQUIRE INDEPENDENT DESIGN REVIEW; DO NOT IMPLEMENT, MODIFY CONTROL STATE, OR START P2F1R_B/C/D`
