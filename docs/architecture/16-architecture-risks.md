# Architecture Risks

## Active Risks

| Risk | Severity | Architecture Response |
| --- | --- | --- |
| `PARTIAL` roles may miss branches | Medium | Role implementation gate requires targeted tests first |
| AI may see hidden truth | High | Projection-only AI gateway plus leakage tests |
| LLM output may become truth | High | AI output is candidate command only |
| Dynamic rule scheduling may be wrong after role changes | High | Separate `ScheduledTask`, `ActionOpportunity`, `EventSubscription`, and `ContinuousRule` models |
| Effect suppression/resume may lose history | High | `EffectInstance` lifecycle with source, suppression, resume, and removal fields |
| Vortox false information may need per-role solving | Medium | Role-specific false-candidate builders, keep `OQ-V2-004` open |
| Storyteller decisions may become arbitrary | High | Legal candidates and final choice must be logged |
| Victory resolution may depend on code order | High | Collect `VictoryCandidate` values before resolving |
| Save/replay may leak truth | High | Replay modes generated from projections; truth review is explicit |
| Stale AI response may apply to old state | High | Single-writer session plus `expectedGameVersion` revalidation |
| Hidden options may reveal truth | High | Separate visible options from hidden validation and Storyteller legal candidates |
| Snapshot may become competing truth source | High | Domain event log authority ADR; snapshot is rebuildable cache |
| Test count may hide coverage gaps | Medium | Coverage status remains role-specific |
| Documentation count conflict: 51 vs 76 tests | Low | Treat 76 as current authority and record cleanup |

## Phase 2 Blocking Status

No implementation-level architecture blocker remains after Phase 2.1 documents are accepted. AI implementation remains blocked until projection leakage tests, hidden-candidate tests, single-writer command validation, and AI command validation exist.

## Risk Controls

- Keep rules baseline immutable during implementation.
- Keep role metadata and implementation readiness separate.
- Require deterministic random records.
- Require replay reconstruction tests.
- Require explicit migration tests before save format changes.
- Keep Storyteller policy deterministic or fully audited when random.
