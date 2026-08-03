# Phase 3 Slice 2B20B-P2F1R-CE Final Dual-Worktree Evidence Manifest

## Non-self-referential binding

- `manifestStatus`: `FINAL_EVIDENCE_MATERIALIZED_PENDING_INDEPENDENT_FINAL_REVIEW`
- `bindingKind`: `COMMIT_CONTAINING_THIS_MANIFEST`
- `expectedParent`: `34c60205cecad2c4c7885531f4f8805ef1355478`
- `H`: `34c60205cecad2c4c7885531f4f8805ef1355478`
- `gatesExecutedAt`: `34c60205cecad2c4c7885531f4f8805ef1355478`
- `evidenceSourceHead`: `34c60205cecad2c4c7885531f4f8805ef1355478`
- `manifestChildExecutedGates`: `false`
- `manifestChildDoesNotImpersonateExecutedHead`: `true`
- `CFinalAccepted`: `false`
- `coverageExecuted`: `false`
- `ownershipExecuted`: `false`
- `hostedCIExecuted`: `false`
- `P2F1RDExecuted`: `false`
- `SupportingAuthorityId`: `NONE`

`H` is the immutable source commit at which every gate below ran. The commit
containing this manifest must be the direct docs-only child of `H`; it binds
the external evidence without naming or hashing itself and does not claim that
its own tree executed any gate.

## Evidence source and immutable identities

- External evidence directory:
  `C:\Users\wjl\AppData\Local\Temp\botc-ce-final-evidence-20260803-135916`.
- `paths.json`, `default-results.json`, `lf-results.json`,
  `final-summary.json`, and all 18 final logs were read and hash-checked.
- `paths.json`: `371` bytes; SHA-256
  `f367a1976a87f79b63454e21e10d34cfa56c3bf59d495eddf8b290a1da3b0eb6`.
- `default-results.json`: `3000` bytes; SHA-256
  `c92f06a8e0c8debd16ada6c66d709945ec1734b1012393594957383e0246423a`.
- `lf-results.json`: `2960` bytes; SHA-256
  `b29743f27acf221129ae9b3a424f0b059dd092e0477c31d25632cff914313654`.
- `final-summary.json`: `5780` bytes; SHA-256
  `e399d3e70eb765e98dc1bb0196c7c0575045155cadce6cde1c4d62a3bdeb74bd`.
- Source tree at `H`: `402b7ec7fed53602b1be584cb2976c79c63f15a9`.
- `packages` tree at `H`: `3d5efd704cc55955f302d7d71533303ccabf61a0`.
- Validator test blob at `H`: `64f4ddc7f5c319dce5fed6497ed96e533c2aede9`.
- Catalog test blob at `H`: `5047e1745799c7fbbb5b35c7d2642e17ae394fe9`.
- Static verifier blob at `H`: `56fa17f50f95fc7320db8055f2d556a2d174fd8f`.
- Static self-test blob at `H`: `b9630d57e36a8bc57bbd935481ae29c9a2f80872`.
- Catalog artifact blob OID:
  `4f9a376e56f19b241d76ce2a75be83b70859ae25`.
- Catalog raw/generated length: `264855` bytes.
- Catalog raw/generated SHA-256:
  `e0f788db370eca7ad1d1097f2a271bd9257fb5966d28081c930458d3dea85ef6`.
- Catalog runtime authority: `false`.
- Node: `v24.15.0`.
- pnpm: `11.7.0`.
- Git: `git version 2.54.0.windows.1`.

The manifest child is allowed to change only the three CE documentation files.
It must retain the exact `packages` tree, validator/Catalog test blobs and
static-verifier blobs above. Production, tests, titles and all frozen censuses
therefore remain source-identity facts of `H`, not claims derived from the
docs-only child.

## Commands represented by the evidence

1. `corepack pnpm install --frozen-lockfile`
2. `node scripts/verify-p2f1r-c-static-diagnostic-bindings.test.mjs`
3. `node scripts/verify-p2f1r-c-static-diagnostic-bindings.mjs`
4. `corepack pnpm exec vitest run --workspace vitest.workspace.ts packages/domain-core/src/domain-event-structural-validator.test.ts`
5. `corepack pnpm exec vitest run --workspace vitest.workspace.ts packages/domain-core/src/domain-event-structural-schema-catalog.test.ts`
6. `corepack pnpm exec vitest run --workspace vitest.workspace.ts --project domain-core`
7. `corepack pnpm typecheck`
8. `corepack pnpm lint`
9. `corepack pnpm test`

## Default-Windows evidence

- `EvidenceId`: `CE-DEFAULT-34c60205-20260803T140004+0800`
- `worktree`:
  `C:\Users\wjl\AppData\Local\Temp\botc-ce-final-default-20260803-135916`
- before/after HEAD: `34c60205cecad2c4c7885531f4f8805ef1355478`.
- before/after porcelain count: `0 / 0`.
- Catalog `git ls-files --eol`: `i/lf w/crlf`.
- Catalog checkout length: `265481` bytes.
- Catalog checkout SHA-256:
  `7d912c085c61ab34d06c46d0cbfd5f3def8e10465339d608566a73eaf93763b7`.
- Classification: `LF_TO_CRLF_CHECKOUT_CONVERSION_ONLY`.
- Catalog blob/raw/generated identities: exact frozen match.

| Gate | Result | Start | End | Exit | Log SHA-256 |
|---|---|---|---|---:|---|
| Static verifier self-test | `PASS; 12/12 mutants rejected; 16 mapped` | `2026-08-03T14:00:04.7739292+08:00` | `2026-08-03T14:00:05.1812427+08:00` | 0 | `c9e17469286adea612193571831c7657682ae34de9203a5969decf1089b89f34` |
| Static real-source audit | `PASS; 16 mapped; seven failure counters zero; 25 branch occurrences` | `2026-08-03T14:00:05.2013487+08:00` | `2026-08-03T14:00:05.4519713+08:00` | 0 | `eaef6e895798284fc9fbc0af9b87b858624a29f08d431b43d9f1322055457d07` |
| Validator focused | `1 file / 28 tests PASS` | `2026-08-03T14:00:05.4529718+08:00` | `2026-08-03T14:00:07.6343342+08:00` | 0 | `87d41cc7f7432515c49a03716234f02729e4d1696385749f6a9cd97642ec1a49` |
| Catalog focused | `1 file / 21 tests PASS` | `2026-08-03T14:00:07.6343342+08:00` | `2026-08-03T14:00:09.7380033+08:00` | 0 | `401b75c1c32d997813ba0197939f422abe0475aa55547c2f1e5115d19a13a1b7` |
| Domain-core | `20 files / 503 tests PASS` | `2026-08-03T14:00:09.7390035+08:00` | `2026-08-03T14:00:14.2664037+08:00` | 0 | `bed1b020381343dde01f13f52c4fd6a88c6983258e2af69330f5bf5cc91c552c` |
| Typecheck | `PASS` | `2026-08-03T14:00:14.2664037+08:00` | `2026-08-03T14:00:20.4130713+08:00` | 0 | `27c0b657698585b8fd0bd9c0bb7116aa1748caef1957cc92014434c3019d923e` |
| Lint | `PASS; zero lint diagnostics` | `2026-08-03T14:00:20.4140705+08:00` | `2026-08-03T14:00:33.2353915+08:00` | 0 | `7cf19deae9d646769efdf0a0d25e57bbed67af30e1853e68559ee41ff561d5a8` |
| Full ordinary | `40 files / 1712 tests PASS` | `2026-08-03T14:00:33.2353915+08:00` | `2026-08-03T14:01:28.6693398+08:00` | 0 | `c1d8e5dbca7e1965c5bf81545127aa8dca31b17e2fa78f7837d498afa5b736ba` |

Dependency installation log: `default-install.log`, `2038` bytes,
SHA-256 `60515ec03f58c94686e6529fbacff1635385aae1f001f1fcb52bee401357eac6`;
it records frozen-lockfile reuse and pnpm `11.7.0` completion.

## LF evidence

- `EvidenceId`: `CE-LF-34c60205-20260803T140153+0800`
- `worktree`:
  `C:\Users\wjl\AppData\Local\Temp\botc-ce-final-lf-20260803-135916`
- checkout creation override: command-scoped, nonpersistent
  `core.autocrlf=false`, `core.eol=lf`.
- before/after HEAD: `34c60205cecad2c4c7885531f4f8805ef1355478`.
- before/after porcelain count: `0 / 0`.
- Catalog `git ls-files --eol`: `i/lf w/lf`.
- Catalog checkout length: `264855` bytes.
- Catalog checkout SHA-256:
  `e0f788db370eca7ad1d1097f2a271bd9257fb5966d28081c930458d3dea85ef6`.
- Classification: `MATCHES_REPOSITORY_BLOB`.
- Catalog blob/raw/generated identities: exact frozen match.

| Gate | Result | Start | End | Exit | Log SHA-256 |
|---|---|---|---|---:|---|
| Static verifier self-test | `PASS; 12/12 mutants rejected; 16 mapped` | `2026-08-03T14:01:53.5083161+08:00` | `2026-08-03T14:01:53.8900681+08:00` | 0 | `c9e17469286adea612193571831c7657682ae34de9203a5969decf1089b89f34` |
| Static real-source audit | `PASS; 16 mapped; seven failure counters zero; 25 branch occurrences` | `2026-08-03T14:01:53.9081937+08:00` | `2026-08-03T14:01:54.1422060+08:00` | 0 | `eaef6e895798284fc9fbc0af9b87b858624a29f08d431b43d9f1322055457d07` |
| Validator focused | `1 file / 28 tests PASS` | `2026-08-03T14:01:54.1432067+08:00` | `2026-08-03T14:01:56.2633301+08:00` | 0 | `536b69dd642091e3fe9020e77e9846f231527175e85a9eaa1e2d6371b43ed9b9` |
| Catalog focused | `1 file / 21 tests PASS` | `2026-08-03T14:01:56.2633301+08:00` | `2026-08-03T14:01:58.3640262+08:00` | 0 | `3d3870685e1f56c52de51304520b04b5845ee288e8b9a37b3ff35d54445a3084` |
| Domain-core | `20 files / 503 tests PASS` | `2026-08-03T14:01:58.3640262+08:00` | `2026-08-03T14:02:02.9054249+08:00` | 0 | `80515048cbe7307786cc30b8d561ecd38cab0a2a04a7301486c70846216bfc03` |
| Typecheck | `PASS` | `2026-08-03T14:02:02.9054249+08:00` | `2026-08-03T14:02:08.9571281+08:00` | 0 | `a36a5a95278ecce08975e33ccdc3e92f5223fe95383282eed9b2f6f560ccfbf1` |
| Lint | `PASS; zero lint diagnostics` | `2026-08-03T14:02:08.9581276+08:00` | `2026-08-03T14:02:22.3651439+08:00` | 0 | `c9f4ee63d09ce42e96914f8a6ecdda0258bc38d5d41c1561829832637a3d21b9` |
| Full ordinary | `40 files / 1712 tests PASS` | `2026-08-03T14:02:22.3651439+08:00` | `2026-08-03T14:03:18.2784552+08:00` | 0 | `ef775a13c4968c4866869e6c46b84b78dcb0a09b838987f3557a78c38302f9a6` |

Dependency installation log: `lf-install.log`, `1152` bytes, SHA-256
`82c003610b9240edb114fac9743db3f115cf238b93e76fb4a579c52725e70c87`;
it records frozen-lockfile reuse and pnpm `11.7.0` completion.

## Complete final-log inventory

| Log | Bytes | SHA-256 |
|---|---:|---|
| `default-install.log` | 2038 | `60515ec03f58c94686e6529fbacff1635385aae1f001f1fcb52bee401357eac6` |
| `default-static-selftest.log` | 110 | `c9e17469286adea612193571831c7657682ae34de9203a5969decf1089b89f34` |
| `default-static-audit.log` | 6976 | `eaef6e895798284fc9fbc0af9b87b858624a29f08d431b43d9f1322055457d07` |
| `default-validator-focused.log` | 2626 | `87d41cc7f7432515c49a03716234f02729e4d1696385749f6a9cd97642ec1a49` |
| `default-catalog-focused.log` | 2612 | `401b75c1c32d997813ba0197939f422abe0475aa55547c2f1e5115d19a13a1b7` |
| `default-domain-core.log` | 9504 | `bed1b020381343dde01f13f52c4fd6a88c6983258e2af69330f5bf5cc91c552c` |
| `default-typecheck.log` | 750 | `27c0b657698585b8fd0bd9c0bb7116aa1748caef1957cc92014434c3019d923e` |
| `default-lint.log` | 734 | `7cf19deae9d646769efdf0a0d25e57bbed67af30e1853e68559ee41ff561d5a8` |
| `default-full-ordinary.log` | 55722 | `c1d8e5dbca7e1965c5bf81545127aa8dca31b17e2fa78f7837d498afa5b736ba` |
| `lf-install.log` | 1152 | `82c003610b9240edb114fac9743db3f115cf238b93e76fb4a579c52725e70c87` |
| `lf-static-selftest.log` | 110 | `c9e17469286adea612193571831c7657682ae34de9203a5969decf1089b89f34` |
| `lf-static-audit.log` | 6976 | `eaef6e895798284fc9fbc0af9b87b858624a29f08d431b43d9f1322055457d07` |
| `lf-validator-focused.log` | 2616 | `536b69dd642091e3fe9020e77e9846f231527175e85a9eaa1e2d6371b43ed9b9` |
| `lf-catalog-focused.log` | 2604 | `3d3870685e1f56c52de51304520b04b5845ee288e8b9a37b3ff35d54445a3084` |
| `lf-domain-core.log` | 9494 | `80515048cbe7307786cc30b8d561ecd38cab0a2a04a7301486c70846216bfc03` |
| `lf-typecheck.log` | 750 | `a36a5a95278ecce08975e33ccdc3e92f5223fe95383282eed9b2f6f560ccfbf1` |
| `lf-lint.log` | 734 | `c9f4ee63d09ce42e96914f8a6ecdda0258bc38d5d41c1561829832637a3d21b9` |
| `lf-full-ordinary.log` | 58608 | `ef775a13c4968c4866869e6c46b84b78dcb0a09b838987f3557a78c38302f9a6` |

## Transcript disclosure

The PowerShell capture wrapper renders stderr-written pnpm banners and the
Vitest workspace deprecation notice as `NativeCommandError` transcript records.
This is preserved in the hashed logs. It is not hidden or reclassified: every
corresponding `default-results.json` and `lf-results.json` gate has exact exit
code `0`; TypeScript and ESLint report no diagnostic; Vitest reports the exact
passing file/test counts above.

## Frozen behavior and census result

- Both evidence worktrees are clean and resolve exact `H`: `PASS`.
- Production diff from the implementation base: `0`.
- Production hashes remain the three `FROZEN_C_BEHAVIOR_SOURCE_V1` values.
- Test/suite/title change: `0`; AP1 remains 28 unique identities, SHA-256
  `dc7acb226c45a39932ebf27c3928e1ad9a51566172221071470b2ea4bd43e720`.
- Event/payload/AST census remains `40 / 59 / 15`.
- Diagnostic census remains `47 / 34 / 19 / 31 / 16`.
- Traceability census remains `33 / 5 / 28`; primary bindings are unchanged.
- Catalog raw/generated identity and audit-only status are unchanged.
- Protected old worktree remains its distinct branch and HEAD with all `11/11`
  dirty paths and all 11 recorded SHA-256 values intact.

## Current disposition

The dual-worktree evidence materialization is complete for `H`, but no final
review verdict is inferred here. Status is
`PENDING_FRESH_INDEPENDENT_FINAL_REVIEW`; `CFinalAccepted=false`. Coverage,
ownership, hosted CI and P2F1R-D remain explicitly deferred.
