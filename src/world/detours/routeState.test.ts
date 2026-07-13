import { beginDetour, beginSignedComponentsDetour, resolveDetour } from "./routeState";

describe("diagnostic detour route contract", () => {
  test("preserves the exact blocked task and focus target", () => {
    const origin = { step: "practice" as const, focusId: "faded-challenge", prompt: "Complete the final sum" };
    const detour = beginSignedComponentsDetour(origin, new Date("2026-07-12T12:00:00Z"));
    expect(detour.reason).toMatch(/signed components/i);
    expect(resolveDetour(detour)).toEqual(origin);
  });

  test("diagnoses all four prerequisite repair types without changing the return contract", () => {
    const origin = { step: "normalisation" as const, focusId: "normalisation-check", prompt: "Normalise [3, 4]" };
    for (const id of ["vector-components", "signed-arithmetic", "angle-cosine", "weighted-sums"] as const) {
      const detour = beginDetour(id, origin);
      expect(detour.id).toBe(id);
      expect(detour.reason).not.toHaveLength(0);
      expect(resolveDetour(detour)).toEqual(origin);
    }
  });
});
