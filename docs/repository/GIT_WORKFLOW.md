# Git Workflow

## Branches

`main` is for reviewed stable project artifacts.

Future feature work should use short-lived milestone branches, for example:

- `phase-3/domain-event-spine`
- `phase-3/basic-phase-flow`
- `phase-3/command-validation`

## Rules

- Do not develop large changes directly on `main`.
- Use one branch per milestone.
- Run the relevant tests before merging.
- Do not force push over `main`.
- Do not commit generated caches, local databases, credentials, or temporary files.
- Use commit SHA values for review references.
- Do not use names such as `final-final`, `(2)`, or `最新版` as version markers.

## Phase Boundary

This repository is currently at Phase 2.1 architecture baseline. Phase 3 starts only after explicit user approval.
