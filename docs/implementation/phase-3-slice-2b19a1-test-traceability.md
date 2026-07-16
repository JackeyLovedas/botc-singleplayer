# Phase 3 Slice 2B19A1 Rule-to-Test Traceability

Primary authority is frozen by `docs/implementation/phase-3-slice-2b19a1-design.md`. Each criterion below has one named primary test or gate; secondary assertions do not replace that authority.

| Criterion | Primary layer | Primary authority |
|---:|---|---|
| 1 | ACCEPTED_STREAM_INTEGRATION | `[2B19A1-01] keeps V1-plan Dreamer generation byte-shaped as V1` |
| 2 | LEGACY_REPLAY_COMPATIBILITY | `[2B19A1-02] replays an accepted V1-plan plus V1 opportunity stream` |
| 3 | LEGACY_REPLAY_COMPATIBILITY | `[2B19A1-03] replays V2-plan legacy V1 Dreamer history without migration` |
| 4 | ACCEPTED_STREAM_INTEGRATION | `[2B19A1-04/11] opens and replays the accepted base Dreamer V2 opportunity` |
| 5 | STRUCTURAL_VALIDATION | `[2B19A1-05/14] rejects malformed Dreamer V2 payload structures fail closed` |
| 6 | PURE_POLICY_SEAM | `[2B19A1-06] round-trips canonical base Dreamer V2 opportunity identities` |
| 7 | STRUCTURAL_VALIDATION | `[2B19A1-07] rejects every noncanonical base Dreamer V2 opportunity identity alias` |
| 8 | PURE_POLICY_SEAM | `[2B19A1-08/10] derives exact source and base ability identity through the pure builder seam` |
| 9 | HOSTILE_REPLAY_REJECTION | `[2B19A1-09] rejects Dreamer V2 tenure, ability-instance, and revision provenance tampering` |
| 10 | PURE_POLICY_SEAM | `[2B19A1-08/10] derives exact source and base ability identity through the pure builder seam` |
| 11 | ACCEPTED_STREAM_INTEGRATION | `[2B19A1-04/11] opens and replays the accepted base Dreamer V2 opportunity` |
| 12 | HOSTILE_REPLAY_REJECTION | `[2B19A1-12/13] rejects duplicate task identities and V1/V2 same-task mixing in both orders` |
| 13 | HOSTILE_REPLAY_REJECTION | `[2B19A1-12/13] rejects duplicate task identities and V1/V2 same-task mixing in both orders` |
| 14 | STRUCTURAL_VALIDATION | `[2B19A1-05/14] rejects malformed Dreamer V2 payload structures fail closed` |
| 15 | ACCEPTED_STREAM_INTEGRATION | `[2B19A1-15/16/18] fails OPEN V2 submission receipt-free without state or ledger effects` |
| 16 | ACCEPTED_STREAM_INTEGRATION | `[2B19A1-15/16/18] fails OPEN V2 submission receipt-free without state or ledger effects` |
| 17 | PROJECTION | `[2B19A1-17] keeps player and AI private projections unchanged when V2 opportunity opens` |
| 18 | ACCEPTED_STREAM_INTEGRATION | `[2B19A1-15/16/18] fails OPEN V2 submission receipt-free without state or ledger effects` |
| 19 | ACCEPTED_STREAM_INTEGRATION | Existing V1 GOOD-target, EVIL-target, deterministic-rejection, metadata-failure, and accessor tests, reached through accepted V2-plan legacy V1 opportunity replay |
| 20 | CROSS_PLATFORM_CI | Required exact feature-head Ubuntu and Windows CI; pending publication |

Additional application authority: `fails gained Dreamer V2 opening receipt-free and opens base Snake Charmer opportunities` covers the exact gained-open unsupported boundary, same-command retry, and no event/receipt mutation.

Current local direct/integration status: criteria `1–19` pass; criterion `20` is pending exact feature-head CI. Dreamer remains `PARTIAL`; no unsupported V2 target or delivery claim is made.
