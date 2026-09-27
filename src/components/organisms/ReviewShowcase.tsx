import React from 'react';
import styles from './ReviewShowcase.module.scss';
import { ReviewCard } from '@/components/molecules/ReviewCard';
import { Star, ArrowRight } from 'lucide-react';

export const ReviewShowcase = () => {
  const reviews = [
    {
      id: '1',
      name: 'Nico de Ribas',
      date: 'Publié sur Google',
      content: 'Sur la route de la feria de Béziers nous cherchions un resto facile pour se garer... Nous avons découvert une pépite ! Des employés décontractés avec une banane d\'enfer mais surtout un menu au-dessus de toute espérance. On s\'est régalé !',
      initials: 'N',
    },
    {
      id: '2',
      name: 'Marie Jose Pouget',
      date: 'Publié sur Google',
      content: 'Super adresse ! Les plats sont copieux et excellents avec des produits de qualité. Ambiance chaleureuse et service aux petits soins. Nous sommes sortis repus, je vous le recommande chaleureusement !',
      initials: 'M',
    },
    {
      id: '3',
      name: 'Sonia Leguillerm',
      date: 'Publié sur Google',
      content: 'Franchement c\'était délicieux, les serveurs étaient très agréables. Le service fut rapide et la nourriture excellente. Je conseille fortement cette adresse aux prix très abordables !',
      initials: 'S',
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <div className={styles.badge}>
            <span className={styles.google}>G</span>
          </div>
          <div className={styles.ratingInfo}>
            <div className={styles.ratingTitle}>
              EXCELLENT
              <div className={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
            </div>
            <div className={styles.ratingSubtitle}>
              Basé sur <strong>841 avis vérifiés</strong> sur Google
            </div>
          </div>
        </div>
        
        <div className={styles.carousel}>
          {reviews.map((review) => (
            <ReviewCard key={review.id} {...review} />
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
