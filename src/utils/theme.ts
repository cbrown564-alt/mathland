import { characters } from "./characterData";

export interface CharacterTheme {
  id: string;
  /** Full gradient class string, e.g. "bg-gradient-to-br from-amber-500 to-orange-500". */
  gradient: string;
  /** Raw class fragment as stored on the character, e.g. "from-amber-500 to-orange-500". */
  color: string;
  /** Solid brand color (CSS var), primary. */
  brand: string;
  /** Secondary brand color (CSS var). */
  brand2: string;
}

const BRAND_VARS: Record<string, { brand: string; brand2: string }> = {
  ollie: { brand: "var(--ch-ollie)", brand2: "var(--ch-ollie-2)" },
  vera: { brand: "var(--ch-vera)", brand2: "var(--ch-vera-2)" },
  max: { brand: "var(--ch-max)", brand2: "var(--ch-max-2)" },
  eileen: { brand: "var(--ch-eileen)", brand2: "var(--ch-eileen-2)" },
  delta: { brand: "var(--ch-delta)", brand2: "var(--ch-delta-2)" },
  greta: { brand: "var(--ch-greta)", brand2: "var(--ch-greta-2)" },
  pippa: { brand: "var(--ch-pippa)", brand2: "var(--ch-pippa-2)" },
  sigmund: { brand: "var(--ch-sigmund)", brand2: "var(--ch-sigmund-2)" },
  bayes: { brand: "var(--ch-bayes)", brand2: "var(--ch-bayes-2)" },
  sage: { brand: "var(--ch-sage)", brand2: "var(--ch-sage-2)" },
};

export const characterTheme: Record<string, CharacterTheme> = characters.reduce(
  (acc, c) => {
    const vars = BRAND_VARS[c.id] ?? { brand: "var(--ch-ollie)", brand2: "var(--ch-ollie-2)" };
    acc[c.id] = {
      id: c.id,
      color: c.color,
      gradient: `bg-gradient-to-br ${c.color}`,
      brand: vars.brand,
      brand2: vars.brand2,
    };
    return acc;
  },
  {} as Record<string, CharacterTheme>,
);

export function getCharacterTheme(id: string | undefined): CharacterTheme {
  if (id && characterTheme[id]) return characterTheme[id];
  return characterTheme.ollie;
}

export function getCharacterGradient(id: string | undefined): string {
  return getCharacterTheme(id).gradient;
}
