# 2B20B-P2F1R-D0 fixed revision manifest — FIXED_REVISION_MANIFEST_NO_LOCAL_SNAPSHOT

## Manifest identity

- `sliceId`: `2B20B-P2F1R-D0`
- `manifestKind`: `FIXED_REVISION_MANIFEST_NO_LOCAL_SNAPSHOT`
- `sourceCount`: `4`
- `ruleVerdict`: `RULE_READY`
- `fixedRevisionAccess`: `ALL_FIXED_IDENTITIES_LIVE_VERIFIED`
- `localSnapshotCount`: `0`
- `approvedSnapshotCount`: `0`
- `ruleSemanticsChanged`: `false`
- `roleCoverageChanged`: `false`

This manifest records directly readable fixed identities. It is not a local or
approved snapshot, does not contain copied source bodies, and cannot replace an
approved snapshot if a fixed source later becomes unavailable. A future
reviewer must read each live fixed identity directly or stop under
`RULE_SOURCE_UNAVAILABLE` unless a separately approved snapshot with its own
path and hash exists.

## Source 1 — user-approved overrides

- `SourceId`: `D0-SOURCE-01-USER-OVERRIDES`
- `canonicalSource`: `docs/rules/USER_OVERRIDES.md`
- `successfulExactURL`: `git-object://180f3c6200667cb5dd8a4cf3106a0408e09454a9`
- `revision`: containing commit `7b12e707a3015b0c6434f7ff9b8e71458bc90838`; canonical blob OID `180f3c6200667cb5dd8a4cf3106a0408e09454a9`
- `rawBytes`: `11434`
- `rawSHA256`: `2512a55464d7ebab4c5fadd9b7ca1a3a054c3b20b56245c855c69cb17662cb5c`
- `extractedSHA256`: `N/A_NO_SEPARATE_EXTRACTION`
- `exactSupportedClaim`: User-approved overrides remain the highest rule authority; no recorded override applies to D0’s checkout-portability-only boundary.
- `allowedUse`: Determine whether an explicit user override applies and confirm D0 does not alter any override or BOTC semantic claim.
- `prohibitedUse`: Do not infer unrecorded overrides, rewrite an override, or treat a checkout representation as canonical content.
- `classification`: `CANONICAL_LOCAL_GIT_RULE_AUTHORITY`

### Canonical blob versus Windows checkout

| Representation | Bytes | SHA-256 | Line endings | Authority |
|---|---:|---|---|---|
| Canonical Git blob | 11434 | `2512a55464d7ebab4c5fadd9b7ca1a3a054c3b20b56245c855c69cb17662cb5c` | 137 LF, 0 CR | Canonical |
| Default-Windows checkout | 11571 | `9e2b8e9701a35559d9cc67d8c2185d979ec222b3186fa3a9cd16140dd2f68ad5` | 137 CRLF | Diagnostic only |

The Windows checkout hash is intentionally recorded to prevent it from being
misrepresented as the canonical Git-blob hash.

## Source 2 — user-specified Chinese Wiki home

- `SourceId`: `D0-SOURCE-02-CHINESE-WIKI-HOME`
- `canonicalSource`: `https://clocktower-wiki.gstonegames.com/index.php?title=%E9%A6%96%E9%A1%B5`
- `successfulExactURL`: `https://clocktower-wiki.gstonegames.com/index.php?title=%E9%A6%96%E9%A1%B5&oldid=5855&action=raw`
- `revision`: `oldid=5855`; parent `5617`; revision timestamp `2026-01-26T11:51:39Z`
- `rawBytes`: `7071`
- `rawSHA256`: `2a26fff7526bd1b6b20cd0f4044288dd7b348d39a1f933fd65a67c3f242ddb49`
- `extractedSHA256`: `N/A_DIRECT_RAW_REVISION_NO_SEPARATE_EXTRACTION`
- `exactSupportedClaim`: The mandatory user-specified source has a directly readable fixed home-page revision; D0 adds no Chinese-Wiki role or rules claim.
- `allowedUse`: Independently retrieve the fixed revision, verify its bytes, and confirm no conflict with D0’s no-rule-semantics boundary.
- `prohibitedUse`: Do not infer role behavior, night order, impairment semantics, or D0 product behavior from the home page.
- `classification`: `LIVE_FIXED_REVISION_RULE_SOURCE_NO_SNAPSHOT`

## Source 3 — official BOTC Wiki main page

- `SourceId`: `D0-SOURCE-03-OFFICIAL-WIKI-MAIN`
- `canonicalSource`: `https://wiki.bloodontheclocktower.com/`
- `successfulExactURL`: `https://wiki.bloodontheclocktower.com/api.php?action=query&prop=revisions&rvprop=ids%7Ctimestamp%7Ccontent&rvslots=main&format=json&formatversion=2&revids=3035`
- `revision`: Main Page `oldid=3035`; parent `2946`; revision timestamp `2025-12-10T10:19:41Z`
- `rawBytes`: `3093`
- `rawSHA256`: `06745ee02a529a72407dc7753d7f7f6caf9fca9580e0e951c4e225fc14fc02e0`
- `extractedSHA256`: `N/A_API_RESPONSE_IS_THE_HASHED_REVIEW_INPUT`
- `exactSupportedClaim`: The mandatory official Wiki source has a directly readable fixed Main Page revision; D0 adds no official-Wiki role or rules claim.
- `allowedUse`: Independently retrieve the fixed API revision, verify the complete response bytes, and confirm no conflict with D0’s no-rule-semantics boundary.
- `prohibitedUse`: Do not treat the Main Page as evidence for unreviewed role behavior, event semantics, or implementation completeness.
- `classification`: `LIVE_FIXED_REVISION_RULE_SOURCE_NO_SNAPSHOT`

## Source 4 — official nightsheet

- `SourceId`: `D0-SOURCE-04-OFFICIAL-NIGHTSHEET`
- `canonicalSource`: `https://raw.githubusercontent.com/ThePandemoniumInstitute/botc-release/main/resources/data/nightsheet.json`
- `successfulExactURL`: `https://raw.githubusercontent.com/ThePandemoniumInstitute/botc-release/3d6d930a9e600321f93b2567a2e88948a675bc1e/resources/data/nightsheet.json`
- `revision`: last file-changing commit `3d6d930a9e600321f93b2567a2e88948a675bc1e`; file commit timestamp `2026-05-11T12:28:53Z`
- `rawBytes`: `2923`
- `rawSHA256`: `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`
- `extractedSHA256`: `N/A_JSON_COUNTS_AND_ORDER_READ_DIRECTLY_NO_SEPARATE_ARTIFACT`
- `exactSupportedClaim`: The fixed nightsheet contains 80 first-night entries and 99 other-night entries; Dreamer, Seamstress, and Mathematician remain in the previously reviewed order, and D0 changes no night order.
- `allowedUse`: Verify fixed-source availability, full raw-byte identity, entry counts, and preservation of the no-night-order-change boundary.
- `prohibitedUse`: Do not use this manifest as a nightsheet snapshot or claim any unimplemented role behavior or role-coverage promotion.
- `classification`: `LIVE_FIXED_REVISION_RULE_SOURCE_NO_SNAPSHOT`

## Rule-readiness result

All four mandatory source identities are fixed and directly readable at the
recorded identities. No conflict applies to D0 because the slice changes only
test evidence portability and final evidence binding, with no BOTC rule, role,
night-order, impairment, replay, or accepted-history semantic change.

`RULE_READY`
