# Product

This is the design-facing product context used by interface tooling and agents. The canonical product decisions remain in [docs/PRODUCT_DOCTRINE.md](docs/PRODUCT_DOCTRINE.md), [docs/EXPERIENCE_ARCHITECTURE.md](docs/EXPERIENCE_ARCHITECTURE.md), [docs/CONTENT_STRATEGY.md](docs/CONTENT_STRATEGY.md), and [docs/FIRST_VERTICAL_SLICE.md](docs/FIRST_VERTICAL_SLICE.md). If this summary and those documents diverge, the canonical documents win.

## Register

product

## Platform

web

## Users

Mathland is for motivated adults rebuilding mathematics to reach something harder they already care about: physics, engineering, machine learning, AI, finance, or a neighbouring technical field. They often bring strong professional judgement and uneven formal prerequisites. They are willing to work hard, but they should never have to translate school-grade framing, unfamiliar product conventions, or a punitive answer gate before they can engage with the mathematics.

The primary workflow is sustained, focused study on a responsive web surface. Learners enter through a consequential goal, work on a mathematical object, use help when needed, and leave with a meaningful resume point. Keyboard, touch, screen reader, zoom, reduced-motion, and narrow-screen journeys are first-class versions of the same experience.

## Product Purpose

Mathland helps adults acquire mathematical power for a harder thing they already care about. Its distinctive architecture is **Atlas outside, Studio inside, Observatory selectively**: the Atlas provides orientation and return paths; the Studio develops capability through prediction, manipulation, calculation, explanation, formalisation, transfer, and retrieval; the Observatory creates concentrated wonder before handing the learner back to work.

Success is not page completion. A successful learner can orient themselves, make and revise a mathematical move, explain why it works, recognise the structure in another setting, recover from a prerequisite gap without shame, and retrieve the idea later.

The first vertical slice—one dot product across engineering work, AI similarity, portfolio return, and later retrieval—has received mildly positive early reviews. Its visual direction is promising, but the next iteration must treat flow clarity, interaction depth, transfer framing, error recovery, onboarding, and multimodal teaching as core product work rather than polish.

## Positioning

Mathland is an open mathematical world where adults learn one rigorous structure deeply enough to see and use it across the real systems they care about.

## Brand Personality

**Welcoming, rigorous, wondrous.** Mathland speaks to an intelligent adult who may feel rusty, not incapable. Its voice is calm and exact, with visible enthusiasm for mathematical ideas and no remedial euphemisms. Wonder comes from a phenomenon becoming intelligible; confidence comes from tools, honest feedback, and earned progress.

Field specialists, illustration, audio, and video are part of the teaching language. Vera and future guides contribute domain tools, questions, demonstrations, and ways of seeing. They are neither mascots nor decorative narrators. Every modality must articulate something that prose or the interactive alone does not, and every essential meaning remains available through an accessible alternative.

## Anti-references

- **Editorial spectacle that crowds out work:** oversized words, poster-like pacing, and repeated full-viewport introductions that make every moment feel like a feature article.
- **Novelty without orientation:** asking learners to infer whether a horizon is permanent, what the Atlas does, or how a Studio behaves from unfamiliar interface conventions.
- **Underpowered interaction theatre:** controls that animate a result without supporting meaningful experimentation, comparison, calculation, explanation, or revision.
- **Punitive correctness gates:** “not yet” loops that preserve the same prompt and withhold progress without diagnosing the mistake or teaching a next move.
- **Surprise domain switches:** finance or climate language introduced as an unannounced second test of domain familiarity rather than a carefully framed test of mathematical transfer or retrieval.
- **Active-learning shallowness:** using short copy and interaction as a reason to omit definitions, derivations, theorems, assumptions, worked reasoning, or sustained mathematical writing when they are the right medium.
- **Silent or decorative media:** characters, illustration, audio, motion, and video that add atmosphere without adding mathematical meaning, or that become required without transcripts, captions, controls, and non-visual equivalents.

## Design Principles

### Make the unfamiliar experience learnable

The first-run tour is itself a small, welcoming Studio. In five to seven minutes it lets the learner predict, manipulate, check, make a harmless mistake, use a cue, see evidence recorded, and visit the Atlas. It explains why the approach works while giving a real glimpse of mathematical wonder. The tour runs once, can be skipped, and remains available from predictable help.

The learner chooses a **horizon once per journey**, not once per screen. It remains visible as a compact, plain-language destination in persistent navigation, including during detours, and can be changed deliberately from the Atlas or goal menu. Returning learners resume at the last meaningful action; they do not repeat goal selection.

### Put the mathematical object before the editorial frame

Words establish the question and name what matters, then yield space to the representation, controls, working, feedback, and formal spine. Page-sized headlines are reserved for rare Observatory openings. Studio headings orient rather than perform. Explanations, definitions, derivations, and theorems sit beside the object or step they explain and can expand to sustained reading when the idea deserves it.

### Make every action mathematically powerful

Manipulation must support purposeful comparison, extreme cases, exact input, undo or reset, readable state, and a visible connection between geometric, component, symbolic, and contextual representations. Calculation must expose contributions and reasoning, not merely collect a scalar. Experimentation must let the learner form and test a claim. Explanation prompts need examples, criteria, and feedback appropriate to meaning—not a character-count threshold.

The quality bar is not “interactive and functional.” Every emphasized Studio component must be the clearest available way to learn that mathematical move, across pointer, touch, keyboard, and assistive technology.

### Treat wrong answers as the beginning of teaching

Never erase a learner’s work or repeat the same generic message. Feedback should first acknowledge the attempted reasoning, then locate the first meaningful divergence, show the consequence in the current representation, and offer the smallest useful next action. Support escalates progressively: specific observation, focused cue, comparison, worked step, diagnostic detour, then a fresh equivalent attempt.

Learners may continue after supported completion, with the evidence recorded honestly as cued, worked, or restudied. Independent evidence still requires independent performance; it must never be fabricated by a lock or by accepting an unexplained answer.

### Frame transfer before changing the nouns

Before finance transfer, state why the learner is leaving engineering, which mathematical structure stays fixed, which domain terms are new, and what simplifying assumptions apply. Offer a compact worked orientation to weights and realised returns before the transfer attempt. A learner may defer the domain without being trapped, but Mathland must record that transfer is not yet demonstrated.

Delayed retrieval must test memory for the structure, not accidental climate-domain literacy. Introduce the sensor model and units plainly, separate domain orientation from the retrieval attempt, and reveal cues in stages. If the context itself blocks access, offer an equivalent unfamiliar context and record the substitution.

### Use guides and media as mathematical instruments

Assign each guide a territory, professional lens, questioning style, and signature tool. A guide appears when that perspective changes what the learner can notice or do. Illustration clarifies structure, mechanism, scale, or context. Audio supports careful verbal reasoning, pronunciation, pacing, and reflection. Video demonstrates motion, construction, historical apparatus, or a professional way of working. None autoplay; all are short, controllable, captioned or transcribed, and paired with a complete non-media path.

## Accessibility & Inclusion

Meet WCAG 2.2 AA as a baseline and test from 320 CSS pixels upward. Every essential drag interaction has keyboard and explicit-control alternatives; visible focus, reading order, labels, errors, and help remain predictable. Color, motion, audio, and spatial position are never the only carriers of meaning. Reduced-motion alternatives preserve the mathematical state change. Video is captioned; audio and video have transcripts; illustrations and visual models have concise alternatives that describe the mathematical relationship rather than decorative appearance.

Design explicitly for maths anxiety without lowering the intellectual standard: preview unfamiliar interaction patterns, use reversible low-stakes actions, preserve work after errors, distinguish domain unfamiliarity from mathematical difficulty, and describe evidence without ranking or shame.
