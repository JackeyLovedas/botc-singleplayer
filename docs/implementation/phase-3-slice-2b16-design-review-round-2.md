# Phase 3 Slice 2B16 — Independent Rule Design Rereview

## Review metadata

- `reviewedHead`: `4a6fbfb349f562d9292b6343f0bb4dd125e0a1e1`
- `origin/main`: `4a6fbfb349f562d9292b6343f0bb4dd125e0a1e1`
- `reviewTimestamp`: `2026-07-10T15:45:58Z`
- `worktreeClean`: `true`
- Branch: `main`
- Review type: independent, read-only, correction-round rule-design rereview.
- No files, branches, commits, PRs, or external systems were modified.
- No subagents or prior chat records were used.
- Exact-commit CI: run `29104166882`, `success`, HEAD `4a6fbfb349f562d9292b6343f0bb4dd125e0a1e1`.
- CI executed typecheck, lint, tests, coverage, and deterministic focused gates.

## Reviewed artifact hashes

| Artifact | SHA-256 | Result |
|---|---|---|
| `docs/rules/evidence/2B16.md` | `1ee54550a4e886e27e6f665c2275f21d4d04b5d67c68eab3f1bdd598cc0594ca` | Exact match |
| `docs/implementation/phase-3-slice-2b16-design.md` | `4f474b7ad914881a1b795432fe2d298678c1b799e1fe826b52a3fd81c030e33b` | Exact match |
| `docs/implementation/phase-3-slice-2b16-design-review-round-1.md` | `4b48eaa3d49b54b0683a8c38ce5a5e27348b4947c1f349b49e77abbe84c37825` | Exact match |

## Independent external-source verification

The pinned MediaWiki revisions remained accessible and returned the recorded revision IDs, timestamps, SHA-1 values, and UTF-8 SHA-256 hashes.

| Source | Revision | MediaWiki SHA-1 | UTF-8 SHA-256 |
|---|---:|---|---|
| [Chinese Cerenovus](https://clocktower-wiki.gstonegames.com/index.php?title=洗脑师&oldid=4198) | 4198 | `366ffff16b101f72877a40e9cdf8b0c056241500` | `2d4bd29cb1dd876a413f885d7c4f0df5f1f53f172608355c0584f50eb7f58eba` |
| [Chinese Madness](https://clocktower-wiki.gstonegames.com/index.php?title=疯狂&oldid=5883) | 5883 | `0f41f02a9506a24db6ff7c7b942a0944bb600fbb` | `f1cd491b1c5c6473f73045196f1742737aa8cee3f4b7e2a714544298bc8c5ffd` |
| [Chinese Goblin](https://clocktower-wiki.gstonegames.com/index.php?title=哥布林&oldid=6148) | 6148 | `0de04eb7b8dcb67961a0e8808b50a8e87d2e7d1b` | `907db9a346e0099eebcd217ff96b5723f438e5b67d51a7902f9f9763bcfb6659` |
| [Official Cerenovus](https://wiki.bloodontheclocktower.com/index.php?title=Cerenovus&oldid=3048) | 3048 | `b3e3c515168fbab8e7c8a04eb949090fe4edb83d` | `fd60de683c2aade3618f4784123184bfb7b9d50c3c5e6ed804261edbd187fa5c` |
| [Official States/Madness](https://wiki.bloodontheclocktower.com/index.php?title=States&oldid=1039) | 1039 | `766aebdbebec64ffffc979e4c7170ea58ad4a6b8` | `9d99771412548f80e1d1d49c280fc6f92b92e4abe4b965ad6635d9b4cc31d440` |
| [Official Glossary](https://wiki.bloodontheclocktower.com/index.php?title=Glossary&oldid=2874) | 2874 | `a55d4738a77d6ef6382fda26341a94408d86012d` | `75a4ce2fae80808172b90401f87041a2ab8a5101a8330b115739ddd9fc414fee` |
| [Official Abilities](https://wiki.bloodontheclocktower.com/index.php?title=Abilities&oldid=1376) | 1376 | `0317b459c78ee1eef0a3fbec17fd9d6d1f9f9a95` | `7cc7632e73e8ebf3f07d747bd15b3c5ff6db7db20e45c3889e16bc601a479b40` |
| [Storyteller Advice](https://wiki.bloodontheclocktower.com/index.php?title=Storyteller_Advice&oldid=2552) | 2552 | `69252559a401fdd85b0d7e35a993a0a00cd635d4` | `9ddb0953b1d6a993d390096a7a163ae572ea82e11bd81426947cbc13afba5d12` |
| [Character Types](https://wiki.bloodontheclocktower.com/index.php?title=Character_Types&oldid=1495) | 1495 | `96259315656dfc575c7ebb55c0fe9eb53655a7ff` | `0558da745c592375f1a9286eccec61eb7cf535b986f982e7a2276955fb15ed20` |
| [Official Goblin](https://wiki.bloodontheclocktower.com/index.php?title=Goblin&oldid=2976) | 2976 | `5d2c1bd299b60685cd8c1fa90be47679698c9c44` | `92c7765112002f7ec46296ef36e2e5bb6d65acb12dc14b4f65046eb15dd20cd5` |
| [Official Vigormortis](https://wiki.bloodontheclocktower.com/index.php?title=Vigormortis&oldid=3015) | 3015 | `12d6701fee4cfba93b9855fd8526e71363e8b79f` | `9f0eef75059ccf4b9dea02aac7daa4b102920e0860cfdb1d055c569141597a6f` |

The independent content reread supports:

- any-player targeting, including self and dead players;
- ordinary selected-character restriction to on-sheet Townsfolk or Outsiders;
- private target notification using the selected-by token, Cerenovus token, and chosen-character token;
- the next-day-and-following-night window;
- optional Storyteller execution;
- impaired-source simulation without real ability effect;
- private notification remaining visually normal while impairment and effectiveness stay hidden;
- the Goblin jinx as a separate exception;
- source-ability dependency and no retroactive activation after an ineffective use.

No substantive source conflict was found.

### Official nightsheet

The live [official raw nightsheet](https://raw.githubusercontent.com/ThePandemoniumInstitute/botc-release/main/resources/data/nightsheet.json) independently produced:

- Main HEAD: `915347e627c3f6cd1f438f82b6001784e11b3e8b`
- File commit: `3d6d930a9e600321f93b2567a2e88948a675bc1e`
- Blob: `e5242b7e31299cb6d685f921aeaffc5e403be08f`
- Byte SHA-256: `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`
- First night: index 42 of 80, `witch -> cerenovus -> fearmonger`
- Other night: index 27 of 99, `witch -> cerenovus -> pithag`

The gating raw identifier is now correctly `pithag`; “Pit-Hag” is confined to display labeling. Supplemental two-position contexts in the evidence use repository-style normalized role names for Evil Twin and Devil’s Advocate, but the exact raw triples used by the design and tests are correct.

## Repository files reviewed

### Rule and governance material

- `AGENTS.md`
- `docs/agent-loop/CURRENT_TASK.md`
- `docs/agent-loop/AUTOPILOT_PROMPT.md`
- `docs/agent-loop/REVIEW_PROTOCOL.md`
- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/evidence/2B16.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `docs/implementation/phase-3-slice-2b16-design.md`
- `docs/implementation/phase-3-slice-2b16-design-review-round-1.md`
- `project-handoff/00-README-FIRST.md` and its ordered handoff files
- `project-handoff/rules/14-madness-system.md`
- `project-handoff/rules/18-sects-and-violets-roles.md`
- Relevant Cerenovus and interaction cases in `project-handoff/tests/25-rule-test-cases.md`

### Architecture

- `docs/architecture/07-state-and-projections.md`
- `docs/architecture/08-night-task-model.md`
- `docs/architecture/09-effect-lifecycle.md`
- `docs/architecture/10-information-model.md`
- `docs/architecture/11-storyteller-decision-model.md`
- `docs/architecture/14-testing-strategy.md`
- `docs/architecture/20-rule-execution-model.md`
- `docs/architecture/21-phase-state-machine.md`

### Production contracts

- `packages/domain-core/src/command.ts`
- `packages/domain-core/src/first-night-task-plan.ts`
- `packages/domain-core/src/first-night-action-opportunity.ts`
- `packages/domain-core/src/philosopher-ability.ts`
- `packages/domain-core/src/seamstress.ts`
- `packages/domain-core/src/snake-charmer.ts`
- `packages/domain-core/src/witch.ts`
- `packages/domain-core/src/dreamer.ts`
- `packages/domain-core/src/initial-private-knowledge.ts`
- `packages/domain-core/src/events.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/domain-core/src/game-state.ts`
- `packages/application/src/game-application-service.ts`
- `packages/application/src/command-result.ts`
- `packages/application/src/ports/command-commit-store.ts`
- `packages/projections/src/index.ts`
- `packages/rules-snv/src/index.ts`
- `packages/task-engine/src/index.ts`

Relevant application, replay, batch, projection, role-action, deterministic-ID, and architecture-boundary test contracts were also inspected.

## Prior-blocker resolution

| Prior blocker | Resolution |
|---|---|
| Command/task/actor contracts | Resolved. The command is `CommandEnvelope<SubmitCerenovusActionCommandPayload>` with `payload.commandType`; task validation uses the real `source.kind`, player, seat, and role snapshot. Human/AI source actors alone are allowed; Storyteller/System are explicitly rejected. |
| Event provenance, impairment union, settlement field, failures | Resolved. All three payloads carry baseline, task, source, seat, role, catalog, tenure, ability-instance, and revision provenance. Impairment is a closed union. Settlement uses `outcomeType`. Construction, dependency, metadata, prospective, and accepted-commit failures are retryable without partial state or burned command IDs. |
| Stable source ability identity | Resolved. Effective creation history binds to immutable role-tenure and ability-instance IDs, settlement revision, permanent-loss termination, and non-resumption after reacquisition, without adding lifecycle execution. |
| Complete projection chain | Resolved. Projection requires exactly one closed opportunity, choice, resolution, notification, and settlement, with bidirectional uniqueness and reverse settlement completeness. |
| Incorrect dusk duration | Resolved. No “until dusk” claim remains. The design consistently uses day 1, the following night, and dawn entry at day 1/night 2. |
| Invalid projection-stage literals | Resolved. `CERENOVUS_INFORMATION` is placed between actual persisted literals `EVIL_TWIN_SETUP_INFORMATION` and `DREAMER_INFORMATION`, with stage/value/model-version coupling. |
| Incorrect `pit_hag` raw identifier | Resolved. Evidence, design, traceability, test plan, and completion criteria use exact raw `pithag`. |

## Evidence regression traceability

All 23 required evidence traces are present and compatible with the proposed contracts:

| # | Result |
|---:|---|
| 1 | Exact first/other-night raw order covered. |
| 2 | Supported `600/700/800` subset remains distinct from official neighbor metadata. |
| 3 | Exact base opportunity/task/source/tenure/instance/revision validation covered. |
| 4 | Safe decision surface contains only target and chosen character. |
| 5 | Self-targeting accepted. |
| 6 | Modeled-roster targeting is honestly bounded. |
| 7 | On-script Townsfolk/Outsider selection independent of assignment/in-play status. |
| 8 | Ordinary unsupported types and off-script roles rejected. |
| 9 | Goblin jinx remains fail-closed and out of scope. |
| 10 | Effective atomic choice/creation/notification/settlement chain covered. |
| 11 | Impaired closed-union simulation with no real authority covered. |
| 12 | Stale no-notification assertion explicitly replaced. |
| 13 | Exact notification token order covered. |
| 14 | Selected-target-only player/AI projection covered. |
| 15 | Branch, impairment, marker, authority, IDs, and notes remain hidden. |
| 16 | Complete bidirectional stored-chain validation covered. |
| 17 | Exact duration anchors and stable dependency identity covered without lifecycle expansion. |
| 18 | Forbidden death/execution/transition/recurrence/lifecycle events excluded. |
| 19 | Actor-supplied computed outcomes rejected. |
| 20 | Shape, replay, batch, prospective, duplicate, and retry failure layers covered. |
| 21 | Deterministic IDs and stable comparison restrictions covered. |
| 22 | Witch behavior remains separate and preserved. |
| 23 | Evil Twin, Dreamer, Seamstress, and stage coupling preservation covered. |

## Forty-one-item implementation plan review

Every numbered plan item is concrete and testable:

- Items 1–9 cover exact command, actor, task, tenure, instance, continuity, and stale/reacquired-source behavior.
- Items 10–19 cover four-event atomic ordering, complete provenance, neutral settlement, effective dependency history, closed impairment variants, branch-invariant notification, and branch-invariant receipts.
- Items 20–28 cover recipient-only projection, historical storage, complete chain validation, reverse completeness, stage ordering/coupling, and existing projection preservation.
- Items 29–31 cover self/roster targeting, legal on-script characters, and fail-closed unsupported selections.
- Items 32–38 cover replay rejection, all retryable failure stages, successful idempotency, and command-ID conflict handling.
- Items 39–41 cover exact raw nightsheet metadata, supported subset ordering, honest `PARTIAL` coverage, and forbidden lifecycle dimensions.

No plan item silently expands into judgment, execution, death, recurrence, general effect lifecycle, gained Cerenovus abilities, Goblin/Vigormortis handling, UI, or AI policy.

## Findings

1. All seven round-one blockers are fully resolved in the corrected artifact.
2. The design is compatible with current command, task, opportunity, role-tenure, event-envelope, settlement, replay, atomic-batch, receipt, and projection patterns.
3. The effective creation record is future-safe historical provenance, not an active `EffectInstance`; its stable tenure/instance identity prevents accidental revival after reacquisition.
4. Effective, represented-drunk, and represented-poisoned branches retain identical accepted event count/type order and choice-derived target notification. Hidden resolution payload differences cannot appear in accepted receipts or player/AI views.
5. Projection validation is complete in both directions and does not recompute historical delivery from later character or impairment state.
6. Current source limitations are stated honestly. Other-night recurrence, life state, Travellers, Goblin, Vigormortis, madness judgment, enforcement, execution, death, suppression/resumption, and lifecycle processing remain outside the slice.
7. Cerenovus remains `PARTIAL`; no incomplete dimension is promoted to `COMPLETE`.
8. No new implementation-blocking contradiction was introduced by the correction.

## Remaining blockers

`[]`

This authorization applies only to the exact reviewed HEAD and artifact hashes above. Any evidence, design, architecture, production, or test change requires renewed review before implementation proceeds.

RULE_DESIGN_PASS
