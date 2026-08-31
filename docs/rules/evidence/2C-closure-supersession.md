# Phase 3 Slice 2C — Authorized Evidence Applicability Supersession

## Authority status

```text
sliceId=2C
recordKind=AUTHORIZED_APPLICABILITY_SUPERSESSION
recordStatus=ACTIVE_BOUNDARY_RECORD
parentEvidence=docs/rules/evidence/2C.md
parentDesign=docs/architecture/phase-3-slice-2c-preemption-fixture-reslice-design.md
supersedesApplicabilityOnly=true
historicalFilesImmutable=true
newRuleInterpretation=false
```

This record is the smallest active index for the bounded 2C closure fixture.
It does not rewrite or replace the historical rule evidence, preemption design,
or any accepted C1 material. It records which historical subjects are no longer
the applicable primary surface for this fixture.

## Supersession map

| Historical subject/surface | Historical record | Active bounded disposition | Active canonical surface |
| --- | --- | --- | --- |
| `PitHagActionResolved` as a fixture event | `docs/rules/evidence/2C-preemption-fixture.md`; `docs/architecture/phase-3-slice-2c-preemption-fixture-reslice-design.md` | `SUPERSEDED_FOR_FIXTURE_APPLICABILITY` | Daytime execution followed by `PlayerDied(cause=EXECUTION)`; no Pit-Hag action event/task is required |
| `NominationProposed` as a nomination identity | same historical records | `SUPERSEDED_FOR_FIXTURE_APPLICABILITY` | `NominationDeclared` only |
| `NominationDeclared` | historical 2C evidence and closure design | `RETAINED_CANONICAL` | One event identity; `nominatorPlayerId` once/day and `nomineePlayerId` once/day |

The supersession is limited to the exact fixture: daytime Pit-Hag execution
precedes `NIGHT_TASKS`, its `PlayerDied(cause=EXECUTION)` fact suppresses any later Pit-Hag task,
and the nomination remains represented by `NominationDeclared`. It does not
authorize a general Pit-Hag implementation, a role-change framework, a new
execution/death rule, or a second nomination event.

## Traceability and untouched authorities

```text
primaryMechanism=ACCEPTED_STREAM_INTEGRATION
nominationPrimary=NominationDeclared
pitHagPrimary=NONE_FOR_THIS_FIXTURE
newStructuralDelta=0
C1AcceptedPrefix=40/59_UNCHANGED
B18=HUMAN_BLOCKED_UNCHANGED
Slice3=NOT_STARTED
```

The historical records remain available for audit and are not deleted or
edited. This index is the active lookup record for the closure boundary only.
