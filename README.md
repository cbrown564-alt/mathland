# Mathland

Mathland is a character-driven mathematics learning platform for adults preparing for data science. It combines structured lessons, mathematical visualizations, interactive practice, audio/transcript support, and locally persisted progress.

## Repository status

As of 11 July 2026, the committed repository contains:

- 96 JSON lessons across 10 modules;
- 10 mathematical character guides;
- 30 ready demos in `src/interactive/demos/demo_registry.ts`;
- a nine-lesson Module 2 pilot of the beat-based Lesson v2 format;
- 63 passing Jest tests across 16 suites;
- a passing Vite production build;
- a passing ESLint run with 96 warnings and no errors.

These are implementation counts, not claims of educational or production readiness. The current goal is to validate and finish Module 2 to a defined release standard before migrating more curriculum. See the [delivery roadmap](PLAN.md).

## Curriculum

1. Mathematical prerequisites and refresher — Ollie
2. Vectors and vector spaces — Vera
3. Matrices and linear mappings — Max
4. Eigenvalues and eigenvectors — Eileen
5. Multivariable calculus — Delta
6. Optimisation and gradient descent — Greta
7. Probability and distributions — Pippa
8. Statistical inference and hypothesis testing — Sigmund
9. Bayesian inference — Bayes
10. Integration and capstone work — Sage

The source of truth is `src/content/lessons/`. Module indexes define lesson order and lesson JSON files provide the original eight-section experience. Module 2 also has a beat-authored version under `src/content/beats/` rendered at `/story/:lessonId`.

## Technology

- React 18, TypeScript, Vite
- React Router
- Tailwind CSS and shadcn/ui
- Canvas, SVG, Plotly, and Three.js-based visualizations
- Jest and React Testing Library
- localStorage-based progress persistence

## Start locally

Requirements: a current Node.js LTS release and npm.

```bash
npm install
npm run dev
```

The development server defaults to `http://localhost:8080`.

## Quality commands

```bash
npm run build          # production bundle
npm run build:dev      # development-mode bundle
npm run test           # Jest suite
npm run test:ci        # non-watch test run with coverage
npm run lint           # ESLint
npm run preview        # preview the production bundle
```

CI runs lint, tests, coverage, and the production build on Node 18 and 20. Its current lint step is advisory (`|| echo`), so lint failures do not block CI. The roadmap calls for making quality gates blocking and adding explicit typecheck, content-integrity validation, and browser smoke tests.

## Repository layout

```text
src/
  core/                 application shell, pages, shared UI, hooks, and types
  content/
    lessons/            canonical JSON curriculum and module indexes
    beats/              Module 2 Lesson v2 pilot and authoring schema
  interactive/
    components/         integrated mathematical interactives
    demos/              canonical demo registry
    examples/           isolated research prototypes
  tier2/                reusable visual/diagram templates
  utils/                lesson loading, characters, modules, and themes
docs/                   living architecture, authoring, and product guidance
public/                 static runtime assets
```

## Documentation

- [Delivery roadmap](PLAN.md) — active priorities and finish criteria
- [Documentation index](docs/README.md) — authoritative guides and their scope
- [Product strategy](docs/strategic_development_plan.md) — durable product decisions
- [Lesson v2 design](docs/LESSON_V2_DESIGN.md) — beat format specification
- [Interactive development](docs/development/INTERACTIVE_COMPONENT_DEVELOPMENT.md) — implementation and integration standards
- [History](docs/HISTORY.md) — completed refactors and superseded plans

## Content and interactive changes

To add or edit original lesson content, update the relevant JSON file and module index under `src/content/lessons/`. For Lesson v2 authoring, follow [the beat authoring guide](src/content/beats/README.md). New integrated interactives belong in `src/interactive/components/` and must be registered in `src/interactive/demos/demo_registry.ts`; follow the [interactive development guide](docs/development/INTERACTIVE_COMPONENT_DEVELOPMENT.md).

Run lint, tests, and a production build before proposing changes. Content changes should also receive mathematical and editorial review; automated checks alone do not validate teaching quality.

## Deployment

The Vite build outputs static assets to `dist/`. Historical documents referenced Lovable deployment, but no committed runbook currently establishes a supported production host, environment configuration, monitoring, or rollback procedure. Creating that runbook is part of platform hardening in the roadmap.
