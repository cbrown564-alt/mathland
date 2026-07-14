import { Volume2 } from "lucide-react";
import { Character } from "@/core/types/character";
import { EnhancedAudioPlayer } from "./EnhancedAudioPlayer";

interface HearSectionProps {
  content?: string;
  audioUrl?: string;
  transcript?: string;
  character: Character;
  onSpeakingChange?: (speaking: boolean) => void;
}

const hasContent = ({ content, audioUrl }: HearSectionProps) =>
  Boolean(content?.trim() || audioUrl);

/**
 * Renders the "Hear" section. Shows a neutral empty state when audio or
 * transcript content is missing (Path A4).
 */
export const HearSection = ({
  content,
  audioUrl,
  transcript,
  character,
  onSpeakingChange,
}: HearSectionProps) => {
  if (!hasContent({ content, audioUrl, transcript, character })) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <Volume2 className="w-8 h-8 text-slate-400 mx-auto mb-3" />
        <p className="font-semibold text-slate-700">Audio coming soon</p>
        <p className="text-sm text-slate-500 mt-1">
          The narration for this section is still being recorded.
        </p>
      </div>
    );
  }

  return (
    <>
      {content && <div className="text-slate-700 leading-relaxed mb-8">{content}</div>}
      {audioUrl && (
        <EnhancedAudioPlayer
          audioUrl={audioUrl}
          character={character}
          transcript={transcript}
          onPlayingChange={onSpeakingChange}
        />
      )}
    </>
  );
};
