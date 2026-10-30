'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import styles from './GallerySection.module.scss';
import { Camera, ArrowRight, Maximize2 } from 'lucide-react';
import type { GalleryItem } from '@/components/molecules/DishStoryModal';
import { triggerHaptic } from '@/utils/haptics';
import { galleryData } from '@/config/data';

const DishStoryModal = dynamic(
  () => import('@/components/molecules/DishStoryModal').then((mod) => mod.DishStoryModal),
  { ssr: false }
);

interface RawGalleryItem {
  image: string;
  alt?: string;
  title?: string;
  desc?: string;
  tag?: string;
}

const GALLERY_ITEMS: GalleryItem[] = (galleryData as RawGalleryItem[]).map((item, idx) => ({
  src: item.image,
  title: item.title || item.alt || `Instant Gourmand ${idx + 1}`,
  desc: item.desc || item.alt || 'Cuisine bistronomique et produits frais de saison.',
  tag: item.tag || 'Le Bistrot',
}));

export const GallerySection = () => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const handleOpenPhoto = useCallback((index: number) => {
    triggerHaptic('selection');
    setSelectedPhotoIndex(index);
  }, []);

  const handleClosePhoto = useCallback(() => {
    setSelectedPhotoIndex(null);
  }, []);

  return (
    <section className={styles.section} id="galerie">
      <div className={styles.header}>
        <div className={styles.tag}>
          <Camera size={18} />
          <span>En Images</span>
        </div>
        <h2 className={styles.title}>Instants Gourmands</h2>
        <p className={styles.description}>
          Un aperçu de nos assiettes et de l'ambiance chaleureuse du Bistrot. Touchez une photo pour l'explorer en plein écran.
        </p>
      </div>

      <div className={styles.slider}>
        <div className={styles.sliderTrack}>
          {GALLERY_ITEMS.map((item, idx) => (
            <button
              key={idx}
              type="button"
              className={styles.slide}
              onClick={() => handleOpenPhoto(idx)}
              aria-label={`Ouvrir ${item.title}`}
            >
              <Image 
                src={item.src} 
                alt={item.title} 
                fill 
                quality={65}
                loading="lazy"
                sizes="(max-width: 768px) 70vw, 360px"
                style={{ objectFit: 'cover' }} 
              />
              <div className={styles.slideOverlay}>
                <span className={styles.slideTag}>{item.tag}</span>
                <div className={styles.slideTitle}>
                  <span>{item.title}</span>
                  <span className={styles.expandBadge}>
                    <Maximize2 size={13} />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
        
        <div className={styles.scrollHint}>
          <span>Faites glisser pour voir plus</span>
          <ArrowRight size={14} />
        </div>
      </div>

      {selectedPhotoIndex !== null && (
        <DishStoryModal
          isOpen={true}
          initialIndex={selectedPhotoIndex}
          items={GALLERY_ITEMS}
          onClose={handleClosePhoto}
        />
      )}
    </section>
  );
};
