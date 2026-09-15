import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { UploadContentType, UploadFolder, UploadTarget } from '@repo/contracts';

/** Seconds a presigned upload URL stays valid. */
const UPLOAD_URL_TTL_SECONDS = 300;

/** File extension per accepted content type, used to build the object key. */
const EXTENSION_BY_CONTENT_TYPE: Record<UploadContentType, string> = {
  'image/svg+xml': 'svg',
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
};

/**
 * Cloudflare R2 (S3-compatible) storage access. Builds the S3 client lazily so
 * the app boots without R2 credentials — only media operations require them.
 */
@Injectable()
export class StorageService {
  private client?: S3Client;

  constructor(private readonly config: ConfigService) {}

  private getClient(): S3Client {
    if (!this.client) {
      const accountId = this.config.getOrThrow<string>('R2_ACCOUNT_ID');
      this.client = new S3Client({
        region: 'auto',
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: this.config.getOrThrow<string>('R2_ACCESS_KEY_ID'),
          secretAccessKey: this.config.getOrThrow<string>('R2_SECRET_ACCESS_KEY'),
        },
      });
    }

    return this.client;
  }

  /**
   * Mints a short-lived presigned PUT URL. The client uploads the file directly
   * to R2 with `uploadUrl`; afterwards it is readable at `publicUrl`.
   */
  async createPresignedUpload(
    folder: UploadFolder,
    contentType: UploadContentType,
  ): Promise<UploadTarget> {
    const bucket = this.config.getOrThrow<string>('R2_BUCKET');
    const publicBaseUrl = this.config.getOrThrow<string>('R2_PUBLIC_BASE_URL');
    const key = `${folder}/${randomUUID()}.${EXTENSION_BY_CONTENT_TYPE[contentType]}`;

    const uploadUrl = await getSignedUrl(
      this.getClient(),
      new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }),
      { expiresIn: UPLOAD_URL_TTL_SECONDS },
    );

    return {
      uploadUrl,
      key,
      publicUrl: `${publicBaseUrl.replace(/\/$/, '')}/${key}`,
    };
  }
}
