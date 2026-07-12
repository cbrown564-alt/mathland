# Content strategy for the open mathematical world

Status: **canonical content direction**.

The existing curriculum is useful source material, not the structure of the future product. The rebuild must not pour the current lessons into new chrome.

## Content unit

The primary content unit is a **mathematical territory**, not a module or lesson.

A territory contains:

- a stable mathematical concept or closely related family of concepts;
- prerequisite and downstream relationships;
- cases from one or more adult domains;
- one or more Studio sequences;
- optional Observatory openings;
- diagnostic detours;
- worked examples and fading-support practice;
- transfer tasks in another representation or domain;
- retrieval prompts that can return later;
- evidence rules for Atlas state.

A learner may enter a territory from several domain routes without creating duplicate versions of the mathematics.

## Case-first authoring

A strong case:

- comes from a real decision, mechanism, system, or failure mode;
- creates a genuine need for the mathematical structure;
- contains enough contextual truth to reward the learner's adult knowledge;
- can be simplified without becoming misleading;
- supports prediction, manipulation, calculation, or explanation;
- leads naturally to formal notation;
- has an honest transfer case elsewhere.

Avoid thin “real-world wrappers” where names and nouns change but the mathematical task remains a disconnected worksheet.

## Relationship between context and formalism

The content sequence should normally move through:

```text
phenomenon → learner action → noticed relationship → formal model
→ worked use → fading support → independent use → transfer → retrieval
```

Context gives formalism purpose. Formalism then makes the insight portable. Neither should be treated as optional.

## Domain lenses

The initial world has three adult entry lenses:

### Physics and engineering

Cases should foreground mechanisms, units, constraints, approximations, and how models relate to physical systems.

### Machine learning and AI

Cases should distinguish the mathematical mechanism from fashionable terminology. Use inspectable models and small data before abstraction or automation.

### Finance

Cases should foreground assumptions, uncertainty, sensitivity, and risk. Avoid presenting simplified examples as financial advice or implying certainty where none exists.

## Characters

Characters remain potentially valuable, but every appearance must serve a teaching function.

Keep a character contribution only when it provides at least one of:

- a domain-specific way of seeing;
- a useful tool or representation;
- a consistent questioning style;
- continuity across related territories;
- a memorable but mathematically accurate distinction.

Remove or rewrite appearances based mainly on decoration, generic praise, forced narrative, or repeated catchphrases.

## Salvage policy for existing content

The 96 lesson files, beat pilot, interactive registry, audio, and character assets are a quarry. Nothing is migrated wholesale.

For each existing asset, record:

1. **Mathematical value:** Is the explanation, example, problem, or representation correct and useful?
2. **Architectural fit:** Does it belong in the Atlas, Studio, Observatory, a detour, a transfer task, or nowhere?
3. **Adult relevance:** Does it respect the primary learner and connect to a credible goal?
4. **Action quality:** Does the learner do meaningful mathematical work?
5. **Transfer potential:** Can the idea be used beyond the source example?
6. **Accessibility:** Can the essential experience work across input and assistive technologies?
7. **Production cost:** Is reuse genuinely cheaper than rebuilding the idea well?

Allowed outcomes are **reuse**, **adapt**, **extract**, and **archive**. “Already implemented” is not a reason to keep something.

## Authoring standards

- State the learner outcome as an observable mathematical capability.
- Identify the motivating case and the transfer case before writing exposition.
- Separate analogy, model assumptions, definition, and proof.
- Keep notation stable across domains.
- Use worked examples for unfamiliar procedures and fade support deliberately.
- Require explanations or constructions when recognition alone is insufficient.
- Write retrieval prompts that can stand apart from the original lesson.
- Define accessibility and evidence behaviour with the content, not after it.
- Use adult, plain language without flattening mathematical precision.

## Migration sequence

1. Build and test the first vertical slice.
2. Revise the territory schema from observed learner behaviour.
3. Salvage only the source material needed for the next connected territory.
4. Expand one coherent Atlas region at a time.
5. Retire legacy routes as replacement regions become validated.

Do not convert all ten modules, all characters, or all interactive demos in advance.

## Source inventory

The current module-level inventory is recorded in [lessons_list.md](lessons_list.md). It exists to support salvage work and must not be presented as the future navigation or delivery sequence.
