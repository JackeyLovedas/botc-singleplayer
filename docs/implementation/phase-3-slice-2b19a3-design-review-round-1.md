# Phase 3 Slice 2B19A3 — Independent Rule Design Review Round 1

## Review identity

- reviewedDesign: `docs/implementation/phase-3-slice-2b19a3-design.md`
- reviewedDesignSha256: `da48346689c049c1e247d81f0f36e68efc0967e37db5688cc2e3a9ae729f5e3e`
- reviewedEvidence: `docs/rules/evidence/2B19A3.md`
- reviewedEvidenceSha256: `98abc0d424c320bec938dc4fca01a8875a30ac447aa895607aaff8600e065014`
- reviewedGovernance: `docs/architecture/2B19A3-go-no-go-under-governance-v1.md`
- reviewedGovernanceSha256: `2950b08811e97eddb9b6457ce1a453297df3bd55787c7df0007618e3e80a0402`
- reviewedRepositoryHead: `138748d8211b961616f414d6bf17911fd93f4265`
- reviewedBranch: `phase-3/dreamer-v2-base-vortox-information`
- reviewTimestamp: `2026-07-17T10:51:37+08:00`
- implementationState: no production or test files changed; only governance, evidence, design, and control documents are present.

## Sources independently checked

I independently retrieved the pinned source bytes rather than trusting the rule-researcher summary.

| Source | Revision | Independently verified SHA-256 / result |
|---|---:|---|
| `docs/rules/USER_OVERRIDES.md` | current accepted bytes | `2052994a6bf17be4715ac50a8e67be43fa7bfc457df5f694589bcd2f59430624`; no applicable Dreamer/Vortox override |
| Chinese Wiki 首页 | `oldid=5855` | `2a26fff7526bd1b6b20cd0f4044288dd7b348d39a1f933fd65a67c3f242ddb49` |
| Chinese 筑梦师 | `oldid=3046` | `53ca18c52267b871c0041d1b4101f486f83bace0005aa7261493b3aa4cacfdf7` |
| Chinese 涡流 | `oldid=6198` | `36716eb890bd93b2fed5d27f67ccdc6c7a13fa67900a4a11a685580c0c3608ff` |
| Official Dreamer | `oldid=2904` | `8841959a3c7b8bb7a6429b229c4fa1ffe70a3df282bfaa5549959afbffca4a7c` |
| Official Vortox | `oldid=3017` | `4630f76e5bf06ee9e9990854708fabed2a25b9d3c6ea170e2fd4598ef5f5cf07` |
| Official States | `oldid=1039` | `9d99771412548f80e1d1d49c280fc6f92b92e4abe4b965ad6635d9b4cc31d440` |
| Official Abilities | `oldid=1376` | `7cc7632e73e8ebf3f07d747bd15b3c5ff6db7db20e45c3889e16bc601a479b40` |
| Official Mathematician | `oldid=3109` | `a4a636789b745fd6f7452f11647a561bc51f1f46ed6ee5623f6b8d1652f33e8b` |
| Official nightsheet | commit `915347e627c3f6cd1f438f82b6001784e11b3e8b` | `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75` |

The nightsheet independently confirms:

- first night: 80 entries; Clockmaker 60, Dreamer 61, Seamstress 62; no Vortox wake;
- other night: 99 entries; Vortox 47, Dreamer 79.

The external rules support the central semantics:

- Dreamer reports exactly one GOOD and one EVIL character, normally with one correct.
- An effective living Vortox forces Townsfolk ability information to be false, including information presented to a drunk or poisoned Townsfolk.
- For Dreamer, false means neither reported character is the target’s true character.
- A drunk or poisoned Vortox has no functioning Vortox ability.
- Mathematician detects player abilities that worked abnormally due to another character’s ability; official examples explicitly include Vortox-caused false Townsfolk information.
- No substantive external-source conflict was found.

## Repository material inspected

The review included:

- `AGENTS.md`;
- the ordered project handoff chain and relevant rule/test/architecture material;
- `docs/agent-loop/AUTOPILOT_PROMPT.md`;
- `docs/agent-loop/REVIEW_PROTOCOL.md`;
- `docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md`;
- the 2B19A3 governance, evidence, design, control state, and role-coverage matrix;
- accepted 2B19T, 2B19A1, and 2B19A2 design/status/review authorities;
- `packages/domain-core/src/dreamer.ts`;
- `packages/domain-core/src/domain-batch-semantics.ts`;
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`;
- `packages/domain-core/src/philosopher-ability.ts`;
- `packages/domain-core/src/snake-charmer.ts`;
- `packages/domain-core/src/event-applier.ts`;
- `packages/domain-core/src/events.ts`;
- `packages/domain-core/src/game-state.ts`;
- `packages/domain-core/src/rebuild.ts`;
- `packages/application/src/game-application-service.ts`;
- `packages/projections/src/index.ts`;
- the seven proposed primary test files and current Dreamer/ledger/application/projection tests.

All `C01-C39` and `S01-S08` identifiers occur exactly once in the design.

## Findings

### 1. BLOCKER — P1 — Fresh Mathematician rule evidence is missing

- file/symbol: `docs/rules/evidence/2B19A3.md` — `sourceUrls`, `sourceRevisionOrOldid`, `sourceHashes`, `interactions`, and Mathematician claims.
- failure scenario: The Slice makes a new rule-facing claim that V3 `ABNORMAL / VORTOX_FALSE_INFORMATION` facts, including source-impaired cases, are counted once by Mathematician. Mathematician is listed as an involved role, but its fresh official source is absent from the evidence. Passing repository tests or relying on older 2B18 evidence cannot satisfy the per-Slice fresh-source gate.
- required correction:
  - add the freshly retrieved official Mathematician `oldid=3109`, timestamp, URL, and SHA-256 `a4a636789b745fd6f7452f11647a561bc51f1f46ed6ee5623f6b8d1652f33e8b`;
  - freshly cross-check the applicable Chinese Mathematician/localization source or explicitly identify the relevant Chinese interaction authority;
  - distinguish the official abnormal-ability rule from accepted simulator window, own-instance, and duplicate-holder policies;
  - re-run the read-only rule-researcher, rematerialize and rehash evidence, and update the next design’s evidence hash.
- required regression tests:
  - retain C29, C32, C33, and C38;
  - trace C32/C38 directly to the refreshed Mathematician rule claim;
  - keep source/window/own-ability and duplicate-holder behavior traced separately to their approved product contracts.

### 2. BLOCKER — P1 — Several R1 and `ACCEPTED_STREAM_INTEGRATION` claims are unreachable

- file/symbol: design `governanceClassification`, `supportMatrix`, and tests C16, C17, C20, C22, C25, and C33.
- failure scenario:
  - The accepted Philosopher producer can make an in-play GOOD character holder DRUNK, so it can reach base Dreamer DRUNK, but Philosopher cannot choose Vortox.
  - The accepted Snake Charmer producer poisons the old Demon only after that player becomes Snake Charmer. It cannot leave a current Vortox poisoned and cannot poison a base Dreamer.
  - No accepted producer creates an alignment-only change for C25.
  - No accepted producer creates multiple qualifying Dreamer terminal facts for one base Dreamer source.
  - Therefore tests for DRUNK/POISONED current Vortox, POISONED base Dreamer, ineffective Vortox plus impaired source, alignment-only changes, or duplicate same-Dreamer facts cannot honestly be `ACCEPTED_STREAM_INTEGRATION`. A manually assembled `GameState` is expressly non-R1 under the governance ADR.
- required correction:
  - keep effective Vortox with an effective source and effective Vortox with real Philosopher-produced DRUNK base Dreamer as R4→R1 application paths;
  - classify represented POISONED base Dreamer, represented DRUNK/POISONED current Vortox, ineffective Vortox plus impaired source, alignment-only policy, and impossible duplicate same-source combinations as R4/T3 `PURE_POLICY_SEAM` unless a separately authorized accepted producer exists;
  - revise C16, C17, C20, C22, C25, and C33 accordingly;
  - state explicitly that these seams do not prove accepted command/event reachability;
  - if the user requires those combinations to become actual R1 histories, stop with `RESLICE_REQUIRED`, because adding the missing impairment/alignment producer or generic effect lifecycle is outside this Slice.
- required regression tests:
  - one real accepted Philosopher duplicate-Dreamer → effective Vortox → V3 command stream for source DRUNK;
  - exact closed pure-policy tests for source POISONED and impaired Vortox;
  - no application test may inject a constructed state and label it accepted-stream integration;
  - retain hostile R3 tests for malformed, duplicate, conflicting, stale, and cross-linked impairment evidence.

### 3. BLOCKER — P1 — Public construction and stored-validation contracts are not frozen

- file/symbol:
  - `packages/domain-core/src/dreamer.ts` — `createDreamerInformationDeliveredPayload`;
  - `validateStoredDreamerInformationDelivered`;
  - `sameDreamerInformationDelivery`;
  - design sections `versionedDelivery`, `Canonical Preparation Without Validation/Production Divergence`, `projection`, and `replay`.
- failure scenario:
  - The design freezes the V3 payload and private prepared record but does not freeze how the currently exported delivery constructor accepts a Vortox capability or whether a separate private V3 constructor is used.
  - It requires projection to pass the ledger to the stored validator but does not define the exact field name, type, requiredness, V3-only behavior, or V1/V2 compatibility of the changed public `sourceFacts` parameter.
  - “Deep exact equality” does not freeze a typed comparator and could be implemented with prohibited raw `JSON.stringify`.
  - Implementers could consequently produce incompatible public signatures or divergent construction/prospective-validation behavior while nominally following the document.
- required correction:
  - freeze the exact V3 constructor path and signature, choosing either an explicitly typed extension of the existing exported constructor or a named module-private V3 constructor;
  - freeze the exact stored-validator input extension, including its ledger field name/type, whether it is optional for V1/V2, and the unique V3 fact/evidence lookup rules;
  - freeze typed V1/V2/V3 equality and clone branches and prohibit serialized-text equality;
  - specify exact prepared-value parameters to event creation and prospective validation.
- required regression tests:
  - compile-time and runtime tests for the frozen constructor contract;
  - V1/V2 callers remain unchanged;
  - V3 stored validation rejects missing, duplicate, mismatched, or cross-linked ledger facts;
  - separate V1/V2/V3 clone and equality tests with no shared nested references;
  - prepared/application/prospective results compare through typed structural equality, not serialization.

### 4. BLOCKER — P1 — Failure and receipt contracts lack exact outcomes and primary authority tests

- file/symbol: design `receipts`, `failures`, completion criteria, C10, and S06.
- failure scenario:
  - The user froze `DependencyExecutionFailed`, `failureStage="first-night-role-action"`, retryability, no receipt, no command-ID consumption, zero events, unchanged version, OPEN opportunity, and no ledger/settlement for applicability conflicts and candidate shortage.
  - The review protocol separately requires `MetadataGenerationFailed` classification.
  - The design only says “retryable dependency failure” or “receipt-free” and supplies no complete result table.
  - No primary criterion explicitly exercises V3 prospective-validation failure, metadata failure, append failure, dependency exception, and successful same-command retry. S06 is too generic to prove all claimed boundaries.
- required correction:
  - add an exact failure table covering deterministic rejection, unsupported source condition, applicability/provenance conflict, candidate shortage, prospective validation, metadata generation, append, and dependency exception;
  - preserve `MetadataGenerationFailed` as its existing separate result code;
  - freeze stage, retryable flag, receipt behavior, event count, command-ID behavior, version, opportunity status, settlement, ledger, and actor-safe message behavior for every row;
  - add unique primary authority criteria for the injected failure matrix and same-command recovery.
- required regression tests:
  - real V3 application tests for dependency/applicability and candidate failures;
  - injected prospective, metadata, append, and dependency exceptions;
  - exact assertions for no receipt, no command-ID burn, no append, unchanged version, OPEN opportunity, no fact/settlement;
  - the same command ID succeeds after dependency recovery and produces the deterministic three-event batch.

### 5. BLOCKER — P1 — V3 ledger evidence cardinality and identity are not exact

- file/symbol: design `ledger` and supporting authorities S02/S05.
- failure scenario: The design names the eight allowed evidence kinds but does not freeze the exact cardinality and semantic identity of the repeated `PLAYER_ROLE_AT_REVISION` and `ROLE_TENURE` records. A validator could accept an extra, duplicate, omitted, or cross-purpose role/tenure record while still claiming that every required concept is present.
- required correction:
  - freeze the exact V3 evidence multiset and canonical order;
  - define exactly one source event, task, action opportunity, character-state revision, Dreamer delivery, source Dreamer role/tenure, target role, Vortox role/tenure, and zero-or-one source impairment;
  - forbid all extra or duplicate records;
  - bind the Vortox constraint player, seat, role, tenure, and revision to the exact Vortox role/tenure evidence;
  - bind source impairment to `sourceEffectiveness` and forbid any Vortox impairment evidence;
  - require derivation/replay validation to prove that the canonical state contained no applicable Vortox impairment rather than treating omitted evidence alone as proof.
- required regression tests:
  - per-kind missing, extra, duplicate, reorder, wrong-identity, wrong-revision, wrong-role, wrong-tenure, wrong-player, and cross-linked evidence mutations;
  - effective and source-DRUNK positive facts;
  - source-POISONED pure seam if retained;
  - Vortox-impairment omission cannot forge a valid V3 fact.

### 6. BLOCKER — P2 — Allowlist and LOC gates contain incorrect or unsafe constraints

- file/symbol: design `Affected Files`, authority metadata, and completion criteria 2–4.
- failure scenario:
  - The documentation allowlist names `docs/PROJECT_STATE.md`, but the active control file is `docs/agent-loop/PROJECT_STATE.md`.
  - The design turns an estimate into a mandatory lower bound of 850 added production lines. A correct 700-line implementation would fail, encouraging padding and conflicting with the governance precheck estimate of 650–1000.
- required correction:
  - replace the incorrect path with `docs/agent-loop/PROJECT_STATE.md`;
  - keep 850–1150 only as a non-binding estimate if still justified;
  - make the acceptance gate an upper bound only: no more than 1200 added production LOC and only the five reviewed production files;
  - retain the stop condition for any production file outside the exact allowlist.
- required regression tests:
  - static diff/allowlist scan for exact production and control paths;
  - added-production-LOC ceiling check;
  - no minimum LOC assertion.

## Non-blocking assessments

- The core Dreamer/Vortox rule interpretation is correct and externally supported.
- V1 and V2 are preserved as separate exact historical variants; additive V3 versioning is appropriate.
- The proposed 21-key V3 shape, seven-key Vortox constraint, and two-variant source-effectiveness union are coherent.
- The candidate policy correctly uses native character type, excludes target truth from both sides, allows in-play roles, and uses stable code-unit ordering.
- The private prepared-result pattern is architecturally appropriate for preventing production/prospective divergence once its signatures and comparator are frozen.
- Reusing the existing event name, target V2, settlement, batch, state aggregates, closed evidence vocabulary, projection shape, and Mathematician production is appropriate.
- Source-only historical projection and the explicit non-leakage list are correct.
- Dreamer `PARTIAL`, Vortox `NOT_STARTED`, Mathematician `PARTIAL`, and Slice `PARTIAL / VORTOX_FORCED_FALSE_ONLY` are the correct coverage ceilings.
- No new event type, top-level `GameState` field, generic effect engine, generic evidence kind, workflow, dependency, timeout, or CI change is justified.
- The current five-file production allowlist remains plausible after the blockers above are corrected.

## Rule assessment

The sourced ability semantics, impairment precedence, forced-false Dreamer proposition, night order, historical-fact stability, and Storyteller-discretion boundary pass. The current evidence package does not yet pass the mandatory per-Slice source gate for the Mathematician consumption claim.

## Architecture assessment

The principal V3 design is viable within the existing event-sourced architecture, but implementation is not authorized because reachability/test claims are inaccurate, public interfaces and failure semantics are incomplete, and ledger evidence is not exact enough for a persisted T1 contract.

## remainingBlockers

1. Fresh Mathematician rule-source evidence and evidence/design rehash.
2. Honest R1/R4 classifications and primary test-layer corrections for unreachable impairment/alignment/duplicate combinations.
3. Exact V3 construction, stored-validation, preparation, and typed equality contracts.
4. Exact failure/receipt result table and injected recovery tests.
5. Exact V3 ledger evidence cardinality, identities, and no-Vortox-impairment proof.
6. Correct control-document allowlist and removal of the production-LOC lower bound.

RULE_DESIGN_FIX_REQUIRED
