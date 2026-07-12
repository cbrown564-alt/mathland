# Content and visual treatment guide

Mathland uses three content treatments. They are authoring choices, not quality levels and not a promise that every lesson needs a bespoke component.

## Choose from the learning objective

| Treatment | Use when | Avoid when |
| --- | --- | --- |
| Interactive | Manipulation, immediate feedback, spatial reasoning, or experimentation materially changes understanding | The activity merely animates an explanation or adds controls without a learning decision |
| Enhanced visual | A diagram, comparison, worked process, or application view reduces cognitive load | Static prose or a small equation would be clearer |
| Narrative | Sequenced explanation, analogy, examples, and checks are sufficient | The concept depends on movement, geometry, or parameter exploration |

A lesson may combine all three. Use the simplest treatment that achieves the objective and remains accessible.

## Interactive treatment

An interactive must have:

- an explicit learning objective and learner action;
- immediate, mathematically correct feedback;
- instructions that do not depend on guessing the controls;
- keyboard and touch operation where feasible;
- visible focus, adequate targets, and semantic labels;
- a textual or equivalent alternative when a canvas carries essential information;
- responsive behavior and a bounded rendering cost;
- a meaningful completion signal when connected to lesson progress.

Integrated components live in `src/interactive/components/` and are listed in `src/interactive/demos/demo_registry.ts`. Follow [INTERACTIVE_COMPONENT_DEVELOPMENT.md](INTERACTIVE_COMPONENT_DEVELOPMENT.md).

## Enhanced visual treatment

Use the templates in `src/tier2/` for repeatable structures such as process flows, comparisons, application contexts, and mathematical diagrams. A visual should:

- state the relationship it is meant to reveal;
- preserve mathematical scale, notation, and direction accurately;
- remain legible at supported widths;
- include text alternatives and not rely on colour alone;
- use character styling as a secondary layer, not the information channel.

The existing API is described in [tier2_template_system.md](tier2_template_system.md). Verify that examples still compile before copying them; source code is authoritative.

## Narrative treatment

Narrative content should:

- lead with the problem or intuition, then name and formalize the concept;
- use the character's domain voice consistently without turning explanations into performance;
- connect prose, equations, worked examples, and checks in one logical sequence;
- distinguish analogy from mathematical definition;
- use professional, plain language appropriate for adult learners;
- end with retrieval or application, not only recognition.

The section-based JSON model is defined by `src/core/types/lesson.ts`. The Module 2 beat pilot is specified in [../LESSON_V2_DESIGN.md](../LESSON_V2_DESIGN.md).

## Quality review

Every release-scope lesson needs four distinct reviews:

1. Mathematical correctness and notation.
2. Editorial clarity, continuity, and character consistency.
3. Accessibility, responsive behavior, and interaction usability.
4. Learner validation against declared objectives.

Implementation status in a registry is not a substitute for these reviews. The active sequencing and exit criteria are in the root [roadmap](../../PLAN.md).
