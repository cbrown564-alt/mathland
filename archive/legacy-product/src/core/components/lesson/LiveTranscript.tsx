import * as React from "react";
import { TranscriptWindow } from "../../hooks/useAudioTranscript";

interface LiveTranscriptProps {
  transcript: string[];
  currentTranscriptIdx: number;
  getTranscriptTimeWindows: (transcript: string[], audioDuration: number) => TranscriptWindow[];
  audioDuration: number;
}

export const LiveTranscript: React.FC<LiveTranscriptProps> = ({ 
  transcript, 
  currentTranscriptIdx,
  getTranscriptTimeWindows,
  audioDuration 
}) => {
  const paraRefs = React.useRef<(HTMLParagraphElement | null)[]>([]);

  React.useEffect(() => {
    if (paraRefs.current[currentTranscriptIdx]) {
      paraRefs.current[currentTranscriptIdx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentTranscriptIdx]);

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {transcript.map((para, i) => (
        <p
          key={i}
          ref={el => paraRefs.current[i] = el}
          className={`transition-all duration-300 px-2 py-1 rounded-md ${
            i === currentTranscriptIdx 
              ? 'bg-blue-100 text-blue-900 font-semibold shadow' 
              : 'text-slate-700 opacity-70'
          }`}
        >
          {para}
        </p>
      ))}
    </div>
  );
};