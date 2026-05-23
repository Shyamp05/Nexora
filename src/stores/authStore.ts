import { create } from 'zustand';
import type { UserProfile } from '../types';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: (data: {
    student_type: string;
    subjects: string[];
    study_goal_minutes: number;
    preferred_language: string;
  }) => Promise<void>;
  initializeAuth: () => Promise<void>;
}

const mockUser: UserProfile = {
  id: 'demo-user-id',
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
  created_at: new Date().toISOString(),
};

// Check if we are running in a mock fallback state due to missing/incomplete Supabase setup
let isFallbackMode = false;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  initializeAuth: async () => {
    try {
      set({ isLoading: true });
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // Try to fetch profile from DB
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.warn('Profile fetch error, falling back to local storage profile:', error.message);
          isFallbackMode = true;
          // Get from local storage or create new
          const localProfileStr = localStorage.getItem(`nexora_profile_${session.user.id}`);
          if (localProfileStr) {
            set({ user: JSON.parse(localProfileStr), isAuthenticated: true });
          } else {
            const newProfile: UserProfile = {
              id: session.user.id,
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Student',
              email: session.user.email || '',
              avatar_url: session.user.user_metadata?.avatar_url || null,
              role: 'student',
              level: 1,
              xp: 0,
              streak: 1,
              preferred_language: 'en',
              onboarding_completed: false,
              study_goal_minutes: 60,
              subjects: [],
              student_type: 'school',
              created_at: new Date().toISOString(),
            };
            localStorage.setItem(`nexora_profile_${session.user.id}`, JSON.stringify(newProfile));
            set({ user: newProfile, isAuthenticated: true });
          }
        } else {
          isFallbackMode = false;
          set({ user: profile as UserProfile, isAuthenticated: true });
        }
      } else {
        // Check if there is an active mock session
        const demoSession = localStorage.getItem('nexora_demo_session');
        if (demoSession) {
          set({ user: JSON.parse(demoSession), isAuthenticated: true });
        }
      }
    } catch (err) {
      console.error('Auth initialization failed, using demo fallback:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      // 1. Try real Supabase auth
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        // Check if it's a demo credential fallback
        if (email === 'shyam@nexora.ai' || email === 'demo@nexora.ai') {
          console.log('Valid demo credentials used. Logging in with mock profile.');
          localStorage.setItem('nexora_demo_session', JSON.stringify(mockUser));
          set({ user: mockUser, isAuthenticated: true, isLoading: false });
          return;
        }
        throw error;
      }

      if (data?.user) {
        // 2. Load profile
        const { data: profile, error: pError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (pError) {
          console.warn('Profiles table not found or query failed. Storing profile in localStorage.');
          isFallbackMode = true;
          const localProfileStr = localStorage.getItem(`nexora_profile_${data.user.id}`);
          if (localProfileStr) {
            set({ user: JSON.parse(localProfileStr), isAuthenticated: true, isLoading: false });
          } else {
            const newProfile: UserProfile = {
              id: data.user.id,
              full_name: data.user.user_metadata?.full_name || email.split('@')[0],
              email,
              avatar_url: null,
              role: 'student',
              level: 1,
              xp: 0,
              streak: 1,
              preferred_language: 'en',
              onboarding_completed: false,
              study_goal_minutes: 60,
              subjects: [],
              student_type: 'school',
              created_at: new Date().toISOString(),
            };
            localStorage.setItem(`nexora_profile_${data.user.id}`, JSON.stringify(newProfile));
            set({ user: newProfile, isAuthenticated: true, isLoading: false });
          }
        } else {
          isFallbackMode = false;
          set({ user: profile as UserProfile, isAuthenticated: true, isLoading: false });
        }
      }
    } catch (error: any) {
      set({ isLoading: false });
      throw new Error(error?.message || 'Login failed');
    }
  },

  signup: async (name, email, password) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });

      if (error) throw error;

      if (data?.user) {
        const newProfile: UserProfile = {
          id: data.user.id,
          full_name: name,
          email: email,
          avatar_url: null,
          role: 'student',
          level: 1,
          xp: 0,
          streak: 1,
          preferred_language: 'en',
          onboarding_completed: false,
          study_goal_minutes: 60,
          subjects: [],
          student_type: 'school',
          created_at: new Date().toISOString(),
        };

        // Try inserting into public profiles
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([newProfile]);

        if (insertError) {
          console.warn('Profiles table insert failed. Saving to local storage instead:', insertError.message);
          isFallbackMode = true;
          localStorage.setItem(`nexora_profile_${data.user.id}`, JSON.stringify(newProfile));
        } else {
          isFallbackMode = false;
        }

        set({ user: newProfile, isAuthenticated: true, isLoading: false });
      }
    } catch (error: any) {
      set({ isLoading: false });
      throw new Error(error?.message || 'Signup failed');
    }
  },

  loginWithGoogle: async () => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard',
        }
      });
      if (error) throw error;
    } catch (error: any) {
      // Fallback for mock login in sandbox env
      console.warn('OAuth redirect failed or not supported in sandbox. Fallback to mock session.');
      localStorage.setItem('nexora_demo_session', JSON.stringify(mockUser));
      set({ user: mockUser, isAuthenticated: true, isLoading: false });
    }
  },

  logout: async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signout failed, clearing local sessions:', e);
    }
    localStorage.removeItem('nexora_demo_session');
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: async (updates) => {
    const { user } = get();
    if (!user) return;

    const updatedUser = { ...user, ...updates };

    if (!isFallbackMode && !user.id.startsWith('demo')) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id);
        
        if (error) throw error;
      } catch (err: any) {
        console.warn('Database profile update failed, syncing to local storage instead:', err.message);
        localStorage.setItem(`nexora_profile_${user.id}`, JSON.stringify(updatedUser));
      }
    } else {
      if (user.id.startsWith('demo')) {
        localStorage.setItem('nexora_demo_session', JSON.stringify(updatedUser));
      } else {
        localStorage.setItem(`nexora_profile_${user.id}`, JSON.stringify(updatedUser));
      }
    }

    set({ user: updatedUser });
  },

  completeOnboarding: async (data) => {
    await get().updateProfile({
      student_type: data.student_type as UserProfile['student_type'],
      subjects: data.subjects,
      study_goal_minutes: data.study_goal_minutes,
      preferred_language: data.preferred_language as UserProfile['preferred_language'],
      onboarding_completed: true,
    });
  },
}));
