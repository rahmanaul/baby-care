import { DiaperForm } from '../components/diapers/DiaperForm';
import { DiaperAlert } from '../components/diapers/DiaperAlert';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { DiaperChange } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth';

export function DiapersPage() {
  const { user } = useAuth();

  const { data: changes, refetch } = useQuery<DiaperChange[]>({
    queryKey: ['diaper-changes', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('diaper_changes')
        .select('*')
        .eq('user_id', user.id)
        .order('change_time', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('diaper_changes_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'diaper_changes',
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

  const getTimeDifference = (changeTime: string) => {
    const now = new Date();
    const change = new Date(changeTime);
    const diffInHours = (now.getTime() - change.getTime()) / (1000 * 60 * 60);
    return diffInHours;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Diaper Changes</h1>
      </div>

      {changes && changes.length > 0 && (
        <DiaperAlert lastChangeTime={changes[0].change_time} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <DiaperForm />
        </div>
        <div>
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Recent Changes</h3>
            {!changes || changes.length === 0 ? (
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
        </div>
      </div>
    </div>
  );
}
