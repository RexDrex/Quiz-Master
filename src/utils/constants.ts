import { QuizSettings, UserPreferences, Question } from '@/types/quiz';

export const APP_NAME = 'QuizMaster';
export const APP_VERSION = '1.0.0';
export const STORAGE_KEY = 'quizmaster_app_state';
export const STORAGE_VERSION = 1;

export const DEFAULT_QUIZ_SETTINGS: QuizSettings = {
  shuffleQuestions: false,
  shuffleOptions: true,
  showFeedback: 'immediate',
  allowRetake: true,
  showScore: true,
  requireName: false,
  showProgress: true,
  showTimer: true,
  showExplanations: true,
};

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: 'system',
  fontSize: 'medium',
  animations: true,
  soundEffects: false,
  autoSave: true,
  defaultQuestionCount: 10,
};

export const QUESTION_POINTS = {
  easy: 1,
  medium: 2,
  hard: 3,
};

export const FEEDBACK_MESSAGES = {
  correct: [
    "Excellent! 🎉",
    "Perfect! ✅",
    "Great job! 👍",
    "You nailed it! 💯",
    "Absolutely right! ✨",
  ],
  incorrect: [
    "Not quite. Try again! 💪",
    "Good attempt! Let's review. 📚",
    "Almost there! 🔍",
    "Let's learn from this. 🧠",
    "Review the explanation below. 📖",
  ],
};

export const TIMER_WARNING_THRESHOLD = 10;
export const MAX_QUIZ_LENGTH_URL = 2000;
export const MAX_QUESTIONS_PER_QUIZ = 50;
export const MAX_OPTIONS_PER_QUESTION = 6;
export const MIN_OPTIONS_PER_QUESTION = 2;

export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 'sample_1',
    type: 'mcq',
    text: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 2,
    explanation: 'Paris is the capital and most populous city of France.',
    points: 1,
    difficulty: 'easy',
  },
  {
    id: 'sample_2',
    type: 'true-false',
    text: 'The Earth is the third planet from the Sun.',
    correctAnswer: true,
    explanation: 'Yes, the Earth is the third planet from the Sun, after Mercury and Venus.',
    points: 1,
    difficulty: 'easy',
  },
  {
    id: 'sample_3',
    type: 'mcq',
    text: 'Which programming language was created by Brendan Eich?',
    options: ['Python', 'JavaScript', 'Java', 'C++'],
    correctAnswer: 1,
    explanation: 'JavaScript was created by Brendan Eich in 1995 while working at Netscape.',
    points: 2,
    difficulty: 'medium',
  },
  {
    id: 'sample_4',
    type: 'true-false',
    text: 'Water boils at 100 degrees Celsius at sea level.',
    correctAnswer: true,
    explanation: 'At standard atmospheric pressure (sea level), water boils at 100°C (212°F).',
    points: 1,
    difficulty: 'easy',
  },
  {
    id: 'sample_5',
    type: 'mcq',
    text: 'What is the largest planet in our solar system?',
    options: ['Saturn', 'Jupiter', 'Neptune', 'Uranus'],
    correctAnswer: 1,
    explanation: 'Jupiter is the largest planet in our solar system, with a mass greater than all other planets combined.',
    points: 1,
    difficulty: 'easy',
  },
];
