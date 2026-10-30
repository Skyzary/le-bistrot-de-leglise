import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import dynamic from 'next/dynamic';
import '@/styles/globals.scss';
import { SmoothScroll } from '@/components/atoms/SmoothScroll';
import { HalloweenDecorations } from '@/components/atoms/HalloweenDecorations';

const ReservationChatWidget = dynamic(
  () => import('@/components/organisms/ReservationChatWidget').then((mod) => mod.ReservationChatWidget)
);

const ScrollProgressBar = dynamic(
  () => import('@/components/atoms/ScrollProgressBar').then((mod) => mod.ScrollProgressBar)
);

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
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
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

import Script from 'next/script';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <Script src="https://identity.netlify.com/v1/netlify-identity-widget.js" strategy="afterInteractive" />
      </head>
      <body className={`${playfair.variable} ${jakarta.variable}`}>
        <ScrollProgressBar />
        <HalloweenDecorations />
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <ReservationChatWidget />
        <Script id="netlify-identity-redirect" strategy="afterInteractive">
          {`
            if (window.netlifyIdentity) {
              window.netlifyIdentity.on("init", user => {
                if (!user) {
                  window.netlifyIdentity.on("login", () => {
                    document.location.href = "/admin/";
                  });
                }
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
