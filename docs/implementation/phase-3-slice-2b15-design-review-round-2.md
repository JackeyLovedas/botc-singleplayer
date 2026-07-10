RULE_DESIGN_FIX_REQUIRED

Reviewed exact `main@5059b49b2e7da4c6550ae513cf660f84abcb98f3`; worktree clean. Mandatory sources were available and consistent, so this is not `HUMAN_BLOCKED`. Official rules confirm that impaired once-per-game use is spent, impairment may still receive true information, and effective Vortox requires false information even when the Seamstress is impaired. [Seamstress](https://wiki.bloodontheclocktower.com/Seamstress), [States](https://wiki.bloodontheclocktower.com/States), [Vortox](https://wiki.bloodontheclocktower.com/Vortox), [Philosopher](https://wiki.bloodontheclocktower.com/Philosopher).

Required one-pass corrections:

1. `NOT_PROVEN` candidate legality remains internally impossible. The required `legalCandidateIds` array at [phase-3-slice-2b15-design.md:463](C:/Users/wjl/Documents/血染钟楼/docs/implementation/phase-3-slice-2b15-design.md:463) must either include or omit the false candidate, thereby asserting exactly what line 475 forbids asserting. Replace it with an explicit legality-knowledge union, for example:

   - `COMPLETE`: exact legal IDs.
   - `PARTIAL`: known-legal IDs plus unresolved IDs.

   Then require:

   - Vortox: complete, false only, false selected.
   - `KNOWN_INEFFECTIVE`: complete, both legal, true selected.
   - `NOT_PROVEN`: partial, true known legal, false unresolved, true selected.

   In the same edit, qualify line 452: only a represented impairment affecting the current Vortox player and Vortox tenure disables the constraint. A Seamstress-source impairment never disables Vortox; test 27 must retain that assertion.

2. `RoleTenureId` is still not exactly implementable. Lines 269–293 describe intent but provide no formatter/parser grammar or unique inputs for initial acquisition and reacquisition. Current code contains no `RoleTenureId`; `GameState` retains the `CharactersAssigned` payload but not its envelope identity. The revision must specify:

   - Exact initial-tenure ID inputs and textual grammar.
   - Exact transition/reacquisition fact type, identity and next revision.
   - Exact parser and validation equality.
   - How the replay projection retains the starting fact identity and proves continuity over `[N,M]`.
   - Whether test 22 is a pure reducer test over a precisely defined fact or uses an existing canonical event; adding an otherwise out-of-scope general character-transition flow would break boundedness.

   Also resolve Philosopher collision explicitly: existing `formatPhilosopherGrantId` is only seat + chosen role, while v2 derives the ability instance solely from `grantId`. Either version the grant ID to include the source tenure or include both tenure and grant ID in the ability-instance formula.

3. Scenario 7 is overclaimed. Section 2 correctly marks R13 partial because later-night opportunity creation is absent, but section 13 includes scenario 7 among fully covered scenarios. Move scenario 7 to partial; only the non-spend/unspent-entitlement portion is implemented.

The remaining design is sound: exact V1/V2 discrimination, public pre-assignment capability, hidden-state command/receipt/event-count non-oracle behavior, truth-favoring delivery, No Dashii restraint, N/M field ownership, atomic event chain, and source-only multi-entry historical projection are adequately specified. The slice remains a bounded vertical slice only if correction 2 does not introduce a general lifecycle subsystem.
