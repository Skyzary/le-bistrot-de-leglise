'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Dices, Utensils, Salad, Beef, Wine, Cake, RotateCw } from 'lucide-react';
import styles from './ChefRouletteModal.module.scss';
import { getRandomChefCombo, ChefCombo } from '@/data/chefCombos';
import { triggerHaptic } from '@/utils/haptics';
import { useScrollLock } from '@/utils/scrollLock';
import { smoothScrollTo } from '@/components/atoms/SmoothScroll';

interface ChefRouletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReserve?: () => void;
}

export const ChefRouletteModal: React.FC<ChefRouletteModalProps> = ({
  isOpen,
  onClose,
  onReserve,
}) => {
  const [combo, setCombo] = useState<ChefCombo>(getRandomChefCombo);
  const [isSpinning, setIsSpinning] = useState(false);
  const spinIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleSpin = useCallback(() => {
    if (isSpinning) return;
    setIsSpinning(true);
    triggerHaptic('selection');

    let count = 0;
    const maxTicks = 14;

    spinIntervalRef.current = setInterval(() => {
      count++;
      setCombo(getRandomChefCombo());
      triggerHaptic('light');

      if (count >= maxTicks) {
        if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
        setIsSpinning(false);
        triggerHaptic('success');
      }
    }, 80);
  }, [isSpinning]);

  useEffect(() => {
    return () => {
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
    };
  }, []);

  if (!isOpen) return null;

  const handleBookTable = () => {
    triggerHaptic('success');
    const comboText = `Menu Roulette du Chef :\n• Entrée : ${combo.entree.name}\n• Plat : ${combo.plat.name}\n• Vin : ${combo.vin.name}\n• Dessert : ${combo.dessert.name}\n(Formule estimée ~ ${combo.totalPrice.toFixed(2)} €/pers.)`;

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('bistrot_reservation_requests', comboText);
        window.dispatchEvent(new CustomEvent('set-reservation-requests', { detail: comboText }));
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
            smoothScrollTo('reservation');
          }
        }
      }, 150);
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
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
          dragConstraints={{ top: 0, bottom: 0 }}
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
            <div className={styles.titleArea}>
              <span className={styles.eyebrow}>
                <Sparkles size={13} /> Suggestion Aléatoire du Jour
              </span>
              <h3 className={styles.title}>La Roulette du Chef</h3>
              <p className={styles.subtitle}>
                Laissez le hasard composer votre accord parfait au Bistrot.
              </p>
            </div>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => {
                triggerHaptic('light');
                onClose();
              }}
              aria-label="Fermer la roulette"
            >
              <X size={18} />
            </button>
          </div>

          {/* Slot Cards */}
          <div className={styles.slotsGrid}>
            {/* Entrée */}
            <motion.div
              className={`${styles.slotCard} ${isSpinning ? styles.spinning : ''}`}
              animate={{ scale: isSpinning ? [1, 1.02, 1] : 1 }}
              transition={{ duration: 0.15 }}
            >
              <div className={styles.slotLeft}>
                <div className={`${styles.slotIcon} ${styles.entree}`}>
                  <Salad size={18} />
                </div>
                <div className={styles.slotInfo}>
                  <span className={styles.slotCategory}>Entrée</span>
                  <span className={styles.slotName}>{combo.entree.name}</span>
                  {combo.entree.desc && (
                    <span className={styles.slotDesc}>{combo.entree.desc}</span>
                  )}
                </div>
              </div>
              <span className={styles.slotPrice}>{combo.entree.price.toFixed(2)} €</span>
            </motion.div>

            {/* Plat */}
            <motion.div
              className={`${styles.slotCard} ${isSpinning ? styles.spinning : ''}`}
              animate={{ scale: isSpinning ? [1, 1.02, 1] : 1 }}
              transition={{ duration: 0.15, delay: 0.04 }}
            >
              <div className={styles.slotLeft}>
                <div className={`${styles.slotIcon} ${styles.plat}`}>
                  <Beef size={18} />
                </div>
                <div className={styles.slotInfo}>
                  <span className={styles.slotCategory}>Plat de Résistance</span>
                  <span className={styles.slotName}>{combo.plat.name}</span>
                  {combo.plat.desc && (
                    <span className={styles.slotDesc}>{combo.plat.desc}</span>
                  )}
                </div>
              </div>
              <span className={styles.slotPrice}>{combo.plat.price.toFixed(2)} €</span>
            </motion.div>

            {/* Vin conseillé */}
            <motion.div
              className={`${styles.slotCard} ${isSpinning ? styles.spinning : ''}`}
              animate={{ scale: isSpinning ? [1, 1.02, 1] : 1 }}
              transition={{ duration: 0.15, delay: 0.08 }}
            >
              <div className={styles.slotLeft}>
                <div className={`${styles.slotIcon} ${styles.vin}`}>
                  <Wine size={18} />
                </div>
                <div className={styles.slotInfo}>
                  <span className={styles.slotCategory}>Accord Vin (Verre)</span>
                  <span className={styles.slotName}>{combo.vin.name}</span>
                  {combo.vin.desc && (
                    <span className={styles.slotDesc}>{combo.vin.desc}</span>
                  )}
                </div>
              </div>
              <span className={styles.slotPrice}>{combo.vin.price.toFixed(2)} €</span>
            </motion.div>

            {/* Dessert */}
            <motion.div
              className={`${styles.slotCard} ${isSpinning ? styles.spinning : ''}`}
              animate={{ scale: isSpinning ? [1, 1.02, 1] : 1 }}
              transition={{ duration: 0.15, delay: 0.12 }}
            >
              <div className={styles.slotLeft}>
                <div className={`${styles.slotIcon} ${styles.dessert}`}>
                  <Cake size={18} />
                </div>
                <div className={styles.slotInfo}>
                  <span className={styles.slotCategory}>Dessert</span>
                  <span className={styles.slotName}>{combo.dessert.name}</span>
                  {combo.dessert.desc && (
                    <span className={styles.slotDesc}>{combo.dessert.desc}</span>
                  )}
                </div>
              </div>
              <span className={styles.slotPrice}>{combo.dessert.price.toFixed(2)} €</span>
            </motion.div>
          </div>

          {/* Total Price Estimate */}
          <div className={styles.totalBar}>
            <span className={styles.totalLabel}>
              <Utensils size={14} color="#D4A373" /> Formule 4 étapes estimée :
            </span>
            <span className={styles.totalAmount}>~ {combo.totalPrice.toFixed(2)} € / pers.</span>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.spinBtn}
              onClick={handleSpin}
              disabled={isSpinning}
            >
              <RotateCw size={17} className={isSpinning ? 'spin' : ''} />
              <span>{isSpinning ? 'Le chef compose...' : 'Faire tourner la roulette !'}</span>
            </button>

            <button
              type="button"
              className={styles.bookBtn}
              onClick={handleBookTable}
            >
              <Utensils size={15} />
              <span>Réserver pour déguster ce menu</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

