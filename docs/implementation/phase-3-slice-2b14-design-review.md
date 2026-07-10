RULE_DESIGN_PASS

> The independent reviewer was read-only. This verdict authorizes implementation only of the exact materialized design at `docs/implementation/phase-3-slice-2b14-design.md`; it does not authorize scope changes or begin implementation by itself.

Reviewed revisions:

- Main: `c23038b28e103fcfb353c63558dc14627fa74cd5`, matching `origin/main`, clean worktree, no open PR.
- Evidence: commit `cb98c7ccb071ed7b928d81f1df54d7c4835df516`; blob `8b27ebe03ec26477d53cfe75cb3178b2a13c691e`.
- Design: commit `c23038b28e103fcfb353c63558dc14627fa74cd5`; blob `ac0ef3076d6b8801d1f8d597ecb81dcb9e0ca663`.
- Current main CI run `29071449606` passed all jobs: typecheck, lint, 613 tests, coverage with 613 tests, and the real application command with 3 files/150 tests.

Live source evidence:

- Chinese Wiki homepage is revision `5855`; [女裁缝 oldid 5160](https://clocktower-wiki.gstonegames.com/index.php?title=%E5%A5%B3%E8%A3%81%E7%BC%9D&oldid=5160) is revision `5160`, timestamp `2025-04-30T12:39:42Z`, SHA-1 `7ea2d8a408f8ee842cf411679041d0cecc89c257`. It states that shaking one’s head does nothing and that choosing two players places the lost-ability marker even when drunk or poisoned.
- [Official Seamstress oldid 1999](https://wiki.bloodontheclocktower.com/index.php?title=Seamstress&oldid=1999), SHA-1 `561b0026e390ce3ca24c0ab682774cd033c432cc`, confirms each-night waking, head-shake deferral as a no-op, and ability loss only after pointing to two players.
- [Official States oldid 1039](https://wiki.bloodontheclocktower.com/index.php?title=States&oldid=1039) and [Glossary oldid 2874](https://wiki.bloodontheclocktower.com/index.php?title=Glossary&oldid=2874) explicitly confirm that attempting a once-per-game use while drunk or poisoned still expends it. [Abilities oldid 1376](https://wiki.bloodontheclocktower.com/index.php?title=Abilities&oldid=1376) confirms invalid choices require correction and do not become legal uses.
- The [live nightsheet](https://raw.githubusercontent.com/ThePandemoniumInstitute/botc-release/main/resources/data/nightsheet.json) at repository HEAD `915347e627c3f6cd1f438f82b6001784e11b3e8b` is byte-identical to the [pinned file commit](https://raw.githubusercontent.com/ThePandemoniumInstitute/botc-release/3d6d930a9e600321f93b2567a2e88948a675bc1e/resources/data/nightsheet.json), SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`. It has `firstNight[61] = seamstress` between Dreamer and Steward, and `otherNight[82] = seamstress` between Oracle and Juggler.
- `USER_OVERRIDES.md` contains no approved override. No external-source conflict or unavailable-source condition exists.

Claim conclusions:

- `2B14-C1`: correct. The design claims only the supported first-night subset, Dreamer before Seamstress. Steward, other-night ordering, and the remainder of evidence test 6 remain explicitly unsupported.
- `2B14-C2`: correct. `DEFER` closes and settles only the current wake, records no ability-spent state, and makes no claim of implementing next-night recurrence. Evidence test 3 is mapped only to first-night deferral/non-consumption; recurrence remains unsupported.
- `2B14-C3`: correct. Exact `DEFER` is the sole supported decision. Malformed, extra, hidden, mismatched, unauthorized, and future choice inputs fail closed with no events or ability state. Evidence test 5 is mapped only to this unsupported-input boundary; self-target, count, duplicate-target, and eligibility validation are not claimed.

Design conclusions:

- Opportunity ID, visibility, command, event, and settlement contracts are exact and consistent with the accepted first-night task model.
- Base-role/current-source snapshot and revision checks distinguish base Seamstress from unsupported Philosopher-gained execution.
- The exact two-event deferral batch, replay validation, atomic prospective validation, retry classifications, receipt/idempotency behavior, and deterministic-ID constraints are sufficient.
- No production projection change is proposed; required tests explicitly guard both player and AI views against action, task, source, impairment, and future-choice leakage.
- The affected-file and test plan reaches the required type unions, validators, applier, batch semantics, service boundary, fixtures, rebuild tests, application tests, leakage tests, and unchanged-order regression.
- Coverage remains conservatively `SKELETON`; only the base first-night deferral dimension may be described as partial.

The stale `SV-SEAMSTRESS-DRUNK-DOES-NOT-SPEND` test and matching architecture sentence contradict current external rules. They are repository defects, not an external-source conflict. This design neither implements nor depends on impaired legal use. Its explicit non-goals and `HUMAN_BLOCKED` stop condition before interpreting impaired use are sufficient.

Blockers: none.
