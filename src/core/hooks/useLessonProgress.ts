import { useState, useEffect, useCallback } from 'react';

export interface LessonProgress {
  completedSections: Set<string>;
  currentSection: string;
  /** Furthest beat index reached in a v2 lesson (0-based). */
  beatIndex?: number;
  /** Set when a v2 lesson finishes its last beat. */
  lessonCompleted?: boolean;
}

export interface LessonProgressActions {
  updateProgress: (completedSections: Set<string>, currentSection: string) => void;
  toggleSection: (sectionId: string) => void;
  completeSection: (sectionId: string) => void;
  setCurrentSection: (sectionId: string) => void;
  isLessonCompleted: (totalSections?: number) => boolean;
  getCompletionPercentage: (totalSections?: number) => number;
  setBeatIndex: (index: number) => void;
  markLessonComplete: () => void;
  resetBeatProgress: () => void;
}

const DEFAULT_SECTIONS = [
  "narrative", "read", "see", "hear", "do", "memory", "concept", "realworld"
];

interface StoredProgress {
  completedSections?: string[];
  currentSection?: string;
  beatIndex?: number;
  lessonCompleted?: boolean;
}

/** One-time migration from the prototype beatflow-* key. */
function migrateBeatflowProgress(lessonId: string): Partial<LessonProgress> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`beatflow-${lessonId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { furthest?: number; done?: boolean };
    localStorage.removeItem(`beatflow-${lessonId}`);
    return {
      beatIndex: parsed.furthest ?? 0,
      lessonCompleted: parsed.done ?? false,
    };
  } catch {
    return null;
  }
}

const getStoredProgress = (lessonId: string): LessonProgress => {
  if (typeof window === 'undefined') {
    return { completedSections: new Set<string>(), currentSection: "narrative" };
  }

  const stored = localStorage.getItem(`lesson-progress-${lessonId}`);
  let parsed: StoredProgress = {};
  if (stored) {
    try {
      parsed = JSON.parse(stored);
    } catch (error) {
      console.warn(`Failed to parse stored progress for lesson ${lessonId}:`, error);
    }
  }

  const migrated = migrateBeatflowProgress(lessonId);
  if (migrated) {
    const merged: StoredProgress = { ...parsed, ...migrated };
    storeProgressRaw(lessonId, merged);
    parsed = merged;
  }

  return {
    completedSections: new Set<string>((parsed.completedSections || []) as string[]),
    currentSection: parsed.currentSection || "narrative",
    beatIndex: parsed.beatIndex,
    lessonCompleted: parsed.lessonCompleted,
  };
};

const storeProgressRaw = (lessonId: string, data: StoredProgress): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`lesson-progress-${lessonId}`, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('lessonProgressUpdate', {
      detail: {
        lessonId,
        completedSections: data.completedSections ?? [],
        currentSection: data.currentSection ?? "narrative",
        beatIndex: data.beatIndex,
        lessonCompleted: data.lessonCompleted,
      }
    }));
  } catch (error) {
    console.warn(`Failed to store progress for lesson ${lessonId}:`, error);
  }
};

const storeProgress = (
  lessonId: string,
  completedSections: Set<string>,
  currentSection: string,
  beatIndex?: number,
  lessonCompleted?: boolean,
): void => {
  storeProgressRaw(lessonId, {
    completedSections: Array.from(completedSections),
    currentSection,
    beatIndex,
    lessonCompleted,
  });
};

function areSetsEqual(a: Set<string>, b: Set<string>) {
  if (a.size !== b.size) return false;
  for (const item of a) if (!b.has(item)) return false;
  return true;
}

export const useLessonProgress = (lessonId: string): LessonProgress & LessonProgressActions => {
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [currentSection, setCurrentSectionState] = useState<string>("narrative");
  const [beatIndex, setBeatIndexState] = useState<number>(0);
  const [lessonCompleted, setLessonCompletedState] = useState<boolean>(false);
  const [hydratedLessonId, setHydratedLessonId] = useState<string | null>(null);

  useEffect(() => {
    const stored = getStoredProgress(lessonId);
    setCompletedSections(stored.completedSections);
    setCurrentSectionState(stored.currentSection);
    setBeatIndexState(stored.beatIndex ?? 0);
    setLessonCompletedState(stored.lessonCompleted ?? false);
    setHydratedLessonId(lessonId);
  }, [lessonId]);

  useEffect(() => {
    if (hydratedLessonId !== lessonId) return;
    storeProgress(lessonId, completedSections, currentSection, beatIndex, lessonCompleted);
  }, [lessonId, hydratedLessonId, completedSections, currentSection, beatIndex, lessonCompleted]);

  useEffect(() => {
    const handleProgressUpdate = (event: CustomEvent) => {
      if (event.detail.lessonId === lessonId) {
        const newCompleted = new Set<string>(event.detail.completedSections);
        const newBeatIndex = event.detail.beatIndex as number | undefined;
        const newLessonCompleted = event.detail.lessonCompleted as boolean | undefined;
        if (
          !areSetsEqual(newCompleted, completedSections) ||
          event.detail.currentSection !== currentSection ||
          (newBeatIndex !== undefined && newBeatIndex !== beatIndex) ||
          (newLessonCompleted !== undefined && newLessonCompleted !== lessonCompleted)
        ) {
          setCompletedSections(newCompleted);
          setCurrentSectionState(event.detail.currentSection);
          if (newBeatIndex !== undefined) setBeatIndexState(newBeatIndex);
          if (newLessonCompleted !== undefined) setLessonCompletedState(newLessonCompleted);
        }
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key && event.key !== `lesson-progress-${lessonId}`) return;
      const stored = getStoredProgress(lessonId);
      setCompletedSections(stored.completedSections);
      setCurrentSectionState(stored.currentSection);
      setBeatIndexState(stored.beatIndex ?? 0);
      setLessonCompletedState(stored.lessonCompleted ?? false);
    };

    window.addEventListener('lessonProgressUpdate', handleProgressUpdate as EventListener);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('lessonProgressUpdate', handleProgressUpdate as EventListener);
      window.removeEventListener('storage', handleStorage);
    };
  }, [lessonId, completedSections, currentSection, beatIndex, lessonCompleted]);

  const updateProgress = useCallback((newCompletedSections: Set<string>, newCurrentSection: string) => {
    setCompletedSections(newCompletedSections);
    setCurrentSectionState(newCurrentSection);
  }, []);

  const toggleSection = useCallback((sectionId: string) => {
    setCompletedSections(prev => {
      const newCompleted = new Set(prev);
      if (newCompleted.has(sectionId)) {
        newCompleted.delete(sectionId);
      } else {
        newCompleted.add(sectionId);
      }
      return newCompleted;
    });
  }, []);

  const completeSection = useCallback((sectionId: string) => {
    setCompletedSections(prev => {
      const newCompleted = new Set(prev);
      newCompleted.add(sectionId);
      return newCompleted;
    });
  }, []);

  const setCurrentSection = useCallback((sectionId: string) => {
    setCurrentSectionState(sectionId);
  }, []);

  const setBeatIndex = useCallback((index: number) => {
    setBeatIndexState((prev) => Math.max(prev, index));
  }, []);

  const markLessonComplete = useCallback(() => {
    setLessonCompletedState(true);
  }, []);

  const resetBeatProgress = useCallback(() => {
    setBeatIndexState(0);
    setLessonCompletedState(false);
  }, []);

  const isLessonCompleted = useCallback((totalSections: number = DEFAULT_SECTIONS.length) => {
    if (lessonCompleted) return true;
    return completedSections.size >= totalSections;
  }, [lessonCompleted, completedSections.size]);

  const getCompletionPercentage = useCallback((totalSections: number = DEFAULT_SECTIONS.length) => {
    if (lessonCompleted) return 100;
    return Math.min((completedSections.size / totalSections) * 100, 100);
  }, [lessonCompleted, completedSections.size]);

  return {
    completedSections,
    currentSection,
    beatIndex,
    lessonCompleted,
    updateProgress,
    toggleSection,
    completeSection,
    setCurrentSection,
    isLessonCompleted,
    getCompletionPercentage,
    setBeatIndex,
    markLessonComplete,
    resetBeatProgress,
  };
};

export const getLessonProgress = (lessonId: string): LessonProgress => {
  return getStoredProgress(lessonId);
};

export const isLessonCompleted = (lessonId: string, totalSections: number = DEFAULT_SECTIONS.length): boolean => {
  const progress = getStoredProgress(lessonId);
  if (progress.lessonCompleted) return true;
  return progress.completedSections.size >= totalSections;
};

export const getLessonCompletionPercentage = (lessonId: string, totalSections: number = DEFAULT_SECTIONS.length): number => {
  const progress = getStoredProgress(lessonId);
  if (progress.lessonCompleted) return 100;
  return Math.min((progress.completedSections.size / totalSections) * 100, 100);
};
