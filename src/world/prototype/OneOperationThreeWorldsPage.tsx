import { useEffect, useRef, useState } from "react";
import { cases, horizonNames, primaryDomains, studioCaseAdapters } from "../cases/cases";
import { deriveAtlasState } from "../evidence/evidenceStore";
import { VectorLab } from "../studio/VectorLab";
import { JourneyStep } from "../types/world";
import { useWorldJourney } from "./useWorldJourney";
import { AtlasSection, EntrySection, ObservatorySection, PracticeSection, RetrievalSection, TourSection, TransferSection, VeraIntervention } from "./WorldSections";
import { DiagnosticDetour } from "./DiagnosticDetour";
import { NormalisationSection, ProjectionStudio } from "./AdjacentStudios";
import { stepNames } from "./journeySteps";
import "./world.css";

const progressSteps: JourneyStep[] = ["observatory", "studio", "practice", "normalisation", "transfer", "atlas", "retrieval"];

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
  const relationEvents = snapshot.evidence.filter((event) => event.kind === "constructed").map((event) => event.detail ?? "");
  const relationChecklist = ["same-direction", "perpendicular", "opposed"].map((relation) => ({ relation, seen: relationEvents.some((detail) => detail.includes(relation)) }));
  const constructed = relationChecklist.every((item) => item.seen);
  const adapter = studioCaseAdapters[snapshot.activeGoal];

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
    <div className="world-compact-intro world-studio-intro"><p className="world-local-label">Studio · {snapshot.activeGoal} horizon</p><h1 id="studio-title">{adapter.title}</h1><p>{adapter.task} Your chosen horizon changes the vectors, labels, units, and interpretation—not only the route label.</p></div>
    <VectorLab key={snapshot.activeGoal} adapter={adapter} onConstructed={(detail) => journey.record("constructed", detail, "none")} />
    <VeraIntervention />
    <div className="world-action-row world-studio-handoff"><div className="world-mini-brief"><strong>{snapshot.activeGoal} boundary</strong><p>{adapter.boundary}</p></div><div className="world-relation-progress" aria-label="Required sign regions">{relationChecklist.map((item) => <span key={item.relation} className={item.seen ? "is-seen" : ""}>{item.seen ? "✓" : "○"} {item.relation.replace("same-direction", "positive").replace("perpendicular", "zero").replace("opposed", "negative")}</span>)}</div><div><p className="world-unlock-note">{constructed ? "Positive, zero, and negative regions tested." : "To continue: use the presets or controls to test positive, zero, and negative dot products."}</p><button className="world-primary-action" disabled={!constructed} onClick={() => goTo("practice")}>Formalise and calculate <span aria-hidden="true">→</span></button></div></div>
  </section>;

  const currentProgress = progressSteps.indexOf(snapshot.step);

  const currentSection = <>
    {snapshot.step === "entry" && <EntrySection goal={snapshot.activeGoal} onGoal={journey.setGoal} onContinue={() => { journey.chooseHorizon(snapshot.activeGoal); goTo("observatory"); }} onTour={() => { journey.chooseHorizon(snapshot.activeGoal); setTourReturn("observatory"); openTour(); }} />}
    {snapshot.step === "tour" && <TourSection onComplete={completeTour} onSkip={skipTour} />}
    {snapshot.step === "observatory" && <ObservatorySection predicted={predicted} onPredict={(detail) => journey.record("predicted", detail, "none")} onContinue={() => goTo("studio")} />}
    {snapshot.step === "studio" && studio}
    {snapshot.step === "practice" && <PracticeSection events={snapshot.evidence} onRecord={journey.record} onDetour={(id, focusId, prompt) => journey.startDetour(id, { step: "practice", focusId, prompt })} onContinue={() => goTo("normalisation")} />}
    {snapshot.step === "normalisation" && <NormalisationSection events={snapshot.evidence} onRecord={(detail) => journey.record("normalised", detail, "none")} onDetour={(id, focusId, prompt) => journey.startDetour(id, { step: "normalisation", focusId, prompt })} onContinue={() => goTo("transfer")} />}
    {snapshot.step === "transfer" && <TransferSection events={snapshot.evidence} onTransfer={(detail) => journey.record("transferred", detail, "none")} onDefer={() => { journey.record("transfer_deferred", "Finance transfer deferred after orientation", "deferred"); goTo("atlas"); }} onDetour={(id, focusId, prompt) => journey.startDetour(id, { step: "transfer", focusId, prompt })} onContinue={() => goTo("atlas")} />}
    {snapshot.step === "atlas" && <AtlasSection snapshot={snapshot} onRetrieval={() => goTo("retrieval")} onResume={() => goTo(atlasReturn === "atlas" || atlasReturn === "entry" ? "studio" : atlasReturn)} onEditHorizon={() => horizonDialogRef.current?.showModal()} onOpenTerritory={goTo} />}
    {snapshot.step === "projection" && <ProjectionStudio events={snapshot.evidence} onRecord={(detail) => journey.record("projected", detail, "none")} onDetour={(id, focusId, prompt) => journey.startDetour(id, { step: "projection", focusId, prompt })} onAtlas={() => goTo("atlas")} />}
    {snapshot.step === "retrieval" && <RetrievalSection events={snapshot.evidence} dueAt={snapshot.retrievalDueAt} onRecord={(detail, support) => journey.record("retrieved", detail, support)} onSubstitute={() => journey.record("retrieval_substituted", "Climate context substituted with quality control", "substituted")} onAtlas={() => goTo("atlas")} />}
  </>;

  return <div className="world-root">
    <a className="world-skip-link" href="#world-main">Skip to current mathematical task</a>
    <header className="world-header">
      <a className="world-wordmark" href="/prototype/one-operation-three-worlds" aria-label="Mathland prototype home"><i aria-hidden="true">∴</i><span>MATHLAND<small>OPEN MATHEMATICAL WORLD</small></span></a>
      <button className="world-goal-chip" type="button" onClick={() => horizonDialogRef.current?.showModal()}><span>Horizon</span><strong>{horizonNames[snapshot.activeGoal]}</strong><small>Change</small></button>
      <nav aria-label="Prototype navigation"><button type="button" onClick={openAtlas} aria-current={snapshot.step === "atlas" ? "page" : undefined}>Atlas</button><button type="button" onClick={openTour}>Help & tour</button><button type="button" className="world-evidence-chip" onClick={openAtlas}><i />{evidenceState.replace(/-/g, " ")}</button></nav>
    </header>
    {progressSteps.includes(snapshot.step) && <nav className="world-progress-shell" aria-label="Learning journey progress"><strong>{stepNames[snapshot.step]}</strong><ol>{progressSteps.slice(0, 6).map((step, index) => <li key={step} className={step === snapshot.step ? "is-current" : index < currentProgress ? "is-reached" : ""}><span aria-hidden="true" /><b>{stepNames[step]}</b></li>)}</ol></nav>}
    <main id="world-main" ref={mainRef} tabIndex={-1}>
      <div hidden={Boolean(snapshot.detour)}>{currentSection}</div>
      {snapshot.detour && <DiagnosticDetour id={snapshot.detour.id} prompt={snapshot.detour.origin.prompt} onFinish={finishDetour} />}
    </main>
    <footer className="world-footer"><p><b>Research prototype.</b> Evidence stays in this browser and describes actions and support—not mastery.</p><button type="button" onClick={() => { if (window.confirm("Clear this prototype journey and local evidence?")) journey.reset(); }}>Reset local journey</button></footer>
    <dialog ref={horizonDialogRef} className="world-horizon-dialog" aria-labelledby="horizon-dialog-title"><form method="dialog"><div><p className="world-local-label">Deliberate route change</p><h2 id="horizon-dialog-title">Change your active horizon</h2><p>Your current Studio work, evidence, detour, and return point will be preserved.</p></div><div className="world-dialog-options">{primaryDomains.map((domain) => <button type="submit" key={domain} className={snapshot.activeGoal === domain ? "is-active" : ""} onClick={() => journey.chooseHorizon(domain)}><strong>{horizonNames[domain]}</strong><span>{cases[domain].formula}</span></button>)}</div><button className="world-quiet-action" type="submit">Keep current horizon</button></form></dialog>
  </div>;
};

export default OneOperationThreeWorldsPage;
