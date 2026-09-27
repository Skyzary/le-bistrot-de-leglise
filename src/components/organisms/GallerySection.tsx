import React from 'react';
import Image from 'next/image';
import styles from './GallerySection.module.scss';
import { Camera } from 'lucide-react';

const PHOTOS = [
  '/images/gallery/photo_1.jpg',
  '/images/gallery/photo_2.jpg',
  '/images/gallery/photo_3.jpg',
  '/images/gallery/photo_4.jpg',
  '/images/gallery/photo_6.jpg',
  '/images/gallery/photo_7.jpg',
  '/images/gallery/photo_8.jpg',
];

export const GallerySection = () => {
  return (
    <section className={styles.section} id="galerie">
      <div className={styles.header}>
        <div className={styles.tag}>
          <Camera size={18} />
          <span>En Images</span>
        </div>
        <h2 className={styles.title}>Instants Gourmands</h2>
        <p className={styles.description}>
          Un aperçu de nos assiettes et de l'ambiance chaleureuse du Bistrot.
        </p>
      </div>

      <div className={styles.slider}>
        <div className={styles.sliderTrack}>
          {PHOTOS.map((src, idx) => (
            <div key={idx} className={styles.slide}>
              <Image 
                src={src} 
                alt={`Galerie photo ${idx + 1}`} 
                fill 
                sizes="(max-width: 768px) 80vw, 400px"
                style={{ objectFit: 'cover' }} 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
