import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Brain, Plus, Sparkles, PlayCircle, BarChart3, Share2, 
  Clock, Users, Trophy, Trash2, Copy, Edit, MoreVertical,
  FileQuestion, Zap, Target
} from 'lucide-react';
import { useQuizStore } from '@/store/quizStore';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/common/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { formatDate } from '@/utils/helpers';
import { toast } from 'sonner';

const Index = () => {
  const navigate = useNavigate();
  const { quizzes, deleteQuiz, duplicateQuiz, searchQuizzes, getQuizAnalytics } = useQuizStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuizzes = searchQuery ? searchQuizzes(searchQuery) : quizzes;

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteQuiz(id);
      toast.success('Quiz deleted successfully');
    }
  };

  const handleDuplicate = (id: string) => {
    const newId = duplicateQuiz(id);
    toast.success('Quiz duplicated successfully');
    navigate(`/edit/${newId}`);
  };

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Generation',
      description: 'Generate quiz questions instantly using advanced AI',
    },
    {
      icon: Zap,
      title: 'Instant Feedback',
      description: 'Get real-time feedback on answers as you go',
    },
    {
      icon: BarChart3,
      title: 'Detailed Analytics',
      description: 'Track performance with comprehensive analytics',
    },
    {
      icon: Share2,
      title: 'Easy Sharing',
      description: 'Share quizzes via link or QR code',
    },
  ];

  return (
    <Layout>
      <div className="space-y-12">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 py-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="inline-flex p-4 rounded-2xl bg-primary/10 mb-4"
          >
            <Brain className="h-16 w-16 text-primary" />
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground">
            Create Amazing Quizzes with{' '}
            <span className="gradient-text">QuizMaster</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Build engaging quizzes in minutes using AI, share them instantly, 
            and track results with powerful analytics.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/create">
              <Button variant="hero" size="lg" icon={Plus}>
                Create Your First Quiz
              </Button>
            </Link>
            <Link to="/create">
              <Button variant="secondary" size="lg" icon={Sparkles}>
                Try AI Generation
              </Button>
            </Link>
          </div>
        </motion.section>

        {/* Features Grid */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Card className="h-full text-center">
                <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.section>

        {/* Your Quizzes Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Your Quizzes</h2>
              <p className="text-muted-foreground">
                {quizzes.length} {quizzes.length === 1 ? 'quiz' : 'quizzes'} created
              </p>
            </div>
            <div className="flex gap-4 w-full sm:w-auto">
              <Input
                placeholder="Search quizzes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="sm:w-64"
              />
              <Link to="/create">
                <Button variant="primary" icon={Plus}>
                  New
                </Button>
              </Link>
            </div>
          </div>

          {filteredQuizzes.length === 0 ? (
            <Card className="text-center py-16">
              <div className="space-y-4">
                <div className="inline-flex p-4 rounded-full bg-muted">
                  <FileQuestion className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {searchQuery ? 'No quizzes found' : 'No quizzes yet'}
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery 
                      ? 'Try a different search term' 
                      : 'Create your first quiz to get started'}
                  </p>
                </div>
                {!searchQuery && (
                  <Link to="/create">
                    <Button variant="primary" icon={Plus}>
                      Create Quiz
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuizzes.map((quiz, index) => {
                const analytics = getQuizAnalytics(quiz.id);
                
                return (
                  <motion.div
                    key={quiz.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="h-full flex flex-col">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="line-clamp-1">{quiz.title}</CardTitle>
                            <CardDescription className="line-clamp-2">
                              {quiz.description || 'No description'}
                            </CardDescription>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            quiz.isPublished 
                              ? 'bg-success/10 text-success' 
                              : 'bg-warning/10 text-warning'
                          }`}>
                            {quiz.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="flex-1">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="flex items-center justify-center gap-1 text-foreground font-semibold">
                              <FileQuestion className="h-4 w-4 text-muted-foreground" />
                              {quiz.questions.length}
                            </div>
                            <p className="text-xs text-muted-foreground">Questions</p>
                          </div>
                          <div>
                            <div className="flex items-center justify-center gap-1 text-foreground font-semibold">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              {analytics.attempts.length}
                            </div>
                            <p className="text-xs text-muted-foreground">Attempts</p>
                          </div>
                          <div>
                            <div className="flex items-center justify-center gap-1 text-foreground font-semibold">
                              <Target className="h-4 w-4 text-muted-foreground" />
                              {quiz.questions.reduce((sum, q) => sum + q.points, 0)}
                            </div>
                            <p className="text-xs text-muted-foreground">Points</p>
                          </div>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="flex gap-2">
                        <Link to={`/quiz/${quiz.id}`} className="flex-1">
                          <Button variant="primary" fullWidth icon={PlayCircle}>
                            Take
                          </Button>
                        </Link>
                        <Link to={`/edit/${quiz.id}`}>
                          <Button variant="secondary" icon={Edit}>
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          onClick={() => handleDuplicate(quiz.id)}
                          title="Duplicate"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => handleDelete(quiz.id, quiz.title)}
                          className="text-error hover:bg-error/10"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        {/* Stats Section */}
        {quizzes.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid md:grid-cols-3 gap-6"
          >
            <Card className="text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-foreground">{quizzes.length}</div>
                  <div className="text-sm text-muted-foreground">Total Quizzes</div>
                </div>
              </div>
            </Card>
            <Card className="text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="p-3 rounded-xl bg-success/10">
                  <FileQuestion className="h-6 w-6 text-success" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-foreground">
                    {quizzes.reduce((sum, q) => sum + q.questions.length, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Questions</div>
                </div>
              </div>
            </Card>
            <Card className="text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="p-3 rounded-xl bg-warning/10">
                  <Trophy className="h-6 w-6 text-warning" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-foreground">
                    {quizzes.reduce((sum, q) => sum + getQuizAnalytics(q.id).attempts.length, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Attempts</div>
                </div>
              </div>
            </Card>
          </motion.section>
        )}
      </div>
    </Layout>
  );
};

export default Index;
