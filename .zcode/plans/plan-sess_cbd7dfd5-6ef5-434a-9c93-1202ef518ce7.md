# Phase C Prototype — Guided Narrative Lesson (Lesson 2.3, Vera · Dot Product)

## Goal
Prototype **one** full lesson (2.3, "The Dot Product — Measuring Similarity", Vera) re-architected as a **single continuous character-led scroll story**: dark immersive theme, persistent audio w/ synced transcript, adaptive pacing from stored progress, and a dedicated dot-product interactive as the climax. Isolated to a dedicated route so it never disrupts the existing section-form lessons.

> Note: PLAN.md calls 2.3 "Vector Addition" but the actual content is the **Dot Product**. We build against the real content.

Maps to C1 (guided narrative), C2 (adaptive pacing), C3 (interactive as climax).

## Routes & navigation (confirmed: dedicated route)
- **New route** `/story/:lessonId` → `StoryPage.tsx` (mirrors `LessonPage.tsx`'s async-load pattern). Serves the narrative view; `/lesson/2.3` stays the section form.
- **Entry points:** add a "Read as a guided story →" link card to the existing lesson 2.3 page (and a "Back to standard view" link on the story). One link in `LessonTemplate.tsx` (gated to `lesson.id === '2.3'`) keeps the prototype opt-in.
- **App.tsx:** add `<Route path="/story/:lessonId" element={<StoryPage />} />` above the catch-all.

## New files

### 1. `src/core/components/narrative/DotProductExplorer.tsx` (the climax, C3)
- New focused interactive. Reuses the **SVG drag-handle pattern** from `vera_vector_playground.tsx` (`mathToSvg`, pointer capture, snap-to-grid).
- Two draggable vectors **u** and **v**. Live readout of:
  - Dot product `u₁v₁ + u₂v₂` (algebraic).
  - Angle θ between them + the geometric form `|u||v|cos(θ)`.
  - **Similarity meter** bar: dot/(|u||v|) normalized to −1…+1, colored green (same) / amber (perpendicular/zero) / red (opposite) — directly realizing the lesson's "agreement scale" metaphor and matching the concept-check ([3,4]·[1,2]=11).
- Scoped `data-character="vera"` so the existing `.character-accent-*` utilities tint it. Includes a 3-preset challenge row (make them orthogonal → dot=0; opposite → negative; same → positive) to seed exploration.

### 2. `src/core/components/narrative/NarrativeLessonView.tsx` (the whole experience, C1+C2+C3)
The single continuous-scroll component. Structure:
- **Immersive shell** matching `ui-directions.html` `.scr-narrative`: gradient `#0f0a1a → #1a1030` background, two soft radial glows (`--ch-vera`/`--ch-vera-2`-tinted), `data-character="vera"` scope, light text on dark.
- **Sticky top progress rail:** character face (reuse `CharacterAnimation`), chapter label, monospace progress % and a gradient progress bar (mirrors `.scr-narrative .top`/`.pg-bar`). Shows current beat as you scroll.
- **Beats** rendered in order as scroll sections (Hook → Read → See → Hear → Do → Memory → Concept → Real-world), each a frosted-glass card (`rgba(255,255,255,0.04)` + `backdrop-blur`, per mockup). Each beat **reuses existing section components' content** but without per-section `SectionCompletion` footers — completion is driven by scroll/visibility (see below), so the narrative reads continuously.
  - Hook: `narrativeHook.story` + `characterMessage` as large serif "speech".
  - Read: `readContent` + `coreConcepts` as inline chips.
  - See: `seeContent` (lesson 2.3 has no `seeVideoUrl`, so skip the empty iframe rather than render a dead box).
  - Hear: `hearContent` + the **persistent audio bar** (see #3) + inline live transcript within the beat.
  - Do: `DotProductExplorer` embedded as the climax beat (C3) — inline, not a tab.
  - Memory: `memoryAids.mantra` / `.visual`.
  - Concept: `conceptCheck` rendered inline (reuse the question/options/explanation; style for dark theme).
  - Real-world: `realWorldConnection`.
- **Adaptive pacing (C2):** on mount, read stored progress via `getLessonProgress(lesson.id)`. Beats whose sections are already in `completedSections` get a subtle "✓ mastered" tag and can be collapsed by default (a "skip ahead" affordance); incomplete beats render expanded and in full. Marks a section complete when its beat scrolls into view (IntersectionObserver threshold ~0.6), calling `completeSection` — so pacing lingers on un-viewed beats and remembers mastered ones across visits. Uses a small local hook (or direct `localStorage` write matching the existing `lesson-progress-<id>` key format) to persist.
- **End-of-story footer:** reuses `LessonNavigation` (prev/next lesson) so the story chains into the rest of the course.

### 3. `src/core/components/narrative/PersistentAudioBar.tsx`
- A floating, frosted-glass audio bar pinned near the bottom of the story viewport (matches `.scr-narrative .audio`: rounded pill, `backdrop-filter: blur(8px)`, play button + waveform/progress + time).
- Wraps the existing audio element logic + `useAudioTranscript` hook (reuse, don't rewrite) so the **same** audio keeps playing as the learner scrolls between beats (unlike the current section view where audio is local to one section). Drives the "speaking" pulse on the character face and the inline live transcript sync.
- Hidden gracefully when a lesson has no `hearAudioUrl`.

### 4. `src/core/pages/StoryPage.tsx`
- Mirrors `LessonPage.tsx`: reads `lessonId` param, loads lesson + order via `getLessonDataForModuleAsync` / `getLessonOrderForModuleAsync`, handles loading/not-found, and renders `<NarrativeLessonView>`. Reuses the same data-loading code paths — no new data layer.

## Supporting changes
- **`src/App.tsx`**: import `StoryPage`, add the route.
- **`src/core/components/LessonTemplate.tsx`**: add a small "Guided story" link card (only when `lesson.id === '2.3'`) linking to `/story/2.3`. Minimal, conditional, non-disruptive.
- **`src/interactive/index.ts`** *(only if we register the explorer as a `doComponent`)* — not required for the story route since `DotProductExplorer` is imported directly by `NarrativeLessonView`. Will skip registry wiring to keep the change surface small; the explorer lives under `narrative/`.

## Verification (per PLAN.md "Verification approach")
- `npm run lint` — ensure new files are clean (note: repo baseline already has ~76 pre-existing lint errors unrelated to this work; I will not introduce new ones).
- `npm run build` — confirm it compiles and the dark narrative view is reachable in preview.
- Manual pass: open `/story/2.3` → all beats render, audio persists across scroll, transcript syncs, the dot-product climax computes correctly (verify [3,4]·[1,2]=11), completing beats persists to localStorage and adapts on reload.

## Non-goals (kept out of the prototype)
- Not re-theming all 28 interactives (that's B3).
- Not building a world map (B4).
- Not touching other lessons — only 2.3, and only via the new route.
- Not replacing the section-form `/lesson/2.3` — both views coexist so engagement can be compared (PLAN.md C1 acceptance: "measurable engagement vs. the section-form version").