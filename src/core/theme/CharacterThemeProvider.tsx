import { createContext, useContext, ReactNode } from "react";
import { getCharacterTheme, CharacterTheme } from "@/utils/theme";

interface CharacterThemeContextValue {
  theme: CharacterTheme;
  characterId: string;
}

const CharacterThemeContext = createContext<CharacterThemeContextValue | null>(null);

interface CharacterThemeProviderProps {
  characterId: string;
  children: ReactNode;
}

/**
 * Scopes a character's theme to its subtree by setting `data-character`, which
 * the CSS in index.css maps to --ch-accent / --ch-accent-2. Any descendant using
 * the `.character-accent-*` utilities inherits the character's color with no
 * per-component wiring (Path B2/B3). `display: contents` keeps layout intact.
 */
export const CharacterThemeProvider = ({ characterId, children }: CharacterThemeProviderProps) => {
  const theme = getCharacterTheme(characterId);
  return (
    <div data-character={characterId} className="contents">
      <CharacterThemeContext.Provider value={{ theme, characterId }}>
        {children}
      </CharacterThemeContext.Provider>
    </div>
  );
};

export const useCharacterTheme = (): CharacterThemeContextValue => {
  const ctx = useContext(CharacterThemeContext);
  if (ctx) return ctx;
  const theme = getCharacterTheme(undefined);
  return { theme, characterId: theme.id };
};
