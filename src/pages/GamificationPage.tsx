import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { achievements, dailyMissions, leaderboard } from '@/data/mockData';
import { useAuthStore } from '@/stores/authStore';
import {
  Trophy, Zap, Flame, Crown, Medal, Star, Lock, CheckCircle2
} from 'lucide-react';

type Tab = 'badges' | 'leaderboard' | 'missions';
type BadgeCategory = 'all' | 'streak' | 'quiz' | 'study' | 'social' | 'special';

export default function GamificationPage() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState<Tab>('badges');
  const [category, setCategory] = useState<BadgeCategory>('all');

  const level = user?.level || 12;
  const xp = user?.xp || 4850;
  const nextLevelXp = 5000;
  const xpProgress = (xp / nextLevelXp) * 100;

  const filteredBadges = category === 'all'
    ? achievements
    : achievements.filter((a) => a.category === category);

  const tabs: { key: Tab; label: string; icon: typeof Trophy }[] = [
    { key: 'badges', label: 'Badges', icon: Trophy },
    { key: 'leaderboard', label: 'Leaderboard', icon: Crown },
    { key: 'missions', label: 'Daily Missions', icon: Star },
  ];

  const categories: { key: BadgeCategory; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'streak', label: '🔥 Streak' },
    { key: 'quiz', label: '🎯 Quiz' },
    { key: 'study', label: '📚 Study' },
    { key: 'social', label: '🦋 Social' },
    { key: 'special', label: '✨ Special' },
  ];

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            Achievements & Rewards
          </h1>
          <p className="text-gray-400 mt-1">Track your progress and earn rewards</p>
        </motion.div>

        {/* XP Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-premium rounded-2xl p-6"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Current Level</p>
                <p className="text-3xl font-bold text-white">Level {level}</p>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-400">{xp.toLocaleString()} XP</span>
                <span className="text-gray-500">{nextLevelXp.toLocaleString()} XP</span>
              </div>
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{nextLevelXp - xp} XP until Level {level + 1}</p>
            </div>
            <div className="flex gap-4 text-center">
              <div className="card-interactive rounded-xl p-3 min-w-[70px]">
                <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-white">{user?.streak || 15}</p>
                <p className="text-[10px] text-gray-500">Streak</p>
              </div>
              <div className="card-interactive rounded-xl p-3 min-w-[70px]">
                <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-white">{achievements.filter(a => a.unlocked).length}</p>
                <p className="text-[10px] text-gray-500">Badges</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                tab === t.key
                  ? 'gradient-primary text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === 'badges' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {categories.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setCategory(c.key)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    category === c.key
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Badge Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredBadges.map((badge, i) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={badge.unlocked ? { scale: 1.05, y: -3 } : {}}
                  className={`card-premium rounded-2xl p-5 text-center relative overflow-hidden ${
                    !badge.unlocked ? 'opacity-50' : ''
                  }`}
                >
                  {!badge.unlocked && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
                      <Lock className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                  <span className="text-4xl mb-3 block">{badge.icon}</span>
                  <h4 className="text-sm font-semibold text-white mb-1">{badge.title}</h4>
                  <p className="text-xs text-gray-500 mb-2">{badge.description}</p>
                  <div className="flex items-center justify-center gap-1 text-xs">
                    <Zap className="w-3 h-3 text-indigo-400" />
                    <span className="text-indigo-400">+{badge.xp_reward} XP</span>
                  </div>
                  {badge.unlocked && badge.unlocked_at && (
                    <p className="text-[10px] text-gray-600 mt-2">
                      {new Date(badge.unlocked_at).toLocaleDateString()}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {tab === 'leaderboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {/* Top 3 */}
            <div className="grid grid-cols-3 gap-3">
              {leaderboard.slice(0, 3).map((entry, i) => {
                const medals = ['🥇', '🥈', '🥉'];
                const sizes = ['scale-110', 'scale-100', 'scale-100'];
                return (
                  <motion.div
                    key={entry.user_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`card-premium rounded-2xl p-5 text-center ${sizes[i]} ${i === 0 ? 'glow-blue' : ''}`}
                  >
                    <span className="text-3xl">{medals[i]}</span>
                    <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mx-auto mt-3 text-sm font-bold text-white">
                      {entry.full_name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <p className="text-sm font-semibold text-white mt-2">{entry.full_name}</p>
                    <p className="text-xs text-indigo-400">{entry.xp.toLocaleString()} XP</p>
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-1">
                      <span>Lv.{entry.level}</span>
                      <span>🔥{entry.streak}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Rest */}
            <div className="space-y-2">
              {leaderboard.slice(3).map((entry) => (
                <div
                  key={entry.user_id}
                  className={`flex items-center gap-3 p-4 rounded-xl ${
                    entry.user_id === '1'
                      ? 'bg-indigo-500/10 border border-indigo-500/20 glow-blue'
                      : 'bg-white/5'
                  }`}
                >
                  <span className="text-sm font-bold text-gray-500 w-8">#{entry.rank}</span>
                  <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-white">
                    {entry.full_name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{entry.full_name}</p>
                    <p className="text-xs text-gray-500">Level {entry.level}</p>
                  </div>
                  <span className="text-sm font-bold text-indigo-400">{entry.xp.toLocaleString()} XP</span>
                  <div className="flex items-center gap-1 text-xs text-orange-400">
                    <Flame className="w-3 h-3" />{entry.streak}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {tab === 'missions' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="card-premium rounded-2xl p-5">
              <p className="text-sm text-gray-400 mb-4">Complete daily missions to earn bonus XP!</p>
              <div className="space-y-4">
                {dailyMissions.map((mission) => (
                  <div
                    key={mission.id}
                    className={`p-4 rounded-xl border ${
                      mission.completed
                        ? 'bg-emerald-500/10 border-emerald-500/20'
                        : 'bg-white/5 border-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {mission.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-600" />
                        )}
                        <div>
                          <p className={`text-sm font-medium ${mission.completed ? 'text-emerald-400' : 'text-white'}`}>
                            {mission.title}
                          </p>
                          <p className="text-xs text-gray-500">{mission.description}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-indigo-400 flex items-center gap-1">
                        <Zap className="w-3 h-3" />+{mission.xp_reward}
                      </span>
                    </div>
                    <div className="ml-8">
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            mission.completed
                              ? 'bg-emerald-500'
                              : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                          }`}
                          style={{ width: `${(mission.progress / mission.target) * 100}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">
                        {mission.progress}/{mission.target}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
