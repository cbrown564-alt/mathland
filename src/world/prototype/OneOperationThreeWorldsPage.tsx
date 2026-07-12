import { useEffect, useRef, useState } from "react";
import { cases } from "../cases/cases";
import { deriveAtlasState } from "../evidence/evidenceStore";
import { VectorLab } from "../studio/VectorLab";
import { JourneyStep } from "../types/world";
import { useWorldJourney } from "./useWorldJourney";
import { AtlasSection, DetourSection, EntrySection, ObservatorySection, PracticeSection, RetrievalSection, TransferSection } from "./WorldSections";
import { stepNames } from "./journeySteps";
import "./world.css";

const orderedSteps: JourneyStep[] = ["entry", "observatory", "studio", "practice", "transfer", "atlas", "retrieval"];

const OneOperationThreeWorldsPage = () => {
  const journey = useWorldJourney();
  const { snapshot } = journey;
  const [atlasReturn, setAtlasReturn] = useState<JourneyStep>(snapshot.step === "atlas" ? "studio" : snapshot.step);
  const mainRef = useRef<HTMLElement>(null);
  const detourFocusRef = useRef<string | null>(null);
  const evidenceState = deriveAtlasState(snapshot.evidence, snapshot.retrievalDueAt);
  const predicted = snapshot.evidence.some((event) => event.kind === "predicted");
  const constructed = snapshot.evidence.some((event) => event.kind === "constructed");

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "One operation, three worlds · Mathland";
    return () => { document.title = previousTitle; };
  }, []);

  useEffect(() => {
    if (snapshot.detour || !detourFocusRef.current) return;
    const focusId = detourFocusRef.current;
    detourFocusRef.current = null;
    document.getElementById(focusId)?.focus({ preventScroll: false });
  }, [snapshot.detour, snapshot.step]);

  const goTo = (step: JourneyStep) => {
    journey.goTo(step);
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    window.setTimeout(() => mainRef.current?.focus(), 0);
  };

  const openAtlas = () => {
    if (snapshot.step !== "atlas") setAtlasReturn(snapshot.step);
    goTo("atlas");
  };

  const finishDetour = () => {
    const target = journey.finishDetour();
    if (!target) return;
    detourFocusRef.current = target.focusId;
  };

  const studio = <section className="world-section world-studio" aria-labelledby="studio-title">
    <div className="world-section-intro"><span className="world-kicker">STUDIO · USEFUL FORCE</span><h1 id="studio-title">Build the sign with your hands.</h1><p>A 4 m displacement points east. Move the force through helping, sideways, and resisting positions. Watch the geometric and component views stay in agreement.</p></div>
    <VectorLab onConstructed={(detail) => journey.record("constructed", detail, "none")} />
    <div className="world-action-row"><div className="world-mini-brief"><span>FIELD NOTE</span><p>Work can be negative: the force removes energy from motion. Zero work here does not mean zero force—it means no force component along displacement.</p></div><button className="world-primary-action" disabled={!constructed} onClick={() => goTo("practice")}>Formalise and fade support <span aria-hidden="true">→</span></button></div>
  </section>;

  return <div className="world-root">
    <a className="world-skip-link" href="#world-main">Skip to current mathematical task</a>
    <header className="world-header">
      <a className="world-wordmark" href="/prototype/one-operation-three-worlds" aria-label="Mathland prototype home"><i aria-hidden="true">∴</i><span>MATHLAND<small>OPEN MATHEMATICAL WORLD</small></span></a>
      <div className="world-goal-chip"><span>ACTIVE HORIZON</span><strong>{cases[snapshot.activeGoal].eyebrow.split(" · ")[0]}</strong></div>
      <nav aria-label="Prototype navigation"><button type="button" onClick={openAtlas} aria-current={snapshot.step === "atlas" ? "page" : undefined}>Open Atlas</button><button type="button" className="world-evidence-chip" onClick={openAtlas}><i />{evidenceState.replace(/-/g, " ")}</button></nav>
    </header>
    <nav className="world-progress-shell" aria-label="Learning journey progress" tabIndex={0}>
      <ol>{orderedSteps.slice(0, 6).map((step, index) => {
        const currentIndex = orderedSteps.indexOf(snapshot.step);
        const reached = index <= currentIndex || (step === "atlas" && snapshot.evidence.some((event) => event.kind === "transferred"));
        return <li key={step} className={step === snapshot.step ? "is-current" : reached ? "is-reached" : ""}><span>{String(index + 1).padStart(2, "0")}</span><b>{stepNames[step]}</b></li>;
      })}</ol>
    </nav>
    <main id="world-main" ref={mainRef} tabIndex={-1}>
      {snapshot.detour ? <DetourSection prompt={snapshot.detour.origin.prompt} onFinish={finishDetour} /> : <>
        {snapshot.step === "entry" && <EntrySection goal={snapshot.activeGoal} onGoal={journey.setGoal} onContinue={() => goTo("observatory")} />}
        {snapshot.step === "observatory" && <ObservatorySection predicted={predicted} onPredict={(detail) => journey.record("predicted", detail, "none")} onContinue={() => goTo("studio")} />}
        {snapshot.step === "studio" && studio}
        {snapshot.step === "practice" && <PracticeSection events={snapshot.evidence} onRecord={journey.record} onDetour={(focusId, prompt) => journey.startDetour({ step: "practice", focusId, prompt })} onContinue={() => goTo("transfer")} />}
        {snapshot.step === "transfer" && <TransferSection events={snapshot.evidence} onTransfer={(detail) => journey.record("transferred", detail, "none")} onContinue={() => goTo("atlas")} />}
        {snapshot.step === "atlas" && <AtlasSection snapshot={snapshot} onRetrieval={() => goTo("retrieval")} onResume={() => goTo(atlasReturn === "atlas" ? "studio" : atlasReturn)} />}
        {snapshot.step === "retrieval" && <RetrievalSection events={snapshot.evidence} dueAt={snapshot.retrievalDueAt} onRecord={(detail, support) => journey.record("retrieved", detail, support)} onAtlas={() => goTo("atlas")} />}
      </>}
    </main>
    <footer className="world-footer"><p><b>Prototype boundary.</b> Evidence stays in this browser and describes actions—not mastery.</p><button type="button" onClick={() => { if (window.confirm("Clear this prototype journey and local evidence?")) journey.reset(); }}>Reset local journey</button></footer>
  </div>;
};

export default OneOperationThreeWorldsPage;
