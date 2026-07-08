import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AudioChip } from "./AudioChip";
import { parseInline } from "./Prose";
import type { Passage } from "@/content/beats/schema";

/**
 * CoupledVisual — the core v2 primitive.
 *
 * Binds a column of prose passages to a single sticky diagram. As the reader
 * scrolls, the passage nearest the viewport centre becomes "active" and the
 * diagram state *interpolates* toward it, so the picture animates to match the
 * words (Flow A's coupling — reused inside Flow C's beats). The visual is a
 * render prop, so the same scaffold drives vectors, matrices, distributions…
 * anything with a lerp-able state.
 */

export type { Passage } from "@/content/beats/schema";
/** @deprecated Use Passage */
export type CoupledPassage<S> = Passage<S>;

interface CoupledVisualProps<S> {
  passages: Passage<S>[];
  renderVisual: (state: S) => ReactNode;
  interpolate?: (a: S, b: S, t: number) => S;
  /** Fallback when the first passage omits state. */
  initialState?: S;
  className?: string;
}

/** Deep numeric interpolation: numbers ease, arrays ease elementwise, discrete values snap at the midpoint. */
export function deepLerp<S>(a: S, b: S, t: number): S {
  if (typeof a === "number" && typeof b === "number") {
    return (a + (b - a) * t) as unknown as S;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.map((av, i) => deepLerp(av, b[i], t)) as unknown as S;
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    const out: Record<string, unknown> = { ...(a as object) };
    for (const k of Object.keys(a as object)) {
      out[k] = deepLerp((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k], t);
    }
    return out as S;
  }
  return (t < 0.5 ? a : b) as S;
}

/** Carry forward the previous diagram state when a passage omits `state`. */
export function resolvePassageStates<S>(passages: Passage<S>[], fallback: S): (Passage<S> & { state: S })[] {
  let current = fallback;
  return passages.map((p) => {
    if (p.state !== undefined) current = p.state;
    return { ...p, state: current };
  });
}

export function CoupledVisual<S>({
  passages,
  renderVisual,
  interpolate = deepLerp,
  initialState,
  className,
}: CoupledVisualProps<S>) {
  const resolved = useMemo(
    () => resolvePassageStates(passages, initialState ?? passages[0]?.state as S),
    [passages, initialState],
  );

  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const frame = useRef<number | null>(null);
  const [state, setState] = useState<S>(resolved[0]?.state);
  const [activeIdx, setActiveIdx] = useState(0);

  const recompute = useCallback(() => {
    frame.current = null;
    const anchor = window.innerHeight * 0.42;
    const centers = refs.current.map((el) => {
      if (!el) return Infinity;
      const r = el.getBoundingClientRect();
      return r.top + r.height / 2;
    });
    if (!centers.length) return;

    let i = 0;
    while (i < centers.length - 1 && centers[i + 1] < anchor) i++;

    const cur = centers[i];
    const nxt = centers[i + 1];
    let t = 0;
    if (i < resolved.length - 1 && Number.isFinite(nxt)) {
      t = Math.max(0, Math.min(1, (anchor - cur) / (nxt - cur)));
    }
    const next = resolved[Math.min(i + 1, resolved.length - 1)];
    setState(interpolate(resolved[i].state, next.state, t));
    setActiveIdx(t < 0.5 ? i : Math.min(i + 1, resolved.length - 1));
  }, [resolved, interpolate]);

  useEffect(() => {
    const onScroll = () => {
      if (frame.current == null) frame.current = requestAnimationFrame(recompute);
    };
    recompute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current != null) cancelAnimationFrame(frame.current);
    };
  }, [recompute]);

  return (
    <div className={"grid gap-8 md:grid-cols-2 md:gap-12 " + (className ?? "")}>
      <div className="order-2 md:order-1">
        {resolved.map((p, idx) => (
          <div
            key={p.id}
            ref={(el) => { refs.current[idx] = el; }}
            className={
              "border-l-2 py-10 pl-5 transition-all duration-500 first:pt-2 sm:pl-6 " +
              (idx === activeIdx ? "opacity-100" : "opacity-30")
            }
            style={{
              borderColor: idx === activeIdx ? "var(--ch-accent)" : "rgba(255,255,255,0.08)",
              boxShadow: idx === activeIdx ? "-2px 0 26px -10px var(--ch-accent)" : "none",
            }}
          >
            {p.eyebrow && (
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: "var(--ch-accent-2)" }}>
                {p.eyebrow}
              </p>
            )}
            <div className="font-serif text-[22px] leading-[1.6] text-white/90 sm:text-[27px] sm:leading-[1.55]">
              {"body" in p && p.body !== undefined ? p.body : parseInline(p.md)}
            </div>
            {p.audioSrc && (
              <div className="mt-4">
                <AudioChip src={p.audioSrc} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="order-1 md:order-2">
        <div className="sticky top-20 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.015] p-4 shadow-[0_24px_70px_-34px_rgba(0,0,0,0.85)] ring-1 ring-inset ring-white/5 backdrop-blur-sm md:top-24">
          <div className="mb-2 flex items-center gap-1.5 px-1">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--ch-accent)" }} />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">live plot</span>
          </div>
          {renderVisual(state)}
        </div>
      </div>
    </div>
  );
}

export default CoupledVisual;
