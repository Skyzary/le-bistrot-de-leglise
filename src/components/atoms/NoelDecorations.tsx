'use client';

import React, { useState, useCallback } from 'react';
import styles from './NoelDecorations.module.scss';
import { triggerHaptic } from '@/utils/haptics';

const SNOWFLAKES = [
  { id: 1, left: '5%', delay: '0s', duration: '14s', size: '14px', symbol: '❄' },
  { id: 2, left: '12%', delay: '3s', duration: '18s', size: '11px', symbol: '❅' },
  { id: 3, left: '20%', delay: '7s', duration: '16s', size: '15px', symbol: '❆' },
  { id: 4, left: '28%', delay: '1.5s', duration: '19s', size: '10px', symbol: '•' },
  { id: 5, left: '36%', delay: '5s', duration: '15s', size: '13px', symbol: '❄' },
  { id: 6, left: '45%', delay: '9s', duration: '20s', size: '12px', symbol: '❅' },
  { id: 7, left: '53%', delay: '2s', duration: '17s', size: '16px', symbol: '❄' },
  { id: 8, left: '62%', delay: '6.5s', duration: '15s', size: '11px', symbol: '•' },
  { id: 9, left: '71%', delay: '4s', duration: '18s', size: '14px', symbol: '❆' },
  { id: 10, left: '80%', delay: '8s', duration: '16s', size: '12px', symbol: '❄' },
  { id: 11, left: '88%', delay: '1s', duration: '19s', size: '15px', symbol: '❅' },
  { id: 12, left: '95%', delay: '5.5s', duration: '14s', size: '11px', symbol: '❄' },
];

const GARLAND_BULBS = Array.from({ length: 18 }, (_, i) => {
  const colors = ['bulbGold', 'bulbRed', 'bulbGreen'] as const;
  return { id: i, colorClass: colors[i % colors.length] };
});

export const NoelDecorations: React.FC = () => {
  const [festiveMessage, setFestiveMessage] = useState<string | null>(null);

  const handleFestiveClick = useCallback(() => {
    triggerHaptic('success');
    const wishes = [
      '🎄 Joyeuses Fêtes au Bistrot de l’Église !',
      '🥂 Partagez un moment chaleureux autour de notre carte d’hiver !',
      '✨ Ambiance féerique et cuisine maison au cœur de Fabrègues !',
      '🍷 Découvrez nos accords mets & vins d’Occitanie pour les fêtes !',
    ];
    const random = wishes[Math.floor(Math.random() * wishes.length)];
    setFestiveMessage(random);
  }, []);

  return (
    <>
      <div className={styles.noelCanvas} aria-hidden="true">
        {/* Warm Starlight Glow */}
        <div className={styles.starlightGlow} />

        {/* Top Twinkling Fairy-Light Garland */}
        <div className={styles.garlandBar}>
          {GARLAND_BULBS.map((bulb) => (
            <span
              key={bulb.id}
              className={`${styles.garlandBulb} ${styles[bulb.colorClass]}`}
            />
          ))}
        </div>

        {/* Swaying Christmas Ornament */}
        <div className={styles.hangingOrnament}>
          <div className={styles.ornamentThread} />
          <span className={styles.ornamentBall}>🌟</span>
        </div>

        {/* Gently Falling Snowflakes */}
        {SNOWFLAKES.map((flake) => (
          <span
            key={flake.id}
            className={styles.snowflake}
            style={{
              left: flake.left,
              animationDelay: flake.delay,
              animationDuration: flake.duration,
              fontSize: flake.size,
            }}
          >
            {flake.symbol}
          </span>
        ))}

        {/* Cozy Winter Bottom Glow */}
        <div className={styles.winterMist} />
      </div>

      {/* Interactive Floating Christmas Button */}
      <div className={styles.noelWidget}>
        {festiveMessage && (
          <div className={styles.noelToast} onClick={() => setFestiveMessage(null)}>
            <span>{festiveMessage}</span>
          </div>
        )}
        <button
          type="button"
          className={styles.noelBtn}
          onClick={handleFestiveClick}
          aria-label="Surprise de Noël"
          title="Cliquez pour un vœu des Fêtes !"
        >
          <span className={styles.noelEmoji}>🎄</span>
        </button>
      </div>
    </>
  );
};

