# Current Task

## Active rule-ready candidate slice

- Control status: `REPAIR_ROUND_1_READY_TO_PUBLISH / UNACCEPTED`.
- Current branch: `phase-3/mathematician-first-night-information`.
- Current PR: [#24](https://github.com/JackeyLovedas/botc-singleplayer/pull/24), open and non-draft.
- Current slice: `2B18B`.
- Candidate role: `mathematician`.
- Candidate scope: `FIRST_NIGHT_COUNT_RESOLUTION_INFORMATION_DELIVERY_PRIVATE_PROJECTION`.
- Rule gate: `RULE_READY`; `ruleReady=true`.
- Current rule evidence: `docs/rules/evidence/2B18B-resolved.md`, SHA-256 `0c4893de8f38dfc05876f89744976a7c54afc6bd41465f2e1198d22b0844a4c8`.
- Historical conflict evidence remains `docs/rules/evidence/2B18B.md`, SHA-256 `eae53e0eed5d54c5c4a78d31543749787359f61b2e9b7c3f0ceb27069d2471c1`.
- Authorized resolution: `OPTION_A_LEGACY_V1_GAINED_MATHEMATICIAN_ONLY_WITHOUT_BASE_TASK`.
- Resolution evidence: `docs/rules/evidence/2B18B-resolved.md`, SHA-256 `0c4893de8f38dfc05876f89744976a7c54afc6bd41465f2e1198d22b0844a4c8`.
- Resolution kind: `IMPLEMENTATION_SUPPORT_BOUNDARY`; no rule override or simulator-policy change was added.
- Resolution gate: `RULE_READY`; active `unresolvedConflicts=[]`.
- Design continuation authorization: `USER_AUTHORIZED_2B18B_DESIGN_ROUND_3_REPLAY_ADAPTER`.
- Design round: `3 / 3`.
- Current design: `docs/implementation/phase-3-slice-2b18b-design-round-3.md`, SHA-256 `066be05f5ee8c0fccb83b00fd8471e439e7e6d2c8c8366af8c86aebceac0a792`.
- Design status: `RULE_DESIGN_PASS`.
- Round 1 review: `docs/implementation/phase-3-slice-2b18b-design-review-round-1.md`, SHA-256 `cf1e2ac0abbd805be3f0dae1eb8b9b3d30a5bb4c60d9303a4b8d7fad7125e9bf`.
- Round 1 verdict: `RULE_DESIGN_FIX_REQUIRED`.
- Round 2 review: `docs/implementation/phase-3-slice-2b18b-design-review-round-2.md`, SHA-256 `28760fb16ba32f120c714428e71af20583a10449cedf37e61e768cd000d7c0c3`.
- Round 2 verdict: `RULE_DESIGN_FIX_REQUIRED`.
- Round 3 review: `docs/implementation/phase-3-slice-2b18b-design-review-round-3.md`, SHA-256 `a05dc0fcb3959863448620b7b064bef38db95987b92708475f77eaf34e308808`.
- Round 3 reviewed HEAD: `0c5cac5d2db26d70a7983bf3790637c9f2ac252d`; exact GitHub Actions run `29243702315` completed `SUCCESS`.
- Round 3 verdict: `RULE_DESIGN_PASS`; `remainingBlockers=[]`.
- Design gate: `ruleDesignPass=true`.
- `implementationAuthorized=true` for the bounded reviewed Round 3 authority only.
- Round 3 freezes three noninterchangeable trust layers, a per-event replay adapter, exact terminal-event union closure, and 225 mandatory numbered tests.
- Completed slices now include `2B18A`.
- Published implementation head `8b273eec34502906d6c2aa12031c4065ec97725c` completed exact-head push CI `29251259989` and PR CI `29251425251`, both `SUCCESS`. Independent final review returned `CODE_REVIEW_FIX_REQUIRED / RULE_REVIEW_FIX_REQUIRED`. The complete immutable report is `docs/implementation/phase-3-slice-2b18b-final-review-repair-round-1.md`, SHA-256 `6933ce65cd6b6a149fa8eaa18d2a6246fd6862080e1b34c65b8dbb24a78e4157`.
- Repair round is `1 / 2`. The sole writer has locally closed all ten reviewed blocker groups without changing rule semantics, Option A, V1 order, public resolver boundaries, or scope. The repair remains uncommitted and has no new exact-head CI or independent verdict.
- Final repair local gates pass: Math `422 / 422`; focused `8 files / 1020 tests`; full and coverage `30 files / 1408 tests`; coverage `86.78%` statements/lines, `81.52%` branches, `97.78%` functions; typecheck and full lint pass. All 224 locally executable authority IDs and the repair-contract regressions are covered. `Original-140` passed for the old frozen head but must be rerun for the future repair head.
- Exact semantic traceability is `docs/implementation/phase-3-slice-2b18b-test-traceability.md`; runner count remains supporting evidence only and does not replace exact authority mapping.
- Next action is final diff/control validation, then one attributed repair commit and normal push to the existing PR #24. Require fresh exact-head push/PR CI before a new independent final review. Do not create another branch, merge, or start 2B19.
- Slice 2B19 has not started and remains prohibited.

## Accepted Slice 2B18A

- Name: `First-Night Ability Outcome Ledger Foundation`.
- Scope mode: `LEDGER_ONLY_RESCOPE`.
- Final repair: `5 / 5` under `USER_AUTHORIZED_2B18A_GAINED_OPPORTUNITY_REVISION_MICROFIX`; no repair round 6 exists.
- PR [#23](https://github.com/JackeyLovedas/botc-singleplayer/pull/23) merged at `2026-07-13T05:47:40Z`.
- Frozen feature HEAD: `671622b9f368a6201840ea0cb3d5b8254065bff8`.
- Merge SHA: `00a12062e2dc7a99ef01b2fbddc3a5dc4d666fa6`.
- Accepted tag: `phase-3-slice-2b18a-first-night-ability-outcome-ledger`.
- Final verdicts: `CODE_REVIEW_PASS / RULE_REVIEW_PASS`; `remainingBlockers=[]`.
- Final review archives: `docs/reviews/pr-23-code-review-final.md` and `docs/reviews/pr-23-rule-review-final.md`.

## Accepted boundary

- Accepted: canonical derived first-night ability outcome ledger foundation, initialization-envelope replay provenance, supported terminal adapters, BASE/V1/V2 identities, and exact gained V1/V2 terminal action-opportunity revision binding to the Philosopher task/choice/grant/insertion/original-opportunity/ability-instance chain.
- Accepted historical behavior: canonical gained revision `N` may precede evaluated revision `M`; direct V1/V2 positives use `N=2 < M=3`, and stale, later, and future mismatches are rejected.
- Local unaccepted implementation now includes the internal complete-stream decision, exact count/candidate selection, delivery, terminal fact, settlement, trusted replay, and accepted-stream private count projection. No public caller-state or caller-ledger truth resolver exists.
- Remaining completion work is repair commit/push to existing PR #24, fresh frozen exact-head cross-platform CI, and a new complete independent review; accepted main remains the 2B18A boundary until merge.
- Mathematician remains `PARTIAL`; no role is `COMPLETE`.

## CI provenance

- `productHeadCI`: frozen feature HEAD push `29226220051` and pull-request `29226221291`, both `SUCCESS`.
- `mergeCommitCI`: merge-main push `29227191271` and accepted-tag push `29227406815`, both `SUCCESS` for merge SHA `00a12062e2dc7a99ef01b2fbddc3a5dc4d666fa6`.
- `closeoutCommitCI`: pending the future exact docs-only closeout commit SHA and its GitHub run. This file cannot self-reference that future SHA or run, and no earlier CI result is inherited.

## Preserved conflict and authorized Option A

Accepted legacy V1 scheduling fixes Philosopher-gained Mathematician before base Mathematician when both coexist, while the approved duplicate-holder temporal override requires base first and gained afterward. Accepted V1 cannot be migrated or reordered; skipping it violates canonical next-task ordering, following it violates base-first, and rejecting it violates this slice's mandatory V1 support.

The original `RULE_CONFLICT` finding above remains immutable history. The user has now selected Option A as a product support boundary:

- V1 base-only remains settlement-supported.
- V1 gained-only remains settlement-supported at its recorded V1 position.
- V1 base plus gained remains replay-compatible but is not settlement-supported; it must fail closed before either Mathematician delivery.
- V2 remains the only supported duplicate-holder settlement generation and retains base-first, gained-later ordering.
- V1 is neither reordered nor migrated, and gained-first is not granted new rule authority.

The fresh independent rule researcher confirmed all required Option A propositions and returned `RULE_READY`. The original `RULE_CONFLICT` remains immutable historical evidence, while the active unresolved-conflict list is empty. Independent Round 1 design review found eight contract blockers. Round 2 closed six, but its independent review retained two: the Layer A contract could not be called across the existing replay/event-applier shapes, and the closed terminal evidence union omitted `MathematicianInformationDelivered`. The user explicitly authorized Round 3 to adapt the replay architecture without changing behavior. The new authority separates command decision, prospective pair validation, and per-event replay into Layers A/B/C, and directly closes the terminal union. Fresh independent review returned `RULE_DESIGN_PASS` and closed both historical blockers. Bounded 2B18B implementation is authorized; Slice 2B19 remains prohibited.
