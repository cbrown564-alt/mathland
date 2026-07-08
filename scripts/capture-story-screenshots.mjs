/**
 * Capture story mode polish screenshots for review.
 * Run: node scripts/capture-story-screenshots.mjs
 */
import puppeteer from "puppeteer";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.BASE_URL ?? "http://localhost:8080";
const OUT = path.resolve("/opt/cursor/artifacts/screenshots");
const LESSON = "/story/2.7";
const VIEWPORT = { width: 1400, height: 900 };

async function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function shot(page, name) {
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log("saved", file);
  return file;
}

async function main() {
  await mkdir(OUT, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1400,900"],
  });

  try {
    // ── 1. Cold open (fresh session) ──
    const coldCtx = await browser.createBrowserContext();
    const coldPage = await coldCtx.newPage();
    await coldPage.setViewport(VIEWPORT);
    await coldPage.goto(`${BASE}${LESSON}`, { waitUntil: "networkidle2", timeout: 60000 });
    await wait(1200);
    await shot(coldPage, "01-cold-open");

    // Begin expedition
    const beginBtn = await coldPage.$("button");
    if (beginBtn) {
      await beginBtn.click();
      await wait(800);
    }
    await shot(coldPage, "02-wayfinding-beat1");

    // ── 2. Predict block ──
    const predictYes = await coldPage.evaluateHandle(() => {
      const buttons = [...document.querySelectorAll("button")];
      return buttons.find((b) => b.textContent?.includes("Yes — if it has redundant"));
    });
    if (predictYes) {
      const el = predictYes.asElement();
      if (el) await el.click();
      await wait(600);
    }
    await shot(coldPage, "03-predict-with-voice-nudge");

    // ── 3. Coupled reading (scroll to activate passage 2) ──
    await coldPage.evaluate(() => window.scrollTo({ top: 400, behavior: "instant" }));
    await wait(500);
    await shot(coldPage, "04-coupled-reading-active");

    // ── 4. Advance through beats ──
    const clickContinue = async () => {
      const clicked = await coldPage.evaluate(() => {
        const buttons = [...document.querySelectorAll("button")];
        const btn =
          buttons.find((b) => /continue/i.test(b.textContent ?? "")) ??
          buttons.find((b) => /finish the lesson/i.test(b.textContent ?? ""));
        if (!btn || (btn instanceof HTMLButtonElement && btn.disabled)) return false;
        btn.click();
        return true;
      });
      if (clicked) await wait(900);
      return clicked;
    };

    // Answer check if visible
    await coldPage.evaluate(() => {
      const buttons = [...document.querySelectorAll("button")];
      const opt = buttons.find((b) =>
        b.textContent?.includes("linearly independent and span"),
      );
      if (opt) opt.click();
    });
    await wait(400);
    await coldPage.evaluate(() => {
      const buttons = [...document.querySelectorAll("button")];
      const submit = buttons.find((b) => /check answer|submit|continue/i.test(b.textContent ?? ""));
      if (submit) submit.click();
    });

    await clickContinue();
    await shot(coldPage, "05-beat2-wayfinding");

    await coldPage.evaluate(() => window.scrollTo({ top: 300, behavior: "instant" }));
    await wait(500);
    await shot(coldPage, "06-beat2-coupled");

    // Advance to recap
    await clickContinue();
    await wait(400);
    const recapContinue = await clickContinue();
    if (recapContinue) await wait(600);
    await shot(coldPage, "07-recap-or-beat3");

    // Advance to do beat
    await clickContinue();
    await wait(800);
    await shot(coldPage, "08-climax-do-beat");

    // ── 5. Completion modal (inject finished state) ──
    const doneCtx = await browser.createBrowserContext();
    const donePage = await doneCtx.newPage();
    await donePage.setViewport(VIEWPORT);
    await donePage.goto(`${BASE}${LESSON}`, { waitUntil: "networkidle2", timeout: 60000 });
    await donePage.evaluate(() => {
      sessionStorage.setItem("story-cold-open-2.7", "dismissed");
      localStorage.setItem(
        "lesson-progress-2.7",
        JSON.stringify({
          completedSections: [],
          currentSection: "narrative",
          beatIndex: 3,
          lessonCompleted: true,
        }),
      );
    });
    await donePage.reload({ waitUntil: "networkidle2" });
    await wait(1000);
    await shot(donePage, "11-completion-modal");
    await doneCtx.close();

    // ── 6. Mobile coupled reading ──
    const mobileCtx = await browser.createBrowserContext();
    const mobilePage = await mobileCtx.newPage();
    await mobilePage.setViewport({ width: 390, height: 844 });
    await mobilePage.goto(`${BASE}${LESSON}`, { waitUntil: "networkidle2", timeout: 60000 });
    // Skip cold open on mobile demo — begin if shown
    const mobBegin = await mobilePage.$("button");
    if (mobBegin) {
      const text = await mobilePage.evaluate((el) => el.textContent, mobBegin);
      if (text?.includes("expedition")) {
        await mobBegin.click();
        await wait(800);
      }
    }
    await mobilePage.evaluate(() => window.scrollTo({ top: 200, behavior: "instant" }));
    await wait(500);
    await shot(mobilePage, "10-mobile-coupled-with-pill");

    await mobileCtx.close();
    await coldCtx.close();
  } finally {
    await browser.close();
  }

  console.log("\nAll screenshots saved to", OUT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
