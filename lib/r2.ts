import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

/**
 * Checks if Cloudflare R2 credentials and bucket details are configured in environment.
 */
export function isR2Configured(): boolean {
  return !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME
  );
}

/**
 * Creates and returns an S3Client instance configured for Cloudflare R2.
 */
function getR2Client(): S3Client {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error('[R2 Storage] Missing Cloudflare R2 credentials in environment variables.');
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export interface R2UploadParams {
  buffer: Buffer;
  filename: string;
  mimeType: string;
}

export interface R2UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

/**
 * Uploads a file buffer directly to Cloudflare R2 object storage.
 *
 * @returns R2UploadResult with public URL of the uploaded image
 */
export async function uploadToR2({
  buffer,
  filename,
  mimeType,
}: R2UploadParams): Promise<R2UploadResult> {
  try {
    const bucketName = process.env.R2_BUCKET_NAME;
    let publicDomain = process.env.R2_PUBLIC_DOMAIN || '';

    if (!bucketName) {
      return { success: false, error: 'R2_BUCKET_NAME environment variable is missing.' };
    }

    // Clean public domain trailing slash if present
    publicDomain = publicDomain.replace(/\/+$/, '');

    const client = getR2Client();
    const key = `uploads/${filename}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      // Cloudflare R2 caching headers
      CacheControl: 'public, max-age=31536000, immutable',
    });

    await client.send(command);

    // Form public URL (or R2 dev domain)
    const publicUrl = publicDomain
      ? `${publicDomain}/${key}`
      : `https://${bucketName}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`;

    console.log(`[R2 Storage] File successfully uploaded to R2: ${key}`);

    return {
      success: true,
      url: publicUrl,
      key,
    };
  } catch (error: any) {
    console.error('[R2 Storage] Error uploading file to R2:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload image to Cloudflare R2.',
    };
  }
}
