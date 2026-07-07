import { LessonData } from "@/core/types/lesson";
import { customDoComponents } from "@/interactive";
import { InteractiveFrame } from "@/core/theme/InteractiveFrame";
import { characters } from "@/utils/characterData";

interface DoSectionProps {
  lesson: LessonData;
}

export const DoSection = ({ lesson }: DoSectionProps) => {
  const { doType, doEmbedUrl, doComponent, doInstructions } = lesson;
  const characterId = lesson.characterId ?? "ollie";
  const character = characters.find((c) => c.id === characterId);
  const fallbackSrc = character?.avatar ?? "/lovable-uploads/ollie.png";

  let content = null;

  if (doType === "desmos" || doType === "geogebra") {
    content = (
      <div className="w-full flex justify-center my-6">
        <iframe
          src={doEmbedUrl}
          title="Interactive Math Tool"
          className="w-full max-w-2xl aspect-video rounded-lg border"
          allowFullScreen
        />
      </div>
    );
  } else if (doType === "custom" && doComponent && customDoComponents[doComponent]) {
    const CustomComponent = customDoComponents[doComponent];
    content = (
      <div className="my-6">
        <InteractiveFrame characterId={characterId} fallbackSrc={fallbackSrc} title={character?.name}>
          <CustomComponent lesson={lesson} />
        </InteractiveFrame>
      </div>
    );
  } else {
    content = <div className="text-slate-500 italic">No interactive activity available for this lesson.</div>;
  }

  return (
    <div>
      {doInstructions && (
        <div className="mb-4 text-slate-700">{doInstructions}</div>
      )}
      {content}
    </div>
  );
}; 