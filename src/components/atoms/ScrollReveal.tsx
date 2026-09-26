'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  yOffset?: number;
}

export const ScrollReveal = ({ children, delay = 0, yOffset = 40 }: ScrollRevealProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }} // Custom spring-like bezier
    >
      {children}
    </motion.div>
  );
};
