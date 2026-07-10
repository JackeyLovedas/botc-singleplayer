# Rule Evidence Files

Every proposed slice requires `docs/rules/evidence/<slice-id>.md` before architecture design begins. The read-only `rule-researcher` produces a sourced report; the sole writer materializes that report here without changing its rule conclusions. The architect cannot start until the file exists and the researcher verdict is `RULE_READY`.

## Required Fields

Every evidence file must contain all of these fields:

- `sliceId`
- `involvedRoles`
- `sourceUrls`
- `retrievalDate`
- `sourceRevision` or `oldid`
- `abilityRules`
- `firstNightOrder`
- `otherNightOrder`
- `interactions`
- `drunkennessRules`
- `poisoningRules`
- `VortoxRules`
- `characterChangeRules`
- `alignmentChangeRules`
- `storytellerDiscretion`
- `explicitOutOfScope`
- `unresolvedConflicts`
- `requiredRegressionTests`
- `ruleCoverageStatus`

Use one source record per checked source. Each source record must include its URL, `retrievalDate`, and available `sourceRevision` or `oldid`. The four mandatory sources are:

1. `docs/rules/USER_OVERRIDES.md`;
2. `https://clocktower-wiki.gstonegames.com/index.php?title=首页`;
3. `https://wiki.bloodontheclocktower.com/`;
4. `https://raw.githubusercontent.com/ThePandemoniumInstitute/botc-release/main/resources/data/nightsheet.json`.

If a live source is unavailable, an approved relevant snapshot may be used only when the evidence records both `snapshotPath` and `snapshotHash`. Without an approved snapshot, the researcher returns `RULE_SOURCE_UNAVAILABLE`; no evidence may claim `RULE_READY` from memory or repository behavior.

## Coverage Values

`ruleCoverageStatus` must be exactly one of:

- `SKELETON`
- `PARTIAL`
- `COMPLETE`

`COMPLETE` requires every formal mechanism and every currently supported interaction for the involved role. A single working path is insufficient. Unresolved conflicts must remain explicit and prevent `RULE_READY` when substantive.

## Controlled Materialization

- The rule-researcher remains read-only and does not create or edit this file.
- The sole writer transcribes the sourced report before the architect begins.
- Materialization must preserve source revisions, retrieval dates, conflicts, unsupported behavior, tests, and the final researcher verdict.
- Architecture or implementation content must not be added to rule evidence.
- The reviewer independently reopens the sources or approved snapshots; this file is evidence, not a substitute for source review.
