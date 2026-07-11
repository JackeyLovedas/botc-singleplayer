reviewedBranch: `phase-3/cerenovus-first-night-madness-marker`

reviewedBaseHead: `45aabfe825d45329a80a178a943cce3bb6491ce1`

reviewTimestamp: `2026-07-11T13:33:39+08:00`

reviewedDesign:

- Path: `docs/implementation/phase-3-slice-2b16-design.md`
- SHA-256: `6d790e201347222621b8cfb5afeee77d3e0224faa4c438b9f67c1994edeb12a0`
- Terminal status: `READY_FOR_RULE_DESIGN_REREVIEW`

evidence:

- Path: `docs/rules/evidence/2B16.md`
- SHA-256: `5204b8995a40b8cee237f2b004f59f16e0751667ffdd3b9b5691265f425d9cb0`
- Coverage: `PARTIAL`
- Rule verdict: `RULE_READY`
- User overrides SHA-256: `9ec14eb794fa1f0fd47d674d7b4df5acbceed17e1b51fcde2c227a3496e4dab3`
- No approved override or unresolved external-source conflict exists.

reviewedInputs:

- Complete round-2 final report, SHA-256 `24fc958b2df03c6a0d55d2d2cfa6e7b4a0f05d7847a3e52fec32056a75abe254`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- Fixed official Cerenovus, Vortox, States and Character Types revisions
- Fixed Chinese Cerenovus and Vortox revisions
- Live official nightsheet, SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`

findings:

1. The embedded-seat defect has an exact, bounded production correction. The Cerenovus opportunity branch must require `parsedId.seatNumber === sourceSeatNumber`; choice and marker shapes independently enforce the same semantic identity. Instruction privacy remains unchanged and its integrity is proven through the complete stored chain.

2. The design does not rely on tenure or task coincidence to conceal the opportunity-ID defect. It explicitly treats the encoded-seat equality as an independent invariant and adds domain, replay and projection cases where all other seat-1 facts remain internally consistent.

3. Replay order coverage is no longer overstated. The design requires all 24 permutations, one canonical success and 23 independently rejected noncanonical permutations, with an honestly narrowed test name.

4. Replay metadata coverage is complete at design level: independent batch ID, command ID, game version and all four event-sequence positions, plus a canonical shared-metadata control.

5. Lifecycle and duplicate claims are separated honestly. A real metadata-aligned `PhaseTransitioned` envelope tests lifecycle mixing; duplicate settlement is tested separately and is not mislabeled as lifecycle behavior.

6. Stored-opportunity and choice-provenance plans cover every previously omitted player, seat, role, task, tenure, ability-source, ability-instance and revision field, including a combined forgery and actual-source impairment with forged unaffected payload source.

7. Projection coverage now requires independent duplicate assertions for choice, marker, instruction, settlement, opportunity and task. Cross-link coverage enumerates source, target, catalog, tenure, ability, revision, marker, choice, delivery, opportunity and task identities separately, plus one combined forgery.

8. Historical non-recomputation is split into source role, source alignment, target role, target alignment and test-only source impairment cases. The design explicitly prevents these tests from claiming canonical impairment production, Vortox runtime or character/alignment lifecycle support.

9. Application failure coverage now enumerates batch ID, every event-ID position, every clock position when applicable, event construction, prospective corruption, `failBeforeCommit` and `failDuringCommit`. Each case must prove retryability, no receipt, no append, unchanged version, open opportunity and same-command successful retry. The harness remains test-only.

10. The prior-role overclaim is removed. Actual Witch, Evil Twin, Dreamer and Seamstress execution tests are identified by their existing exact names. Existing direct private-projection tests must be referenced by their literal repository names rather than replaced with a task-presence assertion.

11. The two locally hard-coded “official order” tests are no longer permitted to masquerade as external proof. External order remains sourced evidence; the supported runtime regression is honestly limited to `WITCH_ACTION < CERENOVUS_ACTION < CLOCKMAKER_INFORMATION`.

12. Status synchronization avoids self-referential commit hashes and an infinite documentation-only commit chain. Repository documents must remove stale pending language, while Git/PR `headRefOid` and exact-head GitHub checks remain the authority after push.

13. The role matrix must remove stale repair-round-1 wording while retaining `PARTIAL`, unsupported impairment simulation, unsupported lifecycle behavior and partial historical projection.

14. The successful four-event contract, command surface, payloads, projection output and receipt disclosure remain unchanged. No drunk/poison simulation, Vortox runtime, alignment/character lifecycle, madness judgment, execution, marker cleanup, recurrence, Goblin, Vigormortis, gained Cerenovus, UI or persistence work is authorized.

15. The design introduces no external rule reinterpretation, production injection API, speculative refactor, new event type or Slice 2B17 work.

16. `git diff --check` succeeds. The only current worktree items are the round-2 design and the verbatim round-2 final-review artifact.

remainingBlockers: `[]`

authorizationBoundary:

Implementation is authorized only for design SHA-256 `6d790e201347222621b8cfb5afeee77d3e0224faa4c438b9f67c1994edeb12a0`, within its stated production, test, documentation and scope boundaries. Any semantic change requires renewed design review.

designVerdict: `RULE_DESIGN_PASS`
