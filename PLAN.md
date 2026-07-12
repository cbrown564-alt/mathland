# Mathland rebuild plan

Status: **active**. This plan implements the clean-sheet direction accepted on 12 July 2026.

The goal is not to ship an improved version of the current application. The goal is to prove and then build an open mathematical world for motivated adults, using the Atlas–Studio–Observatory architecture.

The previous Module 2 release roadmap is archived at [docs/archive/pre-reboot/PLAN.md](docs/archive/pre-reboot/PLAN.md).

## Product gate

All work must satisfy the [product doctrine](docs/PRODUCT_DOCTRINE.md). In particular:

- adults enter through ambitious goals and credible cases;
- learner action precedes content delivery;
- the Atlas provides orientation and respectful prerequisite detours;
- the Studio produces evidence through prediction, construction, explanation, transfer, and retrieval;
- the Observatory is selective and hands off to work;
- legacy implementation does not determine the new experience;
- broad migration waits for learner evidence from an integrated slice.

## Phase 0 — Align the repository

Goal: remove competing product narratives.

- [x] Accept the open mathematical world as the primary product.
- [x] Accept Atlas outside, Studio inside, Observatory selectively.
- [x] Define motivated adults relearning maths for advanced domains as the primary learner.
- [x] Consolidate canonical product and experience documentation.
- [x] Archive the Module 2 release, Lesson v2, tier/template, and format-comparison documentation.
- [ ] Review issue trackers, branches, and future planning surfaces for superseded work.

Exit: active documentation presents one product direction and links historical material only as archive.

## Phase 1 — Prototype one operation across three worlds

Goal: test the entire product architecture with the dot product before rebuilding the platform.

### Deliverables

- [ ] Create an isolated `src/world/` prototype namespace and experimental route.
- [ ] Build a small Atlas region connecting vectors, projection, similarity, work, and weighted combination.
- [ ] Build an Observatory opening that presents engineering, AI, and finance cases producing the same operation.
- [ ] Build a Studio vector model with keyboard, touch, numeric, and reduced-motion paths.
- [ ] Add prediction, worked example, fading support, independent calculation, explanation, and transfer.
- [ ] Add at least one diagnostic prerequisite detour with exact return to the blocked task.
- [ ] Add a delayed retrieval prompt from a different domain.
- [ ] Record descriptive local evidence states without importing legacy completion semantics.
- [ ] Review mathematics, engineering interpretation, ML interpretation, and finance assumptions.
- [ ] Run focused accessibility, responsive, performance, and learner QA.

The detailed contract is [docs/FIRST_VERTICAL_SLICE.md](docs/FIRST_VERTICAL_SLICE.md).

### Learner evidence

Test with representative adults who have a concrete physics, engineering, AI, or finance motivation. Determine whether they can:

- enter through a goal without choosing a school level;
- understand the shared structure across cases;
- calculate and interpret the dot product;
- transfer it to an unseen context;
- understand their Atlas location and next moves;
- use a prerequisite detour without losing motivation;
- resume the original goal after the detour;
- retrieve the idea after time has passed.

Exit: a written decision to continue, revise and retest, or reject material parts of the architecture.

## Phase 2 — Establish the first Atlas region

Goal: expand only the connected territory necessary to test a repeatable world model.

Candidate neighbouring territories:

- vector components and coordinate systems;
- magnitude, angle, and normalisation;
- linear combinations and weighted sums;
- projection and orthogonality;
- matrices as systems of dot products;
- gradients as direction and local change.

Work should expand from observed learner needs in Phase 1, not from the order of the legacy Module 2 curriculum.

Exit: a stable territory schema, evidence model, authoring workflow, and tested path through several connected ideas.

## Phase 3 — Add domain journeys

Goal: make the same Atlas useful from several ambitious starting points.

- [ ] Define one coherent physics/engineering journey.
- [ ] Define one coherent machine-learning/AI journey.
- [ ] Define one coherent finance journey.
- [ ] Ensure the journeys converge on shared territories rather than duplicating content.
- [ ] Add domain-reviewed cases and transfer tasks.
- [ ] Validate that learners can switch lenses without losing mathematical identity.

Exit: adults can enter from different goals and recognise that they inhabit one mathematical world.

## Phase 4 — Replace the legacy product deliberately

Goal: retire old surfaces only after validated replacements exist.

- [ ] Define production shell, persistence, analytics, privacy, and account requirements from validated use.
- [ ] Promote stable Atlas, Studio, and Observatory primitives.
- [ ] Migrate or extract valuable legacy content territory by territory.
- [ ] Redirect or remove replaced legacy routes.
- [ ] Archive unused content, components, and assets.
- [ ] Establish deployment, monitoring, rollback, and support procedures.

Exit: the production experience expresses the accepted doctrine without depending on the old learner journey.

## Work explicitly out of scope now

- polishing the current homepage, dashboard, navigation, or lesson shell;
- converting all legacy lessons to the beat format or any new format;
- designing the entire Atlas before testing one region;
- implementing accounts, cloud sync, teacher tools, native apps, or broad gamification;
- completing all ten character experiences;
- treating existing module order as the product roadmap;
- claiming mastery or educational validation from completion data.

## Immediate next work

1. Approve the “One operation, three worlds” slice as the implementation target.
2. Choose the primary opening case and the fourth-context transfer problem.
3. Review the finance case and formula language with domain expertise.
4. Specify the minimal world-graph and evidence-state data models.
5. Scaffold the isolated `src/world/` prototype and experimental route.
6. Build the Studio mathematical model before the surrounding shell.

## Decision discipline

- Prefer a tested vertical slice to a broad design system.
- Prefer extracting mathematical logic to wrapping legacy pages.
- Prefer observed learner difficulty to speculative prerequisite trees.
- Prefer cross-domain transfer to completion volume.
- Prefer revising the doctrine explicitly to allowing silent exceptions.
