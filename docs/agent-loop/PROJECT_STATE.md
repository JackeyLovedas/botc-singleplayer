# Project State

## Phase

- Phase 3 controlled vertical slices.
- Current control state: `RUNNING` on `main` for Slice 2B17.3; no active PR.
- Accepted slices: 2B13 through 2B17.2.
- Slice 2B17.2 merged through PR [#21](https://github.com/JackeyLovedas/botc-singleplayer/pull/21) at merge SHA `44248dc8172b59a994ceba13e91e1bc32cbe561a`.
- Final reviewed feature HEAD: `880c4c363dcde292493f2fbc6ebde20a0dfc09c9`.
- Final review: `CODE_REVIEW_PASS / RULE_REVIEW_PASS`, no blockers; repair round `2 / 2`.
- Accepted tag: `phase-3-slice-2b17-2-philosopher-gained-task-scheduling-v2`.
- Philosopher remains `PARTIAL`; Mathematician remains `SKELETON`; no role is `COMPLETE`.
- Slice 2B17.3 is a bounded compatibility hotfix for legacy Philosopher no-insertion choices. It requires no fresh external rule research and does not change rule semantics.
- Slice 2B18 remains `HUMAN_BLOCKED` on four conflicts; Slice 2B19 is prohibited and was not started.

## Active Slice 2B17.3 Boundary

Legacy V1 plans may accept Philosopher choices whose roles have no first-night insertion mapping, granting and settling without an insertion event. Mapped legacy choices remain fail-closed, while all accepted V2 task ordering and payload contracts remain unchanged. The startup gate has `maxSlices=1`, `maxRepairRounds=2`, repair round `0`, design round `0`, and `implementationAuthorized=false`.

## Slice 2B17.2 Accepted Boundary

The approved simulator strategy `BOTC-SIM-PHILOSOPHER-FIRST-NIGHT-SCHEDULING-V1` schedules supported Philosopher-gained first-night abilities at their normal character positions with base-first and deterministic gained-task tie-breaking. It is a product ordering policy, not a role-rule reinterpretation.

The accepted implementation uses `FirstNightTaskInsertedV2`, `first-night-task-plan-v2`, and distinct `first-night-v2:PHILOSOPHER_GAINED:*` IDs. It schedules five mapped gained roles at signed catalog positions, preserves accepted V1 replay, rejects V1/V2 generation mixing, rejects newly generated V1 plans at the application boundary, and retains existing role outcomes and projections. Gained Mathematician execution remains fail-closed and no Mathematician information semantics were implemented.

Rule evidence `docs/rules/evidence/2B17-2.md` has SHA-256 `ced6042dcfcbb2e14d86ef97c15b4c8bae2a263bd8aa30332a16b54683143eab` and terminal `RULE_READY`. The design and independent design review retain SHA-256 values `773c6df23cf40e83f9c1facd79719e7d992b3aa4cc6946910a78fe7bf5d7f9ed` and `5a4862b8a6538b1609171f9ba2e7ce2292c0aadedcefb225ea65c7abd28e3742`; the design verdict is `RULE_DESIGN_PASS`.

Local product gates passed 28 files / 907 tests with 86.06% statement/line, 80.21% branch, and 97.88% function coverage. The final complete independent review report has SHA-256 `120f006477d498221374685e62a56f31146b57253db5cb4602c201208318e769`. Its original code and rule audit comments are archived verbatim in `docs/reviews/pr-21-code-review-final.md` and `docs/reviews/pr-21-rule-review-final.md`.

## CI Provenance

- `productHeadCI`: exact final reviewed HEAD `880c4c363dcde292493f2fbc6ebde20a0dfc09c9`; push `29177463850`, pull request `29177464877`, both `SUCCESS`.
- `mergeCommitCI`: exact merge SHA `44248dc8172b59a994ceba13e91e1bc32cbe561a`; main push `29177743946`, accepted-tag push `29177757002`, both `SUCCESS`.
- `closeoutCommitCI`: GitHub checks attached to the exact emitted docs-only closeout commit; pending until that commit is pushed and independently observed.

## Preserved Slice 2B18 Block

Slice 2B17.2 resolves only original conflict 5, the deterministic scheduling prerequisite. The original `docs/rules/evidence/2B18.md` remains unchanged at SHA-256 `9f7564f4fe5be6399ec10ebc7475ab07f4e49c5aa5bcdb6752af61a928fdfa1a`. Four conflicts remain: first-night window definition, own-ability exclusion, candidate number domain, and duplicate Mathematician behavior.

Slice 2B18 remains unauthorized and requires a future explicit user rescope or approved rule interpretation. Do not automatically resume it. Slice 2B19 was not started.
