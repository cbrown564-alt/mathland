import React, { useEffect, useRef, useState } from "react";
import type { InteractiveProps } from "./interactives";
import { VectorArrow } from "@/core/components/narrative/VectorArrow";
import { createPlotCoords, NARRATIVE_PLOT } from "./plotCoords";

const {
  width: SVG_WIDTH,
  height: SVG_HEIGHT,
  gridSize: GRID_SIZE,
  mathToSvg,
  svgToMath,
  scalePointer,
  axisLabels,
  snapToGrid,
  clamp,
} = createPlotCoords(NARRATIVE_PLOT);
const det = (ux: number, uy: number, vx: number, vy: number) => ux * vy - uy * vx;

interface Vec {
  id: "u" | "v";
  x: number;
  y: number;
  color: string;
  label: string;
}

const COLOR_U = "#a78bfa";
const COLOR_V = "#38bdf8";
const COLOR_RESULT = "#34d399";

const INITIAL: Vec[] = [
  { id: "u", x: 2, y: 1, color: COLOR_U, label: "u" },
  { id: "v", x: 1, y: 2, color: COLOR_V, label: "v" },
];

function classifyTone(a: number, b: number, d: number): string {
  if (Math.abs(a) < 0.05 && Math.abs(b) < 0.05) return "zero";
  if (Math.abs(b) < 0.05 && Math.abs(a) > 0.05) return "u_only";
  if (Math.abs(a) < 0.05 && Math.abs(b) > 0.05) return "v_only";
  if (Math.abs(d) <= 0.1) return "dependent";
  if (Math.abs(a) > 0.05 && Math.abs(b) > 0.05) return "span2d";
  return "independent";
}

export const SpanExplorer = ({ onStateChange }: InteractiveProps = {}) => {
  const [vectors, setVectors] = useState<Vec[]>(INITIAL);
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const [dragging, setDragging] = useState<"u" | "v" | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const u = vectors[0];
  const v = vectors[1];
  const d = det(u.x, u.y, v.x, v.y);
  const rx = a * u.x + b * v.x;
  const ry = a * u.y + b * v.y;
  const tone = classifyTone(a, b, d);
  const independent = Math.abs(d) > 0.1;

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
    const { x: svgX, y: svgY } = scalePointer(e.clientX, e.clientY, rect);
    const math = svgToMath(svgX, svgY);
    const snapped = { x: snapToGrid(math.x), y: snapToGrid(math.y) };
    const { x: clampedX, y: clampedY } = clamp(snapped.x, snapped.y);
    setVectors((prev) =>
      prev.map((vec) => (vec.id === dragging ? { ...vec, x: clampedX, y: clampedY } : vec))
    );
  };

  const onPointerUp = (e: React.PointerEvent) => {
    setDragging(null);
    const svg = svgRef.current;
    if (svg && e.pointerId !== undefined) svg.releasePointerCapture(e.pointerId);
  };

  const onKeyDown = (id: "u" | "v") => (e: React.KeyboardEvent) => {
    const delta = e.shiftKey ? 1 : 0.5;
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
    e.preventDefault();
    setVectors((current) => current.map((vec) => {
      if (vec.id !== id) return vec;
      const next = clamp(
        vec.x + (e.key === "ArrowRight" ? delta : e.key === "ArrowLeft" ? -delta : 0),
        vec.y + (e.key === "ArrowUp" ? delta : e.key === "ArrowDown" ? -delta : 0),
      );
      return { ...vec, ...next };
    }));
  };

  const reportRef = useRef(onStateChange);
  reportRef.current = onStateChange;
  useEffect(() => {
    const base = { tone, a, b, det: d, rx, ry };
    reportRef.current?.(base);
    // Geometric tones fire alongside coefficient tones so independence lessons
    // can gate on det without conflicting with combination goals.
    if (independent) reportRef.current?.({ ...base, tone: "independent" });
    if (Math.abs(d) <= 0.1 && tone !== "zero") reportRef.current?.({ ...base, tone: "dependent" });
  }, [tone, a, b, d, rx, ry, independent]);

  const origin = mathToSvg(0, 0);
  const tipU = mathToSvg(u.x, u.y);
  const tipV = mathToSvg(v.x, v.y);
  const tipR = mathToSvg(rx, ry);

  // Parallelogram corners for span shading when independent.
  const parallelogram =
    independent && (Math.abs(a) > 0.05 || Math.abs(b) > 0.05)
      ? [
          mathToSvg(0, 0),
          mathToSvg(u.x, u.y),
          mathToSvg(u.x + v.x, u.y + v.y),
          mathToSvg(v.x, v.y),
        ]
      : null;

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur p-2">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
              className="w-full h-auto select-none touch-none"
              role="img"
              aria-label="Span of vectors u and v with linear combination result"
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
            >
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

              <line x1={0} y1={SVG_HEIGHT / 2} x2={SVG_WIDTH} y2={SVG_HEIGHT / 2} stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} />
              <line x1={SVG_WIDTH / 2} y1={0} x2={SVG_WIDTH / 2} y2={SVG_HEIGHT} stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} />

              {parallelogram && (
                <polygon
                  points={parallelogram.map((p) => `${p.x},${p.y}`).join(" ")}
                  fill="rgba(52,211,153,0.12)"
                  stroke="rgba(52,211,153,0.25)"
                  strokeWidth={1}
                />
              )}

              {independent && (
                <polygon
                  points={[
                    mathToSvg(-3 * u.x - 2 * v.x, -3 * u.y - 2 * v.y),
                    mathToSvg(3 * u.x - 2 * v.x, 3 * u.y - 2 * v.y),
                    mathToSvg(3 * u.x + 3 * v.x, 3 * u.y + 3 * v.y),
                    mathToSvg(-3 * u.x + 3 * v.x, -3 * u.y + 3 * v.y),
                  ]
                    .map((p) => `${p.x},${p.y}`)
                    .join(" ")}
                  fill="rgba(167,139,250,0.06)"
                  stroke="none"
                />
              )}

              {vectors.map((vec) => {
                const tip = mathToSvg(vec.x, vec.y);
                const isDragging = dragging === vec.id;
                return (
                  <g key={vec.id} style={{ cursor: "pointer" }}>
                    <VectorArrow
                      x1={origin.x}
                      y1={origin.y}
                      x2={tip.x}
                      y2={tip.y}
                      color={vec.color}
                      strokeWidth={isDragging ? 5 : 3.5}
                      filter={isDragging ? `drop-shadow(0 0 8px ${vec.color}aa)` : undefined}
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
                      style={{ cursor: "grab", touchAction: "none" }}
                      onPointerDown={onPointerDown(vec.id)}
                      aria-label={`Drag vector ${vec.label}`}
                      role="slider"
                      tabIndex={0}
                      aria-valuemin={-GRID_SIZE}
                      aria-valuemax={GRID_SIZE}
                      aria-valuenow={vec.x}
                      aria-valuetext={`${vec.label} = [${vec.x.toFixed(1)}, ${vec.y.toFixed(1)}]. Use left and right for x; up and down for y.`}
                      onKeyDown={onKeyDown(vec.id)}
                    />
                  </g>
                );
              })}

              {tone !== "zero" && (
                <VectorArrow
                  x1={origin.x}
                  y1={origin.y}
                  x2={tipR.x}
                  y2={tipR.y}
                  color={COLOR_RESULT}
                  strokeWidth={4}
                  strokeDasharray="6 4"
                />
              )}

              <circle cx={origin.x} cy={origin.y} r={3} fill="rgba(255,255,255,0.5)" />
            </svg>
          </div>
          <p className="text-center text-xs text-white/40 italic mt-2">
            Drag u and v, then mix with the sliders. The shaded region is the span when u and v are independent.
          </p>
        </div>

        <div className="w-full lg:w-72 flex flex-col gap-3">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <div className="text-[11px] uppercase tracking-wider text-white/50 mb-3">Coefficients</div>
            <SliderRow label="a" value={a} onChange={setA} color={COLOR_U} />
            <SliderRow label="b" value={b} onChange={setB} color={COLOR_V} />
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <div className="mb-2 text-[11px] uppercase tracking-wider text-white/50">Guided presets</div>
            <div className="grid gap-2">
              <button type="button" onClick={() => { setVectors(INITIAL); setA(0); setB(0); }} className="rounded-lg border border-white/15 px-3 py-2 text-left text-xs text-white/75 hover:bg-white/10">Zero combination</button>
              <button type="button" onClick={() => { setVectors(INITIAL); setA(1); setB(0); }} className="rounded-lg border border-white/15 px-3 py-2 text-left text-xs text-white/75 hover:bg-white/10">Use u only</button>
              <button type="button" onClick={() => { setVectors(INITIAL); setA(1); setB(1); }} className="rounded-lg border border-white/15 px-3 py-2 text-left text-xs text-white/75 hover:bg-white/10">Mix both; span the plane</button>
              <button type="button" onClick={() => { setVectors([{ ...INITIAL[0] }, { ...INITIAL[1], x: 4, y: 2 }]); setA(1); setB(1); }} className="rounded-lg border border-white/15 px-3 py-2 text-left text-xs text-white/75 hover:bg-white/10">Make vectors dependent</button>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <div className="text-[11px] uppercase tracking-wider text-white/50 mb-1">Result</div>
            <div className="font-mono text-lg text-emerald-300">
              {a.toFixed(1)}·u + {b.toFixed(1)}·v = [{rx.toFixed(1)}, {ry.toFixed(1)}]
            </div>
            <div className="mt-2 text-xs text-white/50">
              det(u, v) = {d.toFixed(2)}
              {independent ? " · spans the plane" : " · collinear"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SliderRow = ({
  label,
  value,
  onChange,
  color,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  color: string;
}) => (
  <div className="mb-3 last:mb-0">
    <div className="flex items-center justify-between mb-1">
      <span className="font-serif italic text-sm" style={{ color }}>{label}</span>
      <span className="font-mono text-xs text-white/70">{value.toFixed(1)}</span>
    </div>
    <input
      type="range"
      min={-3}
      max={3}
      step={0.1}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full accent-violet-400"
      aria-label={`Coefficient ${label}`}
    />
  </div>
);

export default SpanExplorer;
