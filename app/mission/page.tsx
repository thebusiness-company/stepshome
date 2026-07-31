import type { Metadata } from 'next';
import MissionContent from './MissionContent';

export const metadata: Metadata = {
  title: 'Our Mission',
  description:
    'Learn about STEPS Home\'s mission to find, foster, and free girls from abuse, abortion, and abandonment. Discover our 20-year journey of faith, hope, and transformation in Chennai, India.',
  openGraph: {
    title: 'Our Mission | STEPS Home',
    description:
      'STEPS aims to find, foster and free girls from Abuse, Abortion and Abandonment. Our Mission is to empower girls to become confident, compassionate and contributing members of society.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'STEPS Home Mission' }],
  },
  alternates: {
    canonical: '/mission',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'Our Mission — STEPS Home',
  description:
    'STEPS Home\'s mission to find, foster, and free girls from abuse, abortion, and abandonment since 2006.',
  mainEntity: {
    '@type': 'NGO',
    name: 'STEPS Home',
    foundingDate: '2006',
    mission: 'To empower girls to become confident, compassionate and contributing members of Society.',
  },
};

export default function MissionPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MissionContent />
    </>
  );
}
