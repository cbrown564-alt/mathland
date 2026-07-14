import { BeatFlow } from "./BeatFlow";
import { LessonStage } from "./LessonStage";
import type { BeatLesson } from "@/content/beats/schema";

/**
 * Renders a whole authored lesson: the immersive stage (character-tinted) plus
 * the beat sequencer. This is the single entry point the /story route uses, so
 * shipping a new lesson is purely a matter of authoring a BeatLesson.
 */
export function BeatLessonView<S>({ lesson }: { lesson: BeatLesson<S> }) {
  return (
    <LessonStage characterId={lesson.meta.characterId}>
      <BeatFlow lesson={lesson} />
    </LessonStage>
  );
}

export default BeatLessonView;
