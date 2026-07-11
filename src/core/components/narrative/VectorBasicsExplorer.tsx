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

const COLOR = "#f4623c";
const mag = (x: number, y: number) => Math.hypot(x, y);

function classify(x: number, y: number): string {
  const m = mag(x, y);
  if (m >= 4.8 && m <= 5.2 && Math.abs(x - 4) < 0.6 && Math.abs(y - 3) < 0.6) return "classic";
  if (m >= 4.8 && m <= 5.2) return "five";
  if (m >= 0.85 && m <= 1.15) return "unit";
  return "explore";
}

export const VectorBasicsExplorer = ({ onStateChange }: InteractiveProps = {}) => {
  const [vec, setVec] = useState({ x: 3, y: 2 });
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const reportRef = useRef(onStateChange);
  reportRef.current = onStateChange;

  const m = mag(vec.x, vec.y);
  const tone = classify(vec.x, vec.y);

  useEffect(() => {
    reportRef.current?.({ dot: m, cos: vec.x, tone });
  }, [m, vec.x, vec.y, tone]);

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
          aria-label="Vector v on a coordinate grid"
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
          <VectorArrow
            x1={origin.x}
            y1={origin.y}
            x2={tip.x}
            y2={tip.y}
            color={COLOR}
            strokeWidth={dragging ? 5 : 3.5}
          />
          <text x={tip.x + 10} y={tip.y - 8} fill={COLOR} fontFamily="serif" fontStyle="italic" fontSize="18" fontWeight="bold">
            v
          </text>
          <circle
            cx={tip.x}
            cy={tip.y}
            r={dragging ? 16 : 12}
            fill="#1a1030"
            stroke={COLOR}
            strokeWidth={3}
            style={{ cursor: "grab", touchAction: "none" }}
            aria-label="Drag vector v tip"
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
        <span className="rounded-lg border border-white/12 bg-white/[0.04] px-2.5 py-1 text-white/70">
          v = [{vec.x.toFixed(1)}, {vec.y.toFixed(1)}]
        </span>
        <span className="rounded-lg border border-amber-400/25 bg-amber-400/[0.06] px-2.5 py-1 text-amber-100/80">
          |v| = {m.toFixed(2)}
        </span>
      </div>
      <p className="mt-2 text-center text-xs italic text-white/40">Drag the arrowhead — watch the components and magnitude update live.</p>
      <div className="mt-3 flex flex-wrap justify-center gap-2" aria-label="Guided vector presets">
        <PresetButton label="Set v to [4, 3]" onClick={() => setVec({ x: 4, y: 3 })} />
        <PresetButton label="Set a unit vector" onClick={() => setVec({ x: 1, y: 0 })} />
        <PresetButton label="Set another length-5 vector" onClick={() => setVec({ x: 0, y: 5 })} />
      </div>
    </div>
  );
};

const PresetButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button type="button" onClick={onClick} className="rounded-full border border-white/15 px-3 py-2 text-xs text-white/75 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400">
    {label}
  </button>
);

export default VectorBasicsExplorer;
