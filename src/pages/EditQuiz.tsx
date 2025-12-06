import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuizStore } from '@/store/quizStore';
import { QuizCreator } from '@/components/quiz/QuizCreator';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const EditQuiz = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getQuiz } = useQuizStore();

  const quiz = id ? getQuiz(id) : undefined;

  if (!quiz) {
    return (
      <Layout>
        <Card className="text-center py-12">
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

  return (
    <Layout>
      <QuizCreator
        quiz={quiz}
        onSave={() => {
          toast.success('Quiz updated successfully!');
        }}
        onBack={() => navigate('/')}
      />
    </Layout>
  );
};

export default EditQuiz;
