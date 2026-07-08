import { LessonStory } from "@/core/types/story";
import story23 from "./story-2.3.json";

/**
 * Registry of authored guided-narrative stories, keyed by lesson id. Only
 * lessons that have been re-authored as a paced story appear here; everything
 * else falls back to the section-form lesson at /lesson/:id.
 */
const STORIES: Record<string, LessonStory> = {
  "2.3": story23 as LessonStory,
};

export function getStory(lessonId: string | undefined): LessonStory | null {
  if (!lessonId) return null;
  return STORIES[lessonId] ?? null;
}

export function hasStory(lessonId: string | undefined): boolean {
  return Boolean(lessonId && STORIES[lessonId]);
}
