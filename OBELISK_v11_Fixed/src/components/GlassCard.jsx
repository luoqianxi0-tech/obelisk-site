import { motion } from 'framer-motion';

export const GlassCard = ({ children, className = '', delay = 0, hover = true }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={`glass rounded-lg p-6 ${hover ? 'hover:shadow-md' : ''} transition-shadow ${className}`}
  >
    {children}
  </motion.div>
);