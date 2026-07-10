# Current Task

## Slice 2B15 Design Ready; Independent Rule Design Review Pending

- There is no open slice pull request.
- The active branch is `main`; the design baseline is `12a3edc04215f1d16fcad87f44438ec862f3c39b`.
- Slice 2B14 remains accepted at merge `3f66c99a30e35cc6a0fd39d47285d5ec7bede84b` and tag `phase-3-slice-2b14-seamstress-first-night-defer-skeleton`.
- Fresh 2B15 live-source research is materialized verbatim at `docs/rules/evidence/2B15.md`; its verdict is `RULE_READY`, and rule coverage remains `SKELETON`.
- The read-only architect's complete proposed design is materialized verbatim at `docs/implementation/phase-3-slice-2b15-design.md`.
- The bounded scope is the base, modifier-free Seamstress first-night `CHOOSE_TWO_PLAYERS` path: canonical target choice, explicit once-per-game spend, settlement-time alignment comparison, separate rule-correct and delivered answers, atomic settlement, and source-only historical private information.
- Existing `DEFER` behavior remains unchanged. Legacy V1 opportunity visibility remains exact and defer-only; new opportunities use V2 and may advertise `DEFER` plus `CHOOSE_TWO_PLAYERS`.
- Unsupported impairment, Vortox, registration, ability-source substitution, and other modified-source contexts fail closed with `UnsupportedSeamstressModifiedResolution`, append no events, spend nothing, and leave the opportunity open.
- The design maps evidence claims `R01` through `R13`, defines the exact four-event success batch, exact state/replay/prospective/projection contracts, 21 minimum acceptance tests, the future `PARTIAL` coverage delta, PR traceability, rollback, risks, and stop conditions.
- Proposed design status: `READY_FOR_INDEPENDENT_RULE_DESIGN_REVIEW`.
- The stale non-authoritative scenario `SV-SEAMSTRESS-DRUNK-DOES-NOT-SPEND` remains prohibited because current sourced evidence says a legal impaired use is spent.
- No 2B15 implementation, feature branch, pull request, production change, test change, architecture change, or coverage-matrix change is authorized.

## Gate

- Completed for 2B15: fresh live-source rule research -> materialized evidence -> `RULE_READY` -> bounded architect design -> materialized proposed design.
- Next required step: one independent read-only source/evidence and rule-design review of `docs/implementation/phase-3-slice-2b15-design.md`.
- The reviewer must independently inspect the required sources, `docs/rules/evidence/2B15.md`, `docs/rules/ROLE_COVERAGE_MATRIX.md`, and the proposed design.
- Implementation is authorized only after the reviewer returns `RULE_DESIGN_PASS` and the controller confirms the gate.
- `RULE_DESIGN_FIX_REQUIRED` requires design correction and renewed review; `RULE_CONFLICT` or `RULE_SOURCE_UNAVAILABLE` maps to `HUMAN_BLOCKED`.
- Do not create a feature branch or pull request, and do not edit production code, tests, architecture, or the coverage matrix during this design-review gate.
- Preserve one writer and one open slice pull request at a time.
