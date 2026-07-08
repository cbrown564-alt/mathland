import { BeatLesson } from "./schema";
import { normalizeBeatLesson } from "./normalize";
import { dotProductLesson } from "./lesson-2.3";
import { vectorBasicsLesson } from "./lesson-2.1";
import { vectorAdditionLesson } from "./lesson-2.2";
import { vectorNormsLesson } from "./lesson-2.4";
import { linearCombinationsLesson } from "./lesson-2.5";
import { linearIndependenceLesson } from "./lesson-2.6";
import { basisDimensionLesson } from "./lesson-2.7";
import { vectorSpacesLesson } from "./lesson-2.8";
import { forestCapstoneLesson } from "./lesson-2.9";

/**
 * Registry of beat-based v2 lessons, keyed by lesson id. The /story/:lessonId
 * route looks a lesson up here and renders it generically — so adding a lesson
 * is: author `lesson-<id>.tsx`, then add one line below.
 *
 * The per-lesson state type is erased at this boundary (each lesson is internally
 * consistent — its beats' states match its renderVisual); authoring stays fully
 * typed inside each lesson file.
 */
const LESSONS: Record<string, BeatLesson<unknown>> = {
  "2.1": vectorBasicsLesson as unknown as BeatLesson<unknown>,
  "2.2": vectorAdditionLesson as unknown as BeatLesson<unknown>,
  "2.3": dotProductLesson as unknown as BeatLesson<unknown>,
  "2.4": vectorNormsLesson as unknown as BeatLesson<unknown>,
  "2.5": linearCombinationsLesson as unknown as BeatLesson<unknown>,
  "2.6": linearIndependenceLesson as unknown as BeatLesson<unknown>,
  "2.7": basisDimensionLesson as unknown as BeatLesson<unknown>,
  "2.8": vectorSpacesLesson as unknown as BeatLesson<unknown>,
  "2.9": forestCapstoneLesson as unknown as BeatLesson<unknown>,
};

export function getBeatLesson(lessonId: string | undefined): BeatLesson<unknown> | null {
  const raw = lessonId ? LESSONS[lessonId] ?? null : null;
  return raw ? normalizeBeatLesson(raw) : null;
}

export function hasBeatLesson(lessonId: string | undefined): boolean {
  return Boolean(lessonId && LESSONS[lessonId]);
}
