import styles from './page.module.scss';
import { Header } from '@/components/organisms/Header';
import { Hero } from '@/components/organisms/Hero';
import { ReviewShowcase } from '@/components/organisms/ReviewShowcase';
import { Philosophy } from '@/components/organisms/Philosophy';
import { MenuOverview } from '@/components/organisms/MenuOverview';
import { GallerySection } from '@/components/organisms/GallerySection';
import { TourismDiscovery } from '@/components/organisms/TourismDiscovery';
import { ReservationBlock } from '@/components/organisms/ReservationBlock';
import { QuickActionMenu } from '@/components/organisms/QuickActionMenu';
import { Footer } from '@/components/organisms/Footer';

export default function Home() {
  return (
    <main className={styles.main}>
      <Header />
      <Hero />
      <ReviewShowcase />
      <Philosophy />
      <MenuOverview />
      <GallerySection />
      <TourismDiscovery />
      <ReservationBlock />
      <Footer />
      <QuickActionMenu />
    </main>
  );
}
