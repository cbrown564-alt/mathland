import { useMemo } from "react";
import { ComponentType } from "react";
import { deepLerp } from "../CoupledVisual";
import { DotProductExplorer } from "../DotProductExplorer";
import type { InteractiveProps } from "../interactives";
import { VectorArrow } from "../VectorArrow";

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
  /** Show one vector with component/magnitude readouts; used before relationships are introduced. */
  singleVector?: boolean;
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

/** Place labels just beyond the vector tip, offset along the arrow direction. */
const labelPos = (ox: number, oy: number, tx: number, ty: number) => {
  const dx = tx - ox;
  const dy = ty - oy;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const nx = -uy;
  const ny = ux;
  return {
    x: tx + ux * 12 + nx * 5,
    y: ty + uy * 12 + ny * 5,
  };
};

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
    singleVector = false,
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
  const labelU = labelPos(CX, CY, pu.x, pu.y);
  const labelV = labelPos(CX, CY, pv.x, pv.y);
  const labelSum = labelPos(CX, CY, ps.x, ps.y);
  const tone = dot > 0.06 ? "#4ade80" : dot < -0.06 ? "#fb7185" : "#fbbf24";
  const toneWord = dot > 0.06 ? "agree" : dot < -0.06 ? "oppose" : "perpendicular";

  const gridLinesX = useMemo(() => {
    const min = Math.ceil(-CX / UNIT);
    const max = Math.floor((W - CX) / UNIT);
    return Array.from({ length: max - min + 1 }, (_, k) => k + min);
  }, []);

  const gridLinesY = useMemo(() => {
    const min = Math.ceil(-CY / UNIT);
    const max = Math.floor((H - CY) / UNIT);
    return Array.from({ length: max - min + 1 }, (_, k) => k + min);
  }, []);

  const basisGrid = useMemo(() => {
    if (!basis) return null;
    const extent = 6;
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let i = -extent; i <= extent; i++) {
      const alongUStart = toPx(i * u[0] - extent * v[0], i * u[1] - extent * v[1]);
      const alongUEnd = toPx(i * u[0] + extent * v[0], i * u[1] + extent * v[1]);
      lines.push({ x1: alongUStart.x, y1: alongUStart.y, x2: alongUEnd.x, y2: alongUEnd.y });
      const alongVStart = toPx(-extent * u[0] + i * v[0], -extent * u[1] + i * v[1]);
      const alongVEnd = toPx(extent * u[0] + i * v[0], extent * u[1] + i * v[1]);
      lines.push({ x1: alongVStart.x, y1: alongVStart.y, x2: alongVEnd.x, y2: alongVEnd.y });
    }
    return lines;
  }, [basis, u, v]);

  const spanPolygon = useMemo(() => {
    if (!span || parallel) return null;
    const ext = 5;
    const corners = [
      toPx(-ext * u[0] - ext * v[0], -ext * u[1] - ext * v[1]),
      toPx(ext * u[0] - ext * v[0], ext * u[1] - ext * v[1]),
      toPx(ext * u[0] + ext * v[0], ext * u[1] + ext * v[1]),
      toPx(-ext * u[0] + ext * v[0], -ext * u[1] + ext * v[1]),
    ];
    return corners.map((p) => `${p.x},${p.y}`).join(" ");
  }, [span, parallel, u, v]);

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
        aria-label={singleVector ? `Vector [${u[0]}, ${u[1]}] with magnitude ${mu.toFixed(2)}` : `Vectors u and v${sum ? " with sum u+v" : ""}${unitCircle ? " and unit circle" : ""}`}
      >
        <defs>
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
              spanPolygon && <polygon points={spanPolygon} fill={SPAN_FILL} />
            )}
          </g>
        )}

        {/* standard or basis grid */}
        <g>
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
            <>
              {gridLinesX.map((i) =>
                i === 0 ? null : (
                  <line
                    key={`vx-${i}`}
                    x1={CX + i * UNIT}
                    y1={0}
                    x2={CX + i * UNIT}
                    y2={H}
                    stroke="rgba(255,255,255,0.06)"
                  />
                ),
              )}
              {gridLinesY.map((j) =>
                j === 0 ? null : (
                  <line
                    key={`hy-${j}`}
                    x1={0}
                    y1={CY - j * UNIT}
                    x2={W}
                    y2={CY - j * UNIT}
                    stroke="rgba(255,255,255,0.06)"
                  />
                ),
              )}
            </>
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

        {!singleVector && mu > 0.01 && mv > 0.01 && (
          <path
            d={arcPath}
            fill="none"
            stroke={emphasis === "angle" ? tone : "rgba(255,255,255,0.45)"}
            strokeWidth={emphasis === "angle" ? 2.5 : 1.5}
            strokeDasharray="3 3"
          />
        )}

        {/* scalar multiple ghost */}
        {scale !== undefined && (
          <VectorArrow
            x1={CX}
            y1={CY}
            x2={pScaled.x}
            y2={pScaled.y}
            color={SCALE_GHOST}
            strokeWidth={3}
            strokeDasharray="6 4"
          />
        )}

        <g filter="url(#vp-glow)">
          <VectorArrow
            x1={CX}
            y1={CY}
            x2={pu.x}
            y2={pu.y}
            color={U_COLOR}
            strokeWidth={emphasis === "u" ? 5.5 : 4}
          />
          {!singleVector && <VectorArrow
            x1={CX}
            y1={CY}
            x2={pv.x}
            y2={pv.y}
            color={V_COLOR}
            strokeWidth={emphasis === "v" ? 5.5 : 4}
          />}
          {sum && (
            <VectorArrow
              x1={CX}
              y1={CY}
              x2={ps.x}
              y2={ps.y}
              color={SUM_COLOR}
              strokeWidth={4}
            />
          )}
        </g>

        <text x={labelU.x} y={labelU.y} fill={U_COLOR} fontFamily="Newsreader, Georgia, serif" fontStyle="italic" fontSize="20" fontWeight="600">
          {singleVector ? "v" : "u"}
        </text>
        {!singleVector && <text x={labelV.x} y={labelV.y} fill={V_COLOR} fontFamily="Newsreader, Georgia, serif" fontStyle="italic" fontSize="20" fontWeight="600">
          v
        </text>}
        {sum && (
          <text x={labelSum.x} y={labelSum.y} fill={SUM_COLOR} fontFamily="Newsreader, Georgia, serif" fontStyle="italic" fontSize="18" fontWeight="600">
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
        {singleVector ? <>
          <span className="inline-flex items-baseline gap-1.5 rounded-lg border border-white/12 bg-white/[0.04] px-2.5 py-1 font-mono text-xs text-white/75">
            <span className="text-white/45">v</span> [{u[0].toFixed(1)}, {u[1].toFixed(1)}]
          </span>
          <span className="inline-flex items-baseline gap-1.5 rounded-lg border border-amber-400/25 bg-amber-400/[0.06] px-2.5 py-1 font-mono text-xs text-amber-100/80">
            <span className="text-white/45">|v|</span> {mu.toFixed(2)}
          </span>
        </> : <><span
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
        </>}
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
