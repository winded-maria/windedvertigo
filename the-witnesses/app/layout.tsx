import type { Metadata } from 'next';
import { Press_Start_2P, VT323 } from 'next/font/google';
import './globals.css';

const pressStart = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'The Witnesses — winded.vertigo',
  description: 'A small async game where six visitors meet your seed.',
  openGraph: {
    title: 'The Witnesses',
    description: 'A small game from winded.vertigo.',
    siteName: 'winded.vertigo',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${pressStart.variable} ${vt323.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
