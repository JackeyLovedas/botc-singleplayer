# Phase 3 Slice 2B19A1 Go/No-Go Under Governance V1

## Assessment Metadata

- Authorization: `USER_AUTHORIZED_ENGINEERING_GOVERNANCE_BASELINE_V1`
- Assessment type: read-only candidate precheck
- Accepted main assessed: `8d98b4324acfd9592728b1813f6c83ba395742ba`
- Candidate scope: `Base Dreamer V2 Opportunity Contract`
- Implementation started: `false`
- Product or test files changed by this assessment: `false`
- BOTC rule semantics changed: `false`
- Slice coverage if later accepted: no claim is made by this precheck
- Current Dreamer Role coverage: `PARTIAL`
- Conclusion: `GO`

`GO` means only that the candidate is now small enough to enter the normal rule-truth and design-review gates. It is not `RULE_READY`, `RULE_DESIGN_PASS`, implementation authorization, PR acceptance, or permission to start 2B19A1 from this governance task.

## Executive Finding

The prior 2B19A1 architect blocker is closed by accepted Slice 2B19T. Accepted main now supplies canonical Dreamer tenure bootstrap, exact active-tenure query, transition reconciliation, accepted-history replay audit, and current-character correspondence. It also already supplies the canonical base first-night ability-instance formatter, current V1 Dreamer opportunity flow, V1/V2 first-night task-plan support, the generic `OpenFirstNightRoleActionOpportunity` command, generic opportunity event application/replay, private Dreamer projection, and the first-night outcome ledger.

A strict `Base Dreamer V2 Opportunity Contract` can therefore be designed as one primary risk: bind a newly opened base Dreamer opportunity to the already accepted base task, canonical active Dreamer tenure, and canonical base ability-instance identity while preserving V1 accepted history. Target selection, delivery, candidate construction, Vortox, impairment information, ledger mutation, private knowledge, and Philosopher-gained Dreamer remain outside the candidate.

## Inspected Accepted Surfaces

- `packages/domain-core/src/seamstress.ts`: canonical Dreamer tenure and `findUniqueActiveRoleTenure`.
- `packages/domain-core/src/role-tenure-replay.ts` and `packages/domain-core/src/rebuild.ts`: accepted tenure rebuild audit.
- `packages/domain-core/src/first-night-task-plan.ts`: accepted V1/V2 plan validation and base Dreamer task.
- `packages/domain-core/src/first-night-action-opportunity.ts`: current V1 Dreamer opportunity shape, ID, creator, exact event payload validation, and generic state append.
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`: canonical base ability-instance identity derived from the base task ID.
- `packages/application/src/game-application-service.ts`: reachable generic open command and current Dreamer submit flow.
- `packages/domain-core/src/event-applier.ts`: prospective/event-state validation and generic opportunity replay.
- `packages/domain-core/src/dreamer.ts`: existing V1 target and delivery behavior, which this candidate must not expand.
- `packages/projections/src/index.ts`: existing historical private Dreamer delivery projection, unchanged by this candidate.

## Governance Classification Matrix

| Item | Reachability | Trust | Required in 2B19A1 | Deferred to later Slice | Explicitly unsupported in 2B19A1 | Assessment |
|---|---|---|---|---|---|---|
| Accepted 2B19T Dreamer tenure bootstrap, active query, and replay audit | `R1` | `T2` | Yes, as an unchanged prerequisite and sole canonical tenure authority | No | A second tenure authority or caller-supplied tenure | Accepted main closes the old blocker; no tenure production change is expected. |
| Existing base Dreamer V1 opportunity producer | Current path: `R1`; after an authorized V2 cutover its preserved histories become `R2` | Command/event boundary `T1`; rebuilt opportunity state `T2` | Yes, as compatibility baseline | V1 producer retirement details must be frozen by design | Reinterpreting or migrating V1 history as V2 | Current producer emits a V1-shaped opportunity even with the current V2 task plan. |
| First-night task plan V1 | `R2` | Persisted plan/event `T1`; validated runtime plan `T2` | Yes, replay compatibility only | New V1 behavior | New V1 producer work | Accepted legacy plans must retain their historical opportunity meaning. |
| First-night task plan V2 base Dreamer task | `R1` | Persisted plan/event `T1`; validated runtime plan `T2` | Yes | Gained Dreamer task execution | Philosopher-gained Dreamer opportunity | The base task already exists and uses the canonical base task identity. |
| `OpenFirstNightRoleActionOpportunity` | `R1` | `T1` | Yes | Any new role-specific command | Caller-supplied tenure, ability instance, or computed outcome | The existing exact command shape carries only `taskId`; canonical data must be derived from state. |
| New base Dreamer V2 opening producer and accepted event path | `R1` | Command and event `T1`; validated state/task/tenure `T2`; deterministic ID assembly `T3` | Yes | Target and settlement producers | Any secret outcome or target data in the opening command/event | This is the candidate's single primary risk. |
| V1 accepted opportunity replay | `R2` after V2 cutover | `T1` | Yes | Continuing V1 actions may fail closed if the frozen design does not support them | Silent V1-to-V2 migration | Stored V1 shape and meaning must remain exact. |
| V2 accepted opportunity replay | `R1` | Event/stream `T1`; rebuilt opportunity state `T2` | Yes | V2 target and delivery replay | Treating a manually constructed event as accepted-stream integration | The exact event must prospectively validate and deterministically rebuild. |
| Malformed, mixed-generation, forged-tenure, forged-instance, orphan, or duplicate opportunity history | `R3` | `T1` | Yes | No | Acceptance, fallback, or migration of hostile history | Must fail closed with specific boundary evidence. |
| Existing Dreamer target, delivery, candidate, Vortox, impairment, and information policy | Existing V1 paths remain their current accepted classifications; all new V2 behavior is `R4` | Existing persisted facts `T1`; current derived state `T2`; pure policies `T3` | Only a regression boundary proving the V2 opening does not implement or invoke them | Yes | New V2 target, delivery, candidate set, Vortox, or impairment-information behavior | A V2 opening must not silently flow through the current V1 submit path as completed V2 behavior. |
| First-night ability outcome ledger | Existing ledger `R1`; any Dreamer V2 opportunity fact is `R4` | Persisted/replay input `T1`; rebuilt ledger `T2`; identity formatter `T3` | Unchanged identity dependency only; regression proves opening creates no outcome fact | Any Dreamer terminal outcome recording | Ledger mutation, evidence references, or audit expansion | An open opportunity is not a terminal ability outcome. |
| Existing private Dreamer knowledge projection | Existing delivered V1 knowledge `R1`; V2 knowledge is `R4` | Projection input `T1`; validated historical facts `T2` | Regression proves no new projection output or leakage | V2 private knowledge | Projecting opportunity internals, tenure, ability instance, candidates, or impairment reasons | No projection production file is expected to change. |
| Philosopher-gained Dreamer | `R4` | Future command/event boundary would be `T1`; policy helpers may be `T3` | No | Yes | All gained Dreamer opening, target, delivery, and projection behavior | It must not be used to justify a V2 base opportunity contract. |

## Required Candidate Boundary

The later design may cover only these outcomes:

1. A current V2 base Dreamer task can be opened through the existing accepted command path.
2. The event and stored opportunity use a new, unambiguous V2 discriminator and bind to one canonical base task, one canonical active Dreamer tenure at the opening revision, and the existing canonical base ability-instance identity.
3. No command payload supplies those derived authorities.
4. Exact T1 validation rejects missing, extra, malformed, forged, cross-linked, mixed-generation, duplicate, and orphan data.
5. Prospective validation and full replay produce the same V2 opportunity state.
6. Valid V1 accepted history remains replayable without reinterpretation.
7. A V2 opportunity cannot accidentally invoke or claim the existing V1 target/delivery chain; the later design must freeze the explicit unsupported failure boundary.
8. No ledger fact or private-knowledge output is created by opening the opportunity.

Exact field names, version literals, error codes, and failure-receipt mechanics belong to the later rule-gated design and are deliberately not invented by this precheck.

## Explicit R4 Inventory

The following are future hypothetical behavior and cannot become 2B19A1 acceptance prerequisites:

- target choice or target legality;
- information delivery;
- good/evil candidate construction;
- Vortox forced-false behavior;
- drunk or poisoned information evaluation;
- first-night outcome ledger mutation or Dreamer audit expansion;
- private Dreamer knowledge projection;
- Philosopher-gained Dreamer;
- other-night Dreamer behavior;
- new Storyteller candidate/free-choice strategy;
- a general role-ability opportunity framework.

If design review or implementation requires any of these, or requires a new event system, new state aggregate, new projection, new ledger/audit subsystem, or another shared infrastructure prerequisite, the conclusion changes to `RESLICE_REQUIRED`.

## Expected Production Scope

Conservative candidate allowlist:

1. `packages/domain-core/src/first-night-action-opportunity.ts`
   - expected primary change surface for the V2 base opportunity contract, exact shape/version distinction, canonical task/tenure/ability-instance binding, V1 compatibility, and deterministic creation/validation.
2. `packages/application/src/game-application-service.ts`
   - expected small integration boundary for the reachable open command and the explicit refusal to let a V2 opportunity silently enter the out-of-scope V1 submit/delivery path.

Expected changed production files: `2`.

Expected added production LOC: `250-500`, including exact validators and explicit unsupported-path guards but excluding tests and docs.

No change is expected in `seamstress.ts`, `role-tenure-replay.ts`, `first-night-task-plan.ts`, `first-night-ability-outcome-ledger.ts`, `event-applier.ts`, `dreamer.ts`, `rebuild.ts`, `events.ts`, `game-state.ts`, or `packages/projections`. They are accepted dependencies or generic paths. If the later design proves that a third production file is necessary solely to enforce the explicit V2 unsupported boundary, it must name and justify that file before `RULE_DESIGN_PASS`; it may not silently expand implementation. A need for new shared infrastructure or more than the ADR stop-loss limits changes this conclusion to `RESLICE_REQUIRED`.

## Expected Authority Tests By Layer

No fixed test count is prescribed. The later design must provide at least one primary authority test for every completion criterion, with one primary layer per test:

- `ACCEPTED_STREAM_INTEGRATION`
  - real `OpenFirstNightRoleActionOpportunity` command produces the exact V2 base event and accepted receipt from a validated V2 plan and active Dreamer tenure;
  - negative reachable flows cover absent/mismatched tenure and duplicate/reopened opportunity behavior;
  - a V2 submit attempt demonstrates the frozen explicit unsupported boundary without creating target, delivery, settlement, ledger, or private-knowledge facts.
- `LEGACY_REPLAY_COMPATIBILITY`
  - valid V1 plan/opportunity history retains exact V1 meaning;
  - valid V2 opportunity history rebuilds deterministically after production.
- `HOSTILE_REPLAY_REJECTION`
  - representative forged tenure/instance cross-links, mixed V1/V2 shape, malformed exact shape, and orphan/duplicate history fail closed.
- `STRUCTURAL_VALIDATION`
  - V1 and V2 discriminators, canonical IDs, exact fields, versions, source cross-links, and clone/reference isolation are proven.
- `PURE_POLICY_SEAM`
  - deterministic ID/identity binding helpers are tested only where the later design introduces a genuine T3 seam; existing helpers need no duplicated test quota.
- `PROJECTION`
  - opening V2 creates no new private projection and leaks no tenure, ability-instance, task-plan, candidate, impairment, or answer data.
- `CROSS_PLATFORM_CI`
  - exact frozen product HEAD runs the required Linux and Windows gates.

Supporting tests may share evidence across criteria, but manually created state or a direct helper call cannot be labeled accepted-stream integration.

## Stop-Loss Evaluation

| Check | Result |
|---|---|
| One primary risk | Pass: base V2 opportunity authority only |
| Suggested production files at most 6 | Pass: expected 2 |
| Suggested production additions at most 1,500 | Pass: expected 250-500 |
| No event + state + projection + generic audit bundle | Pass: reuse one existing generic event/state path; no projection or audit expansion |
| No second infrastructure risk | Pass |
| No R4 prerequisite | Pass |
| Prior tenure prerequisite accepted | Pass: Slice 2B19T is accepted `FOUNDATION` |

## Conclusion

`GO`

The accepted tenure prerequisite removes the historical blocker, and the strict base-opening candidate fits the governance stop-loss envelope. The next authorized 2B19A1 run must still begin with fresh rule research, evidence, a complete bounded design, and independent `RULE_DESIGN_PASS`. This governance task does not start it.
