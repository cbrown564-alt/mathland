import { ArrowRight } from "lucide-react";
import { Button } from "@/core/components/ui/button";

interface ModuleCharacter {
  id: string;
  name: string;
  animal: string;
  concept: string;
  tagline: string;
  description: string;
  color: string;
  image: string;
  lessons: string[];
  moduleString?: string;
}

interface ModuleCharacterCardProps {
  character: ModuleCharacter;
}

export const ModuleCharacterCard = ({ character }: ModuleCharacterCardProps) => {
  const lessonCount = character.lessons.length;
  // Extract module number for link
  let moduleNumber = "";
  if (character.moduleString) {
    const match = character.moduleString.match(/Module (\d+)/);
    if (match) {
      moduleNumber = match[1];
    }
  }
  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
      {/* Character Header */}
      <div className={`h-32 bg-gradient-to-r ${character.color} p-6 flex items-center justify-center relative`}>
        <img 
          src={character.image} 
          alt={character.name}
          className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
        />
        {/* Lessons Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-700">
          {lessonCount} lesson{lessonCount !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Character Info */}
      <div className="p-6">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-1">{character.name}</h3>
          <p className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-2">
            {character.animal}
          </p>
          <p className="text-lg font-semibold text-gray-700">
            {character.concept}
          </p>
        </div>

        <div className="text-center mb-4">
          <p className={`text-sm font-medium bg-gradient-to-r ${character.color} bg-clip-text text-transparent`}>
            "{character.tagline}"
          </p>
        </div>

        <p className="text-sm text-gray-600 text-center mb-6 leading-relaxed">
          {character.description}
        </p>

        {/* Module Info */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 text-center">Guides you through:</h4>
          <div className="text-xs text-gray-600 text-center">
            {character.moduleString}
          </div>
        </div>

        {moduleNumber ? (
          <Button
            className={`w-full bg-gradient-to-r ${character.color} hover:opacity-90 text-white group-hover:scale-105 transition-transform`}
            asChild
          >
            <a href={`/module/${moduleNumber}`}>
              Start with {character.name}
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        ) : (
          <Button 
            className={`w-full bg-gradient-to-r ${character.color} hover:opacity-90 text-white group-hover:scale-105 transition-transform`}
            disabled
          >
            Start with {character.name}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};
