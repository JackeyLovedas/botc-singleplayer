# Phase 3 Slice 2B20A — Accepted Normal Dreamer Restoration V1

## Metadata

```text
taskId=2B20A-ACCEPTED-NORMAL-DREAMER-RESTORATION-V1
authorization=USER_AUTHORIZED_2B20A_ACCEPTED_NORMAL_DREAMER_RESTORATION_STOP_LOSS_OVERRIDE_AND_CONDITIONAL_CLOSEOUT
repairBaseHead=70ee998a631a347ced5975dc71923a71072fa5cb
acceptedBehaviorHead=5a69c90f2d3947556ff45c15c467902b1e28ca43
failedFinalReviewHead=70ee998a631a347ced5975dc71923a71072fa5cb
exactBlocker=BASE_DREAMER_NON_FANG_GU_NORMAL_AND_REPLAY_REGRESSION
productRepairRound=2/2
newProductRepairRoundCreated=false
stopLossOverrideUsed=true
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

No future implementation, review, CI, or closeout commit SHA is recorded.

## Bounded purpose

This appendix restores accepted base-Dreamer behavior; it does not introduce a new
rule, a new Product Repair round, or a new general mechanism. The accepted contract
is:

> After the unique-current-Demon and exact catalog-match gates pass, a healthy base
> Dreamer returns `NORMAL_INFORMATION_SUPPORTED` for every Demon other than Vortox
> and No Dashii.

The failed PR #46 final review contained exactly one finding and exactly one
blocker: `BASE_DREAMER_NON_FANG_GU_NORMAL_AND_REPLAY_REGRESSION`. No second
independent product blocker was reported.

Dreamer coverage remains `PARTIAL`.

## Unique-symbol production contract

The only production symbol that a later, independently authorized implementation may
modify is:

`packages/domain-core/src/dreamer.ts::resolveBaseDreamerV2NormalCapability`

After the existing Demon uniqueness and exact state/catalog match gates, the tail
policy is frozen as follows:

```ts
if (demon.role.roleId === "no_dashii") {
  // Preserve the existing result.
}

if (demon.role.roleId === "vortox") {
  // Preserve the existing tenure, impairment, and forced-false semantics.
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

Once exact catalog matching is proven, the resolver must not return
`CURRENT_DEMON_CATALOG_MISMATCH`. Existing earlier branches for non-canonical
represented impairment, including POISONED, must not be moved or refactored. This
restoration changes only the healthy source's final fallback.

## Governance Traceability V1.1

The design-time traceability table contains exactly the nine required fields.

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| RST-C01 | After exact catalog matching, the healthy base-Dreamer normal policy applies to every Demon other than No Dashii and Vortox. | Direct matrix covers healthy Fang Gu, healthy Vigormortis, canonical-drunk Fang Gu, canonical-drunk Vigormortis, No Dashii, Vortox, and real mismatch. | `DIRECT_RESOLVER_MATRIX` | `R1` | `T2` | `PURE_POLICY_SEAM` | Healthy Fang Gu and Vigormortis are NORMAL; Fang Gu drunk is V7; other drunk is represented impaired; real mismatch fails closed. | Accepted main, 2B19A2 design, and 2B20A resolved evidence. |
| RST-C02 | The restored resolver must work through the real application command path. | Real GameApplicationService submits a Dreamer action under healthy Vigormortis setup, atomically produces V2 target, V2 delivery and settlement, and verifies receipt, rebuild, and retry. | `REAL_GAME_APPLICATION_SERVICE_COMMAND_CHAIN_ACCEPTED_EVENTS_RECEIPT_APPEND_REBUILD` | `R1` | `T1` | `ACCEPTED_STREAM_INTEGRATION` | Accepted; opportunity CLOSED; task settled; EFFECTIVE; retry is idempotent without another append. | RST-C01 and existing V2 command, receipt, and atomic contracts. |
| RST-C03 | Accepted V2 history must not become invalid because of the resolver regression. | A real Vigormortis accepted stream passes public payload validation, complete stream validation, rebuild, and tamper rejection. | `ACCEPTED_V2_HISTORY_VALIDATE_REBUILD_REPLAY` | `R2` | `T1` | `LEGACY_REPLAY_COMPATIBILITY` | V2 remains V2 and rebuilds; semantic or terminal-batch tamper is rejected. | RST-C02 and 2B19A2 replay authority. |
| RST-C04 | Only a real snapshot/catalog mismatch may return mismatch. | Construct structurally valid input whose current Demon snapshot disagrees with the catalog snapshot. | `STRUCTURALLY_VALID_CURRENT_STATE_CATALOG_SEMANTIC_MISMATCH` | `R1` | `T2` | `PURE_POLICY_SEAM` | Exact `EFFECTIVENESS_UNRESOLVED/CURRENT_DEMON_CATALOG_MISMATCH`. | Existing C34 mismatch fixture and catalog exact-match gate. |

This appendix creates no AP1 canonical test identity. The primary and supporting
authority inventories remain `37/37`.

## Test design

The semantic inventory remains `1572`. No `it` block may be added. No existing
test title, marker, logical group, routing rule, or ownership record may change.

### Direct resolver

Extend the existing test whose title must remain verbatim:

```text
[2B20A-C34] resolves only the exact canonical-drunk Fang Gu capability
```

It must make exact assertions for:

- healthy Fang Gu → `NORMAL_INFORMATION_SUPPORTED`;
- healthy catalog-matching Vigormortis → `NORMAL_INFORMATION_SUPPORTED`;
- canonical DRUNK plus Fang Gu →
  `CANONICAL_DRUNK_SOURCE_FANG_GU_APPARENT_INFORMATION_SUPPORTED`;
- canonical DRUNK plus Vigormortis → `SOURCE_REPRESENTED_IMPAIRED`;
- No Dashii → the existing result;
- Vortox → the existing result;
- structurally valid snapshot/catalog mismatch →
  `CURRENT_DEMON_CATALOG_MISMATCH`.

Broad “not success” assertions are forbidden.

### Real application

Extend the existing test whose title must remain verbatim:

```text
[2B19A2-C07] accepts another modeled player through the real V3 command stream
```

Add only a module-local parameterized helper. It must use a legal copy of
`noPhilosopherExactRoleIds` to replace Fang Gu exactly with Vigormortis and must
not change the default Fang Gu fixture.

The existing test must prove:

- the real `GameApplicationService` command chain;
- the V3 opportunity begins OPEN;
- `SubmitDreamerAction` is accepted;
- atomic event order is `DreamerTargetChosen` V2,
  `DreamerInformationDelivered` V2, then `ScheduledTaskSettled`;
- one batch, continuous sequence, and one append;
- a receipt exists;
- rebuilt and persisted states agree;
- the opportunity is CLOSED and the task is settled;
- `informationReliability=EFFECTIVE`;
- the two roles contain one good and one evil role and include the target's true
  role;
- no V7 or Vortox delivery is produced;
- retrying the same `commandId` is idempotent and appends neither events nor a
  second receipt.

Application production code is outside scope.

### V2 replay

Extend the existing test whose title must remain verbatim:

```text
[2B19A3B1-C08/C30/C36-S14/S16/S17] rebuilds legacy generations and rejects V4 envelopes evidence and ledger mutations
```

Reuse the module-local real Vigormortis application helper without changing the
default test harness. For the generated complete stream:

- `validateDomainEventStream` passes;
- `rebuildOptionalGameState` equals the original final state;
- the V2 delivery prefix is canonical state after `DreamerTargetChosen` and before
  delivery;
- `validateDreamerInformationDeliveredPayload` receives that state's choices,
  setup, current character state, impairments, opportunities, plan, progress, and
  role tenures and returns exactly `{ valid: true }`;
- delivery remains V2 and is not reinterpreted as V7;
- target, source, source contract, catalog, and settlement remain intact;
- at least one shape-valid but semantically wrong delivery tamper is rejected;
- missing or reordered terminal batch is rejected by complete stream validation;
- C34 remains the primary fail-closed evidence for a real Demon/catalog mismatch.

`rebuild.test.ts` and the test harness are not authorized. A candidate test file may
be enabled only if independent design review proves the two existing application
tests cannot carry the required evidence.

## Future implementation file scope

Subject to independent design-release approval, the bounded production and test
allowlist is:

- `packages/domain-core/src/dreamer.ts`;
- `packages/domain-core/src/dreamer.test.ts`;
- `packages/application/src/game-application-service.test.ts`.

The implementation may also update the regression audit, this appendix, its
independent design/implementation reviews, and the four active agent-loop controls.

Coverage is conditional. If the existing AP2 exact profile passes, no profile or
workflow file may change. Only an exact obligation mismatch fully attributable to
the single `dreamer.ts` source delta may authorize a separate child commit changing:

- `scripts/verify-coverage-obligations.mjs`;
- `.github/workflows/ci.yml`;
- a new coverage-profile audit.

The old profile must remain byte-identical, and any new profile must bind
`sourceHead` to the separate source implementation commit.

## Acceptance gates

Focused evidence must cover C34, the C07 real application path, the C08/C30 replay
path, the C20 hostile/descriptor regression, and the C37 Mathematician regression.

Required validation after an authorized implementation:

- both modified test files;
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
modify an old profile. No schema or data migration exists.

## Independent design-release review checklist

The independent reviewer must verify all of the following without the controller
synthesizing a passing verdict:

- this restores accepted-main behavior;
- the production boundary is one file and one symbol;
- healthy Fang Gu remains NORMAL;
- healthy Vigormortis is restored to NORMAL;
- canonical-drunk Fang Gu V7 is unchanged;
- canonical-drunk non-Fang-Gu remains represented impaired;
- No Dashii, Vortox, gained Dreamer, and POISONED behavior are unchanged;
- real mismatch remains fail closed;
- application evidence uses the real service;
- replay evidence uses complete accepted history and the public V2 validator;
- AP1/AP2 is not redesigned;
- no general mechanism, event version, or public API is introduced.

Until that independent review is complete, the control state is:

`HUMAN_BLOCKED / 2B20A_ACCEPTED_BEHAVIOR_RESTORATION_PENDING_DESIGN_RELEASE`

and `implementationAuthorized=false`.

## Mandatory stop conditions

Stop immediately and report without widening the repair if:

- a second production file or second production symbol is required;
- application production code must change;
- No Dashii, Vortox, Fang Gu V7, gained Dreamer, POISONED, or other-night behavior
  must change;
- an event, schema, public API, or general impairment engine is required;
- V1–V7 replay cannot be preserved;
- the current command capability cannot produce a valid accepted Vigormortis
  stream;
- the repair would make a real catalog mismatch return NORMAL;
- an existing test title, marker, inventory, logical group, routing, or ownership
  record must change;
- independent review finds a new real and separate P0/P1 blocker;
- coverage delta cannot be attributed completely to the single source restoration;
- exact-head CI has an out-of-scope deterministic failure;
- the bounded docs-correction or implementation-correction budget is exhausted.
