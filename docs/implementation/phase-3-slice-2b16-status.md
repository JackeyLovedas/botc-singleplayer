# Phase 3 Slice 2B16 Status: Repair Round 1

## Status

PR [#18](https://github.com/JackeyLovedas/botc-singleplayer/pull/18) remains open on `phase-3/cerenovus-first-night-madness-marker`. Complete final review of frozen HEAD `86d973485e940c0ef0469dd169db3ab1dc7a417d` returned both `CODE_REVIEW_FIX_REQUIRED` and `RULE_REVIEW_FIX_REQUIRED` at `2026-07-11T12:02:08+08:00`.

Repair round is `1 / 2`. Repair commit `fa149336c1b70d879cfe082546fba8880746a0ab` is pushed to PR #18. This bookkeeping commit will become the final docs HEAD, which is pending until commit creation. Merge remains unauthorized; exact final-HEAD CI and a new complete independent final review are required.

## Renewed Rule Design Pass

- Review: `docs/implementation/phase-3-slice-2b16-repair-round-1-design-review.md`.
- Review SHA-256: `363271a48ae4f2595ef7287e850d8a38b4fa1b94e42f97b6b15b25d5de9da645`.
- Reviewed evidence: `5204b8995a40b8cee237f2b004f59f16e0751667ffdd3b9b5691265f425d9cb0`.
- Reviewed design: `858698463994f4c6a70911fc4255a42a4b77691b1e5dae1cbab437c7d5fd3c9b`.
- Verdict: `RULE_DESIGN_PASS`; remaining blockers `[]`.
- The reviewer corrected one report-only nightsheet hash typo and reverse-verified that no other report byte changed.

## Targeted Current-Design Revalidation

- Current design SHA-256: `743affb3d47d0a16fc25b849b1dbe97bf9af07c9ff000cd793a61a5268300a12`.
- Revalidation artifact: `docs/implementation/phase-3-slice-2b16-repair-round-1-design-revalidation.md`.
- Revalidation SHA-256: `643e1e1a5dee2030cf8205594f9a08a7f2415c514ea0466d35b988ec1874b34c`.
- Verdict: `RULE_DESIGN_PASS`; `remainingBlockers = []`.
- Reviewer reverse comparison: exact match; 3,038 bytes, 49 logical lines / LF bytes, zero CR, UTF-8 valid, no BOM, terminal LF present, transport markers omitted.
- Only traceability row 62 changed: it now names the existing byte-unchanged CI workflow and keeps repaired-HEAD Ubuntu/Windows runs pending until an authorized push.
- The revalidation is design-only and does not replace the required independent final implementation review.

## Review And CI Invalidation

- Historical final-review report: `docs/implementation/phase-3-slice-2b16-final-review-round-1.md`.
- Report SHA-256: `7af520124ee01a5c195ca5d1aecd146a86b5ed109ef8ba4795c5be4847e0ab3c`.
- Frozen-head push CI `29138672803` and PR CI `29138673732` succeeded for `86d9734...`.
- Those CI results and the old final review are historical only and cannot authorize a repaired head.
- Any repaired commit requires fresh exact-head Ubuntu/Windows CI, a new complete final review, and new/reverified verbatim code/rule audit comments.

## Four Final-Review Blockers

1. Choice replay did not bind every source player, seat, role, ability-source, tenure, and ability-instance fact to the referenced opportunity; capability evaluation used payload source instead of validated opportunity source.
2. Marker and instruction shape validators could reach formatter calls with non-string/noncanonical opportunity IDs.
3. The PR overstated completion and traceability of the reviewed 62-item plan; direct Cerenovus replay, batch, prospective, actor, target, stored-chain, metadata, and retry tests are missing.
4. Rule evidence did not use every mandatory heading and lacked explicit sourced `VortoxRules` and `alignmentChangeRules`.

## Corrected Rule Evidence

- Evidence SHA-256: `5204b8995a40b8cee237f2b004f59f16e0751667ffdd3b9b5691265f425d9cb0`.
- Every mandatory heading is explicit.
- Official Vortox oldid `3017`, UTF-8 SHA-256 `4630f76e5bf06ee9e9990854708fabed2a25b9d3c6ea170e2fd4598ef5f5cf07`.
- Chinese Vortox oldid `6198`, UTF-8 SHA-256 `36716eb890bd93b2fed5d27f67ccdc6c7a13fa67900a4a11a685580c0c3608ff`.
- Required regressions: 27 sequential items.
- `ruleCoverageStatus = PARTIAL`.
- Terminal rule verdict: `RULE_READY`.

## Corrected Repair Design

- Superseded pre-row-62-correction design SHA-256: `858698463994f4c6a70911fc4255a42a4b77691b1e5dae1cbab437c7d5fd3c9b`.
- Current design SHA-256: `743affb3d47d0a16fc25b849b1dbe97bf9af07c9ff000cd793a61a5268300a12`.
- Prior design `7c1c2bd...` and review `5d1c60eb...` are superseded for implementation authorization.
- Effective-only event names and settlement outcome are unchanged.
- The repair binds all outer source fields to opportunity, task, stored tenure, parsed tenure, ability instance, and current source.
- Application, batch, and replay capability evaluation must use `opportunity.sourcePlayerId`.
- Canonical opportunity ID and recipient seat checks must precede formatter calls and return invalid without throwing for hostile primitives.
- Replay, batch, prospective, and projection validation must reject forged source chains, hostile values, missing/duplicate/reordered/mixed facts, wrong metadata, and actual-source impairment conflicts.
- The 62-item minimum plan is retained and mapped item-by-item to exact planned test file and test name.
- Terminal design status: `READY_FOR_RULE_DESIGN_REREVIEW`.

## Vortox And Alignment Conclusions

- Vortox false-information rules apply to Townsfolk abilities; Cerenovus is a Minion.
- No sourced rule transforms the Cerenovus selected character, marker, identity shown to the target, or instruction.
- Character type, not a holder’s current alignment, controls ordinary selected-character legality.
- An evil Townsfolk/Outsider remains legal; a good Minion/Demon does not become ordinarily legal.
- No Vortox or alignment-change runtime is implemented. Both remain explicitly out of scope and incomplete.

## Test Traceability Status

The 63 locally resolvable matrix rows now resolve to their designated test or status record. Direct suites include 52 Cerenovus domain tests, 10 Cerenovus replay tests, 13 Cerenovus projection tests, and the exact application/rules regressions named by the matrix. Full local test and coverage runs each passed 24 files / 821 tests. Matrix item 62 uses the existing byte-unchanged `.github/workflows/ci.yml` and remains pending as exact repaired-HEAD Ubuntu/Windows results until the authorized repaired commit is pushed; local success is not substituted for CI evidence.

Trace item 27 includes direct replay coverage for independently and jointly forged source provenance. Trace item 43 separately covers hostile payload primitives in domain-core and sparse stored-chain collections in projections.

## Explicitly Unsupported

- Drunk/poison simulation and any impairment producer/import/injection.
- Vortox runtime and alignment-change runtime.
- Character/life/effect lifecycle, marker removal/expiry, Storyteller judgment, execution, and other-night recurrence.
- Goblin jinx, Vigormortis retention, gained Cerenovus, UI, Electron, persistence, and Slice 2B17.
- Any immunity or `COMPLETE` claim.

## Local Validation

repair-round-1 local gate record for exact repaired HEAD

- `git diff --check`: passed.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm test`: 24 files / 821 tests passed.
- `pnpm test:coverage`: 24 files / 821 tests passed; 85.52% statements/lines, 78.66% branches, 97.73% functions.

## Next Gate

Commit and push only the five bookkeeping documents, freeze the resulting final HEAD, and wait for exact-head Ubuntu/Windows CI. Then obtain a new complete independent final review. No further branch modification, review comment, merge, or tag is authorized.
