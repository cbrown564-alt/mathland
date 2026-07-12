# Mathland rebuild plan

Status: **integrated research build complete; learner evidence gate open**. This plan implements the clean-sheet direction accepted on 12 July 2026.

The isolated research build is available at `/prototype/one-operation-three-worlds`. Repository completion and educational validation are deliberately separate: automated implementation gates pass, while representative-adult testing, delayed retrieval observation, and external domain review remain required before the prototype can replace production surfaces.

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
- [x] Review local planning surfaces and branches for superseded work. The remaining `cursor/*` branches and legacy route work describe the old application; they do not define the rebuild. External issue trackers still need owner review if they contain work not represented in this repository.

Exit: active documentation presents one product direction and links historical material only as archive.

## Phase 1 — Prototype one operation across three worlds

Goal: test the entire product architecture with the dot product before rebuilding the platform.

### Deliverables

- [x] Create an isolated `src/world/` prototype namespace and experimental route.
- [x] Build a small Atlas region connecting vectors, projection, similarity, work, and weighted combination.
- [x] Build an Observatory opening that presents engineering, AI, and finance cases producing the same operation.
- [x] Build a Studio vector model with keyboard, touch, numeric, readable, and reduced-motion paths.
- [x] Add prediction, worked example, fading support, independent calculation, explanation, and transfer.
- [x] Add a signed-components diagnostic detour with exact task and focus return.
- [x] Add a seven-day retrieval schedule and a fourth-context climate-monitoring prompt.
- [x] Record descriptive local evidence states behind a versioned store without importing legacy completion semantics.
- [x] Review the internal mathematical model and make the engineering, ML, finance, and climate assumptions explicit in the interface. External engineering/ML/finance review remains an evidence gate.
- [x] Run automated mathematical, evidence, keyboard, corrupt-state, responsive, accessibility, build, and desktop/mobile browser QA. Facilitated learner QA remains an evidence gate.

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

Exit: a written decision to continue, revise and retest, or reject material parts of the architecture. **Not yet met:** the research build is ready for representative-adult sessions; no learner outcome is inferred from automated checks.

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

Repository foundations now present:

- [x] An eight-territory graph with explicit prerequisites, downstream connections, domain membership, and horizon status.
- [x] Evidence and route contracts separated from the legacy lesson/progress schemas.
- [x] A case-adapter pattern around one shared dot-product model.
- [x] A documented world authoring workflow and strict type/test boundary.
- [ ] Expansion into the next neighbouring Studio, selected from observed learner need rather than speculation.

Exit: a stable territory schema, evidence model, authoring workflow, and tested path through several connected ideas.

## Phase 3 — Add domain journeys

Goal: make the same Atlas useful from several ambitious starting points.

- [x] Define one coherent physics/engineering journey through components, magnitude/angle, dot product, projection, orthogonality, matrices, and gradients.
- [x] Define one coherent machine-learning/AI journey through normalisation, similarity, projection, matrices, and optimisation.
- [x] Define one coherent finance journey through weighted sums, dot products, matrices, and optimisation.
- [x] Ensure the journeys converge on shared territory identities rather than duplicating content.
- [x] Add bounded engineering, AI, finance, and climate cases plus finance transfer and climate retrieval tasks.
- [ ] Complete external domain review and validate with learners that lens switching preserves the mathematical identity.

Exit: adults can enter from different goals and recognise that they inhabit one mathematical world.

## Phase 4 — Replace the legacy product deliberately

Goal: retire old surfaces only after validated replacements exist.

This phase is intentionally gated. The prototype route is isolated and lazy-loaded; it bypasses both the legacy shell and legacy content initialisation. Production replacement remains prohibited until the Phase 1 learner gate and external domain review pass. Promotion requirements are recorded in [docs/architecture/README.md](docs/architecture/README.md#production-promotion-gate).

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

1. Run five to eight moderated sessions with motivated adults across the three entry goals.
2. Run external engineering/ML/finance review, with particular attention to the finance assumptions and normalised-similarity language.
3. Re-contact learners after the seven-day return interval and record independent, cued, and restudy retrieval separately.
4. Use observed blocking moves to select the first neighbouring territory Studio.
5. Write the continue/revise/reject decision before promoting or replacing any legacy route.

## Decision discipline

- Prefer a tested vertical slice to a broad design system.
- Prefer extracting mathematical logic to wrapping legacy pages.
- Prefer observed learner difficulty to speculative prerequisite trees.
- Prefer cross-domain transfer to completion volume.
- Prefer revising the doctrine explicitly to allowing silent exceptions.
