import { CheckCircle, Circle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Lesson {
  id: string;
  title: string;
  character: string;
  duration: string;
  status: "available" | "locked" | "completed" | "current";
  description: string;
  moduleCompleted?: boolean;
}

interface LessonRoadmapProps {
  lessons: Lesson[];
  color?: string; // Tailwind gradient classes
}

export const LessonRoadmap = ({ lessons, color = "from-blue-400 to-blue-600" }: LessonRoadmapProps) => {
  return (
    <div className="relative max-w-2xl mx-auto">
      {/* Vertical stepper line */}
      <div className={`absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b ${color}`} style={{ zIndex: 0 }} />
      <div className="space-y-4">
        {lessons.map((lesson, i) => {
          const isCompleted = !!lesson.moduleCompleted;
          return (
            <div key={lesson.id} className="relative flex items-stretch">
              {/* Stepper dot, vertically centered and aligned with the line */}
              <div className="flex flex-col justify-center relative" style={{ width: '2.5rem' }}>
                <div className={`w-4 h-4 rounded-full z-10 absolute left-1/4 -translate-x-1/2 ${
                  isCompleted ? `bg-gradient-to-r ${color}` : `bg-gradient-to-r ${color} opacity-50`
                }`} style={{ marginTop: 'auto', marginBottom: 'auto' }} />
              </div>
              <div className="flex-1">
                <div className="bg-white rounded-xl shadow border border-gray-100 px-6 py-4 relative flex flex-col min-h-[110px]">
                  {/* Top row: lesson info and button */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className={`font-semibold text-sm bg-clip-text text-transparent bg-gradient-to-r ${color}`}>{lesson.id}</span>
                      <span>with {lesson.character}</span>
                      <span className="text-gray-400">{lesson.duration}</span>
                    </div>
                    <Link to={`/lesson/${lesson.id}`}>
                      <button className={`flex items-center gap-1 px-3 py-1 rounded bg-gradient-to-r ${color} hover:opacity-90 text-white text-xs font-semibold`}>
                        Go to Lesson <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                  <div className="font-bold text-slate-800 mb-1 text-base">{lesson.title}</div>
                  <div className="text-sm text-slate-600 mb-2">{lesson.description}</div>
                  {/* Completed tick in bottom right */}
                  {isCompleted && (
                    <div className={`absolute bottom-3 right-4 flex items-center gap-1 text-green-600 text-xs font-semibold bg-green-50 rounded px-2 py-0.5`}>
                      <CheckCircle className="w-4 h-4" /> Completed
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
