import { useMemo } from "react";
import { ComponentType } from "react";
import { deepLerp } from "../CoupledVisual";
import { DotProductExplorer } from "../DotProductExplorer";
import type { InteractiveProps } from "../interactives";

/**
 * Parametric vector diagram state for Module 2 lessons (2.1–2.7).
 * One primitive covers dot product, addition, norms, span, and basis via flags.
 */
export interface VectorPlotState {
  u: [number, number];
  v: [number, number];
  /** Which element to draw attention to. */
  emphasis?: "none" | "angle" | "u" | "v";
  /** Draw u + v and the parallelogram construction (lesson 2.2). */
  sum?: boolean;
  /** Scalar multiple ghost of u — draws scale·u as a dashed arrow (lesson 2.2). */
  scale?: number;
  /** Unit circle at the origin plus ||u|| / ||v|| readouts (lesson 2.4). */
  unitCircle?: boolean;
  /** Spanning line or plane shaded region (lessons 2.5, 2.6). */
  span?: boolean;
  /** Skewed basis grid from u and v (lesson 2.7). */
  basis?: boolean;
}

const W = 460;
const H = 380;
const UNIT = 34; // px per unit
const CX = W / 2;
const CY = H / 2;

const U_COLOR = "#f4623c";
const V_COLOR = "#5aa2e0";
const SUM_COLOR = "#a3e635";
const SCALE_GHOST = "rgba(255,255,255,0.35)";
const SPAN_FILL = "rgba(167, 139, 250, 0.08)";

const toPx = (x: number, y: number) => ({ x: CX + x * UNIT, y: CY - y * UNIT });
const mag = (x: number, y: number) => Math.hypot(x, y);

/** True when u and v are nearly parallel (dependent span → a line). */
const areParallel = (u: [number, number], v: [number, number]) => {
  const cross = u[0] * v[1] - u[1] * v[0];
  return Math.abs(cross) < 0.08;
};

/** Deep numeric interpolation with discrete snap for flags (reuses CoupledVisual deepLerp). */
export const interpolateVectorPlot = (a: VectorPlotState, b: VectorPlotState, t: number): VectorPlotState =>
  deepLerp(a, b, t);

export const VectorPlotReadOnly = ({ state }: { state: VectorPlotState }) => {
  const {
    u,
    v,
    emphasis = "none",
    sum = false,
    scale,
    unitCircle = false,
    span = false,
    basis = false,
  } = state;

  const { dot, angleDeg, arcPath, mu, mv, sumVec, scaledU, parallel } = useMemo(() => {
    const d = u[0] * v[0] + u[1] * v[1];
    const mu = mag(u[0], u[1]);
    const mv = mag(v[0], v[1]);
    const cos = mu && mv ? Math.max(-1, Math.min(1, d / (mu * mv))) : 0;
    const ang = (Math.acos(cos) * 180) / Math.PI;

    const R = 30;
    const a1 = Math.atan2(-u[1], u[0]);
    const a2 = Math.atan2(-v[1], v[0]);
    const p1 = { x: CX + R * Math.cos(a1), y: CY + R * Math.sin(a1) };
    const p2 = { x: CX + R * Math.cos(a2), y: CY + R * Math.sin(a2) };
    let delta = a2 - a1;
    while (delta > Math.PI) delta -= 2 * Math.PI;
    while (delta < -Math.PI) delta += 2 * Math.PI;
    const sweep = delta < 0 ? 0 : 1;
    const path = `M ${p1.x} ${p1.y} A ${R} ${R} 0 0 ${sweep} ${p2.x} ${p2.y}`;

    const sumVec: [number, number] = [u[0] + v[0], u[1] + v[1]];
    const s = scale ?? 1;
    const scaledU: [number, number] = [u[0] * s, u[1] * s];

    return {
      dot: d,
      angleDeg: ang,
      arcPath: path,
      mu,
      mv,
      sumVec,
      scaledU,
      parallel: areParallel(u, v),
    };
  }, [u, v, scale]);

  const pu = toPx(u[0], u[1]);
  const pv = toPx(v[0], v[1]);
  const ps = toPx(sumVec[0], sumVec[1]);
  const pScaled = toPx(scaledU[0], scaledU[1]);
  const tone = dot > 0.06 ? "#4ade80" : dot < -0.06 ? "#fb7185" : "#fbbf24";
  const toneWord = dot > 0.06 ? "agree" : dot < -0.06 ? "oppose" : "⟂";
  const gridLines = Array.from({ length: 15 }, (_, i) => i - 7);

  const basisGrid = useMemo(() => {
    if (!basis) return null;
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let i = -3; i <= 3; i++) {
      for (let j = -3; j <= 3; j++) {
        if (i === 0 && j === 0) continue;
        const bx = i * u[0] + j * v[0];
        const by = i * u[1] + j * v[1];
        const p = toPx(bx, by);
        if (i !== 0) {
          const bx2 = (i + 1) * u[0] + j * v[0];
          const by2 = (i + 1) * u[1] + j * v[1];
          const p2 = toPx(bx2, by2);
          lines.push({ x1: p.x, y1: p.y, x2: p2.x, y2: p2.y });
        }
        if (j !== 0) {
          const bx2 = i * u[0] + (j + 1) * v[0];
          const by2 = i * u[1] + (j + 1) * v[1];
          const p2 = toPx(bx2, by2);
          lines.push({ x1: p.x, y1: p.y, x2: p2.x, y2: p2.y });
        }
      }
    }
    return lines;
  }, [basis, u, v]);

  const spanLines = useMemo(() => {
    if (!span) return null;
    const extend = (vx: number, vy: number) => {
      const m = mag(vx, vy) || 1;
      const nx = vx / m;
      const ny = vy / m;
      const far = 7;
      return {
        x1: CX - nx * far * UNIT,
        y1: CY + ny * far * UNIT,
        x2: CX + nx * far * UNIT,
        y2: CY - ny * far * UNIT,
      };
    };
    if (parallel) {
      const dir = mu > 0.01 ? u : v;
      return [extend(dir[0], dir[1])];
    }
    return [extend(u[0], u[1]), extend(v[0], v[1])];
  }, [span, u, v, parallel, mu]);

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full select-none"
        role="img"
        aria-label={`Vectors u and v${sum ? " with sum u+v" : ""}${unitCircle ? " and unit circle" : ""}`}
      >
        <defs>
          <marker id="vp-u" markerWidth="9" markerHeight="9" refX="6.5" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" fill={U_COLOR} />
          </marker>
          <marker id="vp-v" markerWidth="9" markerHeight="9" refX="6.5" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" fill={V_COLOR} />
          </marker>
          <marker id="vp-sum" markerWidth="9" markerHeight="9" refX="6.5" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" fill={SUM_COLOR} />
          </marker>
          <radialGradient id="vp-fade" cx="50%" cy="50%" r="62%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="70%" stopColor="#fff" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#000" />
          </radialGradient>
          <mask id="vp-mask">
            <rect x="0" y="0" width={W} height={H} fill="url(#vp-fade)" />
          </mask>
          <filter id="vp-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* span fill — plane or line */}
        {span && (
          <g>
            {parallel ? (
              spanLines?.map((ln, i) => (
                <line
                  key={i}
                  x1={ln.x1}
                  y1={ln.y1}
                  x2={ln.x2}
                  y2={ln.y2}
                  stroke="rgba(167,139,250,0.35)"
                  strokeWidth={14}
                  strokeLinecap="round"
                />
              ))
            ) : (
              <polygon
                points={`${CX - 6 * UNIT},${CY + 4 * UNIT} ${CX + 6 * UNIT},${CY + 4 * UNIT} ${CX + 6 * UNIT},${CY - 4 * UNIT} ${CX - 6 * UNIT},${CY - 4 * UNIT}`}
                fill={SPAN_FILL}
              />
            )}
          </g>
        )}

        {/* standard or basis grid */}
        <g mask="url(#vp-mask)">
          {basis && basisGrid ? (
            basisGrid.map((ln, i) => (
              <line
                key={i}
                x1={ln.x1}
                y1={ln.y1}
                x2={ln.x2}
                y2={ln.y2}
                stroke="rgba(255,255,255,0.07)"
                strokeWidth={1}
              />
            ))
          ) : (
            gridLines.map((i) => (
              <g key={i}>
                <line x1={CX + i * UNIT} y1={0} x2={CX + i * UNIT} y2={H} stroke="rgba(255,255,255,0.06)" />
                <line x1={0} y1={CY + i * UNIT} x2={W} y2={CY + i * UNIT} stroke="rgba(255,255,255,0.06)" />
              </g>
            ))
          )}
          <line x1={0} y1={CY} x2={W} y2={CY} stroke="rgba(255,255,255,0.2)" strokeWidth={1.25} />
          <line x1={CX} y1={0} x2={CX} y2={H} stroke="rgba(255,255,255,0.2)" strokeWidth={1.25} />
        </g>

        {/* unit circle */}
        {unitCircle && (
          <circle
            cx={CX}
            cy={CY}
            r={UNIT}
            fill="none"
            stroke="rgba(251,191,36,0.55)"
            strokeWidth={1.5}
            strokeDasharray="4 3"
          />
        )}

        {/* span direction lines */}
        {span &&
          spanLines?.map((ln, i) => (
            <line
              key={`span-${i}`}
              x1={ln.x1}
              y1={ln.y1}
              x2={ln.x2}
              y2={ln.y2}
              stroke="rgba(167,139,250,0.5)"
              strokeWidth={1.5}
              strokeDasharray="6 5"
            />
          ))}

        {/* parallelogram construction for u + v */}
        {sum && (
          <g stroke="rgba(255,255,255,0.2)" strokeWidth={1} strokeDasharray="4 4">
            <line x1={pu.x} y1={pu.y} x2={ps.x} y2={ps.y} />
            <line x1={pv.x} y1={pv.y} x2={ps.x} y2={ps.y} />
          </g>
        )}

        <path
          d={arcPath}
          fill="none"
          stroke={emphasis === "angle" ? tone : "rgba(255,255,255,0.45)"}
          strokeWidth={emphasis === "angle" ? 2.5 : 1.5}
          strokeDasharray="3 3"
        />

        {/* scalar multiple ghost */}
        {scale !== undefined && (
          <line
            x1={CX}
            y1={CY}
            x2={pScaled.x}
            y2={pScaled.y}
            stroke={SCALE_GHOST}
            strokeWidth={3}
            strokeDasharray="6 4"
            strokeLinecap="round"
            markerEnd="url(#vp-u)"
          />
        )}

        <g filter="url(#vp-glow)">
          <line
            x1={CX}
            y1={CY}
            x2={pu.x}
            y2={pu.y}
            stroke={U_COLOR}
            strokeWidth={emphasis === "u" ? 5.5 : 4}
            strokeLinecap="round"
            markerEnd="url(#vp-u)"
          />
          <line
            x1={CX}
            y1={CY}
            x2={pv.x}
            y2={pv.y}
            stroke={V_COLOR}
            strokeWidth={emphasis === "v" ? 5.5 : 4}
            strokeLinecap="round"
            markerEnd="url(#vp-v)"
          />
          {sum && (
            <line
              x1={CX}
              y1={CY}
              x2={ps.x}
              y2={ps.y}
              stroke={SUM_COLOR}
              strokeWidth={4}
              strokeLinecap="round"
              markerEnd="url(#vp-sum)"
            />
          )}
        </g>

        <text x={pu.x + 9} y={pu.y - 8} fill={U_COLOR} fontFamily="Newsreader, Georgia, serif" fontStyle="italic" fontSize="20" fontWeight="600">
          u
        </text>
        <text x={pv.x + 9} y={pv.y - 8} fill={V_COLOR} fontFamily="Newsreader, Georgia, serif" fontStyle="italic" fontSize="20" fontWeight="600">
          v
        </text>
        {sum && (
          <text x={ps.x + 9} y={ps.y - 8} fill={SUM_COLOR} fontFamily="Newsreader, Georgia, serif" fontStyle="italic" fontSize="18" fontWeight="600">
            u+v
          </text>
        )}
        {scale !== undefined && (
          <text x={pScaled.x + 6} y={pScaled.y + 14} fill="rgba(255,255,255,0.45)" fontFamily="monospace" fontSize="11">
            {scale}·u
          </text>
        )}
        <circle cx={CX} cy={CY} r={2.5} fill="rgba(255,255,255,0.6)" />
      </svg>

      <div className="mt-3 flex flex-wrap items-center gap-2 px-1">
        <span
          className="inline-flex items-baseline gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-xs tabular-nums"
          style={{
            borderColor: `color-mix(in srgb, ${tone} 45%, transparent)`,
            background: `color-mix(in srgb, ${tone} 12%, transparent)`,
          }}
        >
          <span className="text-white/55">u · v</span>
          <span className="font-semibold" style={{ color: tone }}>
            {dot.toFixed(1)}
          </span>
          <span className="text-white/40">· {toneWord}</span>
        </span>
        <span className="inline-flex items-baseline gap-1.5 rounded-lg border border-white/12 bg-white/[0.04] px-2.5 py-1 font-mono text-xs tabular-nums text-white/70">
          <span className="text-white/45">θ</span> {Math.round(angleDeg)}°
        </span>
        {unitCircle && (
          <>
            <span className="inline-flex items-baseline gap-1.5 rounded-lg border border-amber-400/25 bg-amber-400/[0.06] px-2.5 py-1 font-mono text-xs tabular-nums text-amber-100/80">
              <span className="text-white/45">|u|</span> {mu.toFixed(2)}
            </span>
            <span className="inline-flex items-baseline gap-1.5 rounded-lg border border-amber-400/25 bg-amber-400/[0.06] px-2.5 py-1 font-mono text-xs tabular-nums text-amber-100/80">
              <span className="text-white/45">|v|</span> {mv.toFixed(2)}
            </span>
          </>
        )}
        {sum && (
          <span className="inline-flex items-baseline gap-1.5 rounded-lg border border-lime-400/25 bg-lime-400/[0.06] px-2.5 py-1 font-mono text-xs tabular-nums text-lime-100/80">
            <span className="text-white/45">u+v</span> [{sumVec[0].toFixed(1)}, {sumVec[1].toFixed(1)}]
          </span>
        )}
      </div>
    </div>
  );
};

/** Draggable climax twin — reuses DotProductExplorer unchanged. */
export const VectorPlotClimax: ComponentType<InteractiveProps> = DotProductExplorer;

export default VectorPlotReadOnly;
