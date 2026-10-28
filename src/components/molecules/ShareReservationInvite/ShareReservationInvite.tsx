'use client';

import React, { useState } from 'react';
import styles from './ShareReservationInvite.module.scss';
import { Users, Share2, Copy, Check, MapPin, Calendar, Clock, Car } from 'lucide-react';
import { triggerHaptic } from '@/utils/haptics';

interface ShareReservationInviteProps {
  date: string;
  time: string;
  guests: number;
  name?: string;
  location?: 'inside' | 'terrace' | string;
}

export const ShareReservationInvite: React.FC<ShareReservationInviteProps> = ({
  date,
  time,
  guests,
  name,
  location,
}) => {
  const [copied, setCopied] = useState(false);

  const locLabel = location === 'terrace' ? 'En terrasse' : 'En salle';

  const formatFrenchDate = (isoStr: string) => {
    try {
      const [y, m, d] = isoStr.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      return dateObj.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
    } catch {
      return isoStr;
    }
  };

  const formattedDate = formatFrenchDate(date);

  const inviteMessage = `🍷 Table réservée au Bistrot de l'Église !

📅 Quand : ${formattedDate} à ${time}
👥 Nombre de convives : ${guests} personne${guests > 1 ? 's' : ''} (${locLabel})${name ? `\n👤 Réservation au nom de : ${name}` : ''}
📍 Lieu : 4 place du 11 novembre 1918, 34690 Fabrègues
🅿️ Parking gratuit : Place de l'Église & Mairie (à 50m)

🗺️ Itinéraire GPS : https://maps.apple.com/?q=Le+Bistrot+de+l%27%C3%89glise+Fabr%C3%A8gues
📖 La Carte : https://lebistrotdeleglise.fr/menu

Hâte de partager ce moment avec vous ! ✨`;

  const handleShare = async () => {
    triggerHaptic('medium');

    const shareData = {
      title: "Invitation - Le Bistrot de l'Église",
      text: inviteMessage,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        triggerHaptic('success');
      } catch {
        // User cancelled share
      }
    } else {
      // Fallback: Open WhatsApp direct link
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(inviteMessage)}`;
      window.open(whatsappUrl, '_blank');
      triggerHaptic('success');
    }
  };

  const handleCopy = async () => {
    triggerHaptic('selection');
    try {
      await navigator.clipboard.writeText(inviteMessage);
      setCopied(true);
      triggerHaptic('success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className={styles.inviteCard}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <Users size={16} />
          <span>Inviter vos convives</span>
        </div>
        <span className={styles.badge}>Table de {guests} pers.</span>
      </div>

      <div className={styles.previewBox}>
        <div className={styles.previewItem}>
          <Calendar size={13} />
          <span>{formattedDate} à <strong>{time}</strong> ({locLabel})</span>
        </div>
        <div className={styles.previewItem}>
          <MapPin size={13} />
          <span>Place de l&apos;Église, Fabrègues</span>
        </div>
        <div className={styles.previewItem}>
          <Car size={13} />
          <span>Parking gratuit à 50m inclus dans le message</span>
        </div>
      </div>

      <div className={styles.buttonRow}>
        <button
          type="button"
          onClick={handleShare}
          className={styles.shareBtn}
          aria-label="Partager l'invitation par WhatsApp ou message"
        >
          <Share2 size={16} />
          <span>Envoyer à mes amis (WhatsApp / SMS)</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className={`${styles.copyBtn} ${copied ? styles.copied : ''}`}
          aria-label="Copier le message d'invitation"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          <span>{copied ? 'Copié !' : 'Copier'}</span>
        </button>
      </div>
    </div>
  );
};

