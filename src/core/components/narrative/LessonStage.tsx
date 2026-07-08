import { ReactNode } from "react";
import { cn } from "@/core/lib/utils";

/**
 * The immersive ground for every v2 lesson surface. Sets data-character (so
 * --ch-accent drives the tint) and applies `.lesson-stage` (warm near-black +
 * character glows + faded plot grid + vignette, all defined in index.css).
 * Children render in a z-1 content layer above the fixed decorative layers.
 */
export const LessonStage = ({
  characterId,
  children,
  className,
}: {
  characterId: string;
  children: ReactNode;
  className?: string;
}) => (
  <div data-character={characterId} className={cn("lesson-stage min-h-screen text-white", className)}>
    <div className="lesson-stage-particles" aria-hidden />
    <div className="lesson-stage-content">{children}</div>
  </div>
);

export default LessonStage;
