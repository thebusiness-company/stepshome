import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getRazorpay } from '@/lib/razorpay';
import { donationSchema, formatZodErrors } from '@/lib/schemas';
import { checkFormLimit, getClientIP } from '@/lib/rate-limit';

/** Public POST — creates Razorpay order + pending donation */
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

    const { amount, frequency, designation, currency, donorName, donorEmail, donorPhone } = result.data;
    const reference = `DON-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Create Razorpay order (amount in paise)
    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: currency || 'INR',
      receipt: reference,
      notes: { designation, frequency, donorName: donorName || '' },
    });

    // Save pending donation in DB
    await prisma.donation.create({
      data: {
        amount,
        currency: currency || 'INR',
        frequency: frequency === 'monthly' ? 'MONTHLY' : 'ONE_TIME',
        designation,
        reference,
        razorpayOrderId: order.id,
        status: 'PENDING',
        donorName: donorName || null,
        donorEmail: donorEmail || null,
        donorPhone: donorPhone || null,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      reference,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('[Payment Create] Error:', error);
    return NextResponse.json({ error: 'Failed to create payment order.' }, { status: 500 });
  }
}
