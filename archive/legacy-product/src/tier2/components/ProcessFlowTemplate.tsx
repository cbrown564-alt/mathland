import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Button } from '@/core/components/ui/button';
import { Badge } from '@/core/components/ui/badge';
import { 
  ProcessFlowTemplate as ProcessFlowConfig, 
  ProcessFlowStep, 
  ProcessVisualElement,
  CharacterIntegrationConfig 
} from '../types/templateTypes';
import BaseTemplate, { CharacterInsight, ProgressIndicator, SectionDivider } from './BaseTemplate';
import { getCharacterTheme } from '../design/designSystem';

interface ProcessFlowTemplateProps {
  config: ProcessFlowConfig;
  characterConfig: CharacterIntegrationConfig;
  interactive?: boolean;
}

interface StepComponentProps {
  step: ProcessFlowStep;
  stepNumber: number;
  isActive: boolean;
  isCompleted: boolean;
  characterId: string;
  onStepClick?: (stepId: string) => void;
}

interface VisualElementProps {
  element: ProcessVisualElement;
  characterId: string;
}

// Visual element renderer
const VisualElement: React.FC<VisualElementProps> = ({ element, characterId }) => {
  const theme = getCharacterTheme(characterId);
  
  const getElementContent = () => {
    switch (element.type) {
      case 'formula':
        return (
          <div className="bg-white p-3 rounded border font-mono text-center">
            <code className="text-sm">{element.content as string}</code>
          </div>
        );
      case 'calculation':
        return (
          <div className="bg-gray-50 p-3 rounded border">
            <pre className="text-sm font-mono whitespace-pre-wrap">
              {element.content as string}
            </pre>
          </div>
        );
      case 'transformation':
        return (
          <div className="flex items-center justify-center space-x-4 p-3">
            <div className="text-lg font-mono bg-white p-2 rounded border">
              Input
            </div>
            <div className="text-2xl" style={{ color: theme.primary }}>→</div>
            <div className="text-lg font-mono bg-white p-2 rounded border">
              Output
            </div>
          </div>
        );
      case 'result':
        return (
          <div 
            className="p-3 rounded-lg text-white font-semibold text-center"
            style={{ backgroundColor: theme.primary }}
          >
            {element.content as string}
          </div>
        );
      case 'diagram':
        return (
          <div className="flex items-center justify-center p-4 bg-white rounded border">
            <div className="text-gray-500 text-sm">
              [Diagram: {element.content as string}]
            </div>
          </div>
        );
      default:
        return (
          <div className="p-3 text-sm text-gray-600">
            {element.content as string}
          </div>
        );
    }
  };

  return (
    <div className={`mt-3 ${element.styling?.highlight ? 'ring-2 ring-opacity-50' : ''}`}
         style={{ 
           ringColor: element.styling?.highlight ? theme.primary : 'transparent',
           fontSize: element.styling?.size === 'large' ? '1.1em' : 
                    element.styling?.size === 'small' ? '0.9em' : '1em'
         }}>
      {getElementContent()}
    </div>
  );
};

// Individual step component
const StepComponent: React.FC<StepComponentProps> = ({
  step,
  stepNumber,
  isActive,
  isCompleted,
  characterId,
  onStepClick
}) => {
  const theme = getCharacterTheme(characterId);
  
  const getStepIcon = () => {
    if (isCompleted) return '✅';
    if (isActive) return '🔄';
    return `${stepNumber}`;
  };

  const getStepBorderColor = () => {
    if (isCompleted) return theme.primary;
    if (isActive) return theme.accent;
    return '#E5E7EB';
  };

  const getStepBackgroundColor = () => {
    if (isCompleted) return `${theme.primary}10`;
    if (isActive) return `${theme.accent}10`;
    return '#FFFFFF';
  };

  return (
    <Card 
      className={`transition-all duration-300 ${onStepClick ? 'cursor-pointer hover:shadow-md' : ''}`}
      style={{ 
        borderColor: getStepBorderColor(),
        backgroundColor: getStepBackgroundColor(),
        borderWidth: '2px'
      }}
      onClick={() => onStepClick?.(step.id)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: isCompleted || isActive ? theme.primary : '#9CA3AF' }}
            >
              {getStepIcon()}
            </div>
            <CardTitle className="text-lg">{step.title}</CardTitle>
          </div>
          {step.dependencies && step.dependencies.length > 0 && (
            <Badge variant="outline" className="text-xs">
              Requires: {step.dependencies.join(', ')}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="text-gray-700">{step.description}</p>
        
        {step.formula && (
          <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
            <div className="font-semibold text-blue-800 text-sm mb-1">Formula:</div>
            <code className="text-sm font-mono text-blue-700">{step.formula}</code>
          </div>
        )}
        
        {step.example && (
          <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
            <div className="font-semibold text-green-800 text-sm mb-1">Example:</div>
            <div className="text-sm text-green-700">{step.example}</div>
          </div>
        )}
        
        {step.visualElement && (
          <VisualElement element={step.visualElement} characterId={characterId} />
        )}
        
        {step.characterInsight && (
          <CharacterInsight
            characterId={characterId}
            insight={step.characterInsight}
            type="tip"
          />
        )}
      </CardContent>
    </Card>
  );
};

// Flow connector component
interface FlowConnectorProps {
  direction: 'down' | 'right' | 'branch';
  characterId: string;
  label?: string;
}

const FlowConnector: React.FC<FlowConnectorProps> = ({ direction, characterId, label }) => {
  const theme = getCharacterTheme(characterId);
  
  const getConnectorElement = () => {
    switch (direction) {
      case 'down':
        return (
          <div className="flex flex-col items-center py-2">
            <div 
              className="w-0.5 h-8"
              style={{ backgroundColor: theme.primary }}
            />
            <div 
              className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent"
              style={{ borderTopColor: theme.primary }}
            />
          </div>
        );
      case 'right':
        return (
          <div className="flex items-center px-2">
            <div 
              className="h-0.5 w-8"
              style={{ backgroundColor: theme.primary }}
            />
            <div 
              className="w-0 h-0 border-t-4 border-b-4 border-l-8 border-transparent"
              style={{ borderLeftColor: theme.primary }}
            />
          </div>
        );
      case 'branch':
        return (
          <div className="flex items-center justify-center py-4">
            <div className="text-2xl" style={{ color: theme.primary }}>
              ⋮
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center">
        {getConnectorElement()}
        {label && (
          <span className="text-xs text-gray-500 mt-1">{label}</span>
        )}
      </div>
    </div>
  );
};

// Main process flow template
const ProcessFlowTemplate: React.FC<ProcessFlowTemplateProps> = ({
  config,
  characterConfig,
  interactive = false
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  
  const handleStepClick = (stepId: string) => {
    if (!interactive) return;
    
    const stepIndex = config.steps.findIndex(step => step.id === stepId);
    setActiveStepIndex(stepIndex);
    
    // Mark all previous steps as completed
    const newCompletedSteps = new Set<string>();
    for (let i = 0; i < stepIndex; i++) {
      newCompletedSteps.add(config.steps[i].id);
    }
    setCompletedSteps(newCompletedSteps);
  };

  const handleNextStep = () => {
    if (activeStepIndex < config.steps.length - 1) {
      const currentStep = config.steps[activeStepIndex];
      setCompletedSteps(prev => new Set([...prev, currentStep.id]));
      setActiveStepIndex(activeStepIndex + 1);
    }
  };

  const handlePreviousStep = () => {
    if (activeStepIndex > 0) {
      const prevStep = config.steps[activeStepIndex - 1];
      setCompletedSteps(prev => {
        const newSet = new Set(prev);
        newSet.delete(prevStep.id);
        return newSet;
      });
      setActiveStepIndex(activeStepIndex - 1);
    }
  };

  const renderSteps = () => {
    switch (config.visualFlow) {
      case 'horizontal':
        return (
          <div className="flex flex-wrap items-start gap-4">
            {config.steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex-1 min-w-64">
                  <StepComponent
                    step={step}
                    stepNumber={index + 1}
                    isActive={interactive ? index === activeStepIndex : false}
                    isCompleted={completedSteps.has(step.id)}
                    characterId={config.characterId}
                    onStepClick={interactive ? handleStepClick : undefined}
                  />
                </div>
                {index < config.steps.length - 1 && (
                  <div className="flex-shrink-0 self-center">
                    <FlowConnector direction="right" characterId={config.characterId} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        );
        
      case 'branching':
        // For branching, we'll show steps in groups
        return (
          <div className="space-y-6">
            {config.steps.map((step, index) => (
              <div key={step.id}>
                <StepComponent
                  step={step}
                  stepNumber={index + 1}
                  isActive={interactive ? index === activeStepIndex : false}
                  isCompleted={completedSteps.has(step.id)}
                  characterId={config.characterId}
                  onStepClick={interactive ? handleStepClick : undefined}
                />
                {index < config.steps.length - 1 && (
                  <FlowConnector 
                    direction={step.dependencies ? 'branch' : 'down'} 
                    characterId={config.characterId} 
                  />
                )}
              </div>
            ))}
          </div>
        );
        
      case 'cyclical':
        return (
          <div className="space-y-4">
            {config.steps.map((step, index) => (
              <div key={step.id}>
                <StepComponent
                  step={step}
                  stepNumber={index + 1}
                  isActive={interactive ? index === activeStepIndex : false}
                  isCompleted={completedSteps.has(step.id)}
                  characterId={config.characterId}
                  onStepClick={interactive ? handleStepClick : undefined}
                />
                {index < config.steps.length - 1 && (
                  <FlowConnector direction="down" characterId={config.characterId} />
                )}
                {index === config.steps.length - 1 && (
                  <FlowConnector 
                    direction="down" 
                    characterId={config.characterId} 
                    label="Return to Step 1"
                  />
                )}
              </div>
            ))}
          </div>
        );
        
      default: // vertical
        return (
          <div className="space-y-4">
            {config.steps.map((step, index) => (
              <div key={step.id}>
                <StepComponent
                  step={step}
                  stepNumber={index + 1}
                  isActive={interactive ? index === activeStepIndex : false}
                  isCompleted={completedSteps.has(step.id)}
                  characterId={config.characterId}
                  onStepClick={interactive ? handleStepClick : undefined}
                />
                {index < config.steps.length - 1 && (
                  <FlowConnector direction="down" characterId={config.characterId} />
                )}
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <BaseTemplate config={config} characterConfig={characterConfig}>
      {interactive && (
        <ProgressIndicator
          currentStep={activeStepIndex + 1}
          totalSteps={config.steps.length}
          characterId={config.characterId}
        />
      )}
      
      <SectionDivider title="Process Steps" characterId={config.characterId} />
      
      {renderSteps()}
      
      {interactive && (
        <div className="flex justify-between items-center mt-8 p-4 bg-white rounded-lg shadow">
          <Button
            variant="outline"
            onClick={handlePreviousStep}
            disabled={activeStepIndex === 0}
          >
            ← Previous Step
          </Button>
          
          <div className="text-sm text-gray-500">
            Step {activeStepIndex + 1} of {config.steps.length}
          </div>
          
          <Button
            onClick={handleNextStep}
            disabled={activeStepIndex === config.steps.length - 1}
            className="bg-gradient-to-r"
            style={{ 
              background: `linear-gradient(to right, ${getCharacterTheme(config.characterId).primary}, ${getCharacterTheme(config.characterId).accent})` 
            }}
          >
            Next Step →
          </Button>
        </div>
      )}
      
      {config.interactionHints && config.interactionHints.length > 0 && (
        <>
          <SectionDivider title="Interactive Exploration" characterId={config.characterId} />
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <h4 className="font-semibold text-blue-800 mb-2">Ready for Hands-On Practice?</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
                {config.interactionHints.map((hint, index) => (
                  <li key={index}>{hint}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </BaseTemplate>
  );
};

export default ProcessFlowTemplate;