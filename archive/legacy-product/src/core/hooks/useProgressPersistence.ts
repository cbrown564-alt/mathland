import * as React from "react";

interface ProgressData {
  completedSections: Set<string>;
  currentSection: string;
}

// Simple localStorage utility for progress persistence
const getStoredProgress = (lessonId: string): ProgressData => {
  if (typeof window === 'undefined') return { completedSections: new Set<string>(), currentSection: "narrative" };
  const stored = localStorage.getItem(`lesson-progress-${lessonId}`);
  if (stored) {
    const parsed = JSON.parse(stored);
    return {
      completedSections: new Set<string>((parsed.completedSections || []) as string[]),
      currentSection: parsed.currentSection || "narrative"
    };
  }
  return { completedSections: new Set<string>(), currentSection: "narrative" };
};

const storeProgress = (lessonId: string, completedSections: Set<string>, currentSection: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`lesson-progress-${lessonId}`, JSON.stringify({
    completedSections: Array.from(completedSections),
    currentSection
  }));
};

export const useProgressPersistence = (lessonId: string, sections: { id: string; title: string }[]) => {
  const [completedSections, setCompletedSections] = React.useState<Set<string>>(new Set());
  const [currentSection, setCurrentSection] = React.useState<string>("narrative");

  // Load progress when lesson changes
  React.useEffect(() => {
    const stored = getStoredProgress(lessonId);
    setCompletedSections(stored.completedSections);
    setCurrentSection(stored.currentSection);
  }, [lessonId]);

  // Store progress whenever it changes
  React.useEffect(() => {
    storeProgress(lessonId, completedSections, currentSection);
  }, [lessonId, completedSections, currentSection]);

  const toggleSection = (sectionId: string) => {
    const newCompleted = new Set(completedSections);
    if (newCompleted.has(sectionId)) {
      newCompleted.delete(sectionId);
    } else {
      newCompleted.add(sectionId);
    }
    setCompletedSections(newCompleted);
  };

  const handleSectionComplete = (sectionId: string) => {
    const newCompleted = new Set(completedSections);
    newCompleted.add(sectionId);
    setCompletedSections(newCompleted);
    
    // Auto-advance to next section
    const currentIndex = sections.findIndex(s => s.id === sectionId);
    if (currentIndex < sections.length - 1) {
      setCurrentSection(sections[currentIndex + 1].id);
    }
  };

  const handleNextSection = () => {
    const currentIndex = sections.findIndex(s => s.id === currentSection);
    if (currentIndex < sections.length - 1) {
      setCurrentSection(sections[currentIndex + 1].id);
    }
  };

  const progressPercentage = Math.min((completedSections.size / sections.length) * 100, 100);
  const currentSectionIndex = sections.findIndex(s => s.id === currentSection);
  const isLastSection = currentSectionIndex === sections.length - 1;

  return {
    completedSections,
    currentSection,
    setCurrentSection,
    toggleSection,
    handleSectionComplete,
    handleNextSection,
    progressPercentage,
    isLastSection
  };
};