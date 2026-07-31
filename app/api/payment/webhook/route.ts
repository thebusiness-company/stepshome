import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyWebhookSignature } from '@/lib/razorpay';

/**
 * Razorpay Webhook Handler
 *
 * Razorpay sends events like payment.captured, payment.failed etc.
 * This is the FINAL authority on payment status — more reliable than
 * the frontend verify flow (handles browser close, network issues, etc.)
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature.' }, { status: 400 });
    }

    // Verify webhook signature
    if (!verifyWebhookSignature(rawBody, signature)) {
      console.error('[Webhook] Signature verification failed');
      return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const eventType: string = event.event;
    const payment = event.payload?.payment?.entity;

    if (!payment) {
      // Not a payment event — acknowledge and ignore
      return NextResponse.json({ received: true });
    }

    const orderId: string = payment.order_id;
    const paymentId: string = payment.id;

    // Find donation by Razorpay order ID
    const donation = await prisma.donation.findFirst({
      where: { razorpayOrderId: orderId },
    });

    if (!donation) {
      console.warn(`[Webhook] No donation found for order: ${orderId}`);
      return NextResponse.json({ received: true });
    }

    // Idempotency: skip if already in terminal state
    if (donation.status === 'COMPLETED' || donation.status === 'FAILED') {
      return NextResponse.json({ received: true, status: 'already_processed' });
    }

    // Handle event types
    switch (eventType) {
      case 'payment.captured':
      case 'payment.authorized': {
        await prisma.donation.update({
          where: { id: donation.id },
          data: {
            status: 'COMPLETED',
            paymentId,
            donorEmail: payment.email || null,
            donorPhone: payment.contact || null,
          },
        });
        console.log(`[Webhook] Payment COMPLETED: ${donation.reference}`);
        break;
      }

      case 'payment.failed': {
        await prisma.donation.update({
          where: { id: donation.id },
          data: {
            status: 'FAILED',
            paymentId,
          },
        });
        console.log(`[Webhook] Payment FAILED: ${donation.reference}`);
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Webhook] Error:', error);
    // Return 200 to prevent Razorpay from retrying on our errors
    return NextResponse.json({ received: true, error: 'Internal processing error' });
  }
}
