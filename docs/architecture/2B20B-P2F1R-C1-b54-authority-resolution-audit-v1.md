# Phase 3 Slice 2B20B-P2F1R-C1 B54 Authority Resolution Audit V1

## Metadata

- sliceId: `2B20B-P2F1R-C1`
- auditId: `C1-B54-AUTHORITY-RESOLUTION-AUDIT-V1`
- classification: `B TYPESCRIPT_ONLY_PLACEHOLDER_UNION`
- auditedAcceptedHead: `30793b662b99bb7f4689811e56b91afe365c2fd4`
- acceptedSourceWorktree: `C:\Users\wjl\AppData\Local\Temp\botc-c1-b54-design-20260801-092323`
- eventType: `MathematicianInformationDelivered`
- branchId: `C-B54-MATHEMATICIAN-DELIVERY-U`
- rootSchemaId: `MATHEMATICIAN_DELIVERY_SCHEMA`
- resultIdentity: `MathematicianInformationDeliveredPayload`
- evidencePath: `docs/rules/evidence/2B20B-P2F1R-C1.md`
- evidenceSha256: `a484067a98056e83d11f9b41fadfa1140d738c811850a139075bd57cfe0650fe`
- catalogV1Path: `docs/architecture/2B20B-P2F1R-C-domain-event-structural-schema-catalog-v1.md`
- catalogV1Sha256: `bb8be14de51c2c668b310869983db36d1200c6959830303e953bbc7af2023b26`
- runtimeInputSetChanged: `false`
- behaviorChanged: `false`

## Audit question and conclusion

The audit asks whether the three four-arm `abilityInstance` unions in Catalog V1 describe four accepted runtime alternatives, or whether three arms per occurrence are TypeScript-only placeholders produced by intersection expansion.

The only approved conclusion is:

```text
B TYPESCRIPT_ONLY_PLACEHOLDER_UNION
```

At each narrowed `sourceContract` path, the accepted TypeScript type contains one surviving `FirstNightAbilityInstanceProvenance` member. The other three intersections have incompatible `kind` literals and reduce to `never`. Catalog V1 materialized those impossible intersections as identical exact empty records. They are not accepted payload members, are not producer output, and are not validator-supported alternatives.

## Audited accepted authorities

All production observations below were read from the clean accepted worktree at the audited HEAD. The dirty C worktree is not an authority.

| Authority | Accepted path | Relevant evidence |
|---|---|---|
| Payload and source-contract types | `packages/domain-core/src/mathematician.ts` | Three-member outer `MathematicianSourceContract`; each member narrows `abilityInstance.kind`. |
| Provenance type and validator | `packages/domain-core/src/first-night-ability-outcome-ledger.ts` | Four-member `FirstNightAbilityInstanceProvenance`; exact own-key registry and discriminant validation. |
| Source producer | `packages/domain-core/src/mathematician-internal.ts` | `abilityInstanceFor` and `sourceContractFor` emit only the three permitted pairs. |
| Payload validator | `packages/domain-core/src/mathematician.ts` | `validSource` checks exact outer keys, validates provenance, then checks the outer/inner kind pair. |
| Accepted tests | `packages/application/src/mathematician-information.test.ts` and `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts` | Base, gained V1, gained V2, exact-key, hostile, replay, and provenance evidence. |

These authorities are supporting evidence for the audit. They do not become the future runtime structural authority.

## Accepted outer source-contract union

`MathematicianSourceContract` has exactly three members. Every listed own key is required. There are no optional outer keys and no direct `undefined` or `null` members.

### Common exact fields

| Own key | Accepted type/contract | Literal/discriminant | Optional | Nullable |
|---|---|---|---:|---:|
| `taskPlanVersion` | `FirstNightTaskPlanVersion` | narrowed below | no | no |
| `taskId` | `ScheduledTaskId` | none | no | no |
| `sourcePlayerId` | `PlayerId` | none | no | no |
| `sourceSeatNumber` | `SeatNumber` | none | no | no |
| `sourceRole` | `RoleSetupSnapshot` | role constraints are semantic validation | no | no |
| `sourceRoleAtSettlement` | `RoleSetupSnapshot` | role constraints are semantic validation | no | no |
| `sourceRoleTenure` | `MathematicianRoleTenureSnapshot` | role constraints are semantic validation | no | no |
| `settlementCharacterStateRevision` | safe integer at runtime | none | no | no |

`RoleSetupSnapshot` has exact required own keys `roleId`, `characterType`, `defaultAlignment`, `edition`, and `setupModifier`; `setupModifier` has exact required own keys `outsiderDelta` and `townsfolkDelta`. No field is optional or nullable.

`MathematicianRoleTenureSnapshot` has exact required own keys `roleTenureId`, `playerId`, `seatNumber`, `roleId`, `acquiredCharacterStateRevision`, and `endedCharacterStateRevision`. Only `endedCharacterStateRevision` is nullable (`number | null`); it is never optional or `undefined`. Its `roleId` literal set is `mathematician | philosopher | vortox`.

### Member-specific exact fields

| Outer member | Exact own-key count | `kind` | `taskPlanVersion` | Additional required own keys | Required `abilityInstance.kind` |
|---|---:|---|---|---|---|
| `BaseMathematicianSourceContract` | 10 | `BASE_MATHEMATICIAN` | `first-night-task-plan-v1 | first-night-task-plan-v2` | `kind`, `abilityInstance` | `BASE_ROLE_TASK` |
| `PhilosopherGainedMathematicianV1SourceContract` | 15 | `PHILOSOPHER_GAINED_MATHEMATICIAN_V1` | `first-night-task-plan-v1` | `kind`, `abilityInstance`, `chosenRole`, `philosopherTaskId`, `philosopherOpportunityId`, `grantId`, `sourceCharacterStateRevision` | `PHILOSOPHER_GAINED_TASK_V1` |
| `PhilosopherGainedMathematicianV2SourceContract` | 16 | `PHILOSOPHER_GAINED_MATHEMATICIAN_V2` | `first-night-task-plan-v2` | all V1 gained keys plus `schedulingVersion` | `PHILOSOPHER_GAINED_TASK_V2` |

The V2 `schedulingVersion` literal is exactly `philosopher-gained-first-night-scheduling-v2`. The gained members' `chosenRole` is the exact `RoleSetupSnapshot` shape. None of the member-specific keys is optional or nullable.

## Accepted nested provenance union

`FirstNightAbilityInstanceProvenance` has exactly four members before outer narrowing. Each member contains the following seven required common own keys:

| Own key | Accepted type/literal | Optional | Nullable |
|---|---|---:|---:|
| `provenanceVersion` | literal `first-night-ability-instance-provenance-v1` | no | no |
| `kind` | one of the four member literals below | no | no |
| `abilityInstanceId` | `FirstNightAbilityInstanceId` | no | no |
| `abilityRoleId` | `RoleId` | no | no |
| `taskId` | `ScheduledTaskId` | no | no |
| `sourcePlayerId` | `PlayerId` | no | no |
| `sourceSeatNumber` | `SeatNumber` | no | no |

| Provenance member | Exact own-key count | `kind` literal | Additional required own keys | Optional | Nullable |
|---|---:|---|---|---:|---:|
| Base | 7 | `BASE_ROLE_TASK` | none | none | none |
| Gained V1 | 10 | `PHILOSOPHER_GAINED_TASK_V1` | `philosopherOpportunityId`, `grantId`, `sourceCharacterStateRevision` | none | none |
| Gained V2 | 11 | `PHILOSOPHER_GAINED_TASK_V2` | V1 additions plus literal `schedulingVersion = philosopher-gained-first-night-scheduling-v2` | none | none |
| Explicit domain | 9 | `EXPLICIT_DOMAIN_INSTANCE` | `sourceRoleTenureId`, `existingInstanceId` | none | none |

The provenance validator first selects the exact own-key list by `kind`, then validates identity round-trip and member-specific fields. Extra, missing, wrong-kind, cross-generation, and malformed identities fail closed.

## Frozen B54 pairings

Only these pairings are part of the B54 accepted input language:

| Outer `sourceContract.kind` | Nested `abilityInstance.kind` | Accepted |
|---|---|---:|
| `BASE_MATHEMATICIAN` | `BASE_ROLE_TASK` | yes |
| `PHILOSOPHER_GAINED_MATHEMATICIAN_V1` | `PHILOSOPHER_GAINED_TASK_V1` | yes |
| `PHILOSOPHER_GAINED_MATHEMATICIAN_V2` | `PHILOSOPHER_GAINED_TASK_V2` | yes |

`EXPLICIT_DOMAIN_INSTANCE` is a valid member of the unnarrowed provenance type for other domain uses. It is not an accepted B54 `sourceContract.abilityInstance` member. Every wrong-generation pairing is rejected.

## Producer and validator audit

The accepted producer has no empty-object or cross-generation output path:

- a base role task creates `BASE_ROLE_TASK`, and `sourceContractFor` returns `BASE_MATHEMATICIAN` only when that kind is present;
- a Philosopher-gained V1 task creates `PHILOSOPHER_GAINED_TASK_V1`, and the V1 outer member is returned only with that kind and V1 plan;
- a Philosopher-gained V2 task creates `PHILOSOPHER_GAINED_TASK_V2`, and the V2 outer member is returned only with that kind, V2 plan, and scheduling literal;
- `EXPLICIT_DOMAIN_INSTANCE` is never emitted into B54 by `sourceContractFor`.

The accepted validator mirrors this boundary:

- outer records use exact member-specific key lists;
- nested provenance must pass `validateFirstNightAbilityInstanceProvenanceShape`;
- base, V1, and V2 branches explicitly require their matching inner kinds;
- `{}`, wrong-generation provenance, explicit provenance, missing/extra fields, and invalid literals fail closed.

## Catalog V1 placeholder audit

The three narrowed paths are:

1. `sourceContract[kind=BASE_MATHEMATICIAN].abilityInstance`;
2. `sourceContract[kind=PHILOSOPHER_GAINED_MATHEMATICIAN_V1].abilityInstance`;
3. `sourceContract[kind=PHILOSOPHER_GAINED_MATHEMATICIAN_V2].abilityInstance`.

At each path Catalog V1 has exactly:

```text
U(EXACTLY_ONE; one surviving exact record; R{}; R{}; R{})
```

The real record appears in the ordinal matching the unnarrowed provenance member. The other three arms are identical exact empty records representing intersections whose incompatible `kind` literals reduce to `never` in TypeScript.

### Runtime-language equivalence

Catalog V1 and the single surviving exact record accept the same runtime values at each narrowed path:

- a valid surviving record matches that record and does not match `R{}` because it has own keys;
- `{}` matches all three placeholder arms, therefore violates `EXACTLY_ONE` and is rejected;
- another provenance member has own keys, matches neither the survivor nor any exact empty record, and is rejected;
- a partial, mixed, extra-key, missing-key, wrong-kind, `undefined`, or `null` value is rejected.

Therefore removing the three impossible placeholder arms changes neither the accepted runtime input set nor any producer, validator, event, history, replay, batch, projection, receipt, ledger, or rule behavior.

## Accepted test authority ledger

The following accepted tests are supporting evidence and remain immutable:

| Accepted test | What it proves |
|---|---|
| `first-night-ability-outcome-ledger.test.ts` — `round-trips base and gained V2 canonical ability instance identities` | Base/V1/V2 identities select the correct provenance generation; cross-generation identities fail. |
| `first-night-ability-outcome-ledger.test.ts` — `requires exact provenance variants` | Exact keys, V2 discriminator, role/seat links, and extra-field rejection. |
| `mathematician-information.test.ts` — `[V1-BASE-05]` through `[V1-BASE-08]` | Accepted base settlement, base outer source, and terminal fact. |
| `mathematician-information.test.ts` — `[V2-CSI-06]` and `[V2-CSI-07]` | Accepted V2 outer/inner pairing. |
| `mathematician-information.test.ts` — `[V1-CSI-07]` and `[V1-CSI-08]` | Accepted V1 outer/inner pairing. |
| `mathematician-information.test.ts` — `[V2-APP-10]` and `[V1-APP-09]` | Both gained pairings pass prospective application validation. |
| `mathematician-information.test.ts` — `2B18B original 140-test exact-contract matrix` | Missing, extra, `undefined`, and `null` payload fields fail; canonical base source is retained. |
| `mathematician-information.test.ts` — `2B18B Option A 45-test support-boundary matrix` | Base source exact own keys, missing-key rejection, and base ability-instance links. |
| `mathematician-information.test.ts` — `[OPTION-A-44]` | An invalid gained source remains rejected after inventory classification. |
| `mathematician-information.test.ts` — V1/V2 hostile and replay tests | Accepted histories rebuild while tampered or incomplete provenance chains fail closed. |

No existing test authorizes an empty B54 ability instance, a wrong-generation pairing, or an explicit-domain pairing.

## Frozen normalization eligibility

`PLACEHOLDER_UNION_NORMALIZATION` is permitted only when all of the following are true:

1. the immutable source is Catalog V1 with SHA-256 `bb8be14de51c2c668b310869983db36d1200c6959830303e953bbc7af2023b26`;
2. the path is one of the three B54 paths listed above;
3. the source union has exactly four arms;
4. exactly one arm is a non-empty exact record;
5. exactly three arms are identical `R{}` exact records;
6. compile-time proof shows the surviving intersection is the accepted narrowed member and every removed intersection is `never`;
7. accepted producer and validator evidence supports only the survivor;
8. runtime-language equivalence is proven by the positive and negative matrix.

If any condition fails, normalization is forbidden and implementation must stop. A future accepted provenance member, new discriminant, changed outer pairing, non-identical placeholder, second surviving arm, or V1 SHA change requires a new delta audit and design authorization.

## Audit disposition

- classification: `B TYPESCRIPT_ONLY_PLACEHOLDER_UNION`
- approved interpretation: three TypeScript-only placeholders per narrowed path may normalize to the one surviving exact record
- runtimeInputSetChanged: `false`
- behaviorChanged: `false`
- productionChangeAuthorizedByThisAudit: `false`
- implementationAuthorized: `false`

This audit supplies design evidence only. It does not return or imply `RULE_DESIGN_PASS`.
