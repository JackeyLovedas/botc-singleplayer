# User-Approved Rule Overrides

## Approved Overrides

None. This is an explicit empty baseline: no user-approved rule correction is currently recorded.

The empty baseline must not be interpreted as a rule, an approval, or permission to resolve a source conflict. Only an explicit user-approved entry added through the controlled format below has override authority.

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
