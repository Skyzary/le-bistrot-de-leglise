'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { MessageSquare } from 'lucide-react';
import styles from './ReservationChatWidget.module.scss';
import { triggerHaptic } from '@/utils/haptics';

const ReservationChatModal = dynamic(
  () => import('./ReservationChatModal').then((mod) => mod.ReservationChatModal),
  { ssr: false }
);

export const ReservationChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    triggerHaptic('medium');
    setIsOpen(true);
  };

  const handleClose = () => {
    triggerHaptic('light');
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className={styles.triggerBtn}
        onClick={handleOpen}
        aria-label="Réserver avec l'Assistant Le Bistrot"
        style={{
          display: isOpen ? 'none' : 'flex',
        }}
      >
        <MessageSquare size={22} className={styles.triggerIcon} />
        <span className={styles.triggerLabel}>Réserver une table</span>
        <span className={styles.onlineBadgeDot} />
      </button>

      {isOpen && (
        <ReservationChatModal
          isOpen={isOpen}
          onClose={handleClose}
        />
      )}
    </>
  );
};
