'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Navigation, Phone, ChevronRight, Compass, MapPin } from 'lucide-react';
import styles from './RouteActionSheet.module.scss';
import { triggerHaptic } from '@/utils/haptics';

const AppleIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 170 170" fill="currentColor" aria-hidden="true">
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.6-7.85-11.71-14.43-5.77-9.33-10.42-20.2-13.93-32.61-3.52-12.41-5.28-24.08-5.28-35.01 0-14.16 3.66-26.06 10.99-35.7 7.33-9.64 16.5-14.54 27.52-14.72 5.09 0 10.61 1.34 16.57 4.02 5.96 2.68 9.94 4.08 11.95 4.19 1.79 0 5.86-1.42 12.21-4.26 6.35-2.84 11.83-4.14 16.44-3.89 12.75.64 22.86 5.56 30.34 14.77-11.09 6.72-16.52 16.03-16.3 27.93.22 9.5 3.97 17.44 11.24 23.82 7.27 6.38 15.93 10.05 25.98 11.01-2.18 6.64-4.88 13.25-8.12 19.83zM119.22 31.84c0-7.72 2.76-14.99 8.28-21.82 5.52-6.83 12.35-10.98 20.49-12.45.22 1.09.33 2.18.33 3.27 0 7.61-2.82 14.88-8.47 21.81-5.65 6.93-12.51 11.05-20.57 12.36-.06-1.09-.06-2.09-.07-3.17z" />
  </svg>
);

interface RouteActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onViewOnSite?: () => void;
}

export const RouteActionSheet: React.FC<RouteActionSheetProps> = ({
  isOpen,
  onClose,
  onViewOnSite,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.setAttribute('data-route-sheet-open', 'true');
      triggerHaptic('medium');
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.removeAttribute('data-route-sheet-open');
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.removeAttribute('data-route-sheet-open');
    }
  }, [isOpen, onClose]);

  const handleAction = (type: 'haptic' = 'haptic') => {
    triggerHaptic('light');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.sheet}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 300) {
                triggerHaptic('selection');
                onClose();
              }
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.dragHandle} />

            <div className={styles.header}>
              <div className={styles.titleArea}>
                <h3 className={styles.title}>Itinéraire & Contact</h3>
                <span className={styles.address}>
                  <MapPin size={14} color="#D4A373" /> 4 place du 11 novembre 1918, Fabrègues
                </span>
              </div>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => {
                  triggerHaptic('light');
                  onClose();
                }}
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.optionsList}>
              {/* Apple Maps */}
              <a
                href="https://maps.apple.com/?q=Le+Bistrot+de+l%27%C3%89glise+Fabr%C3%A8gues&ll=43.5508,3.7766"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.routeOption}
                onClick={() => handleAction()}
              >
                <div className={styles.optionLeft}>
                  <div className={`${styles.iconWrapper} ${styles.apple}`}>
                    <AppleIcon size={18} />
                  </div>
                  <div className={styles.optionInfo}>
                    <span className={styles.optionName}>Apple Plans</span>
                    <span className={styles.optionDesc}>Navigation native iPhone</span>
                  </div>
                </div>
                <ChevronRight size={18} className={styles.chevron} />
              </a>

              {/* Google Maps */}
              <a
                href="https://maps.app.goo.gl/gwVypQNT65eDC3mZ8"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.routeOption}
                onClick={() => handleAction()}
              >
                <div className={styles.optionLeft}>
                  <div className={`${styles.iconWrapper} ${styles.google}`}>
                    <Navigation size={20} />
                  </div>
                  <div className={styles.optionInfo}>
                    <span className={styles.optionName}>Google Maps</span>
                    <span className={styles.optionDesc}>Trafic en temps réel & avis</span>
                  </div>
                </div>
                <ChevronRight size={18} className={styles.chevron} />
              </a>

              {/* Waze */}
              <a
                href="https://waze.com/ul?q=Le+Bistrot+de+l%27Eglise+Fabregues"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.routeOption}
                onClick={() => handleAction()}
              >
                <div className={styles.optionLeft}>
                  <div className={`${styles.iconWrapper} ${styles.waze}`}>
                    <Compass size={20} />
                  </div>
                  <div className={styles.optionInfo}>
                    <span className={styles.optionName}>Waze</span>
                    <span className={styles.optionDesc}>Guidage routier communautaire</span>
                  </div>
                </div>
                <ChevronRight size={18} className={styles.chevron} />
              </a>

              {/* Direct Call */}
              <a
                href="tel:0434117585"
                className={styles.routeOption}
                onClick={() => handleAction()}
              >
                <div className={styles.optionLeft}>
                  <div className={`${styles.iconWrapper} ${styles.phone}`}>
                    <Phone size={18} />
                  </div>
                  <div className={styles.optionInfo}>
                    <span className={styles.optionName}>Appeler le bistrot</span>
                    <span className={styles.optionDesc}>04 34 11 75 85</span>
                  </div>
                </div>
                <ChevronRight size={18} className={styles.chevron} />
              </a>

              {/* Scroll to map on site */}
              {onViewOnSite && (
                <button
                  type="button"
                  className={styles.routeOption}
                  onClick={() => {
                    handleAction();
                    onViewOnSite();
                    onClose();
                  }}
                >
                  <div className={styles.optionLeft}>
                    <div className={`${styles.iconWrapper} ${styles.site}`}>
                      <MapPin size={18} />
                    </div>
                    <div className={styles.optionInfo}>
                      <span className={styles.optionName}>Horaires & carte sur le site</span>
                      <span className={styles.optionDesc}>Voir la section localisation</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className={styles.chevron} />
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

