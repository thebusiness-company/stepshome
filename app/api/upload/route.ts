import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { checkUploadLimit, getClientIP } from '@/lib/rate-limit';

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  // SVG intentionally excluded — XSS vector
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/** Admin-only — protected by middleware + rate limited */
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    const limit = checkUploadLimit(ip);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: `Upload limit reached. Try again in ${Math.ceil(limit.retryAfterMs / 1000)}s.` },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    // Validate MIME type (NOT extension)
    const ext = ALLOWED_TYPES[file.type];
    if (!ext) {
      return NextResponse.json(
        { error: `Invalid file type "${file.type}". Allowed: JPEG, PNG, WebP, GIF.` },
        { status: 400 }
      );
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large. Max 5MB.' }, { status: 400 });
    }

    // Generate safe filename (no user input in name)
    const filename = `gallery-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    // Write file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(path.join(uploadDir, filename), buffer);

    return NextResponse.json({ success: true, url: `/uploads/${filename}`, filename });
  } catch (error) {
    console.error('[Upload API] Error:', error);
    return NextResponse.json({ error: 'Upload failed.' }, { status: 500 });
  }
}
