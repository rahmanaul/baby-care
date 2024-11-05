import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

interface DBFAlertProps {
  lastFeedTime?: string;
}

export function DBFAlert({ lastFeedTime }: DBFAlertProps) {
  if (!lastFeedTime) return null;

  const getTimeDifference = () => {
    const now = new Date();
    const feed = new Date(lastFeedTime);
    const diffInHours = (now.getTime() - feed.getTime()) / (1000 * 60 * 60);
    return diffInHours;
  };

  const hoursSinceFeeding = getTimeDifference();

  if (hoursSinceFeeding <= 2) return null;

  const isUrgent = hoursSinceFeeding >= 3;

  return (
    <Alert variant={isUrgent ? "destructive" : "default"} className="mb-6">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>
        {isUrgent ? 'Feeding needed' : 'Feeding due soon'}
      </AlertTitle>
      <AlertDescription>
        Last feeding was {Math.floor(hoursSinceFeeding)} hours ago
      </AlertDescription>
    </Alert>
  );
}