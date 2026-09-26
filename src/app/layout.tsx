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
  title: 'Le XV - Restaurant',
  description: 'Restaurant Le XV',
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
