# Mathland UI Implementation Plan

Derived from `ui-directions.html` (UI Review · July 2026). The document plots 13
candidate moves on an effort × differentiation map and recommends a staged approach:

> **Do A now, commit to B as the overhaul, stage C as a prototype.**

This plan converts those moves into concrete engineering tasks, grouped into the three
paths (A = Stabilize & polish, B = Let the characters lead, C = Re-architect the lesson),
with file references and acceptance criteria. Phase 1 below is **Path A** and is what we
start implementing now.

---

## Strategic framing (from the doc)

- **Lower-left cluster (Path A)** is non-negotiable hygiene: correctness, not style. Do it
  regardless of direction.
- **Amber arc (Path B)** converts the biggest *wasted* asset — 10 voiced characters, ~60 MB
  of orphaned animation GIFs, per-character color systems — into the biggest *visible*
  asset. Highest leverage, moderate cost, hard for competitors to copy.
- **Teal cluster (Path C)** is the structural bet: the lesson as one continuous character-led
  story. Highest payoff, highest risk. De-risk by prototyping **one** lesson end-to-end first.

---

## Phase 1 — Path A: Stabilize & polish (weeks 1–4, low risk)

Same structure, same screens — but consistent, correct, and considered. These are the
"stop the bleeding" tasks. **Every subsequent path depends on A being done first.**

### A1 · Fix the JIT gradient purge  ⚠️ highest-priority bug
- **Problem:** Character/module colors are stored as class strings (e.g. `from-amber-500
  to-orange-500`) and injected via template literals like
  `bg-gradient-to-br ${character.color}`. Tailwind's JIT scanner never sees these literal
  strings, so they are **purged in production builds** — characters render with no color.
- **Sources that build classes dynamically:** `characterData.ts` (`color` on all 10
  characters), `modulesData.ts` (`getCharacterColor`), `JourneyTransformation.tsx`
  (`step.colorTheme`), `CharacterPreviewCarousel.tsx`, `ModuleCard.tsx`, `ModuleCharacterCard.tsx`,
  `LessonRoadmap.tsx`.
- **Fix (two complementary parts):**
  1. Add a `safelist` to `tailwind.config.ts` covering the `from-/to-/via-` gradient utilities
     used dynamically (regex over the known palette + shades 400–700). Immediate prod fix,
     zero behavior change.
  2. Introduce a **static theme map** (`src/utils/theme.ts`) so dynamic colors are resolved
     from a single typed source instead of raw strings. This also seeds Path B re-theming.
- **Acceptance:** `npm run build` then load a lesson in prod preview — character gradients
  (sidebar avatar, module cards, journey steps) render with correct colors. No regression in
  dev.

### A2 · Wire up the no-op "Next" buttons
- **Problem:** Doc reports 3 of 8 lesson sections silently do nothing on click.
- **Findings:** `RealWorldConnection.tsx` and `MemoryAids.tsx` pass `onNext={() => {}}` to
  `SectionCompletion`; this is currently masked because `onComplete` auto-advances via
  `handleSectionComplete` in `LessonTemplate.tsx:51`. Must audit every section path
  (`NarrativeHook`, `ReadSection`, `SeeSection`, `HearSection`, `DoSection`, `MemoryAids`,
  `ConceptCheck`, `RealWorldConnection`) to confirm a click always advances or completes.
- **Fix:** Make `SectionCompletion`'s primary action unambiguous (explicit "Complete & continue"
  when not last; disable/relabel when last), and guarantee each section calls `onNextSection`
  exactly once.
- **Acceptance:** Clicking the completion control on every one of the 8 sections advances or
  marks the lesson complete; no dead clicks.

### A3 · Delete dead code
- **Confirmed dead:** `src/core/components/lesson/LessonAudioPlayer.tsx` — only self-referenced
  (no importers). Remove it.
- **To verify before deleting:** a "dead Canvas" component (grep pending) and the **4 stray
  Next.js apps** under `src/interactive/examples/*/app`. These example apps are also referenced
  by `CLAUDE.md` as research prototypes, so **do not delete blindly** — confirm with owner,
  or relocate to a clearly-separated `archive/` rather than delete.
- **Acceptance:** No unused component/hook remains in `src/core`; example apps either moved to
  `archive/` or annotated as intentionally separate.

### A4 · Remove placeholder content
- **Problem:** `ReadSection.tsx` ships a data-science filler tutorial when lesson data is
  missing ("Why This Matters in Data Science" hardcoded in `RealWorldConnection.tsx:9`).
- **Fix:** Render a graceful "content coming soon" empty state instead of wrong-domain filler;
  remove the hardcoded "Data Science" framing that leaks across all lessons.
- **Acceptance:** A lesson with missing `readContent` shows a neutral empty state, never
  cross-domain placeholder text.

### A5 · Consistent page chrome
- **Problem:** A header is present on 3 pages and absent on 3; same for footer.
- **Fix:** Introduce a single shared `AppShell` (or `<Header/>`/`<Footer/>` pair) mounted in
  `App.tsx` and used by every route in `src/core/pages` and the experience pages. Audit
  `Index`, `Experience`, `InteractiveGallery`, `Tier2Gallery`, `ModuleDetail`, `ModulePage`,
  `LessonPage`.
- **Acceptance:** Every top-level route shows the same header/footer chrome; no route is bare.

### A6 · Unified design tokens (foundation for B)
- **Problem:** Hardcoded `blue-600` / `orange-200` / `slate-*` scattered across components; no
  semantic layer for character-driven theming.
- **Fix (started this session):**
  1. Add a character **brand-color token layer** to `src/index.css` (`:root` CSS variables
     `--ch-<id>` and `--ch-<id>-2` mirroring the `ui-directions.html` palette: ollie, vera,
     max, eileen, delta, greta, pippa, sigmund, bayes, sage).
  2. Expose `src/utils/theme.ts` with a typed `characterTheme` map + `getCharacterTheme(id)`
     returning gradient/soft/accent class sets built from those tokens.
- **Acceptance:** A single source of truth for character colors exists; JIT-safe; Path B can
  re-tint the whole UI by swapping a root class/data-attribute.

### A7 · One component catalog
- **Problem:** Three contradictory component counts ("23", "24", really 28 interactive demos).
- **Fix:** Collapse to a single registry. `src/interactive/demos/demo_registry.ts` + and
  `src/utils/characterData.ts`/`modulesData.ts` are the candidates — pick one canonical
  manifest and delete the others. Add a lightweight test asserting the registry is the only
  source.
- **Acceptance:** Exactly one interactive/component registry; counts are derived, not hardcoded.

---

## Phase 2 — Path B: Let the characters lead (months 1–2, medium risk)

The differentiating move. Surfaces assets that already exist.

### B1 · Wire in the 60 MB orphaned GIFs
- 11 animated character GIFs exist (per doc) but are referenced by **zero** files. Locate under
  `assets/` / `public/`, wire into `CharacterAvatar` / companion rail so animations play on
  lesson screens. Build a `<CharacterAnimation>` component.
- **Acceptance:** Each character's animated portrait renders on its lesson; no broken refs.

### B2 · Per-character re-theming
- Whole interface re-tints to the active character's color (sidebar, header accent, buttons,
  progress). Built on the A6 token layer: set a root `data-character` / class and let CSS
  variables drive accents. Microcopy flavored with character verbs (`reactionVerb`,
  `explainVerb`, `catchphrase` from `characterData.ts`).
- **Acceptance:** Switching Ollie → Vera re-themes chrome with no component changes, only a
  root attribute flip.

### B3 · Themed interactives
- The 28 interactives (currently "slate boxes") inherit their character's workshop look. Drive
  accent colors from the theme layer.
- **Acceptance:** Each interactive reads its character theme; no hardcoded slate.

### B4 · Mathland world-map home
- Replace the generic timeline with a character-guarded territory map (mockup `scr-world` in the
  doc: 10 zones tinted per character, progress = territories explored, current pulses). New
  route `/(world)`; reuse `modulesData` for zone metadata.
- **Acceptance:** Home is a navigable map of 10 character territories with progress state.

### B5 · Character as companion
- Persistent character presence in lesson chrome: companion rail with live "speaking" indicator
  during audio playback (mockup `scr-themed`). Extend `LessonTemplate` layout with a right rail.
- **Acceptance:** Character portrait + step indicator + speaking pulse visible throughout a lesson.

---

## Phase 3 — Path C: Re-architect the lesson (prototype, high risk) ✅ prototyped

Biggest bet. De-risk by redesigning **one** lesson end-to-end first.

> **Status (July 2026):** prototyped end-to-end for lesson 2.3 at the dedicated
> route `/story/:lessonId` (entry point: the "Read as a guided story" card on
> `/lesson/2.3`). The section-form `/lesson/2.3` is untouched, so the two can be
> compared for engagement. Note: the actual lesson 2.3 content is **"The Dot
> Product — Measuring Similarity"** (Vera), not "Vector Addition" as written
> above — the prototype is built against the real content.

### C1 · Guided narrative lesson (one lesson) ✅
- Prototype lesson 2.3 (Vera · **The Dot Product**) as one continuous scroll story: Hook → Read →
  See → Hear → Do as a single paced narrative, dark immersive theme (mockup `scr-narrative`),
  persistent audio w/ synced transcript, interactive arriving as the climax.
- **Implementation:** `src/core/components/narrative/NarrativeLessonView.tsx` renders all 8
  beats as frosted-glass cards on the `#0f0a1a → #1a1030` gradient with the two radial glows
  from the mockup. `src/core/pages/StoryPage.tsx` loads the same lesson data as `LessonPage`.
- **Acceptance:** One full lesson redesigned; measurable engagement vs. the section-form version.

### C2 · Adaptive pacing ✅
- Use existing progress data (`useLessonProgress`) to skip mastered sections, linger on weak
  ones.
- **Implementation:** reads/writes the same `lesson-progress-<id>` localStorage key as the
  section-form lesson. Beats already in `completedSections` get a "✓ mastered" tag and collapse
  by default (the climax never auto-collapses). An `IntersectionObserver` marks a beat complete
  when it scrolls ~55% into view, so pacing lingers on un-viewed beats and remembers mastered
  ones across visits.
- **Acceptance:** Lesson adapts order/depth from stored progress.

### C3 · Interactive as climax ✅
- The "Do" tool becomes where every section converges; embed inline rather than a tab.
- **Implementation:** `src/core/components/narrative/DotProductExplorer.tsx` — a focused
  two-vector dot-product tool (drag handles reused from `vera_vector_playground`) with a live
  similarity meter (−1…+1) realizing the lesson's "agreement scale" metaphor. Defaults to
  [3,4]·[1,2]=11 to match the lesson's own concept check. Embedded inline as the highlighted
  "Do" beat, not a tab.
- **Acceptance:** Interactive is the natural final beat of the narrative, not a separate view.

---

## Sequencing & dependencies

```
A1 (safelist+theme) ──► A6 (tokens) ──┬─► B2 (re-theme) ──► B3 (themed interactives)
A2,A3,A4,A5,A7  (hygiene, parallel) ─┤                      B1 (GIFs) ──► B5 (companion)
                                       └─► B4 (world map) ──► C1 (narrative proto) ──► C2/C3
```

- **A must finish before any B/C work ships** — B/C build on the token layer and correct chrome.
- **B is the visible overhaul** and the highest-leverage investment.
- **C is a prototype only** until the product shows traction.

## Verification approach
- Lint + typecheck on every change (`npm run lint`).
- `npm run build` + `npm run preview` to confirm the JIT-purge fix visually in prod.
- Jest for registry/testable logic (`npm run test`).
- Manual pass on each of the 8 lesson sections for A2.
