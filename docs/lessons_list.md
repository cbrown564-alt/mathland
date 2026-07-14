# Legacy curriculum salvage inventory

This inventory describes historical source material now quarantined under `archive/legacy-product/src/content/lessons/`. It is not the future navigation, curriculum order, product roadmap, or a claim that the lessons should be migrated.

The module `index.json` and lesson JSON files remain authoritative only for the archived product they describe.

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

Module 2 also has a nine-lesson beat-format experiment under `archive/legacy-product/src/content/beats/`. That format is frozen and superseded as a product direction.

## Salvage status

Each asset considered for new work should receive one status:

- **reuse:** already fits the doctrine and needs only integration;
- **adapt:** valuable but needs substantive content or interaction changes;
- **extract:** retain a model, example, visual, or calculation rather than the whole lesson;
- **archive:** no longer useful enough to justify migration.

Use the rubric in [CONTENT_STRATEGY.md](CONTENT_STRATEGY.md). Do not infer a status from file existence, demo-registry labels, test coverage, or previous “production ready” language.

## First completed salvage decision

The promoted dot-product region received the following territory-specific decision:

| Historical material | Decision | Production result |
| --- | --- | --- |
| Module 2 dot-product lesson and beat content | extract | Formal definitions, worked component reasoning, sign treatment, and examples rewritten into the world learning loop |
| Vector and dot-product interactives | extract | One pure dot-product model and one accessible multi-input Studio instrument under `src/world/studio/` |
| Vera vector language and visual tools | adapt | A bounded projection-lens intervention with illustration, optional audio, transcript, and non-media path |
| Work, similarity, portfolio, and sensor examples | adapt | Versioned case adapters with explicit units, assumptions, and boundaries |
| Legacy lesson/story pages and progress hooks | archive | No production dependency; descriptive world evidence replaces completion state |
| Module, character-theme, registry, and tier-template navigation | archive | No production dependency; Atlas territory identity and case adapters replace these shells |

All other material remains `archive` pending a territory-specific learner need. Matrices, gradients, and neighbouring territories shown on the Atlas are not promoted merely because archived lessons or interactives exist.

The runtime retirement, redirects, and deletion window are recorded in [archive/legacy-product/RETIREMENT_RECORD.md](archive/legacy-product/RETIREMENT_RECORD.md).
