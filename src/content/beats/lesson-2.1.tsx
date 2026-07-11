import type { BeatLesson } from "./schema";
import type { VectorPlotState } from "@/core/components/narrative/primitives";

/**
 * Lesson 2.1 — Vera · Vector Basics
 * Archetypes: couple ×2 → do · visual: vectorPlot (single vector, components)
 */
export const vectorBasicsLesson: BeatLesson<VectorPlotState> = {
  meta: {
    id: "2.1",
    characterId: "vera",
    title: "Vector Basics",
    oneLine: "Arrows with purpose — magnitude and direction in one package.",
    objectives: [
      "Define vectors as quantities with both magnitude and direction",
      "Distinguish between scalars and vectors in real-world contexts",
      "Use proper vector notation including component form",
      "Calculate vector magnitude using the distance formula",
      "Identify unit vectors and zero vectors",
    ],
  },
  visual: { key: "vectorPlot" },
  beats: [
    {
      kind: "couple",
      id: "journey",
      eyebrow: "Vera · Vectors · Beat 1",
      title: "Arrows with purpose",
      predict: {
        prompt: 'A friend says "walk 5 kilometers." Before you read — is that enough information to pin down a displacement vector?',
        options: [
          { label: "Yes — 5 is the whole story", value: "yes" },
          { label: "No — you still need a direction", value: "no" },
        ],
        nudge: {
          yes: "You said yes — scroll and see what happens when direction is missing.",
          no: "You said no — watch how the arrow fills in the missing piece.",
        },
      },
      passages: [
        {
          id: "p1",
          eyebrow: "The forest · 1",
          md: "I'm planning a hike through the forest. Someone tells me to walk **5 kilometers** — and I immediately ask: *which way?* A plain number is a **scalar**: size only, no direction.",
          state: { u: [4.5, 0], v: [0, 0], emphasis: "u", singleVector: true },
        },
        {
          id: "p2",
          eyebrow: "2",
          md: "A **vector** answers both questions at once — *how far* and *which way*. Think of it as GPS instructions that actually work: not just \"go 3 miles,\" but \"go 3 miles northeast.\"",
          state: { u: [3.5, 2.5], v: [0, 0], emphasis: "u", singleVector: true },
        },
        {
          id: "p3",
          eyebrow: "3",
          md: "On a grid we write a vector as an ordered pair **[x, y]** — east-west, then north-south. Walk 4 meters east, then 3 north: the displacement is **[4, 3]**.",
          state: { u: [4, 3], v: [0, 0], emphasis: "u", singleVector: true },
        },
        {
          id: "p4",
          eyebrow: "4",
          md: "The arrow's length is the **magnitude**: $||\\mathbf{v}|| = \\sqrt{x^2 + y^2}$. For [4, 3] that's $\\sqrt{16 + 9} =$ **5** — the straight-line distance, no matter how you wandered to get there.",
          state: { u: [4, 3], v: [0, 0], emphasis: "u", singleVector: true },
        },
      ],
      check: {
        question: "Vera walks 4 meters east, then 3 meters north. What is the magnitude of her displacement vector?",
        options: [
          "5 meters — use the Pythagorean theorem on [4, 3]",
          "7 meters — add the legs together",
          "1 meter — subtract the smaller from the larger",
          "12 meters — multiply 4 × 3",
        ],
        correctAnswer: 0,
        explanation: "The displacement is [4, 3]. Its magnitude is √(4² + 3²) = √25 = 5 meters — the hypotenuse of the right triangle.",
      },
    },
    {
      kind: "couple",
      id: "notation",
      eyebrow: "Beat 2",
      title: "The language of vectors",
      passages: [
        {
          id: "n1",
          eyebrow: "Notation · 1",
          md: "You'll see vectors as bold **v**, with an arrow $\\vec{v}$, or as a column of components. All three names point at the same mathematical object — a journey with a start and a direction.",
          state: { u: [3, 2], v: [0, 0], emphasis: "u", singleVector: true },
        },
        {
          id: "n2",
          eyebrow: "2",
          md: "A **unit vector** has magnitude exactly 1 — pure direction, no extra stretch. Point due east? That's [1, 0]. The zero vector **0** has no length and no direction at all.",
          state: { u: [1, 0], v: [0, 0], emphasis: "u", unitCircle: true, singleVector: true },
        },
        {
          id: "n3",
          eyebrow: "3",
          md: "Vectors are the language of anything with direction *and* size: wind velocity, GPS fixes, forces in physics, even customer-preference arrows in data science. Once you start seeing them, they're everywhere.",
          state: { u: [2.8, 3.2], v: [0, 0], emphasis: "u", singleVector: true },
        },
      ],
      check: {
        question: "Which quantity is a scalar, not a vector?",
        options: [
          "Temperature in the forest — 22°C",
          "Wind blowing northeast at 15 km/h",
          "A displacement of [2, −1] meters",
          "Force pushing a crate at 50 newtons east",
        ],
        correctAnswer: 0,
        explanation: "Temperature has magnitude only — no direction. Wind, displacement, and force all need a direction to be complete vectors.",
      },
    },
    {
      kind: "do",
      id: "climax",
      eyebrow: "Beat 3 · Your turn",
      title: "Plot your own vector",
      predict: {
        prompt: "Before you drag — can a vector with components [4, 3] have a magnitude other than 5?",
        options: [
          { label: "Yes — components don't fix length", value: "yes" },
          { label: "No — [4, 3] always has magnitude 5", value: "no" },
        ],
        nudge: {
          yes: "You said yes — try landing on [4, 3] and read the magnitude.",
          no: "You said no — drag there and confirm the readout.",
        },
      },
      intro: "Your turn in the coordinate plane. Drag the arrowhead, watch the components and magnitude update, and land each target.",
      interactive: "vector_basics_explorer",
      goals: [
        { tone: "classic", label: "Land on [4, 3] · magnitude 5" },
        { tone: "unit", label: "Shrink to a unit vector · |v| ≈ 1" },
        { tone: "five", label: "Any vector with |v| = 5" },
      ],
    },
  ],
  landing: {
    mantra: "Every vector is a journey with distance and direction — just like my forest explorations!",
    recap: "Scalars tell you how much; vectors tell you how much *and* which way.",
  },
};
