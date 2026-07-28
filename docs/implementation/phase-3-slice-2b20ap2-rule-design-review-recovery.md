# Phase 3 Slice 2B20AP2 Rule Design Review Recovery

<!-- BEGIN VERBATIM INDEPENDENT REVIEW -->
verdict: RULE_DESIGN_PASS

reviewedHead: `cc82a95a258ad943e1d1a28b9c44ea51fe45bfa1`  
reviewTimestamp: `2026-07-28T00:46:06.8378548Z`

reviewScope:

- Independent, read-only BOTC rule-design review of Phase 3 Slice 2B20AP2.
- Compared implementation-scope baseline `bdbbe8bc051c5b6ff832aecec3202bee27e3b53f` with reviewed HEAD.
- No product code, rule evidence, coverage matrix, test source, dependency, Vitest workspace, or lockfile changed. The delta is restricted to CI/test-evidence infrastructure, control records, and implementation status.
- No implementation-correctness determination was made.

sourcesAndFilesReviewed:

- Repository authority: `AGENTS.md`, `project-handoff/00-README-FIRST.md`, all seven ordered handoff documents, `docs/agent-loop/REVIEW_PROTOCOL.md`, `CURRENT_TASK.md`, architecture ADR and go/no-go document, hosted-CI audit, implementation status.
- Complete design chain: Round 2 design, Round 2 review, Design Release Correction V1, Correction 1, the superseded invalid review, and the valid replacement review. Current SHA-256 values were independently verified.
- Rule evidence: `USER_OVERRIDES.md`, `2B20AP2.md`, `2B20A.md`, `2B20A-resolved.md`, and `ROLE_COVERAGE_MATRIX.md`.
- Rule handoff: night order, drunk/poison, information model, character/alignment changes, Storyteller decisions, character interactions, rule priority, and the Dreamer, Philosopher, Mathematician, and Vortox role sections.
- Rule tests: relevant cases in `project-handoff/tests/25-rule-test-cases.md` and cross-references; preserved application identities in `packages/application/src/game-application-service.test.ts`—14 legacy, 22 Slice 2B20A, and 10 Slice 2B19B identities.
- Live official BOTC Wiki revisions: Dreamer `oldid=2904`, Philosopher `2421`, Mathematician `3109`, Vortox `3017`, States `1039`, Glossary `2874`, and Rules Explanation `1310`.
- Live Chinese Wiki fixed revisions: home `5855`, Dreamer `3046`, Philosopher `5125`, drunk `5720`, poisoned `6294`, Mathematician `6442`, and Vortox `6198`. All retrieved bytes matched the hashes recorded in rule evidence.
- Official nightsheet: pinned commit `915347e…` and current `main` versions of `resources/data/nightsheet.json`; their relevant content matched.

findings:

- All mandatory rule sources were available and mutually consistent. No user override or unresolved rule conflict applies.
- The design and bounded corrections preserve Dreamer, Philosopher, Mathematician, and Vortox behavior. They introduce no rule, night-order, event, projection, replay, receipt, idempotency, privacy, or deterministic-ID change.
- Official night positions remain first-night Philosopher 14, Dreamer 61, Mathematician 77; other-night Philosopher 11, Vortox 47, Dreamer 79, Mathematician 96.
- Coverage remains accurate: Dreamer, Philosopher, and Mathematician are `PARTIAL`; Vortox is `NOT_STARTED`. No incomplete role is promoted.
- Existing rule-to-test traceability remains intact. The design freezes test titles, markers, assertions, logical groups, and coverage scope while changing only evidence-collection infrastructure.
- Unsupported behavior remains explicitly excluded, including poisoned Dreamer success, No Dashii interactions, gained-Dreamer impairment, ineffective Vortox, unsupported other-night completion, Traveller targeting, and Storyteller false-role selection.
- The three historical infrastructure blockers are resolved within the authorized correction boundary: explicit responsibility classification, valid singleton/sidecar evidence semantics, and executable repository/runtime trust anchors. Correction 1 removes the erroneous literal-count authority and uses complete relational set comparison.
- Because the slice adds no product event flow or rule claim, replay integrity, atomic batches, prospective validation, historical-fact stability, information separation, retry boundaries, receipts, and deterministic ordering remain preservation obligations rather than newly designed semantics.

remainingBlockers: `[]`
<!-- END VERBATIM INDEPENDENT REVIEW -->
