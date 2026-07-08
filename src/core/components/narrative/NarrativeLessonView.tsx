import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronDown, Compass } from "lucide-react";
import { LessonData } from "@/core/types/lesson";
import { characters } from "@/utils/characterData";
import { CharacterAnimation } from "@/core/components/CharacterAnimation";
import { DotProductExplorer } from "./DotProductExplorer";
import { PersistentAudioBar } from "./PersistentAudioBar";

interface NarrativeLessonViewProps {
  lesson: LessonData;
  previousLessonId?: string;
  nextLessonId?: string;
}

// The eight section ids, in narrative order. Matches the section-form lesson so
// progress keys stay compatible (Path C2 reads the same localStorage the
// section-form writes).
const BEAT_IDS = [
  "narrative",
  "read",
  "see",
  "hear",
  "do",
  "memory",
  "concept",
  "realworld",
] as const;
type BeatId = (typeof BEAT_IDS)[number];

const BEAT_META: Record<BeatId, { label: string }> = {
  narrative: { label: "Hook" },
  read: { label: "Read" },
  see: { label: "See" },
  hear: { label: "Hear" },
  do: { label: "Do" },
  memory: { label: "Remember" },
  concept: { label: "Check" },
  realworld: { label: "Real World" },
};

const PROGRESS_KEY = (id: string) => `lesson-progress-${id}`;

/** Read completed sections for a lesson from localStorage (same format as useLessonProgress). */
function readCompleted(lessonId: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(PROGRESS_KEY(lessonId));
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set<string>((parsed.completedSections || []) as string[]);
  } catch {
    return new Set();
  }
}

/** Persist completed sections back to localStorage + dispatch the shared event. */
function writeCompleted(lessonId: string, completed: Set<string>, currentSection: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      PROGRESS_KEY(lessonId),
      JSON.stringify({ completedSections: Array.from(completed), currentSection })
    );
    window.dispatchEvent(
      new CustomEvent("lessonProgressUpdate", {
        detail: { lessonId, completedSections: Array.from(completed), currentSection },
      })
    );
  } catch {
    /* ignore quota errors */
  }
}

/**
 * The Phase C prototype: lesson 2.3 (Vera · The Dot Product) as one continuous,
 * dark, character-led scroll story (C1), with adaptive pacing from stored
 * progress (C2) and the DotProductExplorer as the inline climax (C3).
 *
 * Beats reuse the lesson's own content (no per-section completion footers) — a
 * beat is marked complete when it scrolls into view, so pacing lingers on
 * un-viewed beats and remembers mastered ones across visits.
 */
export const NarrativeLessonView = ({
  lesson,
  previousLessonId,
  nextLessonId,
}: NarrativeLessonViewProps) => {
  const character = characters.find((c) => c.id === lesson.characterId);
  const navigate = useNavigate();

  const [completed, setCompleted] = useState<Set<string>>(() => readCompleted(lesson.id));
  const [activeBeat, setActiveBeat] = useState<BeatId>("narrative");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcriptIdx, setTranscriptIdx] = useState(0);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const beatRefs = useRef<Partial<Record<BeatId, HTMLDivElement | null>>>({});
  const completedRef = useRef(completed);
  completedRef.current = completed;

  const transcript = useMemo(() => lesson.hearTranscript ?? [], [lesson.hearTranscript]);

  // Adaptive pacing (C2): collapse beats already mastered on first mount so
  // returning learners skip ahead to what they haven't seen.
  useEffect(() => {
    const already = readCompleted(lesson.id);
    const pre = new Set<string>();
    for (const id of BEAT_IDS) {
      if (already.has(id) && id !== "do") pre.add(id); // never auto-collapse the climax
    }
    setCollapsed(pre);
  }, [lesson.id]);

  // IntersectionObserver: mark a beat complete + set active as it scrolls in.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the most-visible entry as the active beat.
        let best: { id: BeatId; ratio: number } | null = null;
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.beatId as BeatId;
          if (!id) continue;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
            // Mark complete on view (idempotent — only writes when it changes).
            if (!completedRef.current.has(id)) {
              setCompleted((prev) => {
                const next = new Set(prev);
                next.add(id);
                writeCompleted(lesson.id, next, id);
                return next;
              });
            }
          }
          if (!best || entry.intersectionRatio > best.ratio) {
            best = { id, ratio: entry.intersectionRatio };
          }
        }
        if (best) setActiveBeat(best.id);
      },
      // Track multiple thresholds so we catch the moment a beat is ~55% visible.
      { threshold: [0, 0.3, 0.55, 0.8], rootMargin: "-20% 0px -35% 0px" }
    );

    for (const id of BEAT_IDS) {
      const el = beatRefs.current[id];
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [lesson.id]);

  if (!character) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white/70">
        Character not found for this lesson.
      </div>
    );
  }

  const progressPct = Math.round((completed.size / BEAT_IDS.length) * 100);

  const toggleCollapse = (id: BeatId) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const gotoLesson = (id?: string) => {
    if (id) navigate(`/story/${id}`);
  };

  return (
    <div
      data-character={character.id}
      className="relative min-h-screen overflow-hidden text-white"
      style={{ background: "linear-gradient(180deg, #0f0a1a 0%, #1a1030 100%)" }}
    >
      {/* soft accent glows (scr-narrative .glow1/.glow2) */}
      <div
        className="pointer-events-none absolute -left-[10%] -top-[20%] h-[60%] w-[60%] rounded-full opacity-60 blur-2xl"
        style={{ background: "radial-gradient(circle, rgba(167,139,250,0.30), transparent 60%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-[20%] -right-[10%] h-[60%] w-[60%] rounded-full opacity-60 blur-2xl"
        style={{ background: "radial-gradient(circle, rgba(236,72,153,0.25), transparent 60%)" }}
      />

      {/* ===== sticky progress rail ===== */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#0f0a1a]/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Link
            to={`/lesson/${lesson.id}`}
            className="flex items-center gap-1 text-xs text-white/50 transition hover:text-white/80"
            aria-label="Back to standard lesson view"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Standard view</span>
          </Link>

          <CharacterAnimation
            characterId={character.id}
            fallbackSrc={character.avatar}
            alt={character.fullName}
            size="sm"
            speaking={isSpeaking}
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-xs uppercase tracking-widest text-white/50">
                Lesson {lesson.id} · {BEAT_META[activeBeat].label}
              </span>
              <span className="font-mono text-[11px] text-white/40 tabular-nums">{progressPct}%</span>
            </div>
            <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%`, background: "linear-gradient(90deg, #a78bfa, #ec4899)" }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ===== story stage ===== */}
      <main className="relative z-10 mx-auto max-w-3xl px-4 pb-40 pt-8">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-pink-300/70">
          {character.name} · {lesson.duration}
        </p>
        <h1 className="font-serif text-3xl leading-tight tracking-tight text-white sm:text-4xl">
          {lesson.title}
        </h1>

        <div className="mt-10 space-y-6">
          {/* HOOK */}
          <Beat
            id="narrative"
            label={BEAT_META.narrative.label}
            done={completed.has("narrative")}
            active={activeBeat === "narrative"}
            setRef={(el) => { beatRefs.current.narrative = el; }}
          >
            <p className="font-serif text-xl leading-relaxed text-white/85">
              {lesson.narrativeHook.story}
            </p>
            <SpeechBubble character={character}>
              {lesson.narrativeHook.characterMessage}
            </SpeechBubble>
          </Beat>

          {/* READ */}
          <Beat
            id="read"
            label={BEAT_META.read.label}
            done={completed.has("read")}
            active={activeBeat === "read"}
            collapsed={collapsed.has("read")}
            onToggle={() => toggleCollapse("read")}
            setRef={(el) => { beatRefs.current.read = el; }}
          >
            <p className="leading-relaxed text-white/75">{lesson.readContent}</p>
            {lesson.coreConcepts?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {lesson.coreConcepts.map((c, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}
          </Beat>

          {/* SEE */}
          <Beat
            id="see"
            label={BEAT_META.see.label}
            done={completed.has("see")}
            active={activeBeat === "see"}
            collapsed={collapsed.has("see")}
            onToggle={() => toggleCollapse("see")}
            setRef={(el) => { beatRefs.current.see = el; }}
          >
            <p className="leading-relaxed text-white/75">{lesson.seeContent}</p>
            {lesson.seeVideoUrl ? (
              <div className="mt-4 aspect-video w-full overflow-hidden rounded-xl border border-white/10">
                <iframe
                  className="h-full w-full"
                  src={lesson.seeVideoUrl.replace("watch?v=", "embed/")}
                  title="See"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-dashed border-white/10 bg-white/[0.02] px-4 py-3 text-sm italic text-white/40">
                <Compass className="h-4 w-4" /> No video for this lesson — the climax below is where you'll see it.
              </div>
            )}
          </Beat>

          {/* HEAR */}
          <Beat
            id="hear"
            label={BEAT_META.hear.label}
            done={completed.has("hear")}
            active={activeBeat === "hear"}
            setRef={(el) => { beatRefs.current.hear = el; }}
          >
            <p className="leading-relaxed text-white/75">{lesson.hearContent}</p>
            {transcript.length > 0 && (
              <div className="mt-4 max-h-56 space-y-1.5 overflow-y-auto pr-1">
                {transcript.map((para, i) => (
                  <p
                    key={i}
                    className={
                      "rounded-md px-2 py-1 text-sm transition-all duration-300 " +
                      (i === transcriptIdx && isSpeaking
                        ? "bg-white/10 text-white"
                        : "text-white/45")
                    }
                  >
                    {para}
                  </p>
                ))}
              </div>
            )}
            <p className="mt-3 text-xs italic text-white/40">
              ▶ Use the audio bar below — it keeps playing as you scroll.
            </p>
          </Beat>

          {/* DO — the climax (C3) */}
          <Beat
            id="do"
            label={BEAT_META.do.label}
            done={completed.has("do")}
            active={activeBeat === "do"}
            highlight
            setRef={(el) => { beatRefs.current.do = el; }}
          >
            <div className="mb-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-pink-300/70">
                The Climax
              </p>
              <p className="mt-1 leading-relaxed text-white/80">{lesson.doContent}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur-sm">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white/80">
                <Compass className="h-4 w-4 text-pink-300" />
                Dot Product Explorer
              </div>
              <DotProductExplorer />
            </div>
          </Beat>

          {/* MEMORY */}
          <Beat
            id="memory"
            label={BEAT_META.memory.label}
            done={completed.has("memory")}
            active={activeBeat === "memory"}
            collapsed={collapsed.has("memory")}
            onToggle={() => toggleCollapse("memory")}
            setRef={(el) => { beatRefs.current.memory = el; }}
          >
            <blockquote className="border-l-2 border-pink-400/50 pl-4 font-serif text-lg italic text-white/85">
              “{lesson.memoryAids?.mantra}”
            </blockquote>
            <p className="mt-3 leading-relaxed text-white/65">
              <span className="text-white/45">Picture: </span>
              {lesson.memoryAids?.visual}
            </p>
          </Beat>

          {/* CONCEPT CHECK */}
          <ConceptCheckBeat
            lesson={lesson}
            done={completed.has("concept")}
            active={activeBeat === "concept"}
            collapsed={collapsed.has("concept")}
            onToggle={() => toggleCollapse("concept")}
            setRef={(el) => { beatRefs.current.concept = el; }}
          />

          {/* REAL WORLD */}
          <Beat
            id="realworld"
            label={BEAT_META.realworld.label}
            done={completed.has("realworld")}
            active={activeBeat === "realworld"}
            collapsed={collapsed.has("realworld")}
            onToggle={() => toggleCollapse("realworld")}
            setRef={(el) => { beatRefs.current.realworld = el; }}
          >
            <p className="leading-relaxed text-white/75">{lesson.realWorldConnection}</p>
          </Beat>
        </div>

        {/* ===== end-of-story footer ===== */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
          {progressPct >= 100 ? (
            <p className="font-serif text-xl text-white">
              Story complete. <span className="text-pink-300">You measured similarity like Vera.</span>
            </p>
          ) : (
            <p className="text-white/60">
              {BEAT_IDS.length - completed.size} beat{BEAT_IDS.length - completed.size === 1 ? "" : "s"} to go — keep scrolling.
            </p>
          )}

          <div className="mt-5 flex items-center justify-between">
            <button
              onClick={() => gotoLesson(previousLessonId)}
              disabled={!previousLessonId}
              className="flex items-center gap-1.5 text-sm text-white/60 transition enabled:hover:text-white disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" /> Previous
            </button>
            <Link
              to={`/lesson/${lesson.id}`}
              className="text-sm text-white/50 underline-offset-2 transition hover:text-white/80 hover:underline"
            >
              Standard section view
            </Link>
            <button
              onClick={() => gotoLesson(nextLessonId)}
              disabled={!nextLessonId}
              className="flex items-center gap-1.5 text-sm text-white/60 transition enabled:hover:text-white disabled:opacity-30"
            >
              Next <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </main>

      {/* ===== persistent audio bar (lives here so playback survives scroll) ===== */}
      {lesson.hearAudioUrl && (
        <PersistentAudioBar
          audioUrl={lesson.hearAudioUrl}
          transcript={transcript}
          onPlayingChange={setIsSpeaking}
          onTimeUpdate={({ index }) => setTranscriptIdx(index)}
        />
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface BeatProps {
  id: BeatId;
  label: string;
  done: boolean;
  active: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
  highlight?: boolean;
  setRef: (el: HTMLDivElement | null) => void;
  children: React.ReactNode;
}

/** A single scroll beat: frosted-glass card with an optional collapse affordance. */
const Beat = ({ id, label, done, active, collapsed, onToggle, highlight, setRef, children }: BeatProps) => {
  const collapsible = Boolean(onToggle);
  return (
    <section
      data-beat-id={id}
      ref={setRef}
      className={
        "scroll-mt-20 rounded-2xl border p-5 backdrop-blur-sm transition-colors duration-300 sm:p-6 " +
        (highlight
          ? "border-pink-400/30 bg-white/[0.05] shadow-[0_0_40px_rgba(236,72,153,0.08)]"
          : active
          ? "border-white/15 bg-white/[0.05]"
          : "border-white/10 bg-white/[0.03]")
      }
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-widest text-white/40">
            {label}
          </span>
          {done && (
            <span className="flex items-center gap-1 text-[11px] text-emerald-300/80">
              <CheckCircle2 className="h-3.5 w-3.5" /> mastered
            </span>
          )}
        </div>
        {collapsible && (
          <button
            onClick={onToggle}
            aria-label={collapsed ? "Expand" : "Collapse"}
            className="text-white/40 transition hover:text-white/70"
          >
            <ChevronDown className={"h-4 w-4 transition-transform " + (collapsed ? "" : "rotate-180")} />
          </button>
        )}
      </div>
      {!collapsed && children}
    </section>
  );
};

/** Vera's speech bubble — large serif text in an accent-tinted card. */
const SpeechBubble = ({
  character,
  children,
}: {
  character: { name: string };
  children: React.ReactNode;
}) => (
  <div className="mt-5 rounded-2xl border-l-2 border-pink-400/50 bg-white/[0.04] p-4">
    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-pink-300/70">
      {character.name.split(" ")[0]} says
    </p>
    <p className="font-serif text-lg italic leading-relaxed text-white/90">{children}</p>
  </div>
);

/** Self-contained concept check beat (dark-themed). */
const ConceptCheckBeat = ({
  lesson,
  done,
  active,
  collapsed,
  onToggle,
  setRef,
}: {
  lesson: LessonData;
  done: boolean;
  active: boolean;
  collapsed: boolean;
  onToggle: () => void;
  setRef: (el: HTMLDivElement | null) => void;
}) => {
  const cc = lesson.conceptCheck;
  const [selected, setSelected] = useState<number | null>(null);
  const isCorrect = selected === cc.correctAnswer;

  const labels = ["A", "B", "C", "D", "E"];
  return (
    <Beat
      id="concept"
      label={BEAT_META.concept.label}
      done={done}
      active={active}
      collapsed={collapsed}
      onToggle={onToggle}
      setRef={setRef}
    >
      <p className="mb-4 font-serif text-lg text-white/90">{cc.question}</p>
      <div className="grid gap-2">
        {cc.options.map((opt, i) => {
          const isSel = selected === i;
          const reveal = selected !== null;
          const style = !reveal
            ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.07]"
            : i === cc.correctAnswer
            ? "border-emerald-400/40 bg-emerald-400/10"
            : isSel
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
            (isCorrect
              ? "border-emerald-400/30 bg-emerald-400/5 text-emerald-100"
              : "border-red-400/30 bg-red-400/5 text-red-100")
          }
        >
          <p className="mb-1 font-semibold">{isCorrect ? "Exactly right." : "Not quite."}</p>
          <p className="text-white/75">{cc.explanation}</p>
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
    </Beat>
  );
};

export default NarrativeLessonView;
