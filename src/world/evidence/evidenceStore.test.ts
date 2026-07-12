import { appendEvidence, createSnapshot, deriveAtlasState, loadSnapshot, makeEvidence, RETRIEVAL_DELAY_MS, scheduleRetrieval, WORLD_STORAGE_KEY } from "./evidenceStore";

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
});
