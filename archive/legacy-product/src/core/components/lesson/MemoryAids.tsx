import { Brain, CheckCircle } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { CharacterAvatar } from "@/core/components/CharacterAvatar";
import { SectionCompletion } from "./SectionCompletion";

interface MemoryAidsProps {
  memoryAids: {
    mantra: string;
    visual: string;
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

export const MemoryAids = ({ memoryAids, character, onComplete, onNext, isCompleted, isLastSection }: MemoryAidsProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-lg p-6 border-l-4 border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <CharacterAvatar 
            src={character.avatar} 
            alt={character.name}
            size="md"
          />
          <div>
            <p className="font-semibold text-slate-800">{character.name}'s Memory Helper</p>
            <p className="text-sm text-slate-600">Easy ways to remember this concept</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-4">
            <p className="text-slate-700 font-medium italic text-center">"{memoryAids.mantra}"</p>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">Visual Memory:</p>
                <p className="text-slate-600">{memoryAids.visual}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SectionCompletion
        onComplete={onComplete}
        onNext={onNext}
        isCompleted={isCompleted}
        isLastSection={isLastSection}
      />
    </div>
  );
};
