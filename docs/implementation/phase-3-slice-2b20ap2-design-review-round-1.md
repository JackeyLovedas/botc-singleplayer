# Phase 3 Slice 2B20AP2 Independent Rule Design Review Round 1

## Review identity

- reviewerRole: `independent read-only reviewer`
- reviewedPR: `47`
- reviewedHead: `f71fffa9a043334283e8e95da27af33833976da1`
- reviewTimestamp: `2026-07-27T10:26:29Z`
- reviewScope:
  `2B20AP2 Hosted Exact-Head CI Execution Closure V1 complete design,
  preservation evidence, failure audit, governance, relevant repository
  contracts, workflow topology, runner feasibility, coverage-profile
  provenance, rollback, and stop-loss`
- independence:
  `READ_ONLY / NO_REPOSITORY_WRITES / NO_IMPLEMENTATION`

## Files reviewed

### Proposed design and active governance

- `docs/implementation/phase-3-slice-2b20ap2-design.md`
- `docs/implementation/phase-3-slice-2b20ap2-hosted-ci-failure-audit.md`
- `docs/architecture/2B20AP2-go-no-go-under-governance-v1.md`
- `docs/rules/evidence/2B20AP2.md`
- `docs/agent-loop/AUTOPILOT_STATE.json`
- `docs/agent-loop/CURRENT_TASK.md`
- `docs/agent-loop/PROJECT_STATE.md`
- `docs/agent-loop/AUTOPILOT_LOG.md`

### Parent rule and coverage authority

- `docs/rules/evidence/2B20A.md`
- `docs/rules/evidence/2B20A-resolved.md`
- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`

### Relevant implementation contracts inspected read-only

- `.github/workflows/ci.yml`
- `vitest.workspace.ts`
- `package.json`
- `pnpm-lock.yaml`
- `scripts/vitest-ownership-contracts.mjs`
- `scripts/verify-vitest-ownership-contracts.mjs`
- `scripts/verify-vitest-coverage-groups.mjs`
- `scripts/verify-vitest-windows-application-groups.mjs`
- `scripts/collect-vitest-shard-diagnostics.mjs`
- `scripts/verify-coverage-obligations.mjs`

No production or test file was changed or reviewed as implementation output.
Relevant test inventories and accepted-history identities were inspected only
to evaluate whether the design was executable and preserved accepted
authority.

## Sources and evidence reviewed

- user authorization:
  `USER_AUTHORIZED_2B20AP2_HOSTED_HISTORY_DREAMER_PROCESS_ISOLATION_COVERAGE_PROFILE_AND_CONDITIONAL_2B20A_CLOSEOUT`;
- exact design baseline:
  `8881f54bcc8467502d56634be993ebffc53d009b`;
- reviewed design commit:
  `f71fffa9a043334283e8e95da27af33833976da1`;
- accepted main:
  `5a69c90f2d3947556ff45c15c467902b1e28ca43`;
- accepted application-test blob:
  `0ff733004899f17ff82b20b40b0f41b888ba85d0`;
- old push run:
  `30247984028`;
- old pull-request run:
  `30248052689`;
- H1-H4 failure classifications and job/artifact inventory in the failure
  audit;
- pinned USER_OVERRIDES blob, Chinese Wiki oldids, official BOTC Wiki oldids,
  and official nightsheet evidence recorded in `2B20AP2.md`;
- frozen logical topology ordinary `9`, coverage `11`, Windows `W1-W7`;
- frozen Dreamer/Vortox inventory `14/22/10`, union `46`;
- Product Repair `2/2`, 2B20AP1 Infrastructure Repair `2/2`, and independent
  2B20AP2 CI remediation `0/2`.

## Evidence assessment

### Rule truth and non-product boundary

The mandatory rule evidence is available, internally consistent for the
preservation-only scope, and correctly terminates `RULE_READY`. Dreamer remains
`PARTIAL`. The design does not propose product behavior, rule, event, replay,
projection, privacy, test-title, timeout, dependency, project, or logical-group
changes.

Assessment: `PASS`.

### H1 accepted-history classification

The design correctly freezes full-history checkout, accepted-object discovery,
ancestry, blob validation, current-successor validation, no verifier-side
network fetch, and immutable accepted authority. It separates unavailable
history, true non-ancestor, blob mismatch, and other Git failure.

Assessment: `PASS`.

### H2 append-only coverage profile

The design correctly requires a source commit, exact-source local coverage,
canonical delta, independent profile review, append-only child profile, old
profile immutability, and no profile-child remediation-round consumption.

Assessment: `PASS`, subject to the traceability and mergeable-blob findings
below.

### H3/H4 segmented execution and diagnostics

The design correctly preserves logical topology, freezes `14/22/10`, requires
same-process `onFinished(files, errors)` evidence, preserves true process exit,
continues ordered evidence collection after failure, and forbids a diagnostic
rerun or cross-platform cause inference.

Assessment: `FIX_REQUIRED`. The runner output is described as a Vitest JSON
blob written by the custom reporter, but the existing test/coverage merge
contracts require Vitest's mergeable `blob` reporter output. The design does
not freeze a dual-reporter contract or isolate the custom same-process
evidence as a sidecar.

### Implementation feasibility and trust anchors

The design freezes an `npm_execpath` launcher and an externally supplied
artifact root. Those are not executable trust anchors in clean hosted
environments: `npm_execpath` may be absent or spoofed, and no repository-owned
absolute root exists from which the proposed output-dir allowlist can be
derived without caller-controlled policy.

Assessment: `FIX_REQUIRED`.

### Design-time traceability

The governance requires design-time coverage of rule/authority claims,
completion criteria, reachability, trust, primary layer, expected result, and
supporting authorities. Round 1 contains acceptance decisions but no complete
criterion matrix or planned support registry. In particular, accepted-history
authority, hostile evidence, launcher/root trust, logical merges, Windows, and
zero-product-diff claims cannot be mechanically traced.

Assessment: `FIX_REQUIRED`.

## Findings

### MISSING_GOVERNANCE_V1_1_DESIGN_TRACEABILITY_AND_R_T_CLASSIFICATION

Severity: `BLOCKER`

Round 1 lacks the complete design-time criterion matrix required to distinguish
completion claims by reachability, trust entry point, primary layer, expected
result, evidence mechanism, and planned supporting authority. It also lacks a
unique planned support registry. This permits hostile R3 evidence to be
misread as accepted-success authority and leaves source/profile/zero-diff
claims without a frozen evidence owner.

Required correction:

- create a standalone Round 2 with exact criteria `C01-C15`, nine fields per
  row;
- define R1/R2/R3/R4 closure and T1/T2/T3 entry points;
- prohibit R3 from serving as accepted authority;
- define `SUP-2B20AP2-001` through `SUP-2B20AP2-010` with producer, authority
  status, purpose, mutation disposition, and exact criterion use.

### VITEST_MERGEABLE_BLOB_AND_SIDECAR_CONTRACT_NOT_FROZEN

Severity: `BLOCKER`

Round 1 uses the word `blob` for custom reporter JSON. Vitest test and coverage
merge require mergeable artifacts emitted by Vitest's `blob` reporter. A
custom same-process reporter must produce a separate strict sidecar. The
workflow download layout, exact regular-blob counts, raw diagnostics, logical
authority, coverage merge participation, and failure classifications are not
frozen.

Required correction:

- freeze dual reporters on every segmented subprocess;
- freeze fixed mergeable blob filenames and separate same-process sidecars;
- freeze exact sidecar environment, schema, root layout, workflow artifacts,
  regular-blob counts, merge inputs, and authoritative logical reports;
- add missing/extra/renamed/invalid blob and sidecar failures plus real Vitest
  merge tests.

### RUNNER_PNPM_AND_ARTIFACT_ROOT_TRUST_ANCHORS_NOT_EXECUTABLE_AS_DESIGNED

Severity: `BLOCKER`

Round 1 requires an absolute `npm_execpath` and a caller-provided output
directory under a workflow-provided artifact root. `npm_execpath` is neither
guaranteed nor intrinsically trusted, and the output root policy has no
repository-owned anchor. The design therefore cannot be implemented exactly
without new implementation-stage policy.

Required correction:

- remove `--output-dir`;
- derive repository root from the runner module's real parent;
- use three exact repository-owned artifact roots;
- require absent-or-empty run roots and existing verify roots;
- lstat every ancestor and artifact; reject symlink, junction, reparse, escape,
  or nonempty roots;
- freeze safe pnpm resolution for `npm_execpath`, Windows `where.exe pnpm.cmd`,
  and POSIX code-unit PATH scanning without shell/network;
- freeze exact Node, pnpm, and Vitest version gates and exact failure codes.

## Required correction scope

The three findings are coupled design corrections inside the already
authorized H1-H4/profile milestone. A standalone Design Round 2 is allowed and
must inherit all unaffected Round-1 contracts. No implementation, new repair
round, CI remediation round, profile creation, push, or PR mutation is
authorized by this review.

## Exact findings

```text
MISSING_GOVERNANCE_V1_1_DESIGN_TRACEABILITY_AND_R_T_CLASSIFICATION
VITEST_MERGEABLE_BLOB_AND_SIDECAR_CONTRACT_NOT_FROZEN
RUNNER_PNPM_AND_ARTIFACT_ROOT_TRUST_ANCHORS_NOT_EXECUTABLE_AS_DESIGNED
```

## remainingBlockers

```text
MISSING_GOVERNANCE_V1_1_DESIGN_TRACEABILITY_AND_R_T_CLASSIFICATION
VITEST_MERGEABLE_BLOB_AND_SIDECAR_CONTRACT_NOT_FROZEN
RUNNER_PNPM_AND_ARTIFACT_ROOT_TRUST_ANCHORS_NOT_EXECUTABLE_AS_DESIGNED
```

## Design review verdict

RULE_DESIGN_FIX_REQUIRED
