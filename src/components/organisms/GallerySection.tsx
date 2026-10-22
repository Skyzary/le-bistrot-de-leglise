import React from 'react';
import Image from 'next/image';
import styles from './GallerySection.module.scss';
import { Camera, ArrowRight } from 'lucide-react';
import { galleryData } from '@/config/data';

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
          {galleryData.map((item, idx) => (
            <div key={idx} className={styles.slide}>
              <Image 
                src={item.image} 
                alt={item.alt || `Galerie photo ${idx + 1}`} 
                fill 
                sizes="(max-width: 768px) 80vw, 400px"
                style={{ objectFit: 'cover' }} 
              />
            </div>
          ))}
        </div>
        
        <div className={styles.scrollHint}>
          <span>Faites glisser pour voir plus</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </section>
  );
};
