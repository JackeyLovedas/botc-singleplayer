reviewedHead:
- `3dc10b4f030be7dd1c314c7a8981b24424bbd02b`
- branch: `main`
- local HEAD = origin/main = GitHub main HEAD
- exact-head CI: `29192916263` — `SUCCESS`
- CI URL: `https://github.com/JackeyLovedas/botc-singleplayer/actions/runs/29192916263`
- open PRs: `0`
- worktree: clean
- review timestamp: `2026-07-12T20:41:56+08:00`

reviewedDesign:
- `docs/implementation/phase-3-slice-2b18a-design-round-3-2.md`
- SHA-256: `615f4cb303cbcb6884f37cf6f46eb6733e1df631c68a9a3fa9085da26134d865`
- authorization: `DESIGN_ROUND_3_2_EVIDENCE_CONTRACT_SIMPLIFICATION`
- behaviorDesignFrozen: `true`
- finalDesignCompletionRound: `true`
- coverageStatus: `PARTIAL`
- terminal line: `READY_FOR_RULE_DESIGN_REVIEW_ROUND_3_2`

parentDesignReviewed:
- `docs/implementation/phase-3-slice-2b18a-design-round-3-1.md`
- SHA-256: `97456a3769d29b616af31c1e83dc5b1717809ffbe5a56ab0d86decd800c9710c`

parentReviewReviewed:
- `docs/implementation/phase-3-slice-2b18a-design-review-round-3-1.md`
- SHA-256: `0a4269be1b19a303fab1eb08e0bcd0c9212aed5ec4c2e068c3eb2e9502a99444`
- prior verdict: `RULE_DESIGN_FIX_REQUIRED`
- prior sole blocker: evidence variant semantic cross-links, canonical record identities, and `PLAYER_ROLE_AT_REVISION` compound identity

authorizationReviewed:
- `C:\Users\wjl\.codex\attachments\5ff59690-3536-47c8-9781-64ac348d5cc5\pasted-text.txt`
- Design 3.2 is the final evidence-contract simplification, not a new behavioral rule-design round.
- A non-pass verdict would permanently block the current 2B18A approach; no Design 3.3 is authorized.

ruleEvidenceReviewed:
- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/evidence/2B18.md`
- `docs/rules/evidence/2B18-resolved.md`
- resolved evidence SHA-256: `7df3eb026e3db36ff7e29610207749d613646caaa2470c69fbe9afb2edc4811e`
- resolved evidence terminal verdict: `RULE_READY`
- unresolved conflicts: `[]`
- rule coverage: `PARTIAL`

approvedOverridesReviewed:
- `BOTC-SIM-MATHEMATICIAN-FIRST-NIGHT-WINDOW-V1`
- `BOTC-SIM-MATHEMATICIAN-OWN-ABILITY-EXCLUSION-V1`
- `BOTC-SIM-MATHEMATICIAN-NUMERIC-DOMAIN-V1`
- `BOTC-SIM-MATHEMATICIAN-DUPLICATE-HOLDER-TEMPORAL-V1`
- Design 3.2 adds no override and does not alter any approved override literal or behavior.

productionFilesReviewed:
- `packages/domain-core/src/ids.ts`
- `packages/domain-core/src/canonical-data.ts`
- `packages/domain-core/src/events.ts`
- `packages/domain-core/src/game-state.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/first-night-task-plan.ts`
- `packages/domain-core/src/first-night-action-opportunity.ts`
- `packages/domain-core/src/current-character-state.ts`
- `packages/domain-core/src/philosopher-ability.ts`
- `packages/domain-core/src/snake-charmer.ts`
- `packages/domain-core/src/evil-twin.ts`
- `packages/domain-core/src/witch.ts`
- `packages/domain-core/src/cerenovus.ts`
- `packages/domain-core/src/clockmaker.ts`
- `packages/domain-core/src/dreamer.ts`
- `packages/domain-core/src/seamstress.ts`
- `packages/domain-core/src/index.ts`
- `packages/application/src/game-application-service.ts`
- `packages/projections/src/index.ts`

testFilesReviewed:
- `packages/domain-core/src/rebuild.test.ts`
- `packages/domain-core/src/domain-batch-semantics.test.ts`
- `packages/domain-core/src/philosopher-ability.test.ts`
- `packages/domain-core/src/snake-charmer.test.ts`
- `packages/domain-core/src/witch.test.ts`
- `packages/domain-core/src/cerenovus.test.ts`
- `packages/domain-core/src/cerenovus-replay.test.ts`
- `packages/domain-core/src/clockmaker.test.ts`
- `packages/domain-core/src/clockmaker-replay.test.ts`
- `packages/domain-core/src/dreamer.test.ts`
- `packages/domain-core/src/seamstress.test.ts`
- `packages/application/src/game-application-service.test.ts`
- `packages/projections/src/private-knowledge-view.test.ts`

scopeIntegrity:
- only Design 3.2 and control documentation were committed at the reviewed HEAD
- no production code or test implementation exists
- no feature branch or PR exists
- accepted event, payload, batch, receipt and settlement contracts are unchanged
- no `MathematicianInformationDelivered`
- no `SettleMathematicianInformation`
- no `MATHEMATICIAN_INFORMATION` settlement
- no private Mathematician number delivery
- Slice 2B18B and Slice 2B19 were not started

verificationByContract:

1. Frozen behavioral contracts: `PASS`
   - state-bound public resolver remains unchanged.
   - first-night window, player deduplication, own-instance exclusion and duplicate-holder temporal policy remain unchanged.
   - Witch remains `WitchDeathPendingMarked=NORMAL` and `WitchIneffectiveResolved=PENDING_TRIGGER`.
   - Cerenovus marker remains no-fact; instruction delivery remains `NORMAL`.
   - Dreamer/Vortox three-state matrix remains unchanged.
   - terminal adapters still derive only from terminal envelope and terminal pre-state.

2. Design 3.1 security contracts: `PASS`
   - `InternalResolvingMathematicianContext` remains complete and module-private.
   - the public resolver remains exactly `resolveFirstNightMathematicianTrueCountFromState(stateBeforeResolution: unknown)`.
   - caller-supplied ledger, context, source, task, window, instance, roster and override remain prohibited.
   - canonical base, Philosopher-gained V1, Philosopher-gained V2 and explicit ability-instance identities remain frozen.
   - `MathematicianCountResolution` variants, exact keys, classification completeness and count constraints remain frozen.
   - the four-override exact-shape carrier remains internally constructed and unchanged.

3. Open generic evidence removal: `PASS`
   - `DOMAIN_RECORD` is absent from the evidence union.
   - no replacement `recordType:string`, `recordId:string`, `metadata:unknown` or other open record family exists.
   - textual mentions of `DOMAIN_RECORD` only state that it is deleted or prohibited.

4. Closed evidence union: `PASS`
   - the union contains exactly 16 top-level variants:
     `SOURCE_EVENT`, `TASK`, `ACTION_OPPORTUNITY`, `ABILITY_IMPAIRMENT`, `ROLE_TENURE`, `CHARACTER_STATE`, `PLAYER_ROLE_AT_REVISION`, `PHILOSOPHER_GRANT`, `FIRST_NIGHT_TASK_INSERTION`, `SNAKE_CHARMER_RESOLUTION`, `EVIL_TWIN_PAIR`, `WITCH_PENDING_MARKER`, `CERENOVUS_INSTRUCTION`, `CLOCKMAKER_DELIVERY`, `DREAMER_DELIVERY`, and `SEAMSTRESS_DELIVERY`.
   - `FIRST_NIGHT_TASK_INSERTION` uses a closed nested V1/V2 union with exact branch keys and no optional grant field.

5. Exact shapes: `PASS`
   - all 16 top-level variants have complete exact-key arrays.
   - V1 and V2 insertion-generation branches have separate exact-key arrays.
   - no placeholder, ellipsis type, free-form record type or undefined custom contract remains.

6. Primary identities: `PASS`
   - every variant has one deterministic primary identity.
   - `PLAYER_ROLE_AT_REVISION` is explicitly `(playerId, characterStateRevision)`.
   - insertion identity is `(generation.kind, taskId)`.
   - Dreamer and Seamstress use terminal event ID only.
   - no secondary delivery aliases are introduced.

7. Canonical sources: `PASS`
   - accepted identities match current production contracts:
     Evil Twin `pairId`, Witch `pendingDeathId`, Cerenovus `deliveryId`, Clockmaker `deliveryId`.
   - Dreamer and Seamstress payloads have no independent delivery ID, and the design correctly binds them to the terminal envelope event ID.
   - Philosopher grants and insertions bind to the stored accepted grant/insertion chains.
   - Snake resolution binds to the terminal event ID and accepted choice/payload chain.
   - no new accepted ID is invented.

8. Per-variant fact cross-links: `PASS`
   - all 16 variants specify their relation to the fact, terminal event, accepted payload and pre-event canonical record.
   - source event ID/type/sequence/batch and detected sequence are fully bound.
   - task ID/type, opportunity task/source, impairment source/cause/revision, tenure source/revision/status, character revision, role snapshot and all role-specific records are explicitly cross-linked.
   - evidence validation is required to reject missing, multiple, conflicting or mismatched canonical records.

9. `PLAYER_ROLE_AT_REVISION`: `PASS`
   - primary identity is explicitly `(playerId, characterStateRevision)`.
   - canonical key is `<playerId>@revision-<characterStateRevision>`.
   - same player at different revisions is legal.
   - same player and revision with conflicting role data is rejected.
   - ordering is player ID code-unit first, numeric revision second.

10. Terminal adapter evidence sets: `PASS`
    - minimum evidence is frozen separately for Philosopher defer/grant, all Snake terminals, Evil Twin, both Witch terminals, Cerenovus, Clockmaker, Dreamer and Seamstress.
    - gained and explicit provenance add their mandatory conditional evidence.
    - missing required evidence, unallowed extra kinds and conflicting identities fail closed.
    - adapters have no implementation-time choice over evidence composition.

11. Witch temporal safety: `PASS`
    - `WitchDeathPendingMarked` references only the accepted current pending-death marker.
    - `WitchIneffectiveResolved` explicitly prohibits `WITCH_PENDING_MARKER` and future nomination/death evidence.
    - `PENDING_TRIGGER` cannot cite future history.

12. Dreamer/Vortox safety: `PASS`
    - proven effective Vortox requires real player-role and tenure evidence.
    - unresolved applicability records only evidence actually present.
    - a missing or conflicting Vortox tenure is not synthesized.
    - Dreamer’s frozen classification matrix is unchanged.

13. Duplicate, conflict and ordering: `PASS`
    - a complete fixed kind rank is supplied.
    - same kind plus same primary identity plus canonical equality is deduplicated.
    - same kind plus same primary identity plus different content throws `InvalidFirstNightAbilityOutcomeEvidence`.
    - different kinds do not share identity merely because a string value matches.
    - sorting uses explicit code-unit or numeric comparison and is independent of input order.
    - `localeCompare`, locale collation, time, randomness and raw JSON semantic equality remain prohibited.

14. Fail-closed behavior: `PASS`
    - illegal accepted-history invariants produce the frozen DomainErrors and no fact.
    - only rule-authorized evidence insufficiency may produce `UNRESOLVED`.
    - absent canonical records are never replaced by fabricated evidence.
    - resolver classification remains complete and state-bound.

15. Self-contained implementation authority: `PASS`
    - Design 3.2 includes the complete behavior, type, exact-shape, identity, evidence, context, resolver, validation, error, export, projection and test contracts.
    - implementation does not require Design 3.1 or an earlier round to recover missing fields.
    - no mapping or security-critical identity is delegated to implementer judgment.

16. Scope and compatibility: `PASS`
    - accepted event/payload/batch/receipt/settlement contracts remain unchanged.
    - `MATHEMATICIAN_INFORMATION` remains fail closed and unsettled.
    - no Mathematician delivery or private number is designed.
    - 2B18B and 2B19 remain out of scope.
    - coverage correctly remains `PARTIAL`.

findings:
- No blocking design defect remains.
- The sole Design 3.1 blocker is closed: evidence is now a closed union with exact per-variant shapes, identities, canonical sources, fact cross-links and terminal-specific minimum sets.
- The actual accepted ID fields in production code match the identities frozen by Design 3.2.
- Dreamer and Seamstress correctly avoid invented delivery IDs.
- The prior behavior, instance, count, override and public API contracts did not regress.

remainingBlockers:
- `[]`

RULE_DESIGN_PASS
