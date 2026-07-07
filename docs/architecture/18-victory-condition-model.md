# Victory Condition Model

## Goal

Victory resolution must be rule-driven. The automated Storyteller may not freely choose the winning team.

## Trigger Events

Run victory checks after:

- Demon death;
- execution resolution;
- night death resolution;
- role or alignment change that changes Demon identity, Demon count, or special win modifiers;
- alive count reaching two;
- Klutz selection;
- Evil Twin good twin execution;
- Vortox day-end no-execution check;
- Pit-Hag arbitrary death window resolution.

## Candidate Collection

The resolver first collects `VictoryCandidate` records before choosing an outcome.

```text
VictoryCandidate(
  candidateId,
  sourceRule,
  sourceEventId,
  winningAlignment,
  losingAlignment,
  blocksOtherWin,
  priorityClass,
  requiredState,
  explanationForTruthReplay,
  publicAnnouncement
)
```

## Priority Classes

| Class | Examples | Rule |
| --- | --- | --- |
| Immediate special win/loss | Evil Twin good twin executed, Klutz chooses Evil | Apply when source rule is active |
| Win blockers | Evil Twin both alive blocks normal Good win | Blocks only the specified normal win |
| Normal Good win | Demon dead | Applies after blockers |
| Normal Evil win | Two alive players | Applies after special checks |
| Vortox day-end win | No execution today | Applies at day-end check |
| Simultaneous candidates | Multiple candidates from same event window | Resolve by explicit rules, not code order |

## Sects & Violets Baseline Cases

- Demon death plus live Evil Twin pair: Evil Twin blocks ordinary Good win and the game continues.
- Good twin executed: Evil wins through Evil Twin.
- Vigormortis-killed Evil Twin: retained good-twin execution win works only while Vigormortis ability remains active; both-live blocker still requires both twins alive.
- Klutz choosing an Evil player: Klutz's team loses at selection resolution.
- Vortox no-execution day: Evil wins at day-end if Vortox ability is active.
- Pit-Hag creates Demon and arbitrary deaths occur: collect candidates after the arbitrary death window resolves.

## Output Events

- `VictoryCheckRequested`
- `VictoryCandidateCollected`
- `VictoryBlocked`
- `VictoryResolved`
- `GameEnded`

## Invariants

- Do not resolve victory by whichever condition appears first in code.
- Do not let Storyteller policy pick a winner when rules already determine one.
- Do not treat registration as actual Demon death or actual alignment change.
- Do not treat execution as death; victory checks may depend on either separately.
- Do not hide victory reasoning from truth replay.
