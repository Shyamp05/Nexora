// ============================================
// Nexora AI - Core Type Definitions
// ============================================

// User & Auth Types
export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  role: 'student' | 'teacher' | 'admin';
  level: number;
  xp: number;
  streak: number;
  preferred_language: 'en' | 'hi' | 'gu';
  onboarding_completed: boolean;
  study_goal_minutes: number;
  subjects: string[];
  student_type: 'school' | 'college' | 'competitive' | 'self-learner';
  created_at: string;
}

// Chat & AI Tutor Types
export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  mode: 'beginner' | 'school' | 'college' | 'interview';
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

// Quiz Types
export interface Quiz {
  id: string;
  user_id: string;
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: QuizQuestion[];
  score: number;
  total_questions: number;
  xp_earned: number;
  time_taken_seconds: number;
  completed_at: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  user_answer?: number;
  explanation: string;
}

// Roadmap Types
export interface Roadmap {
  id: string;
  user_id: string;
  topic: string;
  duration_days: number;
  plan: RoadmapDay[];
  progress: number;
  created_at: string;
}

export interface RoadmapDay {
  day: number;
  title: string;
  topics: string[];
  resources: string[];
  quiz: boolean;
  completed: boolean;
}

// Document Types
export interface Document {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  file_type: 'pdf' | 'ppt' | 'image' | 'text';
  summary: string;
  flashcards: Flashcard[];
  key_points: string[];
  created_at: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Analytics Types
export interface StudySession {
  id: string;
  user_id: string;
  subject: string;
  duration_minutes: number;
  session_date: string;
}

export interface WeeklyAnalytics {
  day: string;
  hours: number;
  quizzes: number;
  xp: number;
}

export interface SubjectPerformance {
  subject: string;
  score: number;
  quizzes_taken: number;
  study_hours: number;
}

// Gamification Types
export interface Achievement {
  id: string;
  badge_id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlocked_at?: string;
  xp_reward: number;
  category: 'streak' | 'quiz' | 'study' | 'social' | 'special';
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  xp_reward: number;
  completed: boolean;
  type: 'quiz' | 'study' | 'chat' | 'upload';
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  xp: number;
  level: number;
  streak: number;
}

// Productivity Types
export interface PomodoroSession {
  work_minutes: number;
  break_minutes: number;
  sessions_completed: number;
  total_sessions: number;
  is_running: boolean;
  is_break: boolean;
  time_remaining: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  due_date?: string;
  subject?: string;
}

// Collaboration Types
export interface StudyRoom {
  id: string;
  name: string;
  host_id: string;
  participants: string[];
  max_participants: number;
  subject: string;
  is_active: boolean;
  created_at: string;
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}
