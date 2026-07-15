# Phase 3 Slice 2B19T Design Review — Round 1

## reviewedDesign

- path: `docs/implementation/phase-3-slice-2b19t-design.md`
- SHA-256: `0eca3f5d67fb1407b4ba9b0f27ef2914e57329f864b72e6a1effe49fff3f632a`
- designRound: `1 / 2`
- reviewedAt: `2026-07-15`
- reviewedAcceptedMain: `ed403b2d732512b0a44b419dbb9eec15e4a7af42`

## reviewerIndependence

- 本审查由全新独立只读 reviewer 完成。
- 未信任或复述 rule-researcher、architect 或 controller 的结论。
- 独立读取了用户授权、规则来源、rule evidence、覆盖矩阵、设计文件、审查协议、现有生产实现及相关测试。
- 未修改任何文件。
- 未创建或切换分支。
- 未创建提交、PR 或 tag。
- 未运行实现。
- 未把测试绿色状态当作规则真值。

## sourcesReviewed

### User and repository authority

- 用户授权：`USER_AUTHORIZED_2B19T_CANONICAL_DREAMER_ROLE_TENURE_PREREQUISITE`
- `AGENTS.md`
- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/evidence/2B19T.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `docs/agent-loop/REVIEW_PROTOCOL.md`
- `docs/implementation/phase-3-slice-2b19t-design.md`

### User-specified Chinese Wiki

- `https://clocktower-wiki.gstonegames.com/index.php?title=筑梦师&oldid=3046`
- `https://clocktower-wiki.gstonegames.com/index.php?title=舞蛇人&oldid=5873`

The fixed revisions were independently retrieved successfully. They confirm:

- 筑梦师是每夜行动的镇民；
- 舞蛇人命中恶魔时会交换角色与阵营；
- role tenure、revision 和 tenure ID 是产品派生状态，而不是外部规则术语。

### Official BOTC Wiki

- `https://wiki.bloodontheclocktower.com/index.php?title=Dreamer&oldid=2904`
- `https://wiki.bloodontheclocktower.com/index.php?title=Snake_Charmer&oldid=2905`

The fixed revisions were independently retrieved successfully. They confirm:

- Dreamer acts each night;
- Snake Charmer can cause actual character and alignment changes;
- Snake Charmer’s current supported swap changes the Snake Charmer/Demon identities, not an arbitrary player into Dreamer.

### Official nightsheet

- `https://raw.githubusercontent.com/ThePandemoniumInstitute/botc-release/3d6d930a9e600321f93b2567a2e88948a675bc1e/resources/data/nightsheet.json`
- independently verified SHA-256:
  `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`

Independently verified positions:

- first night:
  - `snakecharmer`: zero-based index `36`
  - `dreamer`: zero-based index `60`
- other night:
  - `snakecharmer`: zero-based index `22`
  - `dreamer`: zero-based index `78`

The design does not alter night order or claim to implement either Dreamer night action.

## productionCodeReviewed

Relevant definitions, validators, callers and replay paths were independently inspected in:

- `packages/domain-core/src/seamstress.ts`
  - tracked-role type and predicate;
  - tenure and transition fact records;
  - ID formatter/parser;
  - clone;
  - assignment bootstrap;
  - Snake Charmer fact adapter;
  - transition application;
  - active and continuous queries;
  - Seamstress ability reconciliation consumers.
- `packages/domain-core/src/rebuild.ts`
  - event-stream validation;
  - batch validation;
  - replay loop;
  - current post-rebuild audit boundary.
- `packages/domain-core/src/game-state.ts`
  - the sole existing `seamstressRoleTenureState` field.
- `packages/domain-core/src/event-applier.ts`
  - `CharactersAssigned` bootstrap;
  - `SnakeCharmerDemonSwapApplied` validation, current-state mutation and tenure reconciliation.
- `packages/domain-core/src/current-character-state.ts`
  - initial state derivation;
  - exact current-state validation;
  - revision and roster/setup correlation.
- `packages/domain-core/src/character-assignment.ts`
  - accepted fixed-model assignment validation;
  - unique player, seat and role requirements.
- `packages/domain-core/src/snake-charmer.ts`
  - canonical swap payload;
  - current role/alignment exchange;
  - payload validation;
  - stored swap history.
- `packages/domain-core/src/events.ts`
  - accepted event-envelope typing relevant to assignment and Snake Charmer swap.
- `packages/domain-core/src/errors.ts`
  - complete accepted `DomainErrorCode` union.
- `packages/domain-core/src/index.ts`
  - current root exports.
- Relevant role-tenure consumers in:
  - `clockmaker.ts`
  - `cerenovus.ts`
  - `mathematician-internal.ts`
  - `first-night-action-opportunity.ts`
  - `domain-batch-semantics.ts`
  - `first-night-ability-outcome-ledger.ts`

## testFilesReviewed

Existing relevant tests and call-site regressions were inspected in:

- `packages/domain-core/src/seamstress.test.ts`
- `packages/domain-core/src/rebuild.test.ts`
- `packages/domain-core/src/clockmaker.test.ts`
- `packages/domain-core/src/clockmaker-replay.test.ts`
- `packages/domain-core/src/cerenovus.test.ts`
- `packages/domain-core/src/cerenovus-replay.test.ts`
- relevant tenure references in the first-night opportunity, ledger and replay tests.

The proposed design enumerates exactly `D19T-001` through `D19T-030` and does not add Dreamer opportunity or delivery authority IDs.

## findings

### BLOCKER 1 — Accepted Dreamer coverage authority contradicts the design and user terminal contract

Evidence:

- `docs/rules/ROLE_COVERAGE_MATRIX.md` currently records Dreamer’s overall status as `PARTIAL`.
- Its accepted implementation evidence includes:
  - base target selection and GOOD/EVIL delivery;
  - base first-night action;
  - impaired delivery paths;
  - deterministic false-role behavior;
  - historical private projection.
- The reviewed design instead states:
  - `DreamerRoleCoverageAfterSlice: SKELETON`;
  - closeout must keep Dreamer at `SKELETON`;
  - completion requires Dreamer to remain `SKELETON`.
- The user authorization also requires the final report to say Dreamer coverage is `SKELETON`.

Impact:

- This Slice cannot truthfully downgrade accepted V1 implementation coverage from `PARTIAL` to `SKELETON`.
- It also cannot leave the matrix at `PARTIAL` while reporting `SKELETON`.
- `FOUNDATION` is a valid Slice-specific label, but it is not one of the matrix’s role-status values and does not replace the existing Dreamer role status.
- The reviewer cannot reinterpret or silently override the user’s explicit `SKELETON` requirement.

Required resolution:

- The user must explicitly clarify that:
  - Slice coverage is `FOUNDATION`;
  - rule evidence may describe the tenure mechanism as a skeleton/foundation;
  - the authoritative Dreamer role coverage in `ROLE_COVERAGE_MATRIX.md` remains `PARTIAL`;
  - the final report must not claim that the accepted Dreamer role is `SKELETON`.

This conflict requires human authorization and cannot be repaired solely by an architect Round 2 assumption.

### BLOCKER 2 — The frozen error contract cannot compile within the authorized production surface

Evidence:

- The design requires:
  - `DomainError("InvalidRoleTenureState", ...)` from duplicate active lookup;
  - `DomainError("InvalidRoleTenureState", reason)` from the replay auditor.
- `packages/domain-core/src/errors.ts` does not contain `InvalidRoleTenureState` in `DomainErrorCode`.
- The design authorizes production changes only in:
  1. `seamstress.ts`
  2. `role-tenure-replay.ts`
  3. `rebuild.ts`
- The user’s production-file ceiling is three.
- `errors.ts` is not in the authorized set.

Impact:

- Literal implementation of the reviewed design fails type checking.
- Adding the missing error code would require an unauthorized fourth production file.
- Casting around `DomainErrorCode` would weaken the type contract and is not acceptable.

Required design correction after the human coverage conflict is resolved:

- Round 2 must freeze one compile-valid strategy within the three-file ceiling:
  - use a specifically named existing `DomainErrorCode` consistently for these failures; or
  - replace the new internal module in the three-file allowlist with `errors.ts` and place the audit implementation inside the remaining authorized modules.
- The final design must enumerate the exact three production files and exact error code. The implementer must not choose between alternatives.

### BLOCKER 3 — Raw hostile state must be validated before cloning or normalization

Evidence:

- Current `applyRoleTenureTransitionFact` clones the supplied state before validation.
- `cloneRoleTenureState` reconstructs only known fields and can normalize away:
  - extra keys;
  - sparse-array evidence;
  - malformed enumerable structure.
- The design requires hostile extra keys, sparse arrays, duplicates and malformed state to fail closed, but only explicitly says to run exact validation after mutation.

Impact:

- An implementation following the current operation order could accept or normalize hostile input before validation.
- Post-clone validation is not equivalent to validating the caller-supplied runtime value.

Required Round 2 contract:

- `validateRoleTenureStateExact` must run on the original raw input before any clone, search or mutation.
- The design must freeze whether `undefined` is rejected or converted to the exact empty state for direct reconciliation.
- The post-mutation state must then be independently validated again.
- `findUniqueActiveRoleTenure` must likewise validate the raw state before searching.

### NON_BLOCKER 1 — Duplicate initial role IDs do not narrow the current accepted assignment model

The design’s duplicate-role rejection is compatible with accepted main:

- `validateCharacterAssignments` already requires exactly twelve assignments and rejects duplicate role IDs.
- Initial fixed-model setup therefore has one role assignment per role.
- Philosopher-gained abilities do not create duplicate initial character assignments.

Boundary:

- This is a product contract for the current fixed assignment model.
- It must not be presented as a universal BOTC rule covering all future scripts, special setup effects or character-change mechanisms.

### NON_BLOCKER 2 — Current Snake Charmer producer cannot reach Dreamer, and the design says so accurately

The current producer swaps:

- the current Snake Charmer or Philosopher holding its ability into the selected Demon;
- the selected Demon into the source’s current character.

It does not provide an accepted command path that changes a player into or out of Dreamer.

The design correctly limits `D19T-010` through `D19T-013` to shared reconciliation contract tests and forbids claiming current producer reachability. This limitation does not itself block the tenure foundation.

It does mean:

- no current accepted end-to-end history demonstrates a Dreamer transition;
- only future separately authorized producers can make the Dreamer branches reachable accepted history;
- pure caller-supplied transition facts remain non-authoritative.

### NON_BLOCKER 3 — Current accepted facts are sufficient for the bounded replay audit

For currently reachable accepted history, the combination of:

- the validated `CharactersAssigned` envelope;
- `GameState.assignment`;
- `GameState.currentCharacterState`;
- accepted `SnakeCharmerDemonSwapApplied` envelopes;
- `GameState.snakeCharmerDemonSwaps`;
- derived tenure state;

is sufficient to verify:

- exact initial tracked tenure derivation;
- every real current Snake Charmer transition fact;
- exact processed transition IDs;
- successor records;
- ending revisions;
- reverse orphan checks.

No new event payload or `GameState` field is required.

The audit must not claim provenance for hypothetical Dreamer transitions that no accepted event producer can currently create.

### NON_BLOCKER 4 — Canonical record ordering remains stable across reacquisition

The design freezes:

- records by acquisition revision, then seat;
- processed facts by source event sequence, then seat.

Because each accepted character-state transition increments revision and the existing Snake Charmer adapter sorts same-event facts by numeric seat, this ordering remains deterministic when a role is later reacquired. It does not depend on role name, locale or insertion-order comparison.

### NON_BLOCKER 5 — Nontracked-to-nontracked processed semantics are defined

The design explicitly requires a real nontracked-to-nontracked role-changing fact to:

- create no tenure record;
- still be processed exactly once;
- appear in the exact processed-ID audit;
- have no active tracked tenure at the previous revision;
- have no successor tenure.

This is necessary for bidirectional accepted-history audit and is not a second tenure system.

### NON_BLOCKER 6 — Scope and schema boundaries are otherwise correctly frozen

The design:

- adds only Dreamer to the existing tracked role domain;
- preserves the old public compatibility alias;
- preserves the existing `GameState` field;
- introduces no event or payload change;
- introduces no opportunity, target, delivery, ledger or projection behavior;
- does not implement Vortox, impairment or Philosopher-gained Dreamer;
- limits production work to three modules and at most 800 added production lines;
- keeps 2B19A1 unstarted.

## checklist

1. **Only add Dreamer tenure:** `PASS`, subject to the coverage-status blocker.
2. **No Dreamer opportunity or delivery:** `PASS`.
3. **No event payload change:** `PASS`.
4. **No second GameState tenure system:** `PASS`.
5. **One role domain across type, parser, bootstrap, transition and validator:** `PASS`.
6. **Accepted-history compatibility:** `PASS`; this is a derived-state expansion without event migration.
7. **Initial Dreamer tenure is provable:** `PASS`; the accepted assignment envelope supplies player, seat, role, event ID, sequence and revision-1 authority.
8. **Shared transition contract handles entering/leaving Dreamer:** `PASS_WITH_BOUNDARY`; pure reconciliation is provable, but current accepted producers cannot reach Dreamer and must not be described as doing so.
9. **Orphan and duplicate rejection:** `FAIL`; the intended checks are present, but the frozen error contract is not compile-valid and raw pre-clone validation order is not frozen.
10. **Current GameState plus accepted stream contains sufficient facts:** `PASS_WITH_BOUNDARY`; sufficient for current accepted transitions and reverse audit, not evidence of a reachable Dreamer-changing producer.
11. **Scale boundary remains bounded:** `PASS` for the reviewed layout, but the missing error code cannot be added as a fourth production file.
12. **2B19A1 remains unstarted:** `PASS`.

## verdict

`HUMAN_BLOCKED`

## remainingBlockers

1. `DREAMER_ROLE_COVERAGE_STATUS_CONFLICT`
   - accepted matrix: `PARTIAL`;
   - user/design required terminal status: `SKELETON`;
   - explicit user clarification is required.

2. `INVALID_ROLE_TENURE_STATE_ERROR_CODE_OUTSIDE_ALLOWED_PRODUCTION_SURFACE`
   - the design names a nonexistent error code;
   - the allowed three production files exclude `errors.ts`.

3. `RAW_ROLE_TENURE_STATE_PREVALIDATION_ORDER_NOT_FROZEN`
   - hostile input must be validated before clone/search/mutation and again after mutation.

No implementation branch, production edit, test edit or PR is authorized.

HUMAN_BLOCKED
