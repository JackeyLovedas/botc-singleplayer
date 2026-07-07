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
- `packages/domain-core`: owns setup payload contracts, replay validation, stable ordering, catalog snapshotting, and version constants.

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

Regression coverage verifies:

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

The implementation follows the standard sfc32 update order:

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

Domain and setup ordering use a stable ASCII/code-unit comparator:

```text
left === right ? 0 : left < right ? -1 : 1
```

No locale-sensitive comparator or comparator-free ordering remains in deterministic setup code.

Canonical output rules:

- `roleCatalogSnapshot.roles`: character type order, then ASCII `roleId`.
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

`assertValidSectsAndVioletsCatalog` validates the exact 25-role catalog, not only aggregate counts.

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

`setup-engine` uses `validateScriptDefinitionForSetup` from `domain-core` and does not depend on `rules-snv`.

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

## 9. Replayable Full Role Catalog Snapshot

`GeneratedSetup` and `SetupGenerated` now include:

```text
roleCatalogSnapshot
roleCatalogSignature
roleCatalogSignatureAlgorithm
```

`roleCatalogSnapshot` contains:

- `scriptId`
- `edition`
- `roleCatalogVersion`
- all 25 canonical `RoleSetupSnapshot` entries.
- `canonicalSignature`

This makes each setup event self-describing for replay. Replay no longer needs to infer which catalog existed at generation time from only a version string.

## 10. Canonical Role Catalog Signature

Catalog signature algorithm:

```text
canonical-role-catalog-v1
```

Supported Sects & Violets catalog signature:

```text
canonical-role-catalog-v1:60ac4718
```

The signature is computed from canonical serialization of:

- `scriptId`
- `edition`
- `roleCatalogVersion`
- each role's `roleId`
- each role's `characterType`
- each role's `defaultAlignment`
- each role's `edition`
- each role's setup modifier deltas

The signature is stable across source role order changes and platforms. It is a deterministic replay guard, not a cryptographic authenticity mechanism.

## 11. Role Snapshot To Catalog Binding

Replay validates every generated role snapshot against `roleCatalogSnapshot`:

- every `actualRoles` entry must exist in the catalog.
- every `actualRoles` entry must exactly match the catalog role snapshot.
- `demonRole` must exist in the catalog.
- `demonRole` must exactly match the catalog role snapshot.
- every `demonBluffs` entry must exist in the catalog.
- every `demonBluffs` entry must exactly match the catalog role snapshot.

The existing deep match between `demonRole` and the unique demon in `actualRoles` remains.

## 12. Unknown Role Replay Protection

Replay rejects unknown role IDs in:

- `roleCatalogSnapshot.roles`
- `actualRoles`
- `demonRole`
- `demonBluffs`
- `constraintsSnapshot.lockedRoleIds`
- `constraintsSnapshot.excludedRoleIds`
- `constraintsSnapshot.exactRoleIds`

Coverage includes unknown actual roles, unknown demon bluffs, and unknown locked/excluded/exact constraints.

## 13. Role-Specific Modifier Protection

Replay now rejects role metadata that is generically legal but not the supported Sects & Violets catalog.

Covered cases include:

- fake catalog roles with legal aggregate counts.
- `vortox` carrying Fang Gu's setup modifier.
- `no_dashii` carrying Vigormortis's setup modifier.
- `actualRoles` snapshots whose known role type, alignment, or setup modifier differs from the catalog.
- `demonRole` snapshots whose modifier differs from the catalog.
- `demonBluffs` snapshots whose role metadata differs from the catalog.

## 14. Version Constants

The event-validated setup constants live in `domain-core`:

```text
SUPPORTED_SETUP_ALGORITHM_VERSION = snv-12-setup-v1
SUPPORTED_RANDOM_ALGORITHM_VERSION = xmur3-sfc32-rejection-v1
SUPPORTED_SETUP_RANDOM_STREAM = setup/sects-and-violets/12/v1
SUPPORTED_ROLE_CATALOG_VERSION = snv-role-catalog-v1
SUPPORTED_ROLE_CATALOG_SIGNATURE_ALGORITHM = canonical-role-catalog-v1
SUPPORTED_ROLE_CATALOG_SIGNATURE = canonical-role-catalog-v1:60ac4718
```

`GeneratedSetup` and `SetupGenerated` include the role catalog version, catalog snapshot, catalog signature, and signature algorithm.

## 15. SetupGenerated Replay Validation

Domain replay validates the setup event instead of trusting the generator.

Replay checks include:

- supported setup algorithm version.
- supported random algorithm version.
- supported random stream.
- supported role catalog version.
- supported role catalog signature algorithm.
- complete 25-role catalog snapshot.
- catalog snapshot metadata matching the setup payload.
- unique catalog role IDs.
- canonical catalog role order.
- catalog 13/4/4/4 counts.
- recalculated catalog signature matching `roleCatalogSignature`.
- `roleCatalogSignature` matching the supported exact catalog signature.
- valid role snapshots.
- canonical `actualRoles` order.
- canonical `demonBluffs` order.
- exactly one demon and two minions.
- `actualRoles`, `demonRole`, and `demonBluffs` bound to the catalog snapshots.
- `demonRole` deeply equals the unique demon snapshot in `actualRoles`.
- strict `setupModifiersApplied` shape.
- `constraintsSnapshot` uniqueness, ordering, overlap, locked/excluded/exact invariants.
- every constrained role ID exists in the catalog.
- validation summary consistency.

The replay tests include damaged-event cases and a legal rebuild into `CHARACTER_ASSIGNMENT`.

## 16. Structured Setup Failure Details

`CommandRejected` is now a discriminated union:

```text
SetupGenerationFailed -> details.kind = setup-generation
General rejection -> no details field
```

For `SetupGenerationFailed`, the application layer preserves:

- `failureCode`
- `message`
- `conflictingRoleIds`
- `requestedCounts`
- `availableCounts`
- `constraintsSnapshot`

The `rejected` helper requires structured details for `SetupGenerationFailed` at the type boundary and at runtime. General command rejections reject extra details at the type boundary. Retrying the same failed setup command returns the same structured details with `idempotent = true`.

## 17. Golden Seed

Golden input:

```text
scriptId = sects-and-violets
rootSeed = golden-seed
playerCount = 12
constraints = {}
roleCatalogSignature = canonical-role-catalog-v1:60ac4718
roleCatalogSignatureAlgorithm = canonical-role-catalog-v1
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

## 18. Quality Gates

Local gates after PR #3 final hardening:

```text
pnpm typecheck: passed
pnpm lint: passed
pnpm test: passed, 229 tests
pnpm test:coverage: passed, 229 tests
pnpm --filter @botc/setup-engine test: passed on Windows
```

## 19. Not Implemented

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

## 20. BLOCKER Status

No implementation-level Slice 2B1 blocker remains after this hardening pass.

## 21. Next Step

Recommended next slice after PR #3 is reviewed and merged:

```text
Phase 3 Slice 2B2: Seat Roster and Character Assignment
```

Do not start Slice 2B2 from this PR.
