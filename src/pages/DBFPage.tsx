import { DBFForm } from '../components/dbf/DBFForm';
import { DBFTimer } from '../components/dbf/DBFTimer';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { DBFSession } from '../lib/types';
import { Card } from '../components/ui/card';
import { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth';
import { DBFAlert } from '@/components/dbf/DBFAlert';

export function DBFPage() {
  const { user } = useAuth();
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);

  const { data: sessions, refetch } = useQuery<DBFSession[]>({
    queryKey: ['dbf-sessions', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('dbf_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('dbf_sessions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dbf_sessions',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch, user]);

  const handleStartSession = () => {
    const now = new Date().toISOString();
    setStartTime(now);
    setEndTime(null);
  };

  const handleStopSession = () => {
    const now = new Date().toISOString();
    setEndTime(now);
  };

  const handleSessionComplete = () => {
    setStartTime(null);
    setEndTime(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Direct Breastfeeding</h1>
      </div>

      {
        sessions && sessions.length > 0 && (
          <DBFAlert lastFeedTime={sessions[0].end_time} />
        )
      }

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <DBFTimer 
            startTime={startTime}
            endTime={endTime}
            onStart={handleStartSession}
            onStop={handleStopSession}
          />
          <DBFForm 
            startTime={startTime}
            endTime={endTime}
            onComplete={handleSessionComplete}
          />
        </div>
        <div>
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Recent Sessions</h3>
            {!sessions || sessions.length === 0 ? (
              <p className="text-muted-foreground">No sessions recorded yet.</p>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <Card key={session.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {new Date(session.start_time).toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {session.breast_used.charAt(0).toUpperCase() + session.breast_used.slice(1)} breast
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          Duration: {session.end_time ? Math.round((new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / 60000) : 0} minutes
                        </p>
                      </div>
                    </div>
                    {session.notes && (
                      <p className="mt-2 text-sm text-muted-foreground">{session.notes}</p>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
