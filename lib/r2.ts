import {
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

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

export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME &&
    process.env.R2_PUBLIC_DOMAIN
  );
}

function getR2Client(): S3Client {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId =
    process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey =
    process.env.R2_SECRET_ACCESS_KEY;

  if (
    !accountId ||
    !accessKeyId ||
    !secretAccessKey
  ) {
    throw new Error(
      'Missing R2 credentials.'
    );
  }

  return new S3Client({
    region: 'auto',
    endpoint:
      `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export async function uploadToR2({
  buffer,
  filename,
  mimeType,
}: R2UploadParams): Promise<R2UploadResult> {
  try {
    const bucketName =
      process.env.R2_BUCKET_NAME;

    const publicDomain =
      process.env.R2_PUBLIC_DOMAIN?.replace(
        /\/+$/,
        ''
      );

    if (!bucketName) {
      throw new Error(
        'R2_BUCKET_NAME is missing.'
      );
    }

    if (!publicDomain) {
      throw new Error(
        'R2_PUBLIC_DOMAIN is missing.'
      );
    }

    const client = getR2Client();

    const key = `gallery/${filename}`;

    await client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
        CacheControl:
          'public, max-age=31536000, immutable',
      })
    );

    const url =
      `${publicDomain}/${key}`;

    console.log(
      `[R2 Storage] Upload successful: ${key}`
    );

    return {
      success: true,
      url,
      key,
    };

  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : String(error);

    console.error(
      '[R2 Storage] Upload failed:',
      message
    );

    return {
      success: false,
      error: message,
    };
  }
}