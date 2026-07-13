import { DetourId, DetourState, ReturnTarget } from "../types/world";

export const detourReasons: Record<DetourId, string> = {
  "vector-components": "This move depends on translating a geometric endpoint into horizontal and vertical components.",
  "signed-arithmetic": "This move depends on multiplying signed components, then adding their contributions.",
  "angle-cosine": "This move depends on separating vector length from direction and using cosine for directional agreement.",
  "weighted-sums": "This move depends on keeping each weight beside its matching value and interpreting the resulting units.",
};

export const beginDetour = (id: DetourId, origin: ReturnTarget, now = new Date()): DetourState => ({
  id,
  reason: detourReasons[id],
  origin,
  startedAt: now.toISOString(),
});

export const beginSignedComponentsDetour = (origin: ReturnTarget, now = new Date()): DetourState =>
  beginDetour("signed-arithmetic", origin, now);

export const resolveDetour = (detour: DetourState): ReturnTarget => detour.origin;
