import { CharacterAnimation } from "@/core/components/CharacterAnimation";
import { cn } from "@/core/lib/utils";

interface CompanionCharacter {
  id: string;
  name: string;
  fullName: string;
  personality: string;
  avatar: string;
  catchphrase?: string;
  explainVerb?: string;
}

interface CharacterCompanionProps {
  character: CompanionCharacter;
  sections: Array<{ id: string; title: string }>;
  currentSection: string;
  isSpeaking: boolean;
}

/**
 * Persistent character presence in the lesson chrome (Path B5). Shows the
 * animated portrait with a live "speaking" pulse during audio playback, the
 * character's catchphrase, and a step indicator mirroring lesson progress.
 */
export const CharacterCompanion = ({
  character,
  sections,
  currentSection,
  isSpeaking
}: CharacterCompanionProps) => {
  const currentIndex = sections.findIndex((s) => s.id === currentSection);

  return (
    <div className="sticky top-32 space-y-4">
      <div className="rounded-2xl border-2 character-accent-border bg-white shadow-lg overflow-hidden">
        <div className="px-4 py-4 flex flex-col items-center text-center character-accent-soft">
          <CharacterAnimation
            characterId={character.id}
            fallbackSrc={character.avatar}
            alt={character.fullName}
            size="2xl"
            speaking={isSpeaking}
          />
          <h3 className="mt-3 font-bold text-slate-800">{character.name}</h3>
          <p className="text-xs text-slate-600">{character.personality}</p>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <span
              className={cn(
                "inline-block w-2 h-2 rounded-full character-accent",
                isSpeaking && "animate-pulse"
              )}
            />
            <p className="text-sm italic text-slate-600">
              {isSpeaking
                ? `${character.name.split(" ")[0]} is explaining…`
                : character.catchphrase}
            </p>
          </div>

          {/* Step indicator */}
          <ol className="space-y-1.5">
            {sections.map((section, i) => {
              const isActive = section.id === currentSection;
              const isDone = i < currentIndex;
              return (
                <li key={section.id} className="flex items-center gap-2 text-sm">
                  <span
                    className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0",
                      isActive && "character-accent text-white",
                      isDone && "bg-green-500 text-white",
                      !isActive && !isDone && "bg-slate-200 text-slate-500"
                    )}
                  >
                    {isDone ? "✓" : i + 1}
                  </span>
                  <span
                    className={cn(
                      isActive ? "character-accent-text font-semibold" : "text-slate-600",
                      isDone && "text-slate-400"
                    )}
                  >
                    {section.title}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
};
