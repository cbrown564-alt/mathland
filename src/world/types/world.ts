export type DomainId = "engineering" | "ai" | "finance" | "climate";

export type JourneyStep =
  | "entry"
  | "observatory"
  | "studio"
  | "practice"
  | "transfer"
  | "atlas"
  | "retrieval";

export type EvidenceKind =
  | "predicted"
  | "constructed"
  | "supported"
  | "independent"
  | "explained"
  | "transferred"
  | "retrieved"
  | "detour_started"
  | "detour_resolved";

export interface EvidenceEvent {
  id: string;
  kind: EvidenceKind;
  territoryId: string;
  at: string;
  detail?: string;
  support?: "none" | "cue" | "worked";
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

export interface ReturnTarget {
  step: JourneyStep;
  focusId: string;
  prompt: string;
}

export interface DetourState {
  id: "signed-components";
  reason: string;
  origin: ReturnTarget;
  startedAt: string;
}

export interface WorldSnapshot {
  version: 1;
  activeGoal: Exclude<DomainId, "climate">;
  step: JourneyStep;
  evidence: EvidenceEvent[];
  detour: DetourState | null;
  retrievalDueAt: string | null;
  updatedAt: string;
}
