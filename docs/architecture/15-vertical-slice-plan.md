# Vertical Slice Plan

## Purpose

This is the recommended next minimal path after Phase 2 is reviewed. It is not authorization to start Phase 3 in this stage.

## Slice 1: Domain Event Spine

Scope:

- Define minimal command and event contracts.
- Apply events to canonical state.
- Rebuild state from event log.
- No UI, no AI, no role abilities.

Acceptance:

- A short event log rebuilds the same canonical state every time.
- Invalid event ordering is rejected by tests.

## Slice 2: Basic Phase Flow

Scope:

- Create game.
- Advance setup placeholder to first night, first day, nomination, vote, execution, night.
- Track public phase and day/night counters.

Acceptance:

- One basic day/night cycle is testable.
- Execution and death remain separate events.

## Slice 3: Command Validation Surface

Scope:

- Validate nomination, vote, execution, and phase commands.
- Reject illegal actor and phase commands.
- Record rejected commands as audit, not domain facts.

Acceptance:

- Dead player nomination rejection is tested.
- Ghost vote consumption behavior is testable.

## Slice 4: Projection Safety

Scope:

- Build public projection and one player projection from canonical state.
- Add forbidden-field leakage tests.

Acceptance:

- Player projection does not contain hidden assignments, truth statuses, or hidden effect causes.

## Slice 5: Seeded Setup Prototype

Scope:

- Use current Sects & Violets role pool data.
- Generate a legal 12-player setup with fixed seed.
- Keep setup, assignment, and demon bluffs separate.

Acceptance:

- Same seed and constraints produce the same result.
- Custom script pool shortage reports an error instead of silently adding roles.

## Slice 6: One Verified Interaction

Scope:

- Choose a narrow `VERIFIED_CORE` interaction only after Slice 1-5 pass.
- Recommended first candidate: nomination, voting, execution, and Evil Twin victory check, because it stresses execution/victory separation without broad night scheduling.

Acceptance:

- Uses existing test ids.
- Does not introduce `PARTIAL` role implementation.

## Stop Conditions

- Stop if a rule conflict appears.
- Stop if projection leakage is detected.
- Stop if a slice needs UI or AI to pass.
- Stop before adding broad role ability coverage.
