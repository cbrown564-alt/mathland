#!/usr/bin/env node
/**
 * Vera voice bake-off: render the SAME line with several candidate voices so
 * they can be compared side by side.
 *
 *   - ElevenLabs Voice Design (create-previews): 4 freshly-designed candidates.
 *   - Google Gemini native TTS (flash preview): 2 prebuilt voices.
 *
 * Outputs audio + a manifest to public/audio/bakeoff/vera/. Reads
 * ELEVENLABS_API_KEY and GEMINI_API_KEY from .env.
 *
 *   node scripts/voice-bakeoff.mjs
 */

import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_DIR = resolve(ROOT, "public/audio/bakeoff/vera");
const OUT_URL = "/audio/bakeoff/vera";

function loadEnv() {
  const p = resolve(ROOT, ".env");
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

// The shared line every candidate speaks (Vera, ~11s). 100–1000 chars for EL.
const SHARED_TEXT =
  "Okay, picture this — you and I are both out hiking, but in different directions. How much do our two paths actually agree? That's exactly what the dot product measures. Think of it as a little friendship meter for directions!";

// --- ElevenLabs voice design ----------------------------------------------
const EL_DESCRIPTIONS = [
  "A bright, cheerful young woman in her late twenties with warm, adventurous energy — an enthusiastic outdoor guide who genuinely loves explaining things. Upbeat, clear American accent, expressive and encouraging, never flat or monotone.",
  "A warm, playful female mentor, mid-twenties, gently animated and curious, with a light inviting tone and a spark of wonder — a friendly nature-documentary explorer who makes you smile while she teaches.",
];

async function elCreatePreviews(apiKey, description) {
  const res = await fetch(
    "https://api.elevenlabs.io/v1/text-to-voice/create-previews?output_format=mp3_44100_128",
    {
      method: "POST",
      headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ voice_description: description, text: SHARED_TEXT }),
    }
  );
  if (!res.ok) throw new Error(`EL create-previews ${res.status}: ${await res.text().catch(() => "")}`);
  const j = await res.json();
  return j.previews || [];
}

async function runElevenLabs(apiKey, manifest) {
  console.log("\n🎙  ElevenLabs — Voice Design (4 candidates)");
  let n = 0;
  for (let d = 0; d < EL_DESCRIPTIONS.length; d++) {
    let previews = [];
    try {
      previews = await elCreatePreviews(apiKey, EL_DESCRIPTIONS[d]);
    } catch (e) {
      console.log(`  ✗ design prompt ${d + 1} failed: ${e.message}`);
      continue;
    }
    for (const p of previews.slice(0, 2)) {
      n++;
      const b64 = p.audio_base_64 || p.audio || "";
      if (!b64) continue;
      const file = `el-${n}.mp3`;
      writeFileSync(resolve(OUT_DIR, file), Buffer.from(b64, "base64"));
      manifest.push({
        id: `el-${n}`,
        engine: "ElevenLabs",
        model: "Voice Design",
        label: `ElevenLabs · design ${n}`,
        note: d === 0 ? "adventurous outdoor guide" : "playful curious mentor",
        generatedVoiceId: p.generated_voice_id || null,
        file: `${OUT_URL}/${file}`,
        mime: "audio/mpeg",
      });
      console.log(`  ✓ el-${n}.mp3  (voice ${p.generated_voice_id || "?"})`);
    }
  }
  return n;
}

// --- Gemini native TTS -----------------------------------------------------
function pcmToWav(pcm, sampleRate = 24000, channels = 1, bits = 16) {
  const byteRate = (sampleRate * channels * bits) / 8;
  const blockAlign = (channels * bits) / 8;
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bits, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

async function findGeminiTtsModel(apiKey) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  if (!res.ok) throw new Error(`Gemini models.list ${res.status}: ${await res.text().catch(() => "")}`);
  const j = await res.json();
  const tts = (j.models || []).filter(
    (m) => /tts/i.test(m.name) && (m.supportedGenerationMethods || []).includes("generateContent")
  );
  // Prefer a flash preview TTS model.
  const flash = tts.find((m) => /flash/i.test(m.name));
  return (flash || tts[0])?.name?.replace(/^models\//, "") || null;
}

async function geminiTts(apiKey, model, voiceName) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Say in a bright, warm, adventurous tone: ${SHARED_TEXT}` }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } },
        },
      }),
    }
  );
  if (!res.ok) throw new Error(`Gemini generateContent ${res.status}: ${await res.text().catch(() => "")}`);
  const j = await res.json();
  const part = j.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part) throw new Error(`Gemini returned no audio: ${JSON.stringify(j).slice(0, 300)}`);
  const rate = parseInt((part.inlineData.mimeType.match(/rate=(\d+)/) || [])[1] || "24000", 10);
  return { pcm: Buffer.from(part.inlineData.data, "base64"), rate };
}

async function runGemini(apiKey, manifest) {
  console.log("\n🎙  Gemini — native TTS");
  let model;
  try {
    model = await findGeminiTtsModel(apiKey);
  } catch (e) {
    console.log(`  ✗ ${e.message}`);
    return;
  }
  if (!model) {
    console.log("  ✗ no TTS-capable Gemini model found for this key");
    return;
  }
  console.log(`  model: ${model}`);
  const voices = [
    { voiceName: "Leda", note: "youthful" },
    { voiceName: "Zephyr", note: "bright" },
  ];
  for (const v of voices) {
    try {
      const { pcm, rate } = await geminiTts(apiKey, model, v.voiceName);
      const file = `gemini-${v.voiceName.toLowerCase()}.wav`;
      writeFileSync(resolve(OUT_DIR, file), pcmToWav(pcm, rate));
      manifest.push({
        id: `gemini-${v.voiceName.toLowerCase()}`,
        engine: "Gemini",
        model,
        label: `Gemini · ${v.voiceName}`,
        note: v.note,
        file: `${OUT_URL}/${file}`,
        mime: "audio/wav",
      });
      console.log(`  ✓ ${file}  (${(pcm.length / 1024).toFixed(0)} KB pcm @ ${rate}Hz)`);
    } catch (e) {
      console.log(`  ✗ ${v.voiceName}: ${e.message}`);
    }
  }
}

async function main() {
  loadEnv();
  mkdirSync(OUT_DIR, { recursive: true });
  const manifest = [];

  const elKey = process.env.ELEVENLABS_API_KEY;
  const gemKey = process.env.GEMINI_API_KEY;

  if (elKey) await runElevenLabs(elKey, manifest);
  else console.log("⚠ no ELEVENLABS_API_KEY — skipping ElevenLabs");

  if (gemKey) await runGemini(gemKey, manifest);
  else console.log("⚠ no GEMINI_API_KEY — skipping Gemini");

  manifest.unshift({ sharedText: SHARED_TEXT });
  writeFileSync(resolve(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`\n✅ ${manifest.length - 1} samples → ${OUT_URL}/  (manifest.json written)\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
