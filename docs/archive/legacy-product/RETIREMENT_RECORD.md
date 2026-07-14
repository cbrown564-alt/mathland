# Legacy product retirement record

Status: **runtime retired and source quarantined on 13 July 2026**.

## Scope

The Phase 4 promotion removed the legacy learner journey from executable source and public runtime assets. Historical implementation is retained temporarily under `archive/legacy-product/` for audit and selective future salvage.

Archived source includes the previous:

- `src/core/` application shell, pages, renderers, hooks, and shared UI;
- `src/content/` 96 lesson files, stories, and beat-format experiment;
- `src/interactive/` registry, activities, models, and standalone examples;
- `src/tier2/` template experiment;
- `src/utils/` lesson, module, character, theme, and progress utilities;
- generation and migration scripts under `scripts/` and `tools/`.

The quarantine also contains the retired Tailwind/shadcn configuration, Bun lockfile, generated lesson inventories, standalone direction mock-up, and 68 MiB source-image library. Production dependencies were reduced to React, React DOM, and React Router; the archived UI packages are no longer installed for the release.

Archived media includes the legacy narration library, character GIFs and portraits, bake-off media, story media, and design exploration. Production retains only the Mathland marks, favicon, health/config files, Vera’s promoted portrait, and her projection-lens audio.

## Isolation

The archive is excluded from:

- Vite and TypeScript production compilation;
- Jest coverage and module discovery;
- ESLint;
- Docker build context;
- `public/` asset copying;
- production navigation and content validation.

No production module may import from the archive. Git history remains the final recovery source after deletion.

## Salvage decision

The dot-product promotion extracted the reusable mathematical model, vector instrument contract, Vera projection intervention, domain case assumptions, diagnostic return model, and relevant examples into `src/world/`. The legacy lesson page, story/beat sequence, module navigation, completion progress, registry status, and character theme were not migrated.

All other historical material remains `archive` rather than `reuse`, `adapt`, or `extract` until a territory-specific learner need and review justify a new decision. The active inventory is [../../lessons_list.md](../../lessons_list.md).

## Redirect and deletion window

Known legacy routes redirect to the root world with a retirement notice. Keep those redirects for at least one production release cycle and no less than 90 days after the first public Phase 4 deployment. Review route traffic and support reports before removal.

Keep the quarantined source for the same 90-day minimum. At the end of the window, the release owner may delete it if:

1. no production import or runtime request targets the archive;
2. no unresolved support or compliance case needs it;
3. all completed salvage decisions are recorded in active territory sources and inventories;
4. the production rollback target is independent of the archive;
5. the repository history is intact.

Deleting the archive must not remove the redirect contract in the same release unless the redirect review independently approves that change.
