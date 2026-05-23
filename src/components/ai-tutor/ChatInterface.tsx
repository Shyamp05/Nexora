import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SendHorizonal,
  Mic,
  Sparkles,
  BookOpen,
  GraduationCap,
  Briefcase,
  Baby,
  Bot,
} from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import MessageBubble from './MessageBubble';

// ============================================
// Mode definitions for the 4 pill buttons
// ============================================

interface ModeOption {
  key: 'beginner' | 'school' | 'college' | 'interview';
  label: string;
  icon: React.ReactNode;
}

const modes: ModeOption[] = [
  { key: 'beginner', label: 'Beginner', icon: <Baby size={14} /> },
  { key: 'school', label: 'School', icon: <BookOpen size={14} /> },
  { key: 'college', label: 'College', icon: <GraduationCap size={14} /> },
  { key: 'interview', label: 'Interview', icon: <Briefcase size={14} /> },
];

// Suggested prompts for the empty/welcome state
const suggestions = [
  { text: 'Explain Binary Search', icon: '🔍' },
  { text: 'Help me understand Thermodynamics', icon: '🌡️' },
  { text: 'Prepare me for SQL interview', icon: '💼' },
  { text: 'Solve this calculus problem', icon: '📐' },
];

// ============================================
// ChatInterface — Main chat area
// ============================================

export default function ChatInterface() {
  const { messages, mode, setMode, sendMessage, isStreaming } = useChatStore();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [inputValue]);

  const handleSend = async () => {
    if (!inputValue.trim() || isStreaming) return;
    const value = inputValue.trim();
    setInputValue('');
    await sendMessage(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (text: string) => {
    setInputValue(text);
    sendMessage(text);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Mode Selector */}
      <div className="flex-shrink-0 px-4 md:px-6 py-3 border-b border-white/5">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {modes.map((m) => (
            <motion.button
              key={m.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMode(m.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                mode === m.key
                  ? 'gradient-primary text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {m.icon}
              {m.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
        <AnimatePresence mode="wait">
          {!hasMessages ? (
            /* ===== Welcome State ===== */
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              {/* AI Avatar */}
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(99, 102, 241, 0.2)',
                    '0 0 60px rgba(99, 102, 241, 0.4)',
                    '0 0 20px rgba(99, 102, 241, 0.2)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mb-6"
              >
                <Bot size={36} className="text-white" />
              </motion.div>

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                How can I help you learn?
              </h2>
              <p className="text-gray-400 mb-8 max-w-md">
                I'm your AI tutor. Ask me anything about any subject — I'll explain it at your level.
              </p>

              {/* Suggested Prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {suggestions.map((s, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSuggestionClick(s.text)}
                    className="glass flex items-center gap-3 p-4 rounded-xl text-left hover:border-indigo-500/20 transition-all group cursor-pointer"
                  >
                    <span className="text-xl">{s.icon}</span>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                      {s.text}
                    </span>
                    <Sparkles
                      size={14}
                      className="ml-auto text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            /* ===== Messages List ===== */
            <motion.div
              key="messages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 max-w-3xl mx-auto"
            >
              {messages.map((msg, idx) => (
                <MessageBubble
                  key={msg.id}
                  role={msg.role}
                  content={msg.content}
                  timestamp={msg.created_at}
                  isStreaming={isStreaming && idx === messages.length - 1 && msg.role === 'assistant'}
                />
              ))}

              {/* Streaming indicator (typing dots) */}
              {isStreaming && messages[messages.length - 1]?.role === 'user' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className="glass rounded-2xl rounded-tl-md px-4 py-3">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -6, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.15,
                          }}
                          className="w-2 h-2 rounded-full bg-indigo-400"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 px-4 md:px-6 py-4 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="glass rounded-2xl flex items-end gap-2 p-2">
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              rows={1}
              className="flex-1 bg-transparent border-none text-white placeholder-gray-500 text-sm resize-none px-3 py-2.5 focus:outline-none max-h-40 leading-relaxed"
            />

            {/* Voice Input */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex-shrink-0 p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Mic size={20} />
            </motion.button>

            {/* Send */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSend}
              disabled={!inputValue.trim() || isStreaming}
              className={`flex-shrink-0 p-2.5 rounded-xl transition-all duration-200 ${
                inputValue.trim()
                  ? 'gradient-primary text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-white/5 text-gray-500 cursor-not-allowed'
              }`}
            >
              <SendHorizonal size={20} />
            </motion.button>
          </div>

          <p className="text-center text-[11px] text-gray-600 mt-2">
            Nexora AI may produce inaccurate information. Verify important facts.
          </p>
        </div>
      </div>
    </div>
  );
}
