import type { BeatLesson } from "./schema";
import type { VectorState } from "@/core/components/narrative/VectorVisual";

/**
 * Lesson 2.2 — Vera · Vector Addition & Scalar Multiplication
 * Archetypes: couple ×2 → do · visual: vectorPlot { sum, scale }
 */
export const vectorAdditionLesson: BeatLesson<VectorState> = {
  meta: {
    id: "2.2",
    characterId: "vera",
    title: "Addition & Scalar Multiplication",
    oneLine: "Combine journeys tip-to-tail, then stretch or flip with scalars.",
    objectives: [
      "Add vectors using both geometric and algebraic methods",
      "Apply the commutative property of vector addition",
      "Multiply vectors by scalars and understand the geometric effect",
      "Understand vector subtraction as addition of negative vectors",
      "Apply vector operations to solve real-world problems",
    ],
  },
  visual: { key: "vectorPlot" },
  beats: [
    {
      kind: "couple",
      id: "combine",
      eyebrow: "Vera · Vectors · Beat 1",
      title: "Combining journeys",
      predict: {
        prompt: "Vera walks [3, 2], then [1, 4]. Before you read — does the order of those two legs change where she ends up?",
        options: [
          { label: "Yes — order matters", value: "yes" },
          { label: "No — same destination either way", value: "no" },
        ],
        nudge: {
          yes: "You said order matters — scroll and watch the green sum arrow.",
          no: "You said same destination — see if the picture backs you up.",
        },
      },
      passages: [
        {
          id: "c1",
          eyebrow: "Tip-to-tail · 1",
          md: "Max the squirrel and I start from different trees but want to meet at the waterfall. To combine two journeys, place the **tail of the second arrow at the tip of the first** — that's tip-to-tail addition.",
          state: { u: [3, 2], v: [1, 4], emphasis: "none", sum: true },
        },
        {
          id: "c2",
          eyebrow: "2",
          md: "The **sum u + v** is the direct shortcut from start to finish — the green arrow. Algebraically it's just adding matching components: [a, b] + [c, d] = [a+c, b+d].",
          state: { u: [3, 2], v: [1, 4], emphasis: "v", sum: true },
        },
        {
          id: "c3",
          eyebrow: "3",
          md: "Here's the magic: **u + v = v + u**. Follow clue A then clue B, or B then A — you land at the same treasure. Vector addition is *commutative*.",
          state: { u: [1, 4], v: [3, 2], emphasis: "u", sum: true },
        },
        {
          id: "c4",
          eyebrow: "4",
          md: "For [3, 2] + [1, 4] the sum is **[4, 6]**. Netflix, GPS, and game engines all add vectors like this — stacking small movements into one net displacement.",
          state: { u: [3, 2], v: [1, 4], emphasis: "none", sum: true },
        },
      ],
      check: {
        question: "If Vera walks vector [3, 2] and then vector [1, 4], what's her final displacement?",
        options: [
          "[4, 6] — add components; order doesn't matter",
          "[3, 8] — multiply the vectors",
          "[2, 2] — average the two vectors",
          "[4, 6] — but only if she walks them in that exact order",
        ],
        correctAnswer: 0,
        explanation: "[3,2] + [1,4] = [4,6]. The commutative property guarantees the same sum regardless of order.",
      },
    },
    {
      kind: "couple",
      id: "scale",
      eyebrow: "Beat 2",
      title: "Stretch, shrink, flip",
      passages: [
        {
          id: "s1",
          eyebrow: "Scalar multiply · 1",
          md: "Multiplying a vector by a **scalar** (a plain number) rescales the arrow. **2v** doubles the length; **½v** halves it — same direction, different stride.",
          state: { u: [2.5, 1.5], v: [0.5, 0.5], emphasis: "u", scale: 2 },
        },
        {
          id: "s2",
          eyebrow: "2",
          md: "A *negative* scalar flips the direction: **−v** points the opposite way. Subtraction is just adding the flip: **u − v = u + (−v)**.",
          state: { u: [3, 2], v: [1, 1], emphasis: "u", scale: -1 },
        },
        {
          id: "s3",
          eyebrow: "3",
          md: "|k| > 1 stretches, |k| < 1 shrinks, k < 0 flips. Computer graphics animates characters by adding motion vectors and scaling them frame by frame — same rules, billions of times a second.",
          state: { u: [2, 1.5], v: [0.5, 0.5], emphasis: "u", scale: 0.5 },
        },
      ],
      check: {
        question: "What does −2[3, 1] produce?",
        options: [
          "[−6, −2] — flip direction and double the length",
          "[6, 2] — just double the length",
          "[−3, −1] — flip only, no scaling",
          "[0, 0] — negatives cancel",
        ],
        correctAnswer: 0,
        explanation: "Scalar −2 multiplies each component: −2×3 = −6 and −2×1 = −2. The arrow points opposite and is twice as long.",
      },
    },
    {
      kind: "do",
      id: "climax",
      eyebrow: "Beat 3 · Your turn",
      title: "Build the sum",
      intro: "Drag u and v. The green arrow is always their sum — try to hit each target.",
      interactive: "vector_addition_explorer",
      goals: [
        { tone: "sum46", label: "Make u + v = [4, 6]" },
        { tone: "flip", label: "Flip u into the negative quadrant" },
        { tone: "long", label: "Stretch the sum past length 6.5" },
      ],
    },
  ],
  landing: {
    mantra: "Tip-to-tail takes you there — start where the first arrow ends, and draw the second arrow from there!",
    recap: "Add components, swap order freely, and let scalars stretch or flip the journey.",
  },
};
