import { Card } from "../../components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { PumpingSession } from "../../lib/types";
import { useEffect } from "react";
import { useAuth } from "../../lib/auth";

export function PumpingList() {
  const { user } = useAuth();

  const { data: sessions, refetch } = useQuery<PumpingSession[]>({
    queryKey: ['pumping-sessions', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('pumping_sessions')
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
      .channel('pumping_sessions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pumping_sessions',
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

  const formatDate = (date: string) => {
    const d = new Date(date);
    return {
      date: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      time: d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <Card className="p-4 md:p-6">
      <h3 className="text-lg font-medium mb-4">Recent Sessions</h3>
      {!sessions || sessions.length === 0 ? (
        <p className="text-muted-foreground">No sessions recorded yet.</p>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const { date, time } = formatDate(session.start_time);
            return (
              <Card key={session.id} className="p-3 md:p-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <p className="font-medium text-sm md:text-base">
                        {date} <span className="text-muted-foreground">{time}</span>
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {session.session_type.charAt(0).toUpperCase() + session.session_type.slice(1)} Session
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-right">
                      <div className="flex flex-col">
                        <p className="font-medium text-sm md:text-base">{session.volume_ml}ml</p>
                        <p className="text-xs md:text-sm text-muted-foreground">{session.duration_minutes}min</p>
                      </div>
                    </div>
                  </div>
                  {session.notes && (
                    <p className="text-xs md:text-sm text-muted-foreground border-t pt-2 mt-1">
                      {session.notes}
                    </p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </Card>
  );
}
