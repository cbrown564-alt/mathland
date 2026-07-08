import { BeatFlow } from "@/core/components/narrative/BeatFlow";
import { LessonStage } from "@/core/components/narrative/LessonStage";
import { VectorVisual, VectorState } from "@/core/components/narrative/VectorVisual";
import { dotProductBeats } from "@/content/beats/lesson-2.3";

/**
 * Reference for the full v2 flow (/lab/flow): lesson 2.3 as a sequence of beats,
 * one at a time, with a route across the top. This is the blend, end to end.
 */
const FlowLabPage = () => (
  <LessonStage characterId="vera">
    <BeatFlow
      lessonId="2.3"
      label="Vera · The Dot Product"
      beats={dotProductBeats}
      renderVisual={(s: VectorState) => <VectorVisual state={s} />}
      exitTo="/lesson/2.3"
    />
  </LessonStage>
);

export default FlowLabPage;
