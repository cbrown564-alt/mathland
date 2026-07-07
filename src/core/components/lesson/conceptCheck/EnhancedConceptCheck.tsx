import React from 'react';
import { MultiStepTemplate } from './MultiStepTemplate';
import { ScenarioTemplate } from './ScenarioTemplate';
import { characterConfigMap } from '@/utils/characterData';
import { CharacterConfig, ScenarioConfig, StepConfig, VisualConfig, ChallengeConfig, ApproachConfig } from '@/core/types/conceptCheck';

interface EnhancedConceptCheckProps {
  conceptCheck: {
    type: 'multi-step' | 'scenario' | 'basic';
    characterId: string;
    // Multi-step specific
    scenario?: ScenarioConfig;
    steps?: StepConfig[];
    visual?: VisualConfig;
    // Scenario specific
    challenge?: ChallengeConfig;
    approaches?: ApproachConfig[];
    // Basic fallback
    question?: string;
    options?: string[];
    correctAnswer?: number;
    explanation?: string;
  };
  onComplete: () => void;
  isCompleted: boolean;
  onNext?: () => void;
  isLastSection?: boolean;
}

export const EnhancedConceptCheck: React.FC<EnhancedConceptCheckProps> = ({ conceptCheck, onComplete, isCompleted, onNext, isLastSection }) => {
  const character = characterConfigMap[conceptCheck.characterId];

  if (conceptCheck.type === 'multi-step' && conceptCheck.scenario && conceptCheck.steps && conceptCheck.visual) {
    return (
      <MultiStepTemplate
        character={character}
        scenario={conceptCheck.scenario}
        steps={conceptCheck.steps}
        visual={conceptCheck.visual}
        onComplete={onComplete}
        isCompleted={isCompleted}
        onNext={onNext}
        isLastSection={isLastSection}
      />
    );
  }

  if (conceptCheck.type === 'scenario' && conceptCheck.challenge && conceptCheck.approaches) {
    return (
      <ScenarioTemplate
        character={character}
        challenge={conceptCheck.challenge}
        approaches={conceptCheck.approaches}
        onComplete={onComplete}
        onNext={onNext}
        isCompleted={isCompleted}
        isLastSection={isLastSection}
      />
    );
  }

  // Fallback: basic MCQ
  if (conceptCheck.type === 'basic' && conceptCheck.question && conceptCheck.options && typeof conceptCheck.correctAnswer === 'number') {
    return (
      <div className="space-y-6">
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 mb-2">
          <p className="text-slate-700">{conceptCheck.question}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          {conceptCheck.options.map((opt, i) => (
            <div key={i} className="mb-2">
              <input type="radio" id={`opt${i}`} name="basic-mcq" />
              <label htmlFor={`opt${i}`} className="ml-2">{opt}</label>
            </div>
          ))}
        </div>
        {conceptCheck.explanation && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 mt-4">
            <div className="text-blue-800">{conceptCheck.explanation}</div>
          </div>
        )}
      </div>
    );
  }

  // If config is missing or invalid
  return <div className="text-red-600">Concept check configuration is invalid or incomplete.</div>;
}; 