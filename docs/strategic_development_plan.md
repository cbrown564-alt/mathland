# Mathland product strategy

The active delivery sequence and acceptance criteria live in the root [roadmap](../PLAN.md). This document records the durable product strategy behind that plan.

## Purpose and audience

Mathland helps adult learners build the mathematics needed for data science through rigorous explanations, purposeful interaction, and memorable character guides. Characters are teaching devices: their language, visual identity, and domain expertise should clarify mathematical thinking rather than add decoration.

## Product principles

1. **Mathematics first.** Every story, visual, and interaction must serve a specific learning objective.
2. **Adult by default.** Use clear, respectful language and professionally relevant applications; avoid reward mechanics that trivialize the material.
3. **Interaction where it changes understanding.** Reserve bespoke interactives for concepts that benefit from manipulation, feedback, or spatial reasoning.
4. **One coherent journey.** Navigation, progress, vocabulary, and interaction patterns should remain predictable across characters and modules.
5. **Evidence before scale.** Validate the Module 2 lesson-format pilot before converting the remaining curriculum.
6. **Quality is multidimensional.** File existence and build success do not substitute for mathematical review, accessibility, performance, or learner outcomes.

## Content model

The three-tier model remains useful as an authoring heuristic, not as a delivery schedule:

- **Tier 1 — interactive:** manipulation is central to the objective and gives meaningful feedback.
- **Tier 2 — visual:** a diagram, comparison, or process view materially improves comprehension without requiring interaction.
- **Tier 3 — narrative:** carefully structured prose, examples, and checks are the clearest treatment.

A lesson may combine tiers. Choose the least complex treatment that achieves the learning objective. The current implementation details are documented in [Content and visual patterns](development/content_tiers.md).

## Strategic focus

The near-term product is a validated, high-quality flagship learning path, not maximum feature breadth. Module 2 is the best candidate because all nine lessons exist in both the original content system and the Lesson v2 pilot, and its vector concepts benefit from visual and interactive treatment.

Work should therefore prioritize:

- learner evidence for the lesson-format decision;
- mathematical, editorial, accessibility, and interaction quality in Module 2;
- automated quality gates and operational readiness;
- a repeatable module-finish checklist.

Broader features—accounts, cloud synchronization, teacher tools, native mobile applications, and additional curricula—remain hypotheses. They should enter the roadmap only after learner value and retention justify the additional platform complexity.

## Success measures

Measures should be defined before validation begins. At minimum:

- comprehension-check performance and misconceptions;
- lesson and module completion;
- time-on-task interpreted alongside comprehension;
- navigation or interaction failures;
- return/resume success;
- accessibility task completion;
- learner confidence and qualitative clarity;
- technical reliability and performance on supported devices.

Targets belong in the learner-validation protocol, not retroactively in a status document.

## Current strategic decision

The committed code supports a strong MVP and a substantial content inventory. It does not yet support a claim of a production-ready or educationally validated platform. The next investment is depth and evidence in one flagship module, followed by deliberate scaling using the root roadmap.
