import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Button } from '@/core/components/ui/button';
import { Badge } from '@/core/components/ui/badge';
import { Slider } from '@/core/components/ui/slider';
import { 
  MathematicalDiagramTemplate as DiagramConfig, 
  DiagramElement, 
  DiagramInteraction,
  CharacterIntegrationConfig 
} from '../types/templateTypes';
import BaseTemplate, { CharacterInsight, SectionDivider } from './BaseTemplate';
import { getCharacterTheme } from '../design/designSystem';

interface MathematicalDiagramTemplateProps {
  config: DiagramConfig;
  characterConfig: CharacterIntegrationConfig;
  interactive?: boolean;
}

interface DiagramSVGProps {
  elements: DiagramElement[];
  width: number;
  height: number;
  characterId: string;
  interactionValues?: Record<string, number>;
  onElementClick?: (elementId: string) => void;
}

interface InteractionControlsProps {
  interactions: DiagramInteraction[];
  values: Record<string, number>;
  onValueChange: (interactionId: string, value: number) => void;
  characterId: string;
}

// SVG diagram renderer
const DiagramSVG: React.FC<DiagramSVGProps> = ({
  elements,
  width,
  height,
  characterId,
  interactionValues = {},
  onElementClick
}) => {
  const theme = getCharacterTheme(characterId);
  
  const applyInteractionValues = (element: DiagramElement) => {
    const updatedElement = { ...element };
    
    if (element.interactionEffects) {
      element.interactionEffects.forEach(effect => {
        const value = interactionValues[effect.interactionId] || 0;
        
        switch (effect.property) {
          case 'x':
            updatedElement.x = (updatedElement.x || 0) + (value * (effect.multiplier || 1));
            break;
          case 'y':
            updatedElement.y = (updatedElement.y || 0) + (value * (effect.multiplier || 1));
            break;
          case 'width':
            updatedElement.width = (updatedElement.width || 0) + (value * (effect.multiplier || 1));
            break;
          case 'height':
            updatedElement.height = (updatedElement.height || 0) + (value * (effect.multiplier || 1));
            break;
          case 'rotation':
            updatedElement.rotation = (updatedElement.rotation || 0) + (value * (effect.multiplier || 1));
            break;
          case 'opacity':
            updatedElement.opacity = Math.max(0, Math.min(1, (updatedElement.opacity || 1) + (value * (effect.multiplier || 1))));
            break;
        }
      });
    }
    
    return updatedElement;
  };

  const renderElement = (element: DiagramElement) => {
    const updatedElement = applyInteractionValues(element);
    const elementId = `element-${element.id}`;
    
    const commonProps = {
      id: elementId,
      key: element.id,
      transform: updatedElement.rotation ? `rotate(${updatedElement.rotation} ${updatedElement.x || 0} ${updatedElement.y || 0})` : undefined,
      opacity: updatedElement.opacity || 1,
      style: { cursor: onElementClick ? 'pointer' : 'default' },
      onClick: () => onElementClick?.(element.id)
    };

    switch (element.type) {
      case 'line':
        return (
          <line
            {...commonProps}
            x1={updatedElement.x || 0}
            y1={updatedElement.y || 0}
            x2={updatedElement.x2 || 0}
            y2={updatedElement.y2 || 0}
            stroke={updatedElement.color || theme.primary}
            strokeWidth={updatedElement.strokeWidth || 2}
            strokeDasharray={updatedElement.dashed ? '5,5' : undefined}
          />
        );
        
      case 'circle':
        return (
          <circle
            {...commonProps}
            cx={updatedElement.x || 0}
            cy={updatedElement.y || 0}
            r={updatedElement.radius || 5}
            fill={updatedElement.filled ? (updatedElement.color || theme.primary) : 'none'}
            stroke={updatedElement.color || theme.primary}
            strokeWidth={updatedElement.strokeWidth || 2}
          />
        );
        
      case 'rectangle':
        return (
          <rect
            {...commonProps}
            x={updatedElement.x || 0}
            y={updatedElement.y || 0}
            width={updatedElement.width || 50}
            height={updatedElement.height || 50}
            fill={updatedElement.filled ? (updatedElement.color || theme.primary) : 'none'}
            stroke={updatedElement.color || theme.primary}
            strokeWidth={updatedElement.strokeWidth || 2}
            rx={updatedElement.rounded ? 5 : 0}
          />
        );
        
      case 'text':
        return (
          <text
            {...commonProps}
            x={updatedElement.x || 0}
            y={updatedElement.y || 0}
            fill={updatedElement.color || '#374151'}
            fontSize={updatedElement.fontSize || 14}
            fontWeight={updatedElement.bold ? 'bold' : 'normal'}
            textAnchor={updatedElement.textAlign || 'start'}
            dominantBaseline="middle"
          >
            {updatedElement.text || ''}
          </text>
        );
        
      case 'path':
        return (
          <path
            {...commonProps}
            d={updatedElement.pathData || ''}
            fill={updatedElement.filled ? (updatedElement.color || theme.primary) : 'none'}
            stroke={updatedElement.color || theme.primary}
            strokeWidth={updatedElement.strokeWidth || 2}
          />
        );
        
      case 'arrow': {
        const arrowLength = Math.sqrt(
          Math.pow((updatedElement.x2 || 0) - (updatedElement.x || 0), 2) +
          Math.pow((updatedElement.y2 || 0) - (updatedElement.y || 0), 2)
        );
        const angle = Math.atan2(
          (updatedElement.y2 || 0) - (updatedElement.y || 0),
          (updatedElement.x2 || 0) - (updatedElement.x || 0)
        );
        
        return (
          <g {...commonProps}>
            <line
              x1={updatedElement.x || 0}
              y1={updatedElement.y || 0}
              x2={updatedElement.x2 || 0}
              y2={updatedElement.y2 || 0}
              stroke={updatedElement.color || theme.primary}
              strokeWidth={updatedElement.strokeWidth || 2}
            />
            <polygon
              points={`${updatedElement.x2 || 0},${updatedElement.y2 || 0} ${
                (updatedElement.x2 || 0) - 10 * Math.cos(angle - Math.PI / 6)
              },${
                (updatedElement.y2 || 0) - 10 * Math.sin(angle - Math.PI / 6)
              } ${
                (updatedElement.x2 || 0) - 10 * Math.cos(angle + Math.PI / 6)
              },${
                (updatedElement.y2 || 0) - 10 * Math.sin(angle + Math.PI / 6)
              }`}
              fill={updatedElement.color || theme.primary}
            />
          </g>
        );
      }
      
      default:
        return null;
    }
  };

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`}
      className="border rounded-lg bg-white"
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      {/* Grid background (optional) */}
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      
      {/* Render elements */}
      {elements.map(renderElement)}
    </svg>
  );
};

// Interactive controls for diagram
const InteractionControls: React.FC<InteractionControlsProps> = ({
  interactions,
  values,
  onValueChange,
  characterId
}) => {
  const theme = getCharacterTheme(characterId);
  
  return (
    <div className="space-y-4">
      {interactions.map((interaction) => (
        <Card key={interaction.id} className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                {interaction.label}
              </label>
              <Badge variant="outline" className="text-xs">
                {values[interaction.id] || interaction.defaultValue}
              </Badge>
            </div>
            
            <Slider
              value={[values[interaction.id] || interaction.defaultValue]}
              onValueChange={(value) => onValueChange(interaction.id, value[0])}
              min={interaction.min}
              max={interaction.max}
              step={interaction.step || 1}
              className="w-full"
            />
            
            <p className="text-xs text-gray-500">{interaction.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

// Main mathematical diagram template
const MathematicalDiagramTemplate: React.FC<MathematicalDiagramTemplateProps> = ({
  config,
  characterConfig,
  interactive = false
}) => {
  const [interactionValues, setInteractionValues] = useState<Record<string, number>>(() => {
    const initialValues: Record<string, number> = {};
    config.interactions?.forEach(interaction => {
      initialValues[interaction.id] = interaction.defaultValue;
    });
    return initialValues;
  });
  
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  
  const handleValueChange = (interactionId: string, value: number) => {
    setInteractionValues(prev => ({
      ...prev,
      [interactionId]: value
    }));
  };
  
  const handleElementClick = (elementId: string) => {
    if (interactive) {
      setSelectedElementId(selectedElementId === elementId ? null : elementId);
    }
  };
  
  const handleReset = () => {
    const resetValues: Record<string, number> = {};
    config.interactions?.forEach(interaction => {
      resetValues[interaction.id] = interaction.defaultValue;
    });
    setInteractionValues(resetValues);
    setSelectedElementId(null);
  };
  
  const selectedElement = selectedElementId ? 
    config.elements.find(element => element.id === selectedElementId) : 
    null;

  return (
    <BaseTemplate config={config} characterConfig={characterConfig}>
      <SectionDivider title="Mathematical Diagram" characterId={config.characterId} />
      
      {/* Diagram Description */}
      <Card className="mb-6">
        <CardContent className="pt-4">
          <p className="text-gray-700 leading-relaxed">
            {config.description}
          </p>
        </CardContent>
      </Card>

      {/* Main Diagram */}
      <div className="mb-6">
        <DiagramSVG
          elements={config.elements}
          width={config.width}
          height={config.height}
          characterId={config.characterId}
          interactionValues={interactive ? interactionValues : undefined}
          onElementClick={interactive ? handleElementClick : undefined}
        />
      </div>

      {/* Interactive Controls */}
      {interactive && config.interactions && config.interactions.length > 0 && (
        <>
          <SectionDivider title="Interactive Controls" characterId={config.characterId} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <InteractionControls
                interactions={config.interactions}
                values={interactionValues}
                onValueChange={handleValueChange}
                characterId={config.characterId}
              />
            </div>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>Adjust the sliders to see how parameters affect the diagram</li>
                    <li>Click on diagram elements to see detailed information</li>
                    <li>Use the reset button to return to default values</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Button 
                onClick={handleReset} 
                variant="outline" 
                className="w-full"
              >
                🔄 Reset to Default
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Selected Element Details */}
      {selectedElement && interactive && (
        <>
          <SectionDivider title={`Element Details`} characterId={config.characterId} />
          <Card className="border-2" style={{ borderColor: getCharacterTheme(config.characterId).primary }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>Element: {selectedElement.label || selectedElement.id}</span>
                <Badge variant="outline">Selected</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Type:</span>
                  <span className="ml-2 text-gray-600">{selectedElement.type}</span>
                </div>
                <div>
                  <span className="font-medium">Position:</span>
                  <span className="ml-2 text-gray-600">({selectedElement.x || 0}, {selectedElement.y || 0})</span>
                </div>
                {selectedElement.width && (
                  <div>
                    <span className="font-medium">Width:</span>
                    <span className="ml-2 text-gray-600">{selectedElement.width}</span>
                  </div>
                )}
                {selectedElement.height && (
                  <div>
                    <span className="font-medium">Height:</span>
                    <span className="ml-2 text-gray-600">{selectedElement.height}</span>
                  </div>
                )}
              </div>
              
              {selectedElement.description && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-700">{selectedElement.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Mathematical Concepts */}
      {config.mathematicalConcepts && config.mathematicalConcepts.length > 0 && (
        <>
          <SectionDivider title="Mathematical Concepts" characterId={config.characterId} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.mathematicalConcepts.map((concept, index) => (
              <Card key={index} className="bg-gray-50">
                <CardContent className="pt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">{concept.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{concept.description}</p>
                  {concept.formula && (
                    <div className="bg-white p-2 rounded border font-mono text-sm">
                      {concept.formula}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Learning Objectives */}
      {config.learningObjectives && config.learningObjectives.length > 0 && (
        <>
          <SectionDivider title="Learning Objectives" characterId={config.characterId} />
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-4">
              <h4 className="font-semibold text-green-800 mb-3">After exploring this diagram, you should be able to:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-green-700">
                {config.learningObjectives.map((objective, index) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
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

export default MathematicalDiagramTemplate;