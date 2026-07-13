# Phase 3 Slice 2B18B Test Traceability

> Status: final-review repair round 1 local semantic coverage and all local gates are complete. `Original-140` passed on the prior frozen head; the future repair head still requires its own exact-head Ubuntu/Windows CI and independent final code/rule review.

Authority: `docs/implementation/phase-3-slice-2b18b-design-round-3.md` (`066be05f5ee8c0fccb83b00fd8471e439e7e6d2c8c8366af8c86aebceac0a792`). Repair authority: the ten blocker groups in `docs/implementation/phase-3-slice-2b18b-final-review-repair-round-1.md` (`6933ce65cd6b6a149fa8eaa18d2a6246fd6862080e1b34c65b8dbb24a78e4157`). Primary suite: `packages/application/src/mathematician-information.test.ts` (`422 / 422` at this checkpoint).

## Exact authority accounting

| Authority set | Total | Local DIRECT/INTEGRATION | External gate | Uncovered |
|---|---:|---:|---:|---:|
| Original | 140 | 139 | 1 (`Original-140`, prior head passed; repair head pending) | 0 |
| Option A | 45 | 45 | 0 | 0 |
| Round 3 | 40 | 40 | 0 | 0 |
| Total | 225 | 224 | 1 | 0 |

`Original-140` passed for prior frozen head `8b273eec34502906d6c2aa12031c4065ec97725c` through exact-head push CI `29251259989` and PR CI `29251425251`, both `SUCCESS`. It is not inherited by the not-yet-created repair head; that future head requires fresh exact-head CI. All other authority IDs have a named direct assertion or accepted-stream/application/replay integration assertion. Runner count is supporting evidence only and is not substituted for this semantic mapping.

## Final-review repair round 1 mapping

| Review blocker | Production contract | Direct regression evidence |
|---|---|---|
| Branded canonical context | private unique-symbol brand; only accepted-stream and replay-pre-event builders; shared derivation core; raw state resolver removed | `[R1-CONTEXT-01]` plus existing Layer A/C differential cases |
| Layer B exact result | successful fingerprint and five closed failure codes | `[R1-LAYER-B-02]`, `[R1-LAYER-B-03]` |
| Delivery evidence identity | branded ID/count types, canonical delivery/task generation round-trip, source and terminal links | `[R1-EVIDENCE-04]` |
| 13-slot evidence matrix | Math-specific canonicalizer; non-Math rank path unchanged | `[R1-EVIDENCE-05]`, `[R1-EVIDENCE-05B]`, accepted BASE/V1/V2 and impairment/Vortox replay cases |
| Known-impaired Vortox evidence | carried Vortox role, active tenure, represented impairment | `[R1-VORTOX-07]` |
| Continuous-tenure applicability | source and Vortox stale prior-tenure impairments fail closed | `[R1-TENURE-08]`, `[R1-TENURE-09]` |
| Target before Option A | target existence/type is captured before inventory classification | `[R1-TARGET-10]` |
| Payload ordering and identity | same-seat player code-unit order, supporting-fact order, Vortox player/seat/role/tenure/impairment cross-links | `[R1-PAYLOAD-06]`, `[R1-VORTOX-07]` |

The repair changes no authority count: it closes implementation/test gaps identified by independent review rather than adding rule claims. Final-review acceptance remains pending and is not inferred from these local tests.

## Original 1–140

- `1–10`: complete/sparse/invalid/duplicate/input-immutability stream checks, root-export absence, and `[ORIGINAL-10]` pipeline-fingerprint mismatch.
- `11–18`: `[LEDGER-COUNT-11..15]`, `[LEDGER-WINDOW-16..17]`, and accepted ledger partition/window assertions.
- `19`: `[ORIGINAL-19]` same-player abnormal deduplication.
- `20`: `[ORIGINAL-20]` two-player count.
- `21`: `[ORIGINAL-21]` redundant same-player unresolved fact.
- `22–27`: unresolved/pending/source partitions plus `[ORIGINAL-26]` non-vacuous own-instance exclusion and earlier-other-player eligibility.
- `28–34`: effective base provenance plus the accepted duplicate-holder drunk path and hostile impairment/source rejection.
- `35–43`: accepted V1/V2 gained chains, exact grant/insertion/opportunity/revision/seat contracts, mixed-generation rejection, and receipt-bearing non-next behavior.
- `44–55`: exact numeric domain, truth/false candidate policy, impairment policy, and sparse/out-of-range/duplicate candidate rejection.
- `56`: accepted effective Vortox false requirement.
- `57`: `[ORIGINAL-57]` accepted V2 gained chain with duplicate-holder drunkenness under Vortox.
- `58–59`: poison/Vortox semantic and exact fact-evidence paths.
- `60`: `[ORIGINAL-60]` missing active Vortox tenure unresolved.
- `61`: `[ORIGINAL-61]` conflicting current Vortox identities unresolved.
- `62–65`: Vortox projection, V2 base-first ordering, and earlier normal/drunk temporal count behavior.
- `66`: `[ORIGINAL-66]` earlier Vortox-false holder counted later.
- `67–69`: frozen upper window and historical projection non-recomputation.
- `70`: `[ORIGINAL-70]` multiple gained tasks ordered by stable source-seat insertion order.
- `71–89`: actor, validation, receipt, two-event/version/phase, unresolved, dependency, metadata, append, and idempotency contracts; unexpected dependency coverage is `[APP-DEPENDENCY-86]`.
- `90–108`: legal pair replay plus naked/reversed/mixed/tampered/sparse/duplicate hostile batch and replay cases.
- `109–110`: effective and drunk terminal fact/cause paths.
- `111`: `[ORIGINAL-111]` exact pre-event poisoned false fact/cause seam.
- `112–115`: Vortox fact cause, effective-false rejection, missing evidence rejection, and `[VORTOX-115]` Vortox truth rejection.
- `116–131`: temporal fact visibility, exact source/AI/other-viewer projection non-leakage, stored tamper rejection, and later role/ledger non-recomputation.
- `132–139`: accepted 2B18A, Clockmaker, Dreamer, Seamstress, Cerenovus, Snake Charmer, Philosopher V1/V2, and projection regression suites.
- `140`: `PASSED_PRIOR_HEAD`; push/PR CI `29251259989 / 29251425251` proved frozen-head Ubuntu/Windows equality for `8b273eec...`. Fresh CI remains required for the future repair head.

## Option A 1–45

- `1–9`: `[V1-BASE-01..09]` V1 base-only plan, settlement, fact, replay, and projection.
- `10–18`: `[V1-CSI-01..08]`, `[V1-APP-09]`, `[V1-RSP-10]`, and `[V1-PROJ-11]` gained-only contracts.
- `19–34`: `[V1-DUP-01..23]` validated V1 duplicate inventory, exact unsupported diagnostic/public failure, receipt-free/no-event/no-state-change/retry/rebuild/projection behavior, and exact Layer C replay error.
- `35–40`: V2 base/gained success, base-first duplicate ordering, later-read/earlier-no-future temporal behavior.
- `41`: `[OPTION-A-41]` canonical task-ID tie-break for equal gained-task order keys.
- `42`: mixed V1/V2 canonical invalidity.
- `43`: `[OPTION-A-43]` later base-holder role change does not rewrite validated historical V1 duplicate support classification.
- `44`: `[OPTION-A-44]` supported gained-only inventory is classified before settlement-source invalidity rejects.
- `45`: `[CLASSIFIER-45]` classification ignores noncontractual latest-holder-count noise.

## Round 3 additional 1–40

- `1–7`: accepted Layer A/Layer C equality over payload, candidate, source, impairment/Vortox, and Option A classification for BASE/V1/V2/duplicate histories.
- `8–15`: delivery applies while pending, fact exists before settlement, settlement follows, naked/reversed batches reject, and Layer C uses only pre-event state plus current event.
- `16–20`: exact pre-state upper boundary, early/current-event window tampering rejection, and own-delivery exclusion.
- `21–23`: package root lacks state, ledger, and replay resolvers.
- `24`: `[ROUND3-24]` application calls event-stream Layer A and delegates prospective validation to Layer B.
- `25`: `[ROUND3-25]` event applier routes Math delivery only through Layer C.
- `26`: `[ROUND3-26]` rebuild loop has no Layer A call.
- `27`: `[ROUND3-27]` Layer C has neither EventStore nor complete-stream access.
- `28–32`: terminal type closure, SOURCE_EVENT support, Math terminal mapping, no settlement duplicate fact, and exact fact shape.
- `33`: `[ROUND3-33]` complete normal/drunk/poison/Vortox cause matrix.
- `34`: gained information does not fabricate a terminal action opportunity.
- `35–36`: V1 base-only and gained-only supported by the required layers.
- `37–38`: V1 base-plus-gained Layer A unsupported and Layer C exact DomainError.
- `39`: V2 base-plus-gained base-first support across Layer A/Layer C.
- `40`: accepted V1 order and generation remain unchanged without migration.

## Completion boundary

Local semantic and repair-contract gaps: `0`. External gate: fresh exact-head CI for the future repair commit; `Original-140` is already complete only for the prior reviewed head. Coverage status remains `PARTIAL`; this traceability does not implement other-night behavior, general poison production, Travellers, free Storyteller choice, broader character/alignment/death interactions, or general dawn reset. The prior verdicts remain `CODE_REVIEW_FIX_REQUIRED / RULE_REVIEW_FIX_REQUIRED`; no new pass verdict, merge authorization, or acceptance is claimed here.
