import { motion } from 'framer-motion';
import {
  Clock,
  BrainCircuit,
  Flame,
  Target,
  TrendingUp,
  AlertTriangle,
  Crosshair,
  Zap,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { weeklyAnalytics, subjectPerformance, heatmapData } from '@/data/mockData';

/* ─── Stat card data ────────────────────────────────────────── */
const stats = [
  {
    label: 'Total Study Hours',
    value: '142h',
    icon: Clock,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20',
  },
  {
    label: 'Quizzes Taken',
    value: '87',
    icon: BrainCircuit,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
  },
  {
    label: 'Current Streak',
    value: '15 days',
    icon: Flame,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
  },
  {
    label: 'Average Score',
    value: '82%',
    icon: Target,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
  },
];

/* ─── AI Insights ───────────────────────────────────────────── */
const insights = [
  { icon: TrendingUp, color: 'text-emerald-400', text: 'Your CS scores improved 15% this week' },
  { icon: AlertTriangle, color: 'text-amber-400', text: 'Physics needs more attention — below target' },
  { icon: Crosshair, color: 'text-cyan-400', text: 'You learn best between 2–5 PM' },
  { icon: Zap, color: 'text-orange-400', text: 'Keep your streak going! 15 more days for Monthly Master badge' },
];

/* ─── Custom chart tooltip ──────────────────────────────────── */
interface ChartTooltipPayloadItem {
  name?: string;
  value?: number | string;
  color?: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: ChartTooltipPayloadItem[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: ChartTooltipProps) => {
  if (!active || !payload) return null;
  return (
    <div className="glass-strong rounded-xl px-4 py-3 shadow-xl border border-white/10">
      <p className="text-xs font-semibold text-white mb-1.5">{label}</p>
      {payload.map((item, i) => (
        <p key={i} className="text-xs text-gray-300">
          <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: item.color }} />
          {item.name}: <span className="font-semibold text-white">{item.value}</span>
        </p>
      ))}
    </div>
  );
};

/* ─── Heatmap helpers ───────────────────────────────────────── */
const getHeatmapColor = (value: number): string => {
  switch (value) {
    case 0: return 'bg-white/[0.03]';
    case 1: return 'bg-indigo-500/20';
    case 2: return 'bg-indigo-500/40';
    case 3: return 'bg-indigo-500/60';
    case 4: return 'bg-indigo-400/80';
    default: return 'bg-white/[0.03]';
  }
};

/* ─── Framer Motion variants ────────────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AnalyticsPage() {
  // Prepare heatmap grid: 52 columns x 7 rows
  const heatmapGrid: { date: string; value: number }[][] = [];
  for (let week = 0; week < 52; week++) {
    const weekData: { date: string; value: number }[] = [];
    for (let day = 0; day < 7; day++) {
      const index = week * 7 + day;
      weekData.push(heatmapData[index] || { date: '', value: 0 });
    }
    heatmapGrid.push(weekData);
  }

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Title */}
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Learning Analytics</h1>
          <p className="text-gray-400 text-sm mt-1">Track your progress and performance</p>
        </motion.div>

        {/* ─── ROW 1: Stat Cards ───────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -3 }}
              className={`card-premium rounded-2xl p-5 border ${stat.borderColor}`}
            >
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* ─── ROW 2: Charts ───────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Study Hours — Area Chart */}
          <motion.div variants={itemVariants} className="card-premium rounded-2xl p-5 md:p-6">
            <h3 className="text-base font-semibold text-white mb-4">Weekly Study Hours</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyAnalytics}>
                  <defs>
                    <linearGradient id="gradientHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="day" stroke="#6b6b80" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b6b80" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="hours"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#gradientHours)"
                    name="Hours"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Subject Performance — Bar Chart */}
          <motion.div variants={itemVariants} className="card-premium rounded-2xl p-5 md:p-6">
            <h3 className="text-base font-semibold text-white mb-4">Subject Performance</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectPerformance}>
                  <defs>
                    <linearGradient id="gradientBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis
                    dataKey="subject"
                    stroke="#6b6b80"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    tick={({ x, y, payload }: { x: number; y: number; payload: { value: string } }) => (
                      <text x={x} y={y + 12} textAnchor="middle" fill="#6b6b80" fontSize={10}>
                        {payload.value.length > 8 ? payload.value.slice(0, 8) + '…' : payload.value}
                      </text>
                    )}
                  />
                  <YAxis stroke="#6b6b80" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="score" fill="url(#gradientBar)" radius={[6, 6, 0, 0]} name="Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* ─── ROW 3: Heatmap + AI Insights ────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Heatmap */}
          <motion.div variants={itemVariants} className="lg:col-span-2 card-premium rounded-2xl p-5 md:p-6">
            <h3 className="text-base font-semibold text-white mb-4">Activity Heatmap</h3>
            <div className="overflow-x-auto no-scrollbar">
              <div className="inline-flex gap-[3px]">
                {heatmapGrid.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-[3px]">
                    {week.map((day, dIdx) => (
                      <motion.div
                        key={`${wIdx}-${dIdx}`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: wIdx * 0.005 + dIdx * 0.01 }}
                        title={`${day.date}: ${day.value} sessions`}
                        className={`w-[11px] h-[11px] rounded-[2px] ${getHeatmapColor(day.value)} hover:ring-1 hover:ring-white/20 transition-all cursor-default`}
                      />
                    ))}
                  </div>
                ))}
              </div>
              {/* Legend */}
              <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((v) => (
                  <div key={v} className={`w-[11px] h-[11px] rounded-[2px] ${getHeatmapColor(v)}`} />
                ))}
                <span>More</span>
              </div>
            </div>
          </motion.div>

          {/* AI Insights */}
          <motion.div variants={itemVariants} className="card-premium rounded-2xl p-5 md:p-6">
            <h3 className="text-base font-semibold text-white mb-4">AI Insights</h3>
            <div className="space-y-4">
              {insights.map((insight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
                >
                  <insight.icon className={`w-5 h-5 ${insight.color} flex-shrink-0 mt-0.5`} />
                  <p className="text-sm text-gray-300">{insight.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
