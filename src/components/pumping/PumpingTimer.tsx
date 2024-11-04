import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayIcon, StopIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

export function PumpingTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: number | undefined;

    if (isRunning) {
      interval = window.setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  return (
    <Card className="p-6">
      <div className="text-center">
        <div className="text-4xl font-mono mb-6">{formatTime(seconds)}</div>
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
