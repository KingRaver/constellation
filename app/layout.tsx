import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Signal — Waking Life Festival Network',
  description:
    'A living constellation representing the invisible infrastructure of Waking Life festival.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
