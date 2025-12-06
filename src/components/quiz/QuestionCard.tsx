import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Question } from '@/types/quiz';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer?: string | number | boolean;
  onAnswer: (answer: string | number | boolean) => void;
  showFeedback?: boolean;
  isAnswered?: boolean;
  onNext?: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswer,
  showFeedback = false,
  isAnswered = false,
  onNext,
}) => {
  const [shortAnswer, setShortAnswer] = useState('');
  
  const isCorrect = selectedAnswer === question.correctAnswer;
  const showResult = showFeedback && isAnswered;

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    onAnswer(index);
  };

  const handleTrueFalseClick = (value: boolean) => {
    if (isAnswered) return;
    onAnswer(value);
  };

  const handleShortAnswerSubmit = () => {
    if (isAnswered || !shortAnswer.trim()) return;
    onAnswer(shortAnswer.trim().toLowerCase());
  };

  const getOptionClass = (index: number) => {
    if (!showResult) {
      return selectedAnswer === index ? 'option-card-selected' : '';
    }
    
    if (index === question.correctAnswer) {
      return 'option-card-correct';
    }
    
    if (selectedAnswer === index && index !== question.correctAnswer) {
      return 'option-card-incorrect';
    }
    
    return '';
  };

  const getTrueFalseClass = (value: boolean) => {
    if (!showResult) {
      return selectedAnswer === value ? 'option-card-selected' : '';
    }
    
    if (value === question.correctAnswer) {
      return 'option-card-correct';
    }
    
    if (selectedAnswer === value && value !== question.correctAnswer) {
      return 'option-card-incorrect';
    }
    
    return '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="question-card"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
            {question.difficulty || 'medium'}
          </span>
          <span className="text-sm text-muted-foreground">
            {question.points} {question.points === 1 ? 'point' : 'points'}
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          {questionNumber} / {totalQuestions}
        </span>
      </div>

      <h3 className="text-xl font-semibold text-foreground mb-6">
        {question.text}
      </h3>

      {question.type === 'mcq' && question.options && (
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              whileHover={!isAnswered ? { scale: 1.01 } : {}}
              whileTap={!isAnswered ? { scale: 0.99 } : {}}
              className={cn(
                'option-card w-full text-left',
                getOptionClass(index)
              )}
              onClick={() => handleOptionClick(index)}
              disabled={isAnswered}
            >
              <div className="flex items-center gap-3 w-full">
                <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-current text-sm font-medium">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{option}</span>
                {showResult && index === question.correctAnswer && (
                  <Check className="h-5 w-5 text-success" />
                )}
                {showResult && selectedAnswer === index && index !== question.correctAnswer && (
                  <X className="h-5 w-5 text-error" />
                )}
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {question.type === 'true-false' && (
        <div className="grid grid-cols-2 gap-4">
          {[true, false].map((value) => (
            <motion.button
              key={String(value)}
              whileHover={!isAnswered ? { scale: 1.02 } : {}}
              whileTap={!isAnswered ? { scale: 0.98 } : {}}
              className={cn(
                'option-card justify-center py-6',
                getTrueFalseClass(value)
              )}
              onClick={() => handleTrueFalseClick(value)}
              disabled={isAnswered}
            >
              <span className="text-lg font-medium">
                {value ? 'True' : 'False'}
              </span>
              {showResult && value === question.correctAnswer && (
                <Check className="ml-2 h-5 w-5 text-success" />
              )}
              {showResult && selectedAnswer === value && value !== question.correctAnswer && (
                <X className="ml-2 h-5 w-5 text-error" />
              )}
            </motion.button>
          ))}
        </div>
      )}

      {question.type === 'short-answer' && (
        <div className="space-y-4">
          <Input
            placeholder="Type your answer..."
            value={shortAnswer}
            onChange={(e) => setShortAnswer(e.target.value)}
            disabled={isAnswered}
            onKeyDown={(e) => e.key === 'Enter' && handleShortAnswerSubmit()}
          />
          {!isAnswered && (
            <Button onClick={handleShortAnswerSubmit} disabled={!shortAnswer.trim()}>
              Submit Answer
            </Button>
          )}
        </div>
      )}

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6"
          >
            <div
              className={cn(
                'p-4 rounded-lg',
                isCorrect ? 'bg-success/10 border border-success' : 'bg-error/10 border border-error'
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <>
                    <Check className="h-5 w-5 text-success" />
                    <span className="font-semibold text-success">Correct!</span>
                  </>
                ) : (
                  <>
                    <X className="h-5 w-5 text-error" />
                    <span className="font-semibold text-error">Incorrect</span>
                  </>
                )}
              </div>
              {question.explanation && (
                <div className="flex items-start gap-2 mt-2 text-sm text-muted-foreground">
                  <HelpCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>{question.explanation}</p>
                </div>
              )}
            </div>
            
            {onNext && (
              <div className="mt-4 flex justify-end">
                <Button onClick={onNext} iconRight={undefined}>
                  Next Question
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
