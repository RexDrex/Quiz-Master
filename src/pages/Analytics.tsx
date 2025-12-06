import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, ChevronDown, Share2 } from 'lucide-react';
import { useQuizStore } from '@/store/quizStore';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { ShareInterface } from '@/components/sharing/ShareInterface';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';

const Analytics = () => {
  const navigate = useNavigate();
  const { quizzes, getQuizAnalytics } = useQuizStore();
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(
    quizzes.length > 0 ? quizzes[0].id : null
  );
  const [showShareModal, setShowShareModal] = useState(false);

  const selectedQuiz = selectedQuizId ? quizzes.find(q => q.id === selectedQuizId) : null;
  const analytics = selectedQuizId ? getQuizAnalytics(selectedQuizId) : null;

  if (quizzes.length === 0) {
    return (
      <Layout>
        <Card className="text-center py-12">
          <div className="space-y-4">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <h2 className="text-xl font-semibold text-foreground">No Analytics Yet</h2>
              <p className="text-muted-foreground">
                Create quizzes and have people take them to see analytics here.
              </p>
            </div>
            <Button variant="primary" onClick={() => navigate('/create')}>
              Create Your First Quiz
            </Button>
          </div>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground">
              View performance metrics and insights for your quizzes
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={selectedQuizId || ''}
                onChange={(e) => setSelectedQuizId(e.target.value)}
                className="input-field pr-10 appearance-none cursor-pointer"
              >
                {quizzes.map((quiz) => (
                  <option key={quiz.id} value={quiz.id}>
                    {quiz.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
            
            {selectedQuiz && (
              <Button
                variant="secondary"
                onClick={() => setShowShareModal(true)}
                icon={Share2}
              >
                Share
              </Button>
            )}
          </div>
        </div>

        {selectedQuiz && analytics && (
          <motion.div
            key={selectedQuiz.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AnalyticsDashboard analytics={analytics} quiz={selectedQuiz} />
          </motion.div>
        )}

        <Modal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          title={`Share: ${selectedQuiz?.title}`}
          size="lg"
        >
          {selectedQuiz && <ShareInterface quiz={selectedQuiz} />}
        </Modal>
      </div>
    </Layout>
  );
};

export default Analytics;
