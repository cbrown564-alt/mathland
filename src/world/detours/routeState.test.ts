import { beginSignedComponentsDetour, resolveDetour } from "./routeState";

describe("diagnostic detour route contract", () => {
  test("preserves the exact blocked task and focus target", () => {
    const origin = { step: "practice" as const, focusId: "faded-challenge", prompt: "Complete the final sum" };
    const detour = beginSignedComponentsDetour(origin, new Date("2026-07-12T12:00:00Z"));
    expect(detour.reason).toMatch(/signed components/i);
    expect(resolveDetour(detour)).toEqual(origin);
  });
});
