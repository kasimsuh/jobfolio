import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CoopTrack - Application Tracker + Resume Versioning',
  description: 'Track your co-op and internship applications with built-in resume version control',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
