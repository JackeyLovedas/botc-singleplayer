# Phase 3 Slice 2B19T Design Review — Round 2

## reviewMetadata

- reviewedDesign: `docs/implementation/phase-3-slice-2b19t-design-round-2.md`
- reviewedDesignSha256: `6d2adb12e719e5b8311efb02a343f349902d652d41befc00912337ecec03489b`
- reviewedMainHead: `f6058cfb8dc2241da07c8ed9297ee34057589230`
- designRound: `2 / 2`
- authorization: `USER_AUTHORIZED_2B19T_DESIGN_ROUND_2_CONTRACT_CORRECTION`
- reviewTimestamp: `2026-07-15T15:51:54+08:00`
- reviewerMode: `independent read-only`
- implementationAuthorizedBeforeReview: `false`
- ruleEvidenceVerdict: `RULE_READY`
- sliceCoverageReviewed: `FOUNDATION`
- dreamerRoleCoverageReviewed: `PARTIAL`
- ruleSemanticsChanged: `false`

## exactHeadCI

- run: `29398067385`
- URL: `https://github.com/JackeyLovedas/botc-singleplayer/actions/runs/29398067385`
- event: `push`
- headSha: `f6058cfb8dc2241da07c8ed9297ee34057589230`
- attempt: `1`
- overallStatus: `SUCCESS`
- Linux `validate`: `SUCCESS`
- Windows deterministic job: `SUCCESS`
- verified gates:
  - typecheck: `SUCCESS`
  - lint: `SUCCESS`
  - test: `SUCCESS`
  - coverage: `SUCCESS`
  - deterministic Windows suites: `SUCCESS`

The reviewed main worktree was clean, local `main`, `origin/main`, and GitHub `main` all resolved to the reviewed SHA, and the open PR count was zero.

## independentSourcesReviewed

### Repository and user authority

- `AGENTS.md`
- `project-handoff/00-README-FIRST.md`
- ordered handoff documents:
  - `project-handoff/PROJECT_HANDOFF.md`
  - `project-handoff/PRODUCT_SCOPE.md`
  - `project-handoff/RULES_BASELINE.md`
  - `project-handoff/ARCHITECTURE_INPUT.md`
  - `project-handoff/IMPLEMENTATION_GUARDRAILS.md`
  - `project-handoff/OPEN_RISKS.md`
  - `project-handoff/DEVELOPMENT_ROADMAP.md`
- relevant Phase One material:
  - `project-handoff/rules/10-night-order.md`
  - `project-handoff/rules/15-character-and-alignment-changes.md`
  - `project-handoff/rules/17-character-data-model.md`
  - `project-handoff/rules/24-rule-priority.md`
  - `project-handoff/tests/25-rule-test-cases.md`
- `docs/agent-loop/AUTOPILOT_PROMPT.md`
- `docs/agent-loop/REVIEW_PROTOCOL.md`
- `docs/agent-loop/AUTOPILOT_STATE.json`
- `docs/agent-loop/CURRENT_TASK.md`
- `docs/agent-loop/PROJECT_STATE.md`
- `docs/rules/USER_OVERRIDES.md`
  - independently verified SHA-256: `2052994a6bf17be4715ac50a8e67be43fa7bfc457df5f694589bcd2f59430624`
  - no applicable Dreamer tenure override exists
- `docs/rules/evidence/2B19T.md`
  - independently verified SHA-256: `b8c8b858ee3a7fb7fc141a1d28a0b385cf17111947caa397d569f9b79041185d`
  - terminal: `RULE_READY`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
  - independently verified SHA-256: `c14851da3007325b45f36b1336e28883c09f6d06f1d815833cfd885318563709`
  - Dreamer overall status: `PARTIAL`
- immutable Round 1 history:
  - `docs/implementation/phase-3-slice-2b19t-design.md`
  - SHA-256: `0eca3f5d67fb1407b4ba9b0f27ef2914e57329f864b72e6a1effe49fff3f632a`
  - `docs/implementation/phase-3-slice-2b19t-design-review-round-1.md`
  - SHA-256: `e69c5e9ee04bbfdde9f408214045cb066cd6f6584ca710997121c916955af101`

### User-specified Chinese Wiki

Both fixed revisions were retrieved live through their MediaWiki revision APIs on `2026-07-15`; no snapshot fallback was required.

- 筑梦师 `oldid=3046`
  - retrieval: `SUCCESS`
  - independently reproduced pinned-content SHA-256:
    `53ca18c52267b871c0041d1b4101f486f83bace0005aa7261493b3aa4cacfdf7`
  - confirms Dreamer acts every night and requires a current Dreamer holder.
- 舞蛇人 `oldid=5873`
  - retrieval: `SUCCESS`
  - independently reproduced pinned-content SHA-256:
    `0cf24ffd161b49611af51aec559508fb0cff3379eea2e2d987eb7fd9f41e64f0`
  - confirms a Demon hit swaps characters and alignments and poisons the former Demon.

### Official BOTC Wiki

Both fixed revisions were retrieved live through their MediaWiki revision APIs on `2026-07-15`; no snapshot fallback was required.

- Dreamer `oldid=2904`
  - revision timestamp: `2025-09-24T08:39:30Z`
  - retrieval: `SUCCESS`
  - independently reproduced pinned-content SHA-256:
    `8841959a3c7b8bb7a6429b229c4fa1ffe70a3df282bfaa5549959afbffca4a7c`
- Snake Charmer `oldid=2905`
  - revision timestamp: `2025-09-24T08:42:17Z`
  - retrieval: `SUCCESS`
  - independently reproduced pinned-content SHA-256:
    `34fc48e81127875a4713042efd38c6fe5e07b39f2476df7a6fcd188155d53a67`

The external sources agree on the relevant bounded claims. They do not define repository tenure IDs, revisions, transition facts, or replay validators; the design correctly classifies those as product-derived state.

### Official nightsheet

- pinned source:
  `https://raw.githubusercontent.com/ThePandemoniumInstitute/botc-release/3d6d930a9e600321f93b2567a2e88948a675bc1e/resources/data/nightsheet.json`
- retrieval: `SUCCESS`
- independently verified SHA-256:
  `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`
- first night:
  - Snake Charmer zero-based index: `36`
  - Dreamer zero-based index: `60`
- other night:
  - Snake Charmer zero-based index: `22`
  - Dreamer zero-based index: `78`

The design changes no night order and does not claim to implement a Dreamer night action.

## productionFilesInspected

- `packages/domain-core/src/canonical-data.ts`
- `packages/domain-core/src/seamstress.ts`
- `packages/domain-core/src/errors.ts`
- `packages/domain-core/src/rebuild.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/game-state.ts`
- `packages/domain-core/src/events.ts`
- `packages/domain-core/src/snake-charmer.ts`
- `packages/domain-core/src/character-assignment.ts`
- `packages/domain-core/src/current-character-state.ts`
- `packages/domain-core/src/index.ts`
- relevant direct tenure consumers in:
  - `packages/domain-core/src/clockmaker.ts`
  - `packages/domain-core/src/cerenovus.ts`
  - `packages/domain-core/src/mathematician-internal.ts`
  - `packages/domain-core/src/first-night-action-opportunity.ts`
  - `packages/domain-core/src/domain-batch-semantics.ts`
  - `packages/domain-core/src/first-night-ability-outcome-ledger.ts`

The proposed `packages/domain-core/src/role-tenure-replay.ts` does not yet exist and is correctly frozen as a package-internal implementation file with no root export.

## testFilesInspected

- `packages/domain-core/src/seamstress.test.ts`
- `packages/domain-core/src/rebuild.test.ts`
- `packages/domain-core/src/clockmaker.test.ts`
- `packages/domain-core/src/clockmaker-replay.test.ts`
- `packages/domain-core/src/cerenovus.test.ts`
- `packages/domain-core/src/cerenovus-replay.test.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`
- relevant direct tenure references across the current domain-core test suite

The planned new `packages/domain-core/src/role-tenure-replay.test.ts` is within the frozen test allowlist.

## designChecklist

1. **PASS — Dreamer overall coverage remains `PARTIAL`.**  
   Metadata, coverage clarification, matrix update contract, completion criteria and forbidden scans all preserve the accepted `PARTIAL` status.

2. **PASS — Slice coverage is `FOUNDATION`.**  
   The design consistently distinguishes Slice coverage from role coverage and terminates with `coverageStatus: FOUNDATION`.

3. **PASS — No overall Dreamer downgrade is required.**  
   Round 1’s `SKELETON` role-status conflict is explicitly removed. Existing V1 implementation facts remain intact.

4. **PASS — `errors.ts` is the authorized fourth production file.**  
   The production allowlist contains exactly `seamstress.ts`, `role-tenure-replay.ts`, `rebuild.ts`, and `errors.ts`.

5. **PASS — `InvalidRoleTenureState` enters the official union.**  
   The design requires an exact `DomainErrorCode` union member and forbids casts or widening.

6. **PASS — The three error responsibilities are disjoint.**  
   Direct ID failures remain `InvalidRoleTenureId`; fact-internal failures remain `InvalidRoleTenureTransitionFact`; aggregate, topology, query, replay and state-cross-link failures use `InvalidRoleTenureState`.

7. **PASS — Raw state precedes clone, search and mutation.**  
   `applyRoleTenureTransitionFact` freezes fact validation first, then exact validation of the original raw state, then clone and clone revalidation.

8. **PASS — Undefined raw transition/query/audit state is rejected.**  
   Transition and replay boundaries explicitly classify missing canonical tenure state as damaged history. Query validation runs before search and rejects an undefined state supplied through an untyped runtime boundary.

9. **PASS — Clone output is revalidated.**  
   The cloned state must pass `validateRoleTenureStateExact` before cross-link processing.

10. **PASS — Post-mutation state is revalidated.**  
    The result is canonically sorted, exact-validated and rejected with `InvalidRoleTenureState` before return if invalid.

11. **PASS — Clone convenience is not canonical validation.**  
    `undefined -> empty` is retained only as `CLONE_CONVENIENCE`; the design explicitly forbids treating it as `CANONICAL_VALIDATION`.

12. **PASS — Replay validates raw state before normalization.**  
    The auditor requires the actual `seamstressRoleTenureState`, validates it before clone/spread/search, and derives a separate expected state from accepted envelopes.

13. **PASS — Initial Dreamer tenure is assignment-derived.**  
    Bootstrap uses the real accepted `CharactersAssigned` assignments plus envelope event ID and sequence, with acquisition revision `1`.

14. **PASS — Accepted history is sufficient for currently real Snake Charmer transitions.**  
    The existing payload provides both players’ before/after roles, seats, identities, previous/next revisions, while the envelope provides canonical event ID and sequence. Stored swap history can be compared one-for-one with accepted envelopes.

15. **PASS — No current producer is claimed to enter or leave Dreamer.**  
    `D19T-010` through `D19T-013` are explicitly reconciler-only tests. Current accepted Snake Charmer production is accurately bounded.

16. **PASS — No event or `GameState` schema changes are authorized.**  
    `events.ts`, `game-state.ts`, `event-applier.ts`, event versions and payloads are outside the production allowlist.

17. **PASS — No second tenure system is introduced.**  
    The design retains the sole `GameState.seamstressRoleTenureState`; expected replay state is a transient verification value rather than a second authority.

18. **PASS — Four production files and 800 added lines are hard limits.**  
    The aggregate limit includes the `errors.ts` union addition and has an explicit `HUMAN_BLOCKED` stop condition.

19. **PASS — Hostile validation and getter-zero behavior are directly covered.**  
    `D19T-031` through `D19T-041` cover undefined, extra keys, sparse arrays, getters with zero invocation, transparent and revoked proxies, cycles, pre-clone preservation, clone revalidation and post-mutation validation. The validator contract additionally enumerates null, primitives, arrays, nonplain prototypes, missing/symbol keys, malformed records/start facts, unsafe numbers, negative zero, duplicates and interval conflicts.

20. **PASS — Fact and direct-ID classifications have regressions.**  
    `D19T-044` preserves `InvalidRoleTenureTransitionFact`; `D19T-045` preserves `InvalidRoleTenureId`.

21. **PASS — The matrix remains `PARTIAL`.**  
    `D19T-046` and the matrix-update contract prohibit a Dreamer status change away from `PARTIAL`.

22. **PASS — `2B19A1` and Phase `2C` remain unstarted.**  
    Both are explicit out-of-scope items, forbidden-scan checks, completion criteria and stop boundaries.

## additionalImplementationFeasibilityChecks

### Standalone contract completeness

`PASS`.

The Round 2 document defines or points to every required production type and function. Existing repository definitions confirm that these references exist:

- `CharacterAssignmentSet`
- `CurrentCharacterStateSet`
- `AnyDomainEventEnvelope`
- `GameState`
- `EventId`
- `PlayerId`
- `RoleTenureId`
- `RoleTenureTransitionFactId`
- `SeatNumber`
- `RoleSetupSnapshot`
- canonical-data helpers
- role-snapshot exact-shape helper
- Snake Charmer swap payload and transition adapter

No undefined custom type, placeholder, omitted branch, implementer-selected alternative, or dependency on Round 1 for missing contracts remains.

### Character-assignment duplicate-role compatibility

`PASS`.

The accepted fixed assignment validator already requires:

- exactly twelve assignments;
- exactly twelve unique actual roles;
- unique assignment role IDs;
- complete one-to-one coverage of actual roles.

The Round 2 bootstrap duplicate-role rejection therefore does not narrow accepted canonical history. The design correctly avoids presenting this fixed-product constraint as a universal BOTC rule.

### `AnyDomainEventEnvelope` and rebuild integration

`PASS`.

`AnyDomainEventEnvelope` is an exported discriminated union. `rebuildGameState` already owns the complete accepted event list, performs stream and batch validation, applies all events, and has a final audit boundary. The proposed guarded auditor call is compile-compatible without changing its public signature.

The guard preserves pre-assignment streams such as `[GameCreated]`. Once assignment/current-character/tenure authority exists, missing tenure state is correctly treated as corruption.

### Current Snake Charmer payload sufficiency

`PASS`.

`SnakeCharmerDemonSwapAppliedPayload` currently includes:

- source and target identity and seat;
- source and target before states;
- source and target after states;
- previous and next character-state revisions;
- swap reason.

The envelope supplies event ID and sequence. No payload or event migration is needed for the bounded audit.

### Topology and provenance boundary

`PASS`.

The exact state validator handles canonical raw shape, record topology, canonical ordering, IDs, intervals, player-seat identity, processed-ID uniqueness and forward transition-start references. It deliberately does not fabricate reverse event provenance from shape alone.

The accepted-stream auditor owns reverse provenance:

- accepted assignment ↔ initial records;
- real transition facts ↔ processed IDs;
- tracked after-role facts ↔ successor records;
- tracked before-role facts ↔ ended records;
- actual state ↔ independently rebuilt expected state;
- active tenure ↔ current character state.

This separation is implementable and does not impose an impossible requirement on nontracked-to-nontracked or tracked-to-untracked transitions.

### Stable reasons and error classification

`PASS`.

The stable reason set contains no hostile input interpolation and covers raw shape, records, processed IDs, ordering, identity, intervals, bootstrap, transition, query, current-state and replay failures. Aggregate callers map failures to the newly authorized state code without weakening direct ID or fact APIs.

### Frozen authority IDs

`PASS`.

The authority set is exactly `D19T-001` through `D19T-047`:

- Round 1: `30` IDs;
- user-authorized Round 2 additions: `17` IDs;
- total: `47`.

All seventeen required Round 2 additions are present with matching behavior and error classifications.

### Production surface and package exports

`PASS`.

The internal replay module requires no root export. `index.ts` remains unchanged. The design does not require a fifth production file, and the suggested allocation is consistent with the authoritative 800-line aggregate ceiling.

## round1BlockerDisposition

### `DREAMER_ROLE_COVERAGE_STATUS_CONFLICT`

- disposition: `CLOSED`
- evidence:
  - Slice coverage is separately fixed at `FOUNDATION`;
  - Dreamer overall role coverage is fixed at `PARTIAL`;
  - the matrix must retain `PARTIAL`;
  - no `USER_OVERRIDES.md` change is authorized;
  - the clarification is explicitly non-semantic and not a rule override.

### `INVALID_ROLE_TENURE_STATE_ERROR_CODE_OUTSIDE_ALLOWED_PRODUCTION_SURFACE`

- disposition: `CLOSED`
- evidence:
  - `errors.ts` is the exact fourth and final production file;
  - `InvalidRoleTenureState` is added to the official union;
  - casts and code widening are forbidden;
  - all three error-code responsibilities are frozen.

### `RAW_ROLE_TENURE_STATE_PREVALIDATION_ORDER_NOT_FROZEN`

- disposition: `CLOSED`
- evidence:
  - raw state validation precedes clone/search/mutation;
  - undefined is invalid at canonical transition/query/audit boundaries;
  - clone output is revalidated;
  - transition result is revalidated;
  - replay validates raw state before normalization;
  - direct hostile regressions cover normalization-loss risks.

## findings

```text
[]
```

No blocking rule conflict, design contradiction, impossible implementation requirement, unauthorized production surface, missing security-critical contract, uncovered Round 1 blocker, or scope expansion was found.

## remainingBlockers

```text
[]
```

## implementationAuthorized

`true`

This authorization is limited to the reviewed Round 2 design and remains subject to its exact four-file production allowlist, three-file test allowlist, 800-line aggregate ceiling, 47 authority IDs, full local gates, frozen feature-head CI, and independent final code/rule review.

## verdict

RULE_DESIGN_PASS
