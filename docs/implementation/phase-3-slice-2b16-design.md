# Phase 3 Slice 2B16 Design — Cerenovus First-Night Skeleton

## Provenance

- Design authority: `docs/rules/evidence/2B16.md`.
- Evidence SHA-256: `6306ec6c008c72c276ccbf1fcddc0b14dd299ae5ded015c1bb55b6693aff2ef9`.
- Rule-research verdict: `RULE_READY`.
- Repository baseline: `00c3c01e35b2a117db28a72e007e6c7079bb9990`.
- Baseline CI: run `29098986989`, green.
- This design is deliberately bounded to the first-night Cerenovus choice, represented effective/impaired settlement, canonical target notification, replay-safe storage, and private projection. It does not implement actual madness judgment, enforcement, execution, death, or lifecycle processing.

## ruleClaims

1. The Cerenovus acts on the first night.
2. The Cerenovus chooses one player and one Townsfolk or Outsider character.
3. The chosen player learns that the Cerenovus selected them and learns the selected character.
4. The normal rule describes the chosen player as being mad that they are the selected character until dusk, or else they might be executed.
5. A drunk or poisoned Cerenovus still performs a normal-looking choice.
6. A target selected by a drunk or poisoned Cerenovus receives the same private notification as a target selected by an effective Cerenovus.
7. Impairment does not create an enforceable madness requirement, marker authority, or execution authority.
8. The first-night order places Cerenovus after Witch and before Fearmonger; the other-night order places Cerenovus after Witch and before Pit-Hag.
9. This slice records the bounded first-night interaction only. It preserves the sourced rule distinction between effective and impaired resolution without implementing the downstream consequences named by the full character text.

## invariants

- Domain events remain canonical truth; projections are rebuildable.
- One accepted Cerenovus command appends one atomic four-event batch.
- Effective and impaired accepted branches expose the same accepted-response shape, event count, and ordered event-type list.
- The notification payload is derived only from the recorded choice, never from the effective/impaired resolution variant.
- The target notification is identical across effective, drunk, and poisoned source branches.
- Impaired resolution cannot contain requirement, marker, duration, enforcement, execution, death, or lifecycle fields.
- An effective resolution records only historical requirement creation facts and exact temporal anchors; it does not activate a general effect runtime.
- The chosen character is validated against the script catalog and must have the Townsfolk or Outsider type. It need not be assigned or in play.
- The chosen target must be a modeled roster player. Self-selection is legal.
- Only the base scheduled Cerenovus task is supported. No gained-ability source is inferred.
- Stored facts are validated before projection; later character or impairment state does not rewrite delivered knowledge.
- Canonical identifiers and ordering are deterministic and locale-independent.

## domainTypes

Add the following literal model versions:

```ts
export const CERENOVUS_CHOICE_MODEL_VERSION = "cerenovus-choice-v1";
export const CERENOVUS_RESOLUTION_MODEL_VERSION = "cerenovus-resolution-v1";
export const CERENOVUS_REQUIREMENT_MODEL_VERSION =
  "cerenovus-madness-requirement-creation-v1";
export const CERENOVUS_DURATION_MODEL_VERSION =
  "cerenovus-first-night-duration-v1";
export const CERENOVUS_PRIVATE_NOTIFICATION_MODEL_VERSION =
  "cerenovus-private-notification-v1";
```

The task decision is exactly:

```ts
type CerenovusDecision = {
  kind: "CHOOSE_PLAYER_AND_CHARACTER";
  targetPlayerId: PlayerId;
  chosenRoleId: RoleId;
};
```

The action opportunity advertises exactly:

```ts
{
  canChooseTarget: true,
  canChooseCharacter: true,
  supportedDecisionKinds: ["CHOOSE_PLAYER_AND_CHARACTER"],
  targetSchema: "ANY_MODELED_ROSTER_PLAYER",
  characterSchema: "ON_SCRIPT_TOWNSFOLK_OR_OUTSIDER"
}
```

The represented source assessment uses the existing impairment model and separates source effectiveness from the choice and notification. Resolution is a closed union of the effective and impaired payload variants defined below.

## commands

Introduce `SubmitCerenovusAction` with exact command-specific input:

```ts
type SubmitCerenovusAction = CommandEnvelope & {
  type: "SubmitCerenovusAction";
  taskId: ScheduledTaskId;
  opportunityId: ActionOpportunityId;
  decision: CerenovusDecision;
};
```

No actor-supplied madness state, marker, duration, reason, execution choice, target notification content, source role, or source effectiveness is accepted. Those facts are derived from stored task, roster, script, phase, and represented impairment state.

The command is accepted only for the unsettled base first-night `CERENOVUS_ACTION` task whose source is exactly `{ sourceKind: "ROLE", sourceRole: "cerenovus" }` and whose opportunity belongs to the submitting actor and task.

## events

Add three canonical domain events:

1. `CerenovusChoiceRecorded`
2. `CerenovusResolutionRecorded`
3. `CerenovusPrivateNotificationDelivered`

Reuse `ScheduledTaskSettled` as the fourth event with the neutral outcome:

```ts
outcome: "CERENOVUS_ACTION_RECORDED"
```

No runtime effect, madness judgment, execution, death, or lifecycle event is introduced.

## eventOrder

The accepted atomic batch order is fixed:

1. `CerenovusChoiceRecorded`
2. `CerenovusResolutionRecorded`
3. `CerenovusPrivateNotificationDelivered`
4. `ScheduledTaskSettled`

This order makes the choice available before its resolution, records represented rule truth before delivery, records the delivered historical knowledge before task settlement, and gives replay one deterministic sequence.

Night-order catalog behavior remains explicit:

- Official first-night relative order: Witch → Cerenovus → Fearmonger.
- Official other-night relative order: Witch → Cerenovus → Pit-Hag.
- In the currently supported first-night catalog, the modeled order remains Witch `600`, Cerenovus `700`, Clockmaker `800`. Clockmaker is a supported-catalog successor, not the official immediate nightsheet successor.

## payloadShapes

`CerenovusChoiceRecorded` has exact payload keys:

```ts
{
  modelVersion: "cerenovus-choice-v1";
  choiceId: string;
  taskId: ScheduledTaskId;
  opportunityId: ActionOpportunityId;
  sourcePlayerId: PlayerId;
  sourceRole: "cerenovus";
  targetPlayerId: PlayerId;
  chosenRoleId: RoleId;
}
```

`CerenovusResolutionRecorded` has common exact keys:

```ts
{
  modelVersion: "cerenovus-resolution-v1";
  resolutionId: string;
  choiceId: string;
  taskId: ScheduledTaskId;
  opportunityId: ActionOpportunityId;
  sourcePlayerId: PlayerId;
  sourceRole: "cerenovus";
  targetPlayerId: PlayerId;
  chosenRoleId: RoleId;
  resolution: CerenovusResolution;
}
```

The effective nested variant is exactly:

```ts
{
  kind: "REPRESENTED_EFFECTIVE_REQUIREMENT_CREATED";
  requirementModelVersion: "cerenovus-madness-requirement-creation-v1";
  requirementId: string;
  creationRecordStatus: "RECORDED";
  sourcePlayerId: PlayerId;
  sourceRole: "cerenovus";
  targetPlayerId: PlayerId;
  requiredRoleId: RoleId;
  duration: {
    modelVersion: "cerenovus-first-night-duration-v1";
    starts: {
      anchor: "PHASE_ENTERED";
      phase: "DAY_DISCUSSION";
      dayNumber: 1;
      nightNumber: 1;
    };
    followingNight: {
      phase: "NIGHT_TASKS";
      dayNumber: 1;
      nightNumber: 2;
    };
    ends: {
      anchor: "PHASE_ENTERED";
      phase: "DAWN_RESOLUTION";
      dayNumber: 1;
      nightNumber: 2;
    };
  };
  markerAtCreation: {
    markerKind: "MAD";
    placementAtCreation: "PLACED";
    targetPlayerId: PlayerId;
  };
}
```

`creationRecordStatus: "RECORDED"` is a historical creation record only. It is not a queryable active-effect lifecycle and grants no enforcement or execution authority.

The impaired nested variant is exactly:

```ts
{
  kind: "REPRESENTED_SOURCE_IMPAIRED_SIMULATION";
  simulationRecordStatus: "RECORDED";
  simulationReason: "SOURCE_DRUNK" | "SOURCE_POISONED";
  impairmentFactId: string;
  impairmentKind: "DRUNK" | "POISONED";
  impairmentSourceKind: string;
}
```

Exact-key validation forbids requirement, marker, duration, enforcement, execution, death, and lifecycle keys from the impaired variant.

`CerenovusPrivateNotificationDelivered` is exactly:

```ts
{
  modelVersion: "cerenovus-private-notification-v1";
  notificationId: string;
  choiceId: string;
  taskId: ScheduledTaskId;
  opportunityId: ActionOpportunityId;
  sourcePlayerId: PlayerId;
  recipientPlayerId: PlayerId;
  tokens: [
    {
      kind: "INFORMATION_TOKEN";
      token: "THIS_CHARACTER_SELECTED_YOU";
    },
    {
      kind: "CHARACTER_TOKEN";
      role: "cerenovus";
    },
    {
      kind: "CHARACTER_TOKEN";
      role: RoleId;
    }
  ];
}
```

The third token role equals the choice's `chosenRoleId`. The notification constructor receives the stored choice only; it does not receive or inspect the resolution variant.

## stateChanges

Replay applies the batch as follows:

- `CerenovusChoiceRecorded` stores an immutable choice fact indexed by `choiceId` and `opportunityId`.
- `CerenovusResolutionRecorded` stores one immutable represented resolution fact linked to the choice.
- An effective resolution stores its requirement-creation history and anchors as historical facts only.
- An impaired resolution stores simulation/impairment evidence only and creates no requirement or marker fact.
- `CerenovusPrivateNotificationDelivered` stores immutable delivered-knowledge history for its recipient.
- `ScheduledTaskSettled` settles the task with `CERENOVUS_ACTION_RECORDED` through the existing task-settlement state.
- No general `EffectInstance`, active madness state, enforcement state, execution state, death state, or later-night scheduled task is created.

## privateProjection

Add a target-only optional private-view field:

```ts
{
  cerenovusNotification?: {
    sourceRole: "cerenovus";
    chosenRoleId: RoleId;
    tokens: readonly [
      { kind: "INFORMATION_TOKEN"; token: "THIS_CHARACTER_SELECTED_YOU" },
      { kind: "CHARACTER_TOKEN"; role: "cerenovus" },
      { kind: "CHARACTER_TOKEN"; role: RoleId }
    ];
  };
  cerenovusKnowledgeModelVersion?: "cerenovus-private-notification-v1";
}
```

Add projection stage `CERENOVUS_PRIVATE_NOTIFICATION`, ordered after `EVIL_TWIN_PRIVATE_NOTIFICATION` and before `DREAMER_PRIVATE_INFORMATION` in the existing deterministic private-projection stage sequence.

Projection rules:

- Validate the stored notification event and its linked stored choice before projecting.
- Project only to `recipientPlayerId`.
- Project the same payload to human-player and AI-private consumers.
- Do not expose source effectiveness, impairment kind, impairment source, resolution kind, requirement ID, marker, duration, execution possibility, or canonical state.
- Do not recompute notification content from current character, current script, current impairment, or later state.

## storedValidation

Exact runtime validation must establish:

- event type and model-version literals;
- exact payload and nested-union keys;
- deterministic ID equality;
- task/opportunity/source linkage;
- source role exactly `cerenovus`;
- source and target are modeled roster players;
- chosen role exists in the stored script catalog and is Townsfolk or Outsider;
- choice uniqueness per opportunity;
- exactly one resolution per choice;
- resolution duplicates the linked choice's source, target, and chosen role exactly;
- effective requirement and notification IDs match their deterministic derivations;
- effective duration anchors are exactly the first-night anchors in this design;
- effective marker-at-creation target equals the choice target;
- impaired resolution refers to an existing represented source impairment fact whose kind and reason match;
- impaired resolution contains none of the effective-only keys;
- notification recipient equals the choice target;
- notification token tuple is exact and equals the linked choice;
- settlement outcome is `CERENOVUS_ACTION_RECORDED` and links to the same task/opportunity.

Any mismatch is malformed stored truth and fails closed before state mutation or projection.

## replayValidation

Replay must reject:

- resolution before choice;
- notification before choice or resolution;
- settlement before the three preceding events;
- duplicate choice, resolution, notification, or settlement for the opportunity;
- missing or cross-linked task/opportunity/choice IDs;
- source, target, chosen-role, or token disagreement across linked events;
- an effective resolution without exact first-night anchors;
- an impaired resolution with requirement/marker/duration/enforcement/execution fields;
- an impaired resolution whose referenced impairment fact is absent or inconsistent;
- a notification addressed to anyone other than the chosen target;
- an event whose deterministic ID does not match its contents;
- extra payload keys, unknown variant kinds, or unknown model versions.

A valid full replay rebuilds choice history, represented resolution history, target-delivered knowledge, and settled-task state without consulting wall-clock time, locale, randomness, UI, or an LLM.

## batchSemantics

The four-event batch is prospective-validated against a clone of current canonical state and appended atomically.

- If any event fails construction, exact validation, prospective application, or persistence, append none.
- No notification can be committed without its choice and represented resolution.
- No task can be settled without its notification.
- Retries use existing command fingerprint and receipt semantics and cannot append a partial or second batch.
- The persisted ordering is exactly the order in `eventOrder`.

## prospectiveValidation

Before append, apply the proposed batch to an isolated prospective state using the same replay validators used for persisted events. Acceptance requires all of the following:

- current phase/task/opportunity state permits this first-night Cerenovus action;
- the target and chosen character remain legal at settlement;
- represented source impairment is evaluated from current canonical state at settlement, not from actor input;
- the selected effective or impaired variant agrees with represented impairment state;
- all four events apply in order with exact linkages and no duplicate state;
- the resulting task is settled exactly once;
- the target's stored delivered-knowledge fact is projectable from the prospective state;
- no unsupported runtime effect or authority is introduced.

Prospective failure returns the normal command failure contract and persists neither domain events nor an accepted receipt.

## receiptSemantics

Successful first execution returns exactly:

```ts
{
  status: "accepted";
  resultSchemaVersion: "accepted-event-summary-v1";
  eventDisclosure: "EVENT_TYPES_ONLY";
  gameId: GameId;
  gameVersion: number;
  eventCount: 4;
  eventTypes: [
    "CerenovusChoiceRecorded",
    "CerenovusResolutionRecorded",
    "CerenovusPrivateNotificationDelivered",
    "ScheduledTaskSettled"
  ];
  idempotent: false;
}
```

The existing command fingerprint covers the exact command payload, including task, opportunity, target, and chosen role. A retry with the same command ID and identical fingerprint returns the stored accepted receipt with `idempotent: true`, the same `gameVersion`, `eventCount`, and ordered `eventTypes`, and appends nothing. Reuse of a command ID with a different fingerprint fails through the existing conflict contract.

Receipts disclose neither event payloads nor branch identity. Effective, drunk, and poisoned accepted executions therefore have the same result schema, disclosure mode, count, and event-type sequence.

## failureBoundary

Reject before append when:

- command envelope, decision, task ID, opportunity ID, target ID, or role ID is malformed;
- the task/opportunity does not exist, does not belong to the actor, is already settled, or is not the base first-night Cerenovus action;
- the source is not exactly the represented base Cerenovus role source;
- the target is not a modeled roster player;
- the chosen role is absent from the script or is not Townsfolk/Outsider;
- source impairment facts are malformed or ambiguous under existing deterministic precedence;
- deterministic IDs collide with non-identical stored facts;
- event construction, exact validation, replay validation, prospective validation, persistence, or receipt storage fails.

Failures append no domain events, publish no private notification, settle no task, and create no accepted receipt. Infrastructure errors remain infrastructure failures and do not masquerade as accepted game events.

## deterministicIds

Use canonical string construction only:

```text
first-night-v1:CERENOVUS_ACTION:seat-SS:opportunity-01
cerenovus-choice-v1:<opportunityId>
cerenovus-resolution-v1:<opportunityId>
cerenovus-madness-requirement-v1:<opportunityId>
cerenovus-private-notification-v1:<opportunityId>:recipient-seat-SS
```

`seat-SS` is the existing zero-padded canonical seat representation. The requirement ID is constructed only for the effective variant. Existing deterministic event IDs, command IDs, fingerprints, sequence numbers, and receipt keys remain authoritative. Do not use `Date.now`, `Math.random`, random UUIDs, `localeCompare`, `Intl.Collator`, or environment locale.

## branchInvariantDisclosureProof

Let `E` be an effective source settlement, `D` a represented-drunk settlement, and `P` a represented-poisoned settlement for the same canonical choice inputs.

For all three branches:

```text
eventCount = 4
```

and:

```text
eventTypes = [
  CerenovusChoiceRecorded,
  CerenovusResolutionRecorded,
  CerenovusPrivateNotificationDelivered,
  ScheduledTaskSettled
]
```

The branch distinction exists only inside the non-disclosed `resolution` payload of `CerenovusResolutionRecorded`. `CerenovusPrivateNotificationDelivered` is constructed solely from `CerenovusChoiceRecorded`, so its recipient and token tuple are byte-for-byte equivalent for equivalent choices across `E`, `D`, and `P`. `ScheduledTaskSettled` uses the same neutral outcome in every branch. The accepted receipt exposes event types only and never event payloads. The target private projection reads only the validated notification fact and therefore cannot observe the resolution branch. Thus neither the submitter's accepted result nor the target's private view leaks effective versus impaired source status.

## repositoryChanges

The implementer owns only the bounded production, test, and documentation changes needed for this design. Expected touch points are:

- domain event/type definitions and exact validators for the three new events;
- game-state storage and replay application for choice, represented resolution, delivered notification, and neutral task settlement;
- command definition, command dispatch, Cerenovus handler, batch construction, prospective validation, and receipt integration;
- scheduled-task/action-opportunity decision metadata for the existing first-night Cerenovus catalog entry;
- private projection types, deterministic stage ordering, and Cerenovus notification projection;
- focused unit/integration/replay/projection/receipt tests;
- `docs/rules/ROLE_COVERAGE_MATRIX.md` update preserving `PARTIAL` status;
- current implementation/status documentation required by repository workflow.

Do not refactor Witch semantics to share behavior: Witch's current effective/impaired event shapes and notification behavior are materially different. Reuse shared infrastructure only where its contract already matches this design.

## compatibilityMigration

- All new event types and model versions are additive.
- Existing games without Cerenovus events replay unchanged.
- Existing accepted-result schema `accepted-event-summary-v1` is reused without shape change.
- Existing command fingerprint, receipt, serial queue, task settlement, impairment fact, role catalog, and projection infrastructure remain compatible.
- Snapshot caches containing old state shapes must treat new Cerenovus collections/fields as empty when absent or be rebuilt from canonical events according to existing snapshot policy.
- No stored historical event is rewritten.
- No migration synthesizes Cerenovus notification, requirement, or impairment facts for old games.
- Unknown future Cerenovus model versions fail closed under exact validation.

## testPlan

Add focused tests covering at least:

1. A legal effective base first-night choice accepts and appends the exact four-event order.
2. The effective resolution contains the exact historical requirement, marker-at-creation, and first-night duration anchors.
3. A represented-drunk source accepts with the same event types/count and stores only the impaired simulation variant.
4. A represented-poisoned source accepts with the same event types/count and stores only the impaired simulation variant.
5. Effective, drunk, and poisoned target notifications are deep-equal for the same choice.
6. Effective, drunk, and poisoned accepted result disclosures are deep-equal except values already expected to vary outside branch identity, with exact identical `eventCount` and `eventTypes`.
7. The target human private view receives the exact token tuple.
8. The target AI private view receives the same exact token tuple and no canonical/impairment details.
9. Non-target private views receive no Cerenovus notification.
10. Projection uses the stored notification after later character/script/impairment changes and does not recompute.
11. Projection-stage ordering is after Evil Twin and before Dreamer.
12. Self-selection is accepted.
13. A scripted Townsfolk not assigned or in play is accepted.
14. A scripted Outsider not assigned or in play is accepted.
15. a Demon, Minion, Traveller, Fabled, unknown, or off-script selected role is rejected atomically.
16. A non-roster target is rejected atomically.
17. Wrong actor, wrong task, wrong opportunity, wrong source kind, gained-role source, settled task, or wrong phase is rejected atomically.
18. Exact payload validators reject extra keys and unknown versions/variants.
19. Impaired resolution rejects every effective-only requirement/marker/duration/enforcement/execution key.
20. Replay rejects each event-order inversion, missing link, duplicate, mismatch, and deterministic-ID error.
21. Prospective failure at each event step appends nothing and leaves the task unsettled.
22. Persistence failure appends no partial batch and creates no accepted receipt.
23. Same command ID plus same fingerprint returns the stored idempotent receipt and appends nothing.
24. Same command ID plus different target or chosen role returns the existing fingerprint-conflict failure.
25. Full replay rebuilds identical Cerenovus state and private delivered knowledge.
26. Night-order tests assert official relative-order metadata while preserving supported-catalog order `600/700/800` without claiming Clockmaker is the official immediate successor.
27. Role coverage tests/documentation keep all newly covered Cerenovus dimensions `PARTIAL` and unsupported dimensions non-complete.

Run focused tests and lint for touched files, then the full required gates: `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm test:coverage`.

## evidenceRegressionTraceability

The implementation test suite and coverage update must trace all 23 evidence findings from `docs/rules/evidence/2B16.md` without expanding the slice:

1. Cerenovus is a Minion — source-role/catalog validation.
2. Cerenovus acts on the first night — task/phase acceptance test.
3. Cerenovus acts on other nights in the full rules — retained as sourced context, explicitly not implemented here.
4. The actor chooses a player — target decision and roster validation tests.
5. The actor chooses a character — chosen-role decision validation tests.
6. The legal character class is Townsfolk or Outsider — positive and negative script-role tests.
7. The character need not be in play — legal off-assignment/on-script test.
8. The Cerenovus may choose themself — self-target test.
9. The selected player is told they were chosen by this character — information/source token assertion.
10. The selected player is told the chosen character — chosen-role token assertion.
11. Delivered knowledge is private to the selected player — recipient-only projection tests.
12. The notification is historical delivered knowledge — later-state non-recomputation test.
13. The normal rule creates a madness requirement — effective historical creation-record assertion.
14. The selected character is the madness subject — effective `requiredRoleId` linkage assertion.
15. The normal duration reaches dusk — exact temporal-anchor assertion representing the first-night interval through following dawn resolution.
16. The normal rule places a madness marker — effective marker-at-creation assertion.
17. The normal text says the player might be executed for noncompliance — recorded as source context only; no judgment or execution authority implemented.
18. Drunk Cerenovus still chooses normally — represented-drunk accepted-path test.
19. Poisoned Cerenovus still chooses normally — represented-poisoned accepted-path test.
20. The impaired target receives the same notification — deep-equality tests across branches.
21. Impairment creates no real requirement/marker authority — forbidden-key and no-runtime-state tests.
22. First-night order is Witch → Cerenovus → Fearmonger — nightsheet-relative-order metadata assertion.
23. Other-night order is Witch → Cerenovus → Pit-Hag — sourced metadata/assertion only; other-night task execution remains out of scope.

If any evidence item cannot be represented by a bounded test or explicit out-of-scope assertion, the slice cannot claim design completion.

## riskAlternatives

Primary risks and mitigations:

- **Branch leakage through accepted event summaries.** Mitigated by identical canonical event types/count and a neutral settlement outcome.
- **Branch leakage through target projection.** Mitigated by constructing and projecting notification solely from the stored choice.
- **Accidental active madness runtime.** Mitigated by historical `creationRecordStatus`, no general effect instance, and explicit forbidden state/events.
- **Impaired branch accidentally gaining authority.** Mitigated by a closed exact-key union and replay rejection of effective-only keys.
- **Recomputing historical knowledge.** Mitigated by immutable delivered-notification storage and stored-fact projection.
- **Using current supported catalog order as official rule order.** Mitigated by separately recording official relative metadata and supported numeric catalog order.
- **Overgeneralizing Witch behavior.** Mitigated by a dedicated Cerenovus flow because Witch's impaired behavior is not contract-compatible.
- **Premature shared effect abstraction.** Rejected for this slice because downstream madness judgment/lifecycle semantics are intentionally unmodeled.
- **Single neutral resolution without internal variants.** Rejected because it would lose canonical represented truth needed for future rule-safe expansion.
- **Different effective/impaired event types.** Rejected because `accepted-event-summary-v1` would disclose the source branch.
- **Omitting the effective creation record entirely.** Rejected because it would fail the sourced effective-rule evidence and make future replay-safe expansion ambiguous.

## explicitOutOfScope

- Judging whether the target is or is not mad.
- Observing speech, claims, nominations, votes, chat, or behavior for madness compliance.
- Storyteller enforcement decisions.
- Execution opportunity, execution command, execution event, or execution resolution.
- Death, survival, prevention, resurrection, or lifecycle consequences.
- Active-effect queries, expiration jobs, cleanup events, or general madness effect engines.
- Other-night Cerenovus command execution or repeated selection.
- Philosopher-gained, Alchemist-gained, Cannibal-gained, or other gained/copied Cerenovus abilities.
- Goblin, Vigormortis, Pit-Hag, Witch, Fearmonger, or other role interactions beyond order metadata needed to place this task.
- Changing alignments, character assignments, registrations, or script composition.
- UI controls, animations, Electron behavior, AI policy, LLM prompting, or autonomous target/role selection.
- Public or Storyteller-facing projection of hidden Cerenovus facts.
- Notifications to the source player beyond the existing command receipt.
- Random selection, Storyteller candidate ranking, or heuristic choices.
- Marking Cerenovus or any incomplete dimension `COMPLETE`.

## completionCriteria

The design is implemented only when all of the following are true:

- The exact command, three canonical events, neutral settlement, and deterministic IDs are implemented.
- Effective and represented-drunk/poisoned branches append the same ordered four event types.
- Effective resolution records the bounded historical creation facts and exact anchors without creating an active runtime.
- Impaired resolution records only impairment/simulation evidence and cannot contain or create requirement/marker/enforcement authority.
- The chosen target receives the exact same stored and projected notification across effective and impaired branches.
- Human and AI private views remain recipient-only and branch-invariant.
- Exact stored validation, replay validation, prospective validation, atomic batch behavior, command fingerprinting, and idempotent receipts are covered by tests.
- All 23 evidence findings are traceable to tests or explicit bounded out-of-scope assertions.
- Official night-order claims and current supported-catalog order are both represented without conflation.
- Existing games and receipts remain compatible; snapshots remain rebuildable.
- `docs/rules/ROLE_COVERAGE_MATRIX.md` remains honest: base ability, first-night, drunk, poison, and private projection may advance only to `PARTIAL`; other-night, Philosopher-gained, Goblin, Vigormortis, judgment, enforcement, execution, death, lifecycle, UI, and AI-policy dimensions remain `NOT_IMPLEMENTED` or `UNEVALUATED` as appropriate; overall Cerenovus status remains `PARTIAL`.
- Focused validation and all full repository gates pass.
- No forbidden scope is introduced.

READY_FOR_RULE_DESIGN_REVIEW
