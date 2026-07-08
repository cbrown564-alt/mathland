import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();
  const forceIntro = searchParams.get("intro") === "1";

  const initialShowColdOpen = useMemo(
    () => forceIntro || !isColdOpenDismissed(lesson.meta.id),
    // Only evaluate on mount / lesson change — not when searchParams flicker
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lesson.meta.id, forceIntro],
  );

  const [showColdOpen, setShowColdOpen] = useState(initialShowColdOpen);

  const handleBegin = useCallback(() => {
    if (!forceIntro) {
      try {
        sessionStorage.setItem(coldOpenStorageKey(lesson.meta.id), "dismissed");
      } catch {
        // sessionStorage unavailable — still proceed
      }
    }
    setShowColdOpen(false);
  }, [lesson.meta.id, forceIntro]);

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
