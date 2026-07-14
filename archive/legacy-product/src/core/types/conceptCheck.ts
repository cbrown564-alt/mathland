export interface CharacterConfig {
  id: string;
  name: string;
  color: string; // Tailwind color name like 'orange', 'purple'
  icon: (props: { className?: string; size?: number | string }) => unknown; // Lucide icons or similar SVG components
  reactionVerb: string; // "celebrates", "deduces", "calculates"
  explainVerb: string; // "explains", "investigates", "analyzes"
  avatar: string; // path to character image
}

export interface ScenarioConfig {
  description: string;
  successMessage: string;
}

export interface StepConfig {
  question: string;
  placeholder: string;
  inputType: 'number' | 'text' | 'select';
  correctAnswer: string;
  feedback: string;
  hint?: string;
  validation?: (value: string) => boolean;
}

export interface VisualConfig {
  title: string;
  component: unknown | ((progress: Record<string, string>) => unknown);
}

export interface ChallengeConfig {
  title: string;
  type: string; // "Navigation Challenge", "Detective Investigation", etc.
  description: string;
}

export interface ApproachConfig {
  id: string;
  title: string;
  description: string;
  correct: boolean;
  explanation: string;
} 