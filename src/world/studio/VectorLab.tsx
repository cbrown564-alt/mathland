import { KeyboardEvent, PointerEvent, useMemo, useRef, useState } from "react";
import { StudioCaseAdapter, studioCaseAdapters } from "../cases/cases";
import { clampComponent, magnitude, projectionVector, readDotProduct, relationCopy, Vector2 } from "./dotProduct";

interface VectorLabProps {
  adapter?: StudioCaseAdapter;
  onConstructed: (detail: string) => void;
}

interface LabState { a: Vector2; b: Vector2 }

const SIZE = 420;
const ORIGIN = SIZE / 2;
const format = (value: number) => Number.isInteger(value) ? String(value) : value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");

export const VectorLab = ({ adapter = studioCaseAdapters.engineering, onConstructed }: VectorLabProps) => {
  const start: LabState = { a: adapter.startA, b: adapter.startB };
  const [a, setA] = useState<Vector2>(start.a);
  const [b, setB] = useState<Vector2>(start.b);
  const [history, setHistory] = useState<LabState[]>([]);
  const [comparison, setComparison] = useState<LabState | null>(null);
  const [seen, setSeen] = useState(() => new Set<string>());
  const svgRef = useRef<SVGSVGElement>(null);
  const reading = useMemo(() => readDotProduct(a, b), [a, b]);
  const comparedReading = useMemo(() => comparison ? readDotProduct(comparison.a, comparison.b) : null, [comparison]);
  const projected = useMemo(() => projectionVector(b, a), [a, b]);
  const extent = Math.max(1, ...a.map(Math.abs), ...b.map(Math.abs), ...(comparison ? [...comparison.a, ...comparison.b].map(Math.abs) : []));
  const scale = 150 / extent;
  const toPoint = ([x, y]: Vector2) => ({ x: ORIGIN + x * scale, y: ORIGIN - y * scale });
  const aPoint = toPoint(a);
  const bPoint = toPoint(b);
  const projectionPoint = projected ? toPoint(projected) : null;
  const contributionX = a[0] * b[0];
  const contributionY = a[1] * b[1];

  const announceRelation = (nextA: Vector2, nextB: Vector2) => {
    const category = readDotProduct(nextA, nextB).relation;
    if (!seen.has(category)) {
      setSeen((current) => new Set(current).add(category));
      onConstructed(`Constructed ${category} vectors in ${adapter.domain}`);
    }
  };

  const commit = (nextA: Vector2, nextB: Vector2) => {
    const safeA: Vector2 = [clampComponent(nextA[0]), clampComponent(nextA[1])];
    const safeB: Vector2 = [clampComponent(nextB[0]), clampComponent(nextB[1])];
    if (safeA[0] === a[0] && safeA[1] === a[1] && safeB[0] === b[0] && safeB[1] === b[1]) return;
    setHistory((current) => [...current.slice(-19), { a, b }]);
    setA(safeA);
    setB(safeB);
    announceRelation(safeA, safeB);
  };

  const pointerToVector = (event: PointerEvent<SVGCircleElement>): Vector2 | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const matrix = svg.getScreenCTM();
    if (!matrix) return null;
    const local = point.matrixTransform(matrix.inverse());
    return [Math.round((local.x - ORIGIN) / scale * 4) / 4, Math.round((ORIGIN - local.y) / scale * 4) / 4];
  };

  const handlePointer = (target: "a" | "b", event: PointerEvent<SVGCircleElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const next = pointerToVector(event);
    if (next) commit(target === "a" ? next : a, target === "b" ? next : b);
  };

  const releasePointer = (event: PointerEvent<SVGCircleElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const handleKey = (target: "a" | "b", event: KeyboardEvent<SVGCircleElement>) => {
    const amount = event.shiftKey ? 1 : 0.25;
    const offsets: Partial<Record<string, Vector2>> = {
      ArrowLeft: [-amount, 0], ArrowRight: [amount, 0], ArrowUp: [0, amount], ArrowDown: [0, -amount],
    };
    const offset = offsets[event.key];
    if (!offset) return;
    event.preventDefault();
    const current = target === "a" ? a : b;
    const next: Vector2 = [current[0] + offset[0], current[1] + offset[1]];
    commit(target === "a" ? next : a, target === "b" ? next : b);
  };

  const undo = () => {
    const previous = history[history.length - 1];
    if (!previous) return;
    setHistory((current) => current.slice(0, -1));
    setA(previous.a);
    setB(previous.b);
  };

  const reset = () => {
    setHistory((current) => [...current.slice(-19), { a, b }]);
    setA(start.a);
    setB(start.b);
    setComparison(null);
  };

  const aLength = magnitude(a);
  const direction: Vector2 = aLength === 0 ? [1, 0] : [a[0] / aLength, a[1] / aLength];
  const presetLength = Math.max(1, magnitude(adapter.startB));
  const presets: Array<{ label: string; note: string; vector: Vector2 }> = [
    { label: "Maximum agreement", note: "0°", vector: [direction[0] * presetLength, direction[1] * presetLength] },
    { label: "Perpendicular", note: "90°", vector: [-direction[1] * presetLength, direction[0] * presetLength] },
    { label: "Maximum opposition", note: "180°", vector: [-direction[0] * presetLength, -direction[1] * presetLength] },
    { label: `Zero ${adapter.secondLabel}`, note: "edge case", vector: [0, 0] },
  ];
  const meaning = reading.dot > 0 ? adapter.positiveMeaning : reading.dot < 0 ? adapter.negativeMeaning : adapter.zeroMeaning;

  return (
    <div className="world-lab-grid">
      <div className="world-vector-stage" aria-labelledby="vector-plot-title">
        <div className="world-panel-heading">
          <div><p className="world-local-label">{adapter.domain} · geometry live</p><h2 id="vector-plot-title">{adapter.title}: live vector plot</h2></div>
          <output className={`world-dot-readout is-${reading.relation}`} aria-live="polite">
            <span>{adapter.scalarLabel}</span><strong>{format(reading.dot)}</strong><small>{adapter.units}</small>
          </output>
        </div>
        <p id="vector-control-instructions" className="sr-only">Use arrow keys to move one component by 0.25. Hold Shift for steps of 1. Both vector tips can also be dragged.</p>
        <svg ref={svgRef} viewBox={`0 0 ${SIZE} ${SIZE}`} className="world-vector-svg" aria-labelledby="vector-svg-title vector-svg-desc">
          <title id="vector-svg-title">Two vectors and the live projection of {adapter.secondLabel} onto {adapter.firstLabel}</title>
          <desc id="vector-svg-desc">{adapter.firstLabel} is [{a[0]}, {a[1]}]. {adapter.secondLabel} is [{b[0]}, {b[1]}]. Their dot product is {format(reading.dot)}, indicating {reading.relation}. {projected ? `The signed projection endpoint is [${projected.map(format).join(", ")}].` : "Projection is undefined because the target vector is zero."}</desc>
          <defs>
            <pattern id={`minor-grid-${adapter.domain}`} width="42" height="42" patternUnits="userSpaceOnUse"><path d="M 42 0 L 0 0 0 42" fill="none" stroke="rgba(255,255,255,.075)" strokeWidth="1" /></pattern>
            <marker id={`arrow-coral-${adapter.domain}`} viewBox="0 0 10 10" refX="10" refY="5" markerUnits="userSpaceOnUse" markerWidth="14" markerHeight="14" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#ff7657" /></marker>
            <marker id={`arrow-mint-${adapter.domain}`} viewBox="0 0 10 10" refX="10" refY="5" markerUnits="userSpaceOnUse" markerWidth="14" markerHeight="14" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#61e6b0" /></marker>
          </defs>
          <rect width={SIZE} height={SIZE} rx="16" fill={`url(#minor-grid-${adapter.domain})`} />
          <line x1="0" y1={ORIGIN} x2={SIZE} y2={ORIGIN} className="world-axis" /><line x1={ORIGIN} y1="0" x2={ORIGIN} y2={SIZE} className="world-axis" />
          {comparison && <><line x1={ORIGIN} y1={ORIGIN} x2={toPoint(comparison.a).x} y2={toPoint(comparison.a).y} className="world-vector world-vector-compare" /><line x1={ORIGIN} y1={ORIGIN} x2={toPoint(comparison.b).x} y2={toPoint(comparison.b).y} className="world-vector world-vector-compare" /></>}
          {projectionPoint && <><line x1={ORIGIN} y1={ORIGIN} x2={projectionPoint.x} y2={projectionPoint.y} className="world-projection-live" /><line x1={bPoint.x} y1={bPoint.y} x2={projectionPoint.x} y2={projectionPoint.y} className="world-projection-drop-live" /><text x={(ORIGIN + projectionPoint.x) / 2} y={(ORIGIN + projectionPoint.y) / 2 - 10} textAnchor="middle" className="world-svg-label world-svg-label-projection">projection</text></>}
          <line x1={ORIGIN} y1={ORIGIN} x2={aPoint.x} y2={aPoint.y} className="world-vector world-vector-a" markerEnd={`url(#arrow-mint-${adapter.domain})`} />
          <line x1={ORIGIN} y1={ORIGIN} x2={bPoint.x} y2={bPoint.y} className="world-vector world-vector-b" markerEnd={`url(#arrow-coral-${adapter.domain})`} />
          <text x={aPoint.x - 3} y={aPoint.y + 27} className="world-svg-label world-svg-label-a">{adapter.firstLabel}</text>
          <text x={bPoint.x + 12} y={bPoint.y - 10} className="world-svg-label world-svg-label-b">{adapter.secondLabel}</text>
          <circle cx={aPoint.x} cy={aPoint.y} r="18" className="world-vector-handle world-vector-handle-a" role="button" tabIndex={0} aria-label={`${adapter.firstLabel} vector tip, ${a[0]} horizontally and ${a[1]} vertically`} aria-describedby="vector-control-instructions" onPointerDown={(event) => event.currentTarget.setPointerCapture(event.pointerId)} onPointerMove={(event) => handlePointer("a", event)} onPointerUp={releasePointer} onPointerCancel={releasePointer} onLostPointerCapture={releasePointer} onKeyDown={(event) => handleKey("a", event)} />
          <circle cx={bPoint.x} cy={bPoint.y} r="18" className="world-vector-handle world-vector-handle-b" role="button" tabIndex={0} aria-label={`${adapter.secondLabel} vector tip, ${b[0]} horizontally and ${b[1]} vertically`} aria-describedby="vector-control-instructions" onPointerDown={(event) => event.currentTarget.setPointerCapture(event.pointerId)} onPointerMove={(event) => handlePointer("b", event)} onPointerUp={releasePointer} onPointerCancel={releasePointer} onLostPointerCapture={releasePointer} onKeyDown={(event) => handleKey("b", event)} />
        </svg>
        <p className="world-readable-model"><strong>Readable state.</strong> {adapter.firstLabel} = [{a.join(", ")}], {adapter.secondLabel} = [{b.join(", ")}]. {relationCopy(reading)} {projectionPoint && `Signed projection: ${format(reading.projectionOfBOntoA ?? 0)}.`}</p>
      </div>

      <aside className="world-control-panel" aria-label="Vector controls and linked representations">
        <div className="world-instrument-toolbar" aria-label="Instrument history controls">
          <button type="button" onClick={undo} disabled={history.length === 0}>Undo</button>
          <button type="button" onClick={reset}>Reset</button>
          <button type="button" onClick={() => setComparison({ a, b })}>{comparison ? "Update comparison" : "Pin comparison"}</button>
        </div>
        <h2>Test all three sign regions</h2>
        <p>{adapter.task} Use an extreme first, then exact components to test a claim between the extremes.</p>
        <div className="world-presets" aria-label="Extreme-case presets">
          {presets.map((preset) => <button key={preset.label} type="button" onClick={() => commit(a, preset.vector)}><strong>{preset.label}</strong><span>{preset.note}</span></button>)}
        </div>
        <fieldset className="world-number-grid">
          <legend>Exact components</legend>
          <label>{adapter.firstLabel}ₓ<input aria-label={`${adapter.firstLabel} x component`} type="number" min="-5" max="5" step="0.25" value={a[0]} onChange={(event) => Number.isFinite(event.target.valueAsNumber) && commit([event.target.valueAsNumber, a[1]], b)} /></label>
          <label>{adapter.firstLabel}ᵧ<input aria-label={`${adapter.firstLabel} y component`} type="number" min="-5" max="5" step="0.25" value={a[1]} onChange={(event) => Number.isFinite(event.target.valueAsNumber) && commit([a[0], event.target.valueAsNumber], b)} /></label>
          <label>{adapter.secondLabel}ₓ<input aria-label={`${adapter.secondLabel} x component`} type="number" min="-5" max="5" step="0.25" value={b[0]} onChange={(event) => Number.isFinite(event.target.valueAsNumber) && commit(a, [event.target.valueAsNumber, b[1]])} /></label>
          <label>{adapter.secondLabel}ᵧ<input aria-label={`${adapter.secondLabel} y component`} type="number" min="-5" max="5" step="0.25" value={b[1]} onChange={(event) => Number.isFinite(event.target.valueAsNumber) && commit(a, [b[0], event.target.valueAsNumber])} /></label>
        </fieldset>
        <div className="world-linked-views">
          <section><span>Components</span><strong>{format(contributionX)} + {format(contributionY)} = {format(reading.dot)}</strong><small>each matched pair contributes</small></section>
          <section><span>Geometry</span><strong>{reading.projectionOfBOntoA === null ? "projection undefined" : `${format(reading.projectionOfBOntoA)} along ${adapter.firstLabel}`}</strong><small>The gold segment on the plot is live, not illustrative.</small></section>
          <section><span>Symbolic</span><strong>|a||b| cos θ</strong><small>{reading.angleDegrees === null ? "undefined for a zero vector" : `${format(reading.magnitudeB)} × ${format(reading.magnitudeA)} × cos ${reading.angleDegrees.toFixed(1)}°`}</small></section>
          <section><span>{adapter.domain} meaning</span><strong>{meaning}</strong><small>{adapter.boundary}</small></section>
        </div>
        <dl className="world-measures">
          <div><dt>Angle</dt><dd>{reading.angleDegrees === null ? "undefined" : `${reading.angleDegrees.toFixed(1)}°`}</dd></div>
          <div><dt>|{adapter.secondLabel}|</dt><dd>{reading.magnitudeB.toFixed(3)}</dd></div>
          <div><dt>{adapter.secondLabel} along {adapter.firstLabel}</dt><dd>{reading.projectionOfBOntoA === null ? "undefined" : reading.projectionOfBOntoA.toFixed(3)}</dd></div>
        </dl>
        {comparison && comparedReading && <p className="world-comparison" role="status"><strong>Pinned comparison:</strong> [{comparison.a.join(", ")}] · [{comparison.b.join(", ")}] gave {format(comparedReading.dot)}. Current change: {format(reading.dot - comparedReading.dot)}.</p>}
      </aside>
    </div>
  );
};
