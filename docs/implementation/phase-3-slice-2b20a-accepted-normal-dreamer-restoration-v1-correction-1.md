# Phase 3 Slice 2B20A — Accepted Normal Dreamer Restoration V1 Correction 1

## Metadata

```text
taskId=2B20A-ACCEPTED-NORMAL-DREAMER-RESTORATION-V1-CORRECTION-1
authorization=USER_AUTHORIZED_2B20A_ACCEPTED_NORMAL_DREAMER_RESTORATION_STOP_LOSS_OVERRIDE_AND_CONDITIONAL_CLOSEOUT
correctionPass=1/2
parentAuditPath=docs/implementation/phase-3-slice-2b20a-final-accepted-behavior-regression-audit.md
parentAuditSha256=06b441d15f28c5b22a0d4ed4e97d5e167d0cba929b98258aab89c4b6c2b36d19
parentDesignPath=docs/implementation/phase-3-slice-2b20a-accepted-normal-dreamer-restoration-v1.md
parentDesignSha256=67c7dc990388345e3309efa984da02c68363869703f1ced039257095ec24ef23
parentReviewedHead=9c3fae097484e04eb85bc3e6b12eddda39982826
parentReviewPath=docs/implementation/phase-3-slice-2b20a-accepted-normal-dreamer-restoration-design-release-review-round-1.md
parentReviewSha256=2bb05599f15c9b0adff992b083519e04adf7bdb74cb1086e832d9b458dc8e3eb
parentReviewVerdict=DESIGN_RELEASE_FIX_REQUIRED
parentReviewBlocker1=RST_C03_PRIMARY_AUTHORITY_LAYER_COLLISION
parentReviewBlocker2=RST_C03_PUBLIC_VALIDATOR_INPUT_CONTRACT_INCOMPLETE
repairBaseHead=70ee998a631a347ced5975dc71923a71072fa5cb
acceptedBehaviorHead=5a69c90f2d3947556ff45c15c467902b1e28ca43
productRepairRound=2/2
newProductRepairRoundCreated=false
acceptedBehaviorRestorationOverrideUsed=true
overrideKind=ACCEPTED_BEHAVIOR_RESTORATION_ONLY
behaviorDesignChanged=false
ruleSemanticsChanged=false
eventSchemaChanged=false
publicAPIChanged=false
supportMatrixExpanded=false
roleCoverageChanged=false
implementationAuthorized=false
```

No future correction, implementation, review, CI, or closeout SHA or passing
verdict is recorded.

## Final implementation authority

This document is the complete, self-contained implementation authority for the
accepted normal Dreamer restoration. It inherits the accepted-behavior boundary of
the parent audit and parent design, and replaces the parent design only where the
Round-1 independent review identified these two documentation-contract defects:

- `RST_C03_PRIMARY_AUTHORITY_LAYER_COLLISION`;
- `RST_C03_PUBLIC_VALIDATOR_INPUT_CONTRACT_INCOMPLETE`.

No other parent contract changes. This is correction pass `1/2`, not a new design
round and not Product Repair Round 3. Dreamer coverage remains `PARTIAL`.

## Accepted behavior and exact production boundary

After the unique-current-Demon and exact catalog-match gates pass, a healthy base
Dreamer returns `NORMAL_INFORMATION_SUPPORTED` for every Demon other than Vortox
and No Dashii.

The only production file and symbol that a later independently authorized
implementation may modify is:

`packages/domain-core/src/dreamer.ts::resolveBaseDreamerV2NormalCapability`

The frozen tail policy is:

```ts
if (demon.role.roleId === "no_dashii") {
  // Preserve the existing result.
}

if (demon.role.roleId === "vortox") {
  // Preserve existing tenure, impairment, and forced-false semantics.
}

if (demon.role.roleId === "fang_gu" && canonicalDrunk !== undefined) {
  // Preserve the existing V7 capability and exact payload.
}

if (canonicalDrunk !== undefined) {
  return {
    kind: "SOURCE_REPRESENTED_IMPAIRED",
    impairmentId: canonicalDrunk.impairmentId,
    impairmentKind: "DRUNK"
  };
}

return {
  kind: "NORMAL_INFORMATION_SUPPORTED",
  evaluationModelVersion: DREAMER_BASE_SOURCE_EFFECTIVENESS_MODEL_VERSION,
  evaluatedCharacterStateRevision: input.currentCharacterState.revision,
  sourceRoleTenureId: tenure.roleTenureId,
  sourceAbilityInstanceId: expectedAbility
};
```

After exact catalog matching has been proven, the resolver must not return
`CURRENT_DEMON_CATALOG_MISMATCH`. Existing earlier non-canonical represented
impairment branches, including POISONED, must not move or be refactored.

## Preserved behavior

The implementation must leave unchanged:

- No Dashii behavior;
- effective, impaired, and dead Vortox behavior;
- canonical-drunk Fang Gu V7 capability and payload;
- canonical-drunk non-Fang-Gu represented impairment;
- other represented impairment, including POISONED;
- gained Dreamer behavior;
- first-night outcome ledger behavior;
- projection privacy and delivered historical knowledge;
- receipt and command idempotency behavior;
- event schemas, event versions, public APIs, and V1–V7 replay outside the exact
  restored fallback.

There is no schema, data, or support-matrix migration.

## Governance Traceability V1.1

This design-time traceability table has exactly the nine required fields and no
Actual fields.

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| RST-C01 | After exact catalog matching, the healthy base-Dreamer normal policy applies to every Demon other than No Dashii and Vortox. | Direct matrix covers healthy Fang Gu, healthy Vigormortis, canonical-drunk Fang Gu, canonical-drunk Vigormortis, No Dashii, Vortox, and real mismatch. | `DIRECT_RESOLVER_MATRIX` | `R1` | `T2` | `PURE_POLICY_SEAM` | Healthy Fang Gu and Vigormortis are NORMAL; Fang Gu drunk is V7; other drunk is represented impaired; real mismatch fails closed. | Accepted main, 2B19A2 design, and 2B20A resolved evidence. |
| RST-C02 | The restored resolver must work through the real application command path. | Real GameApplicationService submits a Dreamer action under healthy Vigormortis setup, atomically produces V2 target, V2 delivery and settlement, and verifies receipt, rebuild, and retry. | `REAL_GAME_APPLICATION_SERVICE_COMMAND_CHAIN_ACCEPTED_EVENTS_RECEIPT_APPEND_REBUILD` | `R1` | `T1` | `ACCEPTED_STREAM_INTEGRATION` | Accepted; opportunity CLOSED; task settled; EFFECTIVE; retry is idempotent without another append. | RST-C01 and existing V2 command, receipt, and atomic contracts. |
| RST-C03 | Accepted V2 history must remain valid and retain legacy replay semantics. | Existing canonical `[2B20A-C30] rebuilds accepted legacy Dreamer information for an EVIL target without reinterpretation` validates and rebuilds a real Vigormortis accepted V2 stream and rejects semantic or terminal-batch tamper. | `ACCEPTED_V2_HISTORY_VALIDATE_REBUILD_REPLAY_WITH_COMPLETE_PREFIX_VALIDATOR_INPUT` | `R2` | `T1` | `LEGACY_REPLAY_COMPATIBILITY` | V2 remains V2, validates with the complete canonical prefix-state input, and rebuilds identically; semantic or terminal-batch tamper is rejected. | RST-C02 is the real-stream source; the existing A3B1 C08/C30/C36-S14/S16/S17 hostile test remains supporting authority only and retains `HOSTILE_REPLAY_REJECTION / R3 / T1`. |
| RST-C04 | Only a real snapshot/catalog mismatch may return mismatch. | Construct structurally valid input whose current Demon snapshot disagrees with the catalog snapshot. | `STRUCTURALLY_VALID_CURRENT_STATE_CATALOG_SEMANTIC_MISMATCH` | `R1` | `T2` | `PURE_POLICY_SEAM` | Exact `EFFECTIVENESS_UNRESOLVED/CURRENT_DEMON_CATALOG_MISMATCH`. | Existing C34 mismatch fixture and catalog exact-match gate. |

The existing `[2B20A-C30]` identity is the sole RST-C03 legacy replay primary. The
A3B1 hostile physical test is supporting authority only; its accepted
`HOSTILE_REPLAY_REJECTION / R3 / T1` primary classification does not change. No
test identity is borrowed, duplicated, or reclassified. Semantic inventory remains
`1572`; primary and supporting authority inventories remain `37/37`.

## Test design

No `it` block may be added. Existing titles, markers, logical groups, routing, and
ownership must remain unchanged.

### RST-C01 direct resolver

Extend the existing title verbatim:

```text
[2B20A-C34] resolves only the exact canonical-drunk Fang Gu capability
```

It must assert exactly:

- healthy Fang Gu → `NORMAL_INFORMATION_SUPPORTED`;
- healthy exact catalog-matching Vigormortis →
  `NORMAL_INFORMATION_SUPPORTED`;
- canonical DRUNK plus Fang Gu →
  `CANONICAL_DRUNK_SOURCE_FANG_GU_APPARENT_INFORMATION_SUPPORTED`;
- canonical DRUNK plus Vigormortis → `SOURCE_REPRESENTED_IMPAIRED`;
- No Dashii and Vortox preserve their existing exact results;
- a structurally valid real snapshot/catalog mismatch returns
  `CURRENT_DEMON_CATALOG_MISMATCH`.

Broad “not success” assertions are forbidden.

### RST-C02 real application

Extend the existing title verbatim:

```text
[2B19A2-C07] accepts another modeled player through the real V3 command stream
```

A module-local parameterized helper may use a legal copy of
`noPhilosopherExactRoleIds` to replace Fang Gu exactly with Vigormortis. The default
Fang Gu fixture must remain byte-identical.

The real `GameApplicationService` chain must prove:

- V3 opportunity begins OPEN;
- `SubmitDreamerAction` is accepted;
- atomic event order is `DreamerTargetChosen` V2,
  `DreamerInformationDelivered` V2, then `ScheduledTaskSettled`;
- one batch, continuous sequence, one append, and one receipt;
- rebuilt state equals persisted state;
- opportunity becomes CLOSED and the task is settled;
- `informationReliability=EFFECTIVE`;
- one good and one evil role are delivered and the target's true role is included;
- neither V7 nor Vortox delivery is produced;
- retrying the same `commandId` is idempotent without another event or receipt.

Application production code is outside scope.

### RST-C03 canonical legacy replay primary

Extend the existing canonical title verbatim in
`packages/domain-core/src/rebuild.test.ts`:

```text
[2B20A-C30] rebuilds accepted legacy Dreamer information for an EVIL target without reinterpretation
```

Use the real Vigormortis V2 accepted stream produced through
`GameApplicationService`. The existing test-harness helper may be parameterized only
if necessary to carry that stream; the default Fang Gu fixture output must remain
byte-identical.

The canonical prefix state must be obtained by applying the stream through
`DreamerTargetChosen` and stopping before `DreamerInformationDelivered`. It must not
be a final state or a manually reconstructed state. Every input to
`validateDreamerInformationDeliveredPayload` comes from that same canonical
`prefixState`, including the previously omitted required field:

```ts
validateDreamerInformationDeliveredPayload(payload, {
  choices: prefixState.choices,
  deliveries: prefixState.dreamerInformation,
  setup: prefixState.setup,
  currentCharacterState: prefixState.currentCharacterState,
  abilityImpairments: prefixState.abilityImpairments,
  firstNightActionOpportunities: prefixState.firstNightActionOpportunities,
  firstNightTaskPlan: prefixState.firstNightTaskPlan,
  firstNightTaskProgress: prefixState.firstNightTaskProgress,
  roleTenures: prefixState.roleTenures
});
```

These exact property names match the public production validator signature. All
required values, especially `deliveries: prefixState.dreamerInformation`, come from
the one canonical prefix state. No final-state or hand-assembled substitute is
allowed.

The C30 primary must prove:

- `validateDomainEventStream` accepts the complete stream;
- the public V2 validator with complete prefix input returns exactly
  `{ valid: true }`;
- `rebuildOptionalGameState` equals the original final state;
- the delivery schema remains V2 and is not reinterpreted as V7;
- target, source, source contract, catalog, and settlement are preserved;
- at least one shape-valid semantic delivery tamper is rejected;
- missing or reordered terminal-batch history is rejected.

The existing title below remains only hostile/tamper supporting authority and must
not become the RST-C03 legacy replay primary:

```text
[2B19A3B1-C08/C30/C36-S14/S16/S17] rebuilds legacy generations and rejects V4 envelopes evidence and ledger mutations
```

Its accepted `HOSTILE_REPLAY_REJECTION / R3 / T1` classification and S16/S17
structural-supporting status remain unchanged.

### RST-C04 real mismatch

C34 remains the primary fail-closed evidence for structurally valid input whose
current Demon snapshot truly disagrees with the catalog snapshot. Exact healthy
Vigormortis must never use the mismatch result.

## Implementation file scope

After an independent passing design-release review, the bounded production and test
allowlist is:

- `packages/domain-core/src/dreamer.ts`;
- `packages/domain-core/src/dreamer.test.ts`;
- `packages/application/src/game-application-service.test.ts`;
- `packages/domain-core/src/rebuild.test.ts`;
- an existing test-harness helper file only if strictly necessary to carry the real
  Vigormortis stream while preserving its default Fang Gu output byte-for-byte.

Application production code is forbidden. No second production file or second
production symbol is authorized.

The implementation may also update the audit/correction status, independent design
and implementation reviews, and the four active agent-loop controls.

Coverage remains conditional. If the existing AP2 exact profile passes, no profile
or workflow may change. Only an exact obligation mismatch fully attributable to the
single `dreamer.ts` source delta may authorize a separate child commit changing:

- `scripts/verify-coverage-obligations.mjs`;
- `.github/workflows/ci.yml`;
- a new coverage-profile audit.

The old profile remains byte-identical and any new profile binds `sourceHead` to the
separate source implementation commit.

## Acceptance gates

Focused evidence must cover C34, C07, canonical C30, the A3B1 hostile supporting
test, C20 hostile/descriptor regression, and C37 Mathematician regression.

Required implementation validation:

- every modified test file;
- `pnpm typecheck`;
- `pnpm lint`;
- `pnpm test`;
- AP1 ownership, supersession, traceability, supporting-authority, and all three
  routing inventories;
- complete AP2 segmented coverage;
- approved exact coverage-profile verification.

Expected invariant:

```text
semantic inventory=1572
primary=37
supporting=37
ordinary/coverage/Windows logical topology=unchanged
```

## Rollback

Use ordinary `git revert` for the bounded restoration commit. If a separate
coverage-profile child exists, revert it first. Do not reset, rebase, amend, or
modify an old profile.

## Independent correction review checklist

The independent reviewer must verify:

- accepted-main behavior is restored without rule expansion;
- production scope remains one file and one resolver;
- healthy Fang Gu and Vigormortis are NORMAL;
- Fang Gu V7, canonical-drunk non-Fang-Gu, No Dashii, Vortox, gained Dreamer,
  POISONED, and real mismatch behavior remain unchanged;
- RST-C03 primary is exactly the existing `[2B20A-C30]`;
- the A3B1 hostile test is supporting only and keeps its accepted classification;
- complete public validator input includes
  `deliveries: prefixState.dreamerInformation`;
- all validator inputs come from the same canonical state after target and before
  delivery;
- the real service supplies the Vigormortis accepted stream;
- no identity, title, marker, ownership, routing, AP1/AP2 design, event version,
  public API, or general mechanism changes.

Until that review completes:

`HUMAN_BLOCKED / 2B20A_ACCEPTED_BEHAVIOR_RESTORATION_DESIGN_CORRECTION_1_PENDING_REVIEW`

and `implementationAuthorized=false`.

## Mandatory stop conditions

Stop immediately without widening the repair if:

- a second production file or symbol is needed;
- application production code must change;
- No Dashii, Vortox, Fang Gu V7, gained Dreamer, POISONED, or other-night behavior
  must change;
- an event, schema, public API, or general impairment engine is required;
- V1–V7 replay cannot be preserved;
- a valid Vigormortis stream cannot be produced through the current service;
- real catalog mismatch would return NORMAL;
- any title, marker, identity, inventory, primary classification, logical group,
  routing, or ownership must change;
- the A3B1 hostile test must become a legacy replay primary;
- validator inputs cannot come wholly from the one canonical prefix state;
- a new independent P0/P1 blocker is found;
- coverage delta cannot be attributed solely to the one source restoration;
- exact-head CI has an out-of-scope deterministic failure;
- correction pass `2/2` or a later implementation-correction budget is exhausted.
