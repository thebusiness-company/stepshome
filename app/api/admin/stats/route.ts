import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/** Admin-only — protected by middleware */
export async function GET() {
  try {
    const [totalContacts, totalDonations, donationSum, totalSubscribers, totalGalleryImages, totalGirls] =
      await Promise.all([
        prisma.contact.count(),
        prisma.donation.count({ where: { status: 'COMPLETED' } }),
        prisma.donation.aggregate({
          where: { status: 'COMPLETED' },
          _sum: { amount: true },
        }),
        prisma.newsletter.count({ where: { isActive: true } }),
        prisma.galleryImage.count(),
        prisma.girl.count(),
      ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalContacts,
        totalDonations,
        totalDonationAmount: Number(donationSum._sum.amount || 0),
        totalSubscribers,
        totalGalleryImages,
        totalGirls,
      },
    });
  } catch (error) {
    console.error('[Admin Stats] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats.' }, { status: 500 });
  }
}
