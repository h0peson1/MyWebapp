'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeUpProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function FadeUp({ 
  children, 
  delay = 0, 
  duration = 0.5, 
  className = '', 
  style = {} 
}: FadeUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay,
        duration
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
