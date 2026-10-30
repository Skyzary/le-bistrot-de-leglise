'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, ChevronRight, MapPin } from 'lucide-react';
import { FaApple } from 'react-icons/fa6';
import { SiGooglemaps, SiWaze } from 'react-icons/si';
import styles from './RouteActionSheet.module.scss';
import { triggerHaptic } from '@/utils/haptics';
import { useScrollLock } from '@/utils/scrollLock';

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
  useScrollLock(isOpen);

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
          onTouchMove={(e) => {
            if (e.target === e.currentTarget) e.preventDefault();
          }}
        >
          <motion.div
            className={styles.sheet}
            data-lenis-prevent
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
                    <FaApple size={20} />
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
                    <SiGooglemaps size={18} />
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
                    <SiWaze size={20} />
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

