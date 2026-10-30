'use client';

import React, { useState, useMemo } from 'react';
import { Clock, Sun, Moon, Check, Sparkles } from 'lucide-react';
import styles from './CustomTimePicker.module.scss';
import { triggerHaptic } from '@/utils/haptics';

export interface CustomTimePickerProps {
  value: string; // 'HH:mm' e.g. '19:45'
  onChange: (timeStr: string) => void;
  onClose?: () => void;
  inline?: boolean;
}

const LUNCH_SLOTS = ['12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30'];
const DINNER_SLOTS = ['19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:30'];

export const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  value,
  onChange,
  onClose,
  inline = false,
}) => {
  // Determine if initial time is lunch or dinner
  const initialService = useMemo<'lunch' | 'dinner'>(() => {
    if (!value) return 'dinner';
    const hour = parseInt(value.split(':')[0], 10);
    return hour < 17 ? 'lunch' : 'dinner';
  }, [value]);

  const [activeTab, setActiveTab] = useState<'lunch' | 'dinner'>(initialService);

  // Custom manual time adjuster state
  const [showManual, setShowManual] = useState(false);
  const currentHours = useMemo(() => {
    return value ? value.split(':')[0] : '20';
  }, [value]);
  const currentMinutes = useMemo(() => {
    return value ? value.split(':')[1] : '00';
  }, [value]);

  const handleSelectSlot = (slot: string) => {
    triggerHaptic('selection');
    onChange(slot);
    if (onClose) onClose();
  };

  const handleManualTimeChange = (h: string, m: string) => {
    triggerHaptic('light');
    const formatted = `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
    onChange(formatted);
  };

  return (
    <div className={`${styles.timePickerCard} ${inline ? styles.inline : ''}`} data-lenis-prevent>
      {/* Service Tabs */}
      <div className={styles.tabsRow}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'lunch' ? styles.activeTab : ''}`}
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('lunch');
          }}
        >
          <Sun size={14} className={styles.tabIcon} />
          <span>Midi • Déjeuner</span>
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'dinner' ? styles.activeTab : ''}`}
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('dinner');
          }}
        >
          <Moon size={14} className={styles.tabIcon} />
          <span>Soir • Dîner</span>
        </button>
      </div>

      {/* Slots Section */}
      <div className={styles.content}>
        <div className={styles.serviceHeader}>
          <span className={styles.serviceTitle}>
            {activeTab === 'lunch' ? 'Service du Midi (12h00 – 14h00)' : 'Service du Soir (19h30 – 22h00)'}
          </span>
        </div>

        <div className={styles.slotsGrid}>
          {(activeTab === 'lunch' ? LUNCH_SLOTS : DINNER_SLOTS).map((slot) => {
            const isSelected = value === slot;
            return (
              <button
                key={slot}
                type="button"
                className={`${styles.slotBtn} ${isSelected ? styles.selectedSlot : ''}`}
                onClick={() => handleSelectSlot(slot)}
                aria-selected={isSelected}
              >
                <span>{slot}</span>
                {isSelected && <Check size={13} className={styles.checkIcon} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Manual Time Toggle */}
      <div className={styles.manualSection}>
        <button
          type="button"
          className={`${styles.manualToggleBtn} ${showManual ? styles.activeManualBtn : ''}`}
          onClick={() => setShowManual((prev) => !prev)}
        >
          <Clock size={15} />
          <span>{showManual ? 'Masquer l\'heure personnalisée' : 'Définir une autre heure'}</span>
        </button>

        {showManual && (
          <div className={styles.manualControls}>
            <div className={styles.stepperGroup}>
              <label>Heure</label>
              <select
                value={currentHours}
                onChange={(e) => handleManualTimeChange(e.target.value, currentMinutes)}
                className={styles.timeSelect}
                aria-label="Sélectionner les heures"
              >
                {['12', '13', '14', '19', '20', '21', '22', '23'].map((h) => (
                  <option key={h} value={h}>
                    {h}h
                  </option>
                ))}
              </select>
            </div>

            <span className={styles.timeSeparator}>:</span>

            <div className={styles.stepperGroup}>
              <label>Minutes</label>
              <select
                value={currentMinutes}
                onChange={(e) => handleManualTimeChange(currentHours, e.target.value)}
                className={styles.timeSelect}
                aria-label="Sélectionner les minutes"
              >
                {['00', '15', '30', '45'].map((m) => (
                  <option key={m} value={m}>
                    {m} min
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Optional Close button */}
      {onClose && (
        <div className={styles.footerRow}>
          <button type="button" onClick={onClose} className={styles.closeActionBtn}>
            <Check size={16} />
            <span>Valider cette heure ({value})</span>
          </button>
        </div>
      )}
    </div>
  );
};

