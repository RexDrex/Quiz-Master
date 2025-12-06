import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, GripVertical, Sparkles, Save, ArrowLeft, Settings } from 'lucide-react';
import { Quiz, Question, QuestionType, DifficultyLevel } from '@/types/quiz';
import { useQuizStore } from '@/store/quizStore';
import { generateId } from '@/utils/helpers';
import { Button } from '@/components/common/Button';
import { Input, TextArea } from '@/components/common/Input';
import { Card } from '@/components/common/Card';
import { Modal } from '@/components/common/Modal';

interface QuizCreatorProps {
  quiz?: Quiz;
  onSave?: (quiz: Quiz) => void;
  onBack?: () => void;
}

export const QuizCreator: React.FC<QuizCreatorProps> = ({
  quiz: existingQuiz,
  onSave,
  onBack,
}) => {
  const { createQuiz, updateQuiz, generateQuestions, isGenerating } = useQuizStore();
  
  const [title, setTitle] = useState(existingQuiz?.title || '');
  const [description, setDescription] = useState(existingQuiz?.description || '');
  const [questions, setQuestions] = useState<Question[]>(existingQuiz?.questions || []);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiCount, setAiCount] = useState(5);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const addQuestion = (type: QuestionType = 'mcq') => {
    const newQuestion: Question = {
      id: generateId('question'),
      type,
      text: '',
      options: type === 'mcq' ? ['', '', '', ''] : undefined,
      correctAnswer: type === 'mcq' ? 0 : type === 'true-false' ? true : '',
      explanation: '',
      points: 1,
      difficulty: 'medium',
    };
    setQuestions([...questions, newQuestion]);
    setExpandedQuestion(newQuestion.id);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const handleAIGenerate = async () => {
    if (!aiTopic.trim()) return;
    
    const generatedQuestions = await generateQuestions(aiTopic, aiCount);
    setQuestions([...questions, ...generatedQuestions]);
    setShowAIModal(false);
    setAiTopic('');
  };

  const handleSave = () => {
    if (!title.trim()) {
      return;
    }

    if (existingQuiz) {
      updateQuiz(existingQuiz.id, { title, description, questions });
      onSave?.({ ...existingQuiz, title, description, questions });
    } else {
      const id = createQuiz({ title, description, questions });
      const newQuiz = useQuizStore.getState().getQuiz(id);
      if (newQuiz) {
        onSave?.(newQuiz);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} icon={ArrowLeft}>
          Back
        </Button>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => setShowAIModal(true)}
            icon={Sparkles}
          >
            Generate with AI
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            icon={Save}
            disabled={!title.trim() || questions.length === 0}
          >
            Save Quiz
          </Button>
        </div>
      </div>

      <Card>
        <div className="space-y-4">
          <Input
            label="Quiz Title"
            placeholder="Enter quiz title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextArea
            label="Description"
            placeholder="Enter quiz description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            Questions ({questions.length})
          </h2>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => addQuestion('mcq')}>
              + MCQ
            </Button>
            <Button variant="secondary" size="sm" onClick={() => addQuestion('true-false')}>
              + True/False
            </Button>
            <Button variant="secondary" size="sm" onClick={() => addQuestion('short-answer')}>
              + Short Answer
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {questions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-2 text-muted-foreground cursor-move">
                    <GripVertical className="h-5 w-5" />
                    <span className="font-medium">Q{index + 1}</span>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex gap-4">
                      <select
                        value={question.type}
                        onChange={(e) => updateQuestion(question.id, {
                          type: e.target.value as QuestionType,
                          options: e.target.value === 'mcq' ? ['', '', '', ''] : undefined,
                          correctAnswer: e.target.value === 'mcq' ? 0 : e.target.value === 'true-false' ? true : '',
                        })}
                        className="input-field w-40"
                      >
                        <option value="mcq">Multiple Choice</option>
                        <option value="true-false">True/False</option>
                        <option value="short-answer">Short Answer</option>
                      </select>
                      
                      <select
                        value={question.difficulty || 'medium'}
                        onChange={(e) => updateQuestion(question.id, { difficulty: e.target.value as DifficultyLevel })}
                        className="input-field w-32"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                      
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        value={question.points}
                        onChange={(e) => updateQuestion(question.id, { points: parseInt(e.target.value) || 1 })}
                        className="w-24"
                        placeholder="Points"
                      />
                    </div>
                    
                    <TextArea
                      placeholder="Enter your question..."
                      value={question.text}
                      onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                    />
                    
                    {question.type === 'mcq' && question.options && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Options (click to set correct answer)</p>
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateQuestion(question.id, { correctAnswer: optIndex })}
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                                question.correctAnswer === optIndex
                                  ? 'bg-success text-success-foreground'
                                  : 'bg-muted text-muted-foreground hover:bg-accent'
                              }`}
                            >
                              {String.fromCharCode(65 + optIndex)}
                            </button>
                            <Input
                              placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                              value={option}
                              onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {question.type === 'true-false' && (
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => updateQuestion(question.id, { correctAnswer: true })}
                          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                            question.correctAnswer === true
                              ? 'bg-success text-success-foreground'
                              : 'bg-muted text-muted-foreground hover:bg-accent'
                          }`}
                        >
                          True
                        </button>
                        <button
                          type="button"
                          onClick={() => updateQuestion(question.id, { correctAnswer: false })}
                          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                            question.correctAnswer === false
                              ? 'bg-success text-success-foreground'
                              : 'bg-muted text-muted-foreground hover:bg-accent'
                          }`}
                        >
                          False
                        </button>
                      </div>
                    )}
                    
                    {question.type === 'short-answer' && (
                      <Input
                        label="Correct Answer"
                        placeholder="Enter the correct answer..."
                        value={question.correctAnswer as string}
                        onChange={(e) => updateQuestion(question.id, { correctAnswer: e.target.value.toLowerCase() })}
                      />
                    )}
                    
                    <TextArea
                      label="Explanation (optional)"
                      placeholder="Explain why this answer is correct..."
                      value={question.explanation || ''}
                      onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
                    />
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteQuestion(question.id)}
                    className="text-error hover:bg-error/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {questions.length === 0 && (
          <Card className="text-center py-12">
            <div className="space-y-4">
              <div className="text-muted-foreground">
                <p className="text-lg font-medium">No questions yet</p>
                <p className="text-sm">Add questions manually or generate them with AI</p>
              </div>
              <div className="flex justify-center gap-4">
                <Button variant="secondary" onClick={() => addQuestion('mcq')} icon={Plus}>
                  Add Question
                </Button>
                <Button variant="primary" onClick={() => setShowAIModal(true)} icon={Sparkles}>
                  Generate with AI
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      <Modal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        title="Generate Questions with AI"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Topic"
            placeholder="e.g., World History, JavaScript Basics, Biology..."
            value={aiTopic}
            onChange={(e) => setAiTopic(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Number of Questions
            </label>
            <input
              type="range"
              min={1}
              max={20}
              value={aiCount}
              onChange={(e) => setAiCount(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-sm text-muted-foreground mt-1">
              {aiCount} questions
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowAIModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAIGenerate}
              loading={isGenerating}
              disabled={!aiTopic.trim()}
              icon={Sparkles}
            >
              Generate
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
