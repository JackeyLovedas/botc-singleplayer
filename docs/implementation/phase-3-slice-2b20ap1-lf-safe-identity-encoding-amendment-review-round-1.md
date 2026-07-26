reviewedHead: `609b01d352c194424c778fcb7013a868cc768af8`

reviewTimestamp: `2026-07-26T09:44:00.542Z`

reviewScope: `Independent read-only 2B20AP1-LF1 Design Amendment Review; combined Round 3 plus LF-safe amendment only; not Design Round 4`

filesReviewed:

- User authorization attachment `pasted-text.txt`, complete 971 lines.
- `AGENTS.md`; `project-handoff/00-README-FIRST.md` and its ordered handoff chain.
- `docs/agent-loop/AUTOPILOT_PROMPT.md`
- `docs/agent-loop/REVIEW_PROTOCOL.md`
- `docs/agent-loop/CURRENT_TASK.md`
- `docs/agent-loop/PROJECT_STATE.md`
- `docs/agent-loop/AUTOPILOT_STATE.json`
- `docs/agent-loop/AUTOPILOT_LOG.md`
- `docs/architecture/2B20AP1-go-no-go-under-governance-v1.md`
- `docs/implementation/phase-3-slice-2b20ap1-design.md`
- `docs/implementation/phase-3-slice-2b20ap1-design-round-2.md`
- `docs/implementation/phase-3-slice-2b20ap1-design-round-3.md`
- All three Round 3 design-review archives.
- `docs/implementation/phase-3-slice-2b20ap1-frozen-raw-inventory-conflict-triage.md`
- `docs/implementation/phase-3-slice-2b20ap1-lf-safe-identity-encoding-amendment-v1.md`
- `docs/implementation/phase-3-slice-2b20a-status.md`
- `docs/implementation/phase-3-slice-2b20a-test-traceability.md`
- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/evidence/2B20A.md`
- `docs/rules/evidence/2B20A-resolved.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `scripts/vitest-ownership-contracts.mjs`
- `scripts/verify-vitest-ownership-contracts.mjs`
- `scripts/verify-vitest-coverage-groups.mjs`
- `scripts/verify-vitest-windows-application-groups.mjs`
- `vitest.workspace.ts`
- `.github/workflows/ci.yml`
- `package.json`, `pnpm-lock.yaml`
- Installed Vitest 3.2.4 collection/task types and CLI JSON-list formatter.
- `packages/application/src/mathematician-information.test.ts`
- `packages/application/src/game-application-service.test.ts`
- `packages/domain-core/src/rebuild.test.ts`

evidenceReviewed:

- Branch is clean at the exact expected HEAD.
- Amendment SHA-256 is exactly `8afd177afb888a55f5482cb633207d974f79248d968c99d70651ee112c274b20`.
- `HEAD^..HEAD` changes only the amendment and four control files; no script, workflow, package, production, or test file changed.
- One permitted read-only Vitest inventory execution found exactly `1572` identities, including `12` names containing LF and `0` containing CR. All 12 belong to project `application`, file `packages/application/src/mathematician-information.test.ts`, and contain two LF code points.
- The mathematician test blob is byte-identical to accepted head `5a69c90`; the LF titles were not changed.
- Vitest’s built-in JSON list shape is exactly `{file,name,projectName}` and `name` is the flattened `fullName`. Installed public task APIs expose `TestCase.name`, parent suites, module children, and `collectTests`, so a single-execution structured collector is technically feasible.
- All seven pinned Chinese sources were live and byte-matched their recorded hashes, including [筑梦师](https://clocktower-wiki.gstonegames.com/index.php?title=筑梦师&oldid=3046&action=raw), [哲学家](https://clocktower-wiki.gstonegames.com/index.php?title=哲学家&oldid=5125&action=raw), [数学家](https://clocktower-wiki.gstonegames.com/index.php?title=数学家&oldid=6442&action=raw), and [涡流](https://clocktower-wiki.gstonegames.com/index.php?title=涡流&oldid=6198&action=raw).
- All seven pinned official Wiki sources were live and byte-matched their recorded hashes, including [Dreamer](https://wiki.bloodontheclocktower.com/index.php?title=Dreamer&oldid=2904&action=raw), [Philosopher](https://wiki.bloodontheclocktower.com/index.php?title=Philosopher&oldid=2421&action=raw), [Mathematician](https://wiki.bloodontheclocktower.com/index.php?title=Mathematician&oldid=3109&action=raw), and [Vortox](https://wiki.bloodontheclocktower.com/index.php?title=Vortox&oldid=3017&action=raw).
- The pinned [official nightsheet](https://raw.githubusercontent.com/ThePandemoniumInstitute/botc-release/915347e627c3f6cd1f438f82b6001784e11b3e8b/resources/data/nightsheet.json) remains 2,923 bytes with SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`; first-night positions remain Philosopher `14`, Dreamer `61`, Mathematician `77`.
- Dreamer, Philosopher, and Mathematician remain `PARTIAL`; Vortox remains `NOT_STARTED`; no role becomes `COMPLETE`.
- No product tests, coverage, hosted CI, or Windows run/verify command was executed.

findings:

1. `HIGH / BLOCKER — discovery provenance is not frozen to one execution`

   - file/symbol: `phase-3-slice-2b20ap1-lf-safe-identity-encoding-amendment-v1.md §4`, conflicting with `phase-3-slice-2b20ap1-design-round-3.md` Candidate-baseline CLI and Local gates.
   - failure scenario: Round 3 still mandates an external `vitest list --json=<inventory>` execution followed by a separate candidate CLI consuming that raw file. The amendment requires raw and structured identities from the same discovery execution but does not replace the exact command/artifact contract. An implementer could collect structured identities in a second process, violating the same-execution requirement, or choose incompatible CLI behavior. Top-level/generated discovery could differ between executions, defeating the intended raw/structured provenance proof.
   - required correction: freeze one exact discovery flow, including command, CLI arguments, artifact shape, and ownership of collection. It must collect once, derive both the raw projection and structured tuple multiset from that task graph, compare them there, and feed the verified structured tuples into emit/verify. Reconcile or explicitly replace Round 3’s external raw-only `--inventory` gate.
   - required regression tests: assert one collector invocation; prove raw and structured outputs derive from the same task objects; all 1,572 identities and 12 LF identities match; unavailable structure returns `VITEST_STRUCTURED_IDENTITY_SOURCE_UNAVAILABLE`; injected multiplicity/value mismatch returns `VITEST_RAW_STRUCTURED_IDENTITY_MISMATCH`; no test callback executes; no project/process group is added.

2. `HIGH / BLOCKER — candidate artifact schema remains contradictory and under-specified`

   - file/symbol: amendment §6 versus Round 3 Candidate-baseline CLI exact v1 output schema.
   - failure scenario: Round 3 requires exactly `{schemaVersion,contractId,inventorySha256,traceabilitySha256,frozenBaseline}`. The amendment additionally requires every accepted contract ID and complete baseline, `identityEncodingVersion`, and exact structured count, but supplies no replacement schema, key order, collection ordering, schema version, strict-validation contract, or explicit round-trip representation rule. Preserving v1 omits amendment-mandated evidence; adding ad hoc fields breaks the previously frozen exact-byte verifier and permits divergent implementations.
   - required correction: freeze the complete replacement candidate schema and version, exact key/nesting order, accepted-contract order, baseline-key order, encoding-version literal, structured-count field, and strict extra/missing/duplicate rejection. State whether canonical tuples are embedded in the candidate/inventory artifact; if not, define precisely which persistent structured JSON artifact supplies the required tuple round trip. Emit and verify must recompute and validate every recorded accepted baseline, count, and LF-safe hash.
   - required regression tests: exact v2 key-set/order and schema-version checks; altered/omitted/duplicate accepted contract rejection; altered accepted hash/count/encoding-version rejection; strict structured tuple parse/field equality; all 12 LF tuples round-trip; repeated emission byte-identical; any bridge field rejected because no bridge applies.

15-point amendment audit:

1. LF is legal Vitest metadata: `PASS`.
2. Amendment is bounded to identity encoding/framing: `PASS`.
3. LF-related title changes: `PASS — none`.
4. Semantic identity remains `[project,file,ancestorPath,title]`: `PASS`.
5. JSON tuple encoding is injective/unambiguous: `PASS`.
6. LF/CR/CRLF and other listed code points are lossless under exact JSON semantics: `PASS`.
7. Raw-code-unit sort plus UTF-8 compact JSON and terminal LF is cross-platform deterministic: `PASS`.
8. Accepted hashes are not rewritten: `PASS`.
9. Credible dual-hash bridge when required: `PASS — no accepted migration is required`.
10. All 12 live LF identities are encodable/round-trippable by the specified tuple format: `PASS`.
11. No new Vitest project/process group: `PASS in scope`, but the exact single-execution route requires Finding 1’s correction.
12. No profile, timeout, or dependency change: `PASS`.
13. Round 3 supersession, ownership, traceability, and routing semantics remain intact: `PASS`.
14. Future implementation allowlist is bounded and excludes the mathematician title source: `PASS`.
15. Candidate gate is implementation-ready: `FIX_REQUIRED` due Findings 1–2.

LFIdentityCount: `12`

titleChangeAudit:

- `amendmentCommitTestFilesChanged=false`
- `lfSourceBlobMatchesAcceptedHead=true`
- `lfTitlesChanged=false`
- `mathematicianInformationTestAuthorizedForFutureEdit=false`

legacyHashAudit:

- `projectInventorySha256`: stored historical authority literal; no migration or rewrite.
- `semanticInventorySha256`: legacy tab/LF representation over registered ownership inventories; the 12 LF identities are outside those inventories.
- `currentProjectInventorySha256`: same conclusion.
- `authorityInventorySha256`: marker strings only; unaffected.
- `nonMarkerOwnershipSha256`: restricted to registered `applicationTestFile` paths; mathematician LF identities are outside that file set.
- `physicalTestFileSetSha256`: file paths only; title LF cannot affect it.
- Existing A3A, A3B1, A3B2, and B19B baseline objects must remain byte-identical.
- `legacyHashesChanged=false`
- `acceptedInventoryMigrationRequired=false`

dualHashBridgeRequired: `false`

topologyAudit:

- `ordinaryProjects=9`
- `coverageProjects=11`
- `windowsGroups=W1–W7`
- `projectAdded=false`
- `processGroupAdded=false`
- `coverageProfileChanged=false`
- `timeoutChanged=false`
- `dependencyChanged=false`
- `workflowChangedByAmendment=false`
- Static topology remains the reviewed Round 3 topology; no CI execution was authorized.

allowlistAudit:

- The listed future allowlist is bounded to three infrastructure scripts, CI routing, the already-reviewed application/rebuild title migrations, traceability, and four control files.
- `packages/application/src/mathematician-information.test.ts` is correctly excluded.
- No production source, new script, new test file, dependency, project, or process group is authorized.
- The two required design corrections are docs-only and remain within the user-authorized LF amendment correction budget.

remainingBlockers:

- `LF1-SAME-DISCOVERY-CONTRACT`
- `LF2-CANDIDATE-SCHEMA-CONTRACT`

designVerdict: `RULE_DESIGN_FIX_REQUIRED`

implementationAuthorized: `false`
