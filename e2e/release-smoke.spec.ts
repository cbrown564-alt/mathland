import { expect, test } from "@playwright/test";

test("story progress persists after reload", async ({ page }) => {
  await page.goto("/story/2.3");
  await page.getByRole("button", { name: /11 — the paths/i }).click();
  await page.getByRole("button", { name: /^Continue/i }).click();
  await expect(page.getByText(/2 of \d+/)).toBeVisible();
  await page.reload();
  await expect(page.getByText(/2 of \d+/)).toBeVisible();
});

test("release interactive loads and responds", async ({ page }) => {
  await page.goto("/story/2.1");
  await page.evaluate(() => localStorage.setItem("lesson-progress-2.1", JSON.stringify({ completedSections: [], currentSection: "narrative", beatIndex: 2, lessonCompleted: false })));
  await page.reload();
  const plot = page.getByRole("img", { name: "Vector v on a coordinate grid" });
  await expect(plot).toBeVisible();
  await expect(page.getByLabel("Drag vector v tip")).toBeVisible();
});

test("lesson 2.1 can be completed without pointer dragging", async ({ page }) => {
  await page.goto("/story/2.1");
  await page.evaluate(() => localStorage.setItem("lesson-progress-2.1", JSON.stringify({ completedSections: [], currentSection: "narrative", beatIndex: 2, lessonCompleted: false })));
  await page.reload();

  await page.getByRole("button", { name: "Set v to [4, 3]" }).click();
  await page.getByRole("button", { name: "Set a unit vector" }).click();
  await page.getByRole("button", { name: "Set another length-5 vector" }).click();
  await expect(page.getByRole("button", { name: "Finish the lesson" })).toBeEnabled();
  await page.getByRole("button", { name: "Finish the lesson" }).click();
  await expect(page.getByText("Every vector is a journey with distance and direction — just like my forest explorations!")).toBeVisible();
});

test("study mode hides the alternate format promotion", async ({ page }) => {
  await page.goto("/lesson/2.2?study=1");
  await expect(page.getByRole("heading", { name: "Vector Addition & Scalar Multiplication" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Read as a guided story/i })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Next Lesson" })).toHaveCount(0);
});

test("required Module 2 activities expose non-pointer completion paths", async ({ page }) => {
  const cases = [
    { id: "2.2", beatIndex: 2, presets: ["Make sum [4, 6]", "Flip u negative", "Stretch the sum"] },
    { id: "2.4", beatIndex: 2, presets: ["Set [3, 4]", "Normalize to length 1", "Make L1 equal 7"] },
    { id: "2.6", beatIndex: 2, presets: ["Make vectors dependent"] },
  ];

  for (const item of cases) {
    await page.goto(`/story/${item.id}`);
    await page.evaluate(({ id, beatIndex }) => localStorage.setItem(`lesson-progress-${id}`, JSON.stringify({ completedSections: [], currentSection: "narrative", beatIndex, lessonCompleted: false })), item);
    await page.reload();
    for (const label of item.presets) await page.getByRole("button", { name: label }).click();
    await expect(page.getByRole("button", { name: "Finish the lesson" })).toBeEnabled();
  }
});
