import { KeyboardEvent, PointerEvent, useMemo, useRef, useState } from "react";
import { clampComponent, componentExpression, readDotProduct, relationCopy, Vector2 } from "./dotProduct";

interface VectorLabProps {
  onConstructed: (detail: string) => void;
}

const SIZE = 420;
const ORIGIN = SIZE / 2;
const SCALE = 36;

const toPoint = ([x, y]: Vector2) => ({ x: ORIGIN + x * SCALE, y: ORIGIN - y * SCALE });

export const VectorLab = ({ onConstructed }: VectorLabProps) => {
  const [a, setA] = useState<Vector2>([4, 0]);
  const [b, setB] = useState<Vector2>([3, 2]);
  const [seen, setSeen] = useState(() => new Set<string>());
  const svgRef = useRef<SVGSVGElement>(null);
  const reading = useMemo(() => readDotProduct(a, b), [a, b]);
  const aPoint = toPoint(a);
  const bPoint = toPoint(b);

  const updateB = (next: Vector2) => {
    const safe: Vector2 = [clampComponent(next[0]), clampComponent(next[1])];
    setB(safe);
    const category = readDotProduct(a, safe).relation;
    if (!seen.has(category)) {
      const nextSeen = new Set(seen).add(category);
      setSeen(nextSeen);
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
    return [Math.round((local.x - ORIGIN) / SCALE * 10) / 10, Math.round((ORIGIN - local.y) / SCALE * 10) / 10];
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

  const presets: Array<{ label: string; vector: Vector2 }> = [
    { label: "Helping", vector: [3, 2] },
    { label: "Sideways", vector: [0, 4] },
    { label: "Resisting", vector: [-3, 2] },
  ];

  return (
    <div className="world-lab-grid">
      <section className="world-vector-stage" aria-labelledby="vector-plot-title">
        <div className="world-panel-heading">
          <div><span className="world-kicker">LIVE MODEL</span><h2 id="vector-plot-title">Direction agreement</h2></div>
          <output className={`world-dot-readout is-${reading.relation}`} aria-live="polite">
            <span>F · s</span><strong>{reading.dot.toFixed(2)}</strong><small>joules</small>
          </output>
        </div>
        <svg ref={svgRef} viewBox={`0 0 ${SIZE} ${SIZE}`} className="world-vector-svg">
          <title id="vector-svg-title">Force and displacement vectors on a coordinate grid</title>
          <desc id="vector-svg-desc">Displacement s is [{a[0]}, {a[1]}]. Force F is [{b[0]}, {b[1]}]. Their dot product is {reading.dot.toFixed(2)}, indicating {reading.relation}.</desc>
          <defs>
            <pattern id="minor-grid" width={SCALE} height={SCALE} patternUnits="userSpaceOnUse"><path d={`M ${SCALE} 0 L 0 0 0 ${SCALE}`} fill="none" stroke="rgba(255,255,255,.075)" strokeWidth="1" /></pattern>
            <marker id="arrow-coral" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#ff7657" /></marker>
            <marker id="arrow-mint" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#61e6b0" /></marker>
          </defs>
          <rect width={SIZE} height={SIZE} rx="24" fill="url(#minor-grid)" />
          <line x1="0" y1={ORIGIN} x2={SIZE} y2={ORIGIN} className="world-axis" /><line x1={ORIGIN} y1="0" x2={ORIGIN} y2={SIZE} className="world-axis" />
          <line x1={ORIGIN} y1={ORIGIN} x2={aPoint.x} y2={aPoint.y} className="world-vector world-vector-a" markerEnd="url(#arrow-mint)" />
          <line x1={ORIGIN} y1={ORIGIN} x2={bPoint.x} y2={bPoint.y} className="world-vector world-vector-b" markerEnd="url(#arrow-coral)" />
          <text x={aPoint.x - 3} y={aPoint.y + 27} className="world-svg-label world-svg-label-a">s</text>
          <text x={bPoint.x + 12} y={bPoint.y - 10} className="world-svg-label world-svg-label-b">F</text>
          <circle
            cx={bPoint.x} cy={bPoint.y} r="16" className="world-vector-handle" role="slider" tabIndex={0}
            aria-label="Force vector tip" aria-valuetext={`Force F is ${b[0]} horizontally and ${b[1]} vertically`}
            aria-valuemin={-5} aria-valuemax={5} aria-valuenow={b[0]}
            onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); }}
            onPointerMove={handlePointer} onKeyDown={handleKey}
          />
        </svg>
        <p className="world-readable-model"><strong>Readable model:</strong> s = [{a.join(", ")}], F = [{b.join(", ")}]. {relationCopy(reading)}</p>
      </section>

      <aside className="world-control-panel" aria-label="Vector controls and explanation">
        <div><span className="world-kicker">TRY THE EDGES</span><h2>Make the number change sign</h2></div>
        <p>Drag the coral force, focus its handle and use arrow keys, or enter exact components. Shift + arrow moves by 1.</p>
        <div className="world-presets" aria-label="Vector presets">
          {presets.map((preset) => <button key={preset.label} type="button" onClick={() => updateB(preset.vector)}>{preset.label}</button>)}
        </div>
        <fieldset className="world-number-grid">
          <legend>Exact components</legend>
          <label>sₓ<input type="number" min="-5" max="5" step="0.25" value={a[0]} onChange={(event) => setA([clampComponent(event.target.valueAsNumber), a[1]])} /></label>
          <label>sᵧ<input type="number" min="-5" max="5" step="0.25" value={a[1]} onChange={(event) => setA([a[0], clampComponent(event.target.valueAsNumber)])} /></label>
          <label>Fₓ<input type="number" min="-5" max="5" step="0.25" value={b[0]} onChange={(event) => updateB([event.target.valueAsNumber, b[1]])} /></label>
          <label>Fᵧ<input type="number" min="-5" max="5" step="0.25" value={b[1]} onChange={(event) => updateB([b[0], event.target.valueAsNumber])} /></label>
        </fieldset>
        <div className="world-equation-card">
          <span>COMPONENT VIEW</span><strong>{componentExpression(a, b)}</strong>
          <p>{relationCopy(reading)}</p>
        </div>
        <dl className="world-measures">
          <div><dt>Angle</dt><dd>{reading.angleDegrees === null ? "undefined" : `${reading.angleDegrees.toFixed(1)}°`}</dd></div>
          <div><dt>|F|</dt><dd>{reading.magnitudeB.toFixed(2)} N</dd></div>
          <div><dt>F along s</dt><dd>{reading.projectionOfBOntoA === null ? "undefined" : `${reading.projectionOfBOntoA.toFixed(2)} N`}</dd></div>
        </dl>
      </aside>
    </div>
  );
};
