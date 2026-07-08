import React, { useEffect, useMemo, useRef, useState } from "react";
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

const COORD_TOLERANCE = 0.35;
const det = (ux: number, uy: number, vx: number, vy: number) => ux * vy - uy * vx;

interface Vec {
  id: "b1" | "b2";
  x: number;
  y: number;
  color: string;
  label: string;
}

const COLOR_B1 = "#a78bfa";
const COLOR_B2 = "#38bdf8";
const COLOR_TARGET = "#fbbf24";

const STANDARD: Vec[] = [
  { id: "b1", x: 1, y: 0, color: COLOR_B1, label: "b₁" },
  { id: "b2", x: 0, y: 1, color: COLOR_B2, label: "b₂" },
];

const CUSTOM_INITIAL: Vec[] = [
  { id: "b1", x: 1, y: 0.5, color: COLOR_B1, label: "b₁" },
  { id: "b2", x: 0.5, y: 1.5, color: COLOR_B2, label: "b₂" },
];

const TARGET = { x: 2, y: 3 };

function solveCoords(
  bx1: number,
  by1: number,
  bx2: number,
  by2: number,
  tx: number,
  ty: number
): [number, number] | null {
  const d = det(bx1, by1, bx2, by2);
  if (Math.abs(d) < 0.01) return null;
  const c1 = (tx * by2 - ty * bx2) / d;
  const c2 = (bx1 * ty - by1 * tx) / d;
  return [c1, c2];
}

function isStandardBasis(b1: Vec, b2: Vec) {
  return (
    Math.abs(b1.x - 1) < 0.05 &&
    Math.abs(b1.y) < 0.05 &&
    Math.abs(b2.x) < 0.05 &&
    Math.abs(b2.y - 1) < 0.05
  );
}

export const BasisExplorer = ({ onStateChange }: InteractiveProps = {}) => {
  const [useStandard, setUseStandard] = useState(true);
  const [vectors, setVectors] = useState<Vec[]>(STANDARD.map((v) => ({ ...v })));
  const [coords, setCoords] = useState<[number, number]>([2, 3]);
  const [dragging, setDragging] = useState<"b1" | "b2" | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const b1 = vectors[0];
  const b2 = vectors[1];
  const independent = Math.abs(det(b1.x, b1.y, b2.x, b2.y)) > 0.1;
  const actual = useMemo(
    () => [coords[0] * b1.x + coords[1] * b2.x, coords[0] * b1.y + coords[1] * b2.y] as [number, number],
    [coords, b1, b2]
  );
  const targetCoords = useMemo(
    () => solveCoords(b1.x, b1.y, b2.x, b2.y, TARGET.x, TARGET.y),
    [b1, b2]
  );

  const standard = useStandard && isStandardBasis(b1, b2);
  const custom = !useStandard && independent;
  const coordsMatch =
    targetCoords !== null &&
    Math.abs(coords[0] - targetCoords[0]) < COORD_TOLERANCE &&
    Math.abs(coords[1] - targetCoords[1]) < COORD_TOLERANCE;

  let tone = "explore";
  if (standard) tone = "standard";
  else if (custom) tone = "custom";
  if (coordsMatch) tone = "coords";

  const toggleStandard = (on: boolean) => {
    setUseStandard(on);
    setVectors(on ? STANDARD.map((v) => ({ ...v })) : CUSTOM_INITIAL.map((v) => ({ ...v })));
    if (on) setCoords([TARGET.x, TARGET.y]);
    else if (targetCoords) setCoords([Math.round(targetCoords[0]), Math.round(targetCoords[1])]);
  };

  const onPointerDown = (id: "b1" | "b2") => (e: React.PointerEvent) => {
    if (useStandard) return;
    e.preventDefault();
    e.stopPropagation();
    const svg = svgRef.current;
    if (!svg) return;
    svg.setPointerCapture(e.pointerId);
    setDragging(id);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || useStandard) return;
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

  const reportRef = useRef(onStateChange);
  reportRef.current = onStateChange;
  useEffect(() => {
    reportRef.current?.({ tone, coords, actual, target: TARGET, standard, custom, coordsMatch });
    if (standard) reportRef.current?.({ tone: "standard", coords, actual, target: TARGET });
    if (custom) reportRef.current?.({ tone: "custom", coords, actual, target: TARGET });
    if (coordsMatch) reportRef.current?.({ tone: "coords", coords, actual, target: TARGET });
  }, [tone, coords, actual, standard, custom, coordsMatch]);

  const origin = mathToSvg(0, 0);
  const tipTarget = mathToSvg(TARGET.x, TARGET.y);
  const tipActual = mathToSvg(actual[0], actual[1]);
  // Skewed grid lines along basis directions.
  const gridLines = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let i = -GRID_SIZE; i <= GRID_SIZE; i++) {
      const p1 = mathToSvg(i * b1.x, i * b1.y);
      const p2 = mathToSvg(i * b1.x + GRID_SIZE * b2.x, i * b1.y + GRID_SIZE * b2.y);
      lines.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y });
      const q1 = mathToSvg(i * b2.x, i * b2.y);
      const q2 = mathToSvg(i * b2.x + GRID_SIZE * b1.x, i * b2.y + GRID_SIZE * b1.y);
      lines.push({ x1: q1.x, y1: q1.y, x2: q2.x, y2: q2.y });
    }
    return lines;
  }, [b1, b2]);

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
              aria-label="Basis change diagram with skewed grid and target point"
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
            >
              {gridLines.map((line, i) => (
                <line key={i} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
              ))}

              <g>
                {axisLabels.map((val) => {
                  const gx = mathToSvg(val, 0).x;
                  const gy = mathToSvg(0, val).y;
                  return (
                    <React.Fragment key={val}>
                      <line x1={gx} y1={0} x2={gx} y2={SVG_HEIGHT} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
                      <line x1={0} y1={gy} x2={SVG_WIDTH} y2={gy} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
                    </React.Fragment>
                  );
                })}
              </g>

              <line x1={0} y1={SVG_HEIGHT / 2} x2={SVG_WIDTH} y2={SVG_HEIGHT / 2} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
              <line x1={SVG_WIDTH / 2} y1={0} x2={SVG_WIDTH / 2} y2={SVG_HEIGHT} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />

              {vectors.map((vec) => {
                const tip = mathToSvg(vec.x, vec.y);
                const isDragging = dragging === vec.id;
                return (
                  <g key={vec.id} style={{ cursor: useStandard ? "default" : "pointer" }}>
                    <VectorArrow
                      x1={origin.x}
                      y1={origin.y}
                      x2={tip.x}
                      y2={tip.y}
                      color={vec.color}
                      strokeWidth={isDragging ? 5 : 3.5}
                    />
                    <text x={tip.x + 10} y={tip.y - 8} fontSize="16" fontFamily="serif" fontStyle="italic" fill={vec.color} fontWeight="bold" style={{ pointerEvents: "none" }}>
                      {vec.label}
                    </text>
                    {!useStandard && (
                      <circle
                        cx={tip.x}
                        cy={tip.y}
                        r={isDragging ? 16 : 12}
                        fill="#1a1030"
                        stroke={vec.color}
                        strokeWidth={3}
                        style={{ cursor: "grab", touchAction: "none" }}
                        onPointerDown={onPointerDown(vec.id)}
                        aria-label={`Drag basis vector ${vec.label}`}
                        role="slider"
                        tabIndex={0}
                      />
                    )}
                  </g>
                );
              })}

              <circle cx={tipTarget.x} cy={tipTarget.y} r={10} fill={COLOR_TARGET} fillOpacity={0.25} stroke={COLOR_TARGET} strokeWidth={2} />
              <text x={tipTarget.x + 14} y={tipTarget.y - 6} fontSize="13" fill={COLOR_TARGET} fontFamily="monospace">
                target [{TARGET.x}, {TARGET.y}]
              </text>

              <circle cx={tipActual.x} cy={tipActual.y} r={7} fill="#34d399" stroke="#fff" strokeWidth={1.5} />
              <line x1={origin.x} y1={origin.y} x2={tipActual.x} y2={tipActual.y} stroke="#34d399" strokeWidth={2} strokeDasharray="4 3" />

              <circle cx={origin.x} cy={origin.y} r={3} fill="rgba(255,255,255,0.5)" />
            </svg>
          </div>
          <p className="text-center text-xs text-white/40 italic mt-2">
            The skewed grid follows your basis. Match the target point by finding the right coordinates.
          </p>
        </div>

        <div className="w-full lg:w-72 flex flex-col gap-3">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <div className="text-[11px] uppercase tracking-wider text-white/50 mb-2">Basis mode</div>
            <div className="flex gap-2">
              <button
                onClick={() => toggleStandard(true)}
                className={`flex-1 rounded-lg border px-3 py-2 text-xs transition ${
                  useStandard ? "border-violet-400/50 bg-violet-400/10 text-violet-100" : "border-white/10 text-white/60 hover:bg-white/[0.05]"
                }`}
              >
                Standard · e₁=[1,0], e₂=[0,1]
              </button>
              <button
                onClick={() => toggleStandard(false)}
                className={`flex-1 rounded-lg border px-3 py-2 text-xs transition ${
                  !useStandard ? "border-sky-400/50 bg-sky-400/10 text-sky-100" : "border-white/10 text-white/60 hover:bg-white/[0.05]"
                }`}
              >
                Custom basis
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <div className="text-[11px] uppercase tracking-wider text-white/50 mb-2">Coordinates in basis</div>
            <div className="flex gap-3">
              <CoordInput
                label="c₁"
                value={coords[0]}
                onChange={(v) => setCoords([v, coords[1]])}
                color={COLOR_B1}
              />
              <CoordInput
                label="c₂"
                value={coords[1]}
                onChange={(v) => setCoords([coords[0], v])}
                color={COLOR_B2}
              />
            </div>
            <div className="mt-3 font-mono text-xs text-white/60">
              c₁·b₁ + c₂·b₂ = [{actual[0].toFixed(1)}, {actual[1].toFixed(1)}]
            </div>
            {targetCoords && (
              <div className="mt-1 text-xs text-amber-300/80">
                Target needs ≈ [{targetCoords[0].toFixed(1)}, {targetCoords[1].toFixed(1)}] in this basis
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CoordInput = ({
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
  <div className="flex-1">
    <label className="font-serif italic text-sm" style={{ color }}>{label}</label>
    <input
      type="number"
      step={0.5}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      className="mt-1 w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-sm font-mono text-white/90 text-center"
      aria-label={`Coordinate ${label}`}
    />
  </div>
);

export default BasisExplorer;
