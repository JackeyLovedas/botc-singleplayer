# Phase 3 Slice 2B20A Independent Rule Design Review — Round 1

## Review Metadata

- reviewedPR: `none`
- reviewedHead: `257012175e2a21360c4fc9477ac52e6b7bbea0f4`
- reviewTimestamp: `2026-07-24T04:52:39.579Z`
- reviewScope: `Phase 3 Slice 2B20A frozen Round 1 rule-design review`
- designRound: `1 / 2`
- designPath: `docs/implementation/phase-3-slice-2b20a-design.md`
- designSha256: `9323681b5aa61106b81d1580c0502eaf085f56ee5f51801aaa7fe771e15cdf02`
- ruleEvidencePath: `docs/rules/evidence/2B20A.md`
- ruleEvidenceSha256: `1a51a2aebae79e831ca2146aaae47f423b472108bb9759cfc3d452dc344efe00`
- governancePath: `docs/architecture/2B20A-go-no-go-under-governance-v1.md`
- governanceSha256: `9ab18f66a1a64372b3a629a8ab42fad1c8455de61647b11c167ef6d862ee2bf1`
- reviewerIndependence: `INDEPENDENT_READ_ONLY_REVIEWER`
- implementationAuthorized: `false`

## Sources Independently Reviewed

The reviewer did not rely only on the rule-researcher summary. The following
pinned/live authorities were independently read and hash matched:

- `docs/rules/USER_OVERRIDES.md`, SHA-256
  `9e2b8e9701a35559d9cc67d8c2185d979ec222b3186fa3a9cd16140dd2f68ad5`;
- Chinese Wiki 首页 oldid `5855`, 筑梦师 `3046`, 哲学家 `5125`,
  醉酒 `5720`, 中毒 `6294`, 数学家 `6442`, 涡流 `6198`;
- Official BOTC Wiki Dreamer oldid `2904`, Philosopher `2421`, States
  `1039`, Rules Explanation `1310`, Glossary `2874`, Mathematician
  `3109`, and Vortox `3017`;
- official nightsheet repository commit
  `915347e627c3f6cd1f438f82b6001784e11b3e8b`, file SHA-256
  `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`;
- `docs/rules/ROLE_COVERAGE_MATRIX.md`, SHA-256
  `261aebfa3df2079eb81ff365755d94d111b1bfd31b656035f7997f1d8e588b0a`.

All required sources were available. No snapshot substitution was used. The
pinned source revisions and content hashes matched the rule evidence.

## Design and Governance Files Reviewed

- `AGENTS.md`
- `docs/agent-loop/AUTOPILOT_PROMPT.md`
- `docs/agent-loop/REVIEW_PROTOCOL.md`
- `docs/agent-loop/AUTOPILOT_STATE.json`
- `docs/agent-loop/CURRENT_TASK.md`
- `docs/agent-loop/PROJECT_STATE.md`
- `docs/architecture/2B20-go-no-go-under-governance-v1.md`
- `docs/architecture/2B20A-go-no-go-under-governance-v1.md`
- `docs/rules/evidence/2B20A.md`
- `docs/implementation/phase-3-slice-2b20a-design.md`

## Production Files Reviewed

- `packages/domain-core/src/dreamer.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
- `packages/application/src/game-application-service.ts`
- `packages/projections/src/index.ts`

## Test Files Reviewed

- `packages/domain-core/src/dreamer.test.ts`
- `packages/domain-core/src/domain-batch-semantics.test.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`
- `packages/domain-core/src/rebuild.test.ts`
- `packages/application/src/game-application-service.test.ts`
- `packages/projections/src/private-knowledge-view.test.ts`

## Review Findings

### F-01 — Mathematician counted-player attribution conflicts with the rule sources

Severity: `BLOCKER`

Blocker ID:
`2B20A_RULE_EVIDENCE_MATHEMATICIAN_COUNTED_PLAYER_ATTRIBUTION_CONFLICT`

The original evidence and Round 1 design conflate the Philosopher's causal
impairment provenance with the player whose ability did not work correctly.
The official Mathematician wording counts a player whose ability malfunctioned
because of another character's ability. For this stream that counted/affected
player is the base Dreamer. The Philosopher is causal impairment provenance
only.

Round 2 authority must use the following exact outcome matrix:

| Delivery outcome | Fact source/count subject | evaluation | reason | caused by another character ability | contribution |
|---|---|---|---|---:|---:|
| TRUE | base Dreamer `ai-seat-01` | `NORMAL` | `NO_OTHER_CHARACTER_ABILITY` | `false` | `0` |
| FALSE | base Dreamer `ai-seat-01` | `ABNORMAL` | `SOURCE_DRUNKENNESS` | `true` | base Dreamer once |
| no delivery | no fact | none | none | none | `0` |

Required correction:

- distinguish causal impairment provenance from delivery/outcome-fact source;
- keep `sourcePlayerId=ai-seat-01` for both TRUE and FALSE facts;
- reject Philosopher, target, or any other replacement source player;
- prevent Dreamer/Philosopher double count and Dreamer duplicate count;
- preserve no-delivery/no-fact/count-zero behavior.

This is an attribution correction, not a new rule semantic or override. A
complete standalone `docs/rules/evidence/2B20A-resolved.md` must retain all
other source claims and return `RULE_READY`.

### F-02 — Accepted V7 delivery has no production projection provenance gate

Severity: `BLOCKER`

Blocker ID:
`2B20A_V7_ACCEPTED_STREAM_PROJECTION_PROVENANCE_GATE_MISSING`

`packages/projections/src/index.ts` currently accepts Dreamer delivery versions
V3 through V6. The Round 1 design creates a V7 accepted event and promises
private projection behavior, but forbids all projection production changes.
Consequently, an otherwise accepted V7 stream cannot pass the real production
projection provenance gate. A private-view test alone cannot supply missing
production support.

Round 2 must:

- add `packages/projections/src/index.ts` to the production allowlist;
- remove `packages/domain-core/src/event-applier.ts` from that allowlist;
- preserve the five-production-file ceiling;
- state explicitly that `event-applier.ts` is not modified;
- add a primary projection-layer criterion proving V7 passes the production
  allowlist and reveals only the stored apparent target/pair;
- preserve all V1–V6 projection behavior and all impairment/truth/candidate/
  Demon/ledger secrecy.

### F-03 — Traceability omits Governance Traceability V1.1 fields and mixes primary authorities

Severity: `BLOCKER`

Blocker ID:
`2B20A_DESIGN_TRACEABILITY_V1_1_FIELDS_AND_PRIMARY_CLASSIFICATION_MISSING`

The Round 1 RC table has only claim and test columns. It does not satisfy the
mandatory Governance Traceability V1.1 contract and assigns several criteria
to multiple mechanisms/layers.

Every Round 2 criterion must contain exactly these nine fields:

1. `CriterionId`
2. `RuleClaim`
3. `CompletionCriterion`
4. `RequiredEvidenceMechanism`
5. `ExpectedReachability`
6. `ExpectedTrust`
7. `ExpectedPrimaryLayer`
8. `ExpectedResult`
9. `SupportingAuthorityRequirement`

Each criterion must have one primary evidence authority and one primary layer.
Round 2 must split application, direct domain, replay, projection, and policy
mechanisms into separate criteria rather than combining primary mechanisms in
one row. Supporting authorities may be listed only in
`SupportingAuthorityRequirement`; they cannot replace the primary mechanism.

## Non-Blocking Conclusions

- The exact accepted stream and bounded scope are otherwise sufficiently
  identified.
- The V7 exact-shape, candidate policy, atomic target/delivery/settlement
  concept, hostile-input posture, receipt/idempotency constraints, and explicit
  exclusions remain usable Round 2 material after the blockers are corrected.
- No rule conflict or source-unavailability condition exists.
- Coverage remains
  `PARTIAL / REACHABLE_BASE_DREAMER_SETTLEABILITY_ONLY`; Dreamer remains
  `PARTIAL`.
- No production or test implementation is authorized by this review.

## Required Round 2 Action

Create one complete standalone Round 2 design that:

1. cites `docs/rules/evidence/2B20A-resolved.md` as its only active evidence;
2. carries forward all correct Round 1 behavioral contracts;
3. applies the base-Dreamer Mathematician fact/count attribution matrix;
4. uses the corrected five-file production allowlist with projections instead
   of event-applier;
5. supplies complete nine-field, single-primary-authority Governance
   Traceability V1.1 criteria; and
6. returns for a fresh independent Round 2 design review.

No implementation may begin before a fresh exact `RULE_DESIGN_PASS`.

## remainingBlockers

- `2B20A_RULE_EVIDENCE_MATHEMATICIAN_COUNTED_PLAYER_ATTRIBUTION_CONFLICT`
- `2B20A_V7_ACCEPTED_STREAM_PROJECTION_PROVENANCE_GATE_MISSING`
- `2B20A_DESIGN_TRACEABILITY_V1_1_FIELDS_AND_PRIMARY_CLASSIFICATION_MISSING`

## Rule Design Verdict

RULE_DESIGN_FIX_REQUIRED
