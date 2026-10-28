'use client';

import React, { useState, useRef, useEffect, useTransition } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  X, 
  Send, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Loader2, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import styles from './ReservationChatWidget.module.scss';

type Step = 
  | 'date'
  | 'guests'
  | 'time'
  | 'location'
  | 'name'
  | 'contact'
  | 'submitting'
  | 'success';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
}

interface ReservationData {
  date: string;
  guests: number;
  time: string;
  location: 'inside' | 'terrace';
  name: string;
  phone: string;
  email: string;
  requests: string;
}

const INITIAL_BOT_MESSAGE: ChatMessage = {
  id: 'init-1',
  sender: 'bot',
  text: 'Bonjour ! Pour quel jour souhaitez-vous réserver une table ?',
};

const DEFAULT_TIME_SLOTS = ['12:00', '12:30', '13:00', '19:30', '20:00', '20:30', '21:00'];
const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];

const getTodayFormatted = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

const getTomorrowFormatted = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

const formatDateLabel = (isoDate: string) => {
  try {
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  } catch {
    return isoDate;
  }
};

export const ReservationChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>('date');
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_BOT_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reservation details
  const [reservation, setReservation] = useState<ReservationData>({
    date: '',
    guests: 2,
    time: '',
    location: 'inside',
    name: '',
    phone: '',
    email: '',
    requests: '',
  });

  // Local inputs
  const [customDate, setCustomDate] = useState<string>(getTodayFormatted());
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [customTime, setCustomTime] = useState<string>('20:00');
  const [showCustomTime, setShowCustomTime] = useState(false);

  // Form field inputs for step 5
  const [inputName, setInputName] = useState('');
  const [inputPhone, setInputPhone] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputRequests, setInputRequests] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [, startTransition] = useTransition();

  // Scroll to bottom on new messages or typing
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  // Helper to add bot message with delay
  const pushBotMessage = (text: string, nextStep?: Step) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { id: `bot-${Date.now()}-${Math.random()}`, sender: 'bot', text }
      ]);
      setIsTyping(false);
      if (nextStep) {
        setStep(nextStep);
      }
    }, 380);
  };

  // Step 1: Date selected
  const handleSelectDate = (dateVal: string, displayLabel: string) => {
    setReservation(prev => ({ ...prev, date: dateVal }));
    setMessages(prev => [
      ...prev,
      { id: `user-${Date.now()}`, sender: 'user', text: `Pour le ${displayLabel}` }
    ]);
    setShowCustomDate(false);
    pushBotMessage('Très bien ! Combien de personnes serez-vous ?', 'guests');
  };

  // Step 2: Guests selected
  const handleSelectGuests = (num: number) => {
    setReservation(prev => ({ ...prev, guests: num }));
    setMessages(prev => [
      ...prev,
      { id: `user-${Date.now()}`, sender: 'user', text: `${num} ${num > 1 ? 'personnes' : 'personne'}` }
    ]);
    pushBotMessage('Parfait. À quelle heure préférez-vous venir ?', 'time');
  };

  // Step 3: Time selected
  const handleSelectTime = (timeVal: string) => {
    setReservation(prev => ({ ...prev, time: timeVal }));
    setMessages(prev => [
      ...prev,
      { id: `user-${Date.now()}`, sender: 'user', text: `À ${timeVal}` }
    ]);
    setShowCustomTime(false);
    pushBotMessage('Où préférez-vous être installés ?', 'location');
  };

  // Step 4: Location selected
  const handleSelectLocation = (loc: 'inside' | 'terrace') => {
    setReservation(prev => ({ ...prev, location: loc }));
    const locText = loc === 'inside' ? 'En salle' : 'En terrasse';
    setMessages(prev => [
      ...prev,
      { id: `user-${Date.now()}`, sender: 'user', text: locText }
    ]);
    pushBotMessage("C'est presque prêt ! À quel nom dois-je enregistrer la réservation ?", 'name');
  };

  // Step 5a: Name submitted
  const handleSubmitName = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputName.trim();
    if (!trimmed) return;

    setReservation(prev => ({ ...prev, name: trimmed }));
    setMessages(prev => [
      ...prev,
      { id: `user-${Date.now()}`, sender: 'user', text: trimmed }
    ]);
    pushBotMessage(
      `Merci ${trimmed} ! Votre numéro de téléphone et email pour la confirmation ?`,
      'contact'
    );
  };

  // Step 5b & 6: Submit final reservation
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedPhone = inputPhone.trim();
    const trimmedEmail = inputEmail.trim();

    if (!trimmedPhone || !trimmedEmail) {
      setErrorMessage('Veuillez renseigner un numéro de téléphone et une adresse email.');
      return;
    }

    setReservation(prev => ({
      ...prev,
      phone: trimmedPhone,
      email: trimmedEmail,
      requests: inputRequests.trim()
    }));

    setMessages(prev => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: `📱 ${trimmedPhone} | ✉️ ${trimmedEmail}${inputRequests.trim() ? `\n📝 ${inputRequests.trim()}` : ''}`
      }
    ]);

    setStep('submitting');
    setIsTyping(true);

    try {
      const formData = new FormData();
      formData.append('guests', reservation.guests.toString());
      formData.append('date', reservation.date);
      formData.append('time', reservation.time);
      formData.append('name', reservation.name);
      formData.append('phone', trimmedPhone);
      formData.append('email', trimmedEmail);
      formData.append('location', reservation.location);
      if (inputRequests.trim()) {
        formData.append('requests', inputRequests.trim());
      }

      const res = await fetch('/api/send-reservation', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      setIsTyping(false);

      if (res.ok && data.success) {
        setStep('success');
        setMessages(prev => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: `Merci ${reservation.name} 🙏 Votre demande a bien été envoyée ! Nous vous confirmons la table par SMS dans quelques instants.`
          }
        ]);
      } else {
        setStep('contact');
        setErrorMessage(data.error || "Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
      }
    } catch {
      setIsTyping(false);
      setStep('contact');
      setErrorMessage('Erreur réseau. Vérifiez votre connexion et réessayez.');
    }
  };

  const handleReset = () => {
    setReservation({
      date: '',
      guests: 2,
      time: '',
      location: 'inside',
      name: '',
      phone: '',
      email: '',
      requests: '',
    });
    setInputName('');
    setInputPhone('');
    setInputEmail('');
    setInputRequests('');
    setShowCustomDate(false);
    setShowCustomTime(false);
    setErrorMessage(null);
    setMessages([INITIAL_BOT_MESSAGE]);
    setStep('date');
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        type="button"
        className={styles.triggerBtn}
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: isOpen ? 0 : 1, opacity: isOpen ? 0 : 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        aria-label="Réserver avec l'Assistant Le Bistrot"
      >
        <MessageSquare size={24} className={styles.triggerIcon} />
        <span className={styles.onlineBadgeDot} />
      </motion.button>

      {/* Floating Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className={styles.backdrop} onClick={() => setIsOpen(false)}>
            <motion.div
              className={styles.chatWindow}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Header */}
              <div className={styles.chatHeader}>
                <div className={styles.conciergeProfile}>
                  <div className={styles.avatarContainer}>
                    <Image
                      src="/logo.jpg"
                      alt="Logo Le Bistrot de l'Église"
                      width={40}
                      height={40}
                      className={styles.avatarImage}
                    />
                    <span className={styles.avatarBadgeDot} />
                  </div>
                  <div className={styles.conciergeInfo}>
                    <span className={styles.conciergeTitle}>Assistant Le Bistrot</span>
                    <span className={styles.conciergeStatus}>
                      <span className={styles.pulseDot} />
                      En direct • répond instantanément
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={() => setIsOpen(false)}
                  aria-label="Fermer le chat de réservation"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Chat Message Stream */}
              <div className={styles.messagesList}>
                {messages.map((msg) => (
                  <React.Fragment key={msg.id}>
                    {msg.sender === 'bot' ? (
                      <div className={styles.botMessageRow}>
                        <Image
                          src="/logo.jpg"
                          alt="Concierge"
                          width={24}
                          height={24}
                          className={styles.botMiniAvatar}
                        />
                        <div className={styles.botBubble}>{msg.text}</div>
                      </div>
                    ) : (
                      <div className={styles.userMessageRow}>
                        <div className={styles.userBubble}>{msg.text}</div>
                      </div>
                    )}
                  </React.Fragment>
                ))}

                {isTyping && (
                  <div className={styles.botMessageRow}>
                    <Image
                      src="/logo.jpg"
                      alt="Concierge"
                      width={24}
                      height={24}
                      className={styles.botMiniAvatar}
                    />
                    <div className={styles.typingBubble}>
                      <span className={styles.typingDot} />
                      <span className={styles.typingDot} />
                      <span className={styles.typingDot} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Step Controls Area */}
              <div className={styles.controlsArea}>
                {/* STEP 1: Date chips */}
                {step === 'date' && !isTyping && (
                  <div className={styles.stepForm}>
                    <div className={styles.chipsRow}>
                      <button
                        type="button"
                        className={styles.chipBtn}
                        onClick={() => handleSelectDate(getTodayFormatted(), "Aujourd'hui")}
                      >
                        Aujourd&apos;hui
                      </button>
                      <button
                        type="button"
                        className={styles.chipBtn}
                        onClick={() => handleSelectDate(getTomorrowFormatted(), 'Demain')}
                      >
                        Demain
                      </button>
                      <button
                        type="button"
                        className={styles.chipBtn}
                        onClick={() => setShowCustomDate(prev => !prev)}
                      >
                        <Calendar size={14} />
                        Choisir une date
                      </button>
                    </div>

                    {showCustomDate && (
                      <div className={styles.customInputRow}>
                        <input
                          type="date"
                          value={customDate}
                          min={getTodayFormatted()}
                          onChange={(e) => setCustomDate(e.target.value)}
                          className={styles.dateInput}
                        />
                        <button
                          type="button"
                          className={styles.sendBtn}
                          onClick={() => handleSelectDate(customDate, formatDateLabel(customDate))}
                        >
                          Valider
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 2: Guests Chips */}
                {step === 'guests' && !isTyping && (
                  <div className={styles.stepForm}>
                    <div className={styles.guestChipsRow}>
                      {GUEST_OPTIONS.map((num) => (
                        <button
                          key={num}
                          type="button"
                          className={styles.guestChipBtn}
                          onClick={() => handleSelectGuests(num)}
                        >
                          {num === 8 ? '8+' : num} {num > 1 ? 'pers.' : 'pers.'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 3: Time slots */}
                {step === 'time' && !isTyping && (
                  <div className={styles.stepForm}>
                    <div className={styles.slotsGrid}>
                      {DEFAULT_TIME_SLOTS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          className={styles.timeSlotBtn}
                          onClick={() => handleSelectTime(t)}
                        >
                          {t}
                        </button>
                      ))}
                      <button
                        type="button"
                        className={styles.timeSlotBtn}
                        onClick={() => setShowCustomTime(prev => !prev)}
                      >
                        Autre
                      </button>
                    </div>

                    {showCustomTime && (
                      <div className={styles.customInputRow}>
                        <input
                          type="time"
                          value={customTime}
                          onChange={(e) => setCustomTime(e.target.value)}
                          className={styles.dateInput}
                        />
                        <button
                          type="button"
                          className={styles.sendBtn}
                          onClick={() => handleSelectTime(customTime)}
                        >
                          Valider
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 4: Location */}
                {step === 'location' && !isTyping && (
                  <div className={styles.locationRow}>
                    <button
                      type="button"
                      className={styles.locationBtn}
                      onClick={() => handleSelectLocation('inside')}
                    >
                      En salle
                    </button>
                    <button
                      type="button"
                      className={styles.locationBtn}
                      onClick={() => handleSelectLocation('terrace')}
                    >
                      En terrasse
                    </button>
                  </div>
                )}

                {/* STEP 5a: Name Input */}
                {step === 'name' && !isTyping && (
                  <form onSubmit={handleSubmitName} className={styles.sendRow}>
                    <div className={styles.inputGroup} style={{ flex: 1 }}>
                      <User size={16} className={styles.inputIcon} />
                      <input
                        type="text"
                        placeholder="Votre nom complet..."
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                        className={styles.chatInput}
                        autoFocus
                        required
                      />
                    </div>
                    <button type="submit" className={styles.sendBtn} aria-label="Envoyer le nom">
                      <Send size={15} />
                    </button>
                  </form>
                )}

                {/* STEP 5b: Phone, Email & Optional Requests */}
                {step === 'contact' && !isTyping && (
                  <form onSubmit={handleFinalSubmit} className={styles.stepForm}>
                    <div className={styles.inputGroup}>
                      <Phone size={16} className={styles.inputIcon} />
                      <input
                        type="tel"
                        placeholder="Téléphone (ex: 06 12 34 56 78)"
                        value={inputPhone}
                        onChange={(e) => setInputPhone(e.target.value)}
                        className={styles.chatInput}
                        autoFocus
                        required
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <Mail size={16} className={styles.inputIcon} />
                      <input
                        type="email"
                        placeholder="Adresse email"
                        value={inputEmail}
                        onChange={(e) => setInputEmail(e.target.value)}
                        className={styles.chatInput}
                        required
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <textarea
                        placeholder="Remarques (allergies, chaise bébé, etc. - optionnel)"
                        value={inputRequests}
                        onChange={(e) => setInputRequests(e.target.value)}
                        className={styles.chatTextarea}
                      />
                    </div>

                    {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

                    <button type="submit" className={styles.submitBtn}>
                      <CheckCircle2 size={16} />
                      Confirmer la réservation
                    </button>
                  </form>
                )}

                {/* Submitting state */}
                {step === 'submitting' && (
                  <button type="button" className={styles.submitBtn} disabled>
                    <Loader2 size={16} className={styles.spin} />
                    Envoi en cours...
                  </button>
                )}

                {/* Success state */}
                {step === 'success' && (
                  <div className={styles.successCard}>
                    <div>
                      Réservation pour <strong>{reservation.name}</strong> •{' '}
                      <strong>{reservation.guests} pers.</strong>
                    </div>
                    <div>
                      Le <strong>{reservation.date}</strong> à <strong>{reservation.time}</strong> (
                      {reservation.location === 'inside' ? 'En salle' : 'En terrasse'})
                    </div>
                    <button
                      type="button"
                      className={styles.restartBtn}
                      onClick={handleReset}
                    >
                      <RotateCcw size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                      Nouvelle réservation
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

