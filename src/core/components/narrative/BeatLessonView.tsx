import { useCallback, useState } from "react";
import { BeatFlow } from "./BeatFlow";
import { ColdOpen } from "./ColdOpen";
import { LessonStage } from "./LessonStage";
import type { BeatLesson } from "@/content/beats/schema";

const coldOpenStorageKey = (lessonId: string) => `story-cold-open-${lessonId}`;

function isColdOpenDismissed(lessonId: string): boolean {
  try {
    return sessionStorage.getItem(coldOpenStorageKey(lessonId)) === "dismissed";
  } catch {
    return false;
  }
}

/**
 * Renders a whole authored lesson: the immersive stage (character-tinted) plus
 * the beat sequencer. This is the single entry point the /story route uses, so
 * shipping a new lesson is purely a matter of authoring a BeatLesson.
 */
export function BeatLessonView<S>({ lesson }: { lesson: BeatLesson<S> }) {
  const [showColdOpen, setShowColdOpen] = useState(() => !isColdOpenDismissed(lesson.meta.id));

  const handleBegin = useCallback(() => {
    try {
      sessionStorage.setItem(coldOpenStorageKey(lesson.meta.id), "dismissed");
    } catch {
      // sessionStorage unavailable — still proceed
    }
    setShowColdOpen(false);
  }, [lesson.meta.id]);

  return (
    <LessonStage characterId={lesson.meta.characterId}>
      {showColdOpen ? (
        <ColdOpen meta={lesson.meta} onBegin={handleBegin} />
      ) : (
        <BeatFlow lesson={lesson} />
      )}
    </LessonStage>
  );
}

export default BeatLessonView;
