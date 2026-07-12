# Lesson v2 — the beat design (formal spec)

Status: **Module 2 implementation pilot complete; learner validation pending.** This is the source of truth for the `/story/:lessonId`
lesson format. The reference implementation is lesson **2.3** (Vera · The Dot Product).
Authoring quick-start lives in `src/content/beats/README.md`; this doc is the *why*
and the *contract*.

---

## 1. The spine (what we keep)

Four ideas carry the format. Everything else serves them.

1. **The beat is the unit of pacing.** A lesson is a short ordered sequence of beats,
   shown one at a time. A beat does one thing, then advances. No section drags.
2. **Prose is coupled to a picture.** In a teaching beat, a column of prose drives a
   single sticky diagram; as you scroll, the diagram *interpolates* toward the state
   of the passage you're reading. Read and See are one act, not two dead tabs.
3. **The lesson lands on "do".** The final beat swaps the read-only picture for a
   draggable interactive, and completion is gated on the learner hitting real outcomes.
4. **A lesson is data, rendered by one generic engine.** No per-lesson page or bespoke
   flow code. Character identity comes from a single `data-character` attribute driving
   `--ch-accent` (`src/index.css`).

Two cheap multipliers ride along: **predict-before-read** (a one-tap commitment before
a passage) and **audio demoted to a per-passage chip** (voice is seasoning, not spine).

---

## 2. What v1 had, and where each piece goes

The old 8-section `LessonData` (96 lessons) maps cleanly onto beats. Decisions:

| v1 field | v2 home |
|---|---|
| `narrativeHook` | opening beat framing / stage cold-open |
| `readContent` + `seeContent` | **merged** → coupled passages (prose + diagram state) |
| `hearContent` / audio | per-passage `AudioChip` |
| `doContent` + `doComponent` | the `do` (climax) beat |
| `conceptCheck` | per-beat `check` |
| `realWorldConnection` | a "where it lives" `couple` or `tell` beat |
| `memoryAids.mantra` | the **`recap`** beat / landing card (do **not** drop) |
| `learningObjectives`, `coreConcepts` | `meta.objectives` — hidden syllabus metadata, not shown mid-flow |

---

## 3. The formal schema

A lesson is one object. `S` is the *visual's* state type (owned by the visual, not the
lesson), so a lesson that binds `vectorPlot` feeds `VectorState`s to its passages.

```ts
interface BeatLesson<S> {
  meta: {
    id: string;              // "2.3" — matches the route and the v1 lesson id
    characterId: string;     // "vera" — drives --ch-accent
    title: string;           // "The Dot Product"
    oneLine: string;         // one-sentence syllabus subtitle
    objectives?: string[];   // hidden metadata for the roadmap (from v1 learningObjectives)
  };
  visual: VisualBinding<S>;  // the default coupled/climax picture (a beat may override)
  beats: Beat<S>[];          // ordered, archetyped
  landing: {
    mantra: string;          // the retained memory aid
    recap?: string;          // optional closing paragraph
    playgroundTo?: string;   // optional deep-dive link on the completion card
  };
}
```

### 3.1 The visual binding (hybrid: library + escape hatch)

```ts
type VisualBinding<S> =
  | { key: VisualKey }                    // from the shared primitive library (preferred)
  | { render: (state: S) => ReactNode };  // bespoke escape hatch (when a lesson truly needs it)
```

- **Library first.** A `VisualKey` names a registered primitive that ships two coupled
  faces — a **read-only** renderer (follows the prose) and a **draggable climax twin**
  (used by a `do` beat) — plus its state type. See §5.
- **Escape hatch** is a plain render prop for the rare bespoke case. It keeps the door
  open without polluting the registry. A bespoke climax still registers its interactive
  in `INTERACTIVES` (unchanged contract).

### 3.2 Beat archetypes (a small closed set)

Beats are a discriminated union on `kind`. Only four kinds — resist adding more.

```ts
type Beat<S> = CoupleBeat<S> | DoBeat | TellBeat | RecapBeat;

interface BeatBase { id: string; eyebrow?: string; title?: string; }

// The workhorse: predict? → coupled reading → check?
interface CoupleBeat<S> extends BeatBase {
  kind: "couple";
  predict?: Predict;              // one-tap commitment before reading
  passages: Passage<S>[];         // prose + the diagram state each drives
  check?: Check;                  // active recall after
  visual?: VisualBinding<S>;      // override the lesson default for this beat
}

// The finale: a draggable interactive with goal-gated completion.
interface DoBeat extends BeatBase {
  kind: "do";
  predict?: Predict;
  intro?: string;                 // markdown, shown above the tool
  interactive: string;            // key into INTERACTIVES (or the library's climax twin)
  goals?: { tone: string; label: string }[]; // Continue unlocks once all tones are hit
}

// Full-width prose: a definition, a derivation, a framing — no coupled picture.
// The archetype that makes non-lerp-able concepts (proofs, abstract spaces) first-class.
interface TellBeat extends BeatBase {
  kind: "tell";
  md: string;                     // markdown + $katex$
  figure?: ReactNode;            // optional static illustration
  check?: Check;
}

// The landing: the mantra as a designed card. Usually last, or after a hard idea.
interface RecapBeat extends BeatBase {
  kind: "recap";
  mantra: string;
  points?: string[];
}
```

Supporting shapes:

```ts
interface Passage<S> {
  id: string;
  eyebrow?: string;
  md: string;          // markdown + $katex$ (see §4) — replaces today's JSX body
  state?: S;           // diagram target; omit to hold the previous state (text-only aside)
  audioSrc?: string;   // optional per-passage voice chip
}
interface Predict { prompt: string; options: { label: string; value: string }[]; nudge?: Record<string,string>; }
interface Check   { question: string; options: string[]; correctAnswer: number; explanation: string; }
```

### 3.3 Authoring rhythm (guidance, not schema)

Predict and check are *optional* and should be *earned*, not reflexive:

- **Predict** only when a genuine prediction exists (a counterintuitive or sign-flipping
  claim). Don't ask learners to predict a definition.
- **Check** on beats that introduce a testable idea. A pure framing/`tell` beat can skip it.
- Aim for **3–5 beats**, ending on a `do`. A `recap` before or as the finale is optional.
- One idea per beat. If a beat needs two checks, it's two beats.

---

## 4. Authoring format — Markdown + KaTeX

Passage and `tell`/`intro` bodies are **strings**, not JSX. The engine renders a
constrained markdown subset plus inline math, so content is data (localizable, diffable,
authorable without React).

Supported inline: `**bold**`, `*italic*`, `` `code` ``, and `$…$` for KaTeX math.
Block math `$$…$$` is allowed in `tell` beats. Nothing else (no raw HTML, no links in
passages) — keep the surface tiny.

```yaml
passages:
  - md: "Point them the same way and something *adds up* — the **dot product** $u\\cdot v$."
    state: { u: [3, 4], v: [3.4, 2.6], emphasis: none }
```

Rendering: a small `Prose` component (built on `katex` + a minimal inline parser) styled
to the existing serif reading type. `katex` is the only new dependency; we self-host its
CSS. No `react-markdown`/MDX — the subset is small enough to parse directly and keeps the
bundle lean.

---

## 5. The visual primitive library

The honest bottleneck in the prototype: every lesson needed a bespoke coupled visual
**and** a bespoke climax. That's ~200 components across the course. The library fixes it.

A primitive is registered under a `VisualKey` and exposes:

```ts
interface VisualPrimitive<S> {
  ReadOnly: ComponentType<{ state: S }>;                 // follows the prose (interpolated)
  Climax:   ComponentType<InteractiveProps>;             // draggable twin for `do` beats
  interpolate?: (a: S, b: S, t: number) => S;            // defaults to deepLerp
}
```

`interpolate` defaults to `deepLerp` (numbers ease, arrays elementwise, discrete values
snap). A primitive with non-numeric state supplies its own or relies on snap.

**The pilot proves the model with one primitive.** Module 2 (2.1–2.7) is served entirely
by a single parametric `vectorPlot` with flags:

| flag | shows |
|---|---|
| `emphasis` | which element to highlight (`u` / `v` / `angle` / `none`) |
| `sum` | draw `u + v` (2.2 addition) |
| `scale` | scalar-multiple ghost of a vector (2.2) |
| `unitCircle` | unit circle + magnitude (2.4 norms) |
| `span` | the line/plane spanned (2.5 combinations, 2.6 independence) |
| `basis` | basis vectors + reconstructed grid (2.7 basis & dimension) |

If one visual covers seven lessons, the library model holds. `matrixTransform`,
`curvePlot`, `distribution`, etc. come later, per module, on demand — never speculatively.

Seed the library from the existing 24+ interactives (e.g. `DotProductExplorer` becomes
`vectorPlot.Climax`) rather than rewriting.

---

## 6. Progress — one model

The prototype persisted `beatflow-<id>` in its own localStorage key, parallel to the v1
`useLessonProgress`. **`useLessonProgress` is now the single source of truth**:
finishing the last beat marks the lesson complete there, and "furthest beat" is stored as
per-lesson beat state under the same hook. The v1 8-section player keeps reading the same
completion flag, so a lesson done in v2 shows done everywhere. Prototype keys are migrated
once, and hydration is guarded so stored progress is not overwritten by initial defaults.

---

## 7. The Module 2 pilot

Prove the whole format on one module (9 lessons) before committing the other nine modules.
Module 2 is deliberately chosen: it stresses the library (one primitive, seven lessons),
the `tell` archetype (2.8 is abstract), and the escape hatch (2.9 capstone).

| # | title | archetypes | visual |
|---|---|---|---|
| 2.1 | Vector Basics | couple ×2 → do | `vectorPlot` (single vector, components) |
| 2.2 | Addition & Scalar Multiplication | couple ×2 → do | `vectorPlot { sum, scale }` |
| 2.3 | The Dot Product | couple ×3 → do | `vectorPlot` (angle, dot) — **reference, migrate** |
| 2.4 | Vector Norms | couple ×2 → do | `vectorPlot { unitCircle }` |
| 2.5 | Linear Combinations | couple ×2 → do | `vectorPlot { span }` |
| 2.6 | Linear Independence | couple → tell → do | `vectorPlot { span }` |
| 2.7 | Basis & Dimension | couple ×2 → recap → do | `vectorPlot { basis }` |
| 2.8 | Vector Spaces (abstract) | tell ×3 → couple → recap | minimal / escape hatch |
| 2.9 | Forest Mapping Capstone | couple → do (big) | bespoke escape hatch |

Exit criteria for the pilot: authoring a new Module-2 lesson is *only* writing a data file
(no new component) for 2.1–2.7; 2.8 works with no coupled visual; one progress model; the
build and the reading experience hold up on mobile.

---

## 8. Build order

1. **`Prose` renderer** — `katex` + inline parser; swap passage `body: JSX` → `md: string`.
2. **Schema refactor** — archetype union (`kind`), `meta`, `landing`, `VisualBinding`;
   migrate `lesson-2.3` to it as the reference; update `README.md`.
3. **`vectorPlot` primitive** — generalize `VectorVisual` (ReadOnly) + `DotProductExplorer`
   (Climax) into one registered primitive with the §5 flags.
4. **Progress unification** — complete: beat completion and migration use `useLessonProgress`.
5. **Author 2.1–2.9** — data only for 2.1–2.7; 2.8 tell-beats; 2.9 capstone.
6. **Review the pilot** — complete: responsive, route, persistence, structure, and build gates pass.
7. **Choose the next module** based on the primitive needed; do not scale all modules at once.

---

## 9. Open questions (park until after the pilot)

- **Assessment weight** — is the per-beat `check` enough, or does a lesson need a graded
  end check that feeds the roadmap?
- **Non-lerp visuals at scale** — matrices/distributions may want keyframed (not
  interpolated) transitions; revisit `interpolate` once `matrixTransform` exists.
- **Localization** — the md-string format enables it; no work until it's a real need.
