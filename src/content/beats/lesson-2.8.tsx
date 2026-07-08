import type { BeatLesson } from "./schema";

/**
 * Lesson 2.8 — Vera · Vector Spaces (abstract)
 * Archetypes: tell ×3 → couple → recap · minimal visual (escape hatch)
 */

/** Minimal static illustration for abstract spaces — not lerp-able. */
function AbstractSpaceVisual() {
  const nodes = [
    { label: "ℝ²", sub: "arrows in the plane", x: 80, y: 100 },
    { label: "ℝ³", sub: "3D coordinates", x: 220, y: 70 },
    { label: "Pₙ", sub: "polynomials", x: 360, y: 100 },
    { label: "M₂ₓ₂", sub: "matrices", x: 150, y: 220 },
    { label: "F(X)", sub: "functions", x: 290, y: 220 },
  ];
  return (
    <div className="w-full">
      <svg viewBox="0 0 440 300" className="w-full select-none" role="img" aria-label="Examples of vector spaces">
        <defs>
          <radialGradient id="as-glow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="rgba(167,139,250,0.15)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="440" height="300" fill="url(#as-glow)" rx="12" />
        {nodes.map((n) => (
          <g key={n.label}>
            <rect
              x={n.x - 52}
              y={n.y - 28}
              width="104"
              height="56"
              rx="10"
              fill="rgba(255,255,255,0.04)"
              stroke="rgba(255,255,255,0.12)"
            />
            <text x={n.x} y={n.y - 4} textAnchor="middle" fill="var(--ch-accent)" fontFamily="monospace" fontSize="14" fontWeight="600">
              {n.label}
            </text>
            <text x={n.x} y={n.y + 14} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontFamily="sans-serif" fontSize="10">
              {n.sub}
            </text>
          </g>
        ))}
        <line x1="220" y1="150" x2="80" y2="100" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <line x1="220" y1="150" x2="360" y2="100" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <line x1="220" y1="150" x2="150" y2="220" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <line x1="220" y1="150" x2="290" y2="220" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <circle cx="220" cy="150" r="6" fill="var(--ch-accent)" opacity="0.6" />
        <text x="220" y="175" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontFamily="monospace" fontSize="9">
          same rules everywhere
        </text>
      </svg>
    </div>
  );
}

interface AbstractState {
  _void: true;
}

export const vectorSpacesLesson: BeatLesson<AbstractState> = {
  meta: {
    id: "2.8",
    characterId: "vera",
    title: "Vector Spaces",
    oneLine: "Universal rules for addition and scaling — the same laws work everywhere.",
    objectives: [
      "Understand vector space axioms and their universal applicability",
      "Recognize examples of vector spaces beyond geometric vectors",
      "Identify subspaces within larger vector spaces",
      "Connect vector spaces to real-world applications in data science",
    ],
  },
  visual: { render: () => <AbstractSpaceVisual /> },
  beats: [
    {
      kind: "tell",
      id: "universal",
      eyebrow: "Vera · Vectors · Beat 1",
      title: "Universal navigation laws",
      md: `The same navigation principles work everywhere! Whether I'm exploring a 2D forest, flying through 3D space, or navigating abstract mathematical worlds, the same fundamental rules apply. That's the power of **vector spaces** — universal mathematical laws.

Vector spaces are any collections that follow the basic rules: you can **add** vectors, **multiply by scalars**, there's a **zero vector**, and everything behaves predictably. Many mathematical objects qualify — even when they don't look like arrows.`,
    },
    {
      kind: "tell",
      id: "axioms",
      eyebrow: "Beat 2",
      title: "The rules of the universe",
      md: `A vector space needs just two operations: vector addition and scalar multiplication. But they must follow specific rules — addition commutative and associative, scalar multiplication distributive, and there must be zero and additive inverse elements.

The beautiful thing is how many objects form vector spaces. **Polynomials** form one — add them, scale them. **Functions** form one. **Matrices** form one. Even solution sets to homogeneous equations form subspaces. Same rules, vastly different objects.

**Subspaces** are vector spaces inside larger ones — closed under addition and scalar multiplication. If you add two vectors from a subspace, you stay inside. Think of them as countries within the vector space universe, each obeying the same laws.`,
      check: {
        question: "Verify: does the set of all 2×2 matrices form a vector space? What is its dimension?",
        options: [
          "Yes — dimension 4 (four independent basis matrices)",
          "No — matrices don't follow vector addition rules",
          "Yes — dimension 2",
          "No — scalar multiplication doesn't apply to matrices",
        ],
        correctAnswer: 0,
        explanation: "2×2 matrices satisfy all vector space axioms. Any matrix is a linear combination of four basis matrices (one 1 in each position), so the dimension is 4.",
      },
    },
    {
      kind: "tell",
      id: "practice",
      eyebrow: "Beat 3",
      title: "Spaces beyond arrows",
      md: `Machine learning models operate in high-dimensional vector spaces where each dimension is a data feature. Neural networks move through these abstract spaces finding patterns — impossible to visualize, but governed by the same rules I use for forest navigation.

**Linear transformations** are the fundamental forces of vector space physics. They preserve structure — linear combinations go to linear combinations. Computer graphics, data compression, and recommendation engines all rely on this preservation.`,
    },
    {
      kind: "couple",
      id: "couple",
      eyebrow: "Beat 4",
      title: "One picture, many worlds",
      passages: [
        {
          id: "c1",
          eyebrow: "Examples · 1",
          md: "Picture vector spaces as different worlds that all follow the same fundamental physics. Whether it's 2D flatland, 3D reality, polynomial functions, or matrices — once you know the universal laws, you can explore any space confidently.",
          state: { _void: true },
          audioSrc: "/audio/story/2.8/ch3.mp3",
        },
        {
          id: "c2",
          eyebrow: "2",
          md: "Understanding vector spaces gives you the foundation for linear algebra, calculus, and advanced data science. It's the universal language of mathematical structure — the same grammar whether you're mapping a forest or compressing a dataset.",
          state: { _void: true },
        },
      ],
    },
    {
      kind: "recap",
      id: "recap",
      eyebrow: "Beat 5",
      title: "Land it",
      mantra: "Once you know the rules, you can explore any space — the same fundamental laws work everywhere!",
      points: [
        "Vector spaces: collections closed under addition and scalar multiplication",
        "Examples: ℝⁿ, polynomials, functions, matrices, solution sets",
        "Subspaces inherit the same rules within a larger space",
      ],
    },
  ],
  landing: {
    mantra: "Once you know the rules, you can explore any space — the same fundamental laws work everywhere!",
    recap: "Addition + scalar multiplication + axioms = vector space. Subspaces, polynomials, matrices — all the same grammar.",
  },
};
