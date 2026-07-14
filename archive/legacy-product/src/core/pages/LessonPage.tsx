import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { LessonTemplate } from "@/core/components/LessonTemplate";
import { getLessonDataForModuleAsync, getLessonOrderForModuleAsync } from "@/utils/lessonData";
import { LessonData } from "@/core/types/lesson";

const LessonPage = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [lessonOrder, setLessonOrder] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const id = lessonId || "0.1";
  const moduleId = id.split(".")[0];

  useEffect(() => {
    const loadLessonData = async () => {
      setLoading(true);
      try {
        const [lessonData, orderData] = await Promise.all([
          getLessonDataForModuleAsync(moduleId, id),
          getLessonOrderForModuleAsync(moduleId)
        ]);
        setLesson(lessonData || null);
        setLessonOrder(orderData);
      } catch (error) {
        console.error('Failed to load lesson data:', error);
        setLesson(null);
        setLessonOrder([]);
      } finally {
        setLoading(false);
      }
    };

    loadLessonData();
  }, [moduleId, id]);

  if (loading) return <div className="p-8 text-center">Loading lesson...</div>;
  if (!lesson) return <div className="p-8 text-center">Lesson not found.</div>;

  const currentIndex = lessonOrder.indexOf(id);
  const previousLessonId = currentIndex > 0 ? lessonOrder[currentIndex - 1] : undefined;
  const nextLessonId = currentIndex < lessonOrder.length - 1 ? lessonOrder[currentIndex + 1] : undefined;

  return (
    <LessonTemplate
      lesson={lesson}
      previousLessonId={previousLessonId}
      nextLessonId={nextLessonId}
    />
  );
};

export default LessonPage;
