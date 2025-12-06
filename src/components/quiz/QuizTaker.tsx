import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Flag } from 'lucide-react';
import { Quiz, Question } from '@/types/quiz';
import { useQuizStore } from '@/store/quizStore';
import { shuffleArray } from '@/utils/helpers';
import { QuestionCard } from './QuestionCard';
import { ProgressBar } from './ProgressBar';
import { TimerDisplay } from './TimerDisplay';
import { Button } from '@/components/common/Button';
import { QuizResults } from './QuizResults';

interface QuizTakerProps {
  quiz: Quiz;
  onComplete?: () => void;
  onExit?: () => void;
}

export const QuizTaker: React.FC<QuizTakerProps> = ({
  quiz,
  onComplete,
  onExit,
}) => {
  const { startAttempt, submitAnswer, completeAttempt, getActiveAttempt, updateAttemptTime } = useQuizStore();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number | boolean>>({});
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({});
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    let preparedQuestions = [...quiz.questions];
    
    if (quiz.settings.shuffleQuestions) {
      preparedQuestions = shuffleArray(preparedQuestions);
    }
    
    if (quiz.settings.shuffleOptions) {
      preparedQuestions = preparedQuestions.map((q) => {
        if (q.type === 'mcq' && q.options) {
          const optionIndices = q.options.map((_, i) => i);
          const shuffledIndices = shuffleArray(optionIndices);
          const newCorrectIndex = shuffledIndices.indexOf(q.correctAnswer as number);
          
          return {
            ...q,
            options: shuffledIndices.map((i) => q.options![i]),
            correctAnswer: newCorrectIndex,
          };
        }
        return q;
      });
    }
    
    setQuestions(preparedQuestions);
    
    const id = startAttempt(quiz.id);
    setAttemptId(id);
  }, [quiz, startAttempt]);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = useCallback((answer: string | number | boolean) => {
    if (!currentQuestion || !attemptId) return;
    
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));
    submitAnswer(attemptId, currentQuestion.id, answer);
    
    if (quiz.settings.showFeedback === 'immediate') {
      setShowFeedback((prev) => ({ ...prev, [currentQuestion.id]: true }));
    }
  }, [currentQuestion, attemptId, quiz.settings.showFeedback, submitAnswer]);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, questions.length]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const handleComplete = useCallback(() => {
    if (!attemptId) return;
    
    updateAttemptTime(attemptId, timeSpent);
    completeAttempt(attemptId);
    setIsCompleted(true);
    onComplete?.();
  }, [attemptId, timeSpent, completeAttempt, updateAttemptTime, onComplete]);

  const handleTimeUpdate = useCallback((time: number) => {
    setTimeSpent(time);
  }, []);

  const isCurrentAnswered = currentQuestion && answers[currentQuestion.id] !== undefined;
  const answeredCount = Object.keys(answers).length;
  const isLastQuestion = currentIndex === questions.length - 1;

  if (isCompleted && attemptId) {
    const attempt = getActiveAttempt() || useQuizStore.getState().attempts.find(a => a.id === attemptId);
    if (attempt) {
      return (
        <QuizResults
          quiz={quiz}
          attempt={attempt}
          onRetake={() => {
            setIsCompleted(false);
            setCurrentIndex(0);
            setAnswers({});
            setShowFeedback({});
            setTimeSpent(0);
            const id = startAttempt(quiz.id);
            setAttemptId(id);
          }}
          onExit={onExit}
        />
      );
    }
  }

  if (questions.length === 0 || !currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="loading-spinner h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onExit} icon={ArrowLeft}>
          Exit
        </Button>
        {quiz.settings.showTimer && (
          <TimerDisplay
            initialTime={quiz.settings.timeLimit || 0}
            isCountdown={!!quiz.settings.timeLimit}
            onTimeUp={handleComplete}
            onTimeUpdate={handleTimeUpdate}
          />
        )}
      </div>

      {quiz.settings.showProgress && (
        <ProgressBar current={currentIndex + 1} total={questions.length} />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            selectedAnswer={answers[currentQuestion.id]}
            onAnswer={handleAnswer}
            showFeedback={quiz.settings.showFeedback === 'immediate'}
            isAnswered={answers[currentQuestion.id] !== undefined}
            onNext={
              quiz.settings.showFeedback === 'immediate' && isCurrentAnswered && !isLastQuestion
                ? handleNext
                : undefined
            }
          />
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          icon={ArrowLeft}
        >
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex
                  ? 'bg-primary'
                  : answers[questions[index].id] !== undefined
                  ? 'bg-success'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {isLastQuestion ? (
          <Button
            variant="primary"
            onClick={handleComplete}
            icon={Flag}
            disabled={answeredCount < questions.length}
          >
            Finish Quiz
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleNext}
            iconRight={ArrowRight}
            disabled={quiz.settings.showFeedback === 'immediate' && !isCurrentAnswered}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};
