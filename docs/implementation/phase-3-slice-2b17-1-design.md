# Phase 3 Slice 2B17.1 — Clockmaker Validation Hardening

## Bug root cause

Clockmaker used `Array.prototype.every` to detect holes, but that method skips holes. Three semantic checks also compared raw `JSON.stringify` output, making equivalent plain objects depend on property insertion order.

## Dense-array invariant

Every Clockmaker array and tuple must be a standard, own-indexed dense array. Each index from zero through `length - 1` must have an enumerable data descriptor. Extra string or symbol keys, accessors, holes, non-array objects, proxies, cycles, non-plain nested objects, and unsafe numeric values fail closed.

## Canonical-object-comparison invariant

Semantic comparison recursively validates data descriptors, rejects hostile/non-canonical values, confirms proxy rejection with `structuredClone`, sorts plain-object keys by explicit UTF-16 code-unit order, and preserves array order. It does not use locale ordering or raw JSON serialization.

## Affected validation paths

- Clockmaker payload shape and pair/candidate reproduction.
- Complete settlement-time expected-delivery comparison.
- Replay, batch, event-applier, and prospective application validation.
- Stored private-projection delivery collections.
- The public two-Minion distance tuple boundary.

## Unchanged boundaries

Rule claims, candidate domain, Vortox and impairment semantics, event types/order/payload fields, and player projection fields remain unchanged. Clockmaker remains `PARTIAL`; Slice 2B18 is not started.

## Tests and completion criteria

Direct regressions cover all required sparse arrays, partial holes, extra array keys, reversed object insertion order at every relevant nesting level, changed/extra/missing fields, Proxy/revoked Proxy, getter non-execution, symbol keys, cycles, non-plain objects, replay, prospective application validation, stored projection, and existing base/gained/drunk/Vortox/projection behavior. Completion requires focused tests, typecheck, lint, full tests, coverage, diff checks, and forbidden-pattern scans.
