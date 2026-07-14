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

## Production world

The first promoted region is **One operation, three worlds**: the dot product through:

- work done by force along displacement;
- semantic similarity between embedding vectors;
- portfolio return from asset weights and returns.

It expresses the integrated Atlas–Studio–Observatory architecture, cross-domain transfer, diagnostic detours, and later retrieval. The validated world is now the root route; known legacy URLs redirect into it. See [docs/FIRST_VERTICAL_SLICE.md](docs/FIRST_VERTICAL_SLICE.md).

## Current repository

The production application lives under `src/world/` and contains:

- a shared dot-product model with engineering, AI, finance, and climate case adapters;
- Atlas, Studio, Observatory, diagnostic, transfer, and retrieval paths;
- versioned local evidence with prototype migration, export/restore, and deletion;
- anonymous-by-default product diagnostics and operational monitoring adapters;
- production routes for privacy, support, retired-route redirects, and recovery;
- unit, content-integrity, accessibility, and browser-journey infrastructure.

The retired application and media are quarantined under `archive/legacy-product/`. They are historical salvage material and are excluded from production compilation, validation, Docker, and public assets.

## Technology

- React 18 and TypeScript
- Vite and React Router
- SVG mathematical instruments and semantic HTML controls
- Jest, React Testing Library, and Playwright
- Nginx and a multi-stage production Docker image

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
npm run check:production
npm run quality
```

## Repository layout

```text
src/
  world/                production Atlas–Studio–Observatory application
docs/                   canonical doctrine, architecture, content, and build guidance
docs/archive/           superseded product, release, format, and research material
archive/legacy-product/ quarantined legacy source and runtime media
deploy/                 production web-server configuration
design/                 discussion-ready product direction board
public/                 static runtime assets
```

The production architecture and operational contract are documented in [docs/architecture/README.md](docs/architecture/README.md) and [docs/operations/PRODUCTION_RUNBOOK.md](docs/operations/PRODUCTION_RUNBOOK.md).

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

Do not restore or improve the retired learner journey by default. New product work must advance the accepted doctrine through stable world primitives, territory-specific evidence, and the production promotion gate.
