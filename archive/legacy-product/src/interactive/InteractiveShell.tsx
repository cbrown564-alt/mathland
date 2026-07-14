import { ReactNode } from "react";
import { cn } from "@/core/lib/utils";
import { IX } from "./interactiveTheme";

export interface InteractiveShellProps {
  children: ReactNode;
  ariaLabel: string;
  className?: string;
}

/**
 * Accessibility + theme wrapper for interactive lesson components.
 * Applies the dark immersive `.interactive-panel` scope.
 */
export function InteractiveShell({ children, ariaLabel, className }: InteractiveShellProps) {
  return (
    <div role="region" aria-label={ariaLabel} className={cn(IX.root, className)}>
      {children}
    </div>
  );
}

export default InteractiveShell;
