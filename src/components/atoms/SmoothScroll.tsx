'use client';

import React, { useEffect, useRef } from 'react';

interface SmoothScrollProps {
  children: React.ReactNode;
}

/**
 * Universal smooth scroll helper to an element ID or DOM element.
 * Works seamlessly with Lenis and provides a native smooth fallback.
 */
export const smoothScrollTo = (target: string | HTMLElement, offset = -70, duration = 1.1) => {
  if (typeof window === 'undefined') return;

  const element = typeof target === 'string'
    ? document.getElementById(target.replace(/^\/?#/, ''))
    : target;

  if (!element) return;

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = Math.max(0, elementPosition + window.pageYOffset + offset);

  const win = window as unknown as {
    __lenis?: {
      scrollTo: (t: number, opts?: Record<string, unknown>) => void;
      isStopped?: boolean;
    };
  };

  if (win.__lenis && !win.__lenis.isStopped) {
    try {
      win.__lenis.scrollTo(offsetPosition, { duration, force: true });
      return;
    } catch {
      // Fall through to native smooth scroll
    }
  }

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });
};

export const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  const lenisRef = useRef<{
    scrollTo: (target: string | number | HTMLElement, options?: Record<string, unknown>) => void;
    raf: (time: number) => void;
    destroy: () => void;
  } | null>(null);

  useEffect(() => {
    // Disable Lenis on touch devices — mobile has native 120Hz GPU compositor
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    let isCancelled = false;

    const initLenis = async () => {
      try {
        const LenisModule = await import('lenis');
        const Lenis = LenisModule.default || LenisModule;

        if (isCancelled) return;

        const lenis = new Lenis({
          duration: 1.15,
          // Apple-style exponential deceleration curve for desktop wheel
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 0.95,
          // Disable touch hijacking on mobile to prevent stutter/lag;
          // lets native 120Hz Apple/Android GPU compositor handle finger swipe with 0 latency
          syncTouch: false,
          autoRaf: true,
          autoToggle: false,
          overscroll: true,
          infinite: false,
          respectReducedMotion: true,
        });

        lenisRef.current = lenis;
        (window as unknown as { __lenis?: typeof lenis }).__lenis = lenis;

        if (typeof document !== 'undefined' && document.body.getAttribute('data-scroll-locked') === 'true') {
          try {
            lenis.stop();
          } catch {
            // Safe fallback
          }
        }

        // Smoothly handle internal anchor link clicks (#reservation, #menu-overview, etc.)
        const handleAnchorClick = (e: MouseEvent) => {
          const target = (e.target as HTMLElement).closest('a');
          if (!target) return;

          const href = target.getAttribute('href');
          if (href && (href.startsWith('#') || href.startsWith('/#'))) {
            const id = href.replace(/^\/?#/, '');
            if (!id) {
              e.preventDefault();
              try {
                lenis.scrollTo(0, { duration: 1.1, force: true });
              } catch {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
              return;
            }

            const element = document.getElementById(id);
            if (element) {
              e.preventDefault();
              const headerOffset = 70;
              const elementPosition = element.getBoundingClientRect().top;
              const offsetPosition = Math.max(0, elementPosition + window.pageYOffset - headerOffset);

              try {
                lenis.scrollTo(offsetPosition, { duration: 1.1, force: true });
              } catch {
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
              }

              if (window.location.hash !== '#' + id) {
                window.history.pushState(null, '', '#' + id);
              }
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
