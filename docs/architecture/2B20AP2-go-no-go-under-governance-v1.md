# 2B20AP2 GO/NO-GO Under Governance V1

## Decision

```text
GO
```

This is an engineering-governance GO for one bounded non-product design. It is
not implementation authorization. Fresh evidence is materialized at
`docs/rules/evidence/2B20AP2.md` with terminal verdict `RULE_READY`. The only
remaining blocker is:

```text
PENDING_2B20AP2_COMPLETE_DESIGN_AND_INDEPENDENT_REVIEW
```

Implementation remains forbidden until one complete design and an independent
`RULE_DESIGN_PASS` with `remainingBlockers=[]` exist.

## Authority and frozen baseline

- authorization:
  `USER_AUTHORIZED_2B20AP2_HOSTED_HISTORY_DREAMER_PROCESS_ISOLATION_COVERAGE_PROFILE_AND_CONDITIONAL_2B20A_CLOSEOUT`
- task: `2B20AP2 — Hosted Exact-Head CI Execution Closure V1`
- task type: `CI_TEST_INFRASTRUCTURE / NON_PRODUCT`
- branch:
  `infra/2b20ap1-ownership-supersession-routing-v1`
- initial exact HEAD:
  `03a4184282cde5f972a9ccab94f36e3a2aa79ed5`
- infrastructure PR: `#47`
- product PR: `#46`
- product branch/HEAD:
  `phase-3/reachable-base-dreamer-settleability-closure@167d800e20bed5431764092877085886df4b7c93`
- accepted main:
  `5a69c90f2d3947556ff45c15c467902b1e28ca43`
- Product Repair history:
  `2/2 / COMPLETE_WITH_EVIDENCE_ONLY_STOP_LOSS_OVERRIDE`
- 2B20AP1 Infrastructure Repair history: consumed `2/2`
- independent 2B20AP2 CI remediation budget: `0/2`

2B20AP2 is not 2B20AP1 Infrastructure Repair Round 3. It does not reopen
accepted 2B20AP1 ownership, traceability, LF identity, lifecycle, diagnostic,
candidate, or local implementation-review results.

## Failure classification

The complete audit is:
`docs/implementation/phase-3-slice-2b20ap2-hosted-ci-failure-audit.md`.

| ID | Classification | Governance disposition |
|---|---|---|
| H1 | `HOSTED_ACCEPTED_HISTORY_UNAVAILABLE_IN_SHALLOW_CHECKOUT` | in scope |
| H2 | `COVERAGE_PROFILE_STALE_AFTER_AUTHORIZED_PRODUCT_SOURCE_CHANGE` | in scope, append-only profile only |
| H3 | `DREAMER_VORTOX_DURATION_SENSITIVE_WORKER_RPC_OR_SHUTDOWN_FAILURE` | in scope; preserve real exit |
| H4 | `WINDOWS_W7_NONZERO_EXIT_WITHOUT_SAME_PROCESS_GLOBAL_ERROR_CHANNEL` | in scope; no Linux-cause inference |

The old push and pull-request runs must not be rerun. The audit found no
`UNEXPECTED_PRODUCT_OR_AUTHORITY_REGRESSION`.

## One bounded milestone

The design may coordinate the following independently classified subcontracts:

1. make accepted-history evidence available to every hosted job that performs
   supersession validation;
2. segment Dreamer/Vortox execution inside existing logical groups and retain
   same-process diagnostics;
3. append an exact-source coverage profile only after complete local coverage
   and independent profile review.

They are one hosted-execution closure because each is required before the same
exact HEAD can produce truthful merge-gating evidence. Each subcontract must
retain its own tests, evidence, failure classification, and rollback.

## Frozen non-product boundary

All of the following remain false:

- `productProductionChanged`;
- `productBehaviorChanged`;
- `ruleSemanticsChanged`;
- `roleCoverageChanged`;
- `testTitlesChangedForLF`;
- `timeoutChanged`;
- `dependencyChanged`;
- `newVitestProject`;
- `newLogicalProcessGroup`.

Dreamer remains `PARTIAL`. The twelve LF-bearing titles, product assertions,
accepted supersession dispositions and hashes, old coverage profiles, coverage
include, and logical routing identities are immutable.

## Logical and physical topology

Logical topology is frozen:

- ordinary: `9` groups;
- coverage: `11` groups;
- Windows: `W1-W7`.

The exact Dreamer/Vortox partition is:

| Segment | Pattern authority | Count |
|---|---|---:|
| legacy | `\[(?:2B19A3A|2B19A3B1)-` | `14` |
| 2B20A | `\[2B20A-` | `22` |
| gained | `\[2B19B-` | `10` |

The union is `46`; pairwise intersection, missing, and unexpected counts are
all `0`.

Physical execution may change only inside the existing logical groups:

- ordinary physical blobs: `11`, while logical groups remain `9`;
- coverage physical blobs: `12`, while logical groups remain `11`;
- W7 physical subruns: `14/22/10`, while W7 remains one logical group.

`physical subprocess/blob count != logical routing group count`. No physical
split may be reported as a new logical process group.

## Required two-commit profile structure

The eventual implementation must use:

1. a source commit containing hosted-history availability, segmented execution,
   diagnostics, merge/routing adaptations, and self-tests, but no new coverage
   profile;
2. a profile child commit containing the independently reviewed append-only
   profile and workflow profile-ID switch.

The new profile ID is:

```text
phase-3-slice-2b20ap2-<source-short-sha>-hosted-execution-v1
```

Its `sourceHead` must equal the source commit, not the profile child. The old
profile remains byte-for-byte unchanged. The profile child does not consume a
separate CI remediation round.

## Design requirements

The complete design must freeze:

1. full-history availability in validate, test-merge/semantic, and
   coverage-merge/semantic jobs without verifier-side network fetch;
2. exact separation of history unavailable, non-ancestor, and blob mismatch;
3. explicit hosted checks for accepted object, ancestry, blob, and successor;
4. exact `14/22/10` inventory and fail-closed overlap/missing/unexpected
   handling;
5. deterministic ordered subprocess execution with one fork and a real exit
   per subrun;
6. upload and parse of diagnostics even when a subrun fails;
7. ordinary `11 physical / 9 logical` merge semantics;
8. coverage `12 physical / 11 logical` merge semantics and semantic
   equivalence;
9. Windows same-process exit, assertion, global-error, stdout/stderr, command,
   runtime, and wall-time evidence;
10. no conversion of assertion PASS plus exit `1` into success;
11. append-only coverage profile delta from exact-source local coverage;
12. independent profile review before the profile child commit;
13. exact implementation allowlist, rollback, local gates, and CI remediation
    stop-loss.

No key algorithm may be deferred to implementation judgment.

## CI remediation budget

```text
ciRemediationRound=0
maxCiRemediationRounds=2
```

- The first source implementation commit consumes round `1/2`.
- A bounded exact-artifact repair may consume round `2/2`.
- The profile child commit does not independently consume a round.
- There is no round 3.
- Neither old failed run may be rerun.
- A single targeted rerun is allowed only for a proven
  `CI_EXTERNAL_RUNNER_FAILURE`, never for a deterministic history, worker-RPC,
  Windows exit, profile, assertion, script, or timeout failure.

## Forbidden implementation

Stop with `HUMAN_BLOCKED` if a solution requires:

- product production or product behavior changes;
- weakened, deleted, skipped, or retitled product tests;
- any LF-title change;
- a new Vitest project or logical GitHub process group;
- timeout or dependency changes;
- reduced coverage include;
- mutation of an old profile, accepted commit/blob/hash, supersession
  disposition, or historical test meaning;
- inference of a Windows root cause from Linux evidence or vice versa;
- concealment or normalization of a real nonzero process exit;
- implementation before `RULE_DESIGN_PASS`.

## Rollback

Rollback is scoped by commit:

1. revert the profile child first, restoring the prior workflow profile ID
   while preserving the old profile record;
2. revert the source commit second, restoring the prior workflow, runner,
   verifier, diagnostic, and merge behavior;
3. do not rewrite accepted history, product commits, tests, profiles, or repair
   histories;
4. retain failure artifacts and control logs as audit history.

If rollback would require destructive history rewriting, stop with
`HUMAN_BLOCKED`.

## Required next gate

The next action is exactly:

```text
CREATE_2B20AP2_COMPLETE_DESIGN_AND_RUN_INDEPENDENT_REVIEW
```

Until that design and review exist:

```text
status=RUNNING
ruleReady=true
ruleDesignPass=false
implementationAuthorized=false
remainingBlockers=[
  PENDING_2B20AP2_COMPLETE_DESIGN_AND_INDEPENDENT_REVIEW
]
```

## Governance verdict

```text
GO
```

This GO authorizes only the complete 2B20AP2 design and independent rule-design
review. It does not authorize code/test/workflow/profile changes, commits beyond
this docs/control checkpoint, push, PR mutation, CI rerun, merge, or 2B20B.
