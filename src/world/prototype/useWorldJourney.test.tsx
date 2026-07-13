import { act, renderHook } from "@testing-library/react";
import { WORLD_STORAGE_KEY } from "../evidence/evidenceStore";
import { useWorldJourney } from "./useWorldJourney";

describe("world journey hook", () => {
  beforeEach(() => window.localStorage.clear());

  test("persists horizon, evidence, and diagnostic return state", () => {
    const { result } = renderHook(() => useWorldJourney());
    act(() => result.current.chooseHorizon("ai"));
    act(() => result.current.record("normalised", "Unit vector built", "none"));
    act(() => result.current.goTo("normalisation"));
    act(() => result.current.startDetour("angle-cosine", { step: "normalisation", focusId: "normalisation-check", prompt: "Normalise [3, 4]" }));
    expect(result.current.snapshot.detour?.id).toBe("angle-cosine");
    let target: ReturnType<typeof result.current.finishDetour> = null;
    act(() => { target = result.current.finishDetour(); });
    expect(target).toEqual({ step: "normalisation", focusId: "normalisation-check", prompt: "Normalise [3, 4]" });
    expect(result.current.snapshot.activeGoal).toBe("ai");
    expect(JSON.parse(window.localStorage.getItem(WORLD_STORAGE_KEY) ?? "{}")).toMatchObject({ activeGoal: "ai", step: "normalisation", detour: null });
  });
});
