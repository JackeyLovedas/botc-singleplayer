# Phase 3 Slice 2B19A3A Implementation Traceability

## Authority

- Rule evidence: `docs/rules/evidence/2B19A3A.md`, canonical LF SHA-256 `7c427b38240ef888e7b9851b5c8ce9a67377224722be01fa8f3154e5f731a7eb`.
- Frozen behavior design: `docs/implementation/phase-3-slice-2b19a3a-design-round-3.md`, canonical LF SHA-256 `ff191fe9b0877b9fc613fb0f98341fa757a19019918f83b875d564d5e8a91b57`.
- Immutable Round 3 review: `docs/implementation/phase-3-slice-2b19a3a-design-review-round-3.md`, canonical LF SHA-256 `fb98868d6953dd8a686f18e75532a19a519e599273496c5e2947cb181133ec69`.
- Classification release: `docs/implementation/phase-3-slice-2b19a3a-design-release-review-under-governance-v1-1.md`, recorded SHA-256 `cc5fb0b1443cd4a4b08ccedacfa038d8f51a2a358e22df49838ea01fe9b3ad6c`.

`MechanismMatch=PASS` means the physical authority uses the required entry and assertion mechanism. Runtime status is recorded separately; C51-C53 remain exact-head CI obligations until the frozen feature HEAD is pushed and succeeds.

## Supporting authority registry

| SupportingAuthorityId | Producer | SourceTestOrFixture | AuthorityStatus | UsedByCriteria | MutationDisposition |
|---|---|---|---|---|---|
| `SUP-2B19A3A-001` | Real `GameApplicationService` command chain: accepted Philosopher chooses Dreamer, base Dreamer becomes represented DRUNK, scheduler advances, real V3 opportunity opens | `packages/application/src/game-application-service.test.ts :: [2B19A3A-C17]` accepted prefix before the failing Submit command | `ACCEPTED` | `C17` | `NONE` |
| `SUP-2B19A3A-002` | Real `GameApplicationService` command chain through `reachOpenDreamerV3ActionOpportunity(..., noPhilosopherVortoxExactRoleIds)` | `packages/application/src/game-application-service.test.ts :: Phase 3 Slice 2B19A3A retryable application boundaries :: prepare` | `ACCEPTED` | `C27,C28,C29,C30,C31,C32,C33` | `NONE` |

Each `SUP-*` ID resolves exactly once. Fault injection occurs after the accepted prefix and does not mutate persisted supporting history. Supporting authority is non-primary.

## Primary criteria actual bindings

| CriterionId | ActualTestFile | ActualTestTitle | ActualPrimaryLayer | ActualReachability | ActualTrust | SupportingAuthorityId | MechanismMatch | Actual main assertion |
|---|---|---|---|---|---|---|---|---|
| C01 | `packages/domain-core/src/rebuild.test.ts` | `[2B19A3A-C01]...replays frozen V1 Dreamer history...` | `LEGACY_REPLAY_COMPATIBILITY` | R2 | T1 | NONE | PASS | Frozen V1 stream rebuilds with unchanged delivery and ledger meaning. |
| C02 | `packages/domain-core/src/rebuild.test.ts` | `[2B19A3A-C02]...restarts from...normal V2 delivery stream` | `LEGACY_REPLAY_COMPATIBILITY` | R2 | T1 | NONE | PASS | Application-captured normal V2 history rebuilds exactly. |
| C03 | `packages/projections/src/private-knowledge-view.test.ts` | `[2B19A3A-C03]...projects settled V1 DREAMER_INFORMATION...` | `PROJECTION` | R2 | T1 | NONE | PASS | V1 state-only source view remains accepted and hidden fields stay absent. |
| C04 | `packages/projections/src/private-knowledge-view.test.ts` | `[2B19A3A-C04] keeps normal V2 history accepted by the state-only private projection` | `PROJECTION` | R2 | T1 | NONE | PASS | Normal V2 state-only player/AI views remain accepted and equal. |
| C05 | `packages/domain-core/src/dreamer.test.ts` | `[2B19A3A-C05] validates the exact canonical V3 shape` | `STRUCTURAL_VALIDATION` | R1 | T1 | NONE | PASS | Exact 20-key V3 validates. |
| C06 | `packages/application/src/game-application-service.test.ts` | `[2B19A3A-C06/C09/C10/C11/C15/C37] accepts a GOOD target...` | `ACCEPTED_STREAM_INTEGRATION` | R1 | T1 | NONE | PASS | Real GOOD-target command accepts the exact three-event batch. |
| C07 | `packages/application/src/game-application-service.test.ts` | `[2B19A3A-C07] accepts a non-Vortox EVIL target through real commands` | `ACCEPTED_STREAM_INTEGRATION` | R1 | T1 | NONE | PASS | Real non-Vortox EVIL target succeeds. |
| C08 | `packages/application/src/game-application-service.test.ts` | `[2B19A3A-C08] accepts the current Vortox as the Dreamer target` | `ACCEPTED_STREAM_INTEGRATION` | R1 | T1 | NONE | PASS | Current Vortox is a legal target and commits. |
| C09 | `packages/application/src/game-application-service.test.ts` | `[2B19A3A-C06/C09/C10/C11/C15/C37]...` | `ACCEPTED_STREAM_INTEGRATION` | R1 | T2 | NONE | PASS | Delivered GOOD role is native GOOD. |
| C10 | `packages/application/src/game-application-service.test.ts` | `[2B19A3A-C06/C09/C10/C11/C15/C37]...` | `ACCEPTED_STREAM_INTEGRATION` | R1 | T2 | NONE | PASS | Delivered EVIL role is native EVIL. |
| C11 | `packages/application/src/game-application-service.test.ts` | `[2B19A3A-C06/C09/C10/C11/C15/C37]...` | `ACCEPTED_STREAM_INTEGRATION` | R1 | T2 | NONE | PASS | Both roles exclude settlement-time truth. |
| C12 | `packages/domain-core/src/dreamer.test.ts` | `[2B19A3A-C12/C13/C14] selects deterministic native false roles...` | `PURE_POLICY_SEAM` | R4 | T3 | NONE | PASS | In-play role remains in deterministic candidate policy. |
| C13 | `packages/domain-core/src/dreamer.test.ts` | `[2B19A3A-C12/C13/C14]...` | `PURE_POLICY_SEAM` | R4 | T3 | NONE | PASS | Catalog reversal cannot change the pair. |
| C14 | `packages/domain-core/src/dreamer.test.ts` | `[2B19A3A-C12/C13/C14]...` plus static source scan | `PURE_POLICY_SEAM` | R4 | T3 | NONE | PASS | Stable code-unit ordering uses no locale API. |
| C15 | `packages/application/src/game-application-service.test.ts` | `[2B19A3A-C06/C09/C10/C11/C15/C37]...` | `ACCEPTED_STREAM_INTEGRATION` | R1 | T1 | NONE | PASS | Target, delivery, settlement share one batch and contiguous metadata. |
| C16 | `packages/domain-core/src/rebuild.test.ts` | `[2B19A3A-C16] rebuilds the exact accepted batch from its pre-delivery canonical Vortox state` | `ACCEPTED_STREAM_INTEGRATION` | R1 | T2 | NONE | PASS | Pre-batch state proves current Vortox before exact full rebuild. |
| C17 | `packages/application/src/game-application-service.test.ts` | `[2B19A3A-C17] fails a represented DRUNK base Dreamer receipt-free through the real Philosopher chain` | `APPLICATION_COMMAND_INTEGRATION` | R1 | T2 | `SUP-2B19A3A-001` | PASS | Formal Submit returns `ApplicationNotConfigured`, no receipt/events/version change, OPEN remains. |
| C18 | `packages/domain-core/src/dreamer.test.ts` | `[2B19A3A-C18/C19] classifies impaired Dreamer or Vortox as non-V3` | `PURE_POLICY_SEAM` | R4 | T3 | NONE | PASS | Source POISONED cannot produce V3. |
| C19 | `packages/domain-core/src/dreamer.test.ts` | `[2B19A3A-C18/C19]...` | `PURE_POLICY_SEAM` | R4 | T3 | NONE | PASS | Impaired current Vortox cannot produce V3. |
| C20 | `packages/domain-core/src/dreamer.test.ts` | `[2B19A3A-C20] fails closed when a native false-role category has no candidate` | `PURE_POLICY_SEAM` | R3 | T3 | NONE | PASS | Starved catalog throws `DomainError`. |
| C21 | `packages/domain-core/src/rebuild.test.ts` | `[2B19A3A-C21/C22/C23/C24/C25/C26] rejects hostile Vortox...mutations` | `HOSTILE_REPLAY_REJECTION` | R3 | T2 | NONE | PASS | Missing Vortox tenure rejects replay. |
| C22 | `packages/domain-core/src/rebuild.test.ts` | `[2B19A3A-C21/C22/C23/C24/C25/C26]...` | `HOSTILE_REPLAY_REJECTION` | R3 | T2 | NONE | PASS | Duplicate/cross-linked tenure rejects replay. |
| C23 | `packages/domain-core/src/rebuild.test.ts` | `[2B19A3A-C21/C22/C23/C24/C25/C26]...` | `HOSTILE_REPLAY_REJECTION` | R3 | T2 | NONE | PASS | Stale/ended tenure identity rejects replay. |
| C24 | `packages/domain-core/src/rebuild.test.ts` | `[2B19A3A-C21/C22/C23/C24/C25/C26]...` | `HOSTILE_REPLAY_REJECTION` | R3 | T2 | NONE | PASS | Wrong Vortox player/seat rejects replay. |
| C25 | `packages/domain-core/src/rebuild.test.ts` | `[2B19A3A-C21/C22/C23/C24/C25/C26]...` | `HOSTILE_REPLAY_REJECTION` | R3 | T2 | NONE | PASS | Wrong evaluated revision rejects replay. |
| C26 | `packages/domain-core/src/rebuild.test.ts` | `[2B19A3A-C21/C22/C23/C24/C25/C26]...` | `HOSTILE_REPLAY_REJECTION` | R3 | T2 | NONE | PASS | Conflicting applicability identity rejects replay. |
| C27 | `packages/application/src/game-application-service.test.ts` | `[2B19A3A-C27/C33] keeps unresolved capability receipt-free and accepts...after repair` | `APPLICATION_COMMAND_INTEGRATION` | R1 | T1 | `SUP-2B19A3A-002` | PASS | Formal command with bounded resolver failure has no write/receipt and OPEN remains. |
| C28 | `packages/application/src/game-application-service.test.ts` | `[2B19A3A-C28] keeps V3 canonical-result construction failure receipt-free` | `APPLICATION_COMMAND_INTEGRATION` | R1 | T1 | `SUP-2B19A3A-002` | PASS | Formal command contains constructor failure without mutation. |
| C29 | `packages/application/src/game-application-service.test.ts` | `[2B19A3A-C29/C30] contains DomainError and unexpected prospective failures...` | `APPLICATION_COMMAND_INTEGRATION` | R1 | T1 | `SUP-2B19A3A-002` | PASS | Formal command preserves `first-night-role-action` on prospective `DomainError`. |
| C30 | `packages/application/src/game-application-service.test.ts` | `[2B19A3A-C29/C30]...` | `APPLICATION_COMMAND_INTEGRATION` | R1 | T1 | `SUP-2B19A3A-002` | PASS | Formal command contains unexpected proxy iterator error at `prospective-validation`. |
| C31 | `packages/application/src/game-application-service.test.ts` | `[2B19A3A-C31] keeps every V3 batch/event-ID and clock metadata failure atomic` | `APPLICATION_COMMAND_INTEGRATION` | R1 | T1 | `SUP-2B19A3A-002` | PASS | Real ID/clock ports fail every position with no write/receipt and OPEN remains. |
| C32 | `packages/application/src/game-application-service.test.ts` | `[2B19A3A-C32] keeps before-commit and during-commit failures atomic` | `APPLICATION_COMMAND_INTEGRATION` | R1 | T1 | `SUP-2B19A3A-002` | PASS | Real commit-store failures leave no accepted event or receipt. |
| C33 | `packages/application/src/game-application-service.test.ts` | `[2B19A3A-C27/C33]...accepts the identical command after repair` | `ACCEPTED_STREAM_INTEGRATION` | R1 | T1 | `SUP-2B19A3A-002` | PASS | Identical command ID succeeds after resolver repair and receives one receipt. |
| C34 | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts` | `[2B19A3A-C34/C35/C36] derives exact nine/ten-entry abnormal facts...` | `ACCEPTED_STREAM_INTEGRATION` | R1 | T2 | NONE | PASS | Vortox target derives one exact nine-entry abnormal fact. |
| C35 | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts` | `[2B19A3A-C34/C35/C36]...` | `ACCEPTED_STREAM_INTEGRATION` | R1 | T2 | NONE | PASS | Non-Vortox target derives one exact ten-entry abnormal fact. |
| C36 | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts` | `[2B19A3A-C34/C35/C36]...` | `STRUCTURAL_VALIDATION` | R1 | T2 | NONE | PASS | V3 fact contains zero `ABILITY_IMPAIRMENT` evidence. |
| C37 | `packages/application/src/game-application-service.test.ts` | `[2B19A3A-C06/C09/C10/C11/C15/C37]...` | `ACCEPTED_STREAM_INTEGRATION` | R1 | T2 | NONE | PASS | Settlement does not create a duplicate terminal fact. |
| C38 | `packages/application/src/mathematician-information.test.ts` | `[2B19A3A-C38] counts the Vortox-abnormal Dreamer source exactly once through the real later command` | `ACCEPTED_STREAM_INTEGRATION` | R1 | T2 | NONE | PASS | Existing Mathematician command consumes Dreamer abnormality once; true count is one. |
| C39 | `packages/application/src/mathematician-information.test.ts` | `[2B19A3A-C39] does not count the accepted normal Dreamer` | `ACCEPTED_STREAM_INTEGRATION` | R1 | T2 | NONE | PASS | Existing consumer gives zero for normal Dreamer. |
| C40 | `packages/projections/src/private-knowledge-view.test.ts` | `[2B19A3A-C40/C41/C42/C43/C45] reveals only the historical pair...` | `PROJECTION` | R1 | T1 | NONE | PASS | Source player sees target/GOOD/EVIL only. |
| C41 | `packages/projections/src/private-knowledge-view.test.ts` | `[2B19A3A-C40/C41/C42/C43/C45]...` | `PROJECTION` | R1 | T1 | NONE | PASS | Source AI view equals source player view. |
| C42 | `packages/projections/src/private-knowledge-view.test.ts` | `[2B19A3A-C40/C41/C42/C43/C45]...` | `PROJECTION` | R1 | T1 | NONE | PASS | Non-source view omits the pair. |
| C43 | `packages/projections/src/private-knowledge-view.test.ts` | `[2B19A3A-C40/C41/C42/C43/C45]...` | `PROJECTION` | R1 | T1 | NONE | PASS | Vortox constraint and reliability do not leak. |
| C44 | `packages/projections/src/private-knowledge-view.test.ts` | `[2B19A3A-C44] rejects V3 from the state-only projection boundary` | `PROJECTION` | R3 | T1 | NONE | PASS | State-only player/AI projection throws `DomainError`. |
| C45 | `packages/projections/src/private-knowledge-view.test.ts` | `[2B19A3A-C40/C41/C42/C43/C45]...` | `PROJECTION` | R1 | T1 | NONE | PASS | Accepted-stream replay authenticates and returns V3 view. |
| C46 | `packages/domain-core/src/dreamer.test.ts` | `[2B19A3A-C46] excludes the target role after a pre-delivery character change` | `PURE_POLICY_SEAM` | R4 | T3 | NONE | PASS | Revision-2 canonical policy input excludes the changed target role. |
| C47 | `packages/projections/src/private-knowledge-view.test.ts` | `[2B19A3A-C47] projection leaves accepted historical payload bytes unchanged` | `PURE_POLICY_SEAM` | R4 | T3 | NONE | PASS | Projection does not rewrite stored delivery bytes. |
| C48 | `packages/application/src/game-application-service.test.ts` | `[2B19A3A-C48] continues a real accepted Vortox V3 Dreamer success through a terminal Seamstress action` | `ACCEPTED_STREAM_INTEGRATION` | R1 | T1 | NONE | PASS | Both closed terminal chains replay after real commands. |
| C49 | `packages/domain-core/src/dreamer.test.ts` | `[2B19A3A-C49] preserves Dreamer at 61/80 between Clockmaker and Seamstress` | `STRUCTURAL_VALIDATION` | R1 | T2 | NONE | PASS | Catalog has exact Clockmaker/Dreamer/Seamstress relative order and 800/900/1000 keys. |
| C50 | `packages/domain-core/src/dreamer.test.ts` | `[2B19A3A-C50] preserves Vortox without a first-night wake task` | `STRUCTURAL_VALIDATION` | R1 | T2 | NONE | PASS | No role task is sourced by Vortox. |
| C51 | `.github/workflows/ci.yml` | `Ubuntu / Validate` | `CROSS_PLATFORM_CI` | R1 | T1 | NONE | PASS | Exact frozen feature HEAD must report SUCCESS; currently pending push. |
| C52 | `.github/workflows/ci.yml` | `Ubuntu / Coverage` | `CROSS_PLATFORM_CI` | R1 | T1 | NONE | PASS | Exact frozen feature HEAD single-fork coverage must report SUCCESS; currently pending push. |
| C53 | `.github/workflows/ci.yml` | `Windows / Deterministic` | `CROSS_PLATFORM_CI` | R1 | T1 | NONE | PASS | Exact frozen feature HEAD deterministic job must report SUCCESS; currently pending push. |

## Supporting criteria actual bindings

| CriterionId | ActualTestFile | ActualTestTitle | ActualPrimaryLayer | ActualReachability | ActualTrust | SupportingAuthorityId | MechanismMatch | Actual main assertion |
|---|---|---|---|---|---|---|---|---|
| S01 | `packages/domain-core/src/dreamer.test.ts` | `[2B19A3A-S01/S02/S03] rejects missing, extra, and wrong-literal V3 payloads` | `STRUCTURAL_VALIDATION` | R3 | T1 | NONE | PASS | Missing top-level key rejects. |
| S02 | `packages/domain-core/src/dreamer.test.ts` | `[2B19A3A-S01/S02/S03]...` | `STRUCTURAL_VALIDATION` | R3 | T1 | NONE | PASS | Extra top-level key rejects. |
| S03 | `packages/domain-core/src/dreamer.test.ts` | `[2B19A3A-S01/S02/S03]...` | `STRUCTURAL_VALIDATION` | R3 | T1 | NONE | PASS | Wrong literal/primitive rejects. |
| S04 | `packages/domain-core/src/dreamer.test.ts` | `[2B19A3A-S04/S05/S06/S07/S08/S09] rejects hostile records without invoking accessors` | `STRUCTURAL_VALIDATION` | R3 | T1 | NONE | PASS | Getter count remains zero. |
| S05 | `packages/domain-core/src/dreamer.test.ts` | `[2B19A3A-S04/S05/S06/S07/S08/S09]...` | `STRUCTURAL_VALIDATION` | R3 | T1 | NONE | PASS | Throwing Proxy rejects without escape. |
| S06 | `packages/domain-core/src/dreamer.test.ts` | `[2B19A3A-S04/S05/S06/S07/S08/S09]...` | `STRUCTURAL_VALIDATION` | R3 | T1 | NONE | PASS | Revoked Proxy rejects. |
| S07 | `packages/domain-core/src/dreamer.test.ts` | `[2B19A3A-S04/S05/S06/S07/S08/S09]...` | `STRUCTURAL_VALIDATION` | R3 | T1 | NONE | PASS | Enumerable symbol rejects. |
| S08 | `packages/domain-core/src/dreamer.test.ts` | `[2B19A3A-S04/S05/S06/S07/S08/S09]...` | `STRUCTURAL_VALIDATION` | R3 | T1 | NONE | PASS | Cycle rejects. |
| S09 | `packages/domain-core/src/dreamer.test.ts` | `[2B19A3A-S04/S05/S06/S07/S08/S09]...` | `STRUCTURAL_VALIDATION` | R3 | T1 | NONE | PASS | Nonplain record rejects. |
| S10 | `packages/domain-core/src/dreamer.test.ts` | `[2B19A3A-S10] rejects a sparse canonical catalog array` | `STRUCTURAL_VALIDATION` | R3 | T1 | NONE | PASS | Sparse array rejects. |
| S11 | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts` | `[2B19A3A-S11/S12/S13/S14/S15/S16] rejects every hostile nine-set mutation` | `HOSTILE_REPLAY_REJECTION` | R3 | T1 | NONE | PASS | Every nine-set removal rejects. |
| S12 | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts` | `[2B19A3A-S11/S12/S13/S14/S15/S16]...` | `HOSTILE_REPLAY_REJECTION` | R3 | T1 | NONE | PASS | Every nine-set duplicate rejects. |
| S13 | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts` | `[2B19A3A-S11/S12/S13/S14/S15/S16]...` | `HOSTILE_REPLAY_REJECTION` | R3 | T1 | NONE | PASS | Every nine-set primary identity substitution rejects. |
| S14 | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts` | `[2B19A3A-S11/S12/S13/S14/S15/S16]...` | `HOSTILE_REPLAY_REJECTION` | R3 | T1 | NONE | PASS | Same-primary conflict rejects. |
| S15 | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts` | `[2B19A3A-S11/S12/S13/S14/S15/S16]...` | `HOSTILE_REPLAY_REJECTION` | R3 | T1 | NONE | PASS | Added evidence rejects. |
| S16 | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts` | `[2B19A3A-S11/S12/S13/S14/S15/S16]...` | `HOSTILE_REPLAY_REJECTION` | R3 | T1 | NONE | PASS | Reordered evidence rejects. |
| S17 | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts` | `[2B19A3A-S17/S18/S19/S20/S21/S22] rejects every hostile ten-set mutation` | `HOSTILE_REPLAY_REJECTION` | R3 | T1 | NONE | PASS | Every ten-set removal rejects. |
| S18 | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts` | `[2B19A3A-S17/S18/S19/S20/S21/S22]...` | `HOSTILE_REPLAY_REJECTION` | R3 | T1 | NONE | PASS | Every ten-set duplicate rejects. |
| S19 | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts` | `[2B19A3A-S17/S18/S19/S20/S21/S22]...` | `HOSTILE_REPLAY_REJECTION` | R3 | T1 | NONE | PASS | Every ten-set primary identity substitution rejects. |
| S20 | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts` | `[2B19A3A-S17/S18/S19/S20/S21/S22]...` | `HOSTILE_REPLAY_REJECTION` | R3 | T1 | NONE | PASS | Same-primary conflict rejects. |
| S21 | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts` | `[2B19A3A-S17/S18/S19/S20/S21/S22]...` | `HOSTILE_REPLAY_REJECTION` | R3 | T1 | NONE | PASS | Added evidence rejects. |
| S22 | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts` | `[2B19A3A-S17/S18/S19/S20/S21/S22]...` | `HOSTILE_REPLAY_REJECTION` | R3 | T1 | NONE | PASS | Reordered evidence rejects. |
| S23 | `packages/domain-core/src/domain-batch-semantics.test.ts` | `[2B19A3A-S23/S24/S25/S26/S27/S28/S29] rejects naked, partial, reordered, duplicate, split, cross-batch, and mismatched metadata` | `HOSTILE_REPLAY_REJECTION` | R3 | T1 | NONE | PASS | Naked V3 delivery rejects. |
| S24 | `packages/domain-core/src/domain-batch-semantics.test.ts` | `[2B19A3A-S23/S24/S25/S26/S27/S28/S29]...` | `HOSTILE_REPLAY_REJECTION` | R3 | T1 | NONE | PASS | Partial batch rejects. |
| S25 | `packages/domain-core/src/domain-batch-semantics.test.ts` | `[2B19A3A-S23/S24/S25/S26/S27/S28/S29]...` | `HOSTILE_REPLAY_REJECTION` | R3 | T1 | NONE | PASS | Reordered batch rejects. |
| S26 | `packages/domain-core/src/domain-batch-semantics.test.ts` | `[2B19A3A-S23/S24/S25/S26/S27/S28/S29]...` | `HOSTILE_REPLAY_REJECTION` | R3 | T1 | NONE | PASS | Duplicate event rejects. |
| S27 | `packages/domain-core/src/domain-batch-semantics.test.ts` | `[2B19A3A-S23/S24/S25/S26/S27/S28/S29]...` | `HOSTILE_REPLAY_REJECTION` | R3 | T1 | NONE | PASS | Split batch rejects. |
| S28 | `packages/domain-core/src/domain-batch-semantics.test.ts` | `[2B19A3A-S23/S24/S25/S26/S27/S28/S29]...` | `HOSTILE_REPLAY_REJECTION` | R3 | T1 | NONE | PASS | Cross-batch chain rejects. |
| S29 | `packages/domain-core/src/domain-batch-semantics.test.ts` | `[2B19A3A-S23/S24/S25/S26/S27/S28/S29]...` | `HOSTILE_REPLAY_REJECTION` | R3 | T1 | NONE | PASS | Mismatched metadata rejects. |
| S30 | `packages/domain-core/src/dreamer.test.ts` | `[2B19A3A-S30/S31/S32/S33] clones all versions independently and compares cross-version false` | `LEGACY_REPLAY_COMPATIBILITY` | R2 | T3 | NONE | PASS | V1 clone is reference-independent. |
| S31 | `packages/domain-core/src/dreamer.test.ts` | `[2B19A3A-S30/S31/S32/S33]...` | `LEGACY_REPLAY_COMPATIBILITY` | R2 | T3 | NONE | PASS | V2 clone is reference-independent. |
| S32 | `packages/domain-core/src/dreamer.test.ts` | `[2B19A3A-S30/S31/S32/S33]...` | `STRUCTURAL_VALIDATION` | R1 | T3 | NONE | PASS | V3 clone is reference-independent. |
| S33 | `packages/domain-core/src/dreamer.test.ts` | `[2B19A3A-S30/S31/S32/S33]...` | `LEGACY_REPLAY_COMPATIBILITY` | R2 | T3 | NONE | PASS | V1/V2/V3 pairwise equality is false. |
| S34 | `packages/domain-core/src/dreamer.ts` | `STATIC_SERIALIZATION_SCAN` | `STRUCTURAL_VALIDATION` | R3 | T3 | NONE | PASS | Semantic equality contains no JSON/serialization equality call. |
| S35 | `docs/implementation/phase-3-slice-2b19a3a-test-traceability.md` | `STATIC_TRACEABILITY_SCHEMA_AUDIT` | `STRUCTURAL_VALIDATION` | R3 | T1 | NONE | PASS | All 92 IDs have one complete actual-binding row. |
| S36 | `docs/implementation/phase-3-slice-2b19a3a-test-traceability.md` | `STATIC_PRIMARY_LAYER_TOKEN_AUDIT` | `STRUCTURAL_VALIDATION` | R3 | T1 | NONE | PASS | Only the eight governance-V1.1 layer tokens occur, one per row. |
| S37 | `docs/implementation/phase-3-slice-2b19a3a-test-traceability.md` | `STATIC_REACHABILITY_PRIMARY_LAYER_INDEPENDENCE_AUDIT` | `STRUCTURAL_VALIDATION` | R3 | T1 | NONE | PASS | Successful accepted-stream rows are R1; formal failures are application-command integration; R3 is not promoted. |
| S38 | repository diff | `STATIC_DIFF_ALLOWLIST_AUDIT` | `STRUCTURAL_VALIDATION` | R3 | T1 | NONE | PASS | Changed paths are a subset of the closed allowlist. |
| S39 | three accepted baseline harness paths | `STATIC_BASELINE_FIXTURE_DIFF_AUDIT` | `LEGACY_REPLAY_COMPATIBILITY` | R2 | T1 | NONE | PASS | Baseline harness diff is empty. |

## Runtime evidence

- Focused C38/C39: `2 / 2 PASS`.
- Focused C48: `1 / 1 PASS`.
- Focused Dreamer Slice tests: `10 / 10 PASS`; C46 standalone `1 / 1 PASS`.
- Complete affected-path run: `10 projects / 1136 tests PASS`.
- Typecheck and full lint: `PASS`.
- Full ordinary tests: `34 files / 1512 tests PASS`; `33.34s`.
- Full single-fork coverage: `34 files / 1512 tests PASS`; `51.1s`; `87.44%` statements/lines, `82.45%` branches, `97.88%` functions; no worker RPC timeout.
- Static traceability, SUP resolution, scope, baseline fixture, reachability/layer, semantic equality, deterministic API, disabled-test, and production-LOC audits: `PASS`.
- Exact-head CI remains pending until the frozen feature commit is published. CI status is never inherited from another SHA.
