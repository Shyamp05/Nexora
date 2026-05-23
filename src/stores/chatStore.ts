import { create } from 'zustand';
import type { ChatMessage, Conversation } from '../types';
import { generateAIResponse } from '../lib/gemini';

interface ChatState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: ChatMessage[];
  isStreaming: boolean;
  mode: 'beginner' | 'school' | 'college' | 'interview';
  setMode: (mode: ChatState['mode']) => void;
  setActiveConversation: (conv: Conversation) => void;
  addMessage: (message: ChatMessage) => void;
  sendMessage: (content: string) => Promise<void>;
  createNewConversation: () => void;
}

const mockConversations: Conversation[] = [
  { id: '1', user_id: '1', title: 'Explain Binary Search Trees', mode: 'college', created_at: '2025-03-15T10:00:00Z', updated_at: '2025-03-15T10:30:00Z' },
  { id: '2', user_id: '1', title: 'Newton\'s Laws of Motion', mode: 'school', created_at: '2025-03-14T14:00:00Z', updated_at: '2025-03-14T14:45:00Z' },
  { id: '3', user_id: '1', title: 'SQL Joins Interview Prep', mode: 'interview', created_at: '2025-03-13T09:00:00Z', updated_at: '2025-03-13T09:20:00Z' },
  { id: '4', user_id: '1', title: 'Organic Chemistry Basics', mode: 'beginner', created_at: '2025-03-12T16:00:00Z', updated_at: '2025-03-12T16:50:00Z' },
];

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: mockConversations,
  activeConversation: null,
  messages: [],
  isStreaming: false,
  mode: 'college',

  setMode: (mode) => set({ mode }),

  setActiveConversation: (conv) => {
    set({
      activeConversation: conv,
      messages: [],
    });
  },

  addMessage: (message) => {
    set((state) => ({ messages: [...state.messages, message] }));
  },

  sendMessage: async (content: string) => {
    const state = get();
    const convId = state.activeConversation?.id || Date.now().toString();

    // Create conversation if none active
    if (!state.activeConversation) {
      const newConv: Conversation = {
        id: convId,
        user_id: '1',
        title: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
        mode: state.mode,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      set((s) => ({
        conversations: [newConv, ...s.conversations],
        activeConversation: newConv,
      }));
    }

    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      conversation_id: convId,
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    };

    set((s) => ({
      messages: [...s.messages, userMsg],
      isStreaming: true,
    }));

    try {
      // Build conversation history for context
      const history = get().messages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Call Gemini API
      const aiText = await generateAIResponse(content, state.mode, history);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        conversation_id: convId,
        role: 'assistant',
        content: aiText,
        created_at: new Date().toISOString(),
      };

      set((s) => ({
        messages: [...s.messages, aiMsg],
        isStreaming: false,
      }));
    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        conversation_id: convId,
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        created_at: new Date().toISOString(),
      };
      set((s) => ({
        messages: [...s.messages, errorMsg],
        isStreaming: false,
      }));
    }
  },

  createNewConversation: () => {
    set({
      activeConversation: null,
      messages: [],
    });
  },
}));
