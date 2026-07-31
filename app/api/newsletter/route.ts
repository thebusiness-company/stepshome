import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { newsletterSchema, formatZodErrors } from '@/lib/schemas';
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
    const result = newsletterSchema.safeParse(raw);
    if (!result.success) {
      return NextResponse.json({ error: formatZodErrors(result.error) }, { status: 400 });
    }

    const { email, name } = result.data;
    const existing = await prisma.newsletter.findUnique({ where: { email } });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json({ success: true, message: 'You are already subscribed!' });
      }
      await prisma.newsletter.update({ where: { email }, data: { isActive: true } });
      return NextResponse.json({ success: true, message: 'Welcome back! Subscription reactivated.' });
    }

    await prisma.newsletter.create({ data: { email, name: name || null } });
    return NextResponse.json({ success: true, message: 'Thank you for subscribing!' }, { status: 201 });
  } catch (error) {
    console.error('[Newsletter API] Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}

/** Admin-only — protected by middleware */
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

/** Admin-only — protected by middleware */
export async function PUT(request: NextRequest) {
  try {
    const raw = await request.json();
    const { email, isActive } = raw;
    if (!email || typeof isActive !== 'boolean') {
      return NextResponse.json({ error: 'Email and isActive boolean are required.' }, { status: 400 });
    }

    const subscriber = await prisma.newsletter.update({
      where: { email },
      data: { isActive },
    });
    return NextResponse.json({ success: true, data: subscriber });
  } catch (error) {
    console.error('[Newsletter API] PUT Error:', error);
    return NextResponse.json({ error: 'Failed to update subscriber.' }, { status: 500 });
  }
}
