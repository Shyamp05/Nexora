import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-[#06060b] flex items-center justify-center z-50">
      {/* Background glow */}
      <div className="absolute inset-0 gradient-mesh opacity-50" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative flex flex-col items-center gap-6"
      >
        {/* Logo */}
        <motion.div
          animate={{ 
            boxShadow: [
              '0 0 20px rgba(99, 102, 241, 0.3)',
              '0 0 60px rgba(99, 102, 241, 0.5)',
              '0 0 20px rgba(99, 102, 241, 0.3)',
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center"
        >
          <span className="text-white font-bold text-2xl">N</span>
        </motion.div>

        {/* Loading text */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-semibold text-white">Nexora AI</h2>
          <p className="text-sm text-nexora-text-muted">Loading your learning universe...</p>
        </div>

        {/* Loading bar */}
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="w-full h-full gradient-primary rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
}
