import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPaymentSignature } from '@/lib/razorpay';
import { z } from 'zod';

const verifySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

/** Public POST — verify payment after Razorpay checkout success */
export async function POST(request: NextRequest) {
  try {
    const raw = await request.json();
    const result = verifySchema.safeParse(raw);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid payment data.' }, { status: 400 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = result.data;

    // Cryptographic verification — NEVER trust frontend alone
    const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!isValid) {
      console.error('[Payment Verify] Signature mismatch:', razorpay_order_id);
      return NextResponse.json({ error: 'Payment verification failed. Signature invalid.' }, { status: 400 });
    }

    // Find donation by Razorpay order ID
    const donation = await prisma.donation.findFirst({
      where: { razorpayOrderId: razorpay_order_id },
    });

    if (!donation) {
      return NextResponse.json({ error: 'Donation record not found.' }, { status: 404 });
    }

    // Idempotency: if already completed, return success
    if (donation.status === 'COMPLETED') {
      return NextResponse.json({
        success: true,
        message: 'Payment already verified.',
        reference: donation.reference,
      });
    }

    // Update donation status
    const updated = await prisma.donation.update({
      where: { id: donation.id },
      data: {
        status: 'COMPLETED',
        paymentId: razorpay_payment_id,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully.',
      reference: updated.reference,
    });
  } catch (error) {
    console.error('[Payment Verify] Error:', error);
    return NextResponse.json({ error: 'Payment verification failed.' }, { status: 500 });
  }
}
