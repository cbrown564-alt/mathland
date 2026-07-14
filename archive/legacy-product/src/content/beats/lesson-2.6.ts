import type { BeatLesson } from "./schema";
import type { VectorPlotState } from "@/core/components/narrative/primitives";
import { interpolateVectorPlot } from "@/core/components/narrative/primitives";

/**
 * Lesson 2.6 — Vera · Linear Independence
 * Archetypes: couple → tell → do · visual: vectorPlot { span }
 */
export const linearIndependenceLesson: BeatLesson<VectorPlotState> = {
  meta: {
    id: "2.6",
    characterId: "vera",
    title: "Linear Independence",
    oneLine: "Eliminate redundancy — keep only the directions that open new paths.",
    objectives: [
      "Define linear independence and dependence mathematically",
      "Test sets of vectors for linear independence",
      "Understand the geometric meaning of independence",
      "Identify the maximum number of independent vectors in n dimensions",
    ],
  },
  visual: { key: "vectorPlot" },
  beats: [
    {
      kind: "couple",
      id: "toolkit",
      eyebrow: "Vera · Vectors · Beat 1",
      title: "The perfect exploration toolkit",
      predict: {
        prompt: "You have three direction vectors in 2D. Can all three be genuinely new directions?",
        options: [
          { label: "Yes — more is always better", value: "yes" },
          { label: "No — some must be redundant", value: "no" },
        ],
        nudge: {
          yes: "You said yes — keep that in mind as we test what 'new direction' really means.",
          no: "You said no — scroll and see exactly when a vector becomes a passenger.",
        },
      },
      interpolate: interpolateVectorPlot,
      passages: [
        {
          id: "t1",
          eyebrow: "Independence · 1",
          md: "Independent vectors give you genuinely new directions to explore! Some of my forest paths are *redundant* — if I can reach any point using the river path and the perpendicular path, a third diagonal path doesn't give me new capabilities.",
          state: { u: [3, 1], v: [1, 2.5], span: true, emphasis: "none" },
          audioSrc: "/audio/story/2.6/ch1.mp3",
        },
        {
          id: "t2",
          eyebrow: "2",
          md: "Here's the key question I always ask: **\"Can I get there without this vector?\"** If yes, that vector is redundant — a linear combination of the others. It doesn't add any new directional capabilities.",
          state: { u: [3, 1.2], v: [1.2, 2.5], span: true, emphasis: "u" },
        },
        {
          id: "t3",
          eyebrow: "3",
          md: "Think of your vector toolkit: independent vectors are essential tools that each do something unique. Dependent vectors are duplicates taking up backpack space. In 2D you need exactly 2 independent vectors; in 3D, exactly 3. Any more and you have redundancy.",
          state: { u: [2.5, 1.5], v: [1.5, 2.5], span: true, emphasis: "v" },
        },
      ],
      check: {
        question: "Vectors are linearly independent when…",
        options: [
          "None can be written as a combination of the others",
          "They all have the same magnitude",
          "They all point in the same direction",
          "There are more vectors than dimensions",
        ],
        correctAnswer: 0,
        explanation: "Independence means no vector is redundant — none is expressible as a linear combination of the rest. Each one opens a genuinely new direction.",
      },
    },
    {
      kind: "tell",
      id: "formal",
      eyebrow: "Beat 2",
      title: "The formal test",
      md: `Vectors v₁, v₂, …, vₙ are **linearly independent** if the only solution to c₁v₁ + c₂v₂ + … + cₙvₙ = **0** is when *every coefficient is zero*. If non-zero coefficients exist, the vectors are **linearly dependent** — at least one is redundant.

Geometrically, dependent vectors collapse into lower-dimensional space. Three vectors in 2D? At least one must lie in the span of the other two. Independent vectors span the *full* dimension — a line in 1D, a plane in 2D, all of space in 3D.

In data science, linear independence reveals intrinsic dimensionality. You might have 100 customer variables, but only 5 independent patterns explain most variation — the rest is redundancy. Machine learning models perform better when input features are independent.`,
      check: {
        question: "Are vectors [1, 2], [3, 1], and [4, 3] linearly independent in ℝ²?",
        options: [
          "No — [4,3] = [1,2] + [3,1], so they're dependent",
          "Yes — all three point in different directions",
          "No — you can only have 2 independent vectors in 2D",
          "Yes — the determinant test confirms independence",
        ],
        correctAnswer: 0,
        explanation: "Algebraically, [4,3] = [1,2] + [3,1], so the third vector adds nothing new. In 2D, at most 2 vectors can be independent — with 3, dependence is guaranteed.",
      },
    },
    {
      kind: "do",
      id: "climax",
      eyebrow: "Beat 3 · Your turn",
      title: "Spot the redundancy",
      intro: "Drag the base vectors and adjust coefficients. Make them span the plane, then collapse them to a line — watch when independence breaks.",
      interactive: "span_explorer",
      goals: [
        { tone: "independent", label: "Span the plane · independent u, v" },
        { tone: "dependent", label: "Collapse to a line · collinear vectors" },
      ],
    },
  ],
  landing: {
    mantra: "Independent vectors open new paths — dependent vectors just repeat directions you already have!",
    recap: "Test: c₁v₁ + … + cₙvₙ = 0 only when all c's are zero. In n dimensions, at most n vectors can be independent.",
  },
};
