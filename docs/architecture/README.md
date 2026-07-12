# Current and target architecture

This document separates the application that exists from the product architecture being built. Do not infer future requirements from legacy code structure.

## Current implementation

Mathland is a client-rendered React 18 application built with Vite. It has no committed application backend; progress is stored in browser localStorage.

### Current runtime flow

1. `src/App.tsx` defines lazy-loaded routes inside the legacy `AppShell`.
2. Section-based lessons load from `src/content/lessons/module*/` through `src/utils/lessonLoader.ts`.
3. Beat-format lessons are registered under `src/content/beats/` and render through `/story/:lessonId`.
4. Custom activities resolve through `src/interactive/`; `src/interactive/demos/demo_registry.ts` is the current registry.
5. Progress hooks persist completion-oriented state locally.

### Current source boundaries

- `src/core/` — legacy shell, routes, pages, renderers, hooks, and shared UI
- `src/content/` — legacy lesson content and the beat-format experiment
- `src/interactive/` — mathematical interactives, integration wrappers, and prototypes
- `src/tier2/` — legacy enhanced-static templates
- `src/utils/` — loaders, character metadata, module metadata, and themes

### Current sources of truth

- lesson files: `src/content/lessons/`
- beat experiment: `src/content/beats/index.ts`
- character metadata: `src/utils/characterData.ts`
- module metadata: `src/utils/modulesData.ts`
- interactive registry: `src/interactive/demos/demo_registry.ts`
- routes: `src/App.tsx`
- commands and dependencies: `package.json`

These sources describe the existing application only.

## Target product architecture

The target experience is defined in [../EXPERIENCE_ARCHITECTURE.md](../EXPERIENCE_ARCHITECTURE.md). New prototype code should be isolated under `src/world/` so legacy route and content assumptions do not become accidental constraints.

Proposed initial shape:

```text
src/world/
  atlas/                 territory graph, route state, orientation views
  studio/                learner-action engine and reusable mathematical models
  observatory/           selective phenomenon openings
  cases/                 domain interpretations and assumptions
  detours/               prerequisite diagnosis and return contracts
  evidence/              descriptive learner evidence and retrieval state
  prototype/             first integrated vertical slice
  types/                 territory, case, evidence, and route contracts
```

This is a bounded prototype namespace, not a commitment to a final package layout. Learner evidence may change it.

## Prototype route

Expose the first slice through an explicitly experimental route such as:

```text
/prototype/one-operation-three-worlds
```

The route should not inherit the legacy `AppShell` unless a minimal adapter is required to run. It must not replace learner-facing production routes before validation.

## Target data boundaries

### Territory graph

A territory owns the stable mathematical identity and relationships. It should not duplicate itself for every domain.

Minimum concerns:

- concept identity and notation;
- prerequisite and downstream relationships;
- available cases and Studio sequences;
- Observatory eligibility;
- detour routes and return targets;
- transfer and retrieval prompts.

### Case

A case supplies domain meaning, units, assumptions, data, and interpretation around a shared mathematical structure.

### Evidence

Evidence records observable learner actions such as prediction, construction, explanation, independent use, transfer, and retrieval. It must not import legacy section-completion semantics.

### Route state

Route state preserves the learner's motivating goal, current territory, detour origin, return target, and meaningful resume point.

## Reuse boundary

Legacy assets may be consumed through adapters:

```text
legacy lesson or component → extraction/adapter → world model or renderer
```

Do not let a legacy JSON schema, page component, progress hook, character theme, or registry status become the new domain model.

Prefer reusing:

- mathematically correct calculation logic;
- tested geometry and rendering utilities;
- accessible controls;
- useful case data;
- content excerpts that pass the salvage rubric.

Avoid reusing:

- page composition and navigation assumptions;
- completion semantics;
- eight-section or beat sequencing as fixed architecture;
- decorative character wrappers;
- components whose accessibility cost exceeds replacement.

## Persistence

The first prototype should use local storage behind a small evidence-store interface. The interface must support later replacement without rewriting Atlas or Studio logic.

No account, backend, cloud-sync, analytics, or identity architecture should be designed until the slice establishes which state is valuable and why.

## Quality boundary

New `src/world/` code should be included in strict typechecking and focused tests from its first change. The prototype must cover:

- mathematical model tests;
- evidence transition tests;
- detour and return-state tests;
- keyboard interaction;
- narrow-screen layout;
- a critical browser journey across Observatory, Studio, Atlas, and return.

## Migration rule

Build beside the legacy application, validate, and then replace deliberately. Do not refactor the old shell into the new architecture by gradual renaming.
