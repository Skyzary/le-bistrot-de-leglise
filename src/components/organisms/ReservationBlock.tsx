'use client';
import React, { useState } from 'react';
import styles from './ReservationBlock.module.scss';
import { Button } from '@/components/atoms/Button';
import { Phone, Calendar, Loader2, CheckCircle, Plus, Minus } from 'lucide-react';

export const ReservationBlock = () => {
  const [guests, setGuests] = useState(2);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [time, setTime] = useState('19:45');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 800);
  };

  const adjustGuests = (delta: number) => {
    setGuests(prev => Math.max(1, Math.min(12, prev + delta)));
  };

  return (
    <section className={styles.section} id="reservation">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <span className={styles.tag}>Réservation Simple</span>
            <h2 className={styles.title}>Réserver une table</h2>
          </div>
          <a href="tel:0434117585" className={styles.callBtn} aria-label="Téléphoner">
            <Phone size={20} />
          </a>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Couverts</label>
              <div className={styles.inputGroup}>
                <button type="button" onClick={() => adjustGuests(-1)} className={styles.adjustBtn}>
                  <Minus size={18} />
                </button>
                <span className={styles.value}>{guests}</span>
                <button type="button" onClick={() => adjustGuests(1)} className={styles.adjustBtn}>
                  <Plus size={18} />
                </button>
              </div>
            </div>
            
            <div className={styles.field}>
              <label htmlFor="date-input">Date</label>
              <div className={styles.inputGroup}>
                <input 
                  id="date-input"
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  className={styles.dateInput}
                  required
                />
              </div>
            </div>
          </div>

          <div className={styles.field}>
            <label>Service souhaité</label>
            <div className={styles.slotsGrid}>
              {['12:15', '19:45', '20:30'].map((slot) => (
                <button 
                  key={slot} 
                  type="button" 
                  className={time === slot ? styles.slotActive : styles.slot}
                  onClick={() => setTime(slot)}
                >
                  {slot.replace(':', 'h')}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <input type="text" placeholder="Votre nom complet" required className={styles.textInput} />
            <input type="tel" placeholder="Numéro de mobile (ex: 06 12 34 56 78)" required className={styles.textInput} />
          </div>

          {success ? (
            <Button variant="primary" fullWidth className={styles.successBtn}>
              <CheckCircle size={18} /> Demande envoyée ! À très vite.
            </Button>
          ) : (
            <Button variant="primary" fullWidth disabled={loading}>
              {loading ? <Loader2 size={18} className={styles.spin} /> : <CheckCircle size={18} />}
              {loading ? 'Envoi en cours...' : 'Confirmer ma demande de table'}
            </Button>
          )}
          
          <p className={styles.footerNote}>
            Confirmation immédiate par SMS ou appel du bistrot.
          </p>
        </form>
      </div>
    </section>
  );
};
