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
  Sparkles,
  ChevronLeft
} from 'lucide-react';
import styles from './ReservationChatWidget.module.scss';
import { CustomCalendar } from '@/components/molecules/CustomCalendar';
import { CustomTimePicker } from '@/components/molecules/CustomTimePicker';
import { AddToCalendarBtn } from '@/components/molecules/AddToCalendarBtn';
import { ShareReservationInvite } from '@/components/molecules/ShareReservationInvite';
import { triggerHaptic } from '@/utils/haptics';
import { useScrollLock } from '@/utils/scrollLock';

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
  const [customDate, setCustomDate] = useState<string>(getTodayFormatted);
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [customTime, setCustomTime] = useState<string>('20:00');
  const [showCustomTime, setShowCustomTime] = useState(false);

  // Form field inputs for step 5
  const [inputName, setInputName] = useState('');
  const [inputPhone, setInputPhone] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputRequests, setInputRequests] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesListRef = useRef<HTMLDivElement>(null);
  const controlsAreaRef = useRef<HTMLDivElement>(null);
  const [, startTransition] = useTransition();

  // Lock background scroll when chat is open
  useScrollLock(isOpen);

  // Close chat on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Scroll specifically within message list without triggering viewport scrollIntoView jumps
  const scrollToBottom = () => {
    if (messagesListRef.current) {
      messagesListRef.current.scrollTo({
        top: messagesListRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    if (showCustomDate || showCustomTime) {
      if (controlsAreaRef.current) {
        controlsAreaRef.current.scrollTo({
          top: controlsAreaRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    }
  }, [showCustomDate, showCustomTime]);

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
    triggerHaptic('selection');
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
    triggerHaptic('light');
    setReservation(prev => ({ ...prev, guests: num }));
    setMessages(prev => [
      ...prev,
      { id: `user-${Date.now()}`, sender: 'user', text: `${num} ${num > 1 ? 'personnes' : 'personne'}` }
    ]);
    pushBotMessage('Parfait. À quelle heure préférez-vous venir ?', 'time');
  };

  // Step 3: Time selected
  const handleSelectTime = (timeVal: string) => {
    triggerHaptic('selection');
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
    triggerHaptic('light');
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
    setErrorMessage(null);
    const trimmed = inputName.trim();
    if (!trimmed) {
      setErrorMessage('Veuillez renseigner votre nom pour continuer.');
      return;
    }

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

  const handleGoBack = () => {
    if (isTyping || step === 'date' || step === 'submitting' || step === 'success') return;
    triggerHaptic('light');
    setErrorMessage(null);

    const prevStepMap: Record<Step, Step | null> = {
      date: null,
      guests: 'date',
      time: 'guests',
      location: 'time',
      name: 'location',
      contact: 'name',
      submitting: null,
      success: null,
    };

    const targetStep = prevStepMap[step];
    if (targetStep) {
      setMessages(prev => {
        if (prev.length >= 3) {
          return prev.slice(0, prev.length - 2);
        }
        return [INITIAL_BOT_MESSAGE];
      });
      setStep(targetStep);
    }
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
        triggerHaptic('success');
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
        triggerHaptic('heavy');
        setStep('contact');
        setErrorMessage(data.error || "Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
      }
    } catch {
      triggerHaptic('heavy');
      setIsTyping(false);
      setStep('contact');
      setErrorMessage('Erreur réseau. Vérifiez votre connexion et réessayez.');
    }
  };

  useEffect(() => {
    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setInputRequests(customEvent.detail);
        setReservation((prev) => ({ ...prev, requests: customEvent.detail }));
      }
    };
    window.addEventListener('set-reservation-requests', handleCustomEvent);
    return () => window.removeEventListener('set-reservation-requests', handleCustomEvent);
  }, []);

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
        <MessageSquare size={22} className={styles.triggerIcon} />
        <span className={styles.triggerLabel}>Réserver une table</span>
        <span className={styles.onlineBadgeDot} />
      </motion.button>

      {/* Floating Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <div 
            className={styles.backdrop} 
            onClick={() => setIsOpen(false)}
            onTouchMove={(e) => {
              if (e.target === e.currentTarget) {
                e.preventDefault();
              }
            }}
          >
            <motion.div
              className={styles.chatWindow}
              data-lenis-prevent
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
              <div className={styles.messagesList} ref={messagesListRef} data-lenis-prevent>
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
              <div className={styles.controlsArea} ref={controlsAreaRef}>
                {step !== 'date' && step !== 'submitting' && step !== 'success' && !isTyping && (
                  <div className={styles.controlsHeader}>
                    <button
                      type="button"
                      className={styles.backBtn}
                      onClick={handleGoBack}
                      aria-label="Retour à l'étape précédente"
                    >
                      <ChevronLeft size={16} />
                      Retour
                    </button>
                    <span className={styles.stepIndicator}>
                      {step === 'guests' && 'Étape 2/5 • Couverts'}
                      {step === 'time' && 'Étape 3/5 • Heure'}
                      {step === 'location' && 'Étape 4/5 • Emplacement'}
                      {step === 'name' && 'Étape 5/5 • Nom'}
                      {step === 'contact' && 'Finalisation • Contact'}
                    </span>
                  </div>
                )}

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
                        aria-label="Choisir une date personnalisée"
                      >
                        <Calendar size={14} />
                        Choisir une date
                      </button>
                    </div>

                    {showCustomDate && (
                      <div className={styles.customCalendarContainer}>
                        <CustomCalendar
                          value={customDate}
                          onChange={(dateIso, label) => {
                            setCustomDate(dateIso);
                            handleSelectDate(dateIso, label);
                          }}
                          onClose={() => setShowCustomDate(false)}
                          inline
                        />
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
                      <div className={styles.customCalendarContainer}>
                        <CustomTimePicker
                          value={customTime}
                          onChange={(selectedTime) => {
                            setCustomTime(selectedTime);
                            handleSelectTime(selectedTime);
                          }}
                          onClose={() => setShowCustomTime(false)}
                          inline
                        />
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
                  <div className={styles.stepForm}>
                    <form onSubmit={handleSubmitName} className={styles.sendRow}>
                      <div className={styles.inputGroup} style={{ flex: 1 }}>
                        <User size={16} className={styles.inputIcon} />
                        <input
                          type="text"
                          placeholder="Votre nom complet..."
                          aria-label="Votre nom complet"
                          value={inputName}
                          onChange={(e) => {
                            setInputName(e.target.value);
                            if (errorMessage) setErrorMessage(null);
                          }}
                          className={styles.chatInput}
                          autoFocus
                          required
                        />
                      </div>
                      <button type="submit" className={styles.sendBtn} aria-label="Envoyer le nom">
                        <Send size={15} />
                      </button>
                    </form>
                    {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                  </div>
                )}

                {/* STEP 5b: Phone, Email & Optional Requests */}
                {step === 'contact' && !isTyping && (
                  <form onSubmit={handleFinalSubmit} className={styles.stepForm}>
                    <div className={styles.inputGroup}>
                      <Phone size={16} className={styles.inputIcon} />
                      <input
                        type="tel"
                        placeholder="Téléphone (ex: 06 12 34 56 78)"
                        aria-label="Numéro de téléphone"
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
                        aria-label="Adresse email"
                        value={inputEmail}
                        onChange={(e) => setInputEmail(e.target.value)}
                        className={styles.chatInput}
                        required
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <textarea
                        placeholder="Remarques (allergies, chaise bébé, etc. - optionnel)"
                        aria-label="Remarques ou demandes particulières"
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
                    <ShareReservationInvite
                      date={reservation.date}
                      time={reservation.time}
                      guests={reservation.guests}
                      name={reservation.name}
                      location={reservation.location}
                    />
                    <AddToCalendarBtn
                      date={reservation.date}
                      time={reservation.time}
                      guests={reservation.guests}
                      name={reservation.name}
                      location={reservation.location}
                    />
                    <button
                      type="button"
                      className={styles.restartBtn}
                      onClick={handleReset}
                      style={{ marginTop: '12px' }}
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

