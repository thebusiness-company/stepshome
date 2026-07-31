import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { donationSchema, formatZodErrors } from '@/lib/schemas';
import { checkFormLimit, getClientIP } from '@/lib/rate-limit';

/**
 * POST /api/donate
 *
 * Public donation request endpoint.
 * - Rate limited
 * - Zod validated
 * - Creates a pending donation record
 */
export async function POST(request: NextRequest) {
  try {
    // ---------------------------------------------------------
    // Rate limiting
    // ---------------------------------------------------------
    const ip = getClientIP(request);
    const limit = checkFormLimit(ip);

    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: `Too many requests. Try again in ${Math.ceil(
            limit.retryAfterMs / 1000
          )}s.`,
        },
        { status: 429 }
      );
    }

    // ---------------------------------------------------------
    // Parse request body
    // ---------------------------------------------------------
    const raw = await request.json();

    // ---------------------------------------------------------
    // Validate request
    // ---------------------------------------------------------
    const result = donationSchema.safeParse(raw);

    if (!result.success) {
      return NextResponse.json(
        {
          error: formatZodErrors(result.error),
        },
        { status: 400 }
      );
    }

    const body = result.data;

    // ---------------------------------------------------------
    // Generate donation reference
    // ---------------------------------------------------------
    const reference = `DON-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;

    // ---------------------------------------------------------
    // Create donation
    // ---------------------------------------------------------
    const donation = await prisma.donation.create({
      data: {
        amount: body.amount,
        currency: body.currency,
        frequency:
          body.frequency === 'monthly' ? 'MONTHLY' : 'ONE_TIME',
        designation: body.designation,
        reference,
      },
    });

    // ---------------------------------------------------------
    // Return response
    // ---------------------------------------------------------
    return NextResponse.json(
      {
        success: true,
        message: 'Donation request received.',
        donation: {
          id: donation.id,
          amount: Number(donation.amount),
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

    return NextResponse.json(
      {
        error: 'An unexpected error occurred.',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/donate
 *
 * Admin-only endpoint.
 * Access should be protected by middleware/authentication.
 *
 * Returns:
 * - Latest 100 donations
 * - Total donation count
 * - Total donation amount
 */
export async function GET() {
  try {
    // ---------------------------------------------------------
    // Fetch latest donations
    // ---------------------------------------------------------
    const donations = await prisma.donation.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });

    // ---------------------------------------------------------
    // Calculate donation totals
    // ---------------------------------------------------------
    const totals = await prisma.donation.aggregate({
      _sum: {
        amount: true,
      },
      _count: true,
    });

    // ---------------------------------------------------------
    // Convert Prisma Decimal to JSON-safe number
    // ---------------------------------------------------------
    const formattedDonations = donations.map((donation) => ({
      ...donation,
      amount: Number(donation.amount),
    }));

    // ---------------------------------------------------------
    // Return response
    // ---------------------------------------------------------
    return NextResponse.json({
      success: true,
      data: formattedDonations,
      summary: {
        totalDonations: totals._count,
        totalAmount: Number(totals._sum.amount || 0),
      },
    });
  } catch (error) {
    console.error('[Donate API] GET Error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch donations.',
      },
      { status: 500 }
    );
  }
}