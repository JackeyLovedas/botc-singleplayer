# 2B20AP2 source implementation status

## Hosted-CI Operational Recovery checkpoint

- Initial published infrastructure HEAD:
  `da43ad096fb8c738028f9da2aaaf052dd62282f2`.
- PR #47 push run
  [`30325116297`](https://github.com/JackeyLovedas/botc-singleplayer/actions/runs/30325116297)
  and pull-request run
  [`30325119014`](https://github.com/JackeyLovedas/botc-singleplayer/actions/runs/30325119014)
  both completed `success` on attempt `1` for that exact HEAD.
- Each run reports `24/24` successful jobs, `0` failed jobs, `21` artifacts,
  `0` expired artifacts, and no failed artifacts. Old runs were not rerun.
- The complete checkpoint is
  `docs/implementation/phase-3-slice-2b20ap2-hosted-ci-execution-checkpoint.md`,
  SHA-256
  `e55e5a013a039c4cf4bb47caddfc6b56de058b307bfc07eb88f881f81b52695f`,
  `2721` bytes, `71` LF lines.
- Local implementation review remains
  `INFRASTRUCTURE_IMPLEMENTATION_REVIEW_PASS` at
  `5b371308074e03c24f6e2a6688b64b4b8268bad3`; CI remediation remains final
  at `2/2`. This checkpoint consumes no repair round and makes no
  implementation change.
- The checkpoint commit is newer than `da43ad0` and cannot inherit its hosted
  CI. Its own exact-head push and pull-request CI must pass before final
  review; no future commit SHA or CI result is asserted.
- No push, PR mutation, CI trigger, final review, or merge was performed by
  this docs/control checkpoint.
- Sole remaining blocker:
  `PENDING_CHECKPOINT_EXACT_HEAD_CI_AND_FINAL_REVIEW`.
- Required next action:
  `UPDATE_PR47_BODY_PUSH_CHECKPOINT_HEAD_WAIT_EXACT_CI_THEN_FINAL_REVIEW`.

All sections below are chronological history and do not override this state.

## Independent local implementation re-review passed

- The complete independent Round-2 local infrastructure implementation
  re-review of exact HEAD
  `5b371308074e03c24f6e2a6688b64b4b8268bad3` is archived verbatim at
  `docs/implementation/phase-3-slice-2b20ap2-local-implementation-rereview-round-2.md`,
  SHA-256
  `006458386fcf9542885448e1b79954f0d8539ac2c4aa16b8378b764a6ca9c715`,
  `5369` bytes, `87` LF lines.
- Reviewer verdict:
  `INFRASTRUCTURE_IMPLEMENTATION_REVIEW_PASS`; `findings=[]`; local
  `remainingBlockers=[]`.
- The reviewer independently confirmed both Round-1 blocker closures, runner
  `36/36`, ownership/H1 `37/37`, exact candidate authority, old/new profile
  matches, ordinary and coverage segmented authority, Windows W1-W7, and all
  full local gates.
- `localImplementationReviewVerdict=INFRASTRUCTURE_IMPLEMENTATION_REVIEW_PASS`
  and
  `localImplementationReviewedHead=5b371308074e03c24f6e2a6688b64b4b8268bad3`.
  CI remediation remains exhausted at `2/2`.
- Rule, profile, source, workflow, product, test, role-matrix, dependency,
  lockfile, timeout, include, project, and logical-group values are unchanged.
- No push, PR mutation, hosted CI run, or merge occurred. PR #47 still
  requires body reconciliation and publication of the exact local history.
- Sole remaining blocker:
  `PENDING_PR47_BODY_RECONCILIATION_AND_PUBLICATION`.
- Required next action:
  `UPDATE_PR47_BODY_PUSH_EXACT_HEAD_AND_WAIT_CI`.

All sections below are chronological history and do not override this state.

## Final CI remediation round 2 complete

- The complete independent local infrastructure implementation review of exact
  HEAD `73563e6ae6b53dd30bbe3eb674a33eace750c166` is archived verbatim at
  `docs/implementation/phase-3-slice-2b20ap2-local-implementation-review-round-1.md`,
  SHA-256
  `7c8a12df66f61ab56cb9699b30d7166fe9da964fead6bba409619278cee33279`,
  `8590` bytes, `145` LF lines. It returned
  `INFRASTRUCTURE_IMPLEMENTATION_REVIEW_FIX_REQUIRED` with exactly two
  remaining blockers.
- Remediation F1 is confined to
  `scripts/run-vitest-logical-group.mjs`. Verify and aggregate now revalidate
  persisted envelopes and every declared physical artifact from frozen runner
  configuration, reject missing/renamed/corrupt/extra/link-backed artifacts,
  recompute singleton and manifest authority, and accept only the exact direct
  local or downloaded artifact layout.
- Remediation F2 synchronizes the canonical root fields in
  `docs/agent-loop/AUTOPILOT_STATE.json`; historical same-name fields are
  explicitly historical, and both Node `JSON.parse` and PowerShell
  `ConvertFrom-Json` resolve the same active tuple.
- Hostile runner checks pass `36/36`. The reviewer's exact absent application
  blob probe now returns `MERGEABLE_BLOB_MISSING`, exit `22`; restoring the
  exact blob returns `VERIFY PASS 465`.
- Strict ordinary segmented authority passes
  `11 physical -> 9 logical -> 1572`; strict segmented coverage passes
  `12 physical -> 11 logical -> 1572`, Dreamer core `36`, gained `10`.
- Windows inventory passes baseline `305`; the clean real W1-W7 run and
  separate verification both pass `9/90/52/73/9/26/46`, with every
  `onTaskUpdate`, `Timeout`, and `Unhandled` risk-string count equal to zero.
  An earlier Windows attempt was rejected because a tool-timeout orphan wrote
  the fixed directory concurrently; its mismatched staged/physical blobs were
  isolated and were not represented as passing evidence.
- Ownership/H1 self-test remains `37/37`; the direct 2B20A candidate repeats
  exactly at `391257` bytes and SHA-256
  `d8ae2d1f76958460173daaf84663b0c680c8dead7c052b446c2fcd037eab9129`.
  Old and new profile verification both return
  `COVERAGE_APPROVED_PROFILE_MATCH`.
- `pnpm typecheck`, `pnpm lint`, and `pnpm test` pass; ordinary full tests are
  `35/35` files and `1572/1572` tests. Raw `pnpm test:coverage` was not run.
- Final ordinary, coverage, and Windows evidence is preserved outside the
  repository under
  `<os-temp>/botc-2b20ap2-round2-final-evidence`.
- `ciRemediationRound=2/2`. No push, pull-request mutation, hosted CI run, or
  merge occurred. The sole remaining blocker is
  `PENDING_INDEPENDENT_LOCAL_INFRASTRUCTURE_IMPLEMENTATION_REREVIEW`.

## Round 2 disposition

- Status:
  `CI_REMEDIATION_ROUND_2_COMPLETE_PENDING_INDEPENDENT_LOCAL_INFRASTRUCTURE_IMPLEMENTATION_REREVIEW`.
- Repair baseline: `73563e6ae6b53dd30bbe3eb674a33eace750c166`.
- Branch: `infra/2b20ap1-ownership-supersession-routing-v1`.
- Design remains Round `2/2`; rule and product behavior are unchanged.
- Coverage profile review remains `COVERAGE_PROFILE_REVIEW_PASS` at
  `da14b5dbdf705bc7776f1c83b799f07b0a29e405`.
- This repair consumes the final `ciRemediationRound=2/2`.
- Sole remaining blocker:
  `PENDING_INDEPENDENT_LOCAL_INFRASTRUCTURE_IMPLEMENTATION_REREVIEW`.
- Required next action:
  `RUN_INDEPENDENT_LOCAL_INFRASTRUCTURE_IMPLEMENTATION_REREVIEW`.

All sections below are chronological history and do not override this state.

## Coverage profile review passed

- Independent read-only coverage-profile review of exact child HEAD
  `da14b5dbdf705bc7776f1c83b799f07b0a29e405` returned
  `COVERAGE_PROFILE_REVIEW_PASS`, `findings=[]`, and
  `remainingBlockers=[]`. Its complete output is archived verbatim at
  `docs/implementation/phase-3-slice-2b20ap2-coverage-profile-review.md`,
  SHA-256
  `d59d3e556698fd7ad84712a1710b00325eadc767994de1ce8ab8fcfde146a0e8`.

- Independent recovery rule-design review of exact HEAD
  `cc82a95a258ad943e1d1a28b9c44ea51fe45bfa1` returned
  `RULE_DESIGN_PASS`, `findings=[]`, and `remainingBlockers=[]`; its complete
  output is archived verbatim at
  `docs/implementation/phase-3-slice-2b20ap2-rule-design-review-recovery.md`,
  SHA-256
  `71c77072b53c57d6a3d67bb956af98fda867c5209585791a09641828b084b633`.
- The incomplete interrupted `.vitest-coverage` directory was verified to
  resolve exactly inside the repository, removed by literal path, and replaced
  by one complete segmented exact-source execution. No raw
  `pnpm test:coverage` command was run.
- Segmented authority passed `12 physical -> 11 logical -> 1572`, core `36`,
  gained `10`, with empty duplicate/intersection/missing/unexpected/failure
  sets.
- The complete audit is
  `docs/implementation/phase-3-slice-2b20ap2-coverage-profile-audit.md`.
  Full tuple evidence is preserved at
  `<os-temp>/botc-2b20ap2-profile-child-cc82a95/.vitest-coverage`.
- Appended profile:
  `phase-3-slice-2b20ap2-cc82a95-hosted-execution-v1`, source HEAD
  `cc82a95a258ad943e1d1a28b9c44ea51fe45bfa1`.
- The old profile record is Git-canonical byte-identical:
  `3648` bytes, SHA-256
  `76b668f49635373bff2df22adc7d2638720ff6620f00b378f6e59eade8d9c76e`
  before and after.
- Current status:
  `COVERAGE_PROFILE_REVIEW_PASS_PENDING_INDEPENDENT_LOCAL_INFRASTRUCTURE_IMPLEMENTATION_REVIEW`.
- Profile-review blockers are empty.
- Sole next blocker:
  `PENDING_INDEPENDENT_LOCAL_INFRASTRUCTURE_IMPLEMENTATION_REVIEW`.
- `ciRemediationRound=1/2`; no push, PR mutation, hosted CI, or merge occurred.

## Disposition

- Status:
  `COVERAGE_PROFILE_REVIEW_PASS_PENDING_INDEPENDENT_LOCAL_INFRASTRUCTURE_IMPLEMENTATION_REVIEW`.
- Source baseline: `bdbbe8bc051c5b6ff832aecec3202bee27e3b53f`.
- Branch: `infra/2b20ap1-ownership-supersession-routing-v1`.
- Design remains Round `2/2`; Correction 1 remains docs-only Round `1/2`.
- Replacement Design Release verdict remains `DESIGN_RELEASE_PASS`.
- This source commit consumes `ciRemediationRound=1/2`.
- Sole remaining blocker:
  `PENDING_INDEPENDENT_LOCAL_INFRASTRUCTURE_IMPLEMENTATION_REVIEW`.
- Required next action:
  `RUN_INDEPENDENT_LOCAL_INFRASTRUCTURE_IMPLEMENTATION_REVIEW`.
- No push, pull-request mutation, hosted CI run, or merge was performed.

## Implemented source scope

Exactly five infrastructure source files changed:

| Path | SHA-256 before commit |
|---|---|
| `.github/workflows/ci.yml` | `cf78d9cff7bacc28d7c51b882f086a93f1fd989f898af827ced4e1abf4c24127` |
| `scripts/run-vitest-logical-group.mjs` | `c33bf65fe5a0b674cdd47c3a578be112fa7c5b7bc70beedbf19d9774fd6cb169` |
| `scripts/verify-vitest-ownership-contracts.mjs` | `30c7e294cda38e5d044c15dc611b1b2d7ca3dcf64f98dd7363fd5874f6e41dba` |
| `scripts/verify-vitest-windows-application-groups.mjs` | `b7f12bc03ec22911a029ba51f0dc7effcec45a99bc53e5bfee0b639bb67c3fab` |
| `scripts/vitest-ownership-contracts.mjs` | `98a7717485c9a472fff597f3decbfcdef56ecd47e4e1f8fb92339826ae1c46fe` |

The implementation:

- validates accepted Git authority in the required missing-object, ancestry,
  blob, and successor order;
- executes Dreamer/Vortox ordinary, coverage, and W7 evidence in isolated
  same-process segments;
- preserves ordinary `11 physical -> 9 logical` and coverage
  `12 physical -> 11 logical`;
- preserves W1-W7 ownership while replacing only W7 execution with isolated
  `14/22/10` evidence;
- resolves the installed Vitest `3.2.6` public bin and invokes it directly with
  Node `24.15.0`;
- emits all five complete canonical coverage tuple sets with count and SHA-256;
- compares complete sorted added/removed tuple sets and treats raw coverage JSON
  SHA-256 as diagnostic only;
- rebases downloaded coverage blob lookup to each validated logical-manifest
  directory.

No product source, product test, assertion, title, marker, rule evidence, role
coverage, coverage include, timeout, dependency, lockfile, Vitest project,
logical group, accepted authority, or old coverage profile changed.

## Local validation

| Gate | Result |
|---|---|
| Runner relational self-test | `PASS 20/20` |
| Ownership/H1 self-test | `OWNERSHIP_CONTRACT_SELF_TEST_PASS 37/37` |
| Ownership candidate repetition | `CANDIDATE_BASELINE_VERIFIED 2B20A`; `1572` structured identities, `12` LF identities |
| Targeted ESLint | `PASS` |
| Ordinary segmented execution | `PASS`; `11 -> 9 -> 1572` |
| Coverage segmented execution | `PASS`; `12 -> 11 -> 1572`; Dreamer core `36`, gained `10` |
| Windows application execution | `PASS`; W1-W7 `9/90/52/73/9/26/46 = 305`; W7 `14/22/10`; all risk-string counts zero |
| `pnpm typecheck` | `PASS` |
| `pnpm lint` | `PASS` |
| `pnpm test` | `PASS`; `35/35` files, `1572/1572` tests |
| Raw unsegmented `pnpm test:coverage` diagnostic | `FAIL`, exit `1`; `35/35` files and `1572/1572` assertions passed, then Vitest reported one unhandled `[vitest-worker]: Timeout calling "onTaskUpdate"` |
| Full segmented coverage release authority | `PASS`; `12 -> 11 -> 1572`, core `36`, gained `10`, same-process exits/signals/global errors clean |
| Existing profile validation | expected `COVERAGE_REQUESTED_PROFILE_MISMATCH`; not a source failure and not promoted to PASS |
| `git diff --check` | `PASS` |

The raw unsegmented coverage result is retained as an H3 historical diagnostic,
is not release authority, was not rerun, and is not represented as PASS.

## Exact-source coverage evidence

Preserved outside the repository at
`<os-temp>/botc-2b20ap2-source-evidence-bdbbe8b`:

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| `coverage/coverage-final.json` | 4,648,231 | `52e01a01aede65da8c660ccfc2b5779ea6ea3918b170fc9e13a153befbdc250d` |
| `coverage/coverage-normalized-tuples.json` | 669,415 | `5e6d1e333f99f77fb5d4b8c71adc2d00146f0d1f52c72b933a36f3a807448f82` |
| `coverage/global-manifest.json` | 393,593 | `dd159c980d27f1847b83b848f2b3b894c18392ae2e4a2b3167f12dd9c03dee85` |
| `ordinary-global-manifest.json` | 388,958 | `a3a9649920928cea00b2c02acaba1b91b5ffb31150779b56b80a41e1899ea0c6` |
| `windows-verification.json` | 9,683 | `86ca31fdace5efaea1871d5a5b980a5d65c92cbbf57c0913d3ca95c7afe6813d` |

Canonical coverage sets:

| Set | Count | SHA-256 |
|---|---:|---|
| `sourceFiles` | 63 | `f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691` |
| `zeroHitStatements` | 3217 | `851add3e897ea59b8b1d86fbde3c52b792d466902f3705958d97dfba174224fe` |
| `zeroHitFunctions` | 23 | `f4c97e3e3270830939cf6a337358de3dbe4ce0ae354f000d3e6001c7cb7a00be` |
| `zeroHitLines` | 3217 | `c37a009f8cbca2bfa30ece8349b5864751e4274b4e4c19ca29bf0ea03acb166f` |
| `zeroHitBranchArms` | 1808 | `12e72ae3e8a02fa18425f14f804c9f630537dff1534e9dcb0168833718622a7d` |

All five persisted-artifact comparisons have equal count/hash, empty complete
added/removed sets, internally consistent metadata, and `equal=true`. The
branch-arm count above is an observed artifact value only. Neither it nor the
historical parent observation controls acceptance.

The old profile verifier remains byte-identical at SHA-256
`4eecd0472548a254546ac37b89d7102d7007f011574a16a3a7fa41bf04f3acbc`.
The later profile child must bind a new append-only profile to the committed
source HEAD, receive independent `COVERAGE_PROFILE_REVIEW_PASS`, and only then
switch the workflow profile ID.
