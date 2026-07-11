# Current Task

## Slice 2B17 — Final Review Repair Round 1 / 2

- Branch: `phase-3/clockmaker-first-night-information`.
- PR: [#19](https://github.com/JackeyLovedas/botc-singleplayer/pull/19), open and non-draft.
- Product implementation HEAD: `69c3f0375883bd9ec7908b5f9f609dad5e6fcee5`.
- Product-head push CI: run `29147953027`, `SUCCESS`.
- Product-head pull-request CI: run `29147961984`, `SUCCESS`.
- Round-1 final review: historical `CODE_REVIEW_FIX_REQUIRED / RULE_REVIEW_PASS` on product HEAD `69c3f0375883bd9ec7908b5f9f609dad5e6fcee5`.
- Round-1 blocker: six committed control/status/PR-body documents were stale; production, tests, workflow, evidence, design, design reviews, and rule matrix passed review and are unchanged by this repair.
- Clockmaker remains `PARTIAL`; Slice 2B18 remains prohibited.

## Live Authority

The current review head is the live GitHub PR #19 `headRefOid`. Exact-head CI means the GitHub checks attached to that same live `headRefOid`. This document does not predict or self-reference the SHA or run identifiers of its future docs-only repair commit.

## Remaining Gates

Commit and push only the seven repair documents, require exact-head push and pull-request CI on the new live PR head, freeze it, then obtain one fresh complete independent final review. After both final pass verdicts, the two required verbatim audit comments must be published and re-read before merge.
