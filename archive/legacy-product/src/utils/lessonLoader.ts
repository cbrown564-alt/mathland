import { LessonData } from "@/core/types/lesson";

interface ModuleIndex {
  moduleId: number;
  moduleTitle: string;
  lessons: string[];
  lessonCount: number;
}

// Cache for loaded lessons
const lessonCache = new Map<string, LessonData>();
const moduleIndexCache = new Map<string, ModuleIndex>();

/**
 * Load a specific lesson from JSON
 */
export async function loadLesson(moduleId: string, lessonId: string): Promise<LessonData | null> {
  const cacheKey = `${moduleId}.${lessonId}`;
  
  // Check cache first
  if (lessonCache.has(cacheKey)) {
    return lessonCache.get(cacheKey)!;
  }

  try {
    // Dynamically import the lesson JSON
    const lessonModule = await import(`../content/lessons/module${moduleId}/lesson-${lessonId}.json`);
    const lessonData = lessonModule.default as LessonData;
    
    // Cache the result
    lessonCache.set(cacheKey, lessonData);
    
    return lessonData;
  } catch (error) {
    console.error(`Failed to load lesson ${cacheKey}:`, error);
    return null;
  }
}

/**
 * Load module index to get list of lessons
 */
export async function loadModuleIndex(moduleId: string): Promise<ModuleIndex | null> {
  // Check cache first
  if (moduleIndexCache.has(moduleId)) {
    return moduleIndexCache.get(moduleId)!;
  }

  try {
    const indexModule = await import(`../content/lessons/module${moduleId}/index.json`);
    const index = indexModule.default as ModuleIndex;
    
    // Cache the result
    moduleIndexCache.set(moduleId, index);
    
    return index;
  } catch (error) {
    console.error(`Failed to load module ${moduleId} index:`, error);
    return null;
  }
}

/**
 * Load all lessons for a module
 */
export async function loadModuleLessons(moduleId: string): Promise<{ [key: string]: LessonData }> {
  const index = await loadModuleIndex(moduleId);
  if (!index) {
    return {};
  }

  const lessons: { [key: string]: LessonData } = {};
  
  // Load all lessons in parallel
  const loadPromises = index.lessons.map(async (lessonId) => {
    const lesson = await loadLesson(moduleId, lessonId);
    if (lesson) {
      lessons[lessonId] = lesson;
    }
  });

  await Promise.all(loadPromises);
  
  return lessons;
}

/**
 * Get lesson order for a module
 */
export async function getLessonOrderForModule(moduleId: string): Promise<string[]> {
  const index = await loadModuleIndex(moduleId);
  return index ? index.lessons : [];
}

/**
 * Get a specific lesson
 */
export async function getLessonDataForModule(moduleId: string, lessonId: string): Promise<LessonData | undefined> {
  const lesson = await loadLesson(moduleId, lessonId);
  return lesson || undefined;
}

/**
 * Preload all modules (useful for initial app load)
 */
export async function preloadAllModules(): Promise<void> {
  const moduleIds = Array.from({ length: 10 }, (_, i) => (i + 1).toString());
  
  await Promise.all(
    moduleIds.map(moduleId => loadModuleIndex(moduleId))
  );
}

/**
 * Clear caches (useful for development)
 */
export function clearLessonCache(): void {
  lessonCache.clear();
  moduleIndexCache.clear();
}
