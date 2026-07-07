# Phase 3 Slice 2B1: Seeded Sects & Violets Setup Foundation Status

## 1. Scope

- Repository: `JackeyLovedas/botc-singleplayer`
- Branch: `phase-3/seeded-snv-setup`
- PR: `#3`
- Slice: deterministic 12-player Sects & Violets setup foundation.

This slice still does not implement seats, player roster, character assignment, first night, role abilities, AI players, UI, Electron, or SQLite.

## 2. Package Boundaries

- `packages/rules-snv`: exact Sects & Violets role catalog and catalog integrity checks.
- `packages/setup-engine`: deterministic setup generation.
- `packages/application`: consumes setup generation only through `SetupGeneratorPort`.
- `packages/domain-core`: owns setup payload contracts, replay validation, stable ordering, and version constants.

Dependency direction remains inward:

```text
rules-snv -> domain-core
setup-engine -> domain-core
application -> domain-core + application-defined SetupGeneratorPort
test-harness -> application + domain-core + rules-snv + setup-engine
```

`application` does not import `rules-snv` or `setup-engine`.

## 3. Feasible Demon Planning

The generator no longer randomly picks a demon before proving that demon can satisfy the constraints.

Current flow:

1. Normalize constraints with stable ASCII ordering.
2. Enumerate all allowed demons, or only the locked demon when one demon is locked.
3. Evaluate each demon as a `DemonSetupPlan`.
4. Reject only infeasible plans.
5. Randomly select from feasible plans only.
6. Fill remaining role counts from stable candidate pools.
7. Generate demon bluffs from out-of-play good roles.

`DemonSetupPlan` records:

- `demon`
- `postModifierCounts`
- `lockedCounts`
- `remainingCounts`
- `availableCounts`
- `eligibleBluffCount`

## 4. No False Unsolvable Results

Regression coverage now verifies:

- two locked Outsiders succeed and do not choose `vigormortis`.
- three locked Outsiders force `fang_gu`.
- eight locked Townsfolk force `vigormortis`.
- excluding three Outsiders, leaving one available Outsider, forces `vigormortis`.
- one infeasible demon plan does not make the whole setup fail.
- failure occurs only when every demon plan is infeasible.
- feasible plan order does not depend on source array insertion order.
- infeasible demon plans do not consume the final role-selection random stream.

## 5. Standard SFC32 Compliance

Random version remains:

```text
xmur3-sfc32-rejection-v1
```

The implementation now follows the standard sfc32 update order:

```text
t = a + b
a = b XOR (b >>> 9)
b = c + (c << 3)
c = rotateLeft(c, 21)
d = d + 1
t = t + d
c = c + t
return t
```

Fixed `nextUint32` vector for seed `vector-seed`:

```text
4192517003
1065224812
2124141431
4225418798
39656548
229722173
1759554890
569041450
1103139648
3514609012
```

Fixed `nextInt(17)` vector for seed `vector-seed`:

```text
4
1
16
16
2
0
14
8
9
10
```

## 6. Cross-Platform Determinism

Domain and setup ordering now use a stable ASCII/code-unit comparator:

```text
left === right ? 0 : left < right ? -1 : 1
```

No locale-sensitive comparator or comparator-free sort call remains in deterministic setup code.

Canonical output rules:

- `actualRoles`: character type order, then ASCII `roleId`.
- `demonBluffs`: ASCII `roleId`.
- `lockedRoleIds`, `excludedRoleIds`, `exactRoleIds`: unique ASCII `roleId`.
- `conflictingRoleIds`: ASCII `roleId`.

Windows deterministic CI was added:

```text
deterministic-setup-windows
pnpm --filter @botc/setup-engine test
```

Local Windows execution of that package command passed.

## 7. Exact Catalog Integrity

`assertValidSectsAndVioletsCatalog` now validates the exact 25-role catalog, not only aggregate counts.

It checks:

- all exact expected `roleId` values exist.
- no extra role exists.
- no expected role is omitted.
- each role has the expected `characterType`.
- each role has the expected `defaultAlignment`.
- each role has Sects & Violets edition metadata.
- `fang_gu` has `townsfolkDelta = -1`, `outsiderDelta = +1`.
- `vigormortis` has `townsfolkDelta = +1`, `outsiderDelta = -1`.
- all other roles have zero setup modifier.

Corruption tests cover reversed modifiers, wrong modifiers, swapped types with preserved counts, unknown role replacement, non-demon modifiers, and type/alignment mismatch.

## 8. Generic Catalog Defense

`setup-engine` now uses `validateScriptDefinitionForSetup` from `domain-core` and does not depend on `rules-snv`.

The generic setup catalog validation checks:

- supported script metadata.
- 25 roles.
- 13/4/4/4 type counts.
- unique non-empty role IDs.
- non-empty names.
- edition consistency.
- type/default-alignment consistency.
- every modifier preserves total count.
- non-demon roles have zero setup modifier.
- every demon modifier produces non-negative 12-role counts.

The generator defensively copies the script and role modifiers at construction time.

## 9. Version Constants

The event-validated setup constants now live in `domain-core`:

```text
SUPPORTED_SETUP_ALGORITHM_VERSION = snv-12-setup-v1
SUPPORTED_RANDOM_ALGORITHM_VERSION = xmur3-sfc32-rejection-v1
SUPPORTED_SETUP_RANDOM_STREAM = setup/sects-and-violets/12/v1
SUPPORTED_ROLE_CATALOG_VERSION = snv-role-catalog-v1
```

`GeneratedSetup` and `SetupGenerated` include `roleCatalogVersion`.

## 10. SetupGenerated Replay Validation

Domain replay now validates the setup event instead of trusting the generator.

Replay checks include:

- supported setup algorithm version.
- supported random algorithm version.
- supported random stream.
- supported role catalog version.
- valid role snapshots.
- canonical `actualRoles` order.
- canonical `demonBluffs` order.
- exactly one demon and two minions.
- `demonRole` deeply equals the unique demon snapshot in `actualRoles`.
- strict `setupModifiersApplied` shape.
- `constraintsSnapshot` uniqueness, ordering, overlap, locked/excluded/exact invariants.
- validation summary consistency.

The replay tests now include the required damaged-event cases and a legal rebuild into `CHARACTER_ASSIGNMENT`.

## 11. Structured Setup Failure Details

`CommandRejected` now supports:

```text
details.kind = setup-generation
details.failure = SetupGenerationFailure
```

For `SetupGenerationFailed`, the application layer preserves:

- `failureCode`
- `message`
- `conflictingRoleIds`
- `requestedCounts`
- `availableCounts`
- `constraintsSnapshot`

Rejected command receipts preserve the same details, and retrying the same failed command returns the same structured details with `idempotent = true`.

## 12. Golden Seed

Golden input:

```text
scriptId = sects-and-violets
rootSeed = golden-seed
playerCount = 12
constraints = {}
```

Golden `actualRoles`:

```text
dreamer
flowergirl
juggler
oracle
philosopher
sage
savant
town_crier
mutant
evil_twin
witch
vigormortis
```

Golden `demonRole`:

```text
vigormortis
```

Golden `demonBluffs`:

```text
mathematician
snake_charmer
sweetheart
```

## 13. Quality Gates

Local gates after PR #3 hardening:

```text
pnpm typecheck: passed
pnpm lint: passed
pnpm test: passed, 198 tests
pnpm test:coverage: passed, 198 tests
pnpm --filter @botc/setup-engine test: passed on Windows
```

## 14. Not Implemented

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

## 15. BLOCKER Status

No implementation-level Slice 2B1 blocker remains after this hardening pass.

## 16. Next Step

Recommended next slice after PR #3 is reviewed and merged:

```text
Phase 3 Slice 2B2: Seat Roster and Character Assignment
```

Do not start Slice 2B2 from this PR.
