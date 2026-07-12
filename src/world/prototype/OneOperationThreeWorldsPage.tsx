import { useEffect, useRef, useState } from "react";
import { cases, horizonNames, primaryDomains } from "../cases/cases";
import { deriveAtlasState } from "../evidence/evidenceStore";
import { VectorLab } from "../studio/VectorLab";
import { JourneyStep } from "../types/world";
import { useWorldJourney } from "./useWorldJourney";
import { AtlasSection, DetourSection, EntrySection, ObservatorySection, PracticeSection, RetrievalSection, TourSection, TransferSection, VeraIntervention } from "./WorldSections";
import { stepNames } from "./journeySteps";
import "./world.css";

const progressSteps: JourneyStep[] = ["observatory", "studio", "practice", "transfer", "atlas", "retrieval"];

const OneOperationThreeWorldsPage = () => {
  const journey = useWorldJourney();
  const { snapshot } = journey;
  const [atlasReturn, setAtlasReturn] = useState<JourneyStep>(snapshot.step === "atlas" ? "studio" : snapshot.step);
  const [tourReturn, setTourReturn] = useState<JourneyStep>("observatory");
  const mainRef = useRef<HTMLElement>(null);
  const detourFocusRef = useRef<string | null>(null);
  const horizonDialogRef = useRef<HTMLDialogElement>(null);
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
    if (snapshot.step !== "atlas") setAtlasReturn(snapshot.step === "tour" ? tourReturn : snapshot.step);
    goTo("atlas");
  };

  const openTour = () => {
    if (snapshot.step !== "tour") setTourReturn(snapshot.step === "entry" ? "observatory" : snapshot.step);
    journey.setTourStatus("in-progress");
    goTo("tour");
  };

  const completeTour = () => {
    journey.setTourStatus("completed");
    journey.record("tour_completed", "Completed the six-move first-run workshop tour", "none");
    goTo(tourReturn);
  };

  const skipTour = () => {
    journey.setTourStatus("skipped");
    journey.record("tour_skipped", "Skipped or exited the optional workshop tour", "deferred");
    goTo(tourReturn);
  };

  const finishDetour = () => {
    const target = journey.finishDetour();
    if (!target) return;
    detourFocusRef.current = target.focusId;
  };

  const studio = <section className="world-section world-studio" aria-labelledby="studio-title">
    <div className="world-compact-intro"><p className="world-local-label">Studio · useful force</p><h1 id="studio-title">Compare how much force lies along the motion.</h1><p>A 4 m displacement points east. Test extremes, exact components, and one claim of your own while the geometric, component, symbolic, and engineering views stay linked.</p></div>
    <VectorLab onConstructed={(detail) => journey.record("constructed", detail, "none")} />
    <VeraIntervention />
    <div className="world-action-row"><div className="world-mini-brief"><strong>Engineering boundary</strong><p>Constant force and straight-line displacement. Negative work removes energy from the motion; zero work means no force component along the displacement, not zero force.</p></div><button className="world-primary-action" disabled={!constructed} onClick={() => goTo("practice")}>Formalise and calculate <span aria-hidden="true">→</span></button></div>
  </section>;

  const currentProgress = progressSteps.indexOf(snapshot.step);

  return <div className="world-root">
    <a className="world-skip-link" href="#world-main">Skip to current mathematical task</a>
    <header className="world-header">
      <a className="world-wordmark" href="/prototype/one-operation-three-worlds" aria-label="Mathland prototype home"><i aria-hidden="true">∴</i><span>MATHLAND<small>OPEN MATHEMATICAL WORLD</small></span></a>
      <button className="world-goal-chip" type="button" onClick={() => horizonDialogRef.current?.showModal()}><span>Horizon</span><strong>{horizonNames[snapshot.activeGoal]}</strong><small>Change</small></button>
      <nav aria-label="Prototype navigation"><button type="button" onClick={openAtlas} aria-current={snapshot.step === "atlas" ? "page" : undefined}>Atlas</button><button type="button" onClick={openTour}>Help & tour</button><button type="button" className="world-evidence-chip" onClick={openAtlas}><i />{evidenceState.replace(/-/g, " ")}</button></nav>
    </header>
    {progressSteps.includes(snapshot.step) && <nav className="world-progress-shell" aria-label="Learning journey progress" tabIndex={0}><strong>{stepNames[snapshot.step]}</strong><ol>{progressSteps.slice(0, 5).map((step, index) => <li key={step} className={step === snapshot.step ? "is-current" : index < currentProgress ? "is-reached" : ""}><span aria-hidden="true" /><b>{stepNames[step]}</b></li>)}</ol></nav>}
    <main id="world-main" ref={mainRef} tabIndex={-1}>
      {snapshot.detour ? <DetourSection prompt={snapshot.detour.origin.prompt} onFinish={finishDetour} /> : <>
        {snapshot.step === "entry" && <EntrySection goal={snapshot.activeGoal} onGoal={journey.setGoal} onContinue={() => { journey.chooseHorizon(snapshot.activeGoal); setTourReturn("observatory"); openTour(); }} />}
        {snapshot.step === "tour" && <TourSection onComplete={completeTour} onSkip={skipTour} />}
        {snapshot.step === "observatory" && <ObservatorySection predicted={predicted} onPredict={(detail) => journey.record("predicted", detail, "none")} onContinue={() => goTo("studio")} />}
        {snapshot.step === "studio" && studio}
        {snapshot.step === "practice" && <PracticeSection events={snapshot.evidence} onRecord={journey.record} onDetour={(focusId, prompt) => journey.startDetour({ step: "practice", focusId, prompt })} onContinue={() => goTo("transfer")} />}
        {snapshot.step === "transfer" && <TransferSection events={snapshot.evidence} onTransfer={(detail) => journey.record("transferred", detail, "none")} onDefer={() => { journey.record("transfer_deferred", "Finance transfer deferred after orientation", "deferred"); goTo("atlas"); }} onContinue={() => goTo("atlas")} />}
        {snapshot.step === "atlas" && <AtlasSection snapshot={snapshot} onRetrieval={() => goTo("retrieval")} onResume={() => goTo(atlasReturn === "atlas" || atlasReturn === "entry" ? "studio" : atlasReturn)} onEditHorizon={() => horizonDialogRef.current?.showModal()} />}
        {snapshot.step === "retrieval" && <RetrievalSection events={snapshot.evidence} dueAt={snapshot.retrievalDueAt} onRecord={(detail, support) => journey.record("retrieved", detail, support)} onSubstitute={() => journey.record("retrieval_substituted", "Climate context substituted with quality control", "substituted")} onAtlas={() => goTo("atlas")} />}
      </>}
    </main>
    <footer className="world-footer"><p><b>Research prototype.</b> Evidence stays in this browser and describes actions and support—not mastery.</p><button type="button" onClick={() => { if (window.confirm("Clear this prototype journey and local evidence?")) journey.reset(); }}>Reset local journey</button></footer>
    <dialog ref={horizonDialogRef} className="world-horizon-dialog" aria-labelledby="horizon-dialog-title"><form method="dialog"><div><p className="world-local-label">Deliberate route change</p><h2 id="horizon-dialog-title">Change your active horizon</h2><p>Your current Studio work, evidence, detour, and return point will be preserved.</p></div><div className="world-dialog-options">{primaryDomains.map((domain) => <button type="submit" key={domain} className={snapshot.activeGoal === domain ? "is-active" : ""} onClick={() => journey.chooseHorizon(domain)}><strong>{horizonNames[domain]}</strong><span>{cases[domain].formula}</span></button>)}</div><button className="world-quiet-action" type="submit">Keep current horizon</button></form></dialog>
  </div>;
};

export default OneOperationThreeWorldsPage;
