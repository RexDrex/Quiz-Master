import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Sun, Moon, Monitor, Trash2, Download, Upload, AlertTriangle } from 'lucide-react';
import { useQuizStore } from '@/store/quizStore';
import { Layout } from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { toast } from 'sonner';

const Settings = () => {
  const { preferences, updatePreferences, clearStorage, quizzes, attempts } = useQuizStore();
  const [showClearModal, setShowClearModal] = useState(false);

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    updatePreferences({ theme });
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    
    toast.success(`Theme changed to ${theme}`);
  };

  const handleExportData = () => {
    const data = {
      quizzes,
      attempts,
      preferences,
      exportedAt: new Date().toISOString(),
      app: 'QuizMaster',
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = `quizmaster-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully');
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.quizzes && data.app === 'QuizMaster') {
          toast.success('Data imported successfully. Refresh the page to see changes.');
        } else {
          throw new Error('Invalid backup file');
        }
      } catch (error) {
        toast.error('Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    clearStorage();
    setShowClearModal(false);
    toast.success('All data has been cleared');
  };

  const themeOptions = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ] as const;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <SettingsIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Customize your QuizMaster experience</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Theme
                  </label>
                  <div className="flex gap-2">
                    {themeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleThemeChange(option.value)}
                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-colors ${
                          preferences.theme === option.value
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:bg-accent'
                        }`}
                      >
                        <option.icon className="h-4 w-4" />
                        <span className="font-medium">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Font Size
                  </label>
                  <div className="flex gap-2">
                    {(['small', 'medium', 'large'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => updatePreferences({ fontSize: size })}
                        className={`flex-1 p-3 rounded-lg border transition-colors capitalize ${
                          preferences.fontSize === size
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:bg-accent'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Animations</p>
                    <p className="text-sm text-muted-foreground">Enable smooth animations</p>
                  </div>
                  <button
                    onClick={() => updatePreferences({ animations: !preferences.animations })}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      preferences.animations ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-background shadow transition-transform ${
                        preferences.animations ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quiz Defaults</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Default Question Count (AI Generation)
                  </label>
                  <input
                    type="range"
                    min={5}
                    max={20}
                    value={preferences.defaultQuestionCount}
                    onChange={(e) => updatePreferences({ defaultQuestionCount: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>5</span>
                    <span className="font-medium text-foreground">{preferences.defaultQuestionCount}</span>
                    <span>20</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Auto-save</p>
                    <p className="text-sm text-muted-foreground">Save progress automatically</p>
                  </div>
                  <button
                    onClick={() => updatePreferences({ autoSave: !preferences.autoSave })}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      preferences.autoSave ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-background shadow transition-transform ${
                        preferences.autoSave ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Button
                    variant="secondary"
                    onClick={handleExportData}
                    icon={Download}
                    fullWidth
                  >
                    Export All Data
                  </Button>
                  <label className="cursor-pointer">
                    <Button
                      variant="secondary"
                      icon={Upload}
                      fullWidth
                      className="pointer-events-none"
                    >
                      Import Data
                    </Button>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="pt-4 border-t border-border">
                  <Button
                    variant="danger"
                    onClick={() => setShowClearModal(true)}
                    icon={Trash2}
                    fullWidth
                  >
                    Clear All Data
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    This will permanently delete all quizzes and attempts
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Storage Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quizzes</span>
                  <span className="text-foreground font-medium">{quizzes.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Questions</span>
                  <span className="text-foreground font-medium">
                    {quizzes.reduce((sum, q) => sum + q.questions.length, 0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quiz Attempts</span>
                  <span className="text-foreground font-medium">{attempts.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Modal
          isOpen={showClearModal}
          onClose={() => setShowClearModal(false)}
          title="Clear All Data"
          size="sm"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-error/10 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-error flex-shrink-0" />
              <p className="text-sm text-foreground">
                This action cannot be undone. All your quizzes, questions, and attempt history will be permanently deleted.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowClearModal(false)}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleClearData}
                fullWidth
              >
                Delete Everything
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default Settings;
