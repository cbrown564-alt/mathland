import { AtlasEvidenceState, EvidenceEvent, EvidenceKind, WorldSnapshot } from "../types/world";

export const WORLD_STORAGE_KEY = "mathland.world.dot-product.v2";
export const LEGACY_WORLD_STORAGE_KEY = "mathland.world.dot-product.v1";
export const RETRIEVAL_DELAY_MS = 7 * 24 * 60 * 60 * 1000;

export const createSnapshot = (now = new Date()): WorldSnapshot => ({
  version: 2,
  activeGoal: "engineering",
  horizonChosenAt: null,
  tourStatus: "not-started",
  step: "entry",
  evidence: [],
  detour: null,
  retrievalDueAt: null,
  updatedAt: now.toISOString(),
});

export const makeEvidence = (
  kind: EvidenceKind,
  detail?: string,
  support?: EvidenceEvent["support"],
  now = new Date(),
): EvidenceEvent => ({
  id: `${now.getTime()}-${kind}-${Math.random().toString(36).slice(2, 8)}`,
  kind,
  territoryId: kind.startsWith("detour") ? "components" : "dot-product",
  at: now.toISOString(),
  detail,
  support,
});

export const appendEvidence = (events: EvidenceEvent[], event: EvidenceEvent): EvidenceEvent[] => {
  const duplicate = events.some((existing) => existing.kind === event.kind && existing.detail === event.detail);
  return duplicate ? events : [...events, event];
};

export const deriveAtlasState = (
  events: EvidenceEvent[],
  retrievalDueAt: string | null,
  now = new Date(),
): AtlasEvidenceState => {
  if (retrievalDueAt && new Date(retrievalDueAt) <= now && !events.some((event) => event.kind === "retrieved")) return "due-for-return";
  if (events.some((event) => event.kind === "transferred" || event.kind === "retrieved")) return "transferable";
  if (events.some((event) => event.kind === "independent" && event.support === "none")) return "independent";
  if (events.some((event) => event.kind === "supported" || event.kind === "constructed")) return "supported";
  if (events.some((event) => event.kind === "predicted")) return "encountered";
  return "unseen";
};

export const scheduleRetrieval = (now = new Date()): string => new Date(now.getTime() + RETRIEVAL_DELAY_MS).toISOString();

const isSnapshot = (value: unknown): value is WorldSnapshot => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<WorldSnapshot>;
  return candidate.version === 2 && Array.isArray(candidate.evidence) && typeof candidate.step === "string"
    && typeof candidate.tourStatus === "string";
};

interface LegacySnapshot extends Omit<WorldSnapshot, "version" | "horizonChosenAt" | "tourStatus"> { version: 1 }

const migrateLegacySnapshot = (value: unknown): WorldSnapshot | null => {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<LegacySnapshot>;
  if (candidate.version !== 1 || !Array.isArray(candidate.evidence) || typeof candidate.step !== "string") return null;
  return {
    ...(candidate as LegacySnapshot),
    version: 2,
    horizonChosenAt: candidate.updatedAt ?? new Date().toISOString(),
    tourStatus: "skipped",
  };
};

export const loadSnapshot = (storage: Pick<Storage, "getItem">, now = new Date()): WorldSnapshot => {
  try {
    const raw = storage.getItem(WORLD_STORAGE_KEY) ?? storage.getItem(LEGACY_WORLD_STORAGE_KEY);
    if (!raw) return createSnapshot(now);
    const parsed: unknown = JSON.parse(raw);
    return isSnapshot(parsed) ? parsed : migrateLegacySnapshot(parsed) ?? createSnapshot(now);
  } catch {
    return createSnapshot(now);
  }
};

export const saveSnapshot = (storage: Pick<Storage, "setItem">, snapshot: WorldSnapshot): void => {
  storage.setItem(WORLD_STORAGE_KEY, JSON.stringify(snapshot));
};
