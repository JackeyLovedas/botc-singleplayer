# Current Task

## Next Slice Rule Research Pending

- There is no open slice pull request.
- Slice 2B13 is accepted on `main` and tagged `phase-3-slice-2b13-dreamer-action-information-skeleton`.
- Candidate label `2B14` may be used for the next bounded proposal, but its scope is intentionally unset.
- No external rule research has been performed for the candidate next slice yet.
- The controller must first launch the read-only `rule-researcher` for fresh source verification.

## Gate

- Required order: rule research -> materialized `docs/rules/evidence/<slice-id>.md` -> `RULE_READY` -> architect design -> independent `RULE_DESIGN_PASS` -> implementation.
- `RULE_CONFLICT` or `RULE_SOURCE_UNAVAILABLE` immediately maps to `HUMAN_BLOCKED`.
- Do not let the architect design, create a feature branch, edit production code or tests, open a pull request, or begin Slice 2B14 implementation while any gate is missing.
- Preserve one writer and one open slice pull request at a time.
