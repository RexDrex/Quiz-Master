import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, Trophy, Clock, TrendingUp, Target, Award } from 'lucide-react';
import { Analytics, Quiz } from '@/types/quiz';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { formatTime, calculatePercentage } from '@/utils/helpers';

interface AnalyticsDashboardProps {
  analytics: Analytics;
  quiz: Quiz;
}

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  analytics,
  quiz,
}) => {
  const scoreDistributionData = analytics.scoreDistribution.map((count, index) => ({
    range: `${index * 10}-${index * 10 + 10}%`,
    count,
  }));

  const questionPerformanceData = quiz.questions.map((q, index) => {
    const perf = analytics.questionPerformance[q.id];
    return {
      name: `Q${index + 1}`,
      correct: perf?.correct || 0,
      incorrect: (perf?.total || 0) - (perf?.correct || 0),
      difficulty: perf?.difficulty || 0,
    };
  });

  const dailyAttemptsData = Object.entries(analytics.dailyAttempts)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7)
    .map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      attempts: count,
    }));

  const avgPercentage = analytics.attempts.length > 0
    ? calculatePercentage(analytics.averageScore, quiz.questions.reduce((sum, q) => sum + q.points, 0))
    : 0;

  const stats = [
    {
      icon: Users,
      label: 'Total Attempts',
      value: analytics.attempts.length,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Trophy,
      label: 'Average Score',
      value: `${avgPercentage}%`,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      icon: Clock,
      label: 'Avg. Time',
      value: formatTime(Math.round(analytics.averageTimeSpent)),
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      icon: Target,
      label: 'Completion Rate',
      value: `${analytics.completionRate}%`,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  if (analytics.attempts.length === 0) {
    return (
      <Card className="text-center py-12">
        <div className="space-y-4">
          <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">No Data Yet</h3>
            <p className="text-muted-foreground">
              Analytics will appear once people start taking this quiz
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="text-center">
              <div className={`inline-flex p-3 rounded-full ${stat.bgColor} mb-3`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Question Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={questionPerformanceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="correct" stackId="a" fill="hsl(var(--success))" />
                  <Bar dataKey="incorrect" stackId="a" fill="hsl(var(--error))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {dailyAttemptsData.length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Daily Attempts (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyAttemptsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="attempts"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Attempts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Score</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Time</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {analytics.attempts.slice(-10).reverse().map((attempt) => (
                  <tr key={attempt.id} className="border-b border-border hover:bg-accent/50">
                    <td className="py-3 px-4 text-foreground">
                      {attempt.userName || 'Anonymous'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${
                        (attempt.score / attempt.totalPossible) >= 0.6 ? 'text-success' : 'text-error'
                      }`}>
                        {attempt.score}/{attempt.totalPossible} ({calculatePercentage(attempt.score, attempt.totalPossible)}%)
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {formatTime(attempt.timeSpent)}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {new Date(attempt.completedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
