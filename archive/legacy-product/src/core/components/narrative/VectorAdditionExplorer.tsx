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
  snapToGrid: snap,
  clamp,
} = createPlotCoords(NARRATIVE_PLOT);

const U_COLOR = "#f4623c";
const V_COLOR = "#5aa2e0";
const SUM_COLOR = "#a3e635";

interface Vec {
  id: "u" | "v";
  x: number;
  y: number;
  color: string;
}

function classify(u: Vec, v: Vec): string {
  const sx = u.x + v.x;
  const sy = u.y + v.y;
  if (Math.abs(sx - 4) < 0.6 && Math.abs(sy - 6) < 0.6) return "sum46";
  if (u.x < -0.5 || u.y < -0.5) return "flip";
  if (Math.hypot(sx, sy) > 6.5) return "long";
  return "explore";
}

export const VectorAdditionExplorer = ({ onStateChange }: InteractiveProps = {}) => {
  const [vectors, setVectors] = useState<Vec[]>([
    { id: "u", x: 3, y: 2, color: U_COLOR },
    { id: "v", x: 1, y: 4, color: V_COLOR },
  ]);
  const [dragging, setDragging] = useState<"u" | "v" | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const reportRef = useRef(onStateChange);
  reportRef.current = onStateChange;

  const u = vectors[0];
  const v = vectors[1];
  const sum = { x: u.x + v.x, y: u.y + v.y };
  const tone = classify(u, v);

  useEffect(() => {
    reportRef.current?.({ dot: sum.x, cos: sum.y, tone });
  }, [sum.x, sum.y, tone]);

  const onPointerDown = (id: "u" | "v") => (e: React.PointerEvent) => {
    e.preventDefault();
    svgRef.current?.setPointerCapture(e.pointerId);
    setDragging(id);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const { x: svgX, y: svgY } = scalePointer(e.clientX, e.clientY, rect);
    const math = svgToMath(svgX, svgY);
    const { x: clampedX, y: clampedY } = clamp(snap(math.x), snap(math.y));
    setVectors((prev) =>
      prev.map((vec) => (vec.id === dragging ? { ...vec, x: clampedX, y: clampedY } : vec)),
    );
  };

  const onPointerUp = (e: React.PointerEvent) => {
    setDragging(null);
    svgRef.current?.releasePointerCapture(e.pointerId);
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

  const origin = mathToSvg(0, 0);
  const pu = mathToSvg(u.x, u.y);
  const pv = mathToSvg(v.x, v.y);
  const ps = mathToSvg(sum.x, sum.y);

  return (
    <div className="w-full">
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="w-full select-none touch-none"
          role="img"
          aria-label="Vector addition parallelogram with u, v, and u+v"
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
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
          <line x1={0} y1={SVG_HEIGHT / 2} x2={SVG_WIDTH} y2={SVG_HEIGHT / 2} stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} />
          <line x1={SVG_WIDTH / 2} y1={0} x2={SVG_WIDTH / 2} y2={SVG_HEIGHT} stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} />
          <g stroke="rgba(255,255,255,0.2)" strokeWidth={1} strokeDasharray="4 4">
            <line x1={pu.x} y1={pu.y} x2={ps.x} y2={ps.y} />
            <line x1={pv.x} y1={pv.y} x2={ps.x} y2={ps.y} />
          </g>
          <VectorArrow x1={origin.x} y1={origin.y} x2={pu.x} y2={pu.y} color={U_COLOR} strokeWidth={3.5} />
          <VectorArrow x1={origin.x} y1={origin.y} x2={pv.x} y2={pv.y} color={V_COLOR} strokeWidth={3.5} />
          <VectorArrow x1={origin.x} y1={origin.y} x2={ps.x} y2={ps.y} color={SUM_COLOR} strokeWidth={4} />
          {vectors.map((vec) => {
            const tip = mathToSvg(vec.x, vec.y);
            return (
              <circle
                key={vec.id}
                cx={tip.x}
                cy={tip.y}
                r={dragging === vec.id ? 16 : 12}
                fill="#1a1030"
                stroke={vec.color}
                strokeWidth={3}
                style={{ cursor: "grab", touchAction: "none" }}
                aria-label={`Drag vector ${vec.id} tip`}
                role="slider"
                tabIndex={0}
                aria-valuemin={-GRID_SIZE}
                aria-valuemax={GRID_SIZE}
                aria-valuenow={vec.x}
                aria-valuetext={`${vec.id} = [${vec.x.toFixed(1)}, ${vec.y.toFixed(1)}]. Use left and right for x; up and down for y.`}
                onKeyDown={onKeyDown(vec.id)}
                onPointerDown={onPointerDown(vec.id)}
              />
            );
          })}
          <circle cx={origin.x} cy={origin.y} r={3} fill="rgba(255,255,255,0.5)" />
        </svg>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 font-mono text-xs">
        <span className="rounded-lg border border-white/12 bg-white/[0.04] px-2.5 py-1 text-white/70">
          u+v = [{sum.x.toFixed(1)}, {sum.y.toFixed(1)}]
        </span>
        <span className="rounded-lg border border-lime-400/25 bg-lime-400/[0.06] px-2.5 py-1 text-lime-100/80">
          |u+v| = {Math.hypot(sum.x, sum.y).toFixed(2)}
        </span>
      </div>
      <p className="mt-2 text-center text-xs italic text-white/40">Drag u and v — the green arrow is always u + v.</p>
      <div className="mt-3 flex flex-wrap justify-center gap-2" aria-label="Guided addition presets">
        <button type="button" onClick={() => setVectors([{ id: "u", x: 3, y: 2, color: U_COLOR }, { id: "v", x: 1, y: 4, color: V_COLOR }])} className="rounded-full border border-white/15 px-3 py-2 text-xs text-white/75 hover:bg-white/10">Make sum [4, 6]</button>
        <button type="button" onClick={() => setVectors([{ id: "u", x: -2, y: -1, color: U_COLOR }, { id: "v", x: 1, y: 2, color: V_COLOR }])} className="rounded-full border border-white/15 px-3 py-2 text-xs text-white/75 hover:bg-white/10">Flip u negative</button>
        <button type="button" onClick={() => setVectors([{ id: "u", x: 4, y: 3, color: U_COLOR }, { id: "v", x: 3, y: 2, color: V_COLOR }])} className="rounded-full border border-white/15 px-3 py-2 text-xs text-white/75 hover:bg-white/10">Stretch the sum</button>
      </div>
    </div>
  );
};

export default VectorAdditionExplorer;
