// Tier 2 Template System
// Enhanced static graphics and content templates for efficient lesson creation

export * from './components';
export * from './types/templateTypes';
export * from './design/designSystem';

// Template factory functions for easy instantiation
import {
  ProcessFlowTemplate,
  ComparisonFrameworkTemplate,
  ApplicationContextTemplate,
  MathematicalDiagramTemplate
} from './components';

export const Tier2Templates = {
  ProcessFlow: ProcessFlowTemplate,
  Comparison: ComparisonFrameworkTemplate,
  Application: ApplicationContextTemplate,
  Diagram: MathematicalDiagramTemplate
};

// Template configuration helpers
export const createTemplateConfig = (templateType: string, characterId: string) => {
  const baseConfig = {
    characterId,
    templateType,
    title: '',
    description: '',
    learningObjectives: [],
    interactionHints: []
  };

  switch (templateType) {
    case 'process-flow':
      return {
        ...baseConfig,
        templateType: 'process-flow' as const,
        steps: [],
        visualFlow: 'vertical' as const
      };
    
    case 'comparison':
      return {
        ...baseConfig,
        templateType: 'comparison' as const,
        items: [],
        criteria: [],
        decisionGuide: []
      };
    
    case 'application':
      return {
        ...baseConfig,
        templateType: 'application' as const,
        scenarios: [],
        industryConnections: []
      };
    
    case 'diagram':
      return {
        ...baseConfig,
        templateType: 'diagram' as const,
        elements: [],
        width: 800,
        height: 600,
        interactions: [],
        mathematicalConcepts: []
      };
    
    default:
      return baseConfig;
  }
};