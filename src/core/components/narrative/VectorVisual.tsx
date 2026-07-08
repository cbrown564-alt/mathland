import { useMemo } from "react";

/**
 * Presentational (read-only) vector diagram for the coupled-visual scaffold.
 *
 * It draws whatever state it's handed — the CoupledVisual interpolates the state
 * between passages, so as the reader scrolls the words, this picture animates to
 * match. No interaction here on purpose: this is the "picture that follows the
 * prose" (Flow A). The draggable version is DotProductExplorer, used at the
 * climax (Flow B).
 */
export interface VectorState {
  u: [number, number];
  v: [number, number];
  /** Which element to draw attention to. */
  emphasis?: "none" | "angle" | "u" | "v";
}

const W = 460;
const H = 380;
const UNIT = 34; // px per unit
const CX = W / 2;
const CY = H / 2;

const U_COLOR = "#f4623c"; // Vera-hot
const V_COLOR = "#5aa2e0"; // cool counterweight

const toPx = (x: number, y: number) => ({ x: CX + x * UNIT, y: CY - y * UNIT });
const mag = (x: number, y: number) => Math.hypot(x, y);

export const VectorVisual = ({ state }: { state: VectorState }) => {
  const { u, v, emphasis = "none" } = state;

  const { dot, angleDeg, arcPath } = useMemo(() => {
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
    return { dot: d, angleDeg: ang, arcPath: path };
  }, [u, v]);

  const pu = toPx(u[0], u[1]);
  const pv = toPx(v[0], v[1]);
  const tone = dot > 0.06 ? "#4ade80" : dot < -0.06 ? "#fb7185" : "#fbbf24";
  const toneWord = dot > 0.06 ? "agree" : dot < -0.06 ? "oppose" : "⟂";
  const gridLines = Array.from({ length: 15 }, (_, i) => i - 7);

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full select-none" role="img" aria-label={`Vectors u and v with dot product ${dot.toFixed(1)}`}>
        <defs>
          <marker id="vv-u" markerWidth="9" markerHeight="9" refX="6.5" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 Z" fill={U_COLOR} /></marker>
          <marker id="vv-v" markerWidth="9" markerHeight="9" refX="6.5" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 Z" fill={V_COLOR} /></marker>
          <radialGradient id="vv-fade" cx="50%" cy="50%" r="62%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="70%" stopColor="#fff" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#000" />
          </radialGradient>
          <mask id="vv-mask"><rect x="0" y="0" width={W} height={H} fill="url(#vv-fade)" /></mask>
          <filter id="vv-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* faded plotting grid */}
        <g mask="url(#vv-mask)">
          {gridLines.map((i) => (
            <g key={i}>
              <line x1={CX + i * UNIT} y1={0} x2={CX + i * UNIT} y2={H} stroke="rgba(255,255,255,0.06)" />
              <line x1={0} y1={CY + i * UNIT} x2={W} y2={CY + i * UNIT} stroke="rgba(255,255,255,0.06)" />
            </g>
          ))}
          <line x1={0} y1={CY} x2={W} y2={CY} stroke="rgba(255,255,255,0.2)" strokeWidth={1.25} />
          <line x1={CX} y1={0} x2={CX} y2={H} stroke="rgba(255,255,255,0.2)" strokeWidth={1.25} />
        </g>

        <path d={arcPath} fill="none" stroke={emphasis === "angle" ? tone : "rgba(255,255,255,0.45)"} strokeWidth={emphasis === "angle" ? 2.5 : 1.5} strokeDasharray="3 3" />

        <g filter="url(#vv-glow)">
          <line x1={CX} y1={CY} x2={pu.x} y2={pu.y} stroke={U_COLOR} strokeWidth={emphasis === "u" ? 5.5 : 4} strokeLinecap="round" markerEnd="url(#vv-u)" />
          <line x1={CX} y1={CY} x2={pv.x} y2={pv.y} stroke={V_COLOR} strokeWidth={emphasis === "v" ? 5.5 : 4} strokeLinecap="round" markerEnd="url(#vv-v)" />
        </g>

        <text x={pu.x + 9} y={pu.y - 8} fill={U_COLOR} fontFamily="Newsreader, Georgia, serif" fontStyle="italic" fontSize="20" fontWeight="600">u</text>
        <text x={pv.x + 9} y={pv.y - 8} fill={V_COLOR} fontFamily="Newsreader, Georgia, serif" fontStyle="italic" fontSize="20" fontWeight="600">v</text>
        <circle cx={CX} cy={CY} r={2.5} fill="rgba(255,255,255,0.6)" />
      </svg>

      {/* readouts — the numbers change as the state interpolates */}
      <div className="mt-3 flex items-center gap-2 px-1">
        <span
          className="inline-flex items-baseline gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-xs tabular-nums"
          style={{ borderColor: `color-mix(in srgb, ${tone} 45%, transparent)`, background: `color-mix(in srgb, ${tone} 12%, transparent)` }}
        >
          <span className="text-white/55">u · v</span>
          <span className="font-semibold" style={{ color: tone }}>{dot.toFixed(1)}</span>
          <span className="text-white/40">· {toneWord}</span>
        </span>
        <span className="inline-flex items-baseline gap-1.5 rounded-lg border border-white/12 bg-white/[0.04] px-2.5 py-1 font-mono text-xs tabular-nums text-white/70">
          <span className="text-white/45">θ</span> {Math.round(angleDeg)}°
        </span>
      </div>
    </div>
  );
};

export default VectorVisual;
