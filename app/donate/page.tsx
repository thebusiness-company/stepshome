import type { Metadata } from 'next';
import DonateContent from './DonateContent';

export const metadata: Metadata = {
  title: 'Donate — Support Our Girls',
  description:
    'Your donation directly impacts the lives of girls at STEPS Home, providing education, shelter, healthcare, and a loving home. All donations are tax-exempt under Section 80G.',
  openGraph: {
    title: 'Donate | STEPS Home',
    description:
      'Support education, shelter, and healthcare for girls rescued from abuse and abandonment.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Donate to STEPS Home' }],
  },
  alternates: {
    canonical: '/donate',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'DonateAction',
  name: 'Donate to STEPS Home',
  description:
    'Your contribution directly impacts the lives of girls at STEPS Home, providing them with education, shelter, and a loving home.',
  recipient: {
    '@type': 'NGO',
    name: 'STEPS Home',
    url: 'https://stepshome.org',
  },
  actionStatus: 'https://schema.org/PotentialActionStatus',
};

export default function DonatePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DonateContent />
    </>
  );
}
