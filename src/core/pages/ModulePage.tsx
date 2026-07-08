import { Clock, Play, ArrowRight } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { LessonRoadmap } from "@/core/components/LessonRoadmap";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { characters } from "@/utils/characterData";
import { modulesData } from "@/utils/modulesData";
import { getLessonOrderForModuleAsync, getLessonDataForModuleAsync } from "@/utils/lessonData";
import { getLessonProgress } from "@/core/hooks/useLessonProgress";
import { LessonData } from "@/core/types/lesson";

const getModuleLessons = async (moduleId: string) => {
  const lessonOrder = await getLessonOrderForModuleAsync(moduleId);
  const lessonPromises = lessonOrder.map(id => getLessonDataForModuleAsync(moduleId, id));
  const lessonData = await Promise.all(lessonPromises);
  return lessonData.filter(Boolean);
};

const getModuleMeta = (moduleId: string) => {
  return modulesData.find(m => String(m.id) === moduleId);
};

const getLessonSectionCount = (lesson: LessonData) => {
  // Count the number of sections for this lesson (should match the sections array in LessonTemplate)
  // Fallback to 8 if not found
  if (!lesson) return 8;
  let count = 0;
  if (lesson.narrativeHook) count++;
  if (lesson.readContent) count++;
  if (lesson.seeContent) count++;
  if (lesson.hearContent) count++;
  if (lesson.doContent) count++;
  if (lesson.memoryAids) count++;
  if (lesson.conceptCheck) count++;
  if (lesson.realWorldConnection) count++;
  // Optionally add more if you have extra sections
  return count;
};

const ModulePage = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<LessonData[]>([]);
  const moduleMeta = getModuleMeta(moduleId || "0");

  useEffect(() => {
    if (!moduleId) return;
    
    const loadLessons = async () => {
      try {
        const lessonData = await getModuleLessons(moduleId);
        const lessonObjs = lessonData.map(data => {
      if (!data) return null;
      const charObj = characters.find(c => c.id === data.characterId);
      const progress = getLessonProgress(data.id);
      const sectionCount = getLessonSectionCount(data);
      const moduleCompleted = progress.completedSections.size >= sectionCount;
      return {
        id: data.id,
        title: data.title,
        character: charObj ? charObj.name.split(' ')[0] : '',
        duration: data.duration,
        status: 'available', // unlock all for testing
        description: data.narrativeHook?.story || data.readContent || "",
        moduleCompleted
      };
    }).filter(Boolean);
    setLessons(lessonObjs);
      } catch (error) {
        console.error('Failed to load lessons:', error);
        setLessons([]);
      }
    };
    
    loadLessons();
  }, [moduleId]);

  if (!moduleMeta) return <div className="p-8 text-center">Module not found.</div>;

  return (
    <div>
      <main>
        <div className="max-w-3xl mx-auto py-12">
          {/* HERO SECTION */}
          <section className="pt-12 pb-8 bg-white relative rounded-2xl shadow">
            {/* Character image top right */}
            {moduleMeta.character?.avatar && (
              <img
                src={moduleMeta.character.avatar}
                alt={moduleMeta.character.name}
                className="absolute top-0 right-0 w-32 h-32 object-contain drop-shadow-xl -mt-10 -mr-10 z-10 select-none pointer-events-none"
                style={{ borderRadius: '2rem' }}
              />
            )}
            <div className="max-w-2xl mx-auto text-center">
              <span className={`inline-block px-3 py-1 bg-opacity-80 rounded-full text-xs font-semibold mb-2 ${moduleMeta.color} text-white`}>
                {moduleMeta.title}
              </span>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">{moduleMeta.subtitle || moduleMeta.title}</h1>
              <div className="text-lg text-slate-600 mb-2">{moduleMeta.description}</div>
              <div className="flex justify-center gap-6 text-sm text-slate-500 mb-4">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {moduleMeta.duration || "?"}</span>
                <span className="flex items-center gap-1"><Play className="w-4 h-4" /> {lessons.length} Lessons</span>
              </div>
              {lessons.length > 0 && (
                <Button size="lg" className={`px-8 py-3 text-lg ${moduleMeta.color} bg-gradient-to-r hover:opacity-90 text-white`} onClick={() => navigate(`/lesson/${lessons[0].id}`)}>
                  Start with Lesson {lessons[0].id} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
            </div>
          </section>

          {/* LEARNING JOURNEY SECTION */}
          <section className="max-w-2xl mx-auto pt-8">
            <h2 className="text-2xl font-bold mb-2">Your Learning <span className="text-slate-700">Journey</span></h2>
            <div className="text-gray-600 mb-6">Complete each lesson in order to unlock the next.</div>
            <LessonRoadmap lessons={lessons} color={moduleMeta.color} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default ModulePage; 