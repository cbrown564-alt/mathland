import type { BeatLesson } from "./schema";
import type { VectorState } from "@/core/components/narrative/VectorVisual";

/**
 * Lesson 2.4 — Vera · Vector Norms
 * Archetypes: couple ×2 → do · visual: vectorPlot { unitCircle }
 */
export const vectorNormsLesson: BeatLesson<VectorState> = {
  meta: {
    id: "2.4",
    characterId: "vera",
    title: "Vector Norms",
    oneLine: "Three rulers for measuring how far a vector really reaches.",
    objectives: [
      "Calculate the L₂ (Euclidean) norm using the distance formula",
      "Understand different types of norms: L₁, L₂, and L∞",
      "Create unit vectors by normalizing any vector",
      "Compare different distance metrics for practical problems",
      "Apply norms to measure data similarity and clustering",
    ],
  },
  visual: { key: "vectorPlot" },
  beats: [
    {
      kind: "couple",
      id: "euclidean",
      eyebrow: "Vera · Vectors · Beat 1",
      title: "How far did I travel?",
      predict: {
        prompt: "Vector [3, 4] — before you read, what is its straight-line length (L₂ norm)?",
        options: [
          { label: "5", value: "five" },
          { label: "7", value: "seven" },
          { label: "12", value: "twelve" },
        ],
        nudge: {
          five: "You said 5 — scroll and see if the unit circle agrees.",
          seven: "You said 7 — that's the city-block distance. Watch which norm the diagram highlights.",
          twelve: "You said 12 — check the formula as you scroll.",
        },
      },
      passages: [
        {
          id: "e1",
          eyebrow: "L₂ norm · 1",
          md: "After a long hike I want one number: *how far did I actually go?* The **L₂ (Euclidean) norm** $||\\mathbf{v}|| = \\sqrt{x^2 + y^2}$ measures straight-line distance — as the crow flies.",
          state: { u: [3, 4], v: [0.4, 0.4], emphasis: "u", unitCircle: true },
        },
        {
          id: "e2",
          eyebrow: "2",
          md: "For **[3, 4]**: $\\sqrt{9 + 16} = \\sqrt{25} =$ **5**. The dashed circle shows every point one unit from the origin — compare your arrow's length to that ruler.",
          state: { u: [3, 4], v: [1, 0], emphasis: "u", unitCircle: true },
        },
        {
          id: "e3",
          eyebrow: "3",
          md: "A **unit vector** has norm 1 — direction only. To normalize any vector, divide by its length: $\\hat{\\mathbf{u}} = \\mathbf{v} / ||\\mathbf{v}||$. For [3, 4] that gives [0.6, 0.8].",
          state: { u: [0.6, 0.8], v: [1, 0], emphasis: "u", unitCircle: true },
        },
      ],
      check: {
        question: "Vector [3, 4] represents Vera's displacement. Find its L₂ norm and a unit vector in the same direction.",
        options: [
          "Norm = 5, unit vector = [0.6, 0.8]",
          "Norm = 7, unit vector = [3/7, 4/7]",
          "Norm = 12, unit vector = [1, 1]",
          "Norm = 3.5, unit vector = [0.5, 0.5]",
        ],
        correctAnswer: 0,
        explanation: "L₂ norm: √(3² + 4²) = 5. Unit vector: [3,4]/5 = [0.6, 0.8] — same direction, length exactly 1.",
      },
    },
    {
      kind: "couple",
      id: "metrics",
      eyebrow: "Beat 2",
      title: "Three ways to measure distance",
      passages: [
        {
          id: "m1",
          eyebrow: "Other norms · 1",
          md: "Not every adventure is a straight line. The **L₁ (Manhattan) norm** $||\\mathbf{v}||_1 = |x| + |y|$ counts city-block steps — only right-angle turns allowed.",
          state: { u: [3, 4], v: [0.4, 0.4], emphasis: "u", unitCircle: true },
        },
        {
          id: "m2",
          eyebrow: "2",
          md: "The **L∞ (maximum) norm** $||\\mathbf{v}||_\\infty = \\max(|x|, |y|)$ asks: what's your longest single-axis move? For [3, 4] that's **4** — while L₁ gives 7 and L₂ gives 5.",
          state: { u: [3, 4], v: [0.4, 0.4], emphasis: "u", unitCircle: true },
        },
        {
          id: "m3",
          eyebrow: "3",
          md: "Machine learning picks the norm that fits the problem: L₂ for clustering similar customers, L₁ for sparse recommendations, L∞ for outlier detection. Different tools, different shaped \"unit balls.\"",
          state: { u: [2.5, 3.5], v: [0.4, 0.4], emphasis: "u", unitCircle: true },
        },
      ],
      check: {
        question: "Which norm best models walking on a city grid with only 90° turns?",
        options: [
          "L₁ (Manhattan) — sum of |x| and |y|",
          "L₂ (Euclidean) — straight-line distance",
          "L∞ (maximum) — largest coordinate",
          "All three give the same answer always",
        ],
        correctAnswer: 0,
        explanation: "City-block distance adds horizontal and vertical legs — exactly the L₁ norm |x| + |y|.",
      },
    },
    {
      kind: "do",
      id: "climax",
      eyebrow: "Beat 3 · Your turn",
      title: "Measure and normalize",
      predict: {
        prompt: "Can every non-zero vector be scaled down to length exactly 1?",
        options: [
          { label: "Yes — divide by its norm", value: "yes" },
          { label: "No — some vectors can't be normalized", value: "no" },
        ],
        nudge: {
          yes: "You said yes — try shrinking any arrow onto the unit circle.",
          no: "You said no — drag and see if normalization always works.",
        },
      },
      intro: "Drag the vector and compare L₂, L₁, and L∞ live. Land each norm challenge.",
      interactive: "vector_norms_explorer",
      goals: [
        { tone: "classic", label: "Land on [3, 4] · L₂ = 5" },
        { tone: "unit", label: "Normalize · L₂ ≈ 1 on the dashed circle" },
        { tone: "manhattan", label: "Hit L₁ = 7 · city-block distance" },
      ],
    },
  ],
  landing: {
    mantra: "Straight line vs. city blocks vs. longest coordinate — different adventures need different distance measurements!",
    recap: "L₂ for crow-flies distance, L₁ for city grids, L∞ for worst-case coordinates — then normalize to get pure direction.",
  },
};
