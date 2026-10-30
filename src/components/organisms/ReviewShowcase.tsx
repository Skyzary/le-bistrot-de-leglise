import React from 'react';
import styles from './ReviewShowcase.module.scss';
import { ReviewCard } from '@/components/molecules/ReviewCard';
import { Star, ArrowRight } from 'lucide-react';
import { reviewsData } from '@/config/data';

const REVIEWS = reviewsData.items.map((item, index) => ({
  id: item.id || String(index + 1),
  name: item.name,
  date: item.date,
  content: item.content,
  initials: item.initials || item.name.charAt(0).toUpperCase(),
}));

export const ReviewShowcase = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <div className={styles.badge}>
            <span className={styles.google}>G</span>
          </div>
          <div className={styles.ratingInfo}>
            <div className={styles.ratingTitle}>
              {reviewsData.rating || 'EXCELLENT'}
              <div className={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
            </div>
            <div className={styles.ratingSubtitle}>
              Basé sur <strong>{reviewsData.reviewCountText || '841 avis vérifiés'}</strong> sur Google
            </div>
          </div>
        </div>
        
        <div className={styles.carousel}>
          {REVIEWS.map((review) => (
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
