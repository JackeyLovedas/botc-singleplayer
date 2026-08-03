# Phase 3 Slice 2B20B-P2F1R-D0 Test Traceability

## Metadata

- `sliceId`: `2B20B-P2F1R-D0`
- `implementationBaseHead`: `647b9591fa0ce9b81a7b96240f12e0d2e4d18756`
- `implementationCommitBinding`: `THIS_COMMIT_OBJECT`
- `implementationHeadResolution`: `Resolve the commit that first contains this document and the paired test change with git rev-parse HEAD after commit creation.`
- `sourceDesign`: `docs/architecture/2B20B-P2F1R-D0-catalog-v2-checkout-portability-design-v1.md`
- `sourceDesignSHA256`: `df9da17de6901af4609d6c4edf0386ee3f6a81eedb9e3ae58b83acefbc20b827`
- `designReview`: `docs/architecture/2B20B-P2F1R-D0-catalog-v2-checkout-portability-design-review-v1.md`
- `designReviewSHA256`: `c27ce3926d3abde6f23db5ef4311c53b9b0d2161baa595a4edbda36cbeab68e9`
- `designVerdict`: `RULE_DESIGN_PASS`
- `remainingDesignBlockers`: `[]`
- `ruleEvidence`: `docs/rules/evidence/2B20B-P2F1R-D0.md`
- `ruleEvidenceSHA256`: `928d645e4f20b5e51b33ecb096f0b052cf41249988e626c9e2af6ee616046edf`
- `authorityRecoveryCommit`: `b5adf01e0bcdfb4c05eb8ee08460e00c34ccc595`
- `fixedSourceManifest`: `docs/rules/evidence/2B20B-P2F1R-D0-fixed-source-snapshot-manifest.md`
- `fixedSourceManifestSHA256`: `1f36f3f8b0261ec3fa71e15dd4dd4c1d2b8d79d3e1d2bec267b29e0e7c7d77e4`
- `evidenceBindingCorrection`: `docs/architecture/2B20B-P2F1R-D0-final-source-and-dual-worktree-evidence-binding-correction-v1.md`
- `evidenceBindingCorrectionSHA256`: `3fba716679f208bb5c7ad75e6b04dcf6de473befb28ac0d00243736ff11f250d`
- `dualWorktreeEvidenceManifest`: `docs/implementation/phase-3-slice-2b20b-p2f1r-d0-dual-worktree-evidence-manifest.md`
- `dualWorktreeEvidenceManifestSHA256`: `52f4bde2d3c20efe5e345179fa7e0ae6f1852fd8ec2a6ecd4a64a8c2fb85c060`
- `D0EvidenceRepairRound`: `1/2`
- `D0EvidenceBindingCorrection`: `1/1`
- `FinalBindingStatus`: `PENDING_NEW_DUAL_WORKTREE_EVIDENCE`
- `old4fdEvidenceUsed`: `false`
- `productionFilesChanged`: `0`
- `ruleSemanticsChanged`: `false`
- `roleCoverageChanged`: `false`
- `P2F1R-DStarted`: `false`

`THIS_COMMIT_OBJECT` avoids an impossible self-referential commit hash inside a
file that is itself part of that commit. The controller records and freezes the
resolved exact implementation HEAD immediately after commit creation.

## Frozen artifact evidence

| Fact | Value |
|---|---|
| Repository path | `docs/architecture/2B20B-P2F1R-C1-generated-structural-schema-catalog-v2.md` |
| `HEAD:path` blob OID | `4f9a376e56f19b241d76ce2a75be83b70859ae25` |
| Repository blob byte length | `264855` |
| Repository blob SHA-256 | `e0f788db370eca7ad1d1097f2a271bd9257fb5966d28081c930458d3dea85ef6` |
| Repository blob line endings | `626 LF`, `0 CR` |
| Generated canonical byte length | `264855` |
| Generated canonical SHA-256 | `e0f788db370eca7ad1d1097f2a271bd9257fb5966d28081c930458d3dea85ef6` |
| Default-Windows checkout byte length | `265481` |
| Default-Windows checkout SHA-256 | `7d912c085c61ab34d06c46d0cbfd5f3def8e10465339d608566a73eaf93763b7` |
| Default-Windows checkout line endings | `626 CRLF`, `0 lone LF` |
| Default-Windows checkout classification | `LF_TO_CRLF_CHECKOUT_CONVERSION_ONLY` |
| Catalog runtime authority | `false` |

The C1 typed structural schema AST remains the runtime structural authority.
The Git blob is directly validated test-time audit evidence only. The worktree
representation is diagnostic only and never supplies canonical equality bytes.

## Actual C1-C11 binding candidate

| Field | Actual value |
|---|---|
| `CriterionId` | `C1-C11` |
| `ActualProject` | `domain-core` |
| `ActualTestFile` | `packages/domain-core/src/domain-event-structural-schema-catalog.test.ts` |
| `ActualAncestorPath` | `Catalog V2 audit projection` |
| `ActualTestTitle` | `matches the checked-in frozen generated Catalog V2 path byte-for-byte` |
| `ActualPrimaryLayer` | `PURE_POLICY_SEAM` |
| `ActualReachability` | `R4_FUTURE_HYPOTHETICAL_STATE` |
| `ActualTrust` | `T3_MODULE_PRIVATE_PURE_CORE` |
| `SupportingAuthorityId` | `NONE` |
| `ProductionEntry` | `createFullC1StructuralSchemaAuthority`; `renderGeneratedStructuralSchemaCatalogV2` |
| `MainAssertion` | Generated canonical UTF-8 bytes equal the frozen raw `HEAD:path` Git blob bytes exactly after fixed OID, length, SHA-256, LF census, and BOM checks. |
| `FaultMechanism` | Working-tree LF/CRLF materialization cannot substitute for the checked-in repository object; any Git protocol, OID, object, length, digest, or non-checkout byte difference fails closed. |
| `MechanismMatch` | `FAIL` |

The only final Governance V1.1 values for `MechanismMatch` are `PASS` or `FAIL`.
The current value is `FAIL` because no new dual-worktree execution is bound to
the commit containing the pending evidence manifest. It remains `FAIL` until a
direct documentation-only child E of that source commit records both complete
exact-S worktrees and every frozen gate. No `SUP-*` row or second semantic
criterion is manufactured.

## Implemented evidence mechanism

- Repository root is derived from the fixed test module URL, not ambient cwd.
- Git runs through `spawnSync` with fixed executable and argv, `shell:false`,
  ignored stdin, `windowsHide:true`, raw Buffer output, a 1 MiB ceiling, and a
  30 second timeout.
- `rev-parse` accepts only 40 lowercase hexadecimal bytes plus one exact LF or
  CRLF framing newline; broad trimming is absent.
- The resolved OID must equal the frozen expected OID before raw blob access.
- `cat-file blob` reads the frozen OID as raw bytes; there is no worktree
  fallback, decoding, normalization, filtering, or rewriting.
- Stable failures do not reflect raw stderr or artifact content.
- Generated canonical bytes and repository blob bytes receive independent
  length, SHA-256, line-ending, BOM, and exact Buffer-equality assertions.
- A lockstep diagnostic classifier accepts exact checkout bytes or the sole
  LF-to-CRLF conversion and rejects every other difference.
- The suite, title, test file, project, and 21-test inventory remain unchanged.

## Historical focused local evidence — not final binding

- `historicalHead`: `4fd7d880cb5da8034e12da71b58b0ad519e9dec1`
- `old4fdEvidenceUsed`: `false`
- `node`: `v24.15.0`
- `pnpm`: `11.7.0`
- `core.autocrlf`: `true`, source `C:/Program Files/Git/etc/gitconfig`
- `git ls-files --eol`: `i/lf w/crlf`
- command: `corepack pnpm exec vitest run --workspace vitest.workspace.ts packages/domain-core/src/domain-event-structural-schema-catalog.test.ts --reporter=dot`
- result: `PASS`
- test files: `1/1 passed`
- tests: `21/21 passed`
- observed checkout classification: `LF_TO_CRLF_CHECKOUT_CONVERSION_ONLY`

## Pending evidence and authority boundary

The pending dual-worktree manifest is bound by
`bindingKind=COMMIT_CONTAINING_THIS_MANIFEST`. The controller has not executed
the required clean detached default-Windows and LF worktrees at that new source
commit. Focused `21/21`, domain-core `503/503`, typecheck, lint, and full
ordinary `40 files / 1712 tests` therefore remain pending for final binding.
Only a direct documentation-only child E may record those actual results.
Hosted CI, coverage, ownership, publication, PR, merge, tag, and P2F1R-D
closure remain outside D0 and unclaimed.

No production file, Catalog artifact, C1 authority, event definition, semantic
validator, replay, batch, snapshot, state, application, role, night order,
impairment rule, accepted-history authority, or role-coverage status changes.
