import { BeatFlow } from "@/core/components/narrative/BeatFlow";
import { VectorVisual, VectorState } from "@/core/components/narrative/VectorVisual";
import { dotProductBeats } from "@/content/beats/lesson-2.3";

/**
 * Reference for the full v2 flow (/lab/flow): lesson 2.3 as a sequence of beats,
 * one at a time, with a route across the top. The climax playground is linked on
 * completion (built next). This is the blend, end to end at the lesson level.
 */
const FlowLabPage = () => (
  <div
    data-character="vera"
    className="min-h-screen text-white"
    style={{ background: "linear-gradient(180deg, #0f0a1a 0%, #1a1030 100%)" }}
  >
    <BeatFlow
      lessonId="2.3"
      label="Vera · The Dot Product"
      beats={dotProductBeats}
      renderVisual={(s: VectorState) => <VectorVisual state={s} />}
      exitTo="/lesson/2.3"
    />
  </div>
);

export default FlowLabPage;
