import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DiaperChange {
  id: string;
  change_time: string;
  type: 'wet' | 'soiled' | 'both';
  notes?: string;
}

export function DiaperList() {
  const [changes] = useState<DiaperChange[]>([]);

  const getTimeDifference = (changeTime: string) => {
    const now = new Date();
    const change = new Date(changeTime);
    const diffInHours = (now.getTime() - change.getTime()) / (1000 * 60 * 60);
    return diffInHours;
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Recent Changes</h3>
      {changes.length === 0 ? (
        <p className="text-muted-foreground">No diaper changes recorded yet.</p>
      ) : (
        <div className="space-y-4">
          {changes.map((change) => (
            <Card key={change.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {new Date(change.change_time).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {change.type.charAt(0).toUpperCase() + change.type.slice(1)}
                  </p>
                </div>
                <div>
                  {getTimeDifference(change.change_time) >= 4 && (
                    <Badge variant="destructive">
                      Change needed
                    </Badge>
                  )}
                </div>
              </div>
              {change.notes && (
                <p className="mt-2 text-sm text-muted-foreground">{change.notes}</p>
              )}
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
}
