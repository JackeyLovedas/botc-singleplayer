# Current Task

## Governance Hardening Before Candidate 2B16

- Active work is limited to the review audit-chain governance files on clean `main` from `4fe2639ee1ff70f2e6d2aee6cea457757945a2a0`.
- There is no active slice PR or feature branch, and no slice implementation is authorized by this task.
- The governance change defines complete independent reviewer output, frozen-head ordering, two verbatim GitHub audit comments, post-merge comment archives, and commit-specific CI provenance.
- `maxSlices = 1` for this controlled round.
- `maxRepairRounds = 2` for the one permitted slice PR in this round.
- Heartbeat is disabled. Do not create or schedule a heartbeat, recurring monitor, or background continuation.

## Required Governance Gate

1. Modify only the five authorized governance/control files.
2. Commit and push the governance hardening to `main`.
3. CI for that exact governance commit must complete successfully before any candidate 2B16 rule research, evidence work, design, feature branch, production change, or test change begins.
4. A passing earlier product, merge, or closeout commit does not satisfy CI for the new governance commit.

## Prohibited Work

- Do not start 2B16 rule research, design, implementation, branch creation, or PR creation during this governance-hardening task.
- Do not infer the 2B16 scope before the exact governance commit is green.
- Do not start, research, design, or implement 2B17 in this round under any condition.
- Do not touch production code, tests, rule evidence, or coverage statuses beyond the single authorized wording correction in `docs/rules/ROLE_COVERAGE_MATRIX.md`.
