import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/prototype/one-operation-three-worlds");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("critical world journey preserves action, detour return, transfer, and retrieval", async ({ page }) => {
  await page.getByRole("radio", { name: /Understand intelligent systems/ }).click();
  await page.getByRole("button", { name: /Enter through a real system/ }).click();
  await page.getByRole("button", { name: "It becomes negative" }).click();
  await page.getByRole("button", { name: /Take the operation into the Studio/ }).click();

  const handle = page.getByRole("slider", { name: "Force vector tip" });
  await handle.focus();
  await page.keyboard.press("Shift+ArrowLeft");
  await page.getByRole("button", { name: "Sideways" }).click();
  await expect(page.getByText(/No directional overlap/).first()).toBeVisible();
  await page.getByRole("button", { name: /Formalise and fade support/ }).click();

  await page.getByRole("button", { name: /two-minute signed-components refresher/ }).click();
  await expect(page.getByText(/We will return here exactly/)).toBeVisible();
  await page.getByLabel(/First contribution/).fill("-10");
  await page.getByLabel(/Net:/).fill("2");
  await page.getByRole("button", { name: /Return to my exact calculation/ }).click();
  await expect(page.locator("#faded-challenge")).toBeFocused();

  await page.getByLabel("Faded example answer").fill("2");
  await page.locator("#faded-challenge").getByRole("button", { name: "Check" }).click();
  await page.getByLabel("Independent calculation answer").fill("-11");
  await page.locator("#independent-challenge").getByRole("button", { name: "Check" }).click();
  await page.getByLabel("Explain in your own words").fill("The result is negative because opposing component contributions dominate the net directional agreement.");
  await page.getByRole("button", { name: "Save explanation" }).click();
  await page.getByRole("button", { name: /Use it in another world/ }).click();

  await page.getByLabel("Portfolio return").fill("3.6%");
  await page.getByLabel("What does the result mean here?").fill("It is the weighted realised return of this simplified two-asset portfolio for one period.");
  await page.getByRole("button", { name: "Check transfer" }).click();
  await page.getByRole("button", { name: /See where this sits in the Atlas/ }).click();
  await expect(page.getByRole("img", { name: /Map of eight connected mathematical territories/ })).toBeVisible();
  await expect(page.getByText(/Retrieval scheduled for/)).toBeVisible();

  await page.getByRole("button", { name: "Preview the future retrieval prompt" }).click();
  await page.getByLabel("Exposure index").fill("2.1");
  await page.getByRole("button", { name: "Check retrieval" }).click();
  await expect(page.getByText(/^Retrieved:/)).toBeVisible();
  await page.reload();
  await expect(page.getByText(/^Retrieved:/)).toBeVisible();
});

test("prototype has no automatically detectable accessibility violations at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await expect(page.getByRole("heading", { name: "A force. A meaning. A return." })).toBeVisible();
  const entryResults = await new AxeBuilder({ page }).analyze();
  expect(entryResults.violations).toEqual([]);
  await page.getByRole("button", { name: /Enter through a real system/ }).click();
  await page.getByRole("button", { name: "It becomes negative" }).click();
  await page.getByRole("button", { name: /Take the operation into the Studio/ }).click();
  const studioResults = await new AxeBuilder({ page }).analyze();
  expect(studioResults.violations).toEqual([]);
});
