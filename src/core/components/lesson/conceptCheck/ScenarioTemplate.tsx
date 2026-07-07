import React, { useState } from 'react';
import { CharacterConfig, ChallengeConfig, ApproachConfig } from '@/core/types/conceptCheck';
import { characterConfigMap } from '@/utils/characterData';
import { SectionCompletion } from '../SectionCompletion';

interface ScenarioTemplateProps {
  character: CharacterConfig | string;
  challenge: ChallengeConfig;
  approaches: ApproachConfig[];
  onComplete: () => void;
  onNext: () => void;
  isCompleted: boolean;
  isLastSection: boolean;
}

export const ScenarioTemplate: React.FC<ScenarioTemplateProps> = ({
  character,
  challenge,
  approaches,
  onComplete,
  onNext,
  isCompleted,
  isLastSection,
}) => {
  const char: CharacterConfig = typeof character === 'string' ? characterConfigMap[character] : character;
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const handleSelect = (id: string) => {
    setSelected(id);
    const approach = approaches.find(a => a.id === id);
    if (approach) {
      setFeedback(approach.explanation);
      if (approach.correct) {
        setCompleted(true);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Scenario description */}
      <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 mb-2">
        <div className="font-semibold text-slate-800 mb-1">{challenge.type}</div>
        <div className="text-slate-700">{challenge.description}</div>
      </div>
      {/* Approaches */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="mb-3 text-slate-800 font-medium">Choose an approach:</div>
        <div className="flex flex-col gap-3">
          {approaches.map((a) => (
            <label
              key={a.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer
                ${selected === a.id
                  ? a.correct
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-400 bg-red-50'
                  : 'border-slate-200 hover:bg-slate-50'}
              `}
              tabIndex={0}
              aria-checked={selected === a.id}
              role="radio"
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleSelect(a.id)}
            >
              <input
                type="radio"
                name="approach"
                checked={selected === a.id}
                onChange={() => handleSelect(a.id)}
                className="mt-1 accent-blue-600"
                aria-label={a.title}
              />
              <div className="flex-1">
                <div className="font-semibold text-slate-800 flex items-center gap-2">
                  <span className="text-lg">{a.title}</span>
                  {selected === a.id && a.correct && <span className="text-green-500 text-xl">✔</span>}
                  {selected === a.id && !a.correct && <span className="text-red-400 text-xl">✗</span>}
                </div>
                <div className="text-slate-700 text-sm mb-1">{a.description}</div>
                {selected === a.id && (
                  <div className={`mt-1 text-sm ${a.correct ? 'text-green-700' : 'text-red-600'}`}>{a.explanation}</div>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>
      {/* Character success message */}
      {(isCompleted || completed) ? (
        <>
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 flex items-center gap-4 mt-4">
            <img src={char.avatar} alt={char.name} className="w-12 h-12 rounded-full" />
            <div>
              <div className="font-semibold text-green-700 mb-1">{char.name} {char.reactionVerb}!</div>
              <div className="text-green-800">Great choice! You picked the best approach.</div>
            </div>
          </div>
          <SectionCompletion
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            isLastSection={isLastSection}
          />
        </>
      ) : null}
    </div>
  );
}; 