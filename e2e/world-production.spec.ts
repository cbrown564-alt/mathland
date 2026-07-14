import AxeBuilder from "@axe-core/playwright";
import { expect, Page, test } from "@playwright/test";

const enterObservatory = async (page: Page, horizon: RegExp = /Understand physical systems/) => {
  await page.getByRole("radio", { name: horizon }).click();
  await page.getByRole("button", { name: /Set this horizon/ }).click();
};

const completeNoticing = async (page: Page) => {
  await page.getByLabel(/Energy transferred along the motion/).check();
  await page.getByLabel(/Direction similarity after normalisation/).check();
  await page.getByLabel(/Weighted realised return/).check();
  await page.getByRole("button", { name: "It becomes negative" }).click();
  await page.getByRole("button", { name: /Test the claim in the Studio/ }).click();
};

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("production journey uses three real worlds, preserves diagnosed work, and opens projection", async ({ page }) => {
  await enterObservatory(page, /Understand intelligent systems/);
  await expect(page.getByRole("button", { name: /Horizon Understand intelligent systems/ })).toBeVisible();
  await completeNoticing(page);

  await expect(page.getByRole("heading", { name: /Direction agreement between embeddings/ }).first()).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  const initialReadoutBox = await page.locator(".world-dot-readout").boundingBox();
  const initialPlotTitleBox = await page.locator(".world-vector-stage .world-panel-heading h2").boundingBox();
  await page.getByRole("spinbutton", { name: "û x component" }).fill("5");
  await page.getByRole("spinbutton", { name: "û y component" }).fill("0");
  await page.getByRole("spinbutton", { name: "v̂ x component" }).fill("3.25");
  await page.getByRole("spinbutton", { name: "v̂ y component" }).fill("4.75");
  const expandedReadoutBox = await page.locator(".world-dot-readout").boundingBox();
  const expandedPlotTitleBox = await page.locator(".world-vector-stage .world-panel-heading h2").boundingBox();
  expect(Math.abs((initialReadoutBox?.width ?? 0) - (expandedReadoutBox?.width ?? 0))).toBeLessThan(1);
  expect(Math.abs((initialPlotTitleBox?.height ?? 0) - (expandedPlotTitleBox?.height ?? 0))).toBeLessThan(1);
  const readoutValueFits = await page.locator(".world-dot-readout").evaluate((readout) => {
    const cardBox = readout.getBoundingClientRect();
    const valueBox = readout.querySelector("strong")?.getBoundingClientRect();
    return Boolean(valueBox && valueBox.left >= cardBox.left && valueBox.right <= cardBox.right);
  });
  expect(readoutValueFits).toBe(true);
  const forceHandle = page.getByRole("button", { name: /v̂ vector tip/ });
  await forceHandle.focus();
  await page.keyboard.press("Shift+ArrowLeft");
  await page.getByRole("button", { name: /Maximum agreement/ }).click();
  await page.getByRole("button", { name: /Perpendicular/ }).click();
  await page.getByRole("button", { name: /Maximum opposition/ }).click();
  await expect(page.getByText(/Positive, zero, and negative regions tested/)).toBeVisible();
  await page.getByRole("button", { name: /Formalise and calculate/ }).click();

  const promptBox = await page.locator(".world-practice-prompt").boundingBox();
  const workBox = await page.locator(".world-practice-work").boundingBox();
  if ((page.viewportSize()?.width ?? 0) > 700 && promptBox && workBox) {
    expect(promptBox.x).toBeLessThan(workBox.x);
    expect(Math.abs(promptBox.y + promptBox.height / 2 - (workBox.y + workBox.height / 2))).toBeLessThan(2);
  }

  await page.getByLabel("Faded example answer").fill("2");
  await page.locator("#faded-challenge").getByRole("button", { name: "Check" }).click();
  await page.getByLabel("First matched product").fill("8");
  await page.getByLabel("Second matched product").fill("-3");
  await page.getByLabel("Net dot product").fill("5");
  await page.getByRole("button", { name: "Check all three values" }).click();
  await page.getByRole("button", { name: "Check all three values" }).click();
  await expect(page.getByText(/Diagnostic detour · signed arithmetic/)).toBeVisible();
  await page.getByLabel(/First contribution/).fill("-10");
  await page.getByLabel(/Net:/).fill("2");
  await page.getByRole("button", { name: /Return to my exact move/ }).click();
  await expect(page.locator("#independent-challenge")).toBeFocused();
  await expect(page.getByLabel("First matched product")).toHaveValue("8");
  await page.getByLabel("First matched product").fill("-8");
  await page.getByLabel("Net dot product").fill("-11");
  await page.getByRole("button", { name: "Check all three values" }).click();
  await expect(page.getByText(/Completed with cue/)).toBeVisible();
  await page.getByLabel("Geometry horizontal component").fill("3");
  await page.getByLabel("Geometry vertical component").fill("-2");
  await page.getByRole("button", { name: /Check component translation/ }).click();
  await page.getByLabel(/negative component contributions dominate/).check();
  await page.getByLabel(/what does a negative dot product/i).fill("The net opposing direction gives a negative signed projection along the reference vector.");
  await page.getByRole("button", { name: "Check reasoning" }).click();
  await page.getByRole("button", { name: /Practise AI normalisation/ }).click();

  const normalisationModel = await page.locator(".world-normalisation-model").boundingBox();
  const normalisationWork = await page.locator(".world-normalisation-work").boundingBox();
  if ((page.viewportSize()?.width ?? 0) > 960 && normalisationModel && normalisationWork) {
    expect(Math.abs(normalisationModel.y - normalisationWork.y)).toBeLessThan(2);
    expect(normalisationWork.width).toBeGreaterThan(normalisationModel.width);
  }

  await page.getByLabel("Normalised x component").fill("0.6");
  await page.getByLabel("Normalised y component").fill("0.8");
  await page.getByLabel(/Magnitude, so/).check();
  await page.getByRole("button", { name: "Check normalisation" }).click();
  await page.getByRole("button", { name: /Transfer to portfolio return/ }).click();

  await page.getByRole("button", { name: /ready to translate/ }).click();
  await page.getByLabel("Asset A contribution").fill("0.04");
  await page.getByLabel("Asset B contribution").fill("-0.004");
  await page.getByLabel("Portfolio return").fill("0.036");
  await page.getByLabel(/weighted realised return/).check();
  await page.getByRole("button", { name: "Check transfer" }).click();
  await page.getByRole("button", { name: /Open the Atlas/ }).click();
  await expect(page.getByLabel(/Eight connected mathematical territories/)).toBeVisible();
  await page.getByRole("button", { name: /Projection, open Studio/ }).click();
  await page.getByLabel("Projection signed length").fill("3");
  await page.getByLabel("Projection x component").fill("3");
  await page.getByLabel("Projection y component").fill("0");
  await page.getByRole("button", { name: "Check projection" }).click();
  await expect(page.getByText(/Projection evidence recorded/)).toBeVisible();
  await page.getByRole("button", { name: /Return to the Atlas/ }).click();
  await expect(page.getByText(/Retrieval scheduled for/)).toBeVisible();

  await page.evaluate(() => {
    const key = "mathland.world.v3";
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
});

test("tour is optional, reopenable, and horizon changes alter the Studio case", async ({ page }) => {
  await page.getByRole("button", { name: /optional workshop tour first/ }).click();
  await expect(page.getByText(/move 1 of 6/i)).toBeVisible();
  const tourWorkbenchBefore = await page.locator(".world-tour-workbench").boundingBox();
  await page.getByRole("button", { name: /predict the sign/i }).click();
  const tourWorkbenchAfter = await page.locator(".world-tour-workbench").boundingBox();
  if (tourWorkbenchBefore && tourWorkbenchAfter) {
    expect(Math.abs(tourWorkbenchAfter.height - tourWorkbenchBefore.height)).toBeLessThan(2);
  }
  await page.getByRole("button", { name: /Skip tour/ }).click();
  await page.getByRole("button", { name: "Help & tour" }).click();
  await expect(page.getByText(/move 1 of 6/i)).toBeVisible();
  await page.getByRole("button", { name: /Skip tour/ }).click();
  await page.getByRole("button", { name: /Horizon Understand physical systems/ }).click();
  await page.getByRole("button", { name: /Understand intelligent systems/ }).click();
  await expect(page.getByRole("button", { name: /Horizon Understand intelligent systems/ })).toBeVisible();
  await completeNoticing(page);
  await expect(page.getByRole("heading", { name: /Direction agreement between embeddings/ }).first()).toBeVisible();
  await expect(page.getByLabel("û x component")).toHaveValue("0.8");
});

test("production world is accessible at 320px, keeps the object in view, and does not overflow horizontally", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 768 });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  const goalPanel = await page.locator(".world-goal-panel").boundingBox();
  expect(goalPanel?.y).toBeLessThan(768);
  await enterObservatory(page);
  await completeNoticing(page);
  const stage = page.locator(".world-vector-stage");
  await expect(stage).toBeVisible();
  const box = await stage.boundingBox();
  expect(box?.y).toBeLessThan(768);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);

  await page.getByRole("button", { name: "Atlas", exact: true }).click();
  const atlasNodesFit = await page.locator(".world-map").evaluate((map) => {
    const mapBox = map.getBoundingClientRect();
    return Array.from(map.querySelectorAll(".world-node")).every((node) => {
      const nodeBox = node.getBoundingClientRect();
      return nodeBox.left >= mapBox.left - .5 && nodeBox.right <= mapBox.right + .5
        && nodeBox.top >= mapBox.top && nodeBox.bottom <= mapBox.bottom;
    });
  });
  expect(atlasNodesFit).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
});

test("Observatory comparison bands align and choices remain inside each case card", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await enterObservatory(page);
  const comparisonBandsAlign = await page.locator(".world-case-card").evaluateAll((cards) => {
    const selectors = [
      ".world-local-label",
      "h2",
      ":scope > p:not(.world-local-label)",
      ".world-case-noticing",
      ".world-case-formula",
    ];
    return selectors.every((selector) => {
      const tops = cards.map((card) => card.querySelector(selector)?.getBoundingClientRect().top ?? 0);
      return Math.max(...tops) - Math.min(...tops) < 1;
    });
  });
  expect(comparisonBandsAlign).toBe(true);
  const choicesFit = await page.locator(".world-case-card").evaluateAll((cards) => cards.every((card) => {
    const cardBox = card.getBoundingClientRect();
    return Array.from(card.querySelectorAll(".world-case-noticing label")).every((label) => {
      const labelBox = label.getBoundingClientRect();
      return labelBox.left >= cardBox.left && labelBox.right <= cardBox.right;
    });
  }));
  expect(choicesFit).toBe(true);
});

test("touch-style pointer release and reduced motion preserve the complete state change", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await enterObservatory(page);
  await completeNoticing(page);
  const handle = page.getByRole("button", { name: /F vector tip/ });
  const box = await handle.boundingBox();
  if (!box) throw new Error("Vector handle has no bounding box");
  const cdp = await page.context().newCDPSession(page);
  const start = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [start] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: start.x - 30, y: start.y }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect(handle).not.toHaveAttribute("aria-label", /3 horizontally and 2 vertically/);
  await page.getByRole("button", { name: /Maximum opposition/ }).click();
  await expect(page.getByText(/Negative directional overlap/).first()).toBeVisible();
  await expect(page.locator(".world-vector-handle-b")).toHaveCSS("transition-duration", "0s");
});
