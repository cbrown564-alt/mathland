/**
 * Story model for the Phase C guided-narrative lesson.
 *
 * Deliberately *not* the 8-section LessonData shape. A story is a short sequence
 * of authored chapters the character narrates one at a time — the lesson's
 * content re-authored as a paced arc, not the section form re-skinned. Audio,
 * transcript and on-screen prose are the same `narration` string so the spoken
 * voice is the spine (each chapter = one audio clip).
 */

export interface StoryCheck {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface StoryChapter {
  /** Stable id, also used to key progress + generated audio filenames. */
  id: string;
  /** Small mono eyebrow, e.g. "Chapter 1 · Two hikers". */
  eyebrow: string;
  /** The character's spoken line — used verbatim for TTS *and* the on-screen text. */
  narration: string;
  /** Path to the generated clip for this chapter, e.g. /audio/story/2.3/ch1.mp3. */
  audioSrc?: string;
  /** Optional formula rendered as a display line (kept out of the spoken text). */
  formula?: string;
  /** When true, the chapter renders the interactive as its climax. */
  climax?: boolean;
  /** Interactive component key (see StoryPlayer switch), e.g. "dot_product_explorer". */
  interactive?: string;
  /** Optional inline concept check shown beneath the narration. */
  check?: StoryCheck;
}

export interface LessonStory {
  /** Matches the section-form lesson id so the two views are comparable. */
  lessonId: string;
  characterId: string;
  /** Lesson title, shown once on the opening chapter. */
  title: string;
  /** One-line serif subtitle under the title. */
  kicker: string;
  chapters: StoryChapter[];
}
