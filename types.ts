
export type Mood = 'Great' | 'Good' | 'Okay' | 'Tired' | 'Stressed';

export interface Action {
  id: string;
  text: string;
  completed: boolean;
  timestamp: number;
  impactType?: 'short-term' | 'long-term' | 'maintenance';
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  status: 'confirmed' | 'tentative' | 'cancelled';
  type: 'deep-work' | 'shallow-work' | 'rest' | 'personal';
  completed?: boolean;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  type: 'badge' | 'streak' | 'achievement';
  unlockedAt: number;
  icon: string;
}

export interface DailyRecord {
  date: string; // YYYY-MM-DD
  mood: Mood;
  energy: number; // 1-10
  actions: Action[];
  events?: CalendarEvent[];
  impactScore: number;
  productivityScore?: number;
  reflection?: string;
  detailedReport?: string;
  didTodayCount: boolean;
}

export interface UserGoal {
  id: string;
  title: string;
  category: 'Health' | 'Career' | 'Personal' | 'Finance';
  term: 'Day' | 'Month' | 'Year';
  targetDate: string;
  progress: number;
}

export interface SubscriptionTier {
  name: string;
  price: string;
  features: string[];
  color: string;
}
