import type { ReactNode } from "react";
import type { Beat, BeatLesson, CoupleBeat, DoBeat, Passage } from "./schema";

/** Legacy lesson shape (pre–schema refactor). */
interface LegacyBeatLesson<S> {
  lessonId: string;
  characterId: string;
  label: string;
  exitTo?: string;
  renderVisual: (state: S) => ReactNode;
  beats: LegacyBeat<S>[];
  landing?: BeatLesson<S>["landing"];
  playgroundTo?: string;
}

interface LegacyPassage<S> {
  id: string;
  eyebrow?: string;
  body?: ReactNode;
  md?: string;
  state?: S;
  audioSrc?: string;
}

interface LegacyBeat<S> {
  id: string;
  eyebrow?: string;
  title?: ReactNode | string;
  kind?: Beat<S>["kind"];
  predict?: CoupleBeat<S>["predict"];
  passages?: LegacyPassage<S>[];
  interpolate?: CoupleBeat<S>["interpolate"];
  check?: CoupleBeat<S>["check"];
  visual?: CoupleBeat<S>["visual"];
  climax?: {
    interactive: string;
    intro?: ReactNode | string;
    goals?: DoBeat["goals"];
  };
  interactive?: string;
  intro?: string;
  md?: string;
  mantra?: string;
  points?: string[];
}

function isLegacyLesson<S>(lesson: BeatLesson<S> | LegacyBeatLesson<S>): lesson is LegacyBeatLesson<S> {
  return !("meta" in lesson) && "lessonId" in lesson;
}

function normalizePassage<S>(p: LegacyPassage<S>): Passage<S> & { body?: ReactNode } {
  return {
    id: p.id,
    eyebrow: p.eyebrow,
    md: p.md ?? "",
    state: p.state,
    audioSrc: p.audioSrc,
    ...(p.body !== undefined ? { body: p.body } : {}),
  };
}

function normalizeBeat<S>(beat: LegacyBeat<S>): Beat<S> {
  if (beat.kind) return beat as Beat<S>;

  if (beat.climax || beat.interactive) {
    const spec = beat.climax ?? { interactive: beat.interactive! };
    return {
      kind: "do",
      id: beat.id,
      eyebrow: beat.eyebrow,
      title: typeof beat.title === "string" ? beat.title : undefined,
      predict: beat.predict,
      interactive: spec.interactive,
      intro: typeof spec.intro === "string" ? spec.intro : typeof beat.intro === "string" ? beat.intro : undefined,
      goals: spec.goals,
    };
  }

  if (beat.mantra) {
    return {
      kind: "recap",
      id: beat.id,
      eyebrow: beat.eyebrow,
      title: typeof beat.title === "string" ? beat.title : undefined,
      mantra: beat.mantra,
      points: beat.points,
    };
  }

  if (beat.md) {
    return {
      kind: "tell",
      id: beat.id,
      eyebrow: beat.eyebrow,
      title: typeof beat.title === "string" ? beat.title : undefined,
      md: beat.md,
      check: beat.check,
    };
  }

  return {
    kind: "couple",
    id: beat.id,
    eyebrow: beat.eyebrow,
    title: typeof beat.title === "string" ? beat.title : undefined,
    predict: beat.predict,
    passages: (beat.passages ?? []).map(normalizePassage),
    check: beat.check,
    visual: beat.visual,
    interpolate: beat.interpolate,
  };
}

/** Normalize legacy BeatLesson exports until all Module 2 lessons migrate to §3 schema. */
export function normalizeBeatLesson<S>(lesson: BeatLesson<S> | LegacyBeatLesson<S>): BeatLesson<S> {
  if (!isLegacyLesson(lesson)) return lesson;

  const title = lesson.label.includes(" · ")
    ? lesson.label.split(" · ").slice(1).join(" · ")
    : lesson.label;

  return {
    meta: {
      id: lesson.lessonId,
      characterId: lesson.characterId,
      title,
      oneLine: "",
    },
    visual: { render: lesson.renderVisual },
    beats: lesson.beats.map(normalizeBeat),
    landing: lesson.landing ?? {
      mantra: "Lesson complete.",
      playgroundTo: lesson.playgroundTo,
    },
    exitTo: lesson.exitTo,
  };
}
