import React from 'react';
import VeraVectorPlayground from './components/vera_vector_playground';
import VeraVectorArithmetic from './components/vera_vector_arithmetic';
import VeraLinearCombination from './components/vera_linear_combination';
import MaxMatrixTransformer from './components/max_matrix_transformer';
import MaxDeterminantExplorer from './components/max_determinant_explorer';
import BayesMedicalDiagnosis from './components/bayes_medical_diagnosis';
import EileenEigenvalueDetective from './components/eileen_eigenvalue_detective';
import EileenDiagonalizationExplorer from './components/eileen_diagonalization_explorer';
import EileenPCADimensionReducer from './components/eileen_pca_dimension_reducer';
import EileenMatrixPowers from './components/eileen_matrix_powers';
import EileenComplexEigenvalues from './components/eileen_complex_eigenvalues';
import DeltaPartialDerivativeExplorer from './components/delta_partial_derivative_explorer';
import DeltaLimitsExplorer from './components/delta_limits_explorer';
import DeltaContinuitySurfaces from './components/delta_continuity_surfaces';
import DeltaGradientExplorer from './components/delta_gradient_explorer';
import DeltaDirectionalDerivatives from './components/delta_directional_derivatives';
import DeltaJacobianMatrix from './components/delta_jacobian_matrix';
import DeltaConstrainedOptimization from './components/delta_constrained_optimization';
import GretaGradientDescentClimber from './components/greta_gradient_descent_climber';
import GretaHessianAnalyzer from './components/greta_hessian_analyzer';
import PippaProbabilityMagic from './components/pippa_probability_magic';
import PippaCLTDemonstration from './components/pippa_clt_demonstration';
import PippaRandomVariables from './components/pippa_random_variables';
import SigmundHypothesisArena from './components/sigmund_hypothesis_arena';
import OllieFoundationBuilder from './components/ollie_foundation_builder';
import OllieEquationSolver from './components/ollie_equation_solver';
import OllieFunctionGrapher from './components/ollie_function_grapher';
import SageDataSynthesizer from './components/sage_data_synthesizer';
import VeraForestMapping from './components/vera_forest_mapping';
import { LessonData } from '@/core/types/lesson';

interface CustomComponentProps {
  lesson: LessonData;
}

// Wrapper for MaxMatrixTransformer to match interface
const MaxMatrixTransformerWrapper: React.ComponentType<CustomComponentProps> = () => {
  return React.createElement(MaxMatrixTransformer, { isPreview: false });
};

// Wrapper for BayesMedicalDiagnosis to match interface
const BayesMedicalDiagnosisWrapper: React.ComponentType<CustomComponentProps> = () => {
  return React.createElement(BayesMedicalDiagnosis, { isPreview: false });
};

// Wrapper for EileenEigenvalueDetective to match interface
const EileenEigenvalueDetectiveWrapper: React.ComponentType<CustomComponentProps> = () => {
  return React.createElement(EileenEigenvalueDetective, { isPreview: false });
};

// Wrapper for EileenDiagonalizationExplorer to match interface
const EileenDiagonalizationExplorerWrapper: React.ComponentType<CustomComponentProps> = () => {
  return React.createElement(EileenDiagonalizationExplorer, { isPreview: false });
};

// Wrapper for EileenPCADimensionReducer to match interface
const EileenPCADimensionReducerWrapper: React.ComponentType<CustomComponentProps> = () => {
  return React.createElement(EileenPCADimensionReducer, { isPreview: false });
};

// Wrapper for EileenMatrixPowers to match interface
const EileenMatrixPowersWrapper: React.ComponentType<CustomComponentProps> = () => {
  return React.createElement(EileenMatrixPowers, { isPreview: false });
};

// Wrapper for EileenComplexEigenvalues to match interface
const EileenComplexEigenvaluesWrapper: React.ComponentType<CustomComponentProps> = () => {
  return React.createElement(EileenComplexEigenvalues, { isPreview: false });
};

// Wrapper for DeltaPartialDerivativeExplorer to match interface
const DeltaPartialDerivativeExplorerWrapper: React.ComponentType<CustomComponentProps> = () => {
  return React.createElement(DeltaPartialDerivativeExplorer, { isPreview: false });
};

// Wrapper for DeltaLimitsExplorer to match interface
const DeltaLimitsExplorerWrapper: React.ComponentType<CustomComponentProps> = () => {
  return React.createElement(DeltaLimitsExplorer, { isPreview: false });
};

// Wrapper for DeltaContinuitySurfaces to match interface
const DeltaContinuitySurfacesWrapper: React.ComponentType<CustomComponentProps> = () => {
  return React.createElement(DeltaContinuitySurfaces, { isPreview: false });
};

// Wrapper for DeltaGradientExplorer to match interface
const DeltaGradientExplorerWrapper: React.ComponentType<CustomComponentProps> = () => {
  return React.createElement(DeltaGradientExplorer, { isPreview: false });
};

// Wrapper for DeltaDirectionalDerivatives to match interface
const DeltaDirectionalDerivativesWrapper: React.ComponentType<CustomComponentProps> = () => {
  return React.createElement(DeltaDirectionalDerivatives, { isPreview: false });
};

// Wrapper for DeltaJacobianMatrix to match interface
const DeltaJacobianMatrixWrapper: React.ComponentType<CustomComponentProps> = () => {
  return React.createElement(DeltaJacobianMatrix, { isPreview: false });
};

// Wrapper for DeltaConstrainedOptimization to match interface
const DeltaConstrainedOptimizationWrapper: React.ComponentType<CustomComponentProps> = () => {
  return React.createElement(DeltaConstrainedOptimization, { isPreview: false });
};

// Wrapper for GretaGradientDescentClimber to match interface
const GretaGradientDescentClimberWrapper: React.ComponentType<CustomComponentProps> = () => {
  return React.createElement(GretaGradientDescentClimber, { isPreview: false });
};

// Wrapper for GretaHessianAnalyzer to match interface
const GretaHessianAnalyzerWrapper: React.ComponentType<CustomComponentProps> = () => {
  return React.createElement(GretaHessianAnalyzer, { isPreview: false });
};

// Wrapper for PippaProbabilityMagic to match interface
const PippaProbabilityMagicWrapper: React.ComponentType<CustomComponentProps> = () => {
  return React.createElement(PippaProbabilityMagic, { isPreview: false });
};

// Wrapper for PippaCLTDemonstration to match interface
const PippaCLTDemonstrationWrapper: React.ComponentType<CustomComponentProps> = () => {
  return React.createElement(PippaCLTDemonstration, { isPreview: false });
};

// Wrapper for PippaRandomVariables to match interface
const PippaRandomVariablesWrapper: React.ComponentType<CustomComponentProps> = () => {
  return React.createElement(PippaRandomVariables, { isPreview: false });
};

// Wrapper for SigmundHypothesisArena to match interface
const SigmundHypothesisArenaWrapper: React.ComponentType<CustomComponentProps> = () => {
  return React.createElement(SigmundHypothesisArena, { isPreview: false });
};

// Wrapper for OllieFoundationBuilder to match interface
const OllieFoundationBuilderWrapper: React.ComponentType<CustomComponentProps> = () => {
  return React.createElement(OllieFoundationBuilder, { isPreview: false });
};

// Wrapper for OllieEquationSolver to match interface
const OllieEquationSolverWrapper: React.ComponentType<CustomComponentProps> = () => {
  return React.createElement(OllieEquationSolver, { isPreview: false });
};

// Wrapper for OllieFunctionGrapher to match interface
const OllieFunctionGrapherWrapper: React.ComponentType<CustomComponentProps> = () => {
  return React.createElement(OllieFunctionGrapher, { isPreview: false });
};

// Wrapper for SageDataSynthesizer to match interface
const SageDataSynthesizerWrapper: React.ComponentType<CustomComponentProps> = () => {
  return React.createElement(SageDataSynthesizer, { isPreview: false });
};

// Wrapper for VeraForestMapping to match interface
const VeraForestMappingWrapper: React.ComponentType<CustomComponentProps> = () => {
  return React.createElement(VeraForestMapping, { isPreview: false });
};

// Wrapper for VeraVectorArithmetic to match interface
const VeraVectorArithmeticWrapper: React.ComponentType<CustomComponentProps> = () => {
  return React.createElement(VeraVectorArithmetic, { isPreview: false });
};

// Wrapper for VeraLinearCombination to match interface
const VeraLinearCombinationWrapper: React.ComponentType<CustomComponentProps> = () => {
  return React.createElement(VeraLinearCombination, { isPreview: false });
};

// Wrapper for MaxDeterminantExplorer to match interface
const MaxDeterminantExplorerWrapper: React.ComponentType<CustomComponentProps> = () => {
  return React.createElement(MaxDeterminantExplorer, { isPreview: false });
};

export const customDoComponents: Record<string, React.ComponentType<CustomComponentProps>> = {
  vera_vector_playground: VeraVectorPlayground,
  vera_vector_arithmetic: VeraVectorArithmeticWrapper,
  vera_linear_combination: VeraLinearCombinationWrapper,
  max_matrix_transformer: MaxMatrixTransformerWrapper,
  max_determinant_explorer: MaxDeterminantExplorerWrapper,
  bayes_medical_diagnosis: BayesMedicalDiagnosisWrapper,
  eileen_eigenvalue_detective: EileenEigenvalueDetectiveWrapper,
  eileen_diagonalization_explorer: EileenDiagonalizationExplorerWrapper,
  eileen_pca_dimension_reducer: EileenPCADimensionReducerWrapper,
  eileen_matrix_powers: EileenMatrixPowersWrapper,
  eileen_complex_eigenvalues: EileenComplexEigenvaluesWrapper,
  delta_partial_derivative_explorer: DeltaPartialDerivativeExplorerWrapper,
  delta_limits_explorer: DeltaLimitsExplorerWrapper,
  delta_continuity_surfaces: DeltaContinuitySurfacesWrapper,
  delta_gradient_explorer: DeltaGradientExplorerWrapper,
  delta_directional_derivatives: DeltaDirectionalDerivativesWrapper,
  delta_jacobian_matrix: DeltaJacobianMatrixWrapper,
  delta_constrained_optimization: DeltaConstrainedOptimizationWrapper,
  greta_gradient_descent_climber: GretaGradientDescentClimberWrapper,
  greta_hessian_analyzer: GretaHessianAnalyzerWrapper,
  pippa_probability_magic: PippaProbabilityMagicWrapper,
  pippa_clt_demonstration: PippaCLTDemonstrationWrapper,
  pippa_random_variables: PippaRandomVariablesWrapper,
  sigmund_hypothesis_arena: SigmundHypothesisArenaWrapper,
  ollie_foundation_builder: OllieFoundationBuilderWrapper,
  ollie_equation_solver: OllieEquationSolverWrapper,
  ollie_function_grapher: OllieFunctionGrapherWrapper,
  sage_data_synthesizer: SageDataSynthesizerWrapper,
  vera_forest_mapping: VeraForestMappingWrapper,
};

// Export individual components for the gallery
export {
  VeraVectorPlayground,
  VeraVectorArithmetic,
  VeraLinearCombination,
  MaxMatrixTransformer,
  MaxDeterminantExplorer,
  BayesMedicalDiagnosis,
  EileenEigenvalueDetective,
  EileenDiagonalizationExplorer,
  EileenPCADimensionReducer,
  EileenMatrixPowers,
  EileenComplexEigenvalues,
  DeltaPartialDerivativeExplorer,
  DeltaLimitsExplorer,
  DeltaContinuitySurfaces,
  DeltaGradientExplorer,
  DeltaDirectionalDerivatives,
  DeltaJacobianMatrix,
  DeltaConstrainedOptimization,
  GretaGradientDescentClimber,
  GretaHessianAnalyzer,
  PippaProbabilityMagic,
  PippaCLTDemonstration,
  PippaRandomVariables,
  SigmundHypothesisArena,
  OllieFoundationBuilder,
  OllieEquationSolver,
  OllieFunctionGrapher,
  SageDataSynthesizer,
  VeraForestMapping
}; 