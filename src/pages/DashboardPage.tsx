import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { DBFSession, DiaperChange, PumpingSession } from '../lib/types';
import { useAuth } from '../lib/auth';
import { Card } from '../components/ui/card';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export function DashboardPage() {
  const { user } = useAuth();

  const { data: dbfSessions } = useQuery<DBFSession[]>({
    queryKey: ['dbf-sessions-dashboard', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('dbf_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: false })
        .limit(30);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: diaperChanges } = useQuery<DiaperChange[]>({
    queryKey: ['diaper-changes-dashboard', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('diaper_changes')
        .select('*')
        .eq('user_id', user.id)
        .order('change_time', { ascending: false })
        .limit(30);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: pumpingSessions } = useQuery<PumpingSession[]>({
    queryKey: ['pumping-sessions-dashboard', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('pumping_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: false })
        .limit(30);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Process data for charts
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const dailyActivities = last7Days.map(date => ({
    date,
    dbf: dbfSessions?.filter(s => s.start_time.startsWith(date)).length || 0,
    diapers: diaperChanges?.filter(d => d.change_time.startsWith(date)).length || 0,
    pumping: pumpingSessions?.filter(p => p.start_time.startsWith(date)).length || 0,
  }));

  const diaperTypes = {
    wet: diaperChanges?.filter(d => d.type === 'wet').length || 0,
    soiled: diaperChanges?.filter(d => d.type === 'soiled').length || 0,
    both: diaperChanges?.filter(d => d.type === 'both').length || 0,
  };

  const pumpingVolumes = pumpingSessions?.map(session => ({
    date: new Date(session.start_time).toLocaleDateString(),
    volume: session.volume_ml,
  })) || [];

  const dbfDurations = dbfSessions?.map(session => ({
    date: new Date(session.start_time).toLocaleDateString(),
    duration: session.end_time 
      ? Math.round((new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / 60000)
      : 0,
  })) || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Activities Chart */}
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">Daily Activities</h2>
          <Bar
            data={{
              labels: last7Days.map(date => new Date(date).toLocaleDateString()),
              datasets: [
                {
                  label: 'DBF Sessions',
                  data: dailyActivities.map(d => d.dbf),
                  backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
                {
                  label: 'Diaper Changes',
                  data: dailyActivities.map(d => d.diapers),
                  backgroundColor: 'rgba(54, 162, 235, 0.5)',
                },
                {
                  label: 'Pumping Sessions',
                  data: dailyActivities.map(d => d.pumping),
                  backgroundColor: 'rgba(75, 192, 192, 0.5)',
                },
              ],
            }}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                  },
                },
              },
            }}
          />
        </Card>

        {/* Diaper Types Distribution */}
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">Diaper Types Distribution</h2>
          <Pie
            data={{
              labels: ['Wet', 'Soiled', 'Both'],
              datasets: [
                {
                  data: [diaperTypes.wet, diaperTypes.soiled, diaperTypes.both],
                  backgroundColor: [
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                  ],
                },
              ],
            }}
            options={{
              responsive: true,
            }}
          />
        </Card>

        {/* Pumping Volumes */}
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">Pumping Volumes (ml)</h2>
          <Line
            data={{
              labels: pumpingVolumes.map(p => p.date),
              datasets: [
                {
                  label: 'Volume (ml)',
                  data: pumpingVolumes.map(p => p.volume),
                  borderColor: 'rgb(75, 192, 192)',
                  tension: 0.1,
                },
              ],
            }}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </Card>

        {/* DBF Durations */}
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">DBF Durations (minutes)</h2>
          <Line
            data={{
              labels: dbfDurations.map(d => d.date),
              datasets: [
                {
                  label: 'Duration (minutes)',
                  data: dbfDurations.map(d => d.duration),
                  borderColor: 'rgb(255, 99, 132)',
                  tension: 0.1,
                },
              ],
            }}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </Card>
      </div>
    </div>
  );
}
