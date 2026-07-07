# Open Decisions

## Decisions Locked By Phase 2.1

| Decision | Recommended Default | Why It Matters |
| --- | --- | --- |
| TypeScript-first domain stack | Accepted | Avoids starting code in the wrong ecosystem |
| Electron as later shell, not immediate UI work | Accepted | Keeps Phase 3 focused on domain rules |
| SQLite for local persistence | Accepted | Needed before save/replay implementation |
| Event-sourced domain state with periodic snapshots | Accepted | Needed for replay, audit, and debugging |
| Root project `AGENTS.md` | Created | Provides durable project instructions before Phase 3 |
| Single-writer game session | Accepted | Prevents stale AI and concurrent write corruption |
| Orthogonal information evaluation | Accepted | Handles drunk/poisoned, registration, and Vortox combinations |
| Rule task separation | Accepted | Prevents passive and continuous abilities from being modeled as night tasks |

## Decisions Needed Before Role Implementation

| Decision | Default |
| --- | --- |
| How to represent role capability modules in code | Metadata plus typed hooks |
| How to maintain role coverage status | Separate rule coverage manifest from implementation status |
| How to handle `PARTIAL` roles | Add tests first, then implement |
| How to solve composite Vortox false information | Start with role-specific false-candidate builders |

## Decisions Needed Before AI Work

| Decision | Default |
| --- | --- |
| AI provider abstraction | Provider adapter behind AI gateway |
| AI replay behavior | Replay stored commands, never re-call model |
| AI memory storage | Per-player memory with projection hash audit |
| Discussion budget | Turn-based budget with summaries and anti-silence checks |

## Decisions Needed Before UI Work

| Decision | Default |
| --- | --- |
| Live truth visibility | Player UI uses projections only |
| Truth review entry point | Explicit post-game mode |
| Replay export levels | Public, player-perspective, truth |
| Save file warnings | Mark files as containing hidden truth if exported raw |

## Still Open From Rules Baseline

- `OQ-V2-001`: non-standard sandbox mode and Pit-Hag pool-outside roles. Keep out of standard first release.
- `OQ-V2-004`: Vortox composite false candidate solving strategy. Keep as implementation design detail, not a Phase 2 blocker.
