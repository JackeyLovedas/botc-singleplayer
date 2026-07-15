# ADR: Reachability, Trust Boundaries, And Review Governance V1

## Metadata

- Decision ID: `ENGINEERING-GOVERNANCE-BASELINE-V1`
- Authorization: `USER_AUTHORIZED_ENGINEERING_GOVERNANCE_BASELINE_V1`
- Status: `ACCEPTED`
- Candidate base: accepted `main` at `8d98b4324acfd9592728b1813f6c83ba395742ba`
- Scope: repository governance and a read-only 2B19A1 precheck
- Product behavior changed: `false`
- BOTC rule semantics changed: `false`
- Tests or workflows changed: `false`
- Role coverage changed: `false`
- Task repair budget: `1` docs-only repair

This ADR becomes repository-level authority only after an independent review passes and the governance PR merges. Only the post-merge closeout may change its status to `ACCEPTED`. A feature-branch document must not claim its own future commit SHA, CI run, review comment, merge commit, or accepted tag.

## Context And Decision Drivers

Slices 2B18A, 2B19, 2B19A, 2B19A1, and 2B19T exposed recurring governance failures:

- manually constructed or future states were described as accepted-stream integration;
- module-private pure helpers were reviewed as if they were hostile persisted boundaries;
- review cycles exposed the governance risk that new final-review suggestions could be treated as blockers unless design freeze and the A-H basis are explicit;
- one slice accumulated event, state, replay, projection, ledger, and general audit risks;
- product repair budgets absorbed CI infrastructure failures;
- `FOUNDATION`, role `PARTIAL`, and PR acceptance were conflated;
- branch documents, PR prose, CI, review comments, merge evidence, and closeout records were treated as interchangeable authorities.

PR #25 and PR #26 closed unmerged after repair-budget exhaustion. Their histories demonstrate overscope and the governance risk of unstable review boundaries: Dreamer behavior, provenance, canonical context, replay, ledger, projection, and traceability were coupled across large review surfaces. Their actual final findings cited frozen-contract violations and stale evidence. This ADR does not retrospectively reclassify or weaken those findings; it makes the design freeze and A-H basis explicit for future reviews. PR #27 and PR #29 demonstrate the successful isolation of test infrastructure. PR #28 demonstrates a bounded `FOUNDATION` slice that supplied canonical Dreamer tenure without claiming Dreamer V2 behavior or changing Dreamer role coverage.

The decision is to classify every designed path by reachability and every entry point by trust, freeze the design review's definition of done, constrain final-review blockers, impose enforceable slice stop-loss rules, and separate product, CI, coverage, and acceptance vocabularies.

## Scope And Non-Goals

This decision governs all future slices, infrastructure PRs, final reviews, and closeouts. It does not:

- change BOTC rules or rule-source priority;
- weaken the existing rule-truth gate, T1 validation, replay, information-safety, deterministic, CI, or independent-review requirements;
- authorize 2B19A1, Dreamer V2 implementation, or Phase 2C;
- create a product event, state field, projection, ledger fact, role interaction, or Storyteller policy;
- require speculative R4 lifecycle work;
- convert a backlog item into implementation authorization.

## 1. Reachability Model

Reachability classifies one claimed behavior or path at the reviewed repository revision. The classes are mutually exclusive for that path. Use this decision order:

1. If the history or state is invalid, malformed, corrupted, or impossible, classify it `R3`.
2. Otherwise, if current accepted commands and accepted producers can create it, classify it `R1`.
3. Otherwise, if the repository promises to accept and replay it as valid history, classify it `R2`.
4. Otherwise classify it `R4`.

A feature can contain separate R1, R2, and R3 paths, but each behavior row and test claim must name exactly one primary reachability class. Every future design must explicitly enumerate R1, R2, R3, and R4, including an explicit empty set when a class does not apply.

### R1: `CURRENTLY_REACHABLE_ACCEPTED_STREAM`

Current accepted commands and accepted event producers can create the history in real application flow.

An R1 claim requires, in proportion to the frozen behavior:

- complete application integration;
- an accepted event stream;
- command and receipt behavior;
- prospective validation before append;
- replay into canonical state;
- authorized projection behavior or an explicit proof that the behavior has no projection output;
- positive and negative integration tests;
- required Linux and Windows exact-head CI.

Only R1 may be called `accepted-stream integration`. A manually assembled state, direct event-applier call, pure policy fixture, or hostile replay is not R1.

### R2: `LEGACY_OR_IMPORTED_ACCEPTED_HISTORY`

The current producer no longer creates the history, but the repository promises that valid accepted or imported history remains replayable.

R2 requires:

- exact replay compatibility and stored-history validation;
- preservation of historical meaning without silent migration or reinterpretation;
- fail-closed behavior when a new command cannot safely continue the legacy history;
- explicit version and provenance checks.

R2 does not require a current application producer integration test. Legacy V1 tasks, accepted old payloads, and valid imported histories belong here once their producer is retired.

### R3: `HOSTILE_OR_CORRUPTED_HISTORY`

The path contains manual tampering, missing or extra fields, accessors, symbols, sparse arrays, proxies, cycles, nonplain objects, orphan facts, duplicates, mixed generations, impossible role combinations, broken provenance, or incomplete event tails.

R3 requires:

- fail-closed behavior through a specific `DomainError` or explicit retryable failure;
- hostile replay or boundary-validation tests;
- no accepted-stream claim and no invented product producer.

### R4: `FUTURE_HYPOTHETICAL_STATE`

No current producer, accepted event, or reachable command path creates the behavior.

R4 may record an extension point or pure-policy seam. When necessary, a current command may return `ApplicationNotConfigured`. R4 must not become a current slice's integration prerequisite and does not require a premature event, lifecycle, projection, or audit system. It can move to R1 or R2 only when a separately authorized design supplies the corresponding accepted producer or accepted-history promise.

## 2. Trust-Boundary Model

Trust classifies each callable entry point, not merely its implementation file. A design must label every entry point `T1`, `T2`, or `T3`. When one function serves multiple trust levels, split the boundary wrapper from the core or apply the stricter level to the public entry.

### T1: `EXTERNAL_OR_PERSISTED_BOUNDARY`

T1 includes command input, domain-event envelopes, persisted or imported streams, projection-viewer input, and public package APIs that accept `unknown` or cross a persistence boundary.

T1 requires, where the representation permits the attack:

- exact runtime shape and exact enumerable keys;
- dense arrays;
- rejection of hostile proxies, getters/accessors, symbols, cycles, and nonplain objects;
- canonical IDs and version literals;
- rejection of extra and missing fields;
- fail-closed errors;
- accepted-history provenance and replay validation.

This ADR never permits a T1 boundary, persistence format, private-information boundary, or accepted replay guarantee to be weakened or downgraded to backlog.

### T2: `CANONICAL_DERIVED_STATE`

T2 includes `GameState` rebuilt from a fully validated event stream, event-applier pre-event state, and a derived aggregate that has already passed its T1 boundary.

T2 requires domain invariants, source cross-links, deterministic rebuild, reference isolation, and state consistency. It does not require every module-private helper to repeat the full proxy/getter/cycle/symbol matrix. A helper that accepts `unknown`, imported data, or persisted data is T1, not T2.

### T3: `MODULE_PRIVATE_PURE_CORE`

T3 includes branded internal contexts, pure resolvers, comparators, formatter internals, and candidate-policy functions.

T3 requires closed types, deterministic behavior, boundary cases, exhaustive unions, and pure tests. Unless the helper itself crosses T1, T3 does not require a public hostile-input matrix, accepted producer, independent receipt, projection, or full-history provenance.

## 3. Design Review Authority And Frozen Definition Of Done

Design review independently checks current rule evidence and repository facts. Before returning `RULE_DESIGN_PASS`, it freezes all of the following for the current PR:

- rule semantics and source revisions;
- supported and explicitly unsupported behavior;
- R1/R2/R3/R4 classification for every behavior;
- T1/T2/T3 classification for every entry point;
- public API;
- event and state contracts;
- failure and receipt contracts;
- replay and projection contracts;
- completion criteria;
- authority-test mapping and primary test layers;
- production/test/document file allowlists and size estimates;
- Slice coverage and Role coverage expectations.

`RULE_DESIGN_PASS` makes those items the frozen definition of done for the current PR. Implementation may not silently widen them. A material change requires a permitted design correction or a reslice before implementation continues. Design review must apply the stop-loss rules in this ADR; it must not pass an knowingly oversized design.

## 4. Final Review Authority

Final review verifies the frozen design against the exact PR HEAD. It does not redesign the slice. A final-review finding may be a `BLOCKER` only when it proves one of these conditions:

A. implementation violates the frozen design;

B. a real P0/P1 data-corruption or BOTC-rule error exists;

C. private information can leak;

D. accepted replay or idempotency is broken;

E. a persisted format is incompatible;

F. an actually callable security or trust-boundary vulnerability exists;

G. claims or tests are false, misleading, or do not exercise what they claim;

H. required exact-head CI is absent, failed, or belongs to another commit.

When relying on B or F for a requirement absent from the frozen design, the reviewer must identify the concrete current R1/R2 path, severity, evidence, and impact. A hypothetical future path is not sufficient.

Unless frozen by design, the following are backlog by default rather than current-PR blockers:

- future R4 producers;
- new generic infrastructure;
- a T3 hostile-input matrix;
- unreachable lifecycle behavior;
- a new event or schema;
- Storyteller free-choice strategy;
- a new role interaction;
- a general refactor or naming improvement;
- additional traceability formatting.

The sole exception is a proven P0/P1 actual path under B, C, D, E, F, or G. Passing tests cannot override such a defect, and this ADR cannot be used to downgrade real T1, persistence, replay, or private-information failures.

Every final-review suggestion must be classified:

- `BLOCKER`: satisfies A-H and prevents the current PR from merging;
- `BACKLOG_HIGH`: serious, bounded follow-up with a named trigger or risk, but not a current frozen gate;
- `BACKLOG_NORMAL`: non-gating improvement.

Every finding must state its classification, evidence, affected reachability/trust class, frozen design clause or A-H basis, required current action, and—when backlog—suggested follow-up scope. An unclassified request to “fix” something is invalid review output.

## 5. Slice Single-Risk And Stop-Loss Rules

Default sizing rules:

- one slice owns one primary risk;
- suggested production-file count is at most 6;
- suggested added production code is at most 1,500 lines;
- a slice must not simultaneously add a new event system, new state system, new projection system, and generic audit system;
- a second independent infrastructure risk is split into another slice;
- CI infrastructure uses a separate PR;
- docs-only status synchronization does not consume a product repair round.

Reslice before implementation or immediately after the first review when any condition occurs:

1. previously unidentified shared infrastructure is required;
2. more than 10 production files must change;
3. estimated added production code exceeds 2,000 lines;
4. an architectural blocker remains after two design rounds;
5. a new public trust boundary is still being discovered during a second repair;
6. the PR owns three or more independent subsystems;
7. a reviewer requires R4 behavior as the current acceptance prerequisite.

Only explicit user authorization can override a stop-loss condition. Repair-budget exhaustion does not authorize another repair, a wider design, or a hidden infrastructure change.

## 6. Test Layers And Proportional Traceability

Every completion criterion has at least one primary authority test. Each test has exactly one primary layer; supporting tests may support multiple criteria. Test volume follows risk and boundary count, not a fixed numeric quota. Do not duplicate low-value tests to inflate authority IDs.

The only primary layers are:

- `ACCEPTED_STREAM_INTEGRATION`: a real R1 command/producer/event/receipt path;
- `LEGACY_REPLAY_COMPATIBILITY`: valid R2 history retains exact meaning;
- `HOSTILE_REPLAY_REJECTION`: R3 persisted/imported history fails closed;
- `STRUCTURAL_VALIDATION`: exact shape, version, ID, field, and boundary validation;
- `PURE_POLICY_SEAM`: deterministic T3 behavior and boundary cases;
- `PROJECTION`: authorized viewer output and non-leakage;
- `CROSS_PLATFORM_CI`: required exact-head platform execution.

The traceability table for a slice records criterion, rule claim, reachability, trust level, primary test, primary layer, supporting tests, and expected failure. A manually constructed state cannot be labeled `ACCEPTED_STREAM_INTEGRATION`.

## 7. Coverage And Acceptance Vocabulary

These are independent axes:

- Slice coverage: `FOUNDATION`, `SKELETON`, `PARTIAL`, `COMPLETE`.
- Role coverage: `NOT_STARTED`, `SKELETON`, `PARTIAL`, `COMPLETE`.
- PR acceptance: `UNACCEPTED`, `ACCEPTED`.

An infrastructure or derived-state foundation may be `FOUNDATION` without changing a role. Role coverage changes only from accepted player-visible role behavior. Accepted V1 behavior is not downgraded because V2 is incomplete. An unmerged PR cannot change accepted role coverage. Final reports state both Slice coverage and Role coverage; neither implies PR acceptance.

## 8. CI Failure And Repair Isolation

Every CI failure is classified:

- `CI_PRODUCT_FAILURE`: product assertions, type/lint defects, product behavior, or frozen contract failure; consumes a product repair round.
- `CI_TEST_INFRASTRUCTURE_FAILURE`: sharding, worker RPC, deterministic runner plumbing, or a stable long-test budget; handled in a separate infrastructure PR and does not consume product repair.
- `CI_EXTERNAL_RUNNER_FAILURE`: platform/service outage or runner failure outside the repository; retry or wait with exact evidence and do not call it a rule failure.

A product PR must not casually raise a global timeout. A single-test budget infrastructure PR is permitted only when repeated evidence identifies the exact same test and timeout, with no assertion, unhandled exception, or coverage failure and with the test body and expectations unchanged. CI failure is not rule failure unless evidence independently proves a rule defect.

## 9. State Authority Order

When records disagree, use this order:

1. GitHub live PR HEAD;
2. exact-head CI for that SHA;
3. complete final-review comments whose marker and report `reviewedHead` equal that SHA;
4. merge commit;
5. accepted tag;
6. post-merge main closeout;
7. PR body;
8. branch status documents;
9. chat or controller memory.

This order is stage-aware: items that do not yet exist supply no authority. PR prose cannot substitute for a final-review verdict. A commit after final review invalidates that review and its audit comments. Feature-branch documents do not self-reference their future SHA. Do not create repeated docs-only feature commits merely to record CI IDs. Record CI and review identifiers in GitHub comments or post-merge closeout. A docs-only closeout has no inherited CI; only CI for the exact closeout SHA applies to it.

## 10. Enforcement And Consequences

- Existing rule-truth order and the complete independent final-review audit chain remain mandatory.
- Architects must include reachability, trust, stop-loss, test-layer, size, and coverage tables in future designs.
- Reviewers must reject missing classifications during design review and must classify every final finding.
- Implementers must stop when the frozen scope or a stop-loss boundary is exceeded.
- Controllers must keep CI infrastructure and product repair accounting separate.
- Closeout must preserve commit-specific CI and exact review-comment evidence.

This policy intentionally trades speculative completeness for bounded, reviewable accepted behavior. R4 work remains visible without becoming a hidden gate; T1 remains strict; T2/T3 avoid redundant attack matrices; and final review retains authority to block real high-severity defects without moving the design's definition of done.

## 11. Reconsideration Triggers

Revisit this ADR only through a separately authorized governance change when one of these occurs:

- an accepted persistence model no longer fits T1/T2;
- a recurring reachable defect cannot be classified by A-H;
- the reachability classes overlap for a real accepted path;
- the stop-loss thresholds repeatedly split inseparable single-risk work;
- CI architecture materially changes the meaning of exact-head evidence.

Until then, a slice-specific design may specialize this ADR but must not weaken it.
