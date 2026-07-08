import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CoupledVisual } from "@/core/components/narrative/CoupledVisual";
import { VectorVisual, VectorState } from "@/core/components/narrative/VectorVisual";
import { dotProductIntroPassages } from "@/content/beats/dotProductIntro";

/**
 * Reference implementation of the coupled-visual scaffold (v2 first build).
 * Lesson 2.3's opening, authored as data: each passage carries the vector state
 * the diagram should morph to as you read it. Audio is a per-passage chip
 * (original Vera voice), not a spine. Route: /lab/coupled.
 */
const CoupledLabPage = () => {
  return (
    <div
      data-character="vera"
      className="min-h-screen text-white"
      style={{ background: "linear-gradient(180deg, #0f0a1a 0%, #1a1030 100%)" }}
    >
      <header className="sticky top-0 z-30 border-b border-white/5 bg-[#0f0a1a]/70 backdrop-blur-md">
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
            renderVisual={(s: VectorState) => <VectorVisual state={s} />}
          />
        </div>

        <div className="mt-24 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center text-white/60">
          <p className="font-serif text-lg text-white/80">This is the scaffold, not the lesson.</p>
          <p className="mt-2 text-sm">
            Next: a beat wraps this coupling with a quick check, and the climax swaps the read-only picture for the draggable{" "}
            <Link to="/story/2.3" className="underline underline-offset-2 hover:text-white">playground</Link>.
          </p>
        </div>
      </main>
    </div>
  );
};

export default CoupledLabPage;
