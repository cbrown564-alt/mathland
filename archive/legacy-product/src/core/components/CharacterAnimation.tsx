import { cn } from "@/core/lib/utils";

interface CharacterAnimationProps {
  characterId: string;
  fallbackSrc: string;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  speaking?: boolean;
}

const sizeClasses = {
  sm: "w-10 h-10",
  md: "w-14 h-14",
  lg: "w-20 h-20",
  xl: "w-24 h-24",
  "2xl": "w-32 h-32"
};

/**
 * Animated character portrait. Plays the orphaned per-character GIF from
 * /public/gifs/{id}.gif, falling back to the static avatar PNG if the GIF is
 * missing or fails to load (Path B1). A `speaking` ring pulses during audio.
 */
export const CharacterAnimation = ({
  characterId,
  fallbackSrc,
  alt,
  size = "md",
  className,
  speaking = false
}: CharacterAnimationProps) => {
  const gifSrc = `/gifs/${characterId}.gif`;

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0 bg-white",
        sizeClasses[size],
        className
      )}
    >
      <img
        src={gifSrc}
        alt={alt}
        className="w-full h-full object-cover"
        onError={(e) => {
          const img = e.currentTarget;
          if (img.src !== window.location.origin + fallbackSrc && !img.src.endsWith(fallbackSrc)) {
            img.src = fallbackSrc;
          }
        }}
      />
      {speaking && (
        <span className="absolute inset-0 rounded-full ring-4 ring-[var(--ch-accent)] animate-pulse pointer-events-none" />
      )}
    </div>
  );
};
