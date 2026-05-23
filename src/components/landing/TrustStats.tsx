import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, MessageSquare, Star, GraduationCap } from 'lucide-react';

// ============================================
// TrustStats — Animated count-up stats bar
// ============================================

interface Stat {
  label: string;
  value: number;
  suffix: string;
  icon: React.ElementType;
  color: string;
}

const stats: Stat[] = [
  { label: 'Students', value: 50, suffix: 'K+', icon: Users, color: 'text-cyan-400' },
  { label: 'Questions', value: 1, suffix: 'M+', icon: MessageSquare, color: 'text-purple-400' },
  { label: 'Rating', value: 4.9, suffix: '★', icon: Star, color: 'text-yellow-400' },
  { label: 'Schools', value: 500, suffix: '+', icon: GraduationCap, color: 'text-emerald-400' },
];

/** Simple animated counter hook */
function useCountUp(target: number, isInView: boolean, duration = 2000) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const startTime = performance.now();
    const isFloat = !Number.isInteger(target);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = start + (target - start) * eased;
      setCurrent(isFloat ? parseFloat(value.toFixed(1)) : Math.floor(value));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  return current;
}

function StatCard({ stat, index }: { stat: Stat; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const count = useCountUp(stat.value, isInView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
      className="flex flex-col items-center gap-2 px-4 py-5"
    >
      <stat.icon className={`w-6 h-6 ${stat.color}`} />
      <div className="text-2xl sm:text-3xl font-bold text-white">
        {count}
        {stat.suffix}
      </div>
      <span className="text-sm text-gray-400">{stat.label}</span>
    </motion.div>
  );
}

export default function TrustStats() {
  return (
    <section className="relative z-10 -mt-10 px-4">
      <div className="container-nexora">
        <div className="card-premium glow-blue grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
