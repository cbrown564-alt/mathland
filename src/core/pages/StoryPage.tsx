import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { StoryPlayer } from "@/core/components/narrative/StoryPlayer";
import { getStory } from "@/content/stories";
import { getLessonOrderForModuleAsync } from "@/utils/lessonData";

/**
 * Route handler for the Phase C guided-narrative prototype (`/story/:lessonId`).
 * Loads the authored story script (getStory) rather than the raw 8-section
 * lesson; the section-form lesson still lives at /lesson/:id for comparison.
 */
const StoryPage = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const id = lessonId || "2.3";
  const moduleId = id.split(".")[0];

  const story = getStory(id);
  const [lessonOrder, setLessonOrder] = useState<string[]>([]);

  useEffect(() => {
    getLessonOrderForModuleAsync(moduleId)
      .then(setLessonOrder)
      .catch(() => setLessonOrder([]));
  }, [moduleId]);

  if (!story) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center text-white/70"
        style={{ background: "linear-gradient(180deg, #0f0a1a 0%, #1a1030 100%)" }}
      >
        <p>No guided story has been authored for lesson {id} yet.</p>
        <Link to={`/lesson/${id}`} className="text-sm text-white/50 underline underline-offset-2 hover:text-white/90">
          Open the standard lesson →
        </Link>
      </div>
    );
  }

  const currentIndex = lessonOrder.indexOf(id);
  const previousLessonId = currentIndex > 0 ? lessonOrder[currentIndex - 1] : undefined;
  const nextLessonId =
    currentIndex >= 0 && currentIndex < lessonOrder.length - 1 ? lessonOrder[currentIndex + 1] : undefined;

  return <StoryPlayer story={story} previousLessonId={previousLessonId} nextLessonId={nextLessonId} />;
};

export default StoryPage;
