# Command Capture Proxy Rejection V1 Governance GO/NO-GO

## Metadata

- Foundation: `COMMAND_CAPTURE_PROXY_REJECTION_V1`
- Authorization: `USER_AUTHORIZED_COMMAND_CAPTURE_PROXY_REJECTION_V1_PREREQUISITE`
- Task type: `SHARED_TRUST_BOUNDARY_HARDENING`
- Candidate base: accepted `main` at `c0c0cdfef1c1aa4cebb841f9867007a319701459`
- Branch: `infra/command-capture-proxy-rejection-v1`
- Assessment date: `2026-07-20`
- Governance authority: `docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md`, including accepted Traceability V1.1
- Review authority: `docs/agent-loop/REVIEW_PROTOCOL.md`
- Reachability: `R1 / EXTERNAL_COMMAND_BOUNDARY`
- Trust: `T1 / EXTERNAL_OR_PERSISTED_BOUNDARY`
- Primary layer: `APPLICATION_COMMAND_INTEGRATION` for the formal service failure path and `STRUCTURAL_VALIDATION` for direct hostile capture
- Sole risk: `LIVE_PROXY_ACCEPTED_AS_PLAIN_COMMAND_DATA`
- Rule semantics changed: `false`
- Event semantics changed: `false`
- Receipt schema changed: `false`
- Fingerprint schema changed: `false`
- Canonicalization algorithm changed: `false`
- Digest algorithm changed: `false`
- Dependency/timeout/CI topology changed: `false`
- Predicted production files: `2`
- Predicted added production LOC: `18–45`, hard ceiling `120`

## BOTC rule gate applicability

`BOTC_RULE_EVIDENCE_NOT_APPLICABLE`

This is not a product Slice, role expansion, ability rule, night-order change, Storyteller policy, event semantic change, state semantic change, projection change, or role-coverage change. The user explicitly classified it as a shared command-capture trust-boundary prerequisite with `ruleSemanticsChanged=false`. Therefore no `docs/rules/evidence/<slice-id>.md` is created for this Foundation and no BOTC role-source claim is inferred. `docs/rules/USER_OVERRIDES.md` and `docs/rules/ROLE_COVERAGE_MATRIX.md` were read only to confirm that the task does not alter them. The applicable external technical authority is the official Node.js `util.types.isProxy` contract plus an exact-runtime zero-trap probe.

## Repository and GitHub state read by this assessment

At assessment time:

- local branch: `infra/command-capture-proxy-rejection-v1`;
- local HEAD: `c0c0cdfef1c1aa4cebb841f9867007a319701459`;
- `origin/main`: `c0c0cdfef1c1aa4cebb841f9867007a319701459`;
- GitHub `main`: `c0c0cdfef1c1aa4cebb841f9867007a319701459`;
- GitHub open PRs: `0`;
- exact main CI: run `29720348273`, `SUCCESS`, exact head `c0c0cdfef1c1aa4cebb841f9867007a319701459`;
- worktree changes are only the four authorized Foundation control documents: `docs/agent-loop/AUTOPILOT_LOG.md`, `AUTOPILOT_STATE.json`, `CURRENT_TASK.md`, and `PROJECT_STATE.md`;
- implementation remains unauthorized while this design gate is pending;
- paused 2B19A3B2 remains unaccepted and its archived test WIP is not present in this worktree.

The assessment read the ordered project handoff, AGENTS instructions, governance ADR, review protocol, current controls, application/persistence/test architecture, command fingerprint and service production paths, both allowed test files, receipt/idempotency tests, ownership registry/verifier, coverage verifier/workflow, paused A3B2 design/status, and actual Git/GitHub state.

## Current root cause and callable impact

`packages/application/src/command-fingerprint.ts::captureNode` rejects accessors, symbols, cycles and nonplain values, but after `typeof value === "object"` it currently executes `ancestors.has`, `ancestors.add`, `Reflect.ownKeys`, descriptor collection, `Array.isArray`, and prototype checks without first rejecting a live Proxy. A transparent non-revoked Proxy can therefore be captured as if it were plain data; a hostile Proxy can execute traps during capture.

`packages/application/src/game-application-service.ts::execute` calls `captureSupportedCommand(incomingCommand)`. When capture fails it immediately calls `Object.getOwnPropertyDescriptor(incomingCommand, "gameId")`. For a top-level Proxy this is a second, independent reflection of the same untrusted value and can invoke a descriptor trap even when capture has already failed.

The path is current and formal: external command → `GameApplicationService.execute` → command capture → receipt/event access. It is `R1 + T1`; this is an actual callable security/trust-boundary defect under governance basis F, not an A3B2 rule or product-design defect.

## Node technical authority and zero-trap proof

Official Node.js documentation for `util.types.isProxy(value)` states that it returns `true` when the value is a Proxy instance and has been available since Node `v10.0.0`: `https://nodejs.org/api/util.html#utiltypesisproxyvalue` (retrieved `2026-07-20`).

The repository and CI freeze Node `24.15.0`. A bounded probe ran on exact local Node `v24.15.0` and exercised Proxy targets `{}`, `[]`, and `Object.create(null)`, plus a revoked Proxy. All were recognized. Plain object, plain array, `null`, and number were not misclassified. The handler installed all of these traps: `getPrototypeOf`, `setPrototypeOf`, `isExtensible`, `preventExtensions`, `getOwnPropertyDescriptor`, `defineProperty`, `has`, `get`, `set`, `deleteProperty`, and `ownKeys`. After every `util.types.isProxy` call, every trap count was exactly `0`. The revoked Proxy was recognized without throwing.

This exact-runtime probe is design evidence, not release evidence. The implementation tests and exact-head CI must independently freeze the zero-trap behavior.

## Security invariant

For every object-valued node at the command-capture T1 boundary:

```text
type/null/primitive classification
→ utilTypes.isProxy(value)
→ if true, throw exact Error("Command values must not be Proxy objects")
→ only if false may ancestors/reflection/descriptors/Array.isArray/prototype/property-value recursion run
```

For capture-failure `gameId` recovery:

```text
unknown incoming value
→ require non-null object
→ utilTypes.isProxy(value)
→ if true, throw existing own-data-gameId TypeError
→ only if false may Object.getOwnPropertyDescriptor(value, "gameId") run
→ accept only a string-valued own data descriptor
```

No Proxy target is inspected, no trap is attempted then caught, and no property getter is invoked.

## Ten GO conditions

| # | Condition | Repository/runtime proof | Verdict |
|---:|---|---|---|
| 1 | Node `util.types.isProxy` can reject before traps | Official API plus exact Node 24.15.0 probe recognized live/revoked object, array and null-target Proxies with every installed trap count `0` | `GO` |
| 2 | No Proxy target read is required | `isProxy` takes the wrapper value; the design performs no reflection, descriptor lookup, prototype query, array test or property read before rejection | `GO` |
| 3 | No new fingerprint schema | Rejection occurs before tagged-tree construction; accepted plain-data tree and `supported-command-structural-fingerprint-v1` stay byte-identical | `GO` |
| 4 | No new receipt schema | Invalid Proxy commands never reach receipt lookup/write; legal commands keep existing `CommandReceipt` and fingerprint | `GO` |
| 5 | No new event | Boundary rejection happens before event loading/construction; no event type or version changes | `GO` |
| 6 | No new `GameState` field | No state rebuild occurs for rejected Proxy commands; all state types remain untouched | `GO` |
| 7 | No dependency upgrade | `node:util` is built in and already imported by `command-fingerprint.ts`; no package or lockfile change | `GO` |
| 8 | No timeout or CI topology change | Tests fit the existing application and application-service compatibility projects and existing 9 ordinary / 10 coverage processes | `GO` |
| 9 | Production files ≤2 | Exact allowlist is `command-fingerprint.ts` and `game-application-service.ts` | `GO` |
| 10 | Added production LOC ≤120 | One capture guard plus one small safe-gameId helper/import/call replacement is estimated at `18–45` added lines | `GO` |

All ten conditions pass. No substantive technical conflict or unavailable required authority remains.

## Reachability and trust classification

- `R1 CURRENTLY_REACHABLE_APPLICATION_PATH`: direct external capture and `GameApplicationService.execute`; top-level Proxy throws at the existing untrusted-gameId boundary; plain envelope with nested Proxy returns an existing retryable command-validation failure; valid plain commands retain accepted/rejected/idempotent behavior.
- `R2 LEGACY_OR_IMPORTED_ACCEPTED_HISTORY`: existing fingerprinted receipts retain exact validation and equality semantics. No migration or reinterpretation is introduced.
- `R3 HOSTILE_OR_CORRUPTED_INPUT`: live/revoked/throwing/nonthrowing/descriptor-changing Proxies and Proxy-wrapped arrays fail closed before traps. Stored fingerprint Proxy defenses remain unchanged.
- `R4 FUTURE_HYPOTHETICAL_STATE`: alternate fingerprint formats, other object-graph serializers, browser/Electron command adapters, new command-result types and new persistence formats are explicitly unsupported and cannot gate this Foundation.

Entry points:

- `captureSupportedCommand`: `T1`, because it captures external command data.
- `GameApplicationService.execute`: `T1`, because it is the formal external command boundary.
- `validateCommandFingerprint` and stored receipt equality: existing `T1` persisted-data boundary, unchanged except for regression evidence.
- tagged-tree creation, code-unit sorting and SHA-256 calculation after successful capture: internal deterministic core; no new public entry point.

## Compatibility freeze

The following literal bytes and semantics are immutable:

```text
COMMAND_FINGERPRINT_SCHEMA_VERSION = supported-command-structural-fingerprint-v1
COMMAND_CANONICALIZATION_ALGORITHM = plain-data-tagged-tree-code-unit-keys-v1
COMMAND_FINGERPRINT_DIGEST_ALGORITHM = SHA-256
```

Also immutable: tagged-node layout; code-unit key order; array order; absence versus own `undefined`; UTF-8 byte length; SHA-256 bytes; six-key fingerprint shape; golden vector; plain-data deep frozen snapshots; receipt validation; idempotency equality; legacy malformed/stored-Proxy fail-closed behavior. No schema version bump and no receipt migration are permitted.

## Exact scope and stop-loss

Production allowlist, exact:

1. `packages/application/src/command-fingerprint.ts`
2. `packages/application/src/game-application-service.ts`

Primary test allowlist, exact:

1. `packages/application/src/command-fingerprint.test.ts`
2. `packages/application/src/game-application-service.test.ts`

Conditional infrastructure/document scope is limited to the accepted ownership/profile mechanism:

- `scripts/vitest-ownership-contracts.mjs` only to refresh the exact non-marker ownership hash caused by the two allowed test files;
- `scripts/verify-coverage-obligations.mjs` only for the later exact profile record;
- `.github/workflows/ci.yml` only for the later exact profile selector token;
- `docs/architecture/command-capture-proxy-rejection-v1-go-no-go.md`;
- `docs/implementation/command-capture-proxy-rejection-v1-design.md`;
- one implementation traceability/status document if required by the accepted governance workflow;
- necessary `docs/agent-loop` controls;
- post-merge review archives and closeout records only after acceptance.

Forbidden: domain-core production; Dreamer, Mathematician, Philosopher or Vortox production; events; `GameState`; receipt or command-result types; command/event versions; public projection; rule evidence; overrides; role coverage; package/lockfile; timeouts; Vitest workspace/topology; shard/process counts; coverage thresholds; dependency versions; A3B2 WIP restoration or execution.

Immediate `HUMAN_BLOCKED` or controlled stop applies if any of these occurs:

- Proxy rejection cannot remain zero-trap on exact Node 24.15.0;
- a Proxy target/property must be read;
- a third production file or more than 120 added production lines is required;
- schema, canonicalization, digest, receipt, command result, event, state, rule, dependency, timeout or topology must change;
- plain command canonical JSON, digest, snapshot, receipt matching or idempotency changes;
- the required production fix expands into A3B2 code/tests;
- an identical failure recurs through both authorized Foundation repair rounds.

Rollback is a normal revert of this Foundation’s source and profile commits before dependent work resumes. No history rewrite, receipt migration, state migration, tag movement, rebase or force push is part of rollback. The accepted main base and paused A3B2 archive remain independent.

## Governance decision

The sole risk is bounded, currently reachable, and fixable at the existing T1 wrapper with the already-supported Node runtime. The change needs no new trust boundary, persistence contract, product semantic, BOTC rule, schema or infrastructure topology. The exact production scope is two files and the size is far below the authorized ceiling.

`GO`

This decision authorizes one standalone design for independent review. It does not authorize implementation before the design gate, does not restore A3B2 WIP, and does not authorize any later Slice.

GO
