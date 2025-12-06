import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlayCircle, Clock, FileQuestion, Target, ArrowLeft } from 'lucide-react';
import { useQuizStore } from '@/store/quizStore';
import { QuizTaker } from '@/components/quiz/QuizTaker';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

const TakeQuiz = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getQuiz } = useQuizStore();
  const [started, setStarted] = useState(false);
  const [userName, setUserName] = useState('');

  const quiz = id ? getQuiz(id) : undefined;

  if (!quiz) {
    return (
      <Layout>
        <Card className="text-center py-12 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-foreground mb-4">Quiz Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The quiz you're looking for doesn't exist or has been deleted.
          </p>
          <Button variant="primary" onClick={() => navigate('/')} icon={ArrowLeft}>
            Back to Home
          </Button>
        </Card>
      </Layout>
    );
  }

  if (!started) {
    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);

    return (
      <Layout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto space-y-6"
        >
          <Card className="text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">{quiz.title}</h1>
              {quiz.description && (
                <p className="text-muted-foreground">{quiz.description}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-muted">
                <FileQuestion className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-foreground">
                  {quiz.questions.length}
                </div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <Target className="h-6 w-6 mx-auto mb-2 text-success" />
                <div className="text-2xl font-bold text-foreground">{totalPoints}</div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <Clock className="h-6 w-6 mx-auto mb-2 text-warning" />
                <div className="text-2xl font-bold text-foreground">
                  {quiz.settings.timeLimit 
                    ? `${Math.floor(quiz.settings.timeLimit / 60)}m`
                    : '∞'}
                </div>
                <div className="text-sm text-muted-foreground">Time Limit</div>
              </div>
            </div>

            {quiz.settings.requireName && (
              <div className="max-w-sm mx-auto">
                <Input
                  label="Your Name"
                  placeholder="Enter your name to continue"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="hero"
                size="lg"
                onClick={() => setStarted(true)}
                disabled={quiz.settings.requireName && !userName.trim()}
                icon={PlayCircle}
              >
                Start Quiz
              </Button>
              <Button variant="secondary" size="lg" onClick={() => navigate('/')}>
                Back to Home
              </Button>
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                {quiz.settings.showFeedback === 'immediate' && '• Immediate feedback after each question'}
                {quiz.settings.showFeedback === 'end' && '• Results shown at the end'}
                {quiz.settings.showFeedback === 'never' && '• No feedback provided'}
              </p>
              {quiz.settings.allowRetake && <p>• You can retake this quiz</p>}
              {quiz.settings.shuffleQuestions && <p>• Questions are shuffled</p>}
            </div>
          </Card>
        </motion.div>
      </Layout>
    );
  }

  return (
    <Layout>
      <QuizTaker
        quiz={quiz}
        onExit={() => navigate('/')}
      />
    </Layout>
  );
};

export default TakeQuiz;
