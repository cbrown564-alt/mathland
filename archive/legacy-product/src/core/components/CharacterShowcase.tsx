import { ArrowRight } from "lucide-react";
import { CharacterCard } from "./CharacterCard";
import { characters } from "@/utils/characterData";

export const CharacterShowcase = () => {
  return (
    <section id="characters" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Meet Your Mathematical{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500">
              Guides
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Each mathematical concept comes to life through our delightful character guides, 
            making complex topics approachable and memorable for adult learners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {characters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="inline-flex items-center px-6 py-3 text-lg font-semibold text-green-600 hover:text-green-700 transition-colors">
            Explore All Characters
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
