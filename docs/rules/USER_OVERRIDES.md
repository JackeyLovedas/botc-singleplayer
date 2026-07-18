# User-Approved Rule Overrides

## Approved Overrides

The baseline was explicitly empty until the following controlled approval was recorded. Only the discrete approved record below has override authority.

### BOTC-SIM-PHILOSOPHER-FIRST-NIGHT-SCHEDULING-V1

```text
overrideId: BOTC-SIM-PHILOSOPHER-FIRST-NIGHT-SCHEDULING-V1
status: APPROVED
approvedAt: 2026-07-11
approvedBy: user
affectedRoles: philosopher, snake_charmer, clockmaker, dreamer, seamstress, mathematician
ruleStatement: Philosopher 获得受支持首夜角色能力时，在该角色正常首夜任务位置调度，不紧随 PHILOSOPHER_ACTION；同位置 base 先，随后 Philosopher-gained 按 sourceSeatNumber 升序，再按 taskId code-unit 稳定升序
scope: Deterministic single-player first-night scheduling only. This is a simulator tie-break for otherwise unspecified same-position ordering. It does not alter the official ability text and does not authorize Mathematician duplicate-holder counting semantics.
sourceClaimsOverridden: none; fills a deterministic simulator tie-break while conforming to the official requirement that gained night abilities act when the gained character would normally act
rationale: The accepted V1 insertion places all gained first-night tasks immediately after PHILOSOPHER_ACTION, which conflicts with the official Philosopher timing. A versioned scheduler is required without reinterpreting accepted V1 event history.
approvalEvidence: Explicit user authorization in the controller goal, recorded in AUTOPILOT_LOG; no private conversation transcript copied
supersededBy:
```

This approval is a product simulation order only. It is not a Mathematician duplicate-holder counting rule, does not resolve Mathematician own-ability exclusion, does not resolve the Mathematician false-number domain, and does not authorize Slice 2B18 implementation.

### BOTC-SIM-MATHEMATICIAN-FIRST-NIGHT-WINDOW-V1

```text
overrideId: BOTC-SIM-MATHEMATICIAN-FIRST-NIGHT-WINDOW-V1
status: APPROVED
approvedAt: 2026-07-12
approvedBy: user
affectedRoles: mathematician
ruleStatement: For the fixed first night, the Mathematician audit window begins immediately after the canonical FirstNightInitialized fact and ends at the last canonical event sequence strictly before the current Mathematician information resolution begins. The current Mathematician delivery is never part of its own window.
scope: Deterministic single-player first-night simulation only. This does not define general dawn, day, or later-night reset semantics.
sourceClaimsOverridden: none; supplies a first-night canonical anchor where the official phrase “since dawn” has no explicit pre-game dawn event in the current product model
rationale: FirstNightInitialized is the earliest canonical boundary before any supported first-night player ability outcome. Setup, assignment, own-character bootstrap and task planning are not player ability outcomes and do not contribute audit facts.
approvalEvidence: Explicit user authorization in this controller goal, recorded in AUTOPILOT_LOG; no private conversation transcript copied
supersededBy:
```

For this simulator contract, the lower bound is the `FirstNightInitialized` `eventSequence`, exclusive. The upper bound is the final `eventSequence` before the current Mathematician resolution begins, inclusive. The current delivery is outside its own window. This record creates no general dawn reset and changes no later-night rule.

### BOTC-SIM-MATHEMATICIAN-OWN-ABILITY-EXCLUSION-V1

```text
overrideId: BOTC-SIM-MATHEMATICIAN-OWN-ABILITY-EXCLUSION-V1
status: APPROVED
approvedAt: 2026-07-12
approvedBy: user
affectedRoles: mathematician, philosopher
ruleStatement: Each Mathematician resolution excludes only the resolving player’s own current Mathematician ability instance and current resolution. An already-resolved Mathematician ability belonging to another player is another player’s ability and may be counted if it worked abnormally due to another character’s ability.
scope: Deterministic single-player duplicate-holder interpretation. It does not claim an official multi-Mathematician ruling.
sourceClaimsOverridden: none; resolves the otherwise unspecified meaning of “does not detect their own ability failing” when multiple players hold the Mathematician ability
rationale: The exclusion is attached to the resolving ability instance, not globally to the Mathematician role ID. This prevents the current resolution from counting itself while avoiding an unsupported blanket exclusion of another player.
approvalEvidence: Explicit user authorization in this controller goal, recorded in AUTOPILOT_LOG; no private conversation transcript copied
supersededBy:
```

Self-identification uses source player plus ability-instance/provenance identity. It must not exclude every Mathematician fact merely by `roleId`, and the current result must never feed back into its own `trueCount`.

### BOTC-SIM-MATHEMATICIAN-NUMERIC-DOMAIN-V1

```text
overrideId: BOTC-SIM-MATHEMATICIAN-NUMERIC-DOMAIN-V1
status: APPROVED
approvedAt: 2026-07-12
approvedBy: user
affectedRoles: mathematician, vortox
ruleStatement: In the fixed 12-player game without Travellers, the simulator’s Mathematician information domain is the dense integer set 0 through 11. The true count is the number of distinct qualifying players other than the resolving source, so it is also bounded by 0 through 11. Ordinary drunk or poisoned information may legally select any value in 0 through 11, including the true value. An effective Vortox requires selecting a value in 0 through 11 other than the true value.
scope: Deterministic single-player information-domain policy for the current fixed 12-player product only. It does not define arbitrary Storyteller hand signals or games with different player counts or Travellers.
sourceClaimsOverridden: none; provides a finite simulator domain where external rules require true/false information but do not publish a maximum false number
rationale: The true result counts distinct other players in a 12-player roster. Restricting simulated information to the same count domain prevents impossible or unbounded UI values while preserving correct and false options.
approvalEvidence: Explicit user authorization in this controller goal, recorded in AUTOPILOT_LOG; no private conversation transcript copied
supersededBy:
```

The fixed lower and upper bounds are `0` and `11`. Effective information without Vortox must select `trueCount`. Drunk or poisoned information without Vortox may select any value in `0..11`, including `trueCount`; the deterministic product policy selects the smallest false value. Effective Vortox excludes `trueCount` from `0..11` and selects the smallest false value whether or not the source is drunk or poisoned. “Smallest false” is a product policy, not an official rule claim.

### BOTC-SIM-MATHEMATICIAN-DUPLICATE-HOLDER-TEMPORAL-V1

```text
overrideId: BOTC-SIM-MATHEMATICIAN-DUPLICATE-HOLDER-TEMPORAL-V1
status: APPROVED
approvedAt: 2026-07-12
approvedBy: user
affectedRoles: mathematician, philosopher, vortox
ruleStatement: Multiple first-night Mathematician holders resolve in the accepted scheduling V2 order: base role task first, then Philosopher-gained tasks by ascending sourceSeatNumber and stable taskId code-unit order. Each resolution audits only ability outcomes completed before its own resolution boundary. A later holder may count an earlier holder if the earlier holder’s information actually worked abnormally due to another character ability; an earlier holder never counts a later unresolved result.
scope: Deterministic single-player first-night temporal policy only. It does not claim an official duplicate-Mathematician ordering rule.
sourceClaimsOverridden: none; applies the already approved scheduling V2 order to an otherwise unspecified duplicate-holder interaction
rationale: A strict temporal boundary avoids circular counts. Each result is immutable after delivery, and later holders can inspect earlier completed outcomes without retroactively changing prior information.
approvalEvidence: Explicit user authorization in this controller goal, recorded in AUTOPILOT_LOG; no private conversation transcript copied
supersededBy:
```

Base Mathematician resolves before gained Mathematician. Later gained holders follow the accepted V2 tie-break. A later resolution may count an earlier completed resolution; an earlier resolution cannot count a future result and is never recomputed after later delivery. This temporal contract must not create a circular dependency.

### BOTC-SIM-DREAMER-VORTOX-DRUNK-LEDGER-ATTRIBUTION-V1

```text
overrideId: BOTC-SIM-DREAMER-VORTOX-DRUNK-LEDGER-ATTRIBUTION-V1
status: APPROVED
approvedAt: 2026-07-18
approvedBy: user
affectedRoles: dreamer, vortox, philosopher, mathematician
ruleStatement: When a canonical base Dreamer is DRUNK because an accepted Philosopher duplicate ability is active, and that Dreamer resolves while the current Vortox is canonically effective, the simulator records exactly one Dreamer terminal outcome fact. The canonical audit attribution is outcomeStatus=ABNORMAL, causeKind=VORTOX_FALSE_INFORMATION, causedByAnotherCharacterAbility=true. The exact Philosopher-produced DRUNK impairment remains mandatory positive ABILITY_IMPAIRMENT evidence, but it does not create a second cause entry or second terminal fact. The existing Mathematician distinct-player model counts the Dreamer source at most once.
scope: Fixed first-night base-Dreamer simulation only, limited to one canonical Philosopher-produced DRUNK impairment and one canonically effective current Vortox. It does not define POISONED plus Vortox, multiple or conflicting impairments, an impaired Vortox, No Dashii, gained Dreamer, later nights, death, or a general multi-cause outcome model.
sourceClaimsOverridden: none; external rules determine the forced-false behavior and player-count result but do not specify internal ledger cause cardinality. This record supplies a deterministic simulator audit-attribution policy.
rationale: Effective Vortox is the rule constraint that makes both delivered Dreamer roles necessarily false. Philosopher-produced drunkenness remains fully preserved as canonical historical evidence. One terminal fact matches the existing one-outcome-per-ability-instance ledger and Mathematician distinct-player counting, while retaining sufficient provenance for a future richer causality model without rewriting accepted history.
approvalEvidence: Explicit user authorization USER_AUTHORIZED_BOTC_SIM_DREAMER_VORTOX_DRUNK_LEDGER_ATTRIBUTION_V1, recorded in AUTOPILOT_LOG; no private conversation transcript copied
supersededBy:
```

## Controlled Record Format

Each future override must be one discrete record with all fields completed:

```text
overrideId:
status: APPROVED
approvedAt:
approvedBy: user
affectedRoles:
ruleStatement:
scope:
sourceClaimsOverridden:
rationale:
approvalEvidence:
supersededBy:
```

Rules for maintaining this file:

- Never infer, draft, or activate an override on the user's behalf.
- `status` must be `APPROVED` before the record has rule authority.
- Preserve prior approved records; supersede them explicitly instead of rewriting history.
- Link the approval evidence without copying private conversation history into the repository.
- Rule evidence must cite the applicable `overrideId` and still record the external sources checked.
