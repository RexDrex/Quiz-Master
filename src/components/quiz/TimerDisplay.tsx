import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTime } from '@/utils/helpers';
import { TIMER_WARNING_THRESHOLD } from '@/utils/constants';

interface TimerDisplayProps {
  initialTime?: number;
  isCountdown?: boolean;
  onTimeUp?: () => void;
  onTimeUpdate?: (time: number) => void;
  isPaused?: boolean;
  className?: string;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  initialTime = 0,
  isCountdown = false,
  onTimeUp,
  onTimeUpdate,
  isPaused = false,
  className,
}) => {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setTime((prev) => {
        const newTime = isCountdown ? prev - 1 : prev + 1;
        
        if (isCountdown && newTime <= 0) {
          clearInterval(interval);
          onTimeUp?.();
          return 0;
        }
        
        onTimeUpdate?.(newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, isCountdown, onTimeUp, onTimeUpdate]);

  const isWarning = isCountdown && time <= TIMER_WARNING_THRESHOLD;

  return (
    <div
      className={cn(
        'flex items-center gap-2 timer-display',
        isWarning && 'timer-warning',
        className
      )}
    >
      <Clock className="h-5 w-5" />
      <span>{formatTime(time)}</span>
    </div>
  );
};
