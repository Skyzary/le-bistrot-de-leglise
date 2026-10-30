'use client';

import React, { useState, useCallback } from 'react';
import styles from './HalloweenDecorations.module.scss';
import { triggerHaptic } from '@/utils/haptics';

const BATS = [
  { id: 1, top: '12%', delay: '0s', duration: '16s', scale: 0.85 },
  { id: 2, top: '26%', delay: '4s', duration: '20s', scale: 0.65 },
  { id: 3, top: '48%', delay: '8s', duration: '18s', scale: 0.75 },
  { id: 4, top: '68%', delay: '2s', duration: '22s', scale: 0.6 },
  { id: 5, top: '82%', delay: '11s', duration: '19s', scale: 0.8 },
];

const EMBERS = [
  { id: 1, left: '8%', delay: '0s', duration: '7s' },
  { id: 2, left: '18%', delay: '1.5s', duration: '9s' },
  { id: 3, left: '32%', delay: '3s', duration: '8s' },
  { id: 4, left: '48%', delay: '0.8s', duration: '10s' },
  { id: 5, left: '64%', delay: '2.2s', duration: '7.5s' },
  { id: 6, left: '78%', delay: '4s', duration: '8.5s' },
  { id: 7, left: '91%', delay: '1.2s', duration: '9.5s' },
];

const CRAWLING_SPIDERS = [
  { id: 1, variant: 'crawlDiagonalRight', delay: '0s', duration: '24s', size: 26 },
  { id: 2, variant: 'crawlDiagonalLeft', delay: '6s', duration: '28s', size: 22 },
  { id: 3, variant: 'crawlUpRightEdge', delay: '3s', duration: '21s', size: 24 },
  { id: 4, variant: 'crawlDownLeftEdge', delay: '11s', duration: '26s', size: 20 },
  { id: 5, variant: 'crawlAcrossMiddle', delay: '8s', duration: '22s', size: 25 },
];

const SpiderSvg: React.FC<{ size: number }> = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 36 36"
    fill="none"
    className={styles.spiderSvg}
  >
    {/* Left 4 legs */}
    <g className={styles.legsGroupA}>
      <path d="M16 15 C11 10, 6 9, 2 5" stroke="#120916" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15 17 C9 15, 5 16, 1 14" stroke="#120916" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15 19 C9 21, 5 23, 2 26" stroke="#120916" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 21 C11 25, 8 29, 5 33" stroke="#120916" strokeWidth="1.8" strokeLinecap="round" />
    </g>
    {/* Right 4 legs */}
    <g className={styles.legsGroupB}>
      <path d="M20 15 C25 10, 30 9, 34 5" stroke="#120916" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M21 17 C27 15, 31 16, 35 14" stroke="#120916" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M21 19 C27 21, 31 23, 34 26" stroke="#120916" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M20 21 C25 25, 28 29, 31 33" stroke="#120916" strokeWidth="1.8" strokeLinecap="round" />
    </g>
    {/* Abdomen & Head */}
    <ellipse cx="18" cy="21" rx="5.2" ry="6.5" fill="#140a19" stroke="#ff6b1a" strokeWidth="1" />
    <circle cx="18" cy="13.5" r="3.4" fill="#140a19" stroke="#ff6b1a" strokeWidth="0.9" />
    {/* Glowing Red Eyes */}
    <circle cx="16.8" cy="12.2" r="0.9" fill="#ff3b00" />
    <circle cx="19.2" cy="12.2" r="0.9" fill="#ff3b00" />
    {/* Hourglass mark on back */}
    <path d="M16.8 19 L19.2 19 L18 21 L19.2 23 L16.8 23 L18 21 Z" fill="#dc2626" />
  </svg>
);

export const HalloweenDecorations: React.FC = () => {
  const [treatMessage, setTreatMessage] = useState<string | null>(null);

  const handleTrickOrTreat = useCallback(() => {
    triggerHaptic('success');
    const treats = [
      '😈 Un Shooter du Diablotin vous attend ce samedi soir !',
      '🍬 Des bonbons à volonté pour les petits monstres déguisés !',
      '🎃 Venez déguisés ce samedi soir au Bistrot de l’Église !',
      '🧛‍♂️ Le Comte du Bistrot vous attend dès 19h30 !',
    ];
    const random = treats[Math.floor(Math.random() * treats.length)];
    setTreatMessage(random);
  }, []);

  return (
    <>
      <div className={styles.halloweenCanvas} aria-hidden="true">
        {/* Eerie Blood Moon Glow */}
        <div className={styles.bloodMoon} />

        {/* Corner Spiderwebs */}
        <svg className={styles.cobwebLeft} viewBox="0 0 200 200" fill="none">
          <path
            d="M0 0 L200 0 M0 0 L185 76 M0 0 L141 141 M0 0 L76 185 M0 0 L0 200"
            stroke="rgba(255, 130, 40, 0.28)"
            strokeWidth="1.2"
          />
          <path
            d="M40 0 Q38 22 28 28 Q22 38 0 40 M80 0 Q74 44 56 56 Q44 74 0 80 M125 0 Q114 68 88 88 Q68 114 0 125 M175 0 Q158 96 124 124 Q96 158 0 175"
            stroke="rgba(255, 255, 255, 0.18)"
            strokeWidth="1"
            fill="none"
          />
        </svg>

        <svg className={styles.cobwebRight} viewBox="0 0 200 200" fill="none">
          <path
            d="M0 0 L200 0 M0 0 L185 76 M0 0 L141 141 M0 0 L76 185 M0 0 L0 200"
            stroke="rgba(255, 130, 40, 0.28)"
            strokeWidth="1.2"
          />
          <path
            d="M40 0 Q38 22 28 28 Q22 38 0 40 M80 0 Q74 44 56 56 Q44 74 0 80 M125 0 Q114 68 88 88 Q68 114 0 125 M175 0 Q158 96 124 124 Q96 158 0 175"
            stroke="rgba(255, 255, 255, 0.18)"
            strokeWidth="1"
            fill="none"
          />
        </svg>

        {/* Hanging Animated Spider on Silk Thread */}
        <div className={styles.hangingSpider}>
          <div className={styles.spiderThread} />
          <span className={styles.spiderBody}>🕷️</span>
        </div>

        {/* Crawling Spiders Across the Screen */}
        {CRAWLING_SPIDERS.map((spider) => (
          <div
            key={spider.id}
            className={`${styles.crawlingSpider} ${styles[spider.variant]}`}
            style={{
              animationDelay: spider.delay,
              animationDuration: spider.duration,
            }}
          >
            <SpiderSvg size={spider.size} />
          </div>
        ))}

        {/* Flying Bats Across Screen */}
        {BATS.map((bat) => (
          <div
            key={bat.id}
            className={styles.flyingBat}
            style={{
              top: bat.top,
              animationDelay: bat.delay,
              animationDuration: bat.duration,
              transform: `scale(${bat.scale})`,
            }}
          >
            <svg width="38" height="20" viewBox="0 0 38 20" fill="none">
              <path
                d="M19 6C17 6 16 3 15 1C15 1 14 5 12 6C8 4 2 2 0 7C3 7 6 9 7 12C10 10 13 11 15 14C16 12 17.5 11 19 11C20.5 11 22 12 23 14C25 11 28 10 31 12C32 9 35 7 38 7C36 2 30 4 26 6C24 5 23 1 23 1C22 3 21 6 19 6Z"
                fill="rgba(255, 107, 26, 0.55)"
              />
            </svg>
          </div>
        ))}

        {/* Rising Pumpkin Embers */}
        {EMBERS.map((ember) => (
          <span
            key={ember.id}
            className={styles.ember}
            style={{
              left: ember.left,
              animationDelay: ember.delay,
              animationDuration: ember.duration,
            }}
          />
        ))}

        {/* Haunted Bottom Mist */}
        <div className={styles.hauntedMist} />
      </div>

      {/* Interactive Trick-or-Treat Pumpkin Floating Button */}
      <div className={styles.pumpkinWidget}>
        {treatMessage && (
          <div className={styles.treatToast} onClick={() => setTreatMessage(null)}>
            <span>{treatMessage}</span>
          </div>
        )}
        <button
          type="button"
          className={styles.pumpkinBtn}
          onClick={handleTrickOrTreat}
          aria-label="Surprise d'Halloween"
          title="Cliquez pour un sortilège d'Halloween !"
        >
          <span className={styles.pumpkinEmoji}>🎃</span>
        </button>
      </div>
    </>
  );
};

