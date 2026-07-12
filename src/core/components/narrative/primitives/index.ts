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
 * and optional state interpolation. This legacy format is frozen; its historical
 * specification is archived at docs/archive/pre-reboot/LESSON_V2_DESIGN.md.
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
