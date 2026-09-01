# Phase 3 Slice 3 — Command Validation Surface Rule Evidence

## Evidence status

```text
sliceId: PHASE_3_SLICE_3_COMMAND_VALIDATION_SURFACE
researchScope: nomination, voting, ghost-vote, basic execution, and phase-boundary legality
retrievalDate: 2026-08-31 (Asia/Shanghai)
sourceUnavailable: false
ruleCoverageStatus: PARTIAL
unresolvedConflicts: []
ruleVerdict: RULE_READY
```

This is fresh, bounded rule research for the command-validation surface. It
does not authorize implementation, change the accepted Phase 3 or Slice 2C
history, or define a complete role-legality engine. Repository command IDs,
receipt idempotency, replay rejection, and error-code names remain engineering
contracts to be designed against these rule facts; they are not inferred as
external BOTC rules.

## Authority and source availability

The mandatory authority set was checked at the revisions below. Fixed revision
content is identified by its source hash; URLs are retained so each claim can
be independently rechecked. The official nightsheet is the canonical night
order. The Chinese night-order page is context only because it expressly allows
an alternative order.

### User-approved repository authority

| Source | Revision/date | Blob or identity | SHA-256 | URL/path |
|---|---|---|---|---|
| `docs/rules/USER_OVERRIDES.md` | repository HEAD `7fc337325f274c669a356a30c7485e2fdf134643` | blob `180f3c6200667cb5dd8a4cf3106a0408e09454a9` | `9e2b8e9701a35559d9cc67d8c2185d979ec222b3186fa3a9cd16140dd2f68ad5` | `docs/rules/USER_OVERRIDES.md` |

Applicable approved record:
`BOTC-SIM-EXECUTION-DEATH-SEPARATION-V1`, approved by the user on
`2026-08-21 Asia/Shanghai`. It applies only to phase-flow and canonical event
modeling. It overrides only the coupled “executed and dies” wording in Chinese
voting oldid `5936`; it does not define character exceptions, win conditions,
general death resolution, or later-slice behavior.

### Official BOTC Wiki

| Source | Fixed revision/date | Source SHA-1 | SHA-256 | URL |
|---|---|---|---|---|
| Rules Explanation | oldid `1310`; `2023-04-03T01:12:13Z` | `8b094aa4719ca7dc061cda55f0a27828951444cf` | `dcc318218842d92c908ec9382494f7001929e95e62474bcf62e04cd383d91189` | https://wiki.bloodontheclocktower.com/index.php?title=Rules_Explanation&amp;oldid=1310 |
| Glossary | oldid `2874`; `2025-07-20T21:40:39Z` | `a55d4738a77d6ef6382fda26341a94408d86012d` | `75a4ce2fae80808172b90401f87041a2ab8a5101a8330b115739ddd9fc414fee` | https://wiki.bloodontheclocktower.com/index.php?title=Glossary&amp;oldid=2874 |
| States | oldid `1039`; `2023-03-23T01:23:10Z` | `766aebdbebec64ffffc979e4c7170ea58ad4a6b8` | `9d99771412548f80e1d1d49c280fc6f92b92e4abe4b965ad6635d9b4cc31d440` | https://wiki.bloodontheclocktower.com/index.php?title=States&amp;oldid=1039 |
| Setup | oldid `1361`; `2023-04-05T07:14:26Z` | `62f2f80a8049735331a1152c01922ae4cec25ba3` | `9ac52fc2b49bbdb14c2938957a03da9654e53e43df994f03169a3980b867569` | https://wiki.bloodontheclocktower.com/index.php?title=Setup&amp;oldid=1361 |

### User-specified Chinese Wiki

| Source | Fixed revision/date | Source SHA-1 | SHA-256 | URL |
|---|---|---|---|---|
| 首页 | oldid `5855`; `2026-01-26T11:51:39Z` | `9c0a7111be87683936d0b2f882e9f61d3db46b06` | `2a26fff7526bd1b6b20cd0f4044288dd7b348d39a1f933fd65a67c3f242ddb49` | https://clocktower-wiki.gstonegames.com/index.php?title=%E9%A6%96%E9%A1%B5&amp;oldid=5855&amp;action=raw |
| 提名 | oldid `5887`; `2026-02-13T00:41:52Z` | `58382ef466b1017c7d3518f02d44fc43cc17984f` | `230ea8fb14ef577469a4a2933abef2fc39c3eacbdfcc04bed5d921a6bc0b5ed9` | https://clocktower-wiki.gstonegames.com/index.php?title=%E6%8F%90%E5%90%8D&amp;oldid=5887&amp;action=raw |
| 投票 | oldid `5936`; `2026-04-08T01:43:31Z` | `89bacb788e71382a5b8c8a345292817cb086740e` | `48418634ff7491cff7bc9074c6b6dc6b37b7e1223afd3f85db84a5bfc7fe34da` | https://clocktower-wiki.gstonegames.com/index.php?title=%E6%8A%95%E7%A5%A8&amp;oldid=5936&amp;action=raw |
| 处决 | oldid `6420`; `2026-07-19T09:53:58Z` | `d9e70ff077e6b53809713df761fbb6301e04b0ad` | `2411c4d46adbe6e4a25631d35a43888731bacd4cc3de314783090453217c888e` | https://clocktower-wiki.gstonegames.com/index.php?title=%E5%A4%84%E5%86%B3&amp;oldid=6420&amp;action=raw |
| 夜晚行动顺序一览 | oldid `6461`; `2026-08-01T11:45:33Z` | `cf48c83b419513220d14ea3ae8c6ce8409978a94` | `2b22562e358c100c08e1648fb1e4cb8c391cb56a42524430359acd6f3578753a` | https://clocktower-wiki.gstonegames.com/index.php?title=%E5%A4%9C%E6%99%9A%E8%A1%8C%E5%8A%A8%E9%A1%BA%E5%BA%8F%E4%B8%80%E8%A7%88&amp;oldid=6461&amp;action=raw |

### Official nightsheet

| Artifact | Identity | SHA-256 | URL |
|---|---|---|---|
| `resources/data/nightsheet.json` | file-changing commit `3d6d930a9e600321f93b2567a2e88948a675bc1e`; live main HEAD `f10cd02e3401af227ce406287eaae7bb99a06a42` | `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75` | https://raw.githubusercontent.com/ThePandemoniumInstitute/botc-release/3d6d930a9e600321f93b2567a2e88948a675bc1e/resources/data/nightsheet.json |

The selected official nightsheet has `firstNight=80` and `otherNight=99`
entries. Dawn is at zero-based index `77` (ordinal `78`) for first night and
index `97` (ordinal `98`) for other night. Live and pinned file bytes matched.

## Claim-by-claim rule binding

| Claim ID | Rule fact needed by Slice 3 | Binding sources | Bounded conclusion |
|---|---|---|---|
| S3-R01 | Nomination actor eligibility | Official Rules Explanation 1310; Chinese 提名 5887 | Only a living player may nominate. A dead player cannot nominate. |
| S3-R02 | Nomination frequency | Official Rules Explanation 1310; Chinese 提名 5887 | Each player may nominate at most once per day. |
| S3-R03 | Nominee frequency and status | Chinese 提名 5887; Chinese 投票 5936 | A player may be nominated once per day, and a dead player may be nominated. Dead nominator and dead nominee are distinct cases. |
| S3-R04 | Active nomination lifecycle | Official Rules Explanation 1310; Chinese 提名 5887 | Only one nomination is active at a time; defense follows nomination and precedes voting. |
| S3-R05 | Living vote eligibility | Official Rules Explanation 1310; official Glossary 2874; Chinese 投票 5936 | A living player may vote any number of times during a day, subject to an active legal nomination/vote window. |
| S3-R06 | Dead-player ghost-vote entitlement | Official Glossary 2874; official States 1039; Chinese 投票 5936 | A dead player has exactly one remaining vote token. The entitlement is a single remaining token, not a fresh token per nomination. |
| S3-R07 | Ghost-vote consumption timing | Chinese 投票 5936; official Rules Explanation 1310 | The remaining dead-player token is consumed when that vote is counted. The act of becoming dead does not itself consume the token. |
| S3-R08 | `NO`/no-vote consumption | Official Rules Explanation 1310; Chinese 投票 5936 | BOTC voting has a counted raised-hand vote and a hand-down/no-vote; it has no independent “raise hand NO” concept. A counted raised-hand vote consumes the dead player's one remaining token. A hand-down/no-vote does not; if an application maps `NO` to hand-down/no-vote, that mapping must not consume the token. The application mapping is an engineering contract, not a new external rule claim. |
| S3-R09 | Dead player on any later legal nomination | Official Glossary 2874; official Rules Explanation 1310; Chinese 投票 5936 | A dead player retains the one remaining vote for a later legal nomination. The vote is permitted only within the legal nomination/vote lifecycle and is consumed when counted. |
| S3-R10 | Alive-to-dead transition | Official States 1039; official Glossary 2874; Chinese 处决 6420 | Life state and vote entitlement are separate facts: after an alive player becomes dead, the dead-player one-token rule applies; no extra token is created and no token is consumed by the transition alone. |
| S3-R11 | Duplicate vote/duplicate command boundary | All mandatory sources | External rules do not define repository command IDs, fingerprints, replay receipts, or duplicate-command idempotency. Those are implementation validation obligations and must not be presented as new BOTC rule claims. A design must preserve the one-token rule and fail closed for a second use. |
| S3-R12 | Execution threshold | Official Rules Explanation 1310; official Glossary 2874; Chinese 投票 5936 | An execution candidate needs at least half of living players, strictly more votes than every other candidate, and at least one vote. |
| S3-R13 | Tie and no-execution outcomes | Official Rules Explanation 1310; official Glossary 2874; Chinese 投票 5936 | A tie executes nobody. At most one execution occurs per day, and a day may have no execution. |
| S3-R14 | Execution/death distinction | Official Glossary 2874; official States 1039; Chinese 处决 6420; approved override `BOTC-SIM-EXECUTION-DEATH-SEPARATION-V1` | Execution and death are distinct canonical facts. Execution does not imply death; a death must not be inferred from execution alone. |
| S3-R15 | Day/night phase boundary | Official Glossary 2874; official Rules Explanation 1310; Chinese 首页 5855 | Dawn ends the night immediately before the next day; day is the eyes-open conversation/voting period, and each day is followed by night. |
| S3-R16 | Canonical night boundary | Official nightsheet commit `3d6d930...`; Chinese 夜晚行动顺序一览 6461 | The pinned official nightsheet is the canonical order and dawn boundary. The Chinese page is optional context and cannot silently replace it. |

### Ghost-vote semantic boundary

The authoritative minimum is therefore:

```text
deadVoteEntitlement = ONE_REMAINING_TOKEN
deadVoteLegalWindow = LEGAL_ACTIVE_NOMINATION_VOTE
deadVoteConsumption = COUNTED_RAISED_HAND_ONLY
deadVoteHandDownNoVoteConsumption = NOT_CONSUMED
deadVoteApplicationNoMapping = IF_HAND_DOWN_NO_VOTE_THEN_NOT_CONSUMED
botcIndependentRaisedHandNo = false
deadVoteTransitionConsumption = NOT_CONSUMED_BY_TRANSITION
secondDeadVote = NOT_RULE_PERMITTED
```

The sources do not prescribe a repository `commandId`, receipt schema, or
duplicate-command token. Slice 3 may validate and audit those engineering
conditions, but it may not claim that a command identity is a BOTC rule fact.

## Phase and command boundary

The rule source supports the following minimum legality inputs for a future
bounded command validator:

| Surface | Rule-required preconditions | Rule-required rejection boundary |
|---|---|---|
| Nomination | day/nomination window; actor is living; actor has not nominated that day; nominee is a roster player not already nominated that day; no other nomination is active | Dead actor, repeated actor/nominee use, invalid lifecycle, or invalid phase cannot become a nomination fact |
| Vote | active nomination and legal vote window; actor is living or has the one unused dead-player token; execution tally rules are evaluated only after the lifecycle permits resolution | Spent dead token, invalid actor, invalid phase, or absent nomination cannot become a vote fact |
| Execution | completed nomination/vote lifecycle; nonzero tally; at least half of living players; strict greatest tally; no tie | Incomplete lifecycle, below threshold, or tied tally yields no accepted execution fact |
| Phase transition | canonical day/night boundary; required prior phase facts; official dawn boundary where night order applies | A command issued in an unrelated phase is a validation rejection, not a domain fact |

The table is a rule-boundary inventory, not a command API or a new parallel
state machine. It does not settle repository-specific command names,
idempotency, receipt persistence, or hostile replay taxonomy.

## Explicit non-claims and scope limits

- No special-role nomination or voting override is selected (including
  Traveller, exile, or role-specific exceptions).
- No complete role-legality engine, storyteller UI/protocol, multiplayer
  protocol, AI decision system, or game-over validator is selected.
- No rule source defines the repository's internal task-completion predicate,
  command fingerprint, rejection-code names, receipt storage, or replay API.
- The official nightsheet is evidence for the phase boundary only; no new night
  task inventory is claimed here.
- The approved execution/death override is not expanded into general death
  resolution or character-specific survival behavior.
- `2B18Status=HUMAN_BLOCKED_UNCHANGED`; no B18 conflict is touched.

## Final rule disposition

```text
sourceUnavailable = false
unresolvedConflicts = []
freshRuleVerdict = RULE_READY
ruleCoverageStatus = PARTIAL
implementationAuthorized = false
designAuthorizedByThisFile = false
```

The mandatory sources agree on the bounded dead-nomination, nomination-limit,
dead-nominee, ghost-vote entitlement/consumption, execution-threshold, and
phase-boundary facts above. The execution/death wording is governed within
this scope by the explicitly approved override. No substantive unresolved
conflict remains, so the rule gate is `RULE_READY`; a separate bounded design
and independent `RULE_DESIGN_PASS` remain required before implementation.
