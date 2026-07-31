import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://stepshome.org'),
  title: {
    default: 'STEPS Home — Changing Lives, One Child at a Time',
    template: '%s | STEPS Home',
  },
  description:
    'STEPS Home is a charitable organization providing a safe haven, quality education, and endless love for girls rescued from abuse, abandonment, and trafficking in Chennai, India.',
  keywords: [
    'STEPS Home',
    'charity',
    'NGO',
    'girls education',
    'child rescue',
    'Chennai charity',
    'donate',
    'volunteer',
    'orphanage',
    'child welfare',
    'India NGO',
  ],
  authors: [{ name: 'STEPS Home' }],
  creator: 'STEPS Home',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName: 'STEPS Home',
    title: 'STEPS Home — Changing Lives, One Child at a Time',
    description:
      'Providing a safe haven, quality education, and endless love for girls in need since 2006.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'STEPS Home — Empowering Girls',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'STEPS Home — Changing Lives, One Child at a Time',
    description:
      'Providing a safe haven, quality education, and endless love for girls in need since 2006.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/Steps (200 x 200 px) (5).png" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#e91e63" />
      </head>
      <body className="antialiased">
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
