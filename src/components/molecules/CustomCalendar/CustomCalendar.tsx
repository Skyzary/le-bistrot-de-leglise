'use client';

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import styles from './CustomCalendar.module.scss';
import { triggerHaptic } from '@/utils/haptics';

export interface CustomCalendarProps {
  value: string; // ISO 'YYYY-MM-DD'
  onChange: (dateStr: string, formattedLabel: string) => void;
  minDate?: string; // ISO 'YYYY-MM-DD', defaults to today
  maxDate?: string; // ISO 'YYYY-MM-DD'
  onClose?: () => void;
  inline?: boolean;
}

const MONTH_NAMES_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const WEEKDAYS_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const getTodayIso = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatFrenchDate = (isoStr: string): string => {
  try {
    const [year, month, day] = isoStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return isoStr;
  }
};

export const CustomCalendar: React.FC<CustomCalendarProps> = ({
  value,
  onChange,
  minDate = getTodayIso(),
  maxDate,
  onClose,
  inline = false,
}) => {
  // Parse initial view year and month from value or minDate
  const initialDate = useMemo(() => {
    if (value && !isNaN(Date.parse(value))) {
      const [y, m] = value.split('-').map(Number);
      return new Date(y, m - 1, 1);
    }
    const [y, m] = minDate.split('-').map(Number);
    return new Date(y, m - 1, 1);
  }, [value, minDate]);

  const [currentMonth, setCurrentMonth] = useState<Date>(initialDate);

  const todayIso = useMemo(() => getTodayIso(), []);

  const handlePrevMonth = () => {
    triggerHaptic('light');
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    triggerHaptic('light');
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Determine if previous month navigation should be disabled
  const isPrevDisabled = useMemo(() => {
    const min = new Date(minDate);
    const prevMonthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);
    return prevMonthEnd < new Date(min.getFullYear(), min.getMonth(), 1);
  }, [currentMonth, minDate]);

  // Calendar cells matrix
  const daysInGrid = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // First day of current month
    const firstDay = new Date(year, month, 1);
    // Number of days in current month
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Day of week index (Monday = 0 ... Sunday = 6)
    const startDayIndex = (firstDay.getDay() + 6) % 7;

    const days: Array<{
      dateIso: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isDisabled: boolean;
      isToday: boolean;
      isSelected: boolean;
    }> = [];

    // Days from previous month
    const prevMonthTotalDays = new Date(year, month, 0).getDate();
    for (let i = startDayIndex - 1; i >= 0; i--) {
      const prevDay = prevMonthTotalDays - i;
      const prevDate = new Date(year, month - 1, prevDay);
      const iso = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}-${String(prevDay).padStart(2, '0')}`;
      days.push({
        dateIso: iso,
        dayNumber: prevDay,
        isCurrentMonth: false,
        isDisabled: true,
        isToday: iso === todayIso,
        isSelected: iso === value,
      });
    }

    // Days in current month
    for (let d = 1; d <= totalDays; d++) {
      const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isDisabled = (Boolean(minDate) && iso < minDate) || (Boolean(maxDate) && iso > maxDate!);
      days.push({
        dateIso: iso,
        dayNumber: d,
        isCurrentMonth: true,
        isDisabled,
        isToday: iso === todayIso,
        isSelected: iso === value,
      });
    }

    // Trailing days from next month to complete the 7-column grid
    const remainingSlots = 7 - (days.length % 7);
    if (remainingSlots < 7) {
      for (let nextDay = 1; nextDay <= remainingSlots; nextDay++) {
        const nextDate = new Date(year, month + 1, nextDay);
        const iso = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(nextDay).padStart(2, '0')}`;
        days.push({
          dateIso: iso,
          dayNumber: nextDay,
          isCurrentMonth: false,
          isDisabled: true,
          isToday: iso === todayIso,
          isSelected: iso === value,
        });
      }
    }

    return days;
  }, [currentMonth, minDate, maxDate, todayIso, value]);

  const handleSelectDay = (dateIso: string) => {
    triggerHaptic('selection');
    const formatted = formatFrenchDate(dateIso);
    onChange(dateIso, formatted);
  };

  const handleQuickSelect = (daysFromToday: number) => {
    triggerHaptic('light');
    const d = new Date();
    d.setDate(d.getDate() + daysFromToday);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    // Switch month view if needed
    setCurrentMonth(new Date(d.getFullYear(), d.getMonth(), 1));
    handleSelectDay(iso);
  };

  return (
    <div className={`${styles.calendarCard} ${inline ? styles.inline : ''}`} data-lenis-prevent>
      {/* Quick Preset Buttons */}
      <div className={styles.presetsRow}>
        <button
          type="button"
          className={`${styles.presetBtn} ${value === todayIso ? styles.activePreset : ''}`}
          onClick={() => handleQuickSelect(0)}
        >
          Aujourd&apos;hui
        </button>
        <button
          type="button"
          className={styles.presetBtn}
          onClick={() => handleQuickSelect(1)}
        >
          Demain
        </button>
        <button
          type="button"
          className={styles.presetBtn}
          onClick={() => {
            // Find next Saturday
            const d = new Date();
            const dayOfWeek = d.getDay(); // 0 is Sunday, 6 is Saturday
            const daysUntilSaturday = dayOfWeek === 6 ? 7 : (6 - dayOfWeek);
            handleQuickSelect(daysUntilSaturday);
          }}
        >
          <Sparkles size={12} className={styles.presetIcon} />
          Ce samedi
        </button>
      </div>

      {/* Month & Year Navigation Header */}
      <div className={styles.header}>
        <button
          type="button"
          onClick={handlePrevMonth}
          disabled={isPrevDisabled}
          className={styles.navBtn}
          aria-label="Mois précédent"
        >
          <ChevronLeft size={18} />
        </button>

        <div className={styles.monthTitle}>
          <span className={styles.monthName}>
            {MONTH_NAMES_FR[currentMonth.getMonth()]}
          </span>
          <span className={styles.yearName}>{currentMonth.getFullYear()}</span>
        </div>

        <button
          type="button"
          onClick={handleNextMonth}
          className={styles.navBtn}
          aria-label="Mois suivant"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Weekday Labels Header */}
      <div className={styles.weekdaysGrid}>
        {WEEKDAYS_FR.map((wd) => (
          <span key={wd} className={styles.weekdayLabel}>
            {wd}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className={styles.daysGrid} role="grid">
        {daysInGrid.map((day, idx) => {
          if (!day.isCurrentMonth) {
            return (
              <span key={`out-${idx}`} className={styles.outOfMonthCell}>
                {day.dayNumber}
              </span>
            );
          }

          return (
            <button
              key={day.dateIso}
              type="button"
              disabled={day.isDisabled}
              onClick={() => handleSelectDay(day.dateIso)}
              className={`
                ${styles.dayBtn} 
                ${day.isSelected ? styles.selected : ''} 
                ${day.isToday && !day.isSelected ? styles.today : ''}
              `}
              aria-label={`${day.dayNumber} ${MONTH_NAMES_FR[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`}
              aria-selected={day.isSelected}
            >
              <span className={styles.dayNumber}>{day.dayNumber}</span>
              {day.isToday && !day.isSelected && <span className={styles.todayDot} />}
            </button>
          );
        })}
      </div>

      {/* Optional Close or Footer */}
      {onClose && (
        <div className={styles.footerRow}>
          <button type="button" onClick={onClose} className={styles.closeActionBtn}>
            Fermer le calendrier
          </button>
        </div>
      )}
    </div>
  );
};

