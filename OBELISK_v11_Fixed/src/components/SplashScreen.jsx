import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const SplashScreen = ({ onComplete, minDuration = 1500, maxDuration = 4000 }) => {
  const [visible, setVisible] = useState(true);
  const [errorHint, setErrorHint] = useState(false);
  const completedRef = useRef(false);
  const fadeTimerRef = useRef(null);
  const fallbackTimerRef = useRef(null);
  const hintTimerRef = useRef(null);

  const handleComplete = () => {
    if (completedRef.current) return;
    completedRef.current = true;

    fadeTimerRef.current = setTimeout(() => {
      try { onComplete && onComplete(); } catch (e) { /* noop */ }
    }, 600);
  };

  useEffect(() => {
    const mainTimer = setTimeout(() => {
      setVisible(false);
      handleComplete();
    }, minDuration);

    fallbackTimerRef.current = setTimeout(() => {
      setVisible(false);
      handleComplete();
    }, maxDuration);

    hintTimerRef.current = setTimeout(() => {
      if (!completedRef.current) setErrorHint(true);
    }, Math.min(maxDuration * 0.6, 2500));

    return () => {
      clearTimeout(mainTimer);
      clearTimeout(fadeTimerRef.current);
      clearTimeout(fallbackTimerRef.current);
      clearTimeout(hintTimerRef.current);
    };
  }, [minDuration, maxDuration, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-[#fafafa] to-[#e8e8e8]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center">
            <motion.h1
              className="text-6xl md:text-8xl font-light tracking-[0.3em] text-black"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              OBELISK
            </motion.h1>
            <motion.div
              className="mt-6 h-[1px] bg-black/20 mx-auto"
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
            <motion.div
              className="mt-6 flex justify-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 bg-black/30 rounded-full"
                  animate={{ opacity: [0.25, 1, 0.25] }}
                  transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </motion.div>
            {errorHint && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 text-xs text-black/40 tracking-wide"
              >
                加载中，请稍候... 若长时间无响应请刷新
              </motion.p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};