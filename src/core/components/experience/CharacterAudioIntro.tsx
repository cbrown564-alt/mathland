import { useState, useRef, useEffect, createRef } from "react";
import { Card, CardContent } from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { characters } from "@/utils/characterData";
import React from "react";
import clsx from "clsx";
import { Dialog, DialogContent } from "@/core/components/ui/dialog";
import { ModuleCharacterCard } from "@/core/components/ModuleCharacterCard";
import { getLessonOrderForModule } from "@/utils/lessonData";
import { Character } from "@/core/types/character";

// Character speaking order with precise timings (in seconds)
const characterTimings = [
  { id: "sage", time: 0 },
  { id: "ollie", time: 18 },
  { id: "vera", time: 28 },
  { id: "max", time: 40 },
  { id: "eileen", time: 51 },
  { id: "delta", time: 64 },
  { id: "greta", time: 76 },
  { id: "pippa", time: 85 },
  { id: "sigmund", time: 96 },
  { id: "bayes", time: 107 },
  { id: "sage", time: 117 }
];

// Transcript for the intro audio
const introTranscript = [
  "Welcome, fellow explorers, to the magical realm of Mathland! I'm Sage the Visionary Eagle, your guide through this extraordinary mathematical journey. Here, abstract concepts come alive through the wisdom and personalities of our remarkable cast of mathematical mentors.",
  "Hey there, builders! Ollie the Otter here. I believe in taking everything step by step, building solid mathematical foundations that support every advanced concept you'll encounter.",
  "Hey there! I'm Vera the Vector, and I think in terms of direction and magnitude! Whether we're navigating through space or organizing data, I'll show you how vectors give everything purpose and direction.",
  "Greetings! Matrix Max here, master of systematic organization. I arrange worlds row by row, column by column, transforming chaos into elegant mathematical structure!",
  "Eileen Eigen, detective of hidden patterns. I uncover the secret structures lurking within any mathematical transformation. Every matrix has mysteries, and I'm here to solve them!",
  "Dr. Delta at your service. I study the mathematics of change with scientific precision. When you need to understand how things transform and evolve, calculus is our answer!",
  "Gradient Greta here! I climb mathematical mountains to find optimal solutions. Whether it's machine learning or business optimization, I'll guide you to the peak!",
  "Hello, magical mathematicians! Probability Pippa speaking! I make the unpredictable predictable through the beautiful patterns of chance and randomness.",
  "Sigmund the Swan, master of statistical elegance. I distinguish the truly significant from mere coincidence, bringing dignity to data analysis and hypothesis testing.",
  "Bayes the Fox, detective of evolving evidence. In my world, we update beliefs systematically as new clues emerge. Every case changes the story.",
  "Together, we represent the complete mathematical toolkit for data science mastery. From Ollie's foundational building blocks through Bayes' sophisticated inference techniques, each character brings unique wisdom to your learning adventure.",
];

interface AudioIntroProps {
  audioUrl?: string;
}

export const CharacterAudioIntro = ({ 
  audioUrl = "/audio/Intro.mp3"
}: AudioIntroProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isSeeking, setIsSeeking] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [hoveredThumb, setHoveredThumb] = useState<string | null>(null);
  const [modalCharacter, setModalCharacter] = useState<Character | null>(null);
  const [modalLessons, setModalLessons] = useState<string[]>([]);
  const [modalModule, setModalModule] = useState<string>("");
  const [autoplay, setAutoplay] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  // For fade transition
  const [displayedCharacter, setDisplayedCharacter] = useState(characters.find(c => c.id === characterTimings[currentCharacterIndex]?.id));
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

  // Refs for each transcript paragraph
  const paragraphRefs = useRef(introTranscript.map(() => createRef<HTMLParagraphElement>()));

  // Calculate which character should be speaking based on precise timings
  useEffect(() => {
    if (duration === 0) return;
    
    const currentIndex = characterTimings.findIndex((timing, index) => {
      const nextTiming = characterTimings[index + 1];
      if (!nextTiming) return true; // Last character
      return currentTime >= timing.time && currentTime < nextTiming.time;
    });
    
    if (currentIndex !== -1) {
      setCurrentCharacterIndex(currentIndex);
    }
  }, [currentTime, duration]);

  // Autoplay effect
  useEffect(() => {
    if (autoplay && audioRef.current && !isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
    }
    // eslint-disable-next-line
  }, [autoplay]);

  // Scroll highlighted paragraph into view when character changes
  useEffect(() => {
    if (!autoScroll) return;
    const ref = paragraphRefs.current[currentCharacterIndex];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentCharacterIndex, autoScroll]);

  const currentCharacter = characters.find(c => c.id === characterTimings[currentCharacterIndex]?.id);

  // Get the 10 unique characters in speaking order (excluding the final Sage repeat)
  const uniqueCharacterIds = characterTimings
    .map(t => t.id)
    .filter((id, idx, arr) => arr.indexOf(id) === idx && id !== "sage" || idx === 0);
  const thumbnailCharacters = uniqueCharacterIds.map(id => characters.find(c => c.id === id)).filter(Boolean);

  // Fade transition when character changes
  useEffect(() => {
    if (!currentCharacter || currentCharacter.id === displayedCharacter?.id) return;
    setFadeState('out');
    const timeout = setTimeout(() => {
      setDisplayedCharacter(currentCharacter);
      setFadeState('in');
    }, 250); // 250ms fade out, then fade in
    return () => clearTimeout(timeout);
  }, [currentCharacter, displayedCharacter]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setCurrentCharacterIndex(0);
  };

  // Seek logic
  const handleSeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!progressBarRef.current || !audioRef.current || duration === 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / rect.width));
    const newTime = percent * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Drag logic
  const handleThumbDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsSeeking(true);
    const onMove = (moveEvent: MouseEvent) => {
      if (!progressBarRef.current || !audioRef.current || duration === 0) return;
      const rect = progressBarRef.current.getBoundingClientRect();
      const x = moveEvent.clientX - rect.left;
      const percent = Math.max(0, Math.min(1, x / rect.width));
      const newTime = percent * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    };
    const onUp = () => {
      setIsSeeking(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // When a thumbnail is clicked, open modal with correct lessons/module
  const handleThumbnailClick = (char: Character) => {
    // Parse module number and name from modules[0]
    const moduleString = char.modules?.[0] || "";
    const match = moduleString.match(/Module (\d+): (.+)/);
    let moduleNumber = "";
    let moduleName = "";
    if (match) {
      moduleNumber = match[1];
      moduleName = match[2];
    }
    // Get lessons for this module
    let lessons: string[] = [];
    if (moduleNumber) {
      lessons = getLessonOrderForModule(moduleNumber);
    }
    setModalCharacter(char);
    setModalLessons(lessons);
    setModalModule(moduleString);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Meet Your Mathematical Companions
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Listen to our characters introduce themselves and discover how they'll guide your mathematical journey
          </p>
        </div>

        {/* Toggles */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          <label className="flex items-center gap-2 cursor-pointer text-slate-700">
            <input
              type="checkbox"
              checked={autoplay}
              onChange={e => setAutoplay(e.target.checked)}
              className="accent-blue-600 w-4 h-4"
            />
            Autoplay audio
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-slate-700">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={e => setAutoScroll(e.target.checked)}
              className="accent-blue-600 w-4 h-4"
            />
            Auto-scroll transcript
          </label>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Character Display */}
          <div className="lg:col-span-1 flex flex-col items-center">
            {displayedCharacter && (
              <div className="text-center sticky top-8">
                <div className={`relative inline-block transition-opacity duration-300 ${fadeState === 'out' ? 'opacity-0' : 'opacity-100'}`}> 
                  {/* Glow Effect */}
                  <div 
                    className="absolute inset-0 rounded-full blur-2xl opacity-30 animate-pulse"
                    style={{
                      background: `linear-gradient(45deg, ${displayedCharacter.color.match(/([a-z]+-[0-9]+)/g)?.[0] || '#60a5fa'}, ${displayedCharacter.color.match(/([a-z]+-[0-9]+)/g)?.[1] || '#818cf8'})`
                    }}
                  ></div>
                  {/* Character Image (always static) */}
                  <img
                    src={displayedCharacter.image}
                    alt={displayedCharacter.name}
                    className="relative z-10 w-80 h-80 object-contain drop-shadow-xl transition-all duration-300 ease-in-out"
                  />
                </div>
                <div className={`mt-6 transition-opacity duration-300 ${fadeState === 'out' ? 'opacity-0' : 'opacity-100'}`}>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">{displayedCharacter.name}</h3>
                  <p className="text-lg text-slate-600 mb-1">{displayedCharacter.concept}</p>
                  <p className="text-md text-slate-500 italic">"{displayedCharacter.catchphrase}"</p>
                </div>
                {/* Thumbnails Row */}
                <div className="mt-8 flex flex-row flex-wrap justify-center gap-3">
                  {thumbnailCharacters.map((char, idx) => {
                    // Extract main color for highlight
                    const colorKey = char?.color.match(/([a-z]+-[0-9]+)/g)?.[0] || "blue-500";
                    const ringColor = {
                      "amber-500": "ring-amber-400",
                      "orange-500": "ring-orange-400",
                      "red-600": "ring-red-400",
                      "orange-600": "ring-orange-500",
                      "blue-600": "ring-blue-400",
                      "indigo-600": "ring-indigo-400",
                      "purple-600": "ring-purple-400",
                      "pink-600": "ring-pink-400",
                      "green-600": "ring-green-400",
                      "emerald-600": "ring-emerald-400",
                      "amber-600": "ring-amber-500",
                      "orange-700": "ring-orange-600",
                      "rose-600": "ring-rose-400",
                      "teal-600": "ring-teal-400",
                      "cyan-600": "ring-cyan-400",
                      "blue-500": "ring-blue-400"
                    }[colorKey] || "ring-blue-400";
                    const isActive = char?.id === displayedCharacter.id;
                    return (
                      <div
                        key={char?.id}
                        className="relative group"
                        onMouseEnter={() => setHoveredThumb(char?.id || null)}
                        onMouseLeave={() => setHoveredThumb(null)}
                        onFocus={() => setHoveredThumb(char?.id || null)}
                        onBlur={() => setHoveredThumb(null)}
                        tabIndex={0}
                        aria-label={char?.name}
                        onClick={() => handleThumbnailClick(char)}
                        role="button"
                        style={{ outline: "none" }}
                      >
                        <img
                          src={char?.image}
                          alt={char?.name}
                          className={clsx(
                            "w-12 h-12 rounded-full object-cover border-2 transition-all duration-200 cursor-pointer",
                            isActive ? `ring-4 ${ringColor} scale-110` : "ring-2 ring-slate-200 opacity-70",
                            "group-hover:scale-125 group-hover:shadow-lg group-hover:border-blue-400 group-focus:scale-125 group-focus:shadow-lg"
                          )}
                          style={{ background: "#fff" }}
                        />
                        {/* Tooltip */}
                        {hoveredThumb === char?.id && (
                          <div className="absolute left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-slate-800 text-white text-xs rounded shadow-lg z-20 whitespace-nowrap">
                            {char?.name}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Audio Player and Transcript */}
          <div className="lg:col-span-2 space-y-6">
            {/* Audio Controls */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={handlePlayPause}
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700 text-white shadow-md focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200"
                      aria-label={isPlaying ? "Pause audio" : "Play audio"}
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>
                    
                    <Button
                      onClick={handleMute}
                      variant="ghost"
                      size="lg"
                      className="text-slate-600 hover:bg-slate-100"
                      aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                  </div>

                  <div className="text-sm px-3 py-1 rounded-lg bg-white/70 border border-slate-200 shadow-sm font-mono text-slate-700 flex items-center min-w-[90px] justify-center">
                    {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(0).padStart(2, '0')}
                    <span className="mx-1 text-slate-400">/</span>
                    {Math.floor(duration / 60)}:{(duration % 60).toFixed(0).padStart(2, '0')}
                  </div>
                </div>

                {/* Custom Interactive Progress Bar */}
                <div
                  ref={progressBarRef}
                  className="w-full h-4 flex items-center cursor-pointer group relative mb-2"
                  onClick={handleSeek}
                  aria-label="Audio progress bar"
                  role="slider"
                  aria-valuenow={currentTime}
                  aria-valuemin={0}
                  aria-valuemax={duration}
                  tabIndex={0}
                >
                  {/* Track */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-2 bg-slate-200 rounded-full" />
                  {/* Progress */}
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-2 bg-blue-500 rounded-full transition-all duration-100"
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                  />
                  {/* Thumb */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2"
                    style={{ left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`, transform: "translate(-50%, -50%)" }}
                  >
                    <div
                      className="w-4 h-4 bg-white border-2 border-blue-500 rounded-full shadow-md transition-all duration-100 cursor-pointer group-hover:scale-110"
                      onMouseDown={handleThumbDrag}
                      tabIndex={0}
                      aria-label="Seek audio"
                      role="slider"
                      aria-valuenow={currentTime}
                      aria-valuemin={0}
                      aria-valuemax={duration}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Transcript */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-slate-50 to-gray-50">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-slate-800 mb-4">
                  Live Transcript
                </h4>
                <div className="text-slate-700 leading-relaxed max-h-96 overflow-y-auto">
                  {introTranscript.map((paragraph, index) => {
                    const isCurrentParagraph = index === currentCharacterIndex;
                    const currentCharacter = characters.find(c => c.id === characterTimings[index]?.id);
                    
                    // Get character colors for highlighting
                    let highlightBg = "bg-blue-50";
                    let highlightBorder = "border-blue-500";
                    let highlightText = "text-blue-900";
                    
                    if (isCurrentParagraph && currentCharacter) {
                      // Extract all color keys (e.g., amber-500, orange-500, etc.) from the color string
                      const colorMatches = currentCharacter.color.match(/([a-z]+-[0-9]+)/g) || [];
                      // Map gradient colors to highlight colors
                      const colorMap: { [key: string]: { bg: string; border: string; text: string } } = {
                        'amber-500': { bg: 'bg-amber-50', border: 'border-amber-500', text: 'text-amber-900' },
                        'orange-500': { bg: 'bg-orange-50', border: 'border-orange-500', text: 'text-orange-900' },
                        'red-600': { bg: 'bg-red-50', border: 'border-red-600', text: 'text-red-900' },
                        'orange-600': { bg: 'bg-orange-50', border: 'border-orange-600', text: 'text-orange-900' },
                        'blue-600': { bg: 'bg-blue-50', border: 'border-blue-600', text: 'text-blue-900' },
                        'indigo-600': { bg: 'bg-indigo-50', border: 'border-indigo-600', text: 'text-indigo-900' },
                        'purple-600': { bg: 'bg-purple-50', border: 'border-purple-600', text: 'text-purple-900' },
                        'pink-600': { bg: 'bg-pink-50', border: 'border-pink-600', text: 'text-pink-900' },
                        'green-600': { bg: 'bg-green-50', border: 'border-green-600', text: 'text-green-900' },
                        'emerald-600': { bg: 'bg-emerald-50', border: 'border-emerald-600', text: 'text-emerald-900' },
                        'amber-600': { bg: 'bg-amber-50', border: 'border-amber-600', text: 'text-amber-900' },
                        'orange-700': { bg: 'bg-orange-50', border: 'border-orange-700', text: 'text-orange-900' },
                        'rose-600': { bg: 'bg-rose-50', border: 'border-rose-600', text: 'text-rose-900' },
                        'teal-600': { bg: 'bg-teal-50', border: 'border-teal-600', text: 'text-teal-900' },
                        'cyan-600': { bg: 'bg-cyan-50', border: 'border-cyan-600', text: 'text-cyan-900' }
                      };
                      // Use the first color found in the colorMap, or fallback to blue
                      const highlightColors = colorMatches.map(c => colorMap[c]).find(Boolean) || { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-900' };
                      highlightBg = highlightColors.bg;
                      highlightBorder = highlightColors.border;
                      highlightText = highlightColors.text;
                    }
                    
                    return (
                      <p 
                        key={index} 
                        ref={paragraphRefs.current[index]}
                        className={`mb-2 p-3 rounded-lg transition-all duration-300 ${
                          isCurrentParagraph 
                            ? `${highlightBg} border-l-4 ${highlightBorder} ${highlightText} font-medium` 
                            : "text-slate-600"
                        }`}
                      >
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Character Progress Indicator */}
        <div className="mt-8 flex justify-center space-x-2">
          {characterTimings.map((timing, index) => {
            const character = characters.find(c => c.id === timing.id);
            return (
              <div
                key={timing.id + index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentCharacterIndex
                    ? "bg-blue-500 scale-125"
                    : index < currentCharacterIndex
                    ? "bg-green-400"
                    : "bg-slate-300"
                }`}
                title={character?.name}
              />
            );
          })}
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />

      {/* Character Detail Modal */}
      <Dialog open={!!modalCharacter} onOpenChange={open => !open && setModalCharacter(null)}>
        <DialogContent>
          {modalCharacter && (
            <ModuleCharacterCard character={{
              ...modalCharacter,
              lessons: modalLessons,
              moduleString: modalModule
            }} />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}; 