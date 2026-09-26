import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import '@/styles/globals.scss';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: 'Le Bistrot de l\'Église | Restaurant & Bistronomie à Fabrègues',
  description: 'Découvrez Le Bistrot de l\'Église au cœur de Fabrègues. Plats faits maison, cuisine authentique, et ambiance conviviale. Réservez votre table !',
  keywords: ['restaurant', 'bistrot', 'Fabrègues', 'fait maison', 'bistronomie', 'réserver table', 'Le XV'],
  openGraph: {
    title: 'Le Bistrot de l\'Église | Restaurant à Fabrègues',
    description: 'Bistronomie et convivialité avec des plats faits maison. Réservez votre table au cœur de Fabrègues !',
    url: 'https://lebistrotdeleglise.fr',
    siteName: 'Le Bistrot de l\'Église',
    locale: 'fr_FR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://lebistrotdeleglise.fr',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${playfair.variable} ${jakarta.variable}`}>
        {children}
      </body>
    </html>
  );
}
