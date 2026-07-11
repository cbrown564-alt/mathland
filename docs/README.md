# Mathland documentation

This directory contains living product, architecture, and authoring guidance. Repository facts belong in the root [README](../README.md); active priorities belong in the root [roadmap](../PLAN.md).

## Start here

- [Delivery roadmap](../PLAN.md) — ordered milestones, gaps, exit criteria, and immediate next work
- [Product strategy](strategic_development_plan.md) — audience, principles, strategic scope, and success measures
- [Lesson v2 design](LESSON_V2_DESIGN.md) — formal beat model and Module 2 pilot
- [Beat authoring guide](../src/content/beats/README.md) — how to add a Lesson v2 lesson
- [Interactive development guide](development/INTERACTIVE_COMPONENT_DEVELOPMENT.md) — how integrated demos are designed, registered, and tested
- [Content and visual patterns](development/content_tiers.md) — when to use interactive, visual, or narrative treatments
- [Architecture](architecture/README.md) — current system boundaries and data flow
- [History](HISTORY.md) — completed refactors and superseded planning context
- [Milestone 2 learner-validation protocol](research/MILESTONE_2_PROTOCOL.md) — study design, measures, scripts, and predeclared format-decision thresholds
- [Module 2 comprehension question bank](research/COMPREHENSION_QUESTION_BANK.md) — facilitator prompts and binary scoring keys for the comparison
- [Module 2 assignment matrix](research/ASSIGNMENT_MATRIX.md) — balanced 18-person lesson/format schedule with minimum-sample coverage
- [Milestone 2 session worksheet](research/SESSION_WORKSHEET.md) — repeatable per-participant observation and scoring form
- [Milestone 2 findings and decision](research/MILESTONE_2_FINDINGS.md) — aggregate comparison, issue log, threshold audit, and decision record

## Supporting references

- [Interactive design patterns](INTERACTIVE_COMPONENT_DESIGN_PATTERNS.md) — responsive layout and visualization principles; recommendations require re-audit before becoming roadmap work
- [Tier 2 template API](development/tier2_template_system.md) — existing reusable diagram components
- [Curriculum inventory](lessons_list.md) — concise module-level inventory; lesson files remain authoritative
- [Research prototypes](../src/interactive/examples/README.md) — intentionally isolated experiments

## Documentation rules

1. Treat committed source, tests, and configuration as the authority for implementation claims.
2. Do not hard-code volatile counts in multiple documents. The README may show a dated snapshot; detailed status should be derived from registries and lesson files.
3. Distinguish **implemented**, **reviewed**, **validated**, and **released**. These are separate states.
4. Put current priorities only in `PLAN.md`; do not create competing roadmaps.
5. Put historical completion notes in `HISTORY.md`, not in living architecture or development guides.
6. Link to source paths rather than duplicating large schemas or lesson descriptions unless the duplication is necessary for authoring.
7. Update documentation in the same change as behavior, content contracts, commands, or architecture.

## Archived and removed material

The sweep in July 2026 removed duplicate strategy and three-tier documents from `assets/`, consolidated the superseded UI plan and refactoring reports into `HISTORY.md`, and replaced the dated “production ready” test report with current, reproducible quality commands and roadmap gates.
