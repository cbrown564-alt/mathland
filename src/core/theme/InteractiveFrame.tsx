import { ReactNode } from "react";
import { CharacterAnimation } from "@/core/components/CharacterAnimation";
import { characters } from "@/utils/characterData";
import { IX } from "@/interactive/interactiveTheme";

interface InteractiveFrameProps {
  characterId: string;
  fallbackSrc: string;
  title?: string;
  children: ReactNode;
}

/**
 * Themed wrapper for interactive demos. Gives every interactive a consistent
 * character "workshop" look — accent border, character header, and a scoped
 * theme so descendants can use the .character-accent-* utilities (Path B3).
 */
export const InteractiveFrame = ({ characterId, fallbackSrc, title, children }: InteractiveFrameProps) => {
  const character = characters.find((c) => c.id === characterId);

  return (
    <div
      data-character={characterId}
      className={`rounded-2xl border-2 character-accent-border shadow-xl overflow-hidden ${IX.root}`}
      style={{ background: "rgba(255,255,255,0.04)" }}
    >
      <div className="flex items-center gap-3 px-4 py-3 character-accent-soft border-b character-accent-border">
        <CharacterAnimation
          characterId={characterId}
          fallbackSrc={fallbackSrc}
          alt={character?.fullName ?? title ?? ""}
          size="md"
        />
        <div>
          <p className="text-sm font-semibold text-white/90">{title ?? character?.name}</p>
          <p className="text-xs character-accent-text font-medium">{character?.concept}</p>
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
};
