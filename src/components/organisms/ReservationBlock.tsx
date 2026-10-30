"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "./ReservationBlock.module.scss";
import { Button } from "@/components/atoms/Button";
import {
  Phone,
  Calendar,
  Loader2,
  CheckCircle,
  Plus,
  Minus,
  User,
  Smartphone,
  Clock,
  Mail,
  MessageSquare,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { CustomCalendar } from "@/components/molecules/CustomCalendar";
import { CustomTimePicker } from "@/components/molecules/CustomTimePicker";
import { AddToCalendarBtn } from "@/components/molecules/AddToCalendarBtn";
import { ShareReservationInvite } from "@/components/molecules/ShareReservationInvite";
import { useScrollLock } from "@/utils/scrollLock";

const formatDateDisplay = (isoStr: string) => {
  try {
    const [y, m, d] = isoStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
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
  const [time, setTime] = useState("19:45");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [location, setLocation] = useState("inside");
  const [confirmedName, setConfirmedName] = useState("");
  const [requests, setRequests] = useState("");

  // Modals for Custom Calendar and Custom TimePicker
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Lock background scroll when calendar or time picker modal is open
  useScrollLock(showCalendar || showTimePicker);

  const handleSelectDate = useCallback((dateIso: string) => {
    setDate(dateIso);
    setShowCalendar(false);
  }, []);

  const handleCloseCalendar = useCallback(() => {
    setShowCalendar(false);
  }, []);

  const handleSelectTime = useCallback((selectedTime: string) => {
    setTime(selectedTime);
    setShowTimePicker(false);
  }, []);

  const handleCloseTimePicker = useCallback(() => {
    setShowTimePicker(false);
  }, []);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("bistrot_reservation_requests");
      if (saved) {
        setRequests(saved);
        sessionStorage.removeItem("bistrot_reservation_requests");
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

    window.addEventListener("set-reservation-requests", handleCustomEvent);
    return () =>
      window.removeEventListener("set-reservation-requests", handleCustomEvent);
  }, []);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowCalendar(false);
        setShowTimePicker(false);
      }
    };
    if (showCalendar || showTimePicker) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showCalendar, showTimePicker]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const nameVal = formData.get("name") as string;
    if (nameVal) setConfirmedName(nameVal);
    formData.append("guests", guests.toString());
    formData.append("location", location);
    formData.append("date", date);
    formData.append("time", time);

    try {
      const res = await fetch("/api/send-reservation", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();

      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || "Erreur lors de l'envoi");
      }
    } catch {
      setError("Erreur inattendue");
    } finally {
      setLoading(false);
    }
  };

  const adjustGuests = (delta: number) => {
    setGuests((prev) => Math.max(1, Math.min(12, prev + delta)));
  };

  return (
    <section className={styles.section} id="reservation">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <span className={styles.tag}>Réservation Simple</span>
            <h2 className={styles.title}>Réserver une table</h2>
          </div>
          <a
            href="tel:0434117585"
            className={styles.callBtn}
            aria-label="Téléphoner"
          >
            <Phone size={20} />
          </a>
        </div>

        {success ? (
          <div className={styles.successState}>
            <div className={styles.successIcon}>
              <CheckCircle size={44} />
            </div>
            <h3 className={styles.successTitle}>
              Demande envoyée avec succès !
            </h3>
            <p className={styles.successDesc}>
              Merci pour votre réservation. Notre équipe prépare votre table et
              vous confirme la réservation dans quelques instants par SMS ou par
              téléphone.
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
            <div style={{ marginTop: "16px" }}>
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
              {/* Couverts */}
              <div className={styles.field}>
                <label id="guests-label">Couverts</label>
                <div
                  className={styles.inputGroup}
                  role="group"
                  aria-labelledby="guests-label"
                >
                  <button
                    type="button"
                    onClick={() => adjustGuests(-1)}
                    className={styles.adjustBtn}
                    aria-label="Diminuer le nombre de couverts"
                  >
                    <Minus size={18} />
                  </button>
                  <span className={styles.value}>
                    {guests} {guests > 1 ? "couverts" : "couvert"}
                  </span>
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

              {/* Date with Custom Calendar Picker */}
              <div className={styles.field}>
                <label id="date-label">Date</label>
                <button
                  type="button"
                  id="date-input"
                  className={styles.pickerTriggerBtn}
                  onClick={() => setShowCalendar(true)}
                  aria-haspopup="dialog"
                  aria-expanded={showCalendar}
                  aria-labelledby="date-label"
                >
                  <div className={styles.pickerValue}>
                    <Calendar size={18} className={styles.inputIconInline} />
                    <span>{formatDateDisplay(date)}</span>
                  </div>
                  <ChevronDown size={14} className={styles.chevronIcon} />
                </button>
                <input type="hidden" name="date" value={date} />
              </div>

              {/* Heure with Custom Time Picker */}
              <div className={styles.field}>
                <label id="time-label">Heure</label>
                <button
                  type="button"
                  id="time-input"
                  className={styles.pickerTriggerBtn}
                  onClick={() => setShowTimePicker(true)}
                  aria-haspopup="dialog"
                  aria-expanded={showTimePicker}
                  aria-labelledby="time-label"
                >
                  <div className={styles.pickerValue}>
                    <Clock size={18} className={styles.inputIconInline} />
                    <span>
                      {time}{" "}
                      {parseInt(time.split(":")[0], 10) < 17
                        ? "(Midi)"
                        : "(Soir)"}
                    </span>
                  </div>
                  <ChevronDown size={14} className={styles.chevronIcon} />
                </button>
                <input type="hidden" name="time" value={time} />
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

              <div
                className={styles.inputWrapper}
                style={{ gridColumn: "1 / -1" }}
              >
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

              <div className={styles.field} style={{ gridColumn: "1 / -1" }}>
                <label>Emplacement souhaité</label>
                <div className={styles.locationGrid}>
                  <button
                    type="button"
                    className={
                      location === "inside" ? styles.slotActive : styles.slot
                    }
                    onClick={() => setLocation("inside")}
                  >
                    En salle
                  </button>
                  <button
                    type="button"
                    className={
                      location === "terrace" ? styles.slotActive : styles.slot
                    }
                    onClick={() => setLocation("terrace")}
                  >
                    En terrasse
                  </button>
                </div>
              </div>

              <div className={styles.textareaWrapper}>
                {requests && (
                  <div className={styles.autoFillBadge}>
                    <span className={styles.autoFillBadgeText}>
                      <Sparkles size={14} /> Menu sélectionné automatiquement
                    </span>
                    <button
                      type="button"
                      onClick={() => setRequests("")}
                      className={styles.autoFillClearBtn}
                    >
                      Effacer
                    </button>
                  </div>
                )}
                <div className={styles.textareaContainer}>
                  <MessageSquare size={18} className={styles.textareaIcon} />
                  <textarea
                    name="requests"
                    value={requests}
                    onChange={(e) => setRequests(e.target.value)}
                    placeholder="Demandes particulières (allergies, chaise haute, etc.)"
                    aria-label="Demandes particulières"
                    className={styles.textareaInput}
                  />
                </div>
              </div>
            </div>

            {error && <p className={styles.errorMsg}>{error}</p>}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? (
                <Loader2 size={18} className={styles.spin} />
              ) : (
                <CheckCircle size={18} />
              )}
              {loading ? "Envoi en cours..." : "Confirmer ma demande de table"}
            </Button>

            <p className={styles.footerNote}>
              Confirmation immédiate par SMS ou appel du bistrot.
            </p>
          </form>
        )}
      </div>

      {/* Modal Dialog for Custom Calendar */}
      {showCalendar && (
        <div
          className={styles.modalOverlay}
          onClick={handleCloseCalendar}
          onTouchMove={(e) => {
            if (e.target === e.currentTarget) e.preventDefault();
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Choisir une date de réservation"
        >
          <div
            className={styles.modalContent}
            data-lenis-prevent
            onClick={(e) => e.stopPropagation()}
          >
            <CustomCalendar
              value={date}
              onChange={handleSelectDate}
              onClose={handleCloseCalendar}
            />
          </div>
        </div>
      )}

      {/* Modal Dialog for Custom Time Picker */}
      {showTimePicker && (
        <div
          className={styles.modalOverlay}
          onClick={handleCloseTimePicker}
          onTouchMove={(e) => {
            if (e.target === e.currentTarget) e.preventDefault();
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Choisir une heure de réservation"
        >
          <div
            className={styles.modalContent}
            data-lenis-prevent
            onClick={(e) => e.stopPropagation()}
          >
            <CustomTimePicker
              value={time}
              onChange={handleSelectTime}
              onClose={handleCloseTimePicker}
            />
          </div>
        </div>
      )}
    </section>
  );
};
