import { motion } from 'framer-motion';
import { BookOpen, Cpu, MessageCircle, TrendingUp } from 'lucide-react';

// ============================================
// HowItWorks — 4-step animated flow
// ============================================

interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ElementType;
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Choose Your Subject',
    description: 'Pick any subject or topic you want to master — from Math to AI.',
    icon: BookOpen,
  },
  {
    number: 2,
    title: 'AI Creates Your Path',
    description: 'Our AI analyzes your level and builds a personalized learning roadmap.',
    icon: Cpu,
  },
  {
    number: 3,
    title: 'Learn Interactively',
    description: 'Study with an AI tutor, take adaptive quizzes, and analyze documents.',
    icon: MessageCircle,
  },
  {
    number: 4,
    title: 'Track & Grow',
    description: 'Monitor progress with analytics, earn XP, and climb leaderboards.',
    icon: TrendingUp,
  },
];

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 * i, duration: 0.5, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />

      <div className="container-nexora relative z-10">
        {/* ---- Header ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 sm:mb-20"
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full glass border border-indigo-500/20 text-indigo-300">
            How it Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Start learning in{' '}
            <span className="gradient-text">4 simple steps</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400">
            From choosing a subject to mastering it — Nexora guides you every step of the way.
          </p>
        </motion.div>

        {/* ---- Steps ---- */}
        <div className="relative">
          {/* Connecting line — desktop horizontal */}
          <div className="hidden lg:block absolute top-16 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-cyan-500/30" />

          {/* Connecting line — mobile vertical */}
          <div className="lg:hidden absolute top-0 bottom-0 left-8 w-0.5 bg-gradient-to-b from-indigo-500/30 via-purple-500/30 to-cyan-500/30" />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                variants={cardVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="relative flex lg:flex-col items-start lg:items-center text-left lg:text-center gap-5 lg:gap-0 pl-16 lg:pl-0"
              >
                {/* Step number circle */}
                <div className="absolute left-2.5 lg:static lg:mb-6 w-11 h-11 rounded-full gradient-primary flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30 z-10 shrink-0">
                  {step.number}
                </div>

                {/* Content */}
                <div>
                  {/* Icon */}
                  <div className="hidden lg:flex w-14 h-14 rounded-2xl glass items-center justify-center mb-4 mx-auto group-hover:scale-105 transition-transform">
                    <step.icon className="w-7 h-7 text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
