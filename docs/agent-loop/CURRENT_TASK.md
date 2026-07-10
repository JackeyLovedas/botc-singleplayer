# Current Task

## Slice 2B15 Rule Evidence Ready; Architect Design Pending

- There is no open slice pull request.
- The active branch is `main`; Slice 2B14 remains accepted at merge `3f66c99a30e35cc6a0fd39d47285d5ec7bede84b` and tag `phase-3-slice-2b14-seamstress-first-night-defer-skeleton`.
- Fresh 2B15 live-source research is materialized verbatim at `docs/rules/evidence/2B15.md`.
- Primary role: Seamstress. Interaction-only evidence covers Vortox, Philosopher, Recluse, Spy, Barista, Travellers, drunkenness, poisoning, character/alignment change, death, and revival.
- Retrieval date is `2026-07-10`; the fresh retrieval window is `2026-07-10T14:43:26+08:00` through `2026-07-10T14:45:00+08:00`.
- All mandatory sources were reopened live; `snapshotUsed: false`; source revisions and hashes are unchanged from 2B14.
- The report preserves rule claims `2B15-R01` through `2B15-R13`, every mandatory section, and all 39 required regression tests.
- Research verdict: `RULE_READY`.
- Rule coverage remains `SKELETON`; the 2B15 choice path is not implemented and cannot justify `COMPLETE`.
- External-source conflicts are empty. A stale non-authoritative repository contradiction remains at `project-handoff/tests/25-rule-test-cases.md:1431-1446`, test `SV-SEAMSTRESS-DRUNK-DOES-NOT-SPEND`, file SHA-256 `784e261d096c649f8882192c315d711c097bba25bb0d7d9c7a425f234c9c4491`.
- Authoritative current evidence says a legal drunk or poisoned two-target use is spent; the stale test cannot override live rule truth. `docs/architecture/10-information-model.md:113` is already corrected.
- Evidence focus is the post-2B14 `CHOOSE_TWO_PLAYERS` path, but this report does not authorize architecture, events, commands, projections, implementation, a branch, or a pull request.
- No 2B15 design or implementation has started.

## Gate

- Completed for 2B15: fresh live-source rule research -> materialized evidence -> `RULE_READY`.
- Next required step: one bounded read-only architect design traced to `docs/rules/evidence/2B15.md`.
- After design materialization, an independent reviewer must return `RULE_DESIGN_PASS` before any implementation branch or production/test edit.
- The architect must explicitly bound any supported subset and leave recurring other-night scheduling and unsupported interactions out unless fully traced and reviewed.
- `RULE_CONFLICT`, `RULE_SOURCE_UNAVAILABLE`, or a required interpretation of the stale impaired-use test maps to `HUMAN_BLOCKED`.
- Do not edit production code, tests, architecture, the coverage matrix, or open a feature branch or pull request during this evidence-only gate.
- Preserve one writer and one open slice pull request at a time.
