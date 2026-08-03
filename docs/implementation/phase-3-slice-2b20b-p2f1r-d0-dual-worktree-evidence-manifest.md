# Phase 3 Slice 2B20B-P2F1R-D0 dual-worktree evidence manifest

## Binding metadata

- `sliceId`: `2B20B-P2F1R-D0`
- `manifestStatus`: `PENDING_NEW_DUAL_WORKTREE_EVIDENCE`
- `bindingKind`: `COMMIT_CONTAINING_THIS_MANIFEST`
- `expectedParent`: `b5adf01e0bcdfb4c05eb8ee08460e00c34ccc595`
- `sourceManifest`: `docs/rules/evidence/2B20B-P2F1R-D0-fixed-source-snapshot-manifest.md`
- `sourceManifestSHA256`: `1f36f3f8b0261ec3fa71e15dd4dd4c1d2b8d79d3e1d2bec267b29e0e7c7d77e4`
- `bindingCorrection`: `docs/architecture/2B20B-P2F1R-D0-final-source-and-dual-worktree-evidence-binding-correction-v1.md`
- `bindingCorrectionSHA256`: `3fba716679f208bb5c7ad75e6b04dcf6de473befb28ac0d00243736ff11f250d`
- `traceability`: `docs/implementation/phase-3-slice-2b20b-p2f1r-d0-test-traceability.md`
- `old4fdEvidenceUsed`: `false`
- `executionPerformedForThisManifest`: `false`
- `SupportingAuthorityId`: `NONE`

This is a pending template in source commit `S`. It records no new execution
result. The earlier dual-worktree records for `4fd7d880...` are historical and
must not be copied into final binding fields.

## Commit topology contract

- `S`: resolve the commit containing this manifest after creation.
- `SParentRequired`: `b5adf01e0bcdfb4c05eb8ee08460e00c34ccc595`.
- `ERequiredParent`: exact resolved `S`.
- `ERequiredTopology`: `DIRECT_DOCS_ONLY_CHILD_OF_S`.
- `EAllowedPurpose`: bind actual clean dual-worktree execution at exact `S` and
  change traceability only if the recorded mechanism matches.
- `EForbiddenChanges`: production, tests, Catalog artifact, rules, role matrix,
  workflow, dependency, package scripts, coverage, ownership, Git settings, or
  any behavior/design expansion.

## Frozen Catalog and production identities

| Item | Frozen value |
|---|---|
| Catalog repository path | `docs/architecture/2B20B-P2F1R-C1-generated-structural-schema-catalog-v2.md` |
| Catalog Git blob OID | `4f9a376e56f19b241d76ce2a75be83b70859ae25` |
| Catalog raw blob bytes | `264855` |
| Catalog raw blob SHA-256 | `e0f788db370eca7ad1d1097f2a271bd9257fb5966d28081c930458d3dea85ef6` |
| Generated Catalog bytes | `264855` |
| Generated Catalog SHA-256 | `e0f788db370eca7ad1d1097f2a271bd9257fb5966d28081c930458d3dea85ef6` |
| Catalog raw line endings | `626 LF`, `0 CR`, no BOM |
| Catalog runtime authority | `false` |
| Structural AST blob OID | `477d3d787c9c4ca671547914b7349f19dd21e85c` |
| Catalog renderer blob OID | `fe610239ed0a06202925ceabbeb980c37ba6d9d3` |
| Canonical event blob OID | `ea28ae4b665a69766d4aa011776fc3580977c63d` |
| Structural validator blob OID | `363bd8db4e3ca296bbe26df9cf7d14737056de70` |
| Domain-core index blob OID | `e6e6878254d9809fb402c22cbc94e72c5172f774` |
| Canonical event Git-blob SHA-256 | `41020fbbc0cc23194c565c2b0ace5ce907942e86204e8373b29449a94b07a5b3` |
| Structural validator Git-blob SHA-256 | `a7d7cd0294c877317ba35957f957859fda586c459aeec40a361fb8853d1531e6` |
| Domain-core index Git-blob SHA-256 | `ac142d2c83a77c73aae244dc2bd3d6da9e7f01ca923fff4d22139ed10c024353` |

## Frozen commands and expected counts

Run each command independently in both clean detached worktrees at exact `S`:

1. Focused Catalog:
   `corepack pnpm exec vitest run --workspace vitest.workspace.ts packages/domain-core/src/domain-event-structural-schema-catalog.test.ts --reporter=dot`
2. Domain-core project:
   `corepack pnpm exec vitest run --workspace vitest.workspace.ts --project domain-core --reporter=dot`
3. Typecheck: `corepack pnpm typecheck`
4. Lint: `corepack pnpm lint`
5. Full ordinary suite: `corepack pnpm test`

| Gate | Frozen expected result | Actual at S |
|---|---|---|
| Focused Catalog | `21/21 PASS` | `PENDING_NOT_EXECUTED` |
| Domain-core project | `503/503 PASS` | `PENDING_NOT_EXECUTED` |
| Typecheck | `PASS` | `PENDING_NOT_EXECUTED` |
| Lint | `PASS` | `PENDING_NOT_EXECUTED` |
| Full ordinary suite | `40 files / 1712 tests PASS` | `PENDING_NOT_EXECUTED` |

Coverage, ownership, hosted CI, workflow reruns, and P2F1R-D gates are outside
this manifest and must not be run or claimed for S.

## Default-Windows worktree record — pending

- `worktreeKind`: `DEFAULT_WINDOWS`
- `creationPolicy`: ordinary clean detached worktree; no configuration mutation
- `requiredExactHead`: `RESOLVED_S_COMMIT`
- `beforeStatus`: `PENDING`
- `afterStatus`: `PENDING`
- `beforeHead`: `PENDING`
- `afterHead`: `PENDING`
- `nodeVersion`: `PENDING`
- `pnpmVersion`: `PENDING`
- `coreAutocrlfValueAndSource`: `PENDING`
- `gitLsFilesEol`: expected `i/lf w/crlf`; actual `PENDING`
- `checkoutBytes`: expected `265481`; actual `PENDING`
- `checkoutSHA256`: expected `7d912c085c61ab34d06c46d0cbfd5f3def8e10465339d608566a73eaf93763b7`; actual `PENDING`
- `checkoutClassification`: expected `LF_TO_CRLF_CHECKOUT_CONVERSION_ONLY`; actual `PENDING`
- `catalogBlobOID`: expected `4f9a376e56f19b241d76ce2a75be83b70859ae25`; actual `PENDING`
- `catalogRawSHA256`: expected `e0f788db370eca7ad1d1097f2a271bd9257fb5966d28081c930458d3dea85ef6`; actual `PENDING`
- `generatedCatalogSHA256`: expected `e0f788db370eca7ad1d1097f2a271bd9257fb5966d28081c930458d3dea85ef6`; actual `PENDING`
- `focusedResult`: `PENDING`
- `domainCoreResult`: `PENDING`
- `typecheckResult`: `PENDING`
- `lintResult`: `PENDING`
- `fullOrdinaryResult`: `PENDING`
- `frozenProductionIdentityMatch`: `PENDING`

## LF worktree record — pending

- `worktreeKind`: `LF`
- `creationPolicy`: `git -c core.autocrlf=false -c core.eol=lf worktree add --detach <path> <resolved-S>`; command-scoped only
- `requiredExactHead`: `RESOLVED_S_COMMIT`
- `beforeStatus`: `PENDING`
- `afterStatus`: `PENDING`
- `beforeHead`: `PENDING`
- `afterHead`: `PENDING`
- `nodeVersion`: `PENDING`
- `pnpmVersion`: `PENDING`
- `coreAutocrlfValueAndSource`: `PENDING`
- `gitLsFilesEol`: expected `i/lf w/lf`; actual `PENDING`
- `checkoutBytes`: expected `264855`; actual `PENDING`
- `checkoutSHA256`: expected `e0f788db370eca7ad1d1097f2a271bd9257fb5966d28081c930458d3dea85ef6`; actual `PENDING`
- `checkoutClassification`: expected `MATCHES_REPOSITORY_BLOB`; actual `PENDING`
- `catalogBlobOID`: expected `4f9a376e56f19b241d76ce2a75be83b70859ae25`; actual `PENDING`
- `catalogRawSHA256`: expected `e0f788db370eca7ad1d1097f2a271bd9257fb5966d28081c930458d3dea85ef6`; actual `PENDING`
- `generatedCatalogSHA256`: expected `e0f788db370eca7ad1d1097f2a271bd9257fb5966d28081c930458d3dea85ef6`; actual `PENDING`
- `focusedResult`: `PENDING`
- `domainCoreResult`: `PENDING`
- `typecheckResult`: `PENDING`
- `lintResult`: `PENDING`
- `fullOrdinaryResult`: `PENDING`
- `frozenProductionIdentityMatch`: `PENDING`

## Final binding state

- `allRequiredFieldsComplete`: `false`
- `bothWorktreesExactSAndClean`: `PENDING`
- `allCommandsPass`: `PENDING`
- `catalogAndProductionIdentitiesMatch`: `PENDING`
- `MechanismMatchCandidate`: `FAIL`
- `FinalBindingStatus`: `PENDING_NEW_DUAL_WORKTREE_EVIDENCE`

No field in this template is evidence that execution occurred. Only E, as the
direct documentation-only child of S, may replace pending actual fields with
observed results and rebind traceability.
