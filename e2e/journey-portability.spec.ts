import fs from "node:fs/promises";
import { expect, test } from "@playwright/test";

test("a downloaded journey restores into a fresh browser and rejects an invalid replacement", async ({ page, browser, baseURL }) => {
  await page.goto("/");
  await page.getByRole("radio", { name: /Understand intelligent systems/ }).click();
  await page.getByRole("button", { name: /Set this horizon/ }).click();
  await page.getByLabel(/Energy transferred along the motion/).check();
  await page.getByLabel(/Direction similarity after normalisation/).check();
  await page.getByLabel(/Weighted realised return/).check();
  await page.getByRole("button", { name: "It becomes negative" }).click();
  await page.getByRole("button", { name: /Test the claim in the Studio/ }).click();
  await page.getByRole("button", { name: /Maximum opposition/ }).click();
  await page.getByRole("button", { name: "Data", exact: true }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download journey data" }).click();
  const downloaded = await downloadPromise;
  const file = await downloaded.path();
  if (!file) throw new Error("Journey export was not downloaded");
  const exported = JSON.parse(await fs.readFile(file, "utf8"));
  expect(exported.snapshot.evidence.length).toBeGreaterThan(0);

  // A separate context has no access to the source browser's local state.
  const freshContext = await browser.newContext({ baseURL });
  try {
    const target = await freshContext.newPage();
    await target.goto("/");
    await expect(target.getByRole("heading", { name: /A force, a meaning, a return/ })).toBeVisible();
    await target.getByRole("button", { name: "Data", exact: true }).click();
    await target.getByLabel("Restore journey file").setInputFiles(file);
    await expect(target.getByRole("dialog").getByRole("status")).toContainText("Journey restored");
    await target.getByRole("button", { name: "Done", exact: true }).click();
    await expect(target.getByRole("heading", { name: /Direction agreement between embeddings/ }).first()).toBeVisible();
    await expect(target.getByRole("button", { name: /Horizon Understand intelligent systems/ })).toBeVisible();
    const restored = await target.evaluate(() => JSON.parse(localStorage.getItem("mathland.world.v3") ?? "{}"));
    expect(restored.evidence).toEqual(exported.snapshot.evidence);
    expect(restored.studio).toEqual(exported.snapshot.studio);
    await target.reload();
    await expect(target.getByRole("heading", { name: /Direction agreement between embeddings/ }).first()).toBeVisible();
    await target.getByRole("button", { name: "Data", exact: true }).click();
    await target.getByLabel("Restore journey file").setInputFiles({ name: "invalid.json", mimeType: "application/json", buffer: Buffer.from("{}") });
    await expect(target.getByRole("dialog").getByRole("status")).toContainText("not a supported Mathland journey export");
    await target.getByRole("button", { name: "Done", exact: true }).click();
    await expect(target.getByRole("heading", { name: /Direction agreement between embeddings/ }).first()).toBeVisible();
  } finally {
    await freshContext.close();
  }
});
