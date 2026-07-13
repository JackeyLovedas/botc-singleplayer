# Project State

## Phase

- Phase 3 controlled vertical slices.
- Current control state: `RUNNING` on `phase-3/first-night-ability-outcome-ledger`; open PR [#23](https://github.com/JackeyLovedas/botc-singleplayer/pull/23) is in explicitly authorized final repair round `4 / 4` under `scopeMode=LEDGER_ONLY_RESCOPE`.
- Accepted slices: 2B13 through 2B17.3.
- Slice 2B17.2 merged through PR [#21](https://github.com/JackeyLovedas/botc-singleplayer/pull/21) at merge SHA `44248dc8172b59a994ceba13e91e1bc32cbe561a`.
- Final reviewed feature HEAD: `880c4c363dcde292493f2fbc6ebde20a0dfc09c9`.
- Final review: `CODE_REVIEW_PASS / RULE_REVIEW_PASS`, no blockers; repair round `2 / 2`.
- Accepted tag: `phase-3-slice-2b17-2-philosopher-gained-task-scheduling-v2`.
- Philosopher remains `PARTIAL`; Mathematician remains `SKELETON`; no role is `COMPLETE`.
- Slice 2B17.3 is a bounded compatibility hotfix for legacy Philosopher no-insertion choices. It requires no fresh external rule research and does not change rule semantics.
- The four prior Slice 2B18 Mathematician gaps now have explicit user-approved deterministic simulator policies, pending fresh independent rule research and resolved evidence. Slice 2B18B and Slice 2B19 are prohibited and were not started.

## Active Slice 2B18A Boundary

Slice 2B18A is limited to the derived first-night ability outcome ledger foundation and replay anchor only. The continuation authorization is `USER_AUTHORIZED_2B18A_LEDGER_ONLY_FINAL_REPAIR_ROUND_4`; `behaviorDesignFrozen=true`, `repairRound=4`, and `maxRepairRounds=4`. The public true-count resolver, `MathematicianCountResolution`, internal resolving context, and count-window snapshot remain deleted/deferred with number-domain execution, impairment output selection, Vortox final false number, delivery, private projection, and settlement. `implementationAuthorized=true` only for the four retained ledger blockers; repair round 5 is prohibited.

The frozen product HEAD is `9c5d693fd4a2f0392a2deef8b4fba9436d0611a2` against base main `89143b56ba7cb2e8c6aa6a2ce97c7a5dbe82794f`. Exact product-head push/PR CI `29218907974 / 29218909579` succeeded. PR #23 remains open and unmerged.

The corrected ledger-only authority is `docs/implementation/phase-3-slice-2b18a-ledger-only-rescope.md`, SHA-256 `3415944f1a42bcaee8f0a7a990a6d8d148ad0169fea0a9e4697acfbfc9f44b44`. Scope review round 1 is archived verbatim at `docs/implementation/phase-3-slice-2b18a-ledger-only-scope-review-round-1.md`, SHA-256 `52e987c1709b429e43457bbe2b2008ba9bdd8e615f6d87e349da5a9aefe436cc`, reverse `MATCH`, verdict `SCOPE_REVIEW_FIX_REQUIRED`. Its two docs-only blockers were corrected. Fresh round-2 review is `docs/implementation/phase-3-slice-2b18a-ledger-only-scope-review-round-2.md`, SHA-256 `00177a72d33d9be71e3c281edaea908dd2e98b49509c6aa8d257260fc719967a`, reverse `MATCH`, verdict `SCOPE_REVIEW_PASS`, blockers `[]`.

The ledger-only repair-round-3 implementation and local gates completed. It removes the deferred count/resolver/context/snapshot runtime contracts, reconstructs gained tasks from recorded insertion facts, strengthens structural BASE/V1/V2 identities, and keeps Mathematician information fail closed. It does not independently enforce or directly test the complete task-insertion-grant-opportunity subgraph, does not reject all required anchor identity/sequence tampering, and does not supply the full 59-case direct adversarial ledger coverage. Local gates passed: typecheck, lint, focused `15 / 182 / 209`, full `29 files / 938 tests`, coverage `86.22%` statements/lines, `80.28%` branches, `97.55%` functions.

The complete independent ledger-only final review is archived verbatim at `docs/implementation/phase-3-slice-2b18a-ledger-only-final-review-repair-round-3.md`, SHA-256 `041a420a8d7b43ae4f0f2cd733b9a5d518bf070d78299176f38ea61da379c7b9`. It reviewed exact product HEAD `9c5d693fd4a2f0392a2deef8b4fba9436d0611a2` and successful CI `29218907974 / 29218909579`, then returned `CODE_REVIEW_FIX_REQUIRED / RULE_REVIEW_FIX_REQUIRED` with four blockers. That HUMAN_BLOCKED state is now superseded only by the explicit Round 4 authorization; no repair round 5, premature audit comments, merge, tag, 2B18B, or 2B19 is authorized.

Round 4 local implementation closes the four authorized blocker groups in code and direct tests: full gained-opportunity binding, unique initialization-envelope provenance, the numbered direct adversarial matrix, and narrowed status/coverage claims. Typecheck and full lint pass; focused suites pass at ledger `46/46`, rebuild `193/193`, and application `209/209`; the full suite passes at `29 files / 980 tests`; coverage passes at `86.34%` statements/lines, `81.15%` branches, and `97.56%` functions. These are local implementation evidence only; exact-head CI and fresh independent dual-pass review remain required before acceptance or merge.

Final repair-round-2 local gates pass at `29 / 940` tests with `86.30%` statements/lines, `80.22%` branches, and `97.45%` functions. Canonical-source equality is enforced at the replay append boundary; standalone evidence/fact validators remain closed structural/semantic validation and do not claim independent event-store proof.

The complete final repair-2 review at `docs/implementation/phase-3-slice-2b18a-final-review-round-3.md` reviewed product HEAD `faf3b44714b62f7723ecb319e6d244a324215088` and successful exact-head CI `29195691651 / 29195693110`. It returned `CODE_REVIEW_FIX_REQUIRED / RULE_REVIEW_FIX_REQUIRED`; six canonical-chain, hostile-state, semantic-classification, count, and direct-test blocker groups remain. `implementationAuthorized=false`; no further repair, pass audit comment, merge, tag, 2B18B, or 2B19 is permitted without explicit new user authority or rescope.

The approved product contracts define the exclusive `FirstNightInitialized` lower boundary and inclusive pre-resolution upper boundary, source-player plus ability-instance self-exclusion, the fixed dense numeric domain `0..11` with deterministic smallest-false product policy, and accepted V2 temporal ordering for duplicate holders. These are simulator policies and must remain distinct from official source claims.

The independent resolved evidence is `docs/rules/evidence/2B18-resolved.md`, SHA-256 `7df3eb026e3db36ff7e29610207749d613646caaa2470c69fbe9afb2edc4811e`, terminal `RULE_READY`, `PARTIAL`, with no unresolved rule conflicts. Its verbatim handoff was independently matched at 26,320 UTF-8 bytes, 454 LF bytes, and a trailing LF. All five original conflicts are resolved within the bounded product scope.

Round-1 independent review is `docs/implementation/phase-3-slice-2b18a-design-review-round-1.md`, SHA-256 `b5641d7207d488233ec5e2730f948a921cc9d3c0080cf7f182595bf151ddfb4c`, terminal `RULE_DESIGN_FIX_REQUIRED`. The complete round-2 architect revision is `docs/implementation/phase-3-slice-2b18a-design.md`, SHA-256 `62a83e4f7161d8bf5bd9adda6c24e353edf7e0b6b4d752846e426c0f55e8cb59`, terminal `READY_FOR_RULE_DESIGN_REVIEW_ROUND_2`, with coverage fixed at `PARTIAL`.

The round-2 independent report is `docs/implementation/phase-3-slice-2b18a-design-review-round-2.md`, SHA-256 `004d80f4b806ccd108736223f32f86577864a0c355ef27cac2015d671ac6e730`, terminal `RULE_DESIGN_FIX_REQUIRED`. It reviewed exact main HEAD `f2929b016b5bf3d052bed670f79d0751f3f0e1a2` with successful CI run `29185053326`.

The user explicitly authorized `USER_AUTHORIZED_DESIGN_ROUND_3_FOR_THREE_REVIEW_BLOCKERS`. Recovery main is `2d3afc65d44655cad10dd7137c49e783ce911b91`, CI `29185261934` `SUCCESS`, worktree clean, open PR count zero. Design round is now `3/3`; `ruleReady=true`, while `ruleDesignPass=false` and `implementationAuthorized=false`. The three retained blockers are canonical-state binding of the public resolver context, the Witch terminal-marker exception, and unambiguous Dreamer/Vortox historical classification.

The complete third-round design is `docs/implementation/phase-3-slice-2b18a-design-round-3.md`, SHA-256 `08d23c8cdef156edd7a90f7f1ee8725ae7b6d29c3809d967343221c1d37eebe8`, terminal `READY_FOR_RULE_DESIGN_REVIEW_ROUND_3`, coverage `PARTIAL`. It is a separate design authority and does not overwrite the round-2 historical file.

Fresh independent review is `docs/implementation/phase-3-slice-2b18a-design-review-round-3.md`, SHA-256 `5d43e80a7591785b7825113a27bd7d1b9c7ff724eebfb78e32b403c785625d1b`, terminal `RULE_DESIGN_FIX_REQUIRED`. Exact reviewed HEAD was `952199ff005182eb44a31de66837ba8f9e576d8d`; CI `29185767026` succeeded. The original three behavioral blockers are closed, but the sole round-3 authority still omits the complete internal context, evidence-reference, count-result, canonical ability-instance ID, and override exact-shape contracts.

The user explicitly authorized design round `3.1` for contract completion only. `behaviorDesignFrozen=true`; `ruleReady=true`, `ruleDesignPass=false`, and `implementationAuthorized=false`. Recovery main is `37ae6407e8090a1892bbbc3c369ed9146d1477f7`, CI `29186059369` `SUCCESS`, worktree clean, open PR count zero.

Design 3.1 is `docs/implementation/phase-3-slice-2b18a-design-round-3-1.md`, SHA-256 `97456a3769d29b616af31c1e83dc5b1717809ffbe5a56ab0d86decd800c9710c`, terminal `READY_FOR_RULE_DESIGN_REVIEW_ROUND_3_1`, coverage `PARTIAL`. It completes the internal context, evidence reference structure, count result, canonical instance ID, override exact-shape, validation and export contracts without changing frozen behavior. Architect integrity verification returned `MATCH`.

Fresh Design 3.1 review is `docs/implementation/phase-3-slice-2b18a-design-review-round-3-1.md`, SHA-256 `0a4269be1b19a303fab1eb08e0bcd0c9212aed5ec4c2e068c3eb2e9502a99444`, terminal `RULE_DESIGN_FIX_REQUIRED`. Exact reviewed HEAD `5a40c04ec50224ce05b43588a54ac0d5253a5ffd` had successful CI `29187068406`. Remaining blockers are the missing per-variant evidence semantic cross-links, missing `DOMAIN_RECORD.recordType` to canonical `recordId` source mapping, and missing compound identity for `PLAYER_ROLE_AT_REVISION`.

The user explicitly authorized `DESIGN_ROUND_3_2_EVIDENCE_CONTRACT_SIMPLIFICATION` as the final design-completion round. `behaviorDesignFrozen=true`, `finalDesignCompletionRound=true`, `ruleReady=true`, `ruleDesignPass=false`, and `implementationAuthorized=false`. Recovery main is `bd74093280bff1ba7b0027552045c7a78e3c44a6`, CI `29187357426` `SUCCESS`, worktree clean, open PR count zero.

Design 3.2 is `docs/implementation/phase-3-slice-2b18a-design-round-3-2.md`, SHA-256 `615f4cb303cbcb6884f37cf6f46eb6733e1df631c68a9a3fa9085da26134d865`, terminal `READY_FOR_RULE_DESIGN_REVIEW_ROUND_3_2`, coverage `PARTIAL`. It removes the generic `DOMAIN_RECORD`, freezes 16 strong evidence variants, their canonical identities, per-variant cross-links, terminal minimum/conditional evidence sets, and the compound `(playerId, characterStateRevision)` identity without changing frozen behavior. Architect reverse verification returned `MATCH` for 49,803 UTF-8 bytes, 1,363 LF bytes, trailing LF, exact first/last lines, and balanced code fences.

Fresh independent review is `docs/implementation/phase-3-slice-2b18a-design-review-round-3-2.md`, SHA-256 `8c4935ae4a63e4ea5262474b6b56e53e8ebdb729526987b704f05075f261f525`, terminal `RULE_DESIGN_PASS`, `remainingBlockers=[]`. It reviewed exact HEAD `3dc10b4f030be7dd1c314c7a8981b24424bbd02b` with CI `29192916263` `SUCCESS`; the materialized report independently matched 11,698 UTF-8 bytes, 212 LF bytes and trailing LF. Design 3.2 is now the sole implementation authority, with frozen behavior and no Design 3.3.

The bounded implementation now provides the derived ledger, closed evidence contracts, terminal adapters, deterministic rebuild, and state-only true-count foundation. Full local validation is `29 files / 935 tests`; coverage is `86.20%` statements/lines, `80.29%` branches, and `96.96%` functions. It does not implement `SettleMathematicianInformation`, `MathematicianInformationDelivered`, private number delivery, `MATHEMATICIAN_INFORMATION` settlement, or final Vortox false-number delivery. The existing application Mathematician task boundary remains fail-closed.

Final-review round 1 on frozen HEAD `245e32f85e3a553c6d5302aa0b4bd434b0a3490c` returned `CODE_REVIEW_FIX_REQUIRED / RULE_REVIEW_FIX_REQUIRED`. The complete report is `docs/implementation/phase-3-slice-2b18a-final-review-round-1.md`, SHA-256 `4f41ea18c085f329e5631b456816447f14d62319a2f60527d0074d5532f6ef0f`, reverse integrity `MATCH`. All 16 findings and 11 blocker groups must be repaired without changing accepted contracts or expanding scope.

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
