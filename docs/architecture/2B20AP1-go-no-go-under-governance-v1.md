# 2B20AP1 Go/No-Go Under Governance V1

- targetPath: `docs/architecture/2B20AP1-go-no-go-under-governance-v1.md`
- task: `2B20AP1 — Accepted Authority Supersession, Canonical 2B20A Ownership, Traceability and Routing V1`
- taskType: `CI_TEST_INFRASTRUCTURE_PREREQUISITE / NON_PRODUCT`
- infrastructureBranch: `infra/2b20ap1-ownership-supersession-routing-v1`
- infrastructureBaseHead: `167d800e20bed5431764092877085886df4b7c93`
- inspectedHead: `167d800e20bed5431764092877085886df4b7c93`
- acceptedMain: `5a69c90f2d3947556ff45c15c467902b1e28ca43`
- worktree: `CLEAN`
- productBehaviorChanged: `false`
- ruleSemanticsChanged: `false`
- ruleEvidence: `docs/rules/evidence/2B20A-resolved.md / RULE_READY`
- roleCoverageMatrixRead: `docs/rules/ROLE_COVERAGE_MATRIX.md`
- productRepairConsumed: `false`
- infrastructureRepairBudget: `0/2 used; max=2`
- LinuxWorkerRPCInvestigation: `OUT_OF_SCOPE`
- WindowsW7UnknownExitInvestigation: `OUT_OF_SCOPE`
- push/PR/CI mutation: `NOT_AUTHORIZED / NOT_PERFORMED`

## 1. Evidence inspected

Governance and control authority:

- user attachment `C:\Users\wjl\.codex\attachments\8b6439c5-adeb-4beb-82e7-4a6b7d257783\pasted-text.txt`
- `AGENTS.md`
- `project-handoff/00-README-FIRST.md` and its ordered handoff baseline
- relevant Dreamer, impairment, information, Storyteller, interaction, priority and test contracts under `project-handoff/rules/` and `project-handoff/tests/`
- `docs/agent-loop/AUTOPILOT_PROMPT.md`
- `docs/agent-loop/CURRENT_TASK.md`
- `docs/agent-loop/PROJECT_STATE.md`
- `docs/agent-loop/AUTOPILOT_STATE.json`
- `docs/agent-loop/REVIEW_PROTOCOL.md`
- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/evidence/2B20A.md`
- `docs/rules/evidence/2B20A-resolved.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`

Ownership, traceability and routing authority:

- `scripts/vitest-ownership-contracts.mjs`
- `scripts/verify-vitest-ownership-contracts.mjs`
- `scripts/verify-vitest-coverage-groups.mjs`
- `scripts/verify-vitest-windows-application-groups.mjs`
- `scripts/verify-coverage-obligations.mjs`
- `vitest.workspace.ts`
- `.github/workflows/ci.yml`
- A2, A3A, A3B1, B19B and 2B20A design, status and traceability records
- current test sources in application, domain-core and projections

Git/GitHub evidence:

- local branch and HEAD match the requested infrastructure baseline.
- `origin/main` is `5a69c90f2d3947556ff45c15c467902b1e28ca43`.
- PR #46 remains `OPEN`, with remote head `dbfa424c96a8bcf06a0d2a77205626a532aa2ec8`.
- the infrastructure branch is local and unpushed.
- accepted-main application test blob is `0ff733004899f17ff82b20b40b0f41b888ba85d0`; current blob is `b59f0e1640dd13983f61cde8bde1f26947eff866`.

Commands used as evidence included:

```text
git status --short --branch
git rev-parse HEAD
git rev-parse origin/main
gh pr list --state all --json ...
node scripts/verify-vitest-ownership-contracts.mjs --self-test
node scripts/verify-vitest-coverage-groups.mjs
node scripts/verify-vitest-windows-application-groups.mjs inventory --output <temporary-json>
pnpm exec vitest list --workspace vitest.workspace.ts --json
git show 5a69c90:packages/application/src/game-application-service.test.ts
git diff 5a69c90..HEAD -- packages/application/src/game-application-service.test.ts
```

## 2. Current ownership classifier

`classifyOwnershipTitle` in `scripts/vitest-ownership-contracts.mjs`:

1. finds registered contracts whose `markerPrefix` occurs anywhere in a title;
2. rejects more than one registered match as `AMBIGUOUS_SLICE_OWNERSHIP_MARKER`;
3. reports an unregistered slice marker only when no registered marker matched;
4. requires the selected registered marker to match the title at offset zero;
5. uses `file + ancestorPath + title` as semantic identity.

This causes the current composite form:

```text
[2B19A3B1-2B20A][2B20A-Cxx]
```

to be classified as A3B1 today because 2B20A is not registered. Adding a 2B20A contract without retitling would make the same title ambiguous. Composite markers therefore cannot survive the repair.

The ownership verifier self-test passes `22/22`, proving the harness itself works against its frozen fixtures. The live audit does not pass: `node scripts/verify-vitest-coverage-groups.mjs` reaches ownership auditing and fails first on A3A:

```text
OWNERSHIP_FROZEN_BASELINE_MISMATCH
2B19A3A semantic inventory
expected=5e544f734381f99f20ac715513b7af7e5a33af6726ca9cad8a0c6d8c1fe7b2cb
actual=b5013564f6508b204ca353d7802886c49e166b5cc15d3e1e50f5283b58d809d6
```

This is expected evidence of an undocumented semantic replacement, not authority to refresh the frozen hash.

## 3. Frozen A3A and A3B1 contracts

A3A remains frozen as:

- owner project: `application-service-dreamer-vortox`
- semantic/project executions after deduplication: `10`
- traceability rows: `92`
- dynamically resolved rows: `83`
- supporting authorities: `2`
- frozen semantic hash: `5e544f734381f99f20ac715513b7af7e5a33af6726ca9cad8a0c6d8c1fe7b2cb`

A3B1 remains frozen as:

- owner project: `application-service-dreamer-vortox`
- semantic/project executions: `6`
- traceability rows: `60`
- dynamically resolved rows: `58`
- supporting authorities: `4`
- frozen semantic hash: `bd194c778f83c42c4bc46307f028e1a289b01c50a49c2169ce2a07c267a317f4`

These hashes and historical contracts must remain immutable. Supersession must be represented as an append-only audit relationship, not by replacing frozen expected hashes.

## 4. Historical semantic dispositions

### 4.1 A3A C17

Accepted predecessor:

```text
file:
packages/application/src/game-application-service.test.ts

ancestor:
GameApplicationService / dreamer-vortox shard

title:
[2B19A3A-C17] fails a represented DRUNK base Dreamer receipt-free through the real Philosopher chain
```

Accepted semantics:

- real Philosopher chooses Dreamer;
- native/base Dreamer becomes canonically DRUNK;
- V3 opportunity remains open;
- Submit returns retryable `ApplicationNotConfigured`;
- no events, version change or receipt are produced.

Current physical test:

```text
[2B19A3A-C17][2B20A-C35] accepts the reachable canonical-drunk base Dreamer through the real Philosopher chain
```

Current semantics are the opposite terminal result:

- command accepts;
- target, V7 delivery and settlement commit atomically;
- receipt exists;
- opportunity closes.

Disposition:

```text
A3A C17 = WHOLE_TEST_SEMANTIC_SUPERSESSION
successor = 2B20A C35
```

The A3A marker must be removed from the current successor title. The predecessor must remain auditable by accepted head, file/blob identity, ancestor, title and whole-test supersession record.

### 4.2 A3B1 C18

Accepted predecessor:

```text
[2B19A3B1-C18/C28] keeps canonical DRUNK without effective Vortox receipt-free, OPEN, and retryable
```

Its authoritative C18 meaning was canonical DRUNK without effective Vortox remaining unsupported. That entire physical test was removed when 2B20A made the state settleable.

Disposition:

```text
A3B1 C18 = WHOLE_TEST_SEMANTIC_SUPERSESSION
successor authority = bounded 2B20A accepted V7 success evidence
```

### 4.3 A3B1 C28

The removed `[2B19A3B1-C18/C28]` title contained a C28 token, but the frozen A3B1 traceability assigns C28 primary authority to the still-present test:

```text
[2B19A3B1-C28/C29] proves every V4 failure stage is atomic retryable and converges exactly once
```

That primary test and its dependency, candidate, metadata, prospective, append, commit and receipt-persistence failure semantics remain unchanged.

Disposition:

```text
A3B1 C28 = PRESERVED_NOT_SUPERSEDED
obsolete C28 token on removed C18/C28 test = RETIRED_NONPRIMARY_ALIAS
```

It is incorrect to supersede A3B1 C28 wholesale or to bind it to 2B20A.

### 4.4 A2 C20

Accepted physical test:

```text
[2B19A2-C20] keeps every retryable unsupported or dependency path receipt-free and mutation-free
```

Accepted subcases included:

- current No Dashii unresolved;
- canonical Philosopher-caused DRUNK without Vortox unresolved;
- command-store dependency failure;
- prospective failure.

The 2B20A diff removed only the `"drunk"` subcase. No Dashii, dependency and prospective cases remain.

Disposition:

```text
A2 C20 = SUBCASE_SUPERSESSION
supersededSubcase = canonical Philosopher-caused DRUNK / no-current-Vortox unsupported failure
remainingWholeTestAuthority = PRESERVED
```

For new 2B20A traceability, the remaining A2 C20 test may be cited only as supporting authority. It cannot simultaneously serve as primary for 2B20A C15 and C36.

## 5. Current 2B20A 37-criterion classification

Active criteria are:

```text
C01,C03-C07,C10-C33,C34-C40
```

The checked-in traceability claims:

```text
activeCriterionCount=37
primaryIdentityCount=37
duplicatePrimaryIdentities=0
supportingAuthorityCount=37
```

The first count is correct; the primary claims are not.

### 5.1 Exact composition

- `21` application-service tests use composite `[2B19A3B1-2B20A][2B20A-Cxx]` markers:
  `C01,C03,C04,C05,C06,C07,C10,C12,C13,C14,C21,C22,C23,C25,C26,C27,C31,C37,C38,C39,C40`.
- `8` tests already have direct canonical 2B20A markers:
  `C16,C17,C18,C19,C20,C28,C29,C34`.
- `C35` shares one physical test with historical A3A C17.
- `7` criterion rows borrow earlier-slice primary identities:
  `C11,C15,C24,C30,C33,C35,C36`.

Borrowed mapping:

| 2B20A criterion | Borrowed identity |
|---|---|
| C11 | `[2B19A2-C06]` |
| C15 | `[2B19A2-C20]` |
| C24 | `[2B19A3B1-C08/C30/C36-S14/S16/S17]` |
| C30 | `[2B19A2-C30]` |
| C33 | `[2B19B-S20]` |
| C35 | `[2B19A3A-C17][2B20A-C35]` |
| C36 | `[2B19A2-C20]` |

Therefore:

```text
active criterion rows = 37
actual unique physical primary identities = 36
duplicate within 2B20A = C15/C36
borrowed primary criterion rows = 7
borrowed physical identities = 6
composite application identities routed under A3B1 = 21
```

C24, C33 and C35 additionally collide with active registered A3B1, B19B and A3A authority. C11, C15/C36 and C30 borrow historical A2 authority even though A2 is not currently an ownership registry contract.

### 5.2 Required correction

The final state must have:

```text
37 active criteria
37 distinct physical primary identities
one canonical leading [2B20A-*] marker per 2B20A primary
zero compound markers
zero borrowed primaries
zero cross-contract primary collisions
```

Earlier-slice tests may remain referenced only through explicit `SUP-2B20A-*` records. C35 is the exception only in the sense that it is a successor: it becomes canonical 2B20A primary while A3A C17 moves to the supersession registry.

## 6. Supporting-authority registry

The current document describes 37 `SUP-2B20A-Cxx` authorities in prose. It does not provide the parser-compatible unique registry used by `parseTraceability` in `scripts/vitest-ownership-contracts.mjs`.

The accepted registry contract requires:

- exact `SUP-2B20A-###` IDs;
- exactly one definition per ID;
- exactly one or more explicit criterion references;
- no missing referenced ID;
- no unused registry ID;
- no foreign prefix;
- supporting authority never determines primary layer, reachability, trust or verdict.

The design must map every active criterion to a unique canonical primary and to either `NONE` or a registered `SUP-2B20A-###`. It must not treat suffix-compatible prose such as `SUP-2B20A-C01` as the final parseable scheme.

## 7. C32 static and dynamic evidence

Current C32 is not complete hosted evidence:

```text
ActualTestFile=package.json
ActualPrimaryLayer=CROSS_PLATFORM_CI
MechanismMatch=PENDING_EXACT_HEAD_CI
```

Required separation:

- static evidence: workflow wiring, group selectors, local inventory contracts and exact commands;
- dynamic evidence: future exact-head Ubuntu/Windows hosted results.

Local 2B20AP1 may establish and pass the static wiring contract. Dynamic status must remain:

```text
PENDING_EXACT_HEAD_CI
```

It must not be written as `PASS`, `ACCEPTED` or equivalent. Linux worker RPC and Windows W7 unknown-exit investigations remain separate downstream milestones.

## 8. Exact current test inventory

Workspace discovery returned:

```text
15 Vitest projects
31 physical test files
35 project-file executions
1572 test identities
```

### 8.1 Ordinary topology

Existing nine groups and counts:

| Group | Tests |
|---|---:|
| domain-core-rebuild | 207 |
| domain-core-rest | 363 |
| application | 465 |
| application-service-core | 90 |
| application-service-role-actions | 52 |
| application-service-information-and-later-actions | 82 |
| application-service-compatibility-and-failure-boundaries | 26 |
| application-service-dreamer-vortox | 46 |
| engines-and-projections | 241 |

```text
ordinaryUnion=1572
ordinaryMissing=0
ordinaryUnexpected=0
ordinaryIntersection/duplicate execution=0
```

The live verifier reached the later ownership step, so all earlier ordinary union checks passed.

### 8.2 Coverage topology

Existing eleven groups and counts:

| Group | Tests |
|---|---:|
| domain-core-rebuild | 207 |
| domain-core-rest | 363 |
| application | 465 |
| application-service-core | 90 |
| application-service-role-actions | 52 |
| application-service-information-and-later-actions-base | 73 |
| application-service-information-and-later-actions-a3b2 | 9 |
| application-service-compatibility-and-failure-boundaries | 26 |
| application-service-dreamer-vortox-core | 36 |
| application-service-dreamer-vortox-gained | 10 |
| engines-and-projections | 241 |

```text
coverageUnion=1572 semantic identities
coverageMissing=0
coverageUnexpected=0
coverageWrongOwner=0
coverageIntersection/duplicate execution=0
```

The Dreamer core selector is currently:

```text
\[(?:2B19A3A|2B19A3B1)-
```

After composite-marker removal it must include canonical 2B20A:

```text
\[(?:2B19A3A|2B19A3B1|2B20A)-
```

This keeps the same 36 Dreamer-core test executions. It changes routing classification, not topology or test behavior.

### 8.3 Windows topology

The repository-owned inventory verifier returned:

```text
PASS
baseline=305
W1=9
W2=90
W3=52
W4=73
W5=9
W6=26
W7=46
missing=0
duplicate=0
unexpected=0
all pairwise intersections=0
```

Canonical 2B20A application tests remain in existing W7 because W7 selects the unfiltered `application-service-dreamer-vortox` project. No new Windows group is required.

## 9. Profile and topology authorization

```text
coverageProfileChangeRequired=false
newVitestProjectRequired=false
newProcessGroupRequired=false
PROFILE_AUTHORIZATION_REQUIRED=false
TOPOLOGY_AUTHORIZATION_REQUIRED=false
```

Reasoning:

- ordinary and Windows ownership are already project-based;
- only the existing Dreamer core coverage marker selector needs to recognize 2B20A;
- the same 36 tests remain in that group before and after canonical retitling;
- no coverage test, production line, threshold, fork count, merge algorithm or obligation changes;
- historical approved profiles are source-head-specific and remain immutable;
- `compareToApprovedProfile` evaluates source coverage obligations, not current test-title ownership metadata.

No profile record or `scripts/verify-coverage-obligations.mjs` historical topology entry may be rewritten.

## 10. Bounded GO scope

The next design may cover exactly one infrastructure risk:

```text
accepted-history supersession
+ canonical 2B20A ownership
+ exact traceability/SUP registry
+ unchanged-topology routing
```

It may not include product behavior, BOTC rules, Linux RPC repair, Windows exit observability, coverage-profile generation, new projects/groups, timeout changes or dependencies.

Candidate implementation allowlist:

- `scripts/vitest-ownership-contracts.mjs`
- `scripts/verify-vitest-ownership-contracts.mjs`
- `scripts/verify-vitest-coverage-groups.mjs`
- `scripts/verify-vitest-windows-application-groups.mjs`
- `.github/workflows/ci.yml`
- `packages/application/src/game-application-service.test.ts`
- `packages/domain-core/src/dreamer.test.ts`
- `packages/domain-core/src/rebuild.test.ts`
- `packages/projections/src/private-knowledge-view.test.ts`
- `docs/implementation/phase-3-slice-2b19a2-test-traceability.md`
- `docs/implementation/phase-3-slice-2b19a3a-test-traceability.md`
- `docs/implementation/phase-3-slice-2b19a3b1-test-traceability.md`
- `docs/implementation/phase-3-slice-2b19b-test-traceability.md`
- `docs/implementation/phase-3-slice-2b20a-test-traceability.md`
- one new 2B20AP1 design/status or supersession audit document
- `docs/agent-loop/AUTOPILOT_STATE.json`
- `docs/agent-loop/CURRENT_TASK.md`
- `docs/agent-loop/PROJECT_STATE.md`
- `docs/agent-loop/AUTOPILOT_LOG.md`

Explicitly excluded:

- all product production files;
- rule evidence and role-coverage semantic changes;
- coverage profile registry changes;
- `vitest.workspace.ts` topology changes;
- new test projects or process groups;
- timeouts, dependencies or lockfile;
- Linux/Windows exit diagnostics.

## 11. Mandatory next-design constraints

The independent design must freeze:

1. An append-only supersession record with predecessor accepted HEAD, Git blob identity, file, ancestor path, exact title, criterion, whole/subcase scope, subcase identity where applicable, successor identity and reason.
2. Validation that accepted HEAD exists and is an ancestor; predecessor file/title/hash match exactly.
3. Rejection of missing predecessor, wrong hash, wrong file/ancestor/title, cycles, multiple active successors, duplicate successor, whole/subcase overlap and unknown contracts.
4. Immutable A3A/A3B1/B19B frozen baselines; no hash refresh to conceal replacement.
5. Exact dispositions from section 4.
6. Canonical leading `[2B20A-*]` markers and complete compound-marker removal.
7. A new active 2B20A ownership contract for exactly 37 criteria.
8. Exactly 37 unique physical primary identities; C15 and C36 must no longer share A2 C20.
9. C11/C15/C24/C30/C33/C36 must obtain legitimate 2B20A primaries or be explicitly reclassified as supporting-only with separate unique primary evidence.
10. A parser-compatible unique `SUP-2B20A-###` registry.
11. C32 static wiring separated from dynamic hosted status.
12. Existing 9/11/W1–W7 routing with union complete and intersections zero.
13. Existing A3A C28-independent authority, unsuperseded A3A/A3B1/B19B tests and historical replay semantics unchanged.
14. No deletion, weakening, `.skip`, `.only`, business-assertion alteration or new low-value duplicate test.
15. Infrastructure Repair maximum `2`; each repair requires fresh independent review.

## 12. Acceptance checks

The eventual implementation must demonstrate:

- ownership self-tests include positive and negative supersession cases;
- live ownership audit passes all registered contracts;
- A3A C17 and A3B1 C18 predecessors resolve from accepted history;
- A3B1 C28 primary remains unchanged;
- A2 C20 removed drunk subcase and remaining subcases are independently accounted for;
- 37/37 2B20A criteria resolve to 37 unique canonical primaries;
- zero compound, borrowed or duplicate primaries;
- every SUP ID is defined, referenced and unique;
- C32 dynamic status remains pending;
- ordinary inventory is exact with union 1572 and intersection zero;
- coverage inventory is exact with union 1572 and intersection zero;
- Windows inventory is exact with union 305 and intersection zero;
- affected focused tests, typecheck, lint and full ordinary pass;
- production diff is zero;
- coverage profile, timeout, dependency and topology diffs are zero.

Full coverage execution, GitHub Actions and Windows hosted execution are not local acceptance requirements and must not be reported as passed if unrun.

## 13. Risks and rollback

Known risks:

- silently refreshing frozen hashes would rewrite accepted history;
- registering 2B20A before removing compound markers would create ambiguity;
- retitling without synchronized selectors would drop Dreamer tests from coverage routing;
- using existing earlier-slice tests as 2B20A primaries would preserve cross-contract duplication;
- conflating C32 static wiring with hosted evidence would fabricate CI authority;
- changing historical profile entries would create a second independent infrastructure risk.

Rollback is one bounded infrastructure revert restoring ownership scripts, selectors, test titles and traceability/control documents to `167d800e20bed5431764092877085886df4b7c93`. Accepted historical records and product files must never be rewritten during rollback.

## 14. Stop conditions

Stop immediately if:

- exact predecessor identity or accepted hash cannot be proven;
- supersession records conflict or form a cycle/multiple-successor graph;
- a valid solution requires product behavior or BOTC rule changes;
- a coverage profile change becomes necessary;
- a new Vitest project or process group becomes necessary;
- Linux RPC or Windows W7 exit work enters scope;
- a test must be deleted or weakened;
- a second independent CI infrastructure risk is discovered;
- two Infrastructure Repair rounds are exhausted;
- independent design review does not return `RULE_DESIGN_PASS` with no blockers.

## 15. Why this remains one infrastructure risk

Ownership classification, accepted-history supersession, traceability uniqueness and the existing routing selectors are one coupled audit boundary: canonical titles determine ownership, ownership determines traceability resolution, and the same titles determine the existing Dreamer coverage partition. Correcting them together does not add another runtime, process, profile, production or hosted-CI subsystem.

## Governance verdict

```text
GO
```

This GO authorizes only one bounded 2B20AP1 infrastructure design and its independent rule-design review. It does not authorize implementation, push, PR creation, CI rerun, Linux/Windows investigation, or 2B20B.
