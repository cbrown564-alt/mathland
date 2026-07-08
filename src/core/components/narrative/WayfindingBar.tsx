import { Link } from "react-router-dom";
import { RotateCcw, X } from "lucide-react";
import type { Beat } from "@/content/beats/schema";

interface WayfindingBarProps<S> {
  beats: Beat<S>[];
  currentIndex: number;
  onSelectBeat?: (index: number) => void;
  exitTo: string;
  onRestart: () => void;
  onExit?: () => void;
}

function beatLabel<S>(beat: Beat<S>, index: number): string {
  return beat.title ?? beat.eyebrow ?? `Beat ${index + 1}`;
}

export function WayfindingBar<S>({
  beats,
  currentIndex,
  onSelectBeat,
  exitTo,
  onRestart,
  onExit,
}: WayfindingBarProps<S>) {
  const total = beats.length;
  const activeBeat = beats[currentIndex];
  const activeLabel = activeBeat ? beatLabel(activeBeat, currentIndex) : "";

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-black/30 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-5">
        {onExit ? (
          <button
            type="button"
            onClick={onExit}
            aria-label="Exit lesson"
            className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-white/10 text-white/50 transition hover:border-white/20 hover:text-white/90"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <Link
            to={exitTo}
            aria-label="Exit lesson"
            className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-white/10 text-white/50 transition hover:border-white/20 hover:text-white/90"
          >
            <X className="h-4 w-4" />
          </Link>
        )}

        <div
          className="flex min-w-0 flex-1 items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 backdrop-blur-md"
          role="navigation"
          aria-label="Lesson beats"
        >
          <div className="flex h-10 min-w-0 flex-1 items-center">
            {beats.map((beat, i) => {
              const isDone = i < currentIndex;
              const isActive = i === currentIndex;
              const label = beatLabel(beat, i);
              const canSelect = onSelectBeat && i <= currentIndex;

              return (
                <div
                  key={beat.id}
                  className={`relative flex flex-1 items-center justify-center last:flex-none ${isDone ? "done" : ""} ${isActive ? "active" : ""}`}
                >
                  {i < total - 1 && (
                    <span
                      className="absolute left-1/2 right-[-50%] top-1/2 z-0 h-0.5 -translate-y-1/2"
                      style={{
                        background: isDone
                          ? "var(--ch-accent-2)"
                          : isActive
                            ? "linear-gradient(90deg, var(--ch-accent-2), rgba(255,255,255,0.1))"
                            : "rgba(255,255,255,0.1)",
                      }}
                      aria-hidden
                    />
                  )}

                  {canSelect ? (
                    <button
                      type="button"
                      onClick={() => onSelectBeat(i)}
                      aria-current={isActive ? "step" : undefined}
                      aria-label={`${label}${isDone ? ", completed" : isActive ? ", current" : ""}`}
                      className="relative z-10 flex items-center justify-center rounded-full border-2 font-mono text-[10px]"
                      style={{
                        transition: "all 420ms cubic-bezier(0.16, 1, 0.3, 1)",
                        width: isActive ? 36 : 28,
                        height: isActive ? 36 : 28,
                        borderColor: isActive
                          ? "var(--ch-accent)"
                          : isDone
                            ? "var(--ch-accent-2)"
                            : "rgba(255,255,255,0.15)",
                        background: isActive
                          ? "linear-gradient(135deg, var(--ch-accent), var(--ch-accent-2))"
                          : isDone
                            ? "color-mix(in srgb, var(--ch-accent-2) 20%, #0b0910)"
                            : "#0b0910",
                        color: isActive ? "white" : isDone ? "var(--ch-accent-2)" : "rgba(255,255,255,0.32)",
                        boxShadow: isActive
                          ? "0 0 0 6px color-mix(in srgb, var(--ch-accent) 20%, transparent), 0 0 30px color-mix(in srgb, var(--ch-accent) 35%, transparent)"
                          : "none",
                      }}
                    >
                      {isDone ? "✓" : i + 1}
                    </button>
                  ) : (
                    <span
                      aria-current={isActive ? "step" : undefined}
                      className="relative z-10 flex items-center justify-center rounded-full border-2 font-mono text-[10px]"
                      style={{
                        transition: "all 420ms cubic-bezier(0.16, 1, 0.3, 1)",
                        width: isActive ? 36 : 28,
                        height: isActive ? 36 : 28,
                        borderColor: isActive
                          ? "var(--ch-accent)"
                          : isDone
                            ? "var(--ch-accent-2)"
                            : "rgba(255,255,255,0.15)",
                        background: isActive
                          ? "linear-gradient(135deg, var(--ch-accent), var(--ch-accent-2))"
                          : isDone
                            ? "color-mix(in srgb, var(--ch-accent-2) 20%, #0b0910)"
                            : "#0b0910",
                        color: isActive ? "white" : isDone ? "var(--ch-accent-2)" : "rgba(255,255,255,0.32)",
                        boxShadow: isActive
                          ? "0 0 0 6px color-mix(in srgb, var(--ch-accent) 20%, transparent), 0 0 30px color-mix(in srgb, var(--ch-accent) 35%, transparent)"
                          : "none",
                      }}
                    >
                      {isDone ? "✓" : i + 1}
                    </span>
                  )}

                  <span
                    className={`pointer-events-none absolute top-[calc(100%+6px)] max-w-[5rem] truncate font-mono text-[9px] uppercase tracking-[0.06em] transition-opacity duration-180 ${
                      isActive ? "opacity-100 text-white/55" : "opacity-0 group-hover:opacity-100"
                    }`}
                    aria-hidden={!isActive}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <span className="hidden flex-none font-mono text-[11px] text-white/35 sm:inline">
          Beat {currentIndex + 1} · {activeLabel}
        </span>

        {currentIndex > 0 && (
          <button
            type="button"
            onClick={onRestart}
            aria-label="Start over"
            className="flex h-8 w-8 flex-none items-center justify-center text-white/35 transition hover:text-white/80"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        )}
      </div>
    </header>
  );
}

export default WayfindingBar;
