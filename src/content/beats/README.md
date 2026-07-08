# Authoring a v2 lesson (beats)

A v2 lesson is **data**: one `BeatLesson` object. The immersive stage, the paced
beat sequencer, the prose↔diagram coupling, the per-passage audio chips, and the
hands-on climax are all generic and driven by that object. The `/story/:lessonId`
route renders whatever is registered here — no per-lesson page or bespoke code.

## The shape

Import everything from `./schema`:

```ts
import { BeatLesson } from "./schema";
```

```ts
BeatLesson<S> {
  lessonId, characterId, label      // metadata (label shows in the route header)
  exitTo?                            // defaults to /lesson/<id>
  renderVisual: (state: S) => JSX    // draws the coupled + climax picture
  beats: BeatData<S>[]               // the ordered teaching units
}
```

`S` is the **visual's state type** (e.g. `VectorState`). Every beat's coupled
`state` and `renderVisual` share it, so authoring is fully type-checked.

### A beat (`BeatData<S>`)

```ts
{
  id, eyebrow?, title?
  predict?  // { prompt, options:[{label,value}], nudge? } — commit before reading
  passages? // coupled reading: [{ id, eyebrow?, body(JSX), state:S, audioSrc? }]
  check?    // { question, options[], correctAnswer, explanation }
  climax?   // a "do" beat instead of reading (see below)
}
```

A normal beat runs **predict → coupled reading → check**. As the reader scrolls a
passage to the centre, `renderVisual(passage.state)` is what the sticky diagram
interpolates toward, so the picture animates to the words.

### A climax beat (`climax`)

```ts
climax: {
  interactive: "dot_product_explorer",   // key into interactives.ts
  intro?: JSX,
  goals?: [{ tone, label }]              // Continue unlocks once all tones are hit
}
```

Swaps the read-only picture for a draggable interactive; `goals[].tone` matches
the tone the interactive reports via `onStateChange`. Put the climax **last** so
the lesson lands on doing.

## Add a lesson in 3 steps

1. **Author** `lesson-<id>.tsx` exporting a `BeatLesson`
   (copy `lesson-2.3.tsx` as the reference).
2. **Register** it in `index.ts`:
   ```ts
   const LESSONS = { "2.3": dotProductLesson, "3.3": matrixLesson };
   ```
3. Visit `/story/<id>`. Done.

## Adding a new visual or interactive

- **Coupled visual** (read-only, follows the prose): write a component that takes
  `{ state: S }` and pass it as `renderVisual`. Make `S` lerp-friendly (numbers /
  arrays of numbers) so `CoupledVisual`'s default interpolation animates it.
- **Climax interactive** (draggable): add it to `interactives.ts` under a key and
  have it call `onStateChange({ dot, cos, tone })` (or whatever tones your goals
  use). Reference the key from a beat's `climax.interactive`.

Audio clips live in `public/audio/story/<id>/` and are generated with
`npm run narration <id>` (see `scripts/generate-narration.mjs`).
