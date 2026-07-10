# Project State

## Product
- Repository: `JackeyLovedas/botc-singleplayer`
- Target: offline single-player Sects & Violets, 12 players (1 human + 11 AI), automated Storyteller.
- Phase: Phase 3 controlled vertical slices.
- Rules baseline: Phase One v2.1.

## Accepted Slices
- 2B1 deterministic S&V setup.
- 2B2 roster and character assignment.
- 2B3 first-night own-character knowledge.
- 2B4 first-night task plan.
- 2B5 ordered minion/demon information settlement.
- 2B6 Philosopher action opportunity and defer settlement.
- 2B7 Philosopher ability choice and dynamic task insertion foundation.
- 2B8 Philosopher-gained Snake Charmer non-demon settlement.
- 2B9 Snake Charmer demon-hit swap and poison marker.
- 2B10 base Snake Charmer action and effectiveness gate.
- 2B11 Evil Twin setup and pair knowledge.
- 2B12 Witch target choice and deferred-death marker.

## Current Delivery
- Open PR: `#15` — Slice 2B13 Dreamer action and information skeleton.
- Branch: `phase-3/dreamer-action-information-skeleton`.
- Last audited HEAD: `d7ba16fe7ba626e881055534475276ee1c9be484`.
- PR state at audit: open, non-draft, mergeable; reported Ubuntu and Windows checks green.
- Primary blocker: stored `DreamerInformationDelivered` is projected after settlement-only checks, without full stored-fact validation.
- Gate integrity risk: `@botc/application` has no `test` script while Windows CI invokes `pnpm --filter @botc/application test`; verify and repair before treating that step as evidence.
- Next slice: not authorized until PR #15 passes independent review and is merged.

## Loop Limits
- One open slice PR and one writer at a time.
- At most three reviewer repair rounds per PR.
- At most three completed slices in this goal run.
- Stop on substantive rule uncertainty, unsafe accepted-history rewrite, permissions/credential failure, unresolved merge conflict, repeated identical CI failure, or required test weakening.
