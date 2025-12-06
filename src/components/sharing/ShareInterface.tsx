import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Link, Copy, Check, Download, Share2, Mail, MessageCircle } from 'lucide-react';
import { Quiz } from '@/types/quiz';
import { useQuizStore } from '@/store/quizStore';
import { Button } from '@/components/common/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { toast } from 'sonner';

interface ShareInterfaceProps {
  quiz: Quiz;
}

export const ShareInterface: React.FC<ShareInterfaceProps> = ({ quiz }) => {
  const { exportQuiz } = useQuizStore();
  const [copied, setCopied] = useState(false);
  
  const shareUrl = `${window.location.origin}/quiz/${quiz.id}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const downloadQRCode = () => {
    const svg = document.getElementById('quiz-qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const link = document.createElement('a');
      link.download = `${quiz.title.replace(/\s+/g, '-')}-qr-code.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const exportQuizData = () => {
    const data = exportQuiz(quiz.id);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = `${quiz.title.replace(/\s+/g, '-')}.json`;
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
    toast.success('Quiz exported successfully!');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Take my quiz: ${quiz.title}`);
    const body = encodeURIComponent(`I've created a quiz for you!\n\nTitle: ${quiz.title}\n\nTake it here: ${shareUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(`Take my quiz "${quiz.title}"! ${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              Share Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant={copied ? 'primary' : 'secondary'}
                onClick={copyToClipboard}
                icon={copied ? Check : Copy}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
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
            <CardTitle>QR Code</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-background rounded-lg">
              <QRCodeSVG
                id="quiz-qr-code"
                value={shareUrl}
                size={200}
                level="H"
                includeMargin
                bgColor="transparent"
                fgColor="currentColor"
                className="text-foreground"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Scan this QR code to take the quiz on any device
            </p>
            <Button
              variant="secondary"
              onClick={downloadQRCode}
              icon={Download}
            >
              Download QR Code
            </Button>
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
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Share Via
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                onClick={shareViaEmail}
                icon={Mail}
              >
                Email
              </Button>
              <Button
                variant="secondary"
                onClick={shareViaWhatsApp}
                icon={MessageCircle}
              >
                WhatsApp
              </Button>
              <Button
                variant="secondary"
                onClick={exportQuizData}
                icon={Download}
              >
                Export JSON
              </Button>
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
            <CardTitle>Quiz Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Title:</span>
                <span className="font-medium text-foreground">{quiz.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Questions:</span>
                <span className="font-medium text-foreground">{quiz.questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Points:</span>
                <span className="font-medium text-foreground">
                  {quiz.questions.reduce((sum, q) => sum + q.points, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className={`font-medium ${quiz.isPublished ? 'text-success' : 'text-warning'}`}>
                  {quiz.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
