import { useCallback, useEffect, useMemo, useState } from "react";
import { appendEvidence, createSnapshot, loadSnapshot, makeEvidence, removeSnapshot, saveSnapshot, scheduleRetrieval } from "../evidence/evidenceStore";
import { beginDetour, resolveDetour } from "../detours/routeState";
import { recordProductEvent } from "../operations/analytics";
import { DetourId, DomainId, EvidenceEvent, EvidenceKind, JourneyStep, ReturnTarget, WorldSnapshot } from "../types/world";

export interface WorldJourney {
  snapshot: WorldSnapshot;
  setGoal: (goal: Exclude<DomainId, "climate">) => void;
  chooseHorizon: (goal: Exclude<DomainId, "climate">) => void;
  setTourStatus: (status: WorldSnapshot["tourStatus"]) => void;
  goTo: (step: JourneyStep) => void;
  record: (kind: EvidenceKind, detail?: string, support?: EvidenceEvent["support"]) => void;
  startDetour: (id: DetourId, target: ReturnTarget) => void;
  finishDetour: () => ReturnTarget | null;
  restore: (snapshot: WorldSnapshot) => void;
  reset: () => void;
}

export const useWorldJourney = (): WorldJourney => {
  const [snapshot, setSnapshot] = useState<WorldSnapshot>(() =>
    typeof window === "undefined" ? createSnapshot() : loadSnapshot(window.localStorage),
  );

  useEffect(() => {
    saveSnapshot(window.localStorage, snapshot);
  }, [snapshot]);

  const mutate = useCallback((updater: (current: WorldSnapshot) => WorldSnapshot) => {
    setSnapshot((current) => ({ ...updater(current), updatedAt: new Date().toISOString() }));
  }, []);

  const record = useCallback((kind: EvidenceKind, detail?: string, support?: EvidenceEvent["support"]) => {
    const event = makeEvidence(kind, detail, support);
    recordProductEvent("evidence_recorded", {
      kind,
      territory: event.territoryId,
      support: support ?? null,
    });
    mutate((current) => {
      const evidence = appendEvidence(current.evidence, event);
      const retrievalDueAt = kind === "transferred" && !current.retrievalDueAt
        ? scheduleRetrieval()
        : current.retrievalDueAt;
      return { ...current, evidence, retrievalDueAt };
    });
  }, [mutate]);

  return useMemo(() => ({
    snapshot,
    setGoal: (activeGoal) => mutate((current) => ({ ...current, activeGoal })),
    chooseHorizon: (activeGoal) => mutate((current) => {
      recordProductEvent("horizon_chosen", { from: current.activeGoal, goal: activeGoal });
      return {
        ...current,
        activeGoal,
        horizonChosenAt: current.horizonChosenAt ?? new Date().toISOString(),
      };
    }),
    setTourStatus: (tourStatus) => mutate((current) => ({ ...current, tourStatus })),
    goTo: (step) => mutate((current) => {
      recordProductEvent("journey_step_changed", { from: current.step, to: step });
      return { ...current, step };
    }),
    record,
    startDetour: (id, target) => mutate((current) => {
      recordProductEvent("detour_started", { detour: id });
      return {
        ...current,
        detour: beginDetour(id, target),
        evidence: appendEvidence(current.evidence, makeEvidence("detour_started", `${id}: ${target.prompt}`)),
      };
    }),
    finishDetour: () => {
      if (!snapshot.detour) return null;
      const target = resolveDetour(snapshot.detour);
      recordProductEvent("detour_resolved", { detour: snapshot.detour.id, to: target.step });
      mutate((current) => ({
        ...current,
        step: target.step,
        detour: null,
        evidence: appendEvidence(current.evidence, makeEvidence("detour_resolved", target.prompt, "none")),
      }));
      return target;
    },
    restore: (restored) => {
      recordProductEvent("journey_restored", { to: restored.step, goal: restored.activeGoal });
      setSnapshot({ ...restored, updatedAt: new Date().toISOString() });
    },
    reset: () => {
      removeSnapshot(window.localStorage);
      setSnapshot(createSnapshot());
    },
  }), [mutate, record, snapshot]);
};
