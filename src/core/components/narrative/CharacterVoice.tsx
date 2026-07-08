import type { ReactNode } from "react";
import { characters } from "@/utils/characterData";

interface CharacterVoiceProps {
  characterId: string;
  variant?: "nudge" | "aside";
  children: ReactNode;
}

/**
 * Character voice bubble — avatar, name label, and spoken content.
 * Used for prediction nudges and check affirmations in story mode.
 */
export function CharacterVoice({ characterId, variant = "aside", children }: CharacterVoiceProps) {
  const char = characters.find((c) => c.id === characterId);
  const firstName = char?.name.split(" ")[0] ?? characterId;
  const variantLabel = variant === "nudge" ? "Prediction nudge" : "Aside";

  return (
    <div
      className="flex max-w-md items-start gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.045] p-4 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500"
      style={{ animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      <div
        className="flex h-11 w-11 flex-none items-center justify-center rounded-full text-xl"
        style={{ background: "linear-gradient(135deg, var(--ch-accent), var(--ch-accent-2))" }}
        aria-hidden
      >
        {char?.icon ?? "?"}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className="mb-1 font-mono text-[10px] uppercase tracking-[0.12em]"
          style={{ color: "var(--ch-accent-2)" }}
        >
          {firstName} · {variantLabel}
        </p>
        <div className="font-serif text-base leading-relaxed text-white/90">{children}</div>
      </div>
    </div>
  );
}

export default CharacterVoice;
