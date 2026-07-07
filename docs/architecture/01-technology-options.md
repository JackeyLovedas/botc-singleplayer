# Technology Options

## Evaluation Criteria

- Windows local application support.
- Strong test tooling for deterministic rule logic.
- Good support for append-only events, snapshots, JSON schemas, and local persistence.
- Clean separation between domain kernel, UI, AI gateway, and storage.
- Practical AI provider integration without giving AI access to canonical state.
- Low operational complexity for a single-player local game.

## Options Considered

| Option | Shape | Strengths | Weaknesses | Fit |
| --- | --- | --- | --- | --- |
| TypeScript domain core + Electron desktop + SQLite | Node runtime, later desktop shell, typed domain package | Strong schema tooling, easy event serialization, good test runners, natural AI API integration, UI can reuse types later | Electron is heavier than native UI; must enforce domain/UI boundaries | Recommended |
| TypeScript domain core + Tauri desktop + SQLite | TypeScript UI with Rust shell | Smaller desktop shell, good Windows packaging | Rust boundary adds complexity before rules engine exists; two-language debugging | Good later candidate |
| C#/.NET + WPF/WinUI + SQLite | Native Windows stack | Mature desktop packaging, strong typing, good local storage | AI tooling and rapid schema/event iteration less direct; UI may influence domain too early | Good if native Windows is the main priority |
| Python + PySide6 + SQLite | Python rules engine and desktop UI | Fast prototyping, simple local scripting | Weaker compile-time model guarantees; harder to keep large domain model disciplined | Acceptable for prototype, not preferred |
| Godot or Unity | Game engine first | Strong visual/game packaging | Overfits presentation; rules engine, replay, AI isolation, and data model become secondary | Not recommended for Phase 2 target |
| Web app only | Browser-local app | Simple UI iteration | Windows local packaging, file storage, and AI/provider isolation need extra decisions | Not sufficient alone |

## Recommended Stack

Recommended primary stack:

- Language: TypeScript.
- Domain runtime: Node-compatible TypeScript package.
- Desktop shell later: Electron, with Tauri kept as a revisit option after the domain kernel stabilizes.
- Persistence: SQLite for local save metadata, event log, snapshots, and replay indexes.
- Data format: versioned JSON records validated at module boundaries.
- Tests: unit, property-style, golden replay, projection-leakage, migration, and deterministic-seed tests.

## Rationale

The hard part of this project is not rendering UI. It is rule correctness, hidden information isolation, dynamic night tasks, and reproducible replay. TypeScript gives a single language for domain, future UI, projection schemas, AI gateway contracts, and test fixtures. SQLite keeps persistence local, inspectable, and versionable without introducing a service.

Electron is recommended only as the later desktop container, not as the architectural center. The domain kernel must run without Electron so tests and simulations can execute headlessly.

## Revisit Triggers

- Switch to Tauri if packaged size and memory become the dominant issue after the domain kernel is stable.
- Switch to .NET only if native Windows integration becomes more important than rapid event/schema iteration.
- Add a separate Python analysis harness only for offline simulation if TypeScript test tooling proves insufficient.
