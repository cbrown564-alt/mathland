# Milestone 2 learner-validation protocol

Status: **prepared; recruitment and sessions pending**  
Owner: product/research lead  
Pilot: Module 2, lessons 2.1–2.9  
Formats: standard sections (`/lesson/:id`) and Lesson v2 beats (`/story/:id`)

## Decision and research questions

The study decides whether Lesson v2 should become Mathland's authoring standard. It is not a general satisfaction survey and does not validate the whole curriculum.

1. Can the target learner understand and complete a Module 2 lesson in each format?
2. Which format better supports immediate comprehension without an unreasonable time cost?
3. Where do learners become confused about navigation, instructions, visuals, or mathematical content?
4. Do learners prefer one format, and do their observed results support that preference?

The allowed decisions are **adopt v2**, **revise and retest**, or **retain the standard format**. Thresholds are fixed below before sessions begin.

## Participants

Recruit at least **12 adults**, with a target of **18**, who are preparing for, beginning, or returning to data-science study. Aim for a mix of mathematical confidence and device familiarity. A suitable participant:

- is 18 or older;
- can read and converse in the language used by the lessons and interview;
- has not already used Mathland's Module 2 pilot;
- knows basic arithmetic and coordinates, but need not know linear algebra;
- is not a contributor to the product.

Record only a participant code, broad self-rated maths confidence (low, medium, or high), device class, browser, and accessibility accommodations volunteered for the session. Do not record names in study artifacts. Participation is voluntary; tell participants what is observed, obtain consent before recording, and allow withdrawal or skipped questions. Do not collect sensitive information that is not needed for the decision.

## Study design and coverage

Use a moderated, counterbalanced comparison. Each participant completes **two different lessons**, one in each format. Half see v2 first; half see the standard format first. Rotate lesson assignments so each of the nine lessons receives at least **two observations per format** across the full study. Do not show the same lesson twice to one person: prior exposure would contaminate the second comprehension result.

Assignment constraints:

- balance format order within one participant of the other where possible;
- balance low/medium/high maths confidence across starting formats;
- assign lessons of roughly similar conceptual difficulty across the two format orders;
- do not change scored questions, success rules, or format behavior during a comparison wave;
- if a release-blocking defect must be fixed, close the wave, record the change, and begin a new wave.

A 12-person study produces 24 exposures, which is enough for every lesson-format cell to receive at least one observation, but not two. Prefer 18 participants for two observations in every cell. If recruitment stops earlier, report uncovered cells and treat per-lesson findings as directional.

## Session flow (45–60 minutes)

1. **Welcome and consent — 5 minutes.** Explain that the product, not the participant, is being tested. Ask permission separately for screen/audio recording.
2. **Background — 3 minutes.** Capture participant code, maths confidence, device, browser, and prior vector familiarity (none, some, confident).
3. **First lesson — up to 15 minutes.** Give the neutral task below. Observe silently; prompt the participant to keep going only after 60 seconds of no progress. Do not teach the interface or mathematics.
4. **Immediate check — 4 minutes.** Ask the prewritten comprehension questions without allowing a return to the lesson. Record answers verbatim before scoring.
5. **Second lesson in the other format — up to 15 minutes.** Repeat with the assigned different lesson.
6. **Immediate check — 4 minutes.** Repeat the same scoring procedure.
7. **Comparison interview — 8–10 minutes.** Use the fixed prompts below, then thank and debrief the participant.

Neutral task:

> Work through this lesson as you would at home. Your goal is to understand the idea well enough to explain it and use it in a small example. You may think aloud, but you do not need to narrate constantly. Tell me when you believe you are finished or if you would normally stop.

Use the assigned route with `?study=1` throughout scored sessions. This removes cross-format promotion without otherwise changing lesson content or scoring.

## Measures

Use the [session worksheet](SESSION_WORKSHEET.md) for every session. Timing begins when the lesson first becomes usable and ends when the participant declares completion, reaches the completion state, abandons, or reaches 15 minutes.

### Primary measures

- **Comprehension:** three prewritten items per lesson, scored 0 or 1 using an answer key reviewed before the first session. Include one explain item, one apply item, and one misconception check. Report mean percentage and the share scoring at least 2/3.
- **Unassisted completion:** participant reaches the format's completion state within 15 minutes without facilitator instruction. Technical recovery that does not reveal navigation or content is recorded separately.
- **Critical failure:** content teaches an incorrect idea; the participant cannot continue; progress is lost; or the experience is unusable with their required access method.

### Secondary measures

- time on task, reported with completion and comprehension rather than treated as automatically better when shorter;
- navigation confusion events: wrong turn, repeated backtracking, missed control, or explicit uncertainty requiring recovery;
- facilitator assists, separated into technical and task/navigation assists;
- single ease rating after each lesson from 1 (very difficult) to 5 (very easy);
- forced preference after both lessons, with reason and confidence;
- issue counts and severity by content, interaction, visual, performance, or format.

Do not infer understanding from completion or preference alone.

## Comprehension materials

The draft [comprehension question bank and scoring key](COMPREHENSION_QUESTION_BANK.md) supplies three common items for every lesson. It must receive mathematical and editorial review and a non-participant wording pilot before it is frozen. Questions test the learning objective rather than wording recall and are usable after either format. Keep the facilitator copy away from participants; wording changes after scored sessions begin create a new study wave.

## Interview prompts

Ask these in order without praising either format:

1. What do you think the first lesson was trying to teach?
2. What do you think the second lesson was trying to teach?
3. Where, if anywhere, did you feel unsure what to do next?
4. Was any explanation, visual, or activity misleading or harder than it needed to be?
5. Which lesson format would you choose for a new topic, and why?
6. What did your preferred format help you do that the other did not?
7. Is there anything that would stop you continuing to the next lesson?

## Predeclared decision thresholds

Calculate format comparisons over all valid exposures and show results by order and maths-confidence group as a guard against obvious imbalance. This is a product decision study, not a claim of statistical significance.

**Adopt v2** only if all are true:

- no unresolved critical v2 failure;
- v2 unassisted completion is at least 80% and no more than 10 percentage points below standard;
- v2 mean comprehension is no more than 5 percentage points below standard, and the 2/3 pass rate is no more than 10 points below;
- median v2 navigation-confusion events are no higher than standard;
- at least 60% of participants prefer v2 after using both, excluding neutral responses;
- no learner subgroup shows a repeated access barrier unique to v2.

**Retain the standard format** if v2 has a critical format-level failure that cannot be corrected without changing the model, or if after one documented revision wave v2 remains more than 10 points lower on unassisted completion or more than 10 points lower on comprehension pass rate.

**Revise and retest** in every other case, including missed adoption thresholds, conflicting outcomes, material uncovered lesson-format cells, or fixable critical/high issues. Predeclare the changes and rerun affected cells; do not combine pre-change and post-change scores as if they were one version.

Preference can support an adoption decision but cannot override comprehension, completion, or access failures.

## Analysis and evidence handling

1. Freeze the [assignment matrix](ASSIGNMENT_MATRIX.md), comprehension prompts, keys, and this protocol before the first scored session.
2. Enter one row per exposure in the results table and one row per observed problem in the issue log in [findings and decision](MILESTONE_2_FINDINGS.md).
3. Exclude an exposure only for a documented protocol or environment failure. Never exclude a difficult session because it lowers a result.
4. Report counts and denominators, not percentages alone. Separate observation from interpretation.
5. De-identify notes. Store recordings only in an approved location, restrict access, and delete them on the stated retention date.
6. Have a second reviewer check scoring and all critical/high issue classifications before the format decision.

## Readiness checklist

- [ ] Recruit at least 12 participants; target 18 for two observations per lesson-format cell.
- [ ] Freeze the prepared counterbalanced assignment matrix against participant codes.
- [ ] Review and freeze the comprehension question bank and scoring key.
- [ ] Pilot the script and question wording with a non-participant.
- [ ] Confirm both routes, completion, reset, and recording setup on the test devices.
- [ ] Define recording location, access, and deletion date.
- [ ] Print or duplicate one worksheet per participant.
- [ ] Assign facilitator, note-taker, and second scoring reviewer.
