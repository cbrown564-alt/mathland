/**
 * Beat-lesson authoring schema — the single import surface for writing a lesson.
 *
 * A lesson author writes one file (`lesson-<id>.tsx`) exporting a `BeatLesson`,
 * then registers it in `index.ts`. Everything else (the immersive stage, the
 * beat sequencer, the coupling, audio chips, the climax) is generic and driven
 * by this data. See README.md.
 */
export type {
  BeatLesson,
  BeatData,
  PredictPrompt,
  BeatCheck,
  ClimaxSpec,
} from "@/core/components/narrative/LessonBeat";
export type { CoupledPassage } from "@/core/components/narrative/CoupledVisual";
