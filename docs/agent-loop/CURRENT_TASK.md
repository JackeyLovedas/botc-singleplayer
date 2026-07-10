# Current Task

## Slice 2B15 Corrected v3.1 RULE_DESIGN_PASS; Awaiting Controller Resume

- There is no open slice pull request.
- The active branch is `main`; implementation remains paused.
- The previously reviewed v3 remains at `docs/implementation/phase-3-slice-2b15-design.md` with final verdict `RULE_DESIGN_PASS` for exact reviewed `main@bf6c0ecbb8ad8ddba244d69ccb53ec4b26b557ea` and SHA-256 `a0de120b266e26a8d7fcea293b7cb5dbf24c8a4ea5e80cad7cfc121cb1adaa52`.
- A post-PASS architecture review found three design-contract hazards: the capability script literal did not match the repository constant, accepted Seamstress results exposed canonical payloads, and command-ID retries did not prove structural command identity.
- The architect's latest corrected complete-replacement v3.1 erratum is materialized verbatim at `docs/implementation/phase-3-slice-2b15-design-erratum-v3.1.md`; SHA-256 is `9d421f44a538e4599c03bccd7f631da18866aa6e709d28735e724af79d130528`.
- Renewed independent review inspected exact clean `main@70e11001c5fe1d4d2a5bbe2aee233e48ccd90fca` and returned `RULE_DESIGN_PASS` with no blockers.
- The renewed review is materialized verbatim at `docs/implementation/phase-3-slice-2b15-design-erratum-v3.1-review.md`; SHA-256 is `93f81070e6f0a77e7f38c64c0232c6d0f847a3abfb78183ec792cd4f12d3fc3c`.
- The erratum changes only capability identity, Seamstress accepted-result disclosure, and shared receipt idempotency. All previously reviewed rule semantics, canonical event order/payloads, settlement behavior, modifier behavior, non-goals, and coverage limits remain unchanged.
- The implementation work in `packages/domain-core/src/ids.ts` and untracked `packages/domain-core/src/seamstress.ts` is preserved without modification in `stash@{0}` (`5ea5d3e9d1491af04a2b695b13ce7f75d7b46624`) and must not be restored before renewed review passes and the controller resumes implementation.
- No production code, tests, architecture, coverage matrix, feature branch, pull request, or tag is authorized by this documentation update.

## Gate

- Completed gate: renewed independent `RULE_DESIGN_PASS` covering the original v3 plus corrected v3.1 erratum on exact clean reviewed HEAD and hashes.
- Current required step: controller verifies this review commit and explicitly resumes implementation before any stash restoration or implementation edit.
- The renewed pass confirms no production adapter or migration blocker; only `MemoryCommandCommitStore` exists.
- Do not restore the implementation stash, switch back to the feature branch, edit implementation surfaces, or open a pull request before the renewed pass and explicit controller resume.
- Preserve one writer and one open slice pull request at a time.
