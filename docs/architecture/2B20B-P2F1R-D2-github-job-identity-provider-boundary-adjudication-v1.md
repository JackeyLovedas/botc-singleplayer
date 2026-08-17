# Phase 3 Slice 2B20B-P2F1R-D2 GitHub Job Identity Provider Boundary Adjudication

## Scope

This bounded correction closes one external-provider evidence defect only:
GitHub's Jobs API may truncate the human-readable job `name` field. The
historical D2 verifier treated that display field as an exact machine identity,
which incorrectly rejected an otherwise successful Windows job.

No BOTC rule, product behavior, event schema, test identity, workflow topology,
coverage profile, registry, selector, ownership, routing contract, criterion,
or evidence layer is changed.

## Identity authority

The three fields have separate roles:

| Field | Authority | Use |
| --- | --- | --- |
| `workflowJobId` / `GITHUB_JOB` / `github.job` | Logical job identity | Exact workflow `job_id` mapping |
| REST numeric job database ID | Run-instance identity | Exact provider job instance, artifact, and log binding |
| `providerDisplayName` | Supporting provider metadata | Archive and diagnostics only; never machine identity |

The logical identity is `test-shard` for Linux and
`deterministic-windows` for Windows. Linux additionally requires the exact
`domain-core-rest` matrix identity from runner-side capture. Both runner-side
`GITHUB_SHA` and provider-side run/job `head_sha` must equal the exact source
HEAD.

The provider display name is required to be a printable string, but its length
or content is not compared with a frozen expected display string. Prefix,
substring, regular-expression, truncation reconstruction, and normalization
matching are forbidden.

## Verifier correction

The offline T1 verifier now:

1. binds the captured logical job ID to the expected platform job ID;
2. binds the provider numeric job database ID to the corresponding log and
   artifact graph;
3. binds exact source HEAD, platform, runner OS, and Linux matrix identity;
4. records provider `name` as `providerDisplayName` supporting metadata only;
5. keeps the existing seven negative classes and adds no new class.

The existing wrong platform/job mapping class includes the minimal hostile
subcases:

- correct logical ID with a truncated display name: accepted;
- wrong logical ID with an expected-looking display name: rejected;
- correct numeric ID with wrong logical ID: rejected;
- wrong platform: rejected;
- Linux correct logical ID with wrong matrix identity: rejected.

## Traceability and old run disposition

`D-C16` remains grouping-only. `D-C16A` remains `R4 / T1 /
CROSS_PLATFORM_CI`, with the same exact-H Linux/Windows hosted mechanism. Only
the machine identity fields used by that mechanism are corrected. `D-C16B` is
unchanged. Criterion count, primary layer, reachability, trust, and supporting
authority counts are unchanged.

Hosted run `31992410503` remains a historical successful run blocked by the old
identity contract. It may support the provider-boundary diagnosis only. It is
not accepted D-C16A primary evidence, is not combined with a future run, and
its artifacts are not reused as final primary evidence.

## Workflow and lifecycle boundary

The workflow is not modified when capture already records stable `GITHUB_JOB`
(`workflowJobId`). Its blob must remain byte-identical to the reviewed H
workflow. No new framework, verifier mode, negative class, criterion,
supporting authority, ledger, publication layer, or permanent asset is created.
The correction is local and remains pending a fresh exact-head hosted run; no
push, E2, or D3 action is part of this document.
