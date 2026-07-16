# Phase 3 Slice 2B19A1 Rule-to-Test Traceability

Primary authority is frozen by `docs/implementation/phase-3-slice-2b19a1-design.md`. Each criterion below has one named primary test or gate; secondary assertions do not replace that authority. Repair Round 1 closes only the authority-matrix blocker recorded verbatim in `docs/implementation/phase-3-slice-2b19a1-final-review-round-1.md`.

| Criterion | Primary layer | Primary authority |
|---:|---|---|
| 1 | ACCEPTED_STREAM_INTEGRATION | `[2B19A1-01] keeps V1-plan Dreamer generation byte-shaped as V1` |
| 2 | LEGACY_REPLAY_COMPATIBILITY | `[2B19A1-02] replays an accepted V1-plan plus V1 opportunity stream` |
| 3 | LEGACY_REPLAY_COMPATIBILITY | `[2B19A1-03] replays V2-plan legacy V1 Dreamer history without migration` |
| 4 | ACCEPTED_STREAM_INTEGRATION | `[2B19A1-04/11] opens and replays the accepted base Dreamer V2 opportunity` |
| 5 | STRUCTURAL_VALIDATION | `[2B19A1-05/14] rejects malformed Dreamer V2 payload structures fail closed`: explicit tables enumerate every top-level, `sourceContract`, and `visibility` key for missing, extra, and wrong-value cases; both visibility arrays receive dense-wrong and sparse-array cases. |
| 6 | PURE_POLICY_SEAM | `[2B19A1-06] round-trips canonical base Dreamer V2 opportunity identities` |
| 7 | STRUCTURAL_VALIDATION | `[2B19A1-07] rejects every noncanonical base Dreamer V2 opportunity identity alias` |
| 8 | PURE_POLICY_SEAM | `[2B19A1-08/10] cross-binds every base source fact and rejects non-base ability identities`: the pure builder rejects task, player, seat, role, and revision source-fact tampering while retaining the exact canonical positive contract. |
| 9 | HOSTILE_REPLAY_REJECTION | `[2B19A1-09] rejects hostile pre-event Dreamer tenure states against accepted history and event replay`: starts from the real accepted application stream, then rejects missing, duplicate, ended, wrong-player, wrong-seat, wrong-role, and wrong-revision hostile pre-event tenure states through both the 2B19T accepted-history guard and the real opportunity event replay. No hand-built state is described as an accepted stream. |
| 10 | PURE_POLICY_SEAM | `[2B19A1-08/10] cross-binds every base source fact and rejects non-base ability identities`: canonical base ability identity remains positive; gained, alias, wrong-kind, wrong-task, and wrong-seat identities are rejected by the payload-validation seam. |
| 11 | ACCEPTED_STREAM_INTEGRATION | `[2B19A1-04/11] opens and replays the accepted base Dreamer V2 opportunity` |
| 12 | HOSTILE_REPLAY_REJECTION | `[2B19A1-12/13] rejects duplicate task identities and V1/V2 same-task mixing in both orders` |
| 13 | HOSTILE_REPLAY_REJECTION | `[2B19A1-12/13] rejects duplicate task identities and V1/V2 same-task mixing in both orders` |
| 14 | STRUCTURAL_VALIDATION | `[2B19A1-05/14] rejects malformed Dreamer V2 payload structures fail closed`: covers top-level null/array/nonplain values, nested null/array/nonplain values, getter, enumerable symbol, cycle, Proxy, unknown schemas, and every frozen missing/extra key without leaking non-domain exceptions. |
| 15 | ACCEPTED_STREAM_INTEGRATION | `[2B19A1-15/16/18] fails OPEN V2 submission receipt-free without state or ledger effects` |
| 16 | ACCEPTED_STREAM_INTEGRATION | `[2B19A1-15/16/18] fails OPEN V2 submission receipt-free without state or ledger effects` |
| 17 | PROJECTION | `[2B19A1-17] keeps player and AI private projections unchanged when V2 opportunity opens` |
| 18 | ACCEPTED_STREAM_INTEGRATION | `[2B19A1-15/16/18] fails OPEN V2 submission receipt-free without state or ledger effects` |
| 19 | ACCEPTED_STREAM_INTEGRATION | Existing V1 GOOD-target, EVIL-target, deterministic-rejection, metadata-failure, and accessor tests, reached through accepted V2-plan legacy V1 opportunity replay. |
| 20 | CROSS_PLATFORM_CI | Initial implementation HEAD `292d4e0dc4d718d2f03928e037eaddf9daed4349` passed push/PR CI `29480909501 / 29480985744`; the future Repair Round 1 HEAD requires fresh exact-head Ubuntu and Windows CI. |

Additional application authority: `fails gained Dreamer V2 opening receipt-free and opens base Snake Charmer opportunities` covers the exact gained-open unsupported boundary, same-command retry, and no event/receipt mutation.

Repair Round 1 local status: the expanded 2B19A1 targeted matrix, typecheck, full lint, full tests, single-fork coverage, diff/scope/static/JSON scans, and authority-hash audit pass with zero production change. The Round 1 authority-matrix finding is closed locally; the active blocker is `PENDING_REPAIR_PUBLICATION_AND_EXACT_HEAD_CI_AND_FINAL_REVIEW`. Dreamer remains `PARTIAL`; no unsupported V2 target or delivery claim is made.
