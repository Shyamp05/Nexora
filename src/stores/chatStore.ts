import { create } from 'zustand';
import type { ChatMessage, Conversation } from '../types';
import { generateAIResponse } from '../lib/gemini';
import { supabase } from '../lib/supabase';

interface ChatState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: ChatMessage[];
  isStreaming: boolean;
  isLoading: boolean;
  mode: 'beginner' | 'school' | 'college' | 'interview';
  setMode: (mode: ChatState['mode']) => void;
  setActiveConversation: (conv: Conversation | null) => Promise<void>;
  sendMessage: (content: string, userId: string) => Promise<void>;
  createNewConversation: () => void;
  loadConversations: (userId: string) => Promise<void>;
  deleteConversation: (id: string, userId: string) => Promise<void>;
}

const mockConversations = (userId: string): Conversation[] => [
  { id: '1', user_id: userId, title: 'Explain Binary Search Trees', mode: 'college', created_at: '2026-03-15T10:00:00Z', updated_at: '2026-03-15T10:30:00Z' },
  { id: '2', user_id: userId, title: "Newton's Laws of Motion", mode: 'school', created_at: '2026-03-14T14:00:00Z', updated_at: '2026-03-14T14:45:00Z' },
  { id: '3', user_id: userId, title: 'SQL Joins Interview Prep', mode: 'interview', created_at: '2026-03-13T09:00:00Z', updated_at: '2026-03-13T09:20:00Z' },
  { id: '4', user_id: userId, title: 'Organic Chemistry Basics', mode: 'beginner', created_at: '2026-03-12T16:00:00Z', updated_at: '2026-03-12T16:50:00Z' },
];

let isFallbackMode = false;

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  isStreaming: false,
  isLoading: false,
  mode: 'college',

  setMode: (mode) => set({ mode }),

  loadConversations: async (userId: string) => {
    if (!userId) return;
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) {
        throw error;
      }
      
      isFallbackMode = false;
      set({ conversations: data as Conversation[], isLoading: false });
    } catch (err: any) {
      console.warn('Failed to load conversations from Supabase, loading from localStorage:', err.message);
      isFallbackMode = true;
      
      // Get from local storage
      const localConvsStr = localStorage.getItem(`nexora_conversations_${userId}`);
      if (localConvsStr) {
        set({ conversations: JSON.parse(localConvsStr), isLoading: false });
      } else {
        const defaultConvs = mockConversations(userId);
        localStorage.setItem(`nexora_conversations_${userId}`, JSON.stringify(defaultConvs));
        set({ conversations: defaultConvs, isLoading: false });
      }
    }
  },

  setActiveConversation: async (conv) => {
    set({ activeConversation: conv, messages: [] });
    if (!conv) return;

    set({ isStreaming: false });
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conv.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      set({ messages: data as ChatMessage[] });
    } catch (err: any) {
      console.warn('Failed to load messages from Supabase, loading from localStorage:', err.message);
      const localMsgsStr = localStorage.getItem(`nexora_messages_${conv.id}`);
      if (localMsgsStr) {
        set({ messages: JSON.parse(localMsgsStr) });
      } else {
        // Fallback welcome message
        const welcomeMsg: ChatMessage = {
          id: 'welcome',
          conversation_id: conv.id,
          role: 'assistant',
          content: `Hi there! I am your AI Tutor. Let's discuss **"${conv.title}"** at a **${conv.mode}** level! How can I help you today?`,
          created_at: new Date().toISOString(),
        };
        set({ messages: [welcomeMsg] });
      }
    }
  },

  sendMessage: async (content: string, userId: string) => {
    if (!userId) return;
    const state = get();
    let currentConv = state.activeConversation;
    const generatedId = crypto.randomUUID();

    // 1. Create conversation if none active
    if (!currentConv) {
      const newTitle = content.substring(0, 40) + (content.length > 40 ? '...' : '');
      currentConv = {
        id: generatedId,
        user_id: userId,
        title: newTitle,
        mode: state.mode,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (!isFallbackMode) {
        try {
          const { error } = await supabase
            .from('conversations')
            .insert([currentConv]);
          if (error) throw error;
        } catch (err: any) {
          console.warn('Failed to insert conversation to Supabase, falling back to local:', err.message);
          isFallbackMode = true;
        }
      }

      // Sync local storage
      const updatedConvs = [currentConv, ...state.conversations];
      localStorage.setItem(`nexora_conversations_${userId}`, JSON.stringify(updatedConvs));
      
      set({
        conversations: updatedConvs,
        activeConversation: currentConv,
      });
    }

    // 2. Add user message
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      conversation_id: currentConv.id,
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    };

    const newMessages = [...state.messages, userMsg];
    set({
      messages: newMessages,
      isStreaming: true,
    });

    if (!isFallbackMode) {
      try {
        await supabase.from('messages').insert([userMsg]);
      } catch (err: any) {
        console.warn('Failed to save user message to Supabase:', err.message);
      }
    }
    localStorage.setItem(`nexora_messages_${currentConv.id}`, JSON.stringify(newMessages));

    try {
      // Build conversation history context
      const history = newMessages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Call Gemini API
      const aiText = await generateAIResponse(content, currentConv.mode, history);

      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        conversation_id: currentConv.id,
        role: 'assistant',
        content: aiText,
        created_at: new Date().toISOString(),
      };

      const finalMessages = [...newMessages, aiMsg];
      set({
        messages: finalMessages,
        isStreaming: false,
      });

      if (!isFallbackMode) {
        try {
          await supabase.from('messages').insert([aiMsg]);
          // Update conversation's updated_at field
          await supabase
            .from('conversations')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', currentConv.id);
        } catch (err: any) {
          console.warn('Failed to save AI response or update conversation timestamp in Supabase:', err.message);
        }
      }
      
      // Update local storage
      localStorage.setItem(`nexora_messages_${currentConv.id}`, JSON.stringify(finalMessages));
      
      // Refresh conversation list to show updated timestamps
      const updatedConvsList = state.conversations.map(c => 
        c.id === currentConv!.id ? { ...c, updated_at: new Date().toISOString() } : c
      );
      localStorage.setItem(`nexora_conversations_${userId}`, JSON.stringify(updatedConvsList));
      set({ conversations: updatedConvsList });
      
    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        conversation_id: currentConv.id,
        role: 'assistant',
        content: 'I apologize, but I encountered an error during generation. Please verify your Gemini API key and try again.',
        created_at: new Date().toISOString(),
      };
      
      const errorMessages = [...newMessages, errorMsg];
      set({
        messages: errorMessages,
        isStreaming: false,
      });
      localStorage.setItem(`nexora_messages_${currentConv.id}`, JSON.stringify(errorMessages));
    }
  },

  deleteConversation: async (id: string, userId: string) => {
    if (!userId) return;
    try {
      if (!isFallbackMode) {
        const { error } = await supabase
          .from('conversations')
          .delete()
          .eq('id', id);
        if (error) throw error;
      }
    } catch (e: any) {
      console.warn('Failed to delete conversation in Supabase, removing locally:', e.message);
    }

    const filteredConvs = get().conversations.filter(c => c.id !== id);
    localStorage.setItem(`nexora_conversations_${userId}`, JSON.stringify(filteredConvs));
    localStorage.removeItem(`nexora_messages_${id}`);

    set((state) => ({
      conversations: filteredConvs,
      activeConversation: state.activeConversation?.id === id ? null : state.activeConversation,
      messages: state.activeConversation?.id === id ? [] : state.messages,
    }));
  },

  createNewConversation: () => {
    set({
      activeConversation: null,
      messages: [],
    });
  },
}));
