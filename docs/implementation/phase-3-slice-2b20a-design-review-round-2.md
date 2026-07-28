reviewedHead: `08bea1108037e86d8e01a24bb4fcedc6601ccf8c`  
reviewedDesign: `docs/implementation/phase-3-slice-2b20a-design-round-2.md`  
reviewedDesignSha256: `22c79b8965549a2c32cb2c9199aa1a020fbb17ca3dc1af0b9e080d8825ae120f`  
reviewTimestamp: `2026-07-24T05:27:31.655Z`

sourcesReviewed:

- `docs/rules/USER_OVERRIDES.md`
- Chinese Wiki: Dreamer, Philosopher, drunk/poison, Mathematician, Vortox and home-page pinned revisions
- Official BOTC Wiki: Dreamer, Philosopher, States, Rules, Glossary, Mathematician and Vortox pinned revisions
- Official nightsheet commit `915347e627c3f6cd1f438f82b6001784e11b3e8b`
- `docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md`
- `docs/agent-loop/REVIEW_PROTOCOL.md`

evidenceReviewed:

- `docs/rules/evidence/2B20A.md`
- `docs/rules/evidence/2B20A-resolved.md`
- Resolved evidence SHA-256: `47e6c5a70b1eae70f51e9a4e0d78c8ab0d2ddf272babb3f9c76e51970c893189`

coverageMatrixReviewed:

- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- Dreamer remains `PARTIAL`.

productionFilesReviewed:

- `packages/domain-core/src/dreamer.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/application/src/game-application-service.ts`
- `packages/projections/src/index.ts`

testFilesReviewed:

- `packages/domain-core/src/dreamer.test.ts`
- `packages/domain-core/src/domain-batch-semantics.test.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`
- `packages/domain-core/src/rebuild.test.ts`
- `packages/application/src/game-application-service.test.ts`
- `packages/application/src/mathematician-information.test.ts`
- `packages/projections/src/private-knowledge-view.test.ts`

round1BlockerClosure:

- `2B20A_RULE_EVIDENCE_MATHEMATICIAN_COUNTED_PLAYER_ATTRIBUTION_CONFLICT`: CLOSED. The resolved evidence correctly makes the base Dreamer the counted abnormal-outcome player and the Philosopher only the causal impairment source.
- `2B20A_V7_ACCEPTED_STREAM_PROJECTION_PROVENANCE_GATE_MISSING`: CLOSED. The production allowlist now includes `packages/projections/src/index.ts`, excludes changes to `event-applier.ts`, and defines accepted-history provenance plus fail-closed state-only handling.
- `2B20A_DESIGN_TRACEABILITY_V1_1_FIELDS_AND_PRIMARY_CLASSIFICATION_MISSING`: NOT CLOSED.

findings:

1. Severity: BLOCKER  
   File/symbol: `docs/implementation/phase-3-slice-2b20a-design-round-2.md`, C02 `CANONICAL_CAPABILITY_RESOLUTION_MATRIX`  
   Failure scenario: A direct capability resolver matrix is classified as `ACCEPTED_STREAM_INTEGRATION`. It does not itself exercise the successful producer → accepted events → receipt → append → rebuild → projection chain. The governance ADR explicitly treats a direct validator/resolver represented as accepted-stream integration as a blocking classification error.  
   Required correction: Classify the direct capability resolver under its actual pure-policy/domain seam, or redefine the primary mechanism as a real successful accepted-stream application path. Keep direct resolver coverage supporting-only if the accepted stream remains primary.  
   Required regression tests: A direct exhaustive capability matrix plus a separate real application-command accepted-stream test proving the frozen path and adjacent-state rejection.

2. Severity: BLOCKER  
   File/symbol: same file, C09 `CANONICAL_NO_DELIVERY_LEDGER_DERIVATION`  
   Failure scenario: “Unsupported/failed command yields no V7 fact” is classified as `ACCEPTED_STREAM_INTEGRATION`. A rejected or failed formal command with no committed delivery is `R1 + APPLICATION_COMMAND_INTEGRATION`, including its no-event, no-mutation, receipt, version and retry boundary. It cannot be accepted-stream evidence.  
   Required correction: Reclassify C09 as `APPLICATION_COMMAND_INTEGRATION`, use the real application entry, and require assertions for no committed events, unchanged state/version, receipt/failure result, retry semantics and zero ledger contribution.  
   Required regression tests: Real unsupported/failed `SubmitDreamerAction` test proving no V7 event, no settlement, no ledger fact, zero Mathematician contribution, unchanged state/version and the specified receipt/retry contract.

3. Severity: BLOCKER  
   File/symbol: same file, C08 `CANONICAL_LEDGER_SOURCE_ATTRIBUTION_VALIDATION`  
   Failure scenario: One row combines the positive accepted-stream claim that the base Dreamer is counted once with a separate “reject Philosopher/target substitution” claim. Substitution rejection requires structural validation or hostile persisted-history replay depending on the mutation boundary; it is not established by the positive accepted stream. The row therefore mixes distinct primary mechanisms and trust boundaries.  
   Required correction: Split positive accepted-stream ledger attribution from substitution rejection. Give the positive derivation its accepted-stream authority and give direct forged-fact validation or persisted-history tampering its actual `STRUCTURAL_VALIDATION` or `HOSTILE_REPLAY_REJECTION` classification.  
   Required regression tests: Positive accepted-stream count of the base Dreamer exactly once; direct malformed fact-source rejection if such a boundary exists; and hostile replay rejection for persisted delivery/provenance substitution.

The exact rule semantics, bounded product scope, V7 payload, deterministic selection, atomic settlement, ledger attribution and projection privacy design are otherwise consistent with the reviewed sources. Worktree remained clean, and no production code was modified.

ruleDesignVerdict: `HUMAN_BLOCKED`

remainingBlockers:

- `2B20A_DESIGN_TRACEABILITY_V1_1_PRIMARY_CLASSIFICATION_STILL_INVALID`
- No Round 3 is authorized; implementation must not begin.
