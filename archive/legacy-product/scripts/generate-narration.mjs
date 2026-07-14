#!/usr/bin/env node
/**
 * Generate character narration audio for a guided-narrative story via ElevenLabs.
 *
 * Reads the story script (src/content/stories/story-<id>.json) and the shared
 * voice registry (src/utils/characterVoices.json), then synthesizes one MP3 per
 * chapter into public/<audioSrc>. This is how Phase C audio is (re)produced — the
 * story JSON is the single source of truth for both the spoken text and where the
 * clip lands, so re-running keeps app + assets in sync.
 *
 * Usage:
 *   node scripts/generate-narration.mjs 2.3            # generate missing clips
 *   node scripts/generate-narration.mjs 2.3 --force    # regenerate all
 *   node scripts/generate-narration.mjs 2.3 --only ch1,ch4
 *
 * Requires ELEVENLABS_API_KEY in .env (needs text_to_speech permission).
 */

import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// --- tiny .env loader (avoids a dotenv dependency) -------------------------
function loadEnv() {
  const envPath = resolve(ROOT, ".env");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim().replace(/^["']|["']$/g, "");
    if (!(key in process.env)) process.env[key] = val;
  }
}

function parseArgs(argv) {
  const args = { lessonId: undefined, force: false, only: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--force") args.force = true;
    else if (a === "--only") args.only = (argv[++i] || "").split(",").map((s) => s.trim()).filter(Boolean);
    else if (!a.startsWith("--")) args.lessonId = a;
  }
  return args;
}

async function main() {
  loadEnv();
  const { lessonId = "2.3", force, only } = parseArgs(process.argv.slice(2));

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error("✗ ELEVENLABS_API_KEY not found in .env");
    process.exit(1);
  }

  const storyPath = resolve(ROOT, `src/content/stories/story-${lessonId}.json`);
  if (!existsSync(storyPath)) {
    console.error(`✗ No story script at ${storyPath}`);
    process.exit(1);
  }
  const story = JSON.parse(readFileSync(storyPath, "utf8"));
  const voices = JSON.parse(readFileSync(resolve(ROOT, "src/utils/characterVoices.json"), "utf8"));

  const voice = voices.voices[story.characterId];
  if (!voice) {
    console.error(`✗ No voice registered for character "${story.characterId}" in characterVoices.json`);
    process.exit(1);
  }
  const modelId = voices.modelId || "eleven_multilingual_v2";

  console.log(`\n🎙  ${story.title} (lesson ${story.lessonId}) — ${voice.label} · ${modelId}\n`);

  let generated = 0;
  let skipped = 0;
  for (const ch of story.chapters) {
    if (!ch.audioSrc || !ch.narration) continue;
    if (only && !only.includes(ch.id)) continue;

    const outPath = resolve(ROOT, "public", ch.audioSrc.replace(/^\//, ""));
    if (existsSync(outPath) && !force) {
      console.log(`  ↷ ${ch.id.padEnd(8)} exists — skipping (use --force to regenerate)`);
      skipped++;
      continue;
    }

    process.stdout.write(`  ⋯ ${ch.id.padEnd(8)} synthesizing… `);
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice.voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text: ch.narration,
          model_id: modelId,
          voice_settings: voice.settings,
        }),
      }
    );

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.log("✗");
      console.error(`\n✗ ElevenLabs error (${res.status}) on chapter "${ch.id}":\n${detail}\n`);
      process.exit(1);
    }

    const buf = Buffer.from(await res.arrayBuffer());
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, buf);
    console.log(`✓ ${(buf.length / 1024).toFixed(0)} KB → ${ch.audioSrc}`);
    generated++;
  }

  console.log(`\n✅ Done — ${generated} generated, ${skipped} skipped.\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
