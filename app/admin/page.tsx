import type { Metadata } from 'next';
import AdminDashboard from './AdminDashboard';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin Dashboard — STEPS Home',
  description: 'Manage contacts, donations, newsletter subscribers, and gallery images.',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
