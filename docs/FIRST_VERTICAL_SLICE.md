# First vertical slice: one operation, three worlds

Status: **recommended first prototype**.

The first vertical slice will use the dot product to test the entire Atlas–Studio–Observatory architecture with the primary adult audience.

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

Ask what the number is measuring in each system and why changing direction or sign changes it. Reveal the shared component-wise operation only after the learner has predicted outcomes.

### 2. Studio — direction agreement

The learner manipulates two vectors and observes:

- positive, zero, and negative results;
- the effect of angle and magnitude;
- projection onto a chosen direction;
- agreement between geometric and component calculations.

Every draggable vector must also have keyboard and numeric controls.

### 3. Studio — formalisation with fading support

Sequence:

1. a fully worked component calculation with self-explanation prompts;
2. a partially completed calculation;
3. an independent calculation;
4. a geometry-to-components translation;
5. a components-to-context interpretation.

### 4. Cross-domain transfer

Teach through one case, then require the learner to use the operation in a second. The case order can vary during research so the product does not confuse a particular story with the concept.

### 5. Atlas reveal

The Atlas shows the dot-product territory connecting:

- vectors and components;
- angle and projection;
- orthogonality;
- similarity and normalisation;
- work and energy;
- weighted combination;
- later routes into matrices, optimisation, embeddings, and statistics.

### 6. Diagnostic detour

If learner actions reveal a gap, offer the smallest relevant Studio:

- vector components and coordinates;
- signed multiplication and addition;
- angle and cosine;
- units and weighted sums.

The original case remains visible in the route summary and resumes at the exact blocked move.

### 7. Return loop

After a delay, present a short problem from a domain the learner did not use during the main sequence. Record whether the structure is retrieved independently, with a cue, or only after restudy.

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

- Choose the primary opening case for the first research build.
- Review the finance case with appropriate domain expertise.
- Define the smallest fourth-context transfer problem.
- Decide the prototype route and isolated source namespace described in [architecture/README.md](architecture/README.md).
