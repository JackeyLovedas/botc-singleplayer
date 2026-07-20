# Independent Rule Design Review — Phase 3 Slice 2B19B Round 1

## reviewedDesign

- Path: `docs/implementation/phase-3-slice-2b19b-design.md`
- Branch: `phase-3/philosopher-gained-dreamer-effective-source`
- Repository HEAD: `5ddaa2fd02e0cb73e2a5363b222e7f08c353d389`
- PR: none
- Production/test implementation: not started
- Repository mutation performed by reviewer: `false`
- GitHub mutation performed by reviewer: `false`

## reviewedDesignSha256

`dca87df75bebcc9b44d396043ab03d0afcfd1f17417d1355f97c72778ec4d181`

## reviewTimestamp

`2026-07-19T16:23:32.5080403+08:00`

## reviewScope

Independent review covered:

- repository and project governance;
- the complete Round 1 design;
- fresh rule evidence and fixed external revisions;
- official nightsheet order;
- current role coverage;
- accepted V1/V2 insertion and Dreamer V1–V4 behavior;
- gained-source provenance and exact runtime shapes;
- event application, replay, prospective validation and batch semantics;
- ledger derivation and evidence cardinality;
- player/AI projection contracts;
- application receipts, retry and idempotency;
- deterministic ordering and identifiers;
- all 80 design-time criteria;
- ownership and coverage-profile infrastructure;
- current exact-head CI.

The task-mentioned `docs/architecture/ADR-0001-agent-governance-v1.md` does not exist in this checkout. The accepted authority named by current repository governance, handoff files and user material—`docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md`—was read in full. This naming discrepancy does not create a rule-authority gap.

There is no PR diff. The working tree contains only the four modified control documents and three untracked 2B19B governance/evidence/design documents; no production or test file is modified.

## externalSourcesReviewed

All fixed live sources were retrieved independently and matched the recorded SHA-256:

| Authority | Revision | Verified SHA-256 |
|---|---|---|
| Chinese Wiki 首页 | `oldid=5855` | `2a26fff7526bd1b6b20cd0f4044288dd7b348d39a1f933fd65a67c3f242ddb49` |
| Chinese Wiki 哲学家 | `oldid=5125` | `9b1c00ed6cef563836b1a7b1eeae9d531ed19674fce690138dff7e29436601be` |
| Chinese Wiki 筑梦师 | `oldid=3046` | `53ca18c52267b871c0041d1b4101f486f83bace0005aa7261493b3aa4cacfdf7` |
| Chinese Wiki 涡流 | `oldid=6198` | `36716eb890bd93b2fed5d27f67ccdc6c7a13fa67900a4a11a685580c0c3608ff` |
| Chinese Wiki 醉酒 | `oldid=5720` | `be4951627fa6f27b99dcab3a2041983612b4aeb7d3edabdf161d4b2c43b4f76e` |
| Chinese Wiki 中毒 | `oldid=6294` | `1576253552de2a0e1c5c5a86925ff3bd1686c4eab03918d04d0860dbc9d883a0` |
| Official Wiki Philosopher | `oldid=2421` | `a1e732b502b18dd2edf5dc33bc82cd8fac80c20dccf9563f11236ed96991f365` |
| Official Wiki Dreamer | `oldid=2904` | `8841959a3c7b8bb7a6429b229c4fa1ffe70a3df282bfaa5549959afbffca4a7c` |
| Official Wiki Vortox | `oldid=3017` | `4630f76e5bf06ee9e9990854708fabed2a25b9d3c6ea170e2fd4598ef5f5cf07` |
| Official Wiki States | `oldid=1039` | `9d99771412548f80e1d1d49c280fc6f92b92e4abe4b965ad6635d9b4cc31d440` |
| Official Wiki Abilities | `oldid=1376` | `7cc7632e73e8ebf3f07d747bd15b3c5ff6db7db20e45c3889e16bc601a479b40` |
| Official nightsheet | commit `915347e627c3f6cd1f438f82b6001784e11b3e8b` | `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75` |

The independent source conclusions agree with the evidence:

- Philosopher gains the Dreamer ability without becoming Dreamer.
- A gained night ability acts at the role’s normal position.
- Dreamer yields one GOOD and one EVIL character and normally includes the target’s true current character.
- Effective Vortox requires both delivered roles to be false relative to target truth.
- Native Dreamer drunkenness does not impair the distinct Philosopher source.
- Source-DRUNK/POISONED success and impaired/dead-Vortox fallback remain outside this slice.
- Delivered information is a historical fact.
- No source conflict exists.

Official first-night order was independently verified as Philosopher `14/80`, Dreamer `61/80`, Mathematician `77/80`, with no Vortox wake entry. The approved base-before-gained same-position override is compatible with that order.

## productionFilesReviewed

Planned changed production files:

- `packages/domain-core/src/first-night-action-opportunity.ts`
- `packages/domain-core/src/dreamer.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
- `packages/application/src/game-application-service.ts`
- `packages/projections/src/index.ts`

Relevant reuse-only production authorities:

- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/events.ts`
- `packages/domain-core/src/game-state.ts`
- `packages/domain-core/src/initial-private-knowledge.ts`
- `packages/domain-core/src/current-character-state.ts`
- `packages/domain-core/src/philosopher-ability.ts`
- `packages/domain-core/src/first-night-task-plan.ts`
- `packages/domain-core/src/seamstress.ts`
- `packages/domain-core/src/mathematician-internal.ts`

## testFilesReviewed

Relevant current and planned test authorities:

- `packages/domain-core/src/first-night-action-opportunity.test.ts`
- `packages/domain-core/src/dreamer.test.ts`
- `packages/domain-core/src/domain-batch-semantics.test.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`
- `packages/domain-core/src/rebuild.test.ts`
- `packages/application/src/game-application-service.test.ts`
- `packages/projections/src/private-knowledge-view.test.ts`
- `packages/application/src/mathematician-information.test.ts`, compatibility context only

Accepted A3B1 design, review and traceability were also reviewed, particularly their correction of unreachable impairment states from false R1 application claims to R3 hostile or R4 pure-policy authority.

No 2B19B implementation tests exist yet.

## ruleEvidenceReviewed

- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/evidence/2B19B.md`
  - SHA-256: `e1f038f32171d7cea1f89345b1cac958e30a79f47005ca444a0dc2633abe3187`
  - verdict: `RULE_READY`
  - unresolved conflicts: `[]`
  - coverage: `PARTIAL`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `docs/architecture/2B19B-go-no-go-under-governance-v1.md`
- `docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md`
- `docs/agent-loop/REVIEW_PROTOCOL.md`
- complete project handoff chain
- `docs/implementation/phase-3-slice-2b19a3b1-design-round-2.md`
- `docs/implementation/phase-3-slice-2b19a3b1-design-review-round-2.md`
- `docs/implementation/phase-3-slice-2b19a3b1-test-traceability.md`
- `docs/implementation/phase-3-slice-2b19a3b1-final-review-round-1.md`

## CI and ownership verification

- Current main/accepted-base CI run `29674623200` is `SUCCESS`, bound to exact HEAD `5ddaa2fd02e0cb73e2a5363b222e7f08c353d389`.
- CI completed `22/22` jobs.
- Current workflow runs nine ordinary shards, nine coverage shards, merge/inventory gates, validation, ownership verification and Windows deterministic checks.
- `node scripts/verify-vitest-ownership-contracts.mjs --self-test` passed `22/22`.
- Current ownership registry contains accepted A3A and A3B1 only; 2B19B is correctly not preregistered.
- No open PR exists.

## Per-item review matrix

| Review item | Result | Notes |
|---|---|---|
| External rule truth | PASS | Fixed live revisions and hashes agree; no conflict. |
| Official night order | PASS | Philosopher → base Dreamer → gained Dreamer override → Mathematician is preserved. |
| V2 gained task reachability | PASS | Real accepted Philosopher choice/grant/V2 insertion path exists. |
| Source character vs ability role | PASS | Source remains Philosopher; ability role is Dreamer. |
| No fabricated Dreamer tenure | PASS | Design requires one existing Philosopher tenure only. |
| Source contract exactness | PASS | Exact 19/11/8/11-key nested contracts and cross-links are frozen. |
| Opportunity V4 | PASS WITH TRACEABILITY FIX | Runtime contract is viable; C10 combines the wrong primary mechanism. |
| Target V3 | PASS | Exact 17-key contract and self/modeled-target checks are bounded. |
| Delivery V5 | PASS | One native GOOD/EVIL pair with exactly one target truth. |
| Delivery V6 | PASS | Effective Vortox produces one native GOOD/EVIL pair with neither role true. |
| Native Dreamer DRUNK isolation | PASS | Native impairment is not transferred to Philosopher source. |
| Source impairment success exclusion | PASS WITH AUTHORITY FIX | Behavior is excluded, but failure claims are assigned impossible R1 application authority. |
| Vortox unresolved/impaired exclusion | PASS WITH AUTHORITY FIX | Successful output is excluded; current receipt/OPEN claims lack a canonical producer. |
| Deterministic candidate ordering | PASS | Raw UTF-16 ordering and forbidden API list are exact. |
| Candidate-shortage authority | FIX REQUIRED | Fixed canonical 25-role catalog cannot produce shortage through current R1. |
| Atomic three-event batch | PASS | Target, delivery and settlement are one contiguous accepted unit. |
| Prospective validation | PASS | Full accepted-prefix reconstruction before append is explicitly required. |
| Replay integrity | PASS | Version-first dispatch, legacy preservation and hostile batch rejection are specified. |
| Ledger V5/V6 semantics | PASS WITH TRACEABILITY FIX | 11/13 evidence sets are coherent; C45 uses the wrong primary layer. |
| Historical fact stability | FIX REQUIRED | Stored knowledge is stable, but true later canonical role/effect mutation has no current producer. |
| Player/AI privacy | FIX REQUIRED | Frozen visible runtime shape conflicts with the accepted public projection type. |
| Receipts and idempotency | PASS FOR REAL PATHS | Real faults are covered; unreachable source/Vortox/shortage cases must be removed from R1 claims. |
| Legacy V1 behavior | PASS WITH TRACEABILITY FIX | Formal rejection is R1 application; valid V1 replay is separately R2. |
| A3B2 bridge stop boundary | PASS | Bridge stops before Mathematician; no count is frozen. |
| Role coverage honesty | PASS | Dreamer/Philosopher/Mathematician remain PARTIAL; Vortox remains NOT_STARTED. |
| Production stop-loss | PASS | Six planned production files and `1,050–1,400` LOC remain within governance. |
| Ownership materialization | PASS | No preregistration; existing single owner project is reused. |
| Coverage profile design | FIX REQUIRED | Exact future profile cannot be selected by current CI within the frozen allowlist. |
| Implementation gate | PASS | No implementation has begun. |

## 80-item traceability audit

Mechanical structure passes:

- rows: `80`
- unique IDs: `80`
- exact inventory: `C01–C60`, `S01–S20`
- invalid R values: `0`
- invalid T values: `0`
- invalid primary-layer tokens: `0`

Semantic result map:

| Criteria | Result |
|---|---|
| `C01–C09` | PASS |
| `C10` | FIX REQUIRED — combines R1 producer/replay behavior under `STRUCTURAL_VALIDATION` |
| `C11` | PASS |
| `C12` | FIX REQUIRED — real formal V1 rejection is incorrectly R2/legacy |
| `C13–C18` | PASS |
| `C19` | FIX REQUIRED — Traveller is R4 and not represented by a current application producer |
| `C20–C28` | PASS |
| `C29` | FIX REQUIRED — candidate shortage is not reachable from the fixed canonical role catalog |
| `C30–C32` | PASS |
| `C33–C34` | FIX REQUIRED — source impairment states are R4, not application integration |
| `C35` | FIX REQUIRED — unresolved Vortox provenance is hostile R3 or hypothetical R4, not canonical R1 |
| `C36` | FIX REQUIRED — impaired Vortox is R4, not application integration |
| `C37–C44` | PASS |
| `C45` | FIX REQUIRED — accepted-ledger cardinality is accepted-stream authority, not direct structural authority |
| `C46–C49` | PASS |
| `C50` | FIX REQUIRED — true later canonical mutation stability lacks an R1 producer |
| `C51` | FIX REQUIRED — bundles unreachable source/Vortox/shortage states with real R1 fault ports |
| `C52–C60` | PASS |
| `S01–S20` | PASS |

Totals:

- `69` criteria pass as designed.
- `11` criteria require correction.

## findings

### F-01 — BLOCKER — Public Dreamer projection runtime shape conflicts with accepted code and the production allowlist

- Severity: `BLOCKER`
- File/symbol:
  - `docs/implementation/phase-3-slice-2b19b-design.md` — `Private projection`
  - `packages/domain-core/src/initial-private-knowledge.ts` — `PlayerDreamerInformationView`, `PlayerPrivateKnowledgeView`, `hasExactDreamerInformationViewShape`
  - `packages/projections/src/index.ts` — `projectPlayerPrivateKnowledge`
- Failure scenario:
  - The design freezes a six-key visible entry containing `sourcePlayerId`, `knowledgeStage` and `knowledgeModelVersion`.
  - The accepted public runtime contract permits exactly:
    `{ target, goodRole, evilRole }` inside `dreamerInformation`.
  - The model version is the sibling `dreamerKnowledgeModelVersion`; stage membership is represented through `deliveredKnowledgeStages`.
  - Implementing the design literally causes `validatePlayerPrivateKnowledgeViewShape` to reject the view.
  - Widening `PlayerDreamerInformationView` would require changing `initial-private-knowledge.ts`, which is reuse-only and outside the six-file production allowlist. It would also create an unnecessary public shape change and expose `sourcePlayerId`.
- Required correction:
  - Freeze the existing public contract exactly:
    - `dreamerInformation = { target, goodRole, evilRole }`;
    - sibling `dreamerKnowledgeModelVersion = "dreamer-information-model-v1"`;
    - `deliveredKnowledgeStages` contains `DREAMER_INFORMATION`.
  - Explicitly prohibit `sourcePlayerId`, source kind, provenance, reliability and Vortox metadata within the visible Dreamer entry.
  - Keep `initial-private-knowledge.ts` unchanged.
- Required regression tests:
  - exact source-player public shape;
  - source AI deep-equals source player;
  - all non-source player/AI views omit Dreamer information;
  - exact absence of `sourcePlayerId`, grant, Philosopher, Vortox, truth and reliability fields;
  - accepted V5/V6 stream projection passes existing public validation;
  - state-only V5/V6 projection rejects or omits;
  - repeated projection and caller-clone mutation preserve historical output.

### F-02 — BLOCKER — Reachability, primary mechanisms and failure contracts claim authority unavailable from current producers

- Severity: `BLOCKER`
- File/symbol:
  - `docs/implementation/phase-3-slice-2b19b-design.md`
  - sections `R1–R4`, `Capability matrix`, `Receipt and retry contract`, `Failure matrix`, `Planned supporting authority purposes`, and criteria `C10`, `C12`, `C19`, `C29`, `C33–C36`, `C45`, `C50`, `C51`
- Failure scenario:
  - The design says a hand-built `GameState` is never R1 authority, but requires application integration for states no accepted producer can create.
  - Traveller is not represented in the current role model.
  - The canonical setup replay requires exactly 25 roles with `13/4/4/4` categories, so candidate shortage is not a canonical R1 setup.
  - No accepted producer leaves the Philosopher source DRUNK or POISONED while still being the effective current Philosopher gained source.
  - Missing/stale/duplicate Vortox tenure is hostile history; impaired Vortox remains R4.
  - Opening V4 itself requires canonical source provenance and tenure, making the promised later “unresolved source provenance with OPEN opportunity” internally unreachable.
  - True post-delivery character/effect mutation remains without a current producer, matching the accepted A3B1 precedent.
  - An implementer could only satisfy these rows using manually built state or mutated history while falsely recording `MechanismMatch=PASS`.
- Required correction:
  - `C10`: make real producer/accepted replay the R1 accepted-stream authority, or narrow/split it; leave direct closed-shape coverage to `S05`.
  - `C12`: classify the callable V1 formal rejection as `R1 / APPLICATION_COMMAND_INTEGRATION`; retain valid V1 replay under `C54 / R2`.
  - `C19`: retain Traveller only as `R4 / PURE_POLICY_SEAM`, or remove it as a current application criterion.
  - `C29`: classify candidate-shortage non-selection as `R4 / T3 / PURE_POLICY_SEAM`; do not claim receipt semantics.
  - `C33`, `C34`, `C36`: use `R4 / T3 / PURE_POLICY_SEAM`; successful V5/V6 must never be selected.
  - `C35`: classify tampered/missing Vortox provenance as `R3 / HOSTILE_REPLAY_REJECTION`; keep purely hypothetical unresolved capability separately R4.
  - `C45`: make exact 11/13 reference derivation `R1 / T2 / ACCEPTED_STREAM_INTEGRATION`; `S18` remains the direct hostile evidence validator.
  - `C50`: limit R1 to accepted historical replay, repeated projection and caller-clone isolation; mark true later canonical state-change stability R4 until a producer exists.
  - `C51`: restrict it to real dependency, metadata, prospective, append, commit-store and receipt fault ports. Do not aggregate R4/R3 states into the R1 application row.
  - Reconcile the capability and failure matrices so hostile history fails replay/rebuild and R4 pure states merely fail capability selection; do not promise formal receipts or OPEN opportunity state without a real producer.
- Required regression tests:
  - real V1 formal unsupported command with exact receipt-free/no-event result;
  - separate valid V1 replay fixture;
  - pure-policy source-DRUNK, source-POISONED, impaired-Vortox, Traveller and candidate-shortage non-selection tests with no application-authority claim;
  - hostile stored source/Vortox provenance and tenure mutations rejected by replay/rebuild;
  - real reachable dependency/metadata/prospective/accepted-commit/receipt fault tests asserting receipt, version, events and retry;
  - accepted V5/V6 ledger derivation asserting exact 11/13 reference sets;
  - accepted repeated historical projection and clone-isolation test;
  - no test using a hand-built state may be recorded as R1 application or accepted-stream authority.

### F-03 — BLOCKER — Future exact-profile CI selection is impossible under the frozen change allowlist

- Severity: `BLOCKER`
- File/symbol:
  - `.github/workflows/ci.yml` — coverage merge `--profile`
  - `docs/implementation/phase-3-slice-2b19b-design.md` — `Coverage-profile contract`, infrastructure/test/documentation allowlists
  - `scripts/verify-coverage-obligations.mjs`
- Failure scenario:
  - Current CI explicitly invokes:
    `--profile phase-3-slice-2b19a3b1-c384c60-repair2-ownership-v2-1`.
  - The design requires a new exact 2B19B profile but does not authorize `.github/workflows/ci.yml` in the profile-only change allowlist.
  - Leaving the workflow unchanged means frozen 2B19B CI still verifies A3B1’s profile.
  - Reinterpreting the explicitly requested A3B1 identity inside the verifier would violate exact identity, prior-profile immutability and fail-closed selection.
- Required correction:
  - Authorize only the exact profile-selection change in `.github/workflows/ci.yml` within a separate profile-only child commit.
  - Freeze that commit’s parent as the full product implementation HEAD.
  - Continue forbidding topology, shard, timeout, dependency and `onTaskUpdate` changes.
  - Freeze the exact profile ID, source HEAD and three candidate manifest identities before final exact-head CI.
- Required regression tests:
  - profile-only diff allowlist proving no product/test/fixture/topology changes;
  - exact workflow assertion that the coverage job requests the 2B19B profile;
  - verifier rejection for old, absent, duplicate, ambiguous or wrong-source profiles;
  - exact parent/source-head relationship validation;
  - three independent nine-process candidate manifests with identical five-tuples and ownership identities;
  - exact frozen-head CI showing the coverage job actually consumed the 2B19B profile.

## verdict

`RULE_DESIGN_FIX_REQUIRED`

The blockers are correctable within Design Round 2. They do not presently require a new event family, public boundary, generic subsystem, expanded product slice, rule override or source interpretation. Therefore neither `RESLICE_REQUIRED` nor `HUMAN_BLOCKED` applies.

## remainingBlockers

1. `PUBLIC_DREAMER_PROJECTION_RUNTIME_SHAPE_AND_ALLOWLIST_CONFLICT`
2. `REACHABILITY_PRIMARY_LAYER_AND_FAILURE_AUTHORITY_MISMATCH`
3. `EXACT_2B19B_COVERAGE_PROFILE_CI_SELECTION_NOT_AUTHORIZED`

RULE_DESIGN_FIX_REQUIRED
