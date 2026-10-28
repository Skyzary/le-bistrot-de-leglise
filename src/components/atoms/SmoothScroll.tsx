'use client';

import React, { useEffect, useRef } from 'react';

interface SmoothScrollProps {
  children: React.ReactNode;
}

export const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  const lenisRef = useRef<{
    scrollTo: (target: string | number | HTMLElement, options?: Record<string, unknown>) => void;
    raf: (time: number) => void;
    destroy: () => void;
  } | null>(null);

  useEffect(() => {
    let isCancelled = false;
    let rafId: number;

    const initLenis = async () => {
      try {
        const LenisModule = await import('lenis');
        const Lenis = LenisModule.default || LenisModule;

        if (isCancelled) return;

        const lenis = new Lenis({
          duration: 1.15,
          // Apple-style exponential deceleration curve
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 0.95,
          // Disable touch hijacking on mobile to prevent stutter/lag;
          // lets native 120Hz Apple/Android GPU compositor handle finger swipe with 0 latency
          syncTouch: false,
          autoRaf: true,
          autoToggle: true,
          overscroll: true,
          infinite: false,
          respectReducedMotion: true,
        });

        lenisRef.current = lenis;
        (window as unknown as { __lenis?: typeof lenis }).__lenis = lenis;

        // Smoothly handle internal anchor link clicks (#reservation, #menu-overview, etc.)
        const handleAnchorClick = (e: MouseEvent) => {
          const target = (e.target as HTMLElement).closest('a');
          if (!target) return;

          const href = target.getAttribute('href');
          if (href && (href.startsWith('#') || href.startsWith('/#'))) {
            const id = href.replace(/^\/#?/, '');
            if (!id) {
              e.preventDefault();
              lenis.scrollTo(0, { duration: 1.2 });
              return;
            }

            const element = document.getElementById(id);
            if (element) {
              e.preventDefault();
              // Offset for fixed header (70px)
              lenis.scrollTo(element, { offset: -70, duration: 1.2 });
            }
          }
        };

        document.addEventListener('click', handleAnchorClick);

        return () => {
          document.removeEventListener('click', handleAnchorClick);
        };
      } catch (err) {
        console.warn('Lenis smooth scrolling not active, using native smooth scroll.', err);
      }
    };

    let cleanupAnchor: (() => void) | undefined;
    initLenis().then((cleanup) => {
      if (cleanup) cleanupAnchor = cleanup;
    });

    return () => {
      isCancelled = true;
      if (cleanupAnchor) cleanupAnchor();
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
        delete (window as unknown as { __lenis?: unknown }).__lenis;
      }
    };
  }, []);

  return <>{children}</>;
};
