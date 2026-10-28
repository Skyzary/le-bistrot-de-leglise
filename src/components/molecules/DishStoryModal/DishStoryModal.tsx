'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Utensils, Share2, Check } from 'lucide-react';
import styles from './DishStoryModal.module.scss';
import { triggerHaptic } from '@/utils/haptics';

export interface GalleryItem {
  src: string;
  title: string;
  desc: string;
  tag: string;
}

interface DishStoryModalProps {
  isOpen: boolean;
  initialIndex: number;
  items: GalleryItem[];
  onClose: () => void;
}

export const DishStoryModal: React.FC<DishStoryModalProps> = ({
  isOpen,
  initialIndex,
  items,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < items.length - 1) {
      triggerHaptic('light');
      setCurrentIndex((prev) => prev + 1);
    } else {
      triggerHaptic('medium');
      onClose();
    }
  }, [currentIndex, items.length, onClose]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      triggerHaptic('light');
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!isOpen) return;

    triggerHaptic('selection');

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen || items.length === 0) return null;

  const currentItem = items[currentIndex];

  const handleShare = async () => {
    triggerHaptic('medium');
    const shareData = {
      title: `${currentItem.title} - Le Bistrot de l'Église`,
      text: `${currentItem.title}: ${currentItem.desc}`,
      url: window.location.href,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Share cancelled or unsupported
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Fallback
      }
    }
  };

  const handleBookTable = () => {
    triggerHaptic('success');
    onClose();
    setTimeout(() => {
      const el = document.getElementById('reservation');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={styles.storyContainer}
          data-lenis-prevent
          initial={{ scale: 0.94, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 40 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.25}
          onDragEnd={(_, info) => {
            if (Math.abs(info.offset.y) > 90 || Math.abs(info.velocity.y) > 300) {
              triggerHaptic('selection');
              onClose();
            }
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Progress Indicators */}
          <div className={styles.progressBars}>
            {items.map((_, idx) => (
              <div
                key={idx}
                className={`${styles.progressBarTrack} ${
                  idx === currentIndex
                    ? styles.active
                    : idx < currentIndex
                    ? styles.completed
                    : ''
                }`}
              />
            ))}
          </div>

          {/* Header */}
          <div className={styles.storyHeader}>
            <div className={styles.authorInfo}>
              <div className={styles.authorAvatar}>
                <Image
                  src="/images/gallery/photo_1.jpg"
                  alt="Avatar"
                  fill
                  sizes="32px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className={styles.authorMeta}>
                <span className={styles.authorName}>Le Bistrot de l&apos;Église</span>
                <span className={styles.authorSubtitle}>
                  {currentIndex + 1} sur {items.length} • Fabrègues
                </span>
              </div>
            </div>

            <div className={styles.headerActions}>
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => {
                  triggerHaptic('light');
                  onClose();
                }}
                aria-label="Fermer la vue"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Active Photo with Animation */}
          <div className={styles.imageWrapper}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0.4, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.4, scale: 0.98 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                style={{ position: 'absolute', inset: 0 }}
              >
                <Image
                  src={currentItem.src}
                  alt={currentItem.title}
                  fill
                  priority
                  className={styles.image}
                  sizes="(max-width: 768px) 100vw, 480px"
                />
              </motion.div>
            </AnimatePresence>
            <div className={styles.gradientOverlay} />
          </div>

          {/* Touch Zones (Mobile Tap Left/Right to advance) */}
          <div className={styles.tapZones}>
            <div
              className={styles.tapPrev}
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Photo précédente"
            />
            <div
              className={styles.tapNext}
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Photo suivante"
            />
          </div>

          {/* Desktop Arrow Controls */}
          {currentIndex > 0 && (
            <button
              type="button"
              className={`${styles.navArrow} ${styles.prev}`}
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Précédent"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {currentIndex < items.length - 1 && (
            <button
              type="button"
              className={`${styles.navArrow} ${styles.next}`}
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Suivant"
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Story Bottom Sheet / Caption Card */}
          <motion.div
            key={`caption-${currentIndex}`}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className={styles.storyFooter}
          >
            <span className={styles.tagBadge}>{currentItem.tag}</span>
            <h3 className={styles.captionTitle}>{currentItem.title}</h3>
            <p className={styles.captionDesc}>{currentItem.desc}</p>

            <div className={styles.footerActions}>
              <button
                type="button"
                className={styles.bookButton}
                onClick={handleBookTable}
              >
                <Utensils size={16} />
                <span>Réserver pour goûter</span>
              </button>
              <button
                type="button"
                className={styles.shareButton}
                onClick={handleShare}
                aria-label="Partager ce plat"
              >
                {copied ? <Check size={18} color="#D4A373" /> : <Share2 size={18} />}
              </button>
            </div>

            <span className={styles.swipeDismissHint}>
              Glissez vers le bas pour fermer
            </span>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

