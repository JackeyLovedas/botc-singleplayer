# Current Task

## Phase 3 Slice 2B19T — HUMAN_BLOCKED

- Slice: `2B19T Canonical Dreamer Role-Tenure Prerequisite`.
- Authorization: `USER_AUTHORIZED_2B19T_CANONICAL_DREAMER_ROLE_TENURE_PREREQUISITE`.
- Scope mode: `CANONICAL_DREAMER_ROLE_TENURE_FOUNDATION`.
- Control status: `HUMAN_BLOCKED`.
- Current branch: `main`.
- Current PR: none.
- Limits: `maxSlices=1`, `maxDesignRounds=2`, `maxRepairRounds=2`.
- Rule gate: `RULE_READY`.
- Rule-design status: independent Round 1 review returned `HUMAN_BLOCKED`; `ruleDesignPass=false`.
- Implementation authorization: `false`.
- Design round: `1 / 2`.
- Repair round: `0 / 2`.
- Remaining blockers:
  - `DREAMER_ROLE_COVERAGE_STATUS_CONFLICT`
  - `INVALID_ROLE_TENURE_STATE_ERROR_CODE_OUTSIDE_ALLOWED_PRODUCTION_SURFACE`
  - `RAW_ROLE_TENURE_STATE_PREVALIDATION_ORDER_NOT_FROZEN`

## Rule delta evidence

- Evidence: `docs/rules/evidence/2B19T.md`.
- Evidence SHA-256: `b8c8b858ee3a7fb7fc141a1d28a0b385cf17111947caa397d569f9b79041185d`.
- Terminal verdict: `RULE_READY`.
- Rule coverage status: `SKELETON`.
- Implementation coverage label: `FOUNDATION`.
- Unresolved conflicts: `[]`.
- No new user override was added.

## Authorized boundary

This Slice may only add `dreamer` to the existing canonical role-tenure derived-state system. It may cover initial `CharactersAssigned` bootstrap, accepted character-transition entry and exit, canonical tenure ID parsing/formatting, active-tenure queries, exact validation, deterministic replay, and compatibility for the existing tracked role domain.

It must remain a `DERIVED_STATE_EXPANSION`. It does not authorize any event payload or event type change, a new `GameState` tenure field, a second tenure system, application-command behavior, projection, ledger behavior, Dreamer V2 opportunity, target, information delivery, candidate resolution, Vortox, impairment, Philosopher-gained Dreamer, first-night completion, DAY, or Phase 2C.

## Round 1 design authority

- Design: `docs/implementation/phase-3-slice-2b19t-design.md`.
- Design SHA-256: `0eca3f5d67fb1407b4ba9b0f27ef2914e57329f864b72e6a1effe49fff3f632a`.
- Terminal: `READY_FOR_RULE_DESIGN_REVIEW_ROUND_1`.
- Naming compatibility: scheme `B`; `CanonicalRoleTenureTrackedRoleId` is authoritative and `SeamstressRelevantRoleId` remains a compatibility alias.
- Classification: `DERIVED_STATE_EXPANSION`.
- Production allowlist: `packages/domain-core/src/seamstress.ts`, internal `packages/domain-core/src/role-tenure-replay.ts`, and `packages/domain-core/src/rebuild.ts`; hard ceiling 800 added production lines.
- No implementation is authorized by the design document itself.

## Independent Round 1 review

- Review: `docs/implementation/phase-3-slice-2b19t-design-review-round-1.md`.
- Review SHA-256: `e69c5e9ee04bbfdde9f408214045cb066cd6f6584ca710997121c916955af101`.
- Verdict and terminal: `HUMAN_BLOCKED`.
- The accepted role coverage matrix records Dreamer as `PARTIAL`, while the user authorization and Round 1 design require the final role status to be `SKELETON`; the controller cannot silently downgrade accepted coverage or reinterpret the user contract.
- The design names nonexistent `DomainErrorCode` value `InvalidRoleTenureState` while excluding `errors.ts` from the three-file production allowlist.
- The design does not freeze validation of raw hostile tenure state before clone/search/mutation and a second validation after mutation.
- Round 2 is not authorized and must not be inferred.

## Preserved state and stop boundary

- Accepted main is `ed403b2d732512b0a44b419dbb9eec15e4a7af42`; exact-head CI `29388105044` is `SUCCESS`.
- The 2B19A1 prerequisite blocker history remains preserved; 2B19A1 itself has not restarted.
- PR #25 and PR #26 remain closed and unmerged.
- No feature branch, implementation, production-code change, test change, commit, push, or PR exists for 2B19T at this gate.
- `2B19A1`, `2B19A2`, `2B19A3`, `2B19B`, FIRST_NIGHT/DAY continuation, and Phase 2C have not started.

## Required next action

Await explicit user clarification that authoritative Dreamer role coverage remains `PARTIAL`, Slice coverage is `FOUNDATION`, and the final report must not claim the role is `SKELETON`. Only after that clarification may the user authorize Round 2 to repair the exact error-code/three-file contract and raw-state prevalidation order. Do not infer or start Round 2, create a branch, modify production code or tests, or start 2B19A1.
