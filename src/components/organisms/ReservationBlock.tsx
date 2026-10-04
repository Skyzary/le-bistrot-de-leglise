'use client';
import React, { useState } from 'react';
import styles from './ReservationBlock.module.scss';
import { Button } from '@/components/atoms/Button';
import { Phone, Calendar, Loader2, CheckCircle, Plus, Minus, User, Smartphone, Clock, Mail, MessageSquare } from 'lucide-react';


export const ReservationBlock = () => {
  const [guests, setGuests] = useState(2);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [time, setTime] = useState('19:45');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('inside');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    formData.append('guests', guests.toString());
    formData.append('location', location);
    
    try {
      const res = await fetch('/api/send-reservation', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || 'Erreur lors de l\'envoi');
      }
    } catch (err) {
      setError('Erreur inattendue');
    } finally {
      setLoading(false);
    }
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
              <div className={styles.inputWrapper}>
                <Calendar size={18} className={styles.inputIcon} />
                <input 
                  id="date-input"
                  name="date"
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  className={styles.textInputWithIcon}
                  style={{ colorScheme: 'dark' }}
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="time-input">Heure</label>
              <div className={styles.inputWrapper}>
                <Clock size={18} className={styles.inputIcon} />
                <input 
                  id="time-input"
                  name="time"
                  type="time" 
                  value={time} 
                  onChange={(e) => setTime(e.target.value)} 
                  className={styles.textInputWithIcon}
                  style={{ colorScheme: 'dark' }}
                  required
                />
              </div>
            </div>
          </div>

          <div className={styles.fieldGrid}>
            <div className={styles.inputWrapper}>
              <User size={18} className={styles.inputIcon} />
              <input type="text" name="name" placeholder="Votre nom complet" required className={styles.textInputWithIcon} />
            </div>
            <div className={styles.inputWrapper}>
              <Smartphone size={18} className={styles.inputIcon} />
              <input type="tel" name="phone" placeholder="Numéro de mobile (ex: 06...)" required className={styles.textInputWithIcon} />
            </div>
            <div className={styles.inputWrapper} style={{ gridColumn: '1 / -1' }}>
              <Mail size={18} className={styles.inputIcon} />
              <input type="email" name="email" placeholder="Adresse e-mail" required className={styles.textInputWithIcon} />
            </div>

            <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
              <label>Emplacement souhaité</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button 
                  type="button" 
                  className={location === 'inside' ? styles.slotActive : styles.slot}
                  onClick={() => setLocation('inside')}
                >
                  En salle
                </button>
                <button 
                  type="button" 
                  className={location === 'terrace' ? styles.slotActive : styles.slot}
                  onClick={() => setLocation('terrace')}
                >
                  En terrasse
                </button>
              </div>
            </div>

            <div className={styles.inputWrapper} style={{ gridColumn: '1 / -1', alignItems: 'flex-start' }}>
              <MessageSquare size={18} className={styles.inputIcon} style={{ top: '13px' }} />
              <textarea 
                name="requests"
                placeholder="Demandes particulières (allergies, chaise haute, etc.)" 
                className={styles.textInputWithIcon}
                style={{ height: 'auto', minHeight: '80px', paddingTop: '12px', paddingBottom: '12px', resize: 'vertical' }}
              />
            </div>
          </div>

          {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '16px' }}>{error}</p>}

          {success ? (
            <Button type="button" variant="primary" fullWidth className={styles.successBtn}>
              <CheckCircle size={18} /> Demande envoyée ! À très vite.
            </Button>
          ) : (
            <Button type="submit" variant="primary" fullWidth disabled={loading}>
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
