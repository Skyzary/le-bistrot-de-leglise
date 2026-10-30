'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wine, Sparkles, Utensils, Check } from 'lucide-react';
import styles from './WinePairingModal.module.scss';
import { WinePairing } from '@/data/winePairings';
import { triggerHaptic } from '@/utils/haptics';
import { useScrollLock } from '@/utils/scrollLock';

interface WinePairingModalProps {
  pairing: WinePairing | null;
  onClose: () => void;
  onReserve?: () => void;
}

export const WinePairingModal: React.FC<WinePairingModalProps> = ({
  pairing,
  onClose,
  onReserve,
}) => {
  const isOpen = pairing !== null;

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

  if (!pairing) return null;

  const wineTypeClass =
    pairing.wineType === 'Rouge'
      ? styles.rouge
      : pairing.wineType === 'Blanc'
      ? styles.blanc
      : styles.rose;

  const handleBookClick = () => {
    triggerHaptic('success');
    const wineText = `Plat & Accord Sommelier souhaités :\n• ${pairing.dishName}\n• Vin : ${pairing.wineName} (${pairing.appellation} - ${pairing.badge})`;

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('bistrot_reservation_requests', wineText);
        window.dispatchEvent(new CustomEvent('set-reservation-requests', { detail: wineText }));
      } catch {
        // storage fallback
      }
    }

    onClose();
    if (onReserve) {
      onReserve();
    } else {
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          if (window.location.pathname !== '/') {
            window.location.href = '/#reservation';
          } else {
            const el = document.getElementById('reservation');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }
      }, 150);
    }
  };

  return (
    <AnimatePresence>
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
          className={styles.modal}
          data-lenis-prevent
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
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

          {/* Header */}
          <div className={styles.header}>
            <div>
              <span className={styles.sommelierEyebrow}>
                <Wine size={14} color="#D4A373" /> Accord du Sommelier
              </span>
              <h3 className={styles.dishTitle}>{pairing.dishName}</h3>
            </div>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => {
                triggerHaptic('light');
                onClose();
              }}
              aria-label="Fermer la recommandation"
            >
              <X size={18} />
            </button>
          </div>

          {/* Wine Card */}
          <div className={styles.wineCard}>
            <div className={styles.wineTop}>
              <div className={styles.wineIdentity}>
                <h4 className={styles.wineName}>{pairing.wineName}</h4>
                <span className={styles.appellation}>{pairing.appellation}</span>
              </div>
              <span className={`${styles.wineBadge} ${wineTypeClass}`}>
                {pairing.badge}
              </span>
            </div>

            <div className={styles.pricesRow}>
              <div className={styles.priceItem}>
                <span>Verre :</span>
                <strong>{pairing.priceGlass}</strong>
              </div>
              <div className={styles.priceItem}>
                <span>Bouteille :</span>
                <strong>{pairing.priceBottle}</strong>
              </div>
            </div>

            <span className={styles.cepages}>Cépages : {pairing.cepages}</span>
          </div>

          {/* Sommelier Tasting Note */}
          <div className={styles.sommelierBlock}>
            <span className={styles.quoteTitle}>Pourquoi cet accord ?</span>
            <p className={styles.quoteText}>
              &laquo; {pairing.sommelierQuote} &raquo;
            </p>
          </div>

          {/* Action */}
          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.reserveBtn}
              onClick={handleBookClick}
            >
              <Utensils size={16} />
              <span>Réserver pour déguster ce plat</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

