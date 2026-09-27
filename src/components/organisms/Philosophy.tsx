import React from 'react';
import Image from 'next/image';
import styles from './Philosophy.module.scss';
import { ChefHat } from 'lucide-react';

export const Philosophy = () => {
  return (
    <section className={styles.section} id="philosophie">
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textContent}>
            <div className={styles.tag}>
              <ChefHat size={18} />
              <span>L'Esprit Bistrot</span>
            </div>
            <h2 className={styles.title}>Votre bistrot à Fabrègues</h2>
            <p className={styles.description}>
              Des fournisseurs locaux pour privilégier le circuit court, des viandes françaises au maximum afin de faire connaitre nos producteurs. Des fromages au lait cru pour plus de goût dans nos assiettes.
            </p>

            <div className={styles.separator}>
              <span>•</span>
              <span>•</span>
              <span>•</span>
            </div>

            <p className={styles.description}>
              Un bistrot est un lieu de rencontre pour se restaurer, boire un café ou un verre, se donner rendez-vous, discuter et partager de bons moments. Depuis des siècles, auberge, taverne, café, bar, brasserie, bistrot, estaminet...
            </p>
          </div>
          
          <div className={styles.imageContent}>
            <Image 
              src="/images/interior_2.jpg" 
              alt="L'intérieur du Bistrot" 
              className={styles.philosophyImage}
              width={500}
              height={625}
              sizes="(max-width: 1024px) 100vw, 500px"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
