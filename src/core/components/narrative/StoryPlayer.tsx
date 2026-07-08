import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, RotateCcw, X } from "lucide-react";
import { LessonStory, StoryChapter } from "@/core/types/story";
import { characters } from "@/utils/characterData";
import { CharacterAnimation } from "@/core/components/CharacterAnimation";
import { DotProductExplorer } from "./DotProductExplorer";
import { PersistentAudioBar } from "./PersistentAudioBar";

interface StoryPlayerProps {
  story: LessonStory;
  previousLessonId?: string;
  nextLessonId?: string;
}

const PROGRESS_KEY = (id: string) => `story-progress-${id}`;

function readFurthest(lessonId: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(PROGRESS_KEY(lessonId));
    return raw ? JSON.parse(raw).furthest ?? 0 : 0;
  } catch {
    return 0;
  }
}

function writeProgress(lessonId: string, furthest: number, completed: boolean) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROGRESS_KEY(lessonId), JSON.stringify({ furthest, completed }));
  } catch {
    /* ignore quota */
  }
}

/** Interactive registry — a chapter names its climax component by key. */
const INTERACTIVES: Record<string, React.ComponentType> = {
  dot_product_explorer: DotProductExplorer,
};

/**
 * Phase C, rebuilt: a paced, one-chapter-at-a-time story player.
 *
 * The eight-section form is gone. The character narrates ~5 authored chapters,
 * one on screen at a time; her words float on the immersive stage (no card
 * stack), audio persists at the bottom and the interactive arrives as the
 * climax. Colour is entirely token-driven (data-character → --ch-accent) so it
 * re-themes per character with no code change. Adaptive pacing = the player
 * resumes at the furthest chapter reached, not a wall of ✓/collapse chrome.
 */
export const StoryPlayer = ({ story, nextLessonId }: StoryPlayerProps) => {
  const character = characters.find((c) => c.id === story.characterId);
  const navigate = useNavigate();
  const total = story.chapters.length;

  const [index, setIndex] = useState(() => Math.min(readFurthest(story.lessonId), total - 1));
  const [dir, setDir] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  // Only auto-play a clip after the learner's first navigation gesture.
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioDone, setAudioDone] = useState(false);
  const [finished, setFinished] = useState(false);

  const furthestRef = useRef(index);

  const chapter = story.chapters[index];
  const firstName = character?.name.split(" ")[0] ?? "Your guide";

  // Persist the furthest chapter reached (real adaptive-pacing signal).
  useEffect(() => {
    if (index > furthestRef.current) furthestRef.current = index;
    writeProgress(story.lessonId, furthestRef.current, finished);
  }, [index, finished, story.lessonId]);

  const go = useCallback(
    (delta: number) => {
      setAudioEnabled(true);
      setAudioDone(false);
      setDir(delta);
      setFinished(false);
      setIndex((i) => Math.max(0, Math.min(total - 1, i + delta)));
    },
    [total],
  );

  const next = useCallback(() => {
    if (index >= total - 1) {
      setFinished(true);
      writeProgress(story.lessonId, total - 1, true);
    } else {
      go(1);
    }
  }, [index, total, go, story.lessonId]);

  const prev = useCallback(() => go(-1), [go]);

  const restart = useCallback(() => {
    setAudioEnabled(true);
    setDir(-1);
    setFinished(false);
    setIndex(0);
  }, []);

  // Keyboard paging — ignore while the learner is typing in the interactive.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        prev();
      } else if (e.key === "Escape") {
        navigate(`/lesson/${story.lessonId}`);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, navigate, story.lessonId]);

  const progressPct = useMemo(() => ((index + 1) / total) * 100, [index, total]);

  if (!character) {
    return <div className="flex min-h-screen items-center justify-center text-white/70">Character not found.</div>;
  }

  const Interactive = chapter.interactive ? INTERACTIVES[chapter.interactive] : undefined;

  return (
    <div
      data-character={character.id}
      className="relative min-h-screen overflow-hidden text-white"
      style={{ background: "linear-gradient(180deg, #0f0a1a 0%, #1a1030 100%)" }}
    >
      {/* accent glows — tinted by the active character via color-mix on --ch-accent */}
      <div
        className="pointer-events-none absolute -left-[12%] -top-[18%] h-[55%] w-[55%] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--ch-accent) 32%, transparent), transparent 60%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-[18%] -right-[12%] h-[55%] w-[55%] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--ch-accent-2) 28%, transparent), transparent 60%)" }}
      />

      {/* ===== top chrome: exit · pager · restart ===== */}
      <header className="fixed inset-x-0 top-0 z-30 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <Link
            to={`/lesson/${story.lessonId}`}
            aria-label="Exit story (back to standard lesson)"
            className="text-white/50 transition hover:text-white/90"
          >
            <X className="h-5 w-5" />
          </Link>

          <div className="flex flex-1 items-center gap-3">
            <span className="font-mono text-[11px] tabular-nums text-white/50">
              {index + 1} / {total}
            </span>
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, var(--ch-accent), var(--ch-accent-2))" }}
                animate={{ width: `${progressPct}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              />
            </div>
            <span className="hidden font-mono text-[11px] uppercase tracking-wider text-white/40 sm:inline">
              {character.name.split(" ")[0]}
            </span>
          </div>

          {index > 0 && (
            <button
              onClick={restart}
              aria-label="Start over"
              className="text-white/40 transition hover:text-white/80"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
        </div>
      </header>

      {/* ===== stage: one chapter at a time ===== */}
      <main
        className={
          "relative z-10 mx-auto flex min-h-screen max-w-2xl flex-col px-5 pb-40 pt-24 " +
          (chapter.climax ? "justify-start" : "justify-center")
        }
      >
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={chapter.id}
            custom={dir}
            initial={{ opacity: 0, y: dir >= 0 ? 24 : -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: dir >= 0 ? -24 : 24 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <ChapterView
              chapter={chapter}
              isFirst={index === 0}
              story={story}
              characterId={character.id}
              avatar={character.avatar}
              fullName={character.fullName}
              speaking={speaking}
              Interactive={Interactive}
            />
          </motion.div>
        </AnimatePresence>

        {/* ===== controls ===== */}
        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={prev}
            disabled={index === 0}
            className="flex items-center gap-1.5 text-sm text-white/50 transition enabled:hover:text-white disabled:opacity-25"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          <button
            onClick={next}
            className={
              "group flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg transition active:scale-95 " +
              (audioDone ? "animate-pulse" : "")
            }
            style={{ background: "linear-gradient(135deg, var(--ch-accent), var(--ch-accent-2))" }}
          >
            {index >= total - 1 ? "Finish" : "Continue"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        <p className="mt-4 text-center text-[11px] text-white/25">
          Use ← → to move · Esc to exit
        </p>
      </main>

      {/* ===== persistent audio (fixed to viewport) ===== */}
      {chapter.audioSrc && (
        <PersistentAudioBar
          src={chapter.audioSrc}
          label={`${firstName} · Ch ${index + 1}`}
          autoPlay={audioEnabled}
          onPlayingChange={setSpeaking}
          onEnded={() => setAudioDone(true)}
        />
      )}

      {/* ===== end panel ===== */}
      <AnimatePresence>
        {finished && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-5"
            style={{ background: "rgba(10,7,20,0.82)", backdropFilter: "blur(6px)" }}
          >
            <motion.div
              initial={{ scale: 0.94, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center"
            >
              <div className="mx-auto mb-4 w-fit">
                <CharacterAnimation
                  characterId={character.id}
                  fallbackSrc={character.avatar}
                  alt={character.fullName}
                  size="lg"
                  speaking={false}
                />
              </div>
              <h2 className="font-serif text-2xl text-white">You measured similarity like {firstName}.</h2>
              <p className="mt-2 text-sm text-white/60">
                Positive is together, zero is strangers, negative is opposite — direction and strength.
              </p>
              <div className="mt-6 flex flex-col gap-2">
                {nextLessonId && (
                  <button
                    onClick={() => navigate(`/story/${nextLessonId}`)}
                    className="rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg transition active:scale-95"
                    style={{ background: "linear-gradient(135deg, var(--ch-accent), var(--ch-accent-2))" }}
                  >
                    Next lesson →
                  </button>
                )}
                <button
                  onClick={restart}
                  className="rounded-full border border-white/15 px-5 py-3 text-sm text-white/80 transition hover:bg-white/5"
                >
                  Replay the story
                </button>
                <Link
                  to={`/lesson/${story.lessonId}`}
                  className="py-2 text-xs text-white/40 underline-offset-2 transition hover:text-white/70 hover:underline"
                >
                  Standard section view
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ---------------------------------------------------------------------------

interface ChapterViewProps {
  chapter: StoryChapter;
  isFirst: boolean;
  story: LessonStory;
  characterId: string;
  avatar: string;
  fullName: string;
  speaking: boolean;
  Interactive?: React.ComponentType;
}

const ChapterView = ({
  chapter,
  isFirst,
  story,
  characterId,
  avatar,
  fullName,
  speaking,
  Interactive,
}: ChapterViewProps) => (
  <div>
    <div className="mb-6 flex items-center gap-3">
      <CharacterAnimation
        characterId={characterId}
        fallbackSrc={avatar}
        alt={fullName}
        size="md"
        speaking={speaking}
      />
      <span
        className="font-mono text-[11px] uppercase tracking-[0.2em]"
        style={{ color: "var(--ch-accent-2)" }}
      >
        {chapter.eyebrow}
      </span>
    </div>

    {isFirst && (
      <div className="mb-6">
        <h1 className="font-serif text-4xl leading-tight text-white sm:text-5xl">{story.title}</h1>
        <p className="mt-2 font-serif text-lg italic text-white/55">{story.kicker}</p>
      </div>
    )}

    {/* the narration itself — floating on the stage, not boxed in a card */}
    <p className="font-serif text-2xl leading-relaxed text-white/90 sm:text-[27px] sm:leading-[1.5]">
      {chapter.narration}
    </p>

    {chapter.formula && (
      <div
        className="mt-6 inline-block rounded-xl border px-5 py-3 font-mono text-sm text-white/85 sm:text-base"
        style={{
          borderColor: "color-mix(in srgb, var(--ch-accent) 35%, transparent)",
          background: "color-mix(in srgb, var(--ch-accent) 8%, transparent)",
        }}
      >
        {chapter.formula}
      </div>
    )}

    {chapter.climax && Interactive && (
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur-sm sm:p-4">
        <Interactive />
      </div>
    )}

    {chapter.check && <InlineCheck check={chapter.check} />}
  </div>
);

// ---------------------------------------------------------------------------

const InlineCheck = ({ check }: { check: NonNullable<StoryChapter["check"]> }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const labels = ["A", "B", "C", "D", "E"];
  const isCorrect = selected === check.correctAnswer;

  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="mb-4 font-serif text-lg text-white/90">{check.question}</p>
      <div className="grid gap-2">
        {check.options.map((opt, i) => {
          const reveal = selected !== null;
          const style = !reveal
            ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.07]"
            : i === check.correctAnswer
            ? "border-emerald-400/40 bg-emerald-400/10"
            : selected === i
            ? "border-red-400/40 bg-red-400/10"
            : "border-white/10 bg-white/[0.02] opacity-50";
          return (
            <button
              key={i}
              disabled={reveal}
              onClick={() => setSelected(i)}
              className={"flex items-start gap-2.5 rounded-xl border px-4 py-3 text-left text-sm transition " + style}
            >
              <span className="mt-0.5 font-mono text-xs text-white/50">{labels[i]}</span>
              <span className="text-white/85">{opt}</span>
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div
          className={
            "mt-4 rounded-xl border p-4 text-sm " +
            (isCorrect ? "border-emerald-400/30 bg-emerald-400/5" : "border-amber-400/30 bg-amber-400/5")
          }
        >
          <p className="mb-1 font-semibold text-white">{isCorrect ? "Exactly right." : "Not quite —"}</p>
          <p className="text-white/75">{check.explanation}</p>
          {!isCorrect && (
            <button
              onClick={() => setSelected(null)}
              className="mt-2 text-xs text-white/60 underline underline-offset-2 hover:text-white/90"
            >
              Try again
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default StoryPlayer;
