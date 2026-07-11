# Release baseline

Recorded 11 July 2026. The initial release candidate is **Module 2 (lessons 2.1–2.9), shared navigation, and local progress**. Other modules and research/gallery routes are outside the release scope until the flagship module meets the roadmap quality bar.

## Supported clients

- Current and previous major Chrome, Edge, Firefox, and Safari releases on desktop.
- Safari on the current and previous major iOS releases; Chrome on the current and previous major Android releases.
- Required viewport baselines: 360×800 phone, 768×1024 tablet, 1440×900 desktop. Layouts must remain usable from 320 CSS pixels wide and at 200% zoom.

CI smoke coverage uses Chromium at Desktop Chrome and Pixel 7 profiles. Manual release checks cover Safari/WebKit and Firefox until those projects are promoted to stable CI gates.

## 11 July baseline results

| Area | Baseline | Gate / follow-up |
| --- | --- | --- |
| Build | Passing | Blocking CI gate |
| TypeScript | Explicit `tsc` project for the release-scope interactives | Blocking CI gate; repository-wide legacy errors remain tracked debt |
| Unit/integration | 63 tests across 16 suites at plan creation | Blocking CI gate; current count reported by CI |
| Content integrity | Lesson/index IDs, characters, custom interactives, and docs links validated | Blocking CI gate |
| Browser journeys | Home → Module 2 → Lesson 2.1, story progress reload, interactive render | Chromium desktop/mobile blocking CI gate |
| Accessibility | No comprehensive WCAG 2.2 AA audit previously recorded | Milestone 3 blocker: keyboard, focus, names, contrast, reduced motion, canvas alternative at all three viewports |
| Performance | No reproducible Lighthouse baseline previously recorded; large visualization chunks remain a known risk | Capture mobile Lighthouse for `/`, `/module/2`, `/story/2.3`, `/lesson/2.1`; targets: LCP ≤2.5s, CLS ≤0.1, INP ≤200ms, initial route JS ≤300 KiB gzip |

The absence of prior accessibility/performance measurements is itself the honest baseline. Results must include tool version, device/profile, URL, commit, and raw artifact; estimates are not results.

## Lint backlog and warning budget

The initial inventory was 96 warnings: 52 `react-hooks/exhaustive-deps` and 44 `react-refresh/only-export-components`. Four warnings were in release-scope Vera interactives. CI allows the remaining 92 warnings so existing debt is visible while `--max-warnings 92` prevents additions.

Priority order:

1. Module 2 production interactives (release-blocking).
2. Other production interactive hook warnings (48 at inventory time), reviewed for stale canvas/animation closures.
3. Fast Refresh export-boundary warnings (44), resolved by separating constants/helpers from component modules.

Any touched file should leave no hook warning behind. Lowering the budget accompanies every cleanup; raising it requires a documented exception.

## TypeScript scope

`tsconfig.release.json` typechecks the four production interactives referenced by Module 2 and their utilities under strict settings. A repository-wide `tsc -b` baseline currently reports legacy errors across old lesson templates, galleries, and out-of-scope interactives even though Vite builds them. Those errors are not silently accepted as release quality: they are excluded from the initial Module 2 release gate and must be reduced as each surface enters release scope.
