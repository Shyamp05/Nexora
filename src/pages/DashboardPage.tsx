import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/stores/authStore';
import { weeklyAnalytics, dailyMissions, recentActivity, motivationalQuotes } from '@/data/mockData';
import {
  Bot, BrainCircuit, Upload, Map, Flame, Trophy, Target, Clock,
  TrendingUp, ChevronRight, Zap, BookOpen, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { useState, useEffect } from 'react';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

// Custom tooltip for charts
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl px-4 py-3 text-sm">
        <p className="text-white font-medium">{label}</p>
        <p className="text-indigo-400">{payload[0].value}h studied</p>
      </div>
    );
  }
  return null;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [quote, setQuote] = useState('');
  const name = user?.full_name?.split(' ')[0] || 'Student';
  const level = user?.level || 12;
  const xp = user?.xp || 4850;
  const streak = user?.streak || 15;
  const nextLevelXp = 5000;
  const xpProgress = (xp / nextLevelXp) * 100;

  useEffect(() => {
    setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const quickActions = [
    { label: 'Ask AI', icon: Bot, color: 'from-blue-500 to-cyan-500', href: '/ai-tutor' },
    { label: 'Take Quiz', icon: BrainCircuit, color: 'from-purple-500 to-pink-500', href: '/quiz' },
    { label: 'Upload Doc', icon: Upload, color: 'from-emerald-500 to-teal-500', href: '/documents' },
    { label: 'Roadmap', icon: Map, color: 'from-orange-500 to-amber-500', href: '/roadmap' },
  ];

  const weakTopics = [
    { subject: 'Physics', topic: 'Thermodynamics', score: 45, color: 'text-red-400' },
    { subject: 'Chemistry', topic: 'Organic Reactions', score: 52, color: 'text-orange-400' },
    { subject: 'Math', topic: 'Integration', score: 58, color: 'text-yellow-400' },
  ];

  const activityIcons: Record<string, typeof Bot> = {
    quiz: BrainCircuit,
    chat: Bot,
    study: BookOpen,
    document: Upload,
    roadmap: Map,
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Welcome Section */}
        <motion.div {...fadeUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {getGreeting()}, {name}! 👋
            </h1>
            <p className="text-gray-400 mt-1 text-sm md:text-base italic">"{quote}"</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="text-white font-bold">{streak}</span>
              <span className="text-gray-400 text-sm">day streak</span>
            </div>
          </div>
        </motion.div>

        {/* Top Stats Row */}
        <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* XP & Level */}
          <div className="card-premium rounded-2xl p-4 md:p-5 col-span-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Level {level}</p>
                  <p className="text-white font-bold">{xp.toLocaleString()} XP</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">{nextLevelXp - xp} XP to Level {level + 1}</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
              />
            </div>
          </div>

          {/* Streak */}
          <div className="card-premium rounded-2xl p-4 md:p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Streak</p>
                <p className="text-2xl font-bold text-white">{streak}</p>
              </div>
            </div>
            <div className="flex gap-1 mt-2">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full ${i < 5 ? 'bg-gradient-to-br from-orange-400 to-red-500' : 'bg-white/10'}`} />
                  <span className="text-[10px] text-gray-500">{d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Study */}
          <div className="card-premium rounded-2xl p-4 md:p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Today</p>
                <p className="text-2xl font-bold text-white">2.5h</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Goal: {(user?.study_goal_minutes || 120) / 60}h daily</p>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
          <h2 className="text-lg font-semibold text-white mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <Link key={action.label} to={action.href}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="card-interactive rounded-2xl p-4 md:p-5 flex flex-col items-center gap-3 text-center"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-white">{action.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Study Activity Chart */}
          <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="lg:col-span-2 card-premium rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Study Activity</h3>
              <span className="text-xs text-gray-500 px-3 py-1 rounded-full bg-white/5">This Week</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={weeklyAnalytics}>
                <defs>
                  <linearGradient id="studyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={2} fill="url(#studyGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Daily Missions */}
          <motion.div {...fadeUp} transition={{ delay: 0.4 }} className="card-premium rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Daily Missions</h3>
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="space-y-3">
              {dailyMissions.map((mission) => (
                <div key={mission.id} className={`p-3 rounded-xl ${mission.completed ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-white/5'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${mission.completed ? 'text-emerald-400' : 'text-white'}`}>
                      {mission.completed ? '✅ ' : ''}{mission.title}
                    </span>
                    <span className="text-xs text-indigo-400">+{mission.xp_reward} XP</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${mission.completed ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
                      style={{ width: `${Math.min((mission.progress / mission.target) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-gray-500 mt-1">{mission.progress}/{mission.target}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* XP This Week */}
          <motion.div {...fadeUp} transition={{ delay: 0.5 }} className="card-premium rounded-2xl p-5">
            <h3 className="text-lg font-semibold text-white mb-4">XP This Week</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weeklyAnalytics}>
                <defs>
                  <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Bar dataKey="xp" fill="url(#xpGrad)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Recent Activity */}
          <motion.div {...fadeUp} transition={{ delay: 0.6 }} className="card-premium rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
              <TrendingUp className="w-4 h-4 text-gray-500" />
            </div>
            <div className="space-y-3 max-h-[250px] overflow-y-auto no-scrollbar">
              {recentActivity.map((activity) => {
                const Icon = activityIcons[activity.type] || BookOpen;
                return (
                  <div key={activity.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <span className="text-xs text-emerald-400 font-medium">+{activity.xp} XP</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Weak Topics */}
          <motion.div {...fadeUp} transition={{ delay: 0.7 }} className="card-premium rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Needs Attention</h3>
              <Target className="w-4 h-4 text-gray-500" />
            </div>
            <div className="space-y-3">
              {weakTopics.map((topic, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/5 hover:bg-white/8 transition">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-white">{topic.topic}</p>
                      <p className="text-xs text-gray-500">{topic.subject}</p>
                    </div>
                    <span className={`text-sm font-bold ${topic.color}`}>{topic.score}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-500"
                      style={{ width: `${topic.score}%` }}
                    />
                  </div>
                  <Link to="/quiz" className="text-xs text-indigo-400 hover:text-indigo-300 mt-2 flex items-center gap-1">
                    Practice now <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
            <Link to="/analytics" className="mt-4 block text-center text-sm text-indigo-400 hover:text-indigo-300">
              View Full Analytics →
            </Link>
          </motion.div>
        </div>

        {/* Achievement Preview */}
        <motion.div {...fadeUp} transition={{ delay: 0.8 }} className="card-premium rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Achievements</h3>
            <Link to="/gamification" className="text-sm text-indigo-400 hover:text-indigo-300">View all →</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {[
              { emoji: '🎯', title: 'Quiz Beginner', desc: 'First quiz completed' },
              { emoji: '🔥', title: 'Week Warrior', desc: '7-day streak' },
              { emoji: '📚', title: 'Century Scholar', desc: '100 hours studied' },
              { emoji: '🦉', title: 'Night Owl', desc: 'Late night sessions' },
              { emoji: '🤖', title: 'AI Explorer', desc: '50 AI conversations' },
              { emoji: '📄', title: 'Doc Wizard', desc: '20 docs analyzed' },
            ].map((badge, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, y: -3 }}
                className="flex-shrink-0 w-28 card-interactive rounded-2xl p-4 flex flex-col items-center text-center gap-2"
              >
                <span className="text-3xl">{badge.emoji}</span>
                <p className="text-xs font-medium text-white">{badge.title}</p>
                <p className="text-[10px] text-gray-500">{badge.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
