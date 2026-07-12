import { DetourState, ReturnTarget } from "../types/world";

export const beginSignedComponentsDetour = (origin: ReturnTarget, now = new Date()): DetourState => ({
  id: "signed-components",
  reason: "This move depends on multiplying signed components, then adding their contributions.",
  origin,
  startedAt: now.toISOString(),
});

export const resolveDetour = (detour: DetourState): ReturnTarget => detour.origin;
