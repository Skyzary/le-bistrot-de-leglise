import React from 'react';
import Image from 'next/image';
import styles from './Philosophy.module.scss';
import { ChefHat } from 'lucide-react';
import { themeData } from '@/config/data';

export const Philosophy = () => {
  const isNoel = themeData.mode === 'noel';
  const isHalloween = themeData.mode === 'halloween';

  return (
    <section className={styles.section} id="philosophie">
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textContent}>
            <div className={styles.tag}>
              <ChefHat size={18} />
              <span>
                {isNoel
                  ? "🎄 L'Esprit des Fêtes au Bistrot"
                  : isHalloween
                    ? "🎃 L'Esprit Bistrot"
                    : "L'Esprit Bistrot"}
              </span>
            </div>
            <h2 className={styles.title}>
              {isNoel
                ? 'Votre table chaleureuse pour les Fêtes à Fabrègues'
                : 'Votre bistrot à Fabrègues'}
            </h2>
            <p className={styles.description}>
              Des fournisseurs locaux pour privilégier le circuit court, des viandes françaises au maximum afin de faire connaitre nos producteurs. Des fromages au lait cru pour plus de goût dans nos assiettes.
            </p>

            <div className={styles.separator}>
              <span>{isNoel ? '❄' : '•'}</span>
              <span>{isNoel ? '✨' : '•'}</span>
              <span>{isNoel ? '❄' : '•'}</span>
            </div>

            <p className={styles.description}>
              {isNoel
                ? "En cette période de fêtes, notre bistrot vous accueille dans un décor féerique et chaleureux pour se restaurer, boire un verre, se retrouver en famille ou entre amis et partager de précieux moments."
                : "Un bistrot est un lieu de rencontre pour se restaurer, boire un café ou un verre, se donner rendez-vous, discuter et partager de bons moments. Depuis des siècles, auberge, taverne, café, bar, brasserie, bistrot, estaminet..."}
            </p>
          </div>
          
          <div className={styles.imageContent}>
            <Image 
              src="/images/interior_2.jpg" 
              alt="L'intérieur du Bistrot" 
              className={styles.philosophyImage}
              width={500}
              height={625}
              quality={65}
              loading="lazy"
              sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 500px"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
