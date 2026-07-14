# Mathland rebuild plan

Status: **Phases 1–4 complete; the validated world is the production product**. This plan implements the clean-sheet direction accepted on 12 July 2026, the first learner revision, the accepted adversarial integrity review, the Phase 1 continue decision, the Phase 3 journey sign-off, and the Phase 4 production promotion completed on 13 July 2026.

The validated **One operation, three worlds** region is now the root production route. The former prototype URL and known legacy URLs redirect into it. The promoted application runs only from `src/world/`; the retired shell, lessons, interactives, templates, utilities, scripts, and unused media are quarantined under `archive/legacy-product/` and excluded from the release artifact.

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

The underlying research archive should retain participant count, goals, prior experience, input/accessibility paths, support level, facilitator intervention, and exact blocking moves. The repository does not infer those details from the sign-off decision alone.

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
- [x] Complete assistive-technology review and external engineering/ML/finance review before the next learner round.
- [x] Retest the revised slice with representative motivated adults, then re-contact the relevant cohort after seven days for delayed retrieval.

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

Exit: a written **continue**, **revise again**, or **reject material parts** decision supported by the structured learner record, delayed retrieval results, accessibility review, and external domain review.

**Decision — continue (13 July 2026).** The product owner confirmed full Phase 1 sign-off. Phase 1 is closed. Detailed session sheets and reviewer artefacts are not committed in this repository, so the research record preserves that provenance limitation rather than manufacturing summary statistics.

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

**Gate:** cleared by the Phase 1 continue decision on 13 July 2026. The bounded projection and normalisation expansion was selected directly from the adversarial evidence and already satisfies the Phase 2 implementation scope. This does not authorise broad curriculum migration or production-route promotion.

Repository foundations now present:

- [x] An eight-territory graph with explicit prerequisites, downstream connections, domain membership, and horizon status.
- [x] Evidence and route contracts separated from the legacy lesson/progress schemas.
- [x] A case-adapter pattern around one shared dot-product model.
- [x] A documented world authoring workflow and strict type/test boundary.
- [x] Expand into the next neighbouring Studios selected from observed need: magnitude/normalisation and projection. Both use pure models, descriptive evidence, diagnostic return, keyboard/touch-compatible controls, readable alternatives, and browser journeys.

Exit: complete. The repository has a stable territory schema, evidence model, authoring workflow, and automated path through dot product, normalisation, and projection; the Phase 1 sign-off clears the educational dependency.

## Phase 3 — Add domain journeys

Goal: make the same Atlas useful from several ambitious starting points.

Status: **complete; continue decision recorded 13 July 2026**. The shared journey definitions and cases passed the complete route and external-domain gate confirmed by the product owner. The provenance record is [docs/research/PHASE_3_JOURNEY_DECISION.md](docs/research/PHASE_3_JOURNEY_DECISION.md).

- [x] Define one coherent physics/engineering journey through components, magnitude/angle, dot product, projection, orthogonality, matrices, and gradients.
- [x] Define one coherent machine-learning/AI journey through normalisation, similarity, projection, matrices, and optimisation.
- [x] Define one coherent finance journey through weighted sums, dot products, matrices, and optimisation.
- [x] Ensure the journeys converge on shared territory identities rather than duplicating content.
- [x] Add bounded engineering, AI, finance, and climate cases plus finance transfer and climate retrieval tasks.
- [x] Complete external domain review and validate with learners that the revised framing makes lens switching preserve the mathematical identity without surprise or avoidable domain overload.

Exit: adults can enter from different goals and recognise that they inhabit one mathematical world.

**Decision — continue (13 July 2026).** Phase 3 is closed and its sign-off opens the bounded production promotion of the validated dot-product region. Detailed review and participant artefacts remain outside this repository, so no unsupported quantitative claim is inferred.

## Phase 4 — Replace the legacy product deliberately

Goal: retire old surfaces only after validated replacements exist.

The Phase 3 journey gate is complete. Production promotion remains bounded to the validated dot-product, normalisation, projection, diagnostic, transfer, retrieval, and Atlas region; it does not promote future territories or the old curriculum order. The resulting contracts are recorded in [docs/architecture/README.md](docs/architecture/README.md) and [docs/operations/PRODUCTION_RUNBOOK.md](docs/operations/PRODUCTION_RUNBOOK.md).

- [x] Define production shell, persistence, analytics, privacy, and account requirements from validated use. Production is anonymous-first, local and portable, with consented minimised diagnostics and no account or automatic sync requirement.
- [x] Promote stable Atlas, Studio, and Observatory primitives through the `src/world/` public boundaries and root application route.
- [x] Migrate or extract valuable legacy content territory by territory. The first salvage retained the shared model, case logic, vector instrument contract, Vera projection intervention, and relevant examples; it rejected legacy page and progress schemas.
- [x] Redirect or remove replaced legacy routes. Known lesson, story, module, lab, gallery, experience, course, world, and prototype routes now return learners to `/` with an explicit retirement notice.
- [x] Archive unused content, components, and assets. Historical implementation is quarantined outside executable source and public assets with a 90-day deletion window in [the retirement record](docs/archive/legacy-product/RETIREMENT_RECORD.md).
- [x] Establish deployment, monitoring, rollback, and support procedures. CI, Docker/Nginx delivery, health checks, runtime endpoint configuration, operational reporting, privacy/support routes, and image-based rollback are defined and tested.

Exit: the production experience expresses the accepted doctrine without depending on the old learner journey.

**Decision — production promotion complete (13 July 2026).** Root rendering no longer imports or initialises the legacy application. Version 1 and 2 world journeys migrate into the version 3 production store; learners can export, restore, or delete their data. The production release remains intentionally narrow while new territories earn promotion independently.

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

1. Deploy the immutable Phase 4 artifact through preview and production using the runbook, then monitor health, resume integrity, route redirects, support escalation, and optional diagnostic quality.
2. Review the legacy redirect and quarantine deletion window after at least 90 days of production use.
3. Select the next territory from observed learner need, then run its mathematical, learner, domain, accessibility, content-operation, and rollback gate independently.
4. Keep accounts, automatic sync, matrices, gradients, and broad curriculum migration closed until evidence establishes their need and production contract.

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
