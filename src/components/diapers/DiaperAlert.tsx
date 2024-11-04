import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

interface DiaperAlertProps {
  lastChangeTime?: string;
}

export function DiaperAlert({ lastChangeTime }: DiaperAlertProps) {
  if (!lastChangeTime) return null;

  const getTimeDifference = () => {
    const now = new Date();
    const change = new Date(lastChangeTime);
    const diffInHours = (now.getTime() - change.getTime()) / (1000 * 60 * 60);
    return diffInHours;
  };

  const hoursSinceChange = getTimeDifference();

  if (hoursSinceChange < 3) return null;

  const isUrgent = hoursSinceChange >= 4;

  return (
    <Alert variant={isUrgent ? "destructive" : "default"} className="mb-6">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>
        {isUrgent ? 'Diaper change needed' : 'Diaper change due soon'}
      </AlertTitle>
      <AlertDescription>
        Last change was {Math.floor(hoursSinceChange)} hours ago
      </AlertDescription>
    </Alert>
  );
}
