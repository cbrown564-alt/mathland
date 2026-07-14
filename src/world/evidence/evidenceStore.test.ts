import { appendEvidence, createSnapshot, deriveAtlasState, LEGACY_WORLD_STORAGE_KEY, loadSnapshot, makeEvidence, parseWorldExport, PROTOTYPE_WORLD_STORAGE_KEY, removeSnapshot, RETRIEVAL_DELAY_MS, scheduleRetrieval, serialiseWorldExport, WORLD_STORAGE_KEY } from "./evidenceStore";

describe("world evidence store", () => {
  const now = new Date("2026-07-12T12:00:00.000Z");

  test("derives descriptive evidence states in order", () => {
    const predicted = [makeEvidence("predicted", undefined, "none", now)];
    const supported = [...predicted, makeEvidence("supported", undefined, "cue", now)];
    const independent = [...supported, makeEvidence("independent", undefined, "none", now)];
    const transferred = [...independent, makeEvidence("transferred", undefined, "none", now)];
    expect(deriveAtlasState([], null, now)).toBe("unseen");
    expect(deriveAtlasState(predicted, null, now)).toBe("encountered");
    expect(deriveAtlasState(supported, null, now)).toBe("supported");
    expect(deriveAtlasState(independent, null, now)).toBe("independent");
    expect(deriveAtlasState(transferred, null, now)).toBe("transferable");
  });

  test("marks scheduled work due without claiming mastery", () => {
    const due = new Date(now.getTime() - 1).toISOString();
    expect(deriveAtlasState([makeEvidence("transferred", undefined, "none", now)], due, now)).toBe("due-for-return");
    expect(new Date(scheduleRetrieval(now)).getTime() - now.getTime()).toBe(RETRIEVAL_DELAY_MS);
  });

  test("does not duplicate the same descriptive event", () => {
    const event = makeEvidence("predicted", "negative", "none", now);
    expect(appendEvidence(appendEvidence([], event), event)).toHaveLength(1);
  });

  test("quarantines corrupt or unknown local state", () => {
    const corrupt = { getItem: jest.fn(() => "not-json") };
    const wrongVersion = { getItem: jest.fn(() => JSON.stringify({ version: 99, evidence: [] })) };
    expect(loadSnapshot(corrupt, now)).toEqual(createSnapshot(now));
    expect(loadSnapshot(wrongVersion, now)).toEqual(createSnapshot(now));
    expect(corrupt.getItem).toHaveBeenCalledWith(WORLD_STORAGE_KEY);
  });

  test("migrates the version-one journey without losing work", () => {
    const legacy = {
      version: 1, activeGoal: "ai", step: "practice", evidence: [makeEvidence("predicted", "negative", "none", now)],
      detour: null, retrievalDueAt: null, updatedAt: now.toISOString(),
    };
    const storage = { getItem: jest.fn((key: string) => key === LEGACY_WORLD_STORAGE_KEY ? JSON.stringify(legacy) : null) };
    expect(loadSnapshot(storage, now)).toMatchObject({ version: 3, activeGoal: "ai", step: "practice", tourStatus: "skipped", horizonChosenAt: now.toISOString() });
  });

  test("migrates the signed-off prototype journey into the production schema", () => {
    const prototype = { ...createSnapshot(now), version: 2, activeGoal: "finance", step: "atlas" };
    const storage = { getItem: jest.fn((key: string) => key === PROTOTYPE_WORLD_STORAGE_KEY ? JSON.stringify(prototype) : null) };
    expect(loadSnapshot(storage, now)).toMatchObject({ version: 3, activeGoal: "finance", step: "atlas" });
  });

  test("exports, validates, and deletes a portable production journey", () => {
    const snapshot = { ...createSnapshot(now), activeGoal: "ai" as const, step: "normalisation" as const };
    expect(parseWorldExport(serialiseWorldExport(snapshot, now))).toEqual(snapshot);
    expect(() => parseWorldExport(JSON.stringify({ format: "something-else", snapshot }))).toThrow(/supported Mathland/);
    const storage = { removeItem: jest.fn() };
    removeSnapshot(storage);
    expect(storage.removeItem).toHaveBeenCalledWith(WORLD_STORAGE_KEY);
    expect(storage.removeItem).toHaveBeenCalledWith(PROTOTYPE_WORLD_STORAGE_KEY);
    expect(storage.removeItem).toHaveBeenCalledWith(LEGACY_WORLD_STORAGE_KEY);
  });

  test("keeps supported completion distinct from independent evidence", () => {
    const supported = [makeEvidence("supported", "Calculation recovered", "worked", now)];
    expect(deriveAtlasState(supported, null, now)).toBe("supported");
    expect(deriveAtlasState([...supported, makeEvidence("independent", "Fresh attempt", "none", now)], null, now)).toBe("independent");
  });
});
