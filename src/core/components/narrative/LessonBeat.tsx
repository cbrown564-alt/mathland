import { ReactNode, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { CoupledVisual, CoupledPassage } from "./CoupledVisual";

/**
 * LessonBeat — one teaching unit in the v2 blend (Flow C's beat).
 *
 * Bookends the coupled reading (Flow A) with active recall: a predict-then-reveal
 * commitment *before* the passage, and a quick check *after* it. So a beat runs
 * predict → read-with-live-picture → check, and no single mode drags. Content is
 * data (predict + passages + check), which is the seed of the authoring format.
 */

export interface PredictPrompt {
  prompt: ReactNode;
  options: { label: string; value: string }[];
  /** Short nudge shown after a choice — keyed by option value. */
  nudge?: Record<string, string>;
}

export interface BeatCheck {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface LessonBeatProps<S> {
  eyebrow?: string;
  title?: ReactNode;
  predict?: PredictPrompt;
  passages: CoupledPassage<S>[];
  renderVisual: (state: S) => ReactNode;
  interpolate?: (a: S, b: S, t: number) => S;
  check?: BeatCheck;
  /** Fired when the learner finishes the beat (check answered, or Continue). */
  onComplete?: () => void;
}

export function LessonBeat<S>({
  eyebrow,
  title,
  predict,
  passages,
  renderVisual,
  interpolate,
  check,
  onComplete,
}: LessonBeatProps<S>) {
  const [predicted, setPredicted] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const isCorrect = selected === check?.correctAnswer;
  const labels = ["A", "B", "C", "D", "E"];

  return (
    <section className="mx-auto max-w-5xl">
      {(eyebrow || title) && (
        <div className="mb-8">
          {eyebrow && (
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: "var(--ch-accent-2)" }}>
              {eyebrow}
            </p>
          )}
          {title && <h2 className="font-serif text-3xl leading-tight text-white sm:text-4xl">{title}</h2>}
        </div>
      )}

      {/* PREDICT — commit before you read */}
      {predict && (
        <div
          className="mb-12 rounded-2xl border p-5"
          style={{
            borderColor: "color-mix(in srgb, var(--ch-accent) 30%, transparent)",
            background: "color-mix(in srgb, var(--ch-accent) 6%, transparent)",
          }}
        >
          <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-white/45">Predict first</p>
          <p className="font-serif text-lg text-white/90">{predict.prompt}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {predict.options.map((o) => {
              const on = predicted === o.value;
              return (
                <button
                  key={o.value}
                  onClick={() => setPredicted(o.value)}
                  aria-pressed={on}
                  className="rounded-full border px-4 py-2 font-mono text-sm transition"
                  style={{
                    borderColor: on ? "var(--ch-accent)" : "rgba(255,255,255,0.15)",
                    background: on ? "var(--ch-accent)" : "transparent",
                    color: on ? "#fff" : "rgba(255,255,255,0.8)",
                  }}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
          {predicted && (
            <p className="mt-3 text-sm italic text-white/60">
              {predict.nudge?.[predicted] ?? "Locked in — now scroll and watch whether the picture agrees with you."}
            </p>
          )}
        </div>
      )}

      {/* COUPLED READING — prose bound to a live diagram */}
      <CoupledVisual passages={passages} renderVisual={renderVisual} interpolate={interpolate} />

      {/* CHECK — confirm it landed */}
      {check && (
        <div className="mx-auto mt-16 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-white/45">Quick check</p>
          <p className="mb-4 font-serif text-lg text-white/90">{check.question}</p>
          <div className="grid gap-2">
            {check.options.map((opt, i) => {
              const reveal = selected !== null;
              const style = !reveal
                ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.07]"
                : i === check.correctAnswer
                ? "border-emerald-400/40 bg-emerald-400/10"
                : selected === i
                ? "border-amber-400/40 bg-amber-400/10"
                : "border-white/10 bg-white/[0.02] opacity-50";
              return (
                <button
                  key={i}
                  disabled={reveal}
                  onClick={() => setSelected(i)}
                  className={"flex items-start gap-2.5 rounded-xl border px-4 py-3 text-left text-sm transition " + style}
                >
                  <span className="mt-0.5 font-mono text-xs text-white/50">{labels[i]}</span>
                  <span className="text-white/85">{opt}</span>
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <div
              className={
                "mt-4 rounded-xl border p-4 text-sm " +
                (isCorrect ? "border-emerald-400/30 bg-emerald-400/5" : "border-amber-400/30 bg-amber-400/5")
              }
            >
              <p className="mb-1 font-semibold text-white">{isCorrect ? "Exactly right." : "Not quite —"}</p>
              <p className="text-white/75">{check.explanation}</p>
              {!isCorrect && (
                <button
                  onClick={() => setSelected(null)}
                  className="mt-2 text-xs text-white/60 underline underline-offset-2 hover:text-white/90"
                >
                  Try again
                </button>
              )}
            </div>
          )}

          {isCorrect && onComplete && (
            <button
              onClick={onComplete}
              className="mt-5 flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg transition active:scale-95"
              style={{ background: "linear-gradient(135deg, var(--ch-accent), var(--ch-accent-2))" }}
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* no check → a plain Continue */}
      {!check && onComplete && (
        <div className="mt-16 flex justify-center">
          <button
            onClick={onComplete}
            className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg transition active:scale-95"
            style={{ background: "linear-gradient(135deg, var(--ch-accent), var(--ch-accent-2))" }}
          >
            <CheckCircle2 className="h-4 w-4" /> Done — continue
          </button>
        </div>
      )}
    </section>
  );
}

export default LessonBeat;
