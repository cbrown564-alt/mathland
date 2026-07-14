import { ComponentType } from "react";
import { BasisExplorer } from "./BasisExplorer";
import { DotProductExplorer } from "./DotProductExplorer";
import { ForestMappingExplorer } from "./ForestMappingExplorer";
import { SpanExplorer } from "./SpanExplorer";
import { VectorBasicsExplorer } from "./VectorBasicsExplorer";
import { VectorAdditionExplorer } from "./VectorAdditionExplorer";
import { VectorNormsExplorer } from "./VectorNormsExplorer";
import VeraLinearCombination from "@/interactive/components/vera_linear_combination";
import VeraVectorPlayground from "@/interactive/components/vera_vector_playground";

/** State reported by climax interactives — `tone` gates Continue via goal matching. */
export interface InteractiveState {
  tone: string;
  [key: string]: unknown;
}

/** Props every climax interactive accepts so a beat can watch what the learner achieves. */
export interface InteractiveProps {
  onStateChange?: (s: InteractiveState) => void;
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
  basis_explorer: BasisExplorer,
  dot_product_explorer: DotProductExplorer,
  forest_mapping_explorer: ForestMappingExplorer,
  span_explorer: SpanExplorer,
  vector_basics_explorer: VectorBasicsExplorer,
  vector_addition_explorer: VectorAdditionExplorer,
  vector_norms_explorer: VectorNormsExplorer,
  linear_combination_explorer: LinearCombinationExplorer,
  vector_playground_explorer: VectorPlaygroundExplorer,
};
