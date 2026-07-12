# Current Task

## Active Slice 2B18A

- Name: `First-Night Ability Outcome Ledger Foundation`.
- Status: `RUNNING` on `main`; no feature branch or PR exists.
- Recovery anchor: `b228dd53851a9bd947a41e39187db20735069402`; exact prior main CI `29180118996` was `SUCCESS`.
- Limits: `maxSlices=1`, `maxRepairRounds=2`, `maxDesignRounds=2`; repair round `0 / 2`, design round `2 / 2`.
- Candidate scope: `FIRST_NIGHT_ABILITY_OUTCOME_LEDGER_FOUNDATION`.
- Authorization gates: `ruleReady=true`, `ruleDesignPass=false`, `implementationAuthorized=false`.
- Four explicit user-approved simulator contracts were appended independently to `docs/rules/USER_OVERRIDES.md`: `BOTC-SIM-MATHEMATICIAN-FIRST-NIGHT-WINDOW-V1`, `BOTC-SIM-MATHEMATICIAN-OWN-ABILITY-EXCLUSION-V1`, `BOTC-SIM-MATHEMATICIAN-NUMERIC-DOMAIN-V1`, and `BOTC-SIM-MATHEMATICIAN-DUPLICATE-HOLDER-TEMPORAL-V1`.
- The approvals are fixed 12-player deterministic single-player product policies, not representations of official multi-holder or first-night dawn rulings.
- The immutable original conflict evidence `docs/rules/evidence/2B18.md` remains at SHA-256 `9f7564f4fe5be6399ec10ebc7475ab07f4e49c5aa5bcdb6752af61a928fdfa1a`.
- Complete resolved rule evidence is `docs/rules/evidence/2B18-resolved.md`, SHA-256 `7df3eb026e3db36ff7e29610207749d613646caaa2470c69fbe9afb2edc4811e`, terminal `RULE_READY`, coverage `PARTIAL`, and `unresolvedConflicts=[]`.
- The sole writer materialized the independent report verbatim; the independent integrity round-trip matched 26,320 UTF-8 bytes, 454 LF bytes, a trailing LF, first/last lines, and the complete SHA-256.
- All five original blockers are resolved for the bounded product scope: scheduling by accepted Slice 2B17.2, and the other four through the explicit approved simulator contracts.
- Round-1 independent review is `docs/implementation/phase-3-slice-2b18a-design-review-round-1.md`, SHA-256 `b5641d7207d488233ec5e2730f948a921cc9d3c0080cf7f182595bf151ddfb4c`, terminal `RULE_DESIGN_FIX_REQUIRED`.
- Architect round-2 design is `docs/implementation/phase-3-slice-2b18a-design.md`, SHA-256 `62a83e4f7161d8bf5bd9adda6c24e353edf7e0b6b4d752846e426c0f55e8cb59`, terminal `READY_FOR_RULE_DESIGN_REVIEW_ROUND_2`, coverage `PARTIAL`.
- The complete review and revised design preserve UTF-8/LF/trailing-LF boundaries and exact terminal lines.
- No production code, tests, feature branch, or PR has been created at this design gate.

## Strict Scope Boundary

Slice 2B18A may establish only the first-night ability outcome ledger foundation and a pure true-count resolver after all rule and design gates pass. It must not settle `MATHEMATICIAN_INFORMATION`, generate `MathematicianInformationDelivered`, or deliver a private Mathematician number. Slice 2B18B and Slice 2B19 are prohibited.

## Preserved Accepted Slice 2B17.3

- Name: `Legacy Philosopher No-Insertion Choice Compatibility`.
- Status: `COMPLETED` on `main`; current PR and slice are `null`.
- PR [#22](https://github.com/JackeyLovedas/botc-singleplayer/pull/22) merged at `139616d2706a193079bf779898b8adeb9f3d049a`.
- Final reviewed HEAD: `d6c567838419fc34b6e6406468899e55d46b2979`; implementation commit: `d564b1d49e919ab9dcc365560a8f4745fa39dc3f`.
- Accepted tag: `phase-3-slice-2b17-3-philosopher-legacy-no-insertion-compatibility`.
- Final verdicts: `CODE_REVIEW_PASS / RULE_REVIEW_PASS`; `ruleSemanticsChanged=false`; blockers `[]`.
- Product CI: push `29179615504`, pull request `29179616613`; merge CI: main `29179930675`, tag `29179940573`; all `SUCCESS`.
- Recovery anchor: `dbd8594326333f5e775de3f39c3625346cb80739`; prior exact-main CI `29178027479` was `SUCCESS`.
- Limits: `maxSlices=1`, `maxRepairRounds=2`; repair round `0 / 2`, design round `1 / 2`.
- Candidate scope: `LEGACY_PHILOSOPHER_NO_INSERTION_CHOICE_COMPATIBILITY`.
- This is a deterministic compatibility hotfix. Fresh external rule research is not required and `ruleSemanticsChanged=false`.
- Architect design: `docs/implementation/phase-3-slice-2b17-3-design.md`, SHA-256 `d7fee3c947fbfb1ab2e122531d9552c082a037ea5f66d0d44a6b0ff3b4f5264a`, terminal `READY_FOR_COMPATIBILITY_REVIEW`.
- Independent compatibility review: `docs/implementation/phase-3-slice-2b17-3-design-review.md`, repository-file SHA-256 `e24c3dc937cdf937f6eab8de4adbbf363fe28d1c990fde50db3cc3826d90849a`, verdict `COMPATIBILITY_DESIGN_PASS`, required fixes `None`, blockers `[]`.
- Final audit comments `4949964176` and `4949964254` are archived verbatim in `docs/reviews/`.

## Hotfix Contract

Legacy V1 choices with no first-night task mapping must grant and settle without attempting a V2 insertion. Legacy V1 choices with a mapped first-night task must retain the accepted fail-closed behavior. Current V2 behavior and scheduling remain unchanged.

## Preserved Slice 2B18 Conflict History

The immutable evidence retains its original `RULE_CONFLICT` conclusion and byte identity. Fresh independent research rechecked the official and Chinese sources, nightsheet, overrides, accepted scheduling prerequisite, current coverage, and role interactions. The resulting `2B18-resolved.md` returns `RULE_READY` without rewriting the historical conflict report.

## Current Gate

Commit and push only the round-1 review, round-2 design, and control documents and verify GitHub CI on the exact emitted main SHA. Then run a fresh independent round-2 rule-design review. Do not create a feature branch, production change, test, or PR until `RULE_DESIGN_PASS` authorizes implementation.
