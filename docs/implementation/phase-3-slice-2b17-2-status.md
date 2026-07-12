# Phase 3 Slice 2B17.2 Implementation Status

Status: `COMPLETED`

Accepted through PR [#21](https://github.com/JackeyLovedas/botc-singleplayer/pull/21) with final reviewed HEAD `880c4c363dcde292493f2fbc6ebde20a0dfc09c9`, merge SHA `44248dc8172b59a994ceba13e91e1bc32cbe561a`, accepted tag `phase-3-slice-2b17-2-philosopher-gained-task-scheduling-v2`, and final `CODE_REVIEW_PASS / RULE_REVIEW_PASS` after repair round 2/2.

This slice implements only the reviewed Philosopher-gained first-night scheduling V2 contract. It does not implement Mathematician information or resolve any of the four preserved Slice 2B18 rule conflicts.

## Implemented contract

- New planners emit `first-night-task-plan-v2`; accepted V1 plan events, IDs, insertion payloads, ordering, and replay remain unchanged.
- New mapped Philosopher choices emit `FirstNightTaskInsertedV2` with scheduling version `philosopher-gained-first-night-scheduling-v2` and `first-night-v2:PHILOSOPHER_GAINED:*` task IDs.
- V2 insertion payloads bind the active catalog revision/signature, target role definition, catalog/effective base order, Philosopher choice, grant, source seat, and deterministic tie-break policy.
- Base tasks sort before gained tasks at the same catalog position. Gained tasks sort by source seat and then the existing explicit stable task-ID code-unit comparator.
- Snake Charmer, Clockmaker, Dreamer, Seamstress, and Mathematician gained tasks use their catalog positions. `MINION_INFO` and `DEMON_INFO` are no longer bypassed.
- V1/V2 plan and insertion generations cannot mix. A mapped choice on an active V1 plan fails without events or a command receipt.
- The application planning boundary rejects dependency-generated V1 plans; V1 is accepted only as historical replay.
- A gained Mathematician advances to its signed catalog position, becomes next, and then fails closed before any information event, ledger, receipt, or version advancement.
- Existing Snake Charmer, Clockmaker, Dreamer, Seamstress, batch, idempotency, replay, and private-projection behavior is preserved. Gained Dreamer remains unsupported at execution and gained Mathematician remains fail-closed at its scheduled position.

## Validation

- Focused repair set: 3 files / 388 tests passed.
- Full suite: 28 files / 907 tests passed.
- Coverage: 86.06% statements/lines, 80.21% branches, 97.88% functions.
- `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:coverage`, and `git diff --check` passed.
- Forbidden-production scan found no added `localeCompare`, `Intl.Collator`, `Math.random`, `Date.now`, random UUID, raw `JSON.stringify` semantic comparison, or sparse-array `.every` validation.

## Compatibility and scope

- V1 status: `LEGACY_ACCEPTED_HISTORY`; exact historical semantics remain replayable.
- V2 applies only to newly planned games and newly emitted insertion events.
- No automatic event migration or hidden task-plan reordering exists.
- No role ability result semantics or player/AI projection fields changed.
- Mathematician remains `SKELETON`; Slice 2B18 remains `HUMAN_BLOCKED` with four unresolved conflicts.
- Slice 2B19 was not started.

## Final provenance

- Product-head CI: push `29177463850` and pull request `29177464877`, both `SUCCESS` on the final reviewed HEAD.
- Merge-commit CI: main push `29177743946` and accepted-tag push `29177757002`, both `SUCCESS` on the merge SHA.
- Complete independent report SHA-256: `120f006477d498221374685e62a56f31146b57253db5cb4602c201208318e769`.
- Final code comment: `4949730086`, body SHA-256 `2ea846e405053ccc2cd908177adc7fc1d007718b6dc8017ee5b29e315abc4d44`.
- Final rule comment: `4949730164`, body SHA-256 `1b5fdeb51bea27a745365a6c42d9da077d27356aecf8ec2f45f440a42c3cd6a0`.
- Verbatim archives: `docs/reviews/pr-21-code-review-final.md` and `docs/reviews/pr-21-rule-review-final.md`.
- Slice 2B18 prerequisite status: `docs/rules/evidence/2B18-prerequisite-status.md`; four rule conflicts remain and implementation is unauthorized.

## Subsequent Compatibility Closeout

Slice 2B17.3 subsequently corrected only the legacy V1 no-insertion builder ordering through PR #22. It did not alter this slice's V1/V2 scheduling semantics, role rules, payloads, IDs, or ordering. Slice 2B18 remains `HUMAN_BLOCKED` on the same four conflicts.
