import defaultSchedule from '@/content/schedule.json';

export interface ScheduleItem {
  days: string;
  time: string;
}

export interface TimeInterval {
  start: number; // in minutes from midnight (0 - 1440)
  end: number;   // in minutes from midnight (0 - 1440)
}

const DAY_MAP: Record<string, number> = {
  dim: 0,
  dimanche: 0,
  sun: 0,
  sunday: 0,
  lun: 1,
  lundi: 1,
  mon: 1,
  monday: 1,
  mar: 2,
  mardi: 2,
  tue: 2,
  tuesday: 2,
  mer: 3,
  mercredi: 3,
  wed: 3,
  wednesday: 3,
  jeu: 4,
  jeudi: 4,
  thu: 4,
  thursday: 4,
  ven: 5,
  vendredi: 5,
  fri: 5,
  friday: 5,
  sam: 6,
  samedi: 6,
  sat: 6,
  saturday: 6,
};

function parseDays(daysStr: string): number[] {
  const clean = daysStr
    .toLowerCase()
    .replace(/^du\s+/i, '')
    .replace(/\s+au\s+/i, ' – ')
    .replace(/\s+à\s+/i, ' – ')
    .trim();

  // Handle ranges like 'Lundi – Jeudi' or 'Mardi - Samedi'
  if (clean.includes('–') || clean.includes('-')) {
    const parts = clean.split(/[–-]/).map((s) => s.trim().replace(/[^a-z]/g, ''));
    const startDay = DAY_MAP[parts[0]];
    const endDay = DAY_MAP[parts[1]];

    if (startDay !== undefined && endDay !== undefined) {
      const days: number[] = [];
      if (startDay <= endDay) {
        for (let d = startDay; d <= endDay; d++) days.push(d);
      } else {
        // e.g. Dimanche – Lundi
        for (let d = startDay; d <= 6; d++) days.push(d);
        for (let d = 0; d <= endDay; d++) days.push(d);
      }
      return days;
    }
  }

  // Handle single days or comma/and separated lists
  const tokens = clean.split(/[,&/]| et /).map((s) => s.trim().replace(/[^a-z]/g, ''));
  const days: number[] = [];
  for (const token of tokens) {
    if (DAY_MAP[token] !== undefined) {
      days.push(DAY_MAP[token]);
    }
  }
  return days;
}

function parseTimeSlots(timeStr: string): { start: number; end: number }[] {
  if (!timeStr || /ferm[ée]|closed/i.test(timeStr)) return [];

  // Normalize HTML breaks, newlines, slashes, ampersands
  const clean = timeStr.replace(/<br\s*\/?>/gi, '\n');
  const rawSlots = clean.split(/[\n/&,]| et /).map((s) => s.trim()).filter(Boolean);
  const result: { start: number; end: number }[] = [];

  for (const slot of rawSlots) {
    const parts = slot.split(/[–-]/).map((s) => s.trim());
    if (parts.length === 2) {
      const match1 = parts[0].match(/^(\d{1,2})(?:[h:](\d{2}))?$/i);
      const match2 = parts[1].match(/^(\d{1,2})(?:[h:](\d{2}))?$/i);
      if (match1 && match2) {
        const start = parseInt(match1[1], 10) * 60 + (match1[2] ? parseInt(match1[2], 10) : 0);
        let end = parseInt(match2[1], 10) * 60 + (match2[2] ? parseInt(match2[2], 10) : 0);
        if (end === 0) end = 1440; // Midnight (end of current day)
        result.push({ start, end });
      }
    }
  }
  return result;
}

export function parseSchedule(items: ScheduleItem[]): TimeInterval[][] {
  const week: TimeInterval[][] = Array.from({ length: 7 }, () => []);

  for (const item of items) {
    if (!item.days || !item.time) continue;

    const targetDays = parseDays(item.days);
    const slots = parseTimeSlots(item.time);

    for (const slot of slots) {
      for (const day of targetDays) {
        if (slot.end > slot.start) {
          week[day].push({ start: slot.start, end: slot.end });
        } else {
          // Crosses midnight (e.g. 08h00 - 01h00 or 19h00 - 02h00)
          // Current day: start -> 1440 (midnight)
          week[day].push({ start: slot.start, end: 1440 });
          // Next day: 0 -> end
          const nextDay = (day + 1) % 7;
          week[nextDay].push({ start: 0, end: slot.end });
        }
      }
    }
  }

  return week;
}

/**
 * Checks whether the restaurant is currently open according to the provided or default schedule.
 * Accurately adapts to Paris timezone (Europe/Paris).
 */
export function isRestaurantOpen(
  date = new Date(),
  customItems?: ScheduleItem[]
): boolean {
  const items = customItems || (defaultSchedule.items as ScheduleItem[]);
  const weeklySchedule = parseSchedule(items);

  try {
    const parisString = date.toLocaleString('en-US', { timeZone: 'Europe/Paris' });
    const parisDate = new Date(parisString);
    const day = parisDate.getDay();
    const minutes = parisDate.getHours() * 60 + parisDate.getMinutes();

    const intervals = weeklySchedule[day] || [];
    return intervals.some((interval) => minutes >= interval.start && minutes < interval.end);
  } catch {
    const day = date.getDay();
    const minutes = date.getHours() * 60 + date.getMinutes();
    const intervals = weeklySchedule[day] || [];
    return intervals.some((interval) => minutes >= interval.start && minutes < interval.end);
  }
}
