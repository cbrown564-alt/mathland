import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AudioChip } from "./AudioChip";
import { DiagramPanelHeader, MobileDiagramPill } from "./MobileDiagramPill";
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

  const scrollToPassage = useCallback((idx: number) => {
    const el = refs.current[idx];
    if (!el) return;
    const anchor = window.innerHeight * 0.42;
    const r = el.getBoundingClientRect();
    const target = r.top + window.scrollY + r.height / 2 - anchor;
    window.scrollTo({ top: target, behavior: "smooth" });
  }, []);

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

  const activeCaption = resolved[activeIdx]?.eyebrow;
  const visual = renderVisual(state);

  return (
    <div className={"grid min-w-0 gap-8 md:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] md:gap-10 lg:gap-12 " + (className ?? "")}>
      <div className="order-2 min-w-0 md:order-1">
        {resolved.map((p, idx) => {
          const isActive = idx === activeIdx;
          return (
            <article
              key={p.id}
              ref={(el) => { refs.current[idx] = el; }}
              role="button"
              tabIndex={0}
              onClick={() => scrollToPassage(idx)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  scrollToPassage(idx);
                }
              }}
              className={
                "relative cursor-pointer rounded-r-2xl border-l-[3px] border-l-transparent px-5 py-8 transition-all duration-500 first:pt-2 sm:px-6 md:py-11 motion-reduce:transform-none " +
                (isActive
                  ? "scale-100 opacity-100"
                  : "origin-left scale-[0.98] opacity-[0.35] motion-reduce:scale-100")
              }
              style={{
                background: isActive
                  ? "color-mix(in srgb, var(--ch-accent) 5%, transparent)"
                  : undefined,
              }}
            >
              {isActive && (
                <span
                  className="absolute bottom-0 left-0 top-0 w-[3px] -translate-x-[3px] rounded-sm"
                  style={{
                    background: "linear-gradient(to bottom, var(--ch-accent), var(--ch-accent-2))",
                    boxShadow: "0 0 20px color-mix(in srgb, var(--ch-accent) 45%, transparent)",
                  }}
                  aria-hidden
                />
              )}
              {p.eyebrow && (
                <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: "var(--ch-accent-2)" }}>
                  {p.eyebrow}
                </p>
              )}
              <div className="font-serif text-[18px] leading-[1.72] tracking-[0.01em] text-pretty text-white/[0.88] sm:text-[19px] md:text-[20px] md:leading-[1.68]">
                {"body" in p && p.body !== undefined ? p.body : parseInline(p.md)}
              </div>
              {p.audioSrc && (
                <div className="mt-6" onClick={(e) => e.stopPropagation()}>
                  <AudioChip src={p.audioSrc} />
                </div>
              )}
              <div className="mt-4 flex gap-1" aria-hidden>
                {resolved.map((_, pipIdx) => (
                  <span
                    key={pipIdx}
                    className="h-0.5 flex-1 rounded-full"
                    style={{
                      background:
                        pipIdx <= activeIdx
                          ? "var(--ch-accent)"
                          : "rgba(255,255,255,0.08)",
                    }}
                  />
                ))}
              </div>
            </article>
          );
        })}
      </div>

      <div className="order-1 hidden min-w-0 md:order-2 md:block">
        <div className="sticky top-20 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.015] p-4 shadow-[0_24px_70px_-34px_rgba(0,0,0,0.85)] ring-1 ring-inset ring-white/5 backdrop-blur-sm md:top-24">
          <DiagramPanelHeader activeIdx={activeIdx} className="mb-3" />
          <div aria-live="polite" aria-atomic="true">
            {visual}
          </div>
          {activeCaption && (
            <p className="mt-3 rounded-lg bg-white/[0.03] px-3 py-2.5 text-center font-mono text-[11px] text-white/45">
              {activeCaption}
            </p>
          )}
        </div>
      </div>

      <MobileDiagramPill activeIdx={activeIdx} caption={activeCaption}>
        {visual}
      </MobileDiagramPill>
    </div>
  );
}

export default CoupledVisual;
