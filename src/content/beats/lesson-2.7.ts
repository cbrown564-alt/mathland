import type { BeatLesson } from "./schema";
import type { VectorPlotState } from "@/core/components/narrative/primitives";
import { interpolateVectorPlot } from "@/core/components/narrative/primitives";

/**
 * Lesson 2.7 — Vera · Basis & Dimension
 * Archetypes: couple ×2 → recap → do · visual: vectorPlot { basis }
 */
export const basisDimensionLesson: BeatLesson<VectorPlotState> = {
  meta: {
    id: "2.7",
    characterId: "vera",
    title: "Basis & Dimension",
    oneLine: "The minimum toolkit that reaches everywhere — with a unique address for each vector.",
    objectives: [
      "Define a basis as linearly independent vectors that span the space",
      "Understand how standard basis vectors work in coordinate systems",
      "Calculate the dimension of a vector space",
      "Express vectors in terms of different bases",
    ],
  },
  visual: { key: "vectorPlot" },
  beats: [
    {
      kind: "couple",
      id: "gps",
      eyebrow: "Vera · Vectors · Beat 1",
      title: "A GPS for any space",
      predict: {
        prompt: "A basis must be linearly independent AND span the space. Can you have a spanning set that isn't a basis?",
        options: [
          { label: "Yes — if it has redundant vectors", value: "yes" },
          { label: "No — spanning always means basis", value: "no" },
        ],
        nudge: {
          yes: "You said yes — redundancy is exactly what keeps a spanning set from being minimal.",
          no: "You said no — scroll and see what extra vectors do to a spanning set.",
        },
      },
      interpolate: interpolateVectorPlot,
      passages: [
        {
          id: "g1",
          eyebrow: "Basis · 1",
          md: "A **basis** is like having the perfect GPS coordinate system — the *minimum* set of independent vectors that can reach everywhere in the space. Just like latitude and longitude give unique coordinates for any Earth location, a basis gives unique coordinates for any vector.",
          state: { u: [1, 0], v: [0, 1], basis: true, emphasis: "none" },
          audioSrc: "/audio/story/2.7/ch1.mp3",
        },
        {
          id: "g2",
          eyebrow: "2",
          md: "A basis must satisfy two conditions: the vectors are **linearly independent** (no redundancy) and they **span** the entire space (reach everywhere). It's the smallest toolkit that still lets you build anything.",
          state: { u: [1.1, 0.2], v: [0.2, 1.1], basis: true, emphasis: "u" },
        },
        {
          id: "g3",
          eyebrow: "3",
          md: "The standard basis in 2D is {[1,0], [0,1]} — perfectly aligned east-west and north-south. Simple, perpendicular, length 1. The most convenient basis for most calculations, like a default map projection.",
          state: { u: [1, 0], v: [0, 1], basis: true, emphasis: "v" },
        },
      ],
      check: {
        question: "A basis for a vector space must…",
        options: [
          "Be linearly independent and span the entire space",
          "Contain exactly one vector",
          "Have all vectors of unit length only",
          "Be the same in every coordinate system",
        ],
        correctAnswer: 0,
        explanation: "Basis = independent + spanning. That's the minimal set of directions that reaches everywhere with no redundancy.",
      },
    },
    {
      kind: "couple",
      id: "dimension",
      eyebrow: "Beat 2",
      title: "Dimension — how many coordinates?",
      interpolate: interpolateVectorPlot,
      passages: [
        {
          id: "d1",
          eyebrow: "Dimension · 1",
          md: "Every vector space has infinitely many possible bases, but they all have the **same number of vectors**. That number is the **dimension** of the space. 2D has dimension 2, 3D has dimension 3 — no matter which basis you choose.",
          state: { u: [1, 1], v: [-1, 1], basis: true, emphasis: "none" },
          audioSrc: "/audio/story/2.7/ch2.mp3",
        },
        {
          id: "d2",
          eyebrow: "2",
          md: "Change of basis is like having multiple languages for the same location. A point might be [3, 4] in standard coordinates but [5, 0] in a basis aligned with your problem — same location, different description. Watch the skewed grid: every intersection is a reachable combination.",
          state: { u: [1.2, 0.8], v: [-0.6, 1.4], basis: true, emphasis: "u" },
        },
        {
          id: "d3",
          eyebrow: "3",
          md: "In machine learning, PCA finds optimal bases for data. Instead of describing customers with age, income, and education separately, PCA might find a basis of \"socioeconomic status\" and \"life stage\" that captures the same information more efficiently. Dimension tells you the degrees of freedom.",
          state: { u: [1.4, 0.6], v: [-0.4, 1.6], basis: true, emphasis: "v" },
        },
      ],
      check: {
        question: "Show that [1, 0] and [1, 1] form a basis for ℝ². Express [3, 5] in this basis.",
        options: [
          "[3,5] = −2[1,0] + 5[1,1]",
          "[3,5] = 3[1,0] + 5[1,1]",
          "[3,5] = 2[1,0] + 3[1,1]",
          "These vectors don't form a basis for ℝ²",
        ],
        correctAnswer: 0,
        explanation: "The vectors are independent and span ℝ². Solving 3 = a + b and 5 = b gives b = 5, a = −2. So [3,5] = −2[1,0] + 5[1,1].",
      },
    },
    {
      kind: "recap",
      id: "recap",
      eyebrow: "Beat 3",
      title: "Land it",
      mantra: "Basis = GPS coordinates for any space! Minimum tools needed to reach everywhere, with a unique address for each location.",
      points: [
        "Basis vectors are the fundamental directions on your map",
        "Dimension = how many independent coordinates you need",
        "Every vector has unique coordinates relative to a given basis",
      ],
    },
    {
      kind: "do",
      id: "climax",
      eyebrow: "Beat 4 · Your turn",
      title: "Build your coordinate system",
      intro: "Switch between standard and custom bases, then match the target coordinates. See how the same arrow gets different labels in each coordinate system.",
      interactive: "basis_explorer",
      goals: [
        { tone: "standard", label: "Use the standard basis {[1,0], [0,1]}" },
        { tone: "custom", label: "Switch to a non-standard basis" },
        { tone: "coords", label: "Express the target vector in the current basis" },
      ],
    },
  ],
  landing: {
    mantra: "Basis = GPS coordinates for any space! Minimum tools needed to reach everywhere, with a unique address for each location.",
    recap: "Independent + spanning = basis. Dimension counts the coordinates. Change of basis = same point, new language.",
  },
};
