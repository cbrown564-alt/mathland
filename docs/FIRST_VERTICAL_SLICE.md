# First vertical slice: one operation, three worlds

Status: **Accepted adversarial revisions implemented; learner and external-review gate remains closed**.

Implementation status: **integrated research build available** at `/prototype/one-operation-three-worlds`.

The first vertical slice will use the dot product to test the entire Atlas–Studio–Observatory architecture with the primary adult audience.

The first learner review produced a revise-and-retest decision. The revision keeps the core hypothesis and replaces the underpowered, editorial, correctness-gated parts of the first build. The structured observation-to-response record is [research/PHASE_1_REVISION_RECORD.md](research/PHASE_1_REVISION_RECORD.md).

## Product hypothesis

An adult learner will develop a more transferable understanding of the dot product when they encounter one mathematical structure across several consequential systems, actively manipulate and formalise it, and can take just-in-time prerequisite detours without losing the motivating goal.

## Three cases

### Physics and engineering: useful force

A force does work only to the extent that it points along displacement. The dot product connects force, displacement, angle, sign, and work with explicit units.

### Machine learning and AI: semantic similarity

Embedding vectors can be compared through their direction. Normalised dot product introduces cosine similarity while making magnitude assumptions visible.

### Finance: weighted portfolio return

Portfolio return is the dot product of asset weights and asset returns. This case makes component contribution and sign concrete while requiring clear statements about simplification and uncertainty.

These cases are not interchangeable metaphors. Their contextual meanings differ; the mathematical operation is shared.

## Learning outcomes

After the slice, a learner should be able to:

- calculate a dot product from components;
- explain its sign and magnitude in geometric terms;
- connect the component formula to projection and angle;
- identify when normalisation is required for similarity;
- interpret the result correctly in each of the three cases;
- recognise the operation in an unfamiliar fourth context;
- identify whether a difficulty comes from vector components, multiplication and addition, angle, or the domain model.

## Experience sequence

### 1. Observatory — the mysterious scalar

Show three compact systems producing one number:

- a force and displacement;
- two small embedding vectors;
- portfolio weights and returns.

Ask what the number is measuring in each system and why changing direction or sign changes it. Each system requires its own noticing response; one global sign question is insufficient. Reveal the shared component-wise operation only after the learner has identified all three meanings and predicted the sign consequence.

### 2. Studio — direction agreement

The learner manipulates two vectors and observes:

- positive, zero, and negative results;
- the effect of angle and magnitude;
- projection onto a chosen direction;
- agreement between geometric and component calculations.

Every draggable vector must also have keyboard and numeric controls. Both vectors are operable. A two-dimensional handle must not claim one-dimensional slider semantics, and pointer capture must be released reliably.

The revised instrument also requires purposeful comparison, exact input, extreme cases, reset and undo, a pinned comparison, a live plotted projection, and simultaneously readable geometric, component, symbolic, and contextual views. The learner tests positive, zero, and negative geometry before Practice unlocks. Routine orientation must leave the working object visible in the first viewport.

### 3. Studio — formalisation with fading support

Sequence:

1. a fully worked component calculation with self-explanation prompts;
2. a partially completed calculation;
3. an independent calculation;
4. a geometry-to-components translation;
5. a criterion-checked geometric explanation;
6. a components-to-context interpretation.

The formal spine includes the component definition, the geometric identity, assumptions for non-zero vectors, a derivation from the law of cosines, and the sign consequence. Calculation exposes each signed contribution. Explanation is checked against named reasoning criteria rather than text length.

### 4. AI normalisation

Before finance transfer, the learner practises turning a non-zero vector into a unit vector and compares a raw dot product with a unit-vector dot product. The task must make magnitude sensitivity visible and require the learner to identify why cosine similarity needs normalisation.

### 5. Cross-domain transfer

Teach through one case, then require the learner to use the operation in a second. The case order can vary during research so the product does not confuse a particular story with the concept.

Before finance, state why the domain changes, which operation remains fixed, the meanings and units of weights and realised returns, and all simplifying assumptions. Learners can defer finance without transfer evidence or a retrieval schedule.

### 6. Atlas reveal

The Atlas shows the dot-product territory connecting:

- vectors and components;
- angle and projection;
- orthogonality;
- similarity and normalisation;
- work and energy;
- weighted combination;
- later routes into matrices, optimisation, embeddings, and statistics.

### 7. Diagnostic detour

If learner actions reveal a gap, offer the smallest relevant Studio:

- vector components and coordinates;
- signed multiplication and addition;
- angle and cosine;
- units and weighted sums.

The original case remains visible in the route summary and resumes at the exact blocked move with existing entries intact. Blank inputs never parse as zero. The diagnosed repair type is recorded honestly.

### 8. Return loop

After a delay, present a short problem from a domain the learner did not use during the main sequence. Record whether the structure is retrieved independently, with a cue, or only after restudy.

Climate-model orientation occurs before the retrieval attempt. Cues are staged and recorded. If climate language blocks access, offer a mathematically equivalent quality-control context and record the substitution. Preview attempts never count as delayed retrieval.

### 9. First-run and guide interventions

A five-to-seven-minute tour demonstrates the Studio loop, a harmless error, progressive help, evidence, and Atlas orientation. It is optional at entry, skippable, and reopenable. Vera contributes one complete engineering vector-lens intervention: a signed-projection diagram, optional generated speech with an exact transcript, and the same essential teaching through linked representations and formal text.

## Atlas evidence

The prototype should distinguish:

- encountered the dot product;
- used it with a worked scaffold;
- calculated and interpreted it independently;
- transferred it to another domain;
- needs a prerequisite detour;
- is due for retrieval.

No single page view or correct multiple-choice answer establishes mastery.

## Prototype scope

Build only what is necessary to test the product hypothesis:

- one small Atlas region around the dot product;
- one Observatory opening;
- one reusable Studio vector model;
- three case wrappers around the shared structure;
- at least one prerequisite detour;
- one delayed transfer prompt;
- local prototype evidence storage;
- responsive and accessible interaction paths.

Do not rebuild the general homepage, migrate Module 2, add accounts, design the entire Atlas, or re-theme the legacy application.

## Validation questions

1. Can learners enter through a goal or case without selecting a school level?
2. Do they act before passively consuming explanation?
3. Can they explain what the dot product measures geometrically and contextually?
4. Can they use the operation in a second domain?
5. Can they understand their Atlas location and choose a next move?
6. Does a diagnostic detour feel useful rather than remedial?
7. Can they resume the original goal after the detour?
8. What do they retrieve after time has passed?

## Acceptance gate

The slice is promising only if representative motivated adults can:

- complete the essential interactions using keyboard or touch;
- explain the operation rather than repeat interface language;
- transfer to an unseen context with no more than a light cue;
- orient and resume without facilitator explanation;
- use a prerequisite detour without losing the original goal;
- distinguish the mathematical structure from each domain-specific interpretation.

Observed failures should change the architecture or content contract before broader implementation begins.

## Immediate decisions

- **Primary opening:** engineering work, because sign, units, angle, and projection are physically inspectable without pretending the three domain meanings are interchangeable.
- **Cross-domain transfer:** a one-period two-asset weighted return with explicit fixed-weight, realised-return, no-fees, and no-advice boundaries.
- **Delayed fourth context:** a three-sensor climate exposure index, chosen to test structural recognition without reusing the three opening stories.
- **Prototype boundary:** `src/world/` at `/prototype/one-operation-three-worlds`, outside the legacy shell and legacy content initialisation.
- **Retrieval interval:** seven days; the prompt can be previewed during research facilitation, but preview evidence must not be reported as delayed retention.

## Research-build verification

The revised implementation includes pure-model tests for component, normalisation, and projection calculations; version migration and corrupt-local-state recovery; evidence and support transitions; four diagnostic detour types with exact return; horizon persistence and real case adapters; optional tour entry, completion, and reopening; two-vector keyboard, numeric, pointer/touch capture-release, comparison, reset, and undo paths; progressive error recovery; Observatory noticing in all three systems; geometry-to-components and explanation criteria; transfer framing and deferment; retrieval orientation, cueing, preview semantics, substitution, and exit; reduced-motion and 320px behavior; automated accessibility scans; and desktop/mobile browser journeys.

Automated checks establish implementation reliability only. They do not answer the validation questions above. Before a continue decision, the research team must record:

- participant goal and relevant prior experience without asking for a school level;
- prediction, calculation, explanation, transfer, detour, return, and retrieval observations;
- whether help was independent, cued, worked, or facilitator-supplied;
- moments where domain language hid or revealed the stable operation;
- accessibility/input path used and any blocked move;
- external engineering, ML, and finance reviewer notes.
