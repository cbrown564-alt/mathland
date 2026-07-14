import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("root production route loads the world without legacy initialisation", async ({ page }) => {
  await expect(page.getByRole("heading", { name: /A force, a meaning, a return/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Set this horizon/ })).toBeEnabled();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("retired lesson and prototype links redirect into the production world", async ({ page }) => {
  for (const route of ["/lesson/2.3", "/story/2.3", "/prototype/one-operation-three-worlds"]) {
    await page.goto(route);
    await expect(page).toHaveURL(/\/?from=/);
    await expect(page.getByText(/Your old route has retired/)).toBeVisible();
  }
});

test("privacy, support, and health surfaces are available", async ({ page, request }) => {
  await page.goto("/privacy");
  await expect(page.getByRole("heading", { name: /Privacy follows the learning evidence/ })).toBeVisible();
  await page.goto("/support");
  await expect(page.getByRole("link", { name: "hello@mathland.com" })).toBeVisible();
  const health = await request.get("/health.json");
  expect(health.ok()).toBe(true);
  expect(await health.json()).toMatchObject({ service: "mathland-web", status: "ok" });
});

test("journey data controls expose export, restore, consent, and deletion", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Data", exact: true }).click();
  await expect(page.getByRole("heading", { name: /Your journey is local/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "Download journey data" })).toBeVisible();
  await expect(page.getByText("Restore journey file")).toBeVisible();
  const consent = page.getByRole("checkbox", { name: /Share minimised product diagnostics/ });
  await consent.check();
  await expect(page.getByText(/Anonymous product diagnostics are enabled/)).toBeVisible();
});
