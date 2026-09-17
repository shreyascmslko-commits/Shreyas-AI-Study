export type NavigationTab = 'home' | 'chat' | 'study' | 'questions' | 'exam' | 'notes' | 'history' | 'about';

export interface HistoryItem {
  id: string;
  sessionId: string;
  timestamp: number;
  feature: 'chat' | 'study' | 'questions' | 'exam' | 'notes';
  featureLabel?: string;
  subject?: string;
  topic?: string;
  prompt: string;
  responseSummary?: string;
  responseSnippet?: string;
  fullData?: any;
}

export interface AdminUsageLog {
  id: string;
  sessionId: string;
  timestamp: number;
  date: string;
  time: string;
  subject: string;
  feature: string;
  prompt: string;
  responseSnippet: string;
}

export interface AdminStats {
  totalQueries: number;
  uniqueSessions: number;
  featureBreakdown: Record<string, number>;
  subjectBreakdown: Record<string, number>;
  todayCount: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  subject?: string;
  topic?: string;
}

export interface ExampleItem {
  title: string;
  description: string;
}

export interface CommonMistakeItem {
  mistake: string;
  correction: string;
}

export interface PracticeQuestionItem {
  difficulty: string;
  question: string;
  hint: string;
  solution: string;
}

export interface StudyTopicResult {
  topicTitle: string;
  subject: string;
  estimatedStudyTime: string;
  beginnerExplanation: string;
  detailedExplanation: string;
  importantPoints: string[];
  examples: ExampleItem[];
  commonMistakes: CommonMistakeItem[];
  examTips: string[];
  practiceQuestions: PracticeQuestionItem[];
}

export interface GeneratedQuestion {
  id: string;
  type: 'mcq' | 'short' | 'long' | 'hots' | 'competency' | 'application';
  typeLabel: string;
  question: string;
  marks: number;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  keyPoints: string[];
  applicationScenario?: string;
}

export interface QuestionGeneratorResult {
  topic: string;
  subject: string;
  difficulty: string;
  totalQuestions: number;
  questions: GeneratedQuestion[];
}

export interface ExamConcept {
  title: string;
  summary: string;
  weightage: string;
}

export interface ExamDefinition {
  term: string;
  definition: string;
  keyKeywords: string;
}

export interface ExamFormula {
  name: string;
  formula: string;
  explanation: string;
  applicationTips: string;
}

export interface LikelyQuestionPattern {
  pattern: string;
  marksRange: string;
  likelihood: string;
  recommendation: string;
}

export interface ExamTestQuestion {
  questionNumber: number;
  marks: number;
  questionText: string;
  solution: string;
}

export interface RevisionChecklistItem {
  id: string;
  task: string;
  category: string;
  priority: string;
  completed?: boolean;
}

export interface ExamPrepResult {
  syllabusTitle: string;
  subject: string;
  targetExam: string;
  importantConcepts: ExamConcept[];
  importantDefinitions: ExamDefinition[];
  formulas: ExamFormula[];
  likelyQuestionTypes: LikelyQuestionPattern[];
  practiceTest: ExamTestQuestion[];
  revisionChecklist: RevisionChecklistItem[];
}

export interface StudyNote {
  id: string;
  title: string;
  content: string;
  subject: string;
  dateAdded: number;
  isActiveForContext: boolean;
  summary?: string;
  keyConcepts?: { concept: string; explanation: string }[];
  flashcards?: { question: string; answer: string }[];
}

export interface UserProfile {
  name: string;
  avatarSeed: string;
  gradeLevel: string;
  favoriteSubject: string;
  streakDays: number;
  questionsSolved: number;
  topicsMastered: number;
}
