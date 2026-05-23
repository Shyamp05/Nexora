import { create } from 'zustand';
import type { UserProfile } from '../types';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  completeOnboarding: (data: {
    student_type: string;
    subjects: string[];
    study_goal_minutes: number;
    preferred_language: string;
  }) => void;
}

// Mock user for demo
const mockUser: UserProfile = {
  id: '1',
  full_name: 'Shyam Patel',
  email: 'shyam@nexora.ai',
  avatar_url: null,
  role: 'student',
  level: 12,
  xp: 4850,
  streak: 15,
  preferred_language: 'en',
  onboarding_completed: true,
  study_goal_minutes: 120,
  subjects: ['Mathematics', 'Physics', 'Computer Science', 'Chemistry'],
  student_type: 'college',
  created_at: '2025-01-15T00:00:00Z',
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (_email: string, _password: string) => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    set({ user: mockUser, isAuthenticated: true, isLoading: false });
  },

  signup: async (name: string, email: string, _password: string) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    set({
      user: { ...mockUser, full_name: name, email, onboarding_completed: false },
      isAuthenticated: true,
      isLoading: false,
    });
  },

  loginWithGoogle: async () => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    set({ user: mockUser, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: (updates) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    }));
  },

  completeOnboarding: (data) => {
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            student_type: data.student_type as UserProfile['student_type'],
            subjects: data.subjects,
            study_goal_minutes: data.study_goal_minutes,
            preferred_language: data.preferred_language as UserProfile['preferred_language'],
            onboarding_completed: true,
          }
        : null,
    }));
  },
}));
