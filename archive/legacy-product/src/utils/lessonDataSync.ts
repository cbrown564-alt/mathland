import { LessonData } from "@/core/types/lesson";

// This file provides a synchronous interface for backward compatibility
// It requires pre-loading the data before use

// Storage for pre-loaded lesson data
const preloadedModules: { [moduleId: string]: { [lessonId: string]: LessonData } } = {};

/**
 * Pre-load all lesson data (call this during app initialization)
 */
export async function preloadLessonData(): Promise<void> {
  const { loadModuleLessons } = await import('./lessonLoader');
  
  // Load all modules in parallel
  const loadPromises = Array.from({ length: 10 }, async (_, i) => {
    const moduleId = i.toString();
    const lessons = await loadModuleLessons(moduleId);
    if (Object.keys(lessons).length > 0) {
      preloadedModules[moduleId] = lessons;
    }
  });

  await Promise.all(loadPromises);
}

/**
 * Get all lessons for a module (synchronous)
 */
export function getModuleLessonsSync(moduleId: string): { [lessonId: string]: LessonData } {
  return preloadedModules[moduleId] || {};
}

/**
 * Get lesson order for a module (synchronous)
 */
export function getLessonOrderForModuleSync(moduleId: string): string[] {
  const lessons = preloadedModules[moduleId];
  return lessons ? Object.keys(lessons).sort() : [];
}

/**
 * Get a specific lesson (synchronous)
 */
export function getLessonDataForModuleSync(moduleId: string, lessonId: string): LessonData | undefined {
  return preloadedModules[moduleId]?.[lessonId];
}

/**
 * Export all module lessons for backward compatibility
 */
export const allModuleLessons = preloadedModules;