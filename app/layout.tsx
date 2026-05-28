import type { Metadata } from 'next';
import './globals.css';

const title = 'Signal — Waking Life';
const description =
  'A living constellation representing the invisible infrastructure of Waking Life festival.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: 'website',
    siteName: 'Signal',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
