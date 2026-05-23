import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Map,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  Trophy,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import type { RoadmapDay } from '@/types';

/* ─── Mock roadmap data ─────────────────────────────────────── */
const generateRoadmap = (topic: string): { topic: string; days: RoadmapDay[] } => ({
  topic,
  days: [
    {
      day: 1,
      title: 'Introduction to DBMS',
      topics: ['What is DBMS', 'Types of DBMS', 'DBMS vs File System'],
      resources: ['DBMS by Navathe Ch.1', 'Gate Smashers YouTube'],
      quiz: false,
      completed: true,
    },
    {
      day: 2,
      title: 'ER Model',
      topics: ['Entities', 'Relationships', 'ER Diagrams'],
      resources: ['ER Model Tutorial - GeeksforGeeks', 'Practice ER diagrams'],
      quiz: true,
      completed: true,
    },
    {
      day: 3,
      title: 'Relational Model',
      topics: ['Keys', 'Constraints', 'Schema'],
      resources: ['Relational Algebra Notes', 'W3Schools SQL'],
      quiz: false,
      completed: false,
    },
    {
      day: 4,
      title: 'SQL Basics',
      topics: ['DDL', 'DML', 'SELECT queries'],
      resources: ['SQLBolt Interactive', 'LeetCode SQL 50'],
      quiz: true,
      completed: false,
    },
    {
      day: 5,
      title: 'Normalization',
      topics: ['1NF', '2NF', '3NF', 'BCNF'],
      resources: ['Normalization by Jenny\'s Lectures', 'Practice Problems'],
      quiz: true,
      completed: false,
    },
    {
      day: 6,
      title: 'Transactions',
      topics: ['ACID Properties', 'Concurrency Control', 'Locks'],
      resources: ['Transaction Management Notes', 'GATE PYQs'],
      quiz: false,
      completed: false,
    },
    {
      day: 7,
      title: 'Revision & Quiz',
      topics: ['Review all concepts', 'Practice quiz', 'Weak areas revision'],
      resources: ['DBMS Cheat Sheet', 'Final Practice Set'],
      quiz: true,
      completed: false,
    },
  ],
});

const popularTopics = ['React', 'Python', 'DSA', 'Machine Learning', 'DBMS', 'System Design'];

/* ─── Framer Motion variants ────────────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function RoadmapPage() {
  const [view, setView] = useState<'input' | 'view'>('input');
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState<ReturnType<typeof generateRoadmap> | null>(null);
  const [checkedTopics, setCheckedTopics] = useState<Record<string, boolean>>({});

  const handleGenerate = useCallback(async () => {
    if (!inputValue.trim()) return;
    setIsGenerating(true);
    // Simulate AI generation delay
    await new Promise((r) => setTimeout(r, 2000));
    const data = generateRoadmap(inputValue.trim());
    setRoadmap(data);
    setIsGenerating(false);
    setView('view');
  }, [inputValue]);

  const toggleTopic = (dayIndex: number, topicIndex: number) => {
    const key = `${dayIndex}-${topicIndex}`;
    setCheckedTopics((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Calculate progress
  const progress = roadmap
    ? Math.round(
        (roadmap.days.filter((d) => d.completed).length / roadmap.days.length) * 100
      )
    : 0;

  const getDayStatus = (day: RoadmapDay, index: number): 'completed' | 'current' | 'upcoming' => {
    if (day.completed) return 'completed';
    // First non-completed day is current
    const firstIncompleteIndex = roadmap?.days.findIndex((d) => !d.completed) ?? -1;
    if (index === firstIncompleteIndex) return 'current';
    return 'upcoming';
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {/* ─── INPUT STATE ──────────────────────────────── */}
          {view === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center pt-8 md:pt-16"
            >
              {/* Icon */}
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20"
              >
                <Map className="w-10 h-10 text-white" />
              </motion.div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold gradient-text text-center mb-3">
                AI Roadmap Generator
              </h1>
              <p className="text-gray-400 text-center mb-10 text-lg">
                Tell us what you want to learn
              </p>

              {/* Input */}
              <div className="w-full max-w-xl mb-6">
                <div className="relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    placeholder="e.g., Learn DBMS in 7 days"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-lg placeholder:text-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                  <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
                </div>
              </div>

              {/* Popular topics */}
              <div className="flex flex-wrap justify-center gap-2 mb-10">
                {popularTopics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setInputValue(`Learn ${topic} in 7 days`)}
                    className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 hover:text-white hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all"
                  >
                    {topic}
                  </button>
                ))}
              </div>

              {/* Generate button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleGenerate}
                disabled={isGenerating || !inputValue.trim()}
                className="btn-primary px-10 py-4 text-lg rounded-2xl flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Roadmap...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Roadmap
                  </>
                )}
              </motion.button>

              {/* Loading animation */}
              <AnimatePresence>
                {isGenerating && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-8 flex flex-col items-center gap-3"
                  >
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                          className="w-2.5 h-2.5 rounded-full bg-indigo-400"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">Creating your personalized roadmap...</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ─── VIEW STATE ───────────────────────────────── */}
          {view === 'view' && roadmap && (
            <motion.div
              key="view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setView('input')}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    {roadmap.topic}
                  </h1>
                  <p className="text-gray-400 text-sm mt-1">7-day learning plan</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="card-premium p-5 rounded-2xl mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-300">Overall Progress</span>
                  <span className="text-sm font-bold gradient-text">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full gradient-primary"
                  />
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    {roadmap.days.filter((d) => d.completed).length} completed
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    {roadmap.days.filter((d) => !d.completed).length} remaining
                  </span>
                </div>
              </div>

              {/* Timeline */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative"
              >
                {/* Connecting gradient line */}
                <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-indigo-500/20" />

                {roadmap.days.map((day, index) => {
                  const status = getDayStatus(day, index);
                  return (
                    <motion.div
                      key={day.day}
                      variants={itemVariants}
                      className="relative pl-16 md:pl-20 pb-8 last:pb-0"
                    >
                      {/* Day circle */}
                      <div
                        className={`absolute left-3 md:left-5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold z-10 ${
                          status === 'completed'
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                            : status === 'current'
                            ? 'gradient-primary text-white shadow-lg shadow-indigo-500/30 ring-4 ring-indigo-500/20'
                            : 'bg-white/10 text-gray-400 border border-white/10'
                        }`}
                      >
                        {status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          day.day
                        )}
                      </div>

                      {/* Day card */}
                      <div
                        className={`card-premium rounded-2xl p-5 md:p-6 transition-all ${
                          status === 'current'
                            ? 'border-indigo-500/30 glow-blue'
                            : status === 'completed'
                            ? 'border-emerald-500/10'
                            : 'opacity-70'
                        }`}
                      >
                        {/* Card header */}
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-indigo-400">
                                Day {day.day}
                              </span>
                              {status === 'current' && (
                                <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 rounded-full">
                                  IN PROGRESS
                                </span>
                              )}
                              {status === 'completed' && (
                                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 rounded-full">
                                  COMPLETED
                                </span>
                              )}
                            </div>
                            <h3 className="text-lg font-semibold text-white">{day.title}</h3>
                          </div>
                          {day.quiz && (
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-500/15 text-purple-300 text-xs font-medium">
                              <Trophy className="w-3.5 h-3.5" />
                              Quiz
                            </span>
                          )}
                        </div>

                        {/* Topics */}
                        <div className="space-y-2 mb-4">
                          {day.topics.map((topic, tIdx) => {
                            const isChecked = checkedTopics[`${index}-${tIdx}`] || day.completed;
                            return (
                              <button
                                key={tIdx}
                                onClick={() => toggleTopic(index, tIdx)}
                                className="flex items-center gap-3 w-full text-left group"
                              >
                                {isChecked ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                ) : (
                                  <Circle className="w-4 h-4 text-gray-500 group-hover:text-gray-300 flex-shrink-0" />
                                )}
                                <span
                                  className={`text-sm transition-colors ${
                                    isChecked
                                      ? 'text-gray-400 line-through'
                                      : 'text-gray-300 group-hover:text-white'
                                  }`}
                                >
                                  {topic}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Resources */}
                        <div className="pt-3 border-t border-white/5">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Resources
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {day.resources.map((resource, rIdx) => (
                              <span
                                key={rIdx}
                                className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                              >
                                <BookOpen className="w-3 h-3" />
                                {resource}
                                <ChevronRight className="w-3 h-3" />
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
