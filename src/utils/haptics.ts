/**
 * Web Haptics Utility
 * Tactile vibration feedback is permanently disabled per user preference.
 */

export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'selection';

export const triggerHaptic = (_type?: HapticType) => {
  // Vibration disabled
};


