import { Eye } from "lucide-react";
import { CharacterAvatar } from "@/core/components/CharacterAvatar";
import { LessonData } from "@/core/types/lesson";

interface SeeSectionProps {
  lesson: LessonData;
  character: {
    name: string;
    fullName: string;
    personality: string;
    avatar: string;
  };
}

const hasVisualContent = (lesson: LessonData) =>
  Boolean(lesson.seeVideoUrl?.trim() || lesson.seePreQuote?.trim());

/**
 * Renders the "See" section. Shows a neutral empty state when no video or
 * framing quote is available (Path A4).
 */
export const SeeSection = ({ lesson, character }: SeeSectionProps) => {
  if (!hasVisualContent(lesson)) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <Eye className="w-8 h-8 text-slate-400 mx-auto mb-3" />
        <p className="font-semibold text-slate-700">Visual content coming soon</p>
        <p className="text-sm text-slate-500 mt-1">
          The demonstration for this section is still being prepared.
        </p>
      </div>
    );
  }

  return (
    <>
      {lesson.seePreQuote && (
        <div className="flex items-start gap-4 mb-4">
          <CharacterAvatar src={character.avatar} alt={character.fullName} size="lg" />
          <div className="flex-1">
            <div className="rounded-lg p-4 border-l-4 border-orange-200 bg-orange-50/50">
              <p className="text-slate-700 italic text-sm">{lesson.seePreQuote}</p>
            </div>
          </div>
        </div>
      )}
      {lesson.seeVideoUrl && (
        <div className="w-full">
          <div className="flex justify-center w-full mb-4">
            <div className="aspect-video max-w-2xl w-full rounded-lg overflow-hidden mx-auto">
              <iframe
                className="w-full h-full"
                src={
                  lesson.seeVideoUrl.includes("youtube.com/watch?v=")
                    ? lesson.seeVideoUrl.replace("watch?v=", "embed/")
                    : lesson.seeVideoUrl
                }
                title="Lesson video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
