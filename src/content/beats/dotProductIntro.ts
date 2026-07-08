import type { Passage, Predict, Check } from "./schema";
import type { VectorPlotState } from "@/core/components/narrative/primitives";

/**
 * Content for the opening beat of lesson 2.3 (Vera · Dot Product), authored as
 * data: a predict prompt, coupled passages (prose + vector state), and a check.
 */

export const dotProductIntroPredict: Predict = {
  prompt: "Two arrows pointing roughly the same way. Before you read — is their dot product positive, zero, or negative?",
  options: [
    { label: "Positive", value: "pos" },
    { label: "Zero", value: "zero" },
    { label: "Negative", value: "neg" },
  ],
  nudge: {
    pos: "You said positive — scroll and watch the number while the arrows agree.",
    zero: "You said zero — that only happens at a right angle. Keep it in mind as you scroll.",
    neg: "You said negative — that needs them past 90°. See if the picture changes your mind.",
  },
};

export const dotProductIntroPassages: Passage<VectorPlotState>[] = [
  {
    id: "p1",
    eyebrow: "The dot product · 1",
    md: "Two vectors don't just have a length — they have a *relationship*. Point them the same way and something starts to add up.",
    state: { u: [3, 4], v: [3.4, 2.6], emphasis: "none" },
    audioSrc: "/audio/story/2.3/ch1.mp3",
  },
  {
    id: "p2",
    eyebrow: "2",
    md: "The closer their directions, the bigger that number gets. That's the **dot product** — a single value for how much two directions agree.",
    state: { u: [3.2, 3.2], v: [3.7, 2.3], emphasis: "u" },
  },
  {
    id: "p3",
    eyebrow: "3",
    md: "Swing them to a right angle and the number falls to *exactly zero*. Perpendicular vectors are mathematical strangers.",
    state: { u: [3.2, 0.2], v: [-0.3, 3.2], emphasis: "angle" },
    audioSrc: "/audio/story/2.3/ch2.mp3",
  },
  {
    id: "p4",
    eyebrow: "4",
    md: "Push them past ninety degrees, into opposite corners, and it turns *negative* — now the two directions actively disagree.",
    state: { u: [3, 1], v: [-3, 0.6], emphasis: "angle" },
  },
];

export const dotProductIntroCheck: Check = {
  question: "Two hiking paths are the vectors [3, 4] and [1, 2]. What's their dot product?",
  options: [
    "11 — the paths head in generally the same direction",
    "5 — the paths are perpendicular",
    "-1 — the paths point in opposite directions",
    "0 — there's no relationship between the paths",
  ],
  correctAnswer: 0,
  explanation: "[3,4] · [1,2] = (3)(1) + (4)(2) = 3 + 8 = 11. It's positive, so the paths point generally the same way.",
};
