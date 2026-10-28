'use client';
import React, { useState, useRef, useEffect } from 'react';
import styles from './ReservationBlock.module.scss';
import { Button } from '@/components/atoms/Button';
import { Phone, Calendar, Loader2, CheckCircle, Plus, Minus, User, Smartphone, Clock, Mail, MessageSquare, Sparkles } from 'lucide-react';
import { CustomCalendar } from '@/components/molecules/CustomCalendar';
import { CustomTimePicker } from '@/components/molecules/CustomTimePicker';
import { LiveServiceBadge } from '@/components/molecules/LiveServiceBadge';
import { AddToCalendarBtn } from '@/components/molecules/AddToCalendarBtn';
import { ShareReservationInvite } from '@/components/molecules/ShareReservationInvite';
import { triggerHaptic } from '@/utils/haptics';

const formatDateDisplay = (isoStr: string) => {
  try {
    const [y, m, d] = isoStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return isoStr;
  }
};

export const ReservationBlock = () => {
  const [guests, setGuests] = useState(2);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [time, setTime] = useState('19:45');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('inside');
  const [confirmedName, setConfirmedName] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const timePickerRef = useRef<HTMLDivElement>(null);
  const [requests, setRequests] = useState('');

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('bistrot_reservation_requests');
      if (saved) {
        setRequests(saved);
        sessionStorage.removeItem('bistrot_reservation_requests');
      }
    } catch {
      // storage error
    }

    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setRequests(customEvent.detail);
      }
    };

    window.addEventListener('set-reservation-requests', handleCustomEvent);
    return () => window.removeEventListener('set-reservation-requests', handleCustomEvent);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setShowCalendar(false);
      }
      if (timePickerRef.current && !timePickerRef.current.contains(e.target as Node)) {
        setShowTimePicker(false);
      }
    };
    if (showCalendar || showTimePicker) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showCalendar, showTimePicker]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const nameVal = formData.get('name') as string;
    if (nameVal) setConfirmedName(nameVal);
    formData.append('guests', guests.toString());
    formData.append('location', location);
    
    try {
      const res = await fetch('/api/send-reservation', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      
      if (result.success) {
        triggerHaptic('success');
        setSuccess(true);
      } else {
        triggerHaptic('heavy');
        setError(result.error || 'Erreur lors de l\'envoi');
      }
    } catch (err) {
      triggerHaptic('heavy');
      setError('Erreur inattendue');
    } finally {
      setLoading(false);
    }
  };

  const adjustGuests = (delta: number) => {
    triggerHaptic('light');
    setGuests(prev => Math.max(1, Math.min(12, prev + delta)));
  };

  return (
    <section className={styles.section} id="reservation">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <span className={styles.tag}>Réservation Simple</span>
              <LiveServiceBadge compact />
            </div>
            <h2 className={styles.title}>Réserver une table</h2>
          </div>
          <a href="tel:0434117585" className={styles.callBtn} aria-label="Téléphoner">
            <Phone size={20} />
          </a>
        </div>

        {success ? (
          <div className={styles.successState}>
            <div className={styles.successIcon}>
              <CheckCircle size={44} />
            </div>
            <h3 className={styles.successTitle}>Demande envoyée avec succès !</h3>
            <p className={styles.successDesc}>
              Merci pour votre réservation. Notre équipe prépare votre table et vous confirme la réservation dans quelques instants par SMS ou par téléphone.
            </p>
            <ShareReservationInvite
              date={date}
              time={time}
              guests={guests}
              name={confirmedName}
              location={location}
            />
            <AddToCalendarBtn
              date={date}
              time={time}
              guests={guests}
              name={confirmedName}
              location={location}
            />
            <div style={{ marginTop: '16px' }}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setSuccess(false);
                  setError(null);
                }}
              >
                Nouvelle réservation
              </Button>
            </div>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label id="guests-label">Couverts</label>
                <div className={styles.inputGroup} role="group" aria-labelledby="guests-label">
                  <button 
                    type="button" 
                    onClick={() => adjustGuests(-1)} 
                    className={styles.adjustBtn}
                    aria-label="Diminuer le nombre de couverts"
                  >
                    <Minus size={18} />
                  </button>
                  <span className={styles.value}>{guests}</span>
                  <button 
                    type="button" 
                    onClick={() => adjustGuests(1)} 
                    className={styles.adjustBtn}
                    aria-label="Augmenter le nombre de couverts"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
              
              <div className={styles.field} style={{ position: 'relative' }} ref={calendarRef}>
                <label id="date-label">Date</label>
                <button
                  type="button"
                  id="date-input"
                  className={styles.datePickerTrigger}
                  onClick={() => {
                    triggerHaptic('selection');
                    setShowCalendar(prev => !prev);
                  }}
                  aria-haspopup="dialog"
                  aria-expanded={showCalendar}
                  aria-labelledby="date-label"
                >
                  <Calendar size={16} className={styles.inputIconInline} />
                  <span>{formatDateDisplay(date)}</span>
                </button>
                <input type="hidden" name="date" value={date} />

                {showCalendar && (
                  <div className={styles.calendarPopover}>
                    <CustomCalendar
                      value={date}
                      onChange={(dateIso) => {
                        setDate(dateIso);
                        setShowCalendar(false);
                      }}
                      onClose={() => setShowCalendar(false)}
                    />
                  </div>
                )}
              </div>

              <div className={styles.field} style={{ position: 'relative' }} ref={timePickerRef}>
                <label id="time-label">Heure</label>
                <button
                  type="button"
                  id="time-input"
                  className={styles.datePickerTrigger}
                  onClick={() => {
                    triggerHaptic('selection');
                    setShowTimePicker(prev => !prev);
                  }}
                  aria-haspopup="dialog"
                  aria-expanded={showTimePicker}
                  aria-labelledby="time-label"
                >
                  <Clock size={16} className={styles.inputIconInline} />
                  <span>{time} {parseInt(time.split(':')[0], 10) < 17 ? '(Midi)' : '(Soir)'}</span>
                </button>
                <input type="hidden" name="time" value={time} />

                {showTimePicker && (
                  <div className={styles.calendarPopover}>
                    <CustomTimePicker
                      value={time}
                      onChange={(selectedTime) => {
                        setTime(selectedTime);
                        setShowTimePicker(false);
                      }}
                      onClose={() => setShowTimePicker(false)}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className={styles.fieldGrid}>
              <div className={styles.inputWrapper}>
                <User size={18} className={styles.inputIcon} />
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Votre nom complet" 
                  aria-label="Votre nom complet"
                  required 
                  className={styles.textInputWithIcon} 
                />
              </div>
              <div className={styles.inputWrapper}>
                <Smartphone size={18} className={styles.inputIcon} />
                <input 
                  type="tel" 
                  name="phone" 
                  placeholder="Numéro de mobile (ex: 06...)" 
                  aria-label="Numéro de mobile"
                  required 
                  className={styles.textInputWithIcon} 
                />
              </div>
              <div className={styles.inputWrapper} style={{ gridColumn: '1 / -1' }}>
                <Mail size={18} className={styles.inputIcon} />
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Adresse e-mail" 
                  aria-label="Adresse e-mail"
                  required 
                  className={styles.textInputWithIcon} 
                />
              </div>

              <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                <label>Emplacement souhaité</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button 
                    type="button" 
                    className={location === 'inside' ? styles.slotActive : styles.slot}
                    onClick={() => {
                      triggerHaptic('light');
                      setLocation('inside');
                    }}
                  >
                    En salle
                  </button>
                  <button 
                    type="button" 
                    className={location === 'terrace' ? styles.slotActive : styles.slot}
                    onClick={() => {
                      triggerHaptic('light');
                      setLocation('terrace');
                    }}
                  >
                    En terrasse
                  </button>
                </div>
              </div>

              <div className={styles.inputWrapper} style={{ gridColumn: '1 / -1', flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
                {requests && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(212, 163, 115, 0.15)',
                    border: '1px solid rgba(212, 163, 115, 0.4)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    color: '#D4A373',
                    fontWeight: 600
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sparkles size={14} /> Menu sélectionné automatiquement
                    </span>
                    <button
                      type="button"
                      onClick={() => setRequests('')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'rgba(249, 246, 240, 0.65)',
                        fontSize: '11px',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      Effacer
                    </button>
                  </div>
                )}
                <div style={{ position: 'relative', width: '100%' }}>
                  <MessageSquare size={18} className={styles.inputIcon} style={{ top: '13px' }} />
                  <textarea 
                    name="requests"
                    value={requests}
                    onChange={(e) => setRequests(e.target.value)}
                    placeholder="Demandes particulières (allergies, chaise haute, etc.)" 
                    aria-label="Demandes particulières"
                    className={styles.textInputWithIcon}
                    style={{ height: 'auto', minHeight: '85px', paddingTop: '12px', paddingBottom: '12px', resize: 'vertical' }}
                  />
                </div>
              </div>
            </div>

            {error && <p style={{ color: '#f87171', textAlign: 'center', marginBottom: '16px' }}>{error}</p>}

            <Button type="submit" variant="primary" fullWidth disabled={loading}>
              {loading ? <Loader2 size={18} className={styles.spin} /> : <CheckCircle size={18} />}
              {loading ? 'Envoi en cours...' : 'Confirmer ma demande de table'}
            </Button>
            
            <p className={styles.footerNote}>
              Confirmation immédiate par SMS ou appel du bistrot.
            </p>
          </form>
        )}
      </div>
    </section>
  );
};
