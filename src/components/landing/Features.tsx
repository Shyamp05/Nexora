import { motion } from 'framer-motion';
import { Bot, BrainCircuit, FileSearch, Map, BarChart3, Trophy } from 'lucide-react';
import { features } from '@/data/mockData';

// ============================================
// Features — 6-card responsive grid
// ============================================

/** Map icon string names from mockData to Lucide components */
const iconMap: Record<string, React.ElementType> = {
  Bot,
  BrainCircuit,
  FileSearch,
  Map,
  BarChart3,
  Trophy,
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] },
  },
};

export default function Features() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="container-nexora">
        {/* ---- Header ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full glass border border-indigo-500/20 text-indigo-300">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything you need to{' '}
            <span className="gradient-text">learn smarter</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400">
            Nexora AI combines cutting-edge AI with beautiful design to create
            the ultimate learning experience.
          </p>
        </motion.div>

        {/* ---- Cards grid ---- */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((feature) => {
            const Icon = iconMap[feature.icon] ?? Bot;
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                className="card-premium p-6 sm:p-7 group"
              >
                {/* Gradient icon circle */}
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
