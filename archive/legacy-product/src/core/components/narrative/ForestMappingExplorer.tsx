import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/components/ui/tabs";
import { Button } from "@/core/components/ui/button";
import { VectorArrow } from "@/core/components/narrative/VectorArrow";
import { createPlotCoords, FOREST_PLOT } from "./plotCoords";

// Forest Mapping Capstone — Vera's three-phase park mapping project.
// Phase A: trail design (vector chaining + L₂ distance)
// Phase B: camera placement (linear independence via determinant)
// Phase C: coordinate systems (standard vs custom basis decomposition)

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
} = createPlotCoords(FOREST_PLOT);

const TRAIL_COLOR = "#34d399";
const VERA_EMERALD = "#34d399";
const VERA_TEAL = "#2dd4bf";
const CAMERA_COLORS = ["#a78bfa", "#38bdf8", "#fbbf24"];
const magnitude = (x: number, y: number) => Math.hypot(x, y);
const det2 = (a: [number, number], b: [number, number]) => a[0] * b[1] - a[1] * b[0];

type Phase = "trail" | "camera" | "basis";
type Theme = "dark" | "light";

export interface ForestMappingState {
  tone: string;
  phase: Phase;
  achievedTones: string[];
  totalDistance?: number;
  determinant?: number;
}

export interface ForestMappingExplorerProps {
  onStateChange?: (s: ForestMappingState) => void;
  variant?: Theme;
}

const themeStyles = {
  dark: {
    panel: "rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur p-2",
    readout: "rounded-lg border border-white/10 bg-white/[0.04] p-3",
    label: "text-[11px] uppercase tracking-wider text-white/50",
    value: "text-white/90",
    muted: "text-white/45",
    hint: "text-white/40 italic",
    tabList: "bg-white/5 border border-white/10",
    tabActive: "data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-100",
    grid: "rgba(255,255,255,0.06)",
    axis: "rgba(255,255,255,0.25)",
    landmark: "fill-white/80",
  },
  light: {
    panel: "rounded-xl border border-emerald-200 bg-emerald-50/50 p-2",
    readout: "rounded-lg border border-emerald-200 bg-white p-3",
    label: "text-[11px] uppercase tracking-wider text-emerald-700/70",
    value: "text-slate-800",
    muted: "text-slate-500",
    hint: "text-slate-500 italic",
    tabList: "bg-emerald-50 border border-emerald-200",
    tabActive: "data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800",
    grid: "rgba(16,185,129,0.12)",
    axis: "rgba(16,185,129,0.35)",
    landmark: "fill-slate-700",
  },
};

function solveCoordinates(v: [number, number], b1: [number, number], b2: [number, number]): [number, number] | null {
  const d = det2(b1, b2);
  if (Math.abs(d) < 0.01) return null;
  const a = det2(v, b2) / d;
  const b = det2(b1, v) / d;
  return [a, b];
}

export const ForestMappingExplorer = ({
  onStateChange,
  variant = "dark",
}: ForestMappingExplorerProps) => {
  const t = themeStyles[variant];
  const [phase, setPhase] = useState<Phase>("trail");
  const [achievedTones, setAchievedTones] = useState<Set<string>>(new Set());

  // Phase A — trail segments tip-to-tail
  const [restStop, setRestStop] = useState({ x: 3, y: 4 });
  const [waterfall, setWaterfall] = useState({ x: 6, y: 8 });
  const [draggingTrail, setDraggingTrail] = useState<"rest" | "fall" | null>(null);

  const seg1 = useMemo(() => ({ dx: restStop.x, dy: restStop.y }), [restStop]);
  const seg2 = useMemo(
    () => ({ dx: waterfall.x - restStop.x, dy: waterfall.y - restStop.y }),
    [waterfall, restStop]
  );
  const len1 = magnitude(seg1.dx, seg1.dy);
  const len2 = magnitude(seg2.dx, seg2.dy);
  const totalDistance = len1 + len2;
  const trailMet = Math.abs(totalDistance - 10) <= 0.5;

  // Phase B — camera direction vectors from origin
  const [cameras, setCameras] = useState([
    { id: 1, x: 4, y: 1 },
    { id: 2, x: 1, y: 3 },
  ]);
  const [draggingCamera, setDraggingCamera] = useState<number | null>(null);
  const camDet = det2([cameras[0].x, cameras[0].y], [cameras[1].x, cameras[1].y]);
  const cameraMet = Math.abs(camDet) > 0.1;

  // Phase C — basis decomposition
  const [useCustomBasis, setUseCustomBasis] = useState(false);
  const [basisB1, setBasisB1] = useState<[number, number]>([2, 1]);
  const [basisB2, setBasisB2] = useState<[number, number]>([1, 2]);
  const movement: [number, number] = [6, 8];
  const stdCoords: [number, number] = movement;
  const customCoords = solveCoordinates(movement, basisB1, basisB2);
  const basisMet = useCustomBasis && customCoords !== null;

  const svgRef = useRef<SVGSVGElement>(null);
  const reportRef = useRef(onStateChange);
  reportRef.current = onStateChange;

  // Sticky achievement tracking
  useEffect(() => {
    setAchievedTones((prev) => {
      const next = new Set(prev);
      if (trailMet) next.add("trail");
      if (cameraMet) next.add("camera");
      if (basisMet) next.add("basis");
      return next.size === prev.size ? prev : next;
    });
  }, [trailMet, cameraMet, basisMet]);

  useEffect(() => {
    for (const tone of achievedTones) {
      reportRef.current?.({
        tone,
        phase,
        achievedTones: Array.from(achievedTones),
        totalDistance,
        determinant: camDet,
      });
    }
  }, [achievedTones, phase, totalDistance, camDet]);

  const applyCanonicalTrail = () => {
    setRestStop({ x: 3, y: 4 });
    setWaterfall({ x: 6, y: 8 });
  };

  const applyIndependentCameras = () => {
    setCameras([
      { id: 1, x: 4, y: 1 },
      { id: 2, x: 1, y: 3 },
    ]);
  };

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const { x: svgX, y: svgY } = scalePointer(e.clientX, e.clientY, rect);
      const math = svgToMath(svgX, svgY);
      const snapped = { x: snapToGrid(math.x), y: snapToGrid(math.y) };
      const clamped = clamp(snapped.x, snapped.y);

      if (draggingTrail === "rest") {
        setRestStop(clamped);
      } else if (draggingTrail === "fall") {
        setWaterfall(clamped);
      } else if (draggingCamera !== null) {
        setCameras((prev) =>
          prev.map((c) => (c.id === draggingCamera ? { ...c, x: clamped.x, y: clamped.y } : c))
        );
      }
    },
    [draggingTrail, draggingCamera]
  );

  const onPointerUp = (e: React.PointerEvent) => {
    setDraggingTrail(null);
    setDraggingCamera(null);
    const svg = svgRef.current;
    if (svg && e.pointerId !== undefined) svg.releasePointerCapture(e.pointerId);
  };

  const landmarks = useMemo(
    () => [
      { key: "visitor", x: 0, y: 0, label: "Visitor Center", icon: "🏠" },
      { key: "rest", x: restStop.x, y: restStop.y, label: "Rest Stop", icon: "⛺" },
      { key: "fall", x: waterfall.x, y: waterfall.y, label: "Waterfall", icon: "💧" },
    ],
    [restStop, waterfall],
  );

  const renderMap = (overlays: React.ReactNode) => (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
      className="w-full h-auto select-none touch-none"
      role="img"
      aria-label="Forest map with draggable trail waypoints and camera vectors"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* grid */}
      {axisLabels.map((val) => {
        const gx = mathToSvg(val, 0).x;
        const gy = mathToSvg(0, val).y;
        return (
          <React.Fragment key={val}>
            <line x1={gx} y1={0} x2={gx} y2={SVG_HEIGHT} stroke={t.grid} strokeWidth={val === 0 ? 0 : 1} />
            <line x1={0} y1={gy} x2={SVG_WIDTH} y2={gy} stroke={t.grid} strokeWidth={val === 0 ? 0 : 1} />
          </React.Fragment>
        );
      })}

      <line x1={0} y1={SVG_HEIGHT / 2} x2={SVG_WIDTH} y2={SVG_HEIGHT / 2} stroke={t.axis} strokeWidth={1.5} />
      <line x1={SVG_WIDTH / 2} y1={0} x2={SVG_WIDTH / 2} y2={SVG_HEIGHT} stroke={t.axis} strokeWidth={1.5} />

      {overlays}

      {/* landmarks */}
      {landmarks.map((lm) => {
        const pt = mathToSvg(lm.x, lm.y);
        return (
          <g key={lm.key}>
            <circle cx={pt.x} cy={pt.y} r={14} fill={variant === "dark" ? "rgba(16,185,129,0.15)" : "rgba(16,185,129,0.25)"} stroke={VERA_EMERALD} strokeWidth={1.5} />
            <text x={pt.x} y={pt.y + 5} textAnchor="middle" fontSize="14">{lm.icon}</text>
            <text x={pt.x} y={pt.y + 24} textAnchor="middle" fontSize="10" className={t.landmark} fill="currentColor">{lm.label}</text>
          </g>
        );
      })}

      <circle cx={SVG_WIDTH / 2} cy={SVG_HEIGHT / 2} r={3} fill={variant === "dark" ? "rgba(255,255,255,0.5)" : VERA_EMERALD} />
    </svg>
  );

  const AchievementBadge = ({ tone, label, met }: { tone: string; label: string; met: boolean }) => (
    <span
      className={
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition " +
        (met || achievedTones.has(tone)
          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
          : variant === "dark"
          ? "bg-white/5 text-white/40 border border-white/10"
          : "bg-slate-100 text-slate-400 border border-slate-200")
      }
    >
      {met || achievedTones.has(tone) ? "✓" : "○"} {label}
      <span className="sr-only">{met || achievedTones.has(tone) ? "completed" : "not completed"}</span>
    </span>
  );

  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap gap-2">
        <AchievementBadge tone="trail" label="Trail · 10 units" met={trailMet} />
        <AchievementBadge tone="camera" label="Cameras · independent" met={cameraMet} />
        <AchievementBadge tone="basis" label="Basis · custom coords" met={basisMet} />
      </div>

      <Tabs value={phase} onValueChange={(v) => setPhase(v as Phase)}>
        <TabsList className={`grid w-full grid-cols-3 mb-4 ${t.tabList}`}>
          <TabsTrigger value="trail" className={t.tabActive}>A · Trail Design</TabsTrigger>
          <TabsTrigger value="camera" className={t.tabActive}>B · Cameras</TabsTrigger>
          <TabsTrigger value="basis" className={t.tabActive}>C · Coordinates</TabsTrigger>
        </TabsList>

        <TabsContent value="trail">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 min-w-0">
              <div className={t.panel}>
                {renderMap(
                  <>
                    {/* trail segments tip-to-tail */}
                    {(() => {
                      const origin = mathToSvg(0, 0);
                      const mid = mathToSvg(restStop.x, restStop.y);
                      const end = mathToSvg(waterfall.x, waterfall.y);
                      return (
                        <>
                          <VectorArrow x1={origin.x} y1={origin.y} x2={mid.x} y2={mid.y} color={TRAIL_COLOR} strokeWidth={3.5} />
                          <VectorArrow
                            x1={mid.x}
                            y1={mid.y}
                            x2={end.x}
                            y2={end.y}
                            color={TRAIL_COLOR}
                            strokeWidth={3.5}
                            strokeDasharray={trailMet ? undefined : "6 4"}
                          />
                          <circle cx={mid.x} cy={mid.y} r={12} fill={variant === "dark" ? "#1a1030" : "#fff"} stroke={TRAIL_COLOR} strokeWidth={2.5} style={{ cursor: "grab", touchAction: "none" }}
                            aria-label="Drag Rest Stop waypoint"
                            onPointerDown={(e) => { e.preventDefault(); svgRef.current?.setPointerCapture(e.pointerId); setDraggingTrail("rest"); }} />
                          <circle cx={end.x} cy={end.y} r={12} fill={variant === "dark" ? "#1a1030" : "#fff"} stroke={TRAIL_COLOR} strokeWidth={2.5} style={{ cursor: "grab", touchAction: "none" }}
                            aria-label="Drag Waterfall waypoint"
                            onPointerDown={(e) => { e.preventDefault(); svgRef.current?.setPointerCapture(e.pointerId); setDraggingTrail("fall"); }} />
                        </>
                      );
                    })()}
                  </>
                )}
              </div>
              <p className={`text-center text-xs mt-2 ${t.hint}`}>Drag waypoints or use presets to chain trail segments tip-to-tail.</p>
            </div>
            <div className="w-full lg:w-64 flex flex-col gap-3">
              <div className={t.readout}>
                <div className={t.label}>Segment 1 · to Rest Stop</div>
                <div className="font-mono text-sm mt-1" style={{ color: VERA_EMERALD }}>[{seg1.dx}, {seg1.dy}] · ||v|| = {len1.toFixed(2)}</div>
              </div>
              <div className={t.readout}>
                <div className={t.label}>Segment 2 · to Waterfall</div>
                <div className="font-mono text-sm mt-1" style={{ color: VERA_EMERALD }}>[{seg2.dx}, {seg2.dy}] · ||v|| = {len2.toFixed(2)}</div>
              </div>
              <div className={t.readout}>
                <div className={t.label}>Total L₂ distance</div>
                <div className={`text-2xl font-bold mt-0.5 ${trailMet ? "text-emerald-400" : t.value}`}>{totalDistance.toFixed(2)} units</div>
                {trailMet && <p className={`text-xs mt-1 ${t.muted}`}>Canonical path — 5 + 5 = 10 ✓</p>}
              </div>
              <Button variant="outline" size="sm" onClick={applyCanonicalTrail} className="text-xs">
                Preset: Canonical Trail (10 units)
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="camera">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 min-w-0">
              <div className={t.panel}>
                {renderMap(
                  cameras.map((cam, i) => {
                    const origin = mathToSvg(0, 0);
                    const tip = mathToSvg(cam.x, cam.y);
                    const color = CAMERA_COLORS[i];
                    return (
                      <g key={cam.id}>
                        <VectorArrow x1={origin.x} y1={origin.y} x2={tip.x} y2={tip.y} color={color} strokeWidth={3.5} />
                        <text x={tip.x + 8} y={tip.y - 8} fontSize="14" fill={color} fontWeight="bold">C{i + 1}</text>
                        <circle cx={tip.x} cy={tip.y} r={12} fill={variant === "dark" ? "#1a1030" : "#fff"} stroke={color} strokeWidth={2.5}
                          style={{ cursor: "grab", touchAction: "none" }}
                          aria-label={`Drag camera C${i + 1} direction vector`}
                          onPointerDown={(e) => { e.preventDefault(); svgRef.current?.setPointerCapture(e.pointerId); setDraggingCamera(cam.id); }} />
                      </g>
                    );
                  })
                )}
              </div>
              <p className={`text-center text-xs mt-2 ${t.hint}`}>Place two camera direction vectors. Independent cameras span all of R².</p>
            </div>
            <div className="w-full lg:w-64 flex flex-col gap-3">
              <div className={t.readout}>
                <div className={t.label}>Camera vectors</div>
                <div className={`font-mono text-sm mt-1 ${t.value}`}>
                  C₁ = [{cameras[0].x}, {cameras[0].y}]<br />
                  C₂ = [{cameras[1].x}, {cameras[1].y}]
                </div>
              </div>
              <div className={t.readout}>
                <div className={t.label}>Determinant det(C₁, C₂)</div>
                <div className={`text-2xl font-bold mt-0.5 ${cameraMet ? "text-emerald-400" : t.value}`}>{camDet.toFixed(3)}</div>
                <p className={`text-xs mt-1 ${t.muted}`}>
                  {cameraMet ? "Independent — cameras span R² ✓" : "Dependent — cameras overlap (need |det| > 0.1)"}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={applyIndependentCameras} className="text-xs">
                Preset: Independent Cameras
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="basis">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 min-w-0">
              <div className={t.panel}>
                {renderMap(
                  <>
                    {/* movement vector */}
                    {(() => {
                      const origin = mathToSvg(0, 0);
                      const tip = mathToSvg(movement[0], movement[1]);
                      return (
                        <VectorArrow x1={origin.x} y1={origin.y} x2={tip.x} y2={tip.y} color="#f472b6" strokeWidth={3.5} />
                      );
                    })()}
                    {/* custom basis vectors */}
                    {useCustomBasis && (
                      <>
                        {([basisB1, basisB2] as const).map((b, i) => {
                          const origin = mathToSvg(0, 0);
                          const tip = mathToSvg(b[0], b[1]);
                          const color = i === 0 ? VERA_EMERALD : VERA_TEAL;
                          return (
                            <g key={i}>
                              <VectorArrow
                                x1={origin.x}
                                y1={origin.y}
                                x2={tip.x}
                                y2={tip.y}
                                color={color}
                                strokeWidth={2.5}
                                strokeDasharray="4 3"
                              />
                              <text x={tip.x + 6} y={tip.y - 6} fontSize="12" fill={color}>b{i + 1}</text>
                            </g>
                          );
                        })}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="w-full lg:w-72 flex flex-col gap-3">
              <div className={t.readout}>
                <div className={t.label}>Visitor movement vector</div>
                <div className="font-mono text-sm mt-1 text-pink-400">v = [{movement[0]}, {movement[1]}]</div>
              </div>

              <div className="flex gap-2">
                <Button variant={!useCustomBasis ? "default" : "outline"} size="sm" onClick={() => setUseCustomBasis(false)} className="flex-1 text-xs">
                  Standard basis
                </Button>
                <Button variant={useCustomBasis ? "default" : "outline"} size="sm" onClick={() => setUseCustomBasis(true)} className="flex-1 text-xs">
                  Custom basis
                </Button>
              </div>

              {useCustomBasis && (
                <div className={t.readout}>
                  <div className={t.label}>Custom basis vectors</div>
                  <div className="space-y-2 mt-2">
                    {(["b1", "b2"] as const).map((key, i) => {
                      const basis = i === 0 ? basisB1 : basisB2;
                      const setter = i === 0 ? setBasisB1 : setBasisB2;
                      return (
                        <div key={key} className="flex items-center gap-2">
                          <span className="font-mono text-xs w-6" style={{ color: i === 0 ? VERA_EMERALD : VERA_TEAL }}>{key}</span>
                          {(["x", "y"] as const).map((axis, j) => (
                            <input
                              key={axis}
                              type="number"
                              step="0.5"
                              value={basis[j]}
                              aria-label={`${key} ${axis}-component`}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                setter((prev) => (j === 0 ? [val, prev[1]] : [prev[0], val]));
                              }}
                              className={
                                variant === "dark"
                                  ? "w-14 bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-xs font-mono text-white/90 text-center"
                                  : "w-14 bg-white border border-emerald-200 rounded px-1.5 py-0.5 text-xs font-mono text-slate-800 text-center"
                              }
                            />
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className={t.readout}>
                <div className={t.label}>{useCustomBasis ? "Coordinates in custom basis" : "Standard coordinates"}</div>
                {useCustomBasis && customCoords ? (
                  <div className={`font-mono text-lg font-bold mt-1 ${basisMet ? "text-emerald-400" : t.value}`}>
                    v = {customCoords[0].toFixed(2)}·b₁ + {customCoords[1].toFixed(2)}·b₂
                  </div>
                ) : (
                  <div className={`font-mono text-lg font-bold mt-1 ${t.value}`}>
                    v = {stdCoords[0]}·e₁ + {stdCoords[1]}·e₂
                  </div>
                )}
                {basisMet && <p className={`text-xs mt-1 ${t.muted}`}>Same vector, different coordinate language ✓</p>}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ForestMappingExplorer;
