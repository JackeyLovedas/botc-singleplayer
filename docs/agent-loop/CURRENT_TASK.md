# Current Task

## Active rule-ready candidate slice

- Control status: `RUNNING`.
- Current branch: `main`.
- Current PR: `null`.
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
- Design status: `READY_FOR_RULE_DESIGN_REVIEW_ROUND_3`.
- Round 1 review: `docs/implementation/phase-3-slice-2b18b-design-review-round-1.md`, SHA-256 `cf1e2ac0abbd805be3f0dae1eb8b9b3d30a5bb4c60d9303a4b8d7fad7125e9bf`.
- Round 1 verdict: `RULE_DESIGN_FIX_REQUIRED`.
- Round 2 review: `docs/implementation/phase-3-slice-2b18b-design-review-round-2.md`, SHA-256 `28760fb16ba32f120c714428e71af20583a10449cedf37e61e768cd000d7c0c3`.
- Round 2 verdict: `RULE_DESIGN_FIX_REQUIRED`.
- Design gate: `ruleDesignPass=false`; implementation remains unauthorized.
- `implementationAuthorized=false`.
- Historical Round 2 blockers pending Round 3 review closure (`remainingBlockers=2`):
  1. 冻结一个可由现有`validateDomainEventStream`、`validateDomainBatchSemantics`、`applyDomainEvent`和Layer B实际调用的非递归Layer A合同，或明确修改这些全局签名及完整调用迁移；不得继续同时要求逐事件applier取得未来settlement。
  2. 在完整设计权威中精确定义`TerminalAbilityOutcomeEventType`加入`MathematicianInformationDelivered`，并确认SOURCE_EVENT exact parser/validator、terminal adapter与stored replay共同使用该closed literal。
- Round 3 freezes three noninterchangeable trust layers, a per-event replay adapter, exact terminal-event union closure, and 225 mandatory numbered tests. It does not itself authorize implementation.
- Completed slices now include `2B18A`.
- No feature branch, production change, test change, commit, push, or PR is authorized.
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
- Not implemented: any public true-count resolver, `MathematicianCountResolution`, Mathematician number, candidate/final number selection, delivery, private count projection, or task settlement.
- `MATHEMATICIAN_INFORMATION` remains fail closed without receipt, domain event, settlement, or version advancement.
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

The fresh independent rule researcher confirmed all required Option A propositions and returned `RULE_READY`. The original `RULE_CONFLICT` remains immutable historical evidence, while the active unresolved-conflict list is empty. Independent Round 1 design review found eight contract blockers. Round 2 closed six, but its independent review retained two: the Layer A contract could not be called across the existing replay/event-applier shapes, and the closed terminal evidence union omitted `MathematicianInformationDelivered`. The user explicitly authorized Round 3 to adapt the replay architecture without changing behavior. The new authority separates command decision, prospective pair validation, and per-event replay into Layers A/B/C, and directly closes the terminal union. Both historical blockers remain pending until a fresh independent Round 3 reviewer returns `RULE_DESIGN_PASS`; implementation and Slice 2B19 remain prohibited.
