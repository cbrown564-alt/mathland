# Curriculum inventory

This is a human-readable module index, not a second content database. The authoritative lesson order and titles are the `index.json` and lesson JSON files under `src/content/lessons/`.

| Module | Guide | Subject | Lessons | Lesson v2 |
| --- | --- | --- | ---: | --- |
| 1 | Ollie | Prerequisites and refresher | 8 | — |
| 2 | Vera | Vectors and vector spaces | 9 | 2.1–2.9 pilot |
| 3 | Max | Matrices and linear mappings | 10 | — |
| 4 | Eileen | Eigenvalues and eigenvectors | 9 | — |
| 5 | Delta | Multivariable calculus | 10 | — |
| 6 | Greta | Optimisation and gradient descent | 10 | — |
| 7 | Pippa | Probability and distributions | 10 | — |
| 8 | Sigmund | Statistical inference and hypothesis testing | 10 | — |
| 9 | Bayes | Bayesian inference | 10 | — |
| 10 | Sage | Integration and capstone work | 10 | — |
| **Total** |  |  | **96** | **9** |

## Status semantics

The presence of a lesson file means **authored and integrated**. It does not by itself mean the lesson has completed mathematical review, editorial review, accessibility QA, cross-device QA, or learner validation. Those states should be tracked separately when the release process is implemented.

## Updating the curriculum

1. Edit the relevant module index and lesson JSON under `src/content/lessons/`.
2. Keep IDs, ordering, character references, and custom interactive names consistent.
3. For the beat format, follow [the authoring guide](../src/content/beats/README.md) and register the lesson in `src/content/beats/index.ts`.
4. Run lint, tests, and the production build.
5. Update this table only when module-level counts or scope change.
