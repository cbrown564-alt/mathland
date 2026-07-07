import { CheckCircle, Circle, PlayCircle } from "lucide-react";
import { Card, CardContent } from "@/core/components/ui/card";
import { CharacterAnimation } from "@/core/components/CharacterAnimation";
import { cn } from "@/core/lib/utils";
import { motion } from "framer-motion";

interface LessonSidebarProps {
  character: {
    id: string;
    name: string;
    fullName: string;
    personality: string;
    avatar: string;
  };
  sections: Array<{
    id: string;
    title: string;
  }>;
  currentSection: string;
  completedSections: Set<string>;
  onSectionChange: (sectionId: string) => void;
  onToggleSection: (sectionId: string) => void;
}

export const LessonSidebar = ({ 
  character, 
  sections, 
  currentSection, 
  completedSections, 
  onSectionChange, 
  onToggleSection 
}: LessonSidebarProps) => {
  return (
    <Card className="sticky top-32 character-accent-border border-2">
      <CardContent className="p-6">
        {/* Character */}
        <div className="flex items-center gap-3 mb-6">
          <CharacterAnimation
            characterId={character.id}
            fallbackSrc={character.avatar}
            alt={character.fullName}
            size="xl"
          />
          <div>
            <h3 className="font-semibold text-slate-800">{character.name}</h3>
            <p className="text-sm text-slate-600">{character.personality}</p>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="space-y-1">
          <h4 className="font-medium text-slate-800 mb-3 px-3">Lesson Sections</h4>
          {sections.map((section) => {
            const isCompleted = completedSections.has(section.id);
            const isActive = currentSection === section.id;
            
            return (
              <div
                key={section.id}
                className={cn(
                  "flex items-center p-3 rounded-lg text-sm transition-colors cursor-pointer",
                  isActive
                    ? "character-accent-soft character-accent-text font-semibold"
                    : "hover:bg-slate-100 text-slate-700 font-medium",
                  isCompleted && !isActive && "text-slate-500"
                )}
                onClick={() => onSectionChange(section.id)}
              >
                {isActive ? (
                  <PlayCircle className="w-5 h-5 mr-3 character-accent-text flex-shrink-0" />
                ) : isCompleted ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="mr-3 flex-shrink-0"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </motion.span>
                ) : (
                  <Circle className="w-5 h-5 mr-3 text-slate-400 flex-shrink-0" />
                )}
                <span className={cn(isCompleted && !isActive && "line-through")}>
                  {section.title}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
