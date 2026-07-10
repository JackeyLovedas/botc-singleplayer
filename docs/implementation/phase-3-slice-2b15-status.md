# Phase 3 Slice 2B15 Status: Seamstress First-Night Choice And Private Information

## Status

Accepted on `main` through PR #17. The exact reviewed PR HEAD `6020dd9849ca164880975b9c5c39f5639f6a68c9` received controller-collected `PASS`, `CODE_REVIEW_PASS`, and `RULE_REVIEW_PASS`; all four required CI checks succeeded before merge. PR #17 merged as `ee77565e1935701084b51ae7d4dd8764023d2352`, accepted tag `phase-3-slice-2b15-seamstress-first-night-choice-information` points to that merge locally and remotely, and the remote feature branch was deleted.

Rules baseline: Phase One v2.1. Fresh evidence is recorded in `docs/rules/evidence/2B15.md`. The reviewed design is `docs/implementation/phase-3-slice-2b15-design.md` at SHA-256 `a0de120b266e26a8d7fcea293b7cb5dbf24c8a4ea5e80cad7cfc121cb1adaa52`; the corrected v3.1 erratum is at SHA-256 `9d421f44a538e4599c03bccd7f631da18866aa6e709d28735e724af79d130528`. Renewed independent design review returned `RULE_DESIGN_PASS` with no blockers.

## Scope Delivered

- Added the public `SeamstressResolutionCapabilityDeclared` fact to new supported-script selection batches. Legacy streams without this fact still replay and retain defer-only V1 opportunities.
- Added exact V1/V2 Seamstress opportunity discrimination, cloning, equality, runtime validation, replay validation, and deterministic base versus Philosopher-granted opportunity IDs.
- Added slice-local role-tenure, ability-instance, and once-per-game entitlement state. It bootstraps from `CharactersAssigned`, accepts the existing `SnakeCharmerDemonSwapApplied` transition as its sole production transition adapter, and keeps reacquisition identity distinct.
- Enabled base and Philosopher-granted first-night `CHOOSE_TWO_PLAYERS` through one shared pipeline.
- Canonicalized exactly two distinct, non-self modeled targets by numeric seat order.
- Added the atomic four-event chain `SeamstressTargetsChosen`, `SeamstressAbilitySpent`, `SeamstressInformationDelivered`, and `ScheduledTaskSettled(SEAMSTRESS_INFORMATION_DELIVERED)`.
- Preserved legacy V1 `DEFER` and added V2 `DEFER`; both use two events and leave the entitlement unspent.
- Separated settlement truth, represented source impairment, unresolved continuous effects, Vortox constraint, candidate legality, reliability, simulation reason, and delivered answer.
- Added source-only historical player and AI projection as an ordered delivery array. Projection validation uses stored chain facts, requires globally unique opportunity/task/entitlement chains, and does not recompute an answer from later character state.
- Added type/count-only accepted summaries for every accepted Seamstress command while retaining full canonical event envelopes in the event batch/store.
- Added descriptor-captured structural command fingerprints, exact canonical-command comparison, pre-reflection rejection of every stored fingerprint Proxy, fail-closed legacy or malformed receipt handling, and `CommandIdempotencyConflict` without exposing canonical JSON or digests.

## Public Capability And Compatibility

New `SelectScript` execution emits exactly:

```text
ScriptSelected
SeamstressResolutionCapabilityDeclared
PhaseTransitioned
```

The capability uses the repository script literal `sects-and-violets`, catalog signature `canonical-role-catalog-v1:60ac4718`, and the reviewed fixed-roster/native-alignment/represented-effect coverage literals. It is declared before hidden assignment exists and does not inspect roles, assignments, impairments, or Vortox.

Legacy two-event script-selection batches remain replayable. Without the public capability, base Seamstress can create only the exact V1 defer-only opportunity. With the capability, supported base and Philosopher-granted task sources create the exact V2 opportunity and visibility schema.

## Stable Ability Identity

The implementation records canonical branded IDs for:

- relevant role tenure;
- role-tenure transition facts;
- base or Philosopher-granted Seamstress ability instances;
- once-per-game use entitlements;
- answer candidates.

An opportunity binds character-state revision `N`; settlement binds revision `M`, with `M >= N`. The same source tenure and ability instance must remain active continuously across `[N, M]`. Leaving and later reacquiring an identical-looking role creates a different tenure/instance and invalidates the old opportunity.

A legal two-target use spends exactly the referenced entitlement, including represented drunk or poisoned uses. `DEFER` does not spend. A duplicate spend or a new ordinary opportunity for a spent entitlement fails closed.

## Choice, Information, And Modifier Contract

The choice batch is exactly:

```text
SeamstressTargetsChosen
SeamstressAbilitySpent
SeamstressInformationDelivered
ScheduledTaskSettled(SEAMSTRESS_INFORMATION_DELIVERED)
```

Target existence, native current alignment, represented impairment, Vortox constraint, answer selection, and settlement are evaluated at `M`. Target order in canonical facts is numeric seat order.

The stored information fact keeps these concerns separate:

- `comparison.ruleCorrectAnswer` is `YES` exactly when the two stored native current alignments match;
- represented `DRUNK` or `POISONED` evidence yields `KNOWN_INEFFECTIVE`, but the legal use still spends;
- absent represented impairment yields `NOT_PROVEN`, never a claim of effective behavior;
- an active represented Vortox tenure requires the false candidate, including when the Seamstress source is impaired;
- a represented impairment disables Vortox only when it matches that Vortox player, seat, role, and tenure interval;
- without a Vortox constraint, the deterministic policy selects the true candidate, including the represented-impaired branch.

A hidden assignment containing No Dashii does not derive adjacency poison and does not change command acceptance, event count/types, or the no-Vortox truth-favoring selection. Continuous poison remains explicitly unresolved.

## Accepted Result And Idempotency Boundary

Every accepted `SubmitSeamstressAction` result has exactly eight enumerable keys and no `events` property:

```text
status
resultSchemaVersion
eventDisclosure
gameId
gameVersion
eventCount
eventTypes
idempotent
```

Choice reports the four ordered public event types; V1/V2 defer reports the two ordered public event types. The summary never contains targets, roles, answers, truth, effectiveness, impairment, Vortox, candidate, reliability, constraint, or simulation payloads. The in-memory commit store verifies summary count and ordered types against the separate full canonical event batch.

All new accepted and rejected receipts store a complete validated structural fingerprint. Equality uses the exact captured canonical command string; SHA-256 is an integrity check, not the equality decision. Reordered own data properties compare equal. Changes to actor, expected version, issued time, correlation, target order, decision, payload, or extra own fields conflict. Accessors, custom non-enumerable fields, symbols, sparse or extra-key arrays, cycles, non-plain objects, bigint, unsafe numbers, and negative zero fail before receipt I/O or event work.

Legacy receipts and malformed, unknown-version, length-invalid, or digest-invalid fingerprints return `CommandIdempotencyConflict` and are never overwritten. Every stored fingerprint Proxy, including transparent, revoked, reflection/property-throwing, late-throwing, and nonthrowing time-varying values, is rejected by Node proxy identity before proxy-sensitive reflection or property access. An accepted retry returns only the stored result with `idempotent: true` and appends no event.

## Atomicity And Replay

Runtime, prospective, batch, application, and replay checks enforce exact keys, versions, discriminated unions, canonical IDs, source continuity, target order, unspent entitlement, candidate legality, modifier facts, and settlement correlation.

Replay rejects malformed or hybrid V1/V2 opportunities; incomplete, reordered, overlong, or mixed choice batches; choice without V2 opportunity; spend without its choice; duplicate spend; delivery without one matching choice/spend; revision or tenure mismatch; and settlement without delivery. Prospective application of the complete batch must succeed before append, so no prefix survives a later failure.

Canonical IDs and ordering use explicit ASCII/numeric comparisons. No new path uses `Date.now`, `Math.random`, random UUIDs, `localeCompare`, `Intl.Collator`, or environment locale.

## Projection Boundary

Only the source player and source AI receive:

```text
seamstressInformation = [
  { targets: [KnownPlayerReference, KnownPlayerReference], deliveredAnswer: YES | NO },
  ...
]
seamstressKnowledgeModelVersion = seamstress-private-knowledge-v1
deliveredKnowledgeStages += SEAMSTRESS_INFORMATION
```

Every delivery requires one exact closed V2 opportunity, choice, spend, delivery, and matching settlement. Stored opportunity source/tenure/instance fields and the stored information chain are checked with exact runtime shapes. Opportunity IDs, task/settlement IDs, and entitlement/spend IDs must also be unique across delivered histories. Multiple genuinely distinct deliveries remain in canonical history order. Later current-role or alignment changes do not alter delivered history.

The projection excludes target alignments, correct answer, truth labels, candidate legality, represented impairment details, `KNOWN_INEFFECTIVE` versus `NOT_PROVEN`, Vortox identity/constraint, reliability, simulation reason, and all internal task/opportunity/tenure/instance/entitlement/candidate IDs.

## Coverage Status

Seamstress advances from overall `SKELETON` to overall `PARTIAL`; it is not `COMPLETE`.

- Base ability: `PARTIAL`; first-night V2 choice, legal spend, information, and V1/V2 defer are implemented.
- First-night behavior: `PARTIAL`; base and Philosopher-granted execution are implemented for the reviewed fixed-roster model.
- Drunk and poisoned behavior: `PARTIAL`; only represented impairment facts are evaluated, and continuous poison remains unresolved.
- Vortox interaction: `PARTIAL`; the represented active-tenure false-information constraint is implemented.
- Philosopher interaction: `PARTIAL`; first-night granted Seamstress execution has independent tenure/instance/entitlement identity.
- Character-change interaction: `PARTIAL`; slice-local tenure continuity and the existing Snake Charmer transition adapter are implemented, not a general role-change subsystem.
- Projection behavior: `PARTIAL`; exact source-only historical first-night information is implemented.
- Other-night recurrence, life/death/revival, Travellers, registration, Barista, No Dashii poison derivation, and general character/effect lifecycle remain unsupported.

Evidence scenarios 7, 15, 20, 23, 28, 34, and 36 remain only partially covered. Scenario 39 remains a rule-review prohibition; the executable positive result is that a represented impaired legal use spends.

## Verification

Final local verification on the repaired implementation tree:

```text
pnpm typecheck: passed
pnpm lint: passed
focused repair suites: passed, 2 files / 187 tests
pnpm --filter @botc/application test: passed, 3 files / 173 tests
pnpm test: passed, 21 files / 717 tests
pnpm test:coverage: passed, 21 files / 717 tests
coverage: 85.04% statements, 78.12% branches, 97.58% functions, 85.04% lines
git diff --check: passed
deterministic primitive scan: no new prohibited production usages
```

Repair round 1 added player/AI fail-closed checks for exact duplicate and cross-reused opportunity/task/entitlement delivery chains. Repair round 2 added pure and service-level swap-on-final-read vectors and retained transparent, revoked, reflection/property-throwing, and late-throwing Proxy coverage. The service returns the exact nonpersisted idempotency conflict without event or receipt writes, overwrite, or fingerprint/detail disclosure; all targeted and full gates passed afterward.

## Non-Goals

- No other-night scheduling or recurrence.
- No life, death, revival, or Traveller model.
- No Spy/Recluse registration decisions.
- No Barista execution.
- No No Dashii neighbor search, continuous-poison derivation, or poison lifecycle.
- No general role-change or effect-lifecycle command/event.
- No Storyteller free answer policy, AI target policy, UI, Electron, SQLite, network, or persistence adapter.
- No global conversion of non-Seamstress accepted results to summaries.

## Acceptance

- Exact reviewed PR HEAD: `6020dd9849ca164880975b9c5c39f5639f6a68c9`.
- Controller-collected independent result: `PASS`, `CODE_REVIEW_PASS`, and `RULE_REVIEW_PASS`.
- Required CI: all four PR #17 checks succeeded.
- Merge: `ee77565e1935701084b51ae7d4dd8764023d2352` on `main`.
- Accepted tag: `phase-3-slice-2b15-seamstress-first-night-choice-information`, pointing to the merge commit locally and remotely.
- Remote feature branch: deleted; no active slice PR remains.
- Coverage remains the documented bounded `PARTIAL`, not `COMPLETE`.
- This was slice 3/3 for the governed run; no next slice may be selected or designed by this closeout.
