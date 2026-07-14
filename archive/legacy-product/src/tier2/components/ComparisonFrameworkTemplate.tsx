import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Button } from '@/core/components/ui/button';
import { Badge } from '@/core/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/components/ui/tabs';
import { 
  ComparisonFrameworkTemplate as ComparisonConfig, 
  ComparisonItem, 
  ComparisonCriterion,
  CharacterIntegrationConfig 
} from '../types/templateTypes';
import BaseTemplate, { CharacterInsight, SectionDivider } from './BaseTemplate';
import { getCharacterTheme } from '../design/designSystem';

interface ComparisonFrameworkTemplateProps {
  config: ComparisonConfig;
  characterConfig: CharacterIntegrationConfig;
  interactive?: boolean;
}

interface ComparisonTableProps {
  items: ComparisonItem[];
  criteria: ComparisonCriterion[];
  characterId: string;
}

interface ComparisonCardProps {
  item: ComparisonItem;
  criteria: ComparisonCriterion[];
  characterId: string;
  isSelected?: boolean;
  onSelect?: (itemId: string) => void;
}

// Individual comparison item card
const ComparisonCard: React.FC<ComparisonCardProps> = ({
  item,
  criteria,
  characterId,
  isSelected = false,
  onSelect
}) => {
  const theme = getCharacterTheme(characterId);
  
  const getAdvantageColor = (advantage: string) => {
    switch (advantage.toLowerCase()) {
      case 'high':
      case 'excellent':
      case 'fast':
      case 'simple':
        return '#10B981'; // green
      case 'medium':
      case 'good':
      case 'moderate':
        return '#F59E0B'; // amber
      case 'low':
      case 'poor':
      case 'slow':
      case 'complex':
        return '#EF4444'; // red
      default:
        return '#6B7280'; // gray
    }
  };

  const getAdvantageIcon = (advantage: string) => {
    switch (advantage.toLowerCase()) {
      case 'high':
      case 'excellent':
      case 'fast':
      case 'simple':
        return '✅';
      case 'medium':
      case 'good':
      case 'moderate':
        return '⚡';
      case 'low':
      case 'poor':
      case 'slow':
      case 'complex':
        return '⚠️';
      default:
        return '📊';
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
      onClick={() => onSelect?.(item.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{item.name}</CardTitle>
          {item.recommendedFor && (
            <Badge 
              variant="outline" 
              className="text-xs"
              style={{ color: theme.primary, borderColor: theme.primary }}
            >
              Best for: {item.recommendedFor}
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Advantages */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-gray-700">Key Advantages:</h4>
          <div className="grid grid-cols-1 gap-2">
            {criteria.map((criterion) => {
              const advantage = item.advantages[criterion.id];
              if (!advantage) return null;
              
              return (
                <div key={criterion.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">{criterion.name}:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs">{getAdvantageIcon(advantage)}</span>
                    <span 
                      className="text-xs font-semibold px-2 py-1 rounded-full text-white"
                      style={{ backgroundColor: getAdvantageColor(advantage) }}
                    >
                      {advantage}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Use Cases */}
        {item.useCases && item.useCases.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-700">Best Used For:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              {item.useCases.map((useCase, index) => (
                <li key={index}>{useCase}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Limitations */}
        {item.limitations && item.limitations.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-700">Limitations:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
              {item.limitations.map((limitation, index) => (
                <li key={index}>{limitation}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Character Insight */}
        {item.characterInsight && (
          <CharacterInsight
            characterId={characterId}
            insight={item.characterInsight}
            type="tip"
          />
        )}
      </CardContent>
    </Card>
  );
};

// Comparison table view
const ComparisonTable: React.FC<ComparisonTableProps> = ({
  items,
  criteria,
  characterId
}) => {
  const theme = getCharacterTheme(characterId);
  
  const getAdvantageColor = (advantage: string) => {
    switch (advantage.toLowerCase()) {
      case 'high':
      case 'excellent':
      case 'fast':
      case 'simple':
        return '#10B981';
      case 'medium':
      case 'good':
      case 'moderate':
        return '#F59E0B';
      case 'low':
      case 'poor':
      case 'slow':
      case 'complex':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr style={{ backgroundColor: `${theme.primary}20` }}>
            <th className="border border-gray-300 p-3 text-left font-semibold">
              Method
            </th>
            {criteria.map((criterion) => (
              <th key={criterion.id} className="border border-gray-300 p-3 text-center font-semibold">
                {criterion.name}
              </th>
            ))}
            <th className="border border-gray-300 p-3 text-center font-semibold">
              Best For
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="border border-gray-300 p-3 font-medium">
                <div>
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                </div>
              </td>
              {criteria.map((criterion) => {
                const advantage = item.advantages[criterion.id];
                return (
                  <td key={criterion.id} className="border border-gray-300 p-3 text-center">
                    {advantage && (
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: getAdvantageColor(advantage) }}
                      >
                        {advantage}
                      </span>
                    )}
                  </td>
                );
              })}
              <td className="border border-gray-300 p-3 text-sm">
                {item.recommendedFor || 'General use'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Main comparison framework template
const ComparisonFrameworkTemplate: React.FC<ComparisonFrameworkTemplateProps> = ({
  config,
  characterConfig,
  interactive = false
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  
  const handleItemSelect = (itemId: string) => {
    if (!interactive) return;
    setSelectedItemId(selectedItemId === itemId ? null : itemId);
  };

  const selectedItem = selectedItemId ? config.items.find(item => item.id === selectedItemId) : null;

  const renderViewModeToggle = () => {
    if (!interactive) return null;
    
    return (
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 p-1 rounded-lg">
          <Button
            variant={viewMode === 'cards' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('cards')}
            className="mr-1"
          >
            📋 Cards
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            📊 Table
          </Button>
        </div>
      </div>
    );
  };

  const renderComparisonContent = () => {
    if (viewMode === 'table') {
      return (
        <ComparisonTable
          items={config.items}
          criteria={config.criteria}
          characterId={config.characterId}
        />
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {config.items.map((item) => (
          <ComparisonCard
            key={item.id}
            item={item}
            criteria={config.criteria}
            characterId={config.characterId}
            isSelected={selectedItemId === item.id}
            onSelect={interactive ? handleItemSelect : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <BaseTemplate config={config} characterConfig={characterConfig}>
      <SectionDivider title="Comparison Overview" characterId={config.characterId} />
      
      {/* Introduction */}
      <Card className="mb-6">
        <CardContent className="pt-4">
          <p className="text-gray-700 leading-relaxed">
            This comparison framework helps you understand the strengths and weaknesses of different approaches, 
            so you can choose the right method for your specific situation.
          </p>
        </CardContent>
      </Card>

      {/* Criteria Legend */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Comparison Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.criteria.map((criterion) => (
              <div key={criterion.id} className="flex items-start gap-3">
                <div className="text-xl">{criterion.icon}</div>
                <div>
                  <h4 className="font-semibold text-sm">{criterion.name}</h4>
                  <p className="text-sm text-gray-600">{criterion.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {renderViewModeToggle()}

      <SectionDivider title="Method Comparison" characterId={config.characterId} />
      
      {renderComparisonContent()}

      {/* Selected Item Detail */}
      {selectedItem && interactive && (
        <>
          <SectionDivider title={`Deep Dive: ${selectedItem.name}`} characterId={config.characterId} />
          <Card className="border-2" style={{ borderColor: getCharacterTheme(config.characterId).primary }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>{selectedItem.name}</span>
                <Badge variant="outline">Selected</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">{selectedItem.description}</p>
              
              {selectedItem.detailedAnalysis && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Detailed Analysis</h4>
                  <p className="text-sm text-blue-700">{selectedItem.detailedAnalysis}</p>
                </div>
              )}
              
              {selectedItem.examples && selectedItem.examples.length > 0 && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Examples</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-green-700">
                    {selectedItem.examples.map((example, index) => (
                      <li key={index}>{example}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Decision Guide */}
      {config.decisionGuide && (
        <>
          <SectionDivider title="Decision Guide" characterId={config.characterId} />
          <Card className="bg-purple-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-800">Which Method Should You Choose?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {config.decisionGuide.map((guide, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="text-purple-600 font-bold text-sm mt-1">→</div>
                    <div>
                      <span className="font-semibold text-purple-800">{guide.condition}:</span>
                      <span className="text-purple-700 ml-2">{guide.recommendation}</span>
                    </div>
                  </div>
                ))}
              </div>
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

export default ComparisonFrameworkTemplate;