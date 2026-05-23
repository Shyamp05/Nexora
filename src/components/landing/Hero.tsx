import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Play, TrendingUp, BookOpen, Brain, Zap } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

// ============================================
// Hero — Epic landing hero section
// ============================================

/** Mini chart data for the dashboard mockup */
const chartData = [
  { v: 30 }, { v: 55 }, { v: 45 }, { v: 72 }, { v: 60 },
  { v: 85 }, { v: 78 }, { v: 95 }, { v: 88 }, { v: 100 },
];

/** Floating particle positions (CSS-only, no runtime randomness) */
const particles = [
  { top: '15%', left: '10%', size: 3, delay: 0 },
  { top: '25%', left: '85%', size: 4, delay: 1.2 },
  { top: '60%', left: '5%',  size: 2, delay: 2.4 },
  { top: '75%', left: '90%', size: 3, delay: 0.8 },
  { top: '40%', left: '95%', size: 2, delay: 1.8 },
  { top: '85%', left: '15%', size: 4, delay: 3.0 },
  { top: '10%', left: '50%', size: 2, delay: 0.4 },
  { top: '50%', left: '75%', size: 3, delay: 2.0 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 * i, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden gradient-hero-bg pt-20 pb-10">
      {/* ---- Glowing orbs ---- */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-600/8 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[140px]" />
      </div>

      {/* ---- Floating particles ---- */}
      <div className="pointer-events-none absolute inset-0">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-indigo-400/30 animate-float"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* ---- Content ---- */}
      <div className="container-nexora relative z-10 flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium glass border border-indigo-500/20 text-indigo-300">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            AI-Powered Education Platform
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6"
        >
          Your AI-Powered
          <br />
          <span className="gradient-text-hero">Learning Universe</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="max-w-2xl text-base sm:text-lg text-gray-400 mb-10 text-balance"
        >
          Experience the future of education with an AI tutor that adapts to you,
          smart quizzes, personalized roadmaps, and deep analytics — all in one
          beautiful platform.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            to="/signup"
            className="btn-primary text-base !py-3.5 !px-8 inline-flex items-center gap-2 shadow-lg shadow-indigo-500/25"
          >
            <Sparkles className="w-5 h-5" />
            Start Learning Free
          </Link>
          <button className="btn-secondary text-base !py-3.5 !px-8 inline-flex items-center gap-2 cursor-pointer">
            <Play className="w-5 h-5" />
            Watch Demo
          </button>
        </motion.div>

        {/* ---- Dashboard Mockup ---- */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="mt-16 w-full max-w-4xl"
        >
          <div className="card-premium p-5 sm:p-6 glow-blue">
            {/* Mockup header bar */}
            <div className="flex items-center gap-2 mb-5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="ml-3 text-xs text-gray-500">Nexora AI — Dashboard</span>
            </div>

            {/* Mockup body */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-5">
              {[
                { label: 'Study Hours', value: '23.5h', icon: BookOpen, color: 'text-cyan-400' },
                { label: 'Quizzes', value: '42', icon: Brain, color: 'text-purple-400' },
                { label: 'XP Earned', value: '4,850', icon: Zap, color: 'text-yellow-400' },
                { label: 'Growth', value: '+24%', icon: TrendingUp, color: 'text-emerald-400' },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    <span className="text-xs text-gray-500">{stat.label}</span>
                  </div>
                  <span className="text-lg sm:text-xl font-bold text-white">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Mini chart */}
            <div className="glass rounded-xl p-4 h-40 sm:h-48">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Weekly Progress</span>
                <span className="text-xs text-emerald-400 font-medium">+18%</span>
              </div>
              <ResponsiveContainer width="100%" height="85%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#heroGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
