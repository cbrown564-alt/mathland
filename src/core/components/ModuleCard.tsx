import { Lock, CheckCircle, PlayCircle, ArrowRight } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

interface Module {
  id: number;
  title: string;
  subtitle: string;
  character: { name: string; avatar: string } | null;
  topics?: string[];
  status: "available" | "locked" | "completed" | "current";
  description: string;
  color: string;
  prerequisites: number[];
  concepts?: string[];
  roadmapConcepts?: string[];
}

interface ModuleCardProps {
  module: Module;
  index: number;
}

export const ModuleCard = ({ module, index }: ModuleCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/module-detail/${module.id}`);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/module/${module.id}`);
  };

  const getStatusIcon = () => {
    switch (module.status) {
      case "completed":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "current":
        return <PlayCircle className="w-6 h-6 text-orange-500" />;
      case "available":
        return <PlayCircle className="w-6 h-6 text-blue-500" />;
      default:
        return <Lock className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (module.status) {
      case "completed":
        return "Completed";
      case "current":
        return "Continue";
      case "available":
        return "Start Module";
      default:
        return "Locked";
    }
  };

  const isInteractive = module.status === "available" || module.status === "current";

  return (
    <div 
      className={"relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"}
      onClick={handleCardClick}
    >
      {/* Module Header */}
      <div className={`h-20 bg-gradient-to-r ${module.color} flex items-center justify-between px-6 text-white`}>
        <div>
          <h3 className="text-lg font-bold">Module {module.id}</h3>
          <p className="text-sm opacity-90">{module.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Find out more</span>
          <ArrowRight className="w-5 h-5" />
        </div>
      </div>

      {/* Module Content */}
      <div className="p-6">
        <div className="mb-4">
          <h4 className="text-xl font-bold text-gray-800 mb-2">{module.title}</h4>
          {module.character && (
            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
              <img src={module.character.avatar} alt={module.character.name} className="w-6 h-6 rounded-full" />
              Guided by {module.character.name}
            </div>
          )}
        </div>

        <p className="text-gray-600 mb-4 leading-relaxed">{module.description}</p>

        {/* Topics */}
        {Array.isArray(module.topics) && module.topics.length > 0 ? (
          <div className="mb-6">
            <h5 className="text-sm font-semibold text-gray-700 mb-2">Key Topics:</h5>
            <div className="flex flex-wrap gap-2">
              {module.topics.map((topic, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        ) : null}
        {/* Key Concepts (short, single line, from roadmapConcepts if present) */}
        {Array.isArray(module.roadmapConcepts) && module.roadmapConcepts.length > 0 ? (
          <div className="mb-4">
            <span className="text-sm text-gray-700 font-semibold">Key Concepts: </span>
            <span className="text-sm text-gray-600">
              {module.roadmapConcepts.join(' • ')}
            </span>
          </div>
        ) : Array.isArray(module.concepts) && module.concepts.length > 0 && (
          <div className="mb-4">
            <span className="text-sm text-gray-700 font-semibold">Key Concepts: </span>
            <span className="text-sm text-gray-600">
              {module.concepts.slice(0, 3).join(' • ')}
              {module.concepts.length > 3 && ' • ...'}
            </span>
          </div>
        )}

        {/* Prerequisites */}
        {Array.isArray(module.prerequisites) && module.prerequisites.length > 0 ? (
          <div className="mb-6">
            <h5 className="text-sm font-semibold text-gray-700 mb-2">Prerequisites:</h5>
            <div className="flex flex-wrap gap-2">
              {module.prerequisites.map((prereq) => (
                <span
                  key={prereq}
                  className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded"
                >
                  Module {prereq}
                </span>
              ))}
            </div>
          </div>
        ) : (typeof module.prerequisites === 'string' && module.prerequisites) ? (
          <div className="mb-6">
            <h5 className="text-sm font-semibold text-gray-700 mb-2">Prerequisites:</h5>
            <div className="text-xs text-slate-600">{module.prerequisites}</div>
          </div>
        ) : null}

        {/* Action Button */}
        {isInteractive ? (
            <Button
              className={`w-full bg-gradient-to-r ${module.color} hover:opacity-90 text-white`}
            onClick={handleButtonClick}
            >
              {getStatusText()}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        ) : (
          <Button
            className={`w-full bg-gray-300 cursor-not-allowed text-white`}
            disabled
            onClick={handleButtonClick}
          >
            {getStatusText()}
          </Button>
        )}
      </div>

      {/* Connection Line for Flow */}
      {index < 9 && (
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-gradient-to-b from-gray-300 to-transparent"></div>
      )}
    </div>
  );
};
