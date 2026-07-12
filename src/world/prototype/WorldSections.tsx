import { FormEvent, useMemo, useState } from "react";
import { domainJourneys, territories } from "../atlas/territories";
import { cases, primaryDomains } from "../cases/cases";
import { deriveAtlasState } from "../evidence/evidenceStore";
import { DomainId, EvidenceEvent, WorldSnapshot } from "../types/world";

interface EntryProps {
  goal: Exclude<DomainId, "climate">;
  onGoal: (goal: Exclude<DomainId, "climate">) => void;
  onContinue: () => void;
}

export const EntrySection = ({ goal, onGoal, onContinue }: EntryProps) => (
  <section className="world-entry world-section" aria-labelledby="entry-title">
    <div className="world-entry-copy">
      <span className="world-kicker">ONE OPERATION · THREE WORLDS</span>
      <h1 id="entry-title">A force. A meaning. A return.</h1>
      <p className="world-lede">Three systems produce one number. Learn to see the shared mathematical move—and carry it into the harder thing you care about.</p>
      <div className="world-promise"><span>Today’s capability</span><p>Calculate a dot product, explain what its sign means, and recognise it in a new setting.</p></div>
    </div>
    <div className="world-goal-panel">
      <span className="world-kicker">CHOOSE YOUR HORIZON</span>
      <h2>What are you building toward?</h2>
      <p>No school level. Your goal sets the route; the mathematics remains one connected world.</p>
      <div className="world-goal-list" role="radiogroup" aria-label="Learning goal">
        {primaryDomains.map((domain) => {
          const item = cases[domain];
          return <button key={domain} role="radio" aria-checked={goal === domain} className={goal === domain ? "is-active" : ""} onClick={() => onGoal(domain)}>
            <span>{item.eyebrow.split(" · ")[0]}</span><strong>{domain === "engineering" ? "Understand physical systems" : domain === "ai" ? "Understand intelligent systems" : "Reason about portfolios"}</strong><small>{domain === "engineering" ? "Forces → control systems" : domain === "ai" ? "Embeddings → optimisation" : "Returns → risk & optimisation"}</small>
          </button>;
        })}
      </div>
      <button className="world-primary-action" type="button" onClick={onContinue}>Enter through a real system <span aria-hidden="true">→</span></button>
      <p className="world-time-note">About 25 focused minutes · your work is saved locally</p>
    </div>
  </section>
);

interface ObservatoryProps { onPredict: (prediction: string) => void; onContinue: () => void; predicted: boolean }

export const ObservatorySection = ({ onPredict, onContinue, predicted }: ObservatoryProps) => {
  const [prediction, setPrediction] = useState<string | null>(predicted ? "restored" : null);
  const choose = (value: string) => { setPrediction(value); onPredict(value); };
  return <section className="world-section world-observatory" aria-labelledby="observatory-title">
    <div className="world-section-intro">
      <span className="world-kicker">OBSERVATORY · THE MYSTERIOUS SCALAR</span>
      <h1 id="observatory-title">Different worlds. The same compression.</h1>
      <p>Each system combines two lists into one consequential number. Before the mechanism is named, commit to what direction and sign might be doing.</p>
    </div>
    <div className="world-case-triptych">
      {primaryDomains.map((domain, index) => {
        const item = cases[domain];
        return <article key={domain} className={`world-case-card case-${domain}`}>
          <div className="world-case-orbit" aria-hidden="true"><i /><i /><span>{index === 0 ? "12 J" : index === 1 ? "0.96" : "+5.0%"}</span></div>
          <span className="world-kicker">{item.eyebrow}</span><h2>{item.title}</h2><p>{item.question}</p>
          <div className="world-case-formula">{prediction ? item.formula : "? → one number"}</div>
        </article>;
      })}
    </div>
    <div className="world-prediction-panel">
      <div><span className="world-kicker">PREDICT BEFORE THE REVEAL</span><h2>If the two lists point against each other, what should happen to the number?</h2></div>
      <div className="world-prediction-options">
        {["It becomes negative", "It becomes zero", "Direction should not matter"].map((value) => <button key={value} className={prediction === value ? "is-selected" : ""} onClick={() => choose(value)}>{value}</button>)}
      </div>
      {prediction && <div className="world-reveal" role="status"><strong>{prediction === "It becomes negative" ? "Yes—when opposing contributions dominate." : "Hold that thought."}</strong><p>Multiply matching components, then add: <b>a · b = a₁b₁ + a₂b₂</b>. The sign records net directional agreement. You’ll test the claim next.</p></div>}
    </div>
    <div className="world-action-row"><button className="world-primary-action" disabled={!prediction} onClick={onContinue}>Take the operation into the Studio <span aria-hidden="true">→</span></button></div>
  </section>;
};

interface PracticeProps {
  events: EvidenceEvent[];
  onRecord: (kind: "supported" | "independent" | "explained", detail: string, support: EvidenceEvent["support"]) => void;
  onDetour: (focusId: string, prompt: string) => void;
  onContinue: () => void;
}

export const PracticeSection = ({ events, onRecord, onDetour, onContinue }: PracticeProps) => {
  const [faded, setFaded] = useState("");
  const [independent, setIndependent] = useState("");
  const [explanation, setExplanation] = useState("");
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const supportedDone = events.some((event) => event.kind === "supported");
  const independentDone = events.some((event) => event.kind === "independent");
  const explainedDone = events.some((event) => event.kind === "explained");

  const check = (id: string, answer: string, expected: number, onCorrect: () => void) => {
    const correct = Math.abs(Number(answer) - expected) < 0.001;
    setFeedback((current) => ({ ...current, [id]: correct ? "Correct. The component contributions combine to the scalar." : "Not yet. Multiply matching positions, keep each sign, then add." }));
    if (correct) onCorrect();
  };

  return <section className="world-section world-practice" aria-labelledby="practice-title">
    <div className="world-section-intro"><span className="world-kicker">STUDIO · SUPPORT FADES</span><h1 id="practice-title">Make the procedure yours.</h1><p>The representation stays stable while the scaffolding disappears. Accuracy matters; so does what the number means.</p></div>
    <ol className="world-practice-stack">
      <li className="world-practice-card is-complete">
        <div className="world-practice-index">01</div><div><span className="world-kicker">WORKED EXAMPLE</span><h2>See every contribution</h2><p><b>[3, 2] · [4, −1]</b></p><div className="world-worked-line"><span>3 × 4</span><i>+</i><span>2 × (−1)</span><i>=</i><strong>10</strong></div><p className="world-feedback good">The first dimensions contribute +12; the second contributes −2. The dot product is their net, not a distance.</p></div>
      </li>
      <li className={supportedDone ? "world-practice-card is-complete" : "world-practice-card"} id="faded-challenge" tabIndex={-1}>
        <div className="world-practice-index">02</div><div><span className="world-kicker">FADING SUPPORT</span><h2>Complete the final sum</h2><p><b>[4, −2] · [3, 5] = 12 + (−10) =</b></p><div className="world-inline-answer"><label><span className="sr-only">Faded example answer</span><input inputMode="decimal" value={faded} onChange={(event) => setFaded(event.target.value)} /></label><button onClick={() => check("faded", faded, 2, () => onRecord("supported", "Completed faded component calculation", "cue"))}>Check</button></div>{feedback.faded && <p className={`world-feedback ${supportedDone ? "good" : ""}`} role="status">{feedback.faded}</p>}<button className="world-help-link" onClick={() => onDetour("faded-challenge", "Complete 12 + (−10) in the faded calculation")}>I want a two-minute signed-components refresher</button></div>
      </li>
      <li className={independentDone ? "world-practice-card is-complete" : "world-practice-card"} id="independent-challenge" tabIndex={-1}>
        <div className="world-practice-index">03</div><div><span className="world-kicker">INDEPENDENT CALCULATION</span><h2>No component scaffold</h2><p><b>[2, −3] · [−4, 1] = ?</b></p><div className="world-inline-answer"><label><span className="sr-only">Independent calculation answer</span><input inputMode="decimal" value={independent} onChange={(event) => setIndependent(event.target.value)} /></label><button onClick={() => check("independent", independent, -11, () => onRecord("independent", "Calculated [2,-3] dot [-4,1]", "none"))}>Check</button></div>{feedback.independent && <p className={`world-feedback ${independentDone ? "good" : ""}`} role="status">{feedback.independent}</p>}</div>
      </li>
      <li className={explainedDone ? "world-practice-card is-complete" : "world-practice-card"}>
        <div className="world-practice-index">04</div><div><span className="world-kicker">EXPLAIN THE SIGN</span><h2>What does −11 tell you?</h2><label className="world-textarea-label">Explain in your own words<textarea value={explanation} onChange={(event) => setExplanation(event.target.value)} placeholder="The dot product is negative because…" /></label><button className="world-secondary-action" disabled={explanation.trim().length < 24} onClick={() => onRecord("explained", explanation.trim(), "none")}>Save explanation</button>{explainedDone && <p className="world-feedback good">Recorded. A human facilitator should review meaning; length alone is not proof of understanding.</p>}</div>
      </li>
    </ol>
    <div className="world-action-row"><button className="world-primary-action" disabled={!(supportedDone && independentDone && explainedDone)} onClick={onContinue}>Use it in another world <span aria-hidden="true">→</span></button></div>
  </section>;
};

interface DetourProps { prompt: string; onFinish: () => void }

export const DetourSection = ({ prompt, onFinish }: DetourProps) => {
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const ready = Number(first) === -10 && Number(second) === 2;
  return <section className="world-section world-detour" aria-labelledby="detour-title">
    <div className="world-route-ribbon"><span>YOUR ORIGINAL MOVE</span><strong>{prompt}</strong><small>We will return here exactly.</small></div>
    <div className="world-detour-card"><span className="world-kicker">DIAGNOSTIC DETOUR · SIGNED COMPONENTS</span><h1 id="detour-title">Two products. One careful sum.</h1><p>You do not need a chapter on arithmetic. You need one reliable move: treat each matched pair as a contribution, preserve its sign, then add.</p>
      <div className="world-detour-visual"><div><span>−2 × 5</span><strong>−10</strong><small>opposing contribution</small></div><i>+</i><div><span>4 × 3</span><strong>+12</strong><small>supporting contribution</small></div><i>=</i><div className="is-result"><strong>+2</strong><small>net contribution</small></div></div>
      <div className="world-detour-check"><label>First contribution: −2 × 5 = <input value={first} onChange={(event) => setFirst(event.target.value)} inputMode="numeric" /></label><label>Net: −10 + 12 = <input value={second} onChange={(event) => setSecond(event.target.value)} inputMode="numeric" /></label></div>
      <button className="world-primary-action" disabled={!ready} onClick={onFinish}>Return to my exact calculation <span aria-hidden="true">↩</span></button>
    </div>
  </section>;
};

interface TransferProps { events: EvidenceEvent[]; onTransfer: (detail: string) => void; onContinue: () => void }

export const TransferSection = ({ events, onTransfer, onContinue }: TransferProps) => {
  const [answer, setAnswer] = useState("");
  const [meaning, setMeaning] = useState("");
  const [feedback, setFeedback] = useState("");
  const done = events.some((event) => event.kind === "transferred");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const numeric = Number(answer.replace("%", ""));
    const correct = Math.abs(numeric - 3.6) < 0.01 || Math.abs(numeric - 0.036) < 0.0001;
    if (!correct || meaning.trim().length < 20) { setFeedback("Check the weighting: 0.8(5%) + 0.2(−2%). Then say what that scalar represents."); return; }
    setFeedback("Yes. +3.6% is the realised weighted return in this simplified one-period model.");
    onTransfer(`Finance transfer: ${answer}; ${meaning.trim()}`);
  };
  return <section className="world-section world-transfer" aria-labelledby="transfer-title">
    <div className="world-section-intro"><span className="world-kicker">CROSS-DOMAIN TRANSFER · FINANCE</span><h1 id="transfer-title">The nouns changed. Did the structure?</h1><p>No force. No displacement. Decide whether the operation still belongs.</p></div>
    <div className="world-transfer-grid"><article className="world-transfer-case"><span className="world-kicker">ONE-PERIOD PORTFOLIO</span><h2>Two assets, one realised return</h2><div className="world-asset-row"><span>Asset A</span><strong>80% weight</strong><em>+5% return</em></div><div className="world-asset-row"><span>Asset B</span><strong>20% weight</strong><em>−2% return</em></div><p className="world-assumption"><b>Model boundary:</b> fixed weights for one realised period; no fees, tax, slippage, or forecast. This is not investment advice.</p></article>
      <form className="world-transfer-work" onSubmit={submit}><span className="world-kicker">YOUR MODEL</span><h2>Compress the contributions</h2><p className="world-large-equation">[0.8, 0.2] · [0.05, −0.02]</p><label>Portfolio return<input aria-label="Portfolio return" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="decimal or %" /></label><label>What does the result mean here?<textarea value={meaning} onChange={(event) => setMeaning(event.target.value)} placeholder="It represents…" /></label><button className="world-primary-action" type="submit">Check transfer</button>{feedback && <p className={`world-feedback ${done ? "good" : ""}`} role="status">{feedback}</p>}</form></div>
    <div className="world-action-row"><button className="world-primary-action" disabled={!done} onClick={onContinue}>See where this sits in the Atlas <span aria-hidden="true">→</span></button></div>
  </section>;
};

interface AtlasProps { snapshot: WorldSnapshot; onRetrieval: () => void; onResume: () => void }

export const AtlasSection = ({ snapshot, onRetrieval, onResume }: AtlasProps) => {
  const evidenceState = deriveAtlasState(snapshot.evidence, snapshot.retrievalDueAt);
  const activeJourney = domainJourneys[snapshot.activeGoal];
  const connections = useMemo(() => territories.flatMap((territory) => territory.downstreamIds.map((target) => ({ from: territory, to: territories.find((item) => item.id === target) })).filter((item) => item.to)), []);
  return <section className="world-section world-atlas" aria-labelledby="atlas-title">
    <div className="world-section-intro"><span className="world-kicker">ATLAS · YOUR MATHEMATICAL HORIZON</span><h1 id="atlas-title">One territory, several futures.</h1><p>You entered through {cases[snapshot.activeGoal].eyebrow.split(" · ")[0].toLowerCase()}. The highlighted route keeps that goal visible while showing where the same mathematics meets other routes.</p></div>
    <div className="world-atlas-layout"><div className="world-map" role="img" aria-label={`Map of eight connected mathematical territories. Dot product evidence state: ${evidenceState}.`}>
      <svg viewBox="0 0 100 100" aria-hidden="true" preserveAspectRatio="none">{connections.map(({ from, to }) => to && <line key={`${from.id}-${to.id}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={activeJourney.includes(from.id) && activeJourney.includes(to.id) ? "is-route" : ""} />)}</svg>
      {territories.map((territory) => <span aria-hidden="true" key={territory.id} style={{ left: `${territory.x}%`, top: `${territory.y}%` }} className={`world-node ${territory.id === "dot-product" ? "is-current" : ""} ${territory.status === "horizon" ? "is-horizon" : ""} ${activeJourney.includes(territory.id) ? "is-route" : ""}`} title={territory.title}><span>{territory.notation ?? territory.shortTitle}</span>{territory.id === "dot-product" && <small>{evidenceState.replace(/-/g, " ")}</small>}</span>)}
    </div><aside className="world-atlas-aside"><span className="world-kicker">EVIDENCE, NOT COMPLETION</span><h2>Your dot-product record</h2><ul className="world-evidence-list">{[
      ["predicted", "Committed to a prediction"], ["constructed", "Manipulated the vector model"], ["independent", "Calculated without scaffold"], ["explained", "Explained the sign"], ["transferred", "Used it in finance"],
    ].map(([kind, label]) => <li key={kind} className={snapshot.evidence.some((event) => event.kind === kind) ? "is-recorded" : ""}><i aria-hidden="true" />{label}</li>)}</ul><div className="world-next-move"><span>NEXT MOVE</span><strong>Projection</strong><p>Turn direction agreement into “how much lies along this direction?”</p></div></aside></div>
    <div className="world-return-card"><div><span className="world-kicker">MEMORY IS A RETURN LOOP</span><h2>{snapshot.retrievalDueAt ? `Retrieval scheduled for ${new Date(snapshot.retrievalDueAt).toLocaleDateString()}` : "Complete transfer to schedule retrieval"}</h2><p>The future prompt uses an unfamiliar climate-monitoring context. It records independent retrieval, a cue, or restudy—not a streak.</p></div><button className="world-secondary-action" onClick={onRetrieval}>Preview the future retrieval prompt</button></div>
    <div className="world-action-row"><button className="world-primary-action" onClick={onResume}>Return to the Studio <span aria-hidden="true">↩</span></button></div>
  </section>;
};

interface RetrievalProps { events: EvidenceEvent[]; dueAt: string | null; onRecord: (detail: string, support: EvidenceEvent["support"]) => void; onAtlas: () => void }

export const RetrievalSection = ({ events, dueAt, onRecord, onAtlas }: RetrievalProps) => {
  const done = events.some((event) => event.kind === "retrieved");
  const [answer, setAnswer] = useState("");
  const [cue, setCue] = useState(false);
  const [feedback, setFeedback] = useState(done ? "Retrieved: this climate-index return is already recorded in the local evidence store." : "");
  const check = () => {
    if (Math.abs(Number(answer) - 2.1) > 0.001) { setFeedback("Not yet. Combine each sensor deviation in proportion to its importance."); return; }
    setFeedback("Retrieved: 0.5(4) + 0.3(−1) + 0.2(2) = 2.1 index points.");
    onRecord("Climate index retrieval", cue ? "cue" : "none");
  };
  return <section className="world-section world-retrieval" aria-labelledby="retrieval-title"><div className="world-section-intro"><span className="world-kicker">RETURN LOOP · CLIMATE MONITORING</span><h1 id="retrieval-title">Can the structure return without its original story?</h1><p>{dueAt ? `Scheduled return: ${new Date(dueAt).toLocaleDateString()}. ` : "Preview mode. "}Three sensors report deviations from baseline. Their reliability weights sum to one.</p></div>
    <div className="world-retrieval-card"><div className="world-sensor-table" role="table" aria-label="Sensor weights and deviations"><div role="row"><span role="columnheader">Sensor</span><span role="columnheader">Weight</span><span role="columnheader">Deviation</span></div>{[["Air", "0.5", "+4"], ["Water", "0.3", "−1"], ["Soil", "0.2", "+2"]].map((row) => <div role="row" key={row[0]}>{row.map((cell) => <span role="cell" key={cell}>{cell}</span>)}</div>)}</div><div className="world-retrieval-work"><h2>Find the weighted exposure index.</h2>{cue && <p className="world-feedback">Cue: this is two equal-length lists compressed into one scalar.</p>}<label>Exposure index<input value={answer} inputMode="decimal" onChange={(event) => setAnswer(event.target.value)} /></label><div className="world-button-pair"><button className="world-secondary-action" onClick={() => setCue(true)}>Give me one cue</button><button className="world-primary-action" onClick={check}>Check retrieval</button></div>{feedback && <p className={`world-feedback ${done ? "good" : ""}`} role="status">{feedback}</p>}</div></div>
    <div className="world-action-row"><button className="world-primary-action" disabled={!done} onClick={onAtlas}>Update the Atlas record <span aria-hidden="true">→</span></button></div>
  </section>;
};
