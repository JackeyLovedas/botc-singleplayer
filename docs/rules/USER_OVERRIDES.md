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
