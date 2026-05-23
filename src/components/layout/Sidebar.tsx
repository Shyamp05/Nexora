import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Bot,
  BrainCircuit,
  Map,
  FileText,
  BarChart3,
  Trophy,
  Timer,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface NavItemConfig {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItemConfig[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'AI Tutor', href: '/ai-tutor', icon: <Bot className="w-5 h-5" /> },
  { label: 'Quizzes', href: '/quiz', icon: <BrainCircuit className="w-5 h-5" /> },
  { label: 'Roadmap', href: '/roadmap', icon: <Map className="w-5 h-5" /> },
  { label: 'Documents', href: '/documents', icon: <FileText className="w-5 h-5" /> },
  { label: 'Analytics', href: '/analytics', icon: <BarChart3 className="w-5 h-5" /> },
  { label: 'Achievements', href: '/gamification', icon: <Trophy className="w-5 h-5" /> },
  { label: 'Productivity', href: '/productivity', icon: <Timer className="w-5 h-5" /> },
  { label: 'Settings', href: '/settings', icon: <Settings className="w-5 h-5" /> },
];

const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get initials for avatar
  const initials = user?.full_name
    ? user.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 72 : 280 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="hidden lg:flex flex-col h-screen sticky top-0 glass-strong border-r border-white/5 z-30"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-white/5 shrink-0">
        <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shrink-0">
          <Sparkles className="w-4.5 h-4.5 text-white" />
        </div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="text-lg font-bold gradient-text whitespace-nowrap overflow-hidden"
            >
              Nexora AI
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'gradient-primary text-white shadow-lg shadow-indigo-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              } ${isCollapsed ? 'justify-center' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                  {item.icon}
                </span>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-white/5 p-3 space-y-2 shrink-0">
        {/* User Profile */}
        <div
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shrink-0 text-xs font-bold text-white">
            {initials}
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="text-sm font-medium text-white truncate max-w-[160px]">
                  {user?.full_name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate max-w-[160px]">
                  Level {user?.level || 1}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap overflow-hidden"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Collapse Toggle */}
        <button
          onClick={onToggle}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-5 h-5 shrink-0" />
          ) : (
            <>
              <PanelLeftClose className="w-5 h-5 shrink-0" />
              <span className="whitespace-nowrap">Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
