# Phase 3 Slice 2B20B-P2F1R-D0 Catalog V2 Checkout-Portability Design V1

## 1. Design identity

- `sliceId`: `2B20B-P2F1R-D0`
- `sliceName`: `Catalog V2 Checkout-Portability Test Foundation`
- `authorization`: `USER_AUTHORIZED_2B20B_P2F1R_D0_CATALOG_TEST_PORTABILITY_AND_CONDITIONAL_CE_LOCAL_CLOSURE`
- `designRound`: `1`
- `designBaseHead`: `422bd4fa5d6f31bfc6b80b6834f566fe5a1978b7`
- `branch`: `phase-3/2b20b-p2f1r-ce-c-evidence-portability-closure`
- `governance`: `docs/architecture/2B20B-P2F1R-D0-catalog-v2-checkout-portability-governance-v1.md`
- `ruleEvidence`: `docs/rules/evidence/2B20B-P2F1R-D0.md`
- `ruleEvidenceSHA256`: `928d645e4f20b5e51b33ecb096f0b052cf41249988e626c9e2af6ee616046edf`
- `ruleVerdict`: `RULE_READY`
- `ruleCoverageStatus`: `SKELETON`
- `ruleSemanticsChanged`: `false`
- `behaviorChanged`: `false`
- `implementationAuthorized`: `false`
- `D0DesignCorrectionRound`: `0/1`
- `D0EvidenceRepairRound`: `0/2`

This design is the only D0 implementation authority after it obtains an independent `RULE_DESIGN_PASS`. This document does not issue that verdict.

## 2. Objective

Replace the checkout-dependent source of the existing Catalog V2 golden-byte test with the raw Git blob bound to the frozen repository path.

The resulting evidence flow is:

```text
C1 typed structural schema AST
  -> existing Catalog V2 renderer
  -> generated canonical UTF-8 bytes
  -> exact comparison
  -> raw Git blob bytes resolved from HEAD:path
```

The working-tree file remains visible only as checkout diagnostics.

## 3. Scope

D0 implements exactly one test-mechanism change:

- retain the existing Catalog V2 suite and test title;
- resolve the fixed Catalog path at the current test HEAD;
- prove the resolved OID is the frozen expected blob OID;
- read raw bytes from that exact object;
- verify exact expected length and SHA-256;
- generate the current Catalog V2 canonical UTF-8 bytes;
- verify their exact length and SHA-256;
- compare both buffers byte-for-byte;
- diagnose, but never authorize from, the working-tree representation;
- pass the same test and ordinary gates in default-Windows and LF worktrees.

## 4. Non-goals

D0 does not:

- modify a production file;
- modify Catalog generation or AST traversal;
- modify the checked-in Catalog V2 artifact;
- modify its embedded canonical artifact digest;
- create runtime or replay authority;
- implement event validation or accepted-history validation;
- change a BOTC rule, role, event, projection, receipt, or history;
- change test identity or semantic inventory;
- change `.gitattributes`, Git configuration, workflow, package scripts, ownership, coverage, profiles, or runners;
- perform hosted CI;
- complete P2F1R-D;
- implement CE evidence findings F01, F02, F04, or F05.

## 5. Authority hierarchy

The authority hierarchy remains:

1. C1 typed structural schema AST: sole runtime structural authority.
2. Existing deterministic Catalog renderer: produces the expected audit projection.
3. Raw Git blob bound to current `HEAD:path`: checked-in audit artifact evidence.
4. Working-tree file: diagnostic checkout representation only.

Neither the Git blob, its OID, its SHA-256, nor the worktree file can issue a C token, accepted-event authority, history or replay authority, canonical-state authority, rule correctness, or role coverage.

## 6. Frozen constants

The test must define fixed local constants equivalent to:

```ts
const CATALOG_V2_REPOSITORY_PATH =
  "docs/architecture/2B20B-P2F1R-C1-generated-structural-schema-catalog-v2.md";
const CATALOG_V2_EXPECTED_BLOB_OID =
  "4f9a376e56f19b241d76ce2a75be83b70859ae25";
const CATALOG_V2_EXPECTED_RAW_SHA256 =
  "e0f788db370eca7ad1d1097f2a271bd9257fb5966d28081c930458d3dea85ef6";
const CATALOG_V2_EXPECTED_RAW_BYTE_LENGTH = 264855;
const CATALOG_V2_EXPECTED_DEFAULT_CHECKOUT_SHA256 =
  "7d912c085c61ab34d06c46d0cbfd5f3def8e10465339d608566a73eaf93763b7";
const GIT_PLUMBING_MAX_BUFFER_BYTES = 1_048_576;
const GIT_PLUMBING_TIMEOUT_MS = 30_000;
```

The repository-relative path is not supplied by a test parameter, environment variable, CLI option, fixture, or untrusted input.

## 7. Repository-root contract

The test derives the repository root from its own fixed module location using `import.meta.url` and `fileURLToPath`.

The frozen relationship is:

```text
packages/domain-core/src/domain-event-structural-schema-catalog.test.ts
../../../
repository root
```

The test must not use ambient process current directory as authority, a user-supplied path, the protected old C worktree, or repository discovery through shell text. The resolved root is used only as `cwd` for fixed Git plumbing and as the base of the diagnostic worktree path.

## 8. Safe Git plumbing contract

Use Node `spawnSync` from `node:child_process`. Every invocation must freeze executable `git`; `shell: false`; `windowsHide: true`; `encoding: null`; `maxBuffer: 1_048_576`; `timeout: 30_000`; fixed `cwd`; no stdin; no network operation; no write subcommand; and no Git configuration mutation.

### 8.1 Path-to-OID resolution

Exact argv:

```text
["--no-replace-objects", "rev-parse", "--verify", "--end-of-options", "HEAD:docs/architecture/2B20B-P2F1R-C1-generated-structural-schema-catalog-v2.md"]
```

Success requires process start succeeded; no timeout or signal; exit status 0; empty stderr; stdout exactly 40 lowercase hexadecimal bytes followed by one LF or CRLF; decoded OID exactly `4f9a376e56f19b241d76ce2a75be83b70859ae25`. Do not use broad `trim()`. Remove only the single protocol framing newline after exact byte-shape validation.

### 8.2 Raw blob read

After OID equality, use the frozen expected OID as final fixed argument:

```text
["--no-replace-objects", "cat-file", "blob", "4f9a376e56f19b241d76ce2a75be83b70859ae25"]
```

Success requires process start succeeded; no timeout or signal; exit status 0; empty stderr; stdout retained as raw Buffer; length exactly 264855; SHA-256 exactly `e0f788db370eca7ad1d1097f2a271bd9257fb5966d28081c930458d3dea85ef6`. The blob must not be decoded, normalized, rewritten, or passed through a worktree filter.

### 8.3 Failure behavior

Git unavailable, start error, timeout, max-buffer overflow, nonzero exit, signal, unexpected stderr, malformed OID, OID mismatch, missing object, wrong object type, length mismatch, or digest mismatch fails closed. Stable D0-owned summaries: `D0_GIT_HEAD_BLOB_RESOLUTION_FAILED`, `D0_GIT_HEAD_BLOB_PROTOCOL_INVALID`, `D0_GIT_HEAD_BLOB_OID_MISMATCH`, `D0_GIT_BLOB_READ_FAILED`, `D0_GIT_BLOB_LENGTH_MISMATCH`, `D0_GIT_BLOB_SHA256_MISMATCH`. Raw stderr is not a protocol field and must not be reflected verbatim. A safe summary may include only status, signal presence, error presence, stderr presence, and bounded byte count. Git failure never falls back to worktree bytes.

## 9. Generated canonical bytes contract

Generate using existing `createFullC1StructuralSchemaAuthority` and `renderGeneratedStructuralSchemaCatalogV2`; authority must be `HEALTHY`. Encode exactly once with `Buffer.from(renderedCatalog, "utf8")`.

Required assertions:

- generated length `264855`;
- generated SHA-256 `e0f788db370eca7ad1d1097f2a271bd9257fb5966d28081c930458d3dea85ef6`;
- no BOM;
- exact Buffer equality with raw Git blob.

No newline normalization, string trimming, Unicode normalization, locale operation, JSON serialization, or expected-digest change.

## 10. Working-tree diagnostic contract

Read checked-out file as raw bytes, never authoritative UTF-8 text. Classify by lockstep byte scan:

### `MATCHES_REPOSITORY_BLOB`
- exact Buffer equality;
- length 264855;
- SHA `e0f...85ef6`;
- 626 LF, 0 CRLF.

### `LF_TO_CRLF_CHECKOUT_CONVERSION_ONLY`
- every non-LF blob byte matches exactly;
- each blob LF maps to exactly CR then LF;
- no other insertion/removal/change;
- length 265481;
- SHA `7d912c085c61ab34d06c46d0cbfd5f3def8e10465339d608566a73eaf93763b7`;
- 626 CRLF, 0 lone LF.

### `OTHER_CHECKOUT_DIFFERENCE`
Any other result.

The classifier must not construct normalized authority bytes or feed its result into canonical equality. Clean dual-worktree gates accept only the first two; `OTHER_CHECKOUT_DIFFERENCE` fails closed.

## 11. Existing test identity

Suite exactly `Catalog V2 audit projection`; title exactly `matches the checked-in frozen generated Catalog V2 path byte-for-byte`. No `it`, `it.each`, suite, project, file, or title is added or removed. Full identity:

```text
["domain-core", "packages/domain-core/src/domain-event-structural-schema-catalog.test.ts", ["Catalog V2 audit projection"], "matches the checked-in frozen generated Catalog V2 path byte-for-byte"]
```

The title remains truthful because generated bytes are compared with the blob bound to checked-in `HEAD:path`.

## 12. Traceability V1.1

D0 creates no competing semantic criterion or primary identity. The implementation traceability restates the repaired binding for existing owner:

| Field | Frozen value |
|---|---|
| `CriterionId` | `C1-C11` |
| `RuleClaim` | Catalog V2 is deterministic audit output, never runtime authority |
| `CompletionCriterion` | Generated bytes equal checked-in `HEAD:path` raw blob bytes exactly; runtime consumers remain absent |
| `RequiredEvidenceMechanism` | Fixed-path Git blob resolution, raw-object read, expected OID/length/SHA, generated SHA, byte equality |
| `ExpectedReachability` | `R4_FUTURE_HYPOTHETICAL_STATE` |
| `ExpectedTrust` | `T3_MODULE_PRIVATE_PURE_CORE` |
| `ExpectedPrimaryLayer` | `PURE_POLICY_SEAM` |
| `ExpectedResult` | Exact artifact match independent of checkout line endings |
| `SupportingAuthorityRequirement` | `NONE` |

After implementation it adds the existing physical identity and semantic `MechanismMatch`; it may mark PASS only after test and both worktree gates pass. Git blob is direct-validated artifact input, not separate `SUP-*`; worktree diagnostic is not supporting authority. D0 local evidence may support future C1-C15 but cannot complete C1-C15 or P2F1R-D publication.

## 13. File allowlist

Test: exactly `packages/domain-core/src/domain-event-structural-schema-catalog.test.ts`; helper logic stays local.

Documentation:
- governance V1;
- design V1;
- one D0 independent design-review document;
- `docs/implementation/phase-3-slice-2b20b-p2f1r-d0-test-traceability.md`;
- one D0 local implementation-review document if required.

No separate helper is authorized. A reusable helper requires the one docs-only correction and fresh review.

Forbidden: all production files, especially canonical-runtime-value/hash, schema AST/catalog, canonical-domain-event, validator, index; event definitions; semantic validators; replay/batch/snapshot/state/application; generated Catalog V2; Catalog V1; `.gitattributes`; workflow/package scripts; ownership/coverage/profiles/runners; role matrix; agent-loop controls; protected old C worktree.

## 14. Implementation sequence

Only after `RULE_DESIGN_PASS` and empty blockers, sole writer: rechecks clean branch and frozen production hashes; increments evidence repair to 1/2; edits only allowed test and traceability; runs focused test; commits with required attribution; freezes HEAD; creates default and LF worktrees from exact HEAD; runs all gates; requests fresh Code and Rule reviews. No push/PR/merge/tag/hosted CI.

## 15. Dual-worktree contract

Create two clean detached worktrees from same exact D0 candidate HEAD.

A. Default Windows: ordinary checkout policy, no config change. Expected `git ls-files --eol` index LF/worktree CRLF; checkout SHA `7d912c...763b7`; classification `LF_TO_CRLF_CHECKOUT_CONVERSION_ONLY`.

B. LF: command-scoped nonpersistent options such as `git -c core.autocrlf=false -c core.eol=lf worktree add --detach <path> <head>`; no global/repo/worktree config write. Expected index/worktree LF; SHA `e0f788...85ef6`; classification `MATCHES_REPOSITORY_BLOB`.

Record exact HEAD, clean status, Node/pnpm, observed autocrlf source/value, eol census, checkout SHA, blob OID/raw SHA, generated SHA, classification. Both retain same OID/raw/generated SHA, title, test count, commit.

## 16. Local acceptance gates

In both clean worktrees run focused Catalog test (expected 21/21), domain-core project, `pnpm typecheck`, `pnpm lint`, `pnpm test`. All pass naturally. Before/after verify clean, unchanged HEAD, unchanged artifact, frozen C hashes. Do not run coverage, ownership, hosted CI, workflow reruns, D gates. Missing dependencies may be installed only with `pnpm install --frozen-lockfile` without tracked changes.

## 17. Independent design-review gate

Fresh read-only reviewer inspects D0 evidence/RULE_READY, governance/design, actual generator/artifact/test, fixed path/OID/SHA, safe plumbing, identity, allowlist, dual worktrees, deferred D, budgets/stop. Valid verdicts only `RULE_DESIGN_PASS`, `RULE_DESIGN_FIX_REQUIRED`, `HUMAN_BLOCKED`; implementation forbidden without PASS and `remainingBlockers=[]`. One docs-only correction allowed for bounded first FIX; second failed review stops. Architect does not issue verdict.

## 18. Independent implementation reviews

After both worktree gates pass exact HEAD, Code review confirms zero production change, stronger exact-byte contract, correct Git raw blob/OID/path/SHA, shell disabled and bounded argv/path/buffer/timeout, no fallback, both worktrees pass, identity unchanged. Rule review confirms no rule semantic change, Catalog audit-only, C1 AST authority unchanged, artifact unchanged, events/roles/night order/impairment/history unchanged, D not started, role coverage unchanged. Closure requires `CODE_REVIEW_PASS`, `RULE_REVIEW_PASS`, `remainingBlockers=[]`. Any later commit invalidates reviews.

## 19. Deferred P2F1R-D boundary

D0 does not close ownership registry publication, global runner totals, coverage routing/profile, hosted Windows/Linux, GitHub exact-head CI, publication review, final Catalog SHA reconciliation, combined A/B/C1/C publication, accepted tag or PR acceptance. Successful local status exactly `LOCAL_TEST_PORTABILITY_FOUNDATION_PASS_PENDING_P2F1R_D_PUBLICATION`; `D0FinalAccepted=false`; `P2F1R-DStarted=false`.

## 20. Stop-Loss and repair accounting

Initial `D0DesignCorrectionRound=0/1`, `D0EvidenceRepairRound=0/2`. First implementation edit consumes 1/2; one bounded Code-review repair may consume 2/2; no third.

Stop immediately if blob/generated differ; difference not checkout-only; OID/SHA/length/artifact changes; Git requires worktree fallback, shell string or untrusted path; title cannot remain; new identity needed without correction; production/generator/artifact/gitattributes/workflow/dependency/ownership/profile/runner change needed; worktrees dirty/different HEAD; gate fails outside mechanism; old dirty worktree unprotected; budget exhausted; review HUMAN_BLOCKED. Do not reinterpret as authority to begin D, CE, C, or P2F.

## 21. Rollback

Rollback is non-history-rewriting revert of only D0 test and D0 implementation documentation commit. It must not modify artifact, regenerate Catalog, modify C1/C, reset/clean any worktree, alter Git config, or rewrite history. Temporary verification worktrees may be removed only after clean verification and never include protected old C. Rollback restores prior failing checkout-dependent test and is not D0 success.

## 22. Frozen impact flags

- `productionFilesChanged`: `0`
- `eventDefinitionsChanged`: `false`
- `semanticValidatorsChanged`: `false`
- `C1AuthorityChanged`: `false`
- `CatalogArtifactChanged`: `false`
- `CatalogExpectedDigestChanged`: `false`
- `testIdentityChanged`: `false`
- `semanticTestInventoryChanged`: `false`
- `ruleSemanticsChanged`: `false`
- `roleCoverageChanged`: `false`
- `acceptedHistoryChanged`: `false`
- `runtimeAuthorityChanged`: `false`
- `coverageExecuted`: `false`
- `ownershipExecuted`: `false`
- `hostedCIExecuted`: `false`
- `P2F1R-DStarted`: `false`
- `implementationAuthorized`: `false`
- `requiredNextAction`: `FRESH_INDEPENDENT_D0_RULE_DESIGN_REVIEW`

READY_FOR_FRESH_INDEPENDENT_D0_RULE_DESIGN_REVIEW_V1
