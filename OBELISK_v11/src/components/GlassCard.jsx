import { motion } from 'framer-motion';

export const GlassCard = ({ children, className = '', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
    className={`glass rounded-xl p-5 ${className}`}
  >
    {children}
  </motion.div>
);