import { ComponentType } from "react";
import { DotProductExplorer } from "./DotProductExplorer";

/** Props every climax interactive accepts so a beat can watch what the learner achieves. */
export interface InteractiveProps {
  onStateChange?: (s: { dot: number; cos: number; tone: string }) => void;
}

/**
 * Registry of climax interactives, keyed by the string a beat names. Keeps the
 * authoring data (a key) decoupled from the component wiring.
 */
export const INTERACTIVES: Record<string, ComponentType<InteractiveProps>> = {
  dot_product_explorer: DotProductExplorer,
};
