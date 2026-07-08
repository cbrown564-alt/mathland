import { useParams, Link } from "react-router-dom";
import { BeatLessonView } from "@/core/components/narrative/BeatLessonView";
import { getBeatLesson } from "@/content/beats";

/**
 * The v2 lesson route (`/story/:lessonId`): looks up the authored BeatLesson and
 * renders it (immersive stage → paced beats → hands-on climax). The section-form
 * lesson still lives at /lesson/:id for comparison.
 */
const StoryPage = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const id = lessonId || "2.3";
  const lesson = getBeatLesson(id);

  if (!lesson) {
    return (
      <div className="lesson-stage flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center text-white/70">
        <p>No guided lesson has been authored for lesson {id} yet.</p>
        <Link to={`/lesson/${id}`} className="text-sm text-white/50 underline underline-offset-2 hover:text-white/90">
          Open the standard lesson →
        </Link>
      </div>
    );
  }

  return <BeatLessonView lesson={lesson} />;
};

export default StoryPage;
