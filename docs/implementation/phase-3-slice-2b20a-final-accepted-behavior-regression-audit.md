# Phase 3 Slice 2B20A — Final Accepted-Behavior Regression Audit

## Audit identity

- `reviewedHead`: `70ee998a631a347ced5975dc71923a71072fa5cb`
- `acceptedBaseHead`: `5a69c90f2d3947556ff45c15c467902b1e28ca43`
- `exactProductionSymbol`: `packages/domain-core/src/dreamer.ts::resolveBaseDreamerV2NormalCapability`
- `finalReviewFindingCount`: `1`
- `finalReviewBlockerCount`: `1`
- `exactFindingAndBlocker`: `BASE_DREAMER_NON_FANG_GU_NORMAL_AND_REPLAY_REGRESSION`
- `codeVerdict`: `CODE_REVIEW_FIX_REQUIRED`
- `ruleVerdict`: `RULE_REVIEW_FIX_REQUIRED`

The complete independent final review reported exactly one finding and exactly one
remaining blocker. It found no second independent product blocker.

## Accepted behavior

At accepted main `5a69c90f2d3947556ff45c15c467902b1e28ca43`, the base
Dreamer resolver first proves that the current Demon is unique and that the current
character snapshot matches the role catalog exactly. After the existing No Dashii
and Vortox branches, every other healthy exact-match Demon returns
`NORMAL_INFORMATION_SUPPORTED`.

This accepted behavior is role-generic. It includes healthy Fang Gu, healthy
Vigormortis, and every other exact catalog-backed Demon other than Vortox and No
Dashii.

## Regression at the reviewed head

At `70ee998a631a347ced5975dc71923a71072fa5cb`, the final fallback of
`resolveBaseDreamerV2NormalCapability` permits only exact Fang Gu to retain the
healthy normal result. Healthy exact-match Vigormortis and other non-Vortox,
non-No-Dashii Demons fall through to
`EFFECTIVENESS_UNRESOLVED / CURRENT_DEMON_CATALOG_MISMATCH`.

That result is contradictory: the resolver has already proven the exact
state/catalog match before it reaches this fallback. The same resolver is used when
validating stored V2 Dreamer deliveries, so the regression affects both the
reachable application command path and replay validation of previously accepted V2
history.

## Repair-history audit

- Product Repair R1 commit
  `0ab9cbb1d31f46fb989f049b804638b69ee399ba` incorrectly froze a healthy,
  catalog-matching Vigormortis as `CURRENT_DEMON_CATALOG_MISMATCH`.
- Product Repair R2 commit
  `79af6c75149b7a6b04b34329f9d2d338e41c19e9` correctly changed the C34
  mismatch control to a real Fang Gu snapshot/catalog mismatch, but did not restore
  the missing healthy-Vigormortis `NORMAL_INFORMATION_SUPPORTED` control.
- Product Repair is already `2/2`. This restoration therefore uses the
  user-authorized accepted-behavior stop-loss override and does not create Product
  Repair Round 3.

## Authority

The bounded restoration is grounded in:

- the implementation at accepted main
  `5a69c90f2d3947556ff45c15c467902b1e28ca43`;
- `docs/implementation/phase-3-slice-2b19a2-design-round-2.md`;
- `docs/rules/evidence/2B20A-resolved.md`;
- the user authorization
  `USER_AUTHORIZED_2B20A_ACCEPTED_NORMAL_DREAMER_RESTORATION_STOP_LOSS_OVERRIDE_AND_CONDITIONAL_CLOSEOUT`;
- the complete failed final review of PR #46 at
  `70ee998a631a347ced5975dc71923a71072fa5cb`.

This is accepted-behavior restoration. It introduces no new BOTC rule semantics,
new design round, new support claim, or Product Repair round.

## Exact repair boundary

The future implementation boundary is exactly one production file and one
production symbol:

`packages/domain-core/src/dreamer.ts::resolveBaseDreamerV2NormalCapability`

The repair may restore only the healthy source's final normal fallback after the
existing unique-Demon and exact catalog-match gates. It may not move or refactor
earlier impairment handling and may not edit application production code.

## Schemas and unaffected behavior

Affected schemas: none.

The restoration must leave all of the following unchanged:

- No Dashii behavior;
- effective, impaired, and dead Vortox behavior;
- canonical-drunk Fang Gu V7 capability and exact payload;
- represented impairment behavior, including existing POISONED handling;
- gained Dreamer behavior;
- first-night outcome ledger behavior;
- player and AI projection privacy;
- receipts and command idempotency;
- event versions and public APIs;
- V1–V7 replay semantics outside the exact restored fallback.

Dreamer coverage remains `PARTIAL`.

## Final-review blocker disposition

The failed final review's sole blocker is not closed by this audit. It is converted
into a bounded design-release gate:

`PENDING_ACCEPTED_BEHAVIOR_RESTORATION_DESIGN_RELEASE_REVIEW`

Implementation remains unauthorized until an independent reviewer returns the exact
allowed design-review verdict with no remaining blockers. No future commit SHA,
passing review verdict, CI result, PR mutation, or closeout is asserted here.
