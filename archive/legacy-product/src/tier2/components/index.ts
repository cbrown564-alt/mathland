// Tier 2 Template Components
export { default as BaseTemplate } from './BaseTemplate';
export { default as ProcessFlowTemplate } from './ProcessFlowTemplate';
export { default as ComparisonFrameworkTemplate } from './ComparisonFrameworkTemplate';
export { default as ApplicationContextTemplate } from './ApplicationContextTemplate';
export { default as MathematicalDiagramTemplate } from './MathematicalDiagramTemplate';

// Template component types
export type {
  BaseTemplateProps,
  CharacterInsightProps,
  ProgressIndicatorProps,
  SectionDividerProps
} from './BaseTemplate';

// Re-export types for convenience
export * from '../types/templateTypes';
export * from '../design/designSystem';