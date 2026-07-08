import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { NarrativeLessonView } from "@/core/components/narrative/NarrativeLessonView";
import { getLessonDataForModuleAsync, getLessonOrderForModuleAsync } from "@/utils/lessonData";
import { LessonData } from "@/core/types/lesson";

/**
 * Route handler for the Phase C narrative prototype (`/story/:lessonId`). Mirrors
 * LessonPage's async data-loading so the story reuses the exact same lesson data
 * + ordering as the section-form view — only the presentation differs.
 */
const StoryPage = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [lessonOrder, setLessonOrder] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const id = lessonId || "2.3";
  const moduleId = id.split(".")[0];

  useEffect(() => {
    const loadLessonData = async () => {
      setLoading(true);
      try {
        const [lessonData, orderData] = await Promise.all([
          getLessonDataForModuleAsync(moduleId, id),
          getLessonOrderForModuleAsync(moduleId),
        ]);
        setLesson(lessonData || null);
        setLessonOrder(orderData);
      } catch (error) {
        console.error("Failed to load lesson data:", error);
        setLesson(null);
        setLessonOrder([]);
      } finally {
        setLoading(false);
      }
    };

    loadLessonData();
  }, [moduleId, id]);

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center text-white/60"
        style={{ background: "linear-gradient(180deg, #0f0a1a 0%, #1a1030 100%)" }}
      >
        Loading story…
      </div>
    );
  }
  if (!lesson) {
    return (
      <div
        className="flex min-h-screen items-center justify-center text-white/60"
        style={{ background: "linear-gradient(180deg, #0f0a1a 0%, #1a1030 100%)" }}
      >
        Lesson not found.
      </div>
    );
  }

  const currentIndex = lessonOrder.indexOf(id);
  const previousLessonId = currentIndex > 0 ? lessonOrder[currentIndex - 1] : undefined;
  const nextLessonId = currentIndex < lessonOrder.length - 1 ? lessonOrder[currentIndex + 1] : undefined;

  return (
    <NarrativeLessonView
      lesson={lesson}
      previousLessonId={previousLessonId}
      nextLessonId={nextLessonId}
    />
  );
};

export default StoryPage;
