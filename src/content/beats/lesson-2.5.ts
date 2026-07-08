import type { BeatLesson } from "./schema";
import type { VectorPlotState } from "@/core/components/narrative/primitives";
import { interpolateVectorPlot } from "@/core/components/narrative/primitives";

/**
 * Lesson 2.5 — Vera · Linear Combinations
 * Archetypes: couple ×2 → do · visual: vectorPlot { span }
 */
export const linearCombinationsLesson: BeatLesson<VectorPlotState> = {
  meta: {
    id: "2.5",
    characterId: "vera",
    title: "Linear Combinations",
    oneLine: "Build any vector from simpler pieces — like a recipe with coefficients.",
    objectives: [
      "Express vectors as linear combinations of other vectors",
      "Understand the span of a set of vectors geometrically",
      "Calculate linear combinations algebraically",
      "Visualize how coefficients control the resulting vector",
    ],
  },
  visual: { key: "vectorPlot" },
  beats: [
    {
      kind: "couple",
      id: "recipe",
      eyebrow: "Vera · Vectors · Beat 1",
      title: "Recipes for new vectors",
      predict: {
        prompt: "If you mix 2 parts of one direction with 3 parts of another — can you reach any point in the plane?",
        options: [
          { label: "Yes — with the right recipe", value: "yes" },
          { label: "No — only along one line", value: "no" },
        ],
        nudge: {
          yes: "You said yes — scroll and watch how coefficients fill the span.",
          no: "You said no — that only happens when the base vectors are parallel.",
        },
      },
      passages: [
        {
          id: "r1",
          eyebrow: "Linear combinations · 1",
          md: "Any destination in my forest can be reached by mixing basic directions in the right proportions. A linear combination **c₁v₁ + c₂v₂ + … + cₙvₙ** is like a recipe: mix 2 parts east-vector with 3 parts north-vector to reach your destination.",
          state: { u: [2, 0.5], v: [0.5, 2], emphasis: "u" },
          audioSrc: "/audio/story/2.5/ch1.mp3",
        },
        {
          id: "r2",
          eyebrow: "2",
          md: "The coefficients *c₁, c₂, …* control how much of each base vector to include. Change the recipe and the result vector moves — same ingredients, different proportions, completely different destinations.",
          state: { u: [2.5, 0.8], v: [0.8, 2.5], emphasis: "v" },
        },
        {
          id: "r3",
          eyebrow: "3",
          md: "Think of it as mixing paint colors or following multiple treasure map clues at once. Different amounts of each base ingredient create completely different results — but you can create *any* color with the right recipe.",
          state: { u: [3, 1], v: [1, 3], emphasis: "none" },
        },
      ],
      check: {
        question: "Which expression correctly describes a linear combination of vectors v₁ and v₂?",
        options: [
          "c₁v₁ + c₂v₂ — mix vectors with scalar coefficients",
          "v₁ · v₂ — multiply the vectors component-wise",
          "v₁ / v₂ — divide one vector by another",
          "v₁ × v₂ — take the cross product",
        ],
        correctAnswer: 0,
        explanation: "A linear combination scales each base vector by a coefficient and adds them. That's c₁v₁ + c₂v₂ — the recipe metaphor in math form.",
      },
    },
    {
      kind: "couple",
      id: "span",
      eyebrow: "Beat 2",
      title: "The span — everywhere you can go",
      interpolate: interpolateVectorPlot,
      passages: [
        {
          id: "s1",
          eyebrow: "Span · 1",
          md: "The **span** of a set of vectors is every possible destination you can reach using linear combinations. Given vectors v₁ and v₂, their span is the entire collection of vectors c₁v₁ + c₂v₂.",
          state: { u: [3, 0.6], v: [0.6, 3], span: true, emphasis: "none" },
          audioSrc: "/audio/story/2.5/ch2.mp3",
        },
        {
          id: "s2",
          eyebrow: "2",
          md: "Two non-parallel vectors in a plane? Their span fills the *entire plane*. Three non-coplanar vectors in space? Their span fills all of 3D. Watch the shaded region — that's every point you can reach.",
          state: { u: [3.2, 1], v: [1, 3.2], span: true, emphasis: "u" },
        },
        {
          id: "s3",
          eyebrow: "3",
          md: "Color mixing in graphics uses this perfectly: every color is a linear combination of red, green, and blue. Financial portfolios combine asset vectors with allocation percentages. Recipe scaling adjusts ingredient proportions — all linear combinations.",
          state: { u: [2.8, 1.4], v: [1.4, 2.8], span: true, emphasis: "v" },
        },
      ],
      check: {
        question: "Two non-parallel vectors in ℝ² span…",
        options: [
          "The entire plane — every 2D vector is reachable",
          "Only a single line through the origin",
          "Just the two vectors themselves",
          "Nothing — span requires three vectors",
        ],
        correctAnswer: 0,
        explanation: "Two non-parallel (linearly independent) vectors in 2D span the full plane. Every point is some combination c₁v₁ + c₂v₂.",
      },
    },
    {
      kind: "do",
      id: "climax",
      eyebrow: "Beat 3 · Your turn",
      title: "Mix the vectors",
      intro: "Mix u and v with the sliders. Land each outcome — from zero, to one direction only, to a true 2D combination that fills the plane.",
      interactive: "span_explorer",
      goals: [
        { tone: "zero", label: "Zero combo · a = b = 0" },
        { tone: "u_only", label: "u only · b ≈ 0" },
        { tone: "span2d", label: "Fill the plane · both coefficients active" },
      ],
    },
  ],
  landing: {
    mantra: "Every vector is built from simpler pieces — like mixing paint colors or following multiple treasure map clues at once!",
    recap: "Linear combination: c₁v₁ + c₂v₂. Span: all reachable destinations. Coefficients are your recipe.",
  },
};
