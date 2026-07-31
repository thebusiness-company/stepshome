import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { contactSchema, contactStatusSchema, formatZodErrors } from '@/lib/schemas';
import { checkFormLimit, getClientIP } from '@/lib/rate-limit';

/** Public — rate-limited, Zod-validated */
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    const limit = checkFormLimit(ip);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: `Too many submissions. Try again in ${Math.ceil(limit.retryAfterMs / 1000)}s.` },
        { status: 429 }
      );
    }

    const raw = await request.json();
    const result = contactSchema.safeParse(raw);
    if (!result.success) {
      return NextResponse.json({ error: formatZodErrors(result.error) }, { status: 400 });
    }

    const body = result.data;
    const contact = await prisma.contact.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone || null,
        helpType: body.helpType,
        message: body.message || null,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Thank you! We will get back to you shortly.', id: contact.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Contact API] Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}

/** Admin-only — protected by middleware */
export async function PUT(request: NextRequest) {
  try {
    const raw = await request.json();
    const result = contactStatusSchema.safeParse(raw);
    if (!result.success) {
      return NextResponse.json({ error: formatZodErrors(result.error) }, { status: 400 });
    }

    const contact = await prisma.contact.update({
      where: { id: result.data.id },
      data: { status: result.data.status },
    });
    return NextResponse.json({ success: true, data: contact });
  } catch (error) {
    console.error('[Contact API] PUT Error:', error);
    return NextResponse.json({ error: 'Failed to update contact.' }, { status: 500 });
  }
}

/** Admin-only — protected by middleware */
export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
    return NextResponse.json({ success: true, data: contacts });
  } catch (error) {
    console.error('[Contact API] GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch contacts.' }, { status: 500 });
  }
}
