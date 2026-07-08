import { ComponentType } from "react";
import { DotProductExplorer } from "./DotProductExplorer";
import { VectorBasicsExplorer } from "./VectorBasicsExplorer";
import { VectorAdditionExplorer } from "./VectorAdditionExplorer";
import { VectorNormsExplorer } from "./VectorNormsExplorer";
import VeraLinearCombination from "@/interactive/components/vera_linear_combination";
import VeraVectorPlayground from "@/interactive/components/vera_vector_playground";

/** Props every climax interactive accepts so a beat can watch what the learner achieves. */
export interface InteractiveProps {
  onStateChange?: (s: { dot: number; cos: number; tone: string }) => void;
}

const LinearCombinationExplorer: ComponentType<InteractiveProps> = () => (
  <div className="max-h-[70vh] overflow-y-auto rounded-xl">
    <VeraLinearCombination isPreview={false} />
  </div>
);

const VectorPlaygroundExplorer: ComponentType<InteractiveProps> = () => (
  <div className="max-h-[70vh] overflow-y-auto rounded-xl">
    <VeraVectorPlayground />
  </div>
);

/**
 * Registry of climax interactives, keyed by the string a beat names. Keeps the
 * authoring data (a key) decoupled from the component wiring.
 */
export const INTERACTIVES: Record<string, ComponentType<InteractiveProps>> = {
  dot_product_explorer: DotProductExplorer,
  vector_basics_explorer: VectorBasicsExplorer,
  vector_addition_explorer: VectorAdditionExplorer,
  vector_norms_explorer: VectorNormsExplorer,
  linear_combination_explorer: LinearCombinationExplorer,
  vector_playground_explorer: VectorPlaygroundExplorer,
};
