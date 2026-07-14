# Legacy research prototype apps

These four Next.js mini-apps predate the Atlas–Studio–Observatory direction. They are **legacy research prototypes**, not part of the production Vite build or the new `src/world/` prototype namespace:

- `vector-visualization/`
- `svd-explorer/`
- `partial-derivative-explorer/`
- `eigenviz/`

Each has its own `package.json` and must be run independently. Legacy integrated interactives live in `src/interactive/components/` and are registered in `src/interactive/demos/demo_registry.ts`.

Do not import these apps into core routes, lesson code, or `src/world/`. Individual mathematical models or rendering ideas may be extracted only after review against `docs/PRODUCT_DOCTRINE.md` and `docs/development/BUILDING_EXPERIENCES.md`.
