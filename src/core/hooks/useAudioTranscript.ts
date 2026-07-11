import * as React from "react";

export interface TranscriptWindow {
  start: number;
  end: number;
}

export const useAudioTranscript = (transcript?: string[], audioDuration: number = 0) => {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [currentTranscriptIdx, setCurrentTranscriptIdx] = React.useState(0);

  // Helper: calculate word-based time windows for transcript
  const getTranscriptTimeWindows = React.useCallback((transcript: string[], audioDuration: number): TranscriptWindow[] => {
    if (!transcript || transcript.length === 0 || audioDuration === 0) return [];
    // Add 2 virtual words for each '...' in a paragraph
    const wordCounts = transcript.map(p => {
      const base = p.split(/\s+/).length;
      const extra = (p.includes('...') ? 3 : 0);
      return base + extra;
    });
    const totalWords = wordCounts.reduce((a, b) => a + b, 0);
    let acc = 0;
    return wordCounts.map((count, i) => {
      const start = (acc / totalWords) * audioDuration;
      acc += count;
      const end = (acc / totalWords) * audioDuration;
      return { start, end };
    });
  }, []);

  const handleAudioTimeUpdate = React.useCallback((currentTime: number) => {
    if (!transcript || audioDuration === 0) return;
    const windows = getTranscriptTimeWindows(transcript, audioDuration);
    const idx = windows.findIndex(w => currentTime >= w.start && currentTime < w.end);
    setCurrentTranscriptIdx(idx === -1 ? transcript.length - 1 : idx);
  }, [transcript, audioDuration, getTranscriptTimeWindows]);

  return {
    audioRef,
    currentTranscriptIdx,
    getTranscriptTimeWindows,
    handleAudioTimeUpdate
  };
};
