'use client';

import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 22,
    restDelta: 0.001
  });

  return (
    <motion.div
      style={{
        scaleX,
        transformOrigin: '0%',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '2.5px',
        background: 'linear-gradient(90deg, #d4a373 0%, #e6af2e 50%, #fab818 100%)',
        boxShadow: '0 0 10px rgba(230, 175, 46, 0.6)',
        zIndex: 10000,
        pointerEvents: 'none',
      }}
    />
  );
};

