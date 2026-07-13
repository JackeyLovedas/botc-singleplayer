# Current Task

## Active Slice 2B18A

- Name: `First-Night Ability Outcome Ledger Foundation`.
- Status: `HUMAN_BLOCKED` on `phase-3/first-night-ability-outcome-ledger`; open PR [#23](https://github.com/JackeyLovedas/botc-singleplayer/pull/23) remains open, not merged, and not draft.
- Limits: `maxSlices=1`, `maxRepairRounds=3`, historical `maxDesignRounds=3`; final repair round `3 / 3`; `scopeMode=LEDGER_ONLY_RESCOPE`.
- Rescope authorization: `USER_AUTHORIZED_2B18A_LEDGER_ONLY_RESCOPE_AND_FINAL_REPAIR`.
- `behaviorDesignFrozen=true`; this is a scope reduction, not a rule or behavior redesign.
- Frozen product HEAD: `9c5d693fd4a2f0392a2deef8b4fba9436d0611a2`; exact push/PR CI `29218907974 / 29218909579` were `SUCCESS`. Base main is `89143b56ba7cb2e8c6aa6a2ce97c7a5dbe82794f`.
- Candidate scope: `FIRST_NIGHT_ABILITY_OUTCOME_LEDGER_FOUNDATION`.
- Authorization gates: `ruleReady=true`, prior Design 3.2 remains immutable history, ledger-only `scopeReviewVerdict=SCOPE_REVIEW_PASS`, and `implementationAuthorized=false` because final repair round `3 / 3` failed the dual final-review gate.
- Corrected ledger-only scope authority: `docs/implementation/phase-3-slice-2b18a-ledger-only-rescope.md`, SHA-256 `3415944f1a42bcaee8f0a7a990a6d8d148ad0169fea0a9e4697acfbfc9f44b44`, terminal `READY_FOR_SCOPE_REVIEW`.
- Scope review round 1: `docs/implementation/phase-3-slice-2b18a-ledger-only-scope-review-round-1.md`, SHA-256 `52e987c1709b429e43457bbe2b2008ba9bdd8e615f6d87e349da5a9aefe436cc`, reverse `MATCH`, verdict `SCOPE_REVIEW_FIX_REQUIRED`. Both docs-only blockers were corrected and round 2 passed.
- Scope review round 2: `docs/implementation/phase-3-slice-2b18a-ledger-only-scope-review-round-2.md`, SHA-256 `00177a72d33d9be71e3c281edaea908dd2e98b49509c6aa8d257260fc719967a`, reverse `MATCH`, verdict `SCOPE_REVIEW_PASS`, `remainingBlockers=[]`; it authorizes only the ledger-only repair on the existing branch and PR.
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
- Fresh round-3 review is `docs/implementation/phase-3-slice-2b18a-design-review-round-3.md`, SHA-256 `5d43e80a7591785b7825113a27bd7d1b9c7ff724eebfb78e32b403c785625d1b`, terminal `RULE_DESIGN_FIX_REQUIRED`.
- It reviewed exact HEAD `952199ff005182eb44a31de66837ba8f9e576d8d`; CI `29185767026` was `SUCCESS`, worktree clean, open PR count `0`.
- Design 3.1 contract completion is `docs/implementation/phase-3-slice-2b18a-design-round-3-1.md`, SHA-256 `97456a3769d29b616af31c1e83dc5b1717809ffbe5a56ab0d86decd800c9710c`, terminal `READY_FOR_RULE_DESIGN_REVIEW_ROUND_3_1`, coverage `PARTIAL`.
- Architect integrity verification returned `MATCH`: 44,929 UTF-8 bytes, 1,292 LF bytes, trailing LF, exact first/last lines and valid code-fence parity.
- Fresh Design 3.1 review is `docs/implementation/phase-3-slice-2b18a-design-review-round-3-1.md`, SHA-256 `0a4269be1b19a303fab1eb08e0bcd0c9212aed5ec4c2e068c3eb2e9502a99444`, terminal `RULE_DESIGN_FIX_REQUIRED`.
- It reviewed exact HEAD `5a40c04ec50224ce05b43588a54ac0d5253a5ffd`; CI `29187068406` was `SUCCESS`, worktree clean, open PR count zero.
- Design 3.2 is `docs/implementation/phase-3-slice-2b18a-design-round-3-2.md`, SHA-256 `615f4cb303cbcb6884f37cf6f46eb6733e1df631c68a9a3fa9085da26134d865`, terminal `READY_FOR_RULE_DESIGN_REVIEW_ROUND_3_2`, coverage `PARTIAL`.
- Architect reverse integrity verification returned `MATCH`: 49,803 UTF-8 bytes, 1,363 LF bytes, trailing LF, exact first/last lines, and 46 balanced code fences.
- Fresh Design 3.2 review is `docs/implementation/phase-3-slice-2b18a-design-review-round-3-2.md`, SHA-256 `8c4935ae4a63e4ea5262474b6b56e53e8ebdb729526987b704f05075f261f525`, terminal `RULE_DESIGN_PASS`, with `remainingBlockers=[]`.
- The reviewer examined exact HEAD `3dc10b4f030be7dd1c314c7a8981b24424bbd02b`; exact-head CI `29192916263` was `SUCCESS`, worktree clean, open PR count zero. Reviewer reverse materialization verification returned `MATCH` for 11,698 UTF-8 bytes, 212 LF bytes and trailing LF.
- Design 3.2 remains the immutable authority for retained ledger classifications. The ledger-only rescope document supersedes its resolver, count-result, resolving-context, and count-window-snapshot scope for 2B18A; behavior remains frozen.
- Final-review round 1 is archived verbatim at `docs/implementation/phase-3-slice-2b18a-final-review-round-1.md`, SHA-256 `4f41ea18c085f329e5631b456816447f14d62319a2f60527d0074d5532f6ef0f`, reviewer integrity `MATCH`. Verdicts are `CODE_REVIEW_FIX_REQUIRED / RULE_REVIEW_FIX_REQUIRED`, with 16 findings and 11 remaining blocker groups.
- Historical repair round 1 attempted those implementation groups with direct Snake Charmer and Dreamer/Vortox regressions, context/evidence/provenance/window/count validation, replay-boundary validation, projection sentinels, and PARTIAL traceability. Its resolver/context/count work is not current 2B18A authority. Historical local gates were typecheck/lint pass, `29 / 942` full tests pass, coverage `86.27%` statements/lines, `80.32%` branches, `97.44%` functions.
- Final-review round 2 is archived verbatim at `docs/implementation/phase-3-slice-2b18a-final-review-round-2.md`, SHA-256 `9d0cba21d7c5e5776794bfba99087d83d7d3968dcd468a57d6b07754dd8e15be`, reviewer integrity `MATCH`. Verdicts remain `CODE_REVIEW_FIX_REQUIRED / RULE_REVIEW_FIX_REQUIRED`, with six blocker groups; final repair round is `2 / 2`.
- Final repair local gates pass: ledger `17/17`, full `29 / 940`, coverage `86.30%` statements/lines, `80.22%` branches, `97.45%` functions, typecheck/lint pass. Canonical-source claims are limited to replay-boundary pre-event derivation; standalone validators are documented as structural/semantic.
- Final repair-2 review is archived verbatim at `docs/implementation/phase-3-slice-2b18a-final-review-round-3.md`, SHA-256 `04fcb8068fa1f4d62923f53881b66f3f574e2291652a4a5c2b9728fed0e7dde6`, reverse `MATCH`. It reviewed product HEAD `faf3b44714b62f7723ecb319e6d244a324215088` with push/PR CI `29195691651 / 29195693110` successful and returned `CODE_REVIEW_FIX_REQUIRED / RULE_REVIEW_FIX_REQUIRED` with six remaining blocker groups.
- The prior six blockers were: incomplete canonical insertion/plan/grant/opportunity chaining; incomplete V1/V2 generation and role-segment binding; unsupported accepted-history claims for caller-supplied state/ledger; incomplete role and impairment semantic cross-links; count validation without ledger recomputation; and missing adversarial regressions with overbroad PR/coverage claims.
- The user authorized only a ledger-only rescope and final repair round `3 / 3`. That authorization is exhausted. The public true-count resolver, count-result contract, number selection, delivery, private projection, and settlement remain deferred; no repair round 4, audit comments, merge, tag, 2B18B, or 2B19 is authorized.

## Historical Final Design Round 3.2

The prior behavioral and five contract-group blockers are closed. Fresh Design 3.1 review found the remaining canonical evidence-contract gaps:

1. `AbilityOutcomeEvidenceReference` lacks exact per-variant semantic cross-link requirements.
2. `DOMAIN_RECORD` lacks an exact `recordType` to canonical `recordId` source mapping.
3. `PLAYER_ROLE_AT_REVISION` lacks a frozen compound primary identity definition.

The user explicitly authorized one final Design 3.2 evidence-contract simplification round. All historical artifacts remain immutable: original evidence `9f7564f4fe5be6399ec10ebc7475ab07f4e49c5aa5bcdb6752af61a928fdfa1a`; resolved evidence `7df3eb026e3db36ff7e29610207749d613646caaa2470c69fbe9afb2edc4811e`; round-3 design/review `08d23c8...eebe8` / `5d43e80a...25d1b`; round-3.1 design/review `97456a37...710c` / `0a4269be...9444`.

## Strict Scope Boundary

Slice 2B18A may establish only the canonical derived first-night ability outcome ledger foundation and its replay anchor. The true-count resolver, count-result family, resolving context, and count-window snapshot are deferred in full to 2B18B. It must not settle `MATHEMATICIAN_INFORMATION`, generate `MathematicianInformationDelivered`, or deliver a private Mathematician number. Slice 2B18B and Slice 2B19 are prohibited and remain unstarted.

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

Fresh round-2 scope review returned `SCOPE_REVIEW_PASS` with no blockers for corrected scope SHA-256 `3415944f1a42bcaee8f0a7a990a6d8d148ad0169fea0a9e4697acfbfc9f44b44`. Repair-round-3 implementation and local gates completed at `29 files / 938 tests`, with coverage `86.22%` statements/lines, `80.28%` branches, and `97.55%` functions. Exact product-head push/PR CI `29218907974 / 29218909579` succeeded.

The complete independent final review is archived verbatim at `docs/implementation/phase-3-slice-2b18a-ledger-only-final-review-repair-round-3.md`, SHA-256 `041a420a8d7b43ae4f0f2cd733b9a5d518bf070d78299176f38ea61da379c7b9`. It reviewed `9c5d693fd4a2f0392a2deef8b4fba9436d0611a2` and returned `CODE_REVIEW_FIX_REQUIRED / RULE_REVIEW_FIX_REQUIRED` with four blockers: incomplete independent task-insertion-grant-opportunity binding/tests; missing anchor event-ID/start-sequence tamper enforcement/tests; missing direct adversarial ledger coverage; and overstated documentation traceability. Status is `HUMAN_BLOCKED`, `implementationAuthorized=false`, repair round remains `3 / 3`, and no further action is authorized without explicit user authority.
