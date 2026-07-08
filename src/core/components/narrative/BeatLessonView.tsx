import { BeatLesson } from "./LessonBeat";
import { BeatFlow } from "./BeatFlow";
import { LessonStage } from "./LessonStage";

/**
 * Renders a whole authored lesson: the immersive stage (character-tinted) plus
 * the beat sequencer. This is the single entry point the /story route uses, so
 * shipping a new lesson is purely a matter of authoring a BeatLesson.
 */
export function BeatLessonView<S>({ lesson }: { lesson: BeatLesson<S> }) {
  return (
    <LessonStage characterId={lesson.characterId}>
      <BeatFlow
        lessonId={lesson.lessonId}
        label={lesson.label}
        beats={lesson.beats}
        renderVisual={lesson.renderVisual}
        exitTo={lesson.exitTo ?? `/lesson/${lesson.lessonId}`}
      />
    </LessonStage>
  );
}

export default BeatLessonView;
