import { NextRequest, NextResponse } from 'next/server';
import {
  checkUploadLimit,
  getClientIP,
} from '@/lib/rate-limit';
import {
  isR2Configured,
  uploadToR2,
} from '@/lib/r2';

export const runtime = 'nodejs';

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

export async function POST(request: NextRequest) {
  try {
    // -----------------------------------------
    // Rate limiting
    // -----------------------------------------

    const ip = getClientIP(request);
    const limit = checkUploadLimit(ip);

    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: `Upload limit reached. Try again in ${Math.ceil(
            limit.retryAfterMs / 1000
          )}s.`,
        },
        { status: 429 }
      );
    }

    // -----------------------------------------
    // R2 configuration check
    // -----------------------------------------

    if (!isR2Configured()) {
      console.error(
        '[Upload API] R2 configuration is incomplete'
      );

      return NextResponse.json(
        {
          error:
            'Cloudflare R2 storage is not configured correctly.',
        },
        { status: 503 }
      );
    }

    // -----------------------------------------
    // Parse form
    // -----------------------------------------

    const formData = await request.formData();

    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: 'No image file provided.',
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // Validate file type
    // -----------------------------------------

    const ext = ALLOWED_TYPES[file.type];

    if (!ext) {
      return NextResponse.json(
        {
          error: `Invalid file type "${file.type}". Allowed: JPEG, PNG, WebP, GIF.`,
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // Validate file size
    // -----------------------------------------

    if (file.size === 0) {
      return NextResponse.json(
        {
          error: 'The uploaded file is empty.',
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: 'File too large. Maximum size is 4MB.',
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // Generate safe filename
    // -----------------------------------------

    const filename =
      `gallery-${crypto.randomUUID()}.${ext}`;

    // -----------------------------------------
    // Convert File → Buffer
    // -----------------------------------------

    const buffer = Buffer.from(
      await file.arrayBuffer()
    );

    // -----------------------------------------
    // Upload to Cloudflare R2
    // -----------------------------------------

    console.log(
      `[Upload API] Uploading ${filename} (${file.size} bytes)`
    );

    const result = await uploadToR2({
      buffer,
      filename,
      mimeType: file.type,
    });

    // -----------------------------------------
    // R2 failure
    // -----------------------------------------

    if (!result.success || !result.url) {
      console.error(
        '[Upload API] R2 upload failed:',
        result.error
      );

      return NextResponse.json(
        {
          error: 'Cloudflare R2 upload failed.',
          details:
            process.env.NODE_ENV === 'development'
              ? result.error
              : undefined,
        },
        { status: 502 }
      );
    }

    // -----------------------------------------
    // Success
    // -----------------------------------------

    console.log(
      `[Upload API] R2 upload successful: ${result.url}`
    );

    return NextResponse.json({
      success: true,
      url: result.url,
      filename,
      provider: 'r2',
    });

  } catch (error) {
    console.error(
      '[Upload API] Unexpected error:',
      error
    );

    return NextResponse.json(
      {
        error: 'Upload failed.',
      },
      { status: 500 }
    );
  }
}