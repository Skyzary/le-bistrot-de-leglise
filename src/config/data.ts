import scheduleJson from '../content/schedule.json';
import menuPreviewJson from '../content/menu-preview.json';
import menuJson from '../content/menu.json';
import reviewsJson from '../content/reviews.json';
import galleryJson from '../content/gallery.json';
import eventsJson from '../content/events.json';

export interface BistrotEvent {
  title: string;
  date: string;
  time: string;
  tag?: string;
  description: string;
  image?: string;
}

export const scheduleData = scheduleJson.items;
export const menuSectionsPreview = menuPreviewJson.sections;
export const fullMenuData = menuJson.categories;
export const reviewsData = reviewsJson;
export const galleryData = galleryJson.images;
export const eventsData: BistrotEvent[] = eventsJson.items;
