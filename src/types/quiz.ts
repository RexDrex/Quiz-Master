export type QuestionType = 'mcq' | 'true-false' | 'short-answer';
export type FeedbackMode = 'immediate' | 'end' | 'never';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  correctAnswer: string | number | boolean;
  explanation?: string;
  points: number;
  difficulty?: DifficultyLevel;
  timeLimit?: number;
  tags?: string[];
}

export interface QuizSettings {
  timeLimit?: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showFeedback: FeedbackMode;
  allowRetake: boolean;
  showScore: boolean;
  requireName: boolean;
  showProgress: boolean;
  showTimer: boolean;
  showExplanations: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  settings: QuizSettings;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  isPublished: boolean;
  tags?: string[];
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userName?: string;
  answers: Record<string, string | number | boolean>;
  score: number;
  totalPossible: number;
  timeSpent: number;
  completedAt: Date;
  questionTimes?: Record<string, number>;
  metadata?: {
    userAgent: string;
    platform: string;
    screenSize: string;
  };
}

export interface Analytics {
  quizId: string;
  attempts: QuizAttempt[];
  averageScore: number;
  completionRate: number;
  averageTimeSpent: number;
  questionPerformance: Record<string, {
    correct: number;
    total: number;
    difficulty: number;
    averageTime: number;
    mostCommonAnswer?: string | number | boolean;
  }>;
  scoreDistribution: number[];
  dailyAttempts: Record<string, number>;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  animations: boolean;
  soundEffects: boolean;
  autoSave: boolean;
  defaultQuestionCount: number;
}

export interface AppState {
  quizzes: Quiz[];
  attempts: QuizAttempt[];
  preferences: UserPreferences;
  currentQuizId?: string;
  activeAttemptId?: string;
  lastGeneratedQuestions?: Question[];
}
