# Current architecture

Mathland is a client-rendered React application built by Vite. It has no committed application backend; progress is stored in the browser.

## Runtime flow

1. `src/App.tsx` defines lazy-loaded routes inside the shared `AppShell`.
2. Original lessons are loaded from `src/content/lessons/module*/` through `src/utils/lessonLoader.ts`.
3. Lesson data conforms to the types in `src/core/types/lesson.ts` and renders through the section-based lesson page.
4. Beat-authored lessons are registered in `src/content/beats/index.ts` and render generically through `/story/:lessonId`.
5. Custom activities resolve through the interactive integration layer; the canonical gallery/status manifest is `src/interactive/demos/demo_registry.ts`.
6. Progress hooks persist lesson state to localStorage and notify interested views of updates.

## Major boundaries

- `src/core/`: application UI, routes, lesson rendering, hooks, and shared types
- `src/content/`: authored curriculum; it should not contain general application infrastructure
- `src/interactive/`: integrated mathematical tools, their registry, and isolated prototypes
- `src/tier2/`: reusable enhanced-static visual templates
- `src/utils/`: content loading and stable metadata such as characters, modules, and themes

## Sources of truth

- Lesson existence and content: `src/content/lessons/`
- Lesson v2 pilot: `src/content/beats/index.ts`
- Character metadata: `src/utils/characterData.ts`
- Module metadata: `src/utils/modulesData.ts`
- Integrated demo status: `src/interactive/demos/demo_registry.ts`
- Routes: `src/App.tsx`
- Commands and dependencies: `package.json`

Avoid maintaining competing hand-written inventories. Where a UI needs these facts, derive them from the canonical source.

## Persistence constraints

Progress is device- and browser-local. There is no authenticated identity, server synchronization, multi-device merge, or guaranteed recovery if browser storage is cleared. Storage access must remain guarded for unavailable, corrupt, or quota-limited environments.

## Known architectural work

The active roadmap covers explicit typechecking, content-reference validation, browser smoke tests, error recovery, analytics/privacy decisions, and deployment operations. Historical refactoring detail is summarized in [../HISTORY.md](../HISTORY.md).
