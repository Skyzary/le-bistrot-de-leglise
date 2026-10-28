'use client';
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  yOffset?: number;
}

export const ScrollReveal = ({ children, delay = 0, yOffset = 36 }: ScrollRevealProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ 
        type: 'spring',
        stiffness: 95,
        damping: 18,
        mass: 0.8,
        delay 
      }}
    >
      {children}
    </motion.div>
  );
};
