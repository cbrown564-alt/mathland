import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface PersistentAudioBarProps {
  /** Current chapter's clip. Changing this loads (and, if autoPlay, plays) the new clip. */
  src: string;
  /** Small label shown in the bar, e.g. "Vera · Chapter 2". */
  label?: string;
  /** Attempt to auto-play when `src` changes (best-effort; browsers may block before a gesture). */
  autoPlay?: boolean;
  /** Fired as playback starts/stops so the character portrait can pulse. */
  onPlayingChange?: (playing: boolean) => void;
  /** Fired when the current clip finishes — the player uses it to nudge "Continue". */
  onEnded?: () => void;
}

/**
 * Floating, frosted audio bar pinned to the *viewport* bottom (position: fixed —
 * so it genuinely persists as chapters change, unlike the old absolute version
 * that parked at the document bottom). Plays one chapter clip at a time; the
 * story player swaps `src` per chapter, which keeps transcript sync trivial
 * (one clip == one chapter). Accent colours come from --ch-accent so the bar
 * re-themes with the active character.
 */
export const PersistentAudioBar = ({
  src,
  label,
  autoPlay,
  onPlayingChange,
  onEnded,
}: PersistentAudioBarProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Load (and optionally play) whenever the chapter clip changes.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(0);
    setDuration(0);
    audio.load();
    if (autoPlay) {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          onPlayingChange?.(true);
        })
        .catch(() => {
          // Autoplay blocked before a user gesture — leave it paused.
          setIsPlaying(false);
          onPlayingChange?.(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => setDuration(audio.duration || 0);
    const onTime = () => setCurrentTime(audio.currentTime);
    const onEnd = () => {
      setIsPlaying(false);
      onPlayingChange?.(false);
      onEnded?.();
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
    };
  }, [onPlayingChange, onEnded]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      onPlayingChange?.(false);
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          onPlayingChange?.(true);
        })
        .catch(() => setIsPlaying(false));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const t = parseFloat(e.target.value);
    audio.currentTime = t;
    setCurrentTime(t);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    audio.volume = vol;
    setIsMuted(vol === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !isMuted;
    audio.volume = next ? 0 : volume;
    setIsMuted(next);
  };

  const formatTime = (t: number) => {
    if (!Number.isFinite(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4 sm:pb-5">
      <div
        className="pointer-events-auto flex w-full max-w-xl items-center gap-3 rounded-full border border-white/10 px-3 py-2 backdrop-blur-md sm:px-4 sm:py-2.5"
        style={{ background: "rgba(20,16,40,0.72)" }}
      >
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause narration" : "Play narration"}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-white shadow-lg transition active:scale-95"
          style={{ background: "linear-gradient(135deg, var(--ch-accent), var(--ch-accent-2))" }}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
        </button>

        {label && (
          <span className="hidden flex-shrink-0 font-mono text-[11px] uppercase tracking-wider text-white/45 sm:inline">
            {label}
          </span>
        )}

        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          aria-label="Seek narration"
          className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full"
          style={{
            background: `linear-gradient(to right, var(--ch-accent) 0%, var(--ch-accent-2) ${pct}%, rgba(255,255,255,0.15) ${pct}%, rgba(255,255,255,0.15) 100%)`,
          }}
        />

        <span className="flex-shrink-0 font-mono text-[11px] tabular-nums text-white/55">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        <div className="hidden items-center gap-1.5 md:flex">
          <button onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"} className="text-white/55 hover:text-white/90">
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={isMuted ? 0 : volume}
            onChange={handleVolume}
            aria-label="Volume"
            className="h-1 w-14 cursor-pointer appearance-none rounded-full bg-white/20"
          />
        </div>

        <audio ref={audioRef} src={src} preload="metadata" />
      </div>
    </div>
  );
};

export default PersistentAudioBar;
