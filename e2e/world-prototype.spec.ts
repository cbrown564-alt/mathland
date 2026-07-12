import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/prototype/one-operation-three-worlds");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("revised journey preserves horizon, recovers an error, transfers, and records due retrieval", async ({ page }) => {
  await page.getByRole("radio", { name: /Understand intelligent systems/ }).click();
  await page.getByRole("button", { name: /Set this horizon/ }).click();
  await expect(page.getByText(/move 1 of 6/i)).toBeVisible();
  await page.getByRole("button", { name: /Skip tour/ }).click();
  await expect(page.getByRole("button", { name: /Horizon Understand intelligent systems/ })).toBeVisible();

  await page.getByRole("button", { name: "It becomes negative" }).click();
  await page.getByRole("button", { name: /Test the claim in the Studio/ }).click();
  const handle = page.getByRole("slider", { name: "Force vector tip" });
  await handle.focus();
  await page.keyboard.press("Shift+ArrowLeft");
  await page.getByRole("button", { name: /Sideways/ }).click();
  await expect(page.getByText(/No directional overlap/).first()).toBeVisible();
  await page.getByRole("button", { name: /Formalise and calculate/ }).click();

  await page.getByRole("button", { name: /signed-components detour/ }).click();
  await expect(page.getByText(/Your horizon and work are preserved/)).toBeVisible();
  await page.getByLabel(/First contribution/).fill("-10");
  await page.getByLabel(/Net:/).fill("2");
  await page.getByRole("button", { name: /Return to my exact calculation/ }).click();
  await expect(page.locator("#faded-challenge")).toBeFocused();

  await page.getByLabel("Faded example answer").fill("2");
  await page.locator("#faded-challenge").getByRole("button", { name: "Check" }).click();
  await page.getByLabel("First matched product").fill("8");
  await page.getByLabel("Second matched product").fill("-3");
  await page.getByLabel("Net dot product").fill("5");
  await page.getByRole("button", { name: "Check all three values" }).click();
  await expect(page.getByText(/Teaching step 1 of 6/)).toBeVisible();
  await expect(page.getByLabel("First matched product")).toHaveValue("8");
  await page.getByLabel("First matched product").fill("-8");
  await page.getByLabel("Second matched product").fill("-3");
  await page.getByLabel("Net dot product").fill("-11");
  await page.getByRole("button", { name: "Check all three values" }).click();
  await expect(page.getByText(/Independent evidence remains open/)).toBeVisible();
  await page.getByLabel(/negative component contributions dominate/).check();
  await page.getByLabel(/what does a negative dot product/i).fill("The vectors have a net opposing directional relationship.");
  await page.getByRole("button", { name: "Check reasoning" }).click();
  await page.getByRole("button", { name: /Transfer the structure to finance/ }).click();

  await expect(page.getByText("Structure that stays fixed")).toBeVisible();
  await page.getByRole("button", { name: /ready to translate/ }).click();
  await page.getByLabel("Asset A contribution").fill("0.04");
  await page.getByLabel("Asset B contribution").fill("-0.004");
  await page.getByLabel("Portfolio return").fill("0.036");
  await page.getByLabel(/weighted realised return/).check();
  await page.getByRole("button", { name: "Check transfer" }).click();
  await page.getByRole("button", { name: /Open the Atlas/ }).click();
  await expect(page.getByRole("img", { name: /Map of eight connected mathematical territories/ })).toBeVisible();
  await expect(page.getByText(/Retrieval scheduled for/)).toBeVisible();

  await page.evaluate(() => {
    const key = "mathland.world.dot-product.v2";
    const snapshot = JSON.parse(localStorage.getItem(key) ?? "{}");
    snapshot.retrievalDueAt = new Date(Date.now() - 1000).toISOString();
    localStorage.setItem(key, JSON.stringify(snapshot));
  });
  await page.reload();
  await page.getByRole("button", { name: /Preview retrieval orientation/ }).click();
  await page.getByRole("button", { name: /Start the memory attempt/ }).click();
  await page.getByLabel("Weighted index").fill("2.1");
  await page.getByRole("button", { name: "Check retrieval" }).click();
  await expect(page.getByText(/^Retrieved:/)).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: /Retrieve the operation/ })).toBeVisible();
});

test("tour is reopenable and horizon changes preserve the current Studio", async ({ page }) => {
  await page.getByRole("button", { name: /Set this horizon/ }).click();
  await page.getByRole("button", { name: /Skip tour/ }).click();
  await page.getByRole("button", { name: "Help & tour" }).click();
  await expect(page.getByText(/move 1 of 6/i)).toBeVisible();
  await page.getByRole("button", { name: /Skip tour/ }).click();
  await page.getByRole("button", { name: /Horizon Understand physical systems/ }).click();
  await page.getByRole("button", { name: /Understand intelligent systems/ }).click();
  await expect(page.getByRole("button", { name: /Horizon Understand intelligent systems/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Three systems compress/ })).toBeVisible();
});

test("prototype has no automatically detectable accessibility violations at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await expect(page.getByRole("heading", { name: /A force, a meaning, a return/ })).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole("button", { name: /Set this horizon/ }).click();
  await page.getByRole("button", { name: /Skip tour/ }).click();
  await page.getByRole("button", { name: "It becomes negative" }).click();
  await page.getByRole("button", { name: /Test the claim in the Studio/ }).click();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("reduced motion preserves the complete state change", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: /Set this horizon/ }).click();
  await page.getByRole("button", { name: /Skip tour/ }).click();
  await page.getByRole("button", { name: "It becomes negative" }).click();
  await page.getByRole("button", { name: /Test the claim in the Studio/ }).click();
  await page.getByRole("button", { name: /Maximum resistance/ }).click();
  await expect(page.getByText(/Negative directional overlap/).first()).toBeVisible();
  await expect(page.locator(".world-vector-handle")).toHaveCSS("transition-duration", "0s");
});
