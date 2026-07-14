import { act, renderHook, waitFor } from "@testing-library/react";
import { useLessonProgress } from "./useLessonProgress";

describe("useLessonProgress", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("hydrates stored beat progress without overwriting it with defaults", async () => {
    localStorage.setItem(
      "lesson-progress-2.3",
      JSON.stringify({
        completedSections: ["read"],
        currentSection: "see",
        beatIndex: 2,
        lessonCompleted: false,
      }),
    );

    const { result } = renderHook(() => useLessonProgress("2.3"));

    await waitFor(() => expect(result.current.beatIndex).toBe(2));
    expect(result.current.currentSection).toBe("see");
    expect(result.current.completedSections).toEqual(new Set(["read"]));

    const stored = JSON.parse(localStorage.getItem("lesson-progress-2.3") || "{}");
    expect(stored.beatIndex).toBe(2);
    expect(stored.currentSection).toBe("see");
  });

  it("persists completion and resets only v2 beat progress", async () => {
    localStorage.setItem(
      "lesson-progress-2.3",
      JSON.stringify({ completedSections: ["read"], currentSection: "see" }),
    );
    const { result } = renderHook(() => useLessonProgress("2.3"));
    await waitFor(() => expect(result.current.currentSection).toBe("see"));

    act(() => {
      result.current.setBeatIndex(3);
      result.current.markLessonComplete();
    });

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem("lesson-progress-2.3") || "{}");
      expect(stored.beatIndex).toBe(3);
      expect(stored.lessonCompleted).toBe(true);
    });

    act(() => result.current.resetBeatProgress());

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem("lesson-progress-2.3") || "{}");
      expect(stored.beatIndex).toBe(0);
      expect(stored.lessonCompleted).toBe(false);
      expect(stored.completedSections).toEqual(["read"]);
      expect(stored.currentSection).toBe("see");
    });
  });

  it("migrates prototype beatflow progress into the shared lesson key", async () => {
    localStorage.setItem("beatflow-2.3", JSON.stringify({ furthest: 1, done: true }));

    const { result } = renderHook(() => useLessonProgress("2.3"));

    await waitFor(() => expect(result.current.lessonCompleted).toBe(true));
    expect(result.current.beatIndex).toBe(1);
    expect(localStorage.getItem("beatflow-2.3")).toBeNull();
    expect(JSON.parse(localStorage.getItem("lesson-progress-2.3") || "{}")).toMatchObject({
      beatIndex: 1,
      lessonCompleted: true,
    });
  });
});
