# Project history

This file preserves useful context from completed work and superseded plans without presenting it as the current roadmap.

## Architecture consolidation

The project moved from duplicated root-level component and page structures to the current separation under `src/core/`, `src/content/`, and `src/interactive/`. Path aliases use `@/*` for `src/*`. Lesson content was split from monolithic TypeScript data into module indexes and JSON lesson files loaded asynchronously with caching.

Lesson rendering was decomposed into shared hooks and focused components. Progress persistence was centralized around lesson progress hooks and guarded localStorage utilities. The current architecture and sources of truth are documented in [architecture/README.md](architecture/README.md).

## Type and test improvements

Earlier work strengthened lesson and custom-component typing, enabled stricter TypeScript options, replaced placeholder tests, and added CI. The exact suite and coverage figures in the old reports became stale, so current health is now established by running the commands in the root README and CI configuration.

## Three-tier content system

The project introduced reusable templates for interactive, enhanced-static, and narrative content. Two near-duplicate copies of the implementation guide existed under `assets/` and `docs/development/`; the documentation sweep retained and revised only the development guide.

## July 2026 UI plan

The former `PLAN.md` proposed three paths:

- **A — stabilize and polish:** character theme safety, working lesson navigation, dead-code/placeholder cleanup, shared application chrome, unified tokens, and one demo registry.
- **B — let characters lead:** animated character assets, per-character theming, themed interactives, a world-map view, and persistent character presence.
- **C — re-architect the lesson:** prototype a continuous, beat-based story with adaptive progress and an inline interactive climax.

Substantial parts of all three paths were committed: shared `AppShell`, typed character themes, character animation support, a world-map route, a canonical demo registry, and the Lesson v2 Module 2 pilot. Because the plan mixed completed tasks with old counts and assumptions, it was replaced by the outcome-oriented delivery roadmap in the root [PLAN.md](../PLAN.md).

## Documentation sweep

In July 2026, outdated completion reports and duplicate strategy documents were consolidated. The sweep established these rules:

- current facts in the root README;
- current priorities in one roadmap;
- durable decisions in product/architecture/authoring guides;
- past implementation detail in this history.
