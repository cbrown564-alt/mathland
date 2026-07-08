# Research prototype apps (intentionally separate)

These four Next.js mini-apps under `src/interactive/examples/` are **research
prototypes**, not part of the production Vite build:

- `vector-visualization/`
- `svd-explorer/`
- `partial-derivative-explorer/`
- `eigenviz/`

Each has its own `package.json` and must be run independently (e.g.
`pnpm install && pnpm dev` inside the folder). Production interactives live in
`src/interactive/components/` and are registered in
`src/interactive/demos/demo_registry.ts`.

Do not import from these example apps in core routes or lesson code.
