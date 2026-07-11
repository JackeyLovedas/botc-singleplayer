# PR 19 Final Rule Review Archive

- PR: [#19](https://github.com/JackeyLovedas/botc-singleplayer/pull/19)
- Frozen feature HEAD: `04237a2053a64301a515fffeb417958a381a0dc6`
- Merge SHA: `4b29a3f7b05d521a9d8468ffc33c77eec3cb16c4`
- Original comment: [4944705926](https://github.com/JackeyLovedas/botc-singleplayer/pull/19#issuecomment-4944705926)
- Created: `2026-07-11T10:06:05Z`
- Updated: `2026-07-11T10:07:00Z`
- Exact original UTF-8 body SHA-256: `1b86fb8651fb5fe2deb653ffac22a7b190762fd3b0dc11c5fcca12948971631e`
- Exact original body bytes: `12087`

## Verbatim Original Comment Body

The exact body is the byte sequence after the LF terminating the BEGIN delimiter and before the LF introducing the END delimiter.

----- BEGIN EXACT ORIGINAL COMMENT BODY -----
<!-- BOTC_FINAL_RULE_REVIEW
reviewedHead=04237a2053a64301a515fffeb417958a381a0dc6
-->
{
  "reviewedPR": 19,
  "reviewedHead": "04237a2053a64301a515fffeb417958a381a0dc6",
  "reviewTimestamp": "2026-07-11T10:01:37Z",
  "reviewScope": {
    "baseCommit": "dfb5c33b63683d2993c3a15b21059040b22fdf9f",
    "productImplementationHead": "69c3f0375883bd9ec7908b5f9f609dad5e6fcee5",
    "repairedHead": "04237a2053a64301a515fffeb417958a381a0dc6",
    "diff": "main...04237a2053a64301a515fffeb417958a381a0dc6",
    "totalChangedFiles": 30,
    "productHeadChangedFiles": 29,
    "repairChangedFiles": 7,
    "repairScope": "Seven documentation files only; no production, test, workflow, rule-evidence, design, design-review or coverage-matrix change after product HEAD",
    "reviewedAreas": [
      "Complete live PR body and all twenty headings",
      "Entire main-to-repaired-HEAD diff",
      "Entire product implementation and all seven tests",
      "All seven docs-only repair files",
      "Verbatim historical round-one report",
      "Clockmaker geometry, current native-character identity and settlement timing",
      "Base, Philosopher-gained, original-drunk and post-Snake-Charmer histories",
      "Vortox false-information and strict stored historical biconditional",
      "Two-event atomic batch, replay, prospective validation, receipts and idempotency",
      "Private projection and immutable historical-information boundaries",
      "Ninety-nine-row rule-to-test traceability",
      "Rule evidence, approved design, design-review provenance and role matrix",
      "Pinned external sources and official nightsheet",
      "Product-head and repaired-head CI provenance"
    ],
    "verification": {
      "localHeadEqualsRemoteAndPRHead": true,
      "worktreeClean": true,
      "diffCheckPassed": true,
      "repairContainsOnlyDocumentation": true,
      "focusedTests": "7 files / 341 tests passed freshly on repaired HEAD",
      "prBodySha256": "fd12d281d35d8430e7ed373157adb76546c20b6b8a45b055c80c5a25cfc872a3",
      "roundOneReportSha256": "18029ee553930ed54429d13010c9a18e5a6994262b817d64dd2469aad0a20afc",
      "exactRepairedHeadChecks": "Four required checks succeeded",
      "windowsClockmakerStep": "Explicit three-file Clockmaker domain/replay/order step succeeded in both repaired-head Windows jobs",
      "mergeable": true
    }
  },
  "productionFilesReviewed": [
    ".github/workflows/ci.yml",
    "docs/agent-loop/AUTOPILOT_LOG.md",
    "docs/agent-loop/AUTOPILOT_STATE.json",
    "docs/agent-loop/CURRENT_TASK.md",
    "docs/agent-loop/PROJECT_STATE.md",
    "docs/implementation/phase-3-slice-2b17-final-review-round-1.md",
    "docs/implementation/phase-3-slice-2b17-pr-body.md",
    "docs/implementation/phase-3-slice-2b17-status.md",
    "docs/rules/ROLE_COVERAGE_MATRIX.md",
    "packages/application/src/command-result.ts",
    "packages/application/src/game-application-service.ts",
    "packages/domain-core/src/clockmaker.ts",
    "packages/domain-core/src/command.ts",
    "packages/domain-core/src/domain-batch-semantics.ts",
    "packages/domain-core/src/errors.ts",
    "packages/domain-core/src/event-applier.ts",
    "packages/domain-core/src/events.ts",
    "packages/domain-core/src/first-night-task-plan.ts",
    "packages/domain-core/src/game-state.ts",
    "packages/domain-core/src/index.ts",
    "packages/domain-core/src/initial-private-knowledge.ts",
    "packages/projections/package.json",
    "packages/projections/src/index.ts"
  ],
  "testFilesReviewed": [
    "packages/application/src/game-application-service.test.ts",
    "packages/domain-core/src/clockmaker-replay.test.ts",
    "packages/domain-core/src/clockmaker.test.ts",
    "packages/domain-core/src/philosopher-ability.test.ts",
    "packages/projections/src/clockmaker-private-knowledge.test.ts",
    "packages/projections/src/private-knowledge-view.test.ts",
    "packages/task-engine/src/first-night-task-planner.test.ts"
  ],
  "ruleEvidenceReviewed": [
    {
      "source": "docs/rules/evidence/2B17.md",
      "revision": "SHA-256 db1fb83335e6a2083f85797b83516b8b646538ee3afcfd5ac92319147432d97e",
      "result": "RULE_READY; PARTIAL"
    },
    {
      "source": "docs/implementation/phase-3-slice-2b17-design.md",
      "revision": "SHA-256 fde5aebea89e003c38938c338abfd4fdd1370c88814f965c41a0dcda7b3d1e06",
      "result": "Exact approved round-three design"
    },
    {
      "source": "docs/implementation/phase-3-slice-2b17-design-review-round-3.md",
      "revision": "SHA-256 2c472cfdca5578d0aa556e4ec02761854362fcf3470a4188e294cfe74dafbe62",
      "result": "RULE_DESIGN_PASS with no blockers"
    },
    {
      "source": "docs/rules/USER_OVERRIDES.md",
      "revision": "Git 8fb8c0b6c42eee8320b1b4c4d9efdf4ec20707a8; SHA-256 9ec14eb794fa1f0fd47d674d7b4df5acbceed17e1b51fcde2c227a3496e4dab3",
      "result": "Freshly verified; no applicable override"
    },
    {
      "source": "https://clocktower-wiki.gstonegames.com/index.php?title=钟表匠&oldid=6181",
      "revision": "oldid 6181; SHA-256 51a4393246c618ccee2a7b5ee2076f289d7f19fdad07a6a729d3a786a86bdf0f",
      "result": "Live revision and recorded content hash freshly reproduced"
    },
    {
      "source": "https://wiki.bloodontheclocktower.com/index.php?title=Clockmaker&oldid=2967",
      "revision": "oldid 2967; SHA-256 02871d3cff2ee4e40eb0486ddce72c9b1a5c513cf724595dfacf36cf50b9da9a",
      "result": "Live revision and recorded content hash freshly reproduced"
    },
    {
      "source": "https://wiki.bloodontheclocktower.com/index.php?title=Vortox&oldid=3017",
      "revision": "oldid 3017; SHA-256 4630f76e5bf06ee9e9990854708fabed2a25b9d3c6ea170e2fd4598ef5f5cf07",
      "result": "Live revision and recorded content hash freshly reproduced"
    },
    {
      "source": "Official States, Glossary, Abilities, Storyteller Advice, Character Types and Travellers pages",
      "revision": "oldids 1039, 2874, 1376, 2552, 1495 and 2853",
      "result": "All six recorded SHA-256 values freshly reproduced"
    },
    {
      "source": "Official Spy, Recluse, Summoner, Philosopher and Snake Charmer pages",
      "revision": "oldids 3013, 3007, 3014, 2421 and 2905",
      "result": "All five recorded SHA-256 values freshly reproduced"
    },
    {
      "source": "https://raw.githubusercontent.com/ThePandemoniumInstitute/botc-release/3d6d930a9e600321f93b2567a2e88948a675bc1e/resources/data/nightsheet.json",
      "revision": "commit 3d6d930a9e600321f93b2567a2e88948a675bc1e; SHA-256 99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75",
      "result": "Freshly verified first-night positions: Philosopher 14, Minion info 20, Demon info 24, Snake Charmer 37, Clockmaker 60, Dreamer 61 and Seamstress 62; Clockmaker is absent from ordinary other-night order"
    }
  ],
  "findings": [
    {
      "severity": "PASS",
      "category": "Round-one blocker closure",
      "finding": "The sole round-one blocker is closed. AUTOPILOT_STATE.json now identifies PR #19, the correct branch, repair round 1, the product implementation HEAD and its CI, the historical round-one report and live GitHub head/check authorities. CURRENT_TASK.md, PROJECT_STATE.md, the status document and AUTOPILOT_LOG.md no longer claim that no PR or product-head CI exists. The committed PR-body artifact contains twenty headings and deliberately uses live PR authority instead of predicting its own future commit SHA. The live PR body separately and accurately records product HEAD 69c3f0375883bd9ec7908b5f9f609dad5e6fcee5 with runs 29147953027/29147961984 and repaired HEAD 04237a2053a64301a515fffeb417958a381a0dc6 with runs 29148485853/29148486733, while stating that this fresh review was pending."
    },
    {
      "severity": "PASS",
      "category": "Repair integrity",
      "finding": "The repair commit changes exactly seven documentation files. Production code, tests, CI workflow, rule evidence, approved design, design-review reports and ROLE_COVERAGE_MATRIX.md are byte-unchanged from product HEAD 69c3f0375883bd9ec7908b5f9f609dad5e6fcee5. The historical round-one report is strict JSON, contains every required field and eight findings, ends at the final JSON brace, and matches SHA-256 18029ee553930ed54429d13010c9a18e5a6994262b817d64dd2469aad0a20afc."
    },
    {
      "severity": "PASS",
      "category": "Clockmaker rule implementation",
      "finding": "The complete product diff was independently re-reviewed. It calculates shortest circular distance for exactly one current native Demon and two current native Minions, selects the minimum pair distance, uses native character type rather than alignment, maintains deterministic numeric ordering and evaluates the supported current state at each task's settlement revision, including a preceding Snake Charmer swap."
    },
    {
      "severity": "PASS",
      "category": "Source, impairment and Vortox behavior",
      "finding": "Base and Philosopher-gained contracts bind their exact current source, task, role, grant, opportunity, insertion, seat and revision. Original-Clockmaker drunkenness binds the preserved Philosopher choice/grant/impairment chain. Unsupported poison, registration, abnormal native counts and impaired Vortox paths fail closed. Runtime and stored validation enforce VORTOX_FALSE_REQUIRED if and only if the stored native Demon is the exact catalog Vortox, with one matching active and effective tenure for the same player, seat, role and settlement revision. All four required independent Vortox corruption cases remain directly asserted."
    },
    {
      "severity": "PASS",
      "category": "Events, replay, receipts and determinism",
      "finding": "Settlement emits exactly ClockmakerInformationDelivered followed by ScheduledTaskSettled with shared canonical metadata, consecutive sequences and exact linkage. Replay, batch, stored-fact and prospective validators reject naked, reversed, partial, duplicate, extra, cross-linked, malformed, stale and forged histories atomically. The seven supported application histories, retryable metadata/construction/prospective/commit faults and idempotent retry paths remain covered. No prohibited random, wall-clock, UUID or locale primitive was introduced."
    },
    {
      "severity": "PASS",
      "category": "Projection and historical truth",
      "finding": "Only the source receives the stored distance, Clockmaker model version and knowledge stage, with identical player and AI views. Native identities, geometry, truth, candidate sets, impairment facts, Vortox facts, policy, assignment, task and settlement internals are not projected. Later role, alignment and unrelated impairment changes do not recompute delivered knowledge."
    },
    {
      "severity": "PASS",
      "category": "Rule traceability, night order and coverage",
      "finding": "The ninety-nine-row trace remains backed by concrete assertions or the explicitly identified external-evidence row 34. Rows 86 through 89 independently reject the four historical Vortox corruptions. The runtime order preserves Snake Charmer before Clockmaker before Dreamer, while the complete pinned nightsheet order was freshly verified. ROLE_COVERAGE_MATRIX.md continues to describe each supported and unsupported Clockmaker interaction accurately and keeps the role PARTIAL."
    },
    {
      "severity": "PASS",
      "category": "Frozen-head validation and CI provenance",
      "finding": "Local HEAD, remote branch and live PR head all equal 04237a2053a64301a515fffeb417958a381a0dc6; the worktree is clean and diff checks pass. Fresh focused execution passed 7 files and 341 tests. Repaired-head push run 29148485853 and pull-request run 29148486733 both completed successfully for this exact SHA; both Ubuntu validate jobs passed typecheck, lint, full tests and coverage, and both Windows jobs executed and passed the explicit Clockmaker domain/replay/order step. No CI or review verdict was inherited from product HEAD."
    }
  ],
  "codeVerdict": "CODE_REVIEW_PASS",
  "ruleVerdict": "RULE_REVIEW_PASS",
  "remainingBlockers": []
}
----- END EXACT ORIGINAL COMMENT BODY -----
