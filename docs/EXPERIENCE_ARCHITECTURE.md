# Atlas–Studio–Observatory experience architecture

Status: **canonical experience architecture**.

Mathland is organised as an open mathematical world. The Atlas, Studio, and Observatory form a hierarchy of responsibilities:

```text
Atlas        Where am I, what connects, and where could I go?
  └─ Studio  What mathematical move do I make now?
       └─ Observatory  Why is this phenomenon worth sustained attention?
```

The Observatory is not always nested visibly inside a Studio and the Studio can be entered directly. The hierarchy describes product purpose, not URL structure.

## Atlas

### Responsibility

The Atlas gives the learner orientation, agency, and long-term coherence.

It represents:

- mathematical territories and the relationships between them;
- multiple domain routes through shared concepts;
- prerequisites that are required, optional, or currently uncertain;
- ideas the learner has encountered, can use, or should revisit;
- active cases, open questions, and useful next moves;
- a reliable route back to the learner's motivating goal after a detour.

### What the Atlas is not

It is not a decorative world map, module-card grid, syllabus tree, progress dashboard, or fixed level selector. A learner should be able to answer “Where am I?”, “Why does this matter?”, and “What can I do next?” within seconds.

### Progress semantics

The Atlas must distinguish at least:

- **encountered:** the learner has seen or explored the idea;
- **supported:** the learner can use it with scaffolding;
- **independent:** the learner can solve an appropriate problem without scaffolding;
- **transferable:** the learner can recognise and use it in a new context;
- **due for return:** retrieval evidence has weakened or sufficient time has passed.

These states must be based on evidence from learner actions, not page views.

## Studio

### Responsibility

The Studio is the default place where learning happens. It combines a consequential prompt, a mathematical object, working tools, feedback, and reflection in one continuous surface.

### Core loop

1. **Encounter:** a case or question creates a genuine need for the idea.
2. **Predict:** the learner commits to an expectation before the result is revealed.
3. **Manipulate or construct:** the learner changes a model, representation, calculation, or argument.
4. **Notice:** the interface directs attention to the mathematical consequence of the action.
5. **Formalise:** notation and definitions name the structure the learner has encountered.
6. **Practise with fading support:** worked steps disappear as competence grows.
7. **Explain:** the learner accounts for the result rather than only selecting it.
8. **Transfer:** the same structure appears in a different case or representation.
9. **Return:** the Atlas schedules later retrieval.

Not every Studio must render all nine steps in one sitting, but the complete learning path must include them.

### Interaction contract

Every essential Studio interaction must:

- cause a mathematically meaningful state change;
- provide immediate, accurate, action-oriented feedback;
- support keyboard and touch, with a non-drag alternative when dragging is offered;
- keep the relevant explanation adjacent to the changing representation;
- preserve scale, sign, notation, and units accurately;
- expose a readable alternative to essential canvas or visual information;
- respect reduced motion and remain usable from 320 CSS pixels upward;
- define what evidence is recorded for Atlas progress.

### First-run workshop tour

The unfamiliar architecture must teach itself through a five-to-seven-minute, skippable and reopenable first-run Studio. It demonstrates prediction, manipulation, checking, a harmless wrong attempt, progressive help, evidence semantics, and Atlas orientation. The tour uses the same input and accessibility standards as the main experience. Skipping it does not block entry, and Help exposes it again from every main surface.

### Error-recovery sequence

An incorrect attempt stays visible and editable. The Studio identifies the first meaningful divergence and offers support in this order:

1. a specific observation about the learner's current work;
2. a focused cue;
3. a comparison that exposes the consequence;
4. one worked step;
5. a diagnostic detour with exact return state;
6. a fresh equivalent attempt.

Learners can continue after supported completion. The Atlas records the support level and leaves independent evidence open.

### Formal spine

Each territory identifies the precise definitions, notation, assumptions, derivations, theorem or proof treatment, worked reasoning, and domain boundaries needed to make the insight portable. These elements sit beside the relevant object or step; interaction is not a reason to hide them, and formal exposition is not a reason to postpone learner action.

## Observatory

### Responsibility

The Observatory creates concentrated attention around a phenomenon that is difficult to perceive through prose alone.

Good Observatory candidates include:

- a transformation whose invariant is otherwise invisible;
- a limit, field, distribution, or high-dimensional relationship that benefits from motion or scale;
- the same structure appearing unexpectedly across several real systems;
- a historical or physical case whose reveal creates a useful question.

### Observatory sequence

1. Present the phenomenon with minimal chrome.
2. Ask for a prediction or observation.
3. Let the learner control the reveal.
4. Name the mathematical question that has emerged.
5. Hand off to the Studio before spectacle replaces work.

The Observatory fails if learners remember the presentation but cannot use the mathematics.

## Domain routes

Physics, engineering, AI, and finance are lenses across the same Atlas. A concept can own several cases, but its formal identity remains stable.

For example, the dot product can appear as:

- work done by a force along displacement;
- similarity between embedding vectors;
- portfolio return as weights dotted with asset returns.

The experience should make both the contextual differences and the shared mathematical structure explicit.

## Diagnostic detours

The system should not ask adults to declare a school level. It should infer gaps from relevant actions.

A detour must:

- state the immediate reason it is useful;
- teach the smallest prerequisite that restores progress;
- preserve the original case and return path;
- avoid remedial language and arbitrary locks;
- allow confident learners to demonstrate competence and continue;
- update Atlas evidence without pretending that one correct answer establishes mastery.

## Character role

Characters are continuity across territories, not the navigation model itself.

Each guide should have:

- a mathematical territory and set of tools;
- a recognisable way of asking questions and directing attention;
- professional credibility appropriate for adults;
- restrained visual identity;
- language that clarifies the concept without catchphrase repetition.

Vera, for example, owns direction, magnitude, projection, similarity, and vector composition. She is not an avatar placed beside generic vector content.

## Navigation and shell principles

- The learner's active goal and return path are always visible.
- The Atlas is reachable without losing Studio state.
- Help appears consistently and never changes context on focus.
- A learner can pause and resume at the last meaningful action, not merely the last page.
- Domain switching reveals alternative cases without duplicating the underlying concept.
- No global chrome competes with the current mathematical object.
- Progress is descriptive and evidential, not celebratory theatre.
- The active horizon is chosen once, named in plain language, and deliberately editable without losing current work.
- Routine headings orient compactly; mathematical work remains visible above the fold on a typical laptop viewport.
- Help and the first-run tour are available from a predictable global location.
- Transfer and retrieval introduce domain terms and assumptions before the evidence-bearing attempt.

## First proof

The architecture will be tested through the integrated vertical slice in [FIRST_VERTICAL_SLICE.md](FIRST_VERTICAL_SLICE.md). No broad shell rebuild or curriculum migration should begin before that slice produces credible learner evidence.
