# Project State

## Phase

- Phase 3 controlled vertical slices.
- Active controlled candidate: Slice 2B17.2 Philosopher-gained first-night scheduling V2, scope `PHILOSOPHER_GAINED_FIRST_NIGHT_TASK_SCHEDULING_V2`.
- Current control state: `RUNNING` on `main`; no PR or feature branch; `RULE_READY` is recorded, while design and implementation gates remain false.
- Accepted: 2B13 through 2B17.1.
- Slice 2B17.1 merged through PR [#20](https://github.com/JackeyLovedas/botc-singleplayer/pull/20) at merge SHA `19923f4aa62c86cc2db995587d65b586fd365b8a`.
- Final reviewed feature HEAD: `9caaa07a9f3f50bdf8564e48bf50345fed976a4c`.
- Final review: `CODE_REVIEW_PASS / RULE_REVIEW_PASS`, `ruleSemanticsChanged=false`, no blockers; repair round `1 / 2`.
- Current branch: `main`; current slice `2B17.2`; no current PR.
- Clockmaker remains `PARTIAL`.
- Slice 2B19 is prohibited.

## CI Provenance

- `productHeadCI`: exact final reviewed HEAD `9caaa07a9f3f50bdf8564e48bf50345fed976a4c`; push `29151838214`, pull request `29151839311`, both `SUCCESS`.
- `mergeCommitCI`: exact merge SHA `19923f4aa62c86cc2db995587d65b586fd365b8a`; main push `29152171989`, accepted-tag push `29152177469`, both `SUCCESS`.
- `closeoutCommitCI`: live GitHub checks attached to the exact emitted docs-only closeout SHA; not inherited from either earlier commit.

## Accepted Boundary

The accepted slice covers the bounded base and Philosopher-gained first-night Clockmaker information pipeline, canonical Philosopher duplicate drunkenness, supported Snake Charmer settlement timing, effective Vortox false information, exact historical validation, and source-only projection. Registration, Travellers, death/revival, canonical poisoned Clockmaker, impaired Vortox, unsupported native counts, later-night acquisition, recurrence, general lifecycle machinery, free-form Storyteller choice, UI, Electron, and persistence remain unsupported.

## Accepted Hotfix Boundary

Slice 2B17.1 adds strict sparse/nonstandard-array rejection, hostile-input fail-closed behavior, key-order-independent canonical semantic comparison, and guarded stored-delivery reads. Rules, events, projections, unsupported mechanics, and Clockmaker's `PARTIAL` level are unchanged.

The approved simulator strategy `BOTC-SIM-PHILOSOPHER-FIRST-NIGHT-SCHEDULING-V1` schedules supported Philosopher-gained first-night abilities at their normal character positions with base-first and deterministic gained-task tie-breaking. It is a product ordering policy, not a role-rule reinterpretation.

Slice 2B17.2 evidence is `docs/rules/evidence/2B17-2.md`, SHA-256 `ced6042dcfcbb2e14d86ef97c15b4c8bae2a263bd8aa30332a16b54683143eab`, with terminal `RULE_READY`. This authorizes design review only; no implementation is authorized.

Slice 2B18 remains historical `HUMAN_BLOCKED`. Its immutable evidence is `docs/rules/evidence/2B18.md` (SHA-256 `9f7564f4fe5be6399ec10ebc7475ab07f4e49c5aa5bcdb6752af61a928fdfa1a`). Four conflicts remain: first-night window start, own-ability exclusion, false-number domain, and duplicate-holder behavior. Slice 2B19 was not started.
