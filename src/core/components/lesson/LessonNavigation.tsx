
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/core/components/ui/button";

interface LessonNavigationProps {
  previousLessonId?: string;
  nextLessonId?: string;
}

export const LessonNavigation = ({ previousLessonId, nextLessonId }: LessonNavigationProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mt-8">
      {previousLessonId ? (
        <Button
          variant="outline"
          onClick={() => navigate(`/lesson/${previousLessonId}`)}
          className="border-slate-300 text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous Lesson
        </Button>
      ) : (
        <div />
      )}

      {nextLessonId ? (
        <Button
          onClick={() => navigate(`/lesson/${nextLessonId}`)}
          className="character-accent text-white hover:opacity-90"
        >
          Next Lesson
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      ) : (
        <Button
          onClick={() => navigate("/module-detail/1")}
          className="character-accent text-white hover:opacity-90"
        >
          Back to Module
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      )}
    </div>
  );
};
