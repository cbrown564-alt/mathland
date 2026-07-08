import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { LessonStage } from "@/core/components/narrative/LessonStage";
import { CoupledVisual } from "@/core/components/narrative/CoupledVisual";
import { resolveDefaultState, resolveReadOnlyRenderer } from "@/core/components/narrative/visualRegistry";
import { dotProductIntroPassages } from "@/content/beats/dotProductIntro";

/**
 * Reference implementation of the coupled-visual scaffold (v2 first build).
 * Route: /lab/coupled.
 */
const CoupledLabPage = () => {
  const visual = { key: "vectorPlot" as const };
  const renderVisual = resolveReadOnlyRenderer(visual);
  const initialState = resolveDefaultState(visual);

  return (
    <LessonStage characterId="vera">
      <header className="sticky top-0 z-30 border-b border-white/5 bg-black/30 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-3">
          <Link to="/lesson/2.3" className="flex items-center gap-1 text-xs text-white/50 transition hover:text-white/90">
            <ArrowLeft className="h-4 w-4" /> Exit
          </Link>
          <span className="font-mono text-[11px] uppercase tracking-widest text-white/40">
            Lab · Coupled visual · v2 scaffold
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-40 pt-16">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-pink-300/70">Vera · Vectors</p>
        <h1 className="font-serif text-4xl leading-tight text-white sm:text-5xl">The Dot Product</h1>
        <p className="mt-3 max-w-xl font-serif text-lg italic text-white/55">
          Scroll — the diagram on the right follows the words on the left.
        </p>

        <div className="mt-14">
          <CoupledVisual
            passages={dotProductIntroPassages}
            renderVisual={renderVisual}
            initialState={initialState}
          />
        </div>

        <div className="mt-24 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center text-white/60">
          <p className="font-serif text-lg text-white/80">This is the scaffold, not the lesson.</p>
          <p className="mt-2 text-sm">
            Next: a beat wraps this coupling with a quick check, and the do beat swaps the read-only picture for the draggable{" "}
            <Link to="/story/2.3" className="underline underline-offset-2 hover:text-white">playground</Link>.
          </p>
        </div>
      </main>
    </LessonStage>
  );
};

export default CoupledLabPage;
