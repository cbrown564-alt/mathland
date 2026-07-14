# Mathland production architecture

Status: **Phase 4 production architecture**, promoted 13 July 2026 after the Phase 3 journey-validation sign-off.

Mathland is a client-rendered React 18 application built with Vite. The production route now expresses the Atlas–Studio–Observatory architecture directly and has no runtime dependency on the legacy shell, lesson schemas, progress hooks, module data, character registry, or content initialisation.

## Runtime flow

1. `src/main.tsx` installs operational error reporting and mounts the application immediately.
2. `src/App.tsx` exposes the production world at `/`, policy and support routes, redirects for known retired routes, and a world-native not-found view.
3. `src/world/app/MathlandWorldApp.tsx` restores the exact local journey and composes the promoted Atlas, Observatory, and Studio primitives.
4. The case adapter selected by the active horizon supplies the domain vectors, labels, units, meaning, and boundary around one shared dot-product model.
5. Descriptive evidence is persisted after meaningful state changes. Page views never create evidence.

The application does not wait for legacy content, call a third-party font service, create an account, or send learner data by default.

## Production source boundaries

```text
src/world/
  app/          production shell, journey composition, policies, and help
  atlas/        territory graph and promoted Atlas API
  studio/       pure mathematical models and promoted Studio instrument
  observatory/  promoted Observatory API
  cases/        domain interpretation, units, assumptions, and adapters
  detours/      diagnostic repair and exact-return contracts
  evidence/     versioned persistence and descriptive evidence
  operations/   consented analytics and operational monitoring adapters
  media/        teaching-media metadata
  types/        shared world contracts
```

`src/world/index.ts` is the stable public boundary. Product composition may import through the `atlas`, `studio`, and `observatory` entry points; historical source must never be imported from `archive/legacy-product/`.

## Promoted primitive contracts

### Atlas

The Atlas owns territory identity, route relationships, evidence state, active horizon, neighbouring Studio entry, retrieval orientation, and exact return. It does not expose module completion or duplicate a territory for each domain.

### Studio

The Studio owns the pure mathematical model, pointer/keyboard/numeric state changes, readable alternative, exact calculation, comparison, reset/undo, explanation, support escalation, and evidence transition. Domain cases wrap the shared model through adapters.

### Observatory

The Observatory owns the selective three-system reveal, one committed noticing move per system, a sign prediction, and the immediate handoff to the Studio. It does not record capability by being viewed.

## Production shell contract

The compact shell exposes:

- the active horizon, with deliberate editing that preserves work;
- Atlas access from every learning move;
- predictable Help and the reopenable first-run tour;
- descriptive evidence state;
- local data export, restore, consent, and deletion;
- privacy and support routes;
- the exact saved journey step after reload, detour, or domain change.

The shell contains no legacy module navigation, dashboard, lesson rail, completion percentage, or global character chrome.

## Persistence and cross-device policy

`src/world/evidence/evidenceStore.ts` owns the replaceable persistence boundary.

- Production schema: `WorldSnapshot` version 3 under `mathland.world.v3`.
- Migration: valid version 2 research snapshots and version 1 snapshots migrate without losing horizon, evidence, detour, retrieval, or resume state.
- Corruption: invalid, unknown, oversized, or unparsable state is quarantined by returning a fresh snapshot.
- Portability: learners can download a readable, versioned JSON envelope and restore it after strict validation.
- Deletion: the current and both prior world keys are removed before a fresh anonymous snapshot is created.
- Cross-device: manual export/restore only. There is no implied cloud sync or cross-device consistency.

## Analytics, privacy, and accounts

Mathland is anonymous-first. There is no production account requirement because validated use established that a persistent horizon, exact resume point, evidence, detours, and retrieval date are valuable, but did not establish a need for identity or cloud sync.

Optional product diagnostics are denied by default and controlled in the Data dialog. The analytics adapter accepts only an allow-list of product transitions and short categorical properties. It excludes answers, free-text reasoning, evidence detail, page-view mastery, persistent learner identifiers, credentials, and referrers. A deployment may configure an endpoint through `/runtime-config.js`; with no endpoint, nothing is transmitted.

Operational error monitoring is separate from product diagnostics and accepts only a bounded error name, message, and code context. Production operators must retain diagnostic and error records for no more than 30 days and must not join them to identity or learner evidence.

Any future account system requires a new product decision covering anonymous use, lawful basis, age boundary, verification, data location, sync conflicts, export, deletion, incident handling, and migration. It is not a deferred implementation detail of this release.

## Content operations

Territory identity, mathematical models, and domain cases are separate source layers. A case can be corrected or rolled back without changing the dot-product model. Promotion requires:

1. mathematical tests for sign, scale, dimension, and undefined cases;
2. a versioned territory and case change;
3. domain review of terms, units, assumptions, and boundaries;
4. keyboard, touch, readable-alternative, reduced-motion, 320px, and browser-journey review;
5. explicit evidence and detour-return contracts;
6. a rollback decision that identifies whether the model, case, or composition changed.

The first salvage decisions are recorded in [../lessons_list.md](../lessons_list.md). No remaining legacy territory has been promoted by file existence.

## Routes and retirement

| Previous route | Production behaviour |
| --- | --- |
| `/` | Opens the world at the exact saved move |
| `/prototype/one-operation-three-worlds` | Redirects to `/` with a retirement notice |
| `/lesson/:id`, `/story/:id`, `/module/:id` | Redirect to `/` with a retirement notice |
| `/experience`, `/course`, `/module-detail/:id`, `/world` | Redirect to `/` with a retirement notice |
| `/lab/*`, `/tier2-gallery`, `/interactive-gallery` | Redirect to `/` with a retirement notice |
| `/privacy`, `/support` | Production policy and recovery surfaces |
| unknown route | World-native not-found surface that preserves the journey |

The retired implementation and media are quarantined under `archive/legacy-product/` and excluded from TypeScript, Jest, ESLint, Vite, Docker, and public runtime assets. The archive record is [../archive/legacy-product/RETIREMENT_RECORD.md](../archive/legacy-product/RETIREMENT_RECORD.md).

## Delivery and operations

The supported production artifact is the immutable static build produced by `npm run build` and checked by `npm run check:production`. The repository includes a multi-stage Docker image and an Nginx SPA configuration with health checking, cache policy, security headers, and route fallback.

CI must pass lint, strict typechecking, world/content validation, unit coverage, production build/readiness, desktop/mobile browser journeys, and accessibility scans before promotion. Preview uses the exact release image and a separate runtime configuration. Production promotion and rollback follow [../operations/PRODUCTION_RUNBOOK.md](../operations/PRODUCTION_RUNBOOK.md).

## Future territory rule

A new territory replaces historical material only after its own learner and domain gate passes. Then update the Atlas graph, case/version record, redirect map if needed, salvage inventory, archive manifest, and runbook smoke path together. Phase 4 does not convert the archived 96-lesson order into the Atlas roadmap.
