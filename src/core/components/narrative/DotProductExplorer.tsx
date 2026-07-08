import React, { useEffect, useRef, useState } from "react";
import type { InteractiveProps } from "./interactives";

// Dot Product Explorer — the narrative's climax beat (Path C3).
//
// Two draggable vectors **u** and **v**. The dot product is computed live three
// ways (algebraic, geometric, similarity) so the learner can *see* the lesson's
// "agreement scale" metaphor. Reuses the SVG drag-handle pattern from
// vera_vector_playground.tsx (mathToSvg / pointer capture / snap-to-grid) but
// dark-themed to sit inside the immersive narrative shell.

// --- coordinate math -------------------------------------------------------
const GRID_SIZE = 5; // ±5 units visible from the origin
const SVG_WIDTH = 560;
const SVG_HEIGHT = 420;

const mathToSvg = (x: number, y: number) => ({
  x: SVG_WIDTH / 2 + (x * SVG_WIDTH) / (2 * GRID_SIZE),
  y: SVG_HEIGHT / 2 - (y * SVG_HEIGHT) / (2 * GRID_SIZE),
});

const svgToMath = (x: number, y: number) => ({
  x: ((x - SVG_WIDTH / 2) * (2 * GRID_SIZE)) / SVG_WIDTH,
  y: -((y - SVG_HEIGHT / 2) * (2 * GRID_SIZE)) / SVG_HEIGHT,
});

const snapToGrid = (val: number) => Math.round(val * 2) / 2; // 0.5 unit steps
const magnitude = (x: number, y: number) => Math.sqrt(x * x + y * y);

interface Vec {
  id: "u" | "v";
  x: number;
  y: number;
  color: string;
  label: string;
}

// Two *categorical* series colours for the vectors — distinguishable on the dark
// stage. The character brand is carried by the surrounding chrome (--ch-accent),
// so these stay neutral rather than hardcoding one character's palette.
const COLOR_U = "#a78bfa"; // violet
const COLOR_V = "#38bdf8"; // sky

const INITIAL: Vec[] = [
  { id: "u", x: 3, y: 4, color: COLOR_U, label: "u" }, // [3,4] from the concept check
  { id: "v", x: 1, y: 2, color: COLOR_V, label: "v" }, // [1,2] → dot = 11
];

// Preset challenges that seed exploration (match the lesson's three outcomes).
const PRESETS: { label: string; u: Vec; v: Vec; hint: string }[] = [
  {
    label: "Same direction",
    hint: "dot > 0 · vectors agree",
    u: { id: "u", x: 3, y: 2, color: COLOR_U, label: "u" },
    v: { id: "v", x: 2, y: 1.5, color: COLOR_V, label: "v" },
  },
  {
    label: "Perpendicular",
    hint: "dot = 0 · orthogonal",
    u: { id: "u", x: 3, y: 0, color: COLOR_U, label: "u" },
    v: { id: "v", x: 0, y: 3, color: COLOR_V, label: "v" },
  },
  {
    label: "Opposite",
    hint: "dot < 0 · vectors clash",
    u: { id: "u", x: 3, y: 1, color: COLOR_U, label: "u" },
    v: { id: "v", x: -3, y: -1, color: COLOR_V, label: "v" },
  },
];

// Similarity meter: normalized dot product to [-1, 1]. Returns a descriptor for
// color + label so the meter reads the lesson's "agreement scale" directly.
function similarity(u: Vec, v: Vec) {
  const mu = magnitude(u.x, u.y);
  const mv = magnitude(v.x, v.y);
  const dot = u.x * v.x + u.y * v.y;
  const cos = mu > 0 && mv > 0 ? dot / (mu * mv) : 0;
  // Classify: >0.05 same, <-0.05 opposite, else perpendicular.
  let tone: "same" | "ortho" | "opposite" = "ortho";
  if (cos > 0.05) tone = "same";
  else if (cos < -0.05) tone = "opposite";
  return { dot, cos, tone };
}

const toneColor: Record<string, string> = {
  same: "#34d399", // emerald
  ortho: "#fbbf24", // amber
  opposite: "#f87171", // red
};

const toneWord: Record<string, string> = {
  same: "agreeing",
  ortho: "perpendicular",
  opposite: "opposing",
};

export const DotProductExplorer = ({ onStateChange }: InteractiveProps = {}) => {
  const [vectors, setVectors] = useState<Vec[]>(INITIAL);
  const [dragging, setDragging] = useState<"u" | "v" | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const u = vectors[0];
  const v = vectors[1];

  const onPointerDown = (id: "u" | "v") => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const svg = svgRef.current;
    if (!svg) return;
    svg.setPointerCapture(e.pointerId);
    setDragging(id);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    e.preventDefault();
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    // Scale client coords into the viewBox coordinate space.
    const scaleX = SVG_WIDTH / rect.width;
    const scaleY = SVG_HEIGHT / rect.height;
    const svgX = (e.clientX - rect.left) * scaleX;
    const svgY = (e.clientY - rect.top) * scaleY;
    const math = svgToMath(svgX, svgY);
    const snapped = { x: snapToGrid(math.x), y: snapToGrid(math.y) };
    // Keep the tip on-canvas (never let a vector collapse to zero length).
    const clampedX = Math.max(-GRID_SIZE, Math.min(GRID_SIZE, snapped.x));
    const clampedY = Math.max(-GRID_SIZE, Math.min(GRID_SIZE, snapped.y));
    setVectors((prev) =>
      prev.map((vec) =>
        vec.id === dragging ? { ...vec, x: clampedX, y: clampedY } : vec
      )
    );
  };

  const onPointerUp = (e: React.PointerEvent) => {
    setDragging(null);
    const svg = svgRef.current;
    if (svg && e.pointerId !== undefined) {
      svg.releasePointerCapture(e.pointerId);
    }
  };

  const applyPreset = (idx: number) => {
    const p = PRESETS[idx];
    setVectors([
      { ...p.u },
      { ...p.v },
    ]);
  };

  const reset = () => setVectors(INITIAL.map((vec) => ({ ...vec })));

  const { dot, cos, tone } = similarity(u, v);

  // Report state upward without re-subscribing on every parent render.
  const reportRef = useRef(onStateChange);
  reportRef.current = onStateChange;
  useEffect(() => {
    reportRef.current?.({ dot, cos, tone });
  }, [dot, cos, tone]);

  const angleDeg = (Math.acos(Math.max(-1, Math.min(1, cos))) * 180) / Math.PI;
  const mu = magnitude(u.x, u.y);
  const mv = magnitude(v.x, v.y);

  // Similarity meter geometry: cos in [-1,1] → 0..100% of the bar.
  const meterPct = ((cos + 1) / 2) * 100;

  const axisLabels = Array.from({ length: 2 * GRID_SIZE + 1 }, (_, i) => i - GRID_SIZE);

  return (
    <div className="w-full">{/* inherits data-character (→ --ch-accent) from the story root */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Plot */}
        <div className="flex-1 min-w-0">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur p-2">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
              className="w-full h-auto select-none touch-none"
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
            >
              <defs>
                <marker id="dpe-arrow-u" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L8,3 L0,6 Z" fill={COLOR_U} />
                </marker>
                <marker id="dpe-arrow-v" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L8,3 L0,6 Z" fill={COLOR_V} />
                </marker>
              </defs>

              {/* grid */}
              <g>
                {axisLabels.map((val) => {
                  const gx = mathToSvg(val, 0).x;
                  const gy = mathToSvg(0, val).y;
                  return (
                    <React.Fragment key={val}>
                      <line x1={gx} y1={0} x2={gx} y2={SVG_HEIGHT} stroke="rgba(255,255,255,0.06)" strokeWidth={val === 0 ? 0 : 1} />
                      <line x1={0} y1={gy} x2={SVG_WIDTH} y2={gy} stroke="rgba(255,255,255,0.06)" strokeWidth={val === 0 ? 0 : 1} />
                    </React.Fragment>
                  );
                })}
              </g>

              {/* axes */}
              <line x1={0} y1={SVG_HEIGHT / 2} x2={SVG_WIDTH} y2={SVG_HEIGHT / 2} stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} />
              <line x1={SVG_WIDTH / 2} y1={0} x2={SVG_WIDTH / 2} y2={SVG_HEIGHT} stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} />

              {/* angle arc between u and v */}
              {mu > 0 && mv > 0 && (
                <AngleArc u={u} v={v} color="rgba(255,255,255,0.5)" angleDeg={angleDeg} />
              )}

              {/* vectors */}
              {vectors.map((vec) => {
                const origin = mathToSvg(0, 0);
                const tip = mathToSvg(vec.x, vec.y);
                const isDragging = dragging === vec.id;
                return (
                  <g key={vec.id} style={{ cursor: "pointer" }}>
                    <line
                      x1={origin.x}
                      y1={origin.y}
                      x2={tip.x}
                      y2={tip.y}
                      stroke={vec.color}
                      strokeWidth={isDragging ? 5 : 3.5}
                      markerEnd={`url(#dpe-arrow-${vec.id})`}
                      style={{
                        filter: isDragging ? `drop-shadow(0 0 8px ${vec.color}aa)` : `drop-shadow(0 1px 2px rgba(0,0,0,0.4))`,
                        transition: "stroke-width 0.15s",
                      }}
                    />
                    <text x={tip.x + 10} y={tip.y - 8} fontSize="18" fontFamily="serif" fontStyle="italic" fill={vec.color} fontWeight="bold" style={{ pointerEvents: "none" }}>
                      {vec.label}
                    </text>
                    <circle
                      cx={tip.x}
                      cy={tip.y}
                      r={isDragging ? 16 : 12}
                      fill="#1a1030"
                      stroke={vec.color}
                      strokeWidth={3}
                      style={{ cursor: "grab", transition: "r 0.15s", touchAction: "none" }}
                      onPointerDown={onPointerDown(vec.id)}
                      aria-label={`Drag vector ${vec.label}`}
                      role="slider"
                      tabIndex={0}
                    />
                  </g>
                );
              })}

              {/* origin */}
              <circle cx={SVG_WIDTH / 2} cy={SVG_HEIGHT / 2} r={3} fill="rgba(255,255,255,0.5)" />
            </svg>
          </div>
          <p className="text-center text-xs text-white/40 italic mt-2">
            Drag the handles to change u and v. Try to land on each outcome below.
          </p>
        </div>

        {/* Live readouts */}
        <div className="w-full lg:w-72 flex flex-col gap-3">
          <Readout label="Algebraic" formula="u₁v₁ + u₂v₂" value={dot.toFixed(2)} accent={toneColor[tone]} />
          <Readout label="Geometric" formula="|u||v|cos θ" value={dot.toFixed(2)} accent={toneColor[tone]} />
          <Readout label="Angle θ" formula="between vectors" value={`${angleDeg.toFixed(1)}°`} accent="#c4b5fd" />

          {/* Similarity meter */}
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] uppercase tracking-wider text-white/50">Similarity</span>
              <span className="text-xs font-semibold" style={{ color: toneColor[tone] }}>
                {toneWord[tone]}
              </span>
            </div>
            <div className="relative h-2.5 rounded-full bg-white/10 overflow-hidden">
              {/* center tick (perpendicular) */}
              <span className="absolute left-1/2 top-0 bottom-0 w-px bg-white/30 z-10" />
              <span
                className="absolute top-0 bottom-0 rounded-full transition-all duration-200"
                style={{
                  left: cos >= 0 ? "50%" : `${meterPct}%`,
                  right: cos >= 0 ? `${100 - meterPct}%` : "50%",
                  background: `linear-gradient(90deg, ${toneColor[tone]}, ${toneColor[tone]}cc)`,
                }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-white/40 font-mono mt-1">
              <span>−1 oppose</span>
              <span>0 ⟂</span>
              <span>+1 agree</span>
            </div>
            <div className="mt-2 font-mono text-xs text-white/60">
              cos θ = {cos.toFixed(3)}
            </div>
          </div>

          {/* vector component editor */}
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <div className="text-[11px] uppercase tracking-wider text-white/50 mb-2">Components</div>
            <div className="space-y-2">
              {vectors.map((vec) => (
                <div key={vec.id} className="flex items-center gap-2">
                  <span className="font-serif italic text-sm w-4" style={{ color: vec.color }}>{vec.label}</span>
                  <span className="text-white/40 text-xs">[</span>
                  <input
                    type="number"
                    step="0.5"
                    value={vec.x}
                    aria-label={`${vec.label} x-component`}
                    onChange={(e) => {
                      const x = parseFloat(e.target.value) || 0;
                      setVectors((prev) => prev.map((p) => (p.id === vec.id ? { ...p, x } : p)));
                    }}
                    className="w-12 bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-xs font-mono text-white/90 text-center"
                  />
                  <input
                    type="number"
                    step="0.5"
                    value={vec.y}
                    aria-label={`${vec.label} y-component`}
                    onChange={(e) => {
                      const y = parseFloat(e.target.value) || 0;
                      setVectors((prev) => prev.map((p) => (p.id === vec.id ? { ...p, y } : p)));
                    }}
                    className="w-12 bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-xs font-mono text-white/90 text-center"
                  />
                  <span className="text-white/40 text-xs">]</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Challenge presets */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
        {PRESETS.map((p, i) => (
          <button
            key={p.label}
            onClick={() => applyPreset(i)}
            className="text-left rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] transition-colors px-3 py-2"
          >
            <div className="text-sm font-semibold text-white/90">{p.label}</div>
            <div className="text-[11px] text-white/45 font-mono">{p.hint}</div>
          </button>
        ))}
      </div>
      <div className="mt-2 text-right">
        <button onClick={reset} className="text-xs text-white/50 hover:text-white/80 underline underline-offset-2">
          reset to [3,4]·[1,2]
        </button>
      </div>
    </div>
  );
};

// Small presentational readout card.
const Readout = ({ label, formula, value, accent }: { label: string; formula: string; value: string; accent: string }) => (
  <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
    <div className="flex items-baseline justify-between">
      <span className="text-[11px] uppercase tracking-wider text-white/50">{label}</span>
      <span className="text-[10px] text-white/35 font-mono">{formula}</span>
    </div>
    <div className="text-2xl font-bold mt-0.5" style={{ color: accent }}>
      {value}
    </div>
  </div>
);

// Angle arc between the two vectors, drawn at the origin.
const AngleArc = ({ u, v, color, angleDeg }: { u: Vec; v: Vec; color: string; angleDeg: number }) => {
  const R = 34; // arc radius in svg px
  const origin = mathToSvg(0, 0);
  const angleU = Math.atan2(u.y, u.x); // math angle (y up)
  const angleV = Math.atan2(v.y, v.x);
  // Convert to svg angles (y down) for the arc sweep.
  const a1 = -angleU;
  const a2 = -angleV;
  const p1 = { x: origin.x + R * Math.cos(a1), y: origin.y + R * Math.sin(a1) };
  const p2 = { x: origin.x + R * Math.cos(a2), y: origin.y + R * Math.sin(a2) };
  // Sweep flag: pick the shorter arc.
  let delta = a2 - a1;
  while (delta > Math.PI) delta -= 2 * Math.PI;
  while (delta < -Math.PI) delta += 2 * Math.PI;
  const largeArc = 0;
  const sweep = delta < 0 ? 0 : 1;
  const midAngle = a1 + delta / 2;
  const labelPt = { x: origin.x + (R + 14) * Math.cos(midAngle), y: origin.y + (R + 14) * Math.sin(midAngle) };
  return (
    <g style={{ pointerEvents: "none" }}>
      <path
        d={`M ${p1.x} ${p1.y} A ${R} ${R} 0 ${largeArc} ${sweep} ${p2.x} ${p2.y}`}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeDasharray="3 3"
      />
      <text x={labelPt.x} y={labelPt.y} fontSize="11" fontFamily="monospace" fill="rgba(255,255,255,0.6)" textAnchor="middle" dominantBaseline="middle">
        {angleDeg.toFixed(0)}°
      </text>
    </g>
  );
};

export default DotProductExplorer;
