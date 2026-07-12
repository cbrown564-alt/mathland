import { KeyboardEvent, PointerEvent, useMemo, useRef, useState } from "react";
import { clampComponent, readDotProduct, relationCopy, Vector2 } from "./dotProduct";

interface VectorLabProps {
  onConstructed: (detail: string) => void;
}

const SIZE = 420;
const ORIGIN = SIZE / 2;
const SCALE = 36;
const START_A: Vector2 = [4, 0];
const START_B: Vector2 = [3, 2];

const toPoint = ([x, y]: Vector2) => ({ x: ORIGIN + x * SCALE, y: ORIGIN - y * SCALE });
const format = (value: number) => Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");

export const VectorLab = ({ onConstructed }: VectorLabProps) => {
  const [a, setA] = useState<Vector2>(START_A);
  const [b, setB] = useState<Vector2>(START_B);
  const [history, setHistory] = useState<Vector2[]>([]);
  const [comparison, setComparison] = useState<Vector2 | null>(null);
  const [seen, setSeen] = useState(() => new Set<string>());
  const svgRef = useRef<SVGSVGElement>(null);
  const reading = useMemo(() => readDotProduct(a, b), [a, b]);
  const comparedReading = useMemo(() => comparison ? readDotProduct(a, comparison) : null, [a, comparison]);
  const aPoint = toPoint(a);
  const bPoint = toPoint(b);
  const contributionX = a[0] * b[0];
  const contributionY = a[1] * b[1];

  const updateB = (next: Vector2) => {
    const safe: Vector2 = [clampComponent(next[0]), clampComponent(next[1])];
    if (safe[0] === b[0] && safe[1] === b[1]) return;
    setHistory((current) => [...current.slice(-19), b]);
    setB(safe);
    const category = readDotProduct(a, safe).relation;
    if (!seen.has(category)) {
      setSeen((current) => new Set(current).add(category));
      onConstructed(`Constructed ${category} vectors`);
    }
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
    return [Math.round((local.x - ORIGIN) / SCALE * 4) / 4, Math.round((ORIGIN - local.y) / SCALE * 4) / 4];
  };

  const handlePointer = (event: PointerEvent<SVGCircleElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const next = pointerToVector(event);
    if (next) updateB(next);
  };

  const handleKey = (event: KeyboardEvent<SVGCircleElement>) => {
    const amount = event.shiftKey ? 1 : 0.25;
    const offsets: Partial<Record<string, Vector2>> = {
      ArrowLeft: [-amount, 0], ArrowRight: [amount, 0], ArrowUp: [0, amount], ArrowDown: [0, -amount],
    };
    const offset = offsets[event.key];
    if (!offset) return;
    event.preventDefault();
    updateB([b[0] + offset[0], b[1] + offset[1]]);
  };

  const undo = () => {
    const previous = history[history.length - 1];
    if (!previous) return;
    setHistory((current) => current.slice(0, -1));
    setB(previous);
  };

  const reset = () => {
    setHistory((current) => [...current.slice(-19), b]);
    setA(START_A);
    setB(START_B);
    setComparison(null);
  };

  const presets: Array<{ label: string; note: string; vector: Vector2 }> = [
    { label: "Maximum help", note: "0°", vector: [4, 0] },
    { label: "Sideways", note: "90°", vector: [0, 4] },
    { label: "Maximum resistance", note: "180°", vector: [-4, 0] },
    { label: "Zero force", note: "edge case", vector: [0, 0] },
  ];

  return (
    <div className="world-lab-grid">
      <section className="world-vector-stage" aria-labelledby="vector-plot-title">
        <div className="world-panel-heading">
          <div><p className="world-local-label">Geometry · live</p><h2 id="vector-plot-title">Force along displacement</h2></div>
          <output className={`world-dot-readout is-${reading.relation}`} aria-live="polite">
            <span>F · s</span><strong>{format(reading.dot)}</strong><small>joules</small>
          </output>
        </div>
        <svg ref={svgRef} viewBox={`0 0 ${SIZE} ${SIZE}`} className="world-vector-svg" aria-labelledby="vector-svg-title vector-svg-desc">
          <title id="vector-svg-title">Force and displacement vectors on a coordinate grid</title>
          <desc id="vector-svg-desc">Displacement s is [{a[0]}, {a[1]}]. Force F is [{b[0]}, {b[1]}]. Their dot product is {format(reading.dot)}, indicating {reading.relation}.</desc>
          <defs>
            <pattern id="minor-grid" width={SCALE} height={SCALE} patternUnits="userSpaceOnUse"><path d={`M ${SCALE} 0 L 0 0 0 ${SCALE}`} fill="none" stroke="rgba(255,255,255,.075)" strokeWidth="1" /></pattern>
            <marker id="arrow-coral" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#ff7657" /></marker>
            <marker id="arrow-mint" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#61e6b0" /></marker>
          </defs>
          <rect width={SIZE} height={SIZE} rx="16" fill="url(#minor-grid)" />
          <line x1="0" y1={ORIGIN} x2={SIZE} y2={ORIGIN} className="world-axis" /><line x1={ORIGIN} y1="0" x2={ORIGIN} y2={SIZE} className="world-axis" />
          {comparison && <line x1={ORIGIN} y1={ORIGIN} x2={toPoint(comparison).x} y2={toPoint(comparison).y} className="world-vector world-vector-compare" />}
          <line x1={ORIGIN} y1={ORIGIN} x2={aPoint.x} y2={aPoint.y} className="world-vector world-vector-a" markerEnd="url(#arrow-mint)" />
          <line x1={ORIGIN} y1={ORIGIN} x2={bPoint.x} y2={bPoint.y} className="world-vector world-vector-b" markerEnd="url(#arrow-coral)" />
          <text x={aPoint.x - 3} y={aPoint.y + 27} className="world-svg-label world-svg-label-a">s</text>
          <text x={bPoint.x + 12} y={bPoint.y - 10} className="world-svg-label world-svg-label-b">F</text>
          <circle
            cx={bPoint.x} cy={bPoint.y} r="18" className="world-vector-handle" role="slider" tabIndex={0}
            aria-label="Force vector tip" aria-valuetext={`Force F is ${b[0]} horizontally and ${b[1]} vertically`}
            aria-valuemin={-5} aria-valuemax={5} aria-valuenow={b[0]}
            onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); }}
            onPointerMove={handlePointer} onKeyDown={handleKey}
          />
        </svg>
        <p className="world-readable-model"><strong>Readable state.</strong> s = [{a.join(", ")}], F = [{b.join(", ")}]. {relationCopy(reading)}</p>
      </section>

      <aside className="world-control-panel" aria-label="Vector controls and linked representations">
        <div className="world-instrument-toolbar" aria-label="Instrument history controls">
          <button type="button" onClick={undo} disabled={history.length === 0}>Undo</button>
          <button type="button" onClick={reset}>Reset</button>
          <button type="button" onClick={() => setComparison(b)}>{comparison ? "Update comparison" : "Pin comparison"}</button>
        </div>
        <h2>Test a directional claim</h2>
        <p>Move the coral force. Compare an extreme case, then use exact components to test a claim between the extremes.</p>
        <div className="world-presets" aria-label="Extreme-case presets">
          {presets.map((preset) => <button key={preset.label} type="button" onClick={() => updateB(preset.vector)}><strong>{preset.label}</strong><span>{preset.note}</span></button>)}
        </div>
        <fieldset className="world-number-grid">
          <legend>Exact components</legend>
          <label>sₓ<input aria-label="sₓ" type="number" min="-5" max="5" step="0.25" value={a[0]} onChange={(event) => setA([clampComponent(event.target.valueAsNumber), a[1]])} /></label>
          <label>sᵧ<input aria-label="sᵧ" type="number" min="-5" max="5" step="0.25" value={a[1]} onChange={(event) => setA([a[0], clampComponent(event.target.valueAsNumber)])} /></label>
          <label>Fₓ<input aria-label="Fₓ" type="number" min="-5" max="5" step="0.25" value={b[0]} onChange={(event) => updateB([event.target.valueAsNumber, b[1]])} /></label>
          <label>Fᵧ<input aria-label="Fᵧ" type="number" min="-5" max="5" step="0.25" value={b[1]} onChange={(event) => updateB([b[0], event.target.valueAsNumber])} /></label>
        </fieldset>
        <div className="world-linked-views">
          <section><span>Components</span><strong>{format(contributionX)} + {format(contributionY)} = {format(reading.dot)}</strong><small>each matched pair contributes</small></section>
          <section><span>Symbolic</span><strong>|F||s| cos θ</strong><small>{reading.angleDegrees === null ? "undefined for a zero vector" : `${format(reading.magnitudeB)} × ${format(reading.magnitudeA)} × cos ${reading.angleDegrees.toFixed(1)}°`}</small></section>
          <section><span>Context</span><strong>{reading.dot > 0 ? "adds energy" : reading.dot < 0 ? "removes energy" : "transfers no energy along s"}</strong><small>constant force over a straight 4 m displacement</small></section>
        </div>
        <dl className="world-measures">
          <div><dt>Angle</dt><dd>{reading.angleDegrees === null ? "undefined" : `${reading.angleDegrees.toFixed(1)}°`}</dd></div>
          <div><dt>|F|</dt><dd>{reading.magnitudeB.toFixed(2)} N</dd></div>
          <div><dt>F along s</dt><dd>{reading.projectionOfBOntoA === null ? "undefined" : `${reading.projectionOfBOntoA.toFixed(2)} N`}</dd></div>
        </dl>
        {comparison && comparedReading && <p className="world-comparison" role="status"><strong>Pinned comparison:</strong> F = [{comparison.join(", ")}] gave {format(comparedReading.dot)} J. Current change: {format(reading.dot - comparedReading.dot)} J.</p>}
      </aside>
    </div>
  );
};
