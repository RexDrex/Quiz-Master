import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizCreator } from '@/components/quiz/QuizCreator';
import { Layout } from '@/components/layout/Layout';
import { toast } from 'sonner';

const CreateQuiz = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <QuizCreator
        onSave={(quiz) => {
          toast.success('Quiz saved successfully!');
          navigate(`/edit/${quiz.id}`);
        }}
        onBack={() => navigate('/')}
      />
    </Layout>
  );
};

export default CreateQuiz;
