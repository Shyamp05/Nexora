import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Bot, BrainCircuit, FileText, Menu } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Map,
  BarChart3,
  Trophy,
  Timer,
  Settings,
  X,
} from 'lucide-react';

interface MobileNavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const primaryItems: MobileNavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'AI Tutor', href: '/ai-tutor', icon: <Bot className="w-5 h-5" /> },
  { label: 'Quiz', href: '/quiz', icon: <BrainCircuit className="w-5 h-5" /> },
  { label: 'Docs', href: '/documents', icon: <FileText className="w-5 h-5" /> },
];

const moreItems: MobileNavItem[] = [
  { label: 'Roadmap', href: '/roadmap', icon: <Map className="w-5 h-5" /> },
  { label: 'Analytics', href: '/analytics', icon: <BarChart3 className="w-5 h-5" /> },
  { label: 'Achievements', href: '/gamification', icon: <Trophy className="w-5 h-5" /> },
  { label: 'Productivity', href: '/productivity', icon: <Timer className="w-5 h-5" /> },
  { label: 'Settings', href: '/settings', icon: <Settings className="w-5 h-5" /> },
];

const MobileNav = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      {/* "More" menu overlay */}
      <AnimatePresence>
        {showMore && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMore(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />

            {/* Menu panel */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-20 left-4 right-4 z-50 lg:hidden glass-strong rounded-2xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-300">More</span>
                <button
                  onClick={() => setShowMore(false)}
                  className="text-gray-500 hover:text-gray-300 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {moreItems.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={() => setShowMore(false)}
                    className={({ isActive }) =>
                      `flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs transition-all ${
                        isActive
                          ? 'bg-indigo-600/20 text-indigo-400'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`
                    }
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Nav Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden glass-strong border-t border-white/5">
        <div className="flex items-center justify-around px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
          {primaryItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-xs transition-all ${
                  isActive ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.icon}
                  <span className="text-[10px]">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="mobile-indicator"
                      className="w-1 h-1 rounded-full bg-indigo-400"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}

          {/* More button */}
          <button
            onClick={() => setShowMore(!showMore)}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-xs transition-all ${
              showMore ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px]">More</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default MobileNav;
