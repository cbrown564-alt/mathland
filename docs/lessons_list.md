# Legacy curriculum salvage inventory

This inventory describes source material in `src/content/lessons/`. It is not the future navigation, curriculum order, product roadmap, or a claim that the lessons should be migrated.

The authoritative current lesson order and titles remain the module `index.json` and lesson JSON files.

| Legacy module | Guide | Existing subject | Lesson files | Likely Atlas value |
| --- | --- | --- | ---: | --- |
| 1 | Ollie | Prerequisites and refresher | 8 | Diagnostic detours for algebra, functions, and notation |
| 2 | Vera | Vectors and vector spaces | 9 | First region: components, magnitude, combination, dot product, projection |
| 3 | Max | Matrices and linear mappings | 10 | Transformations, systems, and repeated dot products |
| 4 | Eileen | Eigenvalues and eigenvectors | 9 | Invariants, modes, stability, and dimensional structure |
| 5 | Delta | Multivariable calculus | 10 | Fields, local change, derivatives, Jacobians, and constraints |
| 6 | Greta | Optimisation and gradient descent | 10 | Search, objectives, curvature, and training |
| 7 | Pippa | Probability and distributions | 10 | Uncertainty, random variables, expectation, and distributions |
| 8 | Sigmund | Statistical inference and hypothesis testing | 10 | Evidence, sampling, tests, and uncertainty in conclusions |
| 9 | Bayes | Bayesian inference | 10 | Updating beliefs and probabilistic decisions |
| 10 | Sage | Integration and capstone work | 10 | Potential multi-territory cases; extensive rewrite likely |
| **Total** |  |  | **96** | Raw material only |

Module 2 also has a nine-lesson beat-format experiment under `src/content/beats/`. That format is frozen and superseded as a product direction.

## Salvage status

Each asset considered for new work should receive one status:

- **reuse:** already fits the doctrine and needs only integration;
- **adapt:** valuable but needs substantive content or interaction changes;
- **extract:** retain a model, example, visual, or calculation rather than the whole lesson;
- **archive:** no longer useful enough to justify migration.

Use the rubric in [CONTENT_STRATEGY.md](CONTENT_STRATEGY.md). Do not infer a status from file existence, demo-registry labels, test coverage, or previous “production ready” language.

## First salvage target

Only dot-product-related material should be audited initially:

- `src/content/lessons/module2/lesson-2.3.json`;
- relevant beat-format dot-product content;
- vector and dot-product interactives under `src/interactive/`;
- Vera's useful vector language and visual tools;
- component, angle, projection, similarity, work, and weighted-sum examples elsewhere in the repository.

All other module migration waits for the first vertical-slice decision.
