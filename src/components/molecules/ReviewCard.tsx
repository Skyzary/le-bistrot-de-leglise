import React from 'react';
import styles from './ReviewCard.module.scss';
import { Star } from 'lucide-react';

export interface ReviewCardProps {
  name: string;
  date: string;
  content: string;
  initials: string;
}

export const ReviewCard = ({ name, date, content, initials }: ReviewCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatar}>{initials}</div>
        <div className={styles.meta}>
          <div className={styles.name}>{name}</div>
          <div className={styles.date}>{date}</div>
        </div>
      </div>
      <div className={styles.stars}>
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} fill="currentColor" />
        ))}
      </div>
      <p className={styles.content}>"{content}"</p>
    </div>
  );
};
