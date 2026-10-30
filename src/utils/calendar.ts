export interface CalendarEvent {
  title: string;
  description: string;
  location: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationHours?: number;
}

/**
 * Parses date + time strings into Date objects.
 * Supports both ISO format (YYYY-MM-DD, HH:MM) and French natural strings
 * (e.g., "Vendredi", "Samedi", "19h30", "Samedi soir", "Pour le déjeuner").
 */
function parseEventDates(dateStr: string, timeStr: string, durationHours = 2) {
  try {
    let year: number;
    let month: number;
    let day: number;

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr.trim())) {
      [year, month, day] = dateStr.trim().split('-').map(Number);
    } else {
      const now = new Date();
      const lowerDate = dateStr.toLowerCase();
      const weekdays: Record<string, number> = {
        dimanche: 0,
        lundi: 1,
        mardi: 2,
        mercredi: 3,
        jeudi: 4,
        vendredi: 5,
        samedi: 6,
      };

      const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      let matchedWeekday: number | null = null;
      for (const [name, idx] of Object.entries(weekdays)) {
        if (lowerDate.includes(name)) {
          matchedWeekday = idx;
          break;
        }
      }

      if (matchedWeekday !== null) {
        const diff = (matchedWeekday - targetDate.getDay() + 7) % 7;
        targetDate.setDate(targetDate.getDate() + diff);
      }

      year = targetDate.getFullYear();
      month = targetDate.getMonth() + 1;
      day = targetDate.getDate();
    }

    let hour = 19;
    let min = 30;
    const cleanTime = timeStr.trim().toLowerCase();
    const timeMatch = cleanTime.match(/(\d{1,2})\s*[:h]\s*(\d{2})?/);

    if (timeMatch) {
      hour = parseInt(timeMatch[1], 10);
      min = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
    } else if (cleanTime.includes('déjeuner') || cleanTime.includes('dejeuner') || cleanTime.includes('midi')) {
      hour = 12;
      min = 0;
    } else if (cleanTime.includes('soir')) {
      hour = 19;
      min = 30;
    }

    const startDate = new Date(year, month - 1, day, hour, min);
    if (isNaN(startDate.getTime())) {
      throw new Error('Invalid date');
    }
    const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);
    return { startDate, endDate };
  } catch {
    const fallback = new Date();
    return {
      startDate: fallback,
      endDate: new Date(fallback.getTime() + 2 * 60 * 60 * 1000),
    };
  }
}

/**
 * Format date to ICS UTC string (YYYYMMDDTHHmmssZ)
 */
function formatIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/**
 * Generates and triggers download of an .ics file for Apple Calendar, Outlook, and native calendar apps.
 */
export function downloadIcsFile(event: CalendarEvent) {
  const { startDate, endDate } = parseEventDates(event.date, event.time, event.durationHours || 2);
  const startStr = formatIcsDate(startDate);
  const endStr = formatIcsDate(endDate);

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Le Bistrot de l Église//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@lebistrotdeleglise.fr`,
    `DTSTAMP:${startStr}`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    `SUMMARY:${event.title.replace(/[,;]/g, ' ')}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.location.replace(/[,;]/g, ' ')}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Rappel Réservation Le Bistrot de l Église',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'reservation-bistrot-eglise.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates a direct web URL to add event to Google Calendar.
 */
export function getGoogleCalendarUrl(event: CalendarEvent): string {
  const { startDate, endDate } = parseEventDates(event.date, event.time, event.durationHours || 2);
  const startStr = formatIcsDate(startDate);
  const endStr = formatIcsDate(endDate);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${startStr}/${endStr}`,
    details: event.description,
    location: event.location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

