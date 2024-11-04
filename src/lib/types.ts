export interface PumpingSession {
  id: string;
  user_id: string;
  session_type: 'regular' | 'power';
  start_time: string;
  duration_minutes: number;
  volume_ml: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DBFSession {
  id: string;
  user_id: string;
  start_time: string;
  end_time: string;
  breast_used: 'left' | 'right' | 'both';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DiaperChange {
  id: string;
  user_id: string;
  change_time: string;
  type: 'wet' | 'soiled' | 'both';
  notes?: string;
  created_at: string;
  updated_at: string;
}
