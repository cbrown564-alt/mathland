import voiceData from "./characterVoices.json";

/**
 * ElevenLabs voice registry for Mathland's characters.
 *
 * The account already holds a generated voice per character; `characterVoices.json`
 * maps our internal character id to its ElevenLabs voice id plus the synthesis
 * settings that suit that character's delivery. Both the app and the
 * `scripts/generate-narration.mjs` generator read that JSON, so there is a
 * single source of truth for "who sounds like what".
 *
 * Add a character by dropping its voice id into the JSON — find one by searching
 * the account through the ElevenLabs API (`GET /v1/voices`).
 */

export interface CharacterVoice {
  voiceId: string;
  /** Human label, for logs / tooling. */
  label: string;
  /** Per-voice synthesis settings (ElevenLabs voice_settings). */
  settings: {
    stability: number;
    similarity_boost: number;
    style: number;
    use_speaker_boost: boolean;
  };
}

/** Default TTS model. multilingual_v2 is high-quality and broadly available. */
export const NARRATION_MODEL_ID: string = voiceData.modelId;

export const characterVoices: Record<string, CharacterVoice> = voiceData.voices as Record<
  string,
  CharacterVoice
>;

export function getCharacterVoice(characterId: string | undefined): CharacterVoice | null {
  if (!characterId) return null;
  return characterVoices[characterId] ?? null;
}
