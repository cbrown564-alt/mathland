import { motion } from "framer-motion";
import { characters } from "@/utils/characterData";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: EASE_OUT_EXPO, delay },
});

export interface ColdOpenMeta {
  id: string;
  title: string;
  oneLine: string;
  characterId: string;
}

interface ColdOpenProps {
  meta: ColdOpenMeta;
  onBegin: () => void;
}

function moduleEyebrow(lessonId: string, characterId: string): string {
  const [mod, les] = lessonId.split(".");
  const char = characters.find((c) => c.id === characterId);
  const moduleLine = char?.modules[0] ?? "";
  const topicMatch = moduleLine.match(/Module \d+:\s*(.+)/);
  const topic = topicMatch?.[1]?.split("&")[0]?.trim() ?? char?.concept ?? "";
  return `Module ${mod} · ${topic} · Lesson ${les}`;
}

export function ColdOpen({ meta, onBegin }: ColdOpenProps) {
  const character = characters.find((c) => c.id === meta.characterId);
  const icon = character?.icon ?? "✦";
  const eyebrow = moduleEyebrow(meta.id, meta.characterId);

  return (
    <section className="relative flex min-h-screen flex-col justify-end overflow-hidden px-6 pb-16 pt-24 sm:px-8 sm:pb-20">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 70% 30%, color-mix(in srgb, var(--ch-accent) 18%, transparent), transparent),
            linear-gradient(to top, #0b0910 0%, transparent 50%)
          `,
        }}
      />

      <motion.div
        className="pointer-events-none absolute right-[5%] top-[10%] flex h-[clamp(120px,25vw,200px)] w-[clamp(120px,25vw,200px)] items-center justify-center rounded-full text-[clamp(3rem,8vw,4rem)]"
        aria-hidden
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: [0, -6, 0],
          boxShadow: [
            "0 0 60px color-mix(in srgb, var(--ch-accent) 35%, transparent)",
            "0 0 100px color-mix(in srgb, var(--ch-accent) 45%, transparent)",
            "0 0 60px color-mix(in srgb, var(--ch-accent) 35%, transparent)",
          ],
        }}
        transition={{
          opacity: { duration: 1, ease: EASE_OUT_EXPO, delay: 0.1 },
          scale: { duration: 1, ease: EASE_OUT_EXPO, delay: 0.1 },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
        style={{
          background: "linear-gradient(135deg, var(--ch-accent), var(--ch-accent-2))",
        }}
      >
        {icon}
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-lg">
        <motion.p
          className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em]"
          style={{ color: "var(--ch-accent-2)" }}
          {...fadeUp(0.2)}
        >
          {eyebrow}
        </motion.p>

        <motion.h1 className="mb-4 font-serif text-[clamp(2rem,5vw,3rem)] leading-[1.1] text-white" {...fadeUp(0.4)}>
          {meta.title}
        </motion.h1>

        <motion.p className="mb-8 text-[1.0625rem] leading-relaxed text-white/55" {...fadeUp(0.6)}>
          {meta.oneLine}
        </motion.p>

        <motion.div {...fadeUp(0.8)}>
          <button
            type="button"
            onClick={onBegin}
            className="v2-cta inline-flex items-center gap-2 rounded-full px-6 py-3 text-[0.9375rem] font-semibold text-white transition hover:scale-[1.03] active:scale-95"
          >
            Begin the expedition →
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default ColdOpen;
