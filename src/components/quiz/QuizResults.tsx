import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, Target, RotateCcw, Home, Share2, CheckCircle, XCircle } from 'lucide-react';
import { Quiz, QuizAttempt } from '@/types/quiz';
import { formatTime, calculatePercentage, getGradeFromPercentage } from '@/utils/helpers';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import Confetti from './Confetti';

interface QuizResultsProps {
  quiz: Quiz;
  attempt: QuizAttempt;
  onRetake?: () => void;
  onExit?: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  quiz,
  attempt,
  onRetake,
  onExit,
}) => {
  const percentage = calculatePercentage(attempt.score, attempt.totalPossible);
  const { grade, color } = getGradeFromPercentage(percentage);
  const isPassing = percentage >= 60;

  const correctCount = quiz.questions.filter(
    (q) => attempt.answers[q.id] === q.correctAnswer
  ).length;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {isPassing && <Confetti />}
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-4"
        >
          <Trophy className={`h-12 w-12 ${color}`} />
        </motion.div>
        
        <h1 className="text-3xl font-bold text-foreground mb-2">Quiz Complete!</h1>
        <p className="text-muted-foreground">
          {isPassing ? 'Great job! You passed the quiz.' : 'Keep practicing! You can do better.'}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="text-center">
          <div className="space-y-6">
            <div>
              <div className={`text-6xl font-bold ${color}`}>{percentage}%</div>
              <div className={`text-2xl font-semibold ${color}`}>Grade: {grade}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-success mb-1">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-2xl font-bold">{correctCount}</span>
                </div>
                <p className="text-sm text-muted-foreground">Correct</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-error mb-1">
                  <XCircle className="h-5 w-5" />
                  <span className="text-2xl font-bold">{quiz.questions.length - correctCount}</span>
                </div>
                <p className="text-sm text-muted-foreground">Incorrect</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-primary mb-1">
                  <Clock className="h-5 w-5" />
                  <span className="text-2xl font-bold">{formatTime(attempt.timeSpent)}</span>
                </div>
                <p className="text-sm text-muted-foreground">Time</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 pt-4 border-t border-border">
              <Target className="h-5 w-5 text-muted-foreground" />
              <span className="text-foreground">
                {attempt.score} / {attempt.totalPossible} points
              </span>
            </div>
          </div>
        </Card>
      </motion.div>

      {quiz.settings.showExplanations && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold text-foreground">Review Your Answers</h2>
          
          {quiz.questions.map((question, index) => {
            const userAnswer = attempt.answers[question.id];
            const isCorrect = userAnswer === question.correctAnswer;
            
            return (
              <Card key={question.id} className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium ${
                    isCorrect ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                  }`}>
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{question.text}</p>
                    
                    <div className="mt-2 space-y-1 text-sm">
                      <p className={isCorrect ? 'text-success' : 'text-error'}>
                        Your answer: {
                          question.type === 'mcq' && question.options
                            ? question.options[userAnswer as number] || 'Not answered'
                            : String(userAnswer ?? 'Not answered')
                        }
                      </p>
                      {!isCorrect && (
                        <p className="text-success">
                          Correct answer: {
                            question.type === 'mcq' && question.options
                              ? question.options[question.correctAnswer as number]
                              : String(question.correctAnswer)
                          }
                        </p>
                      )}
                    </div>
                    
                    {question.explanation && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {question.explanation}
                      </p>
                    )}
                  </div>
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-error flex-shrink-0" />
                  )}
                </div>
              </Card>
            );
          })}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        {quiz.settings.allowRetake && onRetake && (
          <Button variant="primary" onClick={onRetake} icon={RotateCcw}>
            Retake Quiz
          </Button>
        )}
        {onExit && (
          <Button variant="secondary" onClick={onExit} icon={Home}>
            Back to Home
          </Button>
        )}
      </motion.div>
    </div>
  );
};
