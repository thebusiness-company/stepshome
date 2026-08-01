import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { newsletterSchema, formatZodErrors } from '@/lib/schemas';
import { checkNewsletterLimit, getClientIP } from '@/lib/rate-limit';
import { addOrUpdateBrevoContact } from '@/lib/brevo';

/**
 * POST /api/newsletter
 *
 * Public Newsletter Subscription Endpoint.
 * Integrates Brevo REST API with server-side validation, rate limiting,
 * bot protection (honeypot), duplicate prevention, and Prisma persistence.
 */
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);

    // -----------------------------------------------------------------
    // 1. Parse JSON body
    // -----------------------------------------------------------------
    let raw: unknown;
    try {
      raw = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request format.',
        },
        { status: 400 }
      );
    }

    // -----------------------------------------------------------------
    // 2. Validate input schema with Zod
    // -----------------------------------------------------------------
    const validation = newsletterSchema.safeParse(raw);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: formatZodErrors(validation.error) || 'Please enter a valid email address.',
        },
        { status: 400 }
      );
    }

    const { name, email, phone, website } = validation.data;

    // -----------------------------------------------------------------
    // 3. Honeypot Bot Protection
    // -----------------------------------------------------------------
    if (website && website.trim() !== '') {
      console.warn(`[Newsletter API] Honeypot triggered by IP ${ip}. Silently rejecting.`);
      return NextResponse.json({
        success: true,
        message: "You're subscribed successfully.",
      });
    }

    // -----------------------------------------------------------------
    // 4. Rate Limiting (IP + Email)
    // -----------------------------------------------------------------
    const rateLimit = checkNewsletterLimit(ip, email);
    if (!rateLimit.allowed) {
      console.warn(`[Newsletter API] Rate limited attempt from IP ${ip} for email.`);
      return NextResponse.json(
        {
          success: false,
          message: 'Too many requests. Please try again later.',
        },
        { status: 429 }
      );
    }

    console.log(`[Newsletter API] newsletter_subscription_attempt for IP=${ip}`);

    // -----------------------------------------------------------------
    // 5. Brevo Contact Subscription Call
    // -----------------------------------------------------------------
    const brevoResult = await addOrUpdateBrevoContact({ name, email, phone });

    if (!brevoResult.success) {
      console.error('[Newsletter API] newsletter_brevo_error:', brevoResult.error);
      return NextResponse.json(
        {
          success: false,
          message: 'Unable to subscribe right now. Please try again later.',
        },
        { status: 502 }
      );
    }

    // Handle Duplicate Subscription
    if (brevoResult.isDuplicate) {
      console.log('[Newsletter API] newsletter_subscription_duplicate');
      
      // Update Prisma database to reflect duplicate subscriber status if record exists
      try {
        await prisma.newsletter.upsert({
          where: { email },
          update: {
            name: name || undefined,
            phone: phone || undefined,
            isActive: true,
            status: 'SUBSCRIBED',
            brevoContactId: brevoResult.contactId || undefined,
          },
          create: {
            email,
            name: name || null,
            phone: phone || null,
            status: 'SUBSCRIBED',
            brevoContactId: brevoResult.contactId || null,
            isActive: true,
          },
        });
      } catch (dbErr) {
        console.error('[Newsletter API] newsletter_database_error on duplicate upsert:', dbErr);
      }

      return NextResponse.json({
        success: true,
        message: 'This email is already subscribed.',
      });
    }

    // -----------------------------------------------------------------
    // 6. Prisma Database Persistence (Local Audit/Reference Record)
    // -----------------------------------------------------------------
    const subscriberStatus = brevoResult.isDoubleOptIn ? 'PENDING' : 'SUBSCRIBED';

    try {
      await prisma.newsletter.upsert({
        where: { email },
        update: {
          name: name || undefined,
          phone: phone || undefined,
          isActive: true,
          status: subscriberStatus,
          brevoContactId: brevoResult.contactId || undefined,
          confirmedAt: brevoResult.isDoubleOptIn ? undefined : new Date(),
        },
        create: {
          email,
          name: name || null,
          phone: phone || null,
          status: subscriberStatus,
          brevoContactId: brevoResult.contactId || null,
          isActive: true,
          confirmedAt: brevoResult.isDoubleOptIn ? undefined : new Date(),
        },
      });
      console.log('[Newsletter API] newsletter_subscription_success DB updated');
    } catch (dbErr) {
      // Log DB failure without failing the overall user subscription since Brevo succeeded
      console.error('[Newsletter API] newsletter_database_error:', dbErr);
    }

    // -----------------------------------------------------------------
    // 7. Safe JSON Success Response
    // -----------------------------------------------------------------
    const successMessage = brevoResult.isDoubleOptIn
      ? "You're almost subscribed! Please check your email to confirm your subscription."
      : "You're subscribed successfully.";

    return NextResponse.json(
      {
        success: true,
        message: successMessage,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Newsletter API] Unexpected Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Unable to subscribe right now. Please try again later.',
      },
      { status: 500 }
    );
  }
}

/** Admin-only GET — Fetch subscribers */
export async function GET() {
  try {
    const subscribers = await prisma.newsletter.findMany({
      where: { isActive: true },
      orderBy: { subscribedAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: subscribers, total: subscribers.length });
  } catch (error) {
    console.error('[Newsletter API] GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch subscribers.' }, { status: 500 });
  }
}

/** Admin-only PUT — Toggle active status */
export async function PUT(request: NextRequest) {
  try {
    const raw = await request.json();
    const { email, isActive } = raw;
    if (!email || typeof isActive !== 'boolean') {
      return NextResponse.json({ error: 'Email and isActive boolean are required.' }, { status: 400 });
    }

    const subscriber = await prisma.newsletter.update({
      where: { email },
      data: {
        isActive,
        status: isActive ? 'SUBSCRIBED' : 'UNSUBSCRIBED',
        unsubscribedAt: isActive ? null : new Date(),
      },
    });
    return NextResponse.json({ success: true, data: subscriber });
  } catch (error) {
    console.error('[Newsletter API] PUT Error:', error);
    return NextResponse.json({ error: 'Failed to update subscriber.' }, { status: 500 });
  }
}
