'use client';

import React, { useState, useCallback } from 'react';
import styles from './NoelDecorations.module.scss';
import { triggerHaptic } from '@/utils/haptics';

const SNOWFLAKES = [
  { id: 1, left: '3%', delay: '0s', duration: '14s', size: '14px', symbol: '❄', drift: 'driftRight' },
  { id: 2, left: '9%', delay: '3s', duration: '18s', size: '11px', symbol: '❅', drift: 'driftLeft' },
  { id: 3, left: '16%', delay: '7s', duration: '16s', size: '15px', symbol: '❆', drift: 'driftRight' },
  { id: 4, left: '23%', delay: '1.5s', duration: '19s', size: '10px', symbol: '•', drift: 'driftLeft' },
  { id: 5, left: '31%', delay: '5s', duration: '15s', size: '13px', symbol: '❄', drift: 'driftRight' },
  { id: 6, left: '39%', delay: '9s', duration: '20s', size: '12px', symbol: '❅', drift: 'driftLeft' },
  { id: 7, left: '47%', delay: '2s', duration: '17s', size: '16px', symbol: '❄', drift: 'driftRight' },
  { id: 8, left: '55%', delay: '6.5s', duration: '15s', size: '11px', symbol: '•', drift: 'driftLeft' },
  { id: 9, left: '63%', delay: '4s', duration: '18s', size: '14px', symbol: '❆', drift: 'driftRight' },
  { id: 10, left: '72%', delay: '8s', duration: '16s', size: '12px', symbol: '❄', drift: 'driftLeft' },
  { id: 11, left: '81%', delay: '1s', duration: '19s', size: '15px', symbol: '❅', drift: 'driftRight' },
  { id: 12, left: '89%', delay: '5.5s', duration: '14s', size: '11px', symbol: '❄', drift: 'driftLeft' },
  { id: 13, left: '96%', delay: '2.8s', duration: '17s', size: '13px', symbol: '❆', drift: 'driftRight' },
];

const STARDUST = [
  { id: 1, left: '10%', delay: '0.5s', duration: '8s' },
  { id: 2, left: '24%', delay: '2.2s', duration: '10s' },
  { id: 3, left: '41%', delay: '1.1s', duration: '9s' },
  { id: 4, left: '58%', delay: '3.5s', duration: '8.5s' },
  { id: 5, left: '74%', delay: '0.8s', duration: '9.5s' },
  { id: 6, left: '88%', delay: '2.9s', duration: '7.8s' },
];

const GARLAND_BULBS = Array.from({ length: 20 }, (_, i) => {
  const colors = ['bulbGold', 'bulbRed', 'bulbGreen', 'bulbWarm'] as const;
  return { id: i, colorClass: colors[i % colors.length] };
});

const HollyBoughSvg: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 220 220" fill="none">
    {/* Pine needles & branches */}
    <path
      d="M0 0 C55 12, 115 28, 175 65 M0 0 C28 55, 65 115, 95 170 M0 0 C45 45, 95 95, 140 135"
      stroke="#1e4631"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    {/* Pine needle clusters */}
    <path
      d="M25 8 L45 2 M25 8 L38 22 M55 16 L80 6 M55 16 L68 34 M90 28 L118 16 M90 28 L104 48 M128 44 L156 32 M128 44 L140 64"
      stroke="#2d6a4f"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <path
      d="M12 32 L4 56 M12 32 L28 46 M26 68 L14 94 M26 68 L44 82 M45 104 L32 132 M45 104 L64 118"
      stroke="#2d6a4f"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <path
      d="M35 35 L58 30 M35 35 L42 58 M68 68 L94 62 M68 68 L74 92 M100 100 L125 94 M100 100 L105 124"
      stroke="#40916c"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    {/* Golden festive ribbon */}
    <path
      d="M8 8 Q48 18 52 52 Q22 48 8 8 Z"
      fill="rgba(232, 193, 112, 0.22)"
      stroke="#f5c542"
      strokeWidth="1.5"
    />
    <path
      d="M42 42 C62 68, 88 72, 112 62 M42 42 C68 62, 72 88, 62 112"
      stroke="#f5c542"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    {/* Red Holly Berries */}
    <circle cx="38" cy="38" r="6" fill="#dc2626" stroke="#fca5a5" strokeWidth="0.8" />
    <circle cx="49" cy="34" r="5" fill="#b91c1c" stroke="#fca5a5" strokeWidth="0.8" />
    <circle cx="34" cy="49" r="5" fill="#ef4444" stroke="#fca5a5" strokeWidth="0.8" />
    <circle cx="85" cy="28" r="4.5" fill="#dc2626" />
    <circle cx="93" cy="33" r="4" fill="#ef4444" />
    <circle cx="28" cy="85" r="4.5" fill="#dc2626" />
    <circle cx="34" cy="93" r="4" fill="#b91c1c" />
    {/* Sparkling Gold Stars on Bough */}
    <circle cx="66" cy="22" r="2.2" fill="#ffe066" />
    <circle cx="116" cy="48" r="2.5" fill="#ffe066" />
    <circle cx="52" cy="88" r="2.2" fill="#ffe066" />
    <circle cx="88" cy="86" r="2" fill="#ffe066" />
  </svg>
);

export const NoelDecorations: React.FC = () => {
  const [festiveMessage, setFestiveMessage] = useState<string | null>(null);

  const handleFestiveClick = useCallback(() => {
    triggerHaptic('success');
    const wishes = [
      '🎄 Joyeuses Fêtes au Bistrot de l’Église !',
      '🥂 Partagez un moment chaleureux autour de notre carte d’hiver !',
      '✨ Ambiance féerique et cuisine maison au cœur de Fabrègues !',
      '🍷 Découvrez nos accords mets & vins d’Occitanie pour les fêtes !',
      '🎁 Réservez votre table des Fêtes en famille ou entre amis !',
    ];
    const random = wishes[Math.floor(Math.random() * wishes.length)];
    setFestiveMessage(random);
  }, []);

  return (
    <>
      <div className={styles.noelCanvas} aria-hidden="true">
        {/* Warm Starlight Glow */}
        <div className={styles.starlightGlow} />

        {/* Corner Pine & Holly Boughs */}
        <HollyBoughSvg className={styles.hollyLeft} />
        <HollyBoughSvg className={styles.hollyRight} />

        {/* Top Twinkling Fairy-Light Garland */}
        <div className={styles.garlandBar}>
          {GARLAND_BULBS.map((bulb) => (
            <span
              key={bulb.id}
              className={`${styles.garlandBulb} ${styles[bulb.colorClass]}`}
            />
          ))}
        </div>

        {/* Left Swaying Christmas Ornaments */}
        <div className={styles.hangingOrnamentLeft}>
          <div className={styles.ornamentThread} />
          <div className={styles.baubleRed}>
            <span className={styles.baubleShine} />
          </div>
        </div>

        <div className={styles.hangingOrnamentLeftSecondary}>
          <div className={styles.ornamentThreadShort} />
          <span className={styles.ornamentStar}>🌟</span>
        </div>

        {/* Right Swaying Christmas Ornaments */}
        <div className={styles.hangingOrnamentRight}>
          <div className={styles.ornamentThreadMedium} />
          <div className={styles.baubleGold}>
            <span className={styles.baubleShine} />
          </div>
        </div>

        {/* Gently Falling Snowflakes */}
        {SNOWFLAKES.map((flake) => (
          <span
            key={flake.id}
            className={`${styles.snowflake} ${styles[flake.drift]}`}
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

        {/* Rising Golden Stardust Sparks */}
        {STARDUST.map((spark) => (
          <span
            key={spark.id}
            className={styles.stardust}
            style={{
              left: spark.left,
              animationDelay: spark.delay,
              animationDuration: spark.duration,
            }}
          />
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
