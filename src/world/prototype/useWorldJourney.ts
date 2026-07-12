import { useCallback, useEffect, useMemo, useState } from "react";
import { appendEvidence, createSnapshot, loadSnapshot, makeEvidence, saveSnapshot, scheduleRetrieval } from "../evidence/evidenceStore";
import { beginSignedComponentsDetour, resolveDetour } from "../detours/routeState";
import { DomainId, EvidenceEvent, EvidenceKind, JourneyStep, ReturnTarget, WorldSnapshot } from "../types/world";

export interface WorldJourney {
  snapshot: WorldSnapshot;
  setGoal: (goal: Exclude<DomainId, "climate">) => void;
  goTo: (step: JourneyStep) => void;
  record: (kind: EvidenceKind, detail?: string, support?: EvidenceEvent["support"]) => void;
  startDetour: (target: ReturnTarget) => void;
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
    goTo: (step) => mutate((current) => ({ ...current, step })),
    record,
    startDetour: (target) => mutate((current) => ({
      ...current,
      detour: beginSignedComponentsDetour(target),
      evidence: appendEvidence(current.evidence, makeEvidence("detour_started", target.prompt)),
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
