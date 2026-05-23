import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { testimonials } from '@/data/mockData';

// ============================================
// Testimonials — Student reviews grid
// ============================================

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] },
  },
};

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" />

      <div className="container-nexora relative z-10">
        {/* ---- Header ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full glass border border-indigo-500/20 text-indigo-300">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Loved by{' '}
            <span className="gradient-text">students everywhere</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400">
            Hear from students who transformed their learning journey with Nexora AI.
          </p>
        </motion.div>

        {/* ---- Cards ---- */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={cardVariants}
              className="card-premium p-6 flex flex-col"
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-indigo-500/30 mb-4 shrink-0" />

              {/* Quote text */}
              <p className="text-sm text-gray-300 leading-relaxed flex-1 mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>

              {/* Avatar + info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-gray-500">
                    {t.role} • {t.college}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
