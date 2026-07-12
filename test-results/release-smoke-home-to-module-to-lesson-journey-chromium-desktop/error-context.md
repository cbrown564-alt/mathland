# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: release-smoke.spec.ts >> home to module to lesson journey
- Location: e2e/release-smoke.spec.ts:3:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('link', { name: /Go to Vectors & Vector Spaces/i })

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e6]:
      - link "M Mathland" [ref=e7] [cursor=pointer]:
        - /url: /
        - generic [ref=e9]: M
        - generic [ref=e10]: Mathland
      - navigation [ref=e11]:
        - link "Home" [ref=e12] [cursor=pointer]:
          - /url: /
        - link "Map" [ref=e13] [cursor=pointer]:
          - /url: /world
        - link "Experience" [ref=e14] [cursor=pointer]:
          - /url: /experience
        - link "Roadmap" [ref=e15] [cursor=pointer]:
          - /url: /course
        - link "Templates" [ref=e16] [cursor=pointer]:
          - /url: /tier2-gallery
        - link "Interactive" [ref=e17] [cursor=pointer]:
          - /url: /interactive-gallery
      - button "Start Learning" [ref=e19] [cursor=pointer]
  - main [ref=e20]:
    - generic [ref=e21]:
      - generic [ref=e22]:
        - generic [ref=e27]: ∑
        - generic [ref=e28]: ∇
        - generic [ref=e29]: ∫
      - generic [ref=e81]:
        - generic [ref=e82]: Interactive Character-Guided Learning
        - heading "Math for Data Science" [level=1] [ref=e84]
        - paragraph [ref=e85]: Where mathematical concepts become unforgettable stories
        - link "Start Your Mathematical Journey" [ref=e87] [cursor=pointer]:
          - /url: /course
          - button "Start Your Mathematical Journey" [ref=e88]
        - generic [ref=e89]:
          - generic [ref=e90]:
            - generic [ref=e91]: "10"
            - generic [ref=e92]: Character Guides
          - generic [ref=e93]:
            - generic [ref=e94]: "10"
            - generic [ref=e95]: Learning Modules
          - generic [ref=e96]:
            - generic [ref=e97]: "96"
            - generic [ref=e98]: Interactive Lessons
    - generic [ref=e100]:
      - generic [ref=e101]:
        - heading "Your Learning Path" [level=2] [ref=e102]
        - paragraph [ref=e103]: Progress through 10 comprehensive modules
      - generic [ref=e104]:
        - link "Go to Prerequisites & Refresher" [ref=e107] [cursor=pointer]:
          - /url: /module/1
          - generic [ref=e108]:
            - generic [ref=e109]: Ollie the Otter
            - img "Prerequisites & Refresher" [ref=e111]
            - generic [ref=e113]: Prerequisites & Refresher
        - generic [ref=e115]:
          - generic [ref=e116]: Vera the Vector
          - img "Vectors & Vector Spaces" [ref=e118]
          - generic [ref=e120]: Vectors & Vector Spaces
        - generic [ref=e122]:
          - generic [ref=e123]: Matrix Max
          - img "Matrices & Linear Mappings" [ref=e125]
          - generic [ref=e127]: Matrices & Linear Mappings
        - generic [ref=e129]:
          - generic [ref=e130]: Eileen Eigen
          - img "Eigenvalues & Eigenvectors" [ref=e132]
          - generic [ref=e134]: Eigenvalues & Eigenvectors
        - generic [ref=e136]:
          - generic [ref=e137]: Dr. Delta
          - img "Multivariate Calculus" [ref=e139]
          - generic [ref=e141]: Multivariate Calculus
        - generic [ref=e143]:
          - generic [ref=e144]: Gradient Greta
          - img "Optimization & Gradient Descent" [ref=e146]
          - generic [ref=e148]: Optimization & Gradient Descent
        - generic [ref=e150]:
          - generic [ref=e151]: Probability Pippa
          - img "Probability & Distributions" [ref=e153]
          - generic [ref=e155]: Probability & Distributions
        - generic [ref=e157]:
          - generic [ref=e158]: Sigmund the Swan
          - img "Hypothesis Testing" [ref=e160]
          - generic [ref=e162]: Hypothesis Testing
        - generic [ref=e164]:
          - generic [ref=e165]: Bayes the Fox
          - img "Bayesian Inference" [ref=e167]
          - generic [ref=e169]: Bayesian Inference
        - generic [ref=e171]:
          - generic [ref=e172]: Sage the Eagle
          - img "Capstone Project" [ref=e174]
          - generic [ref=e176]: Capstone Project
  - contentinfo [ref=e177]:
    - generic [ref=e178]:
      - generic [ref=e179]:
        - link "M" [ref=e180] [cursor=pointer]:
          - /url: /
          - generic [ref=e181]: M
        - generic [ref=e182]: Mathland
      - navigation [ref=e183]:
        - link "Course Overview" [ref=e184] [cursor=pointer]:
          - /url: /course
        - link "Contact" [ref=e185] [cursor=pointer]:
          - /url: mailto:hello@mathland.com
        - link "About" [ref=e186] [cursor=pointer]:
          - /url: "#"
        - link "Home" [ref=e187] [cursor=pointer]:
          - /url: /
    - generic [ref=e188]:
      - text: © 2024 Mathland. Made with
      - img [ref=e189]
      - text: for mathematical learning.
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | test("home to module to lesson journey", async ({ page }) => {
  4  |   await page.goto("/");
> 5  |   await page.getByRole("link", { name: /Go to Vectors & Vector Spaces/i }).click();
     |                                                                            ^ Error: locator.click: Test timeout of 30000ms exceeded.
  6  |   await expect(page).toHaveURL(/\/module\/2$/);
  7  |   await page.getByRole("button", { name: /Start with Lesson 2\.1/i }).click();
  8  |   await expect(page).toHaveURL(/\/lesson\/2\.1$/);
  9  |   await expect(page.getByRole("heading", { name: /Vector Basics/i }).first()).toBeVisible();
  10 | });
  11 | 
  12 | test("story progress persists after reload", async ({ page }) => {
  13 |   await page.goto("/story/2.3");
  14 |   await page.getByRole("button", { name: /11 — the paths/i }).click();
  15 |   await page.getByRole("button", { name: /^Continue/i }).click();
  16 |   await expect(page.getByText(/2 of \d+/)).toBeVisible();
  17 |   await page.reload();
  18 |   await expect(page.getByText(/2 of \d+/)).toBeVisible();
  19 | });
  20 | 
  21 | test("release interactive loads and responds", async ({ page }) => {
  22 |   await page.goto("/story/2.1");
  23 |   await page.evaluate(() => localStorage.setItem("lesson-progress-2.1", JSON.stringify({ completedSections: [], currentSection: "narrative", beatIndex: 2, lessonCompleted: false })));
  24 |   await page.reload();
  25 |   const plot = page.getByRole("img", { name: "Vector v on a coordinate grid" });
  26 |   await expect(plot).toBeVisible();
  27 |   await expect(page.getByLabel("Drag vector v tip")).toBeVisible();
  28 | });
  29 | 
  30 | test("lesson 2.1 can be completed without pointer dragging", async ({ page }) => {
  31 |   await page.goto("/story/2.1");
  32 |   await page.evaluate(() => localStorage.setItem("lesson-progress-2.1", JSON.stringify({ completedSections: [], currentSection: "narrative", beatIndex: 2, lessonCompleted: false })));
  33 |   await page.reload();
  34 | 
  35 |   await page.getByRole("button", { name: "Set v to [4, 3]" }).click();
  36 |   await page.getByRole("button", { name: "Set a unit vector" }).click();
  37 |   await page.getByRole("button", { name: "Set another length-5 vector" }).click();
  38 |   await expect(page.getByRole("button", { name: "Finish the lesson" })).toBeEnabled();
  39 |   await page.getByRole("button", { name: "Finish the lesson" }).click();
  40 |   await expect(page.getByText("Every vector is a journey with distance and direction — just like my forest explorations!")).toBeVisible();
  41 | });
  42 | 
  43 | test("study mode hides the alternate format promotion", async ({ page }) => {
  44 |   await page.goto("/lesson/2.2?study=1");
  45 |   await expect(page.getByRole("heading", { name: "Vector Addition & Scalar Multiplication" })).toBeVisible();
  46 |   await expect(page.getByRole("link", { name: /Read as a guided story/i })).toHaveCount(0);
  47 |   await expect(page.getByRole("button", { name: "Next Lesson" })).toHaveCount(0);
  48 | });
  49 | 
  50 | test("required Module 2 activities expose non-pointer completion paths", async ({ page }) => {
  51 |   const cases = [
  52 |     { id: "2.2", beatIndex: 2, presets: ["Make sum [4, 6]", "Flip u negative", "Stretch the sum"] },
  53 |     { id: "2.4", beatIndex: 2, presets: ["Set [3, 4]", "Normalize to length 1", "Make L1 equal 7"] },
  54 |     { id: "2.6", beatIndex: 2, presets: ["Make vectors dependent"] },
  55 |   ];
  56 | 
  57 |   for (const item of cases) {
  58 |     await page.goto(`/story/${item.id}`);
  59 |     await page.evaluate(({ id, beatIndex }) => localStorage.setItem(`lesson-progress-${id}`, JSON.stringify({ completedSections: [], currentSection: "narrative", beatIndex, lessonCompleted: false })), item);
  60 |     await page.reload();
  61 |     for (const label of item.presets) await page.getByRole("button", { name: label }).click();
  62 |     await expect(page.getByRole("button", { name: "Finish the lesson" })).toBeEnabled();
  63 |   }
  64 | });
  65 | 
```