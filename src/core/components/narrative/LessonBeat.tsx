import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { CoupledVisual } from "./CoupledVisual";
import { CharacterVoice } from "./CharacterVoice";
import { Prose } from "./Prose";
import { INTERACTIVES } from "./interactives";
import { InteractiveShell } from "@/interactive/InteractiveShell";
import { characters } from "@/utils/characterData";
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
  characterId: string;
  onComplete?: () => void;
}

export function LessonBeat<S>({ beat, lessonVisual, characterId, onComplete }: LessonBeatProps<S>) {
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
        className="mb-12 rounded-[1.25rem] border border-dashed p-6"
        style={{
          borderColor: "color-mix(in srgb, var(--ch-accent) 35%, transparent)",
          background: "linear-gradient(135deg, color-mix(in srgb, var(--ch-accent) 6%, transparent), transparent)",
        }}
      >
        <p className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/32">
          <span
            className="flex h-5 w-5 items-center justify-center rounded-full text-xs"
            style={{
              background: "color-mix(in srgb, var(--ch-accent) 20%, transparent)",
              color: "var(--ch-accent)",
            }}
            aria-hidden
          >
            ?
          </span>
          Predict first
        </p>
        <h4 className="mb-5 font-serif text-xl leading-snug text-white/90">{predict.prompt}</h4>
        <div className="grid gap-2">
          {predict.options.map((o) => {
            const on = predicted === o.value;
            return (
              <button
                key={o.value}
                onClick={() => setPredicted(o.value)}
                aria-pressed={on}
                className="flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-[0.9375rem] text-white/90 transition"
                style={{
                  borderColor: on ? "var(--ch-accent)" : "rgba(255,255,255,0.08)",
                  background: on
                    ? "color-mix(in srgb, var(--ch-accent) 12%, transparent)"
                    : "rgba(255,255,255,0.02)",
                }}
              >
                <span
                  className="h-[18px] w-[18px] flex-none rounded-full border-2 transition"
                  style={{
                    borderColor: on ? "var(--ch-accent)" : "rgba(255,255,255,0.2)",
                    background: on ? "var(--ch-accent)" : "transparent",
                    boxShadow: on ? "inset 0 0 0 3px var(--stage-bg, #0b0910)" : "none",
                  }}
                  aria-hidden
                />
                {o.label}
              </button>
            );
          })}
        </div>
        {predicted && (
          <div className="mt-5">
            <CharacterVoice characterId={characterId} variant="nudge">
              {predict.nudge?.[predicted] ??
                "Locked in — now scroll and watch whether the picture agrees with you."}
            </CharacterVoice>
          </div>
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
          <CheckBlock check={beat.check} characterId={characterId} onComplete={onComplete} />
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
          <CheckBlock check={beat.check} characterId={characterId} onComplete={onComplete} />
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

function CheckBlock({
  check,
  characterId,
  onComplete,
}: {
  check?: Check;
  characterId: string;
  onComplete?: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const char = characters.find((c) => c.id === characterId);
  const firstName = char?.name.split(" ")[0] ?? characterId;
  const reactionVerb = char?.reactionVerb ?? "celebrates";

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
  const showSuccess = selected !== null && isCorrect;

  return (
    <div
      className={
        "mx-auto mt-16 max-w-2xl rounded-[1.25rem] border p-6 transition " +
        (showSuccess
          ? "border-emerald-500/40"
          : "border-white/10 bg-white/[0.03]")
      }
      style={
        showSuccess
          ? { background: "color-mix(in srgb, #22c55e 6%, transparent)" }
          : undefined
      }
    >
      {showSuccess && (
        <p className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-emerald-400">
          <span aria-hidden>✓</span> Correct · {firstName} {reactionVerb}
        </p>
      )}
      {!showSuccess && (
        <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-white/45">Quick check</p>
      )}
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
        <div className="mt-4 space-y-4">
          {isCorrect ? (
            <CharacterVoice characterId={characterId} variant="aside">
              {check.explanation}
            </CharacterVoice>
          ) : (
            <div className="rounded-xl border border-amber-400/30 bg-amber-400/5 p-4 text-sm">
              <p className="mb-1 font-semibold text-white">Not quite —</p>
              <p className="text-white/75">{check.explanation}</p>
              <button
                onClick={() => setSelected(null)}
                className="mt-2 text-xs text-white/60 underline underline-offset-2 hover:text-white/90"
              >
                Try again
              </button>
            </div>
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
        <Prose md={beat.intro} className="mb-8 font-serif text-xl leading-relaxed text-white/85" />
      )}

      <div className="flex flex-col items-center gap-4 py-8">
        <div
          className="h-[60px] w-0.5"
          style={{ background: "linear-gradient(to bottom, var(--ch-accent), transparent)" }}
          aria-hidden
        />
        <p
          className="font-mono text-[11px] uppercase tracking-[0.2em]"
          style={{ color: "var(--ch-accent-2)" }}
        >
          Now you try
        </p>
        <div
          className="h-[60px] w-0.5"
          style={{ background: "linear-gradient(to bottom, transparent, var(--ch-accent))" }}
          aria-hidden
        />
      </div>

      <div
        className="relative rounded-[1.25rem] border-2 p-6"
        style={{
          borderColor: "color-mix(in srgb, var(--ch-accent) 25%, transparent)",
          background: "linear-gradient(180deg, color-mix(in srgb, var(--ch-accent) 8%, transparent) 0%, rgba(0,0,0,0.3) 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-[-1px] rounded-[inherit] opacity-50"
          style={{
            padding: "2px",
            background: "linear-gradient(135deg, var(--ch-accent), var(--ch-accent-2), transparent)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
          aria-hidden
        />

        <div className="relative">
          <div className="mb-5 flex items-center justify-between gap-4">
            {beat.title && <h4 className="font-serif text-[1.375rem] text-white">{beat.title}</h4>}
            {goals.length > 0 && (
              <span
                className="flex-none rounded-full border px-4 py-1 font-mono text-[11px] tracking-wide"
                style={{
                  borderColor: "color-mix(in srgb, var(--ch-accent) 40%, transparent)",
                  background: "color-mix(in srgb, var(--ch-accent) 10%, transparent)",
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                {met} / {goals.length} goals
              </span>
            )}
          </div>

          {goals.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {goals.map((g) => {
                const done = achieved.has(g.tone);
                return (
                  <span
                    key={g.tone}
                    className={
                      "inline-flex items-center gap-2 rounded-full border px-3 py-2 font-mono text-[11px] transition " +
                      (done
                        ? "border-emerald-500/40 text-emerald-400"
                        : "border-white/[0.08] text-white/55")
                    }
                  >
                    <span className="text-xs" aria-hidden>
                      {done ? "✓" : "○"}
                    </span>
                    {g.label}
                  </span>
                );
              })}
            </div>
          )}

          <div className="rounded-xl border border-white/10 bg-black/35 p-3 backdrop-blur-sm sm:p-4">
            <InteractiveShell ariaLabel={beat.title ?? "Interactive exercise"}>
              <Interactive
                onStateChange={({ tone }) =>
                  setAchieved((prev) => (prev.has(tone) ? prev : new Set(prev).add(tone)))
                }
              />
            </InteractiveShell>
          </div>
        </div>
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
