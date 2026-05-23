import { motion } from 'framer-motion';
import * as Accordion from '@radix-ui/react-accordion';
import { Plus } from 'lucide-react';
import { faqItems } from '@/data/mockData';

// ============================================
// FAQ — Radix Accordion with smooth animations
// ============================================

export default function FAQ() {
  return (
    <section id="faq" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />

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
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Frequently asked{' '}
            <span className="gradient-text">questions</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400">
            Got questions? We&apos;ve got answers. If you can&apos;t find what you&apos;re
            looking for, reach out to our team.
          </p>
        </motion.div>

        {/* ---- Accordion ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion.Root type="single" collapsible className="flex flex-col gap-3">
            {faqItems.map((item, i) => (
              <Accordion.Item
                key={i}
                value={`item-${i}`}
                className="card-premium overflow-hidden group"
              >
                <Accordion.Trigger className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer">
                  <span className="text-sm sm:text-base font-medium text-white group-hover:text-indigo-300 transition-colors">
                    {item.question}
                  </span>
                  <Plus className="w-5 h-5 text-gray-500 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-45" />
                </Accordion.Trigger>
                <Accordion.Content className="overflow-hidden data-[state=open]:animate-[slideDown_300ms_ease-out] data-[state=closed]:animate-[slideUp_300ms_ease-out]">
                  <div className="px-6 pb-5 text-sm text-gray-400 leading-relaxed">
                    {item.answer}
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </motion.div>
      </div>
    </section>
  );
}
