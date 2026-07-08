import { useEffect, useMemo, useRef, useState } from "react";
import { characters } from "@/utils/characterData";

/**
 * Inline "hear {character}" voice chip — audio demoted to a per-passage aside.
 * Plays one short clip on click; only one chip plays at a time.
 */
let CURRENT_AUDIO: HTMLAudioElement | null = null;

const WAVE_DELAYS = ["0s", "0.1s", "0.2s", "0.15s", "0.25s"] as const;
const WAVE_HEIGHTS = [4, 10, 6, 12, 5] as const;

function WaveformBars() {
  return (
    <span className="inline-flex h-3.5 items-center gap-0.5" aria-hidden>
      {WAVE_HEIGHTS.map((h, i) => (
        <span
          key={i}
          className="audio-chip-wave w-0.5 rounded-sm"
          style={{
            height: `${h}px`,
            background: "var(--ch-accent)",
            animationDelay: WAVE_DELAYS[i],
          }}
        />
      ))}
      <style>{`
        @keyframes audio-chip-wave {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1); }
        }
        .audio-chip-wave {
          animation: audio-chip-wave 0.8s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .audio-chip-wave { animation: none; }
        }
      `}</style>
    </span>
  );
}

export const AudioChip = ({
  src,
  characterId,
  label,
}: {
  src: string;
  characterId?: string;
  label?: string;
}) => {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const derivedLabel = useMemo(() => {
    if (label) return label;
    const char = characterId ? characters.find((c) => c.id === characterId) : undefined;
    const firstName = char?.name.split(" ")[0] ?? "Vera";
    return `hear ${firstName}`;
  }, [characterId, label]);

  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    const onEnd = () => setPlaying(false);
    const onPause = () => setPlaying(false);
    a.addEventListener("ended", onEnd);
    a.addEventListener("pause", onPause);
    return () => {
      a.removeEventListener("ended", onEnd);
      a.removeEventListener("pause", onPause);
      if (CURRENT_AUDIO === a) CURRENT_AUDIO = null;
    };
  }, []);

  const toggle = () => {
    const a = ref.current;
    if (!a) return;
    if (playing) {
      a.pause();
      return;
    }
    if (CURRENT_AUDIO && CURRENT_AUDIO !== a) CURRENT_AUDIO.pause();
    CURRENT_AUDIO = a;
    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };

  return (
    <button
      onClick={toggle}
      aria-label={playing ? "Pause narration" : derivedLabel}
      className="inline-flex items-center gap-2 rounded-full border px-4 py-2 align-middle font-mono text-[11px] transition"
      style={{
        color: playing ? "var(--ch-accent)" : "rgba(255,255,255,0.55)",
        borderColor: playing
          ? "var(--ch-accent)"
          : "color-mix(in srgb, var(--ch-accent) 30%, transparent)",
        background: playing
          ? "color-mix(in srgb, var(--ch-accent) 8%, transparent)"
          : "color-mix(in srgb, var(--ch-accent) 8%, transparent)",
      }}
    >
      {playing ? (
        <>
          <WaveformBars />
          <span>Playing</span>
        </>
      ) : (
        <span>▶ {derivedLabel}</span>
      )}
      <audio ref={ref} src={src} preload="none" />
    </button>
  );
};

export default AudioChip;
