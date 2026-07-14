# AGENTS.md

Guidance for agents working in this repository.

## Product mandate

Mathland is an **open mathematical world for motivated adults** relearning mathematics to reach physics, engineering, machine learning, AI, or finance. The validated first region is now the production product.

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

The promoted first region is **One operation, three worlds**: the dot product through engineering work, AI similarity, and portfolio return. It includes a small Atlas region, an Observatory opening, a Studio learning loop, diagnostic detours, cross-domain transfer, and later retrieval.

Do not restore the retired shell, migrate all lessons, or expand every character. New territories must pass their own learner, domain, accessibility, content-operation, and rollback gate.

## Current versus target code

Production boundary:

- `src/world/` — production Atlas, Studio, Observatory, application, case, detour, evidence, operations, and type code
- `/` — production world route
- `docs/architecture/README.md` — production shell, persistence, analytics, privacy, account, content-operation, route, and delivery contracts
- `docs/operations/PRODUCTION_RUNBOOK.md` — deployment, monitoring, rollback, and support procedures

Retired boundary:

- `archive/legacy-product/` — quarantined shell, lessons, beat experiment, interactives, templates, utilities, scripts, and unused runtime media

Production code must never import from the archive or use the old lesson/progress schemas as its domain model. Extract useful logic through reviewed world models and adapters.

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
npm run check:production
npm run quality
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

## Territory promotion rules

1. Build new product work under `src/world/` behind stable Atlas, Studio, Observatory, case, evidence, and operations boundaries.
2. Build the mathematical Studio model before surrounding shell work.
3. Keep physics, AI, and finance meanings in case adapters around one shared dot-product model.
4. Preserve the learner's motivating goal through prerequisite detours.
5. Add mathematical, evidence-transition, detour-return, keyboard, and browser-journey tests.
6. Do not expose a territory as production-ready before learner, domain, accessibility, content-operation, delivery, and rollback validation.

## Documentation discipline

- Update the canonical document that owns a decision; do not create competing strategies or roadmaps.
- Separate current implementation facts from target product requirements.
- Move superseded narratives into `docs/archive/` and keep them out of active indexes.
- Repair active documentation links with every rename or move.
- When a product decision changes, update `docs/PRODUCT_DOCTRINE.md` explicitly before implementing exceptions.
