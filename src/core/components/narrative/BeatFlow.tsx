import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Compass, RotateCcw, X } from "lucide-react";
import { LessonBeat } from "./LessonBeat";
import { useLessonProgress } from "@/core/hooks/useLessonProgress";
import { characters } from "@/utils/characterData";
import type { BeatLesson } from "@/content/beats/schema";

/**
 * BeatFlow — sequences beats one at a time (Flow C's skeleton).
 *
 * Renders the current beat, advances on its onComplete, and shows a route across
 * the top instead of a percent bar. Progress (furthest beat + completion) is
 * persisted via useLessonProgress so v2 and v1 share one completion model.
 */

interface BeatFlowProps<S> {
  lesson: BeatLesson<S>;
}

function lessonHeaderLabel(lesson: BeatLesson<unknown>): string {
  const char = characters.find((c) => c.id === lesson.meta.characterId);
  const name = char?.name.split(" ")[0] ?? lesson.meta.characterId;
  return `${name} · ${lesson.meta.title}`;
}

export function BeatFlow<S>({ lesson }: BeatFlowProps<S>) {
  const lessonId = lesson.meta.id;
  const total = lesson.beats.length;
  const exitTo = lesson.exitTo ?? `/lesson/${lessonId}`;
  const label = lessonHeaderLabel(lesson as BeatLesson<unknown>);

  const {
    beatIndex,
    lessonCompleted,
    setBeatIndex,
    markLessonComplete,
    resetBeatProgress,
  } = useLessonProgress(lessonId);

  const [index, setIndex] = useState(() => Math.min(beatIndex, total - 1));
  const [finished, setFinished] = useState(lessonCompleted);
  const furthest = useRef(index);

  useEffect(() => {
    setIndex(Math.min(beatIndex, total - 1));
    setFinished(lessonCompleted);
  }, [lessonId, beatIndex, lessonCompleted, total]);

  useEffect(() => {
    if (index > furthest.current) furthest.current = index;
    setBeatIndex(furthest.current);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [index, setBeatIndex]);

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
      <header className="sticky top-0 z-30 border-b border-white/5 bg-black/30 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-3">
          <Link to={exitTo} aria-label="Exit lesson" className="text-white/50 transition hover:text-white/90">
            <X className="h-5 w-5" />
          </Link>

          <div className="flex flex-1 items-center gap-1.5">
            {lesson.beats.map((b, i) => (
              <div key={b.id} className="flex flex-1 items-center gap-1.5 last:flex-none">
                <span
                  className="h-2.5 w-2.5 flex-none rounded-full transition-all duration-300"
                  style={{
                    background:
                      i < index ? "var(--ch-accent-2)" : i === index ? "var(--ch-accent)" : "rgba(255,255,255,0.18)",
                    boxShadow: i === index ? "0 0 0 4px color-mix(in srgb, var(--ch-accent) 22%, transparent)" : "none",
                  }}
                  aria-current={i === index ? "step" : undefined}
                />
                {i < total - 1 && (
                  <span
                    className="h-px flex-1"
                    style={{ background: i < index ? "var(--ch-accent-2)" : "rgba(255,255,255,0.12)" }}
                  />
                )}
              </div>
            ))}
          </div>

          <span className="flex items-center gap-1.5 font-mono text-[11px] text-white/45">
            <Compass className="h-3.5 w-3.5" /> {index + 1} of {total}
          </span>
          {index > 0 && (
            <button onClick={restart} aria-label="Start over" className="text-white/35 transition hover:text-white/80">
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
        </div>
      </header>

      <main className="px-5 pb-40 pt-14">
        <p className="mx-auto mb-2 max-w-5xl font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
          {label}
        </p>
        {lesson.meta.oneLine && (
          <p className="mx-auto mb-10 max-w-5xl font-serif text-sm italic text-white/45">{lesson.meta.oneLine}</p>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={beat.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <LessonBeat beat={beat} lessonVisual={lesson.visual} onComplete={next} />
          </motion.div>
        </AnimatePresence>

        {index > 0 && (
          <div className="mx-auto mt-12 flex max-w-5xl">
            <button onClick={prev} className="flex items-center gap-1.5 text-sm text-white/45 transition hover:text-white/85">
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
              className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center"
            >
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">Remember</p>
              <h2 className="font-serif text-2xl leading-snug text-white">{lesson.landing.mantra}</h2>
              {lesson.landing.recap && (
                <p className="mt-3 text-sm text-white/60">{lesson.landing.recap}</p>
              )}
              <div className="mt-6 flex flex-col gap-2">
                {lesson.landing.playgroundTo && (
                  <Link
                    to={lesson.landing.playgroundTo}
                    className="rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg transition active:scale-95"
                    style={{ background: "linear-gradient(135deg, var(--ch-accent), var(--ch-accent-2))" }}
                  >
                    Open the playground →
                  </Link>
                )}
                <button
                  onClick={restart}
                  className="rounded-full border border-white/15 px-5 py-3 text-sm text-white/80 transition hover:bg-white/5"
                >
                  Replay the lesson
                </button>
                <Link to={exitTo} className="py-2 text-xs text-white/40 underline-offset-2 transition hover:text-white/70 hover:underline">
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
