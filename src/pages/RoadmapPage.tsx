import { useState, useCallback, useEffect } from 'react';
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
import { generateRoadmap as generateAIRoadmap } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

// Static fallback roadmap in case Gemini is offline or rate-limited
const getFallbackRoadmap = (topic: string): { topic: string; days: RoadmapDay[] } => ({
  topic,
  days: [
    {
      day: 1,
      title: `Introduction to ${topic}`,
      topics: [`Core concepts of ${topic}`, `Setting up development environments`, `Basic syntax and structures`],
      resources: [`Official ${topic} Documentation`, 'Getting Started Guide (YouTube)'],
      quiz: false,
      completed: false,
    },
    {
      day: 2,
      title: 'Foundational Principles',
      topics: ['Key architecture components', 'Under the hood mechanisms', 'Common pitfalls'],
      resources: ['Intermediate Concepts Tutorial', 'Hands-on practice examples'],
      quiz: true,
      completed: false,
    },
    {
      day: 3,
      title: 'Working with Data',
      topics: ['Variables and state management', 'Handling inputs/outputs', 'Data manipulation flow'],
      resources: ['Working with Data Guide', 'Interactive exercises'],
      quiz: false,
      completed: false,
    },
    {
      day: 4,
      title: 'Advanced Features',
      topics: ['Advanced functions and modules', 'Optimization techniques', 'Performance best practices'],
      resources: ['Advanced Tutorial Course', 'Speed optimization blog post'],
      quiz: true,
      completed: false,
    },
    {
      day: 5,
      title: 'Integration and Testing',
      topics: ['External APIs and systems integration', 'Writing unit tests', 'Debugging methods'],
      resources: ['Testing Framework Basics', 'Debugging Cheat Sheet'],
      quiz: true,
      completed: false,
    },
    {
      day: 6,
      title: 'Building a Real-world Project',
      topics: ['Structuring a complete codebase', 'Implementing key user stories', 'Error handling and deployment'],
      resources: ['Full-stack Project Walkthrough', 'Deployment Checklist'],
      quiz: false,
      completed: false,
    },
    {
      day: 7,
      title: 'Revision & final Quiz',
      topics: ['Review of all concepts', 'Addressing weaknesses', 'Final quiz evaluation'],
      resources: [`Complete ${topic} Cheat Sheet`, 'Final Practice Set'],
      quiz: true,
      completed: false,
    },
  ],
});

const popularTopics = ['React', 'Python', 'DSA', 'Machine Learning', 'DBMS', 'System Design'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function RoadmapPage() {
  const { user } = useAuthStore();
  const [view, setView] = useState<'input' | 'view'>('input');
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState<{ id?: string; topic: string; days: RoadmapDay[] } | null>(null);
  const [checkedTopics, setCheckedTopics] = useState<Record<string, boolean>>({});

  // Clean raw markdown if Gemini returns JSON wrapped in backticks
  const cleanJSONResponse = (raw: string): string => {
    let clean = raw.trim();
    if (clean.startsWith('```')) {
      clean = clean.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();
    }
    return clean;
  };

  // Load user's latest roadmap if any exists on mount
  useEffect(() => {
    const fetchLatestRoadmap = async () => {
      if (!user?.id) return;
      try {
        const { data, error } = await supabase
          .from('roadmaps')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) throw error;
        if (data && data.length > 0) {
          const dbRoadmap = data[0];
          setRoadmap({
            id: dbRoadmap.id,
            topic: dbRoadmap.topic,
            days: dbRoadmap.data as RoadmapDay[],
          });
          
          // Parse progress checkboxes
          const progressMap: Record<string, boolean> = {};
          if (Array.isArray(dbRoadmap.progress)) {
            dbRoadmap.progress.forEach((key: string) => {
              progressMap[key] = true;
            });
          }
          setCheckedTopics(progressMap);
          setView('view');
        }
      } catch (err: any) {
        console.warn('Failed to load roadmap from Supabase, looking in localStorage:', err.message);
        const localRoadmap = localStorage.getItem(`nexora_roadmap_${user.id}`);
        if (localRoadmap) {
          const parsed = JSON.parse(localRoadmap);
          setRoadmap(parsed);
          
          const localProgress = localStorage.getItem(`nexora_roadmap_progress_${user.id}`);
          if (localProgress) {
            setCheckedTopics(JSON.parse(localProgress));
          }
          setView('view');
        }
      }
    };

    fetchLatestRoadmap();
  }, [user?.id]);

  const handleGenerate = useCallback(async () => {
    if (!inputValue.trim() || !user?.id) return;
    setIsGenerating(true);

    const topic = inputValue.trim();
    let parsedDays: RoadmapDay[] | null = null;
    let newRoadmapId = crypto.randomUUID();

    try {
      // 1. Ask Gemini to generate the curriculum
      const rawAIResponse = await generateAIRoadmap(topic);
      const cleanJSON = cleanJSONResponse(rawAIResponse);
      const data = JSON.parse(cleanJSON);
      
      if (Array.isArray(data) && data.length > 0) {
        parsedDays = data.map((d, i) => ({
          day: d.day || i + 1,
          title: d.title || `Day ${d.day || i + 1}`,
          topics: Array.isArray(d.topics) ? d.topics : ['Concepts Overview'],
          resources: Array.isArray(d.resources) ? d.resources : ['Study Reference Material'],
          quiz: !!d.quiz,
          completed: false,
        }));
      }
    } catch (err) {
      console.error('Failed to generate roadmap from Gemini API, using fallback generator:', err);
    }

    // 2. Fallback if JSON parsing or Gemini API failed
    if (!parsedDays) {
      parsedDays = getFallbackRoadmap(topic).days;
    }

    const newRoadmap = {
      id: newRoadmapId,
      topic,
      days: parsedDays,
    };

    // 3. Save to database / local storage
    try {
      const { data: dbInsert, error } = await supabase
        .from('roadmaps')
        .insert([{
          id: newRoadmapId,
          user_id: user.id,
          topic,
          days: 7,
          data: parsedDays,
          progress: [],
        }])
        .select();

      if (error) throw error;
      if (dbInsert && dbInsert.length > 0) {
        newRoadmap.id = dbInsert[0].id;
      }
    } catch (err: any) {
      console.warn('Failed to persist roadmap to Supabase, saving locally:', err.message);
    }

    // Sync to local storage
    localStorage.setItem(`nexora_roadmap_${user.id}`, JSON.stringify(newRoadmap));
    localStorage.removeItem(`nexora_roadmap_progress_${user.id}`);
    
    setCheckedTopics({});
    setRoadmap(newRoadmap);
    setIsGenerating(false);
    setView('view');
  }, [inputValue, user?.id]);

  const toggleTopic = async (dayIndex: number, topicIndex: number) => {
    if (!roadmap || !user?.id) return;
    const key = `${dayIndex}-${topicIndex}`;
    const newChecked = { ...checkedTopics, [key]: !checkedTopics[key] };
    setCheckedTopics(newChecked);

    // Save progress mapping to DB / localStorage
    const checkedKeysList = Object.keys(newChecked).filter(k => newChecked[k]);
    
    // Sync to local storage
    localStorage.setItem(`nexora_roadmap_progress_${user.id}`, JSON.stringify(newChecked));

    try {
      if (roadmap.id) {
        await supabase
          .from('roadmaps')
          .update({ progress: checkedKeysList })
          .eq('id', roadmap.id);
      }
    } catch (err: any) {
      console.warn('Failed to update checked topics in Supabase:', err.message);
    }
  };

  // Calculate progress based on toggled subtopics
  const totalSubtopics = roadmap?.days.reduce((acc, d) => acc + d.topics.length, 0) || 0;
  const completedSubtopics = roadmap?.days.reduce((acc, d, dIdx) => {
    return acc + d.topics.filter((_, tIdx) => checkedTopics[`${dIdx}-${tIdx}`]).length;
  }, 0) || 0;

  const progressPercent = totalSubtopics > 0 
    ? Math.round((completedSubtopics / totalSubtopics) * 100) 
    : 0;

  const getDayStatus = (dayIndex: number): 'completed' | 'current' | 'upcoming' => {
    if (!roadmap) return 'upcoming';
    const day = roadmap.days[dayIndex];
    
    // Day is completed if all of its subtopics are checked
    const allTopicsChecked = day.topics.every((_, tIdx) => checkedTopics[`${dayIndex}-${tIdx}`]);
    if (allTopicsChecked) return 'completed';

    // Find the first day that is not fully completed
    const firstIncompleteDayIndex = roadmap.days.findIndex((d, dIdx) => 
      !d.topics.every((_, tIdx) => checkedTopics[`${dIdx}-${tIdx}`])
    );
    
    if (dayIndex === firstIncompleteDayIndex) return 'current';
    return 'upcoming';
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
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
                Tell us what you want to learn, and our AI will build a personalized syllabus
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
                    <p className="text-sm text-gray-500">Creating your personalized roadmap using Gemini...</p>
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
                  <p className="text-gray-400 text-sm mt-1">{roadmap.days.length}-day customized plan</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="card-premium p-5 rounded-2xl mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-300">Topic Progress</span>
                  <span className="text-sm font-bold gradient-text">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full gradient-primary"
                  />
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    {completedSubtopics} of {totalSubtopics} items completed
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
                  const status = getDayStatus(index);
                  const allChecked = day.topics.every((_, tIdx) => checkedTopics[`${index}-${tIdx}`]);
                  
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
                            const isChecked = !!checkedTopics[`${index}-${tIdx}`];
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
                        {day.resources && day.resources.length > 0 && (
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
                                  <BookOpen className="w-3.5 h-3.5" />
                                  {resource}
                                  <ChevronRight className="w-3 h-3" />
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
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
