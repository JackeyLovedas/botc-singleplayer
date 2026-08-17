# Phase 3 Slice 2B20B-P2F1R-B Deterministic Integrity Hash Governance Precheck

## Metadata

- authorization: `USER_AUTHORIZED_PHASE_3_SLICE_2B20B_P2F1R_B_DETERMINISTIC_INTEGRITY_HASH_GOVERNANCE_PRECHECK_ONLY`
- currentHead: `bdb3d52eb8ce020fefeb48291b516d3f636a4e0d`
- branch: `phase-3/2b20b-p2f1r-a-canonical-runtime-capture-tlv`
- baselineWorktree: `CLEAN`
- scope: `GOVERNANCE_PRECHECK_ONLY / EXACT_A_TLV_BYTES_TO_ROLE_SEPARATED_DETERMINISTIC_INTEGRITY_HASHES`
- designVerdict: `GO`
- implementationAuthorized: `false`
- reportTarget:
  `docs/architecture/2B20B-P2F1R-B-deterministic-integrity-hash-governance-precheck.md`

## Decision summary

`2B20B-P2F1R-B` is feasible as one bounded architecture Slice when it owns only
three deterministic integrity roles:

1. integrity of an exact private copy of bytes returned by successful A TLV
   serialization;
2. integrity of A canonical-value serialization under an explicit canonical
   value role;
3. integrity of a future, closed binding record whose participating fields are
   themselves encoded through A capture and TLV.

The hash is never authority. It cannot prove that bytes came from A, that an
event was accepted, that history is complete, that state is true, or that a
snapshot is valid. The `GO` verdict authorizes only a separately authorized B
Design Round 1. It is not `RULE_DESIGN_PASS` and does not authorize production
code or tests.

## Authorities read

- `AGENTS.md`.
- The ordered handoff beginning at `project-handoff/00-README-FIRST.md`.
- `docs/agent-loop/CURRENT_TASK.md`.
- `docs/agent-loop/REVIEW_PROTOCOL.md`.
- `docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md`.
- `docs/architecture/2B20B-P2F1R-canonical-validation-foundation-rescope-governance-precheck.md`.
- `docs/architecture/2B20B-P2F1-canonical-runtime-validation-deterministic-serialization-governance-precheck.md`, limited to inherited hash intent and non-authority boundaries.
- `docs/architecture/2B20B-P2F1-canonical-runtime-validation-deterministic-serialization-design-round-1.md`, limited to the original hash sections.
- `docs/architecture/2B20B-P2F1-canonical-runtime-validation-deterministic-serialization-design-correction-round-1.md`, limited to corrected hash framing, metadata, snapshot, non-authority, allowlist, and Stop-Loss clauses.
- `docs/architecture/2B20B-P2F1R-A-canonical-runtime-capture-tlv-governance-precheck.md`.
- `docs/architecture/2B20B-P2F1R-A-canonical-runtime-capture-tlv-design-round-1.md`.
- `docs/architecture/2B20B-P2F1R-A-design-release-sequencing-correction-v1.md`.
- `docs/architecture/2B20B-P2F1R-A-design-release-sequencing-correction-review-v1.md`.
- `docs/implementation/phase-3-slice-2b20b-p2f1r-a-test-traceability.md`.
- `docs/rules/evidence/2B20B-P2F1R-B.md`.
- `packages/domain-core/src/canonical-runtime-value.ts` and its public root exports.
- `packages/domain-core/src/canonical-runtime-value.test.ts`.
- `packages/application/src/command-fingerprint.ts`.
- `packages/application/src/command-fingerprint.test.ts`.

## Exact repository facts and corrected A input

- The inspected branch is
  `phase-3/2b20b-p2f1r-a-canonical-runtime-capture-tlv` at clean baseline HEAD
  `bdb3d52eb8ce020fefeb48291b516d3f636a4e0d`.
- Accepted `main` and `origin/main` both resolve to
  `0dc046aa62b3a72cbd97d99808e0932bf408a09c`.
- A production was authored at
  `f3be36c7b195c3743df4d8213734d72908fed7e5`.
- The frozen reviewed A dependency is its direct child
  `bdb3d52eb8ce020fefeb48291b516d3f636a4e0d`.
- That correction changes only
  `packages/domain-core/src/canonical-runtime-value.test.ts` and
  `docs/implementation/phase-3-slice-2b20b-p2f1r-a-test-traceability.md`.
- A production is byte-identical between those commits. The production blobs
  remain `8ec669c0f0cdafcc246c7b64f564f40fbff8ec73` for
  `canonical-runtime-value.ts` and
  `29d1b9790332f9caf89330363171cc493b2c3915` for `index.ts`.
- A exposes value version `botc-canonical-runtime-value-v1`, serialization
  version `botc-canonical-runtime-tlv-be-v1`, authenticated capture,
  authenticated serialization, and fresh ordinary `Uint8Array` output.
- A serialization bytes are intentionally mutable caller output. A token and
  its private backing remain immutable and authenticated, but a returned byte
  array is not an authenticated provenance token.

Any stale wording that identifies `f3be36c7…` as the B `AInputCommit` is
corrected here. `AInputCommit` is the frozen reviewed HEAD
`bdb3d52eb8ce020fefeb48291b516d3f636a4e0d`; `f3be36c7…` is its byte-identical
production provenance.

## Hash boundary

### What B may prove

B may prove only that the exact byte sequence supplied to a role-specific hash
operation matches the byte sequence later verified under the same exact
protocol metadata:

- **Raw A TLV integrity:** the preimage payload is the exact private copy of
  bytes obtained from a successful A serialization result.
- **Canonical Value integrity:** the preimage payload is the exact A TLV
  serialization of an authenticated A canonical-value token.
- **Future Binding integrity:** the preimage payload is the exact A TLV
  serialization of a future closed binding record.

These are semantic role names for design analysis, not frozen API, type,
constant, or exported symbol names.

### Raw copy boundary

Positive raw inputs in B tests and consumers must originate as `bytes` from a
successful A serialization. Because A returns mutable bytes, Design Round 1 may
define one B-owned hostile-safe `unknown`-to-private-byte-copy wrapper. Such a
wrapper must reject Proxy and invalid views before caller-controlled behavior,
reject shared or detached backing, enforce a bounded length, copy once into
private non-shared storage, and expose no mutable backing.

That wrapper can prove only the exact copied bytes. It cannot prove that an
arbitrary structurally valid byte array was actually issued by A, cannot
authenticate A provenance, and cannot modify A to add such provenance.

### Explicit exclusions

B does not own:

- canonical-state-specific hash roles;
- `canonicalStateHash` or `snapshotHash` claims;
- event, batch, receipt, stream, history, replay, persistence, or accepted
  aggregate hashes;
- event or batch ordering, receipt authenticity, history completeness, or
  persistence compatibility;
- state rebuild, state comparison, state truth, projection, or role semantics;
- artifact approval, source authority, quarantine ownership, or authorization.

## Hash domains

Exactly three roles are permitted:

| Role | Participating payload | Integrity meaning | Forbidden inference |
|---|---|---|---|
| Raw A TLV integrity | exact private copy of successful A serialization bytes | equality of exact copied bytes under the frozen raw role metadata | A provenance, valid canonical token, accepted data |
| Canonical Value integrity | exact A TLV bytes produced from an authenticated A token | equality of one canonical value serialization under its distinct role | state truth, event validity, accepted history |
| Future Binding integrity | exact A TLV bytes for a future closed binding record | equality of an ordered, versioned binding representation | member authority, event/batch/receipt/history acceptance |

No role may alias, rename, reinterpret, or migrate another role. The future
binding cannot smuggle excluded event, batch, receipt, history, state, or
snapshot authority back into B.

## Algorithm contract

SHA-256 is the Design Round 1 candidate because it is already available through
the repository's Node runtime and has a stable 32-byte output. The design must
freeze, before implementation:

- one exact algorithm label and one exact hash-protocol version;
- exactly 32 digest bytes and exactly 64 lowercase hexadecimal characters when
  encoded for display or storage;
- explicit ASCII literals and explicit UTF-8 encoding, never a platform
  default;
- explicit big-endian length fields with widths and overflow bounds frozen;
- the exact A value and serialization versions participating in each framed
  role;
- unambiguous role/domain separation;
- exact payload and preimage lengths;
- literal known-answer vectors for empty/minimal, Unicode, newline, boundary,
  and structurally different payloads.

The design must forbid JSON as a hash intermediary, delimiter concatenation,
implicit coercion, locale behavior, timestamps, host names, environment
values, platform markers, insertion-order dependence, randomness, and
unversioned framing. This precheck intentionally does not freeze final API or
symbol names, exact failure codes, or the final byte-level frame.

## Metadata contract

### Participating metadata

The final preimage must bind all metadata that changes interpretation:

- integrity role/domain;
- hash protocol version;
- A canonical value version;
- A serialization version;
- exact payload length;
- exact payload bytes;
- for the future binding role, every closed binding field encoded through A
  TLV in the exact order/structure frozen by Design Round 1.

Lengths are recomputed from private bytes with checked arithmetic. Caller
length claims are never trusted.

### Display or derived metadata

The following are display/diagnostic only and must not silently participate in
or alter the digest:

- human-readable algorithm and output-encoding labels;
- source/payload length and framed-preimage length copies;
- bounded diagnostic fields;
- host, platform, or timestamp data, if an external evidence layer records
  them at all.

Any displayed length must equal a recomputed value. Host, platform, and
timestamp data are never canonical hash input.

## Failure contract

Design Round 1 must define closed failure families for:

- unsupported algorithm;
- invalid, Proxy, shared, detached, oversized, or otherwise inadmissible byte
  input;
- missing, extra, or wrong metadata, including accessor, symbol, and
  non-enumerable properties;
- hash-protocol, A value, or A serialization version mismatch;
- invalid digest encoding or length;
- digest mismatch;
- invalid A token or A serialization failure;
- internal framing, allocation, arithmetic, or digest failure.

Exact codes and precedence are deferred to Design Round 1. All boundaries fail
closed and exception-safe. Failure returns no partial digest, no authority
claim, no retained input, no raw input bytes, and no caller-derived content in
diagnostics. Verification must validate the complete closed metadata shape,
recompute all lengths and the digest from private bytes, and compare only after
those checks succeed.

## Reachability and trust

```text
ExpectedR1PrimarySet = []
ExpectedR2PrimarySet = []
ExpectedR3PrimarySet = [hostile raw input, invalid metadata, invalid digest,
                        invalid A token/serialization result, verification failure]
ExpectedR4PrimarySet = [deterministic raw-TLV hash, canonical-value hash,
                        future-binding hash, role separation, compatibility vectors]
```

- `R1` is empty because B introduces no formal application command or accepted
  event path.
- `R2` is empty because B promises no legacy/imported history interpretation.
- `R3` owns hostile public input and verification boundaries.
- `R4` owns deterministic pure hash policy and future compatibility vectors.
- Public `unknown` admission and verification are `T1`.
- Private framing and digest policy over authenticated private data are `T3`.
- B has no T2 entry.
- No row or physical test identity may use `MIXED` or `MULTI_LAYER`.

## Snapshot and authority boundary

Snapshot status remains `CACHE_ONLY`. B makes no `snapshotHash` or
`canonicalStateHash` claim and performs no snapshot rebuild, comparison,
selection, repair, semantic rejection, or authorization. A self-consistent
hash proves integrity only; it does not confer acceptance or authority.

## Legacy command-fingerprint compatibility

`packages/application/src/command-fingerprint.ts` is a legacy,
application-specific precedent only. Its SHA-256 use, canonical JSON, schema,
validation behavior, and tests are not a B dependency or migration target.

B must not edit, import, re-export, rename, alias, migrate, or reinterpret the
command fingerprint implementation or its digests. B also must not use legacy
fingerprint acceptance as proof of B correctness. Unchanged regressions and a
static denylist audit may support compatibility only.

## Candidate nine-field Traceability V1.1 plan

These are design candidates. Design Round 1 may refine wording but must retain
all nine fields, one primary mechanism per physical test identity, and the
frozen scope. It must not invent physical test titles or `SUP-*` identifiers.

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| `B-C01_RAW_COPY_BOUNDARY` | Mutable A output must be copied into private non-shared bytes without caller behavior | successful A bytes copy exactly once; Proxy, shared, detached, wrong-view, oversize, and mutation cases fail or remain isolated | hostile direct byte-boundary matrix using successful A serialization as positive input | `R3` | `T1` | `STRUCTURAL_VALIDATION` | private exact copy or closed failure; no raw-byte disclosure | A successful serialization is planned supporting setup only |
| `B-C02_RAW_TLV_HASH` | Raw A TLV integrity covers the exact copied bytes under one frozen role | literal vectors match and any byte change changes verification outcome | hash known-answer vectors over authenticated private copies | `R4` | `T1` | `PURE_POLICY_SEAM` | exact 32-byte/64-lowercase-hex digest and recomputed lengths | A literal TLV vectors are planned supporting authority |
| `B-C03_CANONICAL_VALUE_HASH` | Canonical-value integrity uses authenticated A serialization and a distinct role | equal canonical values match; structural differences, versions, or payload bytes do not alias | capture, serialize, frame, and hash literal canonical-value vectors | `R4` | `T1` | `PURE_POLICY_SEAM` | deterministic role-separated digest | frozen A token and TLV contract are supporting authority |
| `B-C04_FUTURE_BINDING_HASH` | A future closed binding is ordered, versioned, and encoded only through A TLV | field/order/value/version mutations change or reject the binding; excluded authority fields are absent | closed binding capture plus A-TLV and hash vectors | `R4` | `T1` | `PURE_POLICY_SEAM` | deterministic binding-integrity digest only | future binding fields are planned design authority, never accepted-history authority |
| `B-C05_ROLE_DOMAIN_SEPARATION` | The same payload under different roles cannot alias by construction | raw, canonical-value, and binding role frames differ and literal digests differ | pure cross-role framing vectors | `R4` | `T3` | `PURE_POLICY_SEAM` | three unambiguous versioned domains | exact protocol/domain literals must be frozen in design |
| `B-C06_RESULT_METADATA` | Result metadata is exact, closed, and internally consistent | missing/extra/wrong/accessor/symbol/non-enumerable metadata and false lengths reject | hostile result-metadata validation matrix | `R3` | `T1` | `STRUCTURAL_VALIDATION` | exact closed result or failure; lengths recomputed | no external supporting authority |
| `B-C07_DIGEST_VERIFICATION` | Verification recomputes the digest from exact private bytes and closed metadata | valid vectors verify; invalid encoding, length, byte, domain, version, and digest mutations reject | hostile verifier matrix with literal positive vectors | `R3` | `T1` | `STRUCTURAL_VALIDATION` | verified integrity only or closed mismatch | digest known-answer vectors support the positive case |
| `B-C08_FAILURE_PRECEDENCE` | Invalid candidates fail in one deterministic safe order | compound hostile cases return the design-frozen first family without trap, throw, partial digest, or content leak | compound-failure precedence and trap-counter matrix | `R3` | `T1` | `STRUCTURAL_VALIDATION` | exact fixed safe failure family | exact codes and precedence are deferred to Design Round 1 |
| `B-C09_HASH_NOT_AUTHORITY` | A valid or self-consistent hash cannot issue domain authority | clones, lookalikes, caller-created pairs, and valid digests never become event/state/history authorization | negative capability and API-surface audit with self-consistent data | `R4` | `T3` | `PURE_POLICY_SEAM` | integrity evidence only | later semantic issuers remain outside B |
| `B-C10_CACHE_ONLY` | Snapshot-shaped input remains structural cache data only | no snapshot/state semantic API, role, field, rebuild, comparison, or authorization exists | API/allowlist inspection plus ordinary canonical vectors | `R4` | `T3` | `PURE_POLICY_SEAM` | no snapshotHash or canonicalStateHash claim | replay/state owners remain outside B |
| `B-C11_LEGACY_ISOLATION` | B is additive and cannot migrate legacy fingerprints or canonical data | legacy files and behavior remain unchanged; B has no alias/import/reinterpretation path | version/API isolation assertion, denylist inspection, and unchanged legacy regressions | `R4` | `T3` | `PURE_POLICY_SEAM` | no edit, migration, alias, or old digest relabeling | command-fingerprint regressions are precedent/support only |
| `B-C12_PLATFORM_VECTOR_READINESS` | Protocol vectors are platform-independent and ready for later publication | literal ASCII/UTF-8/big-endian/SHA vectors have no locale, time, environment, platform, random, or JSON dependency | local literal-vector and production-source determinism audit | `R4` | `T3` | `PURE_POLICY_SEAM` | frozen local vectors ready for separate execution evidence | P2F1R-D plans Windows/Linux execution as supporting authority |

## Strict future design allowlist proposal

Only a separately authorized and independently reviewed Design Round 1 may
freeze implementation. Its maximum proposed allowlist is:

1. new `packages/domain-core/src/canonical-runtime-hash.ts`;
2. new `packages/domain-core/src/canonical-runtime-hash.test.ts`;
3. B-only architecture, design-review, implementation-traceability, and
   implementation-review Markdown whose file names identify
   `2B20B-P2F1R-B`.

There is no package-root export or `index.ts` edit. No fixture, dependency,
configuration, migration, generated artifact, or second production/test module
is proposed.

## Exact denylist

B must not modify:

- any A file, including `canonical-runtime-value.ts`,
  `canonical-runtime-value.test.ts`, `packages/domain-core/src/index.ts`, or A
  architecture/traceability/review documents;
- `canonical-data.ts` or any legacy canonical/signature implementation;
- any event, event-applier, event-stream, replay, rebuild, `GameState`,
  canonical state, snapshot, persistence, receipt, projection, role, task,
  impairment, ledger, or application source/test/document;
- `packages/application/src/command-fingerprint.ts`, its tests, exports, or
  consumers;
- package manifests, lockfile, dependencies, workspace/Vitest/TypeScript/ESLint
  configuration, timeouts, or test project/group definitions;
- ownership registries, canonical inventories, physical-set hashes, coverage
  obligations/profiles/selectors, workflow, Windows routing, CI scripts/jobs,
  or hosted evidence;
- `docs/agent-loop/**`, `docs/rules/ROLE_COVERAGE_MATRIX.md`, or any role
  coverage/status control.

No canonical-state, snapshot, event, batch, receipt, aggregate-history, or
application-specific hash file may be added under another name.

## Dependency direction and evidence ownership

- B consumes exactly frozen A dependency
  `bdb3d52eb8ce020fefeb48291b516d3f636a4e0d`.
- B may call A's existing capture/serialize contract; it may not alter A,
  reinterpret an A failure, retain A caller input, or create a competing
  canonical serializer.
- A does not depend on B. No B-to-A semantic back-edge or root-export change is
  allowed.
- B uses only repository runtime primitives already available. Any new package
  dependency requires stop and reslice.
- The dependency graph is exactly two independent parallel edges: frozen A
  feeds B, and frozen A feeds C. C consumes frozen A only and must not import,
  call, or otherwise depend on B.
- Later P2F integration may consume the separately frozen A, B, and C outputs.
  That later integration edge creates no C-to-B dependency.
- D consumes only the frozen A, B, and C test identities for evidence. D owns
  ownership registration, inventory totals, coverage/profile evidence,
  Windows/Linux execution, workflow, hosted exact-head CI, and publication;
  it has no runtime dependency or back-edge and cannot change B semantics to
  make evidence pass.
- A static governance check must confirm that no C/event file imports or
  consumes B and that every C/event file remains on B's denylist. This is not a
  runtime test requirement.

Future B-local commands, if Design Round 1 is later authorized, must run through
Corepack with pnpm `11.7.0`; the version must be verified before execution.
Coverage publication, ownership, Windows, and hosted CI are deferred to D.
`pnpm test:coverage` is not a B local gate.

## Stop-Loss

Stop and return for rescope or human direction if any of these becomes
necessary:

1. changing A production, tests, versions, diagnostics, token, TLV, exports, or
   frozen A evidence;
2. exporting B from the package root or adding a second production/test module;
3. accepting a fourth hash role or any canonical-state, snapshot, event, batch,
   receipt, stream, history, replay, persistence, or application hash;
4. claiming A provenance for a structural byte copy;
5. making a hash an issuer, authorization, acceptance, truth, or quarantine
   signal;
6. using JSON, delimiter concatenation, locale, time, environment, platform,
   randomness, insertion order, or an unversioned/ambiguous frame;
7. trusting caller lengths, metadata, digest encoding, or mutable bytes;
8. exposing raw input, partial digest, caller content, or authority wording on
   failure;
9. editing command fingerprint or canonical-data behavior, or requiring a
   migration/alias;
10. requiring ownership, coverage, profile, workflow, Windows, CI, agent-loop,
    role-matrix, dependency, config, or timeout changes inside B;
11. requiring D publication evidence to fabricate a B-local semantic pass, or
    requiring D to modify B semantics;
12. discovering a BOTC rule claim, unresolved source conflict, product behavior
    change, or additional independent subsystem.
13. introducing any C-to-B dependency, C import of B, B edit to a C/event file,
    or D runtime back-edge.

## Architecture impact

- requiredArchitectureChange: `true`
- requiredRuleChange: `false`
- requiredProductChange: `false`
- sliceCoverageTarget: `FOUNDATION`
- roleCoverageImpact: `NONE`

The architecture change is one additive deterministic-integrity module and its
bounded tests after the remaining design gates. It changes no BOTC rule,
player-visible behavior, accepted event, replay promise, persistence format,
snapshot policy, application command, or role coverage.

## Final fields

currentHead: `bdb3d52eb8ce020fefeb48291b516d3f636a4e0d`

branch: `phase-3/2b20b-p2f1r-a-canonical-runtime-capture-tlv`

scope: `GOVERNANCE_PRECHECK_ONLY / THREE_ROLE_DETERMINISTIC_INTEGRITY_HASH_FOUNDATION`

AInputCommit: `bdb3d52eb8ce020fefeb48291b516d3f636a4e0d (frozen reviewed A dependency; production provenance f3be36c7b195c3743df4d8213734d72908fed7e5 is the byte-identical parent)`

hashBoundary: `exact private copy of successful A TLV bytes; authenticated A-token serialization bytes; future closed binding bytes encoded through A TLV; integrity only, never provenance or authority`

hashDomains: `[RAW_A_TLV_INTEGRITY, CANONICAL_VALUE_INTEGRITY, FUTURE_BINDING_INTEGRITY]; semantic role labels only, with final literals and symbols deferred to Design Round 1`

algorithmContract: `SHA-256 candidate; 32 bytes/64 lowercase hex; explicit ASCII and UTF-8; checked big-endian length framing; exact protocol/A versions and role separation; no JSON, delimiter ambiguity, locale, timestamp, environment, platform, random, or insertion-order input; exact frame deferred to design`

metadataContract: `participating role/domain, hash protocol version, A value version, A serialization version, recomputed payload length, exact bytes, and future binding fields via A TLV; algorithm/output labels, copied lengths, diagnostics, host/platform/timestamp are display or external evidence only`

failureContract: `closed unsupported-algorithm, invalid-bytes, exact-metadata, version, digest-encoding, digest-mismatch, invalid-A-token/serialization, and internal-digest families; exact codes/precedence deferred to design; fail closed with no partial digest, authority, retained input, or raw disclosure`

traceability: `12 candidate nine-field rows; R1=[]; R2=[]; R3 hostile validation; R4 deterministic hashes; no MIXED/MULTI_LAYER, invented physical titles, or SUP identifiers; D plans Windows/Linux supporting authority`

allowlist: `[new packages/domain-core/src/canonical-runtime-hash.ts, new packages/domain-core/src/canonical-runtime-hash.test.ts, B-only architecture/traceability/review Markdown]; no package-root export/index edit; all A, canonical-data, event/replay/state/snapshot/persistence/role/application/fingerprint/infrastructure/control files denied`

dependencyImpact: `exact parallel graph frozen A bdb3d52 -> B and frozen A bdb3d52 -> C; C consumes only A and MUST NOT depend on B; later P2F integration may consume frozen A+B+C; D consumes frozen A+B+C test identities only for evidence, owns ownership/coverage/profile/Windows/Linux/workflow/CI/publication evidence, and has no runtime back-edge`

designVerdict: `GO`

implementationAuthorized: `false`

filesChanged: `2`

commitCreated: `false`

pushPerformed: `false`

PRCreated: `false`

CIrerunPerformed: `false`

requiredNextAction: `AUTHORIZE_PHASE_3_SLICE_2B20B_P2F1R_B_DESIGN_ROUND_1_ONLY`
