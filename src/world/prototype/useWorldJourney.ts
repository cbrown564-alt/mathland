import { useCallback, useEffect, useMemo, useState } from "react";
import { appendEvidence, createSnapshot, loadSnapshot, makeEvidence, saveSnapshot, scheduleRetrieval } from "../evidence/evidenceStore";
import { beginDetour, resolveDetour } from "../detours/routeState";
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
    mutate((current) => {
      const evidence = appendEvidence(current.evidence, makeEvidence(kind, detail, support));
      const retrievalDueAt = kind === "transferred" && !current.retrievalDueAt
        ? scheduleRetrieval()
        : current.retrievalDueAt;
      return { ...current, evidence, retrievalDueAt };
    });
  }, [mutate]);

  return useMemo(() => ({
    snapshot,
    setGoal: (activeGoal) => mutate((current) => ({ ...current, activeGoal })),
    chooseHorizon: (activeGoal) => mutate((current) => ({
      ...current,
      activeGoal,
      horizonChosenAt: current.horizonChosenAt ?? new Date().toISOString(),
    })),
    setTourStatus: (tourStatus) => mutate((current) => ({ ...current, tourStatus })),
    goTo: (step) => mutate((current) => ({ ...current, step })),
    record,
    startDetour: (id, target) => mutate((current) => ({
      ...current,
      detour: beginDetour(id, target),
      evidence: appendEvidence(current.evidence, makeEvidence("detour_started", `${id}: ${target.prompt}`)),
    })),
    finishDetour: () => {
      if (!snapshot.detour) return null;
      const target = resolveDetour(snapshot.detour);
      mutate((current) => ({
        ...current,
        step: target.step,
        detour: null,
        evidence: appendEvidence(current.evidence, makeEvidence("detour_resolved", target.prompt, "none")),
      }));
      return target;
    },
    reset: () => setSnapshot(createSnapshot()),
  }), [mutate, record, snapshot]);
};
