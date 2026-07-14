import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Badge } from '@/core/components/ui/badge';
import { Tier2Component, CharacterIntegrationConfig } from '../types/templateTypes';
import { getCharacterTheme, generateTemplateClasses } from '../design/designSystem';

interface BaseTemplateProps {
  config: Tier2Component;
  characterConfig: CharacterIntegrationConfig;
  children: React.ReactNode;
  className?: string;
}

interface TemplateHeaderProps {
  title: string;
  description: string;
  characterId: string;
  templateType: string;
  targetAudience: 'beginner' | 'intermediate' | 'advanced';
  educationalObjectives: string[];
}

interface CharacterAvatarProps {
  characterId: string;
  position: 'corner' | 'inline' | 'floating';
  size: 'small' | 'medium' | 'large';
  voice?: {
    introNarrative?: string;
    explanationStyle: string;
  };
}

// Character avatar component
const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  characterId,
  position,
  size,
  voice
}) => {
  const theme = getCharacterTheme(characterId);
  
  const sizeClasses = {
    small: 'w-8 h-8 text-sm',
    medium: 'w-12 h-12 text-base',
    large: 'w-16 h-16 text-lg'
  };
  
  const positionClasses = {
    corner: 'absolute top-4 right-4',
    inline: 'inline-flex mr-2',
    floating: 'fixed bottom-4 right-4 z-50'
  };

  // Get character icon and name from existing character data
  const characterInfo = {
    ollie: { icon: '🔧', name: 'Ollie' },
    vera: { icon: '🧭', name: 'Vera' },
    max: { icon: '📊', name: 'Max' },
    eileen: { icon: '🔍', name: 'Eileen' },
    delta: { icon: '📈', name: 'Delta' },
    greta: { icon: '⛰️', name: 'Greta' },
    pippa: { icon: '🪄', name: 'Pippa' },
    sigmund: { icon: '👁️', name: 'Sigmund' },
    bayes: { icon: '🧪', name: 'Bayes' },
    sage: { icon: '🧠', name: 'Sage' }
  };

  const character = characterInfo[characterId as keyof typeof characterInfo] || characterInfo.sage;

  return (
    <div className={`${positionClasses[position]} ${sizeClasses[size]} flex items-center gap-2`}>
      <div 
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-semibold shadow-md`}
        style={{ backgroundColor: theme.primary }}
      >
        <span className="text-xs">{character.icon}</span>
      </div>
      {(position === 'inline' || position === 'floating') && (
        <span className="text-sm font-medium text-gray-700">
          {character.name}
        </span>
      )}
    </div>
  );
};

// Template header component
const TemplateHeader: React.FC<TemplateHeaderProps> = ({
  title,
  description,
  characterId,
  templateType,
  targetAudience,
  educationalObjectives
}) => {
  const theme = getCharacterTheme(characterId);
  
  const audienceColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };

  const templateTypeLabels = {
    process: 'Step-by-Step Process',
    comparison: 'Comparison Framework',
    application: 'Real-World Application',
    diagram: 'Mathematical Diagram'
  };

  return (
    <div className="relative mb-6">
      <CardHeader className={`bg-gradient-to-r ${theme.gradient} text-white rounded-lg`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CharacterAvatar 
                characterId={characterId} 
                position="inline" 
                size="medium" 
              />
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {templateTypeLabels[templateType as keyof typeof templateTypeLabels]}
              </Badge>
              <Badge variant="secondary" className={audienceColors[targetAudience]}>
                {targetAudience.charAt(0).toUpperCase() + targetAudience.slice(1)}
              </Badge>
            </div>
            <CardTitle className="text-2xl font-bold mb-2">
              {title}
            </CardTitle>
            <p className="text-white/90 text-lg">
              {description}
            </p>
          </div>
        </div>
      </CardHeader>
      
      {educationalObjectives.length > 0 && (
        <Card className="mt-4 border-l-4" style={{ borderLeftColor: theme.primary }}>
          <CardContent className="pt-4">
            <h4 className="font-semibold text-gray-800 mb-2">Learning Objectives:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              {educationalObjectives.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Character insight box component
interface CharacterInsightProps {
  characterId: string;
  insight: string;
  type?: 'tip' | 'warning' | 'insight' | 'example';
  className?: string;
}

export const CharacterInsight: React.FC<CharacterInsightProps> = ({
  characterId,
  insight,
  type = 'insight',
  className = ''
}) => {
  const theme = getCharacterTheme(characterId);
  
  const typeStyles = {
    tip: 'bg-blue-50 border-blue-200',
    warning: 'bg-yellow-50 border-yellow-200',
    insight: 'bg-purple-50 border-purple-200',
    example: 'bg-green-50 border-green-200'
  };

  const typeIcons = {
    tip: '💡',
    warning: '⚠️',
    insight: '🔍',
    example: '📝'
  };

  return (
    <div className={`p-4 border-l-4 rounded-r-lg ${typeStyles[type]} ${className}`} 
         style={{ borderLeftColor: theme.primary }}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <CharacterAvatar characterId={characterId} position="inline" size="small" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">{typeIcons[type]}</span>
            <span className="text-sm font-medium text-gray-700 capitalize">
              {characterId}'s {type}
            </span>
          </div>
          <p className="text-sm text-gray-700">{insight}</p>
        </div>
      </div>
    </div>
  );
};

// Progress indicator component
interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  characterId: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  characterId
}) => {
  const theme = getCharacterTheme(characterId);
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
      <div 
        className="h-2 rounded-full transition-all duration-300"
        style={{ 
          width: `${progress}%`,
          backgroundColor: theme.primary 
        }}
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{Math.round(progress)}% Complete</span>
      </div>
    </div>
  );
};

// Section divider component
interface SectionDividerProps {
  title?: string;
  characterId: string;
  className?: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  title,
  characterId,
  className = ''
}) => {
  const theme = getCharacterTheme(characterId);

  return (
    <div className={`relative my-8 ${className}`}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300" />
      </div>
      {title && (
        <div className="relative flex justify-center text-sm">
          <span 
            className="px-4 py-1 rounded-full text-white font-medium"
            style={{ backgroundColor: theme.primary }}
          >
            {title}
          </span>
        </div>
      )}
    </div>
  );
};

// Main base template component
const BaseTemplate: React.FC<BaseTemplateProps> = ({
  config,
  characterConfig,
  children,
  className = ''
}) => {
  const classes = generateTemplateClasses(config.characterId, config.templateType);

  return (
    <div className={`${classes.container} ${classes.background} min-h-screen p-4 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <TemplateHeader
          title={config.title}
          description={config.description}
          characterId={config.characterId}
          templateType={config.templateType}
          targetAudience={config.targetAudience}
          educationalObjectives={config.educationalObjectives}
        />
        
        <div className="space-y-6">
          {children}
        </div>
        
        {/* Character voice integration */}
        {characterConfig.voice.introNarrative && (
          <CharacterInsight
            characterId={config.characterId}
            insight={characterConfig.voice.introNarrative}
            type="insight"
            className="mt-8"
          />
        )}
      </div>
    </div>
  );
};

export default BaseTemplate;

// Export types for use in other components
export type {
  BaseTemplateProps,
  CharacterInsightProps,
  ProgressIndicatorProps,
  SectionDividerProps
};