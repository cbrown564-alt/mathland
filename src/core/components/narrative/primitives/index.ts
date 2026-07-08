import { ComponentType } from "react";
import type { InteractiveProps } from "../interactives";
import {
  VectorPlotReadOnly,
  VectorPlotClimax,
  interpolateVectorPlot,
  type VectorPlotState,
} from "./vectorPlot";

/**
 * A registered visual primitive: read-only coupled renderer, draggable climax twin,
 * and optional state interpolation. See docs/LESSON_V2_DESIGN.md §5.
 */
export interface VisualPrimitive<S> {
  ReadOnly: ComponentType<{ state: S }>;
  Climax: ComponentType<InteractiveProps>;
  interpolate?: (a: S, b: S, t: number) => S;
}

export type VisualKey = "vectorPlot";

export const VISUAL_PRIMITIVES: Record<VisualKey, VisualPrimitive<VectorPlotState>> = {
  vectorPlot: {
    ReadOnly: VectorPlotReadOnly,
    Climax: VectorPlotClimax,
    interpolate: interpolateVectorPlot,
  },
};

export type { VectorPlotState };
export { VectorPlotReadOnly, VectorPlotClimax, interpolateVectorPlot };
