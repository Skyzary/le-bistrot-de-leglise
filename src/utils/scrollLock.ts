'use client';

import { useEffect } from 'react';

let lockCount = 0;
let originalBodyOverflow = '';
let originalHtmlOverflow = '';
let originalPaddingRight = '';
let originalOverscrollBehavior = '';

interface LenisInstance {
  stop: () => void;
  start: () => void;
  isStopped?: boolean;
}

const getLenis = (): LenisInstance | undefined => {
  if (typeof window === 'undefined') return undefined;
  return (window as unknown as { __lenis?: LenisInstance }).__lenis;
};

/**
 * Disables background scrolling (Body + HTML + Lenis smooth scroll).
 * Handles reference counting so nested or concurrent modals don't conflict.
 */
export const lockScroll = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  lockCount++;

  if (lockCount === 1) {
    // 1. Calculate scrollbar width before locking overflow to prevent layout shifts
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // 2. Save original styles
    originalBodyOverflow = document.body.style.overflow;
    originalHtmlOverflow = document.documentElement.style.overflow;
    originalPaddingRight = document.body.style.paddingRight;
    originalOverscrollBehavior = document.body.style.overscrollBehavior;

    // 3. Compensate for scrollbar disappearance if any
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // 4. Lock scrolling on body and html
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'contain';

    document.documentElement.setAttribute('data-scroll-locked', 'true');
    document.body.setAttribute('data-scroll-locked', 'true');

    // 5. Pause Lenis smooth scrolling if active
    const lenis = getLenis();
    if (lenis && typeof lenis.stop === 'function') {
      try {
        lenis.stop();
      } catch {
        // Safe fallback
      }
    }
  }
};

/**
 * Re-enables background scrolling once all active modals/popups are closed.
 */
export const unlockScroll = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  if (lockCount > 0) {
    lockCount--;
  }

  if (lockCount === 0) {
    // Restore original styles
    document.documentElement.style.overflow = originalHtmlOverflow;
    document.body.style.overflow = originalBodyOverflow;
    document.body.style.paddingRight = originalPaddingRight;
    document.body.style.overscrollBehavior = originalOverscrollBehavior;

    document.documentElement.removeAttribute('data-scroll-locked');
    document.body.removeAttribute('data-scroll-locked');

    // Resume Lenis smooth scrolling if active
    const lenis = getLenis();
    if (lenis && typeof lenis.start === 'function') {
      try {
        lenis.start();
      } catch {
        // Safe fallback
      }
    }
  }
};

/**
 * React hook to automatically lock scroll when isLocked is true,
 * and restore it when isLocked becomes false or component unmounts.
 */
export const useScrollLock = (isLocked: boolean = true) => {
  useEffect(() => {
    if (!isLocked) return;

    lockScroll();

    return () => {
      unlockScroll();
    };
  }, [isLocked]);
};

