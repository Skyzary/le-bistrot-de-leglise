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
 */
function parseEventDates(dateStr: string, timeStr: string, durationHours = 2) {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hour, min] = timeStr.split(':').map(Number);
    const startDate = new Date(year, month - 1, day, hour || 19, min || 30);
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

