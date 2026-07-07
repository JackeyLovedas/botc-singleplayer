# Archive Policy

## Current Decision

The repository tracks Markdown rule, test, architecture, and governance documents. ZIP handoff bundles remain in the local workspace but are excluded from Git by `.gitignore`.

## Excluded Local Archives

| Path | Reason |
| --- | --- |
| `botc-singleplayer-project-handoff-v1.zip` | Root handoff bundle duplicates tracked `project-handoff/` Markdown content |
| `project-handoff/archives/phase-one-research-package-v2.zip` | Research package has equivalent Markdown handoff and rule/test files in `project-handoff/` |
| `project-handoff/archives/phase-one-v2.1-patch.zip` | Patch archive has equivalent v2.1 Markdown files in `project-handoff/` |
| `botc-singleplayer-project-handoff-v1.sha256` | Hash belongs to excluded local ZIP bundle |

## Included Materials

- `AGENTS.md`
- `README.md`
- `.gitignore`
- `project-handoff/`
- `docs/architecture/`
- `docs/repository/`

## Rules

- Do not commit large binary archives when equivalent Markdown source is tracked.
- Do not delete local archives during repository bootstrap.
- Do not use Git LFS unless a future phase introduces required large binary assets.
- Keep final rule and architecture Markdown documents versioned.
