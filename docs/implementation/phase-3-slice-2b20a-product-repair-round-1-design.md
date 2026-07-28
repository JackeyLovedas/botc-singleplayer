# Phase 3 Slice 2B20A Product Repair Round 1 Design

## Metadata

- sliceId: `2B20A`
- repairName: `Product Repair Round 1`
- authorization: `USER_AUTHORIZED_2B20A_PRODUCT_REPAIR_ROUND_1_DESIGN_C20_C34_C37_ONLY`
- designCorrectionAuthorization: `USER_AUTHORIZED_2B20A_PRODUCT_REPAIR_ROUND_1_DESIGN_CORRECTION_V1_PATH_GATE_BRANCH_ONLY`
- currentPR: `46`
- repairBaseHead: `dbfa424c96a8bcf06a0d2a77205626a532aa2ec8`
- remotePRHead: `dbfa424c96a8bcf06a0d2a77205626a532aa2ec8`
- priorDesignCommit: `627dc709dcbf94e92b61a82cef0b75020b936146`
- priorDesignSha256: `eb8f23f5f8696125ff106a214031c57c4901f67031c270b94f8c9ba74980d6e8`
- priorReviewCommit: `def473e7b84d7b568dcc3d689dcabf5381d48377`
- priorReviewSha256: `c32cf7ce8f58a75d9a56b5e17383e3247c0c1ad5892db961565846167c78f7e2`
- designCorrectionRound: `1 / 2`
- productRepairRound: `0 / 2`
- frozenRound2Design: `docs/implementation/phase-3-slice-2b20a-design-round-2.md`
- frozenRound2DesignSha256: `22c79b8965549a2c32cb2c9199aa1a020fbb17ca3dc1af0b9e080d8825ae120f`
- classificationAppendix: `docs/implementation/phase-3-slice-2b20a-traceability-classification-correction-v1.md`
- classificationAppendixSha256: `ea202534324ac9ce691b29078ab9fb342047b345d63a6cab08e3dca4249e08fb`
- designReleaseReview: `docs/implementation/phase-3-slice-2b20a-design-release-review.md`
- designReleaseReviewSha256: `72017917861325619bd6216f437ece3c8758922db51572306113d1d0a4eaae1f`
- reviewProtocol: `docs/agent-loop/REVIEW_PROTOCOL.md`
- reviewProtocolSha256: `4f9328a73172e4a70f8ef64be431a55e23f96bb78e553673d3aef0845ea00b64`
- governanceAuthorityPath: `docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md`
- governanceAuthorityStatus: `ACCEPTED`
- governanceAuthoritySha256: `f32bcbc92feb710afb9d12f6105c89e8223a7ea98bd1d73ce249b15b3d59a432`
- productHeadPushCI: `30077541075 / FAILURE / dbfa424c96a8bcf06a0d2a77205626a532aa2ec8`
- productHeadPullRequestCI: `30077586762 / FAILURE / dbfa424c96a8bcf06a0d2a77205626a532aa2ec8`
- repairRound: `0 / 2`
- productRepairRoundConsumed: `false`
- implementationAuthorized: `false`
- behaviorDesignChanged: `false`
- ruleSemanticsChanged: `false`
- roleCoverage: `Dreamer PARTIAL`
- targetCoverage: `PARTIAL / REACHABLE_BASE_DREAMER_SETTLEABILITY_ONLY`

This document is the complete Product Repair Round 1 design authority for the
three findings named below. It does not replace or revise the frozen Round 2
behavior design. It specifies only the validation and formal-test repairs
needed to make the existing implementation and evidence conform to that
design.

## Frozen Repair Scope

The repair is limited to:

1. `F01 / C20` — V7 canonical-data validation must not read a numeric array
   index through an accessor.
2. `F04 / C34` — the full adjacent-state capability matrix must be asserted
   with legal accepted-history fixtures and exact existing resolver outcomes.
3. `F05 / C37` — the Dreamer abnormality must be proved through the formal
   Mathematician application command and terminal event path.

The repair does not alter the supported Dreamer behavior, information
selection algorithm, Vortox behavior, settlement semantics, ledger semantics,
event schemas, replay model, receipts, idempotency, projections, or role
coverage.

## Explicitly Out of Scope

- `F08`, `F09`, and `F10`
- ownership-marker, parser, SUP, canonical ownership, traceability-routing, or
  accepted-authority supersession implementation
- Linux worker RPC CI infrastructure
- Windows W7 same-process observability
- workflow, CI profile, process topology, timeout, dependency, or toolchain
  changes
- POISONED Dreamer success behavior
- No Dashii derivation
- gained Dreamer impairment behavior
- impaired or dead Vortox behavior
- general impairment engine
- other-night behavior
- `FIRST_NIGHT -> DAY`
- nomination, vote, death, or Phase 2C
- new events, event versions, commands, state fields, or public projections

## Production and Test Allowlist

### Production allowlist

The maximum production-code allowlist for a later implementation is:

- `packages/domain-core/src/dreamer.ts`

No second production file is authorized.

### Test allowlist

The maximum formal-test allowlist for a later implementation is:

- `packages/domain-core/src/dreamer.test.ts`
- `packages/application/src/game-application-service.test.ts`

### Documentation and control allowlist

A later implementation may update only the following documentation and
control files when needed to record truthful status:

- `docs/implementation/phase-3-slice-2b20a-product-repair-round-1-design.md`
- `docs/implementation/phase-3-slice-2b20a-status.md`
- `docs/implementation/phase-3-slice-2b20a-test-traceability.md`
- `docs/agent-loop/AUTOPILOT_STATE.json`
- `docs/agent-loop/CURRENT_TASK.md`
- `docs/agent-loop/PROJECT_STATE.md`
- `docs/agent-loop/AUTOPILOT_LOG.md`

This design-only action changes only the new design file and the four
agent-loop control files authorized by the user.

## F01 / C20 — Exception-Safe V7 Numeric Index Validation

### Existing defect

The array branch of `isExceptionSafeCanonicalDreamerData` verifies that an
index is an own property and then reads `candidate[index]`. A hostile array can
define that numeric index as an accessor, causing validation to execute
attacker-controlled code. Catching the resulting exception is not sufficient:
the trust-boundary contract requires the getter invocation count to remain
zero.

### Required production repair

For every expected numeric index:

1. obtain the index's own property descriptor without reading the property;
2. fail closed if the descriptor cannot be obtained safely;
3. reject the index unless the descriptor is an own data descriptor;
4. reject any descriptor containing `get` or `set`;
5. recursively inspect only the descriptor's `value`;
6. never evaluate `candidate[index]`, `Reflect.get`, or an equivalent property
   read on the unknown array.

The implementation must remain exception-safe for throwing and revoked
proxies. It must not use JSON serialization, `structuredClone`, or a
read-and-catch strategy as validation.

### Preserved canonical-shape constraints

The existing fail-closed constraints remain mandatory:

- the array prototype is canonical;
- the array is dense;
- the declared length and numeric own keys agree;
- no unexpected string keys exist;
- no symbol keys exist;
- cycles are rejected;
- non-plain nested objects are rejected;
- throwing proxies and revoked proxies are rejected;
- property accessors on objects are rejected;
- valid V7 payloads retain their current accepted result.

The public validator must continue returning its existing fail-closed result;
this repair does not add a new error kind or event.

### Required C20 tests

In `packages/domain-core/src/dreamer.test.ts`, extend C20 with:

- a numeric index getter whose invocation counter remains exactly `0`;
- a numeric index setter/accessor descriptor rejected without invocation;
- a throwing numeric accessor rejected with invocation count `0`;
- throwing proxy and revoked proxy controls;
- getter, symbol, cycle, sparse-array, extra-key, and non-plain controls;
- a valid V7 control proving the accepted shape remains unchanged.

The test must fail against the frozen repair base because of the direct
numeric-index read and pass only after the descriptor-based repair.

## F04 / C34 — Complete Adjacent-State Capability Matrix

### Purpose

C34 must prove that the accepted capability resolver already distinguishes
supported and unsupported adjacent states exactly as frozen. This section is
a formal test-completeness contract, not authorization to change product
behavior.

### Required matrix and exact existing outcomes

The matrix in `packages/domain-core/src/dreamer.test.ts` must construct legal
fixtures where the state is representable and assert these exact outcomes:

| Adjacent state | Exact expected outcome |
|---|---|
| malformed plan, opportunity, tenure, source task, or source contract | `EFFECTIVENESS_UNRESOLVED / SOURCE_PROVENANCE_INVALID` |
| invalid impairment-set shape | `EFFECTIVENESS_UNRESOLVED / SOURCE_IMPAIRMENT_CONFLICT` |
| multiple or duplicate applicable impairments | `EFFECTIVENESS_UNRESOLVED / SOURCE_IMPAIRMENT_CONFLICT` |
| one valid represented noncanonical `POISONED` impairment | `SOURCE_REPRESENTED_IMPAIRED`, with the exact impairment id and `impairmentKind="POISONED"` |
| exact canonical Philosopher-caused `DRUNK` plus one current Fang Gu | `CANONICAL_DRUNK_SOURCE_FANG_GU_APPARENT_INFORMATION_SUPPORTED` |
| no applicable source impairment plus one current Fang Gu | `NORMAL_INFORMATION_SUPPORTED` |
| one current No Dashii | `NO_DASHII_EFFECT_UNRESOLVED` |
| exact canonical `DRUNK` plus one effective current Vortox | `CANONICAL_DRUNK_SOURCE_VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED` |
| no applicable source impairment plus one effective current Vortox | `VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED` |
| conflicting applicable Vortox impairments | `EFFECTIVENESS_UNRESOLVED / VORTOX_EFFECTIVENESS_CONFLICT` |
| one other catalog Demon plus canonical `DRUNK` | `SOURCE_REPRESENTED_IMPAIRED`, with `impairmentKind="DRUNK"` |
| one other catalog Demon plus no source impairment | `EFFECTIVENESS_UNRESOLVED / CURRENT_DEMON_CATALOG_MISMATCH` |
| nonunique current Demon identity | `EFFECTIVENESS_UNRESOLVED / CURRENT_DEMON_IDENTITY_NOT_UNIQUE` |
| current Demon/catalog mismatch | `EFFECTIVENESS_UNRESOLVED / CURRENT_DEMON_CATALOG_MISMATCH` |
| stale otherwise-valid source impairment outside the applicable tenure/revision window plus current Fang Gu | `NORMAL_INFORMATION_SUPPORTED` |
| stale or invalid source contract, tenure, or opportunity provenance | `EFFECTIVENESS_UNRESOLVED / SOURCE_PROVENANCE_INVALID` |
| missing or unprovable source tenure, assignment, or source contract | `EFFECTIVENESS_UNRESOLVED / SOURCE_PROVENANCE_INVALID` |

The valid `POISONED` case must use a genuinely legal POISONED impairment shape.
It must not mutate a DRUNK fixture into a pseudo-POISONED object while retaining
DRUNK-only fields.

### Gained Dreamer unchanged control

Add an explicit control through `resolvePhilosopherGainedDreamerCapability`
showing that no impairment plus one current non-Vortox catalog Demon continues
to return `NORMAL_INFORMATION_SUPPORTED`. No gained-Dreamer resolver production
change is authorized.

### Discovery stop condition

If any legal matrix fixture produces an outcome different from the table, the
implementer must stop and report:

`ADDITIONAL_PRODUCT_BEHAVIOR_DEFECT_REQUIRES_REPAIR_SCOPE_REVIEW`

The discrepancy must not be hidden by changing the fixture, weakening an
assertion, or expanding production behavior under this authorization.

## F05 / C37 — Formal Mathematician Aggregation and Application Path

### Required accepted stream

In `packages/application/src/game-application-service.test.ts`, construct the
real accepted application-command stream that:

1. establishes the canonical Philosopher-caused DRUNK condition on the base
   Dreamer;
2. completes the base Dreamer FALSE V7 delivery and settlement through the
   existing helper and accepted commands;
3. uses the same application service and event store to advance to the base
   `MATHEMATICIAN_INFORMATION` scheduled task;
4. submits the real `SettleMathematicianInformation` command through
   `GameApplicationService.execute`.

A direct ledger filter, a pure helper call, or manual construction of terminal
events is not a primary C37 proof.

### Required terminal events and delivery

The accepted terminal batch must contain:

- `MathematicianInformationDelivered`
- `ScheduledTaskSettled`

For the no-current-Vortox scenario, the delivered information must contain
exactly:

- `trueCount = 1`
- `selectedCount = 1`
- `informationReliability = "RULE_CORRECT"`
- `vortoxConstraint.kind = "NONE_NO_CURRENT_VORTOX"`

### Required aggregation identity

The formal delivery must prove:

- `distinctAbnormalPlayers` contains exactly one entry;
- that entry identifies the base Dreamer source player;
- its supporting fact ids are exactly the Dreamer abnormal outcome fact
  produced by the accepted FALSE V7 settlement;
- the Philosopher source player is absent;
- the Dreamer target player is absent;
- the Dreamer abnormality is not counted twice.

### Required persistence and replay assertions

The application test must additionally prove:

- the accepted event batch is appended atomically;
- the command receipt records the accepted terminal result;
- an idempotent retry does not append duplicate events;
- rebuilding from the accepted event stream yields the same final state;
- the base Mathematician scheduled task is formally settled;
- final state stores exactly one Mathematician information delivery;
- existing 2B19A3B2 combined Dreamer/Mathematician count behavior remains
  unchanged.

The test must use the existing event schema, ledger fact, aggregation, command,
receipt, and rebuild paths. No new Mathematician behavior is authorized.

## Ownership and Supersession Dependency

- ownershipRepairRoute: `EXPLICIT_SUPERSESSION_REQUIRED`
- supersessionActuallyRequired: `true`
- downstreamOwnershipTask: `2B20AP1 accepted-authority supersession, canonical 2B20A ownership, traceability and routing`
- downstreamLinuxTask: `Linux CI infrastructure investigation`
- downstreamWindowsTask: `Windows W7 same-process observability investigation`

Accepted A3A C17 uses the same semantic path and moved from a formal failure
expectation to successful settlement. The old failure test therefore cannot
coexist as preserved authority for the same path. Explicit supersession is
required before canonical ownership and routing can pass.

This Product Repair Round 1 design records that dependency only. It does not
design or implement the supersession, ownership markers, manifest routing,
parser changes, or SUP changes. It also does not investigate or change the
Linux worker-RPC infrastructure or Windows W7 observability path. These are
independent post-implementation PR acceptance and merge gates. They are not
Design-to-Implementation Entry Gate prerequisites for F01/F04/F05.

## Repair Budget

Materializing and reviewing this design does not consume a product repair
round. `repairRound` remains `0 / 2`.

The first later commit that changes the authorized production file or the
formal C20/C34/C37 tests consumes Product Repair Round 1. Ownership,
traceability, CI-infrastructure, PR-metadata, and control-recovery work do not
consume the product repair budget.

## Gate Separation

| Gate layer | Purpose | Required conditions | Explicitly not required at this layer |
|---|---|---|---|
| A. Design-to-Implementation Entry Gate | Authorize the bounded F01/F04/F05 repair | The corrected design receives a new independent `RULE_DESIGN_PASS`; the user then explicitly authorizes Product Repair Round 1 implementation; only after both may `implementationAuthorized=true` be recorded | ownership, markers, SUP registry, coverage routing, Linux CI, Windows CI, hosted exact-head evidence |
| B. Product Repair Implementation and Local Verification Gate | Implement and locally verify only C20/C34/C37 | focused C20, C34, and C37 tests; both allowed full test files; `pnpm typecheck`; `pnpm lint`; full ordinary tests | ownership/routing closure, ownership/coverage/Windows verifiers, workflow or CI-runner repair, GitHub CI for the old frozen HEAD |
| C. PR Acceptance and Final Review Gate | Decide whether PR #46 may be accepted and merged | accepted-authority supersession; canonical 2B20A ownership; parser-compatible traceability; unique SUP registry; ordinary/coverage/Windows routing; complete CI on the exact final HEAD; Linux and Windows blockers closed; new-head C32 hosted evidence; complete independent final review; both pass verdicts; empty blockers; both GitHub audit comments published and re-read | local implementation completion alone never satisfies this gate |

### A. Design-to-Implementation Entry Gate

The only conditions that permit Product Repair Round 1 implementation are:

1. this corrected design receives a new independent `RULE_DESIGN_PASS`; and
2. the user subsequently provides explicit Product Repair Round 1
   implementation authorization.

`implementationAuthorized=true` may be set only after both conditions are
complete. Ownership, coverage routing, Linux CI, and Windows CI do not belong
to this entry gate.

### B. Product Repair Implementation and Local Verification Gate

The bounded implementation must run:

1. focused C20 tests;
2. focused C34 tests;
3. focused C37 application tests;
4. the complete `packages/domain-core/src/dreamer.test.ts`;
5. the complete
   `packages/application/src/game-application-service.test.ts`;
6. `pnpm typecheck`;
7. `pnpm lint`;
8. the full ordinary test suite.

The F01/F04/F05 implementation may be completed and committed locally while
ownership and routing remain open. A known ownership-gate failure is not an
F01/F04/F05 implementation failure and must not be relabeled as one. The
Product Repair implementation task does not repair ownership, markers, the SUP
registry, coverage routing, CI runners, workflows, profiles, dependencies, or
timeouts. It does not rerun GitHub CI for the old frozen
`dbfa424c96a8bcf06a0d2a77205626a532aa2ec8` HEAD, and no existing ownership or
CI failure may be converted into a pass.

The first commit that modifies the authorized production file or formal
C20/C34/C37 tests consumes Product Repair Round `1 / 2`.

### C. PR Acceptance and Final Review Gate

Before PR #46 can be accepted or merged, all of the following independent
downstream gates remain mandatory:

- accepted-authority supersession;
- canonical 2B20A ownership contract;
- parser-compatible traceability;
- unique SUP registry;
- ordinary, coverage, and Windows routing;
- complete CI for the exact final product HEAD;
- closure of the Linux worker-RPC blocker;
- closure of the Windows W7 unknown-exit blocker;
- real hosted C32 evidence bound to the new exact HEAD;
- one complete independent final review;
- `CODE_REVIEW_PASS`;
- `RULE_REVIEW_PASS`;
- `remainingBlockers=[]`;
- both required GitHub audit comments published and re-read.

These gates block PR acceptance and merge. They do not block implementing
F01/F04/F05 after Gate A passes and the user authorizes implementation. Local
Product Repair completion does not mean the branch may be pushed, finally
reviewed, accepted, or merged.

The failed push run `30077541075` and pull-request run `30077586762` are
evidence only for
`dbfa424c96a8bcf06a0d2a77205626a532aa2ec8`. Their results cannot be inherited
by any future HEAD.

## Mandatory Stop Conditions

Stop without expanding this repair if any of the following occurs:

- a new product behavior defect is discovered beyond the F01 trust-boundary
  repair;
- a second production file is required;
- rule semantics would change;
- implementing POISONED or No Dashii behavior becomes necessary;
- an event schema or historical compatibility would change;
- workflow, profile, timeout, dependency, or process topology would change;
- a legal C34 matrix case exposes an additional behavior error;
- C37 cannot be expressed through the existing formal Mathematician command,
  ledger, event, receipt, and replay path.

## Design Rereview Gate

Implementation remains unauthorized until a new independent read-only reviewer
returns `RULE_DESIGN_PASS` for this corrected Product Repair Round 1 design and
the user subsequently provides explicit implementation authorization. Until
then:

- `implementationAuthorized = false`
- `productRepairRoundConsumed = false`
- `repairRound = 0 / 2`
- control status is `HUMAN_BLOCKED`
- detailed state is
  `READY_FOR_INDEPENDENT_PRODUCT_REPAIR_DESIGN_REREVIEW`

READY_FOR_INDEPENDENT_PRODUCT_REPAIR_DESIGN_REREVIEW
