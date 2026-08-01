import type { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import VisionMission from '@/components/home/VisionMission';
import FounderMessage from '@/components/home/FounderMessage';
import ImpactStats from '@/components/home/ImpactStats';
import InstagramSection from '@/components/home/InstagramSection';
import Supporters from '@/components/home/Supporters';
import Timeline from '@/components/home/Timeline';
import StoriesCarousel from '@/components/home/StoriesCarousel';
import NewsletterForm from '@/components/newsletter/NewsletterForm';
import DonationBanner from '@/components/home/DonationBanner';

export const metadata: Metadata = {
  title: 'STEPS Home — Changing Lives, One Child at a Time',
  description:
    'STEPS Home rescues and empowers girls from abuse, abandonment, and trafficking. Join us in creating a brighter future through education, love, and community support in Chennai, India.',
  alternates: {
    canonical: '/',
  },
};

// JSON-LD structured data for the organization
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'NGO',
  name: 'STEPS Home',
  description:
    'STEPS Home is a charitable organization providing a safe haven, quality education, and endless love for girls rescued from abuse, abandonment, and trafficking.',
  url: 'https://stepshome.org',
  logo: 'https://stepshome.org/logo.png',
  foundingDate: '2006',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'No:6, Kandigai Road, TVS Nagar, Korathur North',
    addressLocality: 'Chennai',
    postalCode: '600076',
    addressCountry: 'IN',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-98840-26250',
    email: 'isactara@gmail.com',
    contactType: 'customer service',
  },
  sameAs: [],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col min-h-screen relative">
        <Hero />
        <VisionMission />
        <FounderMessage />
        <ImpactStats />
        <InstagramSection />
        <Supporters />
        <Timeline />
        <StoriesCarousel />
        <NewsletterForm />
        <DonationBanner />
      </div>
    </>
  );
}

