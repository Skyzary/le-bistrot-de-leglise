import { test, expect } from '@playwright/test';
import { isRestaurantOpen, parseSchedule, ScheduleItem } from '@/utils/restaurantStatus';
import scheduleJson from '@/content/schedule.json';

test.describe('Restaurant Open/Closed Status Logic', () => {
  test.describe('Default schedule from schedule.json', () => {
    // Current schedule.json:
    // Lundi – Jeudi: 08h00 - 00h00
    // Vendredi – Samedi: 08h00 - 01h00
    // Dimanche: 09h00 - 16h00

    test('Monday to Thursday daytime and evening', () => {
      // 2026-10-05 is a Monday
      // 07:30 Paris time (closed)
      expect(isRestaurantOpen(new Date('2026-10-05T07:30:00+02:00'))).toBe(false);
      // 08:00 Paris time (opens)
      expect(isRestaurantOpen(new Date('2026-10-05T08:00:00+02:00'))).toBe(true);
      // 14:00 Paris time (open)
      expect(isRestaurantOpen(new Date('2026-10-05T14:00:00+02:00'))).toBe(true);
      // 23:59 Paris time (open)
      expect(isRestaurantOpen(new Date('2026-10-05T23:59:00+02:00'))).toBe(true);
    });

    test('Friday to Saturday night spillover', () => {
      // 2026-10-09 is a Friday
      expect(isRestaurantOpen(new Date('2026-10-09T23:30:00+02:00'))).toBe(true);

      // 2026-10-10 is Saturday 00:30 (Friday night shift open until 01:00)
      expect(isRestaurantOpen(new Date('2026-10-10T00:30:00+02:00'))).toBe(true);

      // Saturday 01:05 (closed after 01:00)
      expect(isRestaurantOpen(new Date('2026-10-10T01:05:00+02:00'))).toBe(false);

      // Saturday 08:30 (open)
      expect(isRestaurantOpen(new Date('2026-10-10T08:30:00+02:00'))).toBe(true);

      // 2026-10-11 is Sunday 00:30 (Saturday night shift open until 01:00)
      expect(isRestaurantOpen(new Date('2026-10-11T00:30:00+02:00'))).toBe(true);

      // Sunday 01:15 (closed after 01:00)
      expect(isRestaurantOpen(new Date('2026-10-11T01:15:00+02:00'))).toBe(false);
    });

    test('Sunday hours (09:00 - 16:00)', () => {
      // 2026-10-11 is a Sunday
      // 08:30 (closed before 09:00)
      expect(isRestaurantOpen(new Date('2026-10-11T08:30:00+02:00'))).toBe(false);

      // 09:00 (opens)
      expect(isRestaurantOpen(new Date('2026-10-11T09:00:00+02:00'))).toBe(true);

      // 13:00 (open)
      expect(isRestaurantOpen(new Date('2026-10-11T13:00:00+02:00'))).toBe(true);

      // 15:59 (open)
      expect(isRestaurantOpen(new Date('2026-10-11T15:59:00+02:00'))).toBe(true);

      // 16:00 (closed)
      expect(isRestaurantOpen(new Date('2026-10-11T16:00:00+02:00'))).toBe(false);

      // 19:00 (closed)
      expect(isRestaurantOpen(new Date('2026-10-11T19:00:00+02:00'))).toBe(false);

      // 2026-10-12 is Monday 00:30 (Sunday was closed from 16:00, so closed at midnight)
      expect(isRestaurantOpen(new Date('2026-10-12T00:30:00+02:00'))).toBe(false);
    });
  });

  test.describe('Adapting to custom schedule formats', () => {
    test('Handles split lunch and dinner service (e.g. 12h00 - 14h00 / 19h30 - 22h00)', () => {
      const splitSchedule: ScheduleItem[] = [
        {
          days: 'Mardi – Samedi',
          time: '12h00 - 14h00\n19h30 - 22h00',
        },
        {
          days: 'Dimanche – Lundi',
          time: 'Fermé',
        },
      ];

      // Tuesday (2026-10-06)
      // Before lunch: 11:30
      expect(isRestaurantOpen(new Date('2026-10-06T11:30:00+02:00'), splitSchedule)).toBe(false);
      // Lunch: 12:30
      expect(isRestaurantOpen(new Date('2026-10-06T12:30:00+02:00'), splitSchedule)).toBe(true);
      // Break: 15:00
      expect(isRestaurantOpen(new Date('2026-10-06T15:00:00+02:00'), splitSchedule)).toBe(false);
      // Dinner: 20:00
      expect(isRestaurantOpen(new Date('2026-10-06T20:00:00+02:00'), splitSchedule)).toBe(true);
      // After dinner: 22:30
      expect(isRestaurantOpen(new Date('2026-10-06T22:30:00+02:00'), splitSchedule)).toBe(false);

      // Sunday (closed)
      expect(isRestaurantOpen(new Date('2026-10-11T13:00:00+02:00'), splitSchedule)).toBe(false);
      // Monday (closed)
      expect(isRestaurantOpen(new Date('2026-10-12T13:00:00+02:00'), splitSchedule)).toBe(false);
    });

    test('Handles slash and hyphen separators and day lists', () => {
      const customSchedule: ScheduleItem[] = [
        {
          days: 'Vendredi, Samedi & Dimanche',
          time: '10h00 - 23h00',
        },
      ];

      // Friday 15:00
      expect(isRestaurantOpen(new Date('2026-10-09T15:00:00+02:00'), customSchedule)).toBe(true);
      // Saturday 15:00
      expect(isRestaurantOpen(new Date('2026-10-10T15:00:00+02:00'), customSchedule)).toBe(true);
      // Sunday 15:00
      expect(isRestaurantOpen(new Date('2026-10-11T15:00:00+02:00'), customSchedule)).toBe(true);
      // Wednesday 15:00 (not in list)
      expect(isRestaurantOpen(new Date('2026-10-07T15:00:00+02:00'), customSchedule)).toBe(false);
    });
  });

  test.describe('parseSchedule parser unit checks', () => {
    test('parses default schedule structure correctly', () => {
      const week = parseSchedule(scheduleJson.items as ScheduleItem[]);
      expect(week).toHaveLength(7);

      // Sunday (day 0): should have 2 intervals (Sat night spillover 0-60, daytime 540-960)
      expect(week[0]).toEqual([
        { start: 0, end: 60 },
        { start: 540, end: 960 },
      ]);

      // Monday (day 1): 08h00 - 00h00 (480 - 1440)
      expect(week[1]).toEqual([{ start: 480, end: 1440 }]);
    });
  });
});
