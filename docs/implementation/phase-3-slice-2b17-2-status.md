# Phase 3 Slice 2B17.2 Implementation Status

Status: `READY_FOR_PR_CI_AND_INDEPENDENT_FINAL_REVIEW`

This slice implements only the reviewed Philosopher-gained first-night scheduling V2 contract. It does not implement Mathematician information or resolve any of the four preserved Slice 2B18 rule conflicts.

## Implemented contract

- New planners emit `first-night-task-plan-v2`; accepted V1 plan events, IDs, insertion payloads, ordering, and replay remain unchanged.
- New mapped Philosopher choices emit `FirstNightTaskInsertedV2` with scheduling version `philosopher-gained-first-night-scheduling-v2` and `first-night-v2:PHILOSOPHER_GAINED:*` task IDs.
- V2 insertion payloads bind the active catalog revision/signature, target role definition, catalog/effective base order, Philosopher choice, grant, source seat, and deterministic tie-break policy.
- Base tasks sort before gained tasks at the same catalog position. Gained tasks sort by source seat and then the existing explicit stable task-ID code-unit comparator.
- Snake Charmer, Clockmaker, Dreamer, Seamstress, and Mathematician gained tasks use their catalog positions. `MINION_INFO` and `DEMON_INFO` are no longer bypassed.
- V1/V2 plan and insertion generations cannot mix. A mapped choice on an active V1 plan fails without events or a command receipt.
- Existing Snake Charmer, Clockmaker, Dreamer, Seamstress, batch, idempotency, replay, and private-projection behavior is preserved. Gained Dreamer remains unsupported at execution and gained Mathematician remains fail-closed at its scheduled position.

## Validation

- Focused: 8 files / 534 tests passed before final additions; final targeted set 3 files / 213 tests passed.
- Full suite: 28 files / 904 tests passed.
- Coverage: 86.04% statements/lines, 80.17% branches, 97.88% functions.
- `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:coverage`, and `git diff --check` passed.
- Forbidden-production scan found no added `localeCompare`, `Intl.Collator`, `Math.random`, `Date.now`, random UUID, raw `JSON.stringify` semantic comparison, or sparse-array `.every` validation.

## Compatibility and scope

- V1 status: `LEGACY_ACCEPTED_HISTORY`; exact historical semantics remain replayable.
- V2 applies only to newly planned games and newly emitted insertion events.
- No automatic event migration or hidden task-plan reordering exists.
- No role ability result semantics or player/AI projection fields changed.
- Mathematician remains `SKELETON`; Slice 2B18 remains `HUMAN_BLOCKED` with four unresolved conflicts.
- Slice 2B19 was not started.

