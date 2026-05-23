import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Timer, Play, Pause, RotateCcw, Coffee, Plus, Trash2,
  CheckCircle2, Circle, GripVertical, Target
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

const defaultTasks: Task[] = [
  { id: '1', title: 'Complete DSA assignment', priority: 'high', completed: false },
  { id: '2', title: 'Review Physics notes', priority: 'medium', completed: false },
  { id: '3', title: 'Read Chapter 5 - Databases', priority: 'low', completed: true },
  { id: '4', title: 'Practice SQL queries', priority: 'high', completed: false },
  { id: '5', title: 'Revise Organic Chemistry', priority: 'medium', completed: false },
];

const priorityColors = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-emerald-500',
};

const priorityLabels = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export default function ProductivityPage() {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [timeLeft, setTimeLeft] = useState(workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(2);
  const totalSessions = 4;

  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [newTask, setNewTask] = useState('');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');

  // Timer logic
  useEffect(() => {
    if (!isRunning) return;
    if (timeLeft <= 0) {
      if (!isBreak) {
        setSessionsCompleted((s) => s + 1);
        setIsBreak(true);
        setTimeLeft(breakMinutes * 60);
      } else {
        setIsBreak(false);
        setTimeLeft(workMinutes * 60);
      }
      setIsRunning(false);
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak, workMinutes, breakMinutes]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const totalSeconds = isBreak ? breakMinutes * 60 : workMinutes * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const circumference = 2 * Math.PI * 120;
  const dashOffset = circumference - (progress / 100) * circumference;

  const toggleTimer = useCallback(() => setIsRunning((r) => !r), []);
  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(workMinutes * 60);
  }, [workMinutes]);

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks((t) => [...t, { id: Date.now().toString(), title: newTask, priority: newPriority, completed: false }]);
    setNewTask('');
  };

  const toggleTask = (id: string) => {
    setTasks((t) => t.map((task) => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const deleteTask = (id: string) => {
    setTasks((t) => t.filter((task) => task.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Timer className="w-8 h-8 text-cyan-400" />
            Productivity Hub
          </h1>
          <p className="text-gray-400 mt-1">Focus, plan, and achieve your study goals</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pomodoro Timer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-premium rounded-2xl p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Pomodoro Timer</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                isBreak ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'
              }`}>
                {isBreak ? '☕ Break Time' : '🎯 Focus Time'}
              </span>
            </div>

            {/* Timer Circle */}
            <div className="flex justify-center mb-8">
              <div className="relative w-64 h-64">
                <svg className="w-64 h-64 -rotate-90" viewBox="0 0 256 256">
                  <circle cx="128" cy="128" r="120" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <motion.circle
                    cx="128" cy="128" r="120" fill="none"
                    stroke={isBreak ? '#10b981' : '#6366f1'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    animate={{ strokeDashoffset: dashOffset }}
                    transition={{ duration: 0.5 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-mono font-bold text-white">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                  </span>
                  <span className="text-sm text-gray-400 mt-1">
                    {isBreak ? 'Break' : 'Focus'}
                  </span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetTimer}
                className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition"
              >
                <RotateCcw className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTimer}
                className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-white shadow-lg shadow-indigo-500/30"
              >
                {isRunning ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setIsBreak(true); setTimeLeft(breakMinutes * 60); setIsRunning(false); }}
                className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition"
              >
                <Coffee className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Session Counter */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {Array.from({ length: totalSessions }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i < sessionsCompleted ? 'bg-indigo-500' : 'bg-white/10'
                  }`}
                />
              ))}
              <span className="text-xs text-gray-500 ml-2">{sessionsCompleted}/{totalSessions} sessions</span>
            </div>

            {/* Timer Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Work (min)</label>
                <div className="flex items-center gap-2">
                  {[15, 25, 30, 45].map((m) => (
                    <button
                      key={m}
                      onClick={() => { setWorkMinutes(m); if (!isBreak) setTimeLeft(m * 60); setIsRunning(false); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        workMinutes === m ? 'gradient-primary text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Break (min)</label>
                <div className="flex items-center gap-2">
                  {[3, 5, 10, 15].map((m) => (
                    <button
                      key={m}
                      onClick={() => { setBreakMinutes(m); if (isBreak) setTimeLeft(m * 60); setIsRunning(false); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        breakMinutes === m ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Task Planner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-premium rounded-2xl p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" />
                Today's Tasks
              </h3>
              <span className="text-xs text-gray-500">
                {tasks.filter((t) => t.completed).length}/{tasks.length} done
              </span>
            </div>

            {/* Add Task */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
                placeholder="Add a new task..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
              />
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as Task['priority'])}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-gray-400 focus:border-indigo-500 outline-none"
              >
                <option value="high">High</option>
                <option value="medium">Med</option>
                <option value="low">Low</option>
              </select>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addTask}
                className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white flex-shrink-0"
              >
                <Plus className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Task List */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto no-scrollbar">
              <AnimatePresence>
                {tasks.sort((a, b) => Number(a.completed) - Number(b.completed)).map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      task.completed ? 'bg-white/3 opacity-60' : 'bg-white/5 hover:bg-white/8'
                    }`}
                  >
                    <GripVertical className="w-4 h-4 text-gray-600 flex-shrink-0 cursor-grab" />
                    <button onClick={() => toggleTask(task.id)} className="flex-shrink-0">
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    <span className={`flex-1 text-sm ${task.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
                      {task.title}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority]} flex-shrink-0`} title={priorityLabels[task.priority]} />
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1 rounded-lg hover:bg-red-500/10 text-gray-600 hover:text-red-400 transition flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Productivity Stats */}
            <div className="mt-6 pt-4 border-t border-white/5">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-lg font-bold text-white">{sessionsCompleted * workMinutes}</p>
                  <p className="text-[10px] text-gray-500">Minutes Focused</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{tasks.filter(t => t.completed).length}</p>
                  <p className="text-[10px] text-gray-500">Tasks Done</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}%</p>
                  <p className="text-[10px] text-gray-500">Completion</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
