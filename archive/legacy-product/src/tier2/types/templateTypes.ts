// Core types for the Tier 2 template system
// Enables efficient creation of enhanced static graphics

export type TemplateType = 'process' | 'comparison' | 'application' | 'diagram';

export type CharacterIntegration = 'guide' | 'narrator' | 'commentator' | 'companion';

export type InformationFlow = 'linear' | 'hub-spoke' | 'matrix' | 'narrative' | 'circular';

export type ComplexityProgression = 'simple-to-complex' | 'overview-to-detail' | 'problem-to-solution';

export type RenderingMethod = 'svg-components' | 'illustrated-assets' | 'hybrid';

export type ResponsiveStrategy = 'scalable-typography' | 'adaptive-layout' | 'progressive-disclosure';

// Base interface for all Tier 2 components
export interface Tier2Component {
  // Visual Design Elements
  templateType: TemplateType;
  characterIntegration: CharacterIntegration;
  
  // Educational Structure
  informationFlow: InformationFlow;
  complexityProgression: ComplexityProgression;
  
  // Technical Implementation
  renderingMethod: RenderingMethod;
  responsiveStrategy: ResponsiveStrategy;
  
  // Content Configuration
  characterId: string;
  title: string;
  description: string;
  educationalObjectives: string[];
  targetAudience: 'beginner' | 'intermediate' | 'advanced';
}

// Process Flow Template Types
export interface ProcessFlowStep {
  id: string;
  title: string;
  description: string;
  formula?: string;
  example?: string;
  characterInsight?: string;
  visualElement?: ProcessVisualElement;
  dependencies?: string[]; // IDs of prerequisite steps
}

export interface ProcessVisualElement {
  type: 'formula' | 'diagram' | 'calculation' | 'transformation' | 'result';
  content: string | object;
  styling?: {
    highlight?: boolean;
    color?: string;
    size?: 'small' | 'medium' | 'large';
  };
}

export interface ProcessFlowTemplate extends Tier2Component {
  templateType: 'process';
  steps: ProcessFlowStep[];
  visualFlow: 'vertical' | 'horizontal' | 'branching' | 'cyclical';
  interactionHints?: string[]; // Connections to Tier 1 components
}

// Comparison Framework Template Types
export interface ComparisonItem {
  id: string;
  name: string;
  description: string;
  advantages: string[];
  disadvantages: string[];
  bestUseCases: string[];
  example: string;
  characterPerspective: string;
  relatedConcepts?: string[];
}

export interface ComparisonCriteria {
  id: string;
  name: string;
  description: string;
  weight: number; // 1-5 scale for importance
}

export interface ComparisonFrameworkTemplate extends Tier2Component {
  templateType: 'comparison';
  items: ComparisonItem[];
  criteria: ComparisonCriteria[];
  comparisonMatrix?: { [itemId: string]: { [criteriaId: string]: number } };
  visualLayout: 'side-by-side' | 'matrix' | 'pros-cons' | 'decision-tree';
  decisionGuidance?: string;
}

// Application Context Template Types
export interface ApplicationScenario {
  id: string;
  title: string;
  industry: string;
  description: string;
  mathematicalConcepts: string[];
  realWorldProblem: string;
  mathematicalSolution: string;
  businessImpact: string;
  characterConnection: string;
  visualElements?: ApplicationVisual[];
}

export interface ApplicationVisual {
  type: 'workflow' | 'before-after' | 'data-flow' | 'system-diagram';
  title: string;
  description: string;
  svgPath?: string;
  interactiveElements?: boolean;
}

export interface ApplicationContextTemplate extends Tier2Component {
  templateType: 'application';
  scenarios: ApplicationScenario[];
  industries: string[];
  impactMetrics?: {
    efficiency?: string;
    accuracy?: string;
    cost?: string;
    time?: string;
  };
  careerConnections?: string[];
}

// Mathematical Diagram Template Types
export interface DiagramElement {
  id: string;
  type: 'shape' | 'arrow' | 'label' | 'formula' | 'point' | 'line' | 'curve';
  position: { x: number; y: number };
  properties: {
    [key: string]: unknown; // Flexible properties for different element types
  };
  styling: {
    color?: string;
    strokeWidth?: number;
    fontSize?: number;
    fontWeight?: 'normal' | 'bold';
    opacity?: number;
  };
  animation?: {
    type: 'fade-in' | 'slide' | 'highlight' | 'scale';
    delay?: number;
    duration?: number;
  };
}

export interface DiagramLayer {
  id: string;
  name: string;
  elements: DiagramElement[];
  visible: boolean;
  interactive?: boolean;
}

export interface MathematicalDiagramTemplate extends Tier2Component {
  templateType: 'diagram';
  layers: DiagramLayer[];
  viewBox: { width: number; height: number };
  interactiveFeatures?: {
    hover?: boolean;
    click?: boolean;
    zoom?: boolean;
    pan?: boolean;
  };
  educationalAnnotations?: {
    [elementId: string]: string;
  };
}

// Character Integration Types
export interface CharacterVoice {
  introNarrative?: string;
  explanationStyle: string;
  guidancePrompts: string[];
  successFeedback?: string;
  characterSpecificTerminology?: { [key: string]: string };
  visualPresence: {
    avatar: boolean;
    position: 'corner' | 'inline' | 'floating';
    size: 'small' | 'medium' | 'large';
  };
}

export interface CharacterIntegrationConfig {
  characterId: string;
  voice: CharacterVoice;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  personality: {
    traits: string[];
    communicationStyle: string;
    expertise: string;
  };
}

// Template Configuration and Metadata
export interface TemplateMetadata {
  id: string;
  version: string;
  createdDate: string;
  lastModified: string;
  author: string;
  estimatedCreationTime: string; // e.g., "2-3 hours"
  educationalLevel: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];
  learningOutcomes: string[];
  relatedTier1Components?: string[];
  relatedTier3Content?: string[];
}

// Template System Configuration
export interface TemplateSystemConfig {
  designSystem: {
    typography: {
      fontFamily: string;
      headingSizes: { [level: string]: string };
      bodySize: string;
      codeSize: string;
    };
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      neutral: string[];
      semantic: {
        success: string;
        warning: string;
        error: string;
        info: string;
      };
    };
    spacing: {
      unit: number; // Base spacing unit in pixels
      scales: { [name: string]: number }; // Multipliers for different spacing needs
    };
    layout: {
      maxWidth: string;
      breakpoints: { [device: string]: string };
      gridColumns: number;
    };
  };
  performance: {
    targetLoadTime: string; // e.g., "< 1s"
    imageSizeLimit: string; // e.g., "100KB"
    svgComplexityLimit: number; // Maximum number of elements
  };
  accessibility: {
    colorContrastRatio: number; // WCAG compliance level
    fontSize: {
      minimum: string;
      scalable: boolean;
    };
    navigation: {
      keyboardSupport: boolean;
      screenReaderSupport: boolean;
    };
  };
}

// Export all template types as a union for type safety
export type AnyTemplate = 
  | ProcessFlowTemplate 
  | ComparisonFrameworkTemplate 
  | ApplicationContextTemplate 
  | MathematicalDiagramTemplate;