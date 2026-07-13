# Agent Instructions

## Authority
- Current phase: **Phase 3 — controlled vertical slices**.
- Treat the checked-out repository and GitHub as current truth; use `docs/agent-loop/CURRENT_TASK.md` for the active slice.
- Treat `docs/agent-loop/AUTOPILOT_PROMPT.md` as the canonical Autopilot prompt and rule-gate authority.
- Before planning or coding, read the handoff files in the order listed by `project-handoff/00-README-FIRST.md`, then the relevant `project-handoff/rules/`, `project-handoff/tests/`, architecture, and latest implementation status.
- Rules baseline: Phase One v2.1. Do not rewrite rules for implementation convenience.
- A `PARTIAL` role requires relevant tests before its implementation expands.

## Package Manager
- Use **pnpm 11.7.0** with Node **24.15.0**.
- Install with `pnpm install --frozen-lockfile`.

## File-Scoped Commands
| Task | Command |
|---|---|
| Test | `pnpm exec vitest run --workspace vitest.workspace.ts path/to/file.test.ts` |
| Lint | `pnpm exec eslint path/to/file.ts --max-warnings 0` |
| Typecheck | No reliable file-scoped command; use `pnpm typecheck` |

## Full Gates
- Run `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm test:coverage`.
- Merge only when the frozen final feature HEAD has green required CI, the complete independent final-review report passes, both required GitHub audit comments have been re-read and verified, reviewed HEAD equals PR HEAD, no blocker remains, and the worktree is clean.

## Agent Workflow
- Controller coordinates; `rule-researcher`, `architect`, and `reviewer` are read-only; `implementer` is the sole writer.
- The controller must not author, rewrite, summarize into, synthesize, or infer `PASS`, `CODE_REVIEW_PASS`, or `RULE_REVIEW_PASS`; only the complete output of the independent read-only reviewer can supply final-review verdicts.
- `.codex/config.toml` remains capped at `max_threads = 3` and `max_depth = 1`; the four configured roles run sequentially whenever the mandatory gates require it.
- Keep one bounded slice, one writing agent, one feature branch, and one open slice PR at a time.
- Do not merge a new PR or begin the next slice before review and gates pass.
- Stop the affected feature on unresolved rule conflict, unsafe history rewrite, permissions failure, or repeated identical failure.
- Follow `docs/agent-loop/REVIEW_PROTOCOL.md`; record progress in `docs/agent-loop/AUTOPILOT_LOG.md`.

## Final Review Audit Chain

### Complete Independent Output
- A final review is valid only when one independent read-only reviewer returns one complete, untruncated report containing every field below:
  - `reviewedPR`;
  - `reviewedHead`;
  - `reviewTimestamp`;
  - `reviewScope`;
  - `productionFilesReviewed`;
  - `testFilesReviewed`;
  - `ruleEvidenceReviewed`;
  - `findings`;
  - `codeVerdict`;
  - `ruleVerdict`;
  - `remainingBlockers`.
- `codeVerdict` is exactly `CODE_REVIEW_PASS`, `CODE_REVIEW_FIX_REQUIRED`, or `HUMAN_BLOCKED`.
- `ruleVerdict` is exactly `RULE_REVIEW_PASS`, `RULE_REVIEW_FIX_REQUIRED`, or `HUMAN_BLOCKED`.
- Missing fields, omitted file lists, truncated output, an unknown verdict, or an unavailable report never passes. A merge-pass condition requires both pass verdicts and an empty `remainingBlockers`; the controller must not manufacture a separate `PASS` conclusion.

### Freeze Before Review
1. Finalize all production code, tests, documentation, generated artifacts, and the complete PR body.
2. Push the final feature HEAD, wait for all CI associated with that exact HEAD to complete, and require every merge-gating check to succeed.
3. Freeze the feature branch, then give that exact PR and HEAD to the independent read-only reviewer.
4. Do not commit after a passing review. Any commit after either pass verdict invalidates the report and both audit comments and requires fresh CI plus a new complete independent review on the new HEAD.

### GitHub Audit Comments
- After receiving the complete reviewer output, publish it verbatim to the PR twice. The controller may prepend only the required marker; it must not edit, reflow, summarize, or truncate the report below it.
- The code-review comment marker is exactly:

```text
<!-- BOTC_FINAL_CODE_REVIEW
reviewedHead=<exact SHA>
-->
```

- The rule-review comment marker is exactly:

```text
<!-- BOTC_FINAL_RULE_REVIEW
reviewedHead=<exact SHA>
-->
```

- Re-read both comments from GitHub before merge. Verify both exist, each contains the complete report, each marker and report `reviewedHead` equal the current PR HEAD, `codeVerdict` is `CODE_REVIEW_PASS`, `ruleVerdict` is `RULE_REVIEW_PASS`, and `remainingBlockers` is empty.
- GitHub automatic review, check summaries, approvals, or generated text are supplemental and cannot replace either independent-review comment.

### Post-Merge Review Archive
- After merge, re-read the two original comments from GitHub and archive them only in the post-merge docs-only closeout commit as:
  - `docs/reviews/pr-<PR>-code-review-final.md`;
  - `docs/reviews/pr-<PR>-rule-review-final.md`.
- Each archive records PR number, frozen feature HEAD, merge SHA, original comment URL, original comment timestamp, and SHA-256 of the exact original UTF-8 comment body. Preserve the original body verbatim in a clearly delimited section; do not normalize, repair, summarize, or reconstruct it from local memory.

### CI Provenance
- Record `productHeadCI`, `mergeCommitCI`, and `closeoutCommitCI` separately, each with its exact commit SHA, run URL or identifier, status, and scope.
- `productHeadCI` is the required product gate for the frozen feature HEAD. `mergeCommitCI` is evidence only for the exact merge commit. `closeoutCommitCI` is evidence only for the exact post-merge closeout commit.
- Never inherit CI status across commits or claim that a closeout commit has full product CI unless an independent CI record exists for that exact closeout commit.

## Mandatory Rule-Truth Order
1. The read-only `rule-researcher` checks `docs/rules/USER_OVERRIDES.md`, the user-specified Chinese Wiki, the official BOTC Wiki, and the official nightsheet for the proposed slice.
2. The sole writer materializes the sourced report as `docs/rules/evidence/<slice-id>.md`, including source revision/date or an approved snapshot path and hash.
3. The rule-researcher returns exactly one rule verdict: `RULE_READY`, `RULE_CONFLICT`, or `RULE_SOURCE_UNAVAILABLE`.
4. Only `RULE_READY` authorizes the read-only architect to design one bounded slice.
5. The reviewer independently reads the sources or approved snapshots, evidence, official nightsheet, and role coverage matrix. It must return `RULE_DESIGN_PASS` before implementation starts.
6. Only then may the implementer create a branch and implement the reviewed design.

- Design-review verdicts are exactly `RULE_DESIGN_PASS`, `RULE_DESIGN_FIX_REQUIRED`, or `HUMAN_BLOCKED`.
- `RULE_CONFLICT` and `RULE_SOURCE_UNAVAILABLE` map to `HUMAN_BLOCKED`; never guess an interpretation or continue from model memory.
- User-approved overrides take priority. Code, tests, README files, and model memory cannot override external rule truth.
- Every final PR review requires both `CODE_REVIEW_PASS` and `RULE_REVIEW_PASS`; either missing verdict blocks merge.
- Every merged slice updates `docs/rules/ROLE_COVERAGE_MATRIX.md`. No incomplete role may be marked `COMPLETE`.

## Key Conventions
- TypeScript modular monolith; the domain core has no UI or Electron dependency.
- Domain events are canonical truth; snapshots are rebuildable caches, and audit/infrastructure events do not rebuild game state.
- Human, AI, System, and Storyteller commands use one serial command queue and one logical writer per game.
- AI never receives canonical state; LLM output is a candidate command, never an authoritative event.
- Player views, AI memory, public state, Storyteller state, and replay truth stay separate.
- Delivered knowledge is a historical fact: validate stored facts before projection and never recompute them from newer character state.
- Evaluate ability effectiveness at settlement; keep truth, reliability, registration, constraints, and simulation reason separate.
- Use exact runtime payload validation, replay validation, atomic batch semantics, and prospective validation for every new event flow.
- Shape validation is not accepted-history provenance.
- Canonical IDs and ordering must not use `Date.now`, `Math.random`, random UUIDs, `localeCompare`, `Intl.Collator`, or environment locale.
- Distinguish `ScheduledTask`, `ActionOpportunity`, `EventSubscription`, and `ContinuousRule`.
- Record random candidate sets/seeds and Storyteller legal candidates/final choices.
- Never hide failures, weaken tests, or expand scope silently.

## Commit Attribution
- AI commits MUST include `Co-Authored-By: Codex GPT-5 <noreply@openai.com>`.
