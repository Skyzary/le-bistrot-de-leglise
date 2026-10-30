'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

const SECTIONS = ['reservation', 'nous-trouver', 'menu-overview', 'evenements', 'philosophie'];

/**
 * High-performance active section tracker.
 * - rAF throttling eliminates redundant layout recalculations (getBoundingClientRect)
 * - State update bailouts prevent unnecessary React re-renders on scroll
 */
export const useActiveSection = () => {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>('');
  const isScrollingRef = useRef(false);

  useEffect(() => {
    if (pathname !== '/') {
      setActiveSection((prev) => (prev === '' ? prev : ''));
      return;
    }

    let rafId: number | null = null;

    const checkActiveSection = () => {
      if (isScrollingRef.current) return;

      if (window.scrollY < 100) {
        setActiveSection((prev) => (prev === '' ? prev : ''));
        return;
      }

      let matched = '';
      const threshold = window.innerHeight / 2.5;

      for (const id of SECTIONS) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= threshold) {
            matched = id;
            break;
          }
        }
      }

      setActiveSection((prev) => (prev === matched ? prev : matched));
    };

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        checkActiveSection();
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    checkActiveSection();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [pathname]);

  const setActiveWithPause = useCallback((sectionId: string, pauseDuration = 1000) => {
    setActiveSection(sectionId);
    isScrollingRef.current = true;
    setTimeout(() => {
      isScrollingRef.current = false;
    }, pauseDuration);
  }, []);

  return { activeSection, setActiveSection: setActiveWithPause };
};

