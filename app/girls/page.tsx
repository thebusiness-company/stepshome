import type { Metadata } from 'next';
import GirlsContent from './GirlsContent';

export const metadata: Metadata = {
  title: 'Meet Our Girls — STEPS Home',
  description: 'Meet the girls who call Steps Home their family. Learn about their dreams of becoming dentists, chefs, engineers, and teachers.',
  openGraph: {
    title: 'Meet Our Girls — STEPS Home',
    description: 'Meet the girls who call Steps Home their family. Learn about their dreams of becoming dentists, chefs, engineers, and teachers.',
    type: 'website',
  },
};

export default function GirlsPage() {
  return <GirlsContent />;
}
