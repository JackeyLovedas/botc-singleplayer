# Phase 3 Slice 2B20B-P2F1R-D1.5R P traceability

## Authority and boundary

- Rule evidence: `docs/rules/evidence/2B20B-P2F1R-D1.5R.md`, `RULE_READY`, `involvedRoles=[]`.
- Final design: `docs/architecture/2B20B-P2F1R-D1.5R-profile-registry-final-authority-consolidation-v1.md`.
- Human adjudication: `docs/architecture/2B20B-P2F1R-D1.5R-human-complexity-budget-adjudication-v1.md`.
- Fresh independent design review: exact reviewed HEAD `59164cac35592c88e85dadbd74d41f23aa3a7047`, `RULE_DESIGN_PASS`, `remainingDesignBlockers=[]`.
- This document records SOURCE_HEAD_S and the local P profile materialization derived from its single controlled capture. It contains no E, Hosted CI, push, PR, acceptance, publication, or D2 fact.
- The registry and routing artifacts are engineering metadata only. They are not BOTC rule, event, replay, accepted-history, product-runtime, or role authority.

## Governance V1.1 traceability

The nine criteria below reissue the final design without creating a criterion, ledger, or supporting-authority system. A structural script or Git/data audit is the physical mechanism; no Vitest title is borrowed as a primary.

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement | S physical boundary | S state |
|---|---|---|---|---|---|---|---|---|---|---|
| `D1.5-C01` | No BOTC claim; lifecycle promotion is explicit | immutable accepted 1572 plus exact candidate 1712 and `+140/-0` | lifecycle/inventory/artifact structural validation | `R4 FUTURE_HYPOTHETICAL_STATE` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | exact transition accepts; mutation rejects | historical/candidate inventories and hostile clones | existing ownership candidate/migration verifier plus routing-baseline manifest | P materializes the exact `+140/-0` ACTIVE transition |
| `D1.5-C02` | No BOTC claim; ordinary routing covers the candidate set | `9/11/1712`, ordered counts, zero defects | real ordinary manifest plus candidate inventory | `R4 FUTURE_HYPOTHETICAL_STATE` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | exact partition accepts; drift rejects | candidate inventory and hostile partitions | `scripts/run-vitest-logical-group.mjs` existing modes and ordinary full run | S-applicable closure |
| `D1.5-C03` | No BOTC claim; coverage routing covers the same set | `11/12/1712`, `domain-core-rest=503`, zero defects | real coverage manifest plus candidate inventory | `R4 FUTURE_HYPOTHETICAL_STATE` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | exact topology accepts; drift rejects | candidate inventory and hostile topologies | verifier-owned frozen ordered topology, eight recomputed-hash hostile clones, routing-baseline manifest, and controlled capture | P binds the one successful `11/12/1712` capture |
| `D1.5-C04` | No BOTC claim; P cannot self-reference | `parent(P)=S` and artifact source equals S | direct Git parent proof as primary; data cross-binding as support | `R4 FUTURE_HYPOTHETICAL_STATE` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | exact parent accepts; self/future/mismatch rejects | S/P objects and hostile ancestry clones | future direct Git commit-object check; no artifact metadata primary | pending P by design |
| `D1.5-C05` | No BOTC claim; append is data-authoritative | 17 legacy bodies unchanged; registry schema/status/selector exact | direct imported/persisted data schema and canonical hash validation | `R4 FUTURE_HYPOTHETICAL_STATE` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | exact data accepts; mutation rejects | legacy set and hostile data clones | direct registry import, exact normalized prefix commitment, eight field-class hostile clones, closed artifact resolver, and recursive mutation audit | P has 17 HISTORICAL rows plus one exact ACTIVE row and standalone artifact |
| `D1.5-C06` | No BOTC claim; no prior-positive loss | complete tuple maps and zero unexplained loss | canonical delta/tuple preimages and mutations | `R4 FUTURE_HYPOTHETICAL_STATE` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | complete delta accepts; omission/loss rejects | source captures and hostile tuple clones | existing coverage tuple normalization/comparison contracts | controlled capture closes `62/1/6/0` classifications and zero unexplained loss |
| `D1.5-C07` | No BOTC claim; selector is exact | one mapping/token and zero inference | direct selector-map and workflow-token validation | `R4 FUTURE_HYPOTHETICAL_STATE` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | exact selection accepts; alternatives reject | S/P selector states and hostile clones | direct registry selector plus exact workflow literal token | P selects only the new ACTIVE profile in both locations |
| `D1.5-C08` | No BOTC claim; scope is engineering-only | exact S allowlist and protected trees unchanged | exact path/tree allowlist audit | `R4 FUTURE_HYPOTHETICAL_STATE` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | allowlist accepts; drift rejects | frozen tree bindings | direct Git name-only and tree-hash checks | S-applicable closure |
| `D15E-C07` | No BOTC claim; E archives exact evidence | actual S/P/E, E allowlist, direct hashes, no self/future/source fragment | offline Git/object/data recomputation at actual E | `R4 FUTURE_HYPOTHETICAL_STATE` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | exact chain accepts; mismatch rejects | P data, E preimages, hostile clones, later review support | future direct offline Git/object/data review | pending E by design |

## Census

```text
traceabilityRowCount=9
activePrimaryCount=9
uniquePrimaryCount=9
duplicatePrimaryCount=0
borrowedPrimaryCount=0
missingPrimaryCount=0
invalidSymbolBindingCount=0
invalidTestIdentityCount=0
R1=[]
R2=[]
R3=[]
R4=[D1.5-C01,D1.5-C02,D1.5-C03,D1.5-C04,D1.5-C05,D1.5-C06,D1.5-C07,D1.5-C08,D15E-C07]
T1=9
STRUCTURAL_VALIDATION=9
MIXED=0
MULTI_LAYER=0
newCriterionCount=0
newSUPSystem=false
```

Only E remains pending. Its design primary remains unique while its future physical objects do not yet exist; P materialization does not claim E review or acceptance.

Repair Round 1 adds no criterion or test identity. The existing verifier startup audit rejects recomputed-profile-hash mutations of group ID/order/count, total, Dreamer segment ID/order/count, and core union; malformed JSON and missing/extra/reordered keys; final-file and ancestor symbolic-link forms (including Windows junction semantics reported by `lstat`); and the eight frozen registry field classes. Its valid fixture and every returned nested artifact object are recursively frozen and mutation-checked.
