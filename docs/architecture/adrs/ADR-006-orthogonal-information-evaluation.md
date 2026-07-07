# ADR-006: Orthogonal Information Evaluation

## Status

Accepted

## Context

Phase One used labels such as `RELIABLE_TRUE`, `UNRELIABLE_AND_FALSE`, and `FORCED_FALSE`. These labels are useful for reports but are not expressive enough as the only domain fact. The engine must represent combinations such as inactive ability, poisoning simulation, registration projection, and Vortox forced false information at the same time.

## Decision

Use `InformationEvaluation` with orthogonal fields:

- `abilityEffective`;
- `semanticTruth`;
- `reliability`;
- `truthConstraint`;
- `registrationApplied`;
- `registrationDecisionIds`;
- `simulationReason`;
- `candidateSetId`.

Old truth labels may remain as derived display labels only.

## Alternatives

| Alternative | Reason Rejected |
| --- | --- |
| Single `TruthStatus` enum | Cannot express overlapping dimensions cleanly |
| Freeform Storyteller text | Not testable and not replay-safe |
| Role-specific ad hoc flags | Creates inconsistent rules across information roles |

## Consequences

- Information tests can check each dimension independently.
- Vortox, drunk/poisoned, and registration interactions are explicit.
- Projection code must hide evaluation metadata from players and AI.
- Slightly more verbose event payloads are accepted for correctness.
