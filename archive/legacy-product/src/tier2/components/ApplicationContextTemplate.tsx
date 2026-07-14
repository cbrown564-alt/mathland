import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Button } from '@/core/components/ui/button';
import { Badge } from '@/core/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/components/ui/tabs';
import { 
  ApplicationContextTemplate as ApplicationConfig, 
  ApplicationScenario, 
  ApplicationStep,
  CharacterIntegrationConfig 
} from '../types/templateTypes';
import BaseTemplate, { CharacterInsight, SectionDivider } from './BaseTemplate';
import { getCharacterTheme } from '../design/designSystem';

interface ApplicationContextTemplateProps {
  config: ApplicationConfig;
  characterConfig: CharacterIntegrationConfig;
  interactive?: boolean;
}

interface ScenarioCardProps {
  scenario: ApplicationScenario;
  characterId: string;
  isSelected?: boolean;
  onSelect?: (scenarioId: string) => void;
}

interface StepWalkthroughProps {
  steps: ApplicationStep[];
  characterId: string;
  interactive?: boolean;
}

// Individual scenario card
const ScenarioCard: React.FC<ScenarioCardProps> = ({
  scenario,
  characterId,
  isSelected = false,
  onSelect
}) => {
  const theme = getCharacterTheme(characterId);
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return '#10B981'; // green
      case 'intermediate':
        return '#F59E0B'; // amber
      case 'advanced':
        return '#EF4444'; // red
      default:
        return '#6B7280'; // gray
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return '🟢';
      case 'intermediate':
        return '🟡';
      case 'advanced':
        return '🔴';
      default:
        return '⚪';
    }
  };

  return (
    <Card 
      className={`transition-all duration-300 ${onSelect ? 'cursor-pointer hover:shadow-md' : ''} ${
        isSelected ? 'ring-2 ring-opacity-50' : ''
      }`}
      style={{ 
        borderColor: isSelected ? theme.primary : '#E5E7EB',
        ringColor: isSelected ? theme.primary : 'transparent',
        backgroundColor: isSelected ? `${theme.primary}08` : '#FFFFFF'
      }}
      onClick={() => onSelect?.(scenario.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl">{scenario.icon}</div>
            <CardTitle className="text-lg">{scenario.title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className="text-xs"
              style={{ 
                color: getDifficultyColor(scenario.difficulty),
                borderColor: getDifficultyColor(scenario.difficulty)
              }}
            >
              {getDifficultyIcon(scenario.difficulty)} {scenario.difficulty}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Problem Statement */}
        <div className="bg-red-50 p-3 rounded-lg border-l-4 border-red-400">
          <h4 className="font-semibold text-red-800 text-sm mb-1">Problem:</h4>
          <p className="text-sm text-red-700">{scenario.problemStatement}</p>
        </div>

        {/* Mathematical Concepts */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-gray-700">Key Mathematical Concepts:</h4>
          <div className="flex flex-wrap gap-1">
            {scenario.mathematicalConcepts.map((concept, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs"
                style={{ backgroundColor: `${theme.primary}20`, color: theme.primary }}
              >
                {concept}
              </Badge>
            ))}
          </div>
        </div>

        {/* Industry Context */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-semibold text-blue-800 text-sm mb-1">Industry Context:</h4>
          <p className="text-sm text-blue-700">{scenario.industryContext}</p>
        </div>

        {/* Real-world Impact */}
        <div className="bg-green-50 p-3 rounded-lg">
          <h4 className="font-semibold text-green-800 text-sm mb-1">Real-world Impact:</h4>
          <p className="text-sm text-green-700">{scenario.realWorldImpact}</p>
        </div>

        {/* Expected Outcome */}
        {scenario.expectedOutcome && (
          <div className="bg-purple-50 p-3 rounded-lg">
            <h4 className="font-semibold text-purple-800 text-sm mb-1">Expected Outcome:</h4>
            <p className="text-sm text-purple-700">{scenario.expectedOutcome}</p>
          </div>
        )}

        {/* Character Insight */}
        {scenario.characterInsight && (
          <CharacterInsight
            characterId={characterId}
            insight={scenario.characterInsight}
            type="tip"
          />
        )}
      </CardContent>
    </Card>
  );
};

// Step-by-step walkthrough component
const StepWalkthrough: React.FC<StepWalkthroughProps> = ({
  steps,
  characterId,
  interactive = false
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const theme = getCharacterTheme(characterId);

  const handleStepChange = (index: number) => {
    if (interactive) {
      setCurrentStepIndex(index);
    }
  };

  const getStepTypeColor = (type: string) => {
    switch (type) {
      case 'data-collection':
        return '#3B82F6'; // blue
      case 'analysis':
        return '#8B5CF6'; // purple
      case 'modeling':
        return '#10B981'; // green
      case 'validation':
        return '#F59E0B'; // amber
      case 'implementation':
        return '#EF4444'; // red
      default:
        return '#6B7280'; // gray
    }
  };

  const getStepTypeIcon = (type: string) => {
    switch (type) {
      case 'data-collection':
        return '📊';
      case 'analysis':
        return '🔍';
      case 'modeling':
        return '🧮';
      case 'validation':
        return '✅';
      case 'implementation':
        return '🚀';
      default:
        return '📋';
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Navigation */}
      {interactive && (
        <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
          {steps.map((step, index) => (
            <Button
              key={step.id}
              variant={index === currentStepIndex ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStepChange(index)}
              className="text-xs"
              style={{
                backgroundColor: index === currentStepIndex ? theme.primary : 'transparent',
                borderColor: theme.primary,
                color: index === currentStepIndex ? 'white' : theme.primary
              }}
            >
              {getStepTypeIcon(step.type)} Step {index + 1}
            </Button>
          ))}
        </div>
      )}

      {/* Step Content */}
      <div className="space-y-4">
        {interactive ? (
          // Interactive mode - show current step
          <StepCard 
            step={steps[currentStepIndex]} 
            stepNumber={currentStepIndex + 1}
            characterId={characterId}
            isActive={true}
          />
        ) : (
          // Static mode - show all steps
          steps.map((step, index) => (
            <StepCard 
              key={step.id}
              step={step} 
              stepNumber={index + 1}
              characterId={characterId}
              isActive={false}
            />
          ))
        )}
      </div>

      {/* Navigation Controls */}
      {interactive && (
        <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow">
          <Button
            variant="outline"
            onClick={() => handleStepChange(currentStepIndex - 1)}
            disabled={currentStepIndex === 0}
          >
            ← Previous
          </Button>
          
          <div className="text-sm text-gray-500">
            Step {currentStepIndex + 1} of {steps.length}
          </div>
          
          <Button
            onClick={() => handleStepChange(currentStepIndex + 1)}
            disabled={currentStepIndex === steps.length - 1}
            style={{ 
              backgroundColor: theme.primary,
              borderColor: theme.primary
            }}
          >
            Next →
          </Button>
        </div>
      )}
    </div>
  );
};

// Individual step card
interface StepCardProps {
  step: ApplicationStep;
  stepNumber: number;
  characterId: string;
  isActive: boolean;
}

const StepCard: React.FC<StepCardProps> = ({ step, stepNumber, characterId, isActive }) => {
  const theme = getCharacterTheme(characterId);
  
  const getStepTypeColor = (type: string) => {
    switch (type) {
      case 'data-collection':
        return '#3B82F6';
      case 'analysis':
        return '#8B5CF6';
      case 'modeling':
        return '#10B981';
      case 'validation':
        return '#F59E0B';
      case 'implementation':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStepTypeIcon = (type: string) => {
    switch (type) {
      case 'data-collection':
        return '📊';
      case 'analysis':
        return '🔍';
      case 'modeling':
        return '🧮';
      case 'validation':
        return '✅';
      case 'implementation':
        return '🚀';
      default:
        return '📋';
    }
  };

  return (
    <Card 
      className={`transition-all duration-300 ${isActive ? 'ring-2 ring-opacity-50' : ''}`}
      style={{ 
        borderColor: isActive ? theme.primary : '#E5E7EB',
        ringColor: isActive ? theme.primary : 'transparent',
        backgroundColor: isActive ? `${theme.primary}05` : '#FFFFFF'
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: getStepTypeColor(step.type) }}
            >
              {stepNumber}
            </div>
            <div>
              <CardTitle className="text-lg">{step.title}</CardTitle>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-sm">{getStepTypeIcon(step.type)}</span>
                <Badge 
                  variant="outline" 
                  className="text-xs"
                  style={{ 
                    color: getStepTypeColor(step.type),
                    borderColor: getStepTypeColor(step.type)
                  }}
                >
                  {step.type.replace('-', ' ')}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-700">{step.description}</p>
        
        {/* Mathematical Approach */}
        {step.mathematicalApproach && (
          <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
            <h4 className="font-semibold text-blue-800 text-sm mb-1">Mathematical Approach:</h4>
            <p className="text-sm text-blue-700">{step.mathematicalApproach}</p>
          </div>
        )}

        {/* Tools and Techniques */}
        {step.toolsAndTechniques && step.toolsAndTechniques.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-700">Tools & Techniques:</h4>
            <div className="flex flex-wrap gap-1">
              {step.toolsAndTechniques.map((tool, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs"
                  style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}
                >
                  {tool}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Example */}
        {step.example && (
          <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
            <h4 className="font-semibold text-green-800 text-sm mb-1">Example:</h4>
            <p className="text-sm text-green-700">{step.example}</p>
          </div>
        )}

        {/* Expected Output */}
        {step.expectedOutput && (
          <div className="bg-purple-50 p-3 rounded-lg border-l-4 border-purple-400">
            <h4 className="font-semibold text-purple-800 text-sm mb-1">Expected Output:</h4>
            <p className="text-sm text-purple-700">{step.expectedOutput}</p>
          </div>
        )}

        {/* Character Insight */}
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

// Main application context template
const ApplicationContextTemplate: React.FC<ApplicationContextTemplateProps> = ({
  config,
  characterConfig,
  interactive = false
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(
    config.scenarios.length > 0 ? config.scenarios[0].id : null
  );
  
  const handleScenarioSelect = (scenarioId: string) => {
    if (interactive) {
      setSelectedScenarioId(scenarioId);
    }
  };

  const selectedScenario = selectedScenarioId ? 
    config.scenarios.find(scenario => scenario.id === selectedScenarioId) : 
    null;

  return (
    <BaseTemplate config={config} characterConfig={characterConfig}>
      <SectionDivider title="Real-World Applications" characterId={config.characterId} />
      
      {/* Introduction */}
      <Card className="mb-6">
        <CardContent className="pt-4">
          <p className="text-gray-700 leading-relaxed">
            Mathematics isn't just abstract theory—it's a powerful tool that solves real-world problems. 
            Explore these scenarios to see how mathematical concepts apply in professional contexts.
          </p>
        </CardContent>
      </Card>

      {/* Scenario Selection */}
      <SectionDivider title="Choose Your Scenario" characterId={config.characterId} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {config.scenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            characterId={config.characterId}
            isSelected={selectedScenarioId === scenario.id}
            onSelect={interactive ? handleScenarioSelect : undefined}
          />
        ))}
      </div>

      {/* Selected Scenario Walkthrough */}
      {selectedScenario && (
        <>
          <SectionDivider 
            title={`Step-by-Step: ${selectedScenario.title}`} 
            characterId={config.characterId} 
          />
          
          <StepWalkthrough
            steps={selectedScenario.steps}
            characterId={config.characterId}
            interactive={interactive}
          />
        </>
      )}

      {/* Industry Connections */}
      {config.industryConnections && config.industryConnections.length > 0 && (
        <>
          <SectionDivider title="Industry Connections" characterId={config.characterId} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.industryConnections.map((connection, index) => (
              <Card key={index} className="bg-gray-50">
                <CardContent className="pt-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-xl">{connection.icon}</span>
                    {connection.industry}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">{connection.description}</p>
                  <ul className="list-disc list-inside text-xs text-gray-500 space-y-1">
                    {connection.examples.map((example, i) => (
                      <li key={i}>{example}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Character Summary */}
      {config.characterSummary && (
        <CharacterInsight
          characterId={config.characterId}
          insight={config.characterSummary}
          type="summary"
        />
      )}
    </BaseTemplate>
  );
};

export default ApplicationContextTemplate;