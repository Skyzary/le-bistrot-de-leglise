'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './GallerySection.module.scss';
import { Camera, ArrowRight, Maximize2 } from 'lucide-react';
import { DishStoryModal, GalleryItem } from '@/components/molecules/DishStoryModal';
import { triggerHaptic } from '@/utils/haptics';

const GALLERY_ITEMS: GalleryItem[] = [
  {
    src: '/images/gallery/photo_1.jpg',
    title: 'Cuisine du Marché & Fraîcheur',
    desc: 'Créations de saison élaborées chaque matin avec les producteurs locaux.',
    tag: 'Fait Maison',
  },
  {
    src: '/images/gallery/photo_2.jpg',
    title: 'Viandes Sélectionnées & Braisées',
    desc: 'Cuissons lentes et viandes de caractère marinées aux herbes de la garrigue.',
    tag: 'Spécialité',
  },
  {
    src: '/images/gallery/photo_3.jpg',
    title: 'Ambiance Bistrot & Chaleur',
    desc: 'Un cadre convivial entre pierres d\'époque et lumières tamisées.',
    tag: 'Le Lieu',
  },
  {
    src: '/images/gallery/photo_4.jpg',
    title: 'Planches Terroir & Partage',
    desc: 'Charcuteries aveyronnaises et fromages affinés à déguster autour d\'un verre.',
    tag: 'À Partager',
  },
  {
    src: '/images/gallery/photo_6.jpg',
    title: 'L\'Esprit du Village',
    desc: 'Le rendez-vous chaleureux au cœur de la place de l\'Église de Fabrègues.',
    tag: 'Fabrègues',
  },
  {
    src: '/images/gallery/photo_7.jpg',
    title: 'Desserts & Gourmandises',
    desc: 'Douceurs artisanales revisitées par notre chef pâtissier.',
    tag: 'Gourmandise',
  },
  {
    src: '/images/gallery/photo_8.jpg',
    title: 'Sélection de Vins d\'Occitanie',
    desc: 'Accords mets et vins soigneusement choisis auprès de vignerons passionnés.',
    tag: 'La Cave',
  },
];

export const GallerySection = () => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const handleOpenPhoto = (index: number) => {
    triggerHaptic('selection');
    setSelectedPhotoIndex(index);
  };

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
                sizes="(max-width: 768px) 80vw, 400px"
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

      <DishStoryModal
        isOpen={selectedPhotoIndex !== null}
        initialIndex={selectedPhotoIndex ?? 0}
        items={GALLERY_ITEMS}
        onClose={() => setSelectedPhotoIndex(null)}
      />
    </section>
  );
};
