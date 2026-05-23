import DashboardLayout from '@/components/layout/DashboardLayout';
import ChatSidebar from '@/components/ai-tutor/ChatSidebar';
import ChatInterface from '@/components/ai-tutor/ChatInterface';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PanelLeftClose, PanelLeft } from 'lucide-react';

export default function AITutorPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-4rem)] lg:h-screen relative">
        {/* Desktop sidebar */}
        <div className="hidden lg:block w-[300px] flex-shrink-0 border-r border-white/5">
          <ChatSidebar />
        </div>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              />
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: 'spring', damping: 25 }}
                className="fixed left-0 top-0 bottom-0 w-[300px] z-50 bg-[#0a0a0f] border-r border-white/5 lg:hidden"
              >
                <ChatSidebar onClose={() => setSidebarOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile toggle */}
          <div className="lg:hidden flex items-center p-3 border-b border-white/5">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-white/5 text-gray-400"
            >
              {sidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
            </button>
            <span className="text-sm text-gray-400 ml-2">Chat History</span>
          </div>
          <ChatInterface />
        </div>
      </div>
    </DashboardLayout>
  );
}
