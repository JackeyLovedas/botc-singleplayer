# Command Capture Proxy Rejection V1 Standalone Design

## Metadata

- Foundation ID: `COMMAND_CAPTURE_PROXY_REJECTION_V1`
- Authorization: `USER_AUTHORIZED_COMMAND_CAPTURE_PROXY_REJECTION_V1_PREREQUISITE`
- Task type: `SHARED_TRUST_BOUNDARY_HARDENING`
- Branch: `infra/command-capture-proxy-rejection-v1`
- Base: `c0c0cdfef1c1aa4cebb841f9867007a319701459`
- Governance: `docs/architecture/command-capture-proxy-rejection-v1-go-no-go.md`, verdict `GO`
- Design status: `READY_FOR_SECURITY_DESIGN_REVIEW`
- Infrastructure repair budget: `0 / 2` at design time
- Sole risk: `LIVE_PROXY_ACCEPTED_AS_PLAIN_COMMAND_DATA`
- Reachability: `R1 / EXTERNAL_COMMAND_BOUNDARY`
- Trust: `T1 / EXTERNAL_OR_PERSISTED_BOUNDARY`
- BOTC rule evidence: `BOTC_RULE_EVIDENCE_NOT_APPLICABLE`
- Rule semantics changed: `false`
- Product/role behavior changed: `false`
- Event/state/projection semantics changed: `false`
- Receipt/fingerprint schema changed: `false`
- Canonicalization/digest algorithm changed: `false`
- Dependency/timeout/topology changed: `false`
- Predicted production files: `2`
- Predicted added production LOC: `18–45`; maximum `120`

## Objective

Reject every object-valued live or revoked JavaScript Proxy at the first command-capture boundary before any Proxy trap, reflection, descriptor query, array/prototype query, ancestor-set mutation, or property read. When capture fails, prevent `GameApplicationService.execute` from reflecting the original top-level Proxy to recover `gameId`. Preserve every legal plain-data command snapshot, canonical JSON, digest, stored receipt and idempotency result exactly.

## Definitions

- `plain top-level command`: a non-null, non-Proxy object whose `gameId` is an own string-valued data property.
- `top-level Proxy command`: the value passed directly to `execute` or `captureSupportedCommand` is a Proxy.
- `nested Proxy command`: the top-level command is plain, but an own data-property descendant is a Proxy, including a Proxy-wrapped array.
- `zero-trap`: every installed ECMAScript Proxy trap counter remains exactly `0`; the test must not reset counters after execution.
- `zero store access`: `findCommandReceipt=0`, `loadDomainEvents=0`, `commitAcceptedCommand=0`, and `recordRejectedCommand=0` for the service invocation under test.

## Frozen constants and representation

These exact literals must remain byte-identical:

```ts
export const COMMAND_FINGERPRINT_SCHEMA_VERSION =
  "supported-command-structural-fingerprint-v1" as const;
export const COMMAND_CANONICALIZATION_ALGORITHM =
  "plain-data-tagged-tree-code-unit-keys-v1" as const;
export const COMMAND_FINGERPRINT_DIGEST_ALGORITHM = "SHA-256" as const;
```

No change is permitted to `TaggedNode`, six-key `CommandFingerprint`, `createCommandFingerprintFromCanonicalJson`, `compareCodeUnits`, UTF-8 byte calculation, SHA-256 encoding, array order, object key order, repeated acyclic reference behavior, absent/own-undefined distinction, or snapshot freezing.

## Production change 1: captureNode Proxy gate

File: `packages/application/src/command-fingerprint.ts`.

`node:util`’s existing `utilTypes` import is reused. Inside `captureNode`, preserve all primitive handling. Immediately after the existing `typeof value !== "object"` rejection and before `ancestors.has(value)`, insert exactly this semantic guard:

```ts
if (utilTypes.isProxy(value)) {
  throw new Error("Command values must not be Proxy objects");
}
```

The ordering contract is strict. For an object Proxy, none of these may execute before the guard:

- `ancestors.has` or `ancestors.add`;
- `Reflect.ownKeys`;
- `Object.getOwnPropertyDescriptors`;
- `Array.isArray`;
- `Object.getPrototypeOf` / `isPlainObject`;
- any descriptor value recursion or other property read.

Do not implement detection by probing reflection and catching an exception. Do not read a Proxy target. Do not clone, unwrap, serialize, tag, freeze or hash a Proxy. Do not add a schema tag for rejected values.

Exact direct-capture result for every object Proxy:

```ts
{
  valid: false,
  reason: "Command values must not be Proxy objects"
}
```

Required rejected forms:

1. top-level transparent live object Proxy;
2. nested live object Proxy;
3. Proxy-wrapped array;
4. Proxy with a null-prototype target;
5. revoked Proxy;
6. Proxy with throwing `getPrototypeOf`;
7. Proxy with throwing `ownKeys`;
8. Proxy with throwing `getOwnPropertyDescriptor`;
9. Proxy with throwing `get`;
10. nonthrowing Proxy;
11. Proxy whose traps return changing descriptors/values between calls.

All relevant trap counts are `0`. A callable Proxy is already rejected by the pre-existing non-object/plain-data branch without executing a trap; this Foundation does not change that branch or require a different error literal for callable values.

## Preserved capture behavior

Plain objects with `Object.prototype` or `null` prototype remain supported. Dense plain arrays remain supported. Existing failures remain exact for accessors, non-enumerable fields, symbols, functions, bigint, unsafe/noninteger/negative-zero numbers, nonplain objects, sparse/extra/nonstandard arrays and cycles. No existing assertion may be weakened or removed.

The existing stored-fingerprint Proxy defense in `validateCommandFingerprint` remains separately intact. Incoming command capture and stored receipt validation are two distinct T1 boundaries; neither substitutes for the other.

## Production change 2: safe capture-failure gameId boundary

File: `packages/application/src/game-application-service.ts`.

Import `types as utilTypes` from `node:util`. Add one module-private helper with an `unknown` input. Its behavior is frozen, though its private name is not public API:

```ts
const requireSafeUncapturedGameId = (
  incomingCommand: unknown
): SupportedCommandEnvelope["gameId"] => {
  if (
    incomingCommand === null ||
    typeof incomingCommand !== "object" ||
    utilTypes.isProxy(incomingCommand)
  ) {
    throw new TypeError(
      "GameApplicationService requires an own data-property gameId"
    );
  }

  let descriptor: PropertyDescriptor | undefined;
  try {
    descriptor = Object.getOwnPropertyDescriptor(incomingCommand, "gameId");
  } catch {
    throw new TypeError(
      "GameApplicationService requires an own data-property gameId"
    );
  }

  if (
    descriptor === undefined ||
    !("value" in descriptor) ||
    typeof descriptor.value !== "string"
  ) {
    throw new TypeError(
      "GameApplicationService requires an own data-property gameId"
    );
  }
  return descriptor.value as SupportedCommandEnvelope["gameId"];
};
```

Equivalent formatting or a deduplicated private error factory is allowed only if runtime behavior and scope are identical and the total production limit is met. The helper must not call `Object.getOwnPropertyDescriptor` when `utilTypes.isProxy` is true. It must never access `incomingCommand.gameId`, invoke a getter, enumerate keys, query the prototype, or use reflection on a Proxy. Catching descriptor failure is a final exception-safe guard for nonstandard host/exotic inputs, not a Proxy-detection strategy.

Replace only the current invalid-capture block’s raw descriptor logic:

```ts
const gameId = requireSafeUncapturedGameId(incomingCommand);
return failed(
  gameId,
  "DependencyExecutionFailed",
  `Command snapshot validation failed: ${capturedResult.reason}`,
  "command-validation"
);
```

Do not change the public `execute(incomingCommand: SupportedCommandEnvelope)` signature or `CommandResult` union.

### Frozen outcomes

A. Top-level Proxy: `execute` rejects by throwing the existing exact `TypeError("GameApplicationService requires an own data-property gameId")`; all Proxy traps and all four store-port calls are `0`; no result/receipt/event is created.

B. Plain top-level command with nested Proxy: safe own data `gameId` is read only from the plain envelope descriptor, and `execute` resolves to:

```ts
{
  status: "failed",
  gameId: <plain own data gameId>,
  code: "DependencyExecutionFailed",
  message: "Command snapshot validation failed: Command values must not be Proxy objects",
  failureStage: "command-validation",
  retryable: true
}
```

`currentGameVersion` is absent. All nested Proxy traps and all store-port calls are `0`; no receipt/event exists.

C. Valid plain command: behavior is byte-for-byte/shape-for-shape unchanged after capture.

## Behavior, replay and atomicity matrix

| Input/path | Capture | Service outcome | Store access | Mutation | Classification |
|---|---|---|---:|---:|---|
| plain legal new command | unchanged valid snapshot/fingerprint | existing accepted/rejected/failure behavior | unchanged | unchanged | `R1/T1`, existing primary layer |
| plain legal idempotent command | unchanged fingerprint equality | existing stored result with `idempotent:true` | existing receipt read | none | `R1/T1 APPLICATION_COMMAND_INTEGRATION` |
| top-level object Proxy | invalid, exact Proxy reason, zero traps | exact own-data-gameId `TypeError`, zero traps | `0` | `0` | `R1/T1 APPLICATION_COMMAND_INTEGRATION` |
| plain command + nested Proxy | invalid, exact Proxy reason, zero traps | retryable `DependencyExecutionFailed`, `command-validation` | `0` | `0` | `R1/T1 APPLICATION_COMMAND_INTEGRATION` |
| direct hostile Proxy capture | invalid, exact Proxy reason, zero traps | n/a | n/a | n/a | `R3/T1 STRUCTURAL_VALIDATION` |
| valid stored fingerprint/receipt | unchanged validation/equality | unchanged idempotent match | unchanged | none | `R1/T1 APPLICATION_COMMAND_INTEGRATION` |
| legacy/malformed/stored Proxy fingerprint | unchanged fail closed | unchanged nonpersisted conflict behavior | unchanged | none | existing `R2/R3 T1` authority |

No rejected Proxy command reaches accepted-history provenance, event replay, prospective batch validation, append, state rebuild, projection or receipt persistence. That early return/throw is the atomicity contract. The Foundation neither adds nor changes domain replay logic. Existing receipts require no migration because legal command canonical bytes do not change.

## R1/R2/R3/R4 and primary layers

- R1: formal service calls for top-level and nested Proxy failure; plain command success and idempotency compatibility. Main security assertions use `APPLICATION_COMMAND_INTEGRATION`. A plain new command’s successful acceptance remains existing `ACCEPTED_STREAM_INTEGRATION` support, not a new product claim.
- R2: valid previously stored fingerprinted receipts retain exact meaning. Existing legacy receipt tests remain `LEGACY_REPLAY_COMPATIBILITY` support where the producer is historical.
- R3: direct hostile live/revoked/throwing/changing Proxy values use `STRUCTURAL_VALIDATION`. Stored malformed/Proxy fingerprints retain existing fail-closed validation.
- R4: alternate serializers, new fingerprint/receipt versions, browser detection and target unwrapping are absent and out of scope.

Trust is T1 for `captureSupportedCommand`, formal command input, recovered `gameId`, stored fingerprints and receipts. No T2 state is constructed for a rejected Proxy. Internal tagged-tree/digest operations remain deterministic core after successful T1 admission.

## Determinism and information safety

The guard is deterministic for a given JavaScript value category and does not depend on time, randomness, locale, insertion order or environment collation. Existing code-unit sorting stays unchanged. Proxy rejection exposes only the fixed validation message; it carries no canonical state, receipt contents, event history, role data or private information. The service failure result for nested Proxy contains only the already-untrusted plain `gameId` and fixed failure metadata.

## Frozen design-time traceability C01–C10

Every row is a required semantic authority. Physical titles may be finalized after implementation, but each final physical identity has exactly one primary layer and the implementation traceability must bind it.

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| `C01` | External commands must not admit live Proxy data | Direct capture rejects a top-level transparent live Proxy before reflection | Call `captureSupportedCommand` on a transparent object Proxy and assert exact invalid result and zero counters | `R3` | `T1` | `STRUCTURAL_VALIDATION` | exact reason `Command values must not be Proxy objects` | `PLANNED_SUPPORTING_AUTHORITY`: official Node isProxy contract and exact-runtime probe, no mutation |
| `C02` | Validation applies recursively | Direct capture rejects a Proxy in a plain nested own data property | Plain envelope with nested Proxy; exact invalid result; target unchanged; zero traps | `R3` | `T1` | `STRUCTURAL_VALIDATION` | invalid with exact Proxy reason | `C01` may support shared guard ordering; no separate accepted producer |
| `C03` | Arrays cannot bypass the Proxy boundary | Direct capture rejects a Proxy-wrapped array before `Array.isArray`/descriptor work | Plain envelope containing Proxy array; count traps; assert exact invalid | `R3` | `T1` | `STRUCTURAL_VALIDATION` | invalid; all traps `0` | include plain-array positive regression as support |
| `C04` | Revocation cannot force reflective probing | Direct capture rejects an already revoked Proxy without throwing from a trap | `Proxy.revocable`, revoke, capture, assert exact invalid | `R3` | `T1` | `STRUCTURAL_VALIDATION` | invalid; no trap/TypeError escapes capture | preserve the existing revoked-command test unchanged as support |
| `C05` | Prototype reflection is forbidden before Proxy rejection | `getPrototypeOf` trap is never invoked for object/array/null-target/throwing Proxies | Dedicated counter with throwing trap; include null-prototype target | `R3` | `T1` | `STRUCTURAL_VALIDATION` | count `0`; exact invalid reason | exact Node 24.15.0 probe support |
| `C06` | Own-key reflection is forbidden before Proxy rejection | `ownKeys` trap is never invoked | Dedicated throwing/counted `ownKeys` Proxy capture | `R3` | `T1` | `STRUCTURAL_VALIDATION` | count `0`; exact invalid reason | no reflection-after-catch implementation permitted |
| `C07` | Descriptor reflection is forbidden before Proxy rejection | `getOwnPropertyDescriptor` trap is never invoked, including a descriptor-changing Proxy | Throwing proxy plus a nonthrowing proxy that changes descriptor answers; count | `R3` | `T1` | `STRUCTURAL_VALIDATION` | count `0`; both invalid | stored-fingerprint changing-Proxy regression is supporting only |
| `C08` | Property reads are forbidden before Proxy rejection | `get` trap is never invoked, including a transparent/nonthrowing Proxy | Throwing and nonthrowing counted `get` handlers | `R3` | `T1` | `STRUCTURAL_VALIDATION` | count `0`; both invalid | no target access or property equality read |
| `C09` | Formal execute must not re-reflect a top-level Proxy | `execute` rejects top-level live/revoked/throwing Proxy through existing TypeError boundary with every trap count zero | Invoke real `GameApplicationService.execute`; assert rejected promise and exact TypeError text; no test-side property read | `R1` | `T1` | `APPLICATION_COMMAND_INTEGRATION` | exact own-data-property `TypeError`; all trap counts `0` | `C01,C04–C08` direct capture authorities support guard behavior |
| `C10` | Invalid top-level Proxy must stop before persistence | Formal top-level Proxy execution performs zero receipt/event reads and zero writes | Inject an auditing store with four independent call counters and inspect counters without calling store ports | `R1` | `T1` | `APPLICATION_COMMAND_INTEGRATION` | all four port counts `0`; no receipt/event/result object | `PLANNED_SUPPORTING_AUTHORITY`: fresh empty store, accepted status `NONE`, mutation `NONE` |

## Frozen design-time traceability C11–C20

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| `C11` | A trusted plain gameId may classify a nested capture failure | Plain top-level command with nested Proxy returns the exact existing command-validation failure | Real `execute` with own data `gameId`, nested counted Proxy, assert entire result shape and absent current version | `R1` | `T1` | `APPLICATION_COMMAND_INTEGRATION` | `failed / DependencyExecutionFailed / command-validation / retryable:true`; exact message; traps `0` | direct `C02` authority supports capture reason |
| `C12` | Nested Proxy failure precedes persistence reads | The C11 path performs zero receipt and event reads | Auditing store counters on a separate formal service authority | `R1` | `T1` | `APPLICATION_COMMAND_INTEGRATION` | `findCommandReceipt=0`, `loadDomainEvents=0` | same uncommitted empty-store support pattern as C10 |
| `C13` | Retryable capture failure never consumes a receipt | The C11 path performs zero accepted/rejected receipt writes and receipt count remains zero | Auditing store write counters and side-effect-free count field | `R1` | `T1` | `APPLICATION_COMMAND_INTEGRATION` | both write counters `0`; zero receipt | no call to `findCommandReceipt` after execution when proving zero-read count |
| `C14` | Retryable capture failure never appends events | The C11 path performs zero accepted commits and leaves zero events/game version unchanged | Auditing store accepted-commit counter and direct test-owned initial state | `R1` | `T1` | `APPLICATION_COMMAND_INTEGRATION` | zero event writes/events; version remains initial | no rebuild or forged event support |
| `C15` | Existing revoked incoming-command coverage remains valid | The pre-existing revoked Proxy structural test continues to pass without weakened assertions | Run unchanged existing test together with new exact-reason authority | `R3` | `T1` | `STRUCTURAL_VALIDATION` | valid=false; no regression | existing physical test is the authority; do not rename/remove/weaken it |
| `C16` | Stored fingerprint Proxy defenses remain independent and fail closed | Existing live/revoked/throwing/changing stored fingerprint Proxy tests remain exact | Run `validateCommandFingerprint`, equality and service stored-receipt Proxy authorities unchanged | `R3` | `T1` | `STRUCTURAL_VALIDATION` | false/conflict; stored Proxy property-read counters `0` | existing service conflict tests are supporting because main row is direct validation |
| `C17` | Canonical bytes and digest are immutable for legal data | Existing tagged-tree UTF-8/SHA-256 golden vector stays byte-identical | Assert exact canonical string, byte length `111`, digest `8baf95...542`, six-key shape | `R1` | `T1` | `STRUCTURAL_VALIDATION` | exact existing vector unchanged | existing golden test is authoritative and must not be weakened |
| `C18` | Legal object key insertion order does not affect identity | Reordered plain objects retain exact canonical JSON and service idempotency | Direct fingerprint equality plus existing real service reordered-command test | `R1` | `T1` | `APPLICATION_COMMAND_INTEGRATION` | second service result equals first with `idempotent:true`; one receipt/event batch | direct fingerprint unit is supporting only |
| `C19` | Existing receipts continue matching legal incoming commands | A fingerprinted receipt created before retry still matches the same/reordered plain command with no migration or duplicate write | Real service accepts plain command, captures stored receipt, retries equivalent plain command, re-reads exact same receipt | `R1` | `T1` | `APPLICATION_COMMAND_INTEGRATION` | idempotent accepted result; one receipt; unchanged fingerprint bytes; no extra events | fresh accepted receipt is `ACCEPTED`, mutation `NONE`; legacy malformed receipt tests stay supporting |
| `C20` | Schema/version/algorithm identity is frozen | The three exported constants equal exact authorized literals and no public shape/version changes | Literal assertions plus source diff audit against the three constant declarations | `R1` | `T1` | `STRUCTURAL_VALIDATION` | exact schema, canonicalization and `SHA-256` literals | C17 golden and final production allowlist/diff audit support |

The 20 rows cover all user-mandated authorities. Additional cases for null-target, transparent/nonthrowing and descriptor-changing Proxies must be implemented within C01/C05–C08 without creating a new Slice marker or changing the primary layer. Existing accessor, symbol, cycle, sparse-array, nonplain, stored-receipt and golden assertions remain mandatory regressions.

## File allowlists and size contract

Source-stage production, exact and exhaustive:

1. `packages/application/src/command-fingerprint.ts`
2. `packages/application/src/game-application-service.ts`

Source-stage tests, exact and exhaustive:

1. `packages/application/src/command-fingerprint.test.ts`
2. `packages/application/src/game-application-service.test.ts`

Conditional source-stage infrastructure: `scripts/vitest-ownership-contracts.mjs` only if the actual non-marker semantic inventory changes. Source-stage documents: the GO/NO-GO, this design, implementation traceability/status, and necessary agent-loop controls. No other production/test/infrastructure file is allowed. Added production LOC must be `≤120`; expected `18–45`.

Profile-stage allowlist, exact: `scripts/verify-coverage-obligations.mjs`, `.github/workflows/ci.yml` selector token, one exact Foundation coverage-profile document, and necessary controls. It must contain no production or test byte change.

## Test placement and ownership

- `command-fingerprint.test.ts` stays in existing Vitest project `application`.
- service authorities stay in the existing `compatibility-and-failure-boundaries` describe shard and project `application-service-compatibility-and-failure-boundaries`.
- No `[2B...]` marker and no new Slice ownership contract is permitted.
- If added non-marker semantic identities change the frozen inventory, record the exact old/new identity lists and hashes, prove the delta is solely the allowed new authorities, and update only the common `nonMarkerOwnershipSha256` baseline value in every active `2B19A3A`, `2B19A3B1`, and `2B19B` registry record. Their marker patterns, owner projects, criterion sets, project counts/hashes, traceability, support counts and schemas remain byte-identical.
- Unknown Slice markers still fail closed; physical test-file set is unchanged; cross-contract isolation remains exact.

## Required local gates

Use repository-pinned Node `24.15.0` and pnpm `11.7.0` (via Corepack if the shell-global pnpm differs). Run:

```text
pnpm typecheck
pnpm lint
node scripts/verify-vitest-ownership-contracts.mjs --self-test
focused tests for both allowed files/projects
9/9 ordinary process groups and ordinary merge
10/10 coverage process groups and coverage merge
coverage obligation audit
Windows deterministic equivalent
git diff --check
```

All tests must pass; all Proxy trap counts are `0`; no timeout, `onTaskUpdate`, exit-1, missing, duplicate, unexpected or wrong-owner result is allowed. Production diff must be exactly within the two-file allowlist. Constants, golden vector, plain snapshot and stored receipts must be unchanged.

## Commit boundaries and exact profile

Source commit message:

```text
fix: reject Proxy values at command capture
```

It includes source, tests, conditional ownership baseline, GO/design/traceability/status and controls, but no coverage profile. It must include `Co-Authored-By: Codex GPT-5 <noreply@openai.com>`. Record its exact SHA as `COMMAND_PROXY_HARDENING_SOURCE_HEAD`.

From a clean exact source HEAD, run three wholly fresh 10-process coverage candidates. Each must have identical test inventory, source-file set/count/hash, zero-hit statement count/hash, zero-hit function count/hash, zero-hit line count/hash and zero-hit branch-arm count/hash; each must have zero timeout, `onTaskUpdate`, exit-1 and ownership/inventory mismatch. Raw runner artifacts may be recorded separately but cannot replace those canonical identities.

Append, never replace, one exact approved profile whose `sourceHead` equals the full `COMMAND_PROXY_HARDENING_SOURCE_HEAD`. Its deterministic ID is `foundation-command-capture-proxy-rejection-v1-<first-seven-lowercase-hex-of-source-head>` and source kind is `TEN_PROCESS_COMMAND_CAPTURE_PROXY_REJECTION_V1`. Update only the workflow’s exact profile selector to that ID. Profile-only commit message:

```text
ci: record exact command capture proxy hardening profile
```

The profile commit also carries the required co-author trailer and changes no production/test bytes.

## Independent gates, PR and acceptance

Implementation remains unauthorized until an independent read-only reviewer checks this standalone design against the current source, official Node authority, runtime probe, governance ADR and ownership/profile machinery and returns exact `RULE_DESIGN_PASS` with no blocker. Because BOTC semantics are not involved, the review must explicitly record `BOTC_RULE_EVIDENCE_NOT_APPLICABLE` and verify `ruleSemanticsChanged=false`; it must not invent role-rule claims.

PR title: `Foundation: reject Proxy values at the command capture boundary`; base: `main`. The PR body must include technical evidence, implemented trust-boundary claims, explicitly unsupported behavior, exact Node/runtime revision, constant/schema freeze, rule evidence `NOT_APPLICABLE`, and criterion-to-test traceability.

Freeze the final source/profile HEAD, wait for exact-head push and PR CI, then run one complete independent review. The report must contain every AGENTS-required field: `reviewedPR`, `reviewedHead`, `reviewTimestamp`, `reviewScope`, `productionFilesReviewed`, `testFilesReviewed`, `ruleEvidenceReviewed`, `findings`, `codeVerdict`, `ruleVerdict`, and `remainingBlockers`. Acceptance requires exactly:

```text
CODE_REVIEW_PASS
RULE_REVIEW_PASS
remainingBlockers=[]
```

The rule verdict means the reviewer independently verified that no BOTC rule, role coverage, event semantics or night order changed. Publish the complete report verbatim twice with the exact code/rule audit markers, re-read both from GitHub, and verify both reviewed heads equal the current PR head. Any commit after review invalidates CI, review and comments.

Final review must explicitly confirm: zero-trap rejection precedes reflection; top-level execute does not re-reflect; all store-port counts are zero; nested failure exact shape; plain canonical bytes/golden vector/receipts/idempotency unchanged; constants/schema/algorithm/digest unchanged; no event/state/rule/role/dependency/timeout/topology change; exact non-marker ownership delta; stable exact profile; two production files and ≤120 production LOC.

After dual pass, merge with a merge commit, tag that merge `foundation-command-capture-proxy-rejection-v1`, wait for exact merge-main CI, archive the original final-review comments in the post-merge docs-only closeout, wait for exact closeout CI, and remove only the remote Foundation branch. Record product-head, merge and closeout CI separately.

## A3B2 synchronization boundary

Only after Foundation closeout CI succeeds, merge accepted `origin/main` into `phase-3/combined-dreamer-mathematician-integration` with `--no-ff`; never rebase or force push. A conflict outside authorized docs/control, or any conflict in production, tests, rule evidence, frozen design, workflow or fingerprint implementation, is `HUMAN_BLOCKED`. Do not restore the archived WIP.

The subsequent A3B2 release-review document is not a new design round. It may only verify that original A3B2 evidence remains `RULE_READY`, original design remains `RULE_DESIGN_PASS`, behavior/rules/Mathematician schema/Dreamer facts/window/count are unchanged, S06 is accepted independently, ordinary Proxy capture now rejects, no A3B2 production fingerprint change is needed, WIP remains archived, and the only remaining blocker is `PENDING_IMPLEMENTATION_RESUME`. Only exact `DESIGN_RELEASE_PASS` may set A3B2 `READY_FOR_IMPLEMENTATION`; this Foundation task then stops and does not resume implementation.

## Rollback and stop conditions

Rollback is a normal revert of the Foundation source/profile/merge before A3B2 implementation resumes. No receipt/state migration exists. Preserve old profiles and the A3B2 patch/archive. Never reset hard, clean, restore wholesale, rebase, force push, move the accepted tag or rewrite history.

Immediately stop and return `HUMAN_BLOCKED` if zero-trap rejection fails, plain bytes/receipts change, the two-file/120-LOC limit is exceeded, a schema/event/state/rule/dependency/timeout/topology change becomes necessary, a forbidden conflict occurs, or the two authorized Foundation repair rounds fail to close all blockers. No third repair is inferred.

## Explicit out of scope

No A3B2 WIP restore, tests, implementation, ownership/profile, push or PR; no Dreamer/Mathematician/Philosopher/Vortox code; no Phase 2C; no Proxy target unwrapping; no alternate serializer; no new result/receipt/event/state schema; no dependency, timeout, Vitest topology, threshold, rule evidence, override or role-coverage update.

## Terminal design state

This is one bounded, standalone implementation specification. It adds one early Proxy guard and one safe failure-only gameId wrapper, with exact compatibility, atomicity, test, CI, profile, review, rollback and stop contracts.

READY_FOR_SECURITY_DESIGN_REVIEW
