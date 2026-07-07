import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { modulesData } from "@/utils/modulesData";
import { characters } from "@/utils/characterData";
import { getLessonOrderForModule } from "@/utils/lessonData";
import { isLessonCompleted } from "@/core/hooks/useLessonProgress";
import { CharacterAnimation } from "@/core/components/CharacterAnimation";
import { Header } from "@/core/components/Header";
import { Footer } from "@/core/components/Footer";

interface Zone {
  id: number;
  title: string;
  characterId: string;
  characterName: string;
  avatar: string;
  color: string;
  totalLessons: number;
  completedLessons: number;
}

const SECTION_COUNT = 8;

const WorldMapPage = () => {
  const zones = useMemo<Zone[]>(() => {
    return modulesData.map((module) => {
      const character = characters.find(
        (c) => c.name === module.character.name || c.fullName === module.character.name
      );
      const characterId = character?.id ?? "ollie";
      const order = getLessonOrderForModule(String(module.id));
      const completed = order.filter((id) => isLessonCompleted(id, SECTION_COUNT)).length;
      return {
        id: module.id,
        title: module.title,
        characterId,
        characterName: module.character.name,
        avatar: module.character.avatar,
        color: character?.color ?? "from-gray-400 to-gray-600",
        totalLessons: order.length || module.lessons,
        completedLessons: completed
      };
    });
  }, []);

  const explored = zones.filter((z) => z.completedLessons > 0).length;
  const totalLessons = zones.reduce((s, z) => s + z.totalLessons, 0);
  const totalCompleted = zones.reduce((s, z) => s + z.completedLessons, 0);
  const currentZone = zones.find((z) => z.completedLessons < z.totalLessons) ?? zones[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-3">The Mathland Map</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Ten territories, each guarded by a mathematical critter. Explore them in order, or jump to
            any guide who can help you right now.
          </p>
          <div className="mt-4 inline-flex items-center gap-4 text-sm text-slate-600">
            <span>
              <span className="font-bold text-slate-800">{explored}</span> / {zones.length} territories explored
            </span>
            <span className="text-slate-300">•</span>
            <span>
              <span className="font-bold text-slate-800">{totalCompleted}</span> / {totalLessons} lessons complete
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {zones.map((zone) => {
            const pct = zone.totalLessons
              ? Math.round((zone.completedLessons / zone.totalLessons) * 100)
              : 0;
            const isCurrent = zone.id === currentZone.id;
            const isComplete = zone.completedLessons >= zone.totalLessons && zone.totalLessons > 0;

            return (
              <Link key={zone.id} to={`/module-detail/${zone.id}`}>
                <motion.div
                  whileHover={{ y: -4 }}
                  data-character={zone.characterId}
                  className={`relative rounded-2xl border-2 overflow-hidden bg-white shadow-md h-full ${
                    isCurrent ? "character-accent-border ring-4 ring-[var(--ch-accent)]" : "border-slate-200"
                  }`}
                >
                  <div className={`h-28 bg-gradient-to-br ${zone.color} flex items-center justify-center`}>
                    <CharacterAnimation
                      characterId={zone.characterId}
                      fallbackSrc={zone.avatar}
                      alt={zone.characterName}
                      size="xl"
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                        Module {zone.id}
                      </span>
                      {isComplete && (
                        <span className="text-xs font-bold text-green-600">Completed</span>
                      )}
                      {isCurrent && !isComplete && (
                        <span className="text-xs font-bold character-accent-text">Current</span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-800 mt-1 leading-tight">{zone.title}</h3>
                    <p className="text-xs text-slate-500 mb-3">{zone.characterName}</p>

                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span>{zone.completedLessons}/{zone.totalLessons} lessons</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full character-accent transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WorldMapPage;
