import { ComponentType, ReactNode } from "react";
import { deepLerp } from "./CoupledVisual";
import { VISUAL_PRIMITIVES, type VectorPlotState } from "./primitives";
import type { VisualBinding, VisualKey } from "@/content/beats/schema";

const DEFAULT_STATES: Record<VisualKey, unknown> = {
  vectorPlot: { u: [3, 4], v: [3.4, 2.6], emphasis: "none" } satisfies VectorPlotState,
};

/**
 * Resolves VisualBinding to renderers and interpolation for the beat engine.
 * Primitive implementations live in ./primitives (§5).
 */
export function resolveReadOnlyRenderer<S>(binding: VisualBinding<S>): (state: S) => ReactNode {
  if ("render" in binding) return binding.render;
  const ReadOnly = VISUAL_PRIMITIVES[binding.key].ReadOnly as ComponentType<{ state: S }>;
  return (state: S) => <ReadOnly state={state} />;
}

export function resolveInterpolate<S>(
  binding: VisualBinding<S>,
  beatInterpolate?: (a: S, b: S, t: number) => S,
) {
  if (beatInterpolate) return beatInterpolate;
  if ("key" in binding) {
    return VISUAL_PRIMITIVES[binding.key].interpolate ?? deepLerp;
  }
  return deepLerp;
}

export function resolveDefaultState<S>(binding: VisualBinding<S>): S | undefined {
  if ("key" in binding) return DEFAULT_STATES[binding.key] as S;
  return undefined;
}

export function resolveBeatVisual<S>(
  lessonVisual: VisualBinding<S>,
  beatVisual?: VisualBinding<S>,
): VisualBinding<S> {
  return beatVisual ?? lessonVisual;
}

export { VISUAL_PRIMITIVES } from "./primitives";
export type { VectorPlotState } from "./primitives";
