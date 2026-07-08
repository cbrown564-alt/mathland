import { useState, useEffect, useCallback } from 'react';

export interface LessonProgress {
  completedSections: Set<string>;
  currentSection: string;
}

export interface LessonProgressActions {
  updateProgress: (completedSections: Set<string>, currentSection: string) => void;
  toggleSection: (sectionId: string) => void;
  completeSection: (sectionId: string) => void;
  setCurrentSection: (sectionId: string) => void;
  isLessonCompleted: (totalSections: number) => boolean;
  getCompletionPercentage: (totalSections: number) => number;
}

const DEFAULT_SECTIONS = [
  "narrative", "read", "see", "hear", "do", "memory", "concept", "realworld"
];

const getStoredProgress = (lessonId: string): LessonProgress => {
  if (typeof window === 'undefined') {
    return { completedSections: new Set<string>(), currentSection: "narrative" };
  }
  
  const stored = localStorage.getItem(`lesson-progress-${lessonId}`);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return {
        completedSections: new Set<string>((parsed.completedSections || []) as string[]),
        currentSection: parsed.currentSection || "narrative"
      };
    } catch (error) {
      console.warn(`Failed to parse stored progress for lesson ${lessonId}:`, error);
    }
  }
  
  return { completedSections: new Set<string>(), currentSection: "narrative" };
};

const storeProgress = (lessonId: string, completedSections: Set<string>, currentSection: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(`lesson-progress-${lessonId}`, JSON.stringify({
      completedSections: Array.from(completedSections),
      currentSection
    }));
    
    // Dispatch a custom event for cross-component updates
    window.dispatchEvent(new CustomEvent('lessonProgressUpdate', {
      detail: { lessonId, completedSections: Array.from(completedSections), currentSection }
    }));
  } catch (error) {
    console.warn(`Failed to store progress for lesson ${lessonId}:`, error);
  }
};

function areSetsEqual(a: Set<string>, b: Set<string>) {
  if (a.size !== b.size) return false;
  for (const item of a) if (!b.has(item)) return false;
  return true;
}

export const useLessonProgress = (lessonId: string): LessonProgress & LessonProgressActions => {
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [currentSection, setCurrentSectionState] = useState<string>("narrative");

  // Load progress when lesson changes
  useEffect(() => {
    const stored = getStoredProgress(lessonId);
    setCompletedSections(stored.completedSections);
    setCurrentSectionState(stored.currentSection);
  }, [lessonId]);

  // Store progress whenever it changes
  useEffect(() => {
    storeProgress(lessonId, completedSections, currentSection);
  }, [lessonId, completedSections, currentSection]);

  // Listen for progress updates from other components/tabs
  useEffect(() => {
    const handleProgressUpdate = (event: CustomEvent) => {
      if (event.detail.lessonId === lessonId) {
        const newCompleted = new Set<string>(event.detail.completedSections);
        if (
          !areSetsEqual(newCompleted, completedSections) ||
          event.detail.currentSection !== currentSection
        ) {
          setCompletedSections(newCompleted);
        setCurrentSectionState(event.detail.currentSection);
        }
      }
    };

    window.addEventListener('lessonProgressUpdate', handleProgressUpdate as EventListener);
    window.addEventListener('storage', () => {
      // Reload from localStorage on storage change (cross-tab sync)
      const stored = getStoredProgress(lessonId);
      setCompletedSections(stored.completedSections);
      setCurrentSectionState(stored.currentSection);
    });

    return () => {
      window.removeEventListener('lessonProgressUpdate', handleProgressUpdate as EventListener);
      window.removeEventListener('storage', () => {});
    };
  }, [lessonId, completedSections, currentSection]);

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

  const isLessonCompleted = useCallback((totalSections: number = DEFAULT_SECTIONS.length) => {
    return completedSections.size >= totalSections;
  }, [completedSections.size]);

  const getCompletionPercentage = useCallback((totalSections: number = DEFAULT_SECTIONS.length) => {
    return Math.min((completedSections.size / totalSections) * 100, 100);
  }, [completedSections.size]);

  return {
    completedSections,
    currentSection,
    updateProgress,
    toggleSection,
    completeSection,
    setCurrentSection,
    isLessonCompleted,
    getCompletionPercentage
  };
};

// Utility function for components that only need to read progress without subscribing to changes
export const getLessonProgress = (lessonId: string): LessonProgress => {
  return getStoredProgress(lessonId);
};

// Utility function to check if a lesson is completed
export const isLessonCompleted = (lessonId: string, totalSections: number = DEFAULT_SECTIONS.length): boolean => {
  const progress = getStoredProgress(lessonId);
  return progress.completedSections.size >= totalSections;
};

// Utility function to get completion percentage
export const getLessonCompletionPercentage = (lessonId: string, totalSections: number = DEFAULT_SECTIONS.length): number => {
  const progress = getStoredProgress(lessonId);
  return Math.min((progress.completedSections.size / totalSections) * 100, 100);
};