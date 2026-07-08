import { useState } from "react";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { CoupledVisual } from "./CoupledVisual";
import { Prose } from "./Prose";
import { INTERACTIVES } from "./interactives";
import { InteractiveShell } from "@/interactive/InteractiveShell";
import {
  resolveBeatVisual,
  resolveDefaultState,
  resolveInterpolate,
  resolveReadOnlyRenderer,
} from "./visualRegistry";
import type { Beat, Check, DoBeat, Predict, VisualBinding } from "@/content/beats/schema";

/**
 * LessonBeat — one teaching unit in the v2 blend (Flow C's beat).
 *
 * Renders one of four archetypes (couple, do, tell, recap) from authored data.
 * Bookends coupled reading with predict/check where the beat provides them.
 */

interface LessonBeatProps<S> {
  beat: Beat<S>;
  lessonVisual: VisualBinding<S>;
  onComplete?: () => void;
}

export function LessonBeat<S>({ beat, lessonVisual, onComplete }: LessonBeatProps<S>) {
  const [predicted, setPredicted] = useState<string | null>(null);

  const header = (eyebrow?: string, title?: string) =>
    (eyebrow || title) ? (
      <div className="mb-8">
        {eyebrow && (
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: "var(--ch-accent-2)" }}>
            {eyebrow}
          </p>
        )}
        {title && <h2 className="font-serif text-3xl leading-tight text-white sm:text-4xl">{title}</h2>}
      </div>
    ) : null;

  const predictBlock = (predict?: Predict) =>
    predict ? (
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
    ) : null;

  switch (beat.kind) {
    case "couple": {
      const visual = resolveBeatVisual(lessonVisual, beat.visual);
      const renderVisual = resolveReadOnlyRenderer(visual);
      const interpolate = resolveInterpolate(visual, beat.interpolate);
      const initialState = resolveDefaultState(visual);

      return (
        <section className="mx-auto max-w-6xl">
          {header(beat.eyebrow, beat.title)}
          {predictBlock(beat.predict)}
          <CoupledVisual
            passages={beat.passages}
            renderVisual={renderVisual}
            interpolate={interpolate}
            initialState={initialState}
          />
          <CheckBlock check={beat.check} onComplete={onComplete} />
        </section>
      );
    }

    case "do":
      return (
        <section className="mx-auto max-w-6xl">
          {header(beat.eyebrow, beat.title)}
          {predictBlock(beat.predict)}
          <DoBody beat={beat} onComplete={onComplete} />
        </section>
      );

    case "tell":
      return (
        <section className="mx-auto max-w-6xl">
          {header(beat.eyebrow, beat.title)}
          <div className="mx-auto max-w-2xl">
            <Prose md={beat.md} className="font-serif text-[22px] leading-[1.6] text-white/90 sm:text-[27px] sm:leading-[1.55]" />
            {beat.figure && <div className="mt-8">{beat.figure}</div>}
          </div>
          <CheckBlock check={beat.check} onComplete={onComplete} />
        </section>
      );

    case "recap":
      return (
        <section className="mx-auto max-w-6xl">
          {header(beat.eyebrow, beat.title)}
          <div
            className="mx-auto max-w-xl rounded-3xl border p-8 text-center"
            style={{
              borderColor: "color-mix(in srgb, var(--ch-accent) 35%, transparent)",
              background: "color-mix(in srgb, var(--ch-accent) 8%, transparent)",
            }}
          >
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">Remember</p>
            <p className="font-serif text-2xl leading-snug text-white sm:text-3xl">{beat.mantra}</p>
            {beat.points && beat.points.length > 0 && (
              <ul className="mt-6 space-y-2 text-left text-sm text-white/75">
                {beat.points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full" style={{ background: "var(--ch-accent)" }} />
                    {pt}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {onComplete && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={onComplete}
                className="v2-cta flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition active:scale-95"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </section>
      );

    default: {
      const _exhaustive: never = beat;
      return _exhaustive;
    }
  }
}

function CheckBlock({ check, onComplete }: { check?: Check; onComplete?: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  if (!check) {
    if (!onComplete) return null;
    return (
      <div className="mt-16 flex justify-center">
        <button
          onClick={onComplete}
          className="v2-cta flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition active:scale-95"
        >
          <CheckCircle2 className="h-4 w-4" /> Done — continue
        </button>
      </div>
    );
  }

  const isCorrect = selected === check.correctAnswer;
  const labels = ["A", "B", "C", "D", "E"];

  return (
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
          className="v2-cta mt-5 flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition active:scale-95"
        >
          Continue <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function DoBody({ beat, onComplete }: { beat: DoBeat; onComplete?: () => void }) {
  const Interactive = INTERACTIVES[beat.interactive];
  const [achieved, setAchieved] = useState<Set<string>>(new Set());
  const goals = beat.goals ?? [];
  const met = goals.filter((g) => achieved.has(g.tone)).length;
  const allMet = met === goals.length;

  if (!Interactive) {
    return <p className="text-white/60">Unknown interactive: {beat.interactive}</p>;
  }

  return (
    <div className="mx-auto max-w-3xl">
      {beat.intro && (
        <Prose md={beat.intro} className="mb-5 font-serif text-xl leading-relaxed text-white/85" />
      )}

      {goals.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {goals.map((g) => {
            const done = achieved.has(g.tone);
            return (
              <div
                key={g.tone}
                className={
                  "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition " +
                  (done ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-100" : "border-white/10 text-white/55")
                }
              >
                {done ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : <Circle className="h-4 w-4 text-white/25" />}
                {g.label}
              </div>
            );
          })}
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur-sm sm:p-4">
        <InteractiveShell ariaLabel={beat.title}>
          <Interactive
            onStateChange={({ tone }) =>
              setAchieved((prev) => (prev.has(tone) ? prev : new Set(prev).add(tone)))
            }
          />
        </InteractiveShell>
      </div>

      {onComplete && (
        <div className="mt-8 flex flex-col items-center gap-2">
          {goals.length > 0 && !allMet && (
            <p className="text-sm text-white/45">
              Land all outcomes to finish — {met} of {goals.length} so far.
            </p>
          )}
          <button
            onClick={onComplete}
            disabled={goals.length > 0 && !allMet}
            className="v2-cta flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition enabled:active:scale-95 disabled:cursor-not-allowed disabled:text-white/50"
          >
            {allMet || goals.length === 0 ? "Finish the lesson" : "Keep exploring"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default LessonBeat;
