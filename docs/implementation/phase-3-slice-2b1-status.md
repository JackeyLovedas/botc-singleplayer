# Phase 3 Slice 2B1: Seeded Sects & Violets Setup Foundation Status

## 1. PR #2 Merge

- Repository: `JackeyLovedas/botc-singleplayer`
- PR #2 merge commit: `e2676cdd2e04e698d30b0349f039a0fd5758e310`
- Reviewed PR #2 head: `3857f9d7301396481d2bb28b05b20098e29aab9d`
- Slice 2A tag: `phase-3-slice-2a-phase-state-machine-core`
- Slice 2B1 branch: `phase-3/seeded-snv-setup`

## 2. New Packages

- `packages/rules-snv`: Sects & Violets role catalog and catalog integrity checks.
- `packages/setup-engine`: deterministic 12-player Sects & Violets setup generator.

Dependency direction remains:

```text
rules-snv -> domain-core
setup-engine -> domain-core
application -> domain-core + application-defined SetupGeneratorPort
test-harness -> application + domain-core + rules-snv + setup-engine
```

`application` does not import `rules-snv` or `setup-engine`.

## 3. Sects & Violets Role Catalog

`packages/rules-snv` contains exactly 25 roles:

- 13 Townsfolk.
- 4 Outsiders.
- 4 Minions.
- 4 Demons.

Each role definition records:

- `roleId`
- `nameZh`
- `nameEn`
- `edition`
- `characterType`
- `defaultAlignment`
- `setupModifier`
- `sourceDocument`
- `verificationStatus`

Only `fang_gu` and `vigormortis` have non-zero setup modifiers.

No role abilities are implemented in this slice.

## 4. Random Algorithm

- setup algorithm version: `snv-12-setup-v1`
- random algorithm version: `xmur3-sfc32-rejection-v1`
- random stream: `setup/sects-and-violets/12/v1`

The generator uses `GameState.rootSeed` through the application port. `GenerateSetup` has no temporary seed override.

The random integer path uses deterministic seeded state and rejection sampling to avoid modulo bias. It does not use `Math.random`, system time, UUIDs, OS random sources, or cryptographic-security claims.

## 5. Setup Generation Flow

The generator flow is:

1. validate the script catalog.
2. validate constraints.
3. choose or validate exactly one demon.
4. apply demon setup modifiers.
5. compute final role type counts.
6. include locked roles.
7. deterministically choose remaining roles from stably sorted candidates.
8. validate 12 unique actual roles.
9. generate demon bluffs from out-of-play good roles.
10. return a validation summary.

Output order is canonical role type order, then `roleId`. It is not a seat order and must not be interpreted as assignment.

## 6. Setup Modifiers

Base 12-player counts:

```text
TOWNSFOLK = 7
OUTSIDER  = 2
MINION    = 2
DEMON     = 1
```

Modifier outcomes:

- `fang_gu`: `6/3/2/1`
- `vigormortis`: `8/1/2/1`
- `no_dashii`: `7/2/2/1`
- `vortox`: `7/2/2/1`

## 7. Demon Bluffs

`demonBluffs` contains exactly three role snapshots.

Each bluff must be:

- unique.
- good-aligned.
- from Sects & Violets.
- absent from `actualRoles`.
- absent from `excludedRoleIds`.

Demon bluffs are not actual roles and are not assignments.

## 8. GenerateSetup Command

`GenerateSetup` payload contains only:

```text
commandType
constraints
```

Allowed actors:

- `SystemActor`
- `StorytellerActor`

Rejected actors:

- `HumanActor`
- `AIActor`

The command requires:

- existing game.
- selected Sects & Violets script.
- `phase = SETUP_GENERATION`.
- no existing setup.

Unsolvable setup generation returns `SetupGenerationFailed` and writes no domain events.

## 9. SetupGenerated Event

`SetupGenerated` payload records:

- `rulesBaselineVersion`
- `scriptId`
- `setupAlgorithmVersion`
- `randomAlgorithmVersion`
- `randomStream`
- `constraintsSnapshot`
- `preModifierCounts`
- `postModifierCounts`
- `actualRoles`
- `demonRole`
- `setupModifiersApplied`
- `demonBluffs`
- `validationSummary`

`actualRoles` and `demonBluffs` are replayable role snapshots. Old events do not depend on a future role catalog reinterpretation.

## 10. Batch Semantics

`GenerateSetup` succeeds only as one atomic two-event batch:

```text
1. SetupGenerated
2. PhaseTransitioned(SETUP_GENERATED)
```

The transition is:

```text
SETUP_GENERATION -> CHARACTER_ASSIGNMENT
reasonCode = SETUP_GENERATED
```

Both events share `batchId`, `commandId`, `gameVersion`, and `rulesBaselineVersion`, with consecutive `eventSequence`.

`SETUP_GENERATED` is now integrated. Other future transition reasons remain planned-only.

## 11. Test Results

- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm test`: passed, 156 tests.
- `pnpm test:coverage`: passed.

## 12. Not Implemented

- seat roster.
- player list.
- character assignment.
- real human role selection.
- seat locking.
- `CharacterAssigned` or `CharactersAssigned`.
- `CHARACTERS_ASSIGNED` integration.
- first night entry.
- night order.
- role abilities.
- player private knowledge.
- AI players.
- automatic Storyteller decisions.
- nomination.
- voting.
- execution.
- death.
- victory.
- UI.
- Electron.
- SQLite.

## 13. Known Limits

- Only official Sects & Violets metadata is supported.
- Custom scripts are rejected by `SelectScript`.
- Generated role order is deterministic output order, not seating order.
- The setup generator does not score balance or apply subjective Storyteller preference.
- `GameState.setup` exists after replay, but `assignment` remains absent.

## 14. BLOCKER Status

No BLOCKER identified for Slice 2B1.

## 15. Next Step

Recommended next slice:

```text
Phase 3 Slice 2B2: Seat Roster and Character Assignment
```

Do not start first night or gameplay before real seat roster and character assignment facts exist.
