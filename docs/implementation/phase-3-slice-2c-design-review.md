reviewedDesignHead: `e908bb9ea60c0f04d566607bff54e9f18ec26407`

designSha256: `3721262b79183b4b0db44a812c16bdc09662578ac71ea173de45d88a3c3eedb7`

reviewTimestamp: `2026-08-31T03:44:04.1820888Z`

reviewScope:

- Fresh read-only review of the complete active design and the unchanged design blob from `f545ad5` through latest descendant `e908bb9`.
- Reviewed `docs/rules/evidence/2C-closure-supersession.md`, `2C.md`, `2C-preemption-fixture.md`, the role coverage matrix, ADR governance rules, command/event model, C1 AST, and additive descriptor source.
- Independently verified official rule sources. The official Glossary confirms once-per-day nomination/nominee limits and that dead players lose abilities; official Pit-Hag/Vortox/Flowergirl pages and the pinned nightsheet support the bounded night-order and death-suppression design. [official Glossary](https://wiki.bloodontheclocktower.com/Glossary), [Pit-Hag](https://wiki.bloodontheclocktower.com/Pit-Hag), [Vortox](https://wiki.bloodontheclocktower.com/Vortox), [Flowergirl](https://wiki.bloodontheclocktower.com/Flowergirl), [pinned nightsheet](https://raw.githubusercontent.com/ThePandemoniumInstitute/botc-release/3d6d930a9e600321f93b2567a2e88948a675bc1e)
- No files modified. No tests or Hosted CI run. This is a design verdict only, not implementation or release approval.

closureStatuses:

- `F01_C1_IDENTITY_COLLISION=CLOSED`
  - Accepted C1 remains `1..40 / 1..59`.
  - Additive candidate remains exactly ten rows `41..50 / 60..69`.
  - Current source diff confirms no accepted C1 AST mutation, structural delta, duplicate ordinal, or duplicate canonical subject.
- `F02_GOVERNANCE_REACHABILITY=CLOSED`
  - Design explicitly freezes R1–R4, T1–T3, the eight primary layers, and the A–G classification algorithm.
  - GI-C01 through GI-C15 have single primary layers and no mixed-primary criterion.
- `F03_PLAYERDIED_AUTHORITY=CLOSED`
  - Execution and generic Demon deaths use one `PlayerDied` authority with explicit cause predecessor, cause type, seat, phase/night, revision, canonical IDs, duplicate, reorder, forged-cause, and state-mutation rules.
  - `ExecutionResolved(DID_NOT_DIE)` remains independent from death.
- `F04_COMMAND_EVENT_MAPPING=CLOSED`
  - `DeclareNomination -> NominationDeclared` is singular.
  - `NominationProposed`, role-specific death aliases, `DemonKillResolved`, and other duplicate identities are explicitly excluded.
  - Both `nominatorPlayerId` and `nomineePlayerId` once-per-day guards are explicitly frozen.
  - The supersession map resolves the historical applicability conflict without rewriting historical evidence.

findings:

1. `NON_BLOCKING_AUDIT_METADATA_NOTE`
   - The design still contains the historical embedded binding `reviewedDesignHead=202511719...` and SHA `d8af60...73074`, which describe an earlier design revision.
   - This fresh report supersedes that historical binding for the current design bytes (`e908bb9`, SHA `372126...eedb7`).
   - Recommended follow-up: synchronize the embedded metadata after archiving this report. This is not a semantic design blocker.

semanticAssessment:

- Accepted prefix remains immutable.
- Nomination identity and both daily uniqueness invariants are explicit.
- `PlayerDied` binding is complete and uses the corrected `cause=EXECUTION` token.
- The supersession record clearly marks `PitHagActionResolved` and `NominationProposed` as historical applicability only.
- Daytime Pit-Hag execution precedes `NIGHT_TASKS`; because dead characters have no abilities, later Pit-Hag task generation is correctly suppressed.
- The exact A–R chain, generic Demon target/death ordering, Flowergirl `SOURCE_INELIGIBLE` settlement, and no Dreamer/Cerenovus fallback are bounded without introducing a generic scheduler or role-change framework.
- Scope and stop-loss controls are adequate: no C1 mutation, no structural delta, no Slice 3 behavior, no new dependency, and no broad rewrite.

designVerdict: `RULE_DESIGN_PASS`

remainingDesignBlockers: `[]`

pendingPublicationGates:

- `HostedCI=NOT_RUN`
- `PRCreated=false`
- `pushPerformed=false`
- Final implementation evidence and final PR review remain required separately.
