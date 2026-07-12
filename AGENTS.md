# AGENTS.md

Guidance for agents working in this repository.

## Product mandate

Mathland is being rebuilt from first principles as an **open mathematical world for motivated adults** relearning mathematics to reach physics, engineering, machine learning, AI, or finance.

Do not assume the previous application shell, module navigation, section-based lessons, or Lesson v2 experience is good enough to improve incrementally. Those surfaces are legacy implementation. Existing content, characters, interactives, and mathematical models are raw material that must earn reuse.

The accepted architecture is:

- **Atlas outside** — orientation, connected territories, domain routes, prerequisite detours, and return loops.
- **Studio inside** — prediction, manipulation, calculation, explanation, fading support, transfer, and retrieval.
- **Observatory selectively** — concentrated visual openings for ideas that deserve spectacle, followed quickly by learner work.

## Canonical documentation

Read before product work:

1. `docs/PRODUCT_DOCTRINE.md`
2. `docs/EXPERIENCE_ARCHITECTURE.md`
3. `docs/CONTENT_STRATEGY.md`
4. `docs/FIRST_VERTICAL_SLICE.md`
5. `PLAN.md`

Implementation guidance:

- `docs/architecture/README.md`
- `docs/development/BUILDING_EXPERIENCES.md`
- `docs/lessons_list.md`

Material under `docs/archive/` is historical and non-authoritative.

## Immediate product scope

The first vertical slice is **One operation, three worlds**: the dot product through engineering work, AI similarity, and portfolio return. It must test a small Atlas region, an Observatory opening, a Studio learning loop, a diagnostic detour, cross-domain transfer, and later retrieval.

Do not rebuild the general shell, migrate all lessons, or expand every character before this slice is validated with the primary learner group.

## Current versus target code

Current legacy boundaries:

- `src/core/` — application shell, pages, renderers, hooks, and shared UI
- `src/content/lessons/` — 96 section-based lesson files
- `src/content/beats/` — frozen Module 2 beat-format experiment
- `src/interactive/` — mathematical interactives and reusable models
- `src/tier2/` — legacy visual templates

Target prototype boundary:

- `src/world/` — isolated Atlas, Studio, Observatory, case, detour, evidence, and prototype code

New world data must not use the old lesson or progress schemas as its domain model. Extract useful logic through adapters.

## Development commands

```bash
npm run dev
npm run build
npm run build:dev
npm run preview
npm run lint
npm run typecheck
npm run validate:content
npm run test
npm run test:watch
npm run test:coverage
npm run test:ci
npm run test:e2e
```

The Vite development server defaults to port 8080.

## Implementation principles

- Start from a consequential case and observable learner capability, not a page template.
- Let adult learners enter through goals; diagnose foundations through action.
- Keep explanation beside the representation or control it explains.
- Give every essential drag interaction keyboard and explicit-control alternatives.
- Use worked examples and fade support deliberately.
- Require explanation and cross-context transfer where recognition is insufficient.
- Record descriptive evidence such as predicted, constructed, explained, transferred, and retrieved; never treat page views as mastery.
- Use characters as professional field specialists with tools and questioning styles, not mascots.
- State domain assumptions, units, and simplifications accurately.
- Test from 320 CSS pixels upward and support reduced motion, visible focus, touch, keyboard, and readable visual alternatives.

## First-slice integration rules

1. Isolate new product work under `src/world/` and an explicit prototype route.
2. Build the mathematical Studio model before surrounding shell work.
3. Keep physics, AI, and finance meanings in case adapters around one shared dot-product model.
4. Preserve the learner's motivating goal through prerequisite detours.
5. Add mathematical, evidence-transition, detour-return, keyboard, and browser-journey tests.
6. Do not replace production routes before learner validation.

## Documentation discipline

- Update the canonical document that owns a decision; do not create competing strategies or roadmaps.
- Separate current implementation facts from target product requirements.
- Move superseded narratives into `docs/archive/` and keep them out of active indexes.
- Repair active documentation links with every rename or move.
- When a product decision changes, update `docs/PRODUCT_DOCTRINE.md` explicitly before implementing exceptions.
