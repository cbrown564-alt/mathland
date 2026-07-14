import { ArrowRight } from "lucide-react";
import { Button } from "@/core/components/ui/button";

interface Character {
  id: string;
  name: string;
  animal: string;
  concept: string;
  tagline: string;
  description: string;
  gradientClass: string;
  image: string;
}

interface CharacterCardProps {
  character: Character;
}

export const CharacterCard = ({ character }: CharacterCardProps) => {
  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
      {/* Character Image */}
      <div className={`h-48 ${character.gradientClass} p-6 flex items-center justify-center`}>
        <img 
          src={character.image} 
          alt={character.name}
          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
        />
      </div>

      {/* Character Info */}
      <div className="p-6">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-1">{character.name}</h3>
          <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">
            {character.animal}
          </p>
          <p className="text-lg font-semibold text-gray-700 mt-2">
            {character.concept}
          </p>
        </div>

        <div className="text-center mb-4">
          <p className={`text-sm font-medium ${character.gradientClass} bg-clip-text text-transparent`}>
            "{character.tagline}"
          </p>
        </div>

        <p className="text-sm text-gray-600 text-center mb-6 leading-relaxed">
          {character.description}
        </p>

        <Button 
          className={`w-full ${character.gradientClass} hover:opacity-90 text-white group-hover:scale-105 transition-transform`}
        >
          Meet {character.name.split(' ')[0]}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};
