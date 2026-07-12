# Mathland

Mathland is being rebuilt as an **open mathematical world for motivated adults** who are relearning mathematics to reach more advanced work in physics, engineering, machine learning, AI, or finance.

The previous web application is not the product foundation. Its lesson content, characters, mathematical models, and interactives are source material that may be reused selectively. The shell, navigation, module-card journey, section-based lessons, and presumed Lesson v2 migration path are superseded.

## Accepted product architecture

- **Atlas outside:** an explorable map of mathematical territories, relationships, domain routes, prerequisite detours, and return opportunities.
- **Studio inside:** the default learning surface for prediction, manipulation, calculation, explanation, fading support, transfer, and retrieval.
- **Observatory selectively:** concentrated visual openings for ideas that deserve wonder or reveal an otherwise invisible phenomenon.

The canonical direction is [docs/PRODUCT_DOCTRINE.md](docs/PRODUCT_DOCTRINE.md). The visual concept board is [design/mathland-clean-sheet-directions.html](design/mathland-clean-sheet-directions.html).

## Primary learner

Mathland is for adults who:

- have an ambitious subject or practical goal;
- bring substantial contextual knowledge;
- prefer active learning and real cases;
- may have uneven mathematical foundations;
- expect intellectual depth without school-like framing.

They enter through a meaningful problem. Missing foundations appear as just-in-time, respectful detours—not as a compulsory remedial syllabus.

## First vertical slice

The recommended first prototype is **One operation, three worlds**: the dot product through:

- work done by force along displacement;
- semantic similarity between embedding vectors;
- portfolio return from asset weights and returns.

It will test the integrated Atlas–Studio–Observatory architecture, cross-domain transfer, and a prerequisite detour before any broad rebuild. See [docs/FIRST_VERTICAL_SLICE.md](docs/FIRST_VERTICAL_SLICE.md).

## Current repository

The existing React application remains runnable while the new experience is prototyped in isolation. It currently contains:

- 96 JSON lesson files across ten legacy modules;
- ten mathematical character guides;
- a substantial registry of mathematical interactives;
- a nine-lesson beat-format experiment for legacy Module 2;
- local browser progress persistence;
- unit, content-integrity, and browser-smoke infrastructure.

These are implementation assets, not claims of learner validation or requirements for the future experience.

## Technology

- React 18 and TypeScript
- Vite and React Router
- Tailwind CSS and shadcn/ui
- Canvas, SVG, Plotly, and Three.js-based visualisations
- Jest, React Testing Library, and Playwright

## Start locally

Requirements: a current Node.js LTS release and npm.

```bash
npm install
npm run dev
```

The development server defaults to `http://localhost:8080`.

## Quality commands

```bash
npm run lint
npm run typecheck
npm run validate:content
npm run test
npm run test:e2e
npm run build
```

## Repository layout

```text
src/
  core/                 legacy application shell, pages, hooks, and shared UI
  content/              legacy lesson content and beat-format experiment
  interactive/          mathematical interactives and reusable models
  tier2/                legacy enhanced-static templates
  world/                reserved for the new Atlas–Studio–Observatory prototype
docs/                   canonical doctrine, architecture, content, and build guidance
docs/archive/           superseded product, release, format, and research material
design/                 discussion-ready product direction board
public/                 static runtime assets
```

`src/world/` will be introduced by the first vertical-slice implementation. Until then, it is a documented target namespace rather than an existing directory.

## Documentation

Start at [docs/README.md](docs/README.md). The active set is deliberately small:

- [Product doctrine](docs/PRODUCT_DOCTRINE.md)
- [Experience architecture](docs/EXPERIENCE_ARCHITECTURE.md)
- [Content strategy](docs/CONTENT_STRATEGY.md)
- [First vertical slice](docs/FIRST_VERTICAL_SLICE.md)
- [Current and target technical architecture](docs/architecture/README.md)
- [Building new experiences](docs/development/BUILDING_EXPERIENCES.md)
- [Active rebuild plan](PLAN.md)

Historical documentation is isolated under [docs/archive/](docs/archive/README.md) and is non-authoritative.

## Contribution rule

Do not improve the legacy product by default. New product work must advance the accepted doctrine, be isolated from legacy shell assumptions, and prove itself through the first vertical slice before broader migration.
