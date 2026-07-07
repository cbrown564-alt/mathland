import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, FileText } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { Card, CardContent } from "@/core/components/ui/card";
import { LiveTranscript } from './LiveTranscript';
import { useAudioTranscript } from '../../hooks/useAudioTranscript';
import { Character } from '../../types/character';

interface EnhancedAudioPlayerProps {
  audioUrl: string;
  character: Character;
  transcript?: string[];
  onAudioLoaded?: () => void;
  showTranscript?: boolean;
  onPlayingChange?: (playing: boolean) => void;
}

export const EnhancedAudioPlayer: React.FC<EnhancedAudioPlayerProps> = ({
  audioUrl,
  character,
  transcript,
  onAudioLoaded,
  showTranscript = true,
  onPlayingChange
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showTranscriptPanel, setShowTranscriptPanel] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use the existing audio transcript hook
  const { 
    audioRef,
    currentTranscriptIdx, 
    getTranscriptTimeWindows,
    handleAudioTimeUpdate 
  } = useAudioTranscript(transcript, duration);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
      onAudioLoaded?.();
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      handleAudioTimeUpdate(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      onPlayingChange?.(false);
    };

    const handleError = () => {
      setError("Failed to load audio file");
      setIsLoading(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [onAudioLoaded, handleAudioTimeUpdate, onPlayingChange]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {
        setError("Failed to play audio");
      });
    }
    setIsPlaying(!isPlaying);
    onPlayingChange?.(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audio.volume = newVolume;
    setIsMuted(newVolume === 0);
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

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Character and Audio Player */}
      <div className="flex items-start gap-4">
        {/* Character Avatar */}
        <div className="flex-shrink-0">
          <img
            src={character.avatar}
            alt={character.fullName || character.name}
            className="w-16 h-16 rounded-full shadow-lg border-2 border-slate-200 bg-white object-cover"
          />
        </div>

        {/* Audio Player Card */}
        <Card className="flex-1 shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            {/* Progress Bar */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-slate-600">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progressPercentage}%, #e2e8f0 ${progressPercentage}%, #e2e8f0 100%)`
                }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={togglePlay}
                  disabled={isLoading || !!error}
                  className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-1" />
                  )}
                </Button>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="text-slate-600 hover:text-slate-800"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 bg-slate-200 rounded appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {transcript && transcript.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTranscriptPanel(!showTranscriptPanel)}
                  className="text-slate-600 hover:text-slate-800"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {showTranscriptPanel ? "Hide" : "Show"} Transcript
                </Button>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg mt-4">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Live Transcript */}
      {transcript && transcript.length > 0 && showTranscriptPanel && (
        <Card className="shadow-lg border-0 bg-slate-50">
          <CardContent className="p-4">
            <h4 className="text-base font-semibold text-slate-700 mb-3">Live Transcript</h4>
            <LiveTranscript 
              transcript={transcript}
              currentTranscriptIdx={currentTranscriptIdx}
              getTranscriptTimeWindows={getTranscriptTimeWindows}
              audioDuration={duration}
            />
          </CardContent>
        </Card>
      )}

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        onLoadStart={() => setIsLoading(true)}
      />
    </div>
  );
}; 