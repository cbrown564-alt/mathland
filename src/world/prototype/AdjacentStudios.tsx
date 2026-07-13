import { FormEvent, useState } from "react";
import { normalise, projectionVector, readDotProduct, Vector2 } from "../studio/dotProduct";
import { DetourId, EvidenceEvent } from "../types/world";

const numeric = (value: string): number | null => value.trim() === "" || !Number.isFinite(Number(value)) ? null : Number(value);
const close = (value: string, expected: number) => {
  const parsed = numeric(value);
  return parsed !== null && Math.abs(parsed - expected) < 0.001;
};

interface NormalisationProps {
  events: EvidenceEvent[];
  onRecord: (detail: string) => void;
  onDetour: (id: DetourId, focusId: string, prompt: string) => void;
  onContinue: () => void;
}

export const NormalisationSection = ({ events, onRecord, onDetour, onContinue }: NormalisationProps) => {
  const [answer, setAnswer] = useState({ x: "", y: "" });
  const [meaning, setMeaning] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState("");
  const done = events.some((event) => event.kind === "normalised");
  const rawA = [3, 4];
  const rawB = [6, 8];
  const normalisedA = normalise(rawA)!;
  const normalisedB = normalise(rawB)!;
  const unitA: Vector2 = [normalisedA[0], normalisedA[1]];
  const unitB: Vector2 = [normalisedB[0], normalisedB[1]];
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (close(answer.x, 0.6) && close(answer.y, 0.8) && meaning === "direction") {
      setFeedback("Yes. Scaling doubled the raw dot product contribution, but normalisation removed magnitude: the two unit vectors have similarity 1.");
      onRecord("Normalised [3, 4] to [0.6, 0.8] and distinguished raw dot product from cosine similarity");
      return;
    }
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setFeedback(nextAttempts >= 2 ? "This pattern points to a magnitude-and-cosine gap. A short diagnostic repair will return to these exact entries." : "Keep direction fixed: divide each component by the vector length 5, then identify what normalisation removes.");
    if (nextAttempts >= 2) onDetour("angle-cosine", "normalisation-check", "Normalise [3, 4] before comparing direction");
  };

  return <section className="world-section world-normalisation" aria-labelledby="normalisation-title">
    <div className="world-compact-intro"><p className="world-local-label">AI Studio · magnitude and normalisation</p><h1 id="normalisation-title">Direction similarity needs unit vectors.</h1><p>Two embeddings can point the same way while having different lengths. Practise the step that makes their dot product a direction-only comparison.</p></div>
    <div className="world-normalisation-grid">
      <section className="world-normalisation-model" aria-labelledby="raw-comparison-title"><h2 id="raw-comparison-title">Same direction, different raw score</h2><div className="world-scale-comparison"><div><span>u = [3, 4]</span><strong>‖u‖ = 5</strong></div><div><span>2u = [6, 8]</span><strong>‖2u‖ = 10</strong></div></div><dl className="world-normalisation-readout"><div><dt>Raw u · u</dt><dd>25</dd></div><div><dt>Raw u · 2u</dt><dd>50</dd></div><div><dt>Unit-vector dot</dt><dd>{readDotProduct(unitA, unitB).dot.toFixed(1)}</dd></div></dl><p>The raw score doubled even though the direction did not change. Normalisation divides out length before comparison.</p></section>
      <form id="normalisation-check" tabIndex={-1} className="world-normalisation-work" onSubmit={submit}><h2>Construct the unit vector</h2><p className="world-math">û = [3/5, 4/5]</p><div className="world-contribution-inputs"><label>ûₓ<input aria-label="Normalised x component" value={answer.x} onChange={(event) => setAnswer({ ...answer, x: event.target.value })} inputMode="decimal" /></label><label>ûᵧ<input aria-label="Normalised y component" value={answer.y} onChange={(event) => setAnswer({ ...answer, y: event.target.value })} inputMode="decimal" /></label></div><fieldset className="world-reason-options"><legend>What did normalisation remove?</legend><label><input type="radio" name="normalisation-meaning" value="direction" checked={meaning === "direction"} onChange={(event) => setMeaning(event.target.value)} /> Magnitude, so the remaining score compares direction.</label><label><input type="radio" name="normalisation-meaning" value="sign" checked={meaning === "sign"} onChange={(event) => setMeaning(event.target.value)} /> Sign, so negative similarity becomes impossible.</label></fieldset><button className="world-primary-action" type="submit">Check normalisation</button>{feedback && <p className={`world-feedback ${done ? "good" : ""}`} role="status">{feedback}</p>}</form>
    </div>
    <div className="world-action-row"><div className="world-unlock-note" role="status">{done ? "Normalisation evidence recorded. Finance will now test the same component operation with a different meaning." : "To continue: construct the unit vector and identify why magnitude must be removed."}</div><button className="world-primary-action" disabled={!done} onClick={onContinue}>Transfer to portfolio return <span aria-hidden="true">→</span></button></div>
  </section>;
};

interface ProjectionProps {
  events: EvidenceEvent[];
  onRecord: (detail: string) => void;
  onDetour: (id: DetourId, focusId: string, prompt: string) => void;
  onAtlas: () => void;
}

export const ProjectionStudio = ({ events, onRecord, onDetour, onAtlas }: ProjectionProps) => {
  const [angle, setAngle] = useState(0);
  const [answers, setAnswers] = useState({ scalar: "", x: "", y: "" });
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState("");
  const force: Vector2 = [3, 4];
  const radians = angle * Math.PI / 180;
  const direction: Vector2 = [Math.cos(radians), Math.sin(radians)];
  const reading = readDotProduct(direction, force);
  const projected = projectionVector(force, direction)!;
  const done = events.some((event) => event.kind === "projected");
  const center = 150;
  const scale = 22;
  const point = (vector: Vector2) => ({ x: center + vector[0] * scale, y: center - vector[1] * scale });
  const forcePoint = point(force);
  const projectionPoint = point(projected);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const correct = close(answers.scalar, reading.projectionOfBOntoA ?? 0) && close(answers.x, projected[0]) && close(answers.y, projected[1]);
    if (correct) {
      setFeedback("Projection constructed. The signed length and the gold vector describe the same component of F along the chosen direction.");
      onRecord(`Projected [3, 4] onto direction ${angle}° as [${projected.map((value) => value.toFixed(3)).join(", ")}]`);
      return;
    }
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setFeedback(nextAttempts >= 2 ? "The mismatch is between signed length and the vector built from it. A focused cosine repair will return here." : "First find the signed length F · d̂. Then multiply the unit direction d̂ by that one number.");
    if (nextAttempts >= 2) onDetour("angle-cosine", "projection-check", `Project [3, 4] onto the ${angle}° unit direction`);
  };

  return <section className="world-section world-projection-studio" aria-labelledby="projection-studio-title">
    <div className="world-compact-intro"><p className="world-local-label">Phase 2 Studio · projection</p><h1 id="projection-studio-title">Turn one dot product into a vector along a chosen direction.</h1><p>The signed scalar says how far along the unit direction to go. Multiplying the direction by that scalar constructs the live gold projection.</p></div>
    <div className="world-projection-grid">
      <section className="world-projection-live-stage" aria-labelledby="projection-live-title"><div className="world-panel-heading"><div><p className="world-local-label">Geometry · live</p><h2 id="projection-live-title">F projected onto d̂</h2></div><output className="world-dot-readout"><span>F · d̂</span><strong>{(reading.projectionOfBOntoA ?? 0).toFixed(2)}</strong><small>signed length</small></output></div><svg viewBox="0 0 300 300" role="img" aria-label={`Force [3, 4] projected onto a unit direction at ${angle} degrees. Signed projection ${(reading.projectionOfBOntoA ?? 0).toFixed(2)}.`}><line x1="0" y1={center} x2="300" y2={center} className="world-axis"/><line x1={center} y1="0" x2={center} y2="300" className="world-axis"/><line x1={center - direction[0] * 120} y1={center + direction[1] * 120} x2={center + direction[0] * 120} y2={center - direction[1] * 120} className="projection-axis"/><line x1={center} y1={center} x2={forcePoint.x} y2={forcePoint.y} className="projection-force"/><line x1={forcePoint.x} y1={forcePoint.y} x2={projectionPoint.x} y2={projectionPoint.y} className="projection-drop"/><line x1={center} y1={center} x2={projectionPoint.x} y2={projectionPoint.y} className="projection-part"/></svg><label className="world-angle-control">Direction angle: <strong>{angle}°</strong><input aria-label="Projection direction angle" type="range" min="-180" max="180" step="15" value={angle} onChange={(event) => setAngle(Number(event.target.value))} /></label><div className="world-preset-row"><button type="button" onClick={() => setAngle(0)}>Horizontal</button><button type="button" onClick={() => setAngle(90)}>Vertical</button><button type="button" onClick={() => setAngle(-45)}>Opposing component</button></div></section>
      <form id="projection-check" tabIndex={-1} className="world-projection-work" onSubmit={submit}><h2>Translate geometry to components</h2><p className="world-math">proj_d̂(F) = (F · d̂)d̂</p><p>At the current angle, enter both the signed length and the endpoint of the gold projection vector.</p><div className="world-contribution-inputs"><label>Signed length<input aria-label="Projection signed length" value={answers.scalar} onChange={(event) => setAnswers({ ...answers, scalar: event.target.value })} inputMode="decimal" /></label><label>Projection x<input aria-label="Projection x component" value={answers.x} onChange={(event) => setAnswers({ ...answers, x: event.target.value })} inputMode="decimal" /></label><label>Projection y<input aria-label="Projection y component" value={answers.y} onChange={(event) => setAnswers({ ...answers, y: event.target.value })} inputMode="decimal" /></label></div><button className="world-primary-action" type="submit">Check projection</button>{feedback && <p className={`world-feedback ${done ? "good" : ""}`} role="status">{feedback}</p>}<details><summary>Show the current symbolic setup</summary><p>d̂ = [{direction[0].toFixed(3)}, {direction[1].toFixed(3)}]. F · d̂ = 3({direction[0].toFixed(3)}) + 4({direction[1].toFixed(3)}).</p></details></form>
    </div>
    <div className="world-action-row"><div className="world-unlock-note">{done ? "Projection evidence recorded for this territory." : "To return with evidence: match the live signed length to its projection vector."}</div><button className="world-primary-action" onClick={onAtlas}>{done ? "Return to the Atlas" : "Return without projection evidence"} <span aria-hidden="true">↩</span></button></div>
  </section>;
};
