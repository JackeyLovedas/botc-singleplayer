# Phase 3 Slice 2C Preemption Fixture Rule Evidence

## Evidence status

```text
sliceId=2C
evidenceId=2C_PREEMPTION_FIXTURE_RULE_EVIDENCE
evidenceKind=FRESH_BOUNDED_RESLICE_CORRECTION_INPUT
designCorrectionRound=1
retrievalDate=2026-08-21 Asia/Shanghai
ruleResearchVerdict=RULE_READY
designVerdict=RULE_DESIGN_FIX_REQUIRED
implementationAuthorized=false
```

This is a new bounded evidence record. It does not rewrite `2C.md`, promote a
role in the coverage matrix, or authorize implementation. The prior
Dreamer/Cerenovus proposal is superseded as a candidate only; its historical
documents remain unchanged.

## Source bindings from this research round

The following immutable source references were rechecked by the rule
researcher on 2026-08-21. MediaWiki hashes are SHA-256 of the selected
revision's UTF-8 main-slot wikitext; the nightsheet hash is SHA-256 of the
retrieved UTF-8 JSON.

| Authority | Revision/date | SHA-256 | URL |
|---|---|---|---|
| User overrides | repository revision `7fc337325f274c669a356a30c7485e2fdf134643`; checked 2026-08-21 | `9e2b8e9701a35559d9cc67d8c2185d979ec222b3186fa3a9cd16140dd2f68ad5` | repository file `docs/rules/USER_OVERRIDES.md` |
| Official Rules Explanation | oldid `1310`; 2023-04-03T01:12:13Z | `dcc318218842d92c908ec9382494f7001929e95e62474bcf62e04cd383d91189` | https://wiki.bloodontheclocktower.com/index.php?title=Rules_Explanation&amp;oldid=1310 |
| Official Glossary | oldid `2874`; 2025-07-20T21:40:39Z | `75a4ce2fae80808172b90401f87041a2ab8a5101a8330b115739ddd9fc414fee` | https://wiki.bloodontheclocktower.com/index.php?title=Glossary&amp;oldid=2874 |
| Official States | oldid `1039`; 2023-03-23T01:23:10Z | `9d99771412548f80e1d1d49c280fc6f92b92e4abe4b965ad6635d9b4cc31d440` | https://wiki.bloodontheclocktower.com/index.php?title=States&amp;oldid=1039 |
| Official Setup | oldid `1361`; 2023-04-05T07:14:26Z | `9ac52fc2b49bbdb14c2938957a03da9654e53e43df994f03169a3980b867569` | https://wiki.bloodontheclocktower.com/index.php?title=Setup&amp;oldid=1361 |
| Chinese 首页 | oldid `5855`; checked 2026-08-21 | `2a26fff7526bd1b6b20cd0f4044288dd7b348d39a1f933fd65a67c3f242ddb49` | https://clocktower-wiki.gstonegames.com/index.php?title=%E9%A6%96%E9%A1%B5&amp;oldid=5855&amp;action=raw |
| Chinese 提名 | oldid `5887`; checked 2026-08-21 | `230ea8fb14ef577469a4a2933abef2fc39c3eacbdfcc04bed5d921a6bc0b5ed9` | https://clocktower-wiki.gstonegames.com/index.php?title=%E6%8F%90%E5%90%8D&amp;oldid=5887&amp;action=raw |
| Chinese 投票 | oldid `5936`; checked 2026-08-21 | `48418634ff7491cff7bc9074c6b6dc6b37b7e1223afd3f85db84a5bfc7fe34da` | https://clocktower-wiki.gstonegames.com/index.php?title=%E6%8A%95%E7%A5%A8&amp;oldid=5936&amp;action=raw |
| Chinese 处决 | oldid `6420`; checked 2026-08-21 | `2411c4d46adbe6e4a25631d35a43888731bacd4cc3de314783090453217c888e` | https://clocktower-wiki.gstonegames.com/index.php?title=%E5%A4%84%E5%86%B3&amp;oldid=6420&amp;action=raw |
| Chinese 夜晚行动顺序 | oldid `6461`; checked 2026-08-21 | `2b22562e358c100c08e1648fb1e4cb8c391cb56a42524430359acd6f3578753a` | https://clocktower-wiki.gstonegames.com/index.php?title=%E5%A4%9C%E6%99%9A%E8%A1%8C%E5%8A%A8%E9%A1%BA%E5%BA%8F%E4%B8%80%E8%A7%88&amp;oldid=6461&amp;action=raw |
| Official nightsheet | commit `3d6d930a9e600321f93b2567a2e88948a675bc1e`; main `f10cd02e3401af227ce406287eaae7bb99a06a42`; checked 2026-08-21 | `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75` | https://raw.githubusercontent.com/ThePandemoniumInstitute/botc-release/3d6d930a9e600321f93b2567a2e88948a675bc1e/resources/data/nightsheet.json |
| Official Flowergirl role page | live source indexed 2026-07-06; no separate fixed revision/hash in the approved snapshot | `NOT_RECORDED_IN_APPROVED_SNAPSHOT` | https://wiki.bloodontheclocktower.com/Flowergirl |
| Official Pit-Hag role page | live source indexed 2026-07-06; no separate fixed revision/hash in the approved snapshot | `NOT_RECORDED_IN_APPROVED_SNAPSHOT` | https://wiki.bloodontheclocktower.com/Pit-Hag |

The last two rows are deliberately labeled as unpinned in the existing source
index. They are not silently converted into a fabricated revision or hash.
The fresh reviewer must verify them directly or require an approved snapshot
before implementation. The official nightsheet remains canonical over the
Chinese page where the latter presents an optional alternative.

## External rule claims

These claims come from the cited BOTC sources, not from repository code:

1. Day and night are alternating phases. Dawn closes the night and opens the
   next day; day supports discussion, nominations, and voting.
2. Only living players nominate. A player can nominate once per day and can be
   nominated once per day; a dead player may still be nominated. A nomination
   has one active resolution at a time.
3. Living players may vote under the day rules. A dead player has one remaining
   ghost vote; the vote is consumed when counted. Execution requires a nonzero
   tally, at least half of living players, and a strict highest tally; a tie
   does not execute.
4. Execution and death are distinct states. An execution can occur without
   death, and no product event may infer death solely from an execution.
5. Flowergirl learns whether a Demon voted during the relevant day; her
   scheduled ability is an other-night action, not a first-night wake.
6. Pit-Hag selects a player and a character not already in play for a
   character change; the role's sourced arbitrary-death consequence when a
   Demon is made is not generalized here beyond the bounded fixture witness.
7. Vortox imposes false information on effective Townsfolk abilities. This
   fixture uses Vortox as the assigned Demon and uses the sourced nightsheet
   order for the kill before Flowergirl's task.
8. The exact nightsheet is the official pinned JSON, not an arbitrary runtime
   task order. Its bytes are the SHA-bound artifact above.

The accepted user override
`BOTC-SIM-EXECUTION-DEATH-SEPARATION-V1` is applied only to the product's
execution/death modeling boundary. It does not rewrite the external sources or
define a general death system.

## Governance V1.1 rule fields

The design uses the existing nine-field traceability contract; it does not
create a second schema. The following fields are the rule-research inputs (the
repository-only completion details are listed separately below):

```text
involvedRoles=[clockmaker,flowergirl,savant,seamstress,philosopher,artist,
 sage,mutant,klutz,evil_twin,pit_hag,vortox]
abilityRules=Flowergirl learns whether a Demon voted; Pit-Hag chooses a player
 and an out-of-play character; Vortox constrains effective Townsfolk information
firstNightOrder=official pinned nightsheet; existing first-night path only
otherNightOrder=official pinned nightsheet; Vortox kill precedes Flowergirl
 interactions=day nomination/vote, Pit-Hag consequence, death/role boundaries
drunkennessRules=not exercised by this fixture; no impairment inference
poisoningRules=not exercised by this fixture; no impairment inference
VortoxRules=effective Vortox false-information rule; no generic Vortox framework
characterChangeRules=Pit-Hag choice is bounded to one sourced out-of-play role
storytellerDiscretion=not simulated; fixed fixture choices are product inputs
explicitOutOfScope=Dreamer,Cerenovus,Mathematician,Fang Gu/Witch fixture roles,
 general role-change engine, general arbitrary-death policy, Slice 3
requiredRegressionTests=A-R positive stream plus every negative matrix row
ruleCoverageStatus=PARTIAL
```

`firstNightOrder` and `otherNightOrder` identify source authority, not a claim
that every catalog role is implemented. The Chinese night-order page is an
optional alternative and is not selected over the pinned official nightsheet.

## Frozen Pit-Hag choice and death distinction

For this fixture only, the expected product binding is:

```text
seed=2c-preemption-pithag-vortox-v1
pitHagSourceSeat=10
pitHagTargetSeat=7
pitHagChosenCharacter=fang_gu
chosenCharacterInExactFixture=false
arbitraryDeathVictimSeat=6
arbitraryDeathCause=PIT_HAG_ARBITRARY_DEATH
pitHagConsequenceBoundary=before NIGHT_TASKS
daytimeExecutionCause=DAYTIME_NOMINATION_EXECUTION
```

This is a bounded witness contract, not an external rule that Sage must die in
all Pit-Hag games. The external source says that making a Demon opens the
night's arbitrary-death consequence; the repository fixture selects one
concrete victim so the chain can be replayed. Daytime `ExecutionResolved` and
night `PlayerDied(cause=PIT_HAG_ARBITRARY_DEATH)` are different facts. Neither
path may be silently substituted for the other, and execution never implies
death.

## Per-event 2C authority and C1 boundary

The active 2C runtime authority has exactly one additive entry:

```text
runtimeEntry=2C_PREEMPTION_PIT_HAG_V1
entryScope=PitHagActionResolved -> bounded PlayerDied cause branch
defaultC1Authority=40 historical events / 59 historical branches
defaultC1NewEntryResult=ADDITIVE_DESCRIPTOR_NOT_AUTHORIZED
additions.deltaBindings=[]
newApprovedStructuralDeltaCount=0
```

| Event subject | Authoritative predecessor | Authoritative successor | 2C admission | Default C1 behavior |
|---|---|---|---|---|
| `PitHagActionResolved` | day close, exact source/target/choice | one causal death before `NIGHT_TASKS` | explicit 2C entry only | reject |
| Pit-Hag-caused `PlayerDied` | `PitHagActionResolved` | `NIGHT_TASKS` transition | existing event shape + bounded cause | reject unadmitted branch |
| `FLOWERGIRL_ACTION` terminal | `PlayerDied` for Flowergirl seat 1 | ordinary completion | existing terminal settlement shape | reject unknown task |

An implementation needing a new approved descriptor or changing the default
40/59 authority must stop with `NEW_APPROVED_DELTA_REQUIRED`; it may not
reinterpret `deltaBindings=[]`.

## A-R Governance V1.1 traceability

The active criteria have one primary layer each. Supporting labels `R1`-`R4`
and `T1`-`T3` are evidence references, not additional primary mechanisms.

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| 2C-R1 | exact role set is accepted | generator and assignment digest equal all 12 IDs | production setup/assignment witness | A-B | T1 | STRUCTURAL_VALIDATION | PASS | R1/T1 |
| 2C-R2 | first-night accepted paths remain historical | Philosopher/Seamstress provenance is unchanged | accepted replay comparison | C-F | T1 | STRUCTURAL_VALIDATION | PASS | R2/T1 |
| 2C-R3 | day nomination/vote constraints hold | legal tally and deterministic negative outcomes | prospective/replay command audit | G-K | T1 | STRUCTURAL_VALIDATION | PASS | R3/T2 |
| 2C-R4 | Pit-Hag consequence preempts night tasks | fixed choice and causal death precede `NIGHT_TASKS` | bounded batch cross-link | L-N | T1 | STRUCTURAL_VALIDATION | PASS | R2/T2 |
| 2C-R5 | ordinary plan has two tasks | only generic kill and Flowergirl task are admitted | plan identity and unknown-task audit | O | T1 | STRUCTURAL_VALIDATION | PASS | R1/T1 |
| 2C-R6 | dead Flowergirl cannot act | exactly one terminal `SOURCE_INELIGIBLE` settlement | prospective/replay settlement audit | P-Q | T1 | STRUCTURAL_VALIDATION | PASS | R2/T2 |
| 2C-R7 | complete loop is deterministic | A-R replays exactly and retry is idempotent | full stream/provenance audit | A-R | T1 | STRUCTURAL_VALIDATION | PASS | R4/T3 |

No criterion claims ownership, publication, workflow, or Slice 3 behavior. The
accepted C/C1 criteria remain frozen and B18 remains `HUMAN_BLOCKED_UNCHANGED`.

For the independent design review, the nine Governance V1.1 fields are
materialized one-to-one for A-R as follows:

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| 2C-A | exact setup | generator accepts the exact 12-role set | setup witness | A | T1 | STRUCTURAL_VALIDATION | PASS | R1/T1 |
| 2C-B | exact assignment | seat/role digest matches expected binding | assignment witness | B | T1 | STRUCTURAL_VALIDATION | PASS | R1/T1 |
| 2C-C | first-night compatibility | accepted plan opens unchanged | replay | C | T1 | STRUCTURAL_VALIDATION | PASS | R2/T1 |
| 2C-D | Philosopher/Artist spent | choice/spend provenance settles once | ability evidence | D | T1 | STRUCTURAL_VALIDATION | PASS | R2/T1 |
| 2C-E | Seamstress pair spent | Mutant/Savant provenance settles once | ability evidence | E | T1 | STRUCTURAL_VALIDATION | PASS | R2/T1 |
| 2C-F | dawn boundary | first-night close is exact | transition audit | F | T1 | STRUCTURAL_VALIDATION | PASS | R1/T1 |
| 2C-G | day opening | day revision/window is exact | phase audit | G | T1 | STRUCTURAL_VALIDATION | PASS | R3/T2 |
| 2C-H | nomination rule | one legal nomination is accepted | prospective audit | H | T1 | STRUCTURAL_VALIDATION | PASS | R3/T2 |
| 2C-I | vote provenance | voter/nomination/day facts are linked | event audit | I | T1 | STRUCTURAL_VALIDATION | PASS | R3/T2 |
| 2C-J | strict tally | threshold/nonzero/highest result is deterministic | tally negatives | J | T1 | STRUCTURAL_VALIDATION | PASS | R3/T2 |
| 2C-K | execution boundary | one daily execution, no death inference | replay batch | K | T1 | STRUCTURAL_VALIDATION | PASS | R4/T2 |
| 2C-L | Pit-Hag preemption | fixed action precedes `NIGHT_TASKS` | causal batch | L | T1 | STRUCTURAL_VALIDATION | PASS | R2/T2 |
| 2C-M | causal death | Pit-Hag cause is explicit and distinct | death cross-link | M | T1 | STRUCTURAL_VALIDATION | PASS | R4/T2 |
| 2C-N | transition order | only validated preemption enters night tasks | reorder negatives | N | T1 | STRUCTURAL_VALIDATION | PASS | R4/T2 |
| 2C-O | exact ordinary plan | only generic kill and Flowergirl task | plan audit | O | T1 | STRUCTURAL_VALIDATION | PASS | R1/T1 |
| 2C-P | Vortox target | Flowergirl dies before her task | target/death witness | P | T1 | STRUCTURAL_VALIDATION | PASS | R2/T2 |
| 2C-Q | source ineligible | one Flowergirl terminal settlement only | task replay audit | Q | T1 | STRUCTURAL_VALIDATION | PASS | R2/T2 |
| 2C-R | replay/idempotency | full stream replays and retries exactly | stream manifest | R | T1 | STRUCTURAL_VALIDATION | PASS | R4/T3 |

## Nomination, vote, replay, and idempotency contract

The repository must emit and validate the following narrow events without
changing existing event semantics:

| Event | Required facts | Reject when |
|---|---|---|
| `NominationProposed` | living actor, eligible target, day, one active nomination, command/revision provenance | dead actor, duplicate actor/target/day, stale revision, second active nomination |
| `VoteCast` | active nomination, voter, day, tally contribution, command provenance | no active nomination, duplicate command, consumed ghost vote, noncanonical voter |
| execution batch | exact tally, threshold, strict-highest decision, execution/death separation | tie, zero, below half living, second daily execution, death inferred |
| `PitHagActionResolved` | exact seed/source/target/choice, role not in exact fixture, pre-transition position | wrong seat, in-play choice, missing seed, after `NIGHT_TASKS`, altered retry |
| `PlayerDied` | target, cause, predecessor event, prior living state | forged/missing predecessor, duplicate death, wrong cause, reordered stream |
| `FLOWERGIRL_ACTION` settlement | source role/seat, prior death, terminal reason only | source live, wrong source, generic kill/unknown task, fabricated ability result |

The same canonical command and payload may be retried once and must produce the
same accepted result. The same command ID with a different payload is
`IDEMPOTENCY_PAYLOAD_MISMATCH`; duplicate events are `DUPLICATE_EVENT_ID`.

## `SOURCE_INELIGIBLE` rejection matrix

`SOURCE_INELIGIBLE` is legal only for `FLOWERGIRL_ACTION` and only after the
Flowergirl death has been accepted:

| Attempt | Required result |
|---|---|
| `GENERIC_DEMON_KILL` with `SOURCE_INELIGIBLE` | reject `TERMINAL_REASON_ROLE_MISMATCH` |
| unknown task ID or unknown task type | reject `TASK_UNKNOWN` |
| live Flowergirl source | reject `FLOWERGIRL_SOURCE_LIVE` |
| missing or forged `PlayerDied` | reject `FLOWERGIRL_DEATH_UNPROVEN` |
| death after settlement / duplicate settlement | reject `TASK_DUPLICATE` |
| death for another role/seat | reject `FLOWERGIRL_SOURCE_MISMATCH` |
| settlement before the accepted death in replay | reject `SETTLEMENT_REORDERED` |
| settlement containing vote result or Vortox result | reject `SOURCE_INELIGIBLE_PAYLOAD_EXCESS` |

## Exact fixture refusal diagnostics

The production witness must record seed, player/seat/role digest, setup
signature, and assignment provenance. It deterministically rejects:

- any role outside the twelve IDs or any missing ID;
- Dreamer/Cerenovus placeholders, including a plan-only injection;
- Fang Gu as an assigned role (it is only the fixed Pit-Hag choice and must
  remain absent from the assigned fixture);
- a setup result that differs from the production generator;
- seat collision, duplicate player ID, role/seat mismatch, or changed digest;
- an unrecorded seed or a hand-authored assignment.

These diagnostics are simulation evidence, not new external rule vocabulary.

## Lifecycle, coverage, and stop-loss reaffirmation

The role coverage remains `PARTIAL` for Flowergirl and `NOT_STARTED` for
Pit-Hag/Vortox until independently accepted behavior exists. No role is
promoted by this document. Accepted C/C1 history, the necessary manifest, and
accepted production behavior are `KEEP`; design/evidence/review records are
`ARCHIVE`; fixture census output, temporary replay bundles, and migration-only
helpers are `DELETE_AFTER_2C`.

The bounded budget is two design corrections and three implementation
corrections. A third design correction or fourth implementation correction,
an unapproved C1 structural delta, a general role-change/arbitrary-death
framework, a workflow/dependency change, or Slice 3 behavior is a hard stop.
The next action is fresh independent design review; implementation remains
unauthorized until that review returns `RULE_DESIGN_PASS`.

## Repository simulation contract

The following are product contracts and must not be described as BOTC rules:

- the exact twelve-role fixture and its production setup/assignment witness;
- exact task IDs, task-plan fields, seed recording, command IDs, event IDs,
  event envelopes, and deterministic ordering;
- an ordinary plan containing exactly `GENERIC_DEMON_KILL` and
  `FLOWERGIRL_ACTION`;
- the A-R phase-flow test fixture and its fixed Vortox target choice;
- prospective and replay validation, full provenance, state-before checks,
  batch cross-links, and retry idempotency;
- `SOURCE_INELIGIBLE` as the terminal repository settlement for a Flowergirl
  source already proven dead;
- the requirement that Pit-Hag's bounded consequence precede `NIGHT_TASKS`;
- the explicit additive runtime authority path while default C1 40-event /
  59-branch authority remains frozen;
- coverage labels, artifact retention, and the two-design/three-correction
  stop-loss.

## A-R evidence matrix

| Step | External rule dependency | Repository evidence required |
|---|---|---|
| A-B | Setup and role identity | Generator output, assignment snapshot, exact role-set equality, no manual state. |
| C-F | Official first-night timing and existing role rules | Existing accepted plan/replay plus Philosopher and Seamstress spent provenance. |
| G-K | Day, nomination, vote, execution threshold | Prospective command validation, exact vote tally, tie/threshold negatives, accepted replay. |
| L-N | Pit-Hag sourced consequence and execution/death separation | Causal action-to-execution/death chain before phase transition; reordered-stream rejection. |
| O | Official nightsheet and role timing | Exact two-task plan; rejection of Dreamer/Cerenovus placeholders and duplicates. |
| P-Q | Flowergirl and Vortox source boundaries | `PlayerDied(Flowergirl)` precedes `SOURCE_INELIGIBLE`; no information output; forged/live-source negatives. |
| R | External dawn boundary plus product completion contract | One completion transition, exact replay, tamper rejection, duplicate retry idempotency. |

## Negative matrix

The bounded review must include at least:

1. setup with any extra or missing role;
2. Dreamer/Cerenovus task injected into the exact plan;
3. duplicate nomination or dead nominator;
4. duplicate ghost vote or vote below threshold;
5. tie or non-strict-highest tally;
6. execution reordered after `NIGHT_TASKS`;
7. death inferred from an execution-only stream;
8. Flowergirl settlement before, without, or with a forged death event;
9. live Flowergirl source incorrectly marked `SOURCE_INELIGIBLE`;
10. Vortox target changed away from the assigned Flowergirl;
11. duplicate settlement, duplicate task, missing cross-link, or same command
    with a different payload;
12. historical C1 descriptor or default 40/59 authority altered.

Each failure must have a deterministic diagnostic and remain fail-closed. This
is a fixture-specific negative matrix, not a new security-testing framework.

## C1, coverage, and lifecycle boundary

The C1 accepted 40-event/59-branch history and its descriptor prefix remain
unchanged. If the implementation needs additional descriptors, they are
append-only candidates at 41+ / 60+ through the accepted seam, with
`additions.deltaBindings=[]` and `newApprovedStructuralDeltaCount=0`. The
default historical authority must still reject unapproved new descriptors;
only the explicit bounded 2C runtime path may admit them.

No role is promoted to `COMPLETE`: Flowergirl, Pit-Hag, and Vortox remain
`PARTIAL`/`NOT_STARTED` as appropriate to the accepted matrix until a later
review establishes broader behavior. Fixture outputs and temporary replay
artifacts are evidence, not ownership or publication authority. Accepted
behavior and necessary manifests are `KEEP`; review/evidence bundles and
migration history are `ARCHIVE`; temporary fixture/replay helpers are
`DELETE_AFTER_2C`.

## Rule conclusion and next gate

The source conflict previously recorded for execution versus death is resolved
within the approved override scope. The Chinese night-order page is optional;
the official nightsheet is canonical. No interpretation is selected beyond the
bounded fixed fixture and its explicit repository contracts.

```text
unresolvedRuleConflict=[]
ruleResearchVerdict=RULE_READY
designVerdict=RULE_DESIGN_FIX_REQUIRED
implementationAuthorized=false
requiredNextAction=FRESH_INDEPENDENT_RULE_DESIGN_REVIEW
```

The next reviewer must return a complete `RULE_DESIGN_PASS` before any writer
creates a branch or modifies production code, tests, workflow, dependencies,
coverage, or routing.
