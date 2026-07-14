export interface LessonData {
  id: string;
  title: string;
  duration: string;
  characterId: string;
  narrativeHook: {
    story: string;
    characterMessage: string;
  };
  learningObjectives: string[];
  coreConcepts: string[];
  memoryAids: {
    mantra: string;
    visual: string;
  };
  realWorldConnection: string;
  conceptCheck: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
  readContent: string;
  seeContent: string;
  seeVideoUrl?: string;
  seePreQuote?: string;
  seePostQuote?: string;
  hearContent: string;
  hearAudioUrl?: string;
  hearTranscript?: string[];
  doContent: string;
  readAnalogy?: string;
  readKeyPoints?: string[];
  readDigDeeper?: string;
  readWhyMatters?: string;
  doType?: string;
  doEmbedUrl?: string;
  doComponent?: string;
  doInstructions?: string;
}

export interface LessonProgress {
  sectionsCompleted: string[];
  conceptsChecked: boolean[];
  timeSpent: number;
  confidenceRating: number;
  currentSection: string;
}
