# Project State

## Phase

- Phase 3 controlled vertical slices.
- Current control state: `HUMAN_BLOCKED` on `main` for Slice 2B18A after the explicitly authorized design round `3/3`; no active PR or feature branch.
- Accepted slices: 2B13 through 2B17.3.
- Slice 2B17.2 merged through PR [#21](https://github.com/JackeyLovedas/botc-singleplayer/pull/21) at merge SHA `44248dc8172b59a994ceba13e91e1bc32cbe561a`.
- Final reviewed feature HEAD: `880c4c363dcde292493f2fbc6ebde20a0dfc09c9`.
- Final review: `CODE_REVIEW_PASS / RULE_REVIEW_PASS`, no blockers; repair round `2 / 2`.
- Accepted tag: `phase-3-slice-2b17-2-philosopher-gained-task-scheduling-v2`.
- Philosopher remains `PARTIAL`; Mathematician remains `SKELETON`; no role is `COMPLETE`.
- Slice 2B17.3 is a bounded compatibility hotfix for legacy Philosopher no-insertion choices. It requires no fresh external rule research and does not change rule semantics.
- The four prior Slice 2B18 Mathematician gaps now have explicit user-approved deterministic simulator policies, pending fresh independent rule research and resolved evidence. Slice 2B18B and Slice 2B19 are prohibited and were not started.

## Active Slice 2B18A Boundary

Slice 2B18A is limited to `FIRST_NIGHT_ABILITY_OUTCOME_LEDGER_FOUNDATION`. Current gates are `ruleReady=true`, `ruleDesignPass=false`, and `implementationAuthorized=false`; design round is `2 / 2` and repair round is `0 / 2`. The recovery anchor is `b228dd53851a9bd947a41e39187db20735069402`, whose exact main CI run `29180118996` succeeded.

The approved product contracts define the exclusive `FirstNightInitialized` lower boundary and inclusive pre-resolution upper boundary, source-player plus ability-instance self-exclusion, the fixed dense numeric domain `0..11` with deterministic smallest-false product policy, and accepted V2 temporal ordering for duplicate holders. These are simulator policies and must remain distinct from official source claims.

The independent resolved evidence is `docs/rules/evidence/2B18-resolved.md`, SHA-256 `7df3eb026e3db36ff7e29610207749d613646caaa2470c69fbe9afb2edc4811e`, terminal `RULE_READY`, `PARTIAL`, with no unresolved rule conflicts. Its verbatim handoff was independently matched at 26,320 UTF-8 bytes, 454 LF bytes, and a trailing LF. All five original conflicts are resolved within the bounded product scope.

Round-1 independent review is `docs/implementation/phase-3-slice-2b18a-design-review-round-1.md`, SHA-256 `b5641d7207d488233ec5e2730f948a921cc9d3c0080cf7f182595bf151ddfb4c`, terminal `RULE_DESIGN_FIX_REQUIRED`. The complete round-2 architect revision is `docs/implementation/phase-3-slice-2b18a-design.md`, SHA-256 `62a83e4f7161d8bf5bd9adda6c24e353edf7e0b6b4d752846e426c0f55e8cb59`, terminal `READY_FOR_RULE_DESIGN_REVIEW_ROUND_2`, with coverage fixed at `PARTIAL`.

The round-2 independent report is `docs/implementation/phase-3-slice-2b18a-design-review-round-2.md`, SHA-256 `004d80f4b806ccd108736223f32f86577864a0c355ef27cac2015d671ac6e730`, terminal `RULE_DESIGN_FIX_REQUIRED`. It reviewed exact main HEAD `f2929b016b5bf3d052bed670f79d0751f3f0e1a2` with successful CI run `29185053326`.

The user explicitly authorized `USER_AUTHORIZED_DESIGN_ROUND_3_FOR_THREE_REVIEW_BLOCKERS`. Recovery main is `2d3afc65d44655cad10dd7137c49e783ce911b91`, CI `29185261934` `SUCCESS`, worktree clean, open PR count zero. Design round is now `3/3`; `ruleReady=true`, while `ruleDesignPass=false` and `implementationAuthorized=false`. The three retained blockers are canonical-state binding of the public resolver context, the Witch terminal-marker exception, and unambiguous Dreamer/Vortox historical classification.

The complete third-round design is `docs/implementation/phase-3-slice-2b18a-design-round-3.md`, SHA-256 `08d23c8cdef156edd7a90f7f1ee8725ae7b6d29c3809d967343221c1d37eebe8`, terminal `READY_FOR_RULE_DESIGN_REVIEW_ROUND_3`, coverage `PARTIAL`. It is a separate design authority and does not overwrite the round-2 historical file.

Fresh independent review is `docs/implementation/phase-3-slice-2b18a-design-review-round-3.md`, SHA-256 `5d43e80a7591785b7825113a27bd7d1b9c7ff724eebfb78e32b403c785625d1b`, terminal `RULE_DESIGN_FIX_REQUIRED`. Exact reviewed HEAD was `952199ff005182eb44a31de66837ba8f9e576d8d`; CI `29185767026` succeeded. The original three behavioral blockers are closed, but the sole round-3 authority still omits the complete internal context, evidence-reference, count-result, canonical ability-instance ID, and override exact-shape contracts. Because design round `3/3` is exhausted, the project is `HUMAN_BLOCKED` pending new explicit user authorization; no fourth round, implementation, 2B18B, or 2B19 may begin automatically.

This slice does not implement `SettleMathematicianInformation`, `MathematicianInformationDelivered`, private number delivery, `MATHEMATICIAN_INFORMATION` settlement, or final Vortox false-number delivery. The existing Mathematician task boundary remains fail-closed. No production code, tests, branch, or PR exists at this design gate.

## Slice 2B17.3 Accepted Boundary

Legacy V1 plans may accept Philosopher choices whose roles have no first-night insertion mapping, granting and settling without an insertion event. Mapped legacy choices remain fail-closed, while all accepted V2 task ordering and payload contracts remain unchanged. The architect design is `docs/implementation/phase-3-slice-2b17-3-design.md` at SHA-256 `d7fee3c947fbfb1ab2e122531d9552c082a037ea5f66d0d44a6b0ff3b4f5264a`. The complete independent review is `docs/implementation/phase-3-slice-2b17-3-design-review.md` with `COMPATIBILITY_DESIGN_PASS`, no fixes or Slice 2B17.3 blockers, and `ruleSemanticsChanged=false`. Implementation is authorized after exact-head main CI on the review gate.

The implementation changes only the V2 insertion builder's validation order: role mapping and the no-op return now precede plan/catalog/grant reads. Direct writable accepted-V1, duplicate DRUNK, five mapped-role no-write, builder hostile-input, V2 preservation, replay, batch, and projection regressions pass. Local gates pass 28 files / 923 tests with 86.09% statements/lines, 80.27% branches, and 97.88% functions.

PR #22 accepted implementation `d564b1d49e919ab9dcc365560a8f4745fa39dc3f` at final reviewed HEAD `d6c567838419fc34b6e6406468899e55d46b2979`, merge SHA `139616d2706a193079bf779898b8adeb9f3d049a`, and the accepted tag. Independent final review returned both pass verdicts with no blockers and unchanged rule semantics. Product and merge/tag CI all passed.

## Slice 2B17.2 Accepted Boundary

The approved simulator strategy `BOTC-SIM-PHILOSOPHER-FIRST-NIGHT-SCHEDULING-V1` schedules supported Philosopher-gained first-night abilities at their normal character positions with base-first and deterministic gained-task tie-breaking. It is a product ordering policy, not a role-rule reinterpretation.

The accepted implementation uses `FirstNightTaskInsertedV2`, `first-night-task-plan-v2`, and distinct `first-night-v2:PHILOSOPHER_GAINED:*` IDs. It schedules five mapped gained roles at signed catalog positions, preserves accepted V1 replay, rejects V1/V2 generation mixing, rejects newly generated V1 plans at the application boundary, and retains existing role outcomes and projections. Gained Mathematician execution remains fail-closed and no Mathematician information semantics were implemented.

Rule evidence `docs/rules/evidence/2B17-2.md` has SHA-256 `ced6042dcfcbb2e14d86ef97c15b4c8bae2a263bd8aa30332a16b54683143eab` and terminal `RULE_READY`. The design and independent design review retain SHA-256 values `773c6df23cf40e83f9c1facd79719e7d992b3aa4cc6946910a78fe7bf5d7f9ed` and `5a4862b8a6538b1609171f9ba2e7ce2292c0aadedcefb225ea65c7abd28e3742`; the design verdict is `RULE_DESIGN_PASS`.

Local product gates passed 28 files / 907 tests with 86.06% statement/line, 80.21% branch, and 97.88% function coverage. The final complete independent review report has SHA-256 `120f006477d498221374685e62a56f31146b57253db5cb4602c201208318e769`. Its original code and rule audit comments are archived verbatim in `docs/reviews/pr-21-code-review-final.md` and `docs/reviews/pr-21-rule-review-final.md`.

## CI Provenance

- `productHeadCI`: exact final reviewed HEAD `880c4c363dcde292493f2fbc6ebde20a0dfc09c9`; push `29177463850`, pull request `29177464877`, both `SUCCESS`.
- `mergeCommitCI`: exact merge SHA `44248dc8172b59a994ceba13e91e1bc32cbe561a`; main push `29177743946`, accepted-tag push `29177757002`, both `SUCCESS`.
- `closeoutCommitCI`: GitHub checks attached to the exact emitted docs-only closeout commit; pending until that commit is pushed and independently observed.

## Preserved Slice 2B18 Conflict History

Slice 2B17.2 resolved original conflict 5, the deterministic scheduling prerequisite. The original `docs/rules/evidence/2B18.md` remains unchanged at SHA-256 `9f7564f4fe5be6399ec10ebc7475ab07f4e49c5aa5bcdb6752af61a928fdfa1a`. Its four remaining conflicts are immutable historical findings; the four new `APPROVED` records are the user's explicit resolution policies. Fresh independent research has now returned `RULE_READY`; implementation remains unauthorized until the independent design gate returns `RULE_DESIGN_PASS`.
