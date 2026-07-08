/**
 * Beat-lesson authoring schema — the single import surface for writing a lesson.
 *
 * A lesson author writes one file (`lesson-<id>.tsx`) exporting a `BeatLesson`,
 * then registers it in `index.ts`. Everything else (the immersive stage, the
 * beat sequencer, the coupling, audio chips, the climax) is generic and driven
 * by this data. See README.md and docs/LESSON_V2_DESIGN.md §3.
 */
import type { ComponentType, ReactNode } from "react";
import type { InteractiveProps } from "@/core/components/narrative/interactives";

/** Keys into the shared visual primitive library (§5). */
export type VisualKey = "vectorPlot";

/** Hybrid visual binding: library primitive (preferred) or bespoke render escape hatch. */
export type VisualBinding<S> =
  | { key: VisualKey }
  | { render: (state: S) => ReactNode };

export interface Passage<S> {
  id: string;
  eyebrow?: string;
  /** Markdown + $katex$ (see §4). */
  md: string;
  /** @deprecated Legacy JSX body — migrate to `md`. */
  body?: ReactNode;
  /** Diagram target; omit to hold the previous state (text-only aside). */
  state?: S;
  audioSrc?: string;
}

export interface Predict {
  prompt: string;
  options: { label: string; value: string }[];
  nudge?: Record<string, string>;
}

export interface Check {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface BeatBase {
  id: string;
  eyebrow?: string;
  title?: string;
}

/** Predict → coupled reading → check. */
export interface CoupleBeat<S> extends BeatBase {
  kind: "couple";
  predict?: Predict;
  passages: Passage<S>[];
  check?: Check;
  visual?: VisualBinding<S>;
  interpolate?: (a: S, b: S, t: number) => S;
}

/** Finale: draggable interactive with goal-gated completion. */
export interface DoBeat extends BeatBase {
  kind: "do";
  predict?: Predict;
  intro?: string;
  interactive: string;
  goals?: { tone: string; label: string }[];
}

/** Full-width prose — no coupled picture. */
export interface TellBeat extends BeatBase {
  kind: "tell";
  md: string;
  figure?: ReactNode;
  check?: Check;
}

/** In-flow mantra card (landing card uses lesson.landing on completion). */
export interface RecapBeat extends BeatBase {
  kind: "recap";
  mantra: string;
  points?: string[];
}

export type Beat<S> = CoupleBeat<S> | DoBeat | TellBeat | RecapBeat;

export interface BeatLesson<S> {
  meta: {
    id: string;
    characterId: string;
    title: string;
    oneLine: string;
    objectives?: string[];
  };
  visual: VisualBinding<S>;
  beats: Beat<S>[];
  landing: {
    mantra: string;
    recap?: string;
    playgroundTo?: string;
  };
  /** Where exit and completion screen point back to. Defaults to /lesson/:id. */
  exitTo?: string;
}

/** Registered visual primitive (§5) — see primitives/index.ts for implementations. */
export interface VisualPrimitive<S> {
  ReadOnly: ComponentType<{ state: S }>;
  Climax: ComponentType<InteractiveProps>;
  interpolate?: (a: S, b: S, t: number) => S;
}

/** @deprecated Use Predict */
export type PredictPrompt = Predict;
/** @deprecated Use Check */
export type BeatCheck = Check;
/** @deprecated Use Passage */
export type CoupledPassage<S> = Passage<S>;
/** @deprecated Use DoBeat fields directly */
export type ClimaxSpec = Pick<DoBeat, "interactive" | "intro" | "goals">;
/** @deprecated Use Beat */
export type BeatData<S> = Beat<S>;
