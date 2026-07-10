# Current Task

## PR #15 Final Repair
- Add `validateStoredDreamerInformationDelivered` in `packages/domain-core/src/dreamer.ts`.
- Validate the stored delivery's exact payload and nested shapes, model/stage/policy versions, GOOD/EVIL catalog snapshots, planned `DREAMER_ACTION`, and matching `ScheduledTaskSettled` task/outcome/revision.
- Do not use latest `currentCharacterState` or `abilityImpairments` to recompute historical Dreamer information.
- Call the stored validator before player or AI projection exposes any Dreamer delivery.
- Reject hidden or extra fields such as `correctRoleId`, `targetTrueRole`, `targetAlignment`, and `storytellerNotes`.
- Add domain validation and projection-tampering tests, including catalog mismatch, nested extra fields, missing/wrong settlement, wrong versions, and AI parity.
- Preserve effective GOOD-target, effective EVIL-target, and source-impaired delivery behavior and projection secrecy.
- Verify that the Windows application test command executes real tests; repair the no-op gate if confirmed.

## Boundaries
- Update the existing PR #15 branch; do not create a second PR.
- Do not merge until independent review and all gates pass.
- Do not begin Slice 2B14.
- Do not implement Vortox, Storyteller free false-role choice, AI target selection, UI, Electron, SQLite, or Seamstress resolution.
