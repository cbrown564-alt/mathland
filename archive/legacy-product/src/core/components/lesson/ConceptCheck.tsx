import { useState } from "react";
import { CheckCircle, X, AlertCircle } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { CharacterAvatar } from "@/core/components/CharacterAvatar";
import { SectionCompletion } from "./SectionCompletion";

interface ConceptCheckProps {
  conceptCheck: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
  character: {
    name: string;
    personality: string;
    color: string;
    avatar: string;
  };
  onComplete: () => void;
  onNext: () => void;
  isCompleted: boolean;
  isLastSection: boolean;
}

export const ConceptCheck = ({ conceptCheck, character, onComplete, onNext, isCompleted, isLastSection }: ConceptCheckProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === conceptCheck.correctAnswer) {
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  };

  const resetQuiz = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const isCorrect = selectedAnswer === conceptCheck.correctAnswer;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xl font-semibold text-slate-800">
        <CheckCircle className="w-6 h-6 text-green-500" />
        <h3>Concept Check</h3>
      </div>
      
      <div className="space-y-4">
        <p className="text-slate-700 font-medium">{conceptCheck.question}</p>
        
        <div className="space-y-2">
          {conceptCheck.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !showResult && handleAnswerSelect(index)}
              disabled={showResult}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                showResult
                  ? index === conceptCheck.correctAnswer
                    ? 'bg-green-100 border-green-400 text-green-800'
                    : selectedAnswer === index
                    ? 'bg-red-100 border-red-400 text-red-800'
                    : 'bg-slate-100 border-slate-300 text-slate-600'
                  : selectedAnswer === index
                  ? 'bg-blue-100 border-blue-400 text-blue-800'
                  : 'bg-white border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-medium text-sm">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span>{option}</span>
                {showResult && index === conceptCheck.correctAnswer && (
                  <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
                )}
                {showResult && selectedAnswer === index && index !== conceptCheck.correctAnswer && (
                  <X className="w-5 h-5 text-red-600 ml-auto" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {showResult && (
        <>
          <div className={`rounded-lg p-4 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className={`font-medium mb-2 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                  {isCorrect ? 'Correct!' : 'Not quite right.'}
                </p>
                <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {conceptCheck.explanation}
                </p>
              </div>
            </div>
            
            {!isCorrect && (
              <Button
                onClick={resetQuiz}
                variant="outline"
                size="sm"
                className="mt-3"
              >
                Try Again
              </Button>
            )}
          </div>

          {isCorrect && (
            <div className="bg-slate-100 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CharacterAvatar 
                  src={character.avatar} 
                  alt={character.name}
                  size="md"
                />
                <div>
                  <p className="font-medium text-slate-800">{character.name} says:</p>
                  <p className="text-slate-700">"Excellent work! You've got this concept down."</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {!showResult || isCorrect ? (
        <SectionCompletion
          onComplete={onComplete}
          onNext={onNext}
          isCompleted={isCompleted}
          isLastSection={isLastSection}
        />
      ) : null}
    </div>
  );
};
