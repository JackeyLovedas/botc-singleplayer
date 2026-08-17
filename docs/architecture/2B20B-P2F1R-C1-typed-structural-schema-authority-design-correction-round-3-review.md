# Phase 3 Slice 2B20B-P2F1R-C1 Design Correction Round 3 Independent Review

Review artifact: independent read-only

建议审查归档路径：docs/architecture/2B20B-P2F1R-C1-typed-structural-schema-authority-design-correction-round-3-review.md。

reviewedHead: `30793b662b99bb7f4689811e56b91afe365c2fd4`

reviewTimestamp: `2026-08-01T01:48:44.3600708Z`

reviewScope:
- Fresh, independent, read-only pre-implementation review of `2B20B-P2F1R-C1 B54 Authority Resolution and Bounded Design Correction`.
- Reviewed the accepted clean authority worktree, complete C1 design chain, B54 audit, affected accepted production code and tests, architecture, implementation status, rule evidence, external sources, nightsheet, role coverage, traceability governance, allowlist, and GitHub/CI state.
- The dirty primary worktree was treated only as unaccepted context. No file was edited.
- No C1 implementation file or generated V2 catalog currently exists. No open PR or CI run was found for the accepted HEAD; the design documents correctly present those checks as future implementation evidence.

designFilesReviewed:
- `AGENTS.md`
- `project-handoff/00-README-FIRST.md` and all seven handoff documents it orders
- `docs/agent-loop/AUTOPILOT_PROMPT.md`
- `docs/agent-loop/REVIEW_PROTOCOL.md`
- `docs/agent-loop/CURRENT_TASK.md`
- Accepted Traceability V1.1 ADR
- `docs/architecture/2B20B-P2F1R-C-domain-event-structural-schema-catalog-v1.md`
- `docs/architecture/2B20B-P2F1R-C1-b54-authority-resolution-audit-v1.md`
- `docs/architecture/2B20B-P2F1R-C1-typed-structural-schema-authority-design-round-1.md`
- `docs/architecture/2B20B-P2F1R-C1-typed-structural-schema-authority-design-correction-round-1.md`
- `docs/architecture/2B20B-P2F1R-C1-typed-structural-schema-authority-design-correction-round-2.md`
- `docs/architecture/2B20B-P2F1R-C1-typed-structural-schema-authority-design-correction-round-3.md`
- Parent 2B20B-P2F1R-C design, correction, governance-precheck, and test-traceability documents relevant to inherited authority

acceptedProductionFilesReviewed:
- `packages/domain-core/src/events.ts`
- `packages/domain-core/src/mathematician.ts`
- `packages/domain-core/src/mathematician-internal.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`

acceptedTestFilesReviewed:
- `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`
- `packages/application/src/mathematician-information.test.ts`
- Associated Mathematician fixtures and hostile/replay validation cases

ruleEvidenceReviewed:
- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/evidence/2B20B-P2F1R-C1.md`
- Parent C rule evidence needed to establish inherited scope
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- Seamstress rule text and explanation evidence
- States and Vortox evidence needed to verify information reliability boundaries
- Official nightsheet ordering evidence
- C1 terminal rule-research verdict: `RULE_READY`
- Seamstress remains `PARTIAL`; the proposed correction does not expand role semantics.

externalSourcesReviewed:
- Chinese Wiki main page, revision 5855
- Chinese Wiki Seamstress page, revision 5160
- Official BOTC Wiki main page, revision 3035
- Official Seamstress page, revision 1999
- Official States page, revision 1039
- Official Vortox page, revision 3017
- Official nightsheet at commit `3d6d930…`
- Nightsheet placement independently confirmed:
  - first night: index 61 of 80, after Dreamer and before Steward
  - other nights: index 82 of 99, after Oracle and before Juggler
- No new BOTC semantic conflict was found.

SHA validation:
- Accepted HEAD: `30793b662b99bb7f4689811e56b91afe365c2fd4`
- B54 audit: `5da6836a0bac012e61143f711b17a42dc0a6c5ef3edfb895e9dc296ea184d6f9`
- C1 correction round 3: `bdc7daca247560673e26732fe26f659db7a35417b4ed771169425ee9c6aa0328`
- C1 correction round 2: `10b06b08cf9f99f3c6e5f4161af164f8f8e48423f79cd983294a2d12f68eac3b`
- C1 correction round 1: `7aa2d382669c5957255def6ae8257b8e89e72679076df9f61a6b237fa91d4898`
- C1 parent design: `275b8d17f3e01d830355627de90cc526f323b117c15c6a7bfcc41d5516b832f1`
- C1 rule evidence: `a484067a98056e83d11f9b41fadfa1140d738c811850a139075bd57cfe0650fe`
- Catalog V1: `bb8be14de51c2c668b310869983db36d1200c6959830303e953bbc7af2023b26`
- USER_OVERRIDES: `9e2b8e9701a35559d9cc67d8c2185d979ec222b3186fa3a9cd16140dd2f68ad5`
- ROLE_COVERAGE_MATRIX: `325488cb19b444393c94069a46978139c423f4fd3f757de033496e1224f932a7`
- Accepted production hashes:
  - `events.ts`: `f42642a424a60cb260f8ae61951d1640899cb866dd927201a98fc7d4a512e07b`
  - `mathematician.ts`: `5f9fe798e2bc460ca74cc3ec1701b4462437a3df59c4bf15e68c7ec91ea6a62d`
  - `mathematician-internal.ts`: `fe8eaa07dbd18aca6437dc764083c22116488fa66e8db008bf61a642dc081311`
  - `first-night-ability-outcome-ledger.ts`: `39c7296a97eedcd6539b1ca48decf91fc7dc49ec7f831be61d31763b688f9f70`
- Live external-source byte hashes matched the hashes recorded in C1 evidence, including the nightsheet hash `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`.

findings:

1. `C1-B54-DR3-DELTA-ATOMICITY`
   - severity: `BLOCKER`
   - file/symbol: C1 correction round 3, “Complete approved-delta ledger” and proposed Catalog V2 `D|...` rows
   - evidence:
     - The human-readable delta table has only seven fields: `DeltaId`, `Branch`, `Frozen path/occurrences`, `V1 representation`, `V2 AST representation`, `RuntimeInputSetChanged`, and `BehaviorChanged`.
     - The required ten-field atomic record is not present. The missing per-occurrence fields are `Occurrence`, `SourceMemberCount`, `SurvivorKind`, and `NormalizedSchemaIdentity`, while the current branch field needs a single canonical `BranchId`.
     - Catalog rows fragment B54 evidence across a four-field delta row and three occurrence rows. The occurrence rows omit `deltaId`, `runtimeInputSetChanged`, and `behaviorChanged`; therefore an occurrence cannot be atomically attributed to its approved delta.
     - The canonical audit projection described by inherited corrections does not visibly carry the normalization version and complete approved-delta records from which all these rows must be derived.
   - failureScenario:
     - An implementation can emit the approved top-level B54 delta ID while silently changing, dropping, or adding one of the three occurrences. The fragmented rows can still look individually plausible, and digest/catalog generation lacks one closed ten-field fact to reject the mismatch.
     - This defeats the required fail-closed proof that B26 and B54 are the only changed branches and that all 57 other branches are unchanged.
   - requiredCorrection:
     - Freeze one exact ten-field delta-record contract:
       `DeltaId`, `BranchId`, `Occurrence`, `SourceMemberCount`, `SurvivorKind`, `NormalizedSchemaIdentity`, `V1Representation`, `V2ASTRepresentation`, `RuntimeInputSetChanged`, `BehaviorChanged`.
     - Emit one atomic record per changed occurrence, or define an equally closed parent/child schema with mandatory `DeltaId` foreign-key binding and no independently floating occurrence rows.
     - Put normalization version and the complete approved-delta records into the single canonical audit projection used to generate the catalog and digest, or explicitly define an equally exact single source that cannot drift from that projection.
   - requiredRegressionTests:
     - Parse the generated catalog and assert the exact ten keys for every delta occurrence, rejecting missing, extra, duplicated, or unknown keys.
     - Assert exactly the two approved delta IDs.
     - Assert the exact B54 occurrence set and survivor kinds for base, gained V1, and gained V2.
     - Assert source member count `4`, unchanged runtime input set, unchanged behavior, and exact normalized schema identity for each B54 occurrence.
     - Assert B26 and B54 are the only changed branches and the other 57 branches remain byte-for-byte represented as unchanged.
     - Negative tests must mutate each of the ten fields independently and require validation failure.

2. `C1-B54-DR3-SUPPORT-AUTHORITY`
   - severity: `BLOCKER / STOP-LOSS`
   - file/symbol: C1 correction round 2 supporting-authority sections and stop condition versus correction round 3 `SUP-2B20B-P2F1R-C1-003`
   - evidence:
     - Correction round 2 freezes the only implementation-time supporting-authority IDs as `SUP-2B20B-P2F1R-C1-001` and `SUP-2B20B-P2F1R-C1-002`.
     - Its acceptance criteria require only those two terminal IDs, and its explicit stop condition applies if another supporting authority needs an ID outside that set.
     - Correction round 3 says it replaces the B54 AST/delta statements and leaves every other parent contract unchanged, but nevertheless introduces terminal ID `SUP-2B20B-P2F1R-C1-003`.
     - It does not explicitly supersede the round-2 frozen-ID clauses, acceptance checks, reviewer handoff, or stop condition.
   - failureScenario:
     - An implementer cannot determine whether `003` is authorized or forbidden without choosing between simultaneous authorities. Either choice violates an active design clause, and the reviewer/controller would have to synthesize authority that the documents do not supply.
   - requiredCorrection:
     - Obtain explicit human/controller authority for the supporting-authority change.
     - Issue one correction that expressly supersedes every affected round-2 clause and freezes the complete new ID set, or keep the extra support as a design-time `PLANNED` requirement without assigning an implementation-time terminal ID.
   - requiredRegressionTests:
     - Design-contract validation must reject every terminal supporting-authority ID outside the newly frozen set.
     - Each permitted support ID must resolve exactly once and be referenced only by criteria whose supporting-authority requirement names it.
     - Missing, duplicate, dangling, and descriptive-suffix IDs must fail closed.

3. `C1-B54-DR3-TRACEABILITY-SUPERSESSION`
   - severity: `BLOCKER`
   - file/symbol: parent criterion `C1-C04`; correction-round-3 criteria `C1-C04A`, `C1-C04B`, and `C1-C15`
   - evidence:
     - Traceability V1.1 requires each design criterion to carry exactly nine fields and bind one primary authority.
     - Correction round 3 introduces `C1-C04A`, `C1-C04B`, and `C1-C15`, but its stated replacement scope does not explicitly supersede parent `C1-C04` or authorize the broader traceability rewrite.
     - Unlike the treatment of historical `C1-C09`, the original `C1-C04` is not marked historical/inactive.
     - The result allows overlapping active criteria and ambiguous primary authority for B54 normalization/delta evidence.
   - failureScenario:
     - The implementer can satisfy one version of C04 while violating another, or attach the same evidence as primary to multiple active criteria. A final traceability audit cannot prove a unique criterion-to-evidence chain.
   - requiredCorrection:
     - Explicitly supersede parent `C1-C04`, mark it historical/inactive, and define whether `C1-C04A` and `C1-C04B` are the complete replacements.
     - Explicitly authorize `C1-C15` if it remains required.
     - Publish one complete active traceability table in which every criterion has exactly the nine Traceability V1.1 design fields and exactly one primary authority.
   - requiredRegressionTests:
     - Assert unique active `CriterionId` values.
     - Assert exactly nine design-time fields per active criterion.
     - Assert historical criteria cannot receive implementation evidence.
     - Assert each evidence item has one primary criterion and supporting references cannot become a second primary authority.
     - Reject unresolved, duplicated, or silently inherited criterion mappings.

B54AcceptedShapeAssessment:
- The B54 audit accurately describes the accepted runtime shape.
- `MathematicianSourceContract` has exactly three outer members: base, gained V1, and gained V2.
- The nested provenance union has four general members, but accepted validation allows only the three matching outer/inner generation pairs.
- `EXPLICIT_DOMAIN_INSTANCE`, wrong-generation pairings, extra keys, missing keys, mixed objects, `null`, and `undefined` are rejected.
- Accepted producers construct only the three legal pairings, and replay/stored validation checks the canonical decision and exact payload equality.
- The cited accepted ledger, application, hostile, and replay tests support this assessment.

runtimeDistinguishabilityAssessment:
- The current four-arm Catalog V1 expression is extensionally equivalent to the surviving exact record because `EXACTLY_ONE` causes `{}` to match three empty-record arms and therefore reject.
- Values carrying other provenance keys match neither the surviving exact record nor an exact empty record and reject.
- Normalizing each narrowed B54 occurrence to its single surviving exact record does not broaden or narrow the accepted runtime set.

conflictClassificationAssessment:
- Classification `B TYPESCRIPT_ONLY_PLACEHOLDER_UNION` is correct for the three narrowed B54 occurrences.
- `EXPLICIT_DOMAIN_INSTANCE` remains valid only in the unnarrowed general provenance type.
- No BOTC rule semantic conflict or nightsheet conflict exists in this slice.

normalizationContractAssessment:
- The proposed survivor-only normalization is semantically sound and must remain a representation correction, not a new AST node kind.
- The contract is not yet safe for implementation because its normalization identity and delta evidence are not carried in one atomic ten-field projection/catalog record.

astRepresentationAssessment:
- The retained 15-node algebra remains sufficient.
- B54 should compile as the surviving exact-record node at each narrowed occurrence, with no placeholder union or empty-record arms.
- No new normalization node or runtime authority is justified.

compileTimeProofAssessment:
- The proposed closed TypeScript unions, exact discriminants, exhaustive handling, and `satisfies`-style catalog construction are appropriate.
- Compile-time proof alone cannot repair the current authority ambiguity or fragmented delta facts. The proof must consume the corrected closed projection and frozen traceability/support contracts.

deltaContractAssessment:
- The arithmetic is correct:
  - nodes: `2467 → 2455`
  - child references: `2408 → 2396`
  - exact-record nodes: `389 → 380`
  - union nodes: `19 → 16`
  - field count remains `2264`
- Removing three union nodes plus nine empty-record nodes explains the 12-node reduction; removing four child references for each of three occurrences explains the 12-reference reduction.
- The substantive two-delta conclusion is plausible, but the required atomic ten-field machine contract is absent and therefore cannot yet prove it.

other57Assessment:
- The corrected census supports two changed branches, B26 and B54, leaving 57 unchanged branches.
- No evidence was found for a third semantic or structural delta.
- This assessment cannot become an implementation authorization until the catalog can atomically prove the 57-branch invariant.

catalogArtifactAssessment:
- A generated V2 catalog is the appropriate audit artifact and must remain non-authoritative for runtime behavior.
- Proposed metadata for normalization version, exact digest, approved deltas, census, and branch rows is directionally correct.
- Fragmented B54 delta rows and the lack of one closed derivation source prevent the artifact from satisfying fail-closed auditability.

traceabilityAssessment:
- Current round-3 traceability is not atomic because parent C04 remains active by inheritance while C04A/C04B and C15 are introduced without an explicit complete supersession clause.
- Primary and supporting authority cannot be proven unique until the design is corrected.

supportingAuthorityAssessment:
- The proposed third terminal support ID conflicts with the still-active round-2 two-ID freeze and directly activates the inherited stop condition.
- This requires human/controller resolution; the reviewer cannot infer that round 3 silently rewrote unrelated frozen authority.

allowlistAssessment:
- The bounded implementation allowlist remains:
  - `packages/domain-core/src/domain-event-structural-schema-ast.ts`
  - `packages/domain-core/src/domain-event-structural-schema-validator.ts`
  - `packages/domain-core/src/domain-event-structural-schema-catalog.ts`
  - their three corresponding test files
  - the generated V2 catalog artifact
- No C1 implementation file currently exists.
- No change to events, Mathematician producers, replay logic, existing validators, public exports beyond the expressly approved wiring, role semantics, or unrelated catalog branches is authorized.

scopeComplianceAssessment:
- The B54 correction remains conceptually bounded and introduces no new BOTC semantics.
- Accepted clean authority was reviewed at the exact stated HEAD.
- The primary worktree contains unrelated/unaccepted modifications and untracked earlier attempts; none were treated as accepted implementation evidence.
- No implementation, commit, push, PR mutation, or CI mutation was performed.

designVerdict: `HUMAN_BLOCKED`

remainingDesignBlockers:
- Missing atomic ten-field delta record and single-source catalog/digest derivation.
- Active contradiction between the frozen two-ID supporting-authority contract and newly introduced terminal ID `SUP-2B20B-P2F1R-C1-003`.
- Non-explicit supersession of `C1-C04` and ambiguous active traceability after introducing `C1-C04A`, `C1-C04B`, and `C1-C15`.
- The supporting-authority contradiction triggers the inherited explicit stop condition; under the user’s stop-loss instruction, implementation cannot proceed.

implementationAuthorized: `false`

requiredNextAction:
- The human/controller must resolve the triggered supporting-authority stop condition.
- Then issue a bounded correction that:
  1. explicitly supersedes all affected round-2 support-ID and round-1/parent traceability clauses;
  2. freezes the complete active nine-field criterion table and unique primary/supporting-authority bindings;
  3. defines and machine-binds the atomic ten-field delta record;
  4. derives Catalog V2 and its digest from that closed projection;
  5. returns the corrected design for a fresh independent pre-implementation review.
