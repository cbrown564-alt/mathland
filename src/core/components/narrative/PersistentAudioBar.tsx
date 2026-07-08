import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface PersistentAudioBarProps {
  audioUrl: string;
  transcript: string[];
  /** Fired with true/false as audio starts/stops so the character face can pulse. */
  onPlayingChange?: (playing: boolean) => void;
  /** Receives {index, currentTime, duration} each tick so the parent can sync the inline transcript. */
  onTimeUpdate?: (state: { index: number; currentTime: number; duration: number }) => void;
}

/** Word-count-based time windows, matching useAudioTranscript's algorithm. */
function transcriptWindows(transcript: string[], audioDuration: number) {
  if (!transcript.length || audioDuration === 0) return [] as { start: number; end: number }[];
  const counts = transcript.map((p) => {
    const base = p.split(/\s+/).length;
    const extra = p.includes("...") ? 3 : 0;
    return base + extra;
  });
  const total = counts.reduce((a, b) => a + b, 0);
  let acc = 0;
  return counts.map((c) => {
    const start = (acc / total) * audioDuration;
    acc += c;
    const end = (acc / total) * audioDuration;
    return { start, end };
  });
}

function indexAtTime(transcript: string[], windows: { start: number; end: number }[], t: number) {
  if (!transcript.length) return 0;
  const idx = windows.findIndex((w) => t >= w.start && t < w.end);
  return idx === -1 ? transcript.length - 1 : idx;
}

/**
 * Floating, frosted-glass audio bar pinned to the bottom of the narrative
 * viewport (Path C1). Unlike the section-form EnhancedAudioPlayer — which is
 * local to one section and remounts on navigation — this component lives at the
 * story root so the SAME audio keeps playing as the learner scrolls between
 * beats. Resolves the live transcript index itself (mirroring
 * useAudioTranscript) and reports it upward via onTimeUpdate.
 */
export const PersistentAudioBar = ({
  audioUrl,
  transcript,
  onPlayingChange,
  onTimeUpdate,
}: PersistentAudioBarProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lastIndexRef = useRef(-1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => {
      const t = audio.currentTime;
      const d = audio.duration;
      setCurrentTime(t);
      const windows = transcriptWindows(transcript, d);
      const index = indexAtTime(transcript, windows, t);
      onTimeUpdate?.({ index, currentTime: t, duration: d });
      lastIndexRef.current = index;
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      onPlayingChange?.(false);
    };
    const handleError = () => setError("Failed to load audio");

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [transcript, onPlayingChange, onTimeUpdate]);

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
        .catch(() => setError("Failed to play audio"));
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
    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (t: number) => {
    if (!Number.isFinite(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-5">
      <div
        className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/10 px-4 py-2.5 backdrop-blur-md"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="flex h-9 w-9 items-center justify-center rounded-full text-white shadow-lg"
          style={{ background: "linear-gradient(135deg, #a78bfa, #ec4899)" }}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
        </button>

        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          aria-label="Seek"
          className="hidden h-1.5 w-44 cursor-pointer appearance-none rounded-full sm:block"
          style={{
            background: `linear-gradient(to right, #c4b5fd 0%, #ec4899 ${pct}%, rgba(255,255,255,0.18) ${pct}%, rgba(255,255,255,0.18) 100%)`,
          }}
        />
        {/* decorative waveform for narrow screens */}
        <div className="flex h-3.5 items-center gap-px sm:hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="inline-block w-0.5 rounded-full"
              style={{
                height: `${4 + ((i * 7) % 10)}px`,
                background: i < Math.round((pct / 100) * 12) ? "#c4b5fd" : "rgba(255,255,255,0.2)",
              }}
            />
          ))}
        </div>

        <span className="font-mono text-[11px] tabular-nums text-white/60">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        <div className="hidden items-center gap-1.5 md:flex">
          <button onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"} className="text-white/60 hover:text-white/90">
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
      </div>

      {/* The audio element lives at the story root, so playback persists across scroll. */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {error && <p className="sr-only" role="alert">{error}</p>}
    </div>
  );
};

export default PersistentAudioBar;
