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
      - button [ref=e11] [cursor=pointer]:
        - img [ref=e12]
  - main [ref=e13]:
    - generic [ref=e14]:
      - generic [ref=e15]:
        - generic [ref=e20]: ∑
        - generic [ref=e21]: ∇
        - generic [ref=e22]: ∫
      - generic [ref=e74]:
        - generic [ref=e75]: Interactive Character-Guided Learning
        - heading "Math for Data Science" [level=1] [ref=e77]
        - paragraph [ref=e78]: Where mathematical concepts become unforgettable stories
        - link "Start Your Mathematical Journey" [ref=e80] [cursor=pointer]:
          - /url: /course
          - button "Start Your Mathematical Journey" [ref=e81]
        - generic [ref=e82]:
          - generic [ref=e83]:
            - generic [ref=e84]: "10"
            - generic [ref=e85]: Character Guides
          - generic [ref=e86]:
            - generic [ref=e87]: "10"
            - generic [ref=e88]: Learning Modules
          - generic [ref=e89]:
            - generic [ref=e90]: "96"
            - generic [ref=e91]: Interactive Lessons
    - generic [ref=e93]:
      - generic [ref=e94]:
        - heading "Your Learning Path" [level=2] [ref=e95]
        - paragraph [ref=e96]: Progress through 10 comprehensive modules
      - generic [ref=e97]:
        - link "Go to Prerequisites & Refresher" [ref=e98] [cursor=pointer]:
          - /url: /module/1
          - generic [ref=e99]:
            - img "Prerequisites & Refresher" [ref=e101]
            - generic [ref=e102]:
              - generic [ref=e103]: Prerequisites & Refresher
              - generic [ref=e104]: Ollie the Otter
            - img [ref=e106]
        - generic [ref=e109]:
          - img "Vectors & Vector Spaces" [ref=e111]
          - generic [ref=e112]:
            - generic [ref=e113]: Vectors & Vector Spaces
            - generic [ref=e114]: Vera the Vector
          - img [ref=e115]
        - generic [ref=e118]:
          - img "Matrices & Linear Mappings" [ref=e120]
          - generic [ref=e121]:
            - generic [ref=e122]: Matrices & Linear Mappings
            - generic [ref=e123]: Matrix Max
          - img [ref=e124]
        - generic [ref=e127]:
          - img "Eigenvalues & Eigenvectors" [ref=e129]
          - generic [ref=e130]:
            - generic [ref=e131]: Eigenvalues & Eigenvectors
            - generic [ref=e132]: Eileen Eigen
          - img [ref=e133]
        - generic [ref=e136]:
          - img "Multivariate Calculus" [ref=e138]
          - generic [ref=e139]:
            - generic [ref=e140]: Multivariate Calculus
            - generic [ref=e141]: Dr. Delta
          - img [ref=e142]
        - generic [ref=e145]:
          - img "Optimization & Gradient Descent" [ref=e147]
          - generic [ref=e148]:
            - generic [ref=e149]: Optimization & Gradient Descent
            - generic [ref=e150]: Gradient Greta
          - img [ref=e151]
        - generic [ref=e154]:
          - img "Probability & Distributions" [ref=e156]
          - generic [ref=e157]:
            - generic [ref=e158]: Probability & Distributions
            - generic [ref=e159]: Probability Pippa
          - img [ref=e160]
        - generic [ref=e163]:
          - img "Hypothesis Testing" [ref=e165]
          - generic [ref=e166]:
            - generic [ref=e167]: Hypothesis Testing
            - generic [ref=e168]: Sigmund the Swan
          - img [ref=e169]
        - generic [ref=e172]:
          - img "Bayesian Inference" [ref=e174]
          - generic [ref=e175]:
            - generic [ref=e176]: Bayesian Inference
            - generic [ref=e177]: Bayes the Fox
          - img [ref=e178]
        - generic [ref=e181]:
          - img "Capstone Project" [ref=e183]
          - generic [ref=e184]:
            - generic [ref=e185]: Capstone Project
            - generic [ref=e186]: Sage the Eagle
  - contentinfo [ref=e187]:
    - generic [ref=e188]:
      - generic [ref=e189]:
        - link "M" [ref=e190] [cursor=pointer]:
          - /url: /
          - generic [ref=e191]: M
        - generic [ref=e192]: Mathland
      - navigation [ref=e193]:
        - link "Course Overview" [ref=e194] [cursor=pointer]:
          - /url: /course
        - link "Contact" [ref=e195] [cursor=pointer]:
          - /url: mailto:hello@mathland.com
        - link "About" [ref=e196] [cursor=pointer]:
          - /url: "#"
        - link "Home" [ref=e197] [cursor=pointer]:
          - /url: /
    - generic [ref=e198]:
      - text: © 2024 Mathland. Made with
      - img [ref=e199]
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