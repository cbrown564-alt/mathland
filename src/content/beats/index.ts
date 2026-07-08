import { BeatLesson } from "./schema";
import { dotProductLesson } from "./lesson-2.3";

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
  "2.3": dotProductLesson as unknown as BeatLesson<unknown>,
};

export function getBeatLesson(lessonId: string | undefined): BeatLesson<unknown> | null {
  return lessonId ? LESSONS[lessonId] ?? null : null;
}

export function hasBeatLesson(lessonId: string | undefined): boolean {
  return Boolean(lessonId && LESSONS[lessonId]);
}
