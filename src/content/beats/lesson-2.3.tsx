import { BeatData } from "@/core/components/narrative/LessonBeat";
import { VectorState } from "@/core/components/narrative/VectorVisual";
import {
  dotProductIntroPredict,
  dotProductIntroPassages,
  dotProductIntroCheck,
} from "./dotProductIntro";

/**
 * Lesson 2.3 (Vera · The Dot Product) as a sequence of beats — the data BeatFlow
 * plays. Each beat is predict → coupled reading → check. The climax (the
 * draggable playground) is a separate step; this covers the three teaching beats.
 */
export const dotProductBeats: BeatData<VectorState>[] = [
  {
    id: "agree",
    eyebrow: "Vera · Vectors · Beat 1",
    title: "When directions agree",
    predict: dotProductIntroPredict,
    passages: dotProductIntroPassages,
    check: dotProductIntroCheck,
  },
  {
    id: "angle",
    eyebrow: "Beat 2",
    title: "It's all about the angle",
    predict: {
      prompt: "As you open the angle between two arrows from 0° toward 90°, does their dot product grow, stay the same, or shrink?",
      options: [
        { label: "Grow", value: "grow" },
        { label: "Stay same", value: "same" },
        { label: "Shrink", value: "shrink" },
      ],
      nudge: {
        grow: "You said grow — watch the number as the angle widens and see if that holds.",
        same: "You said stay the same — keep an eye on the readout as the gap opens.",
        shrink: "You said shrink — scroll and see exactly how fast it falls.",
      },
    },
    passages: [
      {
        id: "a1",
        eyebrow: "Two ways · 1",
        body: (
          <>The dot product has a twin definition. One just multiplies the matching components and adds them. The other measures the <em>angle</em>. Same number, every time.</>
        ),
        state: { u: [3, 2.4], v: [3.3, 2.0], emphasis: "none" },
        audioSrc: "/audio/story/2.3/ch3.mp3",
      },
      {
        id: "a2",
        eyebrow: "2",
        body: <>Line the arrows up — angle near zero — and the dot product is at its <b>maximum</b>.</>,
        state: { u: [3, 2], v: [3.2, 2.1], emphasis: "angle" },
      },
      {
        id: "a3",
        eyebrow: "3",
        body: <>Open the angle toward ninety degrees and it <em>shrinks</em>, all the way down to zero.</>,
        state: { u: [3, 2], v: [-1.4, 3], emphasis: "angle" },
      },
      {
        id: "a4",
        eyebrow: "4",
        body: (
          <>That dial is the cosine. So <b>u · v = |u| |v| cos θ</b> — two lengths and the angle between them, nothing more.</>
        ),
        state: { u: [3.2, 0.4], v: [1.4, 2.8], emphasis: "angle" },
      },
    ],
    check: {
      question: "Two unit vectors meet at 60°. What is their dot product?",
      options: [
        "0.5 — because cos 60° = ½ and both lengths are 1",
        "1 — they must be identical",
        "0 — they're perpendicular",
        "−0.5 — they point apart",
      ],
      correctAnswer: 0,
      explanation: "u · v = |u||v|cos θ = 1 · 1 · cos 60° = 0.5. The angle sets everything once the lengths are fixed.",
    },
  },
  {
    id: "world",
    eyebrow: "Beat 3",
    title: "Where it lives",
    passages: [
      {
        id: "w1",
        eyebrow: "In the wild · 1",
        body: (
          <>This tiny operation quietly runs the modern world. Search, recommendations, machine learning — all of it leans on one question.</>
        ),
        state: { u: [3, 3], v: [3.2, 2.7], emphasis: "none" },
        audioSrc: "/audio/story/2.3/ch5.mp3",
      },
      {
        id: "w2",
        eyebrow: "2",
        body: (
          <>How much do these two things agree? Google scores pages against your query with it; Spotify lines your taste up against a song. Same dot product, billions of times a second.</>
        ),
        state: { u: [3, 2.6], v: [2.9, 2.9], emphasis: "u" },
      },
    ],
    check: {
      question: "A recommender says a song vector and your taste vector have a large positive dot product. That means…",
      options: [
        "They point the same way — it's a strong match for you",
        "They're perpendicular — no signal either way",
        "They oppose — avoid recommending it",
        "Nothing; the sign doesn't matter",
      ],
      correctAnswer: 0,
      explanation: "Large and positive = closely aligned directions = high similarity. That's exactly the 'agreement' the dot product measures.",
    },
  },
  {
    id: "climax",
    eyebrow: "Beat 4 · Your turn",
    title: "Make the meter move",
    predict: {
      prompt: "Before you touch it — can two non-zero arrows ever have a dot product of exactly zero?",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ],
      nudge: {
        yes: "You said yes — now prove it by making them perpendicular.",
        no: "You said no — try anyway; aim for a clean right angle and watch.",
      },
    },
    climax: {
      interactive: "dot_product_explorer",
      intro: "This is the whole lesson, in your hands. Drag the arrowheads and read the agreement meter — try to land all three outcomes.",
      goals: [
        { tone: "same", label: "Make them agree · dot > 0" },
        { tone: "ortho", label: "Make them perpendicular · dot = 0" },
        { tone: "opposite", label: "Make them oppose · dot < 0" },
      ],
    },
  },
];
