import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Quiz, Question, QuizAttempt, Analytics, UserPreferences } from '@/types/quiz';
import { DEFAULT_QUIZ_SETTINGS, DEFAULT_USER_PREFERENCES, STORAGE_KEY, STORAGE_VERSION, SAMPLE_QUESTIONS } from '@/utils/constants';
import { generateId, shuffleArray } from '@/utils/helpers';

interface QuizStore {
  quizzes: Quiz[];
  attempts: QuizAttempt[];
  preferences: UserPreferences;
  currentQuizId?: string;
  activeAttemptId?: string;
  lastGeneratedQuestions?: Question[];
  isGenerating: boolean;
  generationError: string | null;
  
  createQuiz: (quizData: Partial<Quiz>) => string;
  updateQuiz: (id: string, updates: Partial<Quiz>) => void;
  deleteQuiz: (id: string) => void;
  getQuiz: (id: string) => Quiz | undefined;
  duplicateQuiz: (id: string) => string;
  
  addQuestion: (quizId: string, question: Partial<Question>) => void;
  updateQuestion: (quizId: string, questionId: string, updates: Partial<Question>) => void;
  deleteQuestion: (quizId: string, questionId: string) => void;
  reorderQuestions: (quizId: string, questionIds: string[]) => void;
  
  generateQuestions: (topic: string, count: number) => Promise<Question[]>;
  
  startAttempt: (quizId: string, userName?: string) => string;
  submitAnswer: (attemptId: string, questionId: string, answer: string | number | boolean) => void;
  completeAttempt: (attemptId: string) => QuizAttempt;
  getActiveAttempt: () => QuizAttempt | undefined;
  updateAttemptTime: (attemptId: string, timeSpent: number) => void;
  
  getQuizAnalytics: (quizId: string) => Analytics;
  
  exportQuiz: (quizId: string) => string;
  importQuiz: (data: string) => string;
  
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  clearStorage: () => void;
  searchQuizzes: (query: string) => Quiz[];
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      quizzes: [],
      attempts: [],
      preferences: DEFAULT_USER_PREFERENCES,
      currentQuizId: undefined,
      activeAttemptId: undefined,
      lastGeneratedQuestions: undefined,
      isGenerating: false,
      generationError: null,
      
      createQuiz: (quizData) => {
        const id = generateId('quiz');
        const now = new Date();
        
        const newQuiz: Quiz = {
          id,
          title: quizData.title || 'Untitled Quiz',
          description: quizData.description || '',
          questions: quizData.questions || [],
          settings: { ...DEFAULT_QUIZ_SETTINGS, ...quizData.settings },
          createdAt: now,
          updatedAt: now,
          version: 1,
          isPublished: false,
          tags: quizData.tags || [],
        };
        
        set((state) => ({
          quizzes: [...state.quizzes, newQuiz],
          currentQuizId: id,
        }));
        
        return id;
      },
      
      updateQuiz: (id, updates) => {
        set((state) => ({
          quizzes: state.quizzes.map((quiz) =>
            quiz.id === id
              ? { ...quiz, ...updates, updatedAt: new Date(), version: quiz.version + 1 }
              : quiz
          ),
        }));
      },
      
      deleteQuiz: (id) => {
        set((state) => ({
          quizzes: state.quizzes.filter((quiz) => quiz.id !== id),
          attempts: state.attempts.filter((attempt) => attempt.quizId !== id),
        }));
      },
      
      getQuiz: (id) => {
        return get().quizzes.find((quiz) => quiz.id === id);
      },
      
      duplicateQuiz: (id) => {
        const original = get().getQuiz(id);
        if (!original) throw new Error('Quiz not found');
        
        const newId = generateId('quiz');
        const now = new Date();
        
        const duplicated: Quiz = {
          ...original,
          id: newId,
          title: `${original.title} (Copy)`,
          questions: original.questions.map(q => ({ ...q, id: generateId('question') })),
          createdAt: now,
          updatedAt: now,
          isPublished: false,
        };
        
        set((state) => ({
          quizzes: [...state.quizzes, duplicated],
          currentQuizId: newId,
        }));
        
        return newId;
      },
      
      addQuestion: (quizId, questionData) => {
        const questionId = generateId('question');
        const question: Question = {
          id: questionId,
          type: questionData.type || 'mcq',
          text: questionData.text || '',
          options: questionData.options || [],
          correctAnswer: questionData.correctAnswer ?? '',
          explanation: questionData.explanation || '',
          points: questionData.points || 1,
          difficulty: questionData.difficulty || 'medium',
          timeLimit: questionData.timeLimit,
          tags: questionData.tags,
        };
        
        set((state) => ({
          quizzes: state.quizzes.map((quiz) =>
            quiz.id === quizId
              ? { ...quiz, questions: [...quiz.questions, question], updatedAt: new Date() }
              : quiz
          ),
        }));
      },
      
      updateQuestion: (quizId, questionId, updates) => {
        set((state) => ({
          quizzes: state.quizzes.map((quiz) =>
            quiz.id === quizId
              ? {
                  ...quiz,
                  questions: quiz.questions.map((q) =>
                    q.id === questionId ? { ...q, ...updates } : q
                  ),
                  updatedAt: new Date(),
                }
              : quiz
          ),
        }));
      },
      
      deleteQuestion: (quizId, questionId) => {
        set((state) => ({
          quizzes: state.quizzes.map((quiz) =>
            quiz.id === quizId
              ? {
                  ...quiz,
                  questions: quiz.questions.filter((q) => q.id !== questionId),
                  updatedAt: new Date(),
                }
              : quiz
          ),
        }));
      },
      
      reorderQuestions: (quizId, questionIds) => {
        set((state) => {
          const quiz = state.quizzes.find((q) => q.id === quizId);
          if (!quiz) return state;
          
          const questionMap = new Map(quiz.questions.map((q) => [q.id, q]));
          const reorderedQuestions = questionIds
            .map((id) => questionMap.get(id))
            .filter((q): q is Question => q !== undefined);
          
          return {
            quizzes: state.quizzes.map((q) =>
              q.id === quizId
                ? { ...q, questions: reorderedQuestions, updatedAt: new Date() }
                : q
            ),
          };
        });
      },
      
      generateQuestions: async (topic, count) => {
        set({ isGenerating: true, generationError: null });
        
        try {
          const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
          if (!apiKey) {
            throw new Error('Gemini API key not configured');
          }
          
          const { GoogleGenerativeAI } = await import('@google/generative-ai');
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
          
          const prompt = `Generate ${count} quiz questions about "${topic}".

Return ONLY a valid JSON array with this exact structure (no markdown, no explanation):
[
  {
    "type": "mcq",
    "text": "clear question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "why this is correct",
    "difficulty": "easy",
    "points": 1
  },
  {
    "type": "true-false",
    "text": "statement to evaluate",
    "correctAnswer": true,
    "explanation": "why this is true/false",
    "difficulty": "medium",
    "points": 1
  }
]

Requirements:
- Mix question types: 70% MCQ, 30% True/False
- Mix difficulties: 30% easy, 50% medium, 20% hard
- For MCQ: correctAnswer is the index (0-3) of the correct option
- For True/False: correctAnswer is true or false
- Points: easy=1, medium=2, hard=3
- All questions must be factually accurate about "${topic}"`;
          
          const result = await model.generateContent(prompt);
          const text = result.response.text();
          
          const jsonMatch = text.match(/\[[\s\S]*\]/);
          if (!jsonMatch) {
            throw new Error('Invalid response format');
          }
          
          const cleaned = jsonMatch[0]
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();
          
          const parsedQuestions = JSON.parse(cleaned);
          
          const questions: Question[] = parsedQuestions.map((q: any) => ({
            id: generateId('gen_question'),
            type: q.type,
            text: q.text,
            options: q.options || [],
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || '',
            points: q.points || (q.difficulty === 'hard' ? 3 : q.difficulty === 'medium' ? 2 : 1),
            difficulty: q.difficulty || 'medium',
          }));
          
          set({ lastGeneratedQuestions: questions, isGenerating: false });
          return questions;
          
        } catch (error) {
          console.error('AI Generation failed:', error);
          
          const fallbackQuestions = SAMPLE_QUESTIONS.slice(0, count).map((q) => ({
            ...q,
            id: generateId('fallback_question'),
          }));
          
          set({
            generationError: 'AI generation failed. Using sample questions.',
            lastGeneratedQuestions: fallbackQuestions,
            isGenerating: false,
          });
          
          return fallbackQuestions;
        }
      },
      
      startAttempt: (quizId, userName) => {
        const quiz = get().getQuiz(quizId);
        if (!quiz) throw new Error('Quiz not found');
        
        const attemptId = generateId('attempt');
        
        const attempt: QuizAttempt = {
          id: attemptId,
          quizId,
          userName,
          answers: {},
          score: 0,
          totalPossible: quiz.questions.reduce((sum, q) => sum + q.points, 0),
          timeSpent: 0,
          completedAt: new Date(),
          questionTimes: {},
        };
        
        set((state) => ({
          attempts: [...state.attempts, attempt],
          activeAttemptId: attemptId,
        }));
        
        return attemptId;
      },
      
      submitAnswer: (attemptId, questionId, answer) => {
        set((state) => {
          const attemptIndex = state.attempts.findIndex((a) => a.id === attemptId);
          if (attemptIndex === -1) return state;
          
          const attempt = state.attempts[attemptIndex];
          const updatedAttempt = {
            ...attempt,
            answers: { ...attempt.answers, [questionId]: answer },
          };
          
          const updatedAttempts = [...state.attempts];
          updatedAttempts[attemptIndex] = updatedAttempt;
          
          return { attempts: updatedAttempts };
        });
      },
      
      completeAttempt: (attemptId) => {
        const state = get();
        const attemptIndex = state.attempts.findIndex((a) => a.id === attemptId);
        if (attemptIndex === -1) throw new Error('Attempt not found');
        
        const attempt = state.attempts[attemptIndex];
        const quiz = state.getQuiz(attempt.quizId);
        if (!quiz) throw new Error('Quiz not found');
        
        let score = 0;
        quiz.questions.forEach((question) => {
          const userAnswer = attempt.answers[question.id];
          if (userAnswer === question.correctAnswer) {
            score += question.points;
          }
        });
        
        const completedAttempt: QuizAttempt = {
          ...attempt,
          score,
          completedAt: new Date(),
        };
        
        const updatedAttempts = [...state.attempts];
        updatedAttempts[attemptIndex] = completedAttempt;
        
        set({
          attempts: updatedAttempts,
          activeAttemptId: undefined,
        });
        
        return completedAttempt;
      },
      
      getActiveAttempt: () => {
        const { activeAttemptId, attempts } = get();
        return attempts.find((a) => a.id === activeAttemptId);
      },
      
      updateAttemptTime: (attemptId, timeSpent) => {
        set((state) => {
          const attemptIndex = state.attempts.findIndex((a) => a.id === attemptId);
          if (attemptIndex === -1) return state;
          
          const updatedAttempts = [...state.attempts];
          updatedAttempts[attemptIndex] = {
            ...updatedAttempts[attemptIndex],
            timeSpent,
          };
          
          return { attempts: updatedAttempts };
        });
      },
      
      getQuizAnalytics: (quizId) => {
        const state = get();
        const quizAttempts = state.attempts.filter((a) => a.quizId === quizId);
        const quiz = state.getQuiz(quizId);
        
        if (!quiz || quizAttempts.length === 0) {
          return {
            quizId,
            attempts: [],
            averageScore: 0,
            completionRate: 0,
            averageTimeSpent: 0,
            questionPerformance: {},
            scoreDistribution: new Array(10).fill(0),
            dailyAttempts: {},
          };
        }
        
        const totalScore = quizAttempts.reduce((sum, a) => sum + a.score, 0);
        const averageScore = totalScore / quizAttempts.length;
        const averageTimeSpent = quizAttempts.reduce((sum, a) => sum + a.timeSpent, 0) / quizAttempts.length;
        
        const questionPerformance: Analytics['questionPerformance'] = {};
        quiz.questions.forEach((question) => {
          const correct = quizAttempts.filter((attempt) => 
            attempt.answers[question.id] === question.correctAnswer
          ).length;
          
          questionPerformance[question.id] = {
            correct,
            total: quizAttempts.length,
            difficulty: 1 - (correct / quizAttempts.length),
            averageTime: 0,
          };
        });
        
        const scoreDistribution = new Array(10).fill(0);
        quizAttempts.forEach((attempt) => {
          const percentage = Math.round((attempt.score / attempt.totalPossible) * 100);
          const bucket = Math.min(Math.floor(percentage / 10), 9);
          scoreDistribution[bucket]++;
        });
        
        const dailyAttempts: Record<string, number> = {};
        quizAttempts.forEach((attempt) => {
          const date = new Date(attempt.completedAt).toISOString().split('T')[0];
          dailyAttempts[date] = (dailyAttempts[date] || 0) + 1;
        });
        
        return {
          quizId,
          attempts: quizAttempts,
          averageScore,
          completionRate: 100,
          averageTimeSpent,
          questionPerformance,
          scoreDistribution,
          dailyAttempts,
        };
      },
      
      exportQuiz: (quizId) => {
        const quiz = get().getQuiz(quizId);
        if (!quiz) throw new Error('Quiz not found');
        
        return JSON.stringify({
          quiz,
          exportedAt: new Date().toISOString(),
          version: STORAGE_VERSION,
          app: 'QuizMaster',
        }, null, 2);
      },
      
      importQuiz: (data) => {
        const importData = JSON.parse(data);
        
        if (!importData.quiz) {
          throw new Error('Invalid quiz data');
        }
        
        const quiz: Quiz = {
          ...importData.quiz,
          id: generateId('imported_quiz'),
          questions: importData.quiz.questions.map((q: Question) => ({
            ...q,
            id: generateId('question'),
          })),
          createdAt: new Date(),
          updatedAt: new Date(),
          isPublished: false,
        };
        
        set((state) => ({
          quizzes: [...state.quizzes, quiz],
          currentQuizId: quiz.id,
        }));
        
        return quiz.id;
      },
      
      updatePreferences: (updates) => {
        set((state) => ({
          preferences: { ...state.preferences, ...updates },
        }));
      },
      
      clearStorage: () => {
        set({
          quizzes: [],
          attempts: [],
          currentQuizId: undefined,
          activeAttemptId: undefined,
          lastGeneratedQuestions: undefined,
        });
      },
      
      searchQuizzes: (query) => {
        const { quizzes } = get();
        if (!query.trim()) return quizzes;
        
        const lowerQuery = query.toLowerCase();
        return quizzes.filter((quiz) =>
          quiz.title.toLowerCase().includes(lowerQuery) ||
          quiz.description.toLowerCase().includes(lowerQuery) ||
          quiz.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
        );
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: STORAGE_VERSION,
    }
  )
);
