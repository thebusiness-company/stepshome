import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { girlUpdateSchema, formatZodErrors } from '@/lib/schemas';

/** Admin-only PUT — update details of a specific girl (protected by middleware) */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const raw = await request.json();
    const result = girlUpdateSchema.safeParse(raw);
    if (!result.success) {
      return NextResponse.json({ error: formatZodErrors(result.error) }, { status: 400 });
    }

    const body = result.data;
    const updated = await prisma.girl.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.age !== undefined && { age: body.age }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.img !== undefined && { img: body.img }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
      }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('[Girls ID API] PUT Error:', error);
    return NextResponse.json({ error: 'Failed to update girl profile.' }, { status: 500 });
  }
}

/** Admin-only DELETE — deletes a specific girl profile (protected by middleware) */
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.girl.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Girl profile deleted.' });
  } catch (error) {
    console.error('[Girls ID API] DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete girl profile.' }, { status: 500 });
  }
}
