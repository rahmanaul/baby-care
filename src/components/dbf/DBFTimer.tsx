import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayIcon, StopIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { useQueryClient } from "@tanstack/react-query";

interface DBFTimerProps {
  startTime: string | null;
  endTime: string | null;
  onStart: () => void;
  onStop: () => void;
}

export function DBFTimer({ startTime, endTime, onStart, onStop }: DBFTimerProps) {
  const [seconds, setSeconds] = useState(0);
  const minimumDuration = 15 * 60; // 15 minutes in seconds
  const queryClient = useQueryClient();

  const isRunning = startTime !== null && endTime === null;

  useEffect(() => {
    let interval: number | undefined;

    if (isRunning) {
      interval = window.setInterval(() => {
        const elapsedSeconds = Math.floor(
          (Date.now() - new Date(startTime).getTime()) / 1000
        );
        setSeconds(elapsedSeconds);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, startTime]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    if (isRunning) {
      onStop();
      queryClient.invalidateQueries({ queryKey: ['dbf-sessions'] });
    } else {
      setSeconds(0);
      onStart();
    }
  };

  const resetTimer = () => {
    setSeconds(0);
  };

  const getTimerColor = () => {
    if (seconds >= minimumDuration) {
      return 'text-green-600';
    }
    return 'text-gray-900';
  };

  return (
    <Card className="p-6">
      <div className="text-center">
        <div className={`text-4xl font-mono mb-4 ${getTimerColor()}`}>
          {formatTime(seconds)}
        </div>
        {seconds < minimumDuration && (
          <p className="text-sm text-muted-foreground mb-4">
            Minimum recommended time: 15 minutes
          </p>
        )}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={toggleTimer}
            variant={isRunning ? "destructive" : "default"}
            className="w-24"
          >
            {isRunning ? (
              <StopIcon className="h-5 w-5 mr-1" />
            ) : (
              <PlayIcon className="h-5 w-5 mr-1" />
            )}
            {isRunning ? 'Stop' : 'Start'}
          </Button>
          <Button
            onClick={resetTimer}
            variant="outline"
            className="w-24"
          >
            <ArrowPathIcon className="h-5 w-5 mr-1" />
            Reset
          </Button>
        </div>
      </div>
    </Card>
  );
}
