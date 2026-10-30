'use client';

import React, { useEffect, useRef } from 'react';

interface SmoothScrollProps {
  children: React.ReactNode;
}

let activeScrollRaf: number | null = null;

/**
 * Custom rAF smooth scroll that works reliably even when CSS sets `scroll-behavior: auto !important`
 * (e.g. on mobile/touch devices where Lenis is disabled for native 120Hz touch swiping).
 */
function animateWindowScrollTo(targetY: number, durationMs = 750) {
  if (typeof window === 'undefined') return;

  if (activeScrollRaf !== null) {
    cancelAnimationFrame(activeScrollRaf);
    activeScrollRaf = null;
  }

  const startY = window.scrollY || window.pageYOffset;
  const distance = targetY - startY;
  if (Math.abs(distance) < 2) return;

  const startTime = performance.now();
  // Stop animation immediately if user touches or wheels during scroll
  const cancelOnUserInput = () => {
    if (activeScrollRaf !== null) {
      cancelAnimationFrame(activeScrollRaf);
      activeScrollRaf = null;
    }
    cleanupListeners();
  };

  const cleanupListeners = () => {
    window.removeEventListener('wheel', cancelOnUserInput);
    window.removeEventListener('touchstart', cancelOnUserInput);
  };

  window.addEventListener('wheel', cancelOnUserInput, { passive: true });
  window.addEventListener('touchstart', cancelOnUserInput, { passive: true });

  const step = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / durationMs);
    // Cubic ease-out
    const eased = 1 - Math.pow(1 - progress, 3);

    window.scrollTo(0, Math.round(startY + distance * eased));

    if (progress < 1) {
      activeScrollRaf = requestAnimationFrame(step);
    } else {
      activeScrollRaf = null;
      cleanupListeners();
    }
  };

  activeScrollRaf = requestAnimationFrame(step);
}

/**
 * Universal smooth scroll helper to an element ID or DOM element.
 * Works seamlessly with Lenis on desktop and rAF easing on mobile/touch.
 */
export const smoothScrollTo = (target: string | HTMLElement, offset = -76, duration = 1.0) => {
  if (typeof window === 'undefined') return;

  const element = typeof target === 'string'
    ? document.getElementById(target.replace(/^\/?#/, ''))
    : target;

  if (!element) return;

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = Math.max(0, elementPosition + window.scrollY + offset);

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
      // Fall through to rAF smooth scroll
    }
  }

  animateWindowScrollTo(offsetPosition, duration * 750);
};

export const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  const lenisRef = useRef<{
    scrollTo: (target: string | number | HTMLElement, options?: Record<string, unknown>) => void;
    raf: (time: number) => void;
    destroy: () => void;
  } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Universal anchor click handler (works on both mobile touch & desktop, including Next.js <Link href="/#...">)
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href || (!href.startsWith('#') && !href.startsWith('/#'))) return;

      // Only intercept if we are already on the home page
      if (window.location.pathname !== '/') return;

      const id = href.replace(/^\/?#/, '');
      if (!id) {
        e.preventDefault();
        e.stopPropagation();
        if (lenisRef.current) {
          try {
            lenisRef.current.scrollTo(0, { duration: 1.0, force: true });
            return;
          } catch {
            // fallback
          }
        }
        animateWindowScrollTo(0, 750);
        return;
      }

      const element = document.getElementById(id);
      if (element) {
        e.preventDefault();
        e.stopPropagation();
        smoothScrollTo(element, -76, 1.0);

        if (window.location.hash !== '#' + id) {
          window.history.pushState(null, '', '#' + id);
        }
      }
    };

    // Use capture phase so Next.js Link doesn't jump before our smooth scroll runs
    document.addEventListener('click', handleAnchorClick, true);

    // Disable Lenis on touch devices — mobile has native 120Hz GPU compositor for finger swiping
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    let isCancelled = false;

    if (!isCoarsePointer) {
      const initLenis = async () => {
        try {
          const LenisModule = await import('lenis');
          const Lenis = LenisModule.default || LenisModule;

          if (isCancelled) return;

          const lenis = new Lenis({
            duration: 1.15,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 0.95,
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
        } catch (err) {
          console.warn('Lenis smooth scrolling not active, using rAF smooth scroll.', err);
        }
      };

      initLenis();
    }

    return () => {
      isCancelled = true;
      document.removeEventListener('click', handleAnchorClick, true);
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
        delete (window as unknown as { __lenis?: unknown }).__lenis;
      }
    };
  }, []);

  return <>{children}</>;
};
