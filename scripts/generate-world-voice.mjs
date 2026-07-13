#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const loadEnv = () => {
  const path = resolve(root, ".env");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (!match || match[1] in process.env) continue;
    process.env[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
  }
};

const main = async () => {
  loadEnv();
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY is not configured");

  const media = JSON.parse(readFileSync(resolve(root, "src/world/media/veraProjection.json"), "utf8"));
  const registry = JSON.parse(readFileSync(resolve(root, "src/utils/characterVoices.json"), "utf8"));
  const voice = registry.voices[media.characterId];
  if (!voice) throw new Error(`No registered ElevenLabs voice for ${media.characterId}`);

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice.voiceId}?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "xi-api-key": apiKey, "Content-Type": "application/json", Accept: "audio/mpeg" },
    body: JSON.stringify({ text: media.transcript, model_id: registry.modelId, voice_settings: voice.settings }),
  });
  if (!response.ok) throw new Error(`ElevenLabs returned ${response.status}: ${await response.text()}`);

  const output = resolve(root, "public", media.audioSrc.replace(/^\//, ""));
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, Buffer.from(await response.arrayBuffer()));
  console.log(`Generated ${media.audioSrc} with ${voice.label}`);
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
