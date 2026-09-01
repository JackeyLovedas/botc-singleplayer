# Phase 3 Slice 4 Projection Safety — Implementation Traceability

This report binds the reviewed design to the implementation tests. It does
not add commands, events, dependencies, C1 descriptors, workflow changes, or
new role/rule semantics.

| CriterionId | ActualTestFile | ActualTestTitle | ActualPrimaryLayer | ActualReachability | ActualTrust | SupportingAuthorityId | MechanismMatch |
|---|---|---|---|---|---|---|---|
| S4-C01 | `packages/projections/src/public-player-projection.test.ts` | projects only safe public state and derives the same bytes from accepted replay | PROJECTION | R1_CURRENTLY_REACHABLE_APPLICATION_PATH | T2_CANONICAL_DERIVED_STATE | NONE | PASS |
| S4-C02 | `packages/projections/src/public-player-projection.test.ts` | keeps public and player projections free of receipts, causes, assignments and provenance | PROJECTION | R1_CURRENTLY_REACHABLE_APPLICATION_PATH | T2_CANONICAL_DERIVED_STATE | NONE | PASS |
| S4-C03 | `packages/projections/src/public-player-projection.test.ts` | composes public state with viewer-bound private knowledge without exposing other state | PROJECTION | R1_CURRENTLY_REACHABLE_APPLICATION_PATH | T2_CANONICAL_DERIVED_STATE | NONE | PASS |
| S4-C04 | `packages/projections/src/public-player-projection.test.ts` | fails closed for an unknown viewer | PROJECTION | R1_CURRENTLY_REACHABLE_APPLICATION_PATH | T2_CANONICAL_DERIVED_STATE | NONE | PASS |
| S4-C05 | `packages/projections/src/public-player-projection.test.ts` | associates votes and counts with each public nomination ordinal | PROJECTION | R1_CURRENTLY_REACHABLE_APPLICATION_PATH | T1_EXTERNAL_OR_PERSISTED_BOUNDARY | NONE | PASS |
| S4-C06 | `packages/projections/src/public-player-projection.test.ts` | orders executions by day and keeps execution independent from death | PROJECTION | R1_CURRENTLY_REACHABLE_APPLICATION_PATH | T2_CANONICAL_DERIVED_STATE | NONE | PASS |
| S4-C07 | `packages/projections/src/public-player-projection.test.ts` | rejects malformed accepted history before projection | HOSTILE_REPLAY_REJECTION | R3_HOSTILE_OR_CORRUPTED_HISTORY | T1_EXTERNAL_OR_PERSISTED_BOUNDARY | NONE | PASS |
| S4-C08 | `packages/projections/src/public-player-projection.test.ts` | returns fresh nested projection containers | PROJECTION | R1_CURRENTLY_REACHABLE_APPLICATION_PATH | T2_CANONICAL_DERIVED_STATE | NONE | PASS |
| S4-C09 | `packages/test-harness/src/architecture-boundary.test.ts` | keeps setup package dependencies pointing inward only | STRUCTURAL_VALIDATION | R1_CURRENTLY_REACHABLE_APPLICATION_PATH | T1_EXTERNAL_OR_PERSISTED_BOUNDARY | NONE | PASS |
| S4-C10 | `packages/projections/src/public-player-projection.test.ts` | keeps distinct viewer private facts isolated and parity-stable | PROJECTION | R1_CURRENTLY_REACHABLE_APPLICATION_PATH | T2_CANONICAL_DERIVED_STATE | NONE | PASS |

`SupportingAuthorityId=NONE` is intentional: existing private projection
builders and the accepted 2C execution/death evidence are reviewed support,
not primary substitutes. Each physical test has one primary layer. S4-C07
uses a mutated accepted prefix to prove hostile replay rejection rather than
an empty-stream precondition. The
projection package continues to depend only on `@botc/domain-core`, and all
existing private-knowledge identities remain unchanged. The two-viewer
parity test binds distinct private projections to their requested viewers.

Planned/actual identity accounting is append-only: `removed=0`,
`unexpected=0`; the current test file contributes the new Slice 4 identities
within the existing `projections / engines-and-projections` logical group.
