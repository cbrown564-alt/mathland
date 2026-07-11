# Mathland delivery roadmap

This is the active execution plan for taking Mathland from a strong technical MVP to a high-quality, learner-validated release. It supersedes the July 2026 A/B/C UI implementation plan; completed work from that plan is summarized in [docs/HISTORY.md](docs/HISTORY.md).

## Product position

Mathland is a React 18 and TypeScript mathematics-learning application for adults moving toward data science. The committed product currently contains:

- 96 JSON lessons across 10 modules;
- 10 character guides;
- 30 ready interactive demos in the canonical registry;
- a nine-lesson Module 2 pilot of the beat-based Lesson v2 format;
- local progress persistence, character theming, responsive application chrome, and production routing;
- 63 passing Jest tests across 16 suites and a passing production build.

These numbers describe repository inventory, not learner outcomes. “Complete curriculum” means the lesson files exist; it does not mean every lesson has passed editorial, mathematical, accessibility, or learner validation.

## Definition of a high-quality finish

A release candidate is ready only when all of the following are true:

1. **Correct:** priority lessons have mathematical and editorial review, with no known high-severity content defects.
2. **Coherent:** one lesson format is selected from evidence, and every release-scope lesson follows its authoring and interaction standards.
3. **Usable:** core journeys work at keyboard, touch, mobile, tablet, and desktop sizes.
4. **Accessible:** the release scope meets WCAG 2.2 AA expectations, including focus order, contrast, reduced motion, canvas alternatives, and screen-reader labels.
5. **Reliable:** build, lint, unit/integration tests, and critical browser journeys are automated CI gates.
6. **Performant:** agreed budgets are measured on representative devices; large visualizations do not block initial navigation.
7. **Validated:** representative learners can complete the pilot, and decisions are based on observed comprehension and friction rather than internal preference.
8. **Operable:** deployment, smoke testing, rollback, privacy, analytics, and issue-triage procedures are documented.

## Current gaps

- Lesson v2 is implemented for Module 2 but has not yet been validated against the section-based lesson experience.
- The repository has 96 ESLint warnings, mainly React hook dependencies and Fast Refresh boundaries. Hook warnings in interactive canvases deserve priority because stale closures can cause behavioral bugs.
- Test coverage is concentrated in shared UI, registries, progress, and the story route; critical learner journeys do not yet have browser-level coverage.
- “Ready” in the interactive registry means integrated code status, not a completed accessibility, content, responsiveness, or learner-quality audit.
- No committed evidence establishes production analytics, account sync, formal privacy practices, or learner outcome measurement.
- Several large bundles and visualization chunks warrant explicit performance budgets and measurement.

## Roadmap

### Milestone 1 — Establish the release baseline

Goal: make quality visible and prevent regressions before expanding content.

- [x] Turn the 96 lint warnings into a triaged backlog; fix hook-dependency warnings in release-scope production interactives first.
- [x] Add an explicit TypeScript typecheck command and run it in CI.
- [x] Add browser smoke tests for home → module → lesson, story progress persistence, and an interactive.
- [x] Define supported browsers/viewports and record baseline accessibility and performance results.
- [x] Add automated validation for lesson IDs, module indexes, character IDs, custom interactive references, and internal documentation links.
- [x] Decide and document the initial release scope: Module 2 plus shared navigation/progress.

Exit criteria: CI blocks build, lint errors, type errors, unit/integration failures, broken content references, and critical browser-journey failures; baseline audit results are recorded.

Milestone completed 11 July 2026. Baseline, support policy, audit gaps, budgets, warning triage, and release-scope decision are recorded in [docs/RELEASE_BASELINE.md](docs/RELEASE_BASELINE.md).

### Milestone 2 — Validate the learning experience

Goal: decide whether Lesson v2 should become the standard before migrating more modules.

- [x] Write a lightweight research protocol: target learner, tasks, comprehension checks, completion signals, interview prompts, and decision thresholds.
- [ ] Test the nine Module 2 Lesson v2 lessons with representative adult learners.
- [ ] Compare Lesson v2 with the existing section-based flow on comprehension, completion, time-on-task, navigation confusion, and qualitative preference.
- [ ] Log issues by severity and distinguish content, interaction, visual, performance, and format problems.
- [ ] Make an explicit decision: adopt v2, revise and retest, or retain the current format. Record the evidence and consequences.

Exit criteria: a written format decision with evidence, prioritized issues, and an approved authoring standard.

Preparation completed 11 July 2026: the [learner-validation protocol](docs/research/MILESTONE_2_PROTOCOL.md), draft [comprehension question bank](docs/research/COMPREHENSION_QUESTION_BANK.md), [assignment matrix](docs/research/ASSIGNMENT_MATRIX.md), [session worksheet](docs/research/SESSION_WORKSHEET.md), and [findings/decision record](docs/research/MILESTONE_2_FINDINGS.md) define the counterbalanced comparison, measures, issue taxonomy, and predeclared thresholds. The question bank still needs review and a wording pilot. Recruitment, sessions, analysis, and the format decision remain open; the latter three require learner evidence.

### Milestone 3 — Finish one flagship module

Goal: produce one complete, credible example of release quality.

- [ ] Apply the chosen format and resolve all validation findings across Module 2.
- [ ] Conduct independent mathematical and editorial review of every Module 2 lesson.
- [ ] Audit all Module 2 visuals and interactives for keyboard/touch use, responsive layout, reduced motion, labels, instructions, and non-canvas alternatives where needed.
- [ ] Verify progress, resume, reset, completion, and error/empty states.
- [ ] Optimize Module 2 route and interactive loading against the performance budget.
- [ ] Run a second learner pass and close all release-blocking findings.

Exit criteria: Module 2 satisfies the definition of finish and can serve as the pattern for subsequent modules.

### Milestone 4 — Harden the platform

Goal: make the application safe to release and maintain.

- [ ] Complete an application-wide navigation, responsive, accessibility, and cross-browser pass.
- [ ] Define analytics events and privacy boundaries; collect only data needed for stated learning questions.
- [ ] Document deployment, environment configuration, smoke checks, rollback, and incident ownership.
- [ ] Add error monitoring and a user-visible recovery path for lazy-load, lesson-load, audio, and interactive failures.
- [ ] Remove or isolate research/gallery routes from the production learner navigation if they are not release features.
- [ ] Resolve remaining high-impact bundle and rendering issues.

Exit criteria: a deployable release candidate with an operational checklist and no open critical defects.

### Milestone 5 — Scale deliberately

Goal: expand only after the flagship module and authoring system are proven.

- [ ] Prioritize modules by learner value, prerequisite order, content readiness, and interactive reuse.
- [ ] Migrate one module at a time using the flagship checklist.
- [ ] Generate curriculum inventory from source data rather than maintaining duplicate lesson descriptions by hand.
- [ ] Track review and validation status separately from file existence.
- [ ] Reassess accounts, cloud sync, teacher tools, native apps, and new curricula only after core learning quality and retention justify them.

Exit criteria: each promoted module independently meets the same release bar; roadmap scope is evidence-led.

## Immediate next work

Start Milestone 1 in this order:

1. Agree that Module 2 is the release candidate scope.
2. Fix production React hook warnings and establish a zero-new-warning rule.
3. Add typecheck, content-integrity, and browser smoke-test gates.
4. Run and record baseline accessibility, responsive, and performance audits.
5. Prepare the learner-validation protocol while engineering baseline work proceeds.

## Decision rules

- Do not migrate another module to Lesson v2 before the Milestone 2 decision.
- Do not call a lesson or interactive “finished” based only on implementation status.
- Do not add major platform features while release-blocking learning, accessibility, or reliability findings remain.
- Keep repository facts in [README.md](README.md), architecture and authoring guidance under `docs/`, and active priorities only in this file.
