# Legacy beat-format experiment

The files in this directory implement the nine-lesson Module 2 beat-format experiment. The experiment remains runnable and tested as part of the current application, but it is **frozen** as an authoring direction.

Do not add or migrate lessons to this format.

The accepted product architecture is the open-world Atlas–Studio–Observatory model documented in:

- [`docs/PRODUCT_DOCTRINE.md`](../../../docs/PRODUCT_DOCTRINE.md)
- [`docs/EXPERIENCE_ARCHITECTURE.md`](../../../docs/EXPERIENCE_ARCHITECTURE.md)
- [`docs/FIRST_VERTICAL_SLICE.md`](../../../docs/FIRST_VERTICAL_SLICE.md)

The former Lesson v2 specification and full authoring guide are retained under `docs/archive/pre-reboot/` for implementation archaeology.

## Maintenance policy

- Preserve existing behaviour while the legacy application remains runnable.
- Fix regressions or mathematical defects when necessary.
- Do not extend the schema for new product work.
- Extract reusable mathematical models or rendering logic through adapters.
- Keep new Atlas, Studio, and Observatory data independent of these types.
