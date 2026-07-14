import { getBeatLesson, hasBeatLesson } from "./index";

const PILOT_IDS = Array.from({ length: 9 }, (_, index) => `2.${index + 1}`);

describe("Lesson v2 Module 2 pilot", () => {
  it("registers exactly the authored 2.1–2.9 pilot surface", () => {
    for (const id of PILOT_IDS) expect(hasBeatLesson(id)).toBe(true);
    expect(hasBeatLesson("2.10")).toBe(false);
  });

  it.each(PILOT_IDS)("keeps lesson %s structurally completable", (id) => {
    const lesson = getBeatLesson(id);
    expect(lesson).not.toBeNull();
    if (!lesson) return;

    expect(lesson.meta.id).toBe(id);
    expect(lesson.meta.title).toBeTruthy();
    expect(lesson.meta.oneLine).toBeTruthy();
    expect(lesson.landing.mantra).toBeTruthy();
    expect(lesson.beats.length).toBeGreaterThanOrEqual(2);

    const beatIds = lesson.beats.map((beat) => beat.id);
    expect(new Set(beatIds).size).toBe(beatIds.length);

    for (const beat of lesson.beats) {
      expect(beat.title || beat.eyebrow).toBeTruthy();
      if ("check" in beat && beat.check) {
        expect(beat.check.options.length).toBeGreaterThanOrEqual(2);
        expect(beat.check.correctAnswer).toBeGreaterThanOrEqual(0);
        expect(beat.check.correctAnswer).toBeLessThan(beat.check.options.length);
        expect(beat.check.explanation).toBeTruthy();
      }
      if (beat.kind === "couple") {
        expect(beat.passages.length).toBeGreaterThan(0);
        expect(new Set(beat.passages.map((passage) => passage.id)).size).toBe(beat.passages.length);
      }
      if (beat.kind === "do" && beat.goals) {
        expect(new Set(beat.goals.map((goal) => goal.tone)).size).toBe(beat.goals.length);
      }
    }
  });
});
