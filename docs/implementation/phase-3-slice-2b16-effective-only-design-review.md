BEGIN_RULE_DESIGN_REVIEW_REPORT
## Independent Rule Design Review

- reviewedBranch: `phase-3/cerenovus-first-night-madness-marker`
- reviewedHead: `db1f09cc35b51f92f6e84ad8cd9c3cb1150983d0`
- reviewTimestamp: `2026-07-11T11:29:50+08:00`
- evidenceHash: `f0d8d976cd9366d7e4603173caeb01d3fd7461c27c484501f79d8d0b0ce5175a`
- designHash: `7c1c2bd7f849913b3cacf2e5a14c8ce83a32dbdecef8591267074e6cf4ef0e3f`

### Review scope

Independently reviewed:

- Current `AGENTS.md` and canonical Autopilot prompt.
- User authorization attachment for the effective-only rescope.
- Exact branch, HEAD, all 22 tracked dirty files, and both untracked Cerenovus files.
- Corrected rule evidence and design in full.
- Role coverage matrix and current controller/state/log documents.
- Relevant command-result, receipt, batch, replay, prospective-validation, event-applier, opportunity, task-order, state, and projection contracts.
- Existing impairment producers and their reachable canonical histories.
- External pinned sources and the live official nightsheet.

### Sources reviewed

- `docs/rules/USER_OVERRIDES.md`
- Official Cerenovus Wiki, revision `3048`
- Official States Wiki, revision `1039`
- Official Glossary Wiki, revision `2874`
- Chinese Cerenovus Wiki, revision `4198`
- Chinese Madness Wiki, revision `5883`
- Official `nightsheet.json`, SHA-256 `99a2815...`

The pinned revisions and hashes match the evidence. No material source conflict was found.

Official ordering was independently confirmed:

- First night: `witch -> cerenovus -> fearmonger`
- Other nights: `witch -> cerenovus -> pithag`

### Findings

1. The effective-only rescope is honest and bounded. The evidence retains the complete drunk and poisoned rule truth while classifying simulation as `UNSUPPORTED_UNREACHABLE_IN_CURRENT_CANONICAL_HISTORY`. It does not claim immunity or completeness.

2. The canonical reachability conclusion is supported. Existing impairment production is limited to Philosopher duplicate drunkenness and Snake Charmer demon-hit poisoning; neither can affect a still-active base Cerenovus under current canonical event flows. No generic source, import event, testing event, or arbitrary state-injection boundary is authorized.

3. The fail-closed boundary is feasible in the current application architecture. The existing receipt lookup is read-only. After deterministic validation, `createBatchOrReject` can run the gate and directly return:

   - `status: failed`
   - `code: ApplicationNotConfigured`
   - `failureStage: first-night-role-action`
   - `retryable: true`

   This return occurs before `createBatch`, which is where batch IDs, clock metadata, events, and version advancement begin. It also bypasses rejected-receipt recording and accepted-command commit, leaving the opportunity open and command ID retryable.

4. The selected effective history is exact and internally consistent:

   1. `CerenovusChoiceRecorded`
   2. `CerenovusMadnessMarked`
   3. `CerenovusMadnessInstructionDelivered`
   4. `ScheduledTaskSettled`

   The settlement outcome is exactly `CERENOVUS_MADNESS_MARKED`.

5. The legal choice surface matches the sourced rules:

   - Any modeled roster player, including self.
   - No alive-only restriction while life state is unmodeled.
   - An on-script Townsfolk or Outsider, whether in or out of play.
   - No Demon, Minion, Traveller, or off-script role acceptance.

6. The marker contract is correctly limited to immutable historical future-trigger policy. It records the next-day/following-night window, next-dawn removal rule, and source-ability dependency, without pretending to implement lifecycle execution, madness judgment, execution, death, recurrence, or cleanup.

7. Target privacy is correctly designed. The stored instruction and projected player view omit source player, seat, tenure, and ability-instance identity. Only the selected target receives the instruction; self-target visibility follows solely because source and recipient are then the same player.

8. Stored-chain validation is sufficiently specified: exact opportunity, task, source tenure and ability instance, revisions, roster target, catalog role, marker, instruction, settlement, uniqueness, ordering, replay equality, and historical projection are validated without recomputation from later character or impairment state.

9. The dirty implementation is still the superseded implementation, as expected before renewed authorization. Its resolution union, impaired simulation, private-notification event, old settlement outcome, state collections, projection names, and tests must be rewritten or removed. The design explicitly identifies these dispositions while preserving reusable opportunity, command, tenure, deterministic-ID, and integration scaffolding.

10. The design specifies 62 acceptance tests and traces them to all 23 evidence regression claims, including pure constructed gate tests, prohibition of fake canonical impairment histories, privacy, atomicity, replay, receipt behavior, determinism, ordering, and honest `PARTIAL` coverage.

11. The role coverage matrix remains `PARTIAL` and explicitly records impaired settlement, lifecycle, judgment, execution, and recurrence as unsupported. Nothing presents Cerenovus as complete.

### Findings requiring correction

None.

### Remaining blockers

None for implementation of this exact reviewed effective-only design. Any change to the evidence, design, scope, event contract, impairment policy, or reviewed dirty-worktree disposition requires renewed independent review.

RULE_DESIGN_PASS
END_RULE_DESIGN_REVIEW_REPORT
