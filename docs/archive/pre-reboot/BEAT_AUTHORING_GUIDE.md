# Authoring a v2 lesson (beats)

A v2 lesson is **data**: one `BeatLesson` object. The immersive stage, the paced
beat sequencer, the prose↔diagram coupling, the per-passage audio chips, and the
hands-on do beat are all generic and driven by that object. The `/story/:lessonId`
route renders whatever is registered here — no per-lesson page or bespoke code.

See `docs/LESSON_V2_DESIGN.md` for the full contract; this is the quick-start.

## The shape

Import types from `./schema`:

```ts
import type { BeatLesson } from "./schema";
```

```ts
BeatLesson<S> {
  meta: {
    id: string;              // "2.3" — matches route and v1 lesson id
    characterId: string;     // "vera" — drives --ch-accent
    title: string;
    oneLine: string;         // one-sentence subtitle
    objectives?: string[];   // hidden roadmap metadata
  };
  visual: VisualBinding<S>;  // { key: "vectorPlot" } or { render: (s) => JSX }
  beats: Beat<S>[];          // ordered, discriminated on kind
  landing: {
    mantra: string;          // shown on the completion card
    recap?: string;
    playgroundTo?: string;
  };
  exitTo?: string;           // defaults to /lesson/<id>
}
```

`S` is the **visual's state type** (e.g. `VectorState`). Passage `state` values
and the bound visual share it, so authoring is fully type-checked.

## Beat archetypes (`kind`)

Only four kinds — resist adding more.

### `couple` — predict → coupled reading → check

```ts
{
  kind: "couple",
  id, eyebrow?, title?,
  predict?: { prompt, options: [{ label, value }], nudge? },
  passages: [{ id, eyebrow?, md, state?, audioSrc? }],
  check?: { question, options[], correctAnswer, explanation },
  visual?: VisualBinding<S>,  // override lesson default for this beat
}
```

Passage bodies are **markdown strings** (`md`), not JSX. Supported inline:
`**bold**`, `*italic*`, `` `code` ``, `$u \\cdot v$` (KaTeX). Omit `state` on a
passage to hold the previous diagram state (text-only aside).

### `do` — draggable interactive finale

```ts
{
  kind: "do",
  id, eyebrow?, title?,
  predict?: Predict,
  intro?: string,            // markdown above the tool
  interactive: "dot_product_explorer",  // key into interactives.ts
  goals?: [{ tone, label }], // Continue unlocks once all tones are hit
}
```

Put the `do` beat **last** so the lesson lands on doing.

### `tell` — full-width prose (no coupled picture)

```ts
{
  kind: "tell",
  id, eyebrow?, title?,
  md: string,                // markdown + optional $$display math$$
  figure?: ReactNode,
  check?: Check,
}
```

### `recap` — in-flow mantra card

```ts
{
  kind: "recap",
  id, eyebrow?, title?,
  mantra: string,
  points?: string[],
}
```

The **landing card** on lesson completion uses `landing.mantra` (and optional
`landing.recap`). A `recap` beat is optional mid-flow reinforcement.

## Visual binding

**Preferred:** library primitive by key.

```ts
visual: { key: "vectorPlot" }
```

Registered in `src/core/components/narrative/visualRegistry.tsx`. Module 2
lessons 2.1–2.7 use `vectorPlot` with different passage states / flags.

**Escape hatch:** bespoke render prop when no primitive fits (e.g. 2.9 capstone).

```ts
visual: { render: (state) => <MyVisual state={state} /> }
```

## Add a lesson in 3 steps

1. **Author** `lesson-<id>.ts` exporting a `BeatLesson` (copy `lesson-2.3.ts`).
2. **Register** in `index.ts`:
   ```ts
   const LESSONS = { "2.3": dotProductLesson, "2.1": vectorBasicsLesson };
   ```
3. Visit `/story/<id>`. Done.

## Progress

Beat completion flows through `useLessonProgress` — finishing the last beat sets
`lessonCompleted`, which WorldMap and ModulePage read alongside v1 section progress.
Furthest beat index is stored as `beatIndex` in the same localStorage key.

## Audio

Clips live in `public/audio/story/<id>/` and are generated with
`npm run narration <id>` (see `scripts/generate-narration.mjs`). Reference per-passage
chips on `audioSrc` in passage data.
