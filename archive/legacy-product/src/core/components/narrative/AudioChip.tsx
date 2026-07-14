import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

/**
 * A small inline "hear Vera" chip — audio demoted to a per-passage aside (the v2
 * decision: voice is seasoning, not the spine). Plays one short clip on click;
 * only one chip plays at a time (a play elsewhere pauses this one). No persistent
 * bar, no autoplay. Accent comes from --ch-accent.
 */
let CURRENT_AUDIO: HTMLAudioElement | null = null;

export const AudioChip = ({ src, label = "hear Vera" }: { src: string; label?: string }) => {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

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
      aria-label={playing ? "Pause narration" : label}
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 align-middle font-mono text-[11px] transition"
      style={{
        color: "var(--ch-accent)",
        borderColor: "color-mix(in srgb, var(--ch-accent) 45%, transparent)",
        background: playing ? "color-mix(in srgb, var(--ch-accent) 12%, transparent)" : "transparent",
      }}
    >
      {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
      {playing ? "playing…" : label}
      <audio ref={ref} src={src} preload="none" />
    </button>
  );
};

export default AudioChip;
