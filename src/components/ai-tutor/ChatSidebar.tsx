import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, MessageSquare } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';

// ============================================
// ChatSidebar — lists past conversations,
// grouped by Today / Yesterday / Previous
// ============================================

/** Classify a date string into a display group */
function getDateGroup(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date >= today) return 'Today';
  if (date >= yesterday) return 'Yesterday';
  return 'Previous';
}

interface ChatSidebarProps {
  onClose?: () => void;
}

export default function ChatSidebar({ onClose }: ChatSidebarProps) {
  const {
    conversations,
    activeConversation,
    setActiveConversation,
    createNewConversation,
  } = useChatStore();

  const [searchQuery, setSearchQuery] = useState('');

  // Filter & group conversations
  const grouped = useMemo(() => {
    const filtered = conversations.filter((c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groups: Record<string, typeof filtered> = {};
    const order = ['Today', 'Yesterday', 'Previous'];

    for (const conv of filtered) {
      const group = getDateGroup(conv.updated_at);
      if (!groups[group]) groups[group] = [];
      groups[group].push(conv);
    }

    return order
      .filter((g) => groups[g] && groups[g].length > 0)
      .map((g) => ({ label: g, items: groups[g] }));
  }, [conversations, searchQuery]);

  return (
    <div className="flex flex-col h-full">
      {/* New Chat Button */}
      <div className="p-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={createNewConversation}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl gradient-primary text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-shadow"
        >
          <Plus size={18} />
          New Chat
        </motion.button>
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/30 transition-colors"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 no-scrollbar">
        <AnimatePresence>
          {grouped.map((group) => (
            <div key={group.label} className="mb-4">
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((conv) => {
                  const isActive = activeConversation?.id === conv.id;
                  return (
                    <motion.button
                      key={conv.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      whileHover={{ x: 4 }}
                      onClick={() => setActiveConversation(conv)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 ${
                        isActive
                          ? 'bg-indigo-500/10 border border-indigo-500/20 text-white'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                      }`}
                    >
                      <MessageSquare
                        size={16}
                        className={`flex-shrink-0 ${isActive ? 'text-indigo-400' : 'text-gray-600'}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{conv.title}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {new Date(conv.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </AnimatePresence>

        {grouped.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <MessageSquare size={32} className="mb-3 opacity-30" />
            <p className="text-sm">No conversations found</p>
          </div>
        )}
      </div>
    </div>
  );
}
