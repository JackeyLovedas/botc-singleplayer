# Phase 3 Slice 2B20B-P2F1R-A Design Release Sequencing Correction V1

### Metadata

- correctionId: `2B20B-P2F1R-A-SEQUENCING-CORRECTION-V1`
- authorization: `USER_AUTHORIZED_2B20B_P2F1R_A_SEQUENCE_CORRECTION_LOCAL_IMPLEMENTATION_AND_FREEZE`
- correctionKind: `SEQUENCING_ONLY`
- parentPrecheckPath: `docs/architecture/2B20B-P2F1R-A-canonical-runtime-capture-tlv-governance-precheck.md`
- parentPrecheckSha256: `14e4ab8ebb6e4c8751678176f58343575ba7a7ad86109731e0ba52a1741c59ec`
- parentDesignPath: `docs/architecture/2B20B-P2F1R-A-canonical-runtime-capture-tlv-design-round-1.md`
- parentDesignSha256: `b2b9098d5ace1ea53fbd5c6d40d8a8cbe012d449c42c2fc4d8fe5b180040108d`
- parentDesignReviewVerdict: `HUMAN_BLOCKED`
- exactBlocker: `A-DR1-B01_A_ACCEPTANCE_AND_D_EVIDENCE_SEQUENCE_CYCLE`
- technicalDesignChanged: `false`
- canonicalValueDomainChanged: `false`
- tlvContractChanged: `false`
- productionAllowlistChanged: `false`
- testAllowlistChanged: `false`
- logicalTopologyChanged: `false`
- traceabilityCriterionCount: `15`
- traceabilityCriteriaChanged: `false`
- implementationAuthorized: `false`
- publicationAuthorized: `false`
- mergeAuthorized: `false`
- acceptedTagAuthorized: `false`
- designReleaseReviewStatus: `PENDING_INDEPENDENT_REVIEW`

## 1. Authorization

The user authorizes one sequencing-only correction to Phase 3 Slice 2B20B-P2F1R-A, followed—only after a valid independent design-release review—by local A implementation, bounded local repair, independent local implementation review, and freezing of an exact local A component commit.

This Appendix does not reopen or replace Design Round 1. It changes no runtime behavior, public or package-private API, canonical value, TLV byte, diagnostic, resource rule, test semantic obligation, file allowlist, reachability, trust class, or primary layer. The complete Design Round 1 remains the sole technical implementation authority.

`A_LOCAL_COMPONENT_CLOSURE` and `D_PUBLICATION_AND_EVIDENCE_CLOSURE` are descriptive governance gates, not review verdict tokens. Reviewers must use only exact tokens already authorized by `docs/agent-loop/REVIEW_PROTOCOL.md`. While this Appendix awaits independent review, `implementationAuthorized=false`. A valid `RULE_DESIGN_PASS` with `remainingBlockers=[]` authorizes only local A component implementation under the current user authorization; it does not authorize publication, push, PR, merge, accepted tag, hosted CI, B, C, D, or P2F execution.

## 2. Parent precheck path and SHA

Parent precheck:

`docs/architecture/2B20B-P2F1R-A-canonical-runtime-capture-tlv-governance-precheck.md`

SHA-256:

`14e4ab8ebb6e4c8751678176f58343575ba7a7ad86109731e0ba52a1741c59ec`

Its `GO` decision remains bounded to A’s generic canonical runtime capture, process-local token, immutable backing, deterministic TLV, resources, diagnostics, public/internal seams, tests, and traceability. Its A/B/C/D responsibility split remains unchanged. In particular, D owns repository-wide ownership, totals, routing, coverage profile, workflow, Windows execution, cross-platform hosted evidence, exact-head CI, and publication closure after A, B, and C have frozen their product/test identities.

## 3. Parent design path and SHA

Parent Design Round 1:

`docs/architecture/2B20B-P2F1R-A-canonical-runtime-capture-tlv-design-round-1.md`

SHA-256:

`b2b9098d5ace1ea53fbd5c6d40d8a8cbe012d449c42c2fc4d8fe5b180040108d`

Every technical clause in that exact document remains normative without amendment. This Appendix must not be read as an errata for the canonical domain, capture order, Proxy policy, token, backing, APIs, internal reader, TLV header or grammar, Unicode, numbers, arrays, objects, resources, diagnostics, immutability, compatibility, failures, allowlists, the 51 planned semantic identities, the 15 nine-field criteria, or the original twelve technical Stop-Loss conditions.

## 4. Exact blocker

Original independent design-review verdict:

`HUMAN_BLOCKED`

Sole blocker:

`A-DR1-B01_A_ACCEPTANCE_AND_D_EVIDENCE_SEQUENCE_CYCLE`

The blocker concerns release sequencing only. It does not reject the feasibility or correctness of A’s technical contract. No other blocker is incorporated or implied by this correction.

The cycle is:

```text
A interpreted as requiring completed D publication evidence before A can close
  -> D cannot run until A, B, and C have frozen source/test identities
  -> B and C cannot safely bind A until A has a frozen reviewed component commit
  -> A cannot produce that frozen commit because D has not run
```

## 5. Root cause

The rescope and Design Round 1 correctly assign A’s primary semantic evidence to A and repository publication evidence to D. The sequencing ambiguity arose when the future `PLANNED_SUPPORTING_AUTHORITY` for Windows/Linux execution was treated as if it were a current A design-release or local implementation-review prerequisite.

That interpretation conflates two independent closure questions:

1. whether A faithfully implements and locally proves its frozen component contract; and
2. whether the stacked A+B+C repository candidate has complete ownership, routing, coverage, cross-platform, exact-head CI, and publication evidence.

The first question must be answered before B and C can depend on A. The second cannot be answered until A, B, and C have frozen their exact test identities. D is therefore a forward publication dependency, not a runtime or local-component back-edge.

This Appendix closes the ambiguity by defining two gates without weakening either. Missing future D evidence is pending publication work, not evidence that A’s locally verified component is technically invalid. Conversely, local A closure is not repository acceptance and cannot satisfy or bypass D.

## 6. A local component closure gate

`A_LOCAL_COMPONENT_CLOSURE` is satisfied only when all of the following are true on one exact local A source/review HEAD:

1. the parent design plus this Appendix receive a fresh independent `RULE_DESIGN_PASS` with `remainingBlockers=[]`;
2. implementation remains within the unchanged production, test, and documentation allowlists;
3. `canonical-runtime-value.ts`, named additive root exports, and the single formal test file implement the parent Design Round 1 exactly;
4. every A primary criterion has a real implementation-time primary test binding and `MechanismMatch=PASS` for the mechanism A itself owns;
5. no R1/R2, accepted-stream, replay, projection, `CROSS_PLATFORM_CI`, or future D evidence is fabricated;
6. focused canonical-runtime tests, the complete formal test file, domain-core regression, typecheck, lint, full ordinary tests, `git diff --check`, changed-file audit, `.skip`/`.only` audit, timeout audit, dependency audit, and denylist audit pass on the exact candidate;
7. coverage, ownership exact audit, routing audits, Windows execution, workflow, hosted CI, and publication are accurately recorded as not run and deferred to D;
8. a fresh independent read-only local implementation review uses only legal protocol verdict tokens, reports no blocker, and has `remainingBlockers=[]`;
9. the reviewed A implementation commit and review evidence are frozen, the worktree is clean, and no later commit invalidates that local review.

This gate establishes only that A is a locally verified component suitable as an exact dependency baseline. Its descriptive terminal state is:

`LOCAL_COMPONENT_IMPLEMENTATION_REVIEW_PASS_PENDING_P2F1R_D_PUBLICATION_EVIDENCE`

That state is not a review verdict and must not be shortened to `PASS`, `ACCEPTED`, `MERGED`, `RELEASED`, `CI_PASS`, or `CROSS_PLATFORM_PASS`.

Missing D evidence is not an A local-component blocker. A local closure does not authorize a push, PR, merge, main update, tag, or publication.

## 7. D publication/evidence closure gate

`D_PUBLICATION_AND_EVIDENCE_CLOSURE` begins only after A, B, and C each have an exact frozen component commit and frozen formal-test identity set. Under D’s separately reviewed future scope, D exclusively owns:

- new-test identity registration;
- ownership reconciliation;
- ordinary, coverage, and Windows routing;
- canonical inventory and total-test reconciliation;
- append-only exact coverage profile work;
- workflow selection and infrastructure evidence;
- Windows/Linux byte-equality execution;
- hosted execution and exact-head CI;
- publication review and the decision whether the stacked A+B+C candidate may be pushed, proposed, merged, tagged, and accepted.

D must consume A’s frozen production and formal-test semantics as inputs. It must not change A’s runtime behavior, API, TLV bytes, diagnostics, resource accounting, primary test assertions, or semantic test identities. If D discovers a real A defect, it reports the defect and invalidates the affected frozen dependency; it does not repair A under D’s infrastructure authority. Any A semantic correction requires its own valid authorization, updated exact commit, rerun local gates, and new independent A review before D resumes.

D evidence is mandatory for eventual publication but is not retroactive evidence for A’s local component gate. D cannot manufacture product truth, relabel R4 as R1/R2, or replace A primary evidence with CI.

## 8. Dependency direction

The only authorized dependency direction is:

```text
accepted main
  -> A docs/design authorities
  -> independent A design release
  -> frozen reviewed A local component commit
       -> B pins exact A commit and consumes public token/TLV contract
       -> C pins exact A commit and consumes authenticated package-private backing seam
  -> frozen A + frozen B + frozen C identities
  -> D publication/evidence closure
  -> exact stacked publication candidate
  -> hosted exact-head gates and publication review
  -> only then possible merge/tag/acceptance
```

B and C must record and build from the exact frozen A component commit; a branch name, moving ref, reconstructed diff, or unreviewed descendant is insufficient. Neither B nor C may reinterpret A’s V1 value domain or TLV contract, create a second A token issuer, or absorb D’s responsibilities.

A has no dependency on B or C. A local closure has no dependency on D. D has a forward dependency on the exact frozen identities of A, B, and C. There is no D-to-A runtime, semantic, or acceptance back-edge.

A’s frozen local commit remains unaccepted repository work until D closure and later publication gates complete. A failure or abandonment of future B, C, or D does not transform A into accepted main behavior.

## 9. Traceability treatment

The parent design’s fifteen criterion IDs and all nine design-time fields remain unchanged and in the same order:

1. `A-C01_VALID_CAPTURE`
2. `A-C02_PROXY_DESCRIPTOR`
3. `A-C03_DOMAIN_REJECTION`
4. `A-C04_TOKEN_AUTHENTICATION`
5. `A-C05_BACKING_ISOLATION`
6. `A-C06_PUBLIC_SERIALIZER_ISOLATION`
7. `A-C07_RESOURCE_LIMITS`
8. `A-C08_PURE_TLV_HEADER_TAGS`
9. `A-C09_PURE_UNICODE`
10. `A-C10_PURE_INTEGER`
11. `A-C11_PURE_OBJECT_ORDER`
12. `A-C12_ARRAY_STRUCTURE`
13. `A-C13_DIAGNOSTIC_STABILITY`
14. `A-C14_ADDITIVE_COMPATIBILITY`
15. `A-C15_CROSS_PLATFORM_BYTES`

This Appendix does not renumber, merge, split, rewrite, or reclassify any criterion. R1 and R2 remain empty. T1 wrapper and T3 pure-core primary identities remain distinct. One physical semantic identity retains one primary layer.

A implementation traceability materializes only actual A evidence that exists at the frozen A commit: `ActualTestFile`, `ActualTestTitle`, `ActualPrimaryLayer`, `ActualReachability`, `ActualTrust`, `SupportingAuthorityId`, `MechanismMatch`, main assertion, production entry, and fault mechanism. A primary rows may use `MechanismMatch=PASS` only when the actual A test proves the unchanged completion criterion through the unchanged required mechanism.

Future D evidence must not be entered as an A `ActualTestFile`, `ActualTestTitle`, or current `MechanismMatch`. No speculative `SUP-*` ID may be invented. The parent `PLANNED_SUPPORTING_AUTHORITY` for `A-C15_CROSS_PLATFORM_BYTES` remains a pending future requirement with purpose `WINDOWS_LINUX_BYTE_IDENTITY`, expected status `ACCEPTED`, mutation expectation `NONE`, and consumer `A-C15`.

At A local closure, D-dependent support is recorded as pending future publication evidence. Its absence is not `MechanismMatch=FAIL` for A’s own primary mechanism and does not block local freeze. When D later creates real supporting authority, D assigns a unique resolvable support ID and records the real producer, source test or fixture, authority status, consumer, and mutation disposition. Supporting authority never changes A’s primary layer or substitutes for A’s primary assertion.

## 10. Cross-platform evidence treatment

The unchanged `A-C15_CROSS_PLATFORM_BYTES` contract has two deliberately separated evidence responsibilities.

A primary evidence, owned and required for local component closure:

- T3 pure encoding behavior;
- the exact frozen literal TLV vectors;
- deterministic repeated serialization;
- raw UTF-16 comparator and explicit UTF-8/i64be/u32be algorithms;
- local assertions that do not branch on locale, environment, operating system, platform-default encoding, `localeCompare`, or `Intl.Collator`;
- local locale-variation and implementation audits that prove no environment-sensitive mechanism is used.

D supporting/publication evidence, required only for publication closure:

- execution of the same frozen input/vector authority on supported Windows and Linux hosts;
- byte-for-byte equality across those hosts;
- owned hosted execution identity;
- routing, inventory, coverage, and exact-head CI binding.

A may state that its literal vector set is ready for later platform execution. Before D runs, A must not state that Windows/Linux equality was executed, `CROSS_PLATFORM_CI` passed, hosted evidence exists, or the repository candidate is accepted. D’s later cross-platform authority supports A-C15 but does not rewrite its `R4 / T3 / PURE_POLICY_SEAM` primary classification.

## 11. Ownership and profile treatment

A’s local implementation does not edit or claim authority over test-ownership contracts, canonical inventory totals, logical-group totals, ordinary routing, coverage routing, Windows routing, coverage obligations, coverage profiles, workflow selectors, CI jobs, or infrastructure scripts. These files remain outside A’s unchanged allowlist.

The single A formal test file and its final semantic identities are frozen as local component outputs. They may be run directly through the existing workspace and local test commands, but they are not represented as repository-wide owned, profiled, routed, or accepted identities until D reconciles the complete frozen A+B+C inventory.

No current exact coverage profile may be claimed for the new A topology. D must append or otherwise apply only a separately reviewed exact profile; it must not mutate historical profiles. D computes actual totals from frozen identities rather than inheriting planned counts. No new Vitest project, logical group, dependency, timeout, Node version, pnpm version, or coverage threshold is implied by this correction.

Ownership/profile absence is a deferred publication blocker, not an A local-component blocker. Any attempt to close it by changing A’s implementation branch consumes the wrong authority and must stop.

## 12. Branch and publication treatment

The authorized operational sequence is:

1. audit the current `phase-3/canonical-drunk-vigormortis-settleability-closure` worktree and stop on unexplained production, test, or infrastructure changes;
2. create one local docs-only handoff commit containing only the authorized P2/P2F/P2F1/P2F1R/P2F1R-A governance, evidence, design, and review documents, with required Codex co-author attribution;
3. do not push or rewrite that P1 branch;
4. create `phase-3/2b20b-p2f1r-a-canonical-runtime-capture-tlv` from exact accepted main `0dc046aa62b3a72cbd97d99808e0932bf408a09c`;
5. cherry-pick only the docs-only handoff commit, without P1 product, tests, profile, or infrastructure;
6. materialize and commit this Appendix, then obtain the independent design-release review;
7. only after valid design release, implement A and create the attributed local A source commit;
8. after exact local gates and independent local implementation review, freeze the exact reviewed A commit with a clean worktree.

The frozen A commit may be named as the exact dependency base for later separately authorized B and C governance work. It must not be pushed, proposed as a PR, merged into main, tagged, described as accepted, or used to alter GitHub until D publication/evidence closure and later publication authority exist.

No rebase, reset, history rewrite, P1 deletion, P1 product cherry-pick, force push, main mutation, empty PR, placeholder tag, or speculative future commit SHA is authorized. A commit made after the local implementation review invalidates that review and requires the applicable authorized local gates and fresh independent review before it can be a dependency baseline.

## 13. Stop-Loss

All twelve parent Design Round 1 Stop-Loss conditions remain fully effective. This sequencing correction adds no exception to the Proxy, hash, event, replay, BOTC domain, production-file, infrastructure, token-authority, backing-seam, deterministic-serializer, cross-platform-contract, or one-primary-mechanism boundaries.

In addition, stop the affected operation on any of these sequencing failures:

1. closing the original cycle requires any technical/API/TLV/diagnostic/resource/test-semantic/criterion/allowlist change;
2. a reviewer still requires completed D evidence as a prerequisite for A local component formation after applying this exact two-gate correction;
3. A must be pushed, merged, tagged, or described as accepted before D closure;
4. B or C cannot pin and consume one exact frozen reviewed A commit;
5. D must edit A production semantics or formal primary-test semantics rather than consume frozen A outputs;
6. A traceability would need a fabricated D test, `SUP-*` ID, hosted result, or `MechanismMatch=PASS` for evidence that does not exist;
7. A implementation requires ownership, routing, coverage, profile, workflow, Windows, hosted CI, hash, event, replay, role, application, persistence, or another production module;
8. branch migration encounters conflicts, unexplained files, unsafe history rewriting, or non-doc changes in the handoff;
9. the Proxy zero-installed-trap boundary is not truthfully implementable under the frozen runtime;
10. the independently reviewed correction still has a sequencing blocker after the single allowed docs-only correction and second independent review.

A Stop-Loss must not be bypassed by renaming a publication obligation as a local test, by downgrading required future D evidence, or by upgrading a local gate into repository acceptance. Use only protocol-authorized verdicts and the disposition required by the parent design and current user authorization.

## 14. Release conditions

### Design release for local implementation

A local implementation may begin only after a new independent read-only reviewer reads the A precheck, exact parent design, original `HUMAN_BLOCKED` output, this Appendix, P2F1R rescope, Traceability V1.1 ADR, `REVIEW_PROTOCOL.md`, real A allowlists, and current repository state, then returns exactly `RULE_DESIGN_PASS` with `remainingBlockers=[]`.

That reviewer verifies:

1. the sequence cycle is closed without weakening either gate;
2. A can form a local component without already-completed D evidence;
3. D retains all final publication/evidence responsibilities;
4. A local closure cannot be reported as repository `ACCEPTED`;
5. B and C can safely pin the exact frozen A commit;
6. D has no authority to change A runtime or test semantics;
7. no future D evidence or support ID is fabricated;
8. the complete parent technical design remains unchanged;
9. production/test/document allowlists remain unchanged;
10. Stop-Loss is truthful and enforceable.

`RULE_DESIGN_FIX_REQUIRED` permits at most one docs-only sequencing correction and a different fresh independent reviewer; it does not authorize a new Design Round or technical change. A second non-passing design review, or any demand to change A’s technical scope, hash, event, replay, ownership, workflow, profile, or hosted execution in this correction, yields `HUMAN_BLOCKED` under the current authorization.

### A local component release

After design release, `implementationAuthorized=true` means local A implementation only. Local component freeze requires every item in Section 6 on one exact reviewed commit, no blocker, clean worktree, and no unreviewed descendant. The frozen status is only:

`LOCAL_COMPONENT_IMPLEMENTATION_REVIEW_PASS_PENDING_P2F1R_D_PUBLICATION_EVIDENCE`

The exact frozen commit may then be supplied as the immutable dependency authority for later separately authorized B and C governance prechecks. The next action after successful A local freeze is descriptive workflow direction, not a review verdict:

`AUTHORIZE_2B20B_P2F1R_B_GOVERNANCE_PRECHECK_USING_FROZEN_A_COMMIT`

### Repository publication release

A remains unpublished and unaccepted until future D has consumed the exact frozen A+B+C candidate and completed ownership, totals, routing, coverage profile, Windows/Linux evidence, exact-head hosted CI, and publication review under its own passed design and authorization. Only that later complete publication chain may authorize push, PR, merge, accepted tag, or repository acceptance. D evidence cannot be inherited across a different commit.

### Terminal state of this Appendix

- technicalDesignChanged: `false`
- criteriaChanged: `false`
- ALocalComponentClosureDefined: `true`
- DPublicationAndEvidenceClosureDefined: `true`
- sequenceCycleResolution: `PENDING_INDEPENDENT_DESIGN_RELEASE_REVIEW`
- implementationAuthorized: `false`
- publicationAuthorized: `false`
- mergeAuthorized: `false`
- remainingDesignBlockers: `[A-DR1-B01_A_ACCEPTANCE_AND_D_EVIDENCE_SEQUENCE_CYCLE_PENDING_REVIEW_OF_THIS_CORRECTION]`
- requiredNextAction: `RUN_FRESH_INDEPENDENT_DESIGN_RELEASE_REVIEW_OF_PARENT_DESIGN_PLUS_SEQUENCING_CORRECTION`

READY_FOR_INDEPENDENT_DESIGN_RELEASE_REVIEW
