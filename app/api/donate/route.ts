import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { donationSchema, formatZodErrors } from '@/lib/schemas';
import { checkFormLimit, getClientIP } from '@/lib/rate-limit';

/** Public — rate-limited, Zod-validated */
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    const limit = checkFormLimit(ip);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: `Too many requests. Try again in ${Math.ceil(limit.retryAfterMs / 1000)}s.` },
        { status: 429 }
      );
    }

    const raw = await request.json();
    const result = donationSchema.safeParse(raw);
    if (!result.success) {
      return NextResponse.json({ error: formatZodErrors(result.error) }, { status: 400 });
    }

    const body = result.data;
    const reference = `DON-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const donation = await prisma.donation.create({
      data: {
        amount: body.amount,
        currency: body.currency,
        frequency: body.frequency === 'monthly' ? 'MONTHLY' : 'ONE_TIME',
        designation: body.designation,
        reference,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Donation request received.',
        donation: {
          id: donation.id,
          amount: donation.amount,
          currency: donation.currency,
          frequency: donation.frequency,
          designation: donation.designation,
          reference: donation.reference,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Donate API] Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}

/** Admin-only — protected by middleware */
export async function GET() {
  try {
    const donations = await prisma.donation.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
    const totals = await prisma.donation.aggregate({ _sum: { amount: true }, _count: true });
    
    const formattedDonations = donations.map(d => ({
      ...d,
      amount: Number(d.amount),
    }));

    return NextResponse.json({
      success: true,
      data: formattedDonations,
      summary: { totalDonations: totals._count, totalAmount: Number(totals._sum.amount || 0) },
    });
  } catch (error) {
    console.error('[Donate API] GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch donations.' }, { status: 500 });
  }
}
