import { DomainCase, DomainId } from "../types/world";

export interface StudioCaseAdapter {
  domain: Exclude<DomainId, "climate">;
  title: string;
  task: string;
  firstLabel: string;
  secondLabel: string;
  scalarLabel: string;
  units: string;
  startA: readonly [number, number];
  startB: readonly [number, number];
  positiveMeaning: string;
  zeroMeaning: string;
  negativeMeaning: string;
  boundary: string;
}

export const cases: Record<DomainId, DomainCase> = {
  engineering: {
    id: "engineering",
    eyebrow: "ENGINEERING · USEFUL FORCE",
    title: "Will this force move the load?",
    question: "How much of the force actually acts along the 4 m displacement?",
    interpretation: "Force dotted with displacement gives work: the energy transferred along the motion.",
    formula: "W = F · s",
    assumption: "Constant force and straight-line displacement; friction and changing force are outside this small model.",
    units: "joules (N·m)",
    vectors: { a: [4, 0], b: [3, 2] },
  },
  ai: {
    id: "ai",
    eyebrow: "AI · SEMANTIC SIMILARITY",
    title: "Do these embeddings point alike?",
    question: "How strongly do two normalised meaning-vectors agree in direction?",
    interpretation: "For unit vectors, the dot product is cosine similarity: direction agreement from −1 to 1.",
    formula: "similarity = û · v̂",
    assumption: "The vectors are already normalised. Raw dot products also change with magnitude and are not cosine similarity.",
    units: "unitless",
    vectors: { a: [0.8, 0.6], b: [0.6, 0.8] },
  },
  finance: {
    id: "finance",
    eyebrow: "FINANCE · PORTFOLIO RETURN",
    title: "What did the mix return?",
    question: "How does each asset weight combine with its realised return?",
    interpretation: "Weights dotted with asset returns give the one-period portfolio return before fees and other effects.",
    formula: "rₚ = w · r",
    assumption: "A single realised period with fixed weights, no fees, taxes, slippage, or rebalancing. This is arithmetic, not advice or a forecast.",
    units: "return (decimal or %)",
    vectors: { a: [0.7, 0.3], b: [0.08, -0.02] },
  },
  climate: {
    id: "climate",
    eyebrow: "TRANSFER · CLIMATE MONITORING",
    title: "One exposure score from three sensors",
    question: "Can you recognise the same operation in a weighted environmental index?",
    interpretation: "Importance weights dotted with sensor deviations produce a weighted exposure score.",
    formula: "exposure = w · d",
    assumption: "A deliberately small linear index. Real environmental decisions require calibration, uncertainty, and domain review.",
    units: "index points",
    vectors: { a: [0.5, 0.3, 0.2], b: [4, -1, 2] },
  },
};

export const primaryDomains: Exclude<DomainId, "climate">[] = ["engineering", "ai", "finance"];

export const horizonNames: Record<Exclude<DomainId, "climate">, string> = {
  engineering: "Understand physical systems",
  ai: "Understand intelligent systems",
  finance: "Reason about portfolios",
};

export const studioCaseAdapters: Record<Exclude<DomainId, "climate">, StudioCaseAdapter> = {
  engineering: {
    domain: "engineering",
    title: "Force along displacement",
    task: "Change force and displacement to test how much force lies along the motion.",
    firstLabel: "s",
    secondLabel: "F",
    scalarLabel: "F · s",
    units: "joules",
    startA: [4, 0],
    startB: [3, 2],
    positiveMeaning: "adds energy along the motion",
    zeroMeaning: "transfers no energy along the motion",
    negativeMeaning: "removes energy from the motion",
    boundary: cases.engineering.assumption,
  },
  ai: {
    domain: "ai",
    title: "Direction agreement between embeddings",
    task: "Change two unit-length meaning vectors, then test what breaks when magnitude is allowed to vary.",
    firstLabel: "û",
    secondLabel: "v̂",
    scalarLabel: "û · v̂",
    units: "similarity",
    startA: [0.8, 0.6],
    startB: [0.6, 0.8],
    positiveMeaning: "points toward similar directions",
    zeroMeaning: "has no directional similarity in this plane",
    negativeMeaning: "points toward opposing directions",
    boundary: cases.ai.assumption,
  },
  finance: {
    domain: "finance",
    title: "Weights against realised returns",
    task: "Change weights and realised returns to inspect each signed contribution to the one-period total.",
    firstLabel: "w",
    secondLabel: "r",
    scalarLabel: "w · r",
    units: "return",
    startA: [0.7, 0.3],
    startB: [0.08, -0.02],
    positiveMeaning: "produces a positive realised return",
    zeroMeaning: "nets to zero realised return",
    negativeMeaning: "produces a negative realised return",
    boundary: cases.finance.assumption,
  },
};
