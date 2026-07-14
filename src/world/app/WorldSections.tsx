import { FormEvent, useMemo, useState } from "react";
import { domainJourneys, territories } from "../atlas/territories";
import { cases, horizonNames, primaryDomains } from "../cases/cases";
import { deriveAtlasState } from "../evidence/evidenceStore";
import veraProjection from "../media/veraProjection.json";
import { DetourId, DomainId, EvidenceEvent, JourneyStep, WorldSnapshot } from "../types/world";

interface EntryProps {
  goal: Exclude<DomainId, "climate">;
  onGoal: (goal: Exclude<DomainId, "climate">) => void;
  onContinue: () => void;
  onTour: () => void;
}

export const EntrySection = ({ goal, onGoal, onContinue, onTour }: EntryProps) => (
  <section className="world-entry world-section" aria-labelledby="entry-title">
    <div className="world-entry-copy">
      <p className="world-local-label">One operation across three worlds</p>
      <h1 id="entry-title">A force, a meaning, a return—one mathematical move.</h1>
      <p className="world-lede">Learn to calculate the dot product, explain its sign, and recognise the same structure when the nouns change.</p>
      <div className="world-promise"><strong>What you will be able to do</strong><p>Predict, construct, calculate, explain, transfer, and later retrieve the operation.</p></div>
    </div>
    <div className="world-goal-panel">
      <h2>Choose your horizon once</h2>
      <p>Your horizon is the harder thing you are building toward. It stays visible through Studios and detours, and you can deliberately change it from the header or Atlas.</p>
      <div className="world-goal-list" role="radiogroup" aria-label="Learning horizon">
        {primaryDomains.map((domain) => {
          const item = cases[domain];
          return <button key={domain} type="button" role="radio" aria-checked={goal === domain} className={goal === domain ? "is-active" : ""} onClick={() => onGoal(domain)}>
            <strong>{horizonNames[domain]}</strong><span>{domain === "engineering" ? "Forces → control systems" : domain === "ai" ? "Embeddings → optimisation" : "Returns → risk and optimisation"}</span><small>{item.formula}</small>
          </button>;
        })}
      </div>
      <div className="world-entry-actions">
        <button className="world-primary-action" type="button" onClick={onContinue}>Set this horizon and begin with the case <span aria-hidden="true">→</span></button>
        <button className="world-secondary-action world-tour-choice" type="button" onClick={onTour}>Take the optional workshop tour first</button>
        <p className="world-time-note">Tour: about 5–7 minutes · your work stays in this browser</p>
      </div>
    </div>
  </section>
);

interface TourProps { onComplete: () => void; onSkip: () => void }

const tourMoves = [
  { title: "Predict before the reveal", body: "Commit to an expectation. A prediction gives the result something to answer.", action: "I predict the sign is positive" },
  { title: "Manipulate the object", body: "Drag, use arrow keys, choose an extreme case, or enter exact components. Every route changes the same model.", action: "Move force to a right angle" },
  { title: "Check a harmless attempt", body: "Try the tempting answer first. Mathland preserves the attempt and starts teaching from it.", action: "Check 6 for [2, 1] · [3, 1]" },
  { title: "Ask for progressive help", body: "Help starts with one observation, then a cue, comparison, worked step, detour, and fresh attempt. Supported work is recorded honestly.", action: "Show one focused cue" },
  { title: "Read evidence, not completion", body: "The Atlas records what you predicted, constructed, explained, transferred, and retrieved—and the support used.", action: "Record this tour move" },
  { title: "Orient in the Atlas", body: "The Atlas holds your horizon, current territory, connections, detours, and return path. Opening it never erases Studio work.", action: "Finish the tour" },
];

export const TourSection = ({ onComplete, onSkip }: TourProps) => {
  const [move, setMove] = useState(0);
  const [acted, setActed] = useState(false);
  const current = tourMoves[move];
  const act = () => {
    if (move === tourMoves.length - 1) { onComplete(); return; }
    setActed(true);
  };
  const next = () => { setMove((value) => value + 1); setActed(false); };
  return <section className="world-section world-tour" aria-labelledby="tour-title">
    <div className="world-compact-intro"><p className="world-local-label">Workshop tour · move {move + 1} of {tourMoves.length}</p><h1 id="tour-title">{current.title}</h1><p>{current.body}</p></div>
    <div className="world-tour-workbench">
      <div className={`world-tour-demo tour-${move}`} aria-hidden="true"><span className="world-tour-vector vector-one" /><span className="world-tour-vector vector-two" /><strong>{move === 2 ? "6 → look again" : move === 4 ? "supported · cue" : move === 5 ? "dot product ↗ projection" : "F · s"}</strong></div>
      <div className="world-tour-action"><button className="world-primary-action" type="button" onClick={act}>{current.action}</button><div className="world-tour-feedback-slot" aria-live="polite">{acted && <p className="world-feedback good">{move === 2 ? "The attempt stays visible. The first divergence is the missing 1 × 1 contribution: 6 + 1 = 7." : move === 3 ? "Cue: write one product for each matched position before adding." : "Move recorded. The mathematical state, not the animation, is what matters."}</p>}</div>
        <div className="world-tour-next-slot">{acted && <button className="world-secondary-action" type="button" onClick={next}>Continue tour <span aria-hidden="true">→</span></button>}</div>
      </div>
    </div>
    <div className="world-tour-footer"><button className="world-quiet-action" type="button" onClick={onSkip}>Skip tour for now</button><span>You can reopen it from Help at any time.</span></div>
  </section>;
};

interface ObservatoryProps { onPredict: (prediction: string) => void; onContinue: () => void; predicted: boolean }

export const ObservatorySection = ({ onPredict, onContinue, predicted }: ObservatoryProps) => {
  const [meanings, setMeanings] = useState<Partial<Record<Exclude<DomainId, "climate">, string>>>(() => predicted ? { engineering: "energy", ai: "direction", finance: "return" } : {});
  const [sign, setSign] = useState<string | null>(predicted ? "It becomes negative" : null);
  const complete = primaryDomains.every((domain) => meanings[domain]) && Boolean(sign);
  const chooseMeaning = (domain: Exclude<DomainId, "climate">, value: string) => setMeanings((current) => ({ ...current, [domain]: value }));
  const chooseSign = (value: string) => { setSign(value); if (primaryDomains.every((domain) => meanings[domain])) onPredict(`${primaryDomains.map((domain) => `${domain}:${meanings[domain]}`).join("; ")}; sign:${value}`); };
  const options: Record<Exclude<DomainId, "climate">, Array<[string, string]>> = {
    engineering: [["energy", "Energy transferred along the motion"], ["force", "Total force, regardless of motion"]],
    ai: [["direction", "Direction similarity after normalisation"], ["distance", "The distance between two data points"]],
    finance: [["return", "Weighted realised return for one period"], ["forecast", "A forecast of next period"]],
  };
  return <section className="world-section world-observatory" aria-labelledby="observatory-title">
    <div className="world-compact-intro"><p className="world-local-label">Observatory opening</p><h1 id="observatory-title">Three systems compress two lists into one number.</h1><p>First identify what the number measures in each system. Then predict what opposing contributions do to its sign.</p></div>
    <div className="world-case-triptych">
      {primaryDomains.map((domain, index) => { const item = cases[domain]; return <article key={domain} className={`world-case-card case-${domain}`}><div className="world-case-orbit" aria-hidden="true"><i /><span>{index === 0 ? "12 J" : index === 1 ? "0.96" : "+5.0%"}</span></div><p className="world-local-label">{domain}</p><h2>{item.title}</h2><p>{item.question}</p><fieldset className="world-case-noticing"><legend>What is this number measuring?</legend>{options[domain].map(([value, label]) => <label key={value}><input type="radio" name={`meaning-${domain}`} value={value} checked={meanings[domain] === value} onChange={() => chooseMeaning(domain, value)} /> {label}</label>)}</fieldset><div className="world-case-formula">{meanings[domain] ? item.formula : "? → one number"}</div></article>; })}
    </div>
    <div className="world-prediction-panel"><h2>If opposing contributions dominate, what should happen?</h2><div className="world-prediction-options">{["It becomes negative", "It becomes zero", "Direction should not matter"].map((value) => <button type="button" key={value} className={sign === value ? "is-selected" : ""} onClick={() => chooseSign(value)}>{value}</button>)}</div>{sign && <div className="world-reveal" role="status"><strong>{sign === "It becomes negative" ? "Yes—opposition wins the net." : "Keep that prediction visible while you test it."}</strong><p>Multiply matching components, then add: <b>a · b = a₁b₁ + a₂b₂</b>. The same scalar operation serves different meanings and assumptions.</p></div>}</div>
    <div className="world-action-row"><div className="world-unlock-note">{complete ? "Noticing and sign prediction recorded." : "To continue: identify the scalar in all three systems and make one sign prediction."}</div><button className="world-primary-action" disabled={!complete} onClick={onContinue}>Test the claim in the Studio <span aria-hidden="true">→</span></button></div>
  </section>;
};

export const VeraIntervention = () => {
  return (
  <aside className="world-vera" aria-labelledby="vera-title">
    <div className="world-vera-guide"><img src="/world/vera.png" alt="Vera, Mathland's vector field specialist" /><div><p className="world-local-label">Vera · vector lens</p><h2 id="vera-title">Project before you multiply</h2><p>Vera’s professional habit is to ask which part of a force lies along the motion. The dashed projection is the component that can do work.</p></div></div>
    <figure className="world-projection-figure"><svg viewBox="0 0 360 180" role="img" aria-labelledby="projection-title projection-desc"><title id="projection-title">Force projected onto displacement</title><desc id="projection-desc">A diagonal force vector is projected onto a horizontal displacement direction. The horizontal projected length is the part of the force that contributes to work.</desc><line x1="35" y1="140" x2="320" y2="140" className="projection-axis"/><line x1="35" y1="140" x2="230" y2="42" className="projection-force"/><line x1="230" y1="42" x2="230" y2="140" className="projection-drop"/><line x1="35" y1="140" x2="230" y2="140" className="projection-part"/><text x="236" y="48">F</text><text x="120" y="166">component along s</text></svg><figcaption>Geometric view: F · s = |s| times the signed length of F projected onto s.</figcaption></figure>
    <div className="world-vera-audio"><div><strong>Hear Vera’s engineering lens</strong><span>Vera voice · ElevenLabs · no autoplay</span></div><audio controls preload="metadata" aria-label="Hear Vera explain the projection lens"><source src={veraProjection.audioSrc} type="audio/mpeg" />Your browser does not support audio playback.</audio><details><summary>Read transcript</summary><p>{veraProjection.transcript}</p><p className="world-media-note">The live gold projection and transcript provide the complete teaching path without audio.</p></details></div>
  </aside>
  );
};

export const FormalSpine = () => (
  <section className="world-formal-spine" aria-labelledby="formal-title"><div className="world-formal-heading"><div><p className="world-local-label">Formal spine</p><h2 id="formal-title">Two definitions, one scalar</h2></div><p>The dot product of two real vectors with the same dimension is the sum of their matched component products.</p></div><div className="world-formal-grid"><article><strong>Component definition</strong><p className="world-math">a · b = Σᵢ aᵢbᵢ</p><p>For two dimensions: a₁b₁ + a₂b₂.</p></article><article><strong>Geometric identity</strong><p className="world-math">a · b = ‖a‖‖b‖ cos θ</p><p>For non-zero vectors, θ is the angle from 0 to π.</p></article><article><strong>Sign theorem</strong><p>Because both magnitudes are non-negative, the sign is the sign of cos θ: positive below 90°, zero at 90°, negative above 90°.</p></article></div><details><summary>Derive the geometric identity</summary><p>Apply the law of cosines to the triangle formed by <b>a</b>, <b>b</b>, and <b>a − b</b>: ‖a − b‖² = ‖a‖² + ‖b‖² − 2‖a‖‖b‖cos θ. Expanding the left side by components gives ‖a‖² + ‖b‖² − 2a · b. Equating the two expressions and cancelling common terms yields a · b = ‖a‖‖b‖cos θ.</p></details></section>
);

interface PracticeProps { events: EvidenceEvent[]; onRecord: (kind: "attempted" | "supported" | "independent" | "explained", detail: string, support: EvidenceEvent["support"]) => void; onDetour: (id: DetourId, focusId: string, prompt: string) => void; onContinue: () => void }

const recoveryCopy = [
  "Observation: your work is preserved. Compare the sign of each matched product with the sign of your total.",
  "Focused cue: write the two contributions separately before adding them.",
  "Comparison: (2 × −4) is negative and (−3 × 1) is also negative, so a positive total cannot fit both contributions.",
  "Worked step: 2 × −4 = −8 and −3 × 1 = −3. The remaining move is −8 + (−3).",
  "A signed-components detour can repair this exact move and return here.",
  "Fresh equivalent attempt: use [3, −2] · [−2, 4]. Your earlier answer remains above.",
];

export const PracticeSection = ({ events, onRecord, onDetour, onContinue }: PracticeProps) => {
  const [faded, setFaded] = useState("");
  const [parts, setParts] = useState({ first: "", second: "", total: "" });
  const [supportLevel, setSupportLevel] = useState(0);
  const [calculationErrors, setCalculationErrors] = useState(0);
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [geometry, setGeometry] = useState({ x: "", y: "" });
  const [reason, setReason] = useState("");
  const [meaning, setMeaning] = useState("");
  const supportedDone = events.some((event) => event.kind === "supported" && event.detail?.startsWith("Faded"));
  const calculationDone = events.some((event) => (event.kind === "independent" || event.kind === "supported") && event.detail?.startsWith("Calculation"));
  const geometryDone = events.some((event) => event.kind === "independent" && event.detail?.startsWith("Geometry"));
  const explainedDone = events.some((event) => event.kind === "explained");
  const fresh = supportLevel >= 6;
  const expected = fresh ? { first: -6, second: -8, total: -14 } : { first: -8, second: -3, total: -11 };
  const vectorText = fresh ? "[3, −2] · [−2, 4]" : "[2, −3] · [−4, 1]";

  const checkFaded = () => {
    if (faded.trim() !== "" && Number(faded) === 2) { setFeedback((value) => ({ ...value, faded: "Correct: +12 and −10 leave a net contribution of +2." })); onRecord("supported", "Faded calculation completed", "cue"); }
    else setFeedback((value) => ({ ...value, faded: "Keep both signed contributions visible: +12 + (−10)." }));
  };
  const checkCalculation = () => {
    const complete = Object.values(parts).every((value) => value.trim() !== "" && Number.isFinite(Number(value)));
    const correct = complete && Number(parts.first) === expected.first && Number(parts.second) === expected.second && Number(parts.total) === expected.total;
    if (correct) {
      const supportByLevel: Record<number, EvidenceEvent["support"]> = { 0: "none", 1: "observation", 2: "cue", 3: "comparison", 4: "worked", 5: "restudied", 6: "none" };
      const support = supportByLevel[supportLevel] ?? "restudied";
      const independent = supportLevel === 0 || fresh;
      onRecord(independent ? "independent" : "supported", `Calculation ${vectorText} = ${expected.total}`, support);
      setFeedback((value) => ({ ...value, calculation: independent ? "Independent calculation recorded on this item." : `Completed with ${support}. Independent evidence remains open.` }));
      return;
    }
    onRecord("attempted", `Attempt ${vectorText}: ${parts.first}, ${parts.second}, ${parts.total}`, supportLevel === 0 ? "none" : "cue");
    setSupportLevel((value) => Math.min(6, value + 1));
    const nextErrors = calculationErrors + 1;
    setCalculationErrors(nextErrors);
    setFeedback((value) => ({ ...value, calculation: "Your entries stay in place. Use the next teaching step below, then revise them." }));
    if (nextErrors >= 2) onDetour("signed-arithmetic", "independent-challenge", `Resolve the signed contributions in ${vectorText}`);
  };
  const checkGeometry = () => {
    if (geometry.x.trim() !== "" && geometry.y.trim() !== "" && Number(geometry.x) === 3 && Number(geometry.y) === -2) {
      onRecord("independent", "Geometry translated endpoint to components [3, -2]", "none");
      setFeedback((value) => ({ ...value, geometry: "Geometry-to-components translation recorded." }));
      return;
    }
    setFeedback((value) => ({ ...value, geometry: "Read from the origin: three units right is +3; two units down is −2." }));
  };
  const saveExplanation = () => {
    const lower = meaning.toLowerCase();
    const meetsCriteria = /direction/.test(lower) && /(oppos|against)/.test(lower) && /(projection|along|angle)/.test(lower);
    if (reason !== "opposing" || !meetsCriteria) { setFeedback((value) => ({ ...value, explanation: "Use all three criteria: identify the opposing net, name direction or angle, and connect it to projection or what lies along the reference vector." })); return; }
    onRecord("explained", `Opposing contributions dominate. ${meaning.trim()}`, "none");
    setFeedback((value) => ({ ...value, explanation: "Explanation recorded against the stated reasoning criteria." }));
  };

  return <section className="world-section world-practice" aria-labelledby="practice-title"><div className="world-compact-intro"><p className="world-local-label">Studio · calculate and explain</p><h1 id="practice-title">Expose the contributions, then explain the sign.</h1><p>See the structure once, complete it once, then make it your own.</p></div><FormalSpine /><ol className="world-practice-stack">
    <li className="world-practice-card world-practice-worked is-complete"><div className="world-practice-index">1</div><div><span className="world-practice-mode">See</span><h2>Every contribution exposed</h2><p className="world-math">[3, 2] · [4, −1] = (3 × 4) + (2 × −1)</p><div className="world-contribution-row"><span>+12 supporting</span><span>−2 opposing</span><strong>= +10 net</strong></div><p className="world-practice-takeaway">A signed net—not a distance.</p></div></li>
    <li className={`world-practice-card world-practice-faded ${supportedDone ? "is-complete" : ""}`} id="faded-challenge" tabIndex={-1}><div className="world-practice-index">2</div><div><span className="world-practice-mode">Complete</span><h2>Finish the net</h2><p className="world-math">[4, −2] · [3, 5] = +12 + (−10)</p><div className="world-inline-answer"><label>Net contribution<input aria-label="Faded example answer" inputMode="decimal" value={faded} onChange={(event) => setFaded(event.target.value)} /></label><button type="button" onClick={checkFaded}>Check</button></div>{feedback.faded && <p className={`world-feedback ${supportedDone ? "good" : ""}`} role="status">{feedback.faded}</p>}</div></li>
    <li className={`world-practice-card world-practice-independent ${calculationDone ? "is-complete" : ""}`} id="independent-challenge" tabIndex={-1}><div className="world-practice-index">3</div><div className="world-practice-prompt"><span className="world-practice-mode">Work</span><h2>{fresh ? "Fresh equivalent attempt" : "Now without the scaffold"}</h2><p>Keep the two signed products separate until the final addition.</p><p className="world-math">{vectorText}</p></div><div className="world-practice-work"><div className="world-contribution-inputs"><label>First matched product<input aria-label="First matched product" value={parts.first} inputMode="decimal" onChange={(event) => setParts({ ...parts, first: event.target.value })} /></label><label>Second matched product<input aria-label="Second matched product" value={parts.second} inputMode="decimal" onChange={(event) => setParts({ ...parts, second: event.target.value })} /></label><label>Net dot product<input aria-label="Net dot product" value={parts.total} inputMode="decimal" onChange={(event) => setParts({ ...parts, total: event.target.value })} /></label></div><button className="world-secondary-action" type="button" onClick={checkCalculation}>Check all three values</button>{feedback.calculation && <p className={`world-feedback ${calculationDone ? "good" : ""}`} role="status">{feedback.calculation}</p>}{supportLevel > 0 && !calculationDone && <div className="world-recovery" aria-live="polite"><strong>Teaching step {supportLevel} of 6</strong><p>{recoveryCopy[supportLevel - 1]}</p>{supportLevel === 5 && <button className="world-help-link" type="button" onClick={() => onDetour("signed-arithmetic", "independent-challenge", `Resolve the signed contributions in ${vectorText}`)}>Take the diagnosed arithmetic detour</button>}<button className="world-quiet-action" type="button" onClick={() => setSupportLevel((value) => Math.min(6, value + 1))}>Show the next level of help</button></div>}</div></li>
    <li className={`world-practice-card world-practice-geometry ${geometryDone ? "is-complete" : ""}`} id="geometry-challenge" tabIndex={-1}><div className="world-practice-index">4</div><div><span className="world-practice-mode">Translate</span><h2>From movement to components</h2><p>A vector starts at the origin and ends three units right and two units down.</p><div className="world-contribution-inputs"><label>Horizontal component<input aria-label="Geometry horizontal component" value={geometry.x} onChange={(event) => setGeometry({ ...geometry, x: event.target.value })} inputMode="numeric" /></label><label>Vertical component<input aria-label="Geometry vertical component" value={geometry.y} onChange={(event) => setGeometry({ ...geometry, y: event.target.value })} inputMode="numeric" /></label></div><div className="world-practice-actions"><button className="world-secondary-action" type="button" onClick={checkGeometry}>Check component translation</button><button className="world-help-link" type="button" onClick={() => onDetour("vector-components", "geometry-challenge", "Translate an endpoint into signed vector components")}>Repair coordinate components</button></div>{feedback.geometry && <p className={`world-feedback ${geometryDone ? "good" : ""}`} role="status">{feedback.geometry}</p>}</div></li>
    <li className={`world-practice-card world-practice-explanation ${explainedDone ? "is-complete" : ""}`}><div className="world-practice-index">5</div><div><span className="world-practice-mode">Explain</span><h2>Make the sign mean something</h2><p className="world-reason-criteria"><strong>Your explanation must:</strong> identify the opposing net; name direction or angle; connect it to projection or what lies along the reference vector.</p><fieldset className="world-reason-options"><legend>What determines the negative sign?</legend><label><input type="radio" name="reason" value="opposing" checked={reason === "opposing"} onChange={(event) => setReason(event.target.value)} /> The negative component contributions dominate the net.</label><label><input type="radio" name="reason" value="length" checked={reason === "length"} onChange={(event) => setReason(event.target.value)} /> The vectors have different lengths.</label></fieldset><label className="world-textarea-label">In this calculation, what does a negative dot product say geometrically?<textarea value={meaning} onChange={(event) => setMeaning(event.target.value)} placeholder="Connect opposition, direction or angle, and signed projection." /></label><button className="world-secondary-action" type="button" onClick={saveExplanation}>Check reasoning</button>{feedback.explanation && <p className={`world-feedback ${explainedDone ? "good" : ""}`} role="status">{feedback.explanation}</p>}</div></li>
  </ol><div className="world-action-row"><div className="world-unlock-note">{supportedDone && calculationDone && geometryDone && explainedDone ? "Calculation, translation, and explanation evidence are ready." : "To continue: finish the faded and independent calculations, translate geometry to components, and meet all explanation criteria."}</div><button className="world-primary-action" disabled={!(supportedDone && calculationDone && geometryDone && explainedDone)} onClick={onContinue}>Practise AI normalisation <span aria-hidden="true">→</span></button></div></section>;
};

interface TransferProps { events: EvidenceEvent[]; onTransfer: (detail: string) => void; onDefer: () => void; onDetour: (id: DetourId, focusId: string, prompt: string) => void; onContinue: () => void }
export const TransferSection = ({ events, onTransfer, onDefer, onDetour, onContinue }: TransferProps) => {
  const [oriented, setOriented] = useState(false); const [parts, setParts] = useState({ first: "", second: "", total: "" }); const [meaning, setMeaning] = useState(""); const [feedback, setFeedback] = useState(""); const [errors, setErrors] = useState(0); const done = events.some((event) => event.kind === "transferred");
  const submit = (event: FormEvent) => { event.preventDefault(); const complete = Object.values(parts).every((value) => value.trim() !== "" && Number.isFinite(Number(value))); const correct = complete && Math.abs(Number(parts.first) - .04) < .0001 && Math.abs(Number(parts.second) + .004) < .0001 && (Math.abs(Number(parts.total) - .036) < .0001 || Math.abs(Number(parts.total) - 3.6) < .01); if (!correct || meaning !== "realised") { const nextErrors = errors + 1; setErrors(nextErrors); setFeedback("Keep the two weighted contributions visible: 0.8 × 0.05 and 0.2 × −0.02. Then identify this as a realised one-period return."); if (nextErrors >= 2) onDetour("weighted-sums", "finance-transfer-work", "Match portfolio weights to realised returns and preserve the units"); return; } setFeedback("Yes: +4.0% and −0.4% combine to +3.6% in this bounded model."); onTransfer("Finance transfer: +0.04 + -0.004 = +0.036 realised return"); };
  return <section className="world-section world-transfer" aria-labelledby="transfer-title"><div className="world-compact-intro"><p className="world-local-label">Cross-domain transfer · finance</p><h1 id="transfer-title">The nouns will change; the operation will not.</h1><p>This change of domain tests whether the dot-product structure travels. It does not test prior finance knowledge.</p></div><div className="world-transfer-orientation"><div><strong>Structure that stays fixed</strong><p>Multiply matched components, preserve signs, add the contributions to one scalar.</p></div><div><strong>New terms and units</strong><p>A weight is the fraction allocated to an asset. A realised return is the observed percentage change over one period.</p></div><div><strong>Simplifications</strong><p>Fixed weights, one realised period, no fees, tax, slippage, rebalancing, forecast, or advice.</p></div></div>{!oriented ? <div className="world-orientation-actions"><button className="world-primary-action" type="button" onClick={() => setOriented(true)}>I’m ready to translate the terms</button><button className="world-secondary-action" type="button" onClick={onDefer}>Defer finance without recording transfer</button></div> : <div className="world-transfer-grid"><article className="world-transfer-case"><h2>Two assets, one realised return</h2><div className="world-asset-row"><span>Asset A</span><strong>0.8 weight</strong><em>+0.05 return</em></div><div className="world-asset-row"><span>Asset B</span><strong>0.2 weight</strong><em>−0.02 return</em></div><p className="world-assumption">The weights sum to 1. Returns are decimals: 0.05 means +5%.</p></article><form id="finance-transfer-work" tabIndex={-1} className="world-transfer-work" onSubmit={submit}><h2>Expose both contributions</h2><p className="world-math">[0.8, 0.2] · [0.05, −0.02]</p><label>Asset A contribution<input aria-label="Asset A contribution" value={parts.first} onChange={(event) => setParts({ ...parts, first: event.target.value })} /></label><label>Asset B contribution<input aria-label="Asset B contribution" value={parts.second} onChange={(event) => setParts({ ...parts, second: event.target.value })} /></label><label>Portfolio return<input aria-label="Portfolio return" value={parts.total} onChange={(event) => setParts({ ...parts, total: event.target.value })} placeholder="decimal or %" /></label><fieldset className="world-reason-options"><legend>What does the scalar represent?</legend><label><input type="radio" name="transfer-meaning" value="realised" checked={meaning === "realised"} onChange={(event) => setMeaning(event.target.value)} /> The weighted realised return for this one period.</label><label><input type="radio" name="transfer-meaning" value="forecast" checked={meaning === "forecast"} onChange={(event) => setMeaning(event.target.value)} /> A forecast of the next period.</label></fieldset><button className="world-primary-action" type="submit">Check transfer</button>{feedback && <p className={`world-feedback ${done ? "good" : ""}`} role="status">{feedback}</p>}</form></div>}<div className="world-action-row"><div className="world-unlock-note">{done ? "Finance transfer recorded." : "To open the Atlas with transfer evidence: calculate both weighted contributions and identify the realised one-period return."}</div><button className="world-primary-action" disabled={!done} onClick={onContinue}>Open the Atlas <span aria-hidden="true">→</span></button></div></section>;
};

interface AtlasProps { snapshot: WorldSnapshot; onRetrieval: () => void; onResume: () => void; onEditHorizon: () => void; onOpenTerritory: (step: JourneyStep) => void }
export const AtlasSection = ({ snapshot, onRetrieval, onResume, onEditHorizon, onOpenTerritory }: AtlasProps) => {
  const evidenceState = deriveAtlasState(snapshot.evidence, snapshot.retrievalDueAt);
  const activeJourney = domainJourneys[snapshot.activeGoal];
  const connections = useMemo(() => territories.flatMap((territory) => territory.downstreamIds.map((target) => ({ from: territory, to: territories.find((item) => item.id === target) })).filter((item) => item.to)), []);
  const stepForTerritory = (id: string): JourneyStep | null => id === "projection" ? "projection" : id === "magnitude-angle" ? "normalisation" : id === "dot-product" ? "studio" : null;
  return <section className="world-section world-atlas" aria-labelledby="atlas-title"><div className="world-compact-intro"><p className="world-local-label">Atlas · orientation</p><h1 id="atlas-title">You are in dot product, heading toward {horizonNames[snapshot.activeGoal].toLowerCase()}.</h1><p>The highlighted route keeps the horizon visible. The three operable territories are real Studios; the remaining nodes show honest future connections.</p><button className="world-quiet-action" type="button" onClick={onEditHorizon}>Edit horizon deliberately</button></div><div className="world-atlas-layout"><div className="world-map" aria-label={`Eight connected mathematical territories. Dot product evidence state: ${evidenceState}.`}><svg viewBox="0 0 100 100" aria-hidden="true" preserveAspectRatio="none">{connections.map(({ from, to }) => to && <line key={`${from.id}-${to.id}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={activeJourney.includes(from.id) && activeJourney.includes(to.id) ? "is-route" : ""} />)}</svg>{territories.map((territory) => { const target = stepForTerritory(territory.id); const event = territory.id === "projection" ? snapshot.evidence.find((item) => item.kind === "projected") : territory.id === "magnitude-angle" ? snapshot.evidence.find((item) => item.kind === "normalised") : null; return <button type="button" disabled={!target} onClick={() => target && onOpenTerritory(target)} key={territory.id} style={{ left: `clamp(56px, ${territory.x}%, calc(100% - 56px))`, top: `${territory.y}%` }} className={`world-node ${territory.id === "dot-product" ? "is-current" : ""} ${territory.status === "horizon" ? "is-horizon" : ""} ${activeJourney.includes(territory.id) ? "is-route" : ""}`} aria-label={`${territory.title}${target ? ", open Studio" : ", future territory"}`}><span>{territory.notation ?? territory.shortTitle}</span>{territory.id === "dot-product" && <small>{evidenceState.replace(/-/g, " ")}</small>}{event && <small>evidence recorded</small>}</button>; })}</div><aside className="world-atlas-aside"><h2>Evidence, with support visible</h2><ul className="world-evidence-list">{[["predicted", "Prediction"], ["constructed", "All sign regions"], ["independent", "Independent calculation"], ["explained", "Geometric explanation"], ["normalised", "AI normalisation"], ["transferred", "Finance transfer"], ["projected", "Projection construction"]].map(([kind, label]) => { const event = snapshot.evidence.find((item) => item.kind === kind); return <li key={kind} className={event ? "is-recorded" : ""}><i aria-hidden="true" /><span>{label}{event?.support && event.support !== "none" ? ` · ${event.support}` : ""}</span></li>; })}</ul><div className="world-next-move"><strong>Open neighbouring Studios</strong><p>Normalisation separates magnitude from direction. Projection turns the scalar back into a vector along a chosen direction.</p><div className="world-button-pair"><button className="world-secondary-action" onClick={() => onOpenTerritory("normalisation")}>Open normalisation</button><button className="world-primary-action" onClick={() => onOpenTerritory("projection")}>Open projection</button></div></div></aside></div><div className="world-return-card"><div><h2>{snapshot.retrievalDueAt ? `Retrieval scheduled for ${new Date(snapshot.retrievalDueAt).toLocaleDateString()}` : "Transfer is deferred; retrieval is not scheduled"}</h2><p>Domain orientation is separate from the future memory attempt. Preview work never counts as delayed retrieval.</p></div><button className="world-secondary-action" onClick={onRetrieval}>Preview retrieval orientation</button></div><div className="world-action-row"><button className="world-primary-action" onClick={onResume}>Return to the exact Studio move <span aria-hidden="true">↩</span></button></div></section>;
};

interface RetrievalProps { events: EvidenceEvent[]; dueAt: string | null; onRecord: (detail: string, support: EvidenceEvent["support"]) => void; onSubstitute: () => void; onAtlas: () => void }
export const RetrievalSection = ({ events, dueAt, onRecord, onSubstitute, onAtlas }: RetrievalProps) => {
  const due = Boolean(dueAt && new Date(dueAt) <= new Date()); const done = events.some((event) => event.kind === "retrieved"); const [oriented, setOriented] = useState(false); const [answer, setAnswer] = useState(""); const [cue, setCue] = useState(0); const [substitute, setSubstitute] = useState(false); const [feedback, setFeedback] = useState("");
  const useSubstitute = () => { setSubstitute(true); setAnswer(""); onSubstitute(); };
  const expected = substitute ? 1.7 : 2.1;
  const check = () => { if (answer.trim() === "" || !Number.isFinite(Number(answer)) || Math.abs(Number(answer) - expected) > .001) { setFeedback("Your work stays in place. Keep each weight beside its matched deviation, then add the three signed contributions."); setCue((value) => Math.min(3, value + 1)); return; } if (!due) { setFeedback(`Preview complete: the result is ${expected}. No delayed-retrieval evidence was recorded.`); return; } const support: EvidenceEvent["support"] = substitute ? "substituted" : cue === 0 ? "none" : cue < 3 ? "cue" : "worked"; setFeedback(`Retrieved: the weighted score is ${expected}. Evidence recorded as ${support}.`); onRecord(`${substitute ? "Quality-control" : "Climate index"} retrieval`, support); };
  return <section className="world-section world-retrieval" aria-labelledby="retrieval-title"><div className="world-compact-intro"><p className="world-local-label">Return loop · domain orientation first</p><h1 id="retrieval-title">Retrieve the operation, not climate vocabulary.</h1><p>{due ? `This scheduled return was due ${new Date(dueAt!).toLocaleDateString()}.` : "Preview mode: this attempt will not count as delayed retrieval."}</p></div>{!oriented ? <div className="world-retrieval-orientation"><h2>What this model means</h2><p>Three sensors report deviations from a baseline. A positive deviation is above baseline; a negative deviation is below. Reliability weights state how much each sensor contributes and sum to one. The weighted exposure index is only a small linear summary, not a climate conclusion.</p><div className="world-button-pair"><button className="world-primary-action" onClick={() => setOriented(true)}>Start the memory attempt</button><button className="world-secondary-action" onClick={useSubstitute}>Climate terms block me—use an equivalent context</button></div></div> : <div className="world-retrieval-card"><div className="world-sensor-table" role="table" aria-label={`${substitute ? "Quality-control signal" : "Climate sensor"} weights and deviations`}><div role="row"><span role="columnheader">{substitute ? "Signal" : "Sensor"}</span><span role="columnheader">Weight</span><span role="columnheader">Deviation</span></div>{(substitute ? [["Shape", "0.5", "+3"], ["Surface", "0.3", "−2"], ["Mass", "0.2", "+4"]] : [["Air", "0.5", "+4"], ["Water", "0.3", "−1"], ["Soil", "0.2", "+2"]]).map((row) => <div role="row" key={row[0]}>{row.map((cell) => <span role="cell" key={cell}>{cell}</span>)}</div>)}</div><div className="world-retrieval-work"><h2>Find the weighted {substitute ? "quality" : "exposure"} index.</h2>{cue > 0 && <p className="world-feedback">{cue === 1 ? "Observation: there are two equal-length lists and one requested scalar." : cue === 2 ? "Cue: multiply each weight by the deviation in the same row, then add." : substitute ? "Worked setup: 0.5(3) + 0.3(−2) + 0.2(4)." : "Worked setup: 0.5(4) + 0.3(−1) + 0.2(2)."}</p>}<label>Weighted index<input aria-label="Weighted index" value={answer} inputMode="decimal" onChange={(event) => setAnswer(event.target.value)} /></label><div className="world-button-pair"><button className="world-secondary-action" onClick={() => setCue((value) => Math.min(3, value + 1))}>Reveal the next cue</button><button className="world-primary-action" onClick={check}>Check retrieval</button></div>{!substitute && <button className="world-quiet-action" type="button" onClick={useSubstitute}>Switch to the equivalent quality-control context</button>}{feedback && <p className={`world-feedback ${done || feedback.startsWith("Preview complete") ? "good" : ""}`} role="status">{feedback}</p>}</div></div>}<div className="world-action-row"><div className="world-unlock-note">{due && !done ? "You can leave now without recording retrieval and return later." : "This preview or retrieval state is preserved in the Atlas."}</div><button className="world-primary-action" onClick={onAtlas}>Return to the Atlas <span aria-hidden="true">→</span></button></div></section>;
};
