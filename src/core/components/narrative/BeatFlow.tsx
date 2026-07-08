import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Compass, RotateCcw, X } from "lucide-react";
import { LessonBeat, BeatData } from "./LessonBeat";

/**
 * BeatFlow — sequences beats one at a time (Flow C's skeleton).
 *
 * Renders the current beat, advances on its onComplete, and shows a route across
 * the top instead of a percent bar (on-theme for Vera's navigation world). Each
 * beat is keyed so its predict/check state resets on entry, and the page scrolls
 * to the top so the coupled reading starts fresh. Progress (furthest beat) is
 * persisted so a return resumes where you left off.
 */

const KEY = (id: string) => `beatflow-${id}`;

function readFurthest(lessonId: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(KEY(lessonId));
    return raw ? JSON.parse(raw).furthest ?? 0 : 0;
  } catch {
    return 0;
  }
}
function writeFurthest(lessonId: string, furthest: number, done: boolean) {
  try {
    localStorage.setItem(KEY(lessonId), JSON.stringify({ furthest, done }));
  } catch {
    /* ignore */
  }
}

interface BeatFlowProps<S> {
  lessonId: string;
  /** Small label in the route header, e.g. "Vera · Vectors". */
  label: string;
  beats: BeatData<S>[];
  renderVisual: (state: S) => ReactNode;
  /** Where "exit" and the completion screen point back to. */
  exitTo?: string;
  /** Optional climax link shown on completion (e.g. the draggable playground). */
  playgroundTo?: string;
}

export function BeatFlow<S>({ lessonId, label, beats, renderVisual, exitTo = "/", playgroundTo }: BeatFlowProps<S>) {
  const total = beats.length;
  const [index, setIndex] = useState(() => Math.min(readFurthest(lessonId), total - 1));
  const [finished, setFinished] = useState(false);
  const furthest = useRef(index);

  useEffect(() => {
    if (index > furthest.current) furthest.current = index;
    writeFurthest(lessonId, furthest.current, finished);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [index, finished, lessonId]);

  const next = useCallback(() => {
    setIndex((i) => {
      if (i >= total - 1) {
        setFinished(true);
        return i;
      }
      return i + 1;
    });
  }, [total]);

  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const restart = useCallback(() => { setFinished(false); setIndex(0); }, []);

  const beat = beats[index];

  return (
    <>
      {/* route header */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-black/30 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-3">
          <Link to={exitTo} aria-label="Exit lesson" className="text-white/50 transition hover:text-white/90">
            <X className="h-5 w-5" />
          </Link>

          <div className="flex flex-1 items-center gap-1.5">
            {beats.map((b, i) => (
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

      {/* the current beat */}
      <main className="px-5 pb-40 pt-14">
        <p className="mx-auto mb-10 max-w-5xl font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
          {label}
        </p>
        <AnimatePresence mode="wait">
          <motion.div
            key={beat.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <LessonBeat
              eyebrow={beat.eyebrow}
              title={beat.title}
              predict={beat.predict}
              passages={beat.passages}
              interpolate={beat.interpolate}
              check={beat.check}
              climax={beat.climax}
              renderVisual={renderVisual}
              onComplete={next}
            />
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

      {/* completion */}
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
              <h2 className="font-serif text-2xl text-white">Lesson complete.</h2>
              <p className="mt-2 text-sm text-white/60">
                {total} beats, each a little predict → read → check. Positive is together, zero is strangers, negative is opposite.
              </p>
              <div className="mt-6 flex flex-col gap-2">
                {playgroundTo && (
                  <Link
                    to={playgroundTo}
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
