# Milestone 2 findings and format decision

Status: **awaiting learner sessions**  
Protocol: [Milestone 2 learner-validation protocol](MILESTONE_2_PROTOCOL.md)

Do not fill the decision before the planned observations are complete. Keep raw de-identified worksheets alongside this record and preserve denominators in every summary.

## Pre-pilot QA dry run — 11 July 2026

This is an implementation/content walkthrough by Codex, not a participant session. It must not be included in learner metrics, preference counts, or the format decision. Scope: P01-style walkthrough of v2 lesson 2.1 and the opening of standard lesson 2.2; opening-beat checks for v2 lessons 2.2–2.9; mobile-width checks at 375 × 844 CSS pixels for v2 lessons 2.1, 2.8, 2.9 and standard lesson 2.2; and source-backed inspection of required completion interactions.

Positive observations:

- every `/story/2.1`–`/story/2.9` route rendered its registered lesson;
- the v2 quick check gave immediate explanatory feedback and allowed recovery after an incorrect answer;
- progress advanced between beats and the layout samples showed no document-level horizontal overflow at mobile width;
- standard lessons expose the matching guided story, making the pilot discoverable outside research sessions.

Pre-pilot issues to resolve or explicitly accept before scored sessions:

| ID | Surface | Category | Severity | Evidence | Recommended disposition |
|---|---|---|---|---|---|
| M2-QA-001 | Study comparison / standard lessons | format | high | The standard lesson places a prominent “Read as a guided story” promotion above its content. A participant assigned to standard can change formats, and “immersive” / “new way” language primes the comparison. | Add a neutral study mode that hides cross-format promotion for assigned sessions, or temporarily suppress the card during the study. Verify direct research URLs cannot switch format accidentally. |
| M2-QA-002 | V2 lesson 2.5, opening prediction and first passage | content | high | “If you mix 2 parts of one direction with 3 parts of another — can you reach any point in the plane?” treats “Yes — with the right recipe” as the intended response. Two arbitrary directions reach the plane only when they are non-parallel; the later beat adds that condition, but the opening overgeneralizes it. | Rewrite the prediction to name two non-parallel directions and change “Any destination” in the first passage to “With two non-parallel directions, any destination…”. Re-review the color analogy, whose coefficient constraints differ in practice. |
| M2-QA-003 | V2 lessons 2.1, 2.2, 2.4 and 2.6 required activities | interaction | high | Completion requires achieving multiple states through SVG dragging. The 2.1 and 2.4 handles are not focusable controls; 2.2 is also pointer-led. The 2.6 dependent-vector goal requires geometric manipulation. No equivalent keyboard/preset path was exposed for these required outcomes. | Provide keyboard-operable controls and/or labeled presets for every required goal. Never gate completion solely on pointer precision. Add browser tests that complete each lesson without pointer dragging. |
| M2-QA-004 | V2 lesson 2.1 read-only visual | visual | medium | “Vector Basics” displays `u · v`, an agreement label, and angle θ in both explanatory beats before dot product is introduced in lesson 2.3. The diagram also shows two vectors while the lesson is explaining one vector and its components. | Give 2.1 a single-vector read-only state/readout limited to components and magnitude; reserve dot-product/angle chrome for 2.3. |
| M2-QA-005 | V2 audio passages | interaction | medium | Several passages expose multiple controls with the identical accessible name “hear Vera”; lesson 2.3 showed four such buttons in its opening beat. A screen-reader or voice-control user cannot distinguish them without surrounding context. | Include passage context in each accessible name, for example “Hear Vera: It’s all about the angle, passage 2”. Keep the short visible label if desired. |
| M2-QA-006 | V2 lesson 2.7 prediction | content | medium | The prompt states both defining basis conditions, then asks whether a spanning set with redundancy is a basis. This reveals the intended reasoning before the prediction and weakens the diagnostic value. | Ask the concrete spanning-set question first, then reveal the two-condition definition in the passage. |
| M2-QA-007 | Standard lesson flow | format | medium | The opening presents “Mark as completed”, “Complete & continue”, “Previous Lesson”, and “Next Lesson” together. The two completion actions overlap conceptually, while next-lesson navigation is available before the first section is completed. | Test a single primary section action and move lesson-to-lesson navigation to the final section or a less prominent location during the comparison. |
| M2-QA-008 | V2 required precision goals | interaction | medium | Lessons use phrases such as “Land all outcomes to finish” and exact-looking targets, but most activities do not disclose tolerance, snapping, or an alternate completion path. This may make successful near-misses feel arbitrary on touch devices. | Add visible snapping/goal feedback, generous touch tolerances, presets where pedagogically acceptable, and a non-gated “I’m stuck—show me” recovery that is logged as assisted completion. |

Release recommendation from this dry run: do not begin scored sessions until M2-QA-001 and M2-QA-002 are fixed, and until M2-QA-003 has at least one verified non-pointer completion path for every release-scope lesson. Medium issues can enter a short pilot only if they are explicitly accepted and observed.

### Pre-pilot fix verification — 11 July 2026

All eight dry-run issues were addressed before recruitment sessions:

| Issue | Resolution | Verification |
|---|---|---|
| M2-QA-001 | Added neutral `?study=1` routes: standard lessons hide the v2 promotion; v2 Exit returns to Module 2. Updated the assignment matrix and protocol. | Unit route assertion plus desktop/mobile browser test. |
| M2-QA-002 | Qualified lesson 2.5 throughout: two **non-parallel** directions span the plane; removed the misleading unrestricted color claim. | Type/content validation and source review. |
| M2-QA-003 | Added labeled presets for required outcomes in 2.1, 2.2, 2.4, and the shared 2.5/2.6 span explorer. Added arrow-key operation to vector handles; existing 2.3, 2.7, and 2.9 controls/presets remain available. | Desktop/mobile browser tests complete 2.1, 2.2, 2.4, and 2.6 without pointer dragging. |
| M2-QA-004 | Added a single-vector read-only mode with component and magnitude readouts; lesson 2.1 no longer displays v, dot product, or angle. | Production build and browser-accessible-name inspection. |
| M2-QA-005 | Audio controls now include passage context in their accessible names. | Component render/source review. |
| M2-QA-006 | Rewrote the 2.7 prediction as a concrete redundant-set question without stating the definition first. | Content validation and source review. |
| M2-QA-007 | Replaced the two overlapping section-completion controls with one primary action; next-lesson navigation appears only on the last section. | Desktop/mobile study-mode browser assertion. |
| M2-QA-008 | Added explicit grid-snapping guidance, visible goal counts, an “I’m stuck” explanation, keyboard controls, and guided presets. | Desktop/mobile non-pointer completion tests. |

These closures establish implementation readiness for a wording pilot; they are not learner validation. Any regression observed in the wording pilot reopens the relevant issue.

## Study accounting

| Item | Result |
|---|---|
| Study wave / product revision | |
| Session dates | |
| Recruited / completed / valid | |
| Exclusions and reasons | |
| V2-first / standard-first | |
| Low / medium / high maths confidence | |
| Lesson-format cells covered | __ / 18 |
| Protocol deviations | |

## Exposure results

Add one row per valid lesson exposure.

| Participant | Order | Lesson | Format | Completed unassisted | Seconds | Nav confusion | Nav assists | Technical assists | Score /3 | Ease /5 |
|---|---|---:|---|---|---:|---:|---:|---:|---:|---:|
| | | | | | | | | | | |

## Aggregate comparison

| Measure | Lesson v2 (n=) | Standard (n=) | Difference (v2 − standard) | Threshold result |
|---|---:|---:|---:|---|
| Unassisted completion | | | | |
| Mean comprehension | | | | |
| Scored at least 2/3 | | | | |
| Median seconds, completers | | | | contextual only |
| Median navigation confusion | | | | |
| Mean ease /5 | | | | contextual only |

Preference: v2 __ / standard __ / neutral __. Summarize reasons separately from the forced-choice count.

Order and confidence checks:

| Slice | n | V2 completion | Standard completion | V2 score | Standard score | Material concern |
|---|---:|---:|---:|---:|---:|---|
| V2 first | | | | | | |
| Standard first | | | | | | |
| Low maths confidence | | | | | | |
| Medium maths confidence | | | | | | |
| High maths confidence | | | | | | |

## Central issue log

Severity definitions:

- **Critical:** wrong mathematics; cannot continue; lost progress; or unusable with a required access method.
- **High:** likely to cause abandonment or a major misconception without facilitator help.
- **Medium:** recoverable friction or confusion that materially harms the lesson.
- **Low:** localized polish issue with little effect on completion or understanding.

| ID | Wave | Lesson / format | Category | Severity | Participants | Evidence | Reproduction | Owner | Disposition |
|---|---|---|---|---|---:|---|---|---|---|
| M2-001 | | | content / interaction / visual / performance / format | | | | | | open / fixed / accepted / not reproduced |

Rules:

- create separate rows for separate causes;
- attach counts only after confirming the same issue definition;
- link fixes to commits or pull requests and record the product revision;
- a preference is not an issue unless observation or explanation identifies a concrete problem;
- all critical and high issues require second-review confirmation.

## Evidence synthesis

### What learners understood

Pending.

### Where learners struggled

Pending.

### Format-level findings

Pending.

### Content-, lesson-, and implementation-specific findings

Pending.

### Limitations

Report recruitment gaps, uncovered cells, device constraints, order imbalance, facilitator effects, protocol changes, and uncertainty from the small sample.

## Threshold audit

| Adoption condition | Evidence | Pass |
|---|---|---|
| No unresolved critical v2 failure | | yes / no |
| V2 completion ≥80% and no more than 10 points below standard | | yes / no |
| Mean comprehension no more than 5 points below standard | | yes / no |
| 2/3 pass rate no more than 10 points below standard | | yes / no |
| Median v2 navigation confusion no higher than standard | | yes / no |
| At least 60% v2 preference, excluding neutral | | yes / no |
| No repeated subgroup-specific v2 access barrier | | yes / no |

## Decision record

Decision: **pending — adopt v2 / revise and retest / retain standard**  
Decision date:  
Decision makers:  
Second reviewer:  

Evidence-based rationale:

Pending.

Consequences:

- authoring standard:
- required fixes and owners:
- lessons or cells requiring retest:
- effect on Milestone 3:
- questions explicitly left unresolved:
