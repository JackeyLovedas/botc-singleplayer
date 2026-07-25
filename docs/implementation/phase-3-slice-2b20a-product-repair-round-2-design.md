# Phase 3 Slice 2B20A Product Repair Round 2 Design

## Metadata

- taskId: `2B20A-PRODUCT-REPAIR-ROUND-2`
- authorization: `USER_AUTHORIZED_2B20A_PRODUCT_REPAIR_ROUND_2_END_TO_END_CLOSURE`
- sliceId: `2B20A`
- branch: `phase-3/reachable-base-dreamer-settleability-closure`
- designBaseHead: `844c7db5666dcb9d738a3bff12425bffd6df9d54`
- designBaseParent: `0ab9cbb1d31f46fb989f049b804638b69ee399ba`
- worktreeAtDesignStart: `clean`
- currentPR: `46`
- currentPRState: `OPEN / UNMERGED`
- remotePRHead: `dbfa424c96a8bcf06a0d2a77205626a532aa2ec8`
- repairBaseHead: `dbfa424c96a8bcf06a0d2a77205626a532aa2ec8`
- round1ImplementationCommit: `0ab9cbb1d31f46fb989f049b804638b69ee399ba`
- round1ReviewCommit: `844c7db5666dcb9d738a3bff12425bffd6df9d54`
- round1ReviewPath: `docs/implementation/phase-3-slice-2b20a-product-repair-round-1-implementation-review.md`
- round1ReviewSha256: `913df42266cb97bdd9ba60943bf9430e80f30774ad9731c83590447d87c7a298`
- round1ReviewVerdict: `PRODUCT_REPAIR_IMPLEMENTATION_REVIEW_FIX_REQUIRED`
- productRepairRoundBefore: `1/2`
- productRepairRoundConsumedByDesign: `false`
- implementationAuthorized: `false`
- behaviorDesignChanged: `false`
- ruleSemanticsChanged: `false`
- eventSchemaChanged: `false`
- scopeChanged: `false`
- targetCoverage: `PARTIAL / REACHABLE_BASE_DREAMER_SETTLEABILITY_ONLY`
- DreamerRoleCoverage: `PARTIAL`
- designPath: `docs/implementation/phase-3-slice-2b20a-product-repair-round-2-design.md`
- designCorrectionPass: `1/2`
- priorRound2DesignSha256: `7aabfc579508172625fcb9ca5812ee320e858a731a6cd32c9ddfbf96b015d894`
- priorRound2DesignReviewPath: `docs/implementation/phase-3-slice-2b20a-product-repair-round-2-design-review.md`
- priorRound2DesignReviewSha256: `332dcf4150441b93daedac3e1ab4802c6b5901ece6b0ef0636868f47a10848a2`
- c34ValidT2EvidenceGap: `none`

No future Round 2 implementation commit SHA is defined or reserved by this design.

## Round 1 Implementation and Review Authority

The authoritative Round 1 implementation is commit
`0ab9cbb1d31f46fb989f049b804638b69ee399ba`. The independent review report was
materialized without altering that reviewed product commit and is bound to:

- reviewed branch:
  `phase-3/reachable-base-dreamer-settleability-closure`;
- reviewed implementation HEAD:
  `0ab9cbb1d31f46fb989f049b804638b69ee399ba`;
- implementation base:
  `9723bded398870a26b65754f579d15b1e3425a9e`;
- repair base:
  `dbfa424c96a8bcf06a0d2a77205626a532aa2ec8`;
- review archive:
  `docs/implementation/phase-3-slice-2b20a-product-repair-round-1-implementation-review.md`;
- archive SHA-256:
  `913df42266cb97bdd9ba60943bf9430e80f30774ad9731c83590447d87c7a298`.

The current review commit
`844c7db5666dcb9d738a3bff12425bffd6df9d54` is the direct child of the Round 1
implementation commit and changes only review/control documentation.

The governing behavior authority remains the frozen composite of:

- `docs/implementation/phase-3-slice-2b20a-design-round-2.md`;
- `docs/implementation/phase-3-slice-2b20a-traceability-classification-correction-v1.md`;
- `docs/implementation/phase-3-slice-2b20a-design-release-review.md`;
- `docs/rules/evidence/2B20A-resolved.md`, whose rule verdict is `RULE_READY`;
- `docs/rules/ROLE_COVERAGE_MATRIX.md`.

Code and tests establish present implementation behavior and reachability. They
do not replace the sourced rule evidence.

The Round 1 review independently ran all eight then-authorized local gates and
reported them green, including `35 files / 1572 tests`. Those green results do
not close the two omitted contracts below and cannot be inherited by a future
Round 2 implementation HEAD.

## Exact Remaining Blockers

Exactly two Product Repair blockers remain:

1. `F01_NUMERIC_ELEMENT_ENUMERABILITY_NOT_ENFORCED`
2. `F04_C34_FROZEN_ADJACENT_STATE_MATRIX_INCOMPLETE`

### F01 exact deficiency

- Exact production file:
  `packages/domain-core/src/dreamer.ts`
- Exact symbol:
  `isExceptionSafeCanonicalDreamerData`
- Exact current code region:
  the array-element loop at current lines `101-104`
- Exact current defect:
  the implementation obtains an own descriptor and reads only
  `descriptor.value`, but accepts a numeric own data descriptor when
  `descriptor.enumerable !== true`.
- Exact counterexample:
  a legal V7 clone whose `apparentPairDecision.legalCandidates[0]` remains an
  own data property holding the same legal candidate but is redefined with
  `enumerable: false`.
- Exact missing contract:
  every canonical numeric array element must be an enumerable own data
  descriptor.
- Exact required evidence:
  the counterexample must fail closed through the existing direct C20 hostile
  matrix assertion, the exported public payload validator, and the stored
  delivery validator, while the existing numeric accessor counter remains
  exactly zero and the legal enumerable control still passes.

### F04 exact deficiency

- Exact test file:
  `packages/domain-core/src/dreamer.test.ts`
- Exact existing test:
  `[2B20A-C34] resolves only the exact canonical-drunk Fang Gu capability`
- Exact production symbol under proof:
  `resolveBaseDreamerV2NormalCapability`
- Missing independent T2 primary cases:
  - a well-formed canonical BASE `sourceAbilityInstanceId` whose task/source/
    tenure/revision relation cannot be proved;
  - a real current-Demon/catalog snapshot mismatch in which state and catalog
    are separately legal but semantically inconsistent.
- Exact misleading current evidence:
  `anotherDemonState` and `anotherDemonSetup` both use Vigormortis. That fixture
  legitimately proves the “another catalog Demon with no impairment” result,
  but it does not prove a state/catalog mismatch even though the expected
  resolver reason is also `CURRENT_DEMON_CATALOG_MISMATCH`.
- Exact insufficiency:
  the current valid T2 matrix proves the other frozen adjacent states but does
  not independently prove the well-formed source-ability semantic cross-link
  failure or the separately legal state/catalog semantic mismatch.
- Structural boundary:
  missing required plan/opportunity/tenure/contract fields, missing ability ID,
  invalid ability-ID grammar, and sparse impairment arrays are
  `R3 / T1 / STRUCTURAL_VALIDATION` evidence. They may remain supporting
  authority elsewhere but are not C34 primary cases and do not count toward
  F04 closure.

## Explicitly Closed Findings

The following finding and behavior are closed, regression-only, and not
editable in Round 2:

- `F05 / C37`
- `C37_FORMAL_MATHEMATICIAN_PATH`
- formal `SettleMathematicianInformation` application-command settlement
- `selectedCount = 1`
- `trueCount = 1`
- Dreamer contribution exactly `1`
- Philosopher contribution exactly `0`
- Dreamer target contribution exactly `0`
- no Dreamer double count
- accepted terminal batch, receipt, idempotent retry, projection privacy, task
  settlement, and rebuild assertions proved by C37

Round 2 must not modify:

- `packages/application/src/game-application-service.test.ts`;
- any C37 title, body, fixture, expectation, or ownership marker;
- Mathematician production code or fixtures;
- first-night outcome-ledger production code;
- the Dreamer/Philosopher/target attribution policy.

F05/C37 remains closed unless a later authorized change actually breaks its
existing read-only regression gate. Downstream ownership or CI work alone does
not reopen it.

## Scope and Non-Goals

### In scope

Round 2 owns only:

1. the missing numeric-element `enumerable === true` check in the existing V7
   canonical-data preflight;
2. the exact C20 non-enumerable own-data-property regression evidence;
3. the two valid T2 C34 matrix cases `C34-R2-M06` and `C34-R2-M08`
   identified by the independent classification audit;
4. preservation of all already accepted behavior and all explicitly closed
   findings.

### Non-goals

Round 2 does not authorize:

- any resolver outcome or branch change;
- POISONED Dreamer success;
- No Dashii derivation or settlement;
- gained-Dreamer impairment;
- impaired, dead, poisoned, drunk, or ineffective Vortox behavior;
- generic impairment or lifecycle infrastructure;
- new commands, events, event versions, state fields, projections, receipts,
  failure kinds, or public APIs;
- application-service test changes;
- ledger or Mathematician production changes;
- first-night completion or `FIRST_NIGHT -> DAY`;
- rule-evidence, rule-semantics, role-matrix, traceability, ownership, SUP,
  routing, workflow, dependency, timeout, coverage-profile, Vitest-project,
  worker, pool, or process-group changes;
- new test titles or changes to existing test titles;
- PR #46 or GitHub review-thread mutation;
- Slice 2B20B or any later slice.

## F01 Round 2 Completion Contract

The array branch of `isExceptionSafeCanonicalDreamerData` must enforce this
exact contract for every canonical numeric index from `0` through
`length - 1`:

1. `Object.getOwnPropertyDescriptor(candidate, String(index))` is used.
2. Descriptor lookup failure or exception fails closed.
3. The own descriptor must exist.
4. The descriptor must be a data descriptor, proved by the presence of its own
   `value` slot and the absence of accessor semantics.
5. `descriptor.enumerable` must be strictly `true`.
6. Recursive validation reads only `descriptor.value`.
7. `candidate[index]`, `Reflect.get`, spread, iteration, mapping, or any
   equivalent unknown-property read must not occur before canonical preflight
   succeeds.
8. A numeric accessor is rejected before its getter or setter can execute.
9. Throwing and revoked Proxy behavior remains exception-safe.

The array `length` descriptor is deliberately different:

- it must remain the normal own array `length` data descriptor;
- its value must remain a nonnegative safe integer;
- it must not be required to be enumerable;
- Round 2 must not alter standard array `length` semantics.

The repair is limited to numeric-element enumerability. It must not add
requirements for numeric-element `writable` or `configurable` combinations.
It must not rewrite the canonical-data validator or introduce a generic
validation framework.

The following Round 1 behavior is preserved:

- unknown numeric values are obtained through own descriptors;
- no direct `candidate[index]` read occurs during preflight;
- numeric accessors fail before getter execution;
- getter count remains zero;
- sparse arrays, noncanonical numeric keys, out-of-range indices, extra string
  keys, symbol keys, cycles, nonplain objects, noncanonical prototypes,
  descriptor-throwing Proxy, and revoked Proxy fail closed;
- legal enumerable V7 payloads pass;
- legal V1–V7 behavior is unchanged.

This completion contract changes rejection of a noncanonical hidden numeric
element only. It does not change the valid V7 data model. If implementation
cannot satisfy it without changing valid V7 behavior, the terminal result is:

`F01_ROUND_2_REQUIRES_BEHAVIOR_DESIGN_CHANGE`

No implementation may continue after that result.

## C20 Round 2 Evidence Contract

The existing C20 test title must remain byte-for-byte unchanged:

`[2B20A-C20] rejects getter Proxy symbol cycle sparse and nonplain V7 inputs with zero getter calls`

Its body must be extended as follows:

1. Obtain the canonical V7 fixture from `v7FangGuFacts()`.
2. Deep-clone `facts.delivery`.
3. Obtain the current own descriptor for
   `apparentPairDecision.legalCandidates["0"]`.
4. Assert that the original descriptor exists, is a data descriptor, is
   enumerable, and contains the original legal candidate.
5. Redefine only that existing numeric property by preserving its `value`,
   `writable`, and `configurable` attributes and setting
   `enumerable: false`.
6. Assert directly on the resulting descriptor that:
   - it remains an own data property;
   - `enumerable === false`;
   - it contains no `get` or `set`;
   - its value is still the original legal candidate.
7. Add this fixture to the existing direct C20 hostile-input matrix and assert
   `valid === false`.
8. Call the existing exported public entry
   `validateDreamerInformationDeliveredPayload` with the same fixture and
   assert exactly:

   ```text
   {
     valid: false,
     reason: "DreamerInformationDelivered payload must use exception-safe canonical data"
   }
   ```

9. Call `validateStoredDreamerInformationDelivered` with the existing canonical
   `StoredDreamerSourceFacts` and assert exactly:

   ```text
   {
     valid: false,
     reason: "Stored DreamerInformationDelivered payload must use exception-safe canonical data"
   }
   ```

10. Retain the existing numeric accessor fixture and assert its getter-call
    counter remains exactly `0`.
11. Retain exact successful controls for the original legal V7 delivery through
    both existing validators.
12. Retain existing V1–V6 regression coverage and the complete
    `dreamer.test.ts` gate.

The direct hostile-matrix assertion and the exact public-validator assertion
may invoke the same existing exported validator as separate assertions. No new
public validator or test-only production entry is authorized.

C20 remains:

- expected reachability: `R3 HOSTILE_OR_CORRUPTED_HISTORY`;
- expected trust: `T1 EXTERNAL_OR_PERSISTED_BOUNDARY`;
- primary layer: `STRUCTURAL_VALIDATION`;
- required mechanism: `HOSTILE_CANONICAL_DATA_PREFLIGHT_MATRIX`.

Round 2 does not modify traceability records or create a new physical test
identity.

## F04 Round 2 Completion Contract

F04 is test-completeness repair only. Production behavior of
`resolveBaseDreamerV2NormalCapability` and
`resolvePhilosopherGainedDreamerCapability` is frozen.

The existing C34 test title must remain byte-for-byte unchanged:

`[2B20A-C34] resolves only the exact canonical-drunk Fang Gu capability`

The test body must retain the canonical `v7FangGuFacts()` success fixture and
its existing local `resolve(...)` entry. Every Round 2 case must:

- start from that canonical fixture;
- mutate only the named domain dimension;
- use current formal types, canonical role snapshots, branded ID helpers, and
  canonical provenance construction;
- use a separate fixture object and a separate assertion;
- avoid failure caused by an unrelated malformed field;
- assert exact resolver `kind`;
- assert exact `reason` for every `EFFECTIVENESS_UNRESOLVED` result;
- avoid `not.toBe(success)`, `not.toMatchObject`, truthiness, or other broad
  substitutes;
- leave the production resolver unchanged.

C34 retains its frozen primary classification:

- expected reachability: `R1 CURRENTLY_REACHABLE_APPLICATION_PATH`;
- expected trust: `T2 CANONICAL_DERIVED_STATE`;
- primary layer: `PURE_POLICY_SEAM`;
- required mechanism: `DIRECT_CANONICAL_CAPABILITY_RESOLUTION_MATRIX`.

Structural supporting variants do not count toward C34 completion, do not
create a new C34 primary case, and do not authorize traceability
reclassification. Existing structural assertions remain regression evidence
under their actual `R3 / T1 / STRUCTURAL_VALIDATION` authority.

### C34 frozen-requirement audit

The frozen requirement-to-authority mapping is complete and contains no
`EVIDENCE_GAP`:

| # | Frozen requirement | Valid T2 evidence | Round 2 classification |
|---|---|---|---|
| 1 | canonical DRUNK plus unique Fang Gu | Existing dense canonical C34 fixture asserts `CANONICAL_DRUNK_SOURCE_FANG_GU_APPARENT_INFORMATION_SUPPORTED` and the unique Fang Gu constraint | `EXISTING_VALID_T2_EVIDENCE` |
| 2 | legal POISONED | Existing complete `SNAKE_CHARMER_DEMON_HIT` POISONED record, without DRUNK-only `chosenRoleId`, asserts exact `SOURCE_REPRESENTED_IMPAIRED / POISONED` | `EXISTING_VALID_T2_EVIDENCE` |
| 3 | duplicate impairment | Existing dense array contains canonical DRUNK plus its complete clone and asserts exact `SOURCE_IMPAIRMENT_CONFLICT` | `EXISTING_VALID_T2_EVIDENCE` |
| 4 | conflicting impairment | Existing dense array contains complete canonical DRUNK plus complete legal POISONED and asserts exact `SOURCE_IMPAIRMENT_CONFLICT` | `EXISTING_VALID_T2_EVIDENCE` |
| 5 | stale revision/provenance | Existing complete opportunity, state, contract, and impairment advance the opening/current revision so the older impairment is outside the applicable window and assert exact `NORMAL_INFORMATION_SUPPORTED` | `EXISTING_VALID_T2_EVIDENCE` |
| 6 | current No Dashii unresolved | Existing separately legal state/catalog use the same No Dashii snapshot and assert exact `NO_DASHII_EFFECT_UNRESOLVED` | `EXISTING_VALID_T2_EVIDENCE` |
| 7 | current effective Vortox | Existing canonical Vortox fixture, including the canonical-DRUNK variant, asserts the exact supported Vortox kind; the conflict fixture uses two complete applicable POISONED records and asserts `VORTOX_EFFECTIVENESS_CONFLICT` | `EXISTING_VALID_T2_EVIDENCE` |
| 8 | another current Demon | Existing matching Vigormortis state/catalog fixtures assert the frozen with-DRUNK and without-impairment outcomes; they prove the other-current-Demon branch, not a state/catalog mismatch | `EXISTING_VALID_T2_EVIDENCE` |
| 9 | unprovable source ability/provenance | New `C34-R2-M06` uses a parser-valid canonical BASE seat-12 ability identity while retaining the canonical seat-01 task/source/tenure/revision chain | `ROUND_2_M06_REQUIRED` |
| 10 | state/catalog semantic mismatch | New `C34-R2-M08` uses separately valid same-role state and catalog snapshots whose total-preserving setup modifiers differ | `ROUND_2_M08_REQUIRED` |
| 11 | normal effective base Dreamer control | Existing no-impairment Fang Gu control asserts exact `NORMAL_INFORMATION_SUPPORTED` | `VALID_CONTROL_NOT_PRIMARY` |
| 12 | gained Dreamer unchanged control | Existing gained resolver control asserts exact `NORMAL_INFORMATION_SUPPORTED` | `VALID_CONTROL_NOT_PRIMARY` |

The current C34 unresolved assertions already use exact `kind/reason`; it has no
`not.toBe(success)` substitute. Its supported-result assertions use
`toMatchObject` but explicitly assert exact `kind`, and supported variants have
no `reason` field. Round 2 must not weaken them.

## C34 Round 2 Primary-Case Table

| Case ID | Frozen requirement | Current evidence | Exact deficiency | Canonical fixture construction | Single domain dimension changed | Exact expected resolver kind/reason | Primary assertion |
|---|---|---|---|---|---|---|---|
| `C34-R2-M06` | well-formed but unprovable base ability instance fails provenance closed | No C34 case supplies a canonical BASE ability ID for a task absent from the accepted plan | Parser-valid but historically unprovable ability identity is unproved | Starting from `v7FangGuFacts()`, replace only `sourceContract.sourceAbilityInstanceId` with `formatBaseFirstNightAbilityInstanceId(scheduledTaskId("first-night-v1:DREAMER_ACTION:seat-12"))`; use the same complete cloned opportunity in the direct argument and opportunity state; retain the canonical seat-01 task, plan, source player, tenure, assignment, contract version, opening revision, and current revision | The ability identity’s task cross-link changes from canonical seat-01 to legal but unplanned BASE seat-12 | `EFFECTIVENESS_UNRESOLVED / SOURCE_PROVENANCE_INVALID` | `toStrictEqual({ kind: "EFFECTIVENESS_UNRESOLVED", reason: "SOURCE_PROVENANCE_INVALID" })` |
| `C34-R2-M08` | a true current Demon/catalog snapshot mismatch fails closed | Existing `anotherDemonState` and `anotherDemonSetup` both use Vigormortis and therefore match each other | The current assertion proves another catalog Demon, not a state/catalog relationship mismatch | Keep canonical setup/catalog unchanged; clone only the current Fang Gu state entry’s `RoleSetupSnapshot`, preserving the same canonical `roleId`, `characterType: "DEMON"`, `defaultAlignment: "EVIL"`, and edition, while replacing its modifier with the separately valid total-preserving `{ outsiderDelta: 1, townsfolkDelta: -1 }`; leave exactly one current Demon and every other state/catalog relation unchanged | Only the current-state/catalog `setupModifier` relationship changes; both snapshots remain independently valid | `EFFECTIVENESS_UNRESOLVED / CURRENT_DEMON_CATALOG_MISMATCH` | `toStrictEqual({ kind: "EFFECTIVENESS_UNRESOLVED", reason: "CURRENT_DEMON_CATALOG_MISMATCH" })` |

Both primary fixtures are complete, use supported versions and canonical ID
grammar, and are `T2 CANONICAL_DERIVED_STATE`. Neither depends on a cast,
deleted required field, sparse array, accessor, Proxy, nonplain object, or
invalid literal. Each changes exactly one semantic cross-link from the
canonical success control.

### Structural supporting authority excluded from C34 primary completion

The prior design’s `C34-R2-M01` through `C34-R2-M05` constructions and its
prior `C34-R2-M07` construction are removed from the C34 primary required list:

- M01 removed a required plan field.
- M02 removed a required V3 opportunity field.
- M03 removed a required tenure-state field.
- M04 used an unsupported version literal.
- M05 removed the required `sourceAbilityInstanceId`.
- M07 embedded a BASE task ID in the gained-v2 formatter and therefore did not
  produce parser-valid gained-v2 identity grammar.

Those constructions are `R3 / T1 / STRUCTURAL_VALIDATION`, not
`R1 / T2 / PURE_POLICY_SEAM`. They are neither renamed nor recreated as Round 2
C34 primary cases, and they are not required implementation evidence.

The existing sparse impairment assertion is classified the same way:
`R3 / T1 / STRUCTURAL_VALIDATION`. It may remain as read-only structural
supporting/regression evidence in the existing test body, but it is removed
from the C34 `already valid` T2 inventory, does not decide C34 completion, and
does not substitute for the existing dense duplicate/conflicting impairment
T2 evidence. This correction authorizes no traceability, title, marker, or
separate structural-test edit.

The twelve-row mapping above has `EVIDENCE_GAP = none`; no replacement T2 case
beyond M06 and M08 is authorized.

The current production resolver’s branch order yields the expected existing
result for each listed case. No legal case inspected for this design requires a
resolver behavior change. Therefore
`ADDITIONAL_PRODUCT_BEHAVIOR_DEFECT_REQUIRES_FINAL_REPAIR_SCOPE_REVIEW` is not
triggered by the read-only design audit.

If implementation or independent review demonstrates that any representative
fixture above is domain-legal yet returns a different production result, stop
immediately with:

`ADDITIONAL_PRODUCT_BEHAVIOR_DEFECT_REQUIRES_FINAL_REPAIR_SCOPE_REVIEW`

The fixture must not be weakened or altered to conceal that result, and Round 2
does not authorize a production resolver correction.

## Regression-Preservation Contract

Round 2 must preserve all of the following without reinterpretation:

- exact V1–V7 payload unions and runtime shapes;
- legal V7 candidate arrays with ordinary enumerable numeric data properties;
- canonical V7 accepted history and replay;
- existing target/V7/settlement atomic batch order;
- prospective validation before append;
- replay rejection for partial, reordered, duplicate, forged, or mutated
  histories;
- accepted normal base Dreamer behavior;
- accepted effective-current-Vortox base Dreamer behavior;
- accepted canonical-drunk/effective-current-Vortox behavior;
- accepted canonical-drunk/Fang Gu behavior;
- accepted Philosopher-gained Dreamer behavior;
- legal POISONED remains represented impaired, not newly supported;
- No Dashii remains unresolved;
- another catalog Demon outcomes remain frozen;
- receipt, fingerprint, idempotency, retryability, and mutation-free failure
  boundaries;
- historical delivered-knowledge stability;
- source-only player/AI projection and all existing privacy exclusions;
- Dreamer/Philosopher/target attribution and Mathematician distinct-player
  counting;
- raw UTF-16 deterministic ordering and all canonical ID formatters;
- prohibition on `Date.now`, `Math.random`, random UUIDs, `localeCompare`,
  `Intl.Collator`, and environment-locale ordering;
- Dreamer role coverage remains `PARTIAL`;
- slice coverage remains
  `PARTIAL / REACHABLE_BASE_DREAMER_SETTLEABILITY_ONLY`.

Round 2 adds no event flow. Existing event sourcing, replay, atomic batch,
prospective validation, projection, and receipt code must have zero production
diff.

## File Allowlist

### Future Round 2 production allowlist

Exactly one production file may change:

- `packages/domain-core/src/dreamer.ts`

No second production file is authorized.

### Future Round 2 formal-test allowlist

Exactly one formal test file may change:

- `packages/domain-core/src/dreamer.test.ts`

The existing C20 and C34 test bodies may be extended. Their title strings,
criterion markers, ownership markers, and existing assertions must remain
unchanged.

### Explicitly forbidden files and surfaces

Round 2 must not modify:

- `packages/application/src/game-application-service.test.ts`;
- any other production or test file;
- Mathematician fixtures or production;
- first-night outcome-ledger production;
- rules or rule evidence;
- `docs/rules/ROLE_COVERAGE_MATRIX.md`;
- test traceability;
- ownership markers, manifests, SUP registry, or routing;
- workflows, package scripts, dependencies, timeouts, coverage profiles,
  Vitest projects, pools, workers, shards, or process groups;
- PR #46 body, comments, review threads, labels, or remote branch state.

Truthful control synchronization and materialization of this design are
docs/control work by the sole writer under separate controller authority. They
do not expand the future product implementation allowlist and do not consume a
Product Repair round.

## Local Verification Gates

Future implementation must use:

- Node `v24.15.0`;
- Corepack pnpm `11.7.0`.

After the first Round 2 production or formal-test change, the implementer must
run, in this order:

1. focused C20:

   ```text
   corepack pnpm exec vitest run --workspace vitest.workspace.ts packages/domain-core/src/dreamer.test.ts -t "2B20A-C20"
   ```

2. focused C34:

   ```text
   corepack pnpm exec vitest run --workspace vitest.workspace.ts packages/domain-core/src/dreamer.test.ts -t "2B20A-C34"
   ```

3. focused C37 read-only regression:

   ```text
   corepack pnpm exec vitest run --workspace vitest.workspace.ts packages/application/src/game-application-service.test.ts -t "2B20A-C37"
   ```

4. complete Dreamer domain test file:

   ```text
   corepack pnpm exec vitest run --workspace vitest.workspace.ts packages/domain-core/src/dreamer.test.ts
   ```

5. complete application-service test file:

   ```text
   corepack pnpm exec vitest run --workspace vitest.workspace.ts packages/application/src/game-application-service.test.ts
   ```

6. full typecheck:

   ```text
   corepack pnpm typecheck
   ```

7. full lint:

   ```text
   corepack pnpm lint
   ```

8. full ordinary test suite:

   ```text
   corepack pnpm test
   ```

Required implementation acceptance evidence is:

- all eight commands exit successfully;
- C20 proves non-enumerable numeric own data fails at every required entry;
- C20 retains numeric accessor getter count `0`;
- C20 legal enumerable V7 controls pass;
- C34 preserves the eight mapped existing T2 requirements, adds the two
  independent M06/M08 T2 primary fixtures with exact results, and preserves the
  two normal/gained controls;
- C37 remains unchanged and green;
- no unhandled error is hidden;
- `git diff --check` succeeds;
- diff scope is exactly within the two-file product allowlist;
- no forbidden source or test title changes.

The Round 2 local implementation gate must not run or claim:

- coverage;
- ownership merge or ownership self-test;
- GitHub CI;
- Windows W1–W7;
- final PR review.

Those remain later independent gates. No existing or future CI result may be
prewritten as `PASS` in this design.

## Documentation and Control State

After the sole writer materializes this design and synchronizes the authorized
control files, the active state is:

- top-level status: `HUMAN_BLOCKED`
- detailed state:
  `READY_FOR_INDEPENDENT_PRODUCT_REPAIR_ROUND_2_DESIGN_REREVIEW`
- currentPR: `46`
- currentBranch:
  `phase-3/reachable-base-dreamer-settleability-closure`
- implementationBranch:
  `phase-3/reachable-base-dreamer-settleability-closure`
- repairBaseHead:
  `dbfa424c96a8bcf06a0d2a77205626a532aa2ec8`
- round1ImplementationCommit:
  `0ab9cbb1d31f46fb989f049b804638b69ee399ba`
- round1ReviewCommit:
  `844c7db5666dcb9d738a3bff12425bffd6df9d54`
- productRepairRound: `1/2`
- productRepairRoundConsumed: `true`
- productRepairRoundConsumedByDesign: `false`
- implementationAuthorized: `false`
- designCorrectionRound: `1/2`
- implementationAuthorized: `false`
- requiredNextAction:
  `RUN_INDEPENDENT_PRODUCT_REPAIR_ROUND_2_DESIGN_REREVIEW`

Active blockers must include:

- `PENDING_INDEPENDENT_PRODUCT_REPAIR_ROUND_2_DESIGN_REREVIEW`
- `F01_NUMERIC_ELEMENT_ENUMERABILITY_NOT_ENFORCED`
- `F04_C34_FROZEN_ADJACENT_STATE_MATRIX_INCOMPLETE`
- `OWNERSHIP_SUPERSESSION_AND_ROUTING_REQUIRED`
- `LINUX_WORKER_RPC_CI_BLOCKER`
- `WINDOWS_W7_UNKNOWN_EXIT_BLOCKER`

Closed history must include, and active blockers must exclude:

- `F05`
- `C37_FORMAL_MATHEMATICIAN_PATH`
- Dreamer/Philosopher/target contribution attribution
- double-count finding

This design does not authorize test-traceability, role-matrix, ownership, SUP,
routing, workflow, profile, PR, or GitHub-thread documentation changes.

## Repair Budget

Round 1 has already consumed Product Repair round `1/2`.

Materializing this design and conducting its independent design review do not
consume another Product Repair round:

- `productRepairRoundBefore = 1/2`
- `productRepairRoundConsumedByDesign = false`

Only the first future commit that changes
`packages/domain-core/src/dreamer.ts` or
`packages/domain-core/src/dreamer.test.ts` for this design consumes the final
Product Repair round:

- `productRepairRound = 2/2`
- `productRepairRoundConsumed = true`

Round 2 is the final Product Repair round under the current authorization
model. No Round 3 is implied or authorized.

## Rollback

Before acceptance, rollback is a normal revert of the bounded Round 2
implementation commit affecting only:

- `packages/domain-core/src/dreamer.ts`;
- `packages/domain-core/src/dreamer.test.ts`.

Rollback must not use history rewriting, reset, rebase, or amendment of the
reviewed Round 1 commits.

The repair adds no event, event version, state field, receipt, projection, or
accepted-history migration. V1–V7 replay schemas remain unchanged. If the
repair is later accepted, any subsequent correction must preserve the stricter
canonical numeric-element contract and proceed as a separately reviewed
forward-compatible change.

## Stop-Loss

Stop the Round 2 design or implementation immediately if any of the following
is required:

- a second production file;
- a test file other than `packages/domain-core/src/dreamer.test.ts`;
- modification of application-service tests to close F04;
- any resolver behavior change;
- a change to valid V7 behavior;
- a rule-semantics change;
- an event, event-version, or state-schema change;
- a new public API or validator;
- POISONED, No Dashii, gained impairment, or ineffective-Vortox implementation;
- a generic validation or impairment framework;
- ownership, routing, SUP, traceability, workflow, profile, timeout, dependency,
  CI, or process infrastructure to prove F01/F04;
- inability to identify or independently assert the exact missing C34 cases;
- a legal C34 fixture whose current production result differs from the frozen
  expected result;
- deletion, weakening, renaming, skipping, or platform-conditioning of a test;
- replay, atomicity, prospective validation, receipt, idempotency, historical
  knowledge, projection privacy, or deterministic behavior regression.

Special stop results are:

- valid V7 behavior must change for F01:
  `F01_ROUND_2_REQUIRES_BEHAVIOR_DESIGN_CHANGE`;
- a legal C34 case exposes a production behavior discrepancy:
  `ADDITIONAL_PRODUCT_BEHAVIOR_DEFECT_REQUIRES_FINAL_REPAIR_SCOPE_REVIEW`.

If Round 2 implementation review still returns any product-code or formal-test
blocker, repair budget is exhausted. The state becomes `HUMAN_BLOCKED`.
The controller must not create Round 3, expand production scope, lower test
quality, skip a finding, or modify the frozen design. The only permitted next
action is to request an explicit user decision among:

- stop-loss override;
- reslice;
- abandonment of PR #46.

## Downstream PR Blockers

The following blockers are independent of Round 2 product implementation:

- `OWNERSHIP_SUPERSESSION_AND_ROUTING_REQUIRED`
- `LINUX_WORKER_RPC_CI_BLOCKER`
- `WINDOWS_W7_UNKNOWN_EXIT_BLOCKER`

They:

- do not block implementing Round 2 after the independent design rereview
  passes under the existing end-to-end authorization;
- continue to block PR acceptance, final review, and merge;
- are not modified by Round 2;
- must not be marked resolved by Round 2;
- cannot be used to conceal a product-test or frozen-contract failure;
- require their own exact-head evidence and authorization.

F05/C37 remains closed while these downstream tasks are pending unless an
actual later product change breaks its existing regression.

## Independent Review Handoff

The independent read-only reviewer must inspect:

- this complete Round 2 design;
- the complete Round 1 implementation review and its exact SHA-256;
- Round 1 implementation diff and current local product files;
- frozen Round 2 behavior design;
- classification appendix and design-release review;
- `docs/rules/evidence/2B20A-resolved.md`;
- all pinned mandatory external sources or independently approved snapshots;
- official nightsheet positions Philosopher `14`, Dreamer `61`,
  Mathematician `77`;
- current `docs/rules/ROLE_COVERAGE_MATRIX.md`;
- `packages/domain-core/src/dreamer.ts`;
- `packages/domain-core/src/dreamer.test.ts`;
- the current formal types and ID formatters used by every proposed C34
  fixture;
- C37 and Mathematician files as read-only regression authority.

The review must verify:

1. F01 adds only strict numeric-element enumerability.
2. Array `length` is not incorrectly required to be enumerable.
3. No accessor or unknown numeric value read occurs before rejection.
4. C20 proves the non-enumerable own-data-property case through all required
   existing validation entries.
5. The twelve-row frozen requirement mapping is complete, contains no
   `EVIDENCE_GAP`, and uses only valid T2 evidence or valid controls.
6. M06 and M08 are independent, complete T2 fixtures, mutate exactly one named
   semantic relationship each, and assert exact `kind/reason`.
7. The Vigormortis matching fixture is not misrepresented as a catalog
   mismatch.
8. No resolver change is authorized.
9. C37/F05 and Mathematician attribution remain closed and untouched.
10. Production and test allowlists contain exactly one file each.
11. Event sourcing, replay, atomicity, prospective validation, retry,
    historical knowledge, projection safety, and determinism remain unchanged.
12. Product Repair accounting and stop-loss are explicit.
13. Downstream PR blockers remain independent and unresolved.
14. Dreamer remains `PARTIAL`.

Under
`USER_AUTHORIZED_2B20A_PRODUCT_REPAIR_ROUND_2_END_TO_END_CLOSURE`, an
independent `RULE_DESIGN_PASS` with `remainingDesignBlockers=[]` automatically
sets `implementationAuthorized=true` and authorizes the bounded Round 2
implementation. No additional user authorization is required between design
rereview and implementation.

## Terminal State

READY_FOR_INDEPENDENT_PRODUCT_REPAIR_ROUND_2_DESIGN_REREVIEW
