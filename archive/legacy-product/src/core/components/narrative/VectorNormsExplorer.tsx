import React, { useEffect, useRef, useState } from "react";
import type { InteractiveProps } from "./interactives";
import { VectorArrow } from "@/core/components/narrative/VectorArrow";
import { createPlotCoords, NARRATIVE_PLOT } from "./plotCoords";

const {
  width: SVG_WIDTH,
  height: SVG_HEIGHT,
  gridSize: GRID_SIZE,
  unit: UNIT_R,
  mathToSvg,
  svgToMath,
  scalePointer,
  axisLabels,
  snapToGrid: snap,
  clamp,
} = createPlotCoords(NARRATIVE_PLOT);

const COLOR = "#f4623c";
const l2 = (x: number, y: number) => Math.hypot(x, y);
const l1 = (x: number, y: number) => Math.abs(x) + Math.abs(y);
const linf = (x: number, y: number) => Math.max(Math.abs(x), Math.abs(y));

function classify(x: number, y: number): string {
  const m = l2(x, y);
  if (m >= 4.8 && m <= 5.2 && Math.abs(x - 3) < 0.6 && Math.abs(y - 4) < 0.6) return "classic";
  if (m >= 0.85 && m <= 1.15) return "unit";
  if (l1(x, y) >= 6.5 && l1(x, y) <= 7.5) return "manhattan";
  return "explore";
}

export const VectorNormsExplorer = ({ onStateChange }: InteractiveProps = {}) => {
  const [vec, setVec] = useState({ x: 3, y: 4 });
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const reportRef = useRef(onStateChange);
  reportRef.current = onStateChange;

  const tone = classify(vec.x, vec.y);

  useEffect(() => {
    reportRef.current?.({ dot: l2(vec.x, vec.y), cos: l1(vec.x, vec.y), tone });
  }, [vec.x, vec.y, tone]);

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    svgRef.current?.setPointerCapture(e.pointerId);
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const { x: svgX, y: svgY } = scalePointer(e.clientX, e.clientY, rect);
    const math = svgToMath(svgX, svgY);
    setVec(clamp(snap(math.x), snap(math.y)));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    setDragging(false);
    svgRef.current?.releasePointerCapture(e.pointerId);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const delta = e.shiftKey ? 1 : 0.5;
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
    e.preventDefault();
    setVec((current) => clamp(
      current.x + (e.key === "ArrowRight" ? delta : e.key === "ArrowLeft" ? -delta : 0),
      current.y + (e.key === "ArrowUp" ? delta : e.key === "ArrowDown" ? -delta : 0),
    ));
  };

  const origin = mathToSvg(0, 0);
  const tip = mathToSvg(vec.x, vec.y);

  return (
    <div className="w-full">
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="w-full select-none touch-none"
          role="img"
          aria-label="Vector norms diagram with L2 unit circle"
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
          <circle
            cx={origin.x}
            cy={origin.y}
            r={UNIT_R}
            fill="none"
            stroke="rgba(251,191,36,0.55)"
            strokeWidth={1.5}
            strokeDasharray="4 3"
          />
          <VectorArrow
            x1={origin.x}
            y1={origin.y}
            x2={tip.x}
            y2={tip.y}
            color={COLOR}
            strokeWidth={dragging ? 5 : 3.5}
          />
          <circle
            cx={tip.x}
            cy={tip.y}
            r={dragging ? 16 : 12}
            fill="#1a1030"
            stroke={COLOR}
            strokeWidth={3}
            style={{ cursor: "grab", touchAction: "none" }}
            aria-label="Drag vector tip"
            role="slider"
            tabIndex={0}
            aria-valuemin={-GRID_SIZE}
            aria-valuemax={GRID_SIZE}
            aria-valuenow={vec.x}
            aria-valuetext={`v = [${vec.x.toFixed(1)}, ${vec.y.toFixed(1)}]. Use left and right for x; up and down for y.`}
            onKeyDown={onKeyDown}
            onPointerDown={onPointerDown}
          />
          <circle cx={origin.x} cy={origin.y} r={3} fill="rgba(255,255,255,0.5)" />
        </svg>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 font-mono text-xs">
        <span className="rounded-lg border border-amber-400/25 bg-amber-400/[0.06] px-2.5 py-1 text-amber-100/80">
          L₂ = {l2(vec.x, vec.y).toFixed(2)}
        </span>
        <span className="rounded-lg border border-sky-400/25 bg-sky-400/[0.06] px-2.5 py-1 text-sky-100/80">
          L₁ = {l1(vec.x, vec.y).toFixed(1)}
        </span>
        <span className="rounded-lg border border-violet-400/25 bg-violet-400/[0.06] px-2.5 py-1 text-violet-100/80">
          L∞ = {linf(vec.x, vec.y).toFixed(1)}
        </span>
      </div>
      <p className="mt-2 text-center text-xs italic text-white/40">Drag the vector — compare straight-line, city-block, and max-coordinate distances.</p>
      <div className="mt-3 flex flex-wrap justify-center gap-2" aria-label="Guided norm presets">
        <button type="button" onClick={() => setVec({ x: 3, y: 4 })} className="rounded-full border border-white/15 px-3 py-2 text-xs text-white/75 hover:bg-white/10">Set [3, 4]</button>
        <button type="button" onClick={() => setVec({ x: 1, y: 0 })} className="rounded-full border border-white/15 px-3 py-2 text-xs text-white/75 hover:bg-white/10">Normalize to length 1</button>
        <button type="button" onClick={() => setVec({ x: 3, y: -4 })} className="rounded-full border border-white/15 px-3 py-2 text-xs text-white/75 hover:bg-white/10">Make L1 equal 7</button>
      </div>
    </div>
  );
};

export default VectorNormsExplorer;
