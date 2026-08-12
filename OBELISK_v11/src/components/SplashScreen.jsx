import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const SplashScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 2200);
    const t3 = setTimeout(() => onComplete && onComplete(), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#fafafa] flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-center"
      >
        <svg viewBox="0 0 100 100" className="w-16 h-16 mx-auto mb-6">
          <rect width="100" height="100" fill="white"/>
          <polygon points="50,15 85,80 15,80" fill="black"/>
        </svg>
        <motion.h1
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          animate={{ opacity: 1, letterSpacing: '0.15em' }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="text-3xl font-light tracking-[0.15em]"
        >
          OBELISK
        </motion.h1>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 64 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="h-[1px] bg-black/20 mx-auto mt-6"
        />
        {phase >= 1 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-xs text-black/30 mt-6 tracking-widest"
          >
            INITIALIZING SYSTEM
          </motion.p>
        )}
        {phase >= 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mt-4 flex justify-center gap-1"
          >
            {[0,1,2].map(i => (
              <motion.div
                key={i}
                className="w-1 h-1 bg-black/30 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};