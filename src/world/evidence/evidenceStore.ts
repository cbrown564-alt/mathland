import { AtlasEvidenceState, DomainId, EvidenceEvent, EvidenceKind, JourneyStep, WorldSnapshot } from "../types/world";

export const WORLD_STORAGE_KEY = "mathland.world.v3";
export const PROTOTYPE_WORLD_STORAGE_KEY = "mathland.world.dot-product.v2";
export const LEGACY_WORLD_STORAGE_KEY = "mathland.world.dot-product.v1";
export const RETRIEVAL_DELAY_MS = 7 * 24 * 60 * 60 * 1000;
export const WORLD_EXPORT_FORMAT = "mathland-world-export";

export const createSnapshot = (now = new Date()): WorldSnapshot => ({
  version: 3,
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
  territoryId: kind.startsWith("detour")
    ? "components"
    : kind === "normalised"
      ? "magnitude-angle"
      : kind === "projected"
        ? "projection"
        : "dot-product",
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

const validSteps = new Set<JourneyStep>(["entry", "tour", "observatory", "studio", "practice", "normalisation", "transfer", "atlas", "projection", "retrieval"]);
const validGoals = new Set<Exclude<DomainId, "climate">>(["engineering", "ai", "finance"]);
const validTourStates = new Set<WorldSnapshot["tourStatus"]>(["not-started", "in-progress", "completed", "skipped"]);

const isSnapshot = (value: unknown): value is WorldSnapshot => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<WorldSnapshot>;
  return candidate.version === 3
    && Array.isArray(candidate.evidence)
    && validSteps.has(candidate.step as JourneyStep)
    && validGoals.has(candidate.activeGoal as Exclude<DomainId, "climate">)
    && validTourStates.has(candidate.tourStatus as WorldSnapshot["tourStatus"])
    && (candidate.retrievalDueAt === null || typeof candidate.retrievalDueAt === "string")
    && typeof candidate.updatedAt === "string";
};

interface LegacySnapshot extends Omit<WorldSnapshot, "version" | "horizonChosenAt" | "tourStatus"> { version: 1 }
interface PrototypeSnapshot extends Omit<WorldSnapshot, "version"> { version: 2 }

const migratePrototypeSnapshot = (value: unknown): WorldSnapshot | null => {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<PrototypeSnapshot>;
  if (candidate.version !== 2 || !Array.isArray(candidate.evidence) || !validSteps.has(candidate.step as JourneyStep)
    || !validGoals.has(candidate.activeGoal as Exclude<DomainId, "climate">)
    || !validTourStates.has(candidate.tourStatus as WorldSnapshot["tourStatus"])) return null;
  return { ...(candidate as PrototypeSnapshot), version: 3 };
};

const migrateLegacySnapshot = (value: unknown): WorldSnapshot | null => {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<LegacySnapshot>;
  if (candidate.version !== 1 || !Array.isArray(candidate.evidence) || typeof candidate.step !== "string") return null;
  return {
    ...(candidate as LegacySnapshot),
    version: 3,
    horizonChosenAt: candidate.updatedAt ?? new Date().toISOString(),
    tourStatus: "skipped",
  };
};

export const loadSnapshot = (storage: Pick<Storage, "getItem">, now = new Date()): WorldSnapshot => {
  try {
    const raw = storage.getItem(WORLD_STORAGE_KEY)
      ?? storage.getItem(PROTOTYPE_WORLD_STORAGE_KEY)
      ?? storage.getItem(LEGACY_WORLD_STORAGE_KEY);
    if (!raw) return createSnapshot(now);
    const parsed: unknown = JSON.parse(raw);
    return isSnapshot(parsed)
      ? parsed
      : migratePrototypeSnapshot(parsed) ?? migrateLegacySnapshot(parsed) ?? createSnapshot(now);
  } catch {
    return createSnapshot(now);
  }
};

export const saveSnapshot = (storage: Pick<Storage, "setItem">, snapshot: WorldSnapshot): void => {
  storage.setItem(WORLD_STORAGE_KEY, JSON.stringify(snapshot));
};

export const removeSnapshot = (storage: Pick<Storage, "removeItem">): void => {
  storage.removeItem(WORLD_STORAGE_KEY);
  storage.removeItem(PROTOTYPE_WORLD_STORAGE_KEY);
  storage.removeItem(LEGACY_WORLD_STORAGE_KEY);
};

interface WorldExport {
  format: typeof WORLD_EXPORT_FORMAT;
  exportedAt: string;
  snapshot: WorldSnapshot;
}

export const serialiseWorldExport = (snapshot: WorldSnapshot, now = new Date()): string => JSON.stringify({
  format: WORLD_EXPORT_FORMAT,
  exportedAt: now.toISOString(),
  snapshot,
} satisfies WorldExport, null, 2);

export const parseWorldExport = (source: string): WorldSnapshot => {
  if (source.length > 1_000_000) throw new Error("That journey file is too large to be a Mathland export.");
  let parsed: unknown;
  try {
    parsed = JSON.parse(source);
  } catch {
    throw new Error("That file is not valid JSON.");
  }
  if (!parsed || typeof parsed !== "object") throw new Error("That file is not a Mathland journey export.");
  const candidate = parsed as Partial<WorldExport>;
  if (candidate.format !== WORLD_EXPORT_FORMAT || !isSnapshot(candidate.snapshot)) {
    throw new Error("That file is not a supported Mathland journey export.");
  }
  return candidate.snapshot;
};
