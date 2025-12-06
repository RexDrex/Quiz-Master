import { Question, Quiz, QuizAttempt } from '@/types/quiz';
import { FEEDBACK_MESSAGES } from './constants';

export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function calculateScore(attempt: QuizAttempt, quiz: Quiz): number {
  let score = 0;
  
  quiz.questions.forEach((question) => {
    const userAnswer = attempt.answers[question.id];
    if (userAnswer === question.correctAnswer) {
      score += question.points;
    }
  });
  
  return score;
}

export function calculatePercentage(score: number, total: number): number {
  return total > 0 ? Math.round((score / total) * 100) : 0;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function validateQuestion(question: Partial<Question>): string[] {
  const errors: string[] = [];
  
  if (!question.text?.trim()) {
    errors.push('Question text is required');
  }
  
  if (question.type === 'mcq') {
    if (!question.options || question.options.length < 2) {
      errors.push('MCQ questions require at least 2 options');
    }
    if (question.correctAnswer === undefined || question.correctAnswer === null) {
      errors.push('Correct answer is required for MCQ');
    }
  }
  
  if (question.type === 'true-false' && typeof question.correctAnswer !== 'boolean') {
    errors.push('True/False questions require a boolean correct answer');
  }
  
  if (question.type === 'short-answer' && !question.correctAnswer?.toString().trim()) {
    errors.push('Correct answer is required for short answer questions');
  }
  
  if (question.points === undefined || question.points < 0) {
    errors.push('Points must be a positive number');
  }
  
  return errors;
}

export function getRandomFeedbackMessage(isCorrect: boolean): string {
  const messages = isCorrect 
    ? FEEDBACK_MESSAGES.correct 
    : FEEDBACK_MESSAGES.incorrect;
  return messages[Math.floor(Math.random() * messages.length)];
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function getGradeFromPercentage(percentage: number): { grade: string; color: string } {
  if (percentage >= 90) return { grade: 'A+', color: 'text-success' };
  if (percentage >= 80) return { grade: 'A', color: 'text-success' };
  if (percentage >= 70) return { grade: 'B', color: 'text-primary' };
  if (percentage >= 60) return { grade: 'C', color: 'text-warning' };
  if (percentage >= 50) return { grade: 'D', color: 'text-warning' };
  return { grade: 'F', color: 'text-error' };
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
