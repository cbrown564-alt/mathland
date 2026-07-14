import React, { useState } from 'react';
import { CharacterConfig, ScenarioConfig, StepConfig, VisualConfig } from '@/core/types/conceptCheck';
import { characterConfigMap } from '@/utils/characterData';
import { SectionCompletion } from '../SectionCompletion';

interface MultiStepTemplateProps {
  character: CharacterConfig | string; // allow passing id for convenience
  scenario: ScenarioConfig;
  steps: StepConfig[];
  visual: VisualConfig;
  onComplete: () => void;
  isCompleted: boolean;
  onNext?: () => void; // <-- add optional onNext
  isLastSection?: boolean;
}

export const MultiStepTemplate: React.FC<MultiStepTemplateProps> = ({
  character,
  scenario,
  steps,
  visual,
  onComplete,
  isCompleted,
  onNext,
  isLastSection,
}) => {
  // Support passing characterId as string
  const char: CharacterConfig = typeof character === 'string' ? characterConfigMap[character] : character;
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(steps.length).fill(''));
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState<number[]>(Array(steps.length).fill(0));
  const [showHint, setShowHint] = useState<boolean[]>(Array(steps.length).fill(false));

  const handleInput = (value: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentStep] = value;
      return next;
    });
    setError(null);
    setFeedback(null);
  };

  const handleNext = () => {
    const step = steps[currentStep];
    let valid = true;
    let validationMsg = '';
    if (step.validation) {
      const result = step.validation(answers[currentStep]);
      if (typeof result === 'string') {
        valid = false;
        validationMsg = result;
      } else if (!result) {
        valid = false;
      }
    }
    if (!valid || answers[currentStep] !== step.correctAnswer) {
      // Increment failed attempts
      setFailedAttempts(prev => {
        const next = [...prev];
        next[currentStep] = (next[currentStep] || 0) + 1;
        return next;
      });
      // Show hint automatically after 2 failed attempts
      if (step.hint && failedAttempts[currentStep] + 1 >= 2) {
        setShowHint(prev => {
          const next = [...prev];
          next[currentStep] = true;
          return next;
        });
      }
      setError(validationMsg || 'Not quite! Try again.' + (step.hint ? " Need help? Click 'Show Hint'." : ''));
      setFeedback(null);
      return;
    }
    setFeedback(step.feedback);
    setTimeout(() => {
      setFeedback(null);
      if (currentStep < steps.length - 1) {
        setCurrentStep((s) => s + 1);
      } else {
        onComplete();
      }
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Scenario description */}
      <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 mb-2">
        <p className="text-slate-700">{scenario.description}</p>
      </div>
      {/* Visual area */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-700 mb-2">{visual.title}</h4>
        <div className="rounded bg-white border border-slate-100 p-4 min-h-[80px] flex items-center justify-center">
          {typeof visual.component === 'function' ? visual.component(Object.fromEntries(answers.map((a, i) => ["step" + i, a]))) : visual.component}
        </div>
      </div>
      {/* Step-by-step input */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="mb-2 text-slate-800 font-medium">Step {currentStep + 1} of {steps.length}</div>
        <div className="mb-2 text-slate-700">{steps[currentStep].question}</div>
        <input
          type={steps[currentStep].inputType === 'number' ? 'number' : 'text'}
          placeholder={steps[currentStep].placeholder}
          value={answers[currentStep]}
          onChange={e => handleInput(e.target.value)}
          className={`w-full px-3 py-2 border rounded text-base mb-2 transition-all duration-150 ${error ? 'border-red-500 animate-shake' : 'border-slate-300'}`}
          aria-label={steps[currentStep].question}
        />
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        {feedback && <div className="text-green-600 text-sm mb-2">{feedback}</div>}
        {(showHint[currentStep] && steps[currentStep].hint) && (
          <div className="text-blue-700 text-sm mb-2 bg-blue-50 rounded p-2">Hint: {steps[currentStep].hint}</div>
        )}
        <div className="flex gap-2 mt-2">
          {steps[currentStep].hint && !showHint[currentStep] && (
            <button
              className="text-xs text-blue-600 underline"
              onClick={() => setShowHint(prev => { const next = [...prev]; next[currentStep] = true; return next; })}
              type="button"
            >
              Show Hint
            </button>
          )}
          <button
            className="ml-auto px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            onClick={handleNext}
            type="button"
            aria-label="Next Step"
          >
            {currentStep < steps.length - 1 ? 'Next' : 'Finish'}
          </button>
        </div>
      </div>
      {/* Character success message and completion button */}
      {isCompleted && (
        <>
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 flex items-center gap-4 mt-4">
            <img src={char.avatar} alt={char.name} className="w-12 h-12 rounded-full" />
            <div>
              <div className="font-semibold text-green-700 mb-1">{char.name} {char.reactionVerb}!</div>
              <div className="text-green-800">{scenario.successMessage}</div>
            </div>
          </div>
          <SectionCompletion
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            isLastSection={isLastSection ?? false}
          />
        </>
      )}
    </div>
  );
}; 