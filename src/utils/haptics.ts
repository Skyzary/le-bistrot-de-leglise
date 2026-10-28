/**
 * Web Haptics Utility
 * Provides subtle tactile feedback on mobile devices using the Navigator Vibration API.
 */

export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'selection';

export const triggerHaptic = (type: HapticType = 'light') => {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) {
    return;
  }

  try {
    switch (type) {
      case 'selection':
      case 'light':
        // Crisp, ultra-short tick (like iOS wheel or picker)
        navigator.vibrate(12);
        break;
      case 'medium':
        navigator.vibrate(22);
        break;
      case 'heavy':
        navigator.vibrate(35);
        break;
      case 'success':
        // Pleasant double-tap confirmation pattern
        navigator.vibrate([15, 60, 20]);
        break;
    }
  } catch {
    // Ignore any vibration errors or blocked permissions silently
  }
};

