import type { Metadata } from 'next';
import JoinContent from './JoinContent';

export const metadata: Metadata = {
  title: 'Get Involved — Volunteer, Intern & Partner',
  description:
    'Join STEPS Home as a volunteer, intern, or corporate partner. Make a difference in the lives of girls rescued from abuse and abandonment in Chennai, India. Sign up today!',
  openGraph: {
    title: 'Get Involved | STEPS Home',
    description:
      'Whether you want to volunteer your time, partner with us, or join our team, there are many ways to make a difference at STEPS Home.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Join STEPS Home' }],
  },
  alternates: {
    canonical: '/join',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Get Involved — STEPS Home',
  description: 'Volunteer, intern, or partner with STEPS Home to help empower girls.',
  mainEntity: {
    '@type': 'VolunteerAction',
    name: 'Volunteer at STEPS Home',
    description: 'Spend time with our girls, teach a skill, or help with daily activities.',
    agent: {
      '@type': 'NGO',
      name: 'STEPS Home',
    },
  },
};

export default function JoinPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JoinContent />
    </>
  );
}
