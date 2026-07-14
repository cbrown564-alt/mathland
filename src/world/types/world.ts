export type DomainId = "engineering" | "ai" | "finance" | "climate";

export type JourneyStep =
  | "entry"
  | "tour"
  | "observatory"
  | "studio"
  | "practice"
  | "normalisation"
  | "transfer"
  | "atlas"
  | "projection"
  | "retrieval";

export type EvidenceKind =
  | "attempted"
  | "predicted"
  | "constructed"
  | "supported"
  | "independent"
  | "explained"
  | "normalised"
  | "projected"
  | "transferred"
  | "retrieved"
  | "tour_completed"
  | "tour_skipped"
  | "transfer_deferred"
  | "retrieval_substituted"
  | "detour_started"
  | "detour_resolved";

export interface EvidenceEvent {
  id: string;
  kind: EvidenceKind;
  territoryId: string;
  at: string;
  detail?: string;
  support?: "none" | "observation" | "cue" | "comparison" | "worked" | "restudied" | "deferred" | "substituted";
}

export type AtlasEvidenceState =
  | "unseen"
  | "encountered"
  | "supported"
  | "independent"
  | "transferable"
  | "due-for-return";

export interface Territory {
  id: string;
  title: string;
  shortTitle: string;
  notation?: string;
  x: number;
  y: number;
  prerequisiteIds: string[];
  downstreamIds: string[];
  domains: DomainId[];
  status: "available" | "horizon";
}

export interface DomainCase {
  id: DomainId;
  eyebrow: string;
  title: string;
  question: string;
  interpretation: string;
  formula: string;
  assumption: string;
  units: string;
  vectors: { a: number[]; b: number[] };
}

export type DetourId = "vector-components" | "signed-arithmetic" | "angle-cosine" | "weighted-sums";

export interface ReturnTarget {
  step: JourneyStep;
  focusId: string;
  prompt: string;
}

export interface DetourState {
  id: DetourId;
  reason: string;
  origin: ReturnTarget;
  startedAt: string;
}

export interface WorldSnapshot {
  version: 3;
  activeGoal: Exclude<DomainId, "climate">;
  horizonChosenAt: string | null;
  tourStatus: "not-started" | "in-progress" | "completed" | "skipped";
  step: JourneyStep;
  evidence: EvidenceEvent[];
  detour: DetourState | null;
  retrievalDueAt: string | null;
  updatedAt: string;
}
