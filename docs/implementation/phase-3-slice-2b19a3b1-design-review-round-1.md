# Independent Rule Design Review — Phase 3 Slice 2B19A3B1 Round 1

## Review identity

- reviewer: `/root/2b19a3b1_design_review_round1`
- reviewTimestamp: `2026-07-18T22:18:56.1873597+08:00`
- reviewMode: independent, read-only
- reviewedBranch: `phase-3/dreamer-vortox-canonical-drunk-core`
- reviewedHead: `45a467cec81703d911914de464180e5192fc7714`
- openPRs: `0`
- productionOrTestChangesFor2B19A3B1: `none`
- implementationAuthorized: `false`

## Reviewed authorities

- Design: `docs/implementation/phase-3-slice-2b19a3b1-design.md`
- Design SHA-256: `bbcb781fe00cd8cfd259ad4e24dc3da2520e88f8676d3d0c922b82412e0c4266`
- Governance: `docs/architecture/2B19A3B1-go-no-go-under-governance-v1.md`
- Governance SHA-256: `e566256966764d3fb53141ad0f2529b6ebe9005928b60454f497216a65911b1b`
- Evidence: `docs/rules/evidence/2B19A3B1.md`
- Evidence SHA-256: `ae48ce51ddbcd6ba3bae2dc49ab6441769e77c55f994aa8c2e043e98e58a2653`
- Parent Round 2 design: `docs/implementation/phase-3-slice-2b19a3b-design-round-2.md`
- Parent design SHA-256: `0cba266e40ea4ce792e1d45fcec656b8389392ed9f6feaef511aefaa19021a0c`
- Parent Round 2 review and terminal reslice status were independently read.
- `AGENTS.md`, `AUTOPILOT_PROMPT.md`, `REVIEW_PROTOCOL.md`, accepted Governance Traceability V1.1 ADR, ownership registry/schema, current control state, role matrix, and reslice authorization were independently read.

## Independent external rule verification

All required live sources returned HTTP 200 and their independently calculated UTF-8 SHA-256 values matched the evidence:

| Source | Revision | SHA-256 |
|---|---:|---|
| Official Dreamer | `2904` | `8841959a3c7b8bb7a6429b229c4fa1ffe70a3df282bfaa5549959afbffca4a7c` |
| Official Philosopher | `2421` | `a1e732b502b18dd2edf5dc33bc82cd8fac80c20dccf9563f11236ed96991f365` |
| Official Vortox | `3017` | `4630f76e5bf06ee9e9990854708fabed2a25b9d3c6ea170e2fd4598ef5f5cf07` |
| Official Mathematician | `3109` | `a4a636789b745fd6f7452f11647a561bc51f1f46ed6ee5623f6b8d1652f33e8b` |
| Official States | `1039` | `9d99771412548f80e1d1d49c280fc6f92b92e4abe4b965ad6635d9b4cc31d440` |
| Official Abilities | `1376` | `7cc7632e73e8ebf3f07d747bd15b3c5ff6db7db20e45c3889e16bc601a479b40` |
| 中文筑梦师 | `3046` | `53ca18c52267b871c0041d1b4101f486f83bace0005aa7261493b3aa4cacfdf7` |
| 中文哲学家 | `5125` | `9b1c00ed6cef563836b1a7b1eeae9d531ed19674fce690138dff7e29436601be` |
| 中文涡流 | `6198` | `36716eb890bd93b2fed5d27f67ccdc6c7a13fa67900a4a11a685580c0c3608ff` |
| 中文醉酒 | `5720` | `be4951627fa6f27b99dcab3a2041983612b4aeb7d3edabdf161d4b2c43b4f76e` |
| 中文中毒 | `6294` | `1576253552de2a0e1c5c5a86925ff3bd1686c4eab03918d04d0860dbc9d883a0` |
| 中文数学家 | `6214` | `171fe4a63517059c4a918cdb1d8f172cc2f5bcbd67910ed568b721548c8feb6e` |
| Official nightsheet | repo `915347e627c3f6cd1f438f82b6001784e11b3e8b` | `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75` |

The nightsheet independently confirms Philosopher `14/80`, Dreamer `61/80`, Mathematician `77/80`, with no first-night Vortox wake entry.

The sources support the proposed mechanical core:

- a real Philosopher choosing in-play Dreamer makes the original Dreamer drunk;
- effective Vortox forces Townsfolk information to be false even when the source is drunk or poisoned;
- Dreamer still receives one native GOOD-category and one native EVIL-category role;
- under Vortox both must exclude the target’s settlement-time true role;
- Mathematician counts affected players, not evidence edges or cause fields;
- the base Dreamer contribution does not prove the future combined total.

`BOTC-SIM-DREAMER-VORTOX-DRUNK-LEDGER-ATTRIBUTION-V1` remains unchanged and valid for the narrow one-fact simulator attribution. No substantive rule-source conflict was found.

## Repository and archive verification

- The unaccepted experiment archive commit is `ef51b62777751ecf0480f14fb98b378197f6ef21`.
- It changes exactly the authorized five production and three test files.
- It is not an ancestor of current HEAD.
- Its archive branch is local-only and has no remote branch.
- External patch SHA-256 is `b271c2db780c0940e001bd0dec596ff21fd70950a0af6cee6ec861b9aa5a8a6c`.
- Main contains only the A3B docs/control archive commit, not experiment production or test changes.
- Main/archive HEAD `45a467cec81703d911914de464180e5192fc7714` has exact CI run `29646098230`, `SUCCESS`, including validation, ownership verification, ordinary shards/merge, coverage shards/merge, and Windows deterministic execution.

## Production seams reviewed

- `packages/domain-core/src/dreamer.ts`
- `packages/domain-core/src/philosopher-ability.ts`
- `packages/domain-core/src/first-night-action-opportunity.ts`
- `packages/domain-core/src/first-night-task-plan.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/rebuild.ts`
- `packages/domain-core/src/seamstress.ts`
- `packages/application/src/game-application-service.ts`
- `packages/projections/src/index.ts`

Relevant Dreamer, Philosopher, batch, rebuild, ledger, application-service, and projection tests were also inspected.

The existing seams can support V4 without a new event type, canonical state field, evidence variant, persistence migration, or generic effect engine. The five-file production allowlist and 650–950 line estimate are credible.

## User-mandated fifteen-point audit

| Item | Result |
|---|---|
| Original A3B correctly archived | PASS |
| Experiment did not enter main | PASS |
| Base contribution separated from formal total | PASS |
| Current Slice does not depend on gained-Dreamer execution | PASS |
| No `formal Mathematician trueCount=1` claim | PASS |
| V4 rule behavior unchanged | PASS |
| Approved override unchanged | PASS |
| Exact DRUNK evidence retained | PASS |
| One terminal fact invariant retained | PASS |
| No second `SOURCE_DRUNKENNESS` fact | PASS |
| Pre-event proof prose is non-circular | PARTIAL — positive traceability mechanism is missing |
| Ownership contract is implementable | FAIL until traceability classifications are corrected |
| Production scope satisfies numeric stop-loss | PASS |
| A3B2 dependency on gained Dreamer is explicit | PASS |
| `remainingBlockers=[]` | FAIL |

## Findings

### BLOCKER 1 — `TRACEABILITY_AXES_ARE_NOT_SINGLETON_ENUMS`

- severity: `BLOCKER`
- file/symbol: `docs/implementation/phase-3-slice-2b19a3b1-design.md`, both design-time traceability tables
- affected reachability/trust: all listed rows
- governance basis: Governance Traceability V1.1 requires exactly one primary reachability class and one trust class per behavior/entry-point row.

The tables have all nine columns and 60 unique IDs, with `C24` correctly absent. However:

- 15 rows do not use one exact `R1|R2|R3|R4` value: `C06`, `C15`, `C16`, `C17`, `C30`, `C33`, `C34`, `C35`, `C36`, `C37`, `C41`, `S10`, `S11`, `S19`, `S20`.
- 26 rows do not use one exact `T1|T2|T3` value: `C01`, `C03`–`C05`, `C07`, `C09`, `C10`, `C12`–`C19`, `C25`–`C27`, `C32`–`C34`, `C37`, `C39`, `C41`, `S13`, `S15`.

Values such as `T1→T2`, `T1–T3`, `R2 valid / R3 mixed`, and `R1/R2/R3` do not freeze a primary classification. They make implementation-time `ActualReachability`, `ActualTrust`, primary test identity, and `MechanismMatch` ambiguous.

Required correction:

- Give every row one exact primary R and T value.
- Move other paths into explicitly non-primary supporting authority or split the behavior into separate criteria without adding a `C24`.
- Use the stricter T1 classification for formal/persisted/public boundaries; reserve T2 for already-admitted derived-state assertions and T3 for private pure cores.

Required regression/verification:

- Mechanically parse all C/S rows and require exact enum membership for R, T, and primary layer.
- Verify every implementation criterion can bind one physical primary test identity and one unambiguous actual R/T/layer.

### BLOCKER 2 — `UNREACHABLE_OR_HOSTILE_IMPAIRMENT_STATES_ARE_FALSELY_CLASSIFIED_R1`

- severity: `BLOCKER`
- file/symbol: traceability rows `C15`, `C16`, `C17`, `C34`, and the dead-Vortox portion of `C41`
- failure scenario: implementation would have to hand-construct derived state or invent an accepted producer while claiming formal R1 application authority.

At the reviewed revision there is no accepted producer for:

- duplicate canonical Dreamer DRUNK;
- Dreamer DRUNK plus POISONED;
- POISONED-only base Dreamer;
- impaired current Vortox;
- dead Vortox state.

The repository has no canonical life/death state capable of proving the `dead Vortox` branch. These were correctly treated by the parent Round 2 design as hostile R3 or future R4 paths. The new design changes them to R1 application-command criteria using “validated fixtures,” which Governance V1.1 explicitly forbids as R1 authority.

Required correction:

- Restore `C15` and `C16` to `R3 / T1 / HOSTILE_REPLAY_REJECTION` using an accepted support stream followed by persisted/imported hostile mutation.
- Restore poisoned Dreamer success and impaired Vortox success to `R4 / T3 / PURE_POLICY_SEAM`, or remove them as current acceptance prerequisites.
- Limit `C41` to representable hostile Vortox identity/seat/role/tenure/revision/catalog provenance. Move dead-Vortox behavior to explicit R4/out-of-scope until a canonical life-state producer exists.
- Do not claim a formal application rejection unless a real accepted prefix can produce the exact precondition.

Required regression tests:

- Hostile replay rejection for duplicate/conflicting persisted impairment provenance.
- Pure capability tests proving POISONED/impaired-Vortox hypothetical states never select V4.
- No test may describe a hand-built state as accepted R1 authority.

### BLOCKER 3 — `POSITIVE_NONCIRCULAR_PRE_EVENT_PROOF_LOST_FROM_CRITERION_AUTHORITY`

- severity: `BLOCKER`
- file/symbol: `C10`, Pre-event Proof section, C28
- failure scenario: implementation could pass only a mutated-history replay rejection while never proving that the successful producer’s prospective batch reconstructs the exact V4 from batch-start/pre-delivery state before append.

The prose specifies correct non-circular validation, but `C10` was changed from the inherited positive R1 prospective/pre-event proof into an R3 hostile mutation criterion. C28 tests prospective failure stages, not successful pre-event reconstruction. Thus the frozen traceability no longer requires positive authority for the central non-circular proof.

Required correction:

- Restore an `R1` criterion whose primary mechanism proves successful full-batch prospective validation and pre-delivery fieldwise expected-V4 reconstruction before append.
- Keep hostile payload self-proof rejection separately under an R3 replay criterion such as the existing hostile umbrella.
- Do not let stored V4 data serve as the capability proof.

Required regression tests:

- Real successful formal command whose prospective validator derives exact V4 from accepted pre-event state.
- Mutation of one V4 semantic field in persisted history independently rejects under R3 replay.

### BLOCKER 4 — `COVERAGE_PROFILE_ACCEPTANCE_CONTRACT_IS_INCOMPLETE`

- severity: `BLOCKER`
- file/symbol: `C37`, Coverage Contract, Acceptance Checks
- failure scenario: implementation could create a single unverified profile or bind it to the wrong SHA while still satisfying the current design wording.

The user requires three complete nine-shard coverage candidate runs, stable obligation sets, preservation of prior profiles, an A3B1 exact profile bound to the product commit SHA, and a separate profile-only commit that changes no production, tests, or fixtures. The parent Round 2 `C37` froze this evidence. New `C37` instead covers unsupported-path honesty through an application command and does not freeze the required profile workflow.

Required correction:

- Add a complete Coverage Profile contract freezing all three candidate runs, stable obligation identity, exact `sourceHead`, prior-profile preservation, separate profile-only commit, and exact-profile CI verification.
- Assign an unambiguous R/T/primary layer consistent with the repository’s accepted coverage governance.

Required regression/verification:

- Three candidate manifests/hashes showing identical obligation sets.
- Profile verifier passes against the exact product SHA.
- Profile commit diff proves no production, test, or fixture changes.

### BLOCKER 5 — `RECOVERY_METHOD_CONTRADICTS_EXPLICIT_USER_AUTHORIZATION`

- severity: `BLOCKER`
- file/symbol: Authorities and Precedence; Governance Stop Condition 10; design Stop Conditions
- failure scenario: the implementer cannot recover the preserved eight-file experiment using either exact user-authorized method without violating the design’s wholesale-restore/cherry-pick prohibition.

The user explicitly permits exactly one of:

- `git cherry-pick --no-commit <WIP_SHA>`; or
- `git apply --3way <external patch>`,

followed by a complete diff audit, removal/rewrite of the old formal-Mathematician test, marker updates, and exclusion of gained-Dreamer product work. The design instead permits only selective hunks and declares wholesale restore/cherry-pick a stop condition.

Required correction:

- Select or permit exactly one of the two user-authorized no-commit recovery methods.
- State that applying the exact preserved eight-file experiment is allowed as unaccepted input, followed by mandatory audit and deletion/rewrite of C24/formal-total material.
- Preserve the rule that the archive is evidence, not design authority, and reject conflicts outside the eight authorized files.

Required verification:

- Post-recovery diff contains only authorized production/test paths before bounded additions.
- No formal Mathematician fixture/total assertion remains.
- No gained-Dreamer production implementation is introduced.
- All test markers and traceability identifiers use `2B19A3B1`.

## Passing design conclusions

The following need no semantic redesign:

- exact V4 22-key shape and nested contracts;
- canonical Philosopher-produced DRUNK;
- effective Vortox forced-false semantics;
- deterministic native GOOD/native EVIL truth-excluding candidate policy;
- three-event atomic settlement;
- one `ABNORMAL / VORTOX_FALSE_INFORMATION / true` terminal fact;
- exactly one canonical DRUNK `ABILITY_IMPAIRMENT` evidence reference;
- no second fact or `SOURCE_DRUNKENNESS` cause;
- private source-player/source-AI projection and non-source omission;
- no formal Mathematician total claim;
- gained Dreamer and combined Mathematician integration deferred;
- no new override, event, state field, evidence variant, or generic engine;
- five-file production allowlist and numeric stop-loss.

## Remaining blockers

```text
TRACEABILITY_AXES_ARE_NOT_SINGLETON_ENUMS
UNREACHABLE_OR_HOSTILE_IMPAIRMENT_STATES_ARE_FALSELY_CLASSIFIED_R1
POSITIVE_NONCIRCULAR_PRE_EVENT_PROOF_LOST_FROM_CRITERION_AUTHORITY
COVERAGE_PROFILE_ACCEPTANCE_CONTRACT_IS_INCOMPLETE
RECOVERY_METHOD_CONTRADICTS_EXPLICIT_USER_AUTHORIZATION
```

The external rule truth is available and internally consistent, so this is not a source-unavailable or human-interpretation block. The corrections are bounded to the remaining authorized design round and must be independently reviewed before any experiment recovery or production/test edit.

RULE_DESIGN_FIX_REQUIRED
