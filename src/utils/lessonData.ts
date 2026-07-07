import { LessonData } from "@/core/types/lesson";
import {
  loadModuleLessons,
  getLessonOrderForModule as getLessonOrderAsync,
  getLessonDataForModule as getLessonDataAsync,
} from "./lessonLoader";

// This module provides backward compatibility for existing code
// It maintains the same interface but uses the new JSON-based system

// Cache for loaded modules
const moduleCache: { [moduleId: string]: { [lessonId: string]: LessonData } } = {};
let isInitialized = false;

// Initialize all modules on first access
async function ensureInitialized() {
  if (!isInitialized) {
    await initializeAllModules();
    isInitialized = true;
  }
}

// Load all modules into cache
async function initializeAllModules() {
  const loadPromises = Array.from({ length: 10 }, async (_, i) => {
    const moduleId = i.toString();
    try {
      const lessons = await loadModuleLessons(moduleId);
      if (Object.keys(lessons).length > 0) {
        moduleCache[moduleId] = lessons;
      }
    } catch (error) {
      console.warn(`Failed to load module ${moduleId}:`, error);
    }
  });

  await Promise.all(loadPromises);
}

// Synchronous interface for backward compatibility
// Note: These require calling ensureInitialized() first

export const allModuleLessons: { [moduleId: string]: { [lessonId: string]: LessonData } } = new Proxy({}, {
  get(_target, moduleId: string) {
    if (!isInitialized) {
      console.warn('Lesson data accessed before initialization. Call ensureInitialized() first.');
      return {};
    }
    return moduleCache[moduleId] || {};
  }
});

export function getLessonOrderForModule(moduleId: string): string[] {
  if (!isInitialized) {
    console.warn('Lesson data accessed before initialization. Call ensureInitialized() first.');
    return [];
  }
  const lessons = moduleCache[moduleId];
  return lessons ? Object.keys(lessons).sort() : [];
}

export function getLessonDataForModule(moduleId: string, lessonId: string): LessonData | undefined {
  if (!isInitialized) {
    console.warn('Lesson data accessed before initialization. Call ensureInitialized() first.');
    return undefined;
  }
  return moduleCache[moduleId]?.[lessonId];
}

// Async versions that don't require initialization
export async function getLessonOrderForModuleAsync(moduleId: string): Promise<string[]> {
  return getLessonOrderAsync(moduleId);
}

export async function getLessonDataForModuleAsync(moduleId: string, lessonId: string): Promise<LessonData | undefined> {
  return getLessonDataAsync(moduleId, lessonId);
}

// Export initialization function
export { ensureInitialized };

// Auto-initialize in development
if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
  ensureInitialized().catch(console.error);
}

// Deprecated: old per-module functions (to be removed after migration)
// export const getLessonOrder = ...
// export const getLessonData = ...
// export const getModule1LessonOrder = ...
// export const getModule1LessonData = ...
// export const getModule2LessonOrder = ...
// export const getModule2LessonData = ...