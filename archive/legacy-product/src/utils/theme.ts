/**
 * Single source of truth for character colors (Path A6).
 * CSS brand variables live in src/index.css; gradient class fragments live here
 * so Tailwind's safelist (tailwind.config.ts) and runtime lookups stay aligned.
 */

export interface CharacterTheme {
  id: string;
  /** Full gradient class string, e.g. "bg-gradient-to-br from-amber-500 to-orange-500". */
  gradient: string;
  /** Raw class fragment, e.g. "from-amber-500 to-orange-500". */
  color: string;
  /** Solid brand color (CSS var), primary. */
  brand: string;
  /** Secondary brand color (CSS var). */
  brand2: string;
}

/** Tailwind gradient class fragments keyed by character id. */
export const CHARACTER_COLOR_MAP = {
  ollie: "from-amber-500 to-orange-500",
  vera: "from-red-600 to-orange-600",
  max: "from-blue-600 to-indigo-600",
  eileen: "from-purple-600 to-pink-600",
  delta: "from-green-600 to-emerald-600",
  greta: "from-amber-600 to-orange-700",
  pippa: "from-pink-600 to-rose-600",
  bayes: "from-indigo-600 to-purple-600",
  sigmund: "from-teal-600 to-cyan-600",
  sage: "from-blue-600 to-cyan-600",
} as const;

export type CharacterId = keyof typeof CHARACTER_COLOR_MAP;

const BRAND_VARS: Record<CharacterId, { brand: string; brand2: string }> = {
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

export function getCharacterColor(id: string): string {
  return CHARACTER_COLOR_MAP[id as CharacterId] ?? "from-gray-400 to-gray-600";
}

export const characterTheme: Record<string, CharacterTheme> = (
  Object.keys(CHARACTER_COLOR_MAP) as CharacterId[]
).reduce(
  (acc, id) => {
    const color = CHARACTER_COLOR_MAP[id];
    const vars = BRAND_VARS[id];
    acc[id] = {
      id,
      color,
      gradient: `bg-gradient-to-br ${color}`,
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
