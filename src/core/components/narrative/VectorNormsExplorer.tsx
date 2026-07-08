import React, { useEffect, useRef, useState } from "react";
import type { InteractiveProps } from "./interactives";

const GRID_SIZE = 5;
const SVG_WIDTH = 560;
const SVG_HEIGHT = 420;
const COLOR = "#f4623c";
const UNIT_R = (SVG_WIDTH / 2 / GRID_SIZE) * 1; // one unit in svg px

const mathToSvg = (x: number, y: number) => ({
  x: SVG_WIDTH / 2 + (x * SVG_WIDTH) / (2 * GRID_SIZE),
  y: SVG_HEIGHT / 2 - (y * SVG_HEIGHT) / (2 * GRID_SIZE),
});

const svgToMath = (x: number, y: number) => ({
  x: ((x - SVG_WIDTH / 2) * (2 * GRID_SIZE)) / SVG_WIDTH,
  y: -((y - SVG_HEIGHT / 2) * (2 * GRID_SIZE)) / SVG_HEIGHT,
});

const snap = (v: number) => Math.round(v * 2) / 2;
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
    const scaleX = SVG_WIDTH / rect.width;
    const scaleY = SVG_HEIGHT / rect.height;
    const svgX = (e.clientX - rect.left) * scaleX;
    const svgY = (e.clientY - rect.top) * scaleY;
    const math = svgToMath(svgX, svgY);
    setVec({
      x: Math.max(-GRID_SIZE, Math.min(GRID_SIZE, snap(math.x))),
      y: Math.max(-GRID_SIZE, Math.min(GRID_SIZE, snap(math.y))),
    });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    setDragging(false);
    svgRef.current?.releasePointerCapture(e.pointerId);
  };

  const origin = mathToSvg(0, 0);
  const tip = mathToSvg(vec.x, vec.y);
  const labels = Array.from({ length: 2 * GRID_SIZE + 1 }, (_, i) => i - GRID_SIZE);

  return (
    <div className="w-full">
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="w-full select-none touch-none"
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          <defs>
            <marker id="vne-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6 Z" fill={COLOR} />
            </marker>
          </defs>
          {labels.map((val) => {
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
          <line x1={origin.x} y1={origin.y} x2={tip.x} y2={tip.y} stroke={COLOR} strokeWidth={dragging ? 5 : 3.5} markerEnd="url(#vne-arrow)" />
          <circle
            cx={tip.x}
            cy={tip.y}
            r={dragging ? 16 : 12}
            fill="#1a1030"
            stroke={COLOR}
            strokeWidth={3}
            style={{ cursor: "grab", touchAction: "none" }}
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
    </div>
  );
};

export default VectorNormsExplorer;
