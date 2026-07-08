import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { LessonStage } from "@/core/components/narrative/LessonStage";
import { LessonBeat } from "@/core/components/narrative/LessonBeat";
import {
  dotProductIntroPredict,
  dotProductIntroPassages,
  dotProductIntroCheck,
} from "@/content/beats/dotProductIntro";

/**
 * Reference for a full v2 *beat* (/lab/beat): predict → coupled reading → check,
 * built from the dotProductIntro content module.
 */
const BeatLabPage = () => {
  const [done, setDone] = useState(false);

  return (
    <LessonStage characterId="vera">
      <header className="sticky top-0 z-30 border-b border-white/5 bg-black/30 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-3">
          <Link to="/lesson/2.3" className="flex items-center gap-1 text-xs text-white/50 transition hover:text-white/90">
            <ArrowLeft className="h-4 w-4" /> Exit
          </Link>
          <span className="font-mono text-[11px] uppercase tracking-widest text-white/40">
            Lab · Beat · predict → couple → check
          </span>
          <Link to="/lab/coupled" className="ml-auto text-xs text-white/40 underline-offset-2 hover:text-white/80 hover:underline">
            scaffold only →
          </Link>
        </div>
      </header>

      <main className="px-5 pb-40 pt-16">
        <LessonBeat
          beat={{
            kind: "couple",
            id: "agree",
            eyebrow: "Vera · Vectors · Beat 1",
            title: "When directions agree",
            predict: dotProductIntroPredict,
            passages: dotProductIntroPassages,
            check: dotProductIntroCheck,
          }}
          lessonVisual={{ key: "vectorPlot" }}
          characterId="vera"
          onComplete={() => setDone(true)}
        />

        {done && (
          <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-6 text-center">
            <p className="font-serif text-lg text-white">Beat complete.</p>
            <p className="mt-2 text-sm text-white/60">
              In the real flow this advances to the next beat; the do beat swaps the read-only picture for the{" "}
              <Link to="/story/2.3" className="underline underline-offset-2 hover:text-white">draggable playground</Link>.
            </p>
          </div>
        )}
      </main>
    </LessonStage>
  );
};

export default BeatLabPage;
