import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { LessonBeat } from "./LessonBeat";
import { WayfindingBar } from "./WayfindingBar";
import { useLessonProgress } from "@/core/hooks/useLessonProgress";
import { characters } from "@/utils/characterData";
import type { BeatLesson } from "@/content/beats/schema";

/**
 * BeatFlow — sequences beats one at a time (Flow C's skeleton).
 *
 * Renders the current beat, advances on its onComplete, and shows orbital
 * wayfinding across the top. Progress (furthest beat + completion) is
 * persisted via useLessonProgress so v2 and v1 share one completion model.
 */

const TRANSITION_EASE = [0.16, 1, 0.3, 1] as const;
const TRANSITION_DURATION = 0.42;

interface BeatFlowProps<S> {
  lesson: BeatLesson<S>;
}

function lessonHeaderLabel(lesson: BeatLesson<unknown>): string {
  const char = characters.find((c) => c.id === lesson.meta.characterId);
  const name = char?.name.split(" ")[0] ?? lesson.meta.characterId;
  return `${name} · ${lesson.meta.title}`;
}

const beatVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 60 : -60,
    rotateY: direction > 0 ? -8 : 8,
    scale: 0.92,
    filter: "blur(4px)",
  }),
  center: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -60 : 60,
    rotateY: direction > 0 ? 8 : -8,
    scale: 0.92,
    filter: "blur(4px)",
  }),
};

export function BeatFlow<S>({ lesson }: BeatFlowProps<S>) {
  const lessonId = lesson.meta.id;
  const total = lesson.beats.length;
  const exitTo = lesson.exitTo ?? `/lesson/${lessonId}`;
  const label = lessonHeaderLabel(lesson as BeatLesson<unknown>);
  const character = characters.find((c) => c.id === lesson.meta.characterId);
  const characterIcon = character?.icon ?? "✦";

  const {
    beatIndex,
    lessonCompleted,
    setBeatIndex,
    markLessonComplete,
    resetBeatProgress,
  } = useLessonProgress(lessonId);

  const [index, setIndex] = useState(() => Math.min(beatIndex, total - 1));
  const [finished, setFinished] = useState(lessonCompleted);
  const [direction, setDirection] = useState(1);
  const furthest = useRef(index);
  const prevIndexRef = useRef(index);

  useEffect(() => {
    setIndex(Math.min(beatIndex, total - 1));
    setFinished(lessonCompleted);
  }, [lessonId, beatIndex, lessonCompleted, total]);

  useEffect(() => {
    setDirection(index >= prevIndexRef.current ? 1 : -1);
    prevIndexRef.current = index;
    if (index > furthest.current) furthest.current = index;
    setBeatIndex(furthest.current);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [index, setBeatIndex]);

  const goToBeat = useCallback((i: number) => {
    if (i <= furthest.current) setIndex(i);
  }, []);

  const next = useCallback(() => {
    setIndex((i) => {
      if (i >= total - 1) {
        setFinished(true);
        markLessonComplete();
        return i;
      }
      return i + 1;
    });
  }, [total, markLessonComplete]);

  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);

  const restart = useCallback(() => {
    setFinished(false);
    setIndex(0);
    furthest.current = 0;
    resetBeatProgress();
  }, [resetBeatProgress]);

  const beat = lesson.beats[index];

  return (
    <>
      <WayfindingBar
        beats={lesson.beats}
        currentIndex={index}
        onSelectBeat={goToBeat}
        exitTo={exitTo}
        onRestart={restart}
      />

      <main className="px-5 pb-40 pt-14">
        <p className="mx-auto mb-2 max-w-5xl font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
          {label}
        </p>
        {lesson.meta.oneLine && (
          <p className="mx-auto mb-10 max-w-5xl font-serif text-sm italic text-white/45">{lesson.meta.oneLine}</p>
        )}

        <div className="mx-auto max-w-5xl" style={{ perspective: 800 }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={beat.id}
              custom={direction}
              variants={beatVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: TRANSITION_DURATION, ease: TRANSITION_EASE }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <LessonBeat
                beat={beat}
                lessonVisual={lesson.visual}
                characterId={lesson.meta.characterId}
                onComplete={next}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {index > 0 && (
          <div className="mx-auto mt-12 flex max-w-5xl">
            <button
              type="button"
              onClick={prev}
              className="flex items-center gap-1.5 text-sm text-white/45 transition hover:text-white/85"
            >
              <ArrowLeft className="h-4 w-4" /> Previous beat
            </button>
          </div>
        )}
      </main>

      <AnimatePresence>
        {finished && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-5"
            style={{ background: "rgba(10,7,20,0.85)", backdropFilter: "blur(6px)" }}
          >
            <motion.div
              initial={{ scale: 0.94, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: TRANSITION_EASE }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-xl"
            >
              <div
                className="pointer-events-none absolute inset-0"
                aria-hidden
                style={{
                  background:
                    "radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--ch-accent) 35%, transparent), transparent 60%)",
                }}
              />

              <motion.div
                className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full text-[1.75rem]"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, ease: TRANSITION_EASE, delay: 0.1 }}
                style={{
                  background: "linear-gradient(135deg, var(--ch-accent), var(--ch-accent-2))",
                  boxShadow: "0 0 40px color-mix(in srgb, var(--ch-accent) 35%, transparent)",
                }}
                aria-hidden
              >
                {characterIcon}
              </motion.div>

              <p className="relative mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                Lesson complete
              </p>
              <h2 className="relative mb-4 font-serif text-[1.75rem] leading-snug text-white">{lesson.meta.title}</h2>
              <p className="relative mb-6 font-serif text-lg italic leading-relaxed text-white/55">
                &ldquo;{lesson.landing.mantra}&rdquo;
              </p>
              {lesson.landing.recap && (
                <p className="relative mb-6 text-sm leading-relaxed text-white/50">{lesson.landing.recap}</p>
              )}

              <div className="relative flex flex-col gap-2">
                {lesson.landing.playgroundTo && (
                  <Link
                    to={lesson.landing.playgroundTo}
                    className="v2-cta w-full rounded-full px-5 py-3 text-sm font-semibold text-white transition active:scale-95"
                  >
                    Open the playground →
                  </Link>
                )}
                <button
                  type="button"
                  onClick={restart}
                  className="w-full rounded-full border border-white/15 px-5 py-3 text-sm text-white/80 transition hover:bg-white/5"
                >
                  Replay the lesson
                </button>
                <Link
                  to={exitTo}
                  className="w-full rounded-full px-5 py-3 text-sm text-white/40 transition hover:bg-white/[0.03] hover:text-white/70"
                >
                  Exit
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default BeatFlow;
