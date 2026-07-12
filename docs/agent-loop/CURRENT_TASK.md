# Current Task

## Active Slice 2B18A

- Name: `First-Night Ability Outcome Ledger Foundation`.
- Status: `RUNNING` on `main`; no feature branch or PR exists.
- Recovery anchor: `b228dd53851a9bd947a41e39187db20735069402`; exact prior main CI `29180118996` was `SUCCESS`.
- Limits: `maxSlices=1`, `maxRepairRounds=2`, `maxDesignRounds=3`; repair round `0 / 2`, design round `3 / 3`.
- User continuation authorization: `USER_AUTHORIZED_DESIGN_ROUND_3_FOR_THREE_REVIEW_BLOCKERS`.
- Recovery anchor: `2d3afc65d44655cad10dd7137c49e783ce911b91`; exact CI `29185261934` was `SUCCESS`; worktree clean; open PR count `0`.
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
- Round-2 independent review is `docs/implementation/phase-3-slice-2b18a-design-review-round-2.md`, SHA-256 `004d80f4b806ccd108736223f32f86577864a0c355ef27cac2015d671ac6e730`, terminal `RULE_DESIGN_FIX_REQUIRED`.
- The round-2 reviewer examined exact HEAD `f2929b016b5bf3d052bed670f79d0751f3f0e1a2`; exact-head CI run `29185053326` was `SUCCESS` and the worktree was clean.
- Round-3 design is `docs/implementation/phase-3-slice-2b18a-design-round-3.md`, SHA-256 `08d23c8cdef156edd7a90f7f1ee8725ae7b6d29c3809d967343221c1d37eebe8`, terminal `READY_FOR_RULE_DESIGN_REVIEW_ROUND_3`, coverage `PARTIAL`.
- No production code, tests, feature branch, or PR has been created at this design gate.

## Authorized Design Round 3

The prior `designRound=2/2` ended without `RULE_DESIGN_PASS`. The user explicitly authorized one additional design round, now `3/3`, limited to these same three blockers:

1. The public resolver cannot prove that its supplied context is bound to the current canonical pre-resolution state.
2. `WitchDeathPendingMarked` is not explicitly frozen as the terminal exception to the marker-only no-fact rule.
3. The Dreamer/Vortox historical classification wording remains ambiguous.

Historical hashes remain fixed: original evidence `9f7564f4fe5be6399ec10ebc7475ab07f4e49c5aa5bcdb6752af61a928fdfa1a`; resolved evidence `7df3eb026e3db36ff7e29610207749d613646caaa2470c69fbe9afb2edc4811e`; round-2 design `62a83e4f7161d8bf5bd9adda6c24e353edf7e0b6b4d752846e426c0f55e8cb59`; round-2 review `004d80f4b806ccd108736223f32f86577864a0c355ef27cac2015d671ac6e730`.

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

Commit and push only the round-3 design plus accumulated recovery controls, require exact-head main CI success, then run independent round-3 review. Do not create production changes/tests/branch/PR or start 2B18B/2B19.
