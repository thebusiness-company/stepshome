import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { galleryCreateSchema, formatZodErrors } from '@/lib/schemas';

/** Public GET — gallery listing for mission page */
export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json({ success: true, data: images });
  } catch (error) {
    console.error('[Gallery API] GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery.' }, { status: 500 });
  }
}

/** Admin-only — protected by middleware */
export async function POST(request: NextRequest) {
  try {
    const raw = await request.json();
    const result = galleryCreateSchema.safeParse(raw);
    if (!result.success) {
      return NextResponse.json({ error: formatZodErrors(result.error) }, { status: 400 });
    }

    const body = result.data;
    const image = await prisma.galleryImage.create({
      data: {
        title: body.title,
        alt: body.alt || body.title,
        url: body.url,
        category: body.category,
      },
    });

    return NextResponse.json({ success: true, data: image }, { status: 201 });
  } catch (error) {
    console.error('[Gallery API] POST Error:', error);
    return NextResponse.json({ error: 'Failed to create image.' }, { status: 500 });
  }
}
