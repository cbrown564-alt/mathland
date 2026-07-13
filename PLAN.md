# Mathland rebuild plan

Status: **Phase 2 research build complete; learner, assistive-technology, and external-review gates remain open**. This plan implements the clean-sheet direction accepted on 12 July 2026, the first learner revision, and the accepted adversarial integrity review.

The isolated research build is available at `/prototype/one-operation-three-worlds`. The adversarial review found that the first revision fixed the investigation instrument but had not yet made “one operation across three worlds” a testable teaching claim. The accepted integrity issues and a bounded Phase 2 projection/normalisation expansion are now implemented. The learner gate is still closed: automated implementation evidence does not establish learning, delayed retrieval, assistive-technology usability, or domain validity.

The goal is not to ship an improved version of the current application. The goal is to prove and then build an open mathematical world for motivated adults, using the Atlas–Studio–Observatory architecture.

The previous Module 2 release roadmap is archived at [docs/archive/pre-reboot/PLAN.md](docs/archive/pre-reboot/PLAN.md).

Design-facing product and interface context is captured in [PRODUCT.md](PRODUCT.md) and [DESIGN.md](DESIGN.md). These files make the current revision direction actionable for design tools and agents; the canonical documents under `docs/` continue to own product decisions.

## Product gate

All work must satisfy the [product doctrine](docs/PRODUCT_DOCTRINE.md). In particular:

- adults enter through ambitious goals and credible cases;
- learner action precedes content delivery;
- the Atlas provides orientation and respectful prerequisite detours;
- the Studio produces evidence through prediction, construction, explanation, transfer, and retrieval;
- the Observatory is selective and hands off to work;
- unfamiliar interaction patterns are introduced through a welcoming, optional first-run tour;
- wrong answers begin a teaching sequence rather than a repeated correctness gate;
- interaction-led learning preserves definitions, derivations, theorems, worked reasoning, and sustained explanation where they are the strongest medium;
- domain transfer and retrieval test the stable mathematical structure rather than unannounced domain literacy;
- characters, illustration, audio, and video earn their place by making mathematics more intelligible and remain fully accessible;
- legacy implementation does not determine the new experience;
- broad migration waits for learner evidence from an integrated slice.

## Phase 0 — Align the repository

Goal: remove competing product narratives.

- [x] Accept the open mathematical world as the primary product.
- [x] Accept Atlas outside, Studio inside, Observatory selectively.
- [x] Define motivated adults relearning maths for advanced domains as the primary learner.
- [x] Consolidate canonical product and experience documentation.
- [x] Capture design-facing product and visual context in `PRODUCT.md` and `DESIGN.md`.
- [x] Archive the Module 2 release, Lesson v2, tier/template, and format-comparison documentation.
- [x] Review local planning surfaces and branches for superseded work. The remaining `cursor/*` branches and legacy route work describe the old application; they do not define the rebuild. External issue trackers still need owner review if they contain work not represented in this repository.

Exit: active documentation presents one product direction and links historical material only as archive.

## Phase 1 — Prototype and revise one operation across three worlds

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

Completed checkboxes above mean the research build contains the named capability. They do not mean the capability has met the learner-quality bar.

### Initial learner evidence

Initial sessions found enough promise to continue, alongside material problems that require redesign:

- The visual design is attractive but too editorial; oversized headings consume space that should belong to mathematical work.
- Choosing a horizon and seeing it persist in the header is not yet self-explanatory.
- Manipulation, calculation, and experimentation feel useful but underpowered relative to the emphasis placed on them.
- Finance transfer helps some learners and surprises or overloads others; the purpose, vocabulary, assumptions, and available support need clearer framing.
- Climate retrieval compounds the same problem and risks testing unfamiliar context rather than retrieval of the mathematical structure.
- Incorrect answers create frustration because the current experience repeats a gate instead of diagnosing and teaching from the attempt.
- The Atlas–Studio–Observatory model is unfamiliar enough to require a dedicated, reassuring guided tour.
- The absence of field specialists, illustration, audio, and video removes teaching modalities that should make difficult ideas clearer and the world more inhabited.
- Reduced exposition cannot become reduced mathematical depth; the formal spine needs definitions, derivations, theorems, worked reasoning, and sustained explanation where appropriate.

The research record must still document participant count, goals, prior experience, input/accessibility paths, support level, facilitator intervention, and exact blocking moves. Mildly positive feedback is a direction signal, not evidence of learning effectiveness.

### Revision cycle

- [x] Consolidate the available first-session findings into a structured research record and map each observation to a product hypothesis, design response, and retest measure. Participant-level source metadata was not present in the repository and is recorded as an evidence gap rather than inferred.
- [x] Update the canonical doctrine, experience architecture, content strategy, and first-slice contract where the accepted revision decisions belong; `PRODUCT.md` remains a design-facing summary rather than a competing source of truth.
- [x] Replace routine oversized headings and repeated eyebrow scaffolding with compact task orientation that keeps the mathematical object visible above the fold.
- [x] Make horizon behaviour explicit: choose once per journey, persist it compactly, allow deliberate editing, and preserve it through detours and returns.
- [x] Build a five-to-seven-minute first-run tour that demonstrates prediction, manipulation, checking, a harmless mistake, progressive help, evidence, and Atlas orientation. It is skippable and reopenable.
- [x] Redesign the Studio instrument around purposeful comparison, exact input, extreme cases, reset/undo, linked geometric/component/symbolic/contextual views, and readable state across pointer, touch, keyboard, and assistive technology.
- [x] Strengthen calculation and explanation work so learners expose contributions and reasoning rather than submit only a scalar or satisfy a text-length threshold.
- [x] Add a visible formal spine: precise definitions, notation, assumptions, derivations, worked reasoning, and theorem or proof treatment when the concept warrants it.
- [x] Implement a progressive wrong-answer path that preserves work and escalates through observation, focused cue, comparison, worked step, diagnostic detour, and a fresh equivalent attempt.
- [x] Add finance transfer orientation that states why the domain is changing, what structure remains fixed, which terms and units are new, and which simplifications apply; allow deferment without recording transfer.
- [x] Separate climate-model orientation from delayed retrieval, stage cues, and provide a mathematically equivalent unfamiliar context when domain knowledge itself blocks access.
- [x] Prototype one complete field-specialist intervention in the slice, using Vera's vector lens plus purposeful illustration and optional audio with transcript and a complete non-media path.
- [x] Add mathematical, evidence-transition, support-level, error-recovery, horizon-persistence, tour, transfer-framing, detour-return, keyboard, reduced-motion, responsive, and browser-journey tests for the revised experience.
- [x] Run focused automated accessibility QA at 320 CSS pixels and across desktop/mobile journeys.
- [x] Resolve the accepted adversarial integrity issues: match recorded support to the recovery ladder; require positive, zero, and negative construction; make horizon choice load real case adapters; ask what the scalar measures in each Observatory system; add live projection; make both vectors operable without false slider semantics; preserve pointer release; add geometry-to-components work and criterion-based explanation; replace the conflicting Vera metaphor with an engineering projection lens; make the tour optional at entry; explain disabled progression; remove retrieval exit traps; and prevent blank numeric fields from passing as zero.
- [x] Add an evidence-bearing AI normalisation Studio so “three worlds” is mathematical work rather than Observatory copy plus finance transfer.
- [x] Replace the single hard-coded worksheet with four diagnosed repair types: vector components, signed arithmetic, angle/cosine, and weighted sums/units, each with exact task and focus return.
- [x] Make the Atlas operable for the implemented dot-product, normalisation, and projection Studios while leaving future territories honestly unavailable.
- [ ] Complete assistive-technology review and external engineering/ML/finance review before the next learner round.
- [ ] Retest the revised slice with representative motivated adults, then re-contact the relevant cohort after seven days for delayed retrieval.

### Revised learner gate

Before Phase 2 expansion, representative learners must be able to:

- understand the first-run experience, active horizon, current move, Atlas, help, and return path without facilitator explanation;
- manipulate, calculate, and explain the dot product using the linked representations rather than repeating interface language;
- make an incorrect attempt, use the recovery path, and articulate what changed in their reasoning;
- encounter finance transfer without confusing domain unfamiliarity for a new mathematical operation;
- attempt delayed retrieval without climate vocabulary becoming the principal difficulty;
- continue after supported work while understanding that independent evidence has not yet been recorded;
- use at least one guide or media intervention that improves mathematical understanding rather than merely engagement;
- complete the essential journey through keyboard or touch with readable alternatives, visible focus, and reduced motion;
- retrieve and transfer the structure independently or with no more than a light cue at the declared evidence level.

Exit: a written **continue**, **revise again**, or **reject material parts** decision supported by the structured learner record, delayed retrieval results, accessibility review, and external domain review. Until then, Phase 1 remains active.

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

**Gate:** the learner gate remains closed. The requested Phase 2 work is a bounded research-prototype expansion chosen directly from the adversarial evidence—live projection and practised normalisation—not permission to expand the curriculum, promote production routes, or claim that Phase 1 has passed.

Repository foundations now present:

- [x] An eight-territory graph with explicit prerequisites, downstream connections, domain membership, and horizon status.
- [x] Evidence and route contracts separated from the legacy lesson/progress schemas.
- [x] A case-adapter pattern around one shared dot-product model.
- [x] A documented world authoring workflow and strict type/test boundary.
- [x] Expand into the next neighbouring Studios selected from observed need: magnitude/normalisation and projection. Both use pure models, descriptive evidence, diagnostic return, keyboard/touch-compatible controls, readable alternatives, and browser journeys.

Implementation exit: a stable territory schema, evidence model, authoring workflow, and automated path through dot product, normalisation, and projection. Educational exit remains contingent on the Phase 1 learner, assistive-technology, delayed-retrieval, and external-review evidence.

## Phase 3 — Add domain journeys

Goal: make the same Atlas useful from several ambitious starting points.

- [x] Define one coherent physics/engineering journey through components, magnitude/angle, dot product, projection, orthogonality, matrices, and gradients.
- [x] Define one coherent machine-learning/AI journey through normalisation, similarity, projection, matrices, and optimisation.
- [x] Define one coherent finance journey through weighted sums, dot products, matrices, and optimisation.
- [x] Ensure the journeys converge on shared territory identities rather than duplicating content.
- [x] Add bounded engineering, AI, finance, and climate cases plus finance transfer and climate retrieval tasks.
- [ ] Complete external domain review and validate with learners that the revised framing makes lens switching preserve the mathematical identity without surprise or avoidable domain overload.

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
- producing a broad illustration, audio, or video library before one bounded intervention demonstrates learning value;
- treating existing module order as the product roadmap;
- claiming mastery or educational validation from completion data.

## Immediate next work

1. Attach participant-level source records from the initial sessions so the provisional research record can distinguish widespread, cohort-specific, and facilitator-dependent observations.
2. Complete assistive-technology and external engineering/ML/finance review of the integrated Phase 1–2 research build.
3. Run the revised learner round and seven-day retrieval follow-up, recording independent, observed, cued, compared, worked, restudied, deferred, and substituted evidence separately.
4. Write the continue/revise-again/reject decision before any additional territory expansion or production promotion.

## Decision discipline

- Prefer a tested vertical slice to a broad design system.
- Prefer extracting mathematical logic to wrapping legacy pages.
- Prefer observed learner difficulty to speculative prerequisite trees.
- Prefer a recoverable wrong answer to a correctness gate.
- Prefer one exceptional Studio instrument to several merely functional interactions.
- Prefer formal depth beside the object to either an exposition dump or interaction without explanation.
- Prefer a bounded, evidence-bearing guide or media intervention to decorative character coverage.
- Prefer cross-domain transfer to completion volume.
- Prefer revising the doctrine explicitly to allowing silent exceptions.
