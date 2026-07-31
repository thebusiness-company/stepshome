import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { galleryUpdateSchema, formatZodErrors } from '@/lib/schemas';

/** Admin-only — protected by middleware */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const raw = await request.json();
    const result = galleryUpdateSchema.safeParse(raw);
    if (!result.success) {
      return NextResponse.json({ error: formatZodErrors(result.error) }, { status: 400 });
    }

    const body = result.data;
    const image = await prisma.galleryImage.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.alt !== undefined && { alt: body.alt }),
        ...(body.url !== undefined && { url: body.url }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
      },
    });

    return NextResponse.json({ success: true, data: image });
  } catch (error) {
    console.error('[Gallery API] PUT Error:', error);
    return NextResponse.json({ error: 'Failed to update gallery image.' }, { status: 500 });
  }
}

/** Admin-only — protected by middleware */
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.galleryImage.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Image deleted.' });
  } catch (error) {
    console.error('[Gallery API] DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete gallery image.' }, { status: 500 });
  }
}
